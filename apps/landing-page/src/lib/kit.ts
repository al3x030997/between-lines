import { createHmac, timingSafeEqual } from 'node:crypto';

// Kit (ConvertKit) API v4 wrapper.
// API base: https://api.kit.com/v4
// Auth: header `X-Kit-Api-Key: <KIT_API_KEY>`
// Verify exact webhook event names against current Kit docs at implementation
// time — event identifiers have shifted between v3 and v4.

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

export type KitSubscribeResult = {
  subscriberId: string;
  state: string;
};

export async function kitSubscribe(params: {
  email: string;
  formId: string;
  fields?: Record<string, string>;
}): Promise<KitSubscribeResult> {
  const { email, formId, fields } = params;
  const url = `${KIT_BASE}/forms/${encodeURIComponent(formId)}/subscribers`;
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email_address: email, fields }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`kitSubscribe failed: ${res.status} ${body.slice(0, 500)}`);
  }
  const json = (await res.json()) as {
    subscriber?: { id?: number | string; state?: string };
  };
  const id = json.subscriber?.id;
  const state = json.subscriber?.state ?? 'unknown';
  if (id == null) {
    throw new Error('kitSubscribe: missing subscriber.id in response');
  }
  return { subscriberId: String(id), state };
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
