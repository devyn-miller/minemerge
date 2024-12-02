import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeEditor } from './ThemeEditor';
import { Palette } from 'lucide-react';
import { Tooltip } from './Tooltip';

export function ThemeSelector() {
  const { theme: currentTheme, themes, setTheme } = useTheme();
  const [showThemeEditor, setShowThemeEditor] = useState(false);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = themes.find(t => t.id === event.target.value);
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <Tooltip text="Select a color theme">
        <select
          value={currentTheme.id}
          onChange={handleThemeChange}
          className="appearance-none px-4 py-2 pr-8 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg cursor-pointer font-medium text-gray-700 dark:text-gray-300"
        >
          {themes.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </Tooltip>
      
      <Tooltip text="Customize theme colors">
        <button
          onClick={() => setShowThemeEditor(true)}
          className="p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg group"
          aria-label="Edit themes"
        >
          <Palette size={22} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300" />
        </button>
      </Tooltip>

      {showThemeEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ThemeEditor onClose={() => setShowThemeEditor(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
