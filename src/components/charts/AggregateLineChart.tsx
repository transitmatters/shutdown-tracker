import { Line } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';

import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import React, { useMemo, useRef } from 'react';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark';
import { getFormattedTimeString, prettyDate } from '../../utils/date';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { writeError } from '../../utils/chartError';
import { CHART_COLORS } from '../../constants/colors';
import { watermarkLayout } from '../../utils/watermark';
import { AggregateDataPoint } from '../../api/types';
import { useStore } from '../../store';
import { AggregateLineProps } from './types';

const xAxisLabel = (startDate: string, endDate: string, hourly: boolean) => {
  if (hourly) {
    return `${prettyDate(startDate, false)} – ${prettyDate(endDate, false)}`;
  } else {
    const y1 = startDate.split('-')[0];
    const y2 = endDate.split('-')[0];
    return y1 === y2 ? y1 : `${y1} – ${y2}`;
  }
};

export const AggregateLineChart: React.FC<AggregateLineProps> = ({
  chartId,
  beforeData,
  afterData,
  pointField,
  timeUnit,
  timeFormat,
  startDate,
  endDate,
  suggestedYMin,
  suggestedYMax,
  byTime = false,
}) => {
  const { selectedLine, darkMode } = useStore();

  const ref = useRef();
  const hourly = timeUnit === 'hour';
  const isMobile = !useBreakpoint('md');
  const labels = useMemo(
    () => beforeData.map((item) => item[pointField]),
    [beforeData, pointField]
  );

  return (
    <Line
      id={chartId}
      ref={ref}
      height={isMobile ? 200 : 240}
      redraw={true}
      data={{
        labels,
        datasets: [
          {
            label: 'Before Shutdown',
            fill: false,
            tension: 0.1,
            borderColor: CHART_COLORS[selectedLine.toUpperCase()],
            pointBackgroundColor: CHART_COLORS[selectedLine.toUpperCase()],
            pointHoverRadius: 3,
            pointHoverBackgroundColor: CHART_COLORS.GREY,
            pointRadius: byTime ? 0 : 3,
            pointHitRadius: 10,
            stepped: byTime,
            data: beforeData.map((item: AggregateDataPoint) => (item['50%'] / 60).toFixed(2)),
          },
          {
            label: 'After shutdown',
            fill: false,
            tension: 0.1,
            pointBackgroundColor: CHART_COLORS.GREY,
            pointHoverRadius: 3,
            pointHoverBackgroundColor: CHART_COLORS.GREY,
            pointRadius: byTime ? 0 : 3,
            pointHitRadius: 10,
            stepped: byTime,
            data: afterData.map((item: AggregateDataPoint) => (item['50%'] / 60).toFixed(2)),
          },
        ],
      }}
      options={{
        scales: {
          y: {
            title: {
              display: true,
              text: 'Minutes',
              color: darkMode ? 'white' : 'black',
            },
            ticks: {
              precision: 1,
              color: darkMode ? 'white' : 'black',
            },
            suggestedMin: suggestedYMin,
            suggestedMax: suggestedYMax,
          },
          x: {
            ticks: {
              color: darkMode ? 'white' : 'black',
            },
            time: {
              unit: timeUnit,
              // @ts-expect-error The typing expectations are wrong
              stepSize: 1,
              tooltipFormat: timeFormat,
            },
            type: 'time',
            adapters: {
              date: {
                locale: enUS,
              },
            },
            // force graph to show startDate to endDate, even if missing data
            min: hourly ? undefined : startDate,
            max: hourly ? undefined : endDate,
            title: {
              color: darkMode ? 'white' : 'black',
              display: true,
              text: xAxisLabel(startDate ?? '', endDate ?? '', hourly),
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        // Make the tooltip display all 3 datapoints for each x axis entry.
        interaction: {
          mode: 'index',
          intersect: false,
        },
        watermark: watermarkLayout(isMobile),
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            position: 'nearest',
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.dataset.label}: ${getFormattedTimeString(
                  tooltipItem.parsed.y,
                  'minutes'
                )}`;
              },
            },
          },
        },
      }}
      plugins={[
        {
          id: 'customTitleAggregate',
          afterDraw: (chart: ChartJS) => {
            if (startDate === undefined || endDate === undefined || beforeData.length === 0) {
              writeError(chart);
            } else if (afterData.length === 0 || afterData.length < 7) {
              writeError(chart, 'Analysis still in progress, numbers not final.');
            }
          },
        },
        ChartjsPluginWatermark,
      ]}
    />
  );
};
