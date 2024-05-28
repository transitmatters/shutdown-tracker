import { create } from 'zustand';
import { Shutdown } from './types';

export const LINES = {
  red: 'red',
  blue: 'blue',
  orange: 'orange',
  green: 'green',
} as const;

// You can then derive a type from this constant
export type Lines = (typeof LINES)[keyof typeof LINES];

export interface Store {
  selectedLine: 'all' | Lines;
  setLine: (line: Store['selectedLine']) => void;
  darkMode?: boolean;
  setDarkMode: (mode: boolean) => void;
  details?: { shutdown: Shutdown; line: Lines };
  setDetails: (details: Shutdown, line: Lines) => void;
  range: 'all' | 'past' | 'upcoming';
  setRange: (range: 'all' | 'past' | 'upcoming') => void;
}

export const useStore = create<Store>((set) => ({
  selectedLine: 'all',
  setLine: (line: Store['selectedLine']) => set({ selectedLine: line }),
  setDarkMode: (mode: boolean) => set({ darkMode: mode }),
  setDetails: (shutdown: Shutdown, line: Lines) => set({ details: { shutdown, line } }),
  range: 'all',
  setRange: (range: 'all' | 'past' | 'upcoming') => set({ range }),
}));
