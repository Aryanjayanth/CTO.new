import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import EventModal from '../calendar/EventModal';

const CalendarView = () => {
  const { events, tasks, createEvent } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay();
  const paddingDays = Array(firstDayOfWeek).fill(null);

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, date);
    });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return isSameDay(taskDate, date);
    });
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="h-full flex flex-col">
      <div className="glass border-b border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg neon-glow">
              <CalendarIcon className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {events.length} events this month
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToday}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium hover:scale-105"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 icon-hover"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 icon-hover"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
            >
              <Plus size={20} />
              <span>New Event</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 scrollbar-thin">
        <div className="glass rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-gray-50/80 dark:bg-gray-800/80 p-4 text-center backdrop-blur-sm"
              >
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  {day}
                </span>
              </div>
            ))}

            {paddingDays.map((_, index) => (
              <div key={`padding-${index}`} className="bg-white/50 dark:bg-gray-800/50 min-h-28" />
            ))}

            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDate(day);
              const dayTasks = getTasksForDate(day);
              const isDayToday = isToday(day);
              const totalItems = dayEvents.length + dayTasks.length;

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => {
                    setSelectedDate(day);
                    setIsModalOpen(true);
                  }}
                  className={`bg-white/80 dark:bg-gray-800/80 min-h-28 p-2 relative cursor-pointer transition-all duration-200 hover:bg-gradient-to-br hover:from-orange-50/50 hover:to-red-50/50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20 ${
                    isDayToday ? 'ring-2 ring-inset ring-orange-500/50' : ''
                  } backdrop-blur-sm`}
                >
                  <div
                    className={`text-sm font-semibold mb-2 transition-all duration-200 ${
                      isDayToday
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg neon-glow'
                        : 'text-gray-900 dark:text-gray-100 hover:text-orange-600 dark:hover:text-orange-400'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>

                  <div className="space-y-1.5">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1.5 rounded-lg truncate cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md font-medium"
                        style={{
                          backgroundColor: event.color + '25',
                          color: event.color,
                          borderLeft: `3px solid ${event.color}`
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayTasks.slice(0, 1).map((task) => (
                      <div
                        key={task.id}
                        className="text-xs px-2 py-1.5 rounded-lg truncate bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-800 dark:text-yellow-400 font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md border border-yellow-200 dark:border-yellow-800"
                        title={task.title}
                      >
                        📋 {task.title}
                      </div>
                    ))}
                    {totalItems > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-2 font-semibold flex items-center gap-1">
                        <Sparkles size={12} className="text-orange-500" />
                        +{totalItems - 3} more
                      </div>
                    )}
                  </div>

                  {isDayToday && (
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EventModal
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (data.title && data.start_time && data.color && data.type) {
              createEvent(data as any);
            }
            setIsModalOpen(false);
          }}
          defaultDate={selectedDate || undefined}
        />
      )}
    </div>
  );
};

export default CalendarView;
