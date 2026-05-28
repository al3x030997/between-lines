'use client';

import { useMockSession } from '@/lib/useMockSession';

/**
 * Wraps profile content. Passes an `editable` flag to children based on
 * whether the signed-in user's handle matches the profile being viewed.
 *
 * Used as a render-prop so the server-component parent stays SSR-friendly.
 */
export function OwnProfileGate({
  ownHandle,
  children,
}: {
  ownHandle: string;
  children: (editable: boolean) => React.ReactNode;
}) {
  const { session } = useMockSession();
  const editable = session?.handle?.toLowerCase() === ownHandle.toLowerCase();
  return <>{children(editable)}</>;
}
