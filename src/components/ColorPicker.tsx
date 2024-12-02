import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color);

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.match(/^#([0-9A-Fa-f]{6})$/)) {
      onChange(value);
    }
  };

  const handleColorChange = (value: string) => {
    setInputValue(value);
    onChange(value);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-600">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={inputValue}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-10 h-10 p-1 rounded border cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-2 py-1 text-sm border rounded font-mono"
          pattern="^#([A-Fa-f0-9]{6})$"
        />
      </div>
    </div>
  );
}