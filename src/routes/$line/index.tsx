import { createFileRoute } from '@tanstack/react-router';
import classNames from 'classnames';
import { colorToStyle } from '../../styles';
import Navbar from '../../components/Navbar';
import ShutdownDetails from '../../components/Shutdowns/ShutdownDetails';
import LineGraph from '../../components/LineGraph';
import ShutdownContainer from '../../components/Shutdowns/ShutdownContainer';
import { Lines } from '../../store';
import { LineButtons } from '../../components/LineButtons';

interface SearchParams {
  start_station?: string;
  end_station?: string;
  start_date?: string;
  end_date?: string;
}

export const Route = createFileRoute('/$line/')({
  component: Home,
  validateSearch: (search: SearchParams) => {
    return search;
  },
  parseParams: (params) => {
    return { line: params.line as Lines | 'all' };
  },
});

function Home() {
  const { line } = Route.useParams();
  const search = Route.useSearch();

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
        </Navbar>
        <div className="md:px-12 p-6">
          {search.start_date ? (
            // @ts-expect-error `all` won't ever get here
            <ShutdownDetails line={line} {...search} />
          ) : (
            <>
              <LineGraph />
              <ShutdownContainer />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
