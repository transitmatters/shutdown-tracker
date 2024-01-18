import classNames from 'classnames';
import { Lines, useStore } from '../store';
import { capitalize, colorToStyle } from '../styles';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { Listbox, Transition } from '@headlessui/react';

export const LineButtons = () => {
  const { selectedLine, setLine } = useStore();
  const isMobile = useBreakpoint('sm');

  if (!isMobile) {
    return (
      <div className="pt-3 dark:text-white text-black font-bold text-xs md:text-base border-1">
        <Listbox value={selectedLine} onChange={setLine}>
          <Listbox.Button
            className={classNames(
              colorToStyle[selectedLine].bg,
              `uppercase px-3 py-1 hover:ring-2 w-full`,
              `rounded text-white`,
              colorToStyle[selectedLine].hover,
              'transition ease-in-out'
            )}
          >
            {selectedLine}
          </Listbox.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options>
              {(['all', 'red', 'blue', 'orange', 'green'] as (Lines | 'all')[]).map((color) => (
                <Listbox.Option
                  key={`button-${color}`}
                  value={color}
                  className={classNames(
                    'border-1',
                    colorToStyle[color].bg,
                    `md:uppercase px-3 py-1 m-2 hover:ring-2`,
                    `rounded text-white`,
                    colorToStyle[color].hover,
                    'hover:scale-105',
                    'transition ease-in-out'
                  )}
                >
                  {color === 'all' ? 'All' : ` ${capitalize(color)} line`}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    );
  }
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
