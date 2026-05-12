'use client';
import { useState } from 'react';
import type { Palette } from '@/lib/palettes';
import { Acts, ChHd, Chips, ICheck, IQ, TxtIn } from './primitives';

type StepProps = { P: Palette; n: () => void; s?: () => void };

export function RC1({ P, n, s }: StepProps) {
  const [genres, setGenres] = useState<string[]>([]);
  const [freq, setFreq] = useState('');
  const [discover, setDiscover] = useState('');
  const [format, setFormat] = useState<string[]>([]);
  const [club, setClub] = useState('');
  const [book, setBook] = useState('');

  const tg = (v: string) =>
    setGenres(prev => prev.includes(v) ? prev.filter(x => x !== v) : prev.length < 3 ? [...prev, v] : prev);
  const tf = (v: string) =>
    setFormat(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  return (
    <div>
      <ChHd ch={1} title="Quick reader profile" P={P} />
      <p style={{ color: P.mute, fontSize: 13, fontFamily: "'Outfit',sans-serif", marginBottom: 24, marginTop: -16 }}>
        10–20 seconds. All skippable.
      </p>
      <IQ label="Genres you read most" sub="Pick up to 3" P={P}>
        <Chips options={['Fantasy', 'Romance', 'Sci-fi', 'Lit fic', 'Mystery', 'Thriller', 'Non-fiction']} selected={genres} onToggle={tg} multi P={P} />
      </IQ>
      <IQ label="How often do you read?" P={P}>
        <Chips options={['1–2 / week', '1–2 / month', 'Quarterly', 'Yearly']} selected={freq} onToggle={setFreq} P={P} />
      </IQ>
      <IQ label="How do you discover?" P={P}>
        <Chips options={['New authors', 'Experiment genres', 'Pre-pub', 'Bestsellers']} selected={discover} onToggle={setDiscover} P={P} />
      </IQ>
      <IQ label="Format" sub="All that apply" P={P}>
        <Chips options={['Library', 'Buy used', 'Buy new', 'Ebook', 'Audio']} selected={format} onToggle={tf} multi P={P} />
      </IQ>
      <IQ label="Book clubs" P={P}>
        <Chips options={['In one', 'Want virtual', 'Not interested']} selected={club} onToggle={setClub} P={P} />
      </IQ>
      <IQ label="A book you loved" P={P}>
        <TxtIn value={book} onChange={setBook} placeholder="e.g. Piranesi by Susanna Clarke" P={P} />
      </IQ>
      <Acts onNext={n} onSkip={s} P={P} />
    </div>
  );
}

export function RC2({ P, n, s }: StepProps) {
  const [lengths, setLengths] = useState<string[]>([]);
  const [device, setDevice] = useState('');
  const [mode, setMode] = useState('');
  const [when, setWhen] = useState('');
  const [reaction, setReaction] = useState('');
  const [filters, setFilters] = useState('');
  const tl = (v: string) => setLengths(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  return (
    <div>
      <ChHd ch={2} title="Become a beta reader" P={P} />
      <p style={{ color: P.mute, fontSize: 13, fontFamily: "'Outfit',sans-serif", marginBottom: 24, marginTop: -16 }}>
        Optional — unlocks active participation.
      </p>
      <IQ label="What lengths?" sub="All that interest you" P={P}>
        <Chips options={['Microstory', 'Flash', 'Chapter 1', 'Excerpt', 'Full manuscript']} selected={lengths} onToggle={tl} multi P={P} />
      </IQ>
      <IQ label="Device" P={P}>
        <Chips options={['Mobile', 'E-reader', 'Tablet', 'Desktop']} selected={device} onToggle={setDevice} P={P} />
      </IQ>
      <IQ label="Mode" P={P}>
        <Chips options={['Read', 'Listen', 'Both']} selected={mode} onToggle={setMode} P={P} />
      </IQ>
      <IQ label="When" P={P}>
        <Chips options={['Commute', 'Bedtime', 'Weekends', 'Breaks']} selected={when} onToggle={setWhen} P={P} />
      </IQ>
      <IQ label="Reaction style" P={P}>
        <Chips options={['Just react (emoji)', 'Answer questions', 'Deep thoughts']} selected={reaction} onToggle={setReaction} P={P} />
      </IQ>
      <IQ label="Content filters" P={P}>
        <Chips options={['Auto-hide dark themes', 'Show everything']} selected={filters} onToggle={setFilters} P={P} />
      </IQ>
      <Acts onNext={n} onSkip={s} P={P} />
    </div>
  );
}

export function RC3({ P, n }: StepProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [display, setDisplay] = useState('');
  const [agree, setAgree] = useState(false);
  return (
    <div>
      <ChHd ch={3} title="Create your account" P={P} />
      <IQ label="Name" P={P}>
        <TxtIn value={name} onChange={setName} placeholder="Your name" P={P} />
      </IQ>
      <IQ label="Email" P={P}>
        <TxtIn value={email} onChange={setEmail} placeholder="you@email.com" P={P} />
      </IQ>
      <IQ label="Display name" P={P}>
        <TxtIn value={display} onChange={setDisplay} placeholder="Choose a display name" P={P} />
      </IQ>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24 }}>
        <ICheck on={agree} toggle={() => setAgree(!agree)} P={P} />
        <p style={{ color: P.mute, fontSize: 13, fontFamily: "'Outfit',sans-serif", lineHeight: 1.5 }}>
          I agree to be contacted about new drops in my genres.
        </p>
      </div>
      <Acts onNext={n} P={P} label="Create account" noSkip />
    </div>
  );
}
