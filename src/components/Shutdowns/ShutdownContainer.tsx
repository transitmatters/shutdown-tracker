import { useMemo } from 'react';
import { Lines, useStore } from '../../store';
import ShutdownCard from './ShutdownCard';
import { shutdowns } from '../../constants/shutdowns';
import dayjs from 'dayjs';

const ShutdownCards = () => {
  const { selectedLine } = useStore();

  const mappedShutdowns = useMemo(
    () =>
      Object.entries(shutdowns)
        .filter(([line]) => line === selectedLine || selectedLine === 'all')
        .map(([line, shutdowns]) =>
          shutdowns
            .sort((a, b) => (dayjs(a.start_date).isAfter(dayjs(b.start_date)) ? 1 : -1))
            .map((sd, index) => (
              <ShutdownCard
                key={`${line}-${sd.start_date}-${sd.stop_date}-${index}`}
                line={line as Lines}
                shutdown={sd}
              />
            ))
        ),
    [selectedLine]
  );

  return <div className="my-8 grid md:grid-cols-3 grid-flow-row gap-4">{mappedShutdowns}</div>;
};

export default ShutdownCards;
