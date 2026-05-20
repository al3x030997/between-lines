import { z } from 'zod';

export const waitlistSubmitSchema = z.object({
  email: z.string().email().max(254),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export type WaitlistSubmit = z.infer<typeof waitlistSubmitSchema>;
