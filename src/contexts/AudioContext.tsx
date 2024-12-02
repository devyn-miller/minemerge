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
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [effectsVolume, setEffectsVolume] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const breakSoundRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  useEffect(() => {
    if (breakSoundRef.current) {
      breakSoundRef.current.volume = effectsVolume;
    }
  }, [effectsVolume]);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (bgMusicRef.current && isMusicPlaying) {
          bgMusicRef.current.play().catch(error => {
            console.log('Music play prevented:', error);
            setIsMusicPlaying(false);
          });
        }
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted, isMusicPlaying]);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = musicVolume;
      if (hasInteracted && isMusicPlaying) {
        bgMusicRef.current.play().catch(error => {
          console.log('Music play prevented:', error);
          setIsMusicPlaying(false);
        });
      }
    }
  }, [hasInteracted, isMusicPlaying, musicVolume]);

  const toggleBackgroundMusic = () => {
    if (bgMusicRef.current) {
      if (isMusicPlaying) {
        bgMusicRef.current.pause();
        setIsMusicPlaying(false);
      } else if (musicVolume > 0) {
        bgMusicRef.current.play().catch(error => {
          console.log('Music toggle prevented:', error);
        });
        setIsMusicPlaying(true);
      }
    }
  };

  const playBreakSound = () => {
    if (breakSoundRef.current && effectsVolume > 0) {
      breakSoundRef.current.currentTime = 0;
      breakSoundRef.current.play().catch(error => {
        console.log('Break sound play prevented:', error);
      });
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

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
