import { Line } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';

import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
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

const xAxisLabel = (startDate: string, endDate: string) => {
  const y1 = startDate.split('-')[0];
  const y2 = endDate.split('-')[0];
  return y1 === y2 ? y1 : `${y1} – ${y2}`;
};

export const AggregateLineChart: React.FC<AggregateLineProps> = ({
  chartId,
  before,
  after,
  line,
  pointField,
  timeUnit,
  timeFormat,
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

  const ref = useRef();
  const isMobile = !useBreakpoint('md');
  const labels = beforeData.map((item) => item[pointField]);

  return (
    <Line
      id={chartId}
      ref={ref}
      //height={isMobile ? 200 : 240}
      redraw={true}
      data={{
        labels,
        datasets: [
          {
            label: 'Before shutdown',
            fill: false,
            tension: 0.1,
            pointBackgroundColor: CHART_COLORS.GREY,
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
              display: false,
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
            min: startDate,
            max: endDate,
            title: {
              color: darkMode ? 'white' : 'black',
              display: true,
              text: xAxisLabel(startDate ?? '', endDate ?? ''),
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
        watermark: watermarkLayout(isMobile, darkMode),
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            mode: 'index',
            position: 'nearest',
            callbacks: {
              title: (tooltipItems) => {
                const beforePointDate = dayjs(shutdown.start_date).subtract(
                  8 - tooltipItems[0].dataIndex,
                  'day'
                );
                const afterPointDate = dayjs(shutdown.stop_date).add(
                  tooltipItems[0].dataIndex + 1,
                  'day'
                );

                return `${`${beforePointDate.format('MMM D, YYYY')} - ${afterPointDate.format('MMM D, YYYY')}`}`;
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
            } else if (
              startDate === undefined ||
              endDate === undefined ||
              beforeData.length === 0
            ) {
              writeError(chart);
            } else if (afterData.length < 7) {
              writeError(chart, 'Analysis still in progress, numbers not final.');
            }
          },
        },
        ChartjsPluginWatermark,
      ]}
    />
  );
};
