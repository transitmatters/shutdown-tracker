import { useMemo } from 'react';
import classNames from 'classnames';
import { Lines } from '../../store';
import { Shutdown } from '../../types';
import { findStopsBetween } from '../../utils/stations';
import { abbreviateStationName } from '../../constants/stations';
import { colorToStyle } from '../../styles';

interface StopTimelineProps {
  shutdown: Shutdown;
  line: Lines;
}
const StopTimeline = ({ shutdown, line }: StopTimelineProps) => {
  const stops = useMemo(() => {
    return findStopsBetween(shutdown.start_station.stop_name, shutdown.end_station.stop_name, line);
  }, [line, shutdown]);

  return (
    <ol
      className={classNames(
        'border-l md:flex flex-row md:gap-6 md:border-l-0 md:border-t mt-6 justify-between',
        colorToStyle[line].border
      )}
    >
      {stops.map((station) => (
        <li>
          <div className="pt-2 md:block md:pt-0 ">
            <div
              className={classNames(
                '-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full md:-mt-[5px] md:ml-0 md:mr-0 items-center',
                colorToStyle[line].bg
              )}
            ></div>
            <p className="text-sm md:mt-4 dark:text-white">
              {abbreviateStationName(station.stop_name)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default StopTimeline;
