import SubpageStub, { CREATORS_SUBNAV } from '@/components/SubpageStub';

export default function SecureBetaReadsPage() {
  return (
    <SubpageStub
      eyebrow="Creators"
      title="Secure BetaReads"
      subNav={CREATORS_SUBNAV}
      activeHref="/creators/securebetareads"
      backHref="/creators"
      backLabel="← All creator tools"
    />
  );
}
