// src/data/fixtures/madrid.ts
// Eight seed ideas for Madrid: 3 eat, 3 drink, 2 do. Real places.
// The two `do` items carry a Civitatis listing page as their booking link —
// a real listing, not an affiliate deep link; those arrive with a partner
// agreement in Phase 6. Prices on those two are what Civitatis listed.

import { fixturePhoto, type FixtureIdea } from './types';

export const MADRID_FIXTURES: FixtureIdea[] = [
  // ——— eat ———
  {
    slug: 'sobrino-de-botin',
    category: 'eat',
    title: 'Sobrino de Botín',
    why: 'The oldest restaurant in the world, 3 min from Plaza Mayor. Order the suckling pig or do not bother coming.',
    priceBand: '€€€',
    distanceText: '5 min walk',
    photoUrl: fixturePhoto('botin'),
    bookingUrl: 'https://botin.es',
  },
  {
    slug: 'mercado-san-miguel',
    category: 'eat',
    title: 'Mercado de San Miguel',
    why: 'Tapas crawl under one iron roof — nobody has to agree on a menu. Loud and perfect for eight people.',
    priceBand: '€€',
    distanceText: '4 min walk',
    photoUrl: fixturePhoto('sanmiguel'),
  },
  {
    slug: 'la-mucca-de-pez',
    category: 'eat',
    title: 'La Mucca de Pez',
    why: 'Malasaña kitchen built around big shared tables. Go at 21:00; they do not hold a table for a group.',
    priceBand: '€€',
    distanceText: '12 min walk',
    photoUrl: fixturePhoto('lamucca'),
  },

  // ——— drink ———
  {
    slug: 'salmon-guru',
    category: 'drink',
    title: 'Salmon Guru',
    why: 'The best cocktails in the city and they know it. Arrive before 21:00 or you are queueing on the street.',
    priceBand: '€€€',
    distanceText: '6 min walk',
    photoUrl: fixturePhoto('salmonguru'),
  },
  {
    slug: '1862-dry-bar',
    category: 'drink',
    title: '1862 Dry Bar',
    why: 'Quiet, serious classics in Malasaña. The right first round when the group still wants to talk.',
    priceBand: '€€',
    distanceText: '14 min walk',
    photoUrl: fixturePhoto('1862'),
  },
  {
    slug: 'azotea-circulo',
    category: 'drink',
    title: 'Azotea del Círculo de Bellas Artes',
    why: 'Rooftop over Gran Vía with the best sunset in Madrid. One drink, a hundred photos, then move on.',
    priceBand: '€€€',
    distanceText: '9 min walk',
    photoUrl: fixturePhoto('azotea'),
  },

  // ——— do ———
  {
    slug: 'palacio-real-guided',
    category: 'do',
    title: 'Palacio Real, guided tour',
    why: 'A €36 guided tour gets you past the worst queue in Madrid. Two hours, and the Throne Room earns it.',
    priceBand: '€€',
    distanceText: '8 min walk',
    photoUrl: fixturePhoto('palacioreal'),
    bookingUrl: 'https://www.civitatis.com/es/madrid/',
  },
  {
    slug: 'prado-guided',
    category: 'do',
    title: 'Museo del Prado, guided tour',
    why: 'A €28 guided tour is the only way to do the Prado in 90 minutes. Ask the guide for the Bosch room first.',
    priceBand: '€€',
    distanceText: '11 min walk',
    photoUrl: fixturePhoto('prado'),
    bookingUrl: 'https://www.civitatis.com/es/madrid/',
  },
];
