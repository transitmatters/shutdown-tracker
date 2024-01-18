import { useMediaQuery } from 'react-responsive';
import { config } from '../utils/theme';

const breakpoints = config.theme.screens;

export function useBreakpoint(breakpointKey: string) {
  return useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });
}
