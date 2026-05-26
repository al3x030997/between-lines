import SubpageStub, { READERS_SUBNAV } from '@/components/SubpageStub';

export default function ListenPage() {
  return (
    <SubpageStub
      eyebrow="Readers"
      title="Listen"
      subNav={READERS_SUBNAV}
      activeHref="/readers/listen"
      backHref="/readers"
      backLabel="← All reader paths"
    />
  );
}
