import classNames from 'classnames';
import { Lines, useStore } from '../store';
import { capitalize, colorToStyle } from '../styles';

export const LineButtons = () => {
  const { selectedLine, setLine } = useStore();

  return (
    <div className="pt-3 text-white font-bold flex flex-col sm:flex-row gap-4 text-xs md:text-base">
      {(['all', 'red', 'blue', 'orange', 'green'] as (Lines | 'all')[]).map((color) => {
        return (
          <button
            className={classNames(
              colorToStyle[color].bg,
              `uppercase px-3 py-1 hover:ring-2`,
              `rounded`,
              colorToStyle[color].hover,
              'hover:scale-105',
              {
                [colorToStyle[color].ring + ' ring-2  scale-105']: selectedLine === color,
              },
              'transition ease-in-out'
            )}
            onClick={() => setLine(color)}
            key={`button-${color}`}
          >
            {color === 'all' ? 'All' : ` ${capitalize(color)} line`}
          </button>
        );
      })}
    </div>
  );
};
