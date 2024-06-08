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

  const groupedAndSortedShutdowns = useMemo(() => {
    const now = dayjs();

    const shutdownsByGroup = Object.entries(shutdowns)
      .filter(([line]) => line === selectedLine || selectedLine === 'all')
      .reduce<{
        active: { card: JSX.Element; date: dayjs.Dayjs }[];
        upcoming: { card: JSX.Element; date: dayjs.Dayjs }[];
        completed: { card: JSX.Element; date: dayjs.Dayjs }[];
      }>(
        (acc, [line, shutdownList]) => {
          shutdownList.forEach((sd, index) => {
            const shutdownCard = (
              <ShutdownCard
                key={`${line}-${sd.start_date}-${sd.stop_date}-${index}`}
                line={line as Lines}
                shutdown={sd}
              />
            );

            if (dayjs(sd.start_date).isAfter(now, 'day')) {
              acc.upcoming.push({ card: shutdownCard, date: dayjs(sd.start_date) });
            } else if (dayjs(sd.stop_date).isBefore(now, 'day')) {
              acc.completed.push({ card: shutdownCard, date: dayjs(sd.start_date) });
            } else {
              acc.active.push({ card: shutdownCard, date: dayjs(sd.start_date) });
            }
          });
          return acc;
        },
        {
          active: [],
          upcoming: [],
          completed: [],
        }
      );

    const sortByDate = (
      a: { card: JSX.Element; date: dayjs.Dayjs },
      b: { card: JSX.Element; date: dayjs.Dayjs }
    ) => a.date.diff(b.date);

    const sortedActive = shutdownsByGroup.active.sort(sortByDate).map((item) => item.card);
    const sortedUpcoming = shutdownsByGroup.upcoming.sort(sortByDate).map((item) => item.card);
    const sortedCompleted = shutdownsByGroup.completed.sort(sortByDate).map((item) => item.card);

    return { active: sortedActive, upcoming: sortedUpcoming, completed: sortedCompleted };
  }, [selectedLine]);

  return (
    <div>
      {!!groupedAndSortedShutdowns.active.length && (
        <div className="md:my-8 my-4">
          <h3 className="md:text-xl font-medium mb-4 dark:text-white">Active Shutdowns 🚧</h3>
          <div className="w-full overflow-y-hidden grid md:grid-cols-3 gap-4">
            {groupedAndSortedShutdowns.active}
          </div>
        </div>
      )}
      {!!groupedAndSortedShutdowns.upcoming.length && range !== 'past' && (
        <div className="md:my-8 my-4">
          <h3 className="md:text-xl font-medium mb-4 dark:text-white">Upcoming Shutdowns 🔜</h3>
          <div className="w-full overflow-y-hidden grid md:grid-cols-3 gap-4">
            {groupedAndSortedShutdowns.upcoming}
          </div>
        </div>
      )}
      {!!groupedAndSortedShutdowns.completed.length && range !== 'upcoming' && (
        <div className="md:my-8 my-4">
          <h3 className="md:text-xl mb-4 font-medium dark:text-white">Completed Shutdowns ✅</h3>
          <div className="w-full overflow-y-hidden  grid md:grid-cols-3 gap-4">
            {groupedAndSortedShutdowns.completed}
          </div>
        </div>
      )}
    </div>
  );
};
