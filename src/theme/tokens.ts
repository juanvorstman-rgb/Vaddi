// src/theme/tokens.ts
// The single source of design tokens. No hex colour literal may live outside
// this folder (enforced by ESLint). Pure data only — no React Native imports —
// so scripts/check-contrast.ts can import it in Node.
//
// Palette is v4 §6: Coral, Teal, Navy, Orange, Blue, plus functional greys,
// success, warning, error. Light and dark from day one (v4 §6).

// ── Brand (v4 §6) ────────────────────────────────────────────────────────────
export const brand = {
  coral: '#FF6B6B',
  teal: '#2DD4BF',
  navy: '#1E293B',
  orange: '#E67A2D',
  blue: '#3489C9',
} as const;

// ── Colour sets ──────────────────────────────────────────────────────────────
// `text*` are the readable foreground tones; `background|surface|elevated` are
// the surfaces they sit on. Every text×surface pair is contrast-checked ≥4.5:1
// in both themes by scripts/check-contrast.ts.
export interface ColorScheme {
  // surfaces
  background: string;
  surface: string;
  elevated: string;
  // text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // accents (brand)
  coral: string;
  teal: string;
  navy: string;
  orange: string;
  blue: string;
  // functional
  success: string;
  warning: string;
  error: string;
  // lines + a foreground for coloured buttons
  border: string;
  onAccent: string;
}

export const lightColors: ColorScheme = {
  background: '#FFFFFF',
  surface: '#F4F6F8',
  elevated: '#FFFFFF',

  textPrimary: '#16202E',
  textSecondary: '#3D4756',
  textMuted: '#556072',

  coral: '#FF6B6B',
  teal: '#2DD4BF',
  navy: '#1E293B',
  orange: '#E67A2D',
  blue: '#3489C9',

  success: '#0F7A4E',
  warning: '#9A5B00',
  error: '#C2311B',

  border: '#E2E8F0',
  onAccent: '#FFFFFF',
};

export const darkColors: ColorScheme = {
  background: '#0F172A',
  surface: '#1E293B',
  elevated: '#273449',

  textPrimary: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',

  coral: '#FF6B6B',
  teal: '#2DD4BF',
  navy: '#1E293B',
  orange: '#E67A2D',
  blue: '#3489C9',

  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',

  border: '#334155',
  onAccent: '#0B1220',
};

// ── Type (v4 §6: Inter 400/500/600/700, five sizes at most) ──────────────────
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

// Exactly five sizes.
export const fontSize = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 28,
} as const;

// Named roles map onto the five sizes and the four weights.
export const typography = {
  display: { fontFamily: fontFamily.bold, fontSize: fontSize.xl, lineHeight: 34 },
  title: { fontFamily: fontFamily.semibold, fontSize: fontSize.lg, lineHeight: 26 },
  body: { fontFamily: fontFamily.regular, fontSize: fontSize.md, lineHeight: 22 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: fontSize.md, lineHeight: 22 },
  small: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, lineHeight: 18 },
  caption: { fontFamily: fontFamily.semibold, fontSize: fontSize.xs, lineHeight: 14, letterSpacing: 0.4 },
} as const;

// ── Space (4/8 grid) and radii ───────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

// Minimum touch target (v4 §6: 44pt or larger).
export const hitTarget = 44;

export const fontsToLoad = {
  Inter_400Regular: fontFamily.regular,
  Inter_500Medium: fontFamily.medium,
  Inter_600SemiBold: fontFamily.semibold,
  Inter_700Bold: fontFamily.bold,
} as const;

export type ThemeTokens = {
  colors: ColorScheme;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  fontFamily: typeof fontFamily;
  fontSize: typeof fontSize;
  hitTarget: number;
  isDark: boolean;
};
