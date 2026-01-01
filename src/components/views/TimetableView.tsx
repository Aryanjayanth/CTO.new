import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import RoutineModal from '../timetable/RoutineModal';

const TimetableView = () => {
  const { routines, createRoutine } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getRoutinesForDayAndHour = (day: string, hour: number) => {
    return routines.filter((routine) => {
      if (!routine.days.includes(day)) return false;
      const startHour = parseInt(routine.start_time.split(':')[0]);
      const endHour = parseInt(routine.end_time.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });
  };

  const dayRoutines = routines.filter((r) => r.days.includes(selectedDay));

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Daily Timetable</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Routine</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedDay === day
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {hours.map((hour) => {
            const hourRoutines = getRoutinesForDayAndHour(selectedDay, hour);

            return (
              <div
                key={hour}
                className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="w-20 p-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 p-2 min-h-[60px]">
                  {hourRoutines.length > 0 ? (
                    <div className="space-y-2">
                      {hourRoutines.map((routine) => (
                        <div
                          key={routine.id}
                          className="p-3 rounded-lg text-white"
                          style={{ backgroundColor: routine.color }}
                        >
                          <div className="font-medium">{routine.title}</div>
                          <div className="text-sm opacity-90">
                            {routine.start_time} - {routine.end_time}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center text-gray-400 dark:text-gray-600 text-sm">
                      No routines scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {dayRoutines.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No routines scheduled for {selectedDay}
          </div>
        )}
      </div>

      {isModalOpen && (
        <RoutineModal
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (data.title && data.start_time && data.end_time && data.days && data.color && data.category) {
              createRoutine(data as any);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TimetableView;
