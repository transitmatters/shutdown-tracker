import 'chartjs-adapter-date-fns';

import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { enUS } from 'date-fns/locale';
import { type ChartDataset } from 'chart.js';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark';
import { LineFilter, Lines, useStore } from '../store';
import { lineColor } from '../constants/colors';
import { isCommuterRail, lineDisplayName, matchesLineFilter } from '../utils/lines';
import { shutdowns } from '../constants/shutdowns';
import { watermarkLayout } from '../utils/watermark';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { cardStyles } from '../constants/styles';
import { Shutdown } from '../types';
import { abbreviateStationName } from '../constants/stations';
import { CalendarSubscribeButton } from './CalendarSubscribeButton';

dayjs.extend(utc);

interface LineGraphProps {
  line: LineFilter;
}

const stationPairLabel = (shutdown: Shutdown, line: string) => {
  const pair = `${abbreviateStationName(shutdown.start_station?.stop_name)}-${abbreviateStationName(shutdown.end_station?.stop_name)}`;
  // Commuter rail routes share stations (e.g. Braintree-South Station), so name the route
  return isCommuterRail(line) ? `${lineDisplayName(line).replace(/ Line$/, '')}: ${pair}` : pair;
};

type TimelineBar = {
  x: string[];
  y: string[];
  id: string;
  start_station?: string;
  end_station?: string;
  line: string;
};

// Every commuter rail route is drawn as one purple dataset
const datasetKey = (line: string) => (isCommuterRail(line) ? 'commuter-rail' : (line as Lines));

export const LineGraph: React.FunctionComponent<LineGraphProps> = ({ line: selectedLine }) => {
  const { darkMode, range } = useStore();
  const isMobile = !useBreakpoint('sm');

  const ref = useRef();
  const divRef = useRef<HTMLDivElement>();
  const [distanceToBottom, setDistanceToBottom] = useState(0);

  const navigate = useNavigate({});

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const distance = window.innerHeight - rect.bottom;
      setDistanceToBottom(Math.max(distance - 50, 500));
    }
  }, []);

  // Calculate the maximum date to show: 1 year ahead or latest shutdown, whichever is smaller
  const maxDateToShow = useMemo(() => {
    const oneYearAhead = dayjs(new Date()).add(1, 'year');
    const allShutdownDates = Object.values(shutdowns)
      .flat()
      .map((sd) => dayjs(sd.stop_date))
      .filter((date) => date.isAfter(dayjs(new Date())));

    if (allShutdownDates.length === 0) {
      return oneYearAhead;
    }

    const latestShutdownDate = allShutdownDates.reduce((latest, current) =>
      current.isAfter(latest) ? current : latest
    );

    // Add a day buffer so the shutdown that defines this boundary isn't excluded
    // by the strict `isBefore` comparisons below.
    return (latestShutdownDate.isBefore(oneYearAhead) ? latestShutdownDate : oneYearAhead).add(
      1,
      'day'
    );
  }, []);

  const routes = useMemo(
    () =>
      Array.from(
        new Set(
          Object.entries(shutdowns)
            .filter(([line]) => matchesLineFilter(line, selectedLine))
            .map(([line, shutdowns]): [string, Shutdown[]] => [
              line,
              shutdowns.filter((sd) =>
                range === 'upcoming'
                  ? dayjs(new Date()).isBefore(dayjs(sd.stop_date)) &&
                    dayjs(sd.stop_date).isBefore(maxDateToShow)
                  : range === 'past'
                    ? dayjs(new Date()).isAfter(dayjs(sd.start_date))
                    : true
              ),
            ])
            .map(([line, shutdowns]) => shutdowns.map((sd) => stationPairLabel(sd, line)))
            .flat()
        )
      ),
    [range, selectedLine, maxDateToShow]
  );

  const mappedShutdowns = useMemo(
    () =>
      Object.entries(shutdowns)
        .filter(([line]) => matchesLineFilter(line, selectedLine))
        .map(([line, shutdowns]): [string, TimelineBar[]] => {
          const mappedData = shutdowns
            .filter((sd) =>
              range === 'upcoming'
                ? dayjs(new Date()).isBefore(dayjs(sd.stop_date)) &&
                  dayjs(sd.stop_date).isBefore(maxDateToShow)
                : range === 'past'
                  ? dayjs(new Date()).isAfter(dayjs(sd.start_date))
                  : true
            )
            .map((sd) => {
              const sdStartDate = dayjs.utc(sd.start_date);
              const sdEndDate = dayjs.utc(sd.stop_date);
              const szTimePeriod = [
                sdStartDate.format('YYYY-MM-DD'),
                sdEndDate.format('YYYY-MM-DD'),
              ];
              return {
                x: szTimePeriod,
                y: szTimePeriod,
                id: stationPairLabel(sd, line),
                start_station: sd.start_station?.stop_name,
                end_station: sd.end_station?.stop_name,
                line: line,
              };
            });
          return [line, mappedData];
        })
        .reduce<Record<string, TimelineBar[]>>((acc, [line, mappedData]) => {
          const key = datasetKey(line);
          acc[key] = [...(acc[key] ?? []), ...mappedData];
          return acc;
        }, {}),
    [range, selectedLine, maxDateToShow]
  );

  const singleDataset = Object.keys(mappedShutdowns).length <= 1;

  return (
    <div className={`w-full overflow-y-hidden ${cardStyles}`}>
      <div className="flex justify-between">
        <div className="text-2xl font-medium">Timeline</div>
        <CalendarSubscribeButton />
      </div>
      <div
        ref={divRef as MutableRefObject<HTMLDivElement>}
        className="ml-2 sm:ml-0 flex flex-row gap-4"
        style={{ height: distanceToBottom }}
      >
        <Bar
          ref={ref}
          id={`gnatt-chart`}
          height={distanceToBottom}
          data={{
            labels: routes,
            datasets: Object.entries(mappedShutdowns).map(([line, s]) => {
              const datasetObject: ChartDataset<'bar', typeof s> = {
                borderWidth: 2,
                borderColor: lineColor(line as Lines | 'commuter-rail'),
                backgroundColor: lineColor(line as Lines | 'commuter-rail'),
                borderSkipped: false,
                // Single-day shutdowns start and stop on the same date, so keep them visible
                minBarLength: 4,
                data: s,
                barPercentage: singleDataset ? 0.95 : 50,
                categoryPercentage: singleDataset ? 1 : 0.05,
              };

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
                min:
                  range === 'upcoming'
                    ? dayjs(new Date()).toISOString()
                    : dayjs(new Date(2023, 11, 10)).toISOString(),
                max:
                  range === 'past' ? dayjs(new Date()).toISOString() : maxDateToShow.toISOString(),
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
                  // Put the commuter rail route on its own line so labels fit on phones
                  callback: function (value) {
                    const label = this.getLabelForValue(value as number);
                    return isMobile && label.includes(': ') ? label.split(': ') : label;
                  },
                },
              },
            },
            onHover: (event, elements) => {
              // @ts-expect-error TS doesn't think target has `style` (rude), but it does
              event.native.target.style.cursor = elements?.[0] ? 'pointer' : 'default';
            },
            onClick: (__, elements) => {
              if (elements.length >= 1) {
                const {
                  x: [startDate, endDate],
                  start_station,
                  end_station,
                  line,
                } = elements[0].element['$context'].raw;

                navigate({
                  to: '/$line',
                  params: { line: line },
                  search: { start_date: startDate, end_date: endDate, start_station, end_station },
                });
              }
            },
            // @ts-expect-error The watermark plugin doesn't have typescript support
            watermark: watermarkLayout(isMobile, darkMode),
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
      <div className="text-xs italic">* dates subject to change</div>
    </div>
  );
};
