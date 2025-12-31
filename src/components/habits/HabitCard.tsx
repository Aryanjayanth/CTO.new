import { Check, Trash2, TrendingUp } from 'lucide-react';
import { Habit } from '../../types';
import { habitService } from '../../services/habitService';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  onUpdate: (id: string, data: Partial<Habit>) => void;
  onDelete: (id: string) => void;
  onLog: (habitId: string, date: string, completed: boolean) => void;
}

const HabitCard = ({ habit, onDelete, onLog }: HabitCardProps) => {
  const today = new Date();
  const last7Days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today,
  });

  const streak = habitService.getStreak(habit.id);
  const successRate = habitService.getSuccessRate(habit.id, 30);

  const handleToggle = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const log = habitService.getLog(habit.id, dateStr);
    onLog(habit.id, dateStr, !log?.completed);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 border-2 rounded-lg p-6 shadow-sm"
      style={{ borderColor: habit.color + '40' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {habit.name}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="capitalize">{habit.frequency}</span>
            <span className="flex items-center gap-1">
              <TrendingUp size={16} />
              {streak} day streak
            </span>
            <span>{successRate}% success rate</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex gap-2">
        {last7Days.map((date) => {
          const dateStr = date.toISOString().split('T')[0];
          const log = habitService.getLog(habit.id, dateStr);
          const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

          return (
            <button
              key={dateStr}
              onClick={() => handleToggle(date)}
              className={`flex-1 aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                log?.completed
                  ? 'text-white'
                  : isToday
                  ? 'bg-gray-100 dark:bg-gray-700 border-2 text-gray-700 dark:text-gray-300'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              style={log?.completed ? { backgroundColor: habit.color } : {}}
            >
              <div className="text-xs mb-1">{format(date, 'EEE')}</div>
              <div className="text-lg font-semibold">{format(date, 'd')}</div>
              {log?.completed && <Check size={16} className="mt-1" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Last 30 days</div>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const date = subDays(today, 29 - i);
            const dateStr = date.toISOString().split('T')[0];
            const log = habitService.getLog(habit.id, dateStr);

            return (
              <div
                key={dateStr}
                className={`aspect-square rounded ${
                  log?.completed
                    ? 'opacity-100'
                    : 'bg-gray-200 dark:bg-gray-700 opacity-30'
                }`}
                style={log?.completed ? { backgroundColor: habit.color } : {}}
                title={format(date, 'MMM dd')}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
