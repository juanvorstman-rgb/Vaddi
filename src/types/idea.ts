// src/types/idea.ts
// The shape of one idea in the feed. The IdeaCard renders exactly this.

export type IdeaCategory = 'eat' | 'drink' | 'do';
export type PriceBand = '€' | '€€' | '€€€' | '€€€€';
export type Vote = 'yes' | 'no';

export interface Reaction {
  userId: string;
  name: string;
  vote: Vote;
}

export interface Idea {
  id: string;
  name: string;
  category: IdeaCategory;
  /** One-line "why this" — the caddie's reason. */
  why: string;
  photoUrl: string;
  priceBand: PriceBand;
  /** Distance from the group, in metres. */
  distanceMeters?: number;
  /** Or a walking time, in minutes. */
  etaMinutes?: number;
  reactions: Reaction[];
  /** Where the primary action sends the user, when a partner exists. */
  bookingUrl?: string;
}
