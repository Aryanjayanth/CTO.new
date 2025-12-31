import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import HabitCard from '../habits/HabitCard';
import HabitModal from '../habits/HabitModal';

const HabitView = () => {
  const { habits, createHabit, updateHabit, deleteHabit, logHabit } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Habit Tracker</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {habits.length > 0 ? (
          <div className="grid gap-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onUpdate={updateHabit}
                onDelete={deleteHabit}
                onLog={logHabit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No habits yet. Create one to start building your routine!
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <HabitModal
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (data.name && data.frequency && data.color) {
              createHabit(data as any);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default HabitView;
