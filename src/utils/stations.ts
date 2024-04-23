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
  let startIndex = -1;
  let endIndex = -1;
  let commonBranches: string[] = [];

  // Find the index and branches of start and end stations
  stations[line].stations.forEach((station, index) => {
    if (station.stop_name === startStation) {
      startIndex = index;
      if (commonBranches.length) {
        commonBranches = commonBranches.filter(
          (branch) => station.branches && station.branches.includes(branch)
        );
      }
    }
    if (station.stop_name === endStation) {
      endIndex = index;
      if (commonBranches.length) {
        commonBranches = commonBranches.filter(
          (branch) => station.branches && station.branches.includes(branch)
        );
      } else if (station.branches) {
        commonBranches = station.branches;
      }
    }
  });

  // Iterate over stops in correct direction
  const stopsBetween: Station[] = [];
  const step = startIndex <= endIndex ? 1 : -1;
  for (let i = startIndex; step === 1 ? i <= endIndex : i >= endIndex; i += step) {
    const station = stations[line].stations[i];
    if (!station.branches || station.branches.some((branch) => commonBranches.includes(branch))) {
      stopsBetween.push(station);
    }
  }

  return stopsBetween;
};

export const getStationByName = (stopName: string, line: Lines): Station | undefined => {
  return stations[line].stations.find((station) => station.stop_name === stopName);
};
