import SubpageStub, { READERS_SUBNAV } from '@/components/SubpageStub';

export default function ReadersPage() {
  return (
    <SubpageStub
      eyebrow="For"
      title="Readers"
      sub="Read it, hear it, share it with the family. Pick a path."
      subNav={READERS_SUBNAV}
    />
  );
}
