import { create } from 'zustand';
import { Shutdown } from './types';

export const LINES = {
  red: 'red',
  blue: 'blue',
  orange: 'orange',
  green: 'green',
} as const;

export const CR_LINES = [
  'CR-Fairmount',
  'CR-Fitchburg',
  'CR-Franklin',
  'CR-Greenbush',
  'CR-Haverhill',
  'CR-Kingston',
  'CR-Lowell',
  'CR-Middleborough',
  'CR-Needham',
  'CR-NewBedford',
  'CR-Newburyport',
  'CR-Providence',
  'CR-Worcester',
] as const;

// You can then derive a type from this constant
export type RapidTransitLine = (typeof LINES)[keyof typeof LINES];
export type CommuterRailLine = (typeof CR_LINES)[number];
export type Lines = RapidTransitLine | CommuterRailLine;

// What the line picker and `/$line` route can filter by: a single line, all commuter rail, or everything
export type LineFilter = 'all' | 'commuter-rail' | Lines;

export interface Store {
  selectedLine: LineFilter;
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
  range: 'upcoming',
  setRange: (range: 'all' | 'past' | 'upcoming') => set({ range }),
}));
