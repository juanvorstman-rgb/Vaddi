// src/lib/messages.ts
// The three messages the organizer sends to the group chat. WhatsApp is the
// channel, not the enemy (VADDI §5.6) — these are written to be pasted there.
//
// Voice: confident caddie. Specific numbers. One recommendation. Two sentences
// at most. Written in Spanish: the launch market is despedidas in Spain, and
// these are the only strings a friend reads outside the app.
//
// Vaddi never collects money. The reminder nudges the group to pay the
// organizer; it is a count, not a checkout.

import { eventUrl } from '@/config/links';

export interface EventSummary {
  code: string;
  name: string;
  destination: string;
  startsOn: string;
  endsOn: string;
}

const euros = (cents: number) =>
  (cents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

/** Dates arrive as ISO `YYYY-MM-DD`. */
const asDate = (iso: string) => new Date(`${iso}T00:00:00`);

/** Day and month, e.g. "14 de marzo". */
const dayMonth = (iso: string) =>
  asDate(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

/**
 * "9 de mayo" for one day, "12 al 14 de marzo" inside one month,
 * "28 de febrero al 2 de marzo" across two.
 */
const dateRange = (startsOn: string, endsOn: string) => {
  if (startsOn === endsOn) return dayMonth(startsOn);
  const from = asDate(startsOn);
  const to = asDate(endsOn);
  if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
    return `${from.getDate()} al ${dayMonth(endsOn)}`;
  }
  return `${dayMonth(startsOn)} al ${dayMonth(endsOn)}`;
};

/** Sent once, to fill the event. The link works without installing anything. */
export function inviteMessage(event: EventSummary): string {
  return [
    `${event.name} — ${dateRange(event.startsOn, event.endsOn)}.`,
    `Dime si vienes y vota los planes aquí, sin instalar nada: ${eventUrl(event.code)}`,
  ].join('\n');
}

/** Sent when people owe the organizer. `shareCents` is each person's share. */
export function reminderMessage(
  event: EventSummary,
  unpaidCount: number,
  shareCents?: number,
): string {
  const who = unpaidCount === 1 ? 'falta 1 por pagar' : `faltan ${unpaidCount} por pagar`;
  const amount = shareCents ? ` Son ${euros(shareCents)} cada uno.` : '';
  return [`${event.name}: ${who}.${amount}`, `Quién va y quién no: ${eventUrl(event.code)}`].join(
    '\n',
  );
}

/** Sent when a plan is locked, so nobody has to scroll back for it. */
export function decisionMessage(
  event: EventSummary,
  ideaTitle: string,
  whenLabel: string,
): string {
  return [
    `Decidido: vamos a ${ideaTitle} ${whenLabel}.`,
    `El plan completo: ${eventUrl(event.code)}`,
  ].join('\n');
}
