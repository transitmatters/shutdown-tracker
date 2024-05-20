import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Lines, useStore } from '../../store';
import { shutdowns } from '../../constants/shutdowns';
import ShutdownCard from './ShutdownCard';

interface ShutdownCardsProps {
  line: Lines | 'all';
}

export const ShutdownCards: React.FunctionComponent<ShutdownCardsProps> = ({
  line: selectedLine,
}) => {
  const { range } = useStore();

  const mappedShutdowns = useMemo(
    () =>
      Object.entries(shutdowns)
        .filter(([line]) => line === selectedLine || selectedLine === 'all')
        .map(([line, shutdowns]) =>
          shutdowns
            .filter((sd) => {
              if (range === 'past') {
                return (
                  dayjs(sd.stop_date).isBefore(dayjs(), 'day') ||
                  dayjs(sd.stop_date).isSame(dayjs(), 'day')
                );
              } else if (range === 'future') {
                return (
                  dayjs(sd.start_date).isAfter(dayjs(), 'day') ||
                  dayjs(sd.stop_date).isSame(dayjs(), 'day')
                );
              }
              return true;
            })
            .sort((a, b) => (dayjs(a.start_date).isAfter(dayjs(b.start_date)) ? 1 : -1))
            .map((sd, index) => (
              <ShutdownCard
                key={`${line}-${sd.start_date}-${sd.stop_date}-${index}`}
                line={line as Lines}
                shutdown={sd}
              />
            ))
        ),
    [range, selectedLine]
  );

  return (
    <div className="w-full overflow-y-hidden my-8 grid md:grid-cols-3 gap-4">{mappedShutdowns}</div>
  );
};
