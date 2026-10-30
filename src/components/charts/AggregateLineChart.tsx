import { Line } from 'react-chartjs-2';
import type { Chart as ChartJS, ScriptableLineSegmentContext } from 'chart.js';

import 'chartjs-adapter-date-fns';
import React, { useRef } from 'react';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark';
import dayjs from 'dayjs';
import { getComparisonWindows, getFormattedTimeString } from '../../utils/date';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { writeError } from '../../utils/chartError';
import { CHART_COLORS } from '../../constants/colors';
import { config } from '../../utils/theme';
import { watermarkLayout } from '../../utils/watermark';
import { AggregateDataPoint } from '../../api/types';
import { useStore } from '../../store';
import { alignToWindow } from '../../utils/travelTimes';
import { AggregateLineProps } from './types';

// Dash the line where it bridges over days with no data
const gapSegment = {
  borderDash: (ctx: ScriptableLineSegmentContext) =>
    ctx.p0.skip || ctx.p1.skip ? [6, 6] : undefined,
};

const toMinutes = (point: AggregateDataPoint | null) =>
  point ? Number((point['50%'] / 60).toFixed(2)) : null;

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
  suggestedYMin,
  suggestedYMax,
  shutdown,
  byTime = false,
}) => {
  const { darkMode } = useStore();

  const windows = getComparisonWindows(shutdown);
  const beforeData = alignToWindow(
    before.isSuccess ? before.data.by_date : [],
    windows.before.start
  );
  const afterData = alignToWindow(after.isSuccess ? after.data.by_date : [], windows.after.start);
  const beforeCount = beforeData.filter(Boolean).length;
  const afterCount = afterData.filter(Boolean).length;

  const isOlderThanTwoWeeks = dayjs().diff(dayjs(shutdown.stop_date), 'day') > 14;
  const isFutureShutdown = dayjs().isBefore(dayjs(shutdown.start_date));
  const isOngoingShutdown =
    dayjs().isAfter(dayjs(shutdown.start_date)) && dayjs().isBefore(dayjs(shutdown.stop_date));
  const isFinishedShutdown = dayjs().isAfter(dayjs(shutdown.stop_date));

  const ref = useRef();
  const isMobile = !useBreakpoint('md');

  const dayLabels = generateDayLabels(beforeData.length);

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
            spanGaps: true,
            segment: gapSegment,
            data: beforeData.map(toMinutes),
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
            spanGaps: true,
            segment: gapSegment,
            data: afterData.map(toMinutes),
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
                const beforePointDate = dayjs(windows.before.start).add(index, 'day');
                const afterPointDate = dayjs(windows.after.start).add(index, 'day');

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
            } else if (beforeCount === 0 && afterCount === 0) {
              writeError(chart);
            } else if (isFutureShutdown) {
              writeError(chart, '🔜 Showing historical data only - shutdown has not started yet.');
            } else if (isOngoingShutdown) {
              writeError(chart, '🚧 Shutdown in progress - data collection ongoing.');
            } else if (
              isFinishedShutdown &&
              !isOlderThanTwoWeeks &&
              afterCount < afterData.length
            ) {
              writeError(chart, '✅ Shutdown complete - recent data may still be processing.');
            }
          },
        },
        ChartjsPluginWatermark,
      ]}
    />
  );
};
