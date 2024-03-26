import { AggregateDataPoint } from '../api/types';

export const filterPeakData = (data: AggregateDataPoint[]): AggregateDataPoint[] =>
  data.filter((datapoint) => datapoint.peak === 'all');
