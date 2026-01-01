import { useState } from 'react';
import { Plus, TrendingUp, Flame, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import HabitCard from '../habits/HabitCard';
import HabitModal from '../habits/HabitModal';

const HabitView = () => {
  const { habits, createHabit, updateHabit, deleteHabit, logHabit } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="glass border-b border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg neon-glow">
                <TrendingUp className="text-white" size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                <Flame className="text-white" size={12} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Habit Tracker</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {habits.length} habits · Building momentum
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
          >
            <Plus size={20} />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {habits.length > 0 ? (
          <div className="grid gap-5">
            {habits.map((habit, index) => (
              <div key={habit.id} className="list-item-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                <HabitCard
                  habit={habit}
                  onUpdate={updateHabit}
                  onDelete={deleteHabit}
                  onLog={logHabit}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 slide-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg neon-glow opacity-50">
              <Flame className="text-white" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Start Your Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first habit and start building momentum today!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
            >
              <Sparkles size={20} />
              Create Your First Habit
            </button>
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
