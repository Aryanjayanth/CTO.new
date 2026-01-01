import { useState } from 'react';
import { Plus, Clock, Layers, Sparkles } from 'lucide-react';
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
    <div className="h-full flex flex-col">
      <div className="glass border-b border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-lg neon-glow">
              <Clock className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Daily Timetable</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {dayRoutines.length} routines for {selectedDay}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
          >
            <Plus size={20} />
            <span>New Routine</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 font-medium ${
                selectedDay === day
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg neon-glow transform scale-105'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:scale-105'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="glass rounded-2xl shadow-xl overflow-hidden">
          {hours.map((hour, index) => {
            const hourRoutines = getRoutinesForDayAndHour(selectedDay, hour);

            return (
              <div
                key={hour}
                className="flex border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0 transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 list-item-enter"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-24 p-4 text-sm font-bold text-gray-600 dark:text-gray-400 border-r border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center gap-2">
                  <Clock size={14} className="text-indigo-500" />
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 p-2 min-h-[70px] relative">
                  {hourRoutines.length > 0 ? (
                    <div className="space-y-2">
                      {hourRoutines.map((routine) => (
                        <div
                          key={routine.id}
                          className="p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 card-hover"
                          style={{
                            backgroundColor: routine.color,
                            background: `linear-gradient(135deg, ${routine.color}, ${routine.color}dd)`
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Layers size={16} className="opacity-80" />
                              <div className="font-semibold">{routine.title}</div>
                            </div>
                            <div className="text-xs px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm font-medium">
                              {routine.category}
                            </div>
                          </div>
                          <div className="text-sm opacity-90 mt-2 flex items-center gap-2">
                            <Clock size={12} />
                            {routine.start_time} - {routine.end_time}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center text-gray-400 dark:text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="opacity-50" />
                        <span>Free time</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {dayRoutines.length === 0 && (
          <div className="text-center py-16 slide-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-lg neon-glow opacity-50">
              <Layers className="text-white" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No routines for {selectedDay}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add a routine to organize your day
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
            >
              <Sparkles size={20} />
              Add Your First Routine
            </button>
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
