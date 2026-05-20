import { NextResponse, type NextRequest } from 'next/server';
import { eq, or, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSubscribers } from '@/lib/db/schema';
import { kitUpdateSubscriberFields, kitVerifyWebhook } from '@/lib/kit';
import { webhookLimiter } from '@/lib/ratelimit';
import { signMagicToken } from '@/lib/tokens';
import { buildInsiderUrl } from '@/lib/site';
import { trackServer } from '@/lib/analytics';

export const runtime = 'nodejs';

// Kit v4 webhook event identifiers. Confirm exact strings against the live
// Kit dashboard — these are the documented v4 event names at time of writing.
const EVENT_ACTIVATE = 'subscriber.subscriber_activate';
const EVENT_UNSUBSCRIBE = 'subscriber.unsubscribe';

type KitWebhookBody = {
  event?: string;
  type?: string;
  subscriber?: {
    id?: number | string;
    email_address?: string;
  };
};

const OK = NextResponse.json({ ok: true });

export async function POST(req: NextRequest) {
  // Read raw body BEFORE parsing — signature is over raw bytes.
  const raw = await req.text();

  const sig =
    req.headers.get('x-kit-signature') ??
    req.headers.get('kit-signature') ??
    req.headers.get('x-convertkit-signature');
  if (!kitVerifyWebhook(raw, sig)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  // Defensive global flood guard.
  const rl = await webhookLimiter.limit('global');
  if (!rl.success) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: KitWebhookBody;
  try {
    body = JSON.parse(raw) as KitWebhookBody;
  } catch {
    return OK;
  }

  const eventName = body.event ?? body.type ?? '';
  const kitId = body.subscriber?.id != null ? String(body.subscriber.id) : null;
  const email = body.subscriber?.email_address ?? null;
  const emailLower = email ? email.toLowerCase() : null;

  try {
    if (eventName === EVENT_ACTIVATE) {
      await handleActivate({ kitId, email, emailLower });
    } else if (eventName === EVENT_UNSUBSCRIBE) {
      await handleUnsubscribe({ kitId, emailLower });
    }
  } catch (err) {
    console.error('[kit webhook] handler error', { event: eventName, err });
  }

  // Always 200 — don't make Kit retry on app-level errors.
  return OK;
}

async function handleActivate(args: {
  kitId: string | null;
  email: string | null;
  emailLower: string | null;
}) {
  const { kitId, email, emailLower } = args;
  if (!kitId && !emailLower) return;

  const now = new Date();

  // Look up by kit_subscriber_id, fall back to email_lower.
  let row =
    (kitId
      ? (await db
          .select()
          .from(waitlistSubscribers)
          .where(eq(waitlistSubscribers.kitSubscriberId, kitId))
          .limit(1))[0]
      : undefined) ??
    (emailLower
      ? (await db
          .select()
          .from(waitlistSubscribers)
          .where(eq(waitlistSubscribers.emailLower, emailLower))
          .limit(1))[0]
      : undefined);

  if (!row) {
    // Race: webhook arrived before our POST /api/waitlist finished. Insert a
    // placeholder row with webhook-sourced consent provenance.
    if (!emailLower || !email) return;
    const [inserted] = await db
      .insert(waitlistSubscribers)
      .values({
        email,
        emailLower,
        kitSubscriberId: kitId,
        status: 'active',
        confirmedAt: now,
        consentGiven: true,
        consentIp: 'kit-webhook',
        consentUserAgent: 'kit-webhook',
        consentAt: now,
        source: 'landing-v8',
      })
      .onConflictDoUpdate({
        target: waitlistSubscribers.emailLower,
        set: {
          status: 'active',
          confirmedAt: sql`COALESCE(${waitlistSubscribers.confirmedAt}, ${now})`,
          kitSubscriberId: kitId,
          updatedAt: now,
        },
      })
      .returning();
    row = inserted;
  } else {
    const [updated] = await db
      .update(waitlistSubscribers)
      .set({
        status: 'active',
        confirmedAt: sql`COALESCE(${waitlistSubscribers.confirmedAt}, ${now})`,
        kitSubscriberId: kitId ?? row.kitSubscriberId,
        updatedAt: now,
      })
      .where(eq(waitlistSubscribers.id, row.id))
      .returning();
    row = updated;
  }

  // Idempotent insider_url re-fill — usually a no-op because the waitlist
  // route already wrote it, but ensures the field is populated even if that
  // call failed.
  const targetKitId = row.kitSubscriberId;
  if (targetKitId) {
    try {
      const token = signMagicToken(row.publicId, row.magicLinkVersion);
      await kitUpdateSubscriberFields(targetKitId, {
        insider_url: buildInsiderUrl(token),
      });
    } catch (err) {
      console.error('[kit webhook] insider_url re-fill failed', err);
    }
  }

  await trackServer('waitlist_confirm', { kit_id: targetKitId ?? null });
}

async function handleUnsubscribe(args: {
  kitId: string | null;
  emailLower: string | null;
}) {
  const { kitId, emailLower } = args;
  if (!kitId && !emailLower) return;
  const now = new Date();

  const whereClause =
    kitId && emailLower
      ? or(
          eq(waitlistSubscribers.kitSubscriberId, kitId),
          eq(waitlistSubscribers.emailLower, emailLower),
        )
      : kitId
        ? eq(waitlistSubscribers.kitSubscriberId, kitId)
        : eq(waitlistSubscribers.emailLower, emailLower!);

  await db
    .update(waitlistSubscribers)
    .set({ status: 'unsubscribed', unsubscribedAt: now, updatedAt: now })
    .where(whereClause);
}
