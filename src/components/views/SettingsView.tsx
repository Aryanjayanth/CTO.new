import { Download, Upload, Moon, Sun, Database } from 'lucide-react';
import { useStore } from '../../store/useStore';

const SettingsView = () => {
  const { settings, updateSettings, exportData, importData } = useStore();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prodify-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string;
        importData(data);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings('theme', newTheme);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Appearance
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.theme === 'light' ? (
                    <Sun className="text-yellow-500" size={24} />
                  ) : (
                    <Moon className="text-blue-500" size={24} />
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Theme</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Current: {settings.theme === 'light' ? 'Light' : 'Dark'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Toggle Theme
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Data Management
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Download className="text-primary-600" size={24} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Export Data</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Download all your data as a JSON file
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  <span>Export Backup</span>
                </button>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Upload className="text-primary-600" size={24} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Import Data</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Restore data from a backup file
                    </div>
                  </div>
                </div>
                <label className="block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer text-center">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <Upload size={18} />
                    <span>Choose Backup File</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Storage Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Database size={20} className="text-primary-600" />
                <div>
                  <div className="font-medium">Browser localStorage</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    All data stored locally in your browser
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
                  <div className="font-medium">✓ 100% Offline</div>
                </div>
                <div className="text-sm text-green-700 dark:text-green-500 mt-1">
                  Your data never leaves your device. No internet connection required.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              About Prodify
            </h3>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Platform:</strong> Web Application (Works Offline)</p>
              <p><strong>Storage:</strong> Browser localStorage</p>
              <p><strong>Features:</strong> Tasks, Notes, Calendar, Habits, Timetable</p>
              <p className="pt-2 text-primary-600 dark:text-primary-400">
                Built with React, TypeScript, and localStorage for maximum performance and offline capability.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Keyboard Shortcuts
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">New Task</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                  Ctrl + T
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">New Note</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                  Ctrl + N
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Search</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                  Ctrl + F
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 dark:text-gray-300">Toggle Theme</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                  Ctrl + D
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
