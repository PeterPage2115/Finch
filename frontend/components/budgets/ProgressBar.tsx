interface ProgressBarProps {
  percentage: number; // 0-100+
  spent: number;
  limit: number;
  alerts?: string[]; // ['80%', '100%']
}

/**
 * Progress bar component for budget visualization.
 *
 * Colors:
 * - Green: < 80%
 * - Yellow/Orange: 80-99%
 * - Red: >= 100%
 */
export default function ProgressBar({ percentage, spent, limit, alerts = [] }: ProgressBarProps) {
  // Clamp percentage to 100 for display purposes
  const displayPercentage = Math.min(percentage, 100);

  // Determine color based on percentage
  let colorClass = 'bg-green-500 dark:bg-green-600'; // Default green
  if (percentage >= 100) {
    colorClass = 'bg-red-500 dark:bg-red-600';
  } else if (percentage >= 80) {
    colorClass = 'bg-yellow-500 dark:bg-yellow-600';
  }

  return (
    <div className="w-full">
      {/* Progress info */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {spent.toFixed(2)} zł / {limit.toFixed(2)} zł
        </span>
        <span className={`text-sm font-bold ${percentage >= 100 ? 'text-red-600 dark:text-red-400' : percentage >= 80 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`${colorClass} h-full rounded-full transition-all duration-300`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mt-2 flex gap-2">
          {alerts.includes('80%') && (
            <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
              ⚠️ 80% wykorzystane
            </span>
          )}
          {alerts.includes('100%') && (
            <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full">
              🚨 Przekroczony!
            </span>
          )}
        </div>
      )}
    </div>
  );
}
