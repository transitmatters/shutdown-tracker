import { useQueries } from '@tanstack/react-query';
import { ONE_MINUTE } from '../constants/time';
import {
  AggregateAPIOptions,
  AggregateAPIParams,
  AggregateDataResponse,
  PartialAggregateAPIOptions,
  QueryNameKeys,
} from './types';

const APP_DATA_BASE_PATH =
  process.env.NODE_ENV === 'production'
    ? 'https://shutdowns-api.labs.transitmatters.org'
    : 'http://127.0.0.1:5000';

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

export const useTripExplorerQueries = (parameters: AggregateAPIOptions, enabled = true) => {
  const queryTypes = [QueryNameKeys.traveltimes, QueryNameKeys.headways, QueryNameKeys.dwells];
  const dependencies = aggregateQueryDependencies;
  // Create objects with keys of query names which contains keys and parameters.
  const queries = {};
  queryTypes.forEach((queryName) => {
    const keys = [queryName];
    const params: Partial<AggregateAPIOptions> = {};
    dependencies[queryName].forEach((field: Partial<AggregateAPIParams>) => {
      if (parameters[field]) {
        // @ts-expect-error Typescript gets things wrong sometimes
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
        queryFn: () => fetchAggregateData(name, queries[name].params),
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
