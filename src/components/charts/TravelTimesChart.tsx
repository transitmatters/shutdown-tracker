import React from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Shutdown } from '../../types';
import { Lines } from '../../store';
import { CHART_COLORS } from '../../constants/colors';
import { getLocationDetails } from '../../utils/stations';
import { AggregateDataResponse, PointFieldKeys } from './types';
import { AggregateLineChart } from './AggregateLineChart';

interface TravelTimesChartProps {
  shutdown: Shutdown;
  data: {
    before: UseQueryResult<AggregateDataResponse>;
    after: UseQueryResult<AggregateDataResponse>;
  };
}

const TravelTimesChart = ({ shutdown, data }: TravelTimesChartProps) => {
  const dataReady =
    !data.before.isError && !data.after.isError && data.before.data && data.after.data && shutdown;

  if (!dataReady) return <>loading</>;

  const beforeData = data.before.data.by_date.filter((datapoint) => datapoint.peak === 'all');
  const afterData = data.after.data.by_date.filter((datapoint) => datapoint.peak === 'all');

  const start_date = dayjs(shutdown.start_date).subtract(8, 'day').format('YYYY-MM-DD');
  const end_date = dayjs(shutdown.start_date).subtract(1, 'day').format('YYYY-MM-DD');

  return (
    <AggregateLineChart
      chartId={`travel_times_agg_by_date`}
      beforeData={beforeData}
      afterData={afterData}
      // This is service date when agg by date. dep_time_from_epoch when agg by hour
      pointField={PointFieldKeys.serviceDate}
      timeUnit={'day'}
      timeFormat={'MMM d yyyy'}
      seriesName={'Median travel time'}
      startDate={start_date}
      endDate={end_date}
      fillColor={CHART_COLORS.FILL}
      location={getLocationDetails(shutdown.start_station, shutdown.end_station)}
      bothStops={true}
      fname="traveltimes"
    />
  );
};

export default TravelTimesChart;
