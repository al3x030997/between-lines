import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const waitlistSubscribers = pgTable(
  'waitlist_subscribers',
  {
    id: serial('id').primaryKey(),
    publicId: uuid('public_id').notNull().defaultRandom(),
    email: text('email').notNull(),
    emailLower: text('email_lower').notNull(),
    kitSubscriberId: text('kit_subscriber_id'),
    status: text('status', { enum: ['pending', 'active', 'unsubscribed'] })
      .notNull()
      .default('pending'),
    source: text('source').notNull().default('landing-v8'),
    consentGiven: boolean('consent_given').notNull(),
    consentIp: text('consent_ip'),
    consentUserAgent: text('consent_user_agent'),
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull(),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
    magicLinkVersion: integer('magic_link_version').notNull().default(1),
    unlockCount: integer('unlock_count').notNull().default(0),
    lastUnlockAt: timestamp('last_unlock_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailLowerUnique: uniqueIndex('waitlist_email_lower_uq').on(t.emailLower),
    publicIdUnique: uniqueIndex('waitlist_public_id_uq').on(t.publicId),
    kitIdIdx: index('waitlist_kit_subscriber_id_ix').on(t.kitSubscriberId),
    statusIdx: index('waitlist_status_ix').on(t.status),
  }),
);

export type WaitlistSubscriber = typeof waitlistSubscribers.$inferSelect;
export type NewWaitlistSubscriber = typeof waitlistSubscribers.$inferInsert;
