import 'chartjs-adapter-date-fns';

import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Lines, useStore } from '../store';
import { enUS } from 'date-fns/locale';
import { COLORS } from '../constants/colors';
import { ChartDataset } from 'chart.js';
import { shutdowns } from '../constants/shutdowns';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark';
import { watermarkLayout } from '../utils/watermark';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { scroller } from 'react-scroll';

dayjs.extend(utc);

const LineGraph = () => {
  const { selectedLine, darkMode } = useStore();
  const isMobile = !useBreakpoint('sm');

  const ref = useRef();
  const divRef = useRef<HTMLDivElement>();
  const [distanceToBottom, setDistanceToBottom] = useState(0);

  useEffect(() => {
    const calculateDistance = () => {
      if (divRef.current) {
        const rect = divRef.current.getBoundingClientRect();
        const distance = window.innerHeight - rect.bottom;
        setDistanceToBottom(distance - 50);
      }
    };

    // Calculate it initially and also on window resize
    calculateDistance();
    window.addEventListener('resize', calculateDistance);

    // Cleanup
    return () => window.removeEventListener('resize', calculateDistance);
  }, []);

  const routes = useMemo(
    () =>
      Array.from(
        new Set(
          Object.entries(shutdowns)
            .filter(([line]) => line === selectedLine || selectedLine === 'all')
            .map(([, shutdowns]) =>
              shutdowns.map((sd) => `${sd.start_station.stop_name}-${sd.end_station.stop_name}`)
            )
            .flat()
        )
      ),
    [selectedLine]
  );

  const mappedShutdowns = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(shutdowns)
          .filter(([line]) => line === selectedLine || selectedLine === 'all')
          .map(([line, shutdowns]) => {
            const mappedData = shutdowns.map((sd) => {
              const sdStartDate = dayjs.utc(sd.start_date);
              const sdEndDate = dayjs.utc(sd.stop_date);
              const szTimePeriod = [
                sdStartDate.format('YYYY-MM-DD'),
                sdEndDate.format('YYYY-MM-DD'),
              ];
              return {
                x: szTimePeriod,
                y: szTimePeriod,
                id: `${sd.start_station.stop_name}-${sd.end_station.stop_name}`,
              };
            });
            return [line, mappedData];
          })
      ),
    [selectedLine]
  );

  return (
    <div
      className={`w-full overflow-y-hidden rounded-lg bg-white dark:dark:bg-slate-700  dark:text-white p-4 shadow`}
    >
      <div className="text-2xl font-medium">Segments</div>
      <div
        ref={divRef as MutableRefObject<HTMLDivElement>}
        className="ml-2 sm:ml-0 flex flex-row gap-4"
        style={{ height: distanceToBottom }}
      >
        <Bar
          ref={ref}
          id={`gnatt-chart`}
          data={{
            labels: routes,
            datasets: Object.entries(mappedShutdowns).map(([line, s]) => {
              const datasetObject: ChartDataset<'bar', typeof s> = {
                borderWidth: 2,
                borderColor: COLORS.mbta[line as Lines],
                backgroundColor: COLORS.mbta[line as Lines],
                borderSkipped: false,
                data: s,
              };

              // If we're in system mode
              if (Object.entries(mappedShutdowns).length > 1) {
                datasetObject.barPercentage = 50;
                datasetObject.categoryPercentage = 0.05;
              }
              return datasetObject;
            }),
          }}
          plugins={[ChartjsPluginWatermark]}
          options={{
            parsing: { yAxisKey: 'id' },
            maintainAspectRatio: false,
            responsive: true,
            indexAxis: 'y',
            scales: {
              x: {
                type: 'time',
                min: dayjs(new Date(2023, 11, 1)).toISOString(),
                max: dayjs(new Date(2024, 11, 31)).toISOString(),
                time: { unit: 'month' },
                adapters: {
                  date: {
                    locale: enUS,
                  },
                },
                display: true,
                offset: true,
                ticks: {
                  color: darkMode ? 'white' : 'black',
                },
              },
              y: {
                position: 'top',
                beginAtZero: true,
                ticks: {
                  color: darkMode ? 'white' : 'black',
                },
              },
            },
            onHover: (event, elements) => {
              // @ts-expect-error TS doesn't think target has `style` (rude), but it does
              event.native.target.style.cursor = elements?.[0] ? 'pointer' : 'default';
            },
            onClick: (__, elements) => {
              if (elements.length >= 1) {
                const { id, x } = elements[0].element['$context'].raw;
                scroller.scrollTo(`${id}-${x[0]}-${x[1]}`, {
                  smooth: true,
                  offset: -32,
                });
              }
            },
            // @ts-expect-error The watermark plugin doesn't have typescript support
            watermark: watermarkLayout(isMobile),
            plugins: {
              tooltip: {
                callbacks: {
                  label: () => {
                    return '';
                  },
                  beforeBody: (context) => {
                    const start = context[0].parsed._custom?.barStart;
                    const end = context[0].parsed._custom?.barEnd;
                    if (!(start && end)) return 'Unknown dates';
                    const startUTC = dayjs.utc(start);
                    const endUTC = dayjs.utc(end);
                    return `${startUTC.format('MMM D, YYYY')} - ${dayjs(endUTC).format(
                      'MMM D, YYYY'
                    )}`;
                  },
                },
              },
              legend: {
                display: false,
              },
              annotation: {
                annotations: {
                  line1: {
                    type: 'line',
                    xMin: dayjs(new Date()).toISOString(),
                    xMax: dayjs(new Date()).toISOString(),
                    borderColor: 'tm-bg-grey',
                    borderWidth: 2,
                    label: {
                      content: 'Today',
                      display: true,
                      position: 'end',
                    },
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default LineGraph;
