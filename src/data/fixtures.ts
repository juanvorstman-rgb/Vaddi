// src/data/fixtures.ts
// Hardcoded ideas for Phase 1 / Phase 2 — prove the UX before paying for a
// single API call (v4 §11 Phase 2). Eight real Madrid spots across eat/drink/do.
// Photos are placeholder URLs; real photos arrive with Places in Phase 3.

import type { Idea } from '@/types/idea';

const photo = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

export const MADRID_IDEAS: Idea[] = [
  {
    id: 'idea-sobrino-botin',
    name: 'Sobrino de Botín',
    category: 'eat',
    why: 'The world’s oldest restaurant — book the roast suckling pig.',
    photoUrl: photo('botin'),
    priceBand: '€€€',
    distanceMeters: 450,
    reactions: [
      { userId: 'u-ana', name: 'Ana', vote: 'yes' },
      { userId: 'u-leo', name: 'Leo', vote: 'yes' },
      { userId: 'u-max', name: 'Max', vote: 'no' },
    ],
    bookingUrl: 'https://botin.es',
  },
  {
    id: 'idea-mercado-san-miguel',
    name: 'Mercado de San Miguel',
    category: 'eat',
    why: 'Tapas crawl under one iron roof — everyone finds a favourite.',
    photoUrl: photo('sanmiguel'),
    priceBand: '€€',
    distanceMeters: 300,
    reactions: [
      { userId: 'u-ana', name: 'Ana', vote: 'yes' },
      { userId: 'u-sof', name: 'Sofía', vote: 'yes' },
    ],
  },
  {
    id: 'idea-lamucca',
    name: 'La Mucca de Pez',
    category: 'eat',
    why: 'Lively Malasaña kitchen — good for a big shared table.',
    photoUrl: photo('lamucca'),
    priceBand: '€€',
    etaMinutes: 12,
    reactions: [{ userId: 'u-leo', name: 'Leo', vote: 'yes' }],
  },
  {
    id: 'idea-salmon-guru',
    name: 'Salmón Gurú',
    category: 'drink',
    why: 'World’s-50-Best cocktail bar, five minutes from the plaza.',
    photoUrl: photo('salmonguru'),
    priceBand: '€€€',
    distanceMeters: 550,
    reactions: [
      { userId: 'u-max', name: 'Max', vote: 'yes' },
      { userId: 'u-ana', name: 'Ana', vote: 'yes' },
      { userId: 'u-sof', name: 'Sofía', vote: 'yes' },
    ],
    bookingUrl: 'https://salmonguru.es',
  },
  {
    id: 'idea-1862-dry-bar',
    name: '1862 Dry Bar',
    category: 'drink',
    why: 'Quiet, expert classics in Conde Duque — no queue before 9pm.',
    photoUrl: photo('1862'),
    priceBand: '€€',
    etaMinutes: 15,
    reactions: [{ userId: 'u-sof', name: 'Sofía', vote: 'no' }],
  },
  {
    id: 'idea-azotea-circulo',
    name: 'Azotea del Círculo',
    category: 'drink',
    why: 'Rooftop sundowner with the best skyline view in the centre.',
    photoUrl: photo('azotea'),
    priceBand: '€€',
    distanceMeters: 900,
    reactions: [
      { userId: 'u-leo', name: 'Leo', vote: 'yes' },
      { userId: 'u-max', name: 'Max', vote: 'yes' },
    ],
  },
  {
    id: 'idea-prado',
    name: 'Museo del Prado',
    category: 'do',
    why: 'Free after 6pm — do the Velázquez highlights in an hour.',
    photoUrl: photo('prado'),
    priceBand: '€',
    distanceMeters: 1400,
    reactions: [
      { userId: 'u-ana', name: 'Ana', vote: 'yes' },
      { userId: 'u-sof', name: 'Sofía', vote: 'yes' },
      { userId: 'u-leo', name: 'Leo', vote: 'yes' },
      { userId: 'u-max', name: 'Max', vote: 'yes' },
    ],
    bookingUrl: 'https://www.museodelprado.es',
  },
  {
    id: 'idea-retiro-boats',
    name: 'Retiro Park Rowboats',
    category: 'do',
    why: 'Cheap, sunny and silly — 45 minutes on the lake for the group.',
    photoUrl: photo('retiro'),
    priceBand: '€',
    etaMinutes: 18,
    reactions: [{ userId: 'u-max', name: 'Max', vote: 'yes' }],
  },
];

/** The current "device" user for optimistic reactions in fixtures. */
export const CURRENT_USER = { id: 'u-me', name: 'You' };
