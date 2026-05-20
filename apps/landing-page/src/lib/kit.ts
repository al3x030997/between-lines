import { createHmac, timingSafeEqual } from 'node:crypto';

// Kit (ConvertKit) wrapper. All server-to-server calls go through the v4 API
// at api.kit.com/v4 with the X-Kit-Api-Key header. The public hosted-form
// endpoint (app.kit.com/forms/{id}/subscriptions) is not used: it silently
// no-ops POSTs that don't carry the ck.5.js anti-bot fingerprint, returning
// 302 to look like success while creating nothing.

const KIT_BASE = 'https://api.kit.com/v4';

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

// Subscribe an email to a Kit form via the v4 API. Returns the new
// subscriber's id and state ("inactive" if the form has double opt-in on and
// the user still needs to confirm, "active" otherwise).
export async function kitFormSubscribe(params: {
  email: string;
  formId: string;
}): Promise<{ subscriberId: string; state: string }> {
  const { email, formId } = params;
  const url = `${KIT_BASE}/forms/${encodeURIComponent(formId)}/subscribers`;
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email_address: email }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`kitFormSubscribe failed: ${res.status} ${body.slice(0, 500)}`);
  }
  const data: unknown = await res.json().catch(() => ({}));
  const sub =
    (data as { subscriber?: { id?: unknown; state?: unknown } }).subscriber ??
    (data as { id?: unknown; state?: unknown });
  if (!sub || sub.id == null) {
    throw new Error('kitFormSubscribe: response missing subscriber.id');
  }
  return {
    subscriberId: String(sub.id),
    state: typeof sub.state === 'string' ? sub.state : 'unknown',
  };
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
