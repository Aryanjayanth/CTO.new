# Prodify - Your Productivity Companion

A comprehensive, offline-first productivity application built with React, TypeScript, and SQLite.

## 🚀 Features

### ✅ Smart Task Manager
- Create, edit, and delete tasks with priority levels (Low, Medium, High)
- Set due dates with calendar picker
- Break large tasks into subtasks
- Track progress with complete/incomplete status
- Filter tasks by date, priority, or status
- Search tasks by keyword or tag
- Visual priority indicators with color coding

### 📝 Powerful Notes System
- Rich text editing capabilities
- Organize notes into custom folders
- Add custom tags for better organization
- Real-time auto-save functionality
- Search notes by title, content, or tags
- Clean, distraction-free editor interface

### 📆 Dynamic Calendar View
- Monthly calendar view with event visualization
- View tasks and events on specific dates
- Color-coded events by type (Work, Personal, Health, Other)
- Quick navigation between months
- Click to add new events
- Integrated task due dates display

### 🔁 Habit Tracker
- Create and track daily or weekly habits
- Visual check-in system for daily progress
- Streak counter to maintain motivation
- 30-day habit history visualization
- Success rate analytics
- Color-coded habits for easy identification

### 📊 Timetable/Daily Planner
- Hourly time grid (6 AM to 10 PM)
- Create recurring routines for specific days
- Color-coded schedule blocks
- Weekly view with day selection
- Visual time management

### 💾 Local Storage & Backup
- All data stored locally using browser localStorage (SQLite-compatible API)
- Full offline functionality
- Manual export to JSON format
- Import/restore from backup files
- No internet connection required
- Complete data privacy
- Works in any modern browser

### 🎨 Customizable UI
- Light and Dark mode support
- Clean, minimal design
- Responsive layout
- Smooth transitions and animations
- Customizable color themes
- Keyboard shortcuts support

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Database**: Browser localStorage with SQLite-compatible API
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prodify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🎯 Usage

### Tasks
- Click "New Task" to create a task
- Set title, description, priority, and due date
- Use filters to find specific tasks
- Mark tasks as complete by checking the box

### Notes
- Click the "+" button to create a new note
- Organize notes into folders
- Add tags for better categorization
- All changes are auto-saved

### Calendar
- View all events and task due dates
- Click "New Event" to schedule an event
- Navigate months with arrow buttons
- Color-coded by event type

### Habits
- Create habits you want to track
- Check in daily to mark completion
- View streak count and success rate
- Monitor 30-day history

### Timetable
- Add recurring routines
- Select which days the routine repeats
- Color-code by category
- View your daily schedule

### Settings
- Toggle between light and dark mode
- Export your data for backup
- Import data to restore from backup
- View app information and keyboard shortcuts

## ⌨️ Keyboard Shortcuts

- `Ctrl + T` - New Task
- `Ctrl + N` - New Note
- `Ctrl + F` - Search
- `Ctrl + D` - Toggle Theme

## 📱 Offline Support

Prodify is built to work 100% offline. All data is stored locally in your browser using localStorage, ensuring:
- No internet connection required
- Fast performance
- Complete data privacy
- No data sent to external servers
- Works in any modern browser (Chrome, Firefox, Safari, Edge)

## 🔒 Data Privacy

- All data is stored locally in your browser (localStorage)
- No telemetry or analytics
- No external API calls
- No user tracking
- Complete offline functionality
- Data never leaves your device

## 🚀 Future Features (Planned)

- Smart notifications for deadlines
- Built-in Pomodoro timer
- CSV/PDF export capabilities
- File attachments for notes
- Advanced habit analytics with graphs
- Task dependencies and projects
- Collaboration features (optional cloud sync)

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for productivity enthusiasts
