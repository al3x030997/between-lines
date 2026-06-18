// Shared community-review seed data.
//
// Reviewer-voice cards — written the way someone would actually log a book on
// Goodreads. Used by both the homepage `BetweenReviews` teaser (shows a shuffled
// trio) and the full `/reviews` browse page (shows the whole filtered set).

export type Review = {
  book: string;
  reviewer: string;
  /** Out of 10. Rendered as 5-star on the browse page via `starsFor`. */
  score: string;
  quote: string;
  more?: boolean;
  tags: string[];
  forWho?: string;
  young: boolean;
};

export const REVIEWS: Review[] = [
  {
    book: 'The Quiet Hours',
    reviewer: 'The Wandering Owl',
    score: '9',
    quote:
      "Went in expecting a slow character study and got something that quietly took me apart. Marsh's restraint is the whole point — every unsaid thing lands harder than a confession would. I finished it in two sittings and just sat there afterwards.",
    more: true,
    tags: ['Stayed with me', 'Quiet devastation', 'Read in one sitting'],
    forWho: 'Readers who loved The Remains of the Day',
    young: false,
  },
  {
    book: 'The Glass Meridian',
    reviewer: 'James K.',
    score: '8',
    quote:
      "Climate fiction that never once feels like homework. The science lives inside the characters instead of being lectured at you, and by the end I cared more about Mara than about being right.",
    tags: ["Couldn't put it down", 'Smarter than it lets on'],
    forWho: 'Readers drawn to quiet speculative fiction',
    young: false,
  },
  {
    book: 'Salt & the Sea Between',
    reviewer: 'MarginNotes',
    score: '9',
    quote:
      "A whole love story told in letters that never get sent, and somehow the silences say more than the sentences do. I kept stopping to reread paragraphs out loud. Structurally it shouldn't work this well and yet here we are.",
    more: true,
    tags: ['Wrecked me', 'Unforgettable structure', 'Buying copies for friends'],
    forWho: 'Readers who loved Letters to a Young Poet',
    young: false,
  },
  {
    book: 'Before the Frost',
    reviewer: 'Tom W.',
    score: '9',
    quote:
      "A near-perfect short story. The ending quietly reframes everything before it without a single cheap trick — I flipped straight back to page one to watch the seams.",
    tags: ['Read in one sitting', 'That ending'],
    forWho: 'Readers who love Alice Munro',
    young: false,
  },
  {
    book: 'The Archivist of Small Things',
    reviewer: 'Maria C.',
    score: '7',
    quote:
      "The mystery deepens so gently you don't notice it pulling you under until you're three chapters past your bedtime. Lost half a star because the middle wanders, but the atmosphere is worth it.",
    tags: ["Couldn't stop thinking about it"],
    forWho: 'Readers who love quiet literary mystery',
    young: false,
  },
  {
    book: 'Three Tuesdays in November',
    reviewer: 'Ana P.',
    score: '10',
    quote:
      "The linked structure is so controlled it almost feels unfair. Every story quietly answers a question the last one left open. I reread the whole collection the same night just to catch what I'd missed the first time.",
    more: true,
    tags: ['Will reread this', 'Instant favourite', 'Pressed into hands'],
    forWho: 'Fans of Elizabeth Strout',
    young: false,
  },
  {
    book: 'The Velveteen Rabbit',
    reviewer: 'Lily, age 9',
    score: '10',
    quote:
      "This book made me cry but in a good way. The rabbit just wants to be real and the boy loves him so so much. I made my mum read it again the next night.",
    tags: ['Made me a better person', 'Read it twice'],
    forWho: 'Everyone who has a favourite toy',
    young: true,
  },
  {
    book: "Charlotte's Web",
    reviewer: 'Noah, age 10',
    score: '10',
    quote:
      "I did NOT expect to cry this much about a spider and a pig. Charlotte is the best friend anyone could ever have and I wasn't ready for the ending at all.",
    more: true,
    tags: ['Will reread this', 'Best friend ever', 'Cried a lot'],
    forWho: 'Everyone, forever',
    young: true,
  },
  {
    book: 'The BFG',
    reviewer: 'Sophie, age 8',
    score: '9',
    quote:
      "The BFG talks in the funniest way ever and it made me laugh out loud reading it to my little brother. The dream-catching part is my favourite.",
    tags: ['So funny', 'Great read-aloud'],
    forWho: 'Anyone who wants to laugh a lot',
    young: true,
  },
];

/**
 * Convert a `/10` score into a 5-star breakdown.
 * 10 → {full:5, half:false}, 9 → {full:4, half:true}, 8 → {full:4, half:false}.
 */
export function starsFor(score: string): { full: number; half: boolean } {
  const n = Number(score) / 2;
  return { full: Math.floor(n), half: n % 1 >= 0.5 };
}
