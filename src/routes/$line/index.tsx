import { createFileRoute } from '@tanstack/react-router';
import classNames from 'classnames';
import { useNavigate } from '@tanstack/react-router';
import { colorToStyle } from '../../styles';
import Navbar from '../../components/Navbar';
import ShutdownDetails from '../../components/Shutdowns/ShutdownDetails';
import { LineGraph } from '../../components/LineGraph';
import { ShutdownCards } from '../../components/Shutdowns/ShutdownContainer';
import { Lines } from '../../store';
import { LineButtons } from '../../components/LineButtons';
import Footer from '../../components/Footer';

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
  const navigate = useNavigate({ from: '/$line/' });

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
          {search.start_date &&
          search.end_date &&
          search.start_station &&
          search.end_station &&
          line !== 'all' ? (
            <ShutdownDetails
              line={line}
              start_date={search.start_date}
              end_date={search.end_date}
              start_station={search.start_station}
              end_station={search.end_station}
              handleBack={() => {
                navigate({ search: {} });
              }}
            />
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
