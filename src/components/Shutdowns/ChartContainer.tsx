import type { UseQueryResult } from '@tanstack/react-query';
import { cardStyles } from '../../constants/styles';
import { Shutdown } from '../../types';
import TravelTimesChart from '../charts/TravelTimesChart';
import { AggregateDataResponse } from '../charts/types';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { getFormattedTimeValue } from '../../utils/time';
import { Lines } from '../../store';
import { filterPeakData } from '../../utils/travelTimes';

interface ChartContainerProps {
  shutdown: Shutdown;
  before: UseQueryResult<AggregateDataResponse>;
  after: UseQueryResult<AggregateDataResponse>;
  line: Lines;
  title: string;
}

const ChartContainer = ({ before, after, line, shutdown, title }: ChartContainerProps) => {
  const isMobile = useBreakpoint('sm');

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
        <div className="text-xl">{title}</div>
        <div className="h-[350px] mt-3">
          <TravelTimesChart before={before} after={after} line={line} shutdown={shutdown} />
        </div>
      </div>
      <div className="flex md:flex-col flex-row flex-wrap md:gap-4 gap-2  ">
        <div className={`flex flex-col flex-1 ${cardStyles} justify-center text-center`}>
          <dt className="md:truncate text-sm font-medium text-gray-700 dark:text-white align-middle ">
            {!isMobile ? 'Before' : 'Before shutdown'}
          </dt>
          <dd className="mt-1 text-xl md:text-3xl font-semibold tracking-tight">
            {getFormattedTimeValue(beforeAvg, true)}
          </dd>
        </div>
        <div className={`flex flex-col flex-1 ${cardStyles} justify-center text-center`}>
          <dt className="md:truncate text-sm font-medium text-gray-700 dark:text-white">
            {' '}
            {!isMobile ? 'After' : 'After shutdown'}
          </dt>
          <dd className="mt-1 text-xl md:text-3xl font-semibold tracking-tight">
            {getFormattedTimeValue(afterAvg, true)}
          </dd>
        </div>
        <div className={`flex flex-col flex-1 ${cardStyles} justify-center text-center`}>
          <dt className="md:truncate text-sm font-medium text-gray-700 dark:text-white">Change</dt>
          <dd className="mt-1 text-xl md:text-3xl font-semibold tracking-tight">
            {getFormattedTimeValue(difference, true, direction)}
          </dd>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
