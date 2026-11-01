import classNames from 'classnames';
import { Listbox, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { Link } from '@tanstack/react-router';
import { LineFilter, useStore } from '../store';
import { colorToStyle } from '../styles';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { Route } from '../routes/$line';
import { lineDisplayName, lineFilterFor } from '../utils/lines';

const LINE_FILTERS: LineFilter[] = ['all', 'red', 'blue', 'orange', 'green', 'commuter-rail'];

export const LineButtons = () => {
  // A commuter rail route's detail page highlights the "Commuter Rail" filter
  const line = lineFilterFor(Route.useParams().line);

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
            {lineDisplayName(line)}
          </Listbox.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <ListboxOptions>
              {LINE_FILTERS.map((color) => (
                <Link to="/$line" key={color} params={{ line: color }}>
                  <ListboxOption
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
                    {lineDisplayName(color)}
                  </ListboxOption>
                </Link>
              ))}
            </ListboxOptions>
          </Transition>
        </Listbox>
      </div>
    );
  }
  return (
    <div className="pt-3 text-white font-bold flex flex-col sm:flex-row gap-4 text-xs md:text-base">
      {LINE_FILTERS.map((color) => {
        return (
          <Link key={color} to={'/$line'} params={{ line: color }}>
            <button
              tabIndex={-1}
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
              {color === 'all' ? 'All' : lineDisplayName(color)}
            </button>
          </Link>
        );
      })}
    </div>
  );
};
