import classNames from 'classnames';
import dayjs from 'dayjs';

interface StatusBadgeProps {
  start_date: string;
  stop_date: string;
}

const StatusBadge = ({ start_date, stop_date }: StatusBadgeProps) => {
  const today = dayjs();
  const start = dayjs(start_date);
  const end = dayjs(stop_date);

  const status = start.isAfter(today)
    ? 'Not Started'
    : end.isBefore(today)
      ? 'Finished'
      : 'In Progress';

  const statusEmoji = {
    'Not Started': '🔜',
    'In Progress': '🚧',
    Finished: '✅',
  };

  return (
    <div
      className={classNames('ml-2', {
        'dark:bg-slate-800 px-1 rounded fill:white': status === 'Not Started',
      })}
    >
      {statusEmoji[status]}
    </div>
  );
};

export default StatusBadge;
