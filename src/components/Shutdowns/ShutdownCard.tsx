import { Lines } from '../../store';
import { colorToStyle } from '../../styles';
import { Shutdown } from '../../types';
import ShutdownTitle from './ShutdownTitle';

interface ShutdownCardProps {
  shutdown: Shutdown;
  line: Lines;
}

const ShutdownCard = ({ shutdown, line }: ShutdownCardProps) => {
  const key = `${shutdown.start_station?.stop_name}-${shutdown.end_station?.stop_name}-${shutdown.start_date}-${shutdown.stop_date}`;

  return (
    <>
      <div
        // @ts-expect-error for scroll
        name={key}
        className={`rounded-lg bg-white dark:bg-slate-700 p-4 shadow border-r-8 ${colorToStyle[line].border}`}
      >
        <ShutdownTitle shutdown={shutdown} line={line} />
      </div>
    </>
  );
};

export default ShutdownCard;
