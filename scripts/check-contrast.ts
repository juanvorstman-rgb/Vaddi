// scripts/check-contrast.ts
// WCAG AA gate: every readable text-on-surface pair, in both themes, must be
// >= 4.5:1. Run in the pre-commit checklist:  npx tsx scripts/check-contrast.ts
// Exits non-zero on any failure so a bad token can't be committed.

import { darkColors, lightColors, type ColorScheme } from '../src/theme/tokens';

const MIN = 4.5;

function toLinear(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function ratio(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT: (keyof ColorScheme)[] = ['textPrimary', 'textSecondary', 'textMuted'];
const SURFACE: (keyof ColorScheme)[] = ['background', 'surface', 'elevated'];

const themes: { name: string; colors: ColorScheme }[] = [
  { name: 'light', colors: lightColors },
  { name: 'dark', colors: darkColors },
];

let failures = 0;
for (const { name, colors } of themes) {
  for (const t of TEXT) {
    for (const s of SURFACE) {
      const r = ratio(colors[t], colors[s]);
      const ok = r >= MIN;
      if (!ok) failures++;
      const tag = ok ? 'PASS' : 'FAIL';
      console.log(
        `${tag}  ${name.padEnd(5)}  ${t.padEnd(14)} on ${s.padEnd(11)}  ${r.toFixed(2)}:1`,
      );
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} contrast pair(s) below ${MIN}:1 — fix tokens in src/theme.`);
  process.exit(1);
}
console.log(`\nAll text-on-surface pairs >= ${MIN}:1 in both themes.`);
