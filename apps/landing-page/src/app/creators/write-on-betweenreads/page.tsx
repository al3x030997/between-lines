import SubpageStub, { CREATORS_SUBNAV } from '@/components/SubpageStub';

export default function WriteOnBetweenReadsPage() {
  return (
    <SubpageStub
      eyebrow="Creators"
      title="Write on BetweenReads"
      subNav={CREATORS_SUBNAV}
      activeHref="/creators/write-on-betweenreads"
      backHref="/creators"
      backLabel="← All creator tools"
    />
  );
}
