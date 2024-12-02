import React, { useState } from 'react';
import { GameConfig, Tile } from '../types/game';
import { Info, Share2 } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface ShareScoreProps {
  score: number;
  bestScore: number;
  config: GameConfig;
  gameOver: boolean;
  won: boolean;
  grid: Tile[][];
}

export function ShareScore({ score, bestScore, config, gameOver, won, grid }: ShareScoreProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  const getLargestTile = () => {
    let max = 0;
    grid.forEach(row => {
      row.forEach(tile => {
        if (tile && tile.value > max) {
          max = tile.value;
        }
      });
    });
    return max;
  };

  const getStatusEmoji = () => {
    if (won) return '🏆';
    if (gameOver) return '💥';
    return '⛏️';
  };

  const getTileNameFromValue = (value: number) => {
    const minecraftTiles = {
              1: 'Dirt Block',
    2: 'Dirt',
    4: 'Cobblestone',
    8: 'Deepslate',
    16: 'Redstone',
    32: 'Iron Block',
    64: 'Gold Block',
    128: 'Diamond Block',
    256: 'Emerald Block',
    512: 'Netherite Block',
    1024: 'Pink Coral Block',
    2048: 'Beacon',
    4096: 'End Stone',
    8192: 'Obsidian',
    16384: 'Ender Dragon',
    };
    return minecraftTiles[value] || `Unknown Block (${value})`;
  };

  const handleShare = async () => {
    const largestTile = getLargestTile();
    const largestTileName = getTileNameFromValue(largestTile);
    const gameStatus = won ? "Crafted the Ultimate Block!" : gameOver ? "Creeper Destroyed Your World!" : "Mining in Progress";
    
    const shareText = `${getStatusEmoji()} ${gameStatus}
    🏅 My Score: ${score}
    🏆 High Score: ${bestScore}
    🎉 Largest Tile: ${largestTileName}
    📐 Grid Size: ${config.gridSize}x${config.gridSize}
    🎯 Goal Block: ${getTileNameFromValue(config.winningTile)} (${config.winningTile})
    
Craft strategically and become a MineMerge legend! Visit ${window.location.href} to play!`

    const shareData = {
      title: '🧱 MineMerge Results ⛏️',
      text: shareText,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Block Collection copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const GameInstructions = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-stone-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] relative text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-emerald-400">🧱 MineMerge 🎮</h2>
          <div className="relative z-[200]">
            <Tooltip text="Close instructions">
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-red-400 hover:text-red-600 text-2xl"
              >
                ×
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <p className="font-semibold text-lg text-yellow-400">🏆 Mining Objective</p>
          <p>Combine Minecraft blocks to reach the legendary {getTileNameFromValue(config.winningTile)} on a {config.gridSize}×{config.gridSize} crafting grid!</p>
          
          <p className="font-semibold text-lg mt-4 text-yellow-400">🧨 Block Merging Rules</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use arrow keys (←↑→↓) to slide and merge blocks</li>
            <li>Blocks with the same type merge into a rarer block</li>
            <li>After each move, a new basic block appears in a random empty cell</li>
            <li>Game ends when no more merges are possible or you craft the {getTileNameFromValue(config.winningTile)}</li>
          </ul>

          <p className="font-semibold text-lg mt-4 text-yellow-400">⛏️ Mining Strategies</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep your rarest block in a corner</li>
            <li>Plan block merges to create legendary items</li>
            <li>Use grid edges like cave walls to your advantage</li>
            <li>Think like a Minecraft master crafter!</li>
          </ul>

          <p className="font-semibold text-lg mt-4 text-yellow-400">🌍 World Customization</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Grid Size: Choose your world dimensions (4×4 to 8×8)</li>
            <li>Ultimate Goal: Set your crafting target from basic blocks to legendary items</li>
          </ul>

          <p className="mt-4 text-sm text-gray-300">
            💡 Pro Miner Tip: Every block merge counts! Craft strategically and become a Minecraft 2048 legend!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Tooltip text="Share your game score">
        <button
          onClick={handleShare}
          className="p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg group"
          aria-label="Share score"
        >
          <Share2 size={22} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300" />
          <span className="sr-only">Share</span>
        </button>
      </Tooltip>

      <Tooltip text="View game instructions">
        <button
          onClick={() => setShowInstructions(true)}
          className="p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg group"
          aria-label="Game instructions"
        >
          <Info size={22} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300" />
          <span className="sr-only">Instructions</span>
        </button>
      </Tooltip>

      {showInstructions && <GameInstructions />}
    </>
  );
}
