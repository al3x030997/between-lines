'use client';

import { SiteNav } from '@/components/SiteNav';

/**
 * Logged-out /read page: a standalone reader-profile screen (The Wandering Owl).
 *
 * Themed to the landing-page brand: the shared `SiteNav` provides the top
 * chrome, and all of the profile CSS below is scoped under `.rp-root` and built
 * on the global `--theme-*` tokens (Outfit for UI/body, Playfair Display for
 * display moments, the yellow / ink / paper palette + brand green). Pastel
 * accents are harmonized into a restrained 3-tint system (yellow / green /
 * paper). Layout is a single wide column — the old sidebar section menu and the
 * per-profile nav (avatar, notifications) were removed for this public view.
 */

const CSS = `
.rp-root{font-family:'Outfit',system-ui,sans-serif;background:var(--theme-page-soft);color:var(--theme-text);min-height:100vh}
.rp-root *,.rp-root *::before,.rp-root *::after{box-sizing:border-box;margin:0;padding:0}
.rp-root a{color:inherit}

.rp-page{max-width:900px;margin:0 auto;padding:clamp(32px,5vw,64px) clamp(20px,4vw,32px) 120px}

/* === Cards: shared parts + brand tint system === */
.rp-root .tint-yellow{background:var(--theme-accent-soft);border:1px solid color-mix(in srgb, var(--theme-accent-strong) 34%, transparent)}
.rp-root .tint-yellow .card-eyebrow{color:var(--theme-accent-strong)}
.rp-root .tint-green{background:#eef8f1;border:1px solid #c2e4d0}
.rp-root .tint-green .card-eyebrow{color:#0c6b4f}
.rp-root .tint-paper{background:var(--theme-paper-bg);border:1px solid var(--theme-border-subtle)}
.rp-root .tint-paper .card-eyebrow{color:var(--theme-text-muted)}

.rp-root .card-eyebrow{font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.9rem}
.rp-root .card-title{font-size:18px;color:var(--theme-text);margin-bottom:4px;line-height:1.4}
.rp-root .card-title a{color:inherit;text-decoration:none;border-bottom:1px solid var(--theme-border)}
.rp-root .card-src{font-size:14px;color:var(--theme-text-faint);margin-bottom:0.9rem}
.rp-root .card-note{font-size:15px;color:var(--theme-text-muted);line-height:1.6;font-style:italic}
.rp-root .card-quote{font-family:'Playfair Display',Georgia,serif;font-size:18px;line-height:1.55;font-style:italic;color:var(--theme-text);margin-bottom:0.6rem}
.rp-root .card-attr{font-size:14px;color:var(--theme-text-faint)}

/* === Hero === */
.rp-root .hero{background:var(--theme-page);border-radius:24px;border:1px solid var(--theme-border-subtle);padding:clamp(28px,4vw,44px);margin-bottom:2rem;box-shadow:0 1px 3px rgba(0,0,0,0.03)}
.rp-root .hero-top{display:flex;gap:2rem;align-items:flex-start;margin-bottom:2rem}
.rp-root .av{width:108px;height:108px;border-radius:50%;border:3px solid var(--theme-border-subtle);background:var(--theme-paper-bg);display:flex;align-items:center;justify-content:center;font-size:52px;flex-shrink:0}
.rp-root .display-name{font-family:'Playfair Display',Georgia,serif;font-size:clamp(30px,4.2vw,42px);font-weight:700;color:var(--theme-text);line-height:1.05;margin-bottom:14px}
.rp-root .badge-row{display:flex;gap:9px;align-items:center;margin-bottom:1rem;flex-wrap:wrap}
.rp-root .badge{font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;padding:5px 13px;border-radius:999px}
.rp-root .badge-reader{background:#e1f5ee;color:#085041}
.rp-root .badge-beta{background:var(--theme-accent-soft);color:var(--theme-accent-strong)}
.rp-root .badge-member{background:var(--theme-paper-bg);color:var(--theme-text-muted)}
.rp-root .bio{font-size:17px;color:var(--theme-text-muted);line-height:1.65;max-width:62ch}
.rp-root .hq{border-top:1px solid var(--theme-border-subtle);padding-top:1.75rem;margin-top:1.75rem}
.rp-root .hq-lbl{font-size:12px;color:var(--theme-text-faint);letter-spacing:0.08em;text-transform:uppercase;font-weight:600;margin-bottom:10px}
.rp-root .hq-text{font-family:'Playfair Display',Georgia,serif;font-size:clamp(20px,2.4vw,26px);line-height:1.5;color:var(--theme-text);font-style:italic}
.rp-root .hq-attr{font-size:14px;color:var(--theme-text-faint);margin-top:10px}

/* === Credits strip === */
.rp-root .credits{display:grid;grid-template-columns:repeat(4,1fr);background:var(--theme-page);border-radius:18px;border:1px solid var(--theme-border-subtle);overflow:hidden;margin-bottom:2rem}
.rp-root .credit{padding:1.5rem 1rem;text-align:center;border-right:1px solid var(--theme-border-subtle)}
.rp-root .credit:last-child{border-right:none}
.rp-root .credit-icon{font-size:20px;margin-bottom:6px}
.rp-root .credit-num{font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:700;color:var(--theme-text)}
.rp-root .credit-label{font-size:11px;color:var(--theme-text-faint);letter-spacing:0.05em;text-transform:uppercase;margin-top:4px}

/* === Sections === */
.rp-root .section{background:var(--theme-page);border-radius:18px;border:1px solid var(--theme-border-subtle);padding:clamp(24px,3vw,36px);margin-bottom:2.25rem}
.rp-root .section:last-child{margin-bottom:0}
.rp-root .sec-head{display:flex;align-items:center;margin-bottom:1.75rem;padding-bottom:1rem;border-bottom:1px solid var(--theme-border-subtle)}
.rp-root .sec-title{flex:1;font-family:'Playfair Display',Georgia,serif;font-size:23px;font-weight:700;color:var(--theme-text);line-height:1.2}
.rp-root .edit-btn{font-family:'Outfit',system-ui,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;padding:6px 14px;border-radius:8px;border:1px solid var(--theme-border-subtle);background:transparent;color:var(--theme-text-faint);cursor:pointer}
.rp-root .edit-btn:hover{background:var(--theme-page-soft);color:var(--theme-text-soft)}

/* === Fields / tags / lists === */
.rp-root .field{margin-bottom:1.5rem}
.rp-root .field:last-child{margin-bottom:0}
.rp-root .fl{font-size:12px;color:var(--theme-text-faint);letter-spacing:0.05em;text-transform:uppercase;font-weight:600;margin-bottom:8px}
.rp-root .fv{font-size:17px;color:var(--theme-text);line-height:1.6}
.rp-root .two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.75rem}
.rp-root .tag{display:inline-block;font-size:14px;padding:6px 14px;border-radius:999px;background:var(--theme-paper-bg);color:var(--theme-text-soft);margin:5px 5px 0 0;border:1px solid var(--theme-border-subtle)}
.rp-root .tag a{color:inherit;text-decoration:none}
.rp-root .tag:hover{border-color:var(--theme-border)}

/* === Memorables === */
.rp-root .mem-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.rp-root .mem-card{border-radius:14px;padding:1.5rem}
.rp-root .my-line{border-radius:14px;padding:1.75rem;margin-top:1.5rem}
.rp-root .my-line p{font-family:'Playfair Display',Georgia,serif;font-size:20px;line-height:1.6;color:var(--theme-text);font-style:italic;margin-bottom:8px}

/* === Ones that got away === */
.rp-root .got-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:1rem}
.rp-root .got-card{border-radius:14px;padding:1.5rem 1.75rem}
.rp-root .got-card.tall{grid-row:span 2}
.rp-root .got-extra{font-size:14px;color:#1D9E75;margin-top:1rem;font-weight:600}

/* === Books that undid me === */
.rp-root .emo-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
.rp-root .emo-card{border-radius:14px;padding:1.5rem}
.rp-root .emo-icon{font-size:26px;margin-bottom:8px}

/* === Sit with anyone === */
.rp-root .meet-card{border-radius:14px;padding:1.5rem 1.75rem}
.rp-root .meet-val{font-size:17px;color:var(--theme-text);line-height:1.7}
.rp-root .haiku{border-radius:14px;padding:1.75rem;text-align:center}
.rp-root .haiku p{font-family:'Playfair Display',Georgia,serif;font-size:19px;line-height:1.95;color:#13392a;font-style:italic}
.rp-root .haiku .card-attr{margin-top:0.75rem;color:#1D9E75}

/* === Genre passions === */
.rp-root .genre-block{border-radius:14px;padding:1.5rem 1.75rem}
.rp-root .genre-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem}
.rp-root .fv-sm{font-size:15px;color:var(--theme-text)}
.rp-root .fv-sm a{color:var(--theme-text);text-decoration:none;border-bottom:1px solid var(--theme-border)}
.rp-root .fv-sm .muted{display:block;font-size:13px;color:var(--theme-text-faint);margin-top:3px}

/* === Books read === */
.rp-root .books-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.75rem}
.rp-root .col-label{font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--theme-text-faint);margin-bottom:1rem}
.rp-root .bl{list-style:none}
.rp-root .bl li{font-size:16px;padding:9px 0;border-bottom:1px solid var(--theme-border-subtle);display:flex;align-items:baseline;gap:10px;line-height:1.5}
.rp-root .bl li:last-child{border-bottom:none}
.rp-root .bn{font-size:13px;color:var(--theme-text-faint);flex-shrink:0;width:16px}
.rp-root .bt a{color:var(--theme-text);text-decoration:none;border-bottom:1px solid var(--theme-border)}
.rp-root .ba{font-size:14px;color:var(--theme-text-faint);margin-left:6px}

/* === Find me elsewhere === */
.rp-root .li-list{list-style:none}
.rp-root .li-item{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--theme-border-subtle)}
.rp-root .li-item:last-child{border-bottom:none}
.rp-root .li-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;background:var(--theme-paper-bg);border:1px solid var(--theme-border-subtle)}
.rp-root .li-lbl{font-size:16px;color:var(--theme-text)}
.rp-root .li-lbl a{color:var(--theme-text);text-decoration:none;border-bottom:1px solid var(--theme-border)}
.rp-root .li-sub{font-size:13px;color:var(--theme-text-faint);margin-top:2px}

@media (max-width:760px){
  .rp-page{padding:24px 16px 80px}
  .rp-root .hero-top{flex-direction:column;gap:1.25rem}
  .rp-root .mem-grid,.rp-root .got-grid,.rp-root .emo-grid,.rp-root .two-col,.rp-root .genre-grid,.rp-root .books-grid{grid-template-columns:1fr}
  .rp-root .got-card.tall{grid-row:auto}
  .rp-root .credits{grid-template-columns:1fr 1fr}
  .rp-root .credit:nth-child(1),.rp-root .credit:nth-child(2){border-bottom:1px solid var(--theme-border-subtle)}
  .rp-root .credit:nth-child(2){border-right:none}
}
`;

const MARKUP = `
<div class="hero" id="hero">
  <div class="hero-top">
    <div class="av">🦉</div>
    <div>
      <div class="display-name">The Wandering Owl</div>
      <div class="badge-row">
        <span class="badge badge-reader">Reader</span>
        <span class="badge badge-beta">Beta Reader</span>
        <span class="badge badge-member">Member since 2024</span>
      </div>
      <div class="bio">Lost between books and loving every minute of it. Reads mostly at night, always with tea. Cries at the last chapter. Every time.</div>
    </div>
  </div>
  <div class="hq">
    <div class="hq-lbl">The line that was written for me</div>
    <div class="hq-text">"I am not afraid of storms, for I am learning how to sail my ship."</div>
    <div class="hq-attr">— Jo March, Little Women (Louisa May Alcott)</div>
  </div>
</div>

<div class="credits">
  <div class="credit"><div class="credit-icon">📚</div><div class="credit-num">127</div><div class="credit-label">Chapters read</div></div>
  <div class="credit"><div class="credit-icon">✍️</div><div class="credit-num">14</div><div class="credit-label">Beta reads</div></div>
  <div class="credit"><div class="credit-icon">🔥</div><div class="credit-num">23</div><div class="credit-label">Chapter streak</div></div>
  <div class="credit"><div class="credit-icon">📌</div><div class="credit-num">31</div><div class="credit-label">Want to read</div></div>
</div>

<div class="section" id="memorables">
  <div class="sec-head"><span class="sec-title">The Memorables</span><button class="edit-btn">Edit</button></div>
  <div class="mem-grid">
    <div class="mem-card tint-paper">
      <div class="card-eyebrow">Character</div>
      <div class="card-title"><a href="#">Elizabeth Bennet</a></div>
      <div class="card-src">Pride and Prejudice</div>
      <div class="card-note">Because I'd rather say the wrong thing than nothing at all.</div>
    </div>
    <div class="mem-card tint-yellow">
      <div class="card-eyebrow">Quote</div>
      <div class="card-quote">"It's no use going back to yesterday, because I was a different person then."</div>
      <div class="card-attr">— Alice, Alice in Wonderland</div>
    </div>
    <div class="mem-card tint-green">
      <div class="card-eyebrow">Writer</div>
      <div class="card-title"><a href="#">Sylvia Plath</a></div>
      <div class="card-src">Journals, The Bell Jar</div>
      <div class="card-note">"There is a voice within me that will not be still."</div>
    </div>
  </div>
  <div class="field" style="margin-top:1.5rem"><div class="fl">Other characters I love</div><div><span class="tag"><a href="#">Atticus Finch</a></span><span class="tag"><a href="#">Jay Gatsby</a></span><span class="tag"><a href="#">Dorothea Brooke</a></span><span class="tag"><a href="#">Holden Caulfield</a></span><span class="tag"><a href="#">Hermione Granger</a></span></div></div>
  <div class="my-line tint-yellow"><div class="card-eyebrow">The line that was written for me</div><p>"I am not afraid of storms, for I am learning how to sail my ship."</p><div class="card-attr">— Jo March, Little Women</div></div>
</div>

<div class="section" id="gotaway">
  <div class="sec-head"><span class="sec-title">The Ones That Got Away</span><button class="edit-btn">Edit</button></div>
  <div class="got-grid">
    <div class="got-card tall tint-green"><div class="card-eyebrow">If I could time-travel I'd enter the world of…</div><div class="card-title"><a href="#">Alice in Wonderland</a></div><div class="card-src">Lewis Carroll</div><div class="card-note">Somewhere between the rabbit hole and the tea party, I think I'd feel perfectly at home.</div><div class="got-extra">17 other readers would also enter Wonderland</div></div>
    <div class="got-card tint-yellow"><div class="card-eyebrow">A book I wish I had discovered sooner…</div><div class="card-title"><a href="#">Middlemarch</a></div><div class="card-src">George Eliot</div><div class="card-note">Found it at 34. Should have found it at 17.</div></div>
    <div class="got-card tint-paper"><div class="card-eyebrow">A character I wish I could meet…</div><div class="card-title"><a href="#">Atticus Finch</a></div><div class="card-src">To Kill a Mockingbird</div><div class="card-note">To ask if he ever lost faith. And what kept him going.</div></div>
  </div>
  <div class="got-card tint-green" style="margin-top:1rem"><div class="card-eyebrow">A character I wish I had written…</div><div class="card-title"><a href="#">Dorothea Brooke</a></div><div class="card-src">Middlemarch — George Eliot</div><div class="card-note">She contains everything. George Eliot was operating on a different plane entirely.</div></div>
</div>

<div class="section" id="undone">
  <div class="sec-head"><span class="sec-title">Books That Undid Me</span><button class="edit-btn">Edit</button></div>
  <div class="emo-grid">
    <div class="emo-card tint-yellow"><div class="emo-icon">😂</div><div class="card-eyebrow">Made me laugh out loud</div><div class="card-title"><a href="#">Good Omens</a></div><div class="card-src" style="margin-bottom:0">Terry Pratchett &amp; Neil Gaiman</div></div>
    <div class="emo-card tint-paper"><div class="emo-icon">😭</div><div class="card-eyebrow">Made me cry</div><div class="card-title"><a href="#">A Little Life</a></div><div class="card-src" style="margin-bottom:0">Hanya Yanagihara</div></div>
  </div>
</div>

<div class="section" id="sitwith">
  <div class="sec-head"><span class="sec-title">If I Could Sit With Anyone</span><button class="edit-btn">Edit</button></div>
  <div class="field"><div class="meet-card tint-paper"><div class="card-eyebrow">The literary person I'd most want to meet</div><div class="meet-val">Virginia Woolf. I'd want to sit with her in a garden somewhere and ask her if she knew how much she changed everything.</div></div></div>
  <div class="field"><div class="fl">A haiku I love</div><div class="haiku tint-green"><p>An old silent pond<br>A frog jumps into the pond<br>Splash! Silence again.</p><div class="card-attr">— Matsuo Bashō</div></div></div>
</div>

<div class="section" id="howIread">
  <div class="sec-head"><span class="sec-title">How I Read</span><button class="edit-btn">Edit</button></div>
  <div class="two-col">
    <div class="field"><div class="fl">What I most often read</div><div class="fv">Literary fiction, historical fiction</div></div>
    <div class="field"><div class="fl">How often</div><div class="fv">Every day — at least an hour</div></div>
    <div class="field"><div class="fl">My favourite device</div><div class="fv">A real book. Always.</div></div>
    <div class="field"><div class="fl">Languages</div><div class="fv">English, French, Bengali</div></div>
  </div>
  <div class="field"><div class="fl">Favourite genres</div><div><span class="tag">Literary Fiction</span><span class="tag">Historical Fiction</span><span class="tag">Magical Realism</span><span class="tag">Poetry</span><span class="tag">Classic</span></div></div>
</div>

<div class="section" id="authors">
  <div class="sec-head"><span class="sec-title">My Favourite Authors</span><button class="edit-btn">Edit</button></div>
  <div class="two-col">
    <div class="field"><div class="fl">Recently reading</div><div><span class="tag"><a href="#">Matt Haig</a></span><span class="tag"><a href="#">Min Jin Lee</a></span><span class="tag"><a href="#">Sally Rooney</a></span></div></div>
    <div class="field"><div class="fl">All-time favourites</div><div><span class="tag"><a href="#">George Eliot</a></span><span class="tag"><a href="#">Virginia Woolf</a></span><span class="tag"><a href="#">Harper Lee</a></span></div></div>
  </div>
</div>

<div class="section" id="genre">
  <div class="sec-head"><span class="sec-title">My Genre Passions</span><button class="edit-btn">Edit</button></div>
  <div class="genre-block tint-paper">
    <div class="card-eyebrow">🚀 Sci-fi</div>
    <div class="genre-grid">
      <div><div class="fl">Favourite character</div><div class="fv-sm"><a href="#">HAL 9000</a><span class="muted">2001: A Space Odyssey</span></div></div>
      <div><div class="fl">Favourite book</div><div class="fv-sm"><a href="#">The Left Hand of Darkness</a><span class="muted">Ursula K. Le Guin</span></div></div>
      <div><div class="fl">Favourite writer</div><div class="fv-sm"><a href="#">Ursula K. Le Guin</a></div></div>
    </div>
  </div>
</div>

<div class="section" id="library">
  <div class="sec-head"><span class="sec-title">What You'd Find in My Library</span><button class="edit-btn">Edit</button></div>
  <div class="field"><div class="fv">Dog-eared paperbacks, too many bookmarks, at least three books on the go at once. Heavy on literary fiction and poetry. Light on anything with a spaceship — unless it's Le Guin.</div></div>
  <div class="field"><div class="fl">What's on my TBR</div><div><span class="tag"><a href="#">James — Percival Everett</a></span><span class="tag"><a href="#">Intermezzo — Sally Rooney</a></span><span class="tag"><a href="#">Orbital — Samantha Harvey</a></span><span class="tag"><a href="#">+ 30 more</a></span></div></div>
</div>

<div class="section" id="books">
  <div class="sec-head"><span class="sec-title">Last Three Read &amp; All-Time Favourites</span><button class="edit-btn">Edit</button></div>
  <div class="books-grid">
    <div><div class="col-label">Last three read</div><ul class="bl"><li><span class="bn">1</span><span><span class="bt"><a href="#">The Midnight Library</a></span><span class="ba">Matt Haig</span></span></li><li><span class="bn">2</span><span><span class="bt"><a href="#">Pachinko</a></span><span class="ba">Min Jin Lee</span></span></li><li><span class="bn">3</span><span><span class="bt"><a href="#">Normal People</a></span><span class="ba">Sally Rooney</span></span></li></ul></div>
    <div><div class="col-label">All-time favourites</div><ul class="bl"><li><span class="bn">1</span><span><span class="bt"><a href="#">To Kill a Mockingbird</a></span><span class="ba">Harper Lee</span></span></li><li><span class="bn">2</span><span><span class="bt"><a href="#">One Hundred Years of Solitude</a></span><span class="ba">García Márquez</span></span></li><li><span class="bn">3</span><span><span class="bt"><a href="#">Middlemarch</a></span><span class="ba">George Eliot</span></span></li></ul></div>
  </div>
</div>

<div class="section" id="adaptations">
  <div class="sec-head"><span class="sec-title">When the Book Became a Film</span><button class="edit-btn">Edit</button></div>
  <div class="field"><div class="fl">Favourite adaptations</div><div><span class="tag">The English Patient</span><span class="tag">Atonement</span><span class="tag">Little Women (2019)</span><span class="tag">The Remains of the Day</span><span class="tag">Pride and Prejudice (2005)</span></div></div>
</div>

<div class="section" id="links">
  <div class="sec-head"><span class="sec-title">Other Places You Can Find Me</span><button class="edit-btn">Edit</button></div>
  <ul class="li-list">
    <li class="li-item"><div class="li-icon">📗</div><div><div class="li-lbl"><a href="#">My Goodreads reviews</a></div><div class="li-sub">31 reviews written</div></div></li>
    <li class="li-item"><div class="li-icon">✉️</div><div><div class="li-lbl"><a href="#">Substack — The Owl's Reading Notes</a></div><div class="li-sub">A weekly letter about what I'm reading</div></div></li>
    <li class="li-item"><div class="li-icon">🎬</div><div><div class="li-lbl"><a href="#">My Letterboxd</a></div><div class="li-sub">For when the book became a film</div></div></li>
  </ul>
</div>
`;

export function ReaderProfilePage() {
  return (
    <div className="rp-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <SiteNav activeHref="/read" />
      <div className="rp-page" dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </div>
  );
}
