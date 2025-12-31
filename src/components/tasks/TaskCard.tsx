import { useState } from 'react';
import { Calendar, Trash2, Edit, ChevronDown, ChevronRight } from 'lucide-react';
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

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const handleToggleComplete = () => {
    onUpdate(task.id, {
      status: task.status === 'complete' ? 'incomplete' : 'complete',
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.status === 'complete'}
            onChange={handleToggleComplete}
            className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
          />

          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-lg font-medium ${
                  task.status === 'complete'
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{task.description}</p>
            )}

            {task.due_date && (
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={16} />
                <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
              </div>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600"
                >
                  {showSubtasks ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span>
                    {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length} subtasks
                  </span>
                </button>

                {showSubtasks && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          readOnly
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span
                          className={`text-sm ${
                            subtask.completed
                              ? 'line-through text-gray-500 dark:text-gray-400'
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
