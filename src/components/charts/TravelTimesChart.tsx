import React from 'react';
import { AggregateLineChart } from './AggregateLineChart';
import { Shutdown } from '../../types';
import { Lines } from '../../store';
import { AggregateDataResponse, PointFieldKeys } from './types';
import type { UseQueryResult } from '@tanstack/react-query';
import { CHART_COLORS } from '../../constants/colors';
import { getLocationDetails } from '../../utils/stations';
import dayjs from 'dayjs';

interface TravelTimesChartProps {
  shutdown: Shutdown;
  traveltimes: UseQueryResult<AggregateDataResponse>;
}

const TravelTimesChart = ({ shutdown, traveltimes }: TravelTimesChartProps) => {
  const dataReady = !traveltimes.isError && traveltimes.data && shutdown;
  if (!dataReady) return <>loading</>;

  const traveltimesData = traveltimes.data.by_date.filter((datapoint) => datapoint.peak === 'all');
  console.log(traveltimesData);

  const start_date = dayjs(shutdown.start_date).subtract(8, 'day').format('YYYY-MM-DD');
  const end_date = dayjs(shutdown.start_date).subtract(1, 'day').format('YYYY-MM-DD');

  return (
    <AggregateLineChart
      chartId={`travel_times_agg_by_date`}
      data={traveltimesData}
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
