import React, { useEffect, useState } from 'react';
import { Tile as TileType } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';

// Import Minecraft block images
import dirtImage from './images/dirt.png';
import cobblestoneImage from './images/cobblestone.png';
import deepslateImage from './images/deepslate.png';
import redstoneImage from './images/Block_of_Redstone_JE2_BE2.png';
import ironBlockImage from './images/iron.png';
import goldBlockImage from './images/Block_of_Gold_JE6_BE3.png';
import diamondBlockImage from './images/Block_of_Diamond_JE6_BE3.png';
import emeraldBlockImage from './images/Block_of_Emerald_JE4_BE3.png';
import netheriteBlockImage from './images/Block_of_Netherite_JE1_BE1.png';
import pinkCoralBlockImage from './images/pink-coral.png';
import beaconImage from './images/beacon.png';
import endStoneImage from './images/end-stone.png';
import obsidianImage from './images/obsidian.webp';
import dragonImage from './images/dragon.png';

// Mapping of tile values to Minecraft block images
const MINECRAFT_BLOCK_IMAGES: { [key: number]: string } = {
  2: dirtImage,
  4: cobblestoneImage,
  8: deepslateImage,
  16: redstoneImage,
  32: ironBlockImage,
  64: goldBlockImage,
  128: diamondBlockImage,
  256: emeraldBlockImage,
  512: netheriteBlockImage,
  1024: pinkCoralBlockImage,
  2048: beaconImage,
  4096: endStoneImage,
  8192: obsidianImage,
  16384: dragonImage
};

// Minecraft-inspired color palette for tiles
const MINECRAFT_TILE_COLORS = {
  2: 'bg-[#8BC34A]', // Light green (grass block)
  4: 'bg-[#4CAF50]', // Darker green
  8: 'bg-[#FF9800]', // Orange (like terracotta)
  16: 'bg-[#FF5722]', // Deep orange
  32: 'bg-[#F44336]', // Red (like redstone block)
  64: 'bg-[#9C27B0]', // Purple (like amethyst)
  128: 'bg-[#673AB7]', // Deep purple
  256: 'bg-[#3F51B5]', // Indigo
  512: 'bg-[#2196F3]', // Blue
  1024: 'bg-[#00BCD4]', // Cyan
  2048: 'bg-[#009688]', // Teal (like emerald block)
  4096: 'bg-[#4CAF50]', // Green
  8192: 'bg-[#795548]', // Brown (like dirt)
  16384: 'bg-[#607D8B]', // Gray (like stone)
};

interface TileProps {
  tile: TileType;
  cellSize: number;
  gap: number;
}

export function Tile({ tile, cellSize, gap }: TileProps) {
  const { value, position, merging } = tile;
  const blockImage = MINECRAFT_BLOCK_IMAGES[value];
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (merging) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [merging]);

  // Determine text color based on tile value
  const getTextColor = (tileValue: number) => {
    return 'text-white'; // Always use white text
  };

  const tileStyle = {
    border: '4px solid transparent', // Base border
    borderImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Crect width='4' height='4' fill='%23000000' /%3E%3Crect x='8' width='4' height='4' fill='%23000000' /%3E%3Crect y='8' width='4' height='4' fill='%23000000' /%3E%3Crect x='8' y='8' width='4' height='4' fill='%23000000' /%3E%3C/svg%3E") 4 repeat`,
    borderImageSlice: 4,
    boxShadow: '2px 2px 4px rgba(0,0,0,0.3)', // Slight 3D effect
    backgroundColor: 'rgba(255,255,255,0.1)', // Slight background to mimic block depth
    transform: `translate(${position.col * (cellSize + gap)}px, ${position.row * (cellSize + gap)}px) scale(${merging ? 1.1 : 1})`, // Slight scale effect on merge
    transition: 'all 200ms ease-in-out',
    position: 'absolute' as const,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    left: -2,
    top: 0,
  };

  const blockStyle = {
    width: '90%',
    height: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: blockImage ? `url(${blockImage})` : MINECRAFT_TILE_COLORS[value as keyof typeof MINECRAFT_TILE_COLORS] || 'bg-gray-300',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: '2px solid rgba(0,0,0,0.2)', // Inner border for block depth
    boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.2)', // Inner shadow for block depth
    position: 'relative', // Add relative positioning
  };

  const valueStyle = {
    position: 'absolute',
    bottom: '-1px', // Slightly lower
    right: '8px', // Slightly lower
    fontSize: '16px', // Reduced font size
    fontWeight: 'bold',
    color: 'white',
    textShadow: '2px 2px 3px rgba(0,0,0,0.6)', // Slightly stronger shadow
    zIndex: 10,
  };

  return (
    <div 
      style={tileStyle}
      className={`tile-container ${isAnimating ? 'animate-merge' : ''}`}
    >
      <div 
        style={blockStyle} 
        className={`tile-block relative flex items-center justify-center`}
      >
        {value > 1 && (
          <span style={valueStyle} className="absolute bottom-1 right-1">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}