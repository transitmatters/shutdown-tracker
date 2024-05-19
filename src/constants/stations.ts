import { Lines } from '../store';
import { LineMap } from '../types';
import stations_json from './stations.json';

export const rtStations: { [key in Lines]: LineMap } = stations_json;

export const stations = { ...rtStations };

export const abbreviateStationName = (stationName: string | undefined, isMobile?: boolean) => {
  if (stationName?.startsWith('JFK')) {
    return 'JFK/UMass';
  }

  if (!isMobile) {
    return stationName
      ?.replace('Downtown Crossing', 'Dwntn Crossing')
      .replace('Boston University', 'BU')
      .replace('Hynes Convention Center', 'Hynes')
      .replace('Government Center', "Gov't Center")
      .replace('Northeastern University', 'Northeastern')
      .replace('Museum of Fine Arts', 'MFA')
      .replace('Massachusetts Avenue', 'Mass Ave')
      .replace('North Quincy', 'N. Quincy')
      .replace('Longwood Medical Area', 'Longwood Med')
      .replace('Street', 'St.')
      .replace('Avenue', 'Ave')
      .replace('Square', 'Sq.')
      .replace('Road', 'Rd')
      .replace('Circle', 'Cir')
      .replace('Medford/Tufts', 'Medford');
  }

  return stationName;
};
