import type { UseQueryResult } from '@tanstack/react-query';
import { cardStyles } from '../../constants/styles';
import { Shutdown } from '../../types';
import TravelTimesChart from '../charts/TravelTimesChart';
import { AggregateDataResponse } from '../charts/types';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface ChartContainerProps {
  shutdown: Shutdown;
  before: UseQueryResult<AggregateDataResponse>;
  after: UseQueryResult<AggregateDataResponse>;
  title: string;
}
const ChartContainer = ({ before, after, shutdown, title }: ChartContainerProps) => {
  const isMobile = useBreakpoint('sm');
  const ready = !before.isError && !after.isError && before.data && after.data;
  if (!ready) return <>loading</>;

  const beforeData = before.data!.by_date.filter((datapoint) => datapoint.peak === 'all');
  const afterData = after.data!.by_date.filter((datapoint) => datapoint.peak === 'all');

  const beforeAvg = (beforeData.reduce((a, b) => a + b['50%'], 0) / beforeData.length / 60).toFixed(
    2
  );

  const afterAvg = (afterData.reduce((a, b) => a + b['50%'], 0) / afterData.length / 60).toFixed(2);

  const difference = (Number(afterAvg) - Number(beforeAvg)).toFixed(2);
  return (
    <div className="flex md:flex-row flex-col gap-4 ">
      <div className={`flex-1 ${cardStyles}`}>
        <div className="text-xl">{title}</div>
        <div className="h-[350px] mt-3">
          <TravelTimesChart before={beforeData} after={afterData} shutdown={shutdown} />
        </div>
      </div>
      <div className="flex md:flex-col flex-row md:gap-4 gap-2  ">
        <div className={`flex flex-col flex-1 ${cardStyles} justify-center text-center`}>
          <dt className="md:truncate text-sm font-medium text-gray-500 align-middle ">
            {!isMobile ? 'Before' : 'Before shutdown'}
          </dt>
          <dd className="mt-1 text-xl md:text-3xl font-semibold tracking-tight text-gray-900">
            {beforeAvg}
          </dd>
        </div>
        <div className={`flex flex-col flex-1 ${cardStyles} justify-center text-center`}>
          <dt className="md:truncate text-sm font-medium text-gray-500">
            {' '}
            {!isMobile ? 'After' : 'After shutdown'}
          </dt>
          <dd className="mt-1 text-xl md:text-3xl font-semibold tracking-tight text-gray-900">
            {afterAvg}
          </dd>
        </div>
        <div className={`flex flex-col flex-1 ${cardStyles} justify-center text-center`}>
          <dt className="md:truncate text-sm font-medium text-gray-500">Change</dt>
          <dd className="mt-1 text-xl md:text-3xl font-semibold tracking-tight text-gray-900">
            {difference}
          </dd>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
