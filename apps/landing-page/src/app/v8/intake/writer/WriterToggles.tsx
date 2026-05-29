'use client';

import { Chip, Chips, Group, Prompt, ToggleChip } from '../shared/intakeAtoms';
import { PLATFORM } from './writerConstants';
import type { Platform, WriterAnswers } from './writerTypes';

type Props = {
  startNum: number;
  value: Pick<WriterAnswers, 'platform' | 'betaPool' | 'pod'>;
  onChange: (next: Partial<Pick<WriterAnswers, 'platform' | 'betaPool' | 'pod'>>) => void;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function WriterToggles({ startNum, value, onChange }: Props) {
  return (
    <>
      <Group num={pad(startNum)} label="Writing platform">
        <Prompt>Where do you do most of your writing?</Prompt>
        <Chips>
          {(Object.entries(PLATFORM) as [Platform, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={value.platform === key}
              onClick={() => onChange({ platform: key })}
            >
              {label}
            </Chip>
          ))}
        </Chips>
      </Group>

      <Group num={pad(startNum + 1)} label="Beta-reader pool">
        <ToggleChip
          on={value.betaPool}
          onClick={() => onChange({ betaPool: !value.betaPool })}
        >
          Yes, add me to the beta-reader pool
          <span className="v8-toggle-chip-sub">
            Beta-read others&rsquo; drafts and earn <strong>Swap Credits</strong>.
          </span>
        </ToggleChip>
        <p className="v8-intake-helper">
          Writers earn Swap Credits by giving beta-reads &mdash; redeemable for beta-reads on your own manuscript. No cash required.
        </p>
      </Group>

      <Group num={pad(startNum + 2)} label="Writer’s pod">
        <ToggleChip
          on={value.pod}
          onClick={() => onChange({ pod: !value.pod })}
        >
          Enroll me in the writer&rsquo;s pod for my preferred genres
          <span className="v8-toggle-chip-sub">
            Small group (≤4 writers) for craft conversation. Change to No in Account Preferences any time.
          </span>
        </ToggleChip>
      </Group>
    </>
  );
}
