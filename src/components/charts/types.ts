import type { TimeUnit } from 'chart.js';

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

export enum PointFieldKeys {
  depDt = 'dep_dt',
  currentDepDt = 'current_dep_dt',
  arrDt = 'arr_dt',
  serviceDate = 'service_date',
  depTimeFromEpoch = 'dep_time_from_epoch',
}

export enum MetricFieldKeys {
  travelTimeSec = 'travel_time_sec',
  headwayTimeSec = 'headway_time_sec',
  dwellTimeSec = 'dwell_time_sec',
}
export enum BenchmarkFieldKeys {
  benchmarkTravelTimeSec = 'benchmark_travel_time_sec',
  benchmarkHeadwayTimeSec = 'benchmark_headway_time_sec',
}

export type PointField = PointFieldKeys;
export type MetricField = MetricFieldKeys;
export type BenchmarkField = BenchmarkFieldKeys;

type DataName = 'traveltimes' | 'headways' | 'dwells' | 'traveltimesByHour';

export interface LineProps {
  chartId: string;
  location: Location;
  pointField: PointField; // X value
  bothStops?: boolean;
  fname: DataName;
  showLegend?: boolean;
}

export interface AggregateLineProps extends LineProps {
  timeUnit: TimeUnit;
  data: AggregateDataPoint[];
  timeFormat: string;
  seriesName: string;
  fillColor: string;
  startDate: string | undefined;
  endDate: string | undefined;
  suggestedYMin?: number;
  suggestedYMax?: number;
  byTime?: boolean;
  children?: React.ReactNode;
}
