import classNames from 'classnames';
import React from 'react';

interface WidgetTextProps {
  text: string;
  isLarge?: boolean;
}

export const WidgetText: React.FC<WidgetTextProps> = ({ text, isLarge = false }) => {
  return (
    <span className={classNames('text-gray-700 dark:text-white', isLarge ? 'text-2xl' : 'text-sm')}>
      {text}
    </span>
  );
};
