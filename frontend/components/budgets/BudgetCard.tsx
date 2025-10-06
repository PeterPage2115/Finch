import { BudgetWithProgress } from '@/types';
import ProgressBar from './ProgressBar';
import { Pencil, Trash2 } from 'lucide-react';

interface BudgetCardProps {
  budget: BudgetWithProgress;
  onEdit: (budget: BudgetWithProgress) => void;
  onDelete: (id: string) => void;
}

/**
 * Card component displaying a single budget with progress.
 */
export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { category, period, startDate, endDate, progress } = budget;

  // Format dates
  const start = new Date(startDate).toLocaleDateString('pl-PL');
  const end = new Date(endDate).toLocaleDateString('pl-PL');

  // Period label
  const periodLabels: Record<string, string> = {
    DAILY: 'Dzienny',
    WEEKLY: 'Tygodniowy',
    MONTHLY: 'Miesięczny',
    YEARLY: 'Roczny',
    CUSTOM: 'Niestandardowy',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {category?.icon && <span>{category.icon}</span>}
            {category?.name || 'Kategoria'}
          </h3>
          <p className="text-sm text-gray-500">
            {periodLabels[period]} • {start} - {end}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(budget)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edytuj budżet"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Usuń budżet"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        percentage={progress.percentage}
        spent={progress.spent}
        limit={progress.limit}
        alerts={progress.alerts}
      />

      {/* Remaining Amount */}
      <div className="mt-3 text-sm text-gray-600">
        Pozostało: <span className={`font-semibold ${progress.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {progress.remaining.toFixed(2)} zł
        </span>
      </div>
    </div>
  );
}
