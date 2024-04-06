import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Lines } from '../../store';
import { shutdowns } from '../../constants/shutdowns';
import ShutdownCard from './ShutdownCard';

const ShutdownCards = () => {
  const mappedShutdowns = useMemo(
    () =>
      Object.entries(shutdowns)
        .filter(([line]) => line === line || line === 'all')
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
    []
  );

  return (
    <div className="w-full overflow-y-hidden my-8 grid md:grid-cols-3 gap-4">{mappedShutdowns}</div>
  );
};

export default ShutdownCards;
