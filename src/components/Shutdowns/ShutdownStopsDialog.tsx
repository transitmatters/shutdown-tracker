import { Dialog } from '@headlessui/react';
import { Shutdown } from '../../types';
import { Lines } from '../../store';
import StopTimeline from './StopTimeline';
import classNames from 'classnames';
import { colorToStyle } from '../../styles';

const ShutdownStopsDialog = ({
  shutdown,
  toggleStops,
  showStops,
  line,
}: {
  shutdown: Shutdown;
  toggleStops: () => void;
  showStops: boolean;
  line: Lines;
}) => {
  return (
    <Dialog open={showStops} onClose={() => toggleStops()} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <Dialog.Panel
          className={classNames(
            'mx-auto md:w-auto w-1/2 rounded bg-white p-4 border-4',
            colorToStyle[line]?.border || 'border-tm-lightGrey'
          )}
        >
          <Dialog.Title>Stops</Dialog.Title>
          <StopTimeline shutdown={shutdown} line={line} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ShutdownStopsDialog;
