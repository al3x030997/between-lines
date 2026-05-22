// Writer intake state. File slots keep the live File on the client; only
// {name, size} cross the wire (see serializeWriter() in WriterForm.tsx).

export type GenreFocus = 'single' | 'cross';
export type JourneyStage = 'aspiring' | 'emerging' | 'established';
export type WorkingOn = 'debut' | 'new' | 'thinking';
export type PubRoute = 'traditional' | 'self' | 'reading-group' | 'unsure';
export type AgentStage =
  | 'researching'
  | 'building-list'
  | 'querying-soon'
  | 'querying-now';
export type ManuscriptStage =
  | 'draft'
  | 'final-draft'
  | 'editing'
  | 'proofreading'
  | 'complete'
  | 'seeking-betas'
  | 'seeking-reviews';
export type Language = 'en' | 'de' | 'hi' | 'fr' | 'es' | 'other';
export type TargetLength =
  | 'lt15k'
  | '15-40k'
  | '40-80k'
  | '80-120k'
  | '120kplus'
  | 'unsure';
export type SubmissionsTarget = 'agents' | 'journals' | 'both' | 'na';
export type Timeline = 'q' | '3-6m' | '6-12m';
export type MonthGoal =
  | 'finish-revision'
  | 'beta-feedback'
  | 'agent-list'
  | 'send-queries';
export type Platform =
  | 'prowritingaid'
  | 'scrivener'
  | 'wordpress'
  | 'tumblr'
  | 'substack'
  | 'medium'
  | 'wattpad';
export type GoalKey = 'buildAgentList' | 'buildAuthorPage' | 'uploadSample';
export type AlsoChoose = 'buildAgentList' | 'buildAuthorPage' | 'justRead';
export type AiTier = 'assess' | 'develop';

export type FileSlot = { file: File | null; error: string | null };
export const EMPTY_FILE: FileSlot = { file: null, error: null };

export type BuildAgentListAnswers = {
  mode: 'research' | 'upload' | null;
  list: FileSlot;
};

export type UploadSampleAnswers = {
  sample: FileSlot;
  wantHelp: boolean | null;
  helpKit: {
    synopsis: FileSlot;
    pitch: FileSlot;
    queryLetter: FileSlot;
    aiTierInterest: AiTier[];
  };
  alsoChoose: AlsoChoose[];
};

export type WriterAnswers = {
  genre: {
    focus: GenreFocus | null;
    fictionPrimary: string[];
    nonfictionPrimary: string[];
    openToAll: boolean;
  };
  journey: JourneyStage | null;
  awards: string;
  workingOn: WorkingOn | null;
  pubRoute: PubRoute | null;
  agentStage: AgentStage | null;
  manuscriptStage: ManuscriptStage | null;
  language: Language | null;
  giveaways: boolean | null;
  targetLength: TargetLength | null;
  submissions: SubmissionsTarget | null;
  timeline: Timeline | null;
  monthGoal: MonthGoal | null;
  favoriteBooks: string[];
  platform: Platform | null;
  betaPool: boolean;
  pod: boolean;
  goals: {
    selected: GoalKey[];
    buildAgentList: BuildAgentListAnswers;
    uploadSample: UploadSampleAnswers;
  };
};

export const WRITER_INITIAL: WriterAnswers = {
  genre: {
    focus: null,
    fictionPrimary: [],
    nonfictionPrimary: [],
    openToAll: false,
  },
  journey: null,
  awards: '',
  workingOn: null,
  pubRoute: null,
  agentStage: null,
  manuscriptStage: null,
  language: null,
  giveaways: null,
  targetLength: null,
  submissions: null,
  timeline: null,
  monthGoal: null,
  favoriteBooks: [],
  platform: null,
  betaPool: false,
  pod: true, // default ON; opt-out
  goals: {
    selected: [],
    buildAgentList: { mode: null, list: { ...EMPTY_FILE } },
    uploadSample: {
      sample: { ...EMPTY_FILE },
      wantHelp: null,
      helpKit: {
        synopsis: { ...EMPTY_FILE },
        pitch: { ...EMPTY_FILE },
        queryLetter: { ...EMPTY_FILE },
        aiTierInterest: [],
      },
      alsoChoose: [],
    },
  },
};

export function canSubmitWriter(a: WriterAnswers): boolean {
  // Q1 — Genre coverage
  const hasGenre =
    a.genre.openToAll ||
    a.genre.fictionPrimary.length > 0 ||
    a.genre.nonfictionPrimary.length > 0;
  if (!a.genre.focus || !hasGenre) return false;
  // Q2 — Journey
  if (!a.journey) return false;
  // Q5 — Pub route (+ agent stage if traditional)
  if (!a.pubRoute) return false;
  if (a.pubRoute === 'traditional' && !a.agentStage) return false;
  // Q6 — Manuscript stage
  if (!a.manuscriptStage) return false;
  // Q17 — At least one goal selected and its requirements met
  if (a.goals.selected.length === 0) return false;
  if (a.goals.selected.includes('buildAgentList')) {
    const b = a.goals.buildAgentList;
    if (!b.mode) return false;
    if (b.mode === 'upload' && !b.list.file) return false;
  }
  if (a.goals.selected.includes('uploadSample')) {
    const u = a.goals.uploadSample;
    if (!u.sample.file) return false;
    if (u.wantHelp === null) return false;
    if (u.wantHelp === false && u.alsoChoose.length === 0) return false;
  }
  return true;
}

type FileMeta = { name: string; size: number } | null;
function metaOf(slot: FileSlot): FileMeta {
  return slot.file ? { name: slot.file.name, size: slot.file.size } : null;
}

export type WriterPayload = {
  genre: WriterAnswers['genre'];
  journey: JourneyStage | null;
  awards: string;
  workingOn: WorkingOn | null;
  pubRoute: PubRoute | null;
  agentStage: AgentStage | null;
  manuscriptStage: ManuscriptStage | null;
  language: Language | null;
  giveaways: boolean | null;
  targetLength: TargetLength | null;
  submissions: SubmissionsTarget | null;
  timeline: Timeline | null;
  monthGoal: MonthGoal | null;
  favoriteBooks: string[];
  platform: Platform | null;
  betaPool: boolean;
  pod: boolean;
  goals: {
    selected: GoalKey[];
    buildAgentList: {
      mode: 'research' | 'upload' | null;
      list: FileMeta;
    };
    uploadSample: {
      sample: FileMeta;
      wantHelp: boolean | null;
      helpKit: {
        synopsis: FileMeta;
        pitch: FileMeta;
        queryLetter: FileMeta;
        aiTierInterest: AiTier[];
      };
      alsoChoose: AlsoChoose[];
    };
  };
};

export function serializeWriter(a: WriterAnswers): WriterPayload {
  return {
    genre: a.genre,
    journey: a.journey,
    awards: a.awards.slice(0, 500),
    workingOn: a.workingOn,
    pubRoute: a.pubRoute,
    agentStage: a.pubRoute === 'traditional' ? a.agentStage : null,
    manuscriptStage: a.manuscriptStage,
    language: a.language,
    giveaways: a.giveaways,
    targetLength: a.targetLength,
    submissions: a.submissions,
    timeline: a.timeline,
    monthGoal: a.monthGoal,
    favoriteBooks: a.favoriteBooks,
    platform: a.platform,
    betaPool: a.betaPool,
    pod: a.pod,
    goals: {
      selected: a.goals.selected,
      buildAgentList: {
        mode: a.goals.buildAgentList.mode,
        list: metaOf(a.goals.buildAgentList.list),
      },
      uploadSample: {
        sample: metaOf(a.goals.uploadSample.sample),
        wantHelp: a.goals.uploadSample.wantHelp,
        helpKit: {
          synopsis: metaOf(a.goals.uploadSample.helpKit.synopsis),
          pitch: metaOf(a.goals.uploadSample.helpKit.pitch),
          queryLetter: metaOf(a.goals.uploadSample.helpKit.queryLetter),
          aiTierInterest: a.goals.uploadSample.helpKit.aiTierInterest,
        },
        alsoChoose: a.goals.uploadSample.alsoChoose,
      },
    },
  };
}
