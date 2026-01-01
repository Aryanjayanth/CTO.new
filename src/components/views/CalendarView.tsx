import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
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
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={20} />
              <span>New Event</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-gray-50 dark:bg-gray-800 p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {day}
              </div>
            ))}

            {paddingDays.map((_, index) => (
              <div key={`padding-${index}`} className="bg-white dark:bg-gray-800 min-h-24" />
            ))}

            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDate(day);
              const dayTasks = getTasksForDate(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className="bg-white dark:bg-gray-800 min-h-24 p-2 relative"
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isToday
                        ? 'bg-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: event.color + '20', color: event.color }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayTasks.slice(0, 1).map((task) => (
                      <div
                        key={task.id}
                        className="text-xs px-2 py-1 rounded truncate bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                        title={task.title}
                      >
                        📋 {task.title}
                      </div>
                    ))}
                    {(dayEvents.length + dayTasks.length > 3) && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                        +{dayEvents.length + dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
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
