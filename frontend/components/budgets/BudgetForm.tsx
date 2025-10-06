'use client';

import { useState, useEffect } from 'react';
import { BudgetPeriod, BudgetWithProgress, CreateBudgetRequest } from '@/types';
import { Category } from '@/lib/api/categoriesClient';
import { motion } from 'framer-motion';

interface BudgetFormProps {
  budget?: BudgetWithProgress;
  categories: Category[];
  onSubmit: (data: CreateBudgetRequest) => Promise<void>;
  onCancel: () => void;
}

export default function BudgetForm({
  budget,
  categories,
  onSubmit,
  onCancel,
}: BudgetFormProps) {
  const isEditMode = !!budget;

  const [formData, setFormData] = useState<CreateBudgetRequest>({
    categoryId: budget?.categoryId || '',
    amount: budget?.amount ? Number(budget.amount) : 0, // Convert Decimal string to number
    period: budget?.period || 'MONTHLY',
    startDate: budget?.startDate ? budget.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: budget?.endDate ? budget.endDate.split('T')[0] : '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculate endDate when period changes (except CUSTOM)
  useEffect(() => {
    if (formData.period === 'CUSTOM') {
      return;
    }

    const start = new Date(formData.startDate);
    let end = new Date(start);

    switch (formData.period) {
      case 'DAILY':
        end.setDate(end.getDate() + 1);
        break;
      case 'WEEKLY':
        end.setDate(end.getDate() + 7);
        break;
      case 'MONTHLY':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'YEARLY':
        end.setFullYear(end.getFullYear() + 1);
        break;
    }

    setFormData((prev) => ({
      ...prev,
      endDate: end.toISOString().split('T')[0],
    }));
  }, [formData.period, formData.startDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.categoryId) {
      setError('Wybierz kategorię');
      return;
    }

    if (formData.amount <= 0) {
      setError('Kwota musi być większa niż 0');
      return;
    }

    if (formData.period === 'CUSTOM' && !formData.endDate) {
      setError('Dla niestandardowego okresu podaj datę końcową');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd');
    } finally {
      setIsSubmitting(false);
    }
  };

  const periodLabels: { [key in BudgetPeriod]: string } = {
    'DAILY': 'Dzienny',
    'WEEKLY': 'Tygodniowy',
    'MONTHLY': 'Miesięczny',
    'YEARLY': 'Roczny',
    'CUSTOM': 'Niestandardowy',
  };

  const periodOptions: BudgetPeriod[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {isEditMode ? 'Edytuj budżet' : 'Nowy budżet'}
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Category Selection */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Kategoria <span className="text-red-500">*</span>
        </label>
        <select
          id="categoryId"
          required
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        >
          <option value="">Wybierz kategorię</option>
          {categories
            .filter((cat) => cat.type === 'EXPENSE')
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Kwota (zł) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="amount"
          required
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="np. 1000.00"
          disabled={isSubmitting}
          autoFocus
        />
      </div>

      {/* Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Okres <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {periodOptions.map((period) => (
            <label
              key={period}
              className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                formData.period === period
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 dark:text-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="period"
                value={period}
                checked={formData.period === period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value as BudgetPeriod })}
                className="mr-3"
                disabled={isSubmitting}
              />
              <span className="font-medium">{periodLabels[period]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Start Date */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Data rozpoczęcia <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="startDate"
          required
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
      </div>

      {/* End Date */}
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Data zakończenia {formData.period === 'CUSTOM' && <span className="text-red-500">*</span>}
        </label>
        <input
          type="date"
          id="endDate"
          required={formData.period === 'CUSTOM'}
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting || formData.period !== 'CUSTOM'}
        />
        {formData.period !== 'CUSTOM' && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Automatycznie obliczona na podstawie okresu
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Zapisywanie...' : isEditMode ? 'Zapisz zmiany' : 'Utwórz budżet'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anuluj
        </motion.button>
      </div>
    </form>
  );
}
