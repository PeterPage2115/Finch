/**
 * Categories Page
 * 
 * Strona zarządzania kategoriami użytkownika
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Category, categoriesApi } from '@/lib/api/categoriesClient';
import CategoryForm, { CategoryFormData } from '@/components/categories/CategoryForm';
import CategoryList from '@/components/categories/CategoryList';
import { Plus, ArrowLeft } from 'lucide-react';

export default function CategoriesPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCategories();
  }, [token, router]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoriesApi.getAll(token!);
      setCategories(data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Błąd podczas pobierania kategorii');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (formData: CategoryFormData) => {
    try {
      const newCategory = await categoriesApi.create(token!, formData);
      setCategories([...categories, newCategory]);
      setShowForm(false);
    } catch (err: any) {
      throw new Error(err.message || 'Błąd podczas tworzenia kategorii');
    }
  };

  const handleUpdate = async (formData: CategoryFormData) => {
    if (!editingCategory) return;

    try {
      const updated = await categoriesApi.update(token!, editingCategory.id, formData);
      setCategories(categories.map((cat) => 
        cat.id === editingCategory.id ? updated : cat
      ));
      setEditingCategory(undefined);
      setShowForm(false);
    } catch (err: any) {
      throw new Error(err.message || 'Błąd podczas aktualizacji kategorii');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    setDeleteConfirm(category);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await categoriesApi.delete(token!, deleteConfirm.id);
      setCategories(categories.filter((cat) => cat.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.message || 'Błąd podczas usuwania kategorii');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  const handleAddNew = () => {
    setEditingCategory(undefined);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Kategorie
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Zarządzaj swoimi kategoriami finansowymi
                </p>
              </div>
            </div>
            
            {!showForm && (
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Plus className="w-5 h-5 mr-2" />
                Dodaj kategorię
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingCategory ? 'Edytuj kategorię' : 'Nowa kategoria'}
            </h2>
            <CategoryForm
              category={editingCategory}
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <CategoryList
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Potwierdzenie usunięcia
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Czy na pewno chcesz usunąć kategorię <strong>{deleteConfirm.name}</strong>?
              {' '}Ta operacja jest nieodwracalna.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                Anuluj
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
