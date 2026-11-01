import dayjs from 'dayjs';
import { AggregateDataPoint } from '../api/types';
import { COMPARISON_WINDOW_DAYS } from './date';

export const filterPeakData = (data: AggregateDataPoint[]): AggregateDataPoint[] =>
  data.filter((datapoint) => datapoint.peak === 'all');

// Place each day's datapoint in its slot within the window so missing days show up as gaps
// instead of shifting later days forward.
export const alignToWindow = (
  data: AggregateDataPoint[],
  startDate: string,
  days = COMPARISON_WINDOW_DAYS
): (AggregateDataPoint | null)[] => {
  const byDate = new Map(filterPeakData(data).map((point) => [point.service_date, point]));
  return Array.from(
    { length: days },
    (_, i) => byDate.get(dayjs(startDate).add(i, 'day').format('YYYY-MM-DD')) ?? null
  );
};
