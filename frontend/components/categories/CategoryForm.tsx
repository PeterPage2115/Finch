/**
 * CategoryForm Component
 * 
 * Form for creating and editing categories
 */

'use client';

import { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Category } from '@/lib/api/categoriesClient';
import { TransactionType } from '@/types/transaction';
import { motion } from 'framer-motion';
import { IconPicker } from '@/components/ui/IconPicker';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CategoryFormProps {
  category?: Category; // undefined = create mode, defined = edit mode
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

export interface CategoryFormData {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export default function CategoryForm({
  category,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const isEditMode = !!category;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    type: category?.type || TransactionType.EXPENSE,
    color: category?.color || '#3B82F6',
    icon: category?.icon || 'Tag', // Default to 'Tag' icon instead of emoji
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = useCallback((err: unknown, fallback: string) => {
    if (err instanceof Error && err.message) {
      return err.message;
    }
    return fallback;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(getErrorMessage(err, 'Something went wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, color: event.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
  {isEditMode ? 'Edit category' : 'New category'}
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

  {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          minLength={2}
          maxLength={50}
          value={formData.name}
          onChange={handleNameChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          placeholder="e.g. Groceries"
          disabled={isSubmitting}
          autoFocus
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          2-50 characters
        </p>
      </div>

  {/* Type - only when creating */}
      {!isEditMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, type: TransactionType.EXPENSE })
              }
              className={`flex-1 py-2 px-4 rounded-md border-2 transition-colors flex items-center justify-center gap-2
                ${
                  formData.type === TransactionType.EXPENSE
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              disabled={isSubmitting}
            >
              <TrendingDown size={18} />
              Expense
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, type: TransactionType.INCOME })
              }
              className={`flex-1 py-2 px-4 rounded-md border-2 transition-colors flex items-center justify-center gap-2
                ${
                  formData.type === TransactionType.INCOME
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              disabled={isSubmitting}
            >
              <TrendingUp size={18} />
              Income
            </button>
          </div>
        </div>
      )}

  {/* Color */}
      <div>
        <label
          htmlFor="color"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            id="color"
            value={formData.color}
            onChange={handleColorChange}
            className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formData.color}
          </span>
        </div>
      </div>

  {/* Icon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Icon <span className="text-red-500">*</span>
        </label>
        <IconPicker
          value={formData.icon}
          onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
          transactionType={formData.type}
        />
      </div>

  {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                     bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                     rounded-md hover:bg-gray-50 dark:hover:bg-gray-700
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white
                     bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                     rounded-md disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isEditMode ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            <>{isEditMode ? 'Save changes' : 'Add category'}</>
          )}
        </motion.button>
      </div>
    </form>
  );
}
