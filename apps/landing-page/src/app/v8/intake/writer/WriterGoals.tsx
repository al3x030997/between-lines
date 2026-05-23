'use client';

import FileDrop from '../shared/FileDrop';
import { Chip, Chips, ExpandRow, Group, Prompt } from '../shared/intakeAtoms';
import type {
  AiTier,
  AlsoChoose,
  GoalKey,
  WriterAnswers,
} from './writerTypes';

type Props = {
  num: string;
  value: WriterAnswers['goals'];
  onChange: (next: WriterAnswers['goals']) => void;
};

const GOAL_LABEL: Record<GoalKey, string> = {
  buildAgentList: 'Build my agent list',
  buildAuthorPage: 'Build my author page',
  uploadSample: 'Upload a sample (≥5,000 words)',
};

const ALSO_LABEL: Record<AlsoChoose, string> = {
  buildAgentList: 'Build my agent list',
  buildAuthorPage: 'Build my author page',
  justRead: 'Just take me to read',
};

const SAMPLE_ACCEPT = ['.doc', '.docx', '.pdf', '.txt', '.md'];
const LIST_ACCEPT = ['.csv', '.xls', '.xlsx'];
const KIT_ACCEPT = ['.pdf', '.doc', '.docx', '.txt', '.md'];

export default function WriterGoals({ num, value, onChange }: Props) {
  const isSelected = (k: GoalKey) => value.selected.includes(k);

  const toggleGoal = (k: GoalKey) => {
    if (isSelected(k)) {
      onChange({ ...value, selected: value.selected.filter((g) => g !== k) });
    } else {
      onChange({ ...value, selected: [...value.selected, k] });
    }
  };

  const updateAgentList = (patch: Partial<WriterAnswers['goals']['buildAgentList']>) => {
    onChange({
      ...value,
      buildAgentList: { ...value.buildAgentList, ...patch },
    });
  };

  const updateSample = (patch: Partial<WriterAnswers['goals']['uploadSample']>) => {
    onChange({
      ...value,
      uploadSample: { ...value.uploadSample, ...patch },
    });
  };

  const updateHelpKit = (patch: Partial<WriterAnswers['goals']['uploadSample']['helpKit']>) => {
    updateSample({
      helpKit: { ...value.uploadSample.helpKit, ...patch },
    });
  };

  const toggleAiTier = (tier: AiTier) => {
    const current = value.uploadSample.helpKit.aiTierInterest;
    const next = current.includes(tier)
      ? current.filter((t) => t !== tier)
      : [...current, tier];
    updateHelpKit({ aiTierInterest: next });
  };

  const toggleAlsoChoose = (k: AlsoChoose) => {
    const current = value.uploadSample.alsoChoose;
    const next = current.includes(k) ? current.filter((x) => x !== k) : [...current, k];
    updateSample({ alsoChoose: next });
  };

  return (
    <Group num={num} label="What do you want to do?">
      <Prompt>Pick everything that fits &mdash; you can do more than one.</Prompt>
      <Chips>
        {(Object.entries(GOAL_LABEL) as [GoalKey, string][]).map(([key, label]) => (
          <Chip key={key} selected={isSelected(key)} onClick={() => toggleGoal(key)}>
            {label}
          </Chip>
        ))}
      </Chips>

      {/* Branch: Build Agent List */}
      <ExpandRow open={isSelected('buildAgentList')}>
        <div className="v8-goal-branch">
          <h4 className="v8-goal-branch-title">Build my agent list</h4>
          <Chips>
            <Chip
              selected={value.buildAgentList.mode === 'research'}
              onClick={() => updateAgentList({ mode: 'research' })}
            >
              Research / query for new list adds
            </Chip>
            <Chip
              selected={value.buildAgentList.mode === 'upload'}
              onClick={() => updateAgentList({ mode: 'upload' })}
            >
              Upload CSV / XLS of existing list
            </Chip>
          </Chips>
          <ExpandRow open={value.buildAgentList.mode === 'upload'}>
            <div style={{ paddingTop: 12 }}>
              <FileDrop
                slot={value.buildAgentList.list}
                onChange={(next) => updateAgentList({ list: next })}
                accept={LIST_ACCEPT}
                maxMB={5}
                title="Upload your agent list"
                subtitle={`${LIST_ACCEPT.join(' · ')} · up to 5 MB`}
              />
            </div>
          </ExpandRow>
        </div>
      </ExpandRow>

      {/* Branch: Build Author Page (terminal) */}
      <ExpandRow open={isSelected('buildAuthorPage')}>
        <div className="v8-goal-branch">
          <h4 className="v8-goal-branch-title">Build my author page</h4>
          <p className="v8-intake-helper">
            We&rsquo;ll generate a starter page with custom themes once you&rsquo;re in &mdash; showcase
            your writing portfolio, list works for sale, and add an agent-ready bio.
          </p>
        </div>
      </ExpandRow>

      {/* Branch: Upload Sample */}
      <ExpandRow open={isSelected('uploadSample')}>
        <div className="v8-goal-branch">
          <h4 className="v8-goal-branch-title">Upload a sample (≥5,000 words)</h4>
          <FileDrop
            slot={value.uploadSample.sample}
            onChange={(next) => updateSample({ sample: next })}
            accept={SAMPLE_ACCEPT}
            maxMB={10}
            title="Upload your draft"
          />

          <ExpandRow open={!!value.uploadSample.sample.file}>
            <div style={{ paddingTop: 14 }}>
              <p className="v8-intake-prompt" style={{ fontSize: 22 }}>
                Want help with your synopsis, pitch, or query letter?
              </p>
              <Chips>
                <Chip
                  selected={value.uploadSample.wantHelp === true}
                  onClick={() => updateSample({ wantHelp: true })}
                >
                  Yes &mdash; great
                </Chip>
                <Chip
                  selected={value.uploadSample.wantHelp === false}
                  onClick={() => updateSample({ wantHelp: false })}
                >
                  No, not now
                </Chip>
              </Chips>

              {/* wantHelp === true → upload synopsis/pitch/query + AI tier interest */}
              <ExpandRow open={value.uploadSample.wantHelp === true}>
                <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <FileDrop
                    slot={value.uploadSample.helpKit.synopsis}
                    onChange={(next) => updateHelpKit({ synopsis: next })}
                    accept={KIT_ACCEPT}
                    maxMB={2}
                    title="Synopsis (optional)"
                    subtitle={`${KIT_ACCEPT.join(' · ')} · up to 2 MB`}
                  />
                  <FileDrop
                    slot={value.uploadSample.helpKit.pitch}
                    onChange={(next) => updateHelpKit({ pitch: next })}
                    accept={KIT_ACCEPT}
                    maxMB={2}
                    title="Short pitch — one paragraph (optional)"
                    subtitle={`${KIT_ACCEPT.join(' · ')} · up to 2 MB`}
                  />
                  <FileDrop
                    slot={value.uploadSample.helpKit.queryLetter}
                    onChange={(next) => updateHelpKit({ queryLetter: next })}
                    accept={KIT_ACCEPT}
                    maxMB={2}
                    title="Query letter (optional — or use our templates)"
                    subtitle={`${KIT_ACCEPT.join(' · ')} · up to 2 MB`}
                  />
                  <div>
                    <span className="v8-intake-sublabel">AgentReady Pro &mdash; AI assistance</span>
                    <Chips>
                      <Chip
                        selected={value.uploadSample.helpKit.aiTierInterest.includes('assess')}
                        onClick={() => toggleAiTier('assess')}
                      >
                        $ &middot; Assess my existing materials
                      </Chip>
                      <Chip
                        selected={value.uploadSample.helpKit.aiTierInterest.includes('develop')}
                        onClick={() => toggleAiTier('develop')}
                      >
                        $$ &middot; Develop materials from my sample
                      </Chip>
                    </Chips>
                    <p className="v8-intake-helper">
                      Interest only &mdash; we&rsquo;ll follow up; not charged here.
                    </p>
                  </div>
                </div>
              </ExpandRow>

              {/* wantHelp === false → alsoChoose */}
              <ExpandRow open={value.uploadSample.wantHelp === false}>
                <div style={{ paddingTop: 14 }}>
                  <p className="v8-intake-helper">
                    No worries. Where would you like to go next?
                  </p>
                  <Chips>
                    {(Object.entries(ALSO_LABEL) as [AlsoChoose, string][]).map(([key, label]) => (
                      <Chip
                        key={key}
                        selected={value.uploadSample.alsoChoose.includes(key)}
                        onClick={() => toggleAlsoChoose(key)}
                      >
                        {label}
                      </Chip>
                    ))}
                  </Chips>
                </div>
              </ExpandRow>
            </div>
          </ExpandRow>
        </div>
      </ExpandRow>

      <style>{`
        .v8-goal-branch {
          margin-top: 14px;
          padding: 18px 18px 18px 20px;
          border-left: 2px solid var(--v6-accent);
          background: var(--v6-accent-soft);
          border-radius: 0 8px 8px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .v8-goal-branch-title {
          font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 500;
          font-variation-settings: 'opsz' 96, 'SOFT' 40;
          font-size: 20px;
          line-height: 1.2;
          color: var(--v6-text-strong);
          margin: 0;
        }
      `}</style>
    </Group>
  );
}
