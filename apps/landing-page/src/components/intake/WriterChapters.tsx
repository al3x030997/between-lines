'use client';
import { useState } from 'react';
import type { Palette } from '@/lib/palettes';
import { Acts, ChHd, Chips, ICheck, IQ, TxtArea, TxtIn } from './primitives';

type StepProps = { P: Palette; n: () => void; s?: () => void };

export function WC1({ P, n, s }: StepProps) {
  const [path, setPath] = useState('');
  const paths = [
    { id: 'sharing', t: 'Just sharing', d: 'Build readers, get reactions, grow a following.' },
    { id: 'serious', t: 'Serious beta reads + agent matching', d: 'Pro workflow, manuscript protection, packaging help.' },
    { id: 'exploring', t: 'Still exploring', d: 'Browse the platform first.' },
  ];
  return (
    <div>
      <ChHd ch={1} title="Pick your path" P={P} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {paths.map(x => {
          const on = path === x.id;
          return (
            <div
              key={x.id}
              onClick={() => setPath(x.id)}
              style={{
                padding: '16px 20px', borderRadius: 12,
                border: `1.5px solid ${on ? P.accent : P.mute + '33'}`,
                background: on ? `${P.accent}0D` : P.bg,
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              <p style={{ color: on ? P.accent : P.primary, fontSize: 15, fontWeight: 500, fontFamily: "'Outfit',sans-serif" }}>{x.t}</p>
              <p style={{ color: P.mute, fontSize: 13, fontFamily: "'Outfit',sans-serif", marginTop: 3 }}>{x.d}</p>
            </div>
          );
        })}
      </div>
      <Acts onNext={n} onSkip={s} P={P} />
    </div>
  );
}

export function WC2({ P, n, s }: StepProps) {
  const [journey, setJourney] = useState('');
  const [stage, setStage] = useState('');
  const [want, setWant] = useState<string[]>([]);
  const tw = (v: string) => setWant(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  return (
    <div>
      <ChHd ch={2} title="Quick setup" P={P} />
      <IQ label="Where are you on the journey?" P={P}>
        <Chips options={['Aspiring', 'Emerging', 'Established']} selected={journey} onToggle={setJourney} P={P} />
      </IQ>
      <IQ label="Manuscript stage" P={P}>
        <Chips options={['Drafting', 'Revising', 'Ready for beta', 'Complete']} selected={stage} onToggle={setStage} P={P} />
      </IQ>
      <IQ label="What do you want?" sub="All that apply" P={P}>
        <Chips options={['Audience', 'Honest feedback', 'Agent matching', 'Self-publish prep']} selected={want} onToggle={tw} multi P={P} />
      </IQ>
      <Acts onNext={n} onSkip={s} P={P} />
    </div>
  );
}

export function WC3({ P, n, s }: StepProps) {
  const [genre, setGenre] = useState('');
  const [length, setLength] = useState('');
  const [type, setType] = useState('');
  const [route, setRoute] = useState('');
  const [timeline, setTimeline] = useState('');
  const [goal, setGoal] = useState('');
  const [book, setBook] = useState('');
  return (
    <div>
      <ChHd ch={3} title="About your work" P={P} />
      <IQ label="Genre" P={P}>
        <Chips options={['Fantasy', 'Romance', 'Sci-fi', 'Mystery/Thriller', 'Literary', 'Memoir', 'Business', 'Other']} selected={genre} onToggle={setGenre} P={P} />
      </IQ>
      <IQ label="Target length" P={P}>
        <Chips options={['Under 15k', '15–40k', '40–80k', '80–120k', '120k+', 'Not sure']} selected={length} onToggle={setLength} P={P} />
      </IQ>
      <IQ label="Manuscript type" P={P}>
        <Chips options={['Single story', 'Short stories', 'Serialized', 'Not sure']} selected={type} onToggle={setType} P={P} />
      </IQ>
      <IQ label="Publishing route" P={P}>
        <Chips options={['Traditional', 'Self-publish', 'Online group', 'Not sure']} selected={route} onToggle={setRoute} P={P} />
      </IQ>
      <IQ label="Timeline" P={P}>
        <Chips options={['This quarter', '3–6 months', '6–12 months']} selected={timeline} onToggle={setTimeline} P={P} />
      </IQ>
      <IQ label="Goal this month" P={P}>
        <Chips options={['Finish revision', 'Beta feedback', 'Build agent list', 'Send queries']} selected={goal} onToggle={setGoal} P={P} />
      </IQ>
      <IQ label="A book you loved" P={P}>
        <TxtIn value={book} onChange={setBook} placeholder="e.g. Station Eleven" P={P} />
      </IQ>
      <Acts onNext={n} onSkip={s} P={P} />
    </div>
  );
}

export function WC4({ P, n, s }: StepProps) {
  const [submit, setSubmit] = useState('');
  const [feedback, setFeedback] = useState<string[]>([]);
  const [warning, setWarning] = useState('');
  const [hook, setHook] = useState('');
  const [pitch, setPitch] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const tfb = (v: string) => setFeedback(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  return (
    <div>
      <ChHd ch={4} title="Submission packaging" P={P} />
      <IQ label="What are you submitting?" P={P}>
        <Chips options={['Microstory', 'Flash', 'Chapter 1', 'Excerpt', 'Full manuscript']} selected={submit} onToggle={setSubmit} P={P} />
      </IQ>
      <IQ label="Feedback wanted" sub="All that apply" P={P}>
        <Chips options={['Big-picture', 'Plot clarity', 'Characters', 'Pacing', 'Hook / keep reading?']} selected={feedback} onToggle={tfb} multi P={P} />
      </IQ>
      <IQ label="Content warnings" P={P}>
        <Chips options={['None', 'Dark themes', 'Violence', 'Mental health', 'Other']} selected={warning} onToggle={setWarning} P={P} />
      </IQ>
      <IQ label="1–2 sentence hook" P={P}>
        <TxtIn value={hook} onChange={setHook} placeholder="What makes someone pick up your book?" P={P} />
      </IQ>
      <IQ label="Pitch" P={P}>
        <TxtArea value={pitch} onChange={setPitch} placeholder="Your elevator pitch..." P={P} />
      </IQ>
      <IQ label="Synopsis" sub="300–500 words" P={P}>
        <TxtArea value={synopsis} onChange={setSynopsis} placeholder="Brief synopsis..." P={P} rows={4} />
      </IQ>
      <Acts onNext={n} onSkip={s} P={P} />
    </div>
  );
}

export function WC5({ P, n, s }: StepProps) {
  const [uploaded, setUploaded] = useState(false);
  const [done, setDone] = useState(false);
  const start = () => {
    setUploaded(true);
    setTimeout(() => setDone(true), 1500);
  };
  const an = { genre: 'Fantasy', conf: 78, cat: 'Adult', len: '92k', comps: ['The Poppy War', 'The Fifth Season', 'Piranesi'] };
  return (
    <div>
      <ChHd ch={5} title="Upload your sample" P={P} />
      {!uploaded ? (
        <div
          onClick={start}
          onMouseEnter={e => (e.currentTarget.style.borderColor = P.accent)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = P.mute + '33')}
          style={{ border: `2px dashed ${P.mute}33`, borderRadius: 14, padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: P.bg }}
        >
          <p style={{ color: P.primary, fontSize: 16, fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>Drop your manuscript here</p>
          <p style={{ color: P.mute, fontSize: 13, fontFamily: "'Outfit',sans-serif", marginTop: 6 }}>.docx, .pdf, .txt</p>
        </div>
      ) : (
        <div>
          <div style={{ background: P.cardBg, borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📄</span>
            <div>
              <p style={{ color: P.cardText, fontSize: 14, fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>manuscript_ch1.docx</p>
              <p style={{ color: P.mute, fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>12,400 words</p>
            </div>
          </div>
          {!done ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: 24, height: 24,
                  border: `3px solid ${P.accent}33`,
                  borderTopColor: P.accent,
                  borderRadius: '50%',
                  margin: '0 auto',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p style={{ color: P.mute, fontSize: 13, fontFamily: "'Outfit',sans-serif", marginTop: 10 }}>Analyzing...</p>
            </div>
          ) : (
            <div>
              <p style={{ color: P.accent, fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                Instant Analysis
              </p>
              {[
                { l: 'Genre', v: `${an.genre} (${an.conf}%)` },
                { l: 'Category', v: an.cat },
                { l: 'Length', v: `~${an.len} words` },
                { l: 'Comps', v: an.comps.join(' · ') },
              ].map(r => (
                <div
                  key={r.l}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', background: P.bg, borderRadius: 10,
                    border: `1px solid ${P.mute}33`, marginBottom: 8,
                  }}
                >
                  <div>
                    <p style={{ color: P.mute, fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{r.l}</p>
                    <p style={{ color: P.primary, fontSize: 14, fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>{r.v}</p>
                  </div>
                  <span style={{ color: P.accent, fontSize: 12, fontFamily: "'Outfit',sans-serif", cursor: 'pointer', fontWeight: 500 }}>Keep</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {done && <Acts onNext={n} onSkip={s} P={P} />}
    </div>
  );
}

export function WC6({ P, n }: StepProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [display, setDisplay] = useState('');
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  return (
    <div>
      <ChHd ch={6} title="Create your account" P={P} />
      <IQ label="Name" P={P}>
        <TxtIn value={name} onChange={setName} placeholder="Your name" P={P} />
      </IQ>
      <IQ label="Email" P={P}>
        <TxtIn value={email} onChange={setEmail} placeholder="you@email.com" P={P} />
      </IQ>
      <IQ label="Display name" sub="Pen name allowed" P={P}>
        <TxtIn value={display} onChange={setDisplay} placeholder="Display name" P={P} />
      </IQ>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <ICheck on={agree1} toggle={() => setAgree1(!agree1)} P={P} />
          <p style={{ color: P.mute, fontSize: 13, fontFamily: "'Outfit',sans-serif", lineHeight: 1.5 }}>
            I agree to manuscript protection defaults.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <ICheck on={agree2} toggle={() => setAgree2(!agree2)} P={P} />
          <p style={{ color: P.mute, fontSize: 13, fontFamily: "'Outfit',sans-serif", lineHeight: 1.5 }}>
            Contact me about feedback, drops, and agents.
          </p>
        </div>
      </div>
      <Acts onNext={n} P={P} label="Create account" noSkip />
    </div>
  );
}
