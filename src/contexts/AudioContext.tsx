import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import breakBlocksSound from '../components/audio/break-blocks.mp3';
import backgroundMusic from '../components/audio/bckgrd-music.mp3';

interface AudioContextType {
  playBreakSound: () => void;
  toggleBackgroundMusic: () => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  effectsVolume: number;
  setEffectsVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.2);
  const [effectsVolume, setEffectsVolume] = useState(1);
  const breakSoundRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = musicVolume;
      bgMusicRef.current.loop = true;
      console.log('Background music initialized with volume:', musicVolume);
    }
    if (breakSoundRef.current) {
      breakSoundRef.current.volume = effectsVolume;
      console.log('Break sound initialized with volume:', effectsVolume);
    }
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = musicVolume;
      console.log('Music volume changed to:', musicVolume);
      
      // Try to play if it should be playing
      if (isMusicPlaying && musicVolume > 0) {
        console.log('Attempting to play music after volume change');
        const playPromise = bgMusicRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log('Music started playing successfully'))
            .catch(error => console.log('Music play prevented:', error));
        }
      }
    }
  }, [musicVolume]);

  useEffect(() => {
    if (breakSoundRef.current) {
      breakSoundRef.current.volume = effectsVolume;
      console.log('Effects volume changed to:', effectsVolume);
    }
  }, [effectsVolume]);

  // Handle music playing state
  useEffect(() => {
    if (bgMusicRef.current) {
      console.log('Music playing state changed:', isMusicPlaying);
      if (isMusicPlaying && musicVolume > 0) {
        console.log('Attempting to play music');
        const playPromise = bgMusicRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log('Music started playing successfully'))
            .catch(error => console.log('Music play prevented:', error));
        }
      } else {
        console.log('Pausing music');
        bgMusicRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  const toggleBackgroundMusic = () => {
    console.log('Toggling background music. Current state:', isMusicPlaying);
    if (bgMusicRef.current) {
      if (isMusicPlaying) {
        bgMusicRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        console.log('Attempting to play music on toggle');
        const playPromise = bgMusicRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Music started playing successfully on toggle');
              setIsMusicPlaying(true);
            })
            .catch(error => {
              console.log('Music toggle prevented:', error);
              setIsMusicPlaying(false);
            });
        } else {
          setIsMusicPlaying(true);
        }
      }
    }
  };

  const playBreakSound = () => {
    if (breakSoundRef.current && effectsVolume > 0) {
      // Set the time to start from 1.82 seconds
      breakSoundRef.current.currentTime = 1.82;
      
      // Add event listener to stop at 2.0 seconds
      const handleTimeUpdate = () => {
        if (breakSoundRef.current && breakSoundRef.current.currentTime >= 2.0) {
          breakSoundRef.current.pause();
          breakSoundRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
      
      breakSoundRef.current.addEventListener('timeupdate', handleTimeUpdate);
      
      console.log('Playing break sound clip 1.82s-2.0s');
      const playPromise = breakSoundRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('Break sound clip started'))
          .catch(error => {
            console.log('Break sound prevented:', error);
            breakSoundRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
          });
      }
    }
  };

  return (
    <AudioContext.Provider 
      value={{ 
        playBreakSound, 
        toggleBackgroundMusic,
        isMusicPlaying,
        setIsMusicPlaying,
        musicVolume,
        setMusicVolume,
        effectsVolume,
        setEffectsVolume,
      }}
    >
      <audio
        ref={bgMusicRef}
        src={backgroundMusic}
        loop
        preload="auto"
      />
      <audio
        ref={breakSoundRef}
        src={breakBlocksSound}
        preload="auto"
      />
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
