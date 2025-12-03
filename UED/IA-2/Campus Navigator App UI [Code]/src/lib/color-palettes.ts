import { ColorBlindnessType } from './accessibility-context';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export const colorPalettes: Record<ColorBlindnessType, ColorPalette> = {
  none: {
    primary: '#0891b2', // cyan-600
    secondary: '#0e7490', // cyan-700
    accent: '#06b6d4', // cyan-500
    background: '#f0f9ff', // sky-50
    surface: '#ffffff',
    text: '#0f172a', // slate-900
    textSecondary: '#475569', // slate-600
    border: '#cbd5e1', // slate-300
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    error: '#ef4444', // red-500
  },
  protanopia: {
    // Red-blind: Use blues and yellows, avoid red/green
    primary: '#0891b2', // cyan-600
    secondary: '#1e40af', // blue-800
    accent: '#3b82f6', // blue-500
    background: '#f0f9ff',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    border: '#cbd5e1',
    success: '#0891b2', // cyan instead of green
    warning: '#eab308', // yellow-500
    error: '#1e40af', // dark blue instead of red
  },
  deuteranopia: {
    // Green-blind: Use blues and oranges, avoid red/green
    primary: '#0891b2', // cyan-600
    secondary: '#1e3a8a', // blue-900
    accent: '#60a5fa', // blue-400
    background: '#f0f9ff',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    border: '#cbd5e1',
    success: '#0891b2', // cyan instead of green
    warning: '#fb923c', // orange-400
    error: '#1e3a8a', // dark blue instead of red
  },
  tritanopia: {
    // Blue-blind: Use reds and teals, avoid blue/yellow
    primary: '#0d9488', // teal-600
    secondary: '#134e4a', // teal-900
    accent: '#14b8a6', // teal-500
    background: '#f0fdfa', // teal-50
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    border: '#cbd5e1',
    success: '#0d9488', // teal
    warning: '#dc2626', // red-600
    error: '#991b1b', // red-800
  },
};

export const getColorPalette = (type: ColorBlindnessType): ColorPalette => {
  return colorPalettes[type];
};
