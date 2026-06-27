import { z } from 'zod';

// Intake answers captured by the v8 IntakeHero. The writer's File object is
// dropped client-side before send — only filename/size cross the wire.
const readerAnswersSchema = z.object({
  audience: z.string().max(64).nullable(),
  genres: z.array(z.string().max(64)).max(20),
  lengths: z.array(z.string().max(64)).max(10),
  devices: z.array(z.string().max(64)).max(10),
  modes: z.array(z.string().max(64)).max(10),
  whens: z.array(z.string().max(64)).max(10),
  reaction: z.string().max(64).nullable(),
  betaPool: z.boolean(),
  club: z.boolean(),
  newsletter: z.boolean(),
  favoriteBooks: z.array(z.string().max(120)).max(10),
  // Optional — the v12 4-role pop-up's richer "Discover" answers. Older
  // payloads (v8/v11) omit this; kept optional so they still validate.
  discover: z
    .object({
      bookLove: z
        .object({
          title: z.string().max(200),
          author: z.string().max(200),
          why: z.string().max(2000),
        })
        .optional(),
      formats: z.array(z.string().max(64)).max(10).optional(),
      goals: z.array(z.string().max(120)).max(12).optional(),
      goalsOther: z.string().max(500).optional(),
    })
    .optional(),
});

const fileMetaSchema = z
  .object({
    name: z.string().max(255),
    size: z.number().int().nonnegative(),
  })
  .nullable();

const writerAnswersSchema = z.object({
  // Lead question from the creator-intake flow (write / poetry / illustrate).
  // Optional + nullable so older payloads without the key still validate.
  practice: z.enum(['prose', 'poetry', 'illustration']).nullable().optional(),
  genre: z.object({
    focus: z.enum(['single', 'cross']).nullable(),
    fictionPrimary: z.array(z.string().max(64)).max(10),
    nonfictionPrimary: z.array(z.string().max(64)).max(10),
    openToAll: z.boolean(),
  }),
  journey: z.enum(['aspiring', 'emerging', 'established']).nullable(),
  awards: z.string().max(500),
  workingOn: z.enum(['debut', 'new', 'thinking']).nullable(),
  pubRoute: z.enum(['traditional', 'self', 'reading-group', 'unsure']).nullable(),
  agentStage: z
    .enum(['researching', 'building-list', 'querying-soon', 'querying-now'])
    .nullable(),
  manuscriptStage: z
    .enum([
      'draft',
      'final-draft',
      'editing',
      'proofreading',
      'complete',
      'seeking-betas',
      'seeking-reviews',
    ])
    .nullable(),
  language: z.enum(['en', 'de', 'hi', 'fr', 'es', 'other']).nullable(),
  giveaways: z.boolean().nullable(),
  targetLength: z
    .enum(['lt15k', '15-40k', '40-80k', '80-120k', '120kplus', 'unsure'])
    .nullable(),
  submissions: z.enum(['agents', 'journals', 'both', 'na']).nullable(),
  timeline: z.enum(['q', '3-6m', '6-12m']).nullable(),
  monthGoal: z
    .enum(['finish-revision', 'beta-feedback', 'agent-list', 'send-queries'])
    .nullable(),
  favoriteBooks: z.array(z.string().max(120)).max(10),
  platform: z
    .enum([
      'prowritingaid',
      'scrivener',
      'wordpress',
      'tumblr',
      'substack',
      'medium',
      'wattpad',
    ])
    .nullable(),
  betaPool: z.boolean(),
  pod: z.boolean(),
  goals: z.object({
    selected: z
      .array(z.enum(['buildAgentList', 'buildAuthorPage', 'uploadSample']))
      .max(3),
    buildAgentList: z.object({
      mode: z.enum(['research', 'upload']).nullable(),
      list: fileMetaSchema,
    }),
    uploadSample: z.object({
      sample: fileMetaSchema,
      wantHelp: z.boolean().nullable(),
      helpKit: z.object({
        synopsis: fileMetaSchema,
        pitch: fileMetaSchema,
        queryLetter: fileMetaSchema,
        aiTierInterest: z.array(z.enum(['assess', 'develop'])).max(2),
      }),
      alsoChoose: z
        .array(z.enum(['buildAgentList', 'buildAuthorPage', 'justRead']))
        .max(3),
    }),
  }),
  // Optional — the v12 4-role pop-up's creator answers (writer / poet /
  // illustrator). All three creator roles serialize to region 'writer';
  // practice (above) distinguishes them. Optional so legacy payloads validate.
  creator: z
    .object({
      stage: z.enum(['emerging', 'established']).nullable(),
      credits: z.array(z.string().max(64)).max(10),
      bio: z.string().max(2000),
      links: z.array(z.string().max(300)).max(8),
      goals: z.array(z.string().max(120)).max(12),
      goalsOther: z.string().max(500),
      // Singular `work` is retained (optional) so payloads stored before the
      // multi-work change still validate. New writer submissions write `works`.
      work: z
        .object({
          title: z.string().max(200),
          genres: z.array(z.string().max(64)).max(20),
          moods: z.array(z.string().max(64)).max(20),
          format: z.string().max(64).nullable(),
        })
        .optional(),
      // Writers can attach more than one title; the prototype caps at 2.
      works: z
        .array(
          z.object({
            title: z.string().max(200),
            genres: z.array(z.string().max(64)).max(20),
            moods: z.array(z.string().max(64)).max(20),
            format: z.string().max(64).nullable(),
          }),
        )
        .max(2)
        .optional(),
      poetry: z
        .object({
          forms: z.array(z.string().max(64)).max(20),
          moods: z.array(z.string().max(64)).max(20),
          themes: z.array(z.string().max(64)).max(20),
        })
        .optional(),
      illustration: z
        .object({
          mediums: z.array(z.string().max(64)).max(20),
          styles: z.array(z.string().max(64)).max(20),
          uses: z.array(z.string().max(64)).max(20),
        })
        .optional(),
    })
    .optional(),
});

export const intakeSchema = z.discriminatedUnion('region', [
  z.object({
    region: z.literal('reader'),
    intent: z.enum(['later', 'now']),
    answers: readerAnswersSchema,
  }),
  z.object({
    region: z.literal('writer'),
    answers: writerAnswersSchema,
  }),
]);

export type IntakePayload = z.infer<typeof intakeSchema>;

export const waitlistSubmitSchema = z.object({
  email: z.string().email().max(254),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
  intake: intakeSchema.optional(),
});

export type WaitlistSubmit = z.infer<typeof waitlistSubmitSchema>;
