import { Check, Trash2, TrendingUp, Flame, Zap } from 'lucide-react';
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
    <div className="gradient-border card-hover group">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50"
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${habit.color}, ${habit.color}cc)`,
                  boxShadow: `0 4px 12px ${habit.color}40`
                }}
              >
                <Flame className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {habit.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                  <span className="capitalize px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {habit.frequency}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Zap size={14} className="text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-orange-600 dark:text-orange-400">
                  {streak} day streak
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp size={14} className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-green-600 dark:text-green-400">
                  {successRate}% success
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-110 icon-hover opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* 7 Day Tracker */}
        <div className="flex gap-2">
          {last7Days.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const log = habitService.getLog(habit.id, dateStr);
            const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

            return (
              <button
                key={dateStr}
                onClick={() => handleToggle(date)}
                className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative list-item-enter ${
                  log?.completed
                    ? 'text-white shadow-lg transform scale-105 hover:scale-110'
                    : isToday
                    ? 'bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md'
                    : 'bg-gray-50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
                style={log?.completed ? {
                  background: `linear-gradient(135deg, ${habit.color}, ${habit.color}dd)`,
                  boxShadow: `0 4px 12px ${habit.color}60`
                } : {}}
              >
                <div className="text-xs mb-1 font-medium">{format(date, 'EEE')}</div>
                <div className="text-lg font-bold">{format(date, 'd')}</div>
                {log?.completed && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <Check size={10} className={`text-[${habit.color}]`} style={{ color: habit.color }} />
                  </div>
                )}
                {isToday && !log?.completed && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* 30 Day History */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <TrendingUp size={14} className="text-primary-500" />
              Last 30 days
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {successRate}% completed
            </span>
          </div>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 30 }).map((_, i) => {
              const date = subDays(today, 29 - i);
              const dateStr = date.toISOString().split('T')[0];
              const log = habitService.getLog(habit.id, dateStr);

              return (
                <div
                  key={dateStr}
                  className={`aspect-square rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer ${
                    log?.completed
                      ? 'shadow-sm hover:shadow-md transform'
                      : 'bg-gray-200 dark:bg-gray-700 opacity-30'
                  }`}
                  style={log?.completed ? {
                    background: `linear-gradient(135deg, ${habit.color}, ${habit.color}aa)`,
                    boxShadow: `0 2px 4px ${habit.color}40`
                  } : {}}
                  title={format(date, 'MMM dd')}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
