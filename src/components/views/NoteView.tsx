import { useState } from 'react';
import { Plus, Search, Folder } from 'lucide-react';
import { useStore } from '../../store/useStore';
import NoteCard from '../notes/NoteCard';
import NoteEditor from '../notes/NoteEditor';

const NoteView = () => {
  const { notes, createNote, updateNote, deleteNote, loadNotes } = useStore();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');

  const folders = ['all', ...new Set(notes.map((n) => n.folder))];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' || note.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleCreateNote = () => {
    createNote({
      title: 'Untitled Note',
      content: '',
      folder: 'default',
      tags: [],
    });
    loadNotes();
    const newNote = notes[0];
    if (newNote) {
      setSelectedNote(newNote.id);
    }
  };

  const currentNote = selectedNote ? notes.find((n) => n.id === selectedNote) : null;

  return (
    <div className="h-full flex bg-gray-50 dark:bg-gray-900">
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notes</h2>
            <button
              onClick={handleCreateNote}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedFolder === folder
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {folder}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-2 space-y-2">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={selectedNote === note.id}
                onClick={() => setSelectedNote(note.id)}
              />
            ))}
            {filteredNotes.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No notes found
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {currentNote ? (
          <NoteEditor note={currentNote} onUpdate={updateNote} onDelete={deleteNote} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Folder size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteView;
