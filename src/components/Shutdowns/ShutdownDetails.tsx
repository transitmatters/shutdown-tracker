import dayjs from 'dayjs';
import { abbreviateStationName } from '../../constants/stations';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Lines } from '../../store';
import { useTripExplorerQueries } from '../../api/traveltimes';
import { Shutdown } from '../../types';
import { stopIdsForStations } from '../../utils/stations';
import { cardStyles } from '../../constants/styles';
import ChartContainer from './ChartContainer';
import ShutdownMap from './ShutdownMap';
import StatusBadge from './StatusBadge';

const ShutdownDetails = ({
  details: { line, shutdown },
}: {
  details: { line: Lines; shutdown: Shutdown };
}) => {
  const isMobile = useBreakpoint('sm');
  const { fromStopIds, toStopIds } = stopIdsForStations(
    shutdown.start_station,
    shutdown.end_station
  );

  const queryOptions = {
    stop: fromStopIds,
    from_stop: fromStopIds,
    to_stop: toStopIds,
  };

  const afterShutdownQueryOptions = {
    ...queryOptions,
    end_date: dayjs(shutdown.stop_date).add(8, 'day').format('YYYY-MM-DD'),
    start_date: dayjs(shutdown.stop_date).add(1, 'day').format('YYYY-MM-DD'),
  };

  const beforeShutdownQueryOptions = {
    ...queryOptions,
    end_date: dayjs(shutdown.start_date).subtract(1, 'day').format('YYYY-MM-DD'),
    start_date: dayjs(shutdown.start_date).subtract(8, 'day').format('YYYY-MM-DD'),
  };

  const { traveltimes, dwells, headways } = useTripExplorerQueries(afterShutdownQueryOptions, true);
  const {
    traveltimes: tt,
    dwells: dd,
    headways: hh,
  } = useTripExplorerQueries(beforeShutdownQueryOptions, true);

  const formatDate = (date) => dayjs(date).format('MM/DD/YY');
  const displayStationName = (station) =>
    isMobile ? station.stop_name : abbreviateStationName(station.stop_name);

  return (
    <div className="mb-6">
      <div className={`flex flex-col md:flex-row gap-4`}>
        <div className="flex flex-auto flex-col">
          <div className={`flex flex-row pb-3 ${cardStyles}`}>
            <div className="items-center">
              <div className="text-base md:text-2xl items-center flex flex-row dark:text-white ">
                {displayStationName(shutdown.start_station)}
                {' - '}
                {displayStationName(shutdown.end_station)}

                <StatusBadge start_date={shutdown.start_date} stop_date={shutdown.stop_date} />
              </div>
              <div className="mt-1 text-gray-500 dark:text-slate-400">
                {formatDate(shutdown.start_date)} - {formatDate(shutdown.stop_date)}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <ChartContainer
              before={tt}
              after={traveltimes}
              shutdown={shutdown}
              title="Travel times"
            />
          </div>

          <div className="mt-4">
            <ChartContainer before={dd} after={dwells} shutdown={shutdown} title="Dwells" />
          </div>

          <div className="mt-4">
            <ChartContainer before={hh} after={headways} shutdown={shutdown} title="Headways" />
          </div>
        </div>

        <div
          className={`flex justify-center rounded-lg bg-white dark:dark:bg-slate-700 dark:text-white pt-4 md:p-4 shadow`}
        >
          <ShutdownMap shutdown={shutdown} line={line} />
        </div>
      </div>
    </div>
  );
};

export default ShutdownDetails;
