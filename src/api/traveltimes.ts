import { useQueries } from '@tanstack/react-query';
import {
  AggregateAPIOptions,
  AggregateAPIParams,
  AggregateDataResponse,
  PartialAggregateAPIOptions,
  PartialSingleDayAPIOptions,
  QueryNameKeys,
  QueryNameOptions,
  SingleDayAPIOptions,
  SingleDayAPIParams,
  SingleDayDataPoint,
  UseQueriesOverload,
} from './types';
import { ONE_MINUTE } from '../constants/time';

const APP_DATA_BASE_PATH = 'https://dashboard-api.labs.transitmatters.org';

export const getCurrentDate = (): string => {
  const isoDate = new Date();
  const offset = isoDate.getTimezoneOffset();
  const localDate = new Date(isoDate.valueOf() - offset * 60 * 1000);
  const maxDate = localDate.toISOString().split('T')[0];
  return maxDate;
};
const aggregateQueryDependencies: { [key in QueryNameKeys]: AggregateAPIParams[] } = {
  traveltimes: [
    AggregateAPIParams.fromStop,
    AggregateAPIParams.toStop,
    AggregateAPIParams.startDate,
    AggregateAPIParams.endDate,
  ],
  headways: [AggregateAPIParams.stop, AggregateAPIParams.startDate, AggregateAPIParams.endDate],
  dwells: [AggregateAPIParams.stop, AggregateAPIParams.startDate, AggregateAPIParams.endDate],
};

// Fetch data for all single day charts.
export const fetchSingleDayData = async (
  name: QueryNameKeys,
  options: PartialSingleDayAPIOptions
): Promise<SingleDayDataPoint[]> => {
  const date = options.date ?? getCurrentDate();
  const url = new URL(`${APP_DATA_BASE_PATH}/api/${name}/${date}`, window.location.origin);
  Object.entries(options).forEach(([key, value]) => {
    // options includes date which is a string. Date is never used as a parameter since it is part of the URL, so it can be excluded.
    if (!(typeof value === 'string') && key !== 'date')
      value.forEach((subvalue) => url.searchParams.append(key, subvalue));
  });
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('network request failed');
  }
  return await response.json();
};

// Object to contain the name of each single day query and the parameters/keys it takes.
const singleDayQueryDependencies: { [key in QueryNameOptions]: SingleDayAPIParams[] } = {
  traveltimes: [SingleDayAPIParams.fromStop, SingleDayAPIParams.toStop, SingleDayAPIParams.date],
  headways: [SingleDayAPIParams.stop, SingleDayAPIParams.date],
  dwells: [SingleDayAPIParams.stop, SingleDayAPIParams.date],
};

// Fetch data for all aggregate charts except traveltimes.
export const fetchAggregateData = async (
  name: QueryNameKeys,
  options: PartialAggregateAPIOptions
): Promise<AggregateDataResponse> => {
  const method = name === QueryNameKeys.traveltimes ? 'traveltimes2' : name;

  const url = new URL(`${APP_DATA_BASE_PATH}/api/aggregate/${method}`, window.location.origin);
  // Loop through each option and append values to searchParams.
  Object.entries(options).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((subvalue) => url.searchParams.append(key, subvalue));
    } else {
      url.searchParams.append(key, value.toString());
    }
  });
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('network request failed');
  }
  const responseJson = await response.json();
  return name === QueryNameKeys.traveltimes ? responseJson : { by_date: responseJson };
};

export const useTripExplorerQueries: UseQueriesOverload = (
  parameters: SingleDayAPIOptions | AggregateAPIOptions,
  aggregate: boolean,
  enabled = true
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  const queryTypes = [QueryNameKeys.traveltimes, QueryNameKeys.headways, QueryNameKeys.dwells];
  const dependencies = aggregate ? aggregateQueryDependencies : singleDayQueryDependencies;
  // Create objects with keys of query names which contains keys and parameters.
  const queries = {};
  queryTypes.forEach((queryName) => {
    const keys = [queryName];
    const params: Partial<SingleDayAPIOptions | AggregateAPIOptions> = {};
    dependencies[queryName].forEach((field: Partial<AggregateAPIParams | SingleDayAPIParams>) => {
      if (parameters[field]) {
        keys.push(parameters[field].toString());
        params[field] = parameters[field];
      }
      queries[queryName] = { keys: keys, params: params };
    });
  });

  // Create multiple queries.
  const requests = useQueries({
    queries: queryTypes.map((name) => {
      return {
        queryKey: [name, queries[name].params],
        queryFn: () =>
          aggregate
            ? fetchAggregateData(name, queries[name].params)
            : fetchSingleDayData(name, queries[name].params),
        enabled,
        staleTime: ONE_MINUTE,
      };
    }),
  });

  return {
    [QueryNameKeys.traveltimes]: requests[0],
    [QueryNameKeys.headways]: requests[1],
    [QueryNameKeys.dwells]: requests[2],
  };
};
