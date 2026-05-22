'use client';

import FavoriteBooks from './shared/FavoriteBooks';
import { Chip, Chips, ExpandRow, Group, Prompt } from './shared/intakeAtoms';
import WriterGenre from './writer/WriterGenre';
import WriterGoals from './writer/WriterGoals';
import WriterToggles from './writer/WriterToggles';
import {
  AGENT_STAGE,
  JOURNEY,
  LANGUAGE,
  MONTH_GOAL,
  MS_STAGE,
  PUB_ROUTE,
  SELF_PUBLISH_EXTRA,
  SELF_PUBLISH_EXTRA_LABEL,
  SUBMISSIONS,
  TARGET_LENGTH,
  TIMELINE,
  WORKING_ON,
} from './writer/writerConstants';
import {
  canSubmitWriter,
  type AgentStage,
  type JourneyStage,
  type Language,
  type ManuscriptStage,
  type MonthGoal,
  type PubRoute,
  type SubmissionsTarget,
  type TargetLength,
  type Timeline,
  type WorkingOn,
  type WriterAnswers,
} from './writer/writerTypes';

export type { WriterAnswers } from './writer/writerTypes';
export { WRITER_INITIAL } from './writer/writerTypes';

type Props = {
  answers: WriterAnswers;
  onChange: (next: WriterAnswers) => void;
  onSubmit: () => void;
};

export default function WriterForm({ answers, onChange, onSubmit }: Props) {
  const patch = <K extends keyof WriterAnswers>(key: K, value: WriterAnswers[K]) => {
    onChange({ ...answers, [key]: value });
  };

  const setPubRoute = (r: PubRoute) => {
    // Clear agentStage when leaving traditional.
    onChange({
      ...answers,
      pubRoute: r,
      agentStage: r === 'traditional' ? answers.agentStage : null,
    });
  };

  const setManuscriptStage = (s: ManuscriptStage) => patch('manuscriptStage', s);

  const showSelfPublishExtra = answers.pubRoute === 'self';
  const showAgentStage = answers.pubRoute === 'traditional';

  const ready = canSubmitWriter(answers);

  return (
    <div className="v8-intake-form" aria-label="Writer submission">
      {/* Q1 — Genre */}
      <WriterGenre
        num="01"
        value={answers.genre}
        onChange={(next) => patch('genre', next)}
      />

      {/* Q2 — Journey */}
      <Group num="02" label="Journey">
        <Prompt>Where are you on the journey?</Prompt>
        <Chips>
          {(Object.entries(JOURNEY) as [JourneyStage, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={answers.journey === key}
              onClick={() => patch('journey', key)}
            >
              {label}
            </Chip>
          ))}
        </Chips>
      </Group>

      {/* Q3 — Awards */}
      <Group num="03" label="Contest / award wins">
        <Prompt>Anything you&rsquo;d like to mention? Optional.</Prompt>
        <textarea
          className="v8-intake-textarea"
          value={answers.awards}
          onChange={(e) => patch('awards', e.target.value.slice(0, 500))}
          placeholder="Longlists, shortlists, wins, residencies…"
          rows={2}
          maxLength={500}
        />
      </Group>

      {/* Q4 — Working on */}
      <Group num="04" label="Currently working on">
        <Prompt>What are you currently working on?</Prompt>
        <Chips>
          {(Object.entries(WORKING_ON) as [WorkingOn, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={answers.workingOn === key}
              onClick={() => patch('workingOn', key)}
            >
              {label}
            </Chip>
          ))}
        </Chips>
      </Group>

      {/* Q5 — Publishing route + agent stage */}
      <Group num="05" label="Publishing route">
        <Prompt>Intended publishing route?</Prompt>
        <p className="v8-intake-helper">Don&rsquo;t worry — you can change this later.</p>
        <Chips>
          {(Object.entries(PUB_ROUTE) as [PubRoute, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={answers.pubRoute === key}
              onClick={() => setPubRoute(key)}
            >
              {label}
            </Chip>
          ))}
        </Chips>
        <ExpandRow open={showAgentStage}>
          <div style={{ paddingTop: 12 }}>
            <span className="v8-intake-sublabel">Where on the agent path?</span>
            <Chips>
              {(Object.entries(AGENT_STAGE) as [AgentStage, string][]).map(([key, label]) => (
                <Chip
                  key={key}
                  selected={answers.agentStage === key}
                  onClick={() => patch('agentStage', key)}
                >
                  {label}
                </Chip>
              ))}
            </Chips>
          </div>
        </ExpandRow>
      </Group>

      {/* Q6 — Manuscript stage + seeking-reviews when self-publish */}
      <Group num="06" label="Manuscript stage">
        <Prompt>What stage is the manuscript?</Prompt>
        <Chips>
          {(Object.entries(MS_STAGE) as [ManuscriptStage, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={answers.manuscriptStage === key}
              onClick={() => setManuscriptStage(key)}
            >
              {label}
            </Chip>
          ))}
          {showSelfPublishExtra && (
            <Chip
              selected={answers.manuscriptStage === SELF_PUBLISH_EXTRA}
              onClick={() => setManuscriptStage(SELF_PUBLISH_EXTRA as ManuscriptStage)}
            >
              {SELF_PUBLISH_EXTRA_LABEL}
            </Chip>
          )}
        </Chips>
      </Group>

      {/* Q7 — Language */}
      <Group num="07" label="Primary language">
        <Prompt>What language do you write in?</Prompt>
        <Chips>
          {(Object.entries(LANGUAGE) as [Language, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={answers.language === key}
              onClick={() => patch('language', key)}
            >
              {label}
            </Chip>
          ))}
        </Chips>
      </Group>

      {/* Q8 — Giveaways */}
      <Group num="08" label="Free reading giveaways">
        <Prompt>Would you like to offer free reading giveaways to interested readers?</Prompt>
        <Chips>
          <Chip
            selected={answers.giveaways === true}
            onClick={() => patch('giveaways', true)}
          >
            Yes
          </Chip>
          <Chip
            selected={answers.giveaways === false}
            onClick={() => patch('giveaways', false)}
          >
            No
          </Chip>
        </Chips>
      </Group>

      {/* Q9 — Target length */}
      <Group num="09" label="Target length">
        <Prompt>Roughly how long?</Prompt>
        <Chips>
          {(Object.entries(TARGET_LENGTH) as [TargetLength, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={answers.targetLength === key}
              onClick={() => patch('targetLength', key)}
            >
              {label}
            </Chip>
          ))}
        </Chips>
      </Group>

      {/* Q10 — Submissions */}
      <Group num="10" label="Submissions">
        <Prompt>Submitting to&hellip;</Prompt>
        <Chips>
          {(Object.entries(SUBMISSIONS) as [SubmissionsTarget, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={answers.submissions === key}
              onClick={() => patch('submissions', key)}
            >
              {label}
            </Chip>
          ))}
        </Chips>
      </Group>

      {/* Q11 — Timeline */}
      <Group num="11" label="Timeline">
        <Prompt>When would you like to be ready?</Prompt>
        <Chips>
          {(Object.entries(TIMELINE) as [Timeline, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={answers.timeline === key}
              onClick={() => patch('timeline', key)}
            >
              {label}
            </Chip>
          ))}
        </Chips>
      </Group>

      {/* Q12 — Goal this month */}
      <Group num="12" label="Goal this month">
        <Prompt>What&rsquo;s the main goal this month?</Prompt>
        <Chips>
          {(Object.entries(MONTH_GOAL) as [MonthGoal, string][]).map(([key, label]) => (
            <Chip
              key={key}
              selected={answers.monthGoal === key}
              onClick={() => patch('monthGoal', key)}
            >
              {label}
            </Chip>
          ))}
        </Chips>
      </Group>

      {/* Q13 — Favorite books */}
      <Group num="13" label="Favorite books">
        <Prompt>A few titles that shaped you as a writer.</Prompt>
        <FavoriteBooks
          value={answers.favoriteBooks}
          onChange={(next) => patch('favoriteBooks', next)}
        />
      </Group>

      {/* Q14–16 — Platform, beta pool, writer's pod */}
      <WriterToggles
        startNum={14}
        value={{ platform: answers.platform, betaPool: answers.betaPool, pod: answers.pod }}
        onChange={(p) => onChange({ ...answers, ...p })}
      />

      {/* Q17 — Goals branching tree */}
      <WriterGoals
        num="17"
        value={answers.goals}
        onChange={(next) => patch('goals', next)}
      />

      <style>{`
        .v8-intake-textarea {
          appearance: none;
          width: 100%;
          background: rgba(14, 14, 12, 0.04);
          border: 1px solid var(--v6-divider);
          border-radius: 16px;
          padding: 12px 16px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          color: var(--v6-text-strong);
          line-height: 1.5;
          resize: vertical;
          min-height: 64px;
          transition: border-color 180ms var(--v6-ease), background 180ms var(--v6-ease);
        }
        .v8-intake-textarea:focus {
          border-color: var(--v6-accent);
          background: var(--v6-accent-soft);
          outline: none;
        }
      `}</style>

      <p className="v8-intake-caption">
        We do the rest: <strong>wordcount verification</strong>, readability check, packaging help
        (hook · pitch · synopsis), and a quick curator triage before it goes live in a drop.
      </p>

      <div className="v8-intake-actions">
        <button
          type="button"
          className="v8-cta v8-cta-primary"
          onClick={onSubmit}
          disabled={!ready}
          style={ready ? undefined : { opacity: 0.45, cursor: 'not-allowed' }}
        >
          Submit for review
          <span className="v8-cta-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
