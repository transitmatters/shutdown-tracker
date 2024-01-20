import { useMemo } from 'react';
import { Lines } from '../../store';
import { Shutdown } from '../../types';
import { findStopsBetween } from '../../utils/stations';
import { config } from '../../utils/theme';
import { LineMap } from '../maps/LineMap';
import { createStraightLineDiagram } from '../maps/diagrams';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { abbreviateStationName } from '../../constants/stations';

const ShutdownMap = ({ shutdown, line }: { shutdown: Shutdown; line: Lines }) => {
  const isMobile = useBreakpoint('sm');
  const stops = useMemo(() => {
    return findStopsBetween(shutdown.start_station.stop_name, shutdown.end_station.stop_name, line);
  }, [line, shutdown]);

  const diagram = useMemo(() => {
    return createStraightLineDiagram(stops, {
      pxPerStation: (!isMobile ? 125 : 150) / stops.length,
    });
  }, [isMobile, stops]);

  return (
    <div className="h-500">
      <LineMap
        direction="vertical"
        diagram={diagram}
        strokeOptions={{ stroke: config.theme.colors.mbta[line] }}
        getStationLabel={abbreviateStationName}
      />
    </div>
  );
};

export default ShutdownMap;