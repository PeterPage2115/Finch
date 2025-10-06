/**
 * CategoryList Component
 * 
 * Wyświetla listę kategorii w formie kart z możliwością edycji i usuwania
 */

'use client';

import { Category } from '@/lib/api/categoriesClient';
import { TransactionType } from '@/types/transaction';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { motion } from 'framer-motion';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isLoading?: boolean;
}

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Brak kategorii
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Dodaj swoją pierwszą kategorię, aby zacząć organizować finanse
        </p>
      </div>
    );
  }

  // Grupuj kategorie po typie
  const incomeCategories = categories.filter(
    (cat) => cat.type === TransactionType.INCOME
  );
  const expenseCategories = categories.filter(
    (cat) => cat.type === TransactionType.EXPENSE
  );

  return (
    <div className="space-y-8">
      {/* Kategorie przychodów */}
      {incomeCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            <span>Przychody</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({incomeCategories.length})
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Kategorie wydatków */}
      {expenseCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
            <span>Wydatki</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({expenseCategories.length})
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * CategoryCard - pojedyncza karta kategorii
 */
interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Ikona z kolorem z bazy danych */}
          <div className="flex-shrink-0">
            <CategoryIcon 
              iconName={category.icon} 
              color={category.color} 
              size={32} 
            />
          </div>

          {/* Nazwa i kolor */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {category.name}
              </h4>
              {/* Color dot */}
              {category.color && (
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: category.color }}
                  title={category.color}
                />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(category.createdAt).toLocaleDateString('pl-PL')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(category)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Edytuj"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(category)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Usuń"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
