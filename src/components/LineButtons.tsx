import classNames from 'classnames';
import { Listbox, Transition } from '@headlessui/react';
import { Link } from '@tanstack/react-router';
import { Lines, useStore } from '../store';
import { capitalize, colorToStyle } from '../styles';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { Route } from '../routes/$line';

export const LineButtons = () => {
  const { line } = Route.useParams();

  const { setLine } = useStore();
  const isMobile = useBreakpoint('sm');

  if (!isMobile) {
    return (
      <div className="pt-3 dark:text-white text-black font-bold text-xs md:text-base border-1 w-full">
        <Listbox value={line} onChange={setLine}>
          <Listbox.Button
            className={classNames(
              colorToStyle[line].bg,
              `uppercase px-3 py-1 hover:ring-2 w-full`,
              `rounded text-white`,
              colorToStyle[line].hover,
              'transition ease-in-out'
            )}
          >
            {line === 'all' ? 'All lines' : `${line} line`}
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
                <Link to="/$line" params={{ line: color }}>
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
                    {color === 'all' ? 'All lines' : ` ${capitalize(color)} line`}
                  </Listbox.Option>
                </Link>
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
          <Link to={'/$line'} params={{ line: color }}>
            <button
              className={classNames(
                colorToStyle[color].bg,
                `uppercase px-3 py-1 hover:ring-2`,
                `rounded`,
                colorToStyle[color].hover,
                'hover:scale-105',
                {
                  [colorToStyle[color].ring + ' ring-2  scale-105']: line === color,
                },
                'transition ease-in-out'
              )}
              onClick={() => setLine(color)}
              key={`button-${color}`}
            >
              {color === 'all' ? 'All' : ` ${capitalize(color)} line`}
            </button>
          </Link>
        );
      })}
    </div>
  );
};
