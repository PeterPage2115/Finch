'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

type DateRangePreset = 'month' | 'quarter' | 'year' | 'custom';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}

/**
 * DateRangePicker - select period for reports
 */
export default function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('month');
  const [customStart, setCustomStart] = useState(startDate);
  const [customEnd, setCustomEnd] = useState(endDate);

  const getPresetRange = (preset: DateRangePreset): { start: string; end: string } => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (preset) {
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'quarter':
        const currentQuarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), currentQuarter * 3, 1);
        end = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        return { start: customStart, end: customEnd };
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const handlePresetClick = (preset: DateRangePreset) => {
    setSelectedPreset(preset);
    if (preset !== 'custom') {
      const range = getPresetRange(preset);
      onDateChange(range.start, range.end);
    }
  };

  const handleCustomApply = () => {
    onDateChange(customStart, customEnd);
  };

  const presets: { key: DateRangePreset; label: string }[] = [
    { key: 'month', label: 'Bieżący miesiąc' },
    { key: 'quarter', label: 'Bieżący kwartał' },
    { key: 'year', label: 'Bieżący rok' },
    { key: 'custom', label: 'Własny zakres' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Zakres dat</h3>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={preset.key}
            onClick={() => handlePresetClick(preset.key)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedPreset === preset.key
                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>

      {/* Custom date inputs */}
      {selectedPreset === 'custom' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data początkowa
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data końcowa
              </label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCustomApply}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
          >
            Zastosuj
          </motion.button>
        </div>
      )}

      {/* Current selection display */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Wybrany okres: <span className="font-semibold text-gray-900 dark:text-white">{startDate}</span> - <span className="font-semibold text-gray-900 dark:text-white">{endDate}</span>
        </p>
      </div>
    </div>
  );
}
