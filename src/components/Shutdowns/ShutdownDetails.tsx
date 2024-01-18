import dayjs from 'dayjs';
import { abbreviateStationName } from '../../constants/stations';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Lines } from '../../store';
import StatusBadge from './StatusBadge';
import ShutdownMap from './ShutdownMap';
import { useTripExplorerQueries } from '../../api/traveltimes';
import { Shutdown } from '../../types';
import { stopIdsForStations } from '../../utils/stations';

const ShutdownDetails = ({ details }: { details: { line: Lines; shutdown: Shutdown } }) => {
  const isMobile = useBreakpoint('sm');

  const { shutdown, line } = details;
  console.log(shutdown);

  // const { fromStopIds, toStopIds } = stopIdsForStations(
  //   shutdown.start_station,
  //   shutdown.end_station
  // );

  // const { traveltimes, dwells, headways } = useTripExplorerQueries(
  //   {
  //     stop: fromStopIds,
  //     from_stop: fromStopIds,
  //     to_stop: toStopIds,
  //     date: dayjs(shutdown.start_date).subtract(7, 'day').format('YYYY-MM-DD'),
  //   },
  //   false
  // );

  // const {
  //   traveltimes: tt,
  //   dwells: dd,
  //   headways: hh,
  // } = useTripExplorerQueries(
  //   {
  //     stop: fromStopIds,
  //     from_stop: fromStopIds,
  //     to_stop: toStopIds,
  //     date: dayjs(shutdown.stop_date).add(4, 'day').format('YYYY-MM-DD'),
  //   },
  //   false
  // );

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
      <div
        className={`flex-1 rounded-lg bg-white dark:dark:bg-slate-700 dark:text-white p-4 shadow`}
      >
        <div className="flex flex-row justify-between items-start border-b border-gray-200 pb-3">
          <div className="items-center">
            <div className="text-sm md:text-2xl items-center flex flex-row dark:text-white">
              {!isMobile
                ? abbreviateStationName(shutdown.start_station.stop_name)
                : shutdown.start_station.stop_name}
              {' - '}
              {!isMobile
                ? abbreviateStationName(shutdown.end_station.stop_name)
                : shutdown.end_station.stop_name}

              <StatusBadge start_date={shutdown.start_date} stop_date={shutdown.stop_date} />
            </div>
            <div className="mt-1 text-gray-500 dark:text-slate-400">
              {dayjs(shutdown.start_date).format('MM/DD/YY')} -{' '}
              {dayjs(shutdown.stop_date).format('MM/DD/YY')}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white dark:dark:bg-slate-700  dark:text-white p-4 shadow flex justify-center">
        <ShutdownMap shutdown={shutdown} line={line} />
      </div>
    </div>
  );
};

export default ShutdownDetails;
