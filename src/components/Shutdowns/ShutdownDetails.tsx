import dayjs from 'dayjs';
import { ArrowDownIcon, ArrowLeftIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { abbreviateStationName } from '../../constants/stations';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Lines } from '../../store';
import { useTripExplorerQueries } from '../../api/traveltimes';
import { Shutdown, Station } from '../../types';
import { getStationByName, stopIdsForStations } from '../../utils/stations';
import { cardStyles } from '../../constants/styles';
import { colorToStyle } from '../../styles';
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
  handleBack: () => void;
  start_date: string;
  end_date: string;
  start_station: string;
  end_station: string;
}) => {
  const [isReversed, setIsReversed] = useState(false);
  const direction = isReversed ? 'Northbound' : 'Southbound';
  const Icon = isReversed ? ArrowUpIcon : ArrowDownIcon;
  const isMobile = useBreakpoint('sm');
  const displayStationName = (station: Station) =>
    isMobile ? station.stop_name : abbreviateStationName(station.stop_name);

  const startStation = getStationByName(start_station, line);
  const endStation = getStationByName(end_station, line);

  const shutdown: Shutdown = {
    start_date,
    stop_date: end_date,
    start_station: startStation,
    end_station: endStation,
  };

  const handleToggleDirection = () => {
    setIsReversed((prev) => !prev);
  };

  // Shutdown title card component
  const ShutdownTitleCard = () => {
    const formatDate = (date: string) => dayjs(date).format('MM/DD/YY');

    return (
      <div className={`flex flex-row justify-between pb-3 ${cardStyles}`}>
        <div className="flex flex-col items-start">
          <div className="text-base md:text-2xl items-center flex flex-row dark:text-white">
            <h3>{`${shutdown.start_station ? displayStationName(shutdown.start_station) : start_station} - ${shutdown.end_station ? displayStationName(shutdown.end_station) : end_station}`}</h3>
            <StatusBadge start_date={shutdown.start_date} stop_date={shutdown.stop_date} />
          </div>
          <div className="mt-1 text-gray-500 dark:text-slate-400">
            <p>
              {formatDate(shutdown.start_date)} - {formatDate(shutdown.stop_date)}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-start h-full">
          <button
            title={isReversed ? 'Northbound' : 'Southbound'}
            onClick={handleToggleDirection}
            className={`p-2 ${colorToStyle[line].bg} ${colorToStyle[line].hover} rounded-full sm:rounded-lg flex items-center justify-center text-white focus:outline-none h-1/2`}
          >
            <span className="flex items-center">
              <Icon className="h-5 w-5 text-white" />
              {isMobile && <p>{direction}</p>}
            </span>
          </button>
        </div>
      </div>
    );
  };

  const { fromStopIds, toStopIds } = stopIdsForStations(
    isReversed ? shutdown.end_station : shutdown.start_station,
    isReversed ? shutdown.start_station : shutdown.end_station
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
      <div
        className="flex flex-row items-center cursor-pointer dark:text-white"
        onClick={handleBack}
      >
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
