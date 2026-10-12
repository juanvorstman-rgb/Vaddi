// src/data/fixtures/salou.ts
// Eight seed ideas for Salou: 3 eat, 3 drink, 2 do. Real places.
// Salou is the despedida market — the drink set is the Carrer de Carles Buïgas
// strip, which is where a group actually starts the night.
// The two `do` items carry a Civitatis listing page as their booking link —
// a real listing, not an affiliate deep link; those arrive in Phase 6.

import { fixturePhoto, type FixtureIdea } from './types';

export const SALOU_FIXTURES: FixtureIdea[] = [
  // ——— eat ———
  {
    slug: 'club-nautico-salou',
    category: 'eat',
    title: 'Restaurant Club Nàutic Salou',
    why: 'Fresh fish on the sport port with the whole bay in front of you. The one sit-down meal worth booking ahead.',
    priceBand: '€€€',
    distanceText: '10 min walk',
    photoUrl: fixturePhoto('clubnautic'),
  },
  {
    slug: 'la-goleta',
    category: 'eat',
    title: 'La Goleta',
    why: 'Seafood paella on Passeig Jaume I, straight onto the promenade. Order it for the table and let it take an hour.',
    priceBand: '€€',
    distanceText: '3 min walk',
    photoUrl: fixturePhoto('lagoleta'),
  },
  {
    slug: 'arena-tapas',
    category: 'eat',
    title: 'Arena Tapas',
    why: 'Mediterranean tapas halfway down the promenade — fish-market plates, no ceremony. Easiest lunch for eight.',
    priceBand: '€€',
    distanceText: '5 min walk',
    photoUrl: fixturePhoto('arenatapas'),
  },

  // ——— drink ———
  {
    slug: 'carles-buigas-start',
    category: 'drink',
    title: 'Carrer de Carles Buïgas',
    why: 'The strip. Every pub and terrace in Salou is on this one street — start here at 23:00 and walk it.',
    priceBand: '€',
    distanceText: '7 min walk',
    photoUrl: fixturePhoto('carlesbuigas'),
  },
  {
    slug: 'di-mare-club',
    category: 'drink',
    title: 'Di Mare Club',
    why: 'Club on Carles Buïgas that swings from current hits to retro without warning. Free before midnight.',
    priceBand: '€€',
    distanceText: '8 min walk',
    photoUrl: fixturePhoto('dimare'),
  },
  {
    slug: 'city-hall-salou',
    category: 'drink',
    title: 'City Hall',
    why: 'The despedida club in Salou — expect other groups doing exactly what you are doing. Go last, not first.',
    priceBand: '€€',
    distanceText: '9 min walk',
    photoUrl: fixturePhoto('cityhall'),
  },

  // ——— do ———
  {
    slug: 'portaventura-park',
    category: 'do',
    title: 'PortAventura Park',
    why: 'Fifteen minutes away and it eats a whole day. Buy the ticket the night before; the gate queue is brutal.',
    priceBand: '€€€',
    distanceText: '15 min by car',
    photoUrl: fixturePhoto('portaventura'),
    bookingUrl: 'https://www.civitatis.com/es/salou/',
  },
  {
    slug: 'moto-agua-salou',
    category: 'do',
    title: 'Jet ski tour, Costa Daurada',
    why: 'An hour on the water is the one activity nobody in the group argues about. Book the morning slot — flat sea.',
    priceBand: '€€€',
    distanceText: '6 min walk to the marina',
    photoUrl: fixturePhoto('motoagua'),
    bookingUrl: 'https://www.civitatis.com/es/salou/',
  },
];
