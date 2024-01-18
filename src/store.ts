import { create } from 'zustand';

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
}

export const useStore = create<Store>((set) => ({
  selectedLine: 'red',
  setLine: (line: Store['selectedLine']) => set({ selectedLine: line }),
  setDarkMode: (mode: boolean) => set({ darkMode: mode }),
}));
