import { notFound } from 'next/navigation';
import { getWriterProfile } from '@/lib/mock-writers';
import { OwnProfileGate } from '@/components/profile/OwnProfileGate';
import { WriterProfileView } from '@/components/profile/WriterProfileView';

type PageProps = { params: { handle: string } };

export default function WriterProfilePage({ params }: PageProps) {
  const profile = getWriterProfile(params.handle);
  if (!profile) notFound();

  return (
    <main className="br-pf-page">
      <OwnProfileGate ownHandle={profile.handle}>
        {(editable) => <WriterProfileView profile={profile} editable={editable} />}
      </OwnProfileGate>
    </main>
  );
}
