export const hexWithAlpha = (hexColor: string, alpha: number) => {
  const opacity = Math.round(Math.min(Math.max(alpha || 1, 0), 1) * 255);
  return hexColor + opacity.toString(16).toUpperCase();
};

export const COLORS = {
  mbta: {
    red: '#D13434',
    orange: '#ed8b00',
    blue: '#003da5',
    green: '#00834d',
    bus: '#FFC72C',
  },
  charts: {
    fillBackgroundColor: '#bfc8d680',
    fillBackgroundColorHourly: '#88aee680',
    pointBackgroundColor: '#1c1c1c',
    pointColor: '#1c1c1c',
  },
  tm: {
    red: '#a31e1e',
    grey: '#2e2d2c',
  },
  design: {
    darkGrey: '#353535',
    sideBar: '#403e3e',
    subtitleGrey: '#808080',
    lightGrey: '#DADADA',
    background: '#F6F6F6',
  },
};

// Colors for charts
export const CHART_COLORS = {
  GREY: '#1c1c1c',
  GREEN: '#64b96a',
  YELLOW: '#f5ed00',
  RED: '#c33149',
  PURPLE: '#bb5cc1',
  FILL: '#bfc8d680',
  FILL_HOURLY: '#88aee680',
  DARK_LINE: '#303030a0',
  ANNOTATIONS: hexWithAlpha('#202020', 0.4),
  BLOCKS: hexWithAlpha('#202020', 0.2),
};
