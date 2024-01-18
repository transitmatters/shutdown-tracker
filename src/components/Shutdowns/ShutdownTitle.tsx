import dayjs from 'dayjs';
import { abbreviateStationName } from '../../constants/stations';
import { Shutdown } from '../../types';
import StatusBadge from './StatusBadge';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const ShutdownTitle = ({
  shutdown,
  toggleStops,
}: {
  shutdown: Shutdown;
  toggleStops: () => void;
}) => {
  const isMobile = useBreakpoint('sm');

  return (
    <div className="flex flex-row justify-between items-start border-b border-gray-200 pb-3">
      <div className="items-center">
        <div className="text-sm md:text-lg items-center flex flex-row dark:text-white">
          {!isMobile ? abbreviateStationName(shutdown.start_station) : shutdown.start_station}
          {' - '}
          {!isMobile ? abbreviateStationName(shutdown.end_station) : shutdown.end_station}

          <StatusBadge start_date={shutdown.start_date} stop_date={shutdown.stop_date} />
        </div>
        <div className="text-xs mt-1 text-gray-500 dark:text-slate-400">
          {dayjs(shutdown.start_date).format('MM/DD/YY')} -{' '}
          {dayjs(shutdown.stop_date).format('MM/DD/YY')}
        </div>
      </div>
      <button
        className="rounded bg-tm-lightGrey dark: dark:bg-slate-400 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-tm-grey "
        onClick={() => toggleStops()}
      >
        Stops
      </button>
    </div>
  );
};

export default ShutdownTitle;
