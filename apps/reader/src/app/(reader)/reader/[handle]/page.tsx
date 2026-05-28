import { notFound } from 'next/navigation';
import { getReaderProfile } from '@/lib/mock-readers';
import { ReaderProfileView } from '@/components/profile/ReaderProfileView';
import { OwnProfileGate } from '@/components/profile/OwnProfileGate';

type PageProps = { params: { handle: string } };

export default function PublicReaderProfilePage({ params }: PageProps) {
  const profile = getReaderProfile(params.handle);
  if (!profile) notFound();

  return (
    <main className="br-pf-page">
      <OwnProfileGate ownHandle={profile.handle}>
        {(editable) => <ReaderProfileView profile={profile} editable={editable} />}
      </OwnProfileGate>
    </main>
  );
}
