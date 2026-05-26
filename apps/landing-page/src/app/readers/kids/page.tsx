import SubpageStub, { READERS_SUBNAV } from '@/components/SubpageStub';

export default function KidsPage() {
  return (
    <SubpageStub
      eyebrow="Readers"
      title="Kids"
      subNav={READERS_SUBNAV}
      activeHref="/readers/kids"
      backHref="/readers"
      backLabel="← All reader paths"
    />
  );
}
