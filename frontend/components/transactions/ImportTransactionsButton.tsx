/**
 * ImportTransactionsButton Component
 * 
 * Button for uploading CSV file to import transactions
 */

'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { transactionsApi } from '@/lib/api/transactionsClient';
import { useAuthStore } from '@/lib/stores/authStore';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import type { ImportResultDto } from '@/types/transaction';

interface ImportTransactionsButtonProps {
  onImportComplete: (result: ImportResultDto) => void;
}

export default function ImportTransactionsButton({
  onImportComplete,
}: ImportTransactionsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const validateFile = (file: File): string | null => {
    // Check file extension
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return 'Only CSV files are allowed';
    }

    // Check file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) {
      return;
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      addNotification(validationError, 'error');
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setIsUploading(true);
      const result = await transactionsApi.importCsv(token, file);
      
      // Show success notification
      addNotification(
        `Successfully imported ${result.successCount} transaction(s)`,
        'success'
      );

      // Call parent callback to show detailed results
      onImportComplete(result);
    } catch (error) {
      console.error('Import error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to import CSV';
      addNotification(errorMessage, 'error');
    } finally {
      setIsUploading(false);
      // Reset input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <motion.button
        whileHover={!isUploading ? { scale: 1.05 } : {}}
        whileTap={!isUploading ? { scale: 0.95 } : {}}
        onClick={handleButtonClick}
        disabled={isUploading}
        className="px-6 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Upload size={18} />
        {isUploading ? 'Importing...' : 'Import CSV'}
      </motion.button>
    </>
  );
}
