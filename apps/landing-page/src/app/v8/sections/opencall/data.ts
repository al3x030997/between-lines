export type MoodKey = 'cozy' | 'dark' | 'brave' | 'lost' | 'inlove';

export type Manuscript = {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverHue: number;
  firstLine: string;
  paragraph: string;
  pitch: string;
  mood: MoodKey[];
};

export type Quote = {
  id: string;
  msId: string;
  text: string;
  reader: string;
};

export type Mood = {
  key: MoodKey;
  label: string;
  tint: string;
  angle: number;
};

export const MANUSCRIPTS: Manuscript[] = [
  {
    id: 'river-forgot',
    title: 'The Night the River Forgot Us',
    author: 'Mira Halberstam',
    genre: 'Literary fiction',
    coverHue: 16,
    firstLine: 'The night the river forgot us, I was seven and already a liar.',
    paragraph:
      'My mother said the bridge would hold. My father said nothing at all, which was worse. We stood on the bank in the dark, three pairs of shoes lined up like punctuation, and waited for the water to decide what we were.',
    pitch: 'A childhood deluge becomes the through-line of a marriage.',
    mood: ['dark', 'lost'],
  },
  {
    id: 'bee-keeper',
    title: 'A Beekeeper in October',
    author: 'Sevi Adesanya',
    genre: 'Quiet domestic',
    coverHue: 42,
    firstLine: 'October arrived the way bees do — slowly, then all at once.',
    paragraph:
      'I had not been a beekeeper for very long. Six months, if you counted the spring I spent reading about them. But the hives behind the shed had begun to feel less like a hobby and more like an argument I was losing.',
    pitch: 'A widower and his hives, one season at a time.',
    mood: ['cozy', 'lost'],
  },
  {
    id: 'salt-letters',
    title: 'Salt Letters',
    author: 'Joren Vidák',
    genre: 'Epistolary',
    coverHue: 198,
    firstLine: 'Dear Annika — the sea has started writing back, and the handwriting is mine.',
    paragraph:
      'I do not know how to tell you this without sounding mad, and I have considered, for some time, the possibility that I am. The letters wash up in the morning, sealed in the kind of bottle no one makes anymore. The salt is from a sea I have never visited.',
    pitch: 'Letters between two women separated by an ocean that may not exist.',
    mood: ['lost', 'inlove'],
  },
  {
    id: 'hawthorn-bride',
    title: 'The Hawthorn Bride',
    author: 'Petra Ó Cuirreáin',
    genre: 'Folk-gothic',
    coverHue: 348,
    firstLine: 'They called her the Hawthorn Bride because she would not be moved.',
    paragraph:
      'Three husbands had tried. The first had brought roses. The second, a deed to a town that no longer existed. The third, the smartest of them, had brought nothing at all and stood at the foot of the hill for nine days, until the hawthorn agreed he could come closer.',
    pitch: 'A folk story about the cost of refusing every offer.',
    mood: ['dark', 'brave'],
  },
  {
    id: 'midnight-trains',
    title: 'The Midnight Trains of Llantewy',
    author: 'Cai Penderyn',
    genre: 'Magical realism',
    coverHue: 268,
    firstLine: 'No one in Llantewy admits the midnight trains exist, but everyone knows the timetable.',
    paragraph:
      'You hear them before you see them — a low, considerate hum, as if the rails are clearing their throat. The conductor never speaks. The tickets, if you can call them that, are pressed into your palm by someone who is not quite there. You ride for an hour or a year. You arrive where you needed to be, which is rarely where you wanted to go.',
    pitch: 'A Welsh village and the train that carries away its grief.',
    mood: ['dark', 'lost', 'brave'],
  },
  {
    id: 'pomegranate-summer',
    title: 'Pomegranate Summer',
    author: 'Esma Karadağ',
    genre: 'Coming-of-age',
    coverHue: 358,
    firstLine: 'The summer I stopped being afraid of my grandmother, the pomegranates split themselves open in the sun.',
    paragraph:
      'She had been a terror to me for as long as I could remember — a woman of small bones and enormous opinions, who carried scissors in her apron and used them on everything: vines, hair, conversations. That summer I was sixteen and angry in every direction, and she taught me, without saying so, where to point it.',
    pitch: 'A summer in coastal Turkey, taught entirely by women.',
    mood: ['cozy', 'brave', 'inlove'],
  },
  {
    id: 'lighthouse-rota',
    title: 'The Lighthouse Rota',
    author: 'Inga Sørli',
    genre: 'Slow thriller',
    coverHue: 218,
    firstLine: 'Three keepers. Two of them are real.',
    paragraph:
      'It is the kind of joke we tell at the start of the winter, when the rota goes up on the kitchen wall and we work out, between us, who will be alone with whom. The joke is funnier in November than it is in February. By February, no one is laughing, and the rota — pinned with a single rusted nail — has begun to feel like the only thing in the building that has not changed shape.',
    pitch: 'Three lighthouse keepers, one impossible season.',
    mood: ['dark', 'brave'],
  },
  {
    id: 'borrowed-violins',
    title: 'Borrowed Violins',
    author: 'Yael Korman',
    genre: 'Music / family',
    coverHue: 28,
    firstLine: 'Everything in our family was borrowed except the silence, which was ours alone.',
    paragraph:
      'The violins came from cousins. The piano had belonged to a stranger who left it on the curb on a Tuesday in 1978. The records — those were borrowed too, technically; we never gave them back. But the silences after the records ended, the held breath between a question and an answer my mother would not give: those we had made ourselves, over many years, with great care.',
    pitch: 'Three sisters, one inheritance, one piece they cannot play.',
    mood: ['cozy', 'lost', 'inlove'],
  },
  {
    id: 'soft-revolt',
    title: 'A Soft Revolt',
    author: 'Anika Tomé',
    genre: 'Speculative',
    coverHue: 158,
    firstLine: 'The revolution, when it finally came, was so quiet we missed it twice.',
    paragraph:
      'It did not arrive with banners. It arrived the way mold arrives — patiently, in corners, behind a fridge no one bothered to move. By the time the cabinet noticed, the cabinet itself had been replaced, and the replacements had been replaced, and the people doing the replacing were, on the whole, the kind of people who preferred to be home by six.',
    pitch: 'A revolution carried out almost entirely by tired women on their lunch breaks.',
    mood: ['brave', 'cozy'],
  },
  {
    id: 'velvet-arithmetic',
    title: 'Velvet Arithmetic',
    author: 'Pascale Aubin',
    genre: 'Literary romance',
    coverHue: 322,
    firstLine: 'I had been good at math, once, before I met him and the numbers began to lie.',
    paragraph:
      'It was not, to be clear, his fault. He did nothing to the numbers. But love is, among other things, a kind of optical illusion, and after the second week the column totals refused to behave. Two and two arrived at five, and then six, and one Sunday in October at something irrational that I refused, on principle, to round.',
    pitch: 'An accountant in love. The ledgers do not survive.',
    mood: ['inlove', 'cozy'],
  },
  {
    id: 'orchard-keep',
    title: 'The Orchard Keep',
    author: 'Findlay Brae',
    genre: 'Quiet horror',
    coverHue: 78,
    firstLine: 'The orchard had been keeping something for us, and that summer it decided to give it back.',
    paragraph:
      'We had inherited the house the way my family inherited most things — accidentally, and with paperwork that would not survive close reading. The orchard came with it. So did the well. So did the man at the edge of the trees, who did not speak and did not leave and could not, in any photograph my brother took that August, be persuaded to appear.',
    pitch: 'A house, an orchard, and a debt nobody remembers signing.',
    mood: ['dark'],
  },
  {
    id: 'wide-balcony',
    title: 'The Wide Balcony',
    author: 'Catalina Errazuriz',
    genre: 'Literary fiction',
    coverHue: 8,
    firstLine: 'My mother fell in love on a wide balcony in 1983, and the rest of us have been falling ever since.',
    paragraph:
      'She tells the story differently each time. Sometimes she is wearing red. Sometimes she is reading Borges, badly, in a language she had only just learned. Sometimes the man on the balcony is my father, and sometimes he is not, and the difference, she has told me — when she has been drinking, when she will tell me anything — never mattered as much as I wanted it to.',
    pitch: 'A family story rebuilt from contradictions, one mother’s romance at a time.',
    mood: ['inlove', 'lost'],
  },
];

export const QUOTES: Quote[] = [
  { id: 'q1', msId: 'river-forgot', text: '"already a liar" — and we trust her completely. That’s the trick.', reader: 'A. Mendoza' },
  { id: 'q2', msId: 'bee-keeper', text: 'I read this twice and then I went outside.', reader: 'Sila K.' },
  { id: 'q3', msId: 'salt-letters', text: 'The handwriting is mine. Stopped me cold.', reader: 'J. Halsey' },
  { id: 'q4', msId: 'hawthorn-bride', text: 'A woman who refuses every offer. Finally.', reader: 'Renata C.' },
  { id: 'q5', msId: 'midnight-trains', text: 'I have been on this train.', reader: 'Owen D.' },
  { id: 'q6', msId: 'pomegranate-summer', text: '"angry in every direction" — yes, that’s the year.', reader: 'Marit Ö.' },
  { id: 'q7', msId: 'lighthouse-rota', text: 'Three keepers. Two of them are real. I will think about this all week.', reader: 'Petra L.' },
  { id: 'q8', msId: 'borrowed-violins', text: 'The silences were ours alone. Heartbreak in eight words.', reader: 'David A.' },
  { id: 'q9', msId: 'soft-revolt', text: 'Revolutions by tired women on lunch breaks. Please, more.', reader: 'B. Achmat' },
  { id: 'q10', msId: 'velvet-arithmetic', text: 'Two and two arrived at five. I laughed and then I wasn’t laughing.', reader: 'Yui T.' },
  { id: 'q11', msId: 'orchard-keep', text: 'I closed the tab and locked the back door.', reader: 'Aoife B.' },
  { id: 'q12', msId: 'wide-balcony', text: 'A mother’s romance, rebuilt from her contradictions. Devastating.', reader: 'Nora P.' },
  { id: 'q13', msId: 'river-forgot', text: 'Three pairs of shoes like punctuation. I will steal this.', reader: 'Léo H.' },
  { id: 'q14', msId: 'salt-letters', text: 'An epistolary novel that earns its conceit. Rare.', reader: 'Maren V.' },
  { id: 'q15', msId: 'pomegranate-summer', text: 'Read it in one sitting. Cried in my kitchen.', reader: 'Inés R.' },
  { id: 'q16', msId: 'soft-revolt', text: 'Behind a fridge no one bothered to move. Perfect.', reader: 'T. Okonkwo' },
  { id: 'q17', msId: 'borrowed-violins', text: 'A piece they cannot play. Tell me how it ends.', reader: 'S. Brandt' },
  { id: 'q18', msId: 'midnight-trains', text: 'Welsh grief, on rails. I subscribed for this alone.', reader: 'Carwyn P.' },
];

export const MOODS: Mood[] = [
  { key: 'cozy', label: 'Cozy', tint: '#C28F3D', angle: -72 },
  { key: 'dark', label: 'Dark', tint: '#2E2F36', angle: -36 },
  { key: 'brave', label: 'Brave', tint: '#C5283D', angle: 0 },
  { key: 'lost', label: 'Lost', tint: '#5C7A8E', angle: 36 },
  { key: 'inlove', label: 'In love', tint: '#B86489', angle: 72 },
];

export const MOOD_LABELS: Record<MoodKey, string> = {
  cozy: 'Cozy',
  dark: 'Dark',
  brave: 'Brave',
  lost: 'Lost',
  inlove: 'In love',
};

export function byMood(mood: MoodKey, limit = 3): Manuscript[] {
  return MANUSCRIPTS.filter((m) => m.mood.includes(mood)).slice(0, limit);
}

export function pairs(): [Manuscript, Manuscript][] {
  const pairsOut: [Manuscript, Manuscript][] = [];
  for (let i = 0; i < MANUSCRIPTS.length - 1; i += 2) {
    pairsOut.push([MANUSCRIPTS[i], MANUSCRIPTS[i + 1]]);
  }
  return pairsOut;
}

export const FEATURED_MARGIN: { manuscript: Manuscript; sentences: string[]; annotations: { idx: number; note: string; from: string }[] } = {
  manuscript: MANUSCRIPTS[0],
  sentences: [
    'The night the river forgot us, I was seven and already a liar.',
    'My mother said the bridge would hold.',
    'My father said nothing at all, which was worse.',
    'We stood on the bank in the dark, three pairs of shoes lined up like punctuation, and waited for the water to decide what we were.',
    'I had told one lie that day and I would tell another before morning.',
    'The river did not care what we were.',
    'The river had its own arithmetic.',
    'We learned it slowly, the way you learn any language: badly, and out of order.',
  ],
  annotations: [
    { idx: 0, note: 'oof. opening line of the year.', from: 'A. Mendoza' },
    { idx: 2, note: 'YES. the silence is the cruelty.', from: 'Marit Ö.' },
    { idx: 3, note: 'shoes as punctuation — stealing this.', from: 'Léo H.' },
    { idx: 7, note: 'badly, and out of order. me too.', from: 'Petra L.' },
  ],
};
