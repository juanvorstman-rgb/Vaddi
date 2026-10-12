// src/data/fixtures — seed ideas, one set per destination.
// When an event is created its destination's fixtures are copied into `ideas`
// for that event, so the group starts with something on screen instead of an
// empty feed (VADDI §5.1, value before signup).
//
// `demo-ideas` is the Phase 1 feed data the Discover and detail screens still
// render. It goes away in B3, when those screens read the event's own ideas.

import { MADRID_FIXTURES } from './madrid';
import { SALOU_FIXTURES } from './salou';
import type { FixtureDestination, FixtureIdea } from './types';

export { MADRID_FIXTURES } from './madrid';
export { SALOU_FIXTURES } from './salou';
export {
  fixturePhoto,
  type FixtureCategory,
  type FixtureDestination,
  type FixtureIdea,
} from './types';

export { CURRENT_USER, MADRID_IDEAS } from './demo-ideas';

/** The destinations an event can be created for in Phase 2. */
export const FIXTURE_DESTINATIONS: FixtureDestination[] = ['Madrid', 'Salou'];

const BY_DESTINATION: Record<FixtureDestination, FixtureIdea[]> = {
  Madrid: MADRID_FIXTURES,
  Salou: SALOU_FIXTURES,
};

export function fixturesFor(destination: FixtureDestination): FixtureIdea[] {
  return BY_DESTINATION[destination];
}
