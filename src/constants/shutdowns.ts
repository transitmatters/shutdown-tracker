import { Lines } from '../store';
import { Shutdown, Station } from '../types';
import { getStationsFromShutdown } from '../utils/stations';
import shutdowns_json from './shutdowns.json';

export const shutdowns = Object.entries(shutdowns_json).reduce(
  (acc, [line, shutdowns]) => {
    acc[line] = shutdowns.map((shutdown) => ({
      ...shutdown,
      start_station: getStationsFromShutdown(shutdown.start_station, line as Lines) as Station,
      end_station: getStationsFromShutdown(shutdown.end_station, line as Lines) as Station,
    }));

    return acc;
  },
  {} as Record<Lines, Shutdown[]>
);
