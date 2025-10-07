'use client';

import { useState } from 'react';
import { DownloadIcon, FileTextIcon, Loader2Icon } from 'lucide-react';
import { API_URL } from '@/lib/api/config';

interface ExportButtonsProps {
  startDate: string;
  endDate: string;
  token: string;
}

export function ExportButtons({ startDate, endDate, token }: ExportButtonsProps) {
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportCSV = async () => {
    try {
      setIsExportingCSV(true);

      const response = await fetch(
        `${API_URL}/reports/export/csv?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Błąd podczas eksportu CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${startDate}_${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Show success message (simple alert for now)
      alert('CSV został pobrany pomyślnie!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Błąd podczas eksportu CSV');
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);

      const response = await fetch(
        `${API_URL}/reports/export/pdf?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Błąd podczas eksportu PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raport_${startDate}_${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Show success message (simple alert for now)
      alert('PDF został pobrany pomyślnie!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Błąd podczas eksportu PDF');
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex gap-3">
      {/* CSV Export Button */}
      <button
        onClick={handleExportCSV}
        disabled={isExportingCSV}
        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExportingCSV ? (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" />
            <span>Generowanie CSV...</span>
          </>
        ) : (
          <>
            <FileTextIcon className="h-4 w-4" />
            <span>Pobierz CSV</span>
          </>
        )}
      </button>

      {/* PDF Export Button */}
      <button
        onClick={handleExportPDF}
        disabled={isExportingPDF}
        className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExportingPDF ? (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" />
            <span>Generowanie PDF...</span>
          </>
        ) : (
          <>
            <DownloadIcon className="h-4 w-4" />
            <span>Pobierz PDF</span>
          </>
        )}
      </button>
    </div>
  );
}
