import React, { createContext, useContext, useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  background: string;
  gridBackground: string;
  gridCellBackground: string;
  lightText: string;
  darkText: string;
  tileColors: {
    [key: number]: {
      background: string;
      text: string;
      backgroundColor: string;
      color: string;
    };
  };
}

const defaultThemes: Theme[] = [
  {
    id: 'classic',
    name: 'Classic',
    background: '#faf8ef',
    gridBackground: '#bbada0',
    gridCellBackground: '#cdc1b4',
    lightText: '#f9f6f2',
    darkText: '#776e65',
    tileColors: {
      2: { background: '#eee4da', text: '#776e65', backgroundColor: '#eee4da', color: '#776e65' },
      4: { background: '#ede0c8', text: '#776e65', backgroundColor: '#ede0c8', color: '#776e65' },
      8: { background: '#f2b179', text: '#f9f6f2', backgroundColor: '#f2b179', color: '#f9f6f2' },
      16: { background: '#f59563', text: '#f9f6f2', backgroundColor: '#f59563', color: '#f9f6f2' },
      32: { background: '#f67c5f', text: '#f9f6f2', backgroundColor: '#f67c5f', color: '#f9f6f2' },
      64: { background: '#f65e3b', text: '#f9f6f2', backgroundColor: '#f65e3b', color: '#f9f6f2' },
      128: { background: '#edcf72', text: '#f9f6f2', backgroundColor: '#edcf72', color: '#f9f6f2' },
      256: { background: '#edcc61', text: '#f9f6f2', backgroundColor: '#edcc61', color: '#f9f6f2' },
      512: { background: '#edc850', text: '#f9f6f2', backgroundColor: '#edc850', color: '#f9f6f2' },
      1024: { background: '#edc53f', text: '#f9f6f2', backgroundColor: '#edc53f', color: '#f9f6f2' },
      2048: { background: '#edc22e', text: '#f9f6f2', backgroundColor: '#edc22e', color: '#f9f6f2' },
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    background: '#000000',
    gridBackground: '#1a1a1a',
    gridCellBackground: '#2d2d2d',
    lightText: '#ffffff',
    darkText: '#e0e0e0',
    tileColors: {
      2: { background: '#4a4a4a', text: '#ffffff', backgroundColor: '#4a4a4a', color: '#ffffff' },
      4: { background: '#5a5a5a', text: '#ffffff', backgroundColor: '#5a5a5a', color: '#ffffff' },
      8: { background: '#f2b179', text: '#ffffff', backgroundColor: '#f2b179', color: '#ffffff' },
      16: { background: '#f59563', text: '#ffffff', backgroundColor: '#f59563', color: '#ffffff' },
      32: { background: '#f67c5f', text: '#ffffff', backgroundColor: '#f67c5f', color: '#ffffff' },
      64: { background: '#f65e3b', text: '#ffffff', backgroundColor: '#f65e3b', color: '#ffffff' },
      128: { background: '#edcf72', text: '#ffffff', backgroundColor: '#edcf72', color: '#ffffff' },
      256: { background: '#edcc61', text: '#ffffff', backgroundColor: '#edcc61', color: '#ffffff' },
      512: { background: '#edc850', text: '#ffffff', backgroundColor: '#edc850', color: '#ffffff' },
      1024: { background: '#edc53f', text: '#ffffff', backgroundColor: '#edc53f', color: '#ffffff' },
      2048: { background: '#edc22e', text: '#ffffff', backgroundColor: '#edc22e', color: '#ffffff' },
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    background: '#e0f7fa',
    gridBackground: '#80deea',
    tileColors: {
      2: { background: '#b2ebf2', text: '#006064', backgroundColor: '#b2ebf2', color: '#006064' },
      4: { background: '#80deea', text: '#006064', backgroundColor: '#80deea', color: '#006064' },
      8: { background: '#4dd0e1', text: '#ffffff', backgroundColor: '#4dd0e1', color: '#ffffff' },
      16: { background: '#26c6da', text: '#ffffff', backgroundColor: '#26c6da', color: '#ffffff' },
      32: { background: '#00bcd4', text: '#ffffff', backgroundColor: '#00bcd4', color: '#ffffff' },
      64: { background: '#00acc1', text: '#ffffff', backgroundColor: '#00acc1', color: '#ffffff' },
      128: { background: '#0097a7', text: '#ffffff', backgroundColor: '#0097a7', color: '#ffffff' },
      256: { background: '#00838f', text: '#ffffff', backgroundColor: '#00838f', color: '#ffffff' },
      512: { background: '#006064', text: '#ffffff', backgroundColor: '#006064', color: '#ffffff' },
      1024: { background: '#004d40', text: '#ffffff', backgroundColor: '#004d40', color: '#ffffff' },
      2048: { background: '#00251a', text: '#ffffff', backgroundColor: '#00251a', color: '#ffffff' },
    },
  },
];

const MAX_CUSTOM_THEMES = 3;
const CUSTOM_THEMES_KEY = 'customThemes';

interface ThemeContextType {
  theme: Theme;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
  addCustomTheme: (theme: Theme) => boolean;
  deleteTheme: (themeId: string) => void;
  customThemeCount: number;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultThemes[0]);
  const [customThemes, setCustomThemes] = useState<Theme[]>(() => {
    const saved = localStorage.getItem(CUSTOM_THEMES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const allThemes = [...defaultThemes, ...customThemes];

  useEffect(() => {
    localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(customThemes));
  }, [customThemes]);

  const addCustomTheme = (newTheme: Theme): boolean => {
    if (customThemes.length >= MAX_CUSTOM_THEMES) {
      return false;
    }

    setCustomThemes(prev => [...prev, newTheme]);
    setTheme(newTheme);
    return true;
  };

  const deleteTheme = (themeId: string) => {
    if (defaultThemes.some(t => t.id === themeId)) {
      return; // Can't delete default themes
    }

    setCustomThemes(prev => prev.filter(t => t.id !== themeId));
    if (theme.id === themeId) {
      setTheme(defaultThemes[0]); // Reset to default theme if current theme is deleted
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themes: allThemes,
      setTheme,
      addCustomTheme,
      deleteTheme,
      customThemeCount: customThemes.length
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}