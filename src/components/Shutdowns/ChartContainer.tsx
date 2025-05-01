import type { UseQueryResult } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { cardStyles } from '../../constants/styles';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Lines } from '../../store';
import { Shutdown } from '../../types';
import { getFormattedTimeValue } from '../../utils/time';
import { filterPeakData } from '../../utils/travelTimes';
import TravelTimesChart from '../charts/TravelTimesChart';
import { AggregateDataResponse } from '../charts/types';

interface ChartContainerProps {
  shutdown: Shutdown;
  before: UseQueryResult<AggregateDataResponse>;
  after: UseQueryResult<AggregateDataResponse>;
  line: Lines;
  title: string;
}

const ChartContainer = ({ before, after, line, shutdown, title }: ChartContainerProps) => {
  const isMobile = useBreakpoint('sm');
  const isFutureShutdown = dayjs().isBefore(dayjs(shutdown.start_date));
  const isOngoingShutdown =
    dayjs().isAfter(dayjs(shutdown.start_date)) && dayjs().isBefore(dayjs(shutdown.stop_date));
  const isFinishedShutdown = dayjs().isAfter(dayjs(shutdown.stop_date));

  const beforeData = before.isSuccess ? filterPeakData(before.data!.by_date) : [];
  const afterData = after.isSuccess ? filterPeakData(after.data!.by_date) : [];

  const beforeAvg = Math.round(
    beforeData.length !== 0 ? beforeData.reduce((a, b) => a + b['50%'], 0) / beforeData.length : 0
  );
  const afterAvg = Math.round(
    afterData.length !== 0 ? afterData.reduce((a, b) => a + b['50%'], 0) / afterData.length : 0
  );

  const difference = Number(afterAvg) - Number(beforeAvg);
  const direction = !isNaN(difference)
    ? beforeAvg === afterAvg
      ? 'neutral'
      : beforeAvg > afterAvg
        ? 'down'
        : 'up'
    : undefined;

  return (
    <div className="flex md:flex-row flex-col gap-4 h-1/3">
      <div className={`flex-1 ${cardStyles}`}>
        <div className="text-xl flex items-center">
          {title}
          {isFutureShutdown && (
            <span className="ml-2 text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 py-0.5 px-2 rounded-full">
              Upcoming
            </span>
          )}
          {isOngoingShutdown && (
            <span className="ml-2 text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 py-0.5 px-2 rounded-full">
              Ongoing
            </span>
          )}
          {isFinishedShutdown && (
            <span className="ml-2 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 py-0.5 px-2 rounded-full">
              Completed
            </span>
          )}
        </div>
        <div className="h-[350px] mt-3">
          <TravelTimesChart before={before} after={after} line={line} shutdown={shutdown} />
        </div>
      </div>
      <div className="flex md:flex-col flex-row flex-wrap md:gap-4 gap-2">
        <div className={`flex flex-col flex-1 ${cardStyles} justify-center text-center`}>
          <dt className="md:truncate text-sm font-medium text-gray-700 dark:text-white align-middle ">
            {!isMobile ? 'Before' : 'Before shutdown'}
          </dt>
          <dd className="mt-1 text-xl md:text-3xl font-semibold tracking-tight">
            {getFormattedTimeValue(beforeAvg, !!isMobile)}
          </dd>
        </div>
        <div className={`flex flex-col flex-1 ${cardStyles} justify-center text-center relative`}>
          <dt className="md:truncate text-sm font-medium text-gray-700 dark:text-white">
            {' '}
            {!isMobile ? 'After' : 'After shutdown'}
          </dt>
          <dd className="mt-1 text-xl md:text-3xl font-semibold tracking-tight">
            {isFutureShutdown ? (
              <span className="text-purple-500 dark:text-purple-400">Pending</span>
            ) : isOngoingShutdown ? (
              <span className="text-amber-500 dark:text-amber-400">In progress</span>
            ) : (
              getFormattedTimeValue(afterAvg, !!isMobile)
            )}
          </dd>
          {isFutureShutdown && (
            <div className="absolute -top-1 -right-1 bg-purple-400 text-purple-900 text-xs rounded-full w-6 h-6 flex items-center justify-center">
              🔜
            </div>
          )}
          {isOngoingShutdown && (
            <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-900 text-xs rounded-full w-6 h-6 flex items-center justify-center">
              🚧
            </div>
          )}
        </div>
        <div className={`flex flex-col flex-1 ${cardStyles} justify-center text-center`}>
          <dt className="md:truncate text-sm font-medium text-gray-700 dark:text-white">Change</dt>
          <dd className="mt-1 text-xl md:text-3xl font-semibold tracking-tight">
            {isFutureShutdown ? (
              <span className="text-purple-500 dark:text-purple-400">--</span>
            ) : isOngoingShutdown ? (
              <span className="text-amber-500 dark:text-amber-400">--</span>
            ) : (
              getFormattedTimeValue(difference, !!isMobile, direction)
            )}
          </dd>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
