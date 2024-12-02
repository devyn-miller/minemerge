import React, { useEffect, useState, useCallback, useReducer } from 'react';
import { Grid } from './components/Grid';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Tile, Direction, GameConfig } from './types/game';
import { createInitialGrid, move, addRandomTile, isGameOver, hasWon, createEmptyGrid } from './utils/gameLogic';
import { Settings, Rotate3D, Share2, Palette, Undo, Redo, Pause, Play } from 'lucide-react';
import { ThemeEditor } from './components/ThemeEditor';
import { GameSettings } from './components/GameSettings';
import { ShareScore } from './components/ShareScore';
import { Footer } from './components/Footer';
import { Tooltip } from './components/Tooltip';
import { BackgroundProvider, useBackground, backgroundThemes } from './contexts/BackgroundContext';
import { AudioProvider, useAudio } from './contexts/AudioContext';

function MineMerge() {
  const { currentTheme, setCurrentTheme } = useBackground();
  const { playBreakSound, toggleBackgroundMusic, isMusicPlaying } = useAudio();
  const [config, setConfig] = useState<GameConfig>({
    gridSize: 4,
    winningTile: 4096,
    theme: currentTheme
  });
  
  // State management for undo/redo
  interface GameState {
    grid: Tile[][];
    score: number;
  }

  type GameAction = 
    | { type: 'MOVE'; grid: Tile[][]; score: number }
    | { type: 'UNDO' }
    | { type: 'REDO' };

  const gameReducer = (state: { 
    present: GameState, 
    past: GameState[], 
    future: GameState[] 
  }, action: GameAction) => {
    switch (action.type) {
      case 'MOVE':
        return {
          present: { grid: action.grid, score: action.score },
          past: [...state.past, state.present],
          future: []
        };
      case 'UNDO':
        if (state.past.length === 0) return state;
        return {
          present: state.past[state.past.length - 1],
          past: state.past.slice(0, -1),
          future: [state.present, ...state.future]
        };
      case 'REDO':
        if (state.future.length === 0) return state;
        return {
          present: state.future[0],
          past: [...state.past, state.present],
          future: state.future.slice(1)
        };
      default:
        return state;
    }
  };

  const [gameState, dispatch] = useReducer(gameReducer, {
    present: { 
      grid: createInitialGrid(config.gridSize), 
      score: 0 
    },
    past: [],
    future: []
  });

  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState<{ points: number; key: number } | null>(null);
  const { theme, themes, setTheme } = useTheme();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMove = useCallback((newGrid: Tile[][], points: number) => {
    const pointsGained = points;
    if (pointsGained > 0) {
      setScoreAnimation({ points: pointsGained, key: Date.now() });
      setTimeout(() => setScoreAnimation(null), 500);
    }
    dispatch({ 
      type: 'MOVE', 
      grid: newGrid, 
      score: gameState.present.score + points 
    });
    if (points > 0) {
      playBreakSound();
    }
  }, [gameState.present.score, playBreakSound]);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const handleRedo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  useEffect(() => {
    const directions: { [key: string]: Direction } = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || won || isMobile) return;
      
      // Ignore if any input element is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'SELECT' ||
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const direction = directions[event.key];
      if (!direction) return;

      event.preventDefault(); // Prevent page scroll on arrow keys

      const { grid: newGrid, moved, score: points } = move(gameState.present.grid, direction);
      if (moved) {
        const gridWithNewTile = addRandomTile(newGrid);
        handleMove(gridWithNewTile, points);
        
        if (hasWon(gridWithNewTile, config.winningTile)) {
          setWon(true);
        } else if (isGameOver(gridWithNewTile)) {
          setGameOver(true);
        }
      }
    };

    if (!isMobile) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameState.present.grid, gameOver, won, config.winningTile, isMobile, handleMove]);

  useEffect(() => {
    if (gameState.present.score > bestScore) {
      setBestScore(gameState.present.score);
    }
  }, [gameState.present.score, bestScore]);

  const resetGame = () => {
    dispatch({ type: 'MOVE', grid: createInitialGrid(config.gridSize), score: 0 });
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    resetGame();
  }, [config.gridSize]);

  const handleConfigChange = (newConfig: GameConfig) => {
    setConfig(newConfig);
    setCurrentTheme(newConfig.theme);
    resetGame();
  };

  const shareGame = () => {
    const shareText = `I scored ${gameState.present.score} points in MineMerge! Can you beat my score? Play at ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'MineMerge Game',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  return (
    <div 
      className={`
        relative min-h-screen flex flex-col items-center justify-center 
        bg-cover bg-center bg-no-repeat 
        ${backgroundThemes[currentTheme].backgroundImage}
      `}
    >
      {/* Light overlay without blur */}
      <div className="absolute inset-0 bg-white/15 z-10"></div>

      <div className="relative z-20 w-full max-w-md px-4">
        {isMobile ? (
          <div className="text-center p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Desktop Required</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This game is designed for desktop use. Please switch to desktop mode or use a computer for the best experience.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              The game requires keyboard controls (arrow keys) which aren't available on mobile devices.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <div className="text-center mb-8">
                <img 
                  className="w-128 h-128 object-contain mx-auto mb-4"
                  src="MineMerge.png" 
                  alt="MineMerge" 
                  width={512}
                  height={512}
                />
                <p className="text-base text-white font-semibold drop-shadow-[0_3px_3px_rgba(0,0,0,1)] font-heading bg-black/50 px-4 py-2 rounded-lg inline-block">
                  Merge Minecraft blocks to create legendary tiles!
                </p>
              </div>

              {/* Score display */}
              <div className="flex justify-center gap-6 mb-8">
                <div className="relative bg-green-600/90 rounded-lg p-4 w-40 shadow-lg transition-transform hover:scale-105 border-2 border-green-700/50 font-pixel">
                  <div className="text-sm font-semibold text-white mb-1">XP Points</div>
                  <div className="text-2xl font-bold text-white">
                    {gameState.present.score.toLocaleString()}
                  </div>
                  {scoreAnimation && (
                    <div 
                      key={scoreAnimation.key}
                      className="absolute -top-4 right-2 text-yellow-300 font-bold animate-fade-up font-pixel"
                    >
                      +{scoreAnimation.points}
                    </div>
                  )}
                </div>
                <div className="bg-blue-600/90 rounded-lg p-4 w-40 shadow-lg transition-transform hover:scale-105 border-2 border-blue-700/50 font-pixel">
                  <div className="text-sm font-semibold text-white mb-1">Best Loot</div>
                  <div className="text-2xl font-bold text-white">
                    {bestScore.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Tooltip text="Settings">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white/95 dark:hover:bg-gray-700/95 transition-all shadow-md hover:shadow-lg group"
                    >
                      <Settings size={22} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300" />
                      <span className="sr-only">Settings</span>
                    </button>
                  </Tooltip>
                </div>

                <Tooltip text="Undo last move">
                  <button
                    onClick={handleUndo}
                    disabled={gameState.past.length === 0}
                    className="p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white/95 dark:hover:bg-gray-700/95 transition-all shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Undo move"
                  >
                    <Undo size={22} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300" />
                    <span className="sr-only">Undo</span>
                  </button>
                </Tooltip>

                <Tooltip text="Redo last move">
                  <button
                    onClick={handleRedo}
                    disabled={gameState.future.length === 0}
                    className="p-3 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white/95 dark:hover:bg-gray-700/95 transition-all shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Redo move"
                  >
                    <Redo size={22} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300" />
                    <span className="sr-only">Redo</span>
                  </button>
                </Tooltip>

                <ShareScore 
                  score={gameState.present.score}
                  bestScore={bestScore}
                  config={config}
                  gameOver={gameOver}
                  won={won}
                  grid={gameState.present.grid}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Grid grid={gameState.present.grid} />
            </div>

            {/* Game over / win overlay */}
            {(gameOver || won) && (
              <div className="mt-8 text-center max-w-sm mx-auto">
                <h2 className={`text-2xl font-bold mb-4 drop-shadow-lg ${won ? 'text-green-400' : 'text-red-400'}`}>
                  {won ? 'You Won!' : 'Game Over!'}
                </h2>
                <Tooltip text="Start a new game">
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-blue-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/90 transition-colors"
                  >
                    Try Again
                  </button>
                </Tooltip>
              </div>
            )}

            {/* Settings modal */}
            {showSettings && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl relative">
                  <GameSettings
                    config={config}
                    onConfigChange={handleConfigChange}
                    onClose={() => setShowSettings(false)}
                  />
                  <Tooltip text="Close settings">
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl font-bold"
                    >
                      ×
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}

            {/* Theme editor modal */}
            {showThemeEditor && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <ThemeEditor onClose={() => setShowThemeEditor(false)} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BackgroundProvider>
        <AudioProvider>
          <div className="min-h-screen flex flex-col">
            <div className="flex-grow relative">
              <MineMerge />
            </div>
            <div className="relative z-10">
              <Footer />
            </div>
          </div>
        </AudioProvider>
      </BackgroundProvider>
    </ThemeProvider>
  );
}