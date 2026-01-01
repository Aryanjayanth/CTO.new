import { useState } from 'react';
import { Calendar, Trash2, Edit, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../../types';
import { format } from 'date-fns';
import TaskModal from './TaskModal';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const priorityConfig = {
    low: {
      colors: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      gradient: 'from-green-500 to-emerald-500',
      icon: <Circle size={12} className="fill-current" />
    },
    medium: {
      colors: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      gradient: 'from-yellow-500 to-orange-500',
      icon: <Circle size={12} className="fill-current" />
    },
    high: {
      colors: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      gradient: 'from-red-500 to-pink-500',
      icon: <Circle size={12} className="fill-current" />
    },
  };

  const priority = priorityConfig[task.priority];

  const handleToggleComplete = () => {
    onUpdate(task.id, {
      status: task.status === 'complete' ? 'incomplete' : 'complete',
    });
  };

  const subtaskProgress = task.subtasks && task.subtasks.length > 0
    ? Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)
    : 0;

  return (
    <>
      <div className="gradient-border card-hover group">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-start gap-4">
            <button
              onClick={handleToggleComplete}
              className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 checkbox-animated ${
                task.status === 'complete'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400'
              }`}
            >
              {task.status === 'complete' && (
                <CheckCircle2 className="text-white" size={14} />
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3
                  className={`text-lg font-semibold transition-all duration-300 ${
                    task.status === 'complete'
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                  }`}
                >
                  {task.title}
                </h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 icon-hover"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 icon-hover"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {task.description && (
                <p className={`text-sm mb-3 transition-all duration-300 ${
                  task.status === 'complete'
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${priority.colors} flex items-center gap-1.5`}>
                  {priority.icon}
                  <span className="capitalize">{task.priority} Priority</span>
                </span>

                {task.due_date && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                    <Calendar size={14} className="text-primary-500" />
                    <span className="font-medium">{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>

              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setShowSubtasks(!showSubtasks)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {showSubtasks ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <span>
                        {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length} Subtasks
                      </span>
                    </button>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {subtaskProgress}%
                    </span>
                  </div>

                  {/* Subtask Progress Bar */}
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500 progress-bar rounded-full"
                      style={{ width: `${subtaskProgress}%` }}
                    />
                  </div>

                  {showSubtasks && (
                    <div className="space-y-2">
                      {task.subtasks.map((subtask, index) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 list-item-enter"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            subtask.completed
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {subtask.completed && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium transition-all duration-300 ${
                              subtask.completed
                                ? 'line-through text-gray-400 dark:text-gray-500'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <TaskModal
          task={task}
          onClose={() => setIsEditing(false)}
          onSave={(data) => {
            onUpdate(task.id, data);
            setIsEditing(false);
          }}
        />
      )}
    </>
  );
};

export default TaskCard;
