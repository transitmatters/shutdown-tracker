import dayjs from 'dayjs';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from '@tanstack/react-router';
import { abbreviateStationName } from '../../constants/stations';
import { Shutdown } from '../../types';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Lines } from '../../store';
import StatusBadge from './StatusBadge';

const ShutdownTitle = ({ shutdown, line }: { shutdown: Shutdown; line: Lines }) => {
  const isMobile = useBreakpoint('sm');
  const navigate = useNavigate({ from: '/$line' });

  return (
    <div className="flex flex-row justify-between items-start">
      <div className="items-center">
        <div className="text-sm md:text-lg items-center flex flex-row dark:text-white">
          <div>
            {abbreviateStationName(shutdown.start_station?.stop_name, isMobile)}
            {' - '}
            {abbreviateStationName(shutdown.end_station?.stop_name, isMobile)}
          </div>

          <StatusBadge start_date={shutdown.start_date} stop_date={shutdown.stop_date} />
        </div>
        <div className="text-xs mt-1 text-gray-500 dark:text-slate-400">
          {dayjs(shutdown.start_date).format('MM/DD/YY')} -{' '}
          {dayjs(shutdown.stop_date).format('MM/DD/YY')}
        </div>
      </div>
      <ChartBarIcon
        className="text-white bg-tm-lightGrey dark:bg-gray-500 rounded shadow h-7 w-7 p-1 pointer cursor-pointer hover:scale-110"
        title={'See Analysis'}
        onClick={() => {
          navigate({
            to: '/$line',
            search: {
              start_date: shutdown.start_date,
              end_date: shutdown.stop_date,
              start_station: shutdown.start_station?.stop_name,
              end_station: shutdown.end_station?.stop_name,
            },
            params: {
              line,
            },
          });
        }}
      />
    </div>
  );
};

export default ShutdownTitle;
