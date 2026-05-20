import { createHmac, timingSafeEqual } from 'node:crypto';

// Kit (ConvertKit) wrapper. Two distinct surfaces:
// 1. Hosted form submit at app.kit.com/forms/{form_id}/subscriptions
//    — public, no auth, what the embed widget posts to. Used for initial
//      subscribe so we don't need a v4 form-subscribe permission. Returns
//      302 on success, no body (no subscriber id available immediately).
// 2. API v4 at api.kit.com/v4 with X-Kit-Api-Key header — used for the
//    field-update call once we know the subscriber's id (via the webhook).

const KIT_BASE = 'https://api.kit.com/v4';
const KIT_FORM_SUBMIT_BASE = 'https://app.kit.com/forms';

function apiKey(): string {
  const k = process.env.KIT_API_KEY;
  if (!k) throw new Error('KIT_API_KEY is not set');
  return k;
}

function authHeaders(): Record<string, string> {
  return {
    'X-Kit-Api-Key': apiKey(),
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

// Subscribe via Kit's hosted-form endpoint. Returns nothing — Kit doesn't
// expose the subscriber id here. The webhook handler picks them up by email
// when subscriber.subscriber_activate fires, fills in kit_subscriber_id +
// insider_url. The 10-minute delay on the welcome-sequence automation gives
// the webhook room to reconcile before the email goes out.
export async function kitFormSubscribe(params: {
  email: string;
  formId: string;
}): Promise<void> {
  const { email, formId } = params;
  const url = `${KIT_FORM_SUBMIT_BASE}/${encodeURIComponent(formId)}/subscriptions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email_address: email }).toString(),
    redirect: 'manual', // 302 to /forms/success is the success signal; don't follow.
  });
  // Manual-redirect mode returns the 302 directly. Anything else is an error.
  if (res.status !== 302 && !res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`kitFormSubscribe failed: ${res.status} ${body.slice(0, 500)}`);
  }
}

export async function kitUpdateSubscriberFields(
  subscriberId: string,
  fields: Record<string, string>,
): Promise<void> {
  const url = `${KIT_BASE}/subscribers/${encodeURIComponent(subscriberId)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `kitUpdateSubscriberFields failed: ${res.status} ${body.slice(0, 500)}`,
    );
  }
}

export function kitVerifyWebhook(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  if (!signatureHeader) return false;
  const secret = process.env.KIT_WEBHOOK_SECRET;
  if (!secret) throw new Error('KIT_WEBHOOK_SECRET is not set');

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const provided = signatureHeader.trim().replace(/^sha256=/, '');

  const a = Buffer.from(expected, 'hex');
  let b: Buffer;
  try {
    b = Buffer.from(provided, 'hex');
  } catch {
    return false;
  }
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
