import dayjs from 'dayjs';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { abbreviateStationName } from '../../constants/stations';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Lines } from '../../store';
import { useTripExplorerQueries } from '../../api/traveltimes';
import { Shutdown, Station } from '../../types';
import { stopIdsForStations } from '../../utils/stations';
import { cardStyles } from '../../constants/styles';
import ChartContainer from './ChartContainer';
import ShutdownMap from './ShutdownMap';
import StatusBadge from './StatusBadge';

const ShutdownDetails = ({
  line,
  shutdown,
  handleBack,
}: {
  line: Lines;
  shutdown: Shutdown;
  handleBack: () => void;
}) => {
  const formatDate = (date) => dayjs(date).format('MM/DD/YY');
  const isMobile = useBreakpoint('sm');

  const displayStationName = (station: Station) =>
    isMobile ? station.stop_name : abbreviateStationName(station.stop_name);

  // Shutdown title card component
  const ShutdownTitleCard = () => {
    return (
      <div className={`flex flex-row pb-3 ${cardStyles}`}>
        <div className="items-center">
          <div className="text-base md:text-2xl items-center flex flex-row dark:text-white ">
            <h3>{`${displayStationName(shutdown.start_station)} - ${displayStationName(shutdown.end_station)}`}</h3>
            <StatusBadge start_date={shutdown.start_date} stop_date={shutdown.stop_date} />
          </div>
          <div className="mt-1 text-gray-500 dark:text-slate-400">
            <p>
              {formatDate(shutdown.start_date)} - {formatDate(shutdown.stop_date)}
            </p>
          </div>
        </div>
      </div>
    );
  };

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

  // Shutdown Data Cards
  const DataCards = () => {
    return (
      <div className="flex flex-auto flex-col gap-4">
        <ChartContainer before={tt} after={traveltimes} shutdown={shutdown} title="Travel times" />
        <ChartContainer before={dd} after={dwells} shutdown={shutdown} title="Dwells" />
        <ChartContainer before={hh} after={headways} shutdown={shutdown} title="Headways" />
      </div>
    );
  };

  // Back button to exit the details page
  const PageBackButton = () => {
    return (
      <div className="flex flex-row items-center cursor-pointer" onClick={handleBack}>
        <ArrowLeftIcon className="h-4 px-1" />
        <h3>Back</h3>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4">
        <PageBackButton />
        <ShutdownTitleCard />
        <div className="flex flex-col md:flex-row gap-4">
          <DataCards />
          <div className="flex justify-center rounded-lg bg-white dark:dark:bg-slate-700 dark:text-white pt-4 md:p-4 shadow">
            <ShutdownMap shutdown={shutdown} line={line} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShutdownDetails;
