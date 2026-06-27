'use client';

import { useEffect, useRef } from 'react';

/**
 * Logged-out /read page: a standalone reader-profile screen (The Wandering Owl).
 * Ported faithfully from the design mockup and kept fully self-contained — its
 * own top bar + section sidenav, no surrounding app navigation. All CSS is
 * scoped under `.rp-root` so the mockup's generic class names (.nav, .section,
 * .tag, …) can't collide with the app's global stylesheet, and the small bits
 * of interactivity (dropdowns, section scroll-spy, sidenav search) run as a
 * scoped effect instead of inline scripts.
 */

const CSS = `
.rp-root{font-family:Georgia,'Times New Roman',serif;background:#faf8f4;color:#1a1a1a;min-height:100vh}
.rp-root *,.rp-root *::before,.rp-root *::after{box-sizing:border-box;margin:0;padding:0}

.rp-root nav{display:flex;align-items:center;padding:0 40px;height:58px;border-bottom:1px solid #e8e4dc;background:#fff;position:sticky;top:0;z-index:50;gap:0}
.rp-root .brand{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:17px;font-weight:700;color:#1a1a1a;text-decoration:none;flex-shrink:0;margin-right:80px;letter-spacing:-0.2px}
.rp-root .brand-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#1a1a1a;margin:0 5px;vertical-align:3px}
.rp-root .nav-links{display:flex;align-items:center;flex:1;gap:0}
.rp-root .nav-link{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13.5px;color:#444;text-decoration:none;padding:6px 11px;border-radius:6px;transition:background 0.15s,color 0.15s;white-space:nowrap}
.rp-root .nav-link:hover{background:#f5f0e8;color:#1a1a1a}
.rp-root .nav-link.active{color:#1a1a1a;font-weight:500}
.rp-root .nav-right{display:flex;align-items:center;gap:8px;flex-shrink:0;margin-left:24px}

.rp-root .bell-wrap{position:relative}
.rp-root .bell-btn{width:32px;height:32px;border-radius:50%;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#888;transition:background 0.15s;position:relative}
.rp-root .bell-btn:hover{background:#f5f0e8;color:#1a1a1a}
.rp-root .bell-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.rp-root .bell-badge{position:absolute;top:2px;right:2px;width:8px;height:8px;border-radius:50%;background:#c0392b;border:1.5px solid #fff}
.rp-root .notif-dd{position:absolute;top:calc(100% + 10px);right:0;background:#fff;border:0.5px solid #e0dbd0;border-radius:12px;padding:6px;width:300px;box-shadow:0 4px 20px rgba(0,0,0,0.08);display:none;z-index:200}
.rp-root .notif-dd.open{display:block}
.rp-root .notif-hd{padding:8px 12px;border-bottom:0.5px solid #f0ece4;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between}
.rp-root .notif-hd-title{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:700;color:#1a1a1a;letter-spacing:0.04em;text-transform:uppercase}
.rp-root .notif-clear{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;background:none;border:none;cursor:pointer}
.rp-root .notif-clear:hover{color:#555}
.rp-root .notif-item{display:flex;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;transition:background 0.15s;align-items:flex-start}
.rp-root .notif-item:hover{background:#f5f3ef}
.rp-root .notif-item.unread{background:#faf8f4}
.rp-root .notif-dot{width:6px;height:6px;border-radius:50%;background:#1D9E75;flex-shrink:0;margin-top:5px}
.rp-root .notif-dot.read{background:transparent}
.rp-root .notif-text{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#1a1a1a;line-height:1.5}
.rp-root .notif-time{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;color:#bbb;margin-top:2px}

.rp-root .avatar-wrap{position:relative}
.rp-root .avatar-btn{width:32px;height:32px;border-radius:50%;background:#1a1a1a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;flex-shrink:0}
.rp-root .dd{position:absolute;top:calc(100% + 10px);right:0;background:#fff;border:0.5px solid #e0dbd0;border-radius:12px;padding:6px;min-width:210px;box-shadow:0 4px 20px rgba(0,0,0,0.08);display:none;z-index:200}
.rp-root .dd.open{display:block}
.rp-root .dd-hd{padding:10px 12px 8px;border-bottom:0.5px solid #f0ece4;margin-bottom:4px}
.rp-root .dd-name{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:600;color:#1a1a1a}
.rp-root .dd-handle{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;margin-top:1px}
.rp-root .dd-item{display:block;width:100%;text-align:left;padding:8px 12px;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#444;background:none;border:none;cursor:pointer;transition:background 0.15s;text-decoration:none}
.rp-root .dd-item:hover{background:#f5f3ef;color:#1a1a1a}
.rp-root .dd-quiet{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#444}
.rp-root .dd-danger{color:#c0392b}
.rp-root .dd-danger:hover{background:#fef0f0 !important}
.rp-root .dd-div{height:0.5px;background:#f0ece4;margin:4px 0}

.rp-root .tog{position:relative;width:36px;height:20px;flex-shrink:0}
.rp-root .tog input{opacity:0;width:0;height:0}
.rp-root .tog-slider{position:absolute;inset:0;background:#ddd;border-radius:20px;cursor:pointer;transition:background 0.2s}
.rp-root .tog-slider:before{content:'';position:absolute;width:14px;height:14px;left:3px;top:3px;background:#fff;border-radius:50%;transition:transform 0.2s}
.rp-root .tog input:checked+.tog-slider{background:#1a1a1a}
.rp-root .tog input:checked+.tog-slider:before{transform:translateX(16px)}

.rp-root .layout{display:grid;grid-template-columns:200px 1fr;max-width:980px;margin:0 auto;padding:2rem 1.5rem 4rem;align-items:start}
.rp-root .sidenav{position:sticky;top:72px;padding-right:1.5rem}
.rp-root .sidenav-search{width:100%;padding:6px 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;border:0.5px solid #e0dbd0;border-radius:8px;background:#fff;color:#1a1a1a;outline:none;margin-bottom:1rem}
.rp-root .sidenav-search::placeholder{color:#bbb}
.rp-root .sidenav-search:focus{border-color:#aaa}
.rp-root .snav-list{list-style:none}
.rp-root .snav-item{margin-bottom:2px}
.rp-root .snav-btn{display:flex;align-items:center;justify-content:space-between;padding:6px 10px;border-radius:7px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#888;cursor:pointer;transition:background 0.15s,color 0.15s;border:none;background:none;width:100%;text-align:left}
.rp-root .snav-btn:hover{background:#f0ece4;color:#1a1a1a}
.rp-root .snav-btn.active{background:#f0ece4;color:#1a1a1a;font-weight:500}
.rp-root .snav-edit{font-size:10px;color:#ccc;opacity:0;transition:opacity 0.15s}
.rp-root .snav-btn:hover .snav-edit{opacity:1}
.rp-root .snav-group{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#ccc;padding:6px 10px 2px}
.rp-root .snav-div{height:0.5px;background:#e8e4dc;margin:8px 10px}

.rp-root .main{min-width:0}
.rp-root .hero{background:#fff;border-radius:20px;border:0.5px solid #e8e4dc;padding:2rem 2.5rem;margin-bottom:1.25rem;scroll-margin-top:80px}
.rp-root .section{background:#fff;border-radius:16px;border:0.5px solid #e8e4dc;padding:1.75rem 2rem 1.5rem;margin-bottom:1.25rem;scroll-margin-top:80px}
.rp-root .sec-head{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#aaa;margin-bottom:1.25rem;padding-bottom:0.75rem;border-bottom:0.5px solid #f0ece4;display:flex;align-items:center}
.rp-root .sec-title{flex:1}
.rp-root .edit-btn{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;padding:4px 12px;border-radius:6px;border:0.5px solid #ddd;background:#fff;color:#aaa;cursor:pointer}
.rp-root .edit-btn:hover{background:#f5f3ef;color:#555}

.rp-root .hero-top{display:flex;gap:1.75rem;align-items:flex-start;margin-bottom:1.5rem}
.rp-root .av{width:88px;height:88px;border-radius:50%;border:3px solid #e8e4dc;background:#f0ece4;display:flex;align-items:center;justify-content:center;font-size:38px;position:relative;flex-shrink:0}
.rp-root .av-edit{position:absolute;bottom:0;right:0;width:24px;height:24px;border-radius:50%;background:#1a1a1a;color:#fff;border:2px solid #fff;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.rp-root .display-name{font-size:22px;font-weight:400;color:#1a1a1a;margin-bottom:5px}
.rp-root .badge-row{display:flex;gap:7px;align-items:center;margin-bottom:0.6rem;flex-wrap:wrap}
.rp-root .badge{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;padding:3px 10px;border-radius:20px}
.rp-root .bio{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#888;line-height:1.6}
.rp-root .hq{border-top:0.5px solid #f0ece4;padding-top:1.25rem}
.rp-root .hq-lbl{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;color:#bbb;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px}
.rp-root .hq-text{font-size:16px;line-height:1.7;color:#1a1a1a;font-style:italic}
.rp-root .hq-attr{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;margin-top:4px}

.rp-root .field{margin-bottom:1rem}
.rp-root .field:last-child{margin-bottom:0}
.rp-root .fl{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;color:#bbb;letter-spacing:0.06em;margin-bottom:5px;text-transform:uppercase}
.rp-root .fv{font-size:15px;color:#1a1a1a;line-height:1.6}
.rp-root .two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
.rp-root .tag{display:inline-block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;padding:4px 10px;border-radius:20px;background:#f5f3ef;color:#555;margin:3px 3px 0 0;border:0.5px solid #e0dbd0}
.rp-root .tag a{color:#555;text-decoration:none}
.rp-root .bl{list-style:none}
.rp-root .bl li{font-size:14px;padding:7px 0;border-bottom:0.5px solid #f0ece4;display:flex;align-items:baseline;gap:8px;line-height:1.5}
.rp-root .bl li:last-child{border-bottom:none}
.rp-root .bn{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;color:#ccc;flex-shrink:0;width:14px}
.rp-root .bt a{color:#1a1a1a;text-decoration:none;border-bottom:1px solid #e0dbd0}
.rp-root .ba{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;margin-left:4px}
.rp-root .mem-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.rp-root .mem-card{border-radius:12px;padding:1.25rem}
.rp-root .my-line{background:#fff8ee;border:0.5px solid #f5dca8;border-radius:12px;padding:1.5rem;margin-top:1.25rem}
.rp-root .my-line-lbl{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;color:#c8960a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px}
.rp-root .my-line p{font-size:16px;line-height:1.75;color:#1a1a1a;font-style:italic}
.rp-root .my-line .attr{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;margin-top:6px}
.rp-root .got-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:12px}
.rp-root .got-card{border-radius:14px;padding:1.25rem 1.5rem;border:0.5px solid}
.rp-root .got-card.tall{grid-row:span 2}
.rp-root .gac-lbl{font-family:Georgia,serif;font-size:13px;font-style:italic;color:#888;margin-bottom:0.5rem}
.rp-root .gac-val{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;font-weight:500;color:#1a1a1a;margin:0.5rem 0 2px}
.rp-root .gac-val a{color:#1a1a1a;text-decoration:none;border-bottom:1px solid rgba(0,0,0,0.1)}
.rp-root .gac-src{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;margin-bottom:6px}
.rp-root .gac-sub{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#888;line-height:1.5;font-style:italic}
.rp-root .haiku{background:#f0faf4;border-radius:12px;padding:1.5rem;border:0.5px solid #b8e8cc;text-align:center}
.rp-root .haiku p{font-size:16px;line-height:2.1;color:#1a4a2a;font-style:italic}
.rp-root .haiku .attr{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#4caf70;margin-top:0.5rem}
.rp-root .meet-card{background:#fef0f5;border-radius:12px;padding:1.25rem 1.5rem;border:0.5px solid #f5c8da}
.rp-root .meet-lbl{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;color:#e8789a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px}
.rp-root .meet-val{font-size:15px;color:#1a1a1a;line-height:1.7}
.rp-root .emo-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.rp-root .emo-card{border-radius:12px;padding:1.25rem;border:0.5px solid #e8e4dc}
.rp-root .emo-icon{font-size:22px;margin-bottom:6px}
.rp-root .emo-lbl{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px}
.rp-root .emo-val{font-size:14px;color:#1a1a1a}
.rp-root .emo-val a{color:#1a1a1a;text-decoration:none;border-bottom:1px solid #e0dbd0}
.rp-root .emo-author{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;margin-top:2px}
.rp-root .club-list{list-style:none}
.rp-root .club-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:0.5px solid #f0ece4}
.rp-root .club-item:last-child{border-bottom:none}
.rp-root .ci{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.rp-root .cn a{color:#1a1a1a;text-decoration:none;border-bottom:1px solid #e0dbd0;font-size:14px}
.rp-root .cm{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;margin-top:2px}
.rp-root .pod-card{background:#f5f3ef;border-radius:12px;padding:1rem 1.25rem;border:0.5px solid #e0dbd0;margin-bottom:0.75rem}
.rp-root .pod-hd{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.rp-root .pod-name{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:600;color:#1a1a1a}
.rp-root .pod-type{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:600;text-transform:uppercase;padding:2px 8px;border-radius:10px;margin-left:auto;background:#e1f5ee;color:#085041}
.rp-root .pod-desc{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#888;line-height:1.5}
.rp-root .pod-mbr{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;margin-top:5px}
.rp-root .credits{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-radius:16px;border:0.5px solid #e8e4dc;overflow:hidden;margin-bottom:1.25rem}
.rp-root .credit{padding:1rem;text-align:center;border-right:0.5px solid #f0ece4}
.rp-root .credit:last-child{border-right:none}
.rp-root .credit-icon{font-size:14px;margin-bottom:2px}
.rp-root .credit-num{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:20px;font-weight:600;color:#1a1a1a}
.rp-root .credit-label{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:9px;color:#bbb;letter-spacing:0.04em;text-transform:uppercase;margin-top:2px}
.rp-root .li-list{list-style:none}
.rp-root .li-item{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:0.5px solid #f0ece4}
.rp-root .li-item:last-child{border-bottom:none}
.rp-root .li-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;background:#f5f3ef;border:0.5px solid #e0dbd0}
.rp-root .li-lbl{font-size:13px;color:#1a1a1a}
.rp-root .li-lbl a{color:#1a1a1a;text-decoration:none;border-bottom:1px solid #e0dbd0}
.rp-root .li-sub{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa;margin-top:1px}

@media (max-width:760px){
  .rp-root nav{padding:0 18px}
  .rp-root .brand{margin-right:24px}
  .rp-root .nav-links{display:none}
  .rp-root .layout{grid-template-columns:1fr;padding:1.25rem 1rem 3rem}
  .rp-root .sidenav{display:none}
}
`;

const MARKUP = `
<nav>
  <a class="brand" href="#">between<span class="brand-dot"></span>reads</a>
  <div class="nav-links" aria-hidden="true"></div>
  <div class="nav-right">
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#888;display:flex;align-items:center;gap:4px;flex-shrink:0">
      <span style="font-weight:600;color:#1a1a1a">42</span>
      <span style="font-size:11px;font-weight:600;color:#1D9E75;letter-spacing:0.04em">RC</span>
    </div>
    <div class="bell-wrap" data-bell-wrap>
      <button class="bell-btn" data-bell-btn>
        <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span class="bell-badge" data-bell-badge></span>
      </button>
      <div class="notif-dd" data-notif-dd>
        <div class="notif-hd">
          <span class="notif-hd-title">Notifications</span>
          <button class="notif-clear" data-clear-btn>Mark all read</button>
        </div>
        <div class="notif-item unread">
          <div class="notif-dot"></div>
          <div><div class="notif-text"><strong>@MidnightDraftsman</strong> added a new chapter to The Quiet Hours</div><div class="notif-time">2 hours ago</div></div>
        </div>
        <div class="notif-item unread">
          <div class="notif-dot"></div>
          <div><div class="notif-text"><strong>@InkAndWander</strong> invited you to beta read Three Tuesdays in November</div><div class="notif-time">Yesterday</div></div>
        </div>
        <div class="notif-item unread">
          <div class="notif-dot"></div>
          <div><div class="notif-text">A new issue of <strong>BetweenLines</strong> is out</div><div class="notif-time">2 days ago</div></div>
        </div>
        <div class="notif-item">
          <div class="notif-dot read"></div>
          <div><div class="notif-text"><strong>The Literary Fiction Society</strong> has a new discussion</div><div class="notif-time">3 days ago</div></div>
        </div>
      </div>
    </div>
    <div class="avatar-wrap">
      <button class="avatar-btn" data-avatar-btn>WO</button>
      <div class="dd" data-dd>
        <div class="dd-hd">
          <div class="dd-name">The Wandering Owl</div>
          <div class="dd-handle">@thewanderingowl</div>
        </div>
        <a class="dd-item" href="#">My Profile</a>
        <div class="dd-div"></div>
        <a class="dd-item" href="#">Account Settings</a>
        <a class="dd-item" href="#">Payments &amp; Billing</a>
        <a class="dd-item" href="#">Membership</a>
        <div class="dd-div"></div>
        <a class="dd-item" href="#">Reading History</a>
        <a class="dd-item" href="#">Want to Read</a>
        <div class="dd-div"></div>
        <div class="dd-quiet">
          <span>Quiet Mode</span>
          <label class="tog"><input type="checkbox" data-quiet-toggle><span class="tog-slider"></span></label>
        </div>
        <div class="dd-div"></div>
        <a class="dd-item" href="#">Support Us</a>
        <a class="dd-item" href="#">Help</a>
        <div class="dd-div"></div>
        <button class="dd-item dd-danger">Sign Out</button>
      </div>
    </div>
  </div>
</nav>

<div class="layout">
  <aside class="sidenav">
    <input class="sidenav-search" type="text" placeholder="Search sections..." data-nav-search>
    <ul class="snav-list">
      <li class="snav-group">Your Literary World</li>
      <li class="snav-item"><button class="snav-btn active" data-target="hero">Profile <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="memorables">The Memorables <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="gotaway">Ones That Got Away <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="undone">Books That Undid Me <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="sitwith">Sit With Anyone <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="howIread">How I Read <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="authors">Favourite Authors <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="genre">Genre Passions <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="library">My Library <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="books">Books Read <span class="snav-edit">Edit</span></button></li>
      <li class="snav-item"><button class="snav-btn" data-target="adaptations">Adaptations <span class="snav-edit">Edit</span></button></li>
      <li class="snav-div"></li>
      <li class="snav-item"><button class="snav-btn" data-target="links">Find Me Elsewhere <span class="snav-edit">Edit</span></button></li>
    </ul>
  </aside>

  <main class="main">

    <div class="hero" id="hero">
      <div class="hero-top">
        <div class="av">🦉<div class="av-edit">✎</div></div>
        <div>
          <div class="display-name">The Wandering Owl</div>
          <div class="badge-row">
            <span class="badge" style="background:#e1f5ee;color:#085041">Reader</span>
            <span class="badge" style="background:#eeedfe;color:#3c3489">Beta Reader</span>
            <span class="badge" style="background:#f5f3ef;color:#888">Member since 2024</span>
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
        <div class="mem-card" style="background:#fef0f5;border:0.5px solid #f5c8da"><div style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#e8789a;margin-bottom:0.75rem">Character</div><div style="font-size:14px;color:#1a1a1a;margin-bottom:3px"><a href="#" style="color:#1a1a1a;text-decoration:none;border-bottom:1px solid #f5c8da">Elizabeth Bennet</a></div><div style="font-family:-apple-system,sans-serif;font-size:11px;color:#aaa;margin-bottom:0.75rem">Pride and Prejudice</div><div style="font-family:-apple-system,sans-serif;font-size:11px;color:#888;line-height:1.5;font-style:italic">Because I'd rather say the wrong thing than nothing at all.</div></div>
        <div class="mem-card" style="background:#f5f0fe;border:0.5px solid #d9ccf7"><div style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9575cd;margin-bottom:0.75rem">Quote</div><div style="font-size:13px;color:#2a1a5a;line-height:1.6;font-style:italic;margin-bottom:0.5rem">"It's no use going back to yesterday, because I was a different person then."</div><div style="font-family:-apple-system,sans-serif;font-size:11px;color:#9575cd">— Alice, Alice in Wonderland</div></div>
        <div class="mem-card" style="background:#f0faf4;border:0.5px solid #b8e8cc"><div style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#3a8c4a;margin-bottom:0.75rem">Writer</div><div style="font-size:14px;color:#1a1a1a;margin-bottom:3px"><a href="#" style="color:#1a1a1a;text-decoration:none;border-bottom:1px solid #b8e8cc">Sylvia Plath</a></div><div style="font-family:-apple-system,sans-serif;font-size:11px;color:#aaa;margin-bottom:0.75rem">Journals, The Bell Jar</div><div style="font-family:-apple-system,sans-serif;font-size:11px;color:#888;line-height:1.5;font-style:italic">"There is a voice within me that will not be still."</div></div>
      </div>
      <div class="field" style="margin-top:1.25rem"><div class="fl">Other characters I love</div><div><span class="tag"><a href="#">Atticus Finch</a></span><span class="tag"><a href="#">Jay Gatsby</a></span><span class="tag"><a href="#">Dorothea Brooke</a></span><span class="tag"><a href="#">Holden Caulfield</a></span><span class="tag"><a href="#">Hermione Granger</a></span></div></div>
      <div class="my-line"><div class="my-line-lbl">The line that was written for me</div><p>"I am not afraid of storms, for I am learning how to sail my ship."</p><div class="attr">— Jo March, Little Women</div></div>
    </div>

    <div class="section" id="gotaway">
      <div class="sec-head"><span class="sec-title">The Ones That Got Away</span><button class="edit-btn">Edit</button></div>
      <div class="got-grid">
        <div class="got-card tall" style="background:#e8f5e9;border-color:#b8e8cc"><div class="gac-lbl" style="color:#3a8c4a">If I could time-travel I'd enter the world of...</div><div class="gac-val"><a href="#">Alice in Wonderland</a></div><div class="gac-src">Lewis Carroll</div><div class="gac-sub">Somewhere between the rabbit hole and the tea party, I think I'd feel perfectly at home.</div><div style="font-family:-apple-system,sans-serif;font-size:11px;color:#4caf70;margin-top:1rem">17 other readers would also enter Wonderland</div></div>
        <div class="got-card" style="background:#fff8ee;border-color:#f5dca8"><div class="gac-lbl" style="color:#c8960a">A book I wish I had discovered sooner...</div><div class="gac-val"><a href="#">Middlemarch</a></div><div class="gac-src">George Eliot</div><div class="gac-sub">Found it at 34. Should have found it at 17.</div></div>
        <div class="got-card" style="background:#fef0f5;border-color:#f5c8da"><div class="gac-lbl" style="color:#e8789a">A character I wish I could meet...</div><div class="gac-val"><a href="#">Atticus Finch</a></div><div class="gac-src">To Kill a Mockingbird</div><div class="gac-sub">To ask if he ever lost faith. And what kept him going.</div></div>
      </div>
      <div class="got-card" style="background:#f5f0fe;border-color:#d9ccf7;margin-top:12px"><div class="gac-lbl" style="color:#9575cd">A character I wish I had written...</div><div class="gac-val"><a href="#">Dorothea Brooke</a></div><div class="gac-src">Middlemarch — George Eliot</div><div class="gac-sub">She contains everything. George Eliot was operating on a different plane entirely.</div></div>
    </div>

    <div class="section" id="undone">
      <div class="sec-head"><span class="sec-title">Books That Undid Me</span><button class="edit-btn">Edit</button></div>
      <div class="emo-grid">
        <div class="emo-card" style="background:#fff8ee;border-color:#f5dca8"><div class="emo-icon">😂</div><div class="emo-lbl">Made me laugh out loud</div><div class="emo-val"><a href="#">Good Omens</a></div><div class="emo-author">Terry Pratchett &amp; Neil Gaiman</div></div>
        <div class="emo-card" style="background:#f0f7ff;border-color:#c8e0f7"><div class="emo-icon">😭</div><div class="emo-lbl">Made me cry</div><div class="emo-val"><a href="#">A Little Life</a></div><div class="emo-author">Hanya Yanagihara</div></div>
      </div>
    </div>

    <div class="section" id="sitwith">
      <div class="sec-head"><span class="sec-title">If I Could Sit With Anyone</span><button class="edit-btn">Edit</button></div>
      <div class="field"><div class="meet-card"><div class="meet-lbl">The literary person I'd most want to meet</div><div class="meet-val">Virginia Woolf. I'd want to sit with her in a garden somewhere and ask her if she knew how much she changed everything.</div></div></div>
      <div class="field" style="margin-top:1.25rem"><div class="fl">A haiku I love</div><div class="haiku"><p>An old silent pond<br>A frog jumps into the pond<br>Splash! Silence again.</p><div class="attr">— Matsuo Bashō</div></div></div>
    </div>

    <div class="section" id="howIread">
      <div class="sec-head"><span class="sec-title">How I Read</span><button class="edit-btn">Edit</button></div>
      <div class="two-col">
        <div class="field"><div class="fl">What I most often read</div><div class="fv">Literary fiction, historical fiction</div></div>
        <div class="field"><div class="fl">How often</div><div class="fv">Every day — at least an hour</div></div>
        <div class="field"><div class="fl">My favourite device</div><div class="fv">A real book. Always.</div></div>
        <div class="field"><div class="fl">Languages</div><div class="fv">English, French, Bengali</div></div>
      </div>
      <div class="field" style="margin-top:1rem"><div class="fl">Favourite genres</div><div><span class="tag">Literary Fiction</span><span class="tag">Historical Fiction</span><span class="tag">Magical Realism</span><span class="tag">Poetry</span><span class="tag">Classic</span></div></div>
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
      <div style="background:#f0f7ff;border:0.5px solid #c8e0f7;border-radius:12px;padding:1.25rem 1.5rem">
        <div style="font-family:-apple-system,sans-serif;font-size:10px;color:#4a7ab5;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.75rem;font-weight:700">🚀 Sci-fi</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem">
          <div><div style="font-family:-apple-system,sans-serif;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px">Favourite character</div><div style="font-size:13px;color:#1a1a1a"><a href="#" style="color:#1a1a1a;text-decoration:none;border-bottom:1px solid #c8e0f7">HAL 9000</a><br><span style="font-size:11px;color:#aaa">2001: A Space Odyssey</span></div></div>
          <div><div style="font-family:-apple-system,sans-serif;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px">Favourite book</div><div style="font-size:13px;color:#1a1a1a"><a href="#" style="color:#1a1a1a;text-decoration:none;border-bottom:1px solid #c8e0f7">The Left Hand of Darkness</a><br><span style="font-size:11px;color:#aaa">Ursula K. Le Guin</span></div></div>
          <div><div style="font-family:-apple-system,sans-serif;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px">Favourite writer</div><div style="font-size:13px;color:#1a1a1a"><a href="#" style="color:#1a1a1a;text-decoration:none;border-bottom:1px solid #c8e0f7">Ursula K. Le Guin</a></div></div>
        </div>
      </div>
    </div>

    <div class="section" id="library">
      <div class="sec-head"><span class="sec-title">What You'd Find in My Library</span><button class="edit-btn">Edit</button></div>
      <div class="field"><div class="fv">Dog-eared paperbacks, too many bookmarks, at least three books on the go at once. Heavy on literary fiction and poetry. Light on anything with a spaceship — unless it's Le Guin.</div></div>
      <div class="field" style="margin-top:0.75rem"><div class="fl">What's on my TBR</div><div><span class="tag"><a href="#">James — Percival Everett</a></span><span class="tag"><a href="#">Intermezzo — Sally Rooney</a></span><span class="tag"><a href="#">Orbital — Samantha Harvey</a></span><span class="tag"><a href="#">+ 30 more</a></span></div></div>
    </div>

    <div class="section" id="books">
      <div class="sec-head"><span class="sec-title">Last Three Read &amp; All-Time Favourites</span><button class="edit-btn">Edit</button></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div><div style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#bbb;margin-bottom:0.75rem">Last three read</div><ul class="bl"><li><span class="bn">1</span><span><span class="bt"><a href="#">The Midnight Library</a></span><span class="ba">Matt Haig</span></span></li><li><span class="bn">2</span><span><span class="bt"><a href="#">Pachinko</a></span><span class="ba">Min Jin Lee</span></span></li><li><span class="bn">3</span><span><span class="bt"><a href="#">Normal People</a></span><span class="ba">Sally Rooney</span></span></li></ul></div>
        <div><div style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#bbb;margin-bottom:0.75rem">All-time favourites</div><ul class="bl"><li><span class="bn">1</span><span><span class="bt"><a href="#">To Kill a Mockingbird</a></span><span class="ba">Harper Lee</span></span></li><li><span class="bn">2</span><span><span class="bt"><a href="#">One Hundred Years of Solitude</a></span><span class="ba">García Márquez</span></span></li><li><span class="bn">3</span><span><span class="bt"><a href="#">Middlemarch</a></span><span class="ba">George Eliot</span></span></li></ul></div>
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

  </main>
</div>
`;

const SECTION_IDS = [
  'hero',
  'memorables',
  'gotaway',
  'undone',
  'sitwith',
  'howIread',
  'authors',
  'genre',
  'library',
  'books',
  'adaptations',
  'links',
];

export function ReaderProfilePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const bellWrap = root.querySelector<HTMLElement>('[data-bell-wrap]');
    const bellBtn = root.querySelector<HTMLButtonElement>('[data-bell-btn]');
    const bellBadge = root.querySelector<HTMLElement>('[data-bell-badge]');
    const notifDd = root.querySelector<HTMLElement>('[data-notif-dd]');
    const clearBtn = root.querySelector<HTMLButtonElement>('[data-clear-btn]');
    const avatarBtn = root.querySelector<HTMLButtonElement>('[data-avatar-btn]');
    const dd = root.querySelector<HTMLElement>('[data-dd]');
    const quietToggle = root.querySelector<HTMLInputElement>('[data-quiet-toggle]');
    const navSearch = root.querySelector<HTMLInputElement>('[data-nav-search]');
    const snavBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.snav-btn'));

    const onBell = (e: Event) => {
      e.stopPropagation();
      notifDd?.classList.toggle('open');
      dd?.classList.remove('open');
    };
    const onClear = (e: Event) => {
      e.stopPropagation();
      root.querySelectorAll('.notif-dot').forEach((d) => d.classList.add('read'));
      root.querySelectorAll('.notif-item').forEach((i) => i.classList.remove('unread'));
      if (bellBadge) bellBadge.style.display = 'none';
    };
    const stop = (e: Event) => e.stopPropagation();
    const onAvatar = (e: Event) => {
      e.stopPropagation();
      dd?.classList.toggle('open');
      notifDd?.classList.remove('open');
    };
    const onQuiet = function (this: HTMLInputElement) {
      if (bellWrap) bellWrap.style.display = this.checked ? 'none' : '';
    };
    const onDocClick = () => {
      dd?.classList.remove('open');
      notifDd?.classList.remove('open');
    };
    const onNavSearch = function (this: HTMLInputElement) {
      const q = this.value.toLowerCase();
      root.querySelectorAll<HTMLElement>('.snav-item').forEach((item) => {
        const btn = item.querySelector('.snav-btn');
        if (!btn) return;
        item.style.display = (btn.textContent ?? '').toLowerCase().includes(q) ? '' : 'none';
      });
      root.querySelectorAll<HTMLElement>('.snav-div').forEach((d) => {
        d.style.display = q ? 'none' : '';
      });
      root.querySelectorAll<HTMLElement>('.snav-group').forEach((g) => {
        g.style.display = q ? 'none' : '';
      });
    };
    const makeSnavHandler = (btn: HTMLButtonElement) => () => {
      const target = root.querySelector<HTMLElement>(`#${btn.getAttribute('data-target')}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      snavBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    };
    const snavHandlers = snavBtns.map((btn) => {
      const h = makeSnavHandler(btn);
      btn.addEventListener('click', h);
      return [btn, h] as const;
    });
    const onScroll = () => {
      let current = '';
      SECTION_IDS.forEach((id) => {
        const el = root.querySelector<HTMLElement>(`#${id}`);
        if (el && el.getBoundingClientRect().top < 120) current = id;
      });
      if (current) {
        snavBtns.forEach((btn) =>
          btn.classList.toggle('active', btn.getAttribute('data-target') === current),
        );
      }
    };

    bellBtn?.addEventListener('click', onBell);
    clearBtn?.addEventListener('click', onClear);
    notifDd?.addEventListener('click', stop);
    avatarBtn?.addEventListener('click', onAvatar);
    dd?.addEventListener('click', stop);
    quietToggle?.addEventListener('change', onQuiet);
    navSearch?.addEventListener('input', onNavSearch);
    document.addEventListener('click', onDocClick);
    window.addEventListener('scroll', onScroll);

    return () => {
      bellBtn?.removeEventListener('click', onBell);
      clearBtn?.removeEventListener('click', onClear);
      notifDd?.removeEventListener('click', stop);
      avatarBtn?.removeEventListener('click', onAvatar);
      dd?.removeEventListener('click', stop);
      quietToggle?.removeEventListener('change', onQuiet);
      navSearch?.removeEventListener('input', onNavSearch);
      document.removeEventListener('click', onDocClick);
      window.removeEventListener('scroll', onScroll);
      snavHandlers.forEach(([btn, h]) => btn.removeEventListener('click', h));
    };
  }, []);

  return (
    <div className="rp-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </div>
  );
}
