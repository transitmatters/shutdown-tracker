import { Station } from '../types';
import { Lines } from '../store';
import { stations } from '../constants/stations';

export type Direction = 'northbound' | 'southbound';

const travelDirection = (from: Station, to: Station): Direction => {
  return from.order < to.order ? 'southbound' : 'northbound';
};

export const getLocationDetails = (
  from: Station | undefined,
  to: Station | undefined
): Location => {
  if (to === undefined || from === undefined) {
    return {
      // @ts-expect-error :()
      to: to?.stop_name || 'Loading...',
      from: from?.stop_name || 'Loading...',
      direction: 'southbound',
    };
  }

  return {
    // @ts-expect-error :()
    to: to.stop_name,
    from: from.stop_name,
    direction: travelDirection(from, to),
  };
};

export const stopIdsForStations = (from: Station | undefined, to: Station | undefined) => {
  if (to === undefined || from === undefined) {
    return { fromStopIds: undefined, toStopIds: undefined };
  }

  const isDirection1 = from.order < to.order;
  return {
    fromStopIds: isDirection1 ? from.stops['1'] : from.stops['0'],
    toStopIds: isDirection1 ? to.stops['1'] : to.stops['0'],
  };
};

export const getStationsFromShutdown = (stop: string, line: Lines) => {
  return stations[line].stations.find((station) => station.stop_name === stop);
};

// This assumes the stops are on the same line
export const findStopsBetween = (
  startStation: string | undefined,
  endStation: string | undefined,
  line: Lines
) => {
  const lineStations = stations[line].stations;
  const startIndex = lineStations.findIndex((station) => station.stop_name === startStation);
  const endIndex = lineStations.findIndex((station) => station.stop_name === endStation);
  if (startIndex === -1 || endIndex === -1) {
    return [];
  }

  // Only keep stops on the branches both ends share, regardless of which end comes first.
  // If they share none (e.g. North Station to Babcock Street), keep stops on either end's branches.
  const startBranches = lineStations[startIndex].branches ?? [];
  const endBranches = lineStations[endIndex].branches ?? [];
  const sharedBranches = startBranches.filter((branch) => endBranches.includes(branch));
  const commonBranches = sharedBranches.length
    ? sharedBranches
    : [...new Set([...startBranches, ...endBranches])];

  // Iterate over stops in correct direction
  const stopsBetween: Station[] = [];
  const step = startIndex <= endIndex ? 1 : -1;
  for (let i = startIndex; step === 1 ? i <= endIndex : i >= endIndex; i += step) {
    const station = lineStations[i];
    if (!station.branches || station.branches.some((branch) => commonBranches.includes(branch))) {
      stopsBetween.push(station);
    }
  }

  return stopsBetween;
};

export const getStationByName = (stopName: string, line: Lines): Station | undefined => {
  return stations[line].stations.find((station) => station.stop_name === stopName);
};

// Name of the direction a rider travels from `from` to `to`, e.g. "southbound" or "inbound"
export const directionName = (from: Station, to: Station, line: Lines): string =>
  stations[line].direction[from.order < to.order ? 1 : 0];
