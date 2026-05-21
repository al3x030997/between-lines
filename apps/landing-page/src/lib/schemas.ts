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
  club: z.boolean(),
});

const writerAnswersSchema = z.object({
  submission: z.string().max(64).nullable(),
  feedback: z.array(z.string().max(64)).max(20),
  warningsMode: z.enum(['none', 'list']).nullable(),
  warnings: z.array(z.string().max(64)).max(20),
  fileName: z.string().max(255).nullable(),
  fileSize: z.number().int().nonnegative().nullable(),
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
