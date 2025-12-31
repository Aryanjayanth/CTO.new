import { format } from 'date-fns';
import { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

const NoteCard = ({ note, isSelected, onClick }: NoteCardProps) => {
  const preview = note.content.slice(0, 100).replace(/<[^>]*>/g, '');

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected
          ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
          : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate">{note.title}</h3>
      {preview && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{preview}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {note.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs">
              +{note.tags.length - 2}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {format(new Date(note.updated_at), 'MMM dd')}
        </span>
      </div>
    </button>
  );
};

export default NoteCard;
