import { AggregateLineChart } from './AggregateLineChart';
import { Shutdown } from '../../types';
import { AggregateDataPoint, PointFieldKeys } from './types';
import { CHART_COLORS } from '../../constants/colors';
import { getLocationDetails } from '../../utils/stations';
import dayjs from 'dayjs';

interface TravelTimesChartProps {
  shutdown: Shutdown;
  before: AggregateDataPoint[];
  after: AggregateDataPoint[];
}

const TravelTimesChart = ({ shutdown, before, after }: TravelTimesChartProps) => {
  const start_date = dayjs(shutdown.start_date).subtract(8, 'day').format('YYYY-MM-DD');
  const end_date = dayjs(shutdown.start_date).subtract(1, 'day').format('YYYY-MM-DD');

  return (
    <AggregateLineChart
      chartId={`travel_times_agg_by_date`}
      beforeData={before}
      afterData={after}
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
