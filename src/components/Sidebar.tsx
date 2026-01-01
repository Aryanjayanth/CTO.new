import { CheckSquare, FileText, Calendar, TrendingUp, Clock, Settings, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ViewMode } from '../types';

const Sidebar = () => {
  const { currentView, setCurrentView } = useStore();

  const menuItems: { id: ViewMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} />, color: 'from-blue-500 to-cyan-500' },
    { id: 'notes', label: 'Notes', icon: <FileText size={20} />, color: 'from-purple-500 to-pink-500' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} />, color: 'from-orange-500 to-red-500' },
    { id: 'habits', label: 'Habits', icon: <TrendingUp size={20} />, color: 'from-green-500 to-emerald-500' },
    { id: 'timetable', label: 'Timetable', icon: <Clock size={20} />, color: 'from-indigo-500 to-violet-500' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, color: 'from-gray-500 to-slate-500' },
  ];

  return (
    <aside className="w-72 glass border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col backdrop-blur-xl">
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg neon-glow">
              <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Prodify</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-13 pl-1">
            AI-Powered Productivity
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Main Menu
          </p>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id} className="list-item-enter">
              <button
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  currentView === item.id
                    ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg neon-glow transform scale-[1.02]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200/50 dark:hover:from-gray-800 dark:hover:to-gray-700/50 hover:scale-105'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 ${
                  currentView === item.id ? 'opacity-100' : 'group-hover:opacity-20'
                } transition-opacity duration-300`} />
                <div className="relative flex items-center gap-3">
                  <div className={`transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110 icon-hover'}`}>
                    {item.icon}
                  </div>
                  <span className={`font-medium ${currentView === item.id ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                </div>
                {currentView === item.id && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full pulse-glow" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="rounded-xl bg-gradient-to-r from-gray-100 to-gray-200/50 dark:from-gray-800 dark:to-gray-700/50 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Status
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Online
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
            v2.0.0 · 100% Offline · Local Storage
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
