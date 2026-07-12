'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface BrutalistSelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

interface BrutalistSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: BrutalistSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function BrutalistSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  className = '',
  disabled = false,
}: BrutalistSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-10 px-4 py-1 flex items-center justify-between bg-white border-2 border-black rounded-lg text-sm font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all outline-none 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:ring-2 focus:ring-black'}`}
      >
        <span className="truncate mr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-black flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)] max-h-60 overflow-y-auto">
          <ul className="py-1">
            <li
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer text-sm font-bold border-b border-gray-200 transition-colors"
            >
              {placeholder}
            </li>
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 hover:bg-black hover:text-white cursor-pointer transition-colors border-b border-gray-200 last:border-b-0
                  ${value === option.value ? 'bg-gray-100' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{option.label}</span>
                  {option.subLabel && (
                    <span className="text-xs font-medium opacity-80">
                      {option.subLabel}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
