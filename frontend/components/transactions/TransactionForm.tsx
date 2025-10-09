/**
 * TransactionForm Component
 * 
 * Formularz do dodawania/edycji transakcji
 */

'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionType, CreateTransactionDto } from '@/types/transaction';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionFormProps {
  transaction?: Transaction | null; // Jeśli podane, to tryb edycji
  categories: Array<{ id: string; name: string; icon?: string | null; type: TransactionType }>;
  onSubmit: (data: CreateTransactionDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TransactionForm({
  transaction,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<CreateTransactionDto>({
    amount: transaction?.amount || 0,
    description: transaction?.description || '',
    date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
    type: transaction?.type || TransactionType.EXPENSE,
    categoryId: transaction?.categoryId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtruj kategorie po typie
  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  // Jeśli zmieni się typ i aktualna kategoria nie pasuje, wyczyść
  useEffect(() => {
    if (formData.categoryId && !filteredCategories.find(c => c.id === formData.categoryId)) {
      setFormData(prev => ({ ...prev, categoryId: '' }));
    }
  }, [formData.type, formData.categoryId, filteredCategories]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      // Konwertuj datę do ISO 8601
      const dateObj = new Date(formData.date);
      const isoDate = dateObj.toISOString();

      await onSubmit({
        ...formData,
        date: isoDate,
        amount: Number(formData.amount),
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {transaction ? 'Edit Transaction' : 'New Transaction'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: TransactionType.INCOME })}
              className={`px-4 py-2 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                formData.type === TransactionType.INCOME
                  ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <TrendingUp size={18} />
              Income
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: TransactionType.EXPENSE })}
              className={`px-4 py-2 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                formData.type === TransactionType.EXPENSE
                  ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <TrendingDown size={18} />
              Expense
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount (PLN)
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            onFocus={(e) => {
              // Select all text when focusing on zero value for better UX
              if (formData.amount === 0) {
                e.target.select();
              }
            }}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
            autoFocus
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          >
            <option value="">Select category</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-white dark:bg-gray-700">
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryId}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Additional information about the transaction..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            disabled={isLoading}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : transaction ? 'Update' : 'Add'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
