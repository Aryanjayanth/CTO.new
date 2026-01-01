import { useEffect, useRef } from 'react';
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
  const viewKeyRef = useRef(0);

  useEffect(() => {
    initDatabase();
    loadSettings();
    loadTasks();
    loadNotes();
    loadEvents();
    loadHabits();
    loadRoutines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  useEffect(() => {
    viewKeyRef.current += 1;
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'tasks':
        return <TaskView key={`tasks-${viewKeyRef.current}`} />;
      case 'notes':
        return <NoteView key={`notes-${viewKeyRef.current}`} />;
      case 'calendar':
        return <CalendarView key={`calendar-${viewKeyRef.current}`} />;
      case 'habits':
        return <HabitView key={`habits-${viewKeyRef.current}`} />;
      case 'timetable':
        return <TimetableView key={`timetable-${viewKeyRef.current}`} />;
      case 'settings':
        return <SettingsView key={`settings-${viewKeyRef.current}`} />;
      default:
        return <TaskView key={`tasks-${viewKeyRef.current}`} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 view-transition">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
