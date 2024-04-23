import React, { useMemo } from 'react';

import { Station } from '../../types';
import type { Diagram, SegmentLocation } from './diagrams';
import { useDiagramCoordinates } from './useDiagramCoordinates';

import styles from './LineMap.module.css';

type MapSide = '0' | '1';

type StrokeOptions = {
  stroke: string;
  strokeWidth: number;
  opacity: number;
};

type OffsetStrokeOptions = StrokeOptions & { offset?: number };

export type SegmentLabel = {
  mapSide: MapSide;
  boundingSize?: number;
  offset?: { x: number; y: number };
  content: (size: { width: number; height: number }) => React.ReactNode;
};

export type SegmentRenderOptions = {
  location: SegmentLocation;
  strokes?: Partial<OffsetStrokeOptions>[];
  labels?: SegmentLabel[];
};

export type TooltipSide = 'left' | 'right' | 'top';

type TooltipRenderer = (props: {
  segmentLocation: SegmentLocation<true>;
  side: TooltipSide;
}) => React.ReactNode;

type TooltipOptions = {
  render: TooltipRenderer;
  snapToSegment?: boolean;
  maxDistance?: number;
};

export interface LineMapProps {
  diagram: Diagram;
  direction?: 'vertical' | 'horizontal' | 'horizontal-on-desktop';
  strokeOptions?: Partial<StrokeOptions>;
  tooltip?: TooltipOptions;
  getStationLabel?: (stationName: string) => string | undefined;
  getScaleBasis?: (viewport: { width: null | number; height: null | number }) => number;
  getSegments?: (options: { isHorizontal: boolean }) => SegmentRenderOptions[];
}

const getPropsForStrokeOptions = (options: Partial<StrokeOptions>) => {
  return {
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: 1,
    opacity: 1,
    ...options,
  };
};

export const LineMap: React.FC<LineMapProps> = ({
  diagram,
  direction = 'horizontal-on-desktop',
  getStationLabel,
  getScaleBasis,
  strokeOptions = {},
}) => {
  const { svgRef, svgProps, containerRef, isHorizontal } = useDiagramCoordinates({
    getScaleBasis,
    direction,
  });

  const pathDirective = useMemo(() => diagram.toSVG(), [diagram]);

  const stationsById = useMemo(() => {
    const index: Record<string, Station> = {};
    diagram.getStations().forEach((station) => {
      index[station.station] = station;
    });
    return index;
  }, [diagram]);

  const stationPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    for (const station of diagram.getStations()) {
      positions[station.station] = diagram.getStationPosition(station.station);
    }
    return positions;
  }, [diagram]);

  const renderStationDots = () => {
    const strokeProps = getPropsForStrokeOptions(strokeOptions);
    return Object.entries(stationPositions).map(([stationId, pos]) => {
      return (
        <circle
          cx={0}
          cy={0}
          r={1.5}
          key={`${stationId}-dot`}
          transform={`translate(${pos.x}, ${pos.y})`}
          {...strokeProps}
          fill="white"
        />
      );
    });
  };

  const renderStationLabels = () => {
    return Object.entries(stationPositions).map(([stationId, pos]) => {
      const stationName = stationsById[stationId].stop_name;
      const stationLabel = getStationLabel?.(stationName) ?? stationName;
      if (stationLabel) {
        return (
          <text
            key={`station-label-${stationId}`}
            fontSize={4}
            className="dark:fill-white"
            textAnchor="end"
            x={-4}
            y={1.5}
            transform={`translate(${pos.x} ${pos.y}) rotate(${isHorizontal ? 45 : 0})`}
          >
            {stationLabel}
          </text>
        );
      }
      return null;
    });
  };

  const renderLine = () => {
    return <path d={pathDirective} {...getPropsForStrokeOptions(strokeOptions)} />;
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inner}>
        <svg ref={svgRef} {...svgProps}>
          <g transform={`rotate(${isHorizontal ? -90 : 0})`}>
            {renderLine()}
            {renderStationDots()}
            {renderStationLabels()}
          </g>
        </svg>
      </div>
    </div>
  );
};
