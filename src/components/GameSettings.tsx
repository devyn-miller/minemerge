import React, { useState } from 'react';
import { GameConfig } from '../types/game';
import { Save } from 'lucide-react';
import { useBackground, backgroundThemes } from '../contexts/BackgroundContext';
import { useAudio } from '../contexts/AudioContext';

interface GameSettingsProps {
  config: GameConfig;
  onConfigChange: (newConfig: GameConfig) => void;
  onClose: () => void;
}

export function GameSettings({ config, onConfigChange, onClose }: GameSettingsProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const [hasChanges, setHasChanges] = useState(false);
  const { setCurrentTheme } = useBackground();
  const { 
    musicVolume, 
    setMusicVolume, 
    effectsVolume, 
    setEffectsVolume,
    toggleBackgroundMusic,
    isMusicPlaying
  } = useAudio();

  const handleGridSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value);
    const newConfig = { ...localConfig, gridSize: newSize };
    setLocalConfig(newConfig);
    setHasChanges(true);
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as keyof typeof backgroundThemes;
    const newConfig = { ...localConfig, theme: newTheme };
    setLocalConfig(newConfig);
    setCurrentTheme(newTheme);
    setHasChanges(true);
  };

  const handleTargetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTarget = parseInt(event.target.value);
    const newConfig = { ...localConfig, winningTile: newTarget };
    setLocalConfig(newConfig);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    onConfigChange(localConfig);
    setHasChanges(false);
    onClose();
  };

  const winningTileOptions = [1024, 2048, 4096, 8192, 16384];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Game Settings</h2>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Grid Size</h3>
        <div className="flex items-center gap-2">
          <select
            value={localConfig.gridSize}
            onChange={handleGridSizeChange}
            className="bg-opacity-50 bg-black text-white rounded px-2 py-1"
          >
            <option value={4}>4x4</option>
            <option value={5}>5x5</option>
            <option value={6}>6x6</option>
            <option value={8}>8x8</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Winning Tile</h3>
        <div className="flex items-center gap-2">
          <select
            value={localConfig.winningTile}
            onChange={handleTargetChange}
            className="bg-opacity-50 bg-black text-white rounded px-2 py-1"
          >
            {winningTileOptions.map(target => (
              <option key={target} value={target}>
                {target.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Background Theme</h3>
        <div className="flex items-center gap-2">
          <select
            value={localConfig.theme}
            onChange={handleThemeChange}
            className="bg-opacity-50 bg-black text-white rounded px-2 py-1"
          >
            {Object.entries(backgroundThemes).map(([key, theme]) => (
              <option key={key} value={key}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800">Audio Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-800 mr-4">Background Music</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={musicVolume * 100}
                onChange={(e) => setMusicVolume(parseInt(e.target.value) / 100)}
                className="w-32 mr-2 accent-green-600"
              />
              <span className="text-gray-800 w-8 text-right">{Math.round(musicVolume * 100)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-800 mr-4">Sound Effects</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={effectsVolume * 100}
                onChange={(e) => setEffectsVolume(parseInt(e.target.value) / 100)}
                className="w-32 mr-2 accent-green-600"
              />
              <span className="text-gray-800 w-8 text-right">{Math.round(effectsVolume * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="flex justify-end">
          <button
            onClick={handleSaveChanges}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}