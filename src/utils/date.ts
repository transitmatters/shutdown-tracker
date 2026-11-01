import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Shutdown } from '../types';

dayjs.extend(duration);

export const prettyDate = (dateString: string, withDow: boolean) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: withDow ? 'long' : undefined,
  };

  const fullDate = dateString.includes('T')
    ? dateString
    : /* Offset so that it's always past midnight in Boston */ `${dateString}T07:00:00`;

  return new Date(fullDate).toLocaleDateString(
    undefined, // user locale/language
    options
  );
};

export const getFormattedTimeString = (value: number, unit: 'minutes' | 'seconds' = 'seconds') => {
  const secondsValue = unit === 'seconds' ? value : value * 60;
  const absValue = Math.round(Math.abs(secondsValue));
  const duration = dayjs.duration(absValue, 'seconds');
  switch (true) {
    case absValue < 100:
      return `${absValue}s`;
    case absValue < 3600:
      return `${duration.format('m')}m ${duration.format('s').padStart(2, '0')}s`;
    default:
      return `${duration.format('H')}h ${duration.format('m').padStart(2, '0')}m`;
  }
};

export const COMPARISON_WINDOW_DAYS = 14;

// The before/after date ranges each shutdown is compared over. Upcoming shutdowns use the
// most recent 14 days as their "before" window.
export const getComparisonWindows = (shutdown: Shutdown) => {
  const beforeEnd = dayjs().isBefore(dayjs(shutdown.start_date))
    ? dayjs().subtract(1, 'day')
    : dayjs(shutdown.start_date).subtract(1, 'day');
  const afterStart = dayjs(shutdown.stop_date).add(1, 'day');

  return {
    before: {
      start: beforeEnd.subtract(COMPARISON_WINDOW_DAYS - 1, 'day').format('YYYY-MM-DD'),
      end: beforeEnd.format('YYYY-MM-DD'),
    },
    after: {
      start: afterStart.format('YYYY-MM-DD'),
      end: afterStart.add(COMPARISON_WINDOW_DAYS - 1, 'day').format('YYYY-MM-DD'),
    },
  };
};
