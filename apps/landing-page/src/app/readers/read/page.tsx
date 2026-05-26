import SubpageStub, { READERS_SUBNAV } from '@/components/SubpageStub';

export default function ReadPage() {
  return (
    <SubpageStub
      eyebrow="Readers"
      title="Read"
      subNav={READERS_SUBNAV}
      activeHref="/readers/read"
      backHref="/readers"
      backLabel="← All reader paths"
    />
  );
}
