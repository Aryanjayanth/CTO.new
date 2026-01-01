import { useState } from 'react';
import { Plus, Search, Folder, FileText, Sparkles } from 'lucide-react';
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
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 glass border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col backdrop-blur-xl">
        <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-lg neon-glow">
                <FileText className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notes</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {notes.length} notes
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateNote}
              className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 btn-glow transform hover:scale-110"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search with AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent input-focus-ring transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  selectedFolder === folder
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {folder === 'all' ? 'All' : folder}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-3 space-y-2">
            {filteredNotes.map((note, index) => (
              <div key={note.id} className="list-item-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                <NoteCard
                  note={note}
                  isSelected={selectedNote === note.id}
                  onClick={() => setSelectedNote(note.id)}
                />
              </div>
            ))}
            {filteredNotes.length === 0 && (
              <div className="text-center py-12 slide-up">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                  <Folder size={32} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  No notes found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {currentNote ? (
          <div className="h-full view-transition">
            <NoteEditor note={currentNote} onUpdate={updateNote} onDelete={deleteNote} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-pink-50/30 to-red-50/30 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-red-900/10">
            <div className="text-center slide-up">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-lg neon-glow opacity-50">
                <Sparkles className="text-white" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Select a note or create a new one to get started
              </p>
              <button
                onClick={handleCreateNote}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
              >
                <Plus size={20} />
                Create Your First Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteView;
