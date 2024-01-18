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

function App() {
  const { selectedLine } = useStore();

  return (
    <>
      <div
        className={classNames(
          'fixed inset-0 z-10 lg:border-24 md:border-16 border-10 pointer-events-none',
          colorToStyle[selectedLine]?.border || 'border-tm-lightGrey'
        )}
      />

      <div className="relative z-0 dark:bg-slate-800 bg-slate-100">
        <Navbar />
        <div className="md:px-12 px-6 py-4">
          <LineGraph />
          <ShutdownContainer />
        </div>
      </div>
    </>
  );
}

export default App;
