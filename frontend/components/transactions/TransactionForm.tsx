/**
 * TransactionForm Component
 * 
 * Formularz do dodawania/edycji transakcji
 */

'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionType, CreateTransactionDto } from '@/types/transaction';

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
      newErrors.amount = 'Kwota musi być większa niż 0';
    }

    if (!formData.date) {
      newErrors.date = 'Data jest wymagana';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategoria jest wymagana';
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {transaction ? 'Edytuj transakcję' : 'Nowa transakcja'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Typ transakcji */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typ transakcji
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: TransactionType.INCOME })}
              className={`px-4 py-2 rounded-lg border-2 transition ${
                formData.type === TransactionType.INCOME
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              💰 Przychód
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: TransactionType.EXPENSE })}
              className={`px-4 py-2 rounded-lg border-2 transition ${
                formData.type === TransactionType.EXPENSE
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              💸 Wydatek
            </button>
          </div>
        </div>

        {/* Kwota */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Kwota (zł)
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Kategoria */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Kategoria
          </label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Wybierz kategorię</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
          )}
        </div>

        {/* Data */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Opis */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Opis (opcjonalny)
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Dodatkowe informacje o transakcji..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            disabled={isLoading}
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Zapisywanie...' : transaction ? 'Zaktualizuj' : 'Dodaj'}
          </button>
        </div>
      </form>
    </div>
  );
}
