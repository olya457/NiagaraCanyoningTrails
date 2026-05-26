import {Platform} from 'react-native';

export const colors = {
  forest: '#062818',
  deepForest: '#031b10',
  moss: '#123d27',
  mossSoft: '#1b4c31',
  leaf: '#77d3c8',
  mint: '#7fc7c7',
  gold: '#d4aa2e',
  sand: '#eee9d7',
  stone: '#a7b6a7',
  white: '#ffffff',
  ink: '#102018',
  black: '#020705',
  red: '#9d2621',
  border: 'rgba(212,170,46,0.22)',
  overlay: 'rgba(0,0,0,0.44)',
  panel: '#123d27',
  panelStrong: '#082817',
};

export const layout = {
  screenTop: Platform.OS === 'android' ? 30 : 0,
  navBottom: Platform.OS === 'android' ? 30 : 20,
  navHeight: 72,
  radius: 14,
};

export const shadow = {
  shadowColor: colors.black,
  shadowOpacity: 0.24,
  shadowOffset: {width: 0, height: 10},
  shadowRadius: 20,
  elevation: 12,
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
