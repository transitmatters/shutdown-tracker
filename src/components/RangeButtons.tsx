import classNames from 'classnames';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { BackwardIcon, ForwardIcon, PlayIcon } from '@heroicons/react/24/solid';
import { useStore } from '../store';
import { capitalize, colorToStyle } from '../styles';

const RANGE_ICONS = {
  all: <PlayIcon className="h-4 md:h-5 w-4 md:w-5 text-white" />,
  past: <BackwardIcon className="h-4 md:h-5 w-4 md:w-5 text-white" />,
  future: <ForwardIcon className="h-4 md:h-5 w-4 md:w-5 text-white" />,
};

export const RangeButtons = () => {
  const { range, setRange } = useStore();

  return (
    <div className="pt-3 dark:text-white text-black font-bold text-xs md:text-base border-1 md:w-auto w-full">
      <Listbox value={range} onChange={setRange}>
        <ListboxButton
          className={classNames(
            colorToStyle['all'].bg,
            `uppercase px-3 py-1 hover:ring-2 w-full`,
            `rounded text-white`,
            colorToStyle['all'].hover,
            'transition ease-in-out cursor-pointer'
          )}
        >
          {range} shutdowns
        </ListboxButton>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <ListboxOptions className={'md:absolute md:z-10'}>
            {(['all', 'past', 'future'] as ('all' | 'past' | 'future')[]).map((selectedRange) => (
              <ListboxOption
                key={`button-range-${selectedRange}`}
                value={selectedRange}
                className={classNames(
                  'border-1',
                  colorToStyle['all'].bg,
                  `md:uppercase px-3 py-1 m-2 hover:ring-2`,
                  `rounded text-white`,
                  colorToStyle['all'].hover,
                  'hover:scale-105',
                  'transition ease-in-out cursor-pointer'
                )}
                onClick={() => setRange(selectedRange)}
              >
                <span className="flex flex-row gap-1">
                  {RANGE_ICONS[selectedRange]}
                  {`${capitalize(selectedRange)} shutdowns`}
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  );
};
