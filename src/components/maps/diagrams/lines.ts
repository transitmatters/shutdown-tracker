import { Station } from '../../../types';

import { line } from './commands';
import { Diagram } from './diagram';
import { execute } from './execute';
import type { Turtle } from './types';

type CreateDiagramOptions = {
  /** Number of pixels between each station */
  pxPerStation?: number;
};

const DEFAULT_PX_PER_STATION = 10;

export const createStraightLineDiagram = (
  stations: Station[],
  options: CreateDiagramOptions = {}
) => {
  const { pxPerStation = DEFAULT_PX_PER_STATION } = options;
  const start: Turtle = { x: 0, y: 0, theta: 90 };
  const path = execute({
    start,
    ranges: ['main'],
    commands: [line(pxPerStation * stations.length)],
  });
  return new Diagram([path], { main: stations });
};
