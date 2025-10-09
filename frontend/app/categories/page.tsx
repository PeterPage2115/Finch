/**
 * Categories Page
 * 
 * User category management page
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { Category, categoriesApi } from '@/lib/api/categoriesClient';
import CategoryForm, { CategoryFormData } from '@/components/categories/CategoryForm';
import CategoryList from '@/components/categories/CategoryList';
import AppNavbar from '@/components/layout/AppNavbar';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategoriesPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const { addNotification } = useNotificationStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

  const handleErrorMessage = useCallback((error: unknown, fallback: string) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return fallback;
  }, []);

  const fetchCategories = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await categoriesApi.getAll(token);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
  setError(handleErrorMessage(err, 'Error while fetching categories'));
    } finally {
      setIsLoading(false);
    }
  }, [handleErrorMessage, token]);

  // Wait for hydration before checking auth
  useEffect(() => {
    if (!hasHydrated) return;
    
    if (!token) {
      router.push('/login');
      return;
    }
    void fetchCategories();
  }, [fetchCategories, hasHydrated, router, token]);

  const handleCreate = async (formData: CategoryFormData) => {
    if (!token) {
  throw new Error('Missing authentication token');
    }

    try {
      const newCategory = await categoriesApi.create(token, formData);
      setCategories((prev) => [...prev, newCategory]);
      setShowForm(false);
  addNotification('Category created successfully', 'success');
    } catch (err) {
  throw new Error(handleErrorMessage(err, 'Error while creating the category'));
    }
  };

  const handleUpdate = async (formData: CategoryFormData) => {
    if (!editingCategory) return;
    if (!token) {
  throw new Error('Missing authentication token');
    }

    try {
      const updated = await categoriesApi.update(token, editingCategory.id, formData);
      setCategories((prev) => prev.map((cat) =>
        cat.id === editingCategory.id ? updated : cat
      ));
      setEditingCategory(undefined);
      setShowForm(false);
  addNotification('Category updated successfully', 'success');
    } catch (err) {
  throw new Error(handleErrorMessage(err, 'Error while updating the category'));
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category: Category) => {
    setDeleteConfirm(category);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    if (!token) {
  addNotification('Missing authentication token', 'error');
      return;
    }

    try {
      await categoriesApi.delete(token, deleteConfirm.id);
      setCategories((prev) => prev.filter((cat) => cat.id !== deleteConfirm.id));
      setDeleteConfirm(null);
  addNotification('Category deleted successfully', 'success');
    } catch (err) {
  addNotification(handleErrorMessage(err, 'Error while deleting the category'), 'error');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <AppNavbar />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Categories
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your financial categories
              </p>
            </div>
            
            {!showForm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add category
              </motion.button>
            )}
          </div>
        </div>
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
              {editingCategory ? 'Edit category' : 'New category'}
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
              Delete confirmation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete the <strong>{deleteConfirm.name}</strong> category?
              {' '}This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
