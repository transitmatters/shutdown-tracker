import { Lines } from './store';

export const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export type ColorsToStyle = {
  [K in Lines | 'all']: { bg: string; ring: string; hover: string; border: string };
};

export const colorToStyle: ColorsToStyle = {
  red: {
    bg: 'bg-mbta-red',
    ring: 'ring-mbta-darkRed',
    hover: 'hover:ring-mbta-darkRed',
    border: 'border-mbta-red',
  },
  green: {
    ring: 'ring-mbta-darkGreen',
    bg: 'bg-mbta-green',
    hover: 'hover:ring-mbta-darkGreen',
    border: 'border-mbta-green',
  },
  blue: {
    ring: 'ring-mbta-darkBlue',
    bg: 'bg-mbta-blue',
    hover: 'hover:ring-mbta-darkBlue',
    border: 'border-mbta-blue',
  },
  orange: {
    ring: 'ring-mbta-darkOrange',
    bg: 'bg-mbta-orange',
    hover: 'hover:ring-mbta-darkOrange',
    border: 'border-mbta-orange',
  },
  all: {
    bg: 'bg-tm-lightGrey dark:bg-gray-500',
    ring: 'ring-tm-lightGrey',
    hover: 'hover:ring-tm-lightGrey',
    border: 'border-tm-lightGrey',
  },
};
