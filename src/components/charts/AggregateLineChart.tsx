import { Line } from 'react-chartjs-2';
import type { Chart as ChartJS } from 'chart.js';

import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import React, { useMemo, useRef } from 'react';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark';
import { getFormattedTimeString, prettyDate } from '../../utils/date';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { writeError } from '../../utils/chartError';
import { ChartBorder } from './ChartBorder';
import { CHART_COLORS } from '../../constants/colors';
import { watermarkLayout } from '../../utils/watermark';
import { AggregateDataPoint } from '../../api/types';
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
  data,
  pointField,
  timeUnit,
  timeFormat,
  seriesName,
  startDate,
  endDate,
  fillColor,
  suggestedYMin,
  suggestedYMax,
  byTime = false,
}) => {
  const ref = useRef();
  const hourly = timeUnit === 'hour';
  const isMobile = !useBreakpoint('md');
  const labels = useMemo(() => data.map((item) => item[pointField]), [data, pointField]);

  return (
    <ChartBorder>
      <Line
        id={chartId}
        ref={ref}
        height={isMobile ? 200 : 240}
        redraw={true}
        data={{
          labels,
          datasets: [
            {
              label: seriesName,
              fill: false,
              tension: 0.1,
              borderColor: byTime ? CHART_COLORS.DARK_LINE : undefined,
              pointBackgroundColor: CHART_COLORS.GREY,
              pointHoverRadius: 3,
              pointHoverBackgroundColor: CHART_COLORS.GREY,
              pointRadius: byTime ? 0 : 3,
              pointHitRadius: 10,
              stepped: byTime,
              data: data.map((item: AggregateDataPoint) => (item['50%'] / 60).toFixed(2)),
            },
            {
              label: '25th percentile',
              fill: 1,
              backgroundColor: fillColor,
              stepped: byTime,
              tension: 0.4,
              pointRadius: 0,
              data: data.map((item: AggregateDataPoint) => (item['25%'] / 60).toFixed(2)),
            },
            {
              label: '75th percentile',
              fill: 1,
              backgroundColor: fillColor,
              stepped: byTime,
              tension: 0.4,
              pointRadius: 0,
              data: data.map((item: AggregateDataPoint) => (item['75%'] / 60).toFixed(2)),
            },
          ],
        }}
        options={{
          scales: {
            y: {
              title: {
                display: true,
                text: 'Minutes',
              },
              ticks: {
                precision: 1,
              },
              suggestedMin: suggestedYMin,
              suggestedMax: suggestedYMax,
            },
            x: {
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
              if (startDate === undefined || endDate === undefined || data.length === 0) {
                writeError(chart);
              }
            },
          },
          ChartjsPluginWatermark,
        ]}
      />
    </ChartBorder>
  );
};
