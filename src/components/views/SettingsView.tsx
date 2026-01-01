import { Download, Upload, Moon, Sun, Database, Settings as SettingsIcon, Keyboard, Info } from 'lucide-react';
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
        alert('Failed to import data. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings('theme', newTheme);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="glass border-b border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center shadow-lg neon-glow">
            <SettingsIcon className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize your experience
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Appearance */}
          <div className="gradient-border card-hover">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Info className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Appearance
                </h3>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    settings.theme === 'light'
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {settings.theme === 'light' ? (
                      <Sun className="text-white" size={24} />
                    ) : (
                      <Moon className="text-gray-600 dark:text-gray-400" size={24} />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100">Theme</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {settings.theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
                >
                  {settings.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  <span>Toggle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="gradient-border card-hover">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Database className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Data Management
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                      <Download className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">Export Data</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Download all your data as JSON
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 btn-glow transform hover:scale-105"
                  >
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                      <Upload className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">Import Data</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Restore from backup file
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 btn-glow transform hover:scale-105 cursor-pointer">
                    <Upload size={18} />
                    <span>Import</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="gradient-border card-hover">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                  <Database className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Storage Information
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Database className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-green-800 dark:text-green-400 mb-1">
                      ✓ 100% Offline
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-500">
                      Your data never leaves your device. Stored locally in browser localStorage.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="gradient-border card-hover">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Keyboard className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Keyboard Shortcuts
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'New Task', shortcut: 'Ctrl + T' },
                  { label: 'New Note', shortcut: 'Ctrl + N' },
                  { label: 'Search', shortcut: 'Ctrl + F' },
                  { label: 'Toggle Theme', shortcut: 'Ctrl + D' },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 list-item-enter"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {item.label}
                    </span>
                    <kbd className="px-3 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                      {item.shortcut}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="gradient-border card-hover">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Info className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  About Prodify
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-purple-500"></div>
                  <div className="flex-1">
                    <span className="text-gray-600 dark:text-gray-400">Version:</span>
                    <span className="ml-2 font-bold text-gray-900 dark:text-gray-100">2.0.0</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="flex-1">
                    <span className="text-gray-600 dark:text-gray-400">Platform:</span>
                    <span className="ml-2 font-bold text-gray-900 dark:text-gray-100">Web Application (Works Offline)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500"></div>
                  <div className="flex-1">
                    <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                    <span className="ml-2 font-bold text-gray-900 dark:text-gray-100">Browser localStorage</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 mt-4">
                  <div className="flex-1 text-center">
                    <p className="text-purple-700 dark:text-purple-400 font-semibold">
                      ✨ High-Tech Productivity Platform ✨
                    </p>
                    <p className="text-purple-600 dark:text-purple-500 text-xs mt-1">
                      Built with React, TypeScript, and Tailwind CSS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
