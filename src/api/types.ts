import { Lines } from '../store';

export type AggType = 'daily' | 'weekly' | 'monthly';

export enum QueryNameKeys {
  traveltimes = 'traveltimes',
  headways = 'headways',
  dwells = 'dwells',
}
export type QueryNameOptions = QueryNameKeys;

export type RouteType = 'bus' | 'subway' | 'cr';

export const QUERIES: { [key in RouteType]: QueryNameOptions[] } = {
  subway: [QueryNameKeys.traveltimes, QueryNameKeys.headways, QueryNameKeys.dwells],
  bus: [QueryNameKeys.traveltimes, QueryNameKeys.headways],
  cr: [QueryNameKeys.traveltimes, QueryNameKeys.headways],
};

export enum AggregateAPIParams {
  stop = 'stop',
  fromStop = 'from_stop',
  toStop = 'to_stop',
  startDate = 'start_date',
  endDate = 'end_date',
}

export type AggregateAPIOptions = { [key in AggregateAPIParams]?: string[] | string };
export type PartialAggregateAPIOptions = Partial<AggregateAPIOptions>;

export type FetchSpeedsOptions = {
  agg: AggType;
  start_date?: string;
  end_date?: string;
  line?: Lines;
};

export enum FetchSpeedsParams {
  startDate = 'start_date',
  endDate = 'end_date',
  agg = 'agg',
  line = 'line',
}

export interface AggregateDataPoint {
  '25%': number;
  '50%': number;
  '75%': number;
  count: number;
  max: number;
  mean: number;
  min: number;
  std: number;
  service_date?: string;
  dep_time_from_epoch?: string;
  is_peak_day?: boolean;
  peak?: string;
}

export interface AggregateDataResponse {
  by_date: AggregateDataPoint[];
  by_time?: AggregateDataPoint[];
}
