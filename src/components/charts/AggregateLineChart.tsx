import { Line } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';

import 'chartjs-adapter-date-fns';
import React, { useRef } from 'react';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark';
import dayjs from 'dayjs';
import { getFormattedTimeString } from '../../utils/date';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { writeError } from '../../utils/chartError';
import { CHART_COLORS } from '../../constants/colors';
import { config } from '../../utils/theme';
import { watermarkLayout } from '../../utils/watermark';
import { AggregateDataPoint } from '../../api/types';
import { useStore } from '../../store';
import { filterPeakData } from '../../utils/travelTimes';
import { AggregateLineProps } from './types';

const generateDayLabels = (daysCount: number): string[] => {
  const labels: string[] = [];
  for (let i = 1; i <= daysCount; i++) {
    labels.push(`Day ${i}`);
  }
  return labels;
};

export const AggregateLineChart: React.FC<AggregateLineProps> = ({
  chartId,
  before,
  after,
  line,
  startDate,
  endDate,
  suggestedYMin,
  suggestedYMax,
  shutdown,
  byTime = false,
}) => {
  const { darkMode } = useStore();

  const afterData = after.isSuccess ? filterPeakData(after.data.by_date!) : [];
  const beforeData = before.isSuccess ? filterPeakData(before.data.by_date!) : [];

  const isOlderThanTwoWeeks = dayjs().diff(dayjs(shutdown.stop_date), 'day') > 14;
  const isFutureShutdown = dayjs().isBefore(dayjs(shutdown.start_date));
  const isOngoingShutdown =
    dayjs().isAfter(dayjs(shutdown.start_date)) && dayjs().isBefore(dayjs(shutdown.stop_date));
  const isFinishedShutdown = dayjs().isAfter(dayjs(shutdown.stop_date));

  const ref = useRef();
  const isMobile = !useBreakpoint('md');

  const dayLabels = generateDayLabels(14);

  const watermarkOptions = watermarkLayout(isMobile, darkMode);

  return (
    <Line
      id={chartId}
      ref={ref}
      redraw={true}
      data={{
        labels: dayLabels,
        datasets: [
          {
            label: 'Before shutdown',
            fill: false,
            tension: 0.1,
            borderColor: darkMode ? '#94a3b8' : '#c8cbcf',
            backgroundColor: darkMode ? '#94a3b8' : '#c8cbcf',
            pointBackgroundColor: darkMode ? 'white' : CHART_COLORS.GREY,
            pointHoverRadius: 3,
            pointHoverBackgroundColor: CHART_COLORS.GREY,
            pointRadius: byTime ? 0 : 3,
            pointHitRadius: 10,
            stepped: byTime,
            data: beforeData.map((item: AggregateDataPoint) => (item['50%'] / 60).toFixed(2)),
          },
          {
            label: 'After shutdown',
            backgroundColor: config.theme.colors.mbta[line],
            fill: false,
            tension: 0.1,
            borderColor: config.theme.colors.mbta[line],
            pointBackgroundColor: config.theme.colors.mbta[line],
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
            type: 'category',
            title: {
              color: darkMode ? 'white' : 'black',
              display: true,
              text: 'Day of data collection',
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
        // @ts-ignore - Using plugin that requires watermark property
        watermark: watermarkOptions,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: darkMode ? 'white' : '',
            },
          },
          tooltip: {
            mode: 'index',
            position: 'nearest',
            callbacks: {
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                const beforePointDate = dayjs(shutdown.start_date).subtract(14 - index, 'day');
                const afterPointDate = dayjs(shutdown.stop_date).add(index + 1, 'day');

                return `Day ${index + 1}\nBefore: ${beforePointDate.format('MMM D, YYYY')}\nAfter: ${afterPointDate.format('MMM D, YYYY')}`;
              },
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
            if (before.isPending || after.isPending) {
              writeError(chart, 'Loading...');
            } else if (startDate === undefined || endDate === undefined) {
              writeError(chart);
            } else if (afterData.length < 14) {
              // Only show "in progress" message if we're less than a week after shutdown ended
              // or if it's a future shutdown
              const daysSinceShutdownEnded = dayjs().diff(dayjs(shutdown.stop_date), 'day');
              if (daysSinceShutdownEnded < 14 && !isFutureShutdown) {
                writeError(chart, 'Analysis still in progress, numbers not final.');
              } else if (isFutureShutdown) {
                writeError(
                  chart,
                  '🔜 Showing historical data only - shutdown has not started yet.'
                );
              } else if (isOngoingShutdown) {
                writeError(chart, '🚧 Shutdown in progress - data collection ongoing.');
              } else if (isFinishedShutdown && !isOlderThanTwoWeeks) {
                writeError(chart, '✅ Shutdown complete - recent data may still be processing.');
              }
            }
          },
        },
        ChartjsPluginWatermark,
      ]}
    />
  );
};
