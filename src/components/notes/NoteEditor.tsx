import { useState, useEffect } from 'react';
import { Trash2, Save, Tag, Folder, Sparkles, X } from 'lucide-react';
import { Note } from '../../types';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, data: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

const NoteEditor = ({ note, onUpdate, onDelete }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [folder, setFolder] = useState(note.folder);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(note.tags);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setFolder(note.folder);
    setTags(note.tags);
  }, [note]);

  const handleSave = () => {
    onUpdate(note.id, {
      title,
      content,
      folder,
      tags,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="glass border-b border-gray-200/50 dark:border-gray-700/50 p-4 backdrop-blur-xl">
        <div className="flex-1 flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100 flex-1 placeholder-gray-400 dark:placeholder-gray-600"
            placeholder="Untitled Note"
          />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
          >
            <Save size={18} />
            <span>Save</span>
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-110 icon-hover"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex flex-wrap items-center gap-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Folder size={16} className="text-purple-600 dark:text-purple-400" />
          </div>
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent input-focus-ring font-medium"
            placeholder="Folder"
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
            <Tag size={16} className="text-pink-600 dark:text-pink-400" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800 transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <Tag size={10} />
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-purple-900 dark:hover:text-purple-300 transition-colors p-0.5 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 rounded"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag..."
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent input-focus-ring pr-10"
              />
              {tagInput && (
                <button
                  onClick={handleAddTag}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-all duration-200 hover:scale-110 icon-hover"
                >
                  <Sparkles size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full bg-transparent border-none focus:outline-none resize-none text-gray-900 dark:text-gray-100 text-base leading-relaxed"
          placeholder="Start writing your note..."
        />
      </div>
    </div>
  );
};

export default NoteEditor;
