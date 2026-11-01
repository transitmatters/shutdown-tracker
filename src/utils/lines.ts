import { CR_LINES, CommuterRailLine, LINES, LineFilter, Lines } from '../store';
import { capitalize } from '../styles';

const COMMUTER_RAIL_LINE_NAMES: { [line in CommuterRailLine]: string } = {
  'CR-Fairmount': 'Fairmount Line',
  'CR-Fitchburg': 'Fitchburg Line',
  'CR-Franklin': 'Franklin Line',
  'CR-Greenbush': 'Greenbush Line',
  'CR-Haverhill': 'Haverhill Line',
  'CR-Kingston': 'Kingston/Plymouth Line',
  'CR-Lowell': 'Lowell Line',
  'CR-Middleborough': 'Middleborough Line',
  'CR-Needham': 'Needham Line',
  'CR-NewBedford': 'Fall River/New Bedford Line',
  'CR-Newburyport': 'Newburyport/Rockport Line',
  'CR-Providence': 'Providence/Stoughton Line',
  'CR-Worcester': 'Worcester Line',
};

export const isCommuterRail = (line: string): line is CommuterRailLine =>
  (CR_LINES as readonly string[]).includes(line);

export const isLine = (line: string): line is Lines =>
  (Object.values(LINES) as string[]).includes(line) || isCommuterRail(line);

export const matchesLineFilter = (line: string, filter: LineFilter) =>
  filter === 'all' || line === filter || (filter === 'commuter-rail' && isCommuterRail(line));

// The picker groups every commuter rail route under one filter
export const lineFilterFor = (line: LineFilter): LineFilter =>
  isCommuterRail(line) ? 'commuter-rail' : line;

export const lineDisplayName = (line: LineFilter) => {
  if (line === 'all') return 'All lines';
  if (line === 'commuter-rail') return 'Commuter Rail';
  if (isCommuterRail(line)) return COMMUTER_RAIL_LINE_NAMES[line];
  return `${capitalize(line)} Line`;
};
