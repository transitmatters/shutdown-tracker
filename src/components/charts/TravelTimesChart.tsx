import dayjs from 'dayjs';
import { UseQueryResult } from '@tanstack/react-query';
import { Shutdown } from '../../types';
import { CHART_COLORS } from '../../constants/colors';
import { getLocationDetails } from '../../utils/stations';
import { Lines } from '../../store';
import { AggregateDataResponse, PointFieldKeys } from './types';
import { AggregateLineChart } from './AggregateLineChart';

interface TravelTimesChartProps {
  shutdown: Shutdown;
  before: UseQueryResult<AggregateDataResponse>;
  after: UseQueryResult<AggregateDataResponse>;
  line: Lines;
}

const TravelTimesChart = ({ shutdown, before, after, line }: TravelTimesChartProps) => {
  const start_date = dayjs(shutdown.start_date).subtract(8, 'day').format('YYYY-MM-DD');
  const end_date = dayjs(shutdown.start_date).subtract(1, 'day').format('YYYY-MM-DD');

  return (
    <AggregateLineChart
      chartId="travel_times_agg_by_date"
      before={before}
      after={after}
      line={line}
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
