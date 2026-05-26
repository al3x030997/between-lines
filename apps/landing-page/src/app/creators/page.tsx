import SubpageStub, { CREATORS_SUBNAV } from '@/components/SubpageStub';

export default function CreatorsPage() {
  return (
    <SubpageStub
      eyebrow="For"
      title="Creators"
      sub="Tools for writers and illustrators. Pick a path."
      subNav={CREATORS_SUBNAV}
    />
  );
}
