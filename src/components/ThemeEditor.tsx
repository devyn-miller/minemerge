import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ColorPicker } from './ColorPicker';
import { Theme } from '../types/theme';
import { Tooltip } from './Tooltip';

interface ThemeEditorProps {
  onClose: () => void;
}

export function ThemeEditor({ onClose }: ThemeEditorProps) {
  const { theme: currentTheme, addCustomTheme, customThemeCount } = useTheme();
  const [editedTheme, setEditedTheme] = useState<Theme>(() => {
    const filteredTileColors = { ...currentTheme.tileColors };
    return {
      ...currentTheme,
      tileColors: filteredTileColors
    };
  });
  const [themeName, setThemeName] = useState('Custom ' + currentTheme.name);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const filteredTileColors = { ...currentTheme.tileColors };
    setEditedTheme({
      ...currentTheme,
      tileColors: filteredTileColors
    });
    setThemeName('Custom ' + currentTheme.name);
  }, [currentTheme]);

  const handleSave = () => {
    if (!themeName.trim()) {
      setError('Theme name cannot be empty');
      return;
    }

    if (customThemeCount >= 3) {
      setError('Maximum number of custom themes reached. Please delete a theme before creating a new one.');
      return;
    }

    const newTheme = {
      ...editedTheme,
      id: 'custom-' + Date.now(),
      name: themeName.trim(),
    };

    const success = addCustomTheme(newTheme);
    if (success) {
      setHasUnsavedChanges(false);
      onClose();
    } else {
      setError('Failed to save theme. Maximum number of custom themes reached.');
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const updateTileColor = (value: number, color: string, isBackground: boolean) => {
    setHasUnsavedChanges(true);
    setEditedTheme(prev => ({
      ...prev,
      tileColors: {
        ...prev.tileColors,
        [value]: {
          ...prev.tileColors[value],
          [isBackground ? 'backgroundColor' : 'color']: color,
          [isBackground ? 'background' : 'text']: color
        }
      }
    }));
  };

  const handleThemeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeName(e.target.value);
    setError(null);
    setHasUnsavedChanges(true);
  };

  const handleColorChange = (color: string, type: string) => {
    setHasUnsavedChanges(true);
    setEditedTheme(prev => ({ ...prev, [type]: color }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold">Theme Editor</h2>
        <Tooltip text="Close theme editor">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close theme editor"
          >
            ×
          </button>
        </Tooltip>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Theme Name
          </label>
          <input
            type="text"
            value={themeName}
            onChange={handleThemeNameChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter theme name"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grid Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">Grid Background</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <ColorPicker
                    color={editedTheme.gridBackground}
                    onChange={(color) => handleColorChange(color, 'gridBackground')}
                  />
                </div>
                <div 
                  className="w-10 h-10 rounded shadow-sm"
                  style={{ backgroundColor: editedTheme.gridBackground }}
                />
              </div>
            </div>
            <div className="border rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">Cell Background</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <ColorPicker
                    color={editedTheme.gridCellBackground}
                    onChange={(color) => handleColorChange(color, 'gridCellBackground')}
                  />
                </div>
                <div 
                  className="w-10 h-10 rounded shadow-sm"
                  style={{ backgroundColor: editedTheme.gridCellBackground }}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Text Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">Light Text Color</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <ColorPicker
                    color={editedTheme.lightText}
                    onChange={(color) => handleColorChange(color, 'lightText')}
                  />
                </div>
                <div 
                  className="w-10 h-10 rounded shadow-sm"
                  style={{ backgroundColor: editedTheme.lightText }}
                />
              </div>
            </div>
            <div className="border rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">Dark Text Color</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <ColorPicker
                    color={editedTheme.darkText}
                    onChange={(color) => handleColorChange(color, 'darkText')}
                  />
                </div>
                <div 
                  className="w-10 h-10 rounded shadow-sm"
                  style={{ backgroundColor: editedTheme.darkText }}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tile Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(editedTheme.tileColors)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([value, colors]) => (
                <div key={value} className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <label className="block text-lg font-medium text-gray-900">Tile {value}</label>
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center shadow-sm text-xl"
                      style={{ 
                        backgroundColor: colors.backgroundColor || colors.background,
                        color: colors.color || colors.text,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Background Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <ColorPicker
                            color={colors.backgroundColor || colors.background}
                            onChange={(color) => updateTileColor(Number(value), color, true)}
                          />
                        </div>
                        <div 
                          className="w-10 h-10 rounded shadow-sm"
                          style={{ backgroundColor: colors.backgroundColor || colors.background }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Text Color
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <ColorPicker
                            color={colors.color || colors.text}
                            onChange={(color) => updateTileColor(Number(value), color, false)}
                          />
                        </div>
                        <div 
                          className="w-10 h-10 rounded shadow-sm"
                          style={{ backgroundColor: colors.color || colors.text }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t mt-8">
        <Tooltip text="Discard changes and close">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </Tooltip>
        <Tooltip text="Save theme changes">
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 text-white rounded-lg transition-colors font-medium ${
              customThemeCount >= 3
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
            }`}
            disabled={customThemeCount >= 3}
          >
            {hasUnsavedChanges ? 'Save Changes' : 'Save Theme'}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}