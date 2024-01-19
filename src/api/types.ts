import type * as ReactQuery from '@tanstack/react-query';

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

export enum SingleDayAPIParams {
  stop = 'stop',
  fromStop = 'from_stop',
  toStop = 'to_stop',
  date = 'date',
}
export type SingleDayAPIOptions = { [key in SingleDayAPIParams]?: string[] | string };
export type PartialSingleDayAPIOptions = Partial<SingleDayAPIOptions>;

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

export interface SingleDayDataPoint {
  route_id: string;
  direction: number;
  dep_dt?: string;
  arr_dt?: string;
  current_dep_dt?: string;
  travel_time_sec?: number;
  headway_time_sec?: number;
  dwell_time_sec?: number;
  benchmark_travel_time_sec?: number;
  benchmark_headway_time_sec?: number;
  threshold_flag_1?: string;
  speed_mph?: number;
  benchmark_speed_mph?: number;
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
  by_time: AggregateDataPoint[];
}

// Overload call to specify type for single day queries
export type UseQueriesOverload = {
  (
    parameters: SingleDayAPIOptions,
    aggregate: false,
    enabled?: boolean
  ): {
    [key in QueryNameKeys]: ReactQuery.UseQueryResult<SingleDayDataPoint[]>;
  };
  (
    parameters: AggregateAPIOptions,
    aggregate: true,
    enabled?: boolean
  ): {
    [key in QueryNameKeys]: ReactQuery.UseQueryResult<AggregateDataResponse>;
  };
};
