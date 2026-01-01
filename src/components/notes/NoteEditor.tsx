import { useState, useEffect } from 'react';
import { Trash2, Save, Tag, Folder } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex-1 flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100 flex-1"
            placeholder="Note title"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            <span>Save</span>
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Folder size={18} className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
            placeholder="Folder"
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Tag size={18} className="text-gray-500 dark:text-gray-400" />
          <div className="flex items-center gap-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-primary-900 dark:hover:text-primary-300"
                >
                  ×
                </button>
              </span>
            ))}
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
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
            />
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
