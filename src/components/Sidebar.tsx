import { CheckSquare, FileText, Calendar, TrendingUp, Clock, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ViewMode } from '../types';

const Sidebar = () => {
  const { currentView, setCurrentView } = useStore();

  const menuItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'notes', label: 'Notes', icon: <FileText size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'habits', label: 'Habits', icon: <TrendingUp size={20} /> },
    { id: 'timetable', label: 'Timetable', icon: <Clock size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Prodify</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your Productivity Companion</p>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>v1.0.0</p>
          <p className="mt-1">100% Offline</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
