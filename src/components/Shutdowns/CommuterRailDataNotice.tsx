import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const linkStyles = 'underline hover:text-amber-950 dark:hover:text-white';

// Same caveat the Data Dashboard shows on its Commuter Rail pages
const CommuterRailDataNotice = () => {
  return (
    <div className="flex flex-row gap-3 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 p-4 shadow text-sm">
      <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">
          Commuter Rail data is in beta — headways and travel times may be incomplete or inaccurate.
        </p>
        <p>
          TransitMatters collects this data from the{' '}
          <a
            className={linkStyles}
            href="https://www.mbta.com/developers/v3-api/streaming"
            rel="noopener noreferrer"
            target="_blank"
          >
            MBTA&apos;s V3 API
          </a>{' '}
          without cleaning or filtering it, so some trips or stops may be missing. Arrivals at North
          Station and South Station have only been recorded since early October 2026, so travel
          times to those stations aren&apos;t available before then. See{' '}
          <a
            className={linkStyles}
            href="https://github.com/transitmatters/gobble"
            rel="noopener noreferrer"
            target="_blank"
          >
            gobble
          </a>{' '}
          for technical details.
        </p>
      </div>
    </div>
  );
};

export default CommuterRailDataNotice;
