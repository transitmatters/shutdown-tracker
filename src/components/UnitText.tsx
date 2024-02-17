import classNames from 'classnames';
import React from 'react';

interface UnitTextProps {
  text: string;
  isLarge?: boolean;
}

export const UnitText: React.FC<UnitTextProps> = ({ text, isLarge = false }) => {
  return (
    <span className={classNames('text-gray-700 dark:text-white', isLarge ? 'text-sm' : 'text-xs')}>
      {text}
    </span>
  );
};
