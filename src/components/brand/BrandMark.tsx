// src/components/brand/BrandMark.tsx
import { Image } from 'expo-image';

// Top-level asset import (never require() inside a function — CLAUDE.md).
const LOGO = require('../../../assets/brand/Vaddi_logo_NBG.png');

export function BrandMark({ size = 48 }: { size?: number }) {
  // The logo carries its own coral/teal colours; keep its 549:465 aspect ratio.
  const height = Math.round((size * 465) / 549);
  return (
    <Image
      source={LOGO}
      style={{ width: size, height }}
      contentFit="contain"
      accessibilityLabel="Vaddi"
    />
  );
}
