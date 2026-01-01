import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
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

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tasks</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Task</span>
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {incompleteTasks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              To Do ({incompleteTasks.length})
            </h3>
            <div className="space-y-3">
              {incompleteTasks.map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
              ))}
            </div>
          </div>
        )}

        {completeTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Completed ({completeTasks.length})
            </h3>
            <div className="space-y-3">
              {completeTasks.map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
              ))}
            </div>
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No tasks found. Create one to get started!</p>
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
