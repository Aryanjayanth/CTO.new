import { useState } from 'react';
import { X, Zap, Calendar, Check } from 'lucide-react';
import { Task, Priority } from '../../types';

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
  onSave: (data: Partial<Task>) => void;
}

const TaskModal = ({ task, onClose, onSave }: TaskModalProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.due_date?.split('T')[0] || '');

  const priorityOptions = [
    { value: 'low' as Priority, label: 'Low', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { value: 'medium' as Priority, label: 'Medium', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { value: 'high' as Priority, label: 'High', color: 'from-red-500 to-pink-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: task?.status || 'incomplete',
      due_date: dueDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg glass rounded-2xl shadow-2xl fade-in-scale overflow-hidden">
        {/* Header with gradient */}
        <div className="relative p-6 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {task ? 'Edit Task' : 'New Task'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {task ? 'Update your task details' : 'Create a new task'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-primary-500 to-purple-500 rounded-full" />
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent input-focus-ring transition-all duration-300"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent input-focus-ring transition-all duration-300 resize-none"
              placeholder="Add a detailed description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPriority(option.value)}
                    className={`relative px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                      priority === option.value
                        ? `bg-gradient-to-br ${option.color} border-transparent text-white shadow-lg transform scale-105`
                        : `border-gray-300 dark:border-gray-600 ${option.bg} hover:border-primary-300 dark:hover:border-primary-600`
                    }`}
                  >
                    {priority === option.value && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <Check size={10} className="text-primary-600" />
                      </div>
                    )}
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent input-focus-ring transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 btn-glow font-medium transform hover:scale-105"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
