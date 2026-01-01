import { useState } from 'react';
import { Plus, Search, Filter, Zap, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import TaskCard from '../tasks/TaskCard';
import TaskModal from '../tasks/TaskModal';
import { Priority, TaskStatus } from '../../types';

const TaskView = () => {
  const { tasks, createTask, updateTask, deleteTask } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const incompleteTasks = filteredTasks.filter((t) => t.status === 'incomplete');
  const completeTasks = filteredTasks.filter((t) => t.status === 'complete');

  const completionRate = tasks.length > 0
    ? Math.round((completeTasks.length / tasks.length) * 100)
    : 0;

  return (
    <div className="h-full flex flex-col">
      <div className="glass border-b border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg neon-glow">
                <CheckCircle2 className="text-white" size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tasks</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tasks.length} total · {incompleteTasks.length} pending
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
          >
            <Plus size={20} />
            <span>New Task</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Completion Rate
              </span>
            </div>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {completionRate}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 progress-bar rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks with AI-powered search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent input-focus-ring transition-all duration-300"
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
              className="pl-12 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 input-focus-ring transition-all duration-300 cursor-pointer appearance-none pr-10"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 input-focus-ring transition-all duration-300 cursor-pointer appearance-none pr-10"
            >
              <option value="all">All Status</option>
              <option value="incomplete">Incomplete</option>
              <option value="complete">Complete</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {incompleteTasks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Zap className="text-white" size={18} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                To Do
              </h3>
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full">
                {incompleteTasks.length}
              </span>
            </div>
            <div className="space-y-4">
              {incompleteTasks.map((task, index) => (
                <div key={task.id} className="list-item-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                  <TaskCard task={task} onUpdate={updateTask} onDelete={deleteTask} />
                </div>
              ))}
            </div>
          </div>
        )}

        {completeTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="text-white" size={18} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Completed
              </h3>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                {completeTasks.length}
              </span>
            </div>
            <div className="space-y-4">
              {completeTasks.map((task, index) => (
                <div key={task.id} className="list-item-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                  <TaskCard task={task} onUpdate={updateTask} onDelete={deleteTask} />
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="text-center py-20 slide-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <Plus className="text-gray-400 dark:text-gray-500" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first task to get started!
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (data.title && data.priority && data.status) {
              createTask(data as any);
            }
          }}
        />
      )}
    </div>
  );
};

export default TaskView;
