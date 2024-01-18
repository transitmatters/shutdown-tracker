import { useState } from 'react';
import { Lines } from '../../store';
import { colorToStyle } from '../../styles';
import { Shutdown } from '../../types';
import ShutdownStopsDialog from './ShutdownStopsDialog';
import ShutdownTitle from './ShutdownTitle';

interface ShutdownCardProps {
  shutdown: Shutdown;
  line: Lines;
}

const ShutdownCard = ({ shutdown, line }: ShutdownCardProps) => {
  const [showStops, setShowStops] = useState(false);

  const key = `${shutdown.start_station}-${shutdown.end_station}-${shutdown.start_date}-${shutdown.stop_date}`;

  return (
    <>
      <div
        // @ts-expect-error for scroll
        name={key}
        className={`rounded-lg bg-white dark:bg-slate-700 p-4 shadow border-r-8 ${colorToStyle[line].border}`}
      >
        <ShutdownTitle shutdown={shutdown} toggleStops={() => setShowStops((prev) => !prev)} />
        <ShutdownStopsDialog
          shutdown={shutdown}
          line={line}
          showStops={showStops}
          toggleStops={() => setShowStops((prev) => !prev)}
        />
      </div>
    </>
  );
};

export default ShutdownCard;
