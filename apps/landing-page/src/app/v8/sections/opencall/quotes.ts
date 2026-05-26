export type QuoteCategory = 'read' | 'write' | 'both' | 'character';

export type QuotePill = 'On reading' | 'On writing' | 'Read & write' | 'Character';

export type Quote = {
  text: string;
  author: string;
  source?: string;
  category: QuoteCategory;
  pill: QuotePill;
  young: boolean;
};

export type Mood =
  | 'feel-good' | 'escapist' | 'funny' | 'calming' | 'intense'
  | 'slow-burn' | 'scary' | 'reflective' | 'upbeat' | 'surprise';

export type ReaderPick = {
  id: string;
  quote: string;
  author: string;
  source?: string;
  reader: string;
  readerSlug: string;
  readerType: 'reader' | 'writer';
};

export const QUOTES: Quote[] = [
  // On reading
  { text: 'A reader lives a thousand lives before he dies. The man who never reads lives only one.', author: 'George R.R. Martin', source: 'A Dance with Dragons', category: 'read', pill: 'On reading', young: false },
  { text: 'Until I feared I would lose it, I never loved to read. One does not love breathing.', author: 'Harper Lee', source: 'To Kill a Mockingbird', category: 'read', pill: 'On reading', young: false },
  { text: 'Reading is to the mind what exercise is to the body.', author: 'Joseph Addison', source: 'The Tatler, 1709', category: 'read', pill: 'On reading', young: false },
  { text: 'Reading gives us somewhere to go when we have to stay where we are.', author: 'Mason Cooley', category: 'read', pill: 'On reading', young: false },
  { text: 'Once you learn to read, you will be forever free.', author: 'Frederick Douglass', category: 'read', pill: 'On reading', young: false },
  { text: 'Books are a uniquely portable magic.', author: 'Stephen King', source: 'On Writing', category: 'read', pill: 'On reading', young: false },
  { text: 'Reading is dreaming with open eyes.', author: 'Anzia Yezierska', category: 'read', pill: 'On reading', young: false },
  { text: 'There is no friend as loyal as a book.', author: 'Ernest Hemingway', category: 'read', pill: 'On reading', young: false },

  // On writing
  { text: 'Writing is the painting of the voice.', author: 'Voltaire', category: 'write', pill: 'On writing', young: false },
  { text: 'Fill your paper with the breathings of your heart.', author: 'William Wordsworth', category: 'write', pill: 'On writing', young: false },
  { text: 'A word after a word after a word is power.', author: 'Margaret Atwood', category: 'write', pill: 'On writing', young: false },
  { text: 'We write to taste life twice, in the moment and in retrospect.', author: 'Anaïs Nin', category: 'write', pill: 'On writing', young: false },
  { text: 'I write only because there is a voice within me that will not be still.', author: 'Sylvia Plath', source: 'Journals', category: 'write', pill: 'On writing', young: false },
  { text: 'Write what should not be forgotten.', author: 'Isabel Allende', category: 'write', pill: 'On writing', young: false },
  { text: 'You can make anything by writing.', author: 'C.S. Lewis', category: 'write', pill: 'On writing', young: false },

  // Read & write
  { text: 'If you don’t have time to read, you don’t have the time to write. Simple as that.', author: 'Stephen King', source: 'On Writing', category: 'both', pill: 'Read & write', young: false },
  { text: 'Not all readers become writers, but all writers must be readers.', author: 'Madeleine L’Engle', category: 'both', pill: 'Read & write', young: false },
  { text: 'If there’s a book you want to read but it hasn’t been written yet, then you must write it.', author: 'Toni Morrison', category: 'both', pill: 'Read & write', young: false },
  { text: 'Think before you speak. Read before you think.', author: 'Fran Lebowitz', source: 'The Fran Lebowitz Reader', category: 'both', pill: 'Read & write', young: false },

  // Characters
  { text: 'Not all those who wander are lost.', author: 'J.R.R. Tolkien', source: 'The Fellowship of the Ring', category: 'character', pill: 'Character', young: true },
  { text: 'You are braver than you believe, stronger than you seem, and smarter than you think.', author: 'Winnie the Pooh', source: 'A.A. Milne', category: 'character', pill: 'Character', young: true },
  { text: 'Curiouser and curiouser!', author: 'Alice', source: 'Alice in Wonderland (Lewis Carroll)', category: 'character', pill: 'Character', young: true },
  { text: 'There is nothing more deceptive than an obvious fact.', author: 'Sherlock Holmes', source: 'The Boscombe Valley Mystery (Arthur Conan Doyle)', category: 'character', pill: 'Character', young: false },
  { text: 'The things that make me different are the things that make me.', author: 'Piglet', source: 'Winnie the Pooh (A.A. Milne)', category: 'character', pill: 'Character', young: true },
  { text: 'I am not afraid of storms, for I am learning how to sail my ship.', author: 'Jo March', source: 'Little Women (Louisa May Alcott)', category: 'character', pill: 'Character', young: true },

  // Young Readers extras
  { text: 'The more that you read, the more things you will know. The more that you learn, the more places you’ll go.', author: 'Dr. Seuss', source: 'I Can Read With My Eyes Shut', category: 'read', pill: 'On reading', young: true },
  { text: 'Stories are light. Light is precious in a world so dark.', author: 'Kate DiCamillo', source: 'The Tale of Despereaux', category: 'read', pill: 'On reading', young: true },
  { text: 'There is something delicious about writing the first words of a story. You never quite know where they’ll take you.', author: 'Beatrix Potter', source: 'Letters', category: 'write', pill: 'On writing', young: true },
];

export const MOOD_LABELS: Record<Mood, string> = {
  'feel-good': '😊 Feel-good',
  'escapist': '🌍 Escapist',
  'funny': '😂 Funny',
  'calming': '🌿 Calming',
  'intense': '🔥 Intense',
  'slow-burn': '🕯️ Slow burn',
  'scary': '😨 Scary',
  'reflective': '💭 Reflective',
  'upbeat': '☀️ Upbeat',
  'surprise': '🎲 Surprise me',
};

// Mood → index into QUOTES (curated matches)
export const MOOD_TO_QUOTE: Record<Mood, number> = {
  'feel-good': 20,    // Winnie the Pooh
  'escapist': 19,     // Not all those who wander are lost (Tolkien)
  'funny': 21,        // Curiouser and curiouser (Alice)
  'calming': 3,       // Reading gives us somewhere to go (Mason Cooley)
  'intense': 1,       // Until I feared I would lose it (Harper Lee)
  'slow-burn': 11,    // We write to taste life twice (Anaïs Nin)
  'scary': 22,        // There is nothing more deceptive (Sherlock)
  'reflective': 12,   // I write only because there is a voice (Plath)
  'upbeat': 25,       // The more that you read (Dr. Seuss)
  'surprise': 17,     // If there's a book you want to read (Morrison)
};

export const SEED_PICKS: ReaderPick[] = [
  {
    id: 'pick-sarah',
    quote: 'Not all those who wander are lost.',
    author: 'J.R.R. Tolkien',
    source: 'The Fellowship of the Ring',
    reader: 'Sarah M.',
    readerSlug: 'sarah-m',
    readerType: 'reader',
  },
  {
    id: 'pick-james',
    quote: 'I write only because there is a voice within me that will not be still.',
    author: 'Sylvia Plath',
    source: 'Journals',
    reader: 'James K.',
    readerSlug: 'james-k',
    readerType: 'writer',
  },
  {
    id: 'pick-priya',
    quote: 'Curiouser and curiouser!',
    author: 'Alice',
    source: 'Alice in Wonderland',
    reader: 'Priya R.',
    readerSlug: 'priya-r',
    readerType: 'reader',
  },
];

// Pastel card backgrounds cycled with the quote index.
export const CARD_PALETTE: { bg: string; border: string }[] = [
  { bg: '#f0f7ff', border: '#c8e0f7' },
  { bg: '#f5f0fe', border: '#d9ccf7' },
  { bg: '#f0faf4', border: '#b8e8cc' },
  { bg: '#fff8ee', border: '#f5dca8' },
  { bg: '#fef0f5', border: '#f5c8da' },
  { bg: '#f0fefe', border: '#b8e8e8' },
  { bg: '#fefaf0', border: '#f0e0a8' },
  { bg: '#f8f0fe', border: '#ddbff5' },
  { bg: '#f0f8ee', border: '#c0ddb8' },
  { bg: '#fff0ee', border: '#f5ccc8' },
];

export const PILL_BG: Record<QuoteCategory, { bg: string; color: string }> = {
  read: { bg: '#e1f5ee', color: '#085041' },
  write: { bg: '#eeedfe', color: '#3c3489' },
  both: { bg: '#faeeda', color: '#633806' },
  character: { bg: '#fbeaf0', color: '#72243e' },
};

export const MOOD_ORDER: Mood[] = [
  'feel-good', 'escapist', 'funny', 'calming', 'intense',
  'slow-burn', 'scary', 'reflective', 'upbeat', 'surprise',
];

export function filterByAudience(young: boolean): Quote[] {
  if (!young) return QUOTES;
  return QUOTES.filter((q) => q.young);
}
