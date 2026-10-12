// src/data/fixtures/types.ts
// The shape of a seed idea. One fixture row is copied into the `ideas` table
// for an event when that event is created, so the fields here mirror the
// table's columns (camelCase in TS, snake_case in Postgres).
//
// `bookingUrl` is a link OUT to a partner. Vaddi never takes money and never
// books on behalf of the group — it hands over the club and gets out of the way.

import type { PriceBand } from '@/types/idea';

export type FixtureCategory = 'eat' | 'drink' | 'do' | 'stay';

export type FixtureDestination = 'Madrid' | 'Salou';

export interface FixtureIdea {
  /** Stable slug. Becomes part of the ideas row id when copied into an event. */
  slug: string;
  category: FixtureCategory;
  title: string;
  /** The one-line "why this", in the caddie voice. Two sentences at most. */
  why: string;
  priceBand: PriceBand;
  /** Free text, e.g. "8 min walk" — maps to `ideas.distance_text`. */
  distanceText: string;
  photoUrl: string;
  /** Partner listing page. Absent when no partner exists for this idea. */
  bookingUrl?: string;
}

/** Placeholder photos. Real ones arrive with Places in Phase 3 and are never stored. */
export const fixturePhoto = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;
