import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSubscribers } from '@/lib/db/schema';
import { INSIDER_CSS } from './insiderCss';
import ReaderInsider from './ReaderInsider';
import WriterInsider from './WriterInsider';
import EmptyInsider from './EmptyInsider';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function InsiderHome() {
  // Middleware (src/middleware.ts) gates /insider and forwards the verified
  // Kit subscriber id on this header. Anything missing means the gate didn't
  // run — bounce back to the gate redirect for consistency.
  const sid = headers().get('x-bl-sid');
  if (!sid) {
    redirect('/?u=gate');
  }

  const [row] = await db
    .select({ intake: waitlistSubscribers.intake })
    .from(waitlistSubscribers)
    .where(eq(waitlistSubscribers.kitSubscriberId, sid))
    .limit(1);

  let view: React.ReactNode;
  if (!row?.intake) {
    view = <EmptyInsider />;
  } else if (row.intake.region === 'reader') {
    view = <ReaderInsider intake={row.intake} />;
  } else {
    view = <WriterInsider intake={row.intake} />;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INSIDER_CSS }} />
      {view}
    </>
  );
}
