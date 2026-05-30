'use client';

import type { WriterLibraryWork } from '@/lib/mock-writers';

type Props = {
  works: WriterLibraryWork[];
};

function compact(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString('en-US');
}

function readsLast24h(work: WriterLibraryWork) {
  return work.activity.readsLast24h ?? Math.round(work.activity.reads * 0.03);
}

export function AnalyticsDashboard({ works }: Props) {
  const totalReaders = works.reduce((s, w) => s + w.activity.reads, 0);
  const totalLast24h = works.reduce((s, w) => s + readsLast24h(w), 0);
  const totalPicks = works.reduce((s, w) => s + w.activity.readerPicks, 0);
  const totalBeta = works.reduce((s, w) => s + w.activity.betaRequests, 0);
  const totalCoins = works.reduce((s, w) => s + w.activity.coins, 0);
  const chaptersLive = works.reduce((s, w) => s + w.publishedChapters, 0);
  const publishedWorks = works.filter((w) => w.status === 'Published').length;

  const ranked = [...works]
    .filter((w) => w.activity.reads > 0)
    .sort((a, b) => b.activity.reads - a.activity.reads);

  const maxBar = Math.max(1, ...ranked.map((w) => w.activity.reads));

  // 7-day sparkline derived from totals so the chart reacts to data —
  // a sine-ish pattern around the daily average with last 24h as the peak.
  const avgDaily = Math.max(1, Math.round(totalReaders / 30));
  const spark = [0.62, 0.78, 0.55, 0.92, 0.74, 0.84, 1].map((m) => Math.round(avgDaily * m));
  spark[spark.length - 1] = totalLast24h;
  const sparkMax = Math.max(1, ...spark);

  return (
    <div className="br-write-analytics" aria-label="Writer analytics">
      <header className="br-write-analytics-head">
        <p className="br-write-analytics-kicker">Last 30 days</p>
        <h2 className="br-write-analytics-title">Analytics</h2>
        <p className="br-write-analytics-sub">
          A snapshot of how your work is being read, picked, and supported.
        </p>
      </header>

      <div className="br-write-analytics-kpis">
        <Kpi value={compact(totalReaders)} label="readers total" trend={`+${compact(totalLast24h)} last 24h`} highlight />
        <Kpi value={compact(totalPicks)} label="reader picks" />
        <Kpi value={compact(totalBeta)} label="beta requests" />
        <Kpi value={compact(totalCoins)} label="reader coins" />
        <Kpi value={chaptersLive.toString()} label="chapters live" />
        <Kpi value={publishedWorks.toString()} label="published works" />
      </div>

      <section className="br-write-analytics-section">
        <div className="br-write-analytics-section-head">
          <h3>Readers · last 7 days</h3>
          <span className="br-write-analytics-section-sub">Daily total across all works</span>
        </div>
        <div className="br-write-analytics-spark" role="img" aria-label={`Readers last 7 days, peak ${sparkMax}`}>
          {spark.map((v, i) => {
            const h = Math.max(4, Math.round((v / sparkMax) * 100));
            const isLast = i === spark.length - 1;
            const day = i === spark.length - 1 ? 'Today' : `${spark.length - 1 - i}d ago`;
            return (
              <div key={i} className={`br-write-analytics-spark-col ${isLast ? 'is-now' : ''}`}>
                <span className="br-write-analytics-spark-val">{compact(v)}</span>
                <span className="br-write-analytics-spark-bar" style={{ height: `${h}%` }} />
                <span className="br-write-analytics-spark-day">{day}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="br-write-analytics-section">
        <div className="br-write-analytics-section-head">
          <h3>By work</h3>
          <span className="br-write-analytics-section-sub">Ranked by readers</span>
        </div>
        {ranked.length === 0 ? (
          <p className="br-write-analytics-empty">No reader activity yet. Publish a chapter to start tracking.</p>
        ) : (
          <ul className="br-write-analytics-rows" role="list">
            {ranked.map((w) => {
              const reads = w.activity.reads;
              const last24 = readsLast24h(w);
              const barPct = Math.max(2, Math.round((reads / maxBar) * 100));
              return (
                <li key={w.id} className="br-write-analytics-row">
                  <div className="br-write-analytics-row-head">
                    <span className="br-write-analytics-row-title">{w.title}</span>
                    <span className="br-write-analytics-row-status">{w.status}</span>
                  </div>
                  <div className="br-write-analytics-row-bar" aria-hidden="true">
                    <span style={{ width: `${barPct}%` }} />
                  </div>
                  <div className="br-write-analytics-row-stats">
                    <span><strong>{compact(reads)}</strong> readers</span>
                    <span><strong>+{compact(last24)}</strong> last 24h</span>
                    <span><strong>{compact(w.activity.readerPicks)}</strong> picks</span>
                    <span><strong>{compact(w.activity.coins)}</strong> coins</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Kpi({ value, label, trend, highlight }: { value: string; label: string; trend?: string; highlight?: boolean }) {
  return (
    <div className={`br-write-analytics-kpi ${highlight ? 'is-highlight' : ''}`}>
      <div className="br-write-analytics-kpi-num">{value}</div>
      <div className="br-write-analytics-kpi-lbl">{label}</div>
      {trend ? <div className="br-write-analytics-kpi-trend">{trend}</div> : null}
    </div>
  );
}
