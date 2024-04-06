import dayjs from 'dayjs';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { abbreviateStationName } from '../../constants/stations';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Lines } from '../../store';
import { useTripExplorerQueries } from '../../api/traveltimes';
import { Shutdown, Station } from '../../types';
import { getStationByName, stopIdsForStations } from '../../utils/stations';
import { cardStyles } from '../../constants/styles';
import ChartContainer from './ChartContainer';
import ShutdownMap from './ShutdownMap';
import StatusBadge from './StatusBadge';

const ShutdownDetails = ({
  line,
  start_date,
  end_date,
  start_station,
  end_station,
  handleBack,
}: {
  line: Lines;
  shutdown: Shutdown;
  handleBack: () => void;
  start_date: string;
  end_date: string;
  start_station: string;
  end_station: string;
}) => {
  const isMobile = useBreakpoint('sm');
  const displayStationName = (station: Station) =>
    isMobile ? station.stop_name : abbreviateStationName(station.stop_name);

  const shutdown = {
    start_date,
    stop_date: end_date,
    start_station: getStationByName(start_station, line),
    end_station: getStationByName(end_station, line),
  };

  // Shutdown title card component
  const ShutdownTitleCard = () => {
    const formatDate = (date: string) => dayjs(date).format('MM/DD/YY');

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

  const beforeData = useTripExplorerQueries(beforeShutdownQueryOptions, true);
  const afterData = useTripExplorerQueries(afterShutdownQueryOptions, true);

  // Shutdown Data Cards
  const DataCards = ({ before, after, line }) => {
    return (
      <div className="flex flex-auto flex-col gap-4 h-full w-full md:w-2/3">
        <ChartContainer
          before={before.traveltimes}
          after={after.traveltimes}
          line={line}
          shutdown={shutdown}
          title="Travel times"
        />
        <ChartContainer
          before={before.dwells}
          after={after.dwells}
          line={line}
          shutdown={shutdown}
          title="Dwells"
        />
        <ChartContainer
          before={before.headways}
          after={after.headways}
          line={line}
          shutdown={shutdown}
          title="Headways"
        />
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
    <div className="mb-6 flex flex-col gap-4 w-full">
      <PageBackButton />
      <ShutdownTitleCard />
      <div className="flex flex-col md:flex-row gap-4 w-full h-full">
        <DataCards before={beforeData} after={afterData} line={line} />
        <ShutdownMap shutdown={shutdown} line={line} />
      </div>
    </div>
  );
};

export default ShutdownDetails;
