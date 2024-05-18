import { ArrowDownCircleIcon, ArrowUpCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface DirectionIndicatorProps {
  direction?: 'up' | 'down' | 'neutral';
}

export const DirectionIndicator: React.FC<DirectionIndicatorProps> = ({ direction }) => {
  if (direction === 'up') {
    return <ArrowUpCircleIcon className={`ml-1 h-6 w-6 inline-block text-red-500`} />;
  } else if (direction === 'down') {
    return <ArrowDownCircleIcon className={`ml-1 h-6 w-6 inline-block text-green-500`} />;
  } else if (direction === 'neutral') {
    return <MinusCircleIcon className={`ml-1 h-6 w-6 inline-block text-gray-500`} />;
  }
};
