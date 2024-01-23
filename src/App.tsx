import classNames from 'classnames';
import './App.css';
import LineGraph from './components/LineGraph';
import ShutdownContainer from './components/Shutdowns/ShutdownContainer';
import { useStore } from './store';
import { colorToStyle } from './styles';

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import Navbar from './components/Navbar';
import ShutdownDetails from './components/Shutdowns/ShutdownDetails';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

ChartJS.register(
  BarController,
  BarElement,
  LineController,
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  annotationPlugin
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 10000, // 10 seconds
    },
  },
});

function App() {
  const { selectedLine, details } = useStore();

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={classNames(
          'fixed inset-0 z-10 lg:border-24 md:border-16 border-10 pointer-events-none',
          colorToStyle[selectedLine]?.border || 'border-tm-lightGrey'
        )}
      />

      <div className="dark:bg-slate-800 bg-slate-100 ">
        <Navbar />
        <div className="md:px-12 p-6 ">
          {details ? (
            <ShutdownDetails details={details} />
          ) : (
            <>
              <LineGraph />
              <ShutdownContainer />
            </>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
