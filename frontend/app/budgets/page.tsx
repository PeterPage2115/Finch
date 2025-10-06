'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { BudgetWithProgress, CreateBudgetRequest, Budget } from '@/types';
import { Category, categoriesApi } from '@/lib/api/categoriesClient';
import { 
  fetchBudgets, 
  fetchBudgetById, 
  createBudget, 
  updateBudget, 
  deleteBudget 
} from '@/lib/api/budgetsClient';
import BudgetForm from '@/components/budgets/BudgetForm';
import BudgetList from '@/components/budgets/BudgetList';
import AppNavbar from '@/components/layout/AppNavbar';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Budgets Page - manage user budgets
 */
export default function BudgetsPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  const [budgets, setBudgets] = useState<BudgetWithProgress[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetWithProgress | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<BudgetWithProgress | null>(null);

  // Wait for hydration before checking auth
  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch both budgets and categories
    Promise.all([
      fetchBudgetsData(),
      fetchCategoriesData(),
    ]);
  }, [token, hasHydrated, router]);

  const fetchBudgetsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchBudgets(token!);
      // Fetch full budget with progress for each
      const budgetsWithProgress = await Promise.all(
        data.map(async (budget) => {
          try {
            return await fetchBudgetById(token!, budget.id);
          } catch {
            // Fallback: return budget with empty progress
            return {
              ...budget,
              progress: {
                spent: 0,
                limit: Number(budget.amount),
                percentage: 0,
                remaining: Number(budget.amount),
                alerts: [],
              },
            } as BudgetWithProgress;
          }
        })
      );
      setBudgets(budgetsWithProgress);
    } catch (err: any) {
      console.error('Error fetching budgets:', err);
      setError(err.message || 'Błąd podczas pobierania budżetów');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const data = await categoriesApi.getAll(token!);
      setCategories(data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCreate = async (formData: CreateBudgetRequest) => {
    try {
      const newBudget = await createBudget(token!, formData);
      // Fetch updated budget with progress
      const budgetWithProgress = await fetchBudgetById(token!, newBudget.id);
      setBudgets([...budgets, budgetWithProgress]);
      setShowForm(false);
    } catch (err: any) {
      throw new Error(err.message || 'Błąd podczas tworzenia budżetu');
    }
  };

  const handleUpdate = async (formData: CreateBudgetRequest) => {
    if (!editingBudget) return;

    try {
      const updated = await updateBudget(token!, editingBudget.id, formData);
      // Fetch updated budget with progress
      const budgetWithProgress = await fetchBudgetById(token!, updated.id);
      setBudgets(budgets.map((b) => 
        b.id === editingBudget.id ? budgetWithProgress : b
      ));
      setEditingBudget(undefined);
      setShowForm(false);
    } catch (err: any) {
      throw new Error(err.message || 'Błąd podczas aktualizacji budżetu');
    }
  };

  const handleEdit = (budget: BudgetWithProgress) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteBudget(token!, deleteConfirm.id);
      setBudgets(budgets.filter((b) => b.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Error deleting budget:', err);
      setError(err.message || 'Błąd podczas usuwania budżetu');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBudget(undefined);
  };

  // Redirect if not authenticated
  if (!hasHydrated) {
    return null; // Wait for hydration
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <AppNavbar />

      <div className="max-w-7xl mx-auto mt-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budżety</h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingBudget(undefined);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Dodaj budżet
          </motion.button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg">
            <BudgetForm
              budget={editingBudget}
              categories={categories}
              onSubmit={editingBudget ? handleUpdate : handleCreate}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Budgets List */}
        <BudgetList
          budgets={budgets}
          onEdit={handleEdit}
          onDelete={(id) => {
            const budget = budgets.find((b) => b.id === id);
            if (budget) setDeleteConfirm(budget);
          }}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Potwierdź usunięcie
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Czy na pewno chcesz usunąć budżet dla kategorii <strong>{deleteConfirm.category?.name}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Usuń
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
