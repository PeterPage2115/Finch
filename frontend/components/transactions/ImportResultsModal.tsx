/**
 * ImportResultsModal Component
 * 
 * Modal for displaying CSV import results
 */

'use client';

import { X, CheckCircle, AlertCircle, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ImportResultDto } from '@/types/transaction';

interface ImportResultsModalProps {
  isOpen: boolean;
  result: ImportResultDto | null;
  onClose: () => void;
}

export default function ImportResultsModal({
  isOpen,
  result,
  onClose,
}: ImportResultsModalProps) {
  if (!result) return null;

  const hasFailures = result.failedCount > 0;
  const hasAutoCreated = result.autoCreatedCategories.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Import Results
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Success Count */}
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Successfully Imported
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {result.successCount}
                  </div>
                </div>

                {/* Failed Count */}
                <div className={`rounded-lg p-4 border ${
                  hasFailures
                    ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className={hasFailures ? 'text-red-600 dark:text-red-400' : 'text-gray-400'} size={20} />
                    <span className={`text-sm font-medium ${
                      hasFailures
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      Failed Rows
                    </span>
                  </div>
                  <div className={`text-3xl font-bold ${
                    hasFailures
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {result.failedCount}
                  </div>
                </div>
              </div>

              {/* Auto-created Categories */}
              {hasAutoCreated && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="text-blue-600 dark:text-blue-400" size={20} />
                    <span className="font-medium text-blue-700 dark:text-blue-300">
                      Auto-created Categories
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.autoCreatedCategories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed Rows Details */}
              {hasFailures && (
                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Error Details
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {result.failedRows.map((failedRow) => (
                      <div
                        key={failedRow.rowNumber}
                        className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg p-3"
                      >
                        <div className="font-medium text-sm text-red-700 dark:text-red-300 mb-2">
                          Row {failedRow.rowNumber}
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                          {failedRow.errors.map((error, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 dark:text-gray-300"
                            >
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success message when no failures */}
              {!hasFailures && (
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <p>All transactions were imported successfully! 🎉</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
