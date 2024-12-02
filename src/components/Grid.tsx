import React, { useEffect, useRef } from 'react';
import { Tile as TileComponent } from './Tile';
import { Tile } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';

interface GridProps {
  grid: Tile[][];
}

export function Grid({ grid }: GridProps) {
  const { theme } = useTheme();
  const gridRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const minSwipeDistance = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) >= minSwipeDistance) {
          const event = new KeyboardEvent('keydown', {
            key: deltaX > 0 ? 'ArrowRight' : 'ArrowLeft'
          });
          window.dispatchEvent(event);
        }
      } else {
        if (Math.abs(deltaY) >= minSwipeDistance) {
          const event = new KeyboardEvent('keydown', {
            key: deltaY > 0 ? 'ArrowDown' : 'ArrowUp'
          });
          window.dispatchEvent(event);
        }
      }

      touchStartRef.current = null;
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('touchstart', handleTouchStart);
      gridElement.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('touchstart', handleTouchStart);
        gridElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  const size = grid.length;
  const containerSize = Math.min(400, window.innerWidth - 32); // Responsive but with max size
  const gap = Math.floor(containerSize * 0.02); // 2% of container size
  const padding = Math.floor(containerSize * 0.03); // 3% of container size
  const totalGaps = size - 1;
  const availableSpace = containerSize - (2 * padding) - (gap * totalGaps);
  const cellSize = Math.floor(availableSpace / size);
  
  return (
    <div 
      ref={gridRef}
      className="relative rounded-lg overflow-hidden mx-auto"
      style={{ 
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        padding: `${padding}px`,
        background: 'linear-gradient(45deg, #1a1a1a, #2c2c2c)',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        border: '8px solid #0a0a0a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Grid background cells */}
      <div 
        className="grid absolute"
        style={{ 
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gap: `${gap}px`,
          padding: `${padding}px`,
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
        }}
      >
        {Array(size * size).fill(null).map((_, i) => (
          <div
            key={i}
            className="rounded-lg"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              border: '3px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
            }}
          />
        ))}
      </div>
      
      {/* Tiles */}
      <div 
        className="absolute"
        style={{ 
          width: `${size * (cellSize + gap) - gap}px`,
          height: `${size * (cellSize + gap) - gap}px`,
          padding: `${padding}px`,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {grid.flat().map((tile) => 
          tile && (
            <TileComponent 
              key={tile.id} 
              tile={tile}
              cellSize={cellSize}
              gap={gap}
            />
          )
        )}
      </div>
    </div>
  );
}