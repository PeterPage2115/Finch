import { memo } from 'react';
import { BudgetWithProgress } from '@/types';
import BudgetCard from './BudgetCard';

interface BudgetListProps {
  budgets: BudgetWithProgress[];
  onEdit: (budget: BudgetWithProgress) => void;
  onDelete: (id: string) => void;
}

/**
 * List component displaying all budgets.
 * Optimized with React.memo to prevent unnecessary re-renders.
 */
function BudgetList({ budgets, onEdit, onDelete }: BudgetListProps) {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-500 text-lg">You don&apos;t have any budgets yet</p>
        <p className="text-gray-400 text-sm mt-2">Click &quot;Add budget&quot; to create your first one</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default memo(BudgetList);
