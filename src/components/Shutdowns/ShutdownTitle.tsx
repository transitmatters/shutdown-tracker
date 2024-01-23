import dayjs from 'dayjs';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { abbreviateStationName } from '../../constants/stations';
import { Shutdown } from '../../types';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Lines, useStore } from '../../store';
import StatusBadge from './StatusBadge';

const ShutdownTitle = ({ shutdown, line }: { shutdown: Shutdown; line: Lines }) => {
  const { setDetails } = useStore();

  const isMobile = useBreakpoint('sm');

  return (
    <div className="flex flex-row justify-between items-start border-b border-gray-200 pb-3">
      <div className="items-center">
        <div className="text-sm md:text-lg items-center flex flex-row dark:text-white">
          {!isMobile
            ? abbreviateStationName(shutdown.start_station.stop_name)
            : shutdown.start_station.stop_name}
          {' - '}
          {!isMobile
            ? abbreviateStationName(shutdown.end_station.stop_name)
            : shutdown.end_station.stop_name}

          <StatusBadge start_date={shutdown.start_date} stop_date={shutdown.stop_date} />
        </div>
        <div className="text-xs mt-1 text-gray-500 dark:text-slate-400">
          {dayjs(shutdown.start_date).format('MM/DD/YY')} -{' '}
          {dayjs(shutdown.stop_date).format('MM/DD/YY')}
        </div>
      </div>
      <ChartBarIcon
        className="text-white bg-tm-grey rounded shadow h-7 w-7 p-1 pointer cursor-pointer hover:scale-110"
        onClick={() => setDetails(shutdown, line)}
      />
    </div>
  );
};

export default ShutdownTitle;
