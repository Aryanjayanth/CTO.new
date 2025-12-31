import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { initDatabase } from './database/db';
import Sidebar from './components/Sidebar';
import TaskView from './components/views/TaskView';
import NoteView from './components/views/NoteView';
import CalendarView from './components/views/CalendarView';
import HabitView from './components/views/HabitView';
import TimetableView from './components/views/TimetableView';
import SettingsView from './components/views/SettingsView';

function App() {
  const { currentView, settings, loadTasks, loadNotes, loadEvents, loadHabits, loadRoutines, loadSettings } = useStore();

  useEffect(() => {
    initDatabase();
    loadSettings();
    loadTasks();
    loadNotes();
    loadEvents();
    loadHabits();
    loadRoutines();
  }, []);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const renderView = () => {
    switch (currentView) {
      case 'tasks':
        return <TaskView />;
      case 'notes':
        return <NoteView />;
      case 'calendar':
        return <CalendarView />;
      case 'habits':
        return <HabitView />;
      case 'timetable':
        return <TimetableView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TaskView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
