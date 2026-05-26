import SubpageStub, { CREATORS_SUBNAV } from '@/components/SubpageStub';

export default function AgentReadinessPage() {
  return (
    <SubpageStub
      eyebrow="Creators"
      title="Agent Readiness"
      subNav={CREATORS_SUBNAV}
      activeHref="/creators/agent-readiness"
      backHref="/creators"
      backLabel="← All creator tools"
    />
  );
}
