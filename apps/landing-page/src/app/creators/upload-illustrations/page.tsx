import SubpageStub, { CREATORS_SUBNAV } from '@/components/SubpageStub';

export default function UploadIllustrationsPage() {
  return (
    <SubpageStub
      eyebrow="Creators"
      title="Upload Illustrations"
      subNav={CREATORS_SUBNAV}
      activeHref="/creators/upload-illustrations"
      backHref="/creators"
      backLabel="← All creator tools"
    />
  );
}
