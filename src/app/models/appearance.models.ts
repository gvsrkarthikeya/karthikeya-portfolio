export const DESIGN_STYLES = [
  'minimalism',
  'flat',
  'material',
  'glassmorphism',
  'neumorphism',
  'neubrutalism',
  'skeuomorphism',
  'bento',
] as const;

export type DesignStyle = (typeof DESIGN_STYLES)[number];

export const COLOR_THEMES = ['light', 'dark'] as const;

export type ColorTheme = (typeof COLOR_THEMES)[number];

export interface AppearanceSettings {
  designStyle: DesignStyle;
  colorTheme: ColorTheme;
}

export function isDesignStyle(value: unknown): value is DesignStyle {
  return typeof value === 'string' && (DESIGN_STYLES as readonly string[]).includes(value);
}

export function isColorTheme(value: unknown): value is ColorTheme {
  return typeof value === 'string' && (COLOR_THEMES as readonly string[]).includes(value);
}
