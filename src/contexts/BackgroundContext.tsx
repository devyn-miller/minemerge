import React, { createContext, useContext, useState } from 'react';

interface BackgroundTheme {
  name: string;
  backgroundImage: string;
  textColor: string;
}

export const backgroundThemes = {
  mountainCaverns: {
    name: 'Mountain Caverns',
    backgroundImage: 'bg-[url("/backgrounds/Mountain-Caverns.jpg")]',
    textColor: '#B8E3FF',
  },
  junglewood: {
    name: 'Junglewood Grove',
    backgroundImage: 'bg-[url("/backgrounds/Junglewood-Grove.png")]',
    textColor: '#E2D3BC',
  },
  mobsMines: {
    name: 'Mobs & Mines',
    backgroundImage: 'bg-[url("/backgrounds/Mobs-and-Mines.jpeg")]',
    textColor: '#FFE8B6',
  },
  sunsetSanctuary: {
    name: 'Sunset Sanctuary',
    backgroundImage: 'bg-[url("/backgrounds/sunset-sanctuary.jpg")]',
    textColor: '#FFD700',
  }
};

interface BackgroundContextType {
  currentTheme: keyof typeof backgroundThemes;
  setCurrentTheme: (theme: keyof typeof backgroundThemes) => void;
}

const BackgroundContext = createContext<BackgroundContextType | null>(null);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof backgroundThemes>('mountainCaverns');

  return (
    <BackgroundContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
