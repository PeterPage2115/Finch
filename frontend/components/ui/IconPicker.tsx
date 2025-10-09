/**
 * IconPicker Component
 * 
 * Visual icon picker for CategoryForm
 * Displays grid of available lucide-react icons organized by category
 */

'use client';

import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { ICON_CATEGORIES_BY_TYPE, type IconCategory } from '@/lib/iconMap';
import { TransactionType } from '@/types/transaction';
import { motion } from 'framer-motion';

interface IconPickerProps {
  value: string; // currently selected icon name
  onChange: (iconName: string) => void;
  transactionType: TransactionType; // filter icons by type
  className?: string;
}

export function IconPicker({
  value,
  onChange,
  transactionType,
  className = '',
}: IconPickerProps) {
  // Get relevant icon categories based on transaction type
  const categories: IconCategory[] = [
    ...(transactionType === TransactionType.INCOME
      ? ICON_CATEGORIES_BY_TYPE.INCOME
      : ICON_CATEGORIES_BY_TYPE.EXPENSE),
    ...ICON_CATEGORIES_BY_TYPE.GENERIC,
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Choose an icon for your category
      </div>

      {categories.map((category) => (
        <div key={category.name}>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {category.name}
          </h4>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {category.icons.map((iconName) => (
              <motion.button
                key={iconName}
                type="button"
                onClick={() => onChange(iconName)}
                className={`
                  relative p-3 rounded-lg border-2 transition-all
                  hover:scale-110 focus:scale-110
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    value === iconName
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={iconName}
              >
                <CategoryIcon
                  iconName={iconName}
                  size={24}
                  className={
                    value === iconName
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }
                />
                {value === iconName && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      {/* Preview selected icon */}
      {value && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected icon:
          </div>
          <div className="flex items-center gap-2">
            <CategoryIcon iconName={value} size={32} />
            <code className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded">
              {value}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
