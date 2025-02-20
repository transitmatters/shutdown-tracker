import { createFileRoute, useRouter } from '@tanstack/react-router';
import classNames from 'classnames';
import { colorToStyle } from '../../styles';
import Navbar from '../../components/Navbar';
import ShutdownDetails from '../../components/Shutdowns/ShutdownDetails';
import { LineGraph } from '../../components/LineGraph';
import { ShutdownCards } from '../../components/Shutdowns/ShutdownContainer';
import { Lines } from '../../store';
import { LineButtons } from '../../components/LineButtons';
import Footer from '../../components/Footer';
import { RangeButtons } from '../../components/RangeButtons';
import { shutdowns } from '../../constants/shutdowns';

interface SearchParams {
  start_station?: string;
  end_station?: string;
  start_date?: string;
  end_date?: string;
}

export const Route = createFileRoute('/$line/')({
  component: Line,
  validateSearch: (search: SearchParams) => {
    return search;
  },
  parseParams: (params) => {
    return { line: params.line as Lines | 'all' };
  },
});

function Line() {
  const { line } = Route.useParams();
  const search = Route.useSearch();
  const router = useRouter();
  const handleBack = () => router.history.back();

  const shutdown =
    search.start_date &&
    search.end_date &&
    search.start_station &&
    search.end_station &&
    line !== 'all'
      ? shutdowns[line].find((shutdown) => {
          return (
            shutdown.start_date === search.start_date &&
            shutdown.stop_date === search.end_date &&
            shutdown.start_station?.stop_name === search.start_station &&
            shutdown.end_station?.stop_name === search.end_station
          );
        })
      : undefined;

  return (
    <>
      <div
        className={classNames(
          'fixed inset-0 z-10 lg:border-24 md:border-16 border-10 pointer-events-none',
          colorToStyle[line]?.border || 'border-tm-lightGrey'
        )}
      />
      <div className="dark:bg-slate-800 bg-slate-100 ">
        <Navbar>
          <LineButtons />
          <RangeButtons />
        </Navbar>
        <div className="md:px-12 p-6">
          {shutdown ? (
            <ShutdownDetails line={line as Lines} shutdown={shutdown} handleBack={handleBack} />
          ) : (
            <>
              <LineGraph line={line} />
              <ShutdownCards line={line} />
            </>
          )}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Line;
