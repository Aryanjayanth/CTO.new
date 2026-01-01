import { format } from 'date-fns';
import { FileText, Clock, Tag } from 'lucide-react';
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
      className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] group ${
        isSelected
          ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-500 shadow-lg neon-glow'
          : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md card-hover'
      }`}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
          isSelected
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 dark:group-hover:bg-purple-900/30 dark:group-hover:text-purple-400'
        }`}>
          <FileText size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm truncate ${
            isSelected
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'
          }`}>
            {note.title}
          </h3>
        </div>
      </div>

      {preview && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 pl-11">
          {preview}
        </p>
      )}

      <div className="flex items-center justify-between pl-11">
        <div className="flex gap-1.5 flex-wrap">
          {note.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
              }`}
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium">
              +{note.tags.length - 2}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={12} />
          <span className="font-medium">{format(new Date(note.updated_at), 'MMM dd')}</span>
        </div>
      </div>
    </button>
  );
};

export default NoteCard;
