'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// ─── Job Lounge Landing Page — Experience v3 ──────────────────────────────────
// Converted from job_lounge_experience_v3.html
// All animations run client-side via useEffect after mount.

export default function HomePage() {
  useEffect(() => {
    // Inject Google Fonts
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // All page JS runs after DOM is ready
    // ══ NAV SCROLL ══
window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 10));

// ══ PROGRESS + DOTS ══
const chapters = Array.from(document.querySelectorAll('.chapter'));
const dots = document.querySelectorAll('.cdot');
const pFill = document.getElementById('progress-fill');

function updateNav() {
  const scrolled = window.scrollY, total = document.body.scrollHeight - window.innerHeight;
  pFill.style.width = Math.min(100, (scrolled / total) * 100) + '%';
  let active = 0;
  chapters.forEach((ch, i) => { if (ch.getBoundingClientRect().top <= window.innerHeight * 0.45) active = i; });
  dots.forEach((d, i) => d.classList.toggle('active', i === active));
}
window.addEventListener('scroll', updateNav);
dots.forEach(dot => dot.addEventListener('click', () => document.getElementById(dot.dataset.ch).scrollIntoView({ behavior: 'smooth' })));

// ══ PARTICLE ENGINE ══
function createParticleCanvas(id, opts = {}) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const config = {
    count: opts.count || 55,
    color: opts.color || '#042C53',
    opacity: opts.opacity || 0.12,
    speed: opts.speed || 0.3,
    maxDist: opts.maxDist || 120,
    radius: opts.radius || 1.5
  };

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  function init() {
    particles = [];
    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        r: Math.random() * config.radius + 0.5
      });
    }
  }

  function hexToRGB(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return { r, g, b };
  }
  const rgb = hexToRGB(config.color);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = \`rgba(\${rgb.r},\${rgb.g},\${rgb.b},\${config.opacity * 2})\`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < config.maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = \`rgba(\${rgb.r},\${rgb.g},\${rgb.b},\${config.opacity * (1 - dist / config.maxDist)})\`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize(); init(); draw();
  window.addEventListener('resize', () => { resize(); init(); });
}

// ══ HERO — Circular Carousel with Identity Reveal (Narrated, smooth) ══
(function() {
  const cards = [
    document.getElementById('hcard-lounger'),    // 0 = Kayra (Lounger)
    document.getElementById('hcard-peer'),        // 1 = Ankit  (Peer)
    document.getElementById('hcard-recruiter'),   // 2 = Recruiter
  ];
  const narratorEl  = document.getElementById('narrator-label');
  const narratorTxt = document.getElementById('narrator-text');
  const dots = [
    document.getElementById('dot-0'),
    document.getElementById('dot-1'),
    document.getElementById('dot-2'),
  ];

  if (!cards[0] || !cards[1] || !cards[2]) return;

  const EASE = 'cubic-bezier(0.22,0.61,0.36,1)';  // smooth ease-out, no overshoot

  // ── 3 orbital positions ──
  const POS = {
    front: { tx:  0,   ty:  0,  rot:  0,  scale: 1.00, opacity: 1,    z: 3, shadow: '0 24px 64px rgba(0,0,0,0.16)' },
    right: { tx:  112, ty: 28,  rot:  8,  scale: 0.87, opacity: 0.80, z: 2, shadow: '0 8px 28px rgba(0,0,0,0.08)'  },
    left:  { tx: -86,  ty: 44,  rot: -7,  scale: 0.79, opacity: 0.52, z: 1, shadow: '0 4px 16px rgba(0,0,0,0.05)'  },
  };

  let slots = ['front', 'right', 'left'];  // slots[i] = position of card i

  function applyPos(cardEl, posKey, instant) {
    const p = POS[posKey];
    cardEl.style.transition = instant
      ? 'none'
      : \`transform 1s \${EASE}, opacity 0.8s ease, box-shadow 0.8s ease\`;
    cardEl.style.transform  = \`translateX(\${p.tx}px) translateY(\${p.ty}px) rotate(\${p.rot}deg) scale(\${p.scale})\`;
    cardEl.style.opacity    = p.opacity;
    cardEl.style.zIndex     = p.z;
    cardEl.style.boxShadow  = p.shadow;
  }

  function setStacked(instant) {
    const s = [
      { tx: 0,  ty: 0,  rot: 0, scale: 1.00, opacity: 1.00, z: 3 },
      { tx: 9,  ty: 11, rot: 4, scale: 0.96, opacity: 0.74, z: 2 },
      { tx: 17, ty: 20, rot: 7, scale: 0.93, opacity: 0.50, z: 1 },
    ];
    cards.forEach((card, i) => {
      card.style.transition = instant ? 'none' : \`transform 1s \${EASE}, opacity 0.8s ease\`;
      card.style.transform  = \`translateX(\${s[i].tx}px) translateY(\${s[i].ty}px) rotate(\${s[i].rot}deg) scale(\${s[i].scale})\`;
      card.style.opacity    = s[i].opacity;
      card.style.zIndex     = s[i].z;
    });
  }

  function fanOut() {
    cards.forEach((c, i) => applyPos(c, slots[i], false));
  }

  function revealFront() {
    const fi = slots.indexOf('front');
    if (fi !== -1) cards[fi].classList.add('is-revealed');
  }

  function unRevealAll() {
    cards.forEach(c => c.classList.remove('is-revealed'));
  }

  function updateDots() {
    const fi = slots.indexOf('front');
    dots.forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i === fi) d.classList.add('active');
      else if (slots[i] === 'right') d.classList.add('done');
    });
  }

  // Rotate positions only — does NOT touch reveal state (caller handles sequencing)
  const CYCLE = { front: 'left', right: 'front', left: 'right' };
  function rotatePositions() {
    slots = slots.map(s => CYCLE[s]);
    cards.forEach((c, i) => applyPos(c, slots[i], false));
    updateDots();
  }

  function narrate(text, isConsent) {
    narratorEl.classList.toggle('consent-moment', !!isConsent);
    narratorTxt.style.opacity = '0';
    setTimeout(() => {
      narratorTxt.innerHTML = text;
      narratorTxt.style.opacity = '1';
    }, 280);
  }

  // ── TIMELINE — paced for clarity, smooth handoffs ──
  // Each "un-reveal → wait 650ms (let flip finish) → rotate" pattern
  // prevents the card flip and position move from fighting each other.
  //
  // 0        stacked
  // 1400     fan out
  // 3200     reveal Kayra
  // 5500     narrate consent (still showing Kayra revealed)
  // 8200     un-reveal Kayra
  // 8850     rotate → Ankit now front
  // 9700     reveal Ankit
  // 12000    narrate consent
  // 14700    un-reveal Ankit
  // 15350    rotate → Recruiter now front
  // 16200    reveal Recruiter
  // 18500    narrate consent
  // 21200    un-reveal Recruiter
  // 21850    rotate → Kayra front again
  // 22600    narrate reset message
  // 23600    stack back
  // 25000    restart

  const TOTAL = 25000;

  function runTimeline() {
    slots = ['front', 'right', 'left'];
    dots.forEach((d, i) => { d.classList.remove('active','done'); if (i === 0) d.classList.add('active'); });

    // Phase 0: stacked intro
    setStacked(false);
    narrate('3 professionals. All anonymous. All verified.');

    // Phase 1: fan out
    setTimeout(() => {
      fanOut();
      narrate('Each holds a <strong>Private ID</strong> &mdash; non-identifiable until they choose to reveal.');
    }, 1400);

    // Phase 2: reveal Kayra
    setTimeout(() => {
      revealFront();
      narrate('Kayra is a Senior IT Auditor in BFSI. You see her role &mdash; not her name. Not yet.');
    }, 3200);

    setTimeout(() => {
      narrate("<strong>Both consented.</strong> Identity revealed simultaneously. That's the ceremony.", true);
    }, 5500);

    // Phase 3: un-reveal Kayra, THEN rotate (sequenced, not simultaneous)
    setTimeout(() => unRevealAll(), 8200);
    setTimeout(() => {
      rotatePositions();
      narrate('Ankit has an open seat. He posted a flash brief &mdash; 220 characters. No JD.');
    }, 8850);

    // Phase 4: reveal Ankit
    setTimeout(() => {
      revealFront();
      narrate('Ankit is a Risk Head at Kotak. You see his name &mdash; because <strong>he chose to be seen</strong>.', true);
    }, 9700);

    setTimeout(() => {
      narrate('<strong>Mutual consent.</strong> Neither side went first.', true);
    }, 12000);

    // Phase 5: un-reveal Ankit, THEN rotate
    setTimeout(() => unRevealAll(), 14700);
    setTimeout(() => {
      rotatePositions();
      narrate('A founder-verified Recruiter has an active mandate. Passive talent. No other platform has them.');
    }, 15350);

    // Phase 6: reveal Recruiter
    setTimeout(() => {
      revealFront();
      narrate('The Recruiter sees <strong>2 matched profiles</strong>. Not 200. The right conversation starts here.', true);
    }, 16200);

    setTimeout(() => {
      narrate('Precision over volume. That\\u2019s the difference.', true);
    }, 18500);

    // Phase 7: un-reveal, rotate back to Kayra
    setTimeout(() => unRevealAll(), 21200);
    setTimeout(() => {
      rotatePositions();
      narrate('3 professionals. All anonymous. All verified.');
    }, 21850);

    // Phase 8: stack back, then loop
    setTimeout(() => setStacked(false), 23600);
    setTimeout(runTimeline, TOTAL);
  }

  // Init — instant stacked state, then begin after a short pause
  setStacked(true);
  setTimeout(() => cards.forEach(c => { c.style.transition = ''; }), 50);
  setTimeout(runTimeline, 900);
})();

// ══ CH2 particles ══
createParticleCanvas('ch2-canvas', { count: 60, color: '#378ADD', opacity: 0.15, speed: 0.3, maxDist: 130 });
// ══ CTA particles ══
// CH9 removed — particle call no longer needed

// ══ FIREWALL CANVAS ══
(function() {
  const canvas = document.getElementById('fw-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  const orbits = [
    { r: 90, speed: 0.004, nodes: [{label:'Private Banking',blocked:false},{label:'Insurance',blocked:false},{label:'Fintech',blocked:false}] },
    { r: 145, speed: -0.003, nodes: [{label:'Your Company',blocked:true},{label:'NBFC',blocked:false},{label:'GCC',blocked:false},{label:'Big 4',blocked:false}] },
  ];

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const cx = W/2, cy = H/2;
    t += 0.008;

    // Orbit rings
    orbits.forEach(orb => {
      ctx.beginPath();
      ctx.arc(cx, cy, orb.r, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(4,44,83,0.08)';
      ctx.setLineDash([4,8]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Center shield glow
    const grad = ctx.createRadialGradient(cx,cy,0, cx,cy,70);
    grad.addColorStop(0, 'rgba(4,44,83,0.06)');
    grad.addColorStop(1, 'rgba(4,44,83,0)');
    ctx.beginPath(); ctx.arc(cx,cy,70,0,Math.PI*2);
    ctx.fillStyle = grad; ctx.fill();

    // Orbiting nodes
    orbits.forEach((orb, oi) => {
      const angle = t * orb.speed * 100;
      orb.nodes.forEach((node, ni) => {
        const a = angle + (ni / orb.nodes.length) * Math.PI * 2;
        const nx = cx + Math.cos(a) * orb.r;
        const ny = cy + Math.sin(a) * orb.r;

        // Connection line
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(nx,ny);
        ctx.strokeStyle = node.blocked ? 'rgba(220,38,38,0.12)' : 'rgba(4,44,83,0.07)';
        ctx.lineWidth = 0.8; ctx.stroke();

        // Node pill
        const tw = ctx.measureText(node.label).width;
        const pw = tw + 20, ph = 26;
        const px = nx - pw/2, py = ny - ph/2;

        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 6);
        ctx.fillStyle = node.blocked ? 'rgba(254,242,242,0.95)' : 'rgba(255,255,255,0.95)';
        ctx.fill();
        ctx.strokeStyle = node.blocked ? 'rgba(220,38,38,0.3)' : 'rgba(4,44,83,0.1)';
        ctx.lineWidth = 1; ctx.stroke();

        ctx.fillStyle = node.blocked ? '#DC2626' : '#042C53';
        ctx.font = \`\${node.blocked ? '600' : '500'} 11px Inter, sans-serif\`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(node.label + (node.blocked ? ' 🚫' : ''), nx, ny);
      });
    });

    requestAnimationFrame(draw);
  }

  resize(); draw();
  window.addEventListener('resize', resize);
})();

// ══ PERSONA TABS — "Which one is yours?" ══
function activateTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const btnEl = document.querySelector(\`[data-tab="\${name}"]\`);
  const panelEl = document.getElementById('tab-' + name);
  if (btnEl) btnEl.classList.add('active');
  if (panelEl) panelEl.classList.add('active');

  if (name === 'lounger') {
    document.querySelectorAll('.mvc-fill, .mvc-thumb').forEach(el => {
      el.classList.remove('animate');
      setTimeout(() => el.classList.add('animate'), 80);
    });
  }
  if (name === 'recruiter') {
    document.querySelectorAll('.bar-fill').forEach(b => {
      b.classList.remove('in');
      setTimeout(() => b.classList.add('in'), 60);
    });
  }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  let hoverTimer;
  btn.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(() => activateTab(btn.dataset.tab), 280);
  });
  btn.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
  btn.addEventListener('click', () => {
    clearTimeout(hoverTimer);
    activateTab(btn.dataset.tab);
  });
});

// Trigger lounger MVC animation when CH3.5 enters view
const ch3bSection = document.getElementById('ch3b');
if (ch3bSection) {
  const ch3bObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.mvc-fill, .mvc-thumb').forEach(el => el.classList.add('animate'));
      ch3bObs.disconnect();
    }
  }, { threshold: 0.3 });
  ch3bObs.observe(ch3bSection);
}

// ══ SCROLL REVEALS ══
const rvObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('in'), i * 60); });
}, { threshold: 0.12 });
document.querySelectorAll('.rv, .prob-card, .who-card, .id-step, .idea-pill').forEach(el => rvObs.observe(el));

// Compare table rows
const tableObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.compare-table tbody tr').forEach((r,i) => setTimeout(() => r.classList.add('in'), 80 + i * 110));
  }
}, { threshold: 0.2 });
const tBody = document.querySelector('.compare-table tbody');
if (tBody) tableObs.observe(tBody);

// Benchmark bars
const benchObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    setTimeout(() => document.querySelectorAll('.bench-bar-fill').forEach((b,i) => setTimeout(() => b.classList.add('in'), i * 160)), 200);
  }
}, { threshold: 0.3 });
const bCard = document.querySelector('.bench-card');
if (bCard) benchObs.observe(bCard);

// Idea pills
const pillObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) document.querySelectorAll('.idea-pill').forEach((p,i) => setTimeout(() => p.classList.add('in'), i * 90));
}, { threshold: 0.3 });
const pillRow = document.querySelector('.idea-pills-row');
if (pillRow) pillObs.observe(pillRow);

// ══ IDENTITY REVEAL DEMO ══
let revealed = false;
document.getElementById('reveal-btn')?.addEventListener('click', function() {
  if (!revealed) {
    document.getElementById('reveal-a').classList.add('show');
    document.getElementById('ic-profile-a').classList.add('revealed');
    setTimeout(() => {
      document.getElementById('reveal-b').classList.add('show');
      document.getElementById('ic-profile-b').classList.add('revealed');
    }, 120);
    this.textContent = 'Reset demo ↺';
    revealed = true;
  } else {
    ['reveal-a','reveal-b'].forEach(id => document.getElementById(id).classList.remove('show'));
    ['ic-profile-a','ic-profile-b'].forEach(id => document.getElementById(id).classList.remove('revealed'));
    this.textContent = 'See what happens when both consent →';
    revealed = false;
  }
});

// ══ TYPEWRITER SEARCH ══
const query = '"CISA audit NBFC 6 years Pune"';
let typeStarted = false;
const searchObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !typeStarted) {
    typeStarted = true;
    const el = document.getElementById('s-typed');
    const label = document.getElementById('s-res-label');
    const results = document.getElementById('s-results');
    let i = 0;
    const iv = setInterval(() => {
      el.textContent = query.slice(0, ++i);
      if (i >= query.length) {
        clearInterval(iv);
        setTimeout(() => {
          label.style.opacity = '1';
          results.querySelectorAll('.s-result').forEach((r,j) => setTimeout(() => r.classList.add('in'), j * 180));
        }, 500);
      }
    }, 46);
  }
}, { threshold: 0.4 });
const sCard = document.querySelector('.search-card');
if (sCard) searchObs.observe(sCard);

    // Cleanup
    return () => {
      // Remove any intervals/observers if needed
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy: #042C53;
  --navy-m: #0D4B8C;
  --amber: #BA7517;
  --amber-w: #EF9F27;
  --purple: #534AB7;
  --blue: #378ADD;
  --red: #DC2626;
  --green: #16A34A;
  --text: #111827;
  --muted: #6B7280;
  --soft: #9CA3AF;
  --border: #E2E0DB;
  --bg: #F5F3EF;
  --white: #FFFFFF;
  --card: #ECEAE5;
}

html { scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

/* ══ NAV ══ */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 58px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 52px;
  background: rgba(245,243,239,0.95); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border); transition: box-shadow 0.3s;
}
nav.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.06); }
.logo { display: flex; align-items: center; gap: 9px; font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--navy); text-decoration: none; }
.logo-mark { width: 28px; height: 28px; background: var(--navy); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 700; letter-spacing: -0.5px; }
.nav-r { display: flex; align-items: center; gap: 14px; }
.n-login { font-size: 13px; color: var(--muted); text-decoration: none; }
.n-access { font-size: 13px; font-weight: 600; color: white; background: var(--navy); padding: 8px 18px; border-radius: 6px; text-decoration: none; transition: background 0.2s, transform 0.15s; }
.n-access:hover { background: var(--navy-m); transform: translateY(-1px); }

/* ══ PROGRESS ══ */
#progress-bar { position: fixed; top: 58px; left: 0; right: 0; z-index: 190; height: 2px; background: transparent; }
#progress-fill { height: 100%; background: linear-gradient(to right, var(--blue), var(--amber-w)); width: 0%; transition: width 0.3s ease; }

/* ══ CHAPTER DOTS ══ */
#chapter-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 190; display: flex; flex-direction: column; gap: 9px; }
.cdot { width: 7px; height: 7px; border-radius: 50%; background: rgba(4,44,83,0.12); border: 1.5px solid rgba(4,44,83,0.2); transition: all 0.3s; cursor: pointer; position: relative; }
.cdot:hover { background: var(--amber-w); border-color: var(--amber-w); }
.cdot.active { background: var(--navy); border-color: var(--navy); transform: scale(1.5); }
.cdot-tip { position: absolute; right: 18px; top: 50%; transform: translateY(-50%); background: var(--navy); color: white; font-size: 10px; font-weight: 500; padding: 4px 10px; border-radius: 4px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
.cdot:hover .cdot-tip { opacity: 1; }

/* ══ CHAPTER ══ */
.chapter { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 80px 0; }
.ch-inner { max-width: 1120px; margin: 0 auto; padding: 0 72px; width: 100%; }

/* ══ SCROLL CUE ══ */
.scroll-cue {
  position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 7px;
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--soft); cursor: pointer; animation: cue-bob 2s ease-in-out infinite;
  text-decoration: none; transition: color 0.2s;
}
.scroll-cue:hover { color: var(--navy); }
@keyframes cue-bob { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(5px)} }
.scroll-cue-line { width: 1px; height: 32px; background: linear-gradient(to bottom, var(--navy), transparent); opacity: 0.3; animation: scroll-line 1.8s ease-in-out infinite; }
@keyframes scroll-line { 0%{transform:scaleY(0);transform-origin:top;opacity:0} 50%{transform:scaleY(1);transform-origin:top;opacity:1} 100%{transform:scaleY(1);transform-origin:bottom;opacity:0} }

/* ══ REVEAL ══ */
.rv { opacity: 0; transform: translateY(22px); transition: opacity 0.7s ease, transform 0.7s ease; }
.rv.d1 { transition-delay: 0.1s; } .rv.d2 { transition-delay: 0.2s; } .rv.d3 { transition-delay: 0.3s; }
.rv.in { opacity: 1; transform: translateY(0); }

/* ══ SHARED TEXT ══ */
.ch-label { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--amber); margin-bottom: 16px; }
.ch-head { font-family: 'DM Serif Display', serif; font-size: clamp(32px,4vw,54px); line-height: 1.1; letter-spacing: -0.025em; color: var(--navy); margin-bottom: 20px; }
.ch-head em { font-style: italic; color: var(--amber); }
.ch-body { font-size: 16px; line-height: 1.85; color: #374151; }

/* ════════════════════════════════════
   CH0: HERO — canvas BG + particles
════════════════════════════════════ */
#ch0 {
  background: var(--bg);
  padding-top: 58px;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 0;
  overflow: hidden;
}

/* ── HERO LEFT ── */
.hero-left-panel {
  padding: 80px 48px 80px 72px;
  position: relative; z-index: 10;
}

.hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 28px; opacity: 0; animation: fu 0.8s ease 0.3s forwards; }
.hero-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--amber-w); box-shadow: 0 0 0 3px rgba(239,159,39,0.2); animation: pd 2s ease-in-out infinite; }
@keyframes pd { 0%,100%{box-shadow:0 0 0 3px rgba(239,159,39,0.2)} 50%{box-shadow:0 0 0 7px rgba(239,159,39,0.06)} }

.hero-h1 { font-family: 'DM Serif Display', serif; font-size: clamp(38px,4.2vw,62px); line-height: 1.06; letter-spacing: -0.03em; color: var(--navy); opacity: 0; animation: fu 0.8s ease 0.5s forwards; margin-bottom: 22px; }
.hero-h1 em { font-style: italic; color: var(--amber); }
.hero-sub { font-size: 16px; line-height: 1.78; color: #4B5563; max-width: 420px; margin-bottom: 40px; opacity: 0; animation: fu 0.8s ease 0.7s forwards; }

.hero-btns { display: flex; align-items: center; gap: 18px; opacity: 0; animation: fu 0.8s ease 0.9s forwards; margin-bottom: 44px; }
.btn-primary { font-size: 14px; font-weight: 600; color: white; background: var(--navy); padding: 14px 32px; border-radius: 9px; text-decoration: none; box-shadow: 0 6px 28px rgba(4,44,83,0.22); transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
.btn-primary:hover { background: var(--navy-m); transform: translateY(-2px); box-shadow: 0 10px 40px rgba(4,44,83,0.28); }
.btn-ghost-sm { font-size: 13px; color: var(--muted); text-decoration: none; display: flex; align-items: center; gap: 5px; transition: color 0.2s; }
.btn-ghost-sm:hover { color: var(--navy); }

.hero-trust { display: flex; gap: 22px; opacity: 0; animation: fu 0.8s ease 1.1s forwards; flex-wrap: wrap; }
.trust-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--soft); }
.trust-check { width: 16px; height: 16px; border-radius: 50%; background: rgba(4,44,83,0.07); display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: var(--navy); }

/* ── HERO RIGHT — card stack ── */
.hero-right-panel {
  position: relative;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 100vh;
  padding: 80px 40px 80px 20px;
  background: linear-gradient(135deg, rgba(4,44,83,0.02) 0%, rgba(55,138,221,0.04) 100%);
  border-left: 1px solid rgba(4,44,83,0.06);
}

/* Subtle grid pattern on right */
.hero-right-panel::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(4,44,83,0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

/* Card stack — 3 cards fanned */
.hero-card-stack {
  position: relative;
  width: 320px; height: 400px;
  margin-bottom: 24px;
}

/* All cards absolutely positioned — JS drives all transforms */
.hcard {
  position: absolute;
  top: 0; left: 0;
  width: 280px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 24px 22px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  /* JS sets transform/opacity/z-index — transition for smooth movement */
  transition: transform 0.9s cubic-bezier(0.22,0.61,0.36,1),
              opacity 0.7s ease,
              box-shadow 0.7s ease;
  will-change: transform, opacity;
}

/* Card internals */
.hcard-persona-badge { display: inline-flex; align-items: center; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 16px; }
.hcard-avatar { font-size: 32px; margin-bottom: 10px; }
.hcard-id { font-size: 18px; font-weight: 700; color: var(--navy); letter-spacing: 0.03em; margin-bottom: 4px; font-family: 'Inter', sans-serif; }
.hcard-domain { font-size: 13px; color: var(--muted); margin-bottom: 2px; }
.hcard-city { font-size: 12px; color: var(--soft); margin-bottom: 16px; }

.hcard-frosted-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.hcard-frost-block { height: 10px; width: 70%; background: var(--card); border-radius: 4px; }

.hcard-pulse-row { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 500; color: var(--blue); }
.hcard-pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--blue); animation: pd 2s ease-in-out infinite; flex-shrink: 0; }

/* Before/after flip per card */
.hcard-inner-before, .hcard-inner-after { transition: opacity 0.6s cubic-bezier(0.22,0.61,0.36,1), transform 0.6s cubic-bezier(0.22,0.61,0.36,1); }
.hcard-inner-after {
  position: absolute; inset: 24px 22px;
  opacity: 0; transform: scale(0.94);
  display: flex; flex-direction: column;
  pointer-events: none;
}
.hcard-inner-before { opacity: 1; transform: scale(1); }

.hcard.is-revealed .hcard-inner-before { opacity: 0; transform: scale(1.04); }
.hcard.is-revealed .hcard-inner-after { opacity: 1; transform: scale(1); pointer-events: all; }

/* Revealed card content */
.hcard-reveal-name { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--navy); margin-bottom: 4px; margin-top: 8px; }
.hcard-reveal-role { font-size: 13px; color: var(--muted); margin-bottom: 3px; }
.hcard-reveal-company { font-size: 13px; font-weight: 600; color: var(--navy); margin-bottom: 6px; }
.hcard-reveal-email { font-size: 12px; color: var(--blue); margin-top: 2px; }

/* Consent bar */
.hero-consent-bar { display: none; }

/* ── Narrator strip ── */
.hero-narrator {
  width: 100%; max-width: 320px;
  position: relative; z-index: 10;
  text-align: center;
  min-height: 72px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}

.narrator-label {
  font-size: 12px; line-height: 1.6; color: var(--muted);
  background: white; border: 1px solid var(--border);
  border-radius: 10px; padding: 10px 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  width: 100%;
  min-height: 42px;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.5s ease;
}

.narrator-label strong { color: var(--navy); font-weight: 600; }
.narrator-label.consent-moment { border-color: rgba(22,163,74,0.3); background: rgba(22,163,74,0.04); }
.narrator-label.consent-moment strong { color: var(--green); }

/* Step dots */
.hero-step-dots {
  display: flex; gap: 7px; align-items: center;
}
.hero-step-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--border); border: 1.5px solid var(--soft);
  transition: all 0.4s ease;
}
.hero-step-dot.active {
  background: var(--navy); border-color: var(--navy);
  transform: scale(1.35);
}
.hero-step-dot.done {
  background: rgba(22,163,74,0.5); border-color: rgba(22,163,74,0.5);
}

@keyframes fu { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

/* ════════════════════════════════════
   CH1: THE PROBLEM — animated cards
════════════════════════════════════ */
#ch1 { background: var(--white); }

/* Subtle SVG wave background */
#ch1::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23042C53' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat; pointer-events: none; z-index: 0; }

.problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 1; }
.prob-cards { display: flex; flex-direction: column; gap: 14px; }
.prob-card { background: var(--bg); border: 1px solid var(--border); border-radius: 14px; padding: 20px 22px; display: flex; gap: 16px; align-items: flex-start; transform: translateX(28px); opacity: 0; transition: transform 0.55s ease, opacity 0.55s ease, box-shadow 0.2s; cursor: default; }
.prob-card.in { transform: translateX(0); opacity: 1; }
.prob-card:nth-child(2).in { transition-delay: 0.1s; }
.prob-card:nth-child(3).in { transition-delay: 0.2s; }
.prob-card:nth-child(4).in { transition-delay: 0.3s; }
.prob-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
.prob-icon { font-size: 24px; flex-shrink: 0; margin-top: 1px; }
.prob-text { font-size: 14px; line-height: 1.65; color: var(--text); }
.prob-text strong { display: block; font-size: 14px; font-weight: 600; margin-bottom: 3px; }

/* ════════════════════════════════════
   CH2: THE IDEA — dark, particle bg
════════════════════════════════════ */
#ch2 { background: var(--navy); position: relative; }
#ch2-canvas { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

.idea-content { position: relative; z-index: 2; text-align: center; }
.idea-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.38); margin-bottom: 18px; }
.idea-head { font-family: 'DM Serif Display', serif; font-size: clamp(34px,5vw,64px); line-height: 1.08; letter-spacing: -0.025em; color: white; margin-bottom: 22px; }
.idea-head em { font-style: italic; color: var(--amber-w); }
.idea-sub { font-size: 17px; line-height: 1.8; color: rgba(255,255,255,0.52); max-width: 580px; margin: 0 auto 52px; }

/* Private ID callout */
.private-id-box { display: inline-flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 18px 28px; margin: 0 auto 52px; }
.pid-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 6px; }
.pid-value { font-size: 28px; font-weight: 700; color: white; letter-spacing: 0.04em; font-family: 'Inter', sans-serif; }
.pid-arrow { font-size: 24px; color: rgba(255,255,255,0.2); }
.pid-right { text-align: left; }
.pid-desc { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6; max-width: 220px; }

.idea-pills-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 52px; }
.idea-pill { font-size: 13px; font-weight: 500; padding: 10px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.04); opacity: 0; transform: translateY(10px); transition: opacity 0.4s, transform 0.4s, background 0.2s; cursor: default; }
.idea-pill:hover { background: rgba(255,255,255,0.1); color: white; }
.idea-pill.in { opacity: 1; transform: translateY(0); }

.idea-stats { display: flex; justify-content: center; max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
.idea-stat { flex: 1; padding: 28px 20px; text-align: center; border-right: 1px solid rgba(255,255,255,0.07); }
.idea-stat:last-child { border-right: none; }
.idea-stat-num { font-family: 'DM Serif Display', serif; font-size: 44px; color: white; line-height: 1; margin-bottom: 6px; letter-spacing: -0.02em; }
.idea-stat-label { font-size: 12px; color: rgba(255,255,255,0.35); line-height: 1.55; }

/* ════════════════════════════════════
   CH3.5: WHICH ONE IS YOURS (persona tabs)
════════════════════════════════════ */
.personas-section { background: var(--white); }

.tab-bar { display: flex; gap: 4px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 5px; width: fit-content; margin-bottom: 40px; }
.tab-btn {
  font-size: 13px; font-weight: 500; padding: 9px 24px; border-radius: 8px;
  border: none; cursor: pointer; background: transparent; color: var(--muted);
  transition: all 0.2s; position: relative;
}
.tab-btn::after {
  content: ''; position: absolute; bottom: 0; left: 50%; right: 50%;
  height: 2px; background: var(--amber-w); border-radius: 2px;
  transition: left 0.2s, right 0.2s;
}
.tab-btn:hover { color: var(--navy); background: rgba(255,255,255,0.6); }
.tab-btn.active { background: white; color: var(--navy); box-shadow: 0 2px 8px rgba(0,0,0,0.09); }

.tab-panels { position: relative; min-height: 380px; }
.tab-panel { display: none; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
.tab-panel.active { display: grid; animation: tab-in 0.4s cubic-bezier(0.22,1,0.36,1); }
@keyframes tab-in {
  from { opacity:0; transform: translateX(16px); }
  to   { opacity:1; transform: translateX(0); }
}

.tab-quote { font-size: 13px; font-style: italic; color: var(--muted); margin-bottom: 22px; padding-left: 16px; border-left: 2px solid var(--amber-w); line-height: 1.65; }
.tab-body  { font-size: 15px; line-height: 1.8; color: #374151; margin-bottom: 28px; }
.tab-features { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.tab-features li {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 14px; color: var(--text); line-height: 1.55;
  opacity: 0; transform: translateX(-8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.tab-panel.active .tab-features li { opacity: 1; transform: translateX(0); }
.tab-panel.active .tab-features li:nth-child(1) { transition-delay: 0.05s; }
.tab-panel.active .tab-features li:nth-child(2) { transition-delay: 0.12s; }
.tab-panel.active .tab-features li:nth-child(3) { transition-delay: 0.19s; }
.tab-panel.active .tab-features li:nth-child(4) { transition-delay: 0.26s; }

.tab-check { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
.tab-check.blue   { background: rgba(55,138,221,0.12); color: var(--blue); }
.tab-check.amber  { background: rgba(186,117,23,0.1);  color: var(--amber); }
.tab-check.purple { background: rgba(83,74,183,0.1);   color: var(--purple); }
.tab-cta {
  display: inline-block; margin-top: 28px;
  font-size: 14px; font-weight: 600; color: white; background: var(--navy);
  padding: 13px 28px; border-radius: 8px; text-decoration: none;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(4,44,83,0.18);
}
.tab-cta:hover { background: var(--navy-mid); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(4,44,83,0.25); }

/* ── RIGHT SIDE visual card wrapper ── */
.tab-visual {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 18px; padding: 28px;
  box-shadow: 0 4px 28px rgba(0,0,0,0.05);
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
}
.tab-panel.active .tab-visual { opacity: 1; transform: translateY(0); }

/* ── MARKET VALUE CARD — light theme ── */
.mvc {
  background: white; border: 1px solid var(--border);
  border-radius: 14px; padding: 26px 26px 20px;
  position: relative; overflow: hidden;
}
.mvc::before {
  content: ''; position: absolute; top: 0; left: 28px; right: 28px;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--amber-w), transparent);
}
.mvc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.mvc-top-left { display: flex; align-items: center; gap: 8px; }
.mvc-dot-sm { width: 7px; height: 7px; border-radius: 50%; background: var(--navy); }
.mvc-top-label { font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
.mvc-top-right { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--soft); }

.mvc-identity-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.mvc-field-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--soft); margin-bottom: 7px; }
.mvc-jlid { font-size: 28px; font-weight: 700; color: var(--navy); letter-spacing: 0.02em; line-height: 1; margin-bottom: 6px; }
.mvc-meta { font-size: 12px; color: var(--muted); }

.mvc-pulse-col { text-align: right; }
.mvc-pulse-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(186,117,23,0.09); border: 1px solid rgba(186,117,23,0.22);
  border-radius: 20px; padding: 7px 14px;
  font-size: 13px; font-weight: 700; color: var(--amber); letter-spacing: 0.05em;
  animation: badge-breathe 3s ease-in-out infinite;
}
@keyframes badge-breathe {
  0%,100% { box-shadow: 0 0 0 0 rgba(186,117,23,0); }
  50%      { box-shadow: 0 0 0 4px rgba(186,117,23,0.08); }
}
.mvc-pulse-ring {
  width: 8px; height: 8px; border-radius: 50%; background: var(--amber-w);
  box-shadow: 0 0 0 3px rgba(239,159,39,0.2);
  animation: pr 2s ease-in-out infinite;
}
@keyframes pr { 0%,100%{box-shadow:0 0 0 3px rgba(239,159,39,0.2)} 50%{box-shadow:0 0 0 6px rgba(239,159,39,0.05)} }
.mvc-trend { font-size: 11px; color: #16A34A; margin-top: 7px; font-weight: 500; }

/* Salary slider */
.mvc-salary { margin-bottom: 20px; }
.mvc-salary-head { display: flex; justify-content: space-between; margin-bottom: 12px; }
.mvc-salary-range { font-size: 13px; font-weight: 600; color: var(--navy); }
.mvc-track { position: relative; height: 6px; background: var(--card); border-radius: 3px; margin-bottom: 8px; }
.mvc-fill {
  position: absolute; left: 0; right: 100%; top: 0; bottom: 0;
  background: linear-gradient(to right, var(--blue), rgba(55,138,221,0.5), var(--amber-w));
  border-radius: 3px;
  transition: right 1.2s cubic-bezier(0.34,1.56,0.64,1);
}
.mvc-fill.animate { right: 34%; }
.mvc-thumb {
  position: absolute; right: 100%; top: 50%; transform: translate(50%,-50%);
  width: 13px; height: 13px; border-radius: 50%;
  background: white; border: 2px solid var(--amber-w);
  box-shadow: 0 2px 8px rgba(0,0,0,0.14);
  transition: right 1.2s cubic-bezier(0.34,1.56,0.64,1);
}
.mvc-thumb.animate { right: 34%; }
.mvc-scale { display: flex; justify-content: space-between; font-size: 10px; color: var(--soft); }

/* Credentials */
.mvc-creds { margin-bottom: 18px; }
.mvc-creds-head { display: flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--soft); margin-bottom: 10px; }
.mvc-chips { display: flex; flex-wrap: wrap; gap: 7px; }
.mvc-chip {
  font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 5px;
  border: 1px solid rgba(83,74,183,0.18); color: var(--purple);
  background: rgba(83,74,183,0.05); letter-spacing: 0.03em;
  opacity: 0; transform: translateY(4px);
  transition: opacity 0.3s, transform 0.3s;
}
.tab-panel.active .mvc-chip { opacity: 1; transform: translateY(0); }
.tab-panel.active .mvc-chip:nth-child(1) { transition-delay: 0.3s; }
.tab-panel.active .mvc-chip:nth-child(2) { transition-delay: 0.4s; }
.tab-panel.active .mvc-chip:nth-child(3) { transition-delay: 0.5s; }
.tab-panel.active .mvc-chip:nth-child(4) { transition-delay: 0.6s; }

.mvc-hr { height: 1px; background: var(--border); margin: 0 0 14px; }
.mvc-footer { display: flex; justify-content: space-between; align-items: center; }
.mvc-shortlist { font-size: 13px; color: var(--muted); }
.mvc-shortlist em { font-style: italic; color: var(--navy); font-weight: 600; }
.mvc-verified { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--soft); }

/* ── PEER search results ── */
.search-label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--soft); margin-bottom: 10px; }
.search-query { font-size: 13px; color: var(--muted); font-style: italic; margin-bottom: 14px; padding: 10px 14px; background: var(--card); border-radius: 8px; border: 1px solid var(--border); }
.search-result {
  border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; margin-bottom: 10px; background: white;
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.4s, transform 0.4s, box-shadow 0.2s;
  cursor: default;
}
.tab-panel.active .search-result:nth-child(1) { opacity:1; transform:translateY(0); transition-delay:0.15s; }
.tab-panel.active .search-result:nth-child(2) { opacity:1; transform:translateY(0); transition-delay:0.28s; }
.search-result:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateX(4px) !important; }
.sr-id { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; color: rgba(4,44,83,0.3); margin-bottom: 8px; }
.sr-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.sr-tag { font-size: 11px; padding: 3px 9px; border-radius: 4px; font-weight: 500; }
.sr-tag.blue  { background: rgba(55,138,221,0.08); color: var(--blue); }


/* ════════════════════════════════════
   CH3: WHO IS THIS FOR
════════════════════════════════════ */
#ch3 { background: var(--bg); }
/* Subtle dot grid */
#ch3::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(4,44,83,0.07) 1px, transparent 1px); background-size: 32px 32px; pointer-events: none; z-index: 0; }

.who-inner { position: relative; z-index: 1; }
.who-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.who-card { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 30px 26px; display: flex; flex-direction: column; opacity: 0; transform: translateY(18px); transition: opacity 0.5s, transform 0.5s, box-shadow 0.25s, border-color 0.25s; cursor: default; }
.who-card.in { opacity: 1; transform: translateY(0); }
.who-card:nth-child(2).in { transition-delay: 0.08s; }
.who-card:nth-child(3).in { transition-delay: 0.16s; }
.who-card:nth-child(4).in { transition-delay: 0.24s; }
.who-card:nth-child(5).in { transition-delay: 0.32s; }
.who-card:nth-child(6).in { transition-delay: 0.40s; }
.who-card:hover { box-shadow: 0 16px 48px rgba(0,0,0,0.09); border-color: rgba(4,44,83,0.14); transform: translateY(-5px) !important; }
.who-icon { font-size: 28px; margin-bottom: 14px; }
.who-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: var(--navy); margin-bottom: 8px; }
.who-quote { font-size: 12px; font-style: italic; color: var(--muted); margin-bottom: 12px; padding-left: 12px; border-left: 2px solid var(--amber-w); line-height: 1.6; }
.who-body { font-size: 13px; line-height: 1.7; color: #4B5563; flex: 1; }

/* ════════════════════════════════════
   CH4: WHY NOT OTHERS
════════════════════════════════════ */
#ch4 { background: var(--white); }
.compare-table { width: 100%; border-collapse: separate; border-spacing: 0; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); }
.compare-table th { padding: 15px 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; text-align: left; background: var(--card); color: var(--muted); }
.compare-table th:not(:first-child) { text-align: center; }
.compare-table th.jl-col { background: var(--navy); color: white; }
.compare-table td { padding: 15px 20px; font-size: 14px; border-top: 1px solid var(--border); color: var(--text); }
.compare-table td:not(:first-child) { text-align: center; }
.compare-table td.jl-cell { background: rgba(4,44,83,0.025); font-weight: 500; color: var(--navy); }
.compare-table tr { opacity: 0; transition: opacity 0.45s, background 0.2s; }
.compare-table tr.in { opacity: 1; }
.compare-table tbody tr:hover td { background: rgba(4,44,83,0.02); }
.compare-table tbody tr:hover td.jl-cell { background: rgba(4,44,83,0.06); }
.tick { color: var(--green); font-size: 16px; font-weight: 700; }
.cross { color: #D1D5DB; font-size: 16px; }
.partial { color: var(--amber); font-size: 12px; font-weight: 500; }

/* ════════════════════════════════════
   CH5: IDENTITY REVEAL
════════════════════════════════════ */
#ch5 { background: var(--bg); }
#ch5::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 80% 50%, rgba(55,138,221,0.06) 0%, transparent 70%); pointer-events: none; }

.identity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 1; }

.identity-flow { display: flex; flex-direction: column; margin-top: 32px; }
.id-step { display: flex; gap: 0; align-items: flex-start; padding: 0 0 28px 36px; border-left: 2px solid var(--border); margin-left: 12px; position: relative; opacity: 0; transform: translateX(-12px); transition: opacity 0.5s, transform 0.5s; }
.id-step.in { opacity: 1; transform: translateX(0); }
.id-step:nth-child(2).in { transition-delay: 0.12s; }
.id-step:nth-child(3).in { transition-delay: 0.24s; }
.id-step:nth-child(4).in { transition-delay: 0.36s; }
.id-step::before { content: ''; position: absolute; left: -7px; top: 3px; width: 12px; height: 12px; border-radius: 50%; background: var(--white); border: 2px solid var(--border); transition: background 0.4s, border-color 0.4s; }
.id-step.in::before { background: var(--navy); border-color: var(--navy); }
.id-step:last-child.in::before { background: var(--amber-w); border-color: var(--amber-w); }
.id-step-num { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--soft); margin-bottom: 5px; }
.id-step-title { font-family: 'DM Serif Display', serif; font-size: 18px; color: var(--navy); margin-bottom: 6px; }
.id-step-body { font-size: 14px; line-height: 1.65; color: var(--muted); }

.identity-card { background: white; border: 1px solid var(--border); border-radius: 18px; padding: 32px; box-shadow: 0 8px 40px rgba(0,0,0,0.07); }
.ic-label { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--soft); margin-bottom: 20px; }
.ic-profiles { display: flex; gap: 12px; align-items: stretch; margin-bottom: 20px; }
.ic-profile { flex: 1; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 18px 14px; text-align: center; position: relative; overflow: hidden; transition: border-color 0.3s; }
.ic-profile.revealed { border-color: rgba(55,138,221,0.3); }
.ic-avatar { width: 44px; height: 44px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.ic-id { font-size: 13px; font-weight: 700; color: var(--navy); margin-bottom: 3px; letter-spacing: 0.03em; }
.ic-role { font-size: 11px; color: var(--muted); }
.ic-industry { font-size: 11px; color: var(--blue); font-weight: 500; margin-top: 4px; }

.ic-divider { display: flex; align-items: center; justify-content: center; font-size: 18px; color: var(--border); flex-shrink: 0; padding: 0 4px; }

/* Reveal overlay */
.ic-reveal-overlay { position: absolute; inset: 0; border-radius: 12px; background: rgba(245,243,239,0.97); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 3px; opacity: 0; transform: scale(0.92); transition: opacity 0.45s ease, transform 0.45s ease; pointer-events: none; }
.ic-reveal-overlay.show { opacity: 1; transform: scale(1); }
.reveal-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--green); margin-bottom: 4px; }
.reveal-name { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--navy); }
.reveal-detail { font-size: 11px; color: var(--muted); }

.ic-consent-note { background: rgba(4,44,83,0.03); border: 1px dashed rgba(4,44,83,0.12); border-radius: 10px; padding: 14px 16px; text-align: center; margin-bottom: 18px; font-size: 13px; color: var(--muted); line-height: 1.6; }
.ic-btn { display: block; width: 100%; padding: 14px; background: var(--navy); color: white; font-size: 14px; font-weight: 600; text-align: center; border: none; border-radius: 10px; cursor: pointer; transition: background 0.2s, transform 0.15s; font-family: 'Inter', sans-serif; }
.ic-btn:hover { background: var(--navy-m); transform: translateY(-1px); }
.ic-small-note { font-size: 11px; color: var(--soft); text-align: center; margin-top: 10px; line-height: 1.5; }

/* ════════════════════════════════════
   CH6: SALARY BENCHMARK
════════════════════════════════════ */
#ch6 { background: var(--white); }
#ch6::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 70% at 10% 50%, rgba(239,159,39,0.05) 0%, transparent 70%); pointer-events: none; }

.bench-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 1; }
.bench-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 32px; }
.bench-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.bench-title { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--soft); }
.bench-live { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--green); font-weight: 600; letter-spacing: 0.06em; }
.bench-live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: blink 2s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
.bench-domain { font-family: 'DM Serif Display', serif; font-size: 20px; color: var(--navy); margin-bottom: 4px; }
.bench-meta { font-size: 12px; color: var(--muted); margin-bottom: 26px; }
.bench-dist-label { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--soft); margin-bottom: 14px; }
.bench-bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.bench-range { font-size: 11px; color: var(--muted); width: 68px; flex-shrink: 0; }
.bench-bar-track { flex: 1; height: 8px; background: var(--card); border-radius: 4px; overflow: hidden; }
.bench-bar-fill { height: 100%; border-radius: 4px; transform: scaleX(0); transform-origin: left; transition: transform 0.9s cubic-bezier(0.34,1.56,0.64,1); }
.bench-bar-fill.in { transform: scaleX(1); }
.bench-bar-fill.c1 { background: #BFDBFE; }
.bench-bar-fill.c2 { background: var(--blue); }
.bench-bar-fill.c3 { background: var(--navy); }
.bench-bar-fill.c4 { background: var(--amber-w); }
.bench-count { font-size: 11px; color: var(--soft); width: 32px; text-align: right; flex-shrink: 0; }
.bench-marker { background: white; border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
.bench-marker-label { font-size: 11px; color: var(--muted); margin-bottom: 4px; }
.bench-marker-value { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--navy); }
.bench-marker-badge { font-size: 11px; font-weight: 600; background: rgba(55,138,221,0.1); color: var(--blue); padding: 5px 12px; border-radius: 5px; }
.bench-footnote { font-size: 12px; color: var(--soft); font-style: italic; margin-top: 12px; line-height: 1.6; }

/* Source comparison */
.source-compare { margin-top: 24px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 20px 22px; }
.source-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 8px 0; border-bottom: 1px solid var(--border); }
.source-row:last-child { border-bottom: none; padding-bottom: 0; }
.source-name { color: var(--muted); }
.source-verdict { font-weight: 500; }
.source-verdict.red { color: var(--red); }
.source-verdict.amber { color: var(--amber); }
.source-verdict.green { color: var(--green); }

/* ════════════════════════════════════
   CH7: HUMAN SEARCH
════════════════════════════════════ */
#ch7 { background: var(--bg); }
#ch7::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(55,138,221,0.06) 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; z-index: 0; }

.search-demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; position: relative; z-index: 1; }
.search-card { background: white; border: 1px solid var(--border); border-radius: 18px; padding: 28px; box-shadow: 0 4px 24px rgba(0,0,0,0.05); }
.search-card-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--soft); margin-bottom: 14px; }
.search-input { display: flex; align-items: center; gap: 10px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px; padding: 12px 16px; margin-bottom: 18px; }
.search-input-icon { font-size: 14px; color: var(--muted); flex-shrink: 0; }
.search-typed-text { font-size: 14px; color: var(--text); flex: 1; font-family: 'Inter', sans-serif; }
#s-cursor { display: inline-block; width: 2px; height: 16px; background: var(--navy); animation: blink-c 0.8s step-end infinite; vertical-align: middle; }
@keyframes blink-c { 0%,100%{opacity:1} 50%{opacity:0} }
.search-res-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--soft); margin-bottom: 12px; opacity: 0; transition: opacity 0.4s; }
.s-result { border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; margin-bottom: 10px; background: white; cursor: default; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.4s, box-shadow 0.2s; }
.s-result.in { opacity: 1; transform: translateY(0); }
.s-result:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.s-id { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; color: rgba(4,44,83,0.28); margin-bottom: 8px; }
.s-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 7px; }
.s-tag { font-size: 11px; padding: 3px 9px; border-radius: 4px; font-weight: 500; }
.s-tag.b { background: rgba(55,138,221,0.08); color: var(--blue); }
.s-tag.a { background: rgba(186,117,23,0.08); color: var(--amber); }
.s-meta { font-size: 12px; color: var(--muted); }

.search-feature { display: flex; gap: 14px; margin-bottom: 18px; align-items: flex-start; }
.sf-icon { width: 36px; height: 36px; border-radius: 8px; background: rgba(4,44,83,0.06); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.sf-text { font-size: 14px; line-height: 1.65; color: #374151; }
.sf-text strong { display: block; font-weight: 600; color: var(--text); margin-bottom: 2px; }

/* ════════════════════════════════════
   CH8: COMPANY FIREWALL — animated
════════════════════════════════════ */
#ch8 { background: var(--white); }
#ch8::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 80% at 70% 50%, rgba(4,44,83,0.03) 0%, transparent 70%); pointer-events: none; }

.fw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 1; }
.fw-visual { position: relative; height: 380px; display: flex; align-items: center; justify-content: center; }
#fw-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }

.fw-center { position: relative; z-index: 10; text-align: center; }
.fw-shield-box { width: 100px; height: 100px; border-radius: 50%; background: white; border: 2px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 8px 32px rgba(0,0,0,0.09); margin: 0 auto; }
.fw-shield-icon { font-size: 30px; }
.fw-shield-label { font-size: 8px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }

.fw-features { display: flex; flex-direction: column; gap: 16px; }
.fw-feature { display: flex; gap: 14px; align-items: flex-start; }
.fw-feature-icon { width: 34px; height: 34px; border-radius: 8px; background: rgba(4,44,83,0.06); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
.fw-feature-text { font-size: 14px; line-height: 1.65; color: #374151; }
.fw-feature-text strong { display: block; font-weight: 600; color: var(--text); margin-bottom: 2px; }

/* ════════════════════════════════════
   CH9: REQUEST ACCESS — grand finale
════════════════════════════════════ */
#ch9 { background: var(--navy); position: relative; }
#ch9-canvas { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

.cta-content { position: relative; z-index: 2; text-align: center; max-width: 700px; margin: 0 auto; padding: 0 48px; }
.cta-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 22px; }
.cta-head { font-family: 'DM Serif Display', serif; font-size: clamp(38px,5.5vw,68px); line-height: 1.07; letter-spacing: -0.025em; color: white; margin-bottom: 20px; }
.cta-head em { font-style: italic; color: var(--amber-w); }
.cta-sub { font-size: 17px; line-height: 1.8; color: rgba(255,255,255,0.48); margin-bottom: 44px; max-width: 520px; margin-left: auto; margin-right: auto; }

.role-box { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; padding: 36px 40px; margin-bottom: 28px; }
.role-box-head { font-family: 'DM Serif Display', serif; font-size: 22px; color: rgba(255,255,255,0.8); margin-bottom: 20px; text-align: left; }
.role-btns { display: flex; flex-direction: column; gap: 12px; }
.role-btn { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); cursor: pointer; text-align: left; width: 100%; font-family: 'Inter', sans-serif; text-decoration: none; transition: background 0.2s, border-color 0.2s, transform 0.15s; }
.role-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.16); transform: translateX(5px); }
.role-btn-l { display: flex; align-items: center; gap: 14px; }
.role-icon { font-size: 22px; }
.role-title { font-size: 15px; font-weight: 600; color: white; display: block; margin-bottom: 2px; }
.role-sub { font-size: 12px; color: rgba(255,255,255,0.38); }
.role-arrow { color: rgba(255,255,255,0.22); font-size: 16px; transition: color 0.2s; }
.role-btn:hover .role-arrow { color: rgba(255,255,255,0.65); }

.cta-trust { display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; }
.cta-trust-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: rgba(255,255,255,0.28); }
.cta-trust-check { width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: center; font-size: 8px; color: rgba(255,255,255,0.5); font-weight: 700; }

/* ── Closing CTA strip (end of journey) ── */
.final-cta {
  margin-top: 56px;
  display: flex; align-items: center; justify-content: space-between;
  background: var(--navy); border-radius: 18px;
  padding: 28px 36px;
  flex-wrap: wrap; gap: 16px;
}
.final-cta-text { font-size: 16px; color: rgba(255,255,255,0.85); font-family: 'DM Serif Display', serif; font-style: italic; }
.final-cta-btn {
  font-size: 14px; font-weight: 600; color: var(--navy); background: white;
  padding: 13px 28px; border-radius: 8px; text-decoration: none;
  transition: opacity 0.2s, transform 0.15s; white-space: nowrap;
}
.final-cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }` }} />
      <div>
        
<nav id="nav">
  <a href="#ch0" className="logo"><div className="logo-mark">JL</div>Job Lounge</a>
  <div className="nav-r">
    <a href="/login" className="n-login">Log in</a>
    <a href="#ch8" className="n-access">Request access →</a>
  </div>
</nav>
<div id="progress-bar"><div id="progress-fill"></div></div>


<div id="chapter-dots">
  <div className="cdot active" data-ch="ch0"><span className="cdot-tip">Start</span></div>
  <div className="cdot" data-ch="ch1"><span className="cdot-tip">The Problem</span></div>
  <div className="cdot" data-ch="ch2"><span className="cdot-tip">The Idea</span></div>
  <div className="cdot" data-ch="ch3"><span className="cdot-tip">Who is this for</span></div>
  <div className="cdot" data-ch="ch3b"><span className="cdot-tip">Which one is yours</span></div>
  <div className="cdot" data-ch="ch4"><span className="cdot-tip">Why not others</span></div>
  <div className="cdot" data-ch="ch5"><span className="cdot-tip">Identity reveal</span></div>
  <div className="cdot" data-ch="ch6"><span className="cdot-tip">Salary benchmark</span></div>
  <div className="cdot" data-ch="ch7"><span className="cdot-tip">Human search</span></div>
  <div className="cdot" data-ch="ch8"><span className="cdot-tip">Firewall · Access</span></div>
</div>


<section className="chapter" id="ch0" style="flex-direction:row;justify-content:space-between;align-items:center;padding:0;">

  
  <div className="hero-left-panel">
    <div className="hero-eyebrow"><span className="hero-pulse"></span>Verified · Anonymous · India's Professional Trust Network</div>
    <h1 className="hero-h1">The referral that<br />changed careers<br />was never on a<br />job board.<br /><em>Until now.</em></h1>
    <p className="hero-sub">Whether you're working, studying, or returning — your skills have a value the market hasn't told you yet. Find out, without anyone knowing you looked.</p>
    <div className="hero-btns">
      <a href="#ch1" className="btn-primary">See how it works ↓</a>
      <a href="#ch8" className="btn-ghost-sm">Skip to access →</a>
    </div>
    <div className="hero-trust">
      <div className="trust-item"><div className="trust-check">✓</div>Identity protected</div>
      <div className="trust-item"><div className="trust-check">✓</div>Everyone verified</div>
      <div className="trust-item"><div className="trust-check">✓</div>No CVs without consent</div>
    </div>
  </div>

  
  <div className="hero-right-panel">
    <div className="hero-card-stack">

      
      <div className="hcard hcard-3" id="hcard-recruiter">
        <div className="hcard-inner-before" id="hcard-recruiter-before">
          <div className="hcard-persona-badge" style="background:rgba(83,74,183,0.1);color:#534AB7">Recruiter</div>
          <div className="hcard-avatar">🛡</div>
          <div className="hcard-id">Mandate active</div>
          <div className="hcard-domain">GRC Head · FinTech</div>
          <div className="hcard-city">Bangalore · Senior</div>
          <div className="hcard-frosted-row">
            <div className="hcard-frost-block" style="width:55%;background:rgba(83,74,183,0.1)"></div>
            <div className="hcard-frost-block" style="width:38%;height:8px;background:rgba(83,74,183,0.07)"></div>
          </div>
          <div className="hcard-pulse-row" style="color:#534AB7">
            <div className="hcard-pulse-dot" style="background:#534AB7"></div>
            <span>Verified mandate</span>
          </div>
        </div>
        <div className="hcard-inner-after" id="hcard-recruiter-after">
          <div className="hcard-persona-badge" style="background:rgba(22,163,74,0.1);color:#16A34A">✓ Matched</div>
          <div className="hcard-avatar">🛡</div>
          <div className="hcard-reveal-name">2 profiles found</div>
          <div className="hcard-reveal-role">GRC Head · FinTech mandate</div>
          <div className="hcard-reveal-company">Bangalore · Senior level</div>
          <div className="hcard-reveal-email" style="color:#534AB7">Not 200 results. Exactly 2.</div>
        </div>
      </div>

      
      <div className="hcard hcard-2" id="hcard-peer">
        <div className="hcard-inner-before" id="hcard-peer-before">
          <div className="hcard-persona-badge" style="background:rgba(186,117,23,0.1);color:#BA7517">Peer</div>
          <div className="hcard-avatar">💼</div>
          <div className="hcard-id">Open seat</div>
          <div className="hcard-domain">Risk Head · Private Banking</div>
          <div className="hcard-city">Mumbai · Urgent</div>
          <div className="hcard-frosted-row">
            <div className="hcard-frost-block" style="width:60%;background:rgba(186,117,23,0.12)"></div>
            <div className="hcard-frost-block" style="width:40%;height:8px;background:rgba(186,117,23,0.08)"></div>
          </div>
          <div className="hcard-pulse-row" style="color:#BA7517">
            <div className="hcard-pulse-dot" style="background:#EF9F27"></div>
            <span>Flash brief posted</span>
          </div>
        </div>
        <div className="hcard-inner-after" id="hcard-peer-after">
          <div className="hcard-persona-badge" style="background:rgba(22,163,74,0.1);color:#16A34A">✓ Revealed</div>
          <div className="hcard-avatar">💼</div>
          <div className="hcard-reveal-name">Ankit Mehta</div>
          <div className="hcard-reveal-role">Risk Head</div>
          <div className="hcard-reveal-company">Kotak Mahindra Bank · Mumbai</div>
          <div className="hcard-reveal-email">ankitm@joblounge.com</div>
        </div>
      </div>

      
      <div className="hcard hcard-1" id="hcard-lounger">
        <div className="hcard-inner-before" id="hcard-lounger-before">
          <div className="hcard-persona-badge" style="background:rgba(55,138,221,0.1);color:#378ADD">Lounger</div>
          <div className="hcard-avatar">👤</div>
          <div className="hcard-id">JL-R83Z7Z</div>
          <div className="hcard-domain">Senior IT Auditor · BFSI</div>
          <div className="hcard-city">Pune · 6–10 yrs</div>
          <div className="hcard-frosted-row">
            <div className="hcard-frost-block"></div>
            <div className="hcard-frost-block" style="width:45%;height:8px"></div>
          </div>
          <div className="hcard-pulse-row">
            <div className="hcard-pulse-dot"></div>
            <span>Market demand: HIGH</span>
          </div>
        </div>
        <div className="hcard-inner-after" id="hcard-lounger-after">
          <div className="hcard-persona-badge" style="background:rgba(22,163,74,0.1);color:#16A34A">✓ Revealed</div>
          <div className="hcard-avatar">👤</div>
          <div className="hcard-reveal-name">Kayra Mishra</div>
          <div className="hcard-reveal-role">Senior IT Auditor</div>
          <div className="hcard-reveal-company">HDFC Bank · Pune</div>
          <div className="hcard-reveal-email">kayram@joblounge.com</div>
        </div>
      </div>

    </div>

    <div className="hero-narrator" id="hero-narrator">
      <div className="narrator-label" id="narrator-label">
        <span id="narrator-text">3 professionals. All anonymous. All verified.</span>
      </div>
      <div className="hero-step-dots">
        <div className="hero-step-dot active" id="dot-0"></div>
        <div className="hero-step-dot" id="dot-1"></div>
        <div className="hero-step-dot" id="dot-2"></div>
      </div>
    </div>
  </div>

  <a className="scroll-cue" href="#ch1" style="left:30%;transform:translateX(-50%)"><div className="scroll-cue-line"></div>Continue</a>
</section>


<section className="chapter" id="ch1">
  <div className="ch-inner">
    <div className="problem-grid">
      <div>
        <div className="ch-label rv">The problem</div>
        <h2 className="ch-head rv">Every platform asks you<br />to expose yourself<br /><em>before you're ready.</em></h2>
        <p className="ch-body rv d1">Upload your resume. Enter your salary. Add your employer. And then you're visible to everyone — including the person who sits two desks away from you. That's not a job search. That's an ambush.</p>
      </div>
      <div className="prob-cards">
        <div className="prob-card"><div className="prob-icon">😟</div><div className="prob-text"><strong>Your employer can see you're looking</strong>A subscription-based recruiter just told your manager you updated your profile this week.</div></div>
        <div className="prob-card"><div className="prob-icon">📋</div><div className="prob-text"><strong>You reveal before you're informed</strong>Resume sent. No idea which company. No salary shared. Exposed before you even knew who was asking.</div></div>
        <div className="prob-card"><div className="prob-icon">🔇</div><div className="prob-text"><strong>You never know why you were rejected</strong>Screened out by an algorithm you didn't know existed. No feedback. No reason. No closure.</div></div>
        <div className="prob-card"><div className="prob-icon">📊</div><div className="prob-text"><strong>Your salary benchmark is guesswork</strong>Aggregated job portal data is months old and based on what people claimed — not what they actually earn in your role today.</div></div>
      </div>
    </div>
  </div>
  <a className="scroll-cue" href="#ch2"><div className="scroll-cue-line"></div>Continue</a>
</section>


<section className="chapter" id="ch2">
  <canvas id="ch2-canvas"></canvas>
  <div className="ch-inner" style="position:relative;z-index:2">
    <div className="idea-content">
      <div className="idea-eyebrow rv">A different idea</div>
      <h2 className="idea-head rv">What if you could know<br />your market value<br /><em>without becoming visible?</em></h2>
      <p className="idea-sub rv d1">You get a <strong style="color:white">Private ID — non-identifiable until you choose to reveal.</strong> The market tells you where you stand. Opportunities find you. You decide if you're interested. Identity crosses only when both sides agree — simultaneously.</p>

      <div className="private-id-box rv d2">
        <div>
          <div className="pid-label">Your Private ID</div>
          <div className="pid-value">JL-R83Z7Z</div>
        </div>
        <div className="pid-arrow">→</div>
        <div className="pid-right">
          <div className="pid-label">What the market sees</div>
          <div className="pid-desc">Senior IT Auditor · BFSI · Pune · CISA · 6–10 yrs · At market salary</div>
        </div>
      </div>

      <div className="idea-pills-row rv d2">
        <div className="idea-pill">Employed professional</div>
        <div className="idea-pill">Student entering workforce</div>
        <div className="idea-pill">Homemaker returning to work</div>
        <div className="idea-pill">Career switcher</div>
        <div className="idea-pill">Freelancer going full-time</div>
        <div className="idea-pill">Anyone with skills. Any domain.</div>
      </div>

      <div className="idea-stats rv d3">
        <div className="idea-stat"><div className="idea-stat-num">70%</div><div className="idea-stat-label">of real opportunities fill through private referral — never publicly posted</div></div>
        <div className="idea-stat"><div className="idea-stat-num">2</div><div className="idea-stat-label">profiles returned per search — not 200. Precision is the product.</div></div>
        <div className="idea-stat"><div className="idea-stat-num">₹0</div><div className="idea-stat-label">recruiter fee for Peers. Direct access to passive talent.</div></div>
        <div className="idea-stat"><div className="idea-stat-num">0</div><div className="idea-stat-label">CVs shared without mutual consent. Ever.</div></div>
      </div>
    </div>
  </div>
  <a className="scroll-cue" href="#ch3" style="color:rgba(255,255,255,0.35)"><div className="scroll-cue-line" style="background:linear-gradient(to bottom,rgba(255,255,255,0.4),transparent)"></div>Continue</a>
</section>


<section className="chapter" id="ch3">
  <div className="ch-inner who-inner">
    <div className="ch-label rv">This is for you</div>
    <h2 className="ch-head rv" style="margin-bottom:48px">Job Lounge is for anyone<br />who has never had <em>the right introduction.</em></h2>
    <div className="who-grid">
      <div className="who-card"><div className="who-icon">💼</div><h3 className="who-title">The Quiet Achiever</h3><p className="who-quote">"I'm not looking. But if the right thing came, I'd move."</p><p className="who-body">Doing well where you are. Not on any job board. Not updating your profile. But the right opportunity at the right moment would change everything.</p></div>
      <div className="who-card"><div className="who-icon">🎓</div><h3 className="who-title">The Student</h3><p className="who-quote">"I have skills nobody knows about yet."</p><p className="who-body">Final year. Strong foundation. But no alumni referral, no warm introduction. Job Lounge gives you a verified Private ID before your career even begins.</p></div>
      <div className="who-card"><div className="who-icon">🏠</div><h3 className="who-title">The Homemaker Returning</h3><p className="who-quote">"I took a break. My skills didn't."</p><p className="who-body">A career gap doesn't erase 8 years of expertise. Job Lounge evaluates your skill and domain — not your last active date on a job portal.</p></div>
      <div className="who-card"><div className="who-icon">🔄</div><h3 className="who-title">The Career Switcher</h3><p className="who-quote">"My skills apply here, but nobody connects the dots."</p><p className="who-body">Moving from banking to fintech. Audit to risk consulting. The skills transfer — but automated screening never sees it. Here, a human Peer reads your profile.</p></div>
      <div className="who-card"><div className="who-icon">🌍</div><h3 className="who-title">The Cross-Domain Talent</h3><p className="who-quote">"I've worked BFSI, GCC and Big 4. Nobody has a box for that."</p><p className="who-body">Platform expanding across all domains and industries. If you have verified skills and no platform that does you justice — this is that platform.</p></div>
      <div className="who-card"><div className="who-icon">💡</div><h3 className="who-title">The Hidden Expert</h3><p className="who-quote">"I know things people pay consultants ₹5L/day to explain."</p><p className="who-body">Niche credentials. Deep domain. The market doesn't know you exist because you've never needed to look. Job Lounge surfaces your rarity — anonymously.</p></div>
    </div>
  </div>
  <a className="scroll-cue" href="#ch3b"><div className="scroll-cue-line"></div>Continue</a>
</section>


<section className="chapter" id="ch3b">
  <div className="ch-inner">
    <div className="s-label reveal">Three doors. One platform.</div>
    <h2 className="s-title reveal">Which one is yours?</h2>

    <div className="tab-bar reveal">
      <button className="tab-btn active" data-tab="lounger">🔵 Lounger</button>
      <button className="tab-btn" data-tab="peer">🟡 Peer</button>
      <button className="tab-btn" data-tab="recruiter">🟣 Recruiter</button>
    </div>

    <div className="tab-panels">

      
      <div className="tab-panel active" id="tab-lounger">
        <div className="tab-copy">
          <p className="tab-quote">"Pehli baar koi mujhe refer karega — sirf mere kaam ki wajah se."</p>
          <p className="tab-body">You are employed, performing, and not broadcasting. But the market has a value for your exact profile right now — and you deserve to know it without anyone knowing you looked.</p>
          <ul className="tab-features">
            <li><div className="tab-check blue">✓</div>See live opportunities before revealing anything</li>
            <li><div className="tab-check blue">✓</div>Your employer is never notified — by design, not by promise</li>
            <li><div className="tab-check blue">✓</div>Market Pulse shows your demand tier in real time</li>
            <li><div className="tab-check blue">✓</div>Raise your hand only when you choose to</li>
          </ul>
          <a href="/request-access" className="tab-cta">Join as Lounger →</a>
        </div>

        
        <div className="tab-visual">
          <div className="mvc">
            <div className="mvc-top">
              <div className="mvc-top-left">
                <div className="mvc-dot-sm"></div>
                <span className="mvc-top-label">Market Value Card</span>
              </div>
              <span className="mvc-top-right">Confidential</span>
            </div>

            <div className="mvc-identity-row">
              <div className="mvc-id-col">
                <div className="mvc-field-label">Identity</div>
                <div className="mvc-jlid">JL-R83Z7Z</div>
                <div className="mvc-meta">Senior IT Auditor · BFSI · Pune</div>
              </div>
              <div className="mvc-pulse-col">
                <div className="mvc-field-label" style="text-align:right">Pulse</div>
                <div className="mvc-pulse-badge">
                  <span className="mvc-pulse-ring"></span>HIGH
                </div>
                <div className="mvc-trend">↗ +14% w/w</div>
              </div>
            </div>

            <div className="mvc-salary">
              <div className="mvc-salary-head">
                <span className="mvc-field-label">Salary Percentile</span>
                <span className="mvc-salary-range">₹ 42 – 58 L · p72</span>
              </div>
              <div className="mvc-track">
                <div className="mvc-fill"></div>
                <div className="mvc-thumb"></div>
              </div>
              <div className="mvc-scale">
                <span>10L</span><span>30L</span><span>50L</span><span>70L</span><span>100L</span>
              </div>
            </div>

            <div className="mvc-creds">
              <div className="mvc-creds-head">✦ Rare Credentials</div>
              <div className="mvc-chips">
                <span className="mvc-chip">CISA</span>
                <span className="mvc-chip">DISA (ICAI)</span>
                <span className="mvc-chip">ISO 27001 LA</span>
                <span className="mvc-chip">RBI IS Audit</span>
              </div>
            </div>

            <div className="mvc-hr"></div>
            <div className="mvc-footer">
              <div className="mvc-shortlist"><em>1 of 6</em> profiles being considered this week</div>
              <div className="mvc-verified">Verified · Scarce</div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="tab-panel" id="tab-peer">
        <div className="tab-copy">
          <p className="tab-quote">"Coffee pe poochha 'koi jaanta hai?' — ab phone pe dhundh leta hoon. 2 profiles. Exact fit."</p>
          <p className="tab-body">You have an open seat and know exactly who you need. Type it in plain language. Get 2 verified anonymous profiles — not 200. The interview becomes a formality.</p>
          <ul className="tab-features">
            <li><div className="tab-check amber">✓</div>Natural language search — type like you talk</li>
            <li><div className="tab-check amber">✓</div>2 profiles returned, not 200. Precision is the product.</li>
            <li><div className="tab-check amber">✓</div>Flash brief in 220 characters — not a job description</li>
            <li><div className="tab-check amber">✓</div>Zero recruiter fee. Direct access to passive talent.</li>
          </ul>
          <a href="/request-access" className="tab-cta">Join as Peer →</a>
        </div>
        <div className="tab-visual">
          <div className="search-label">Search results · 2 profiles found</div>
          <div className="search-query">"CISA audit NBFC 6 years Pune"</div>
          <div className="search-result">
            <div className="sr-id">JL-R83Z7Z</div>
            <div className="sr-tags">
              <span className="sr-tag blue">CISA</span>
              <span className="sr-tag blue">IT Audit</span>
              <span className="sr-tag blue">6–10 yrs</span>
              <span className="sr-tag blue">Pune</span>
            </div>
            <div className="sr-meta">Salary: At market · Big 4 background · Open to NBFC</div>
          </div>
          <div className="search-result">
            <div className="sr-id">JL-K72M4X</div>
            <div className="sr-tags">
              <span className="sr-tag amber">CISA</span>
              <span className="sr-tag amber">IT Audit</span>
              <span className="sr-tag amber">8–12 yrs</span>
              <span className="sr-tag amber">Pune</span>
            </div>
            <div className="sr-meta">Salary: Above market · NBFC experience · Pune only</div>
          </div>
        </div>
      </div>

      
      <div className="tab-panel" id="tab-recruiter">
        <div className="tab-copy">
          <p className="tab-quote">"Pehli baar woh inventory jo kisi ke paas nahi — passive, verified, genuinely open."</p>
          <p className="tab-body">The professionals you need are not missing. They just don't surface on open platforms. They are here — verified and quietly open. Inventory no competing recruiter has.</p>
          <ul className="tab-features">
            <li><div className="tab-check purple">✓</div>Founder-verified access — not self-serve</li>
            <li><div className="tab-check purple">✓</div>Pre-scored anonymous profiles matched to your mandate</li>
            <li><div className="tab-check purple">✓</div>No CV changes hands without mutual consent</li>
            <li><div className="tab-check purple">✓</div>Genuinely passive — not being shopped to 6 others</li>
          </ul>
          <a href="/request-access" className="tab-cta">Apply for Recruiter access →</a>
        </div>
        <div className="tab-visual">
          <div className="rec-stat">1 in 8</div>
          <div className="rec-stat-sub">qualified people are visible to the right opportunity at the right time</div>
          <div className="bar-row">
            <div className="bar-head"><span>Job portal active seekers</span><span>12%</span></div>
            <div className="bar-track"><div className="bar-fill purple" style="width:12%"></div></div>
          </div>
          <div className="bar-row">
            <div className="bar-head"><span>Professional network visitors</span><span>34%</span></div>
            <div className="bar-track"><div className="bar-fill amber" style="width:34%"></div></div>
          </div>
          <div className="bar-row">
            <div className="bar-head"><span>Job Lounge verified passive</span><span>100%</span></div>
            <div className="bar-track"><div className="bar-fill blue" style="width:100%"></div></div>
          </div>
        </div>
      </div>

    </div>
  </div>
  <a className="scroll-cue" href="#ch4"><div className="scroll-cue-line"></div>Continue</a>
</section>


<section className="chapter" id="ch4">
  <div className="ch-inner">
    <div className="ch-label rv">Why not others</div>
    <h2 className="ch-head rv" style="margin-bottom:48px">Every other platform puts you<br />in a searchable database.<br /><em>We don't.</em></h2>
    <table className="compare-table">
      <thead>
        <tr>
          <th>What matters to you</th>
          <th>Job portals</th>
          <th>Professional networks</th>
          <th className="jl-col">Job Lounge</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Your employer knows you're looking</td><td><span style="color:var(--red);font-weight:600">High risk</span></td><td><span style="color:var(--red);font-weight:600">Very high risk</span></td><td className="jl-cell"><span className="tick">✗</span> Impossible by design</td></tr>
        <tr><td>You see salary before revealing yourself</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="jl-cell"><span className="tick">✓</span> Always. Before any interest.</td></tr>
        <tr><td>Identity shared only by mutual consent</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="jl-cell"><span className="tick">✓</span> Architecture, not policy</td></tr>
        <tr><td>Real-time salary from people in your exact role</td><td><span className="partial">Aggregated · Stale</span></td><td><span className="cross">✗</span></td><td className="jl-cell"><span className="tick">✓</span> Live · Same domain · Same city</td></tr>
        <tr><td>Passive talent — not actively looking</td><td><span className="cross">✗</span></td><td><span className="partial">Rarely</span></td><td className="jl-cell"><span className="tick">✓</span> 100% of the platform</td></tr>
        <tr><td>Natural language search — 2 results, not 200</td><td><span className="cross">✗</span></td><td><span className="cross">✗</span></td><td className="jl-cell"><span className="tick">✓</span> Precision is the product</td></tr>
      </tbody>
    </table>
  </div>
  <a className="scroll-cue" href="#ch5"><div className="scroll-cue-line"></div>Continue</a>
</section>


<section className="chapter" id="ch5">
  <div className="ch-inner">
    <div className="identity-grid">
      <div>
        <div className="ch-label rv">Identity reveal</div>
        <h2 className="ch-head rv">Your name is revealed<br />as a <em>ceremony.</em><br />Not a database flag.</h2>
        <div className="identity-flow">
          <div className="id-step"><div><div className="id-step-num">Step 01</div><h3 className="id-step-title">A Peer signals interest</h3><p className="id-step-body">They searched your profile. The search query is visible to you. You see what they were looking for before deciding anything.</p></div></div>
          <div className="id-step"><div><div className="id-step-num">Step 02</div><h3 className="id-step-title">You raise your hand</h3><p className="id-step-body">If interested, you raise your hand. Before doing so, you can request confirmation of the industry — to ensure it's not your current employer.</p></div></div>
          <div className="id-step"><div><div className="id-step-num">Step 03</div><h3 className="id-step-title">Both parties consent</h3><p className="id-step-body">The Peer also agrees to reveal. Until both sides agree independently — nobody's name crosses. Not a setting. The system will not permit it.</p></div></div>
          <div className="id-step"><div><div className="id-step-num">Step 04</div><h3 className="id-step-title">Simultaneous introduction</h3><p className="id-step-body">Both receive the same message at the same moment. Names, contact, and the query that started it. The platform recedes. The conversation is yours.</p></div></div>
        </div>
      </div>
      <div className="identity-card rv d1">
        <div className="ic-label">Identity reveal · Interactive demo</div>
        <div className="ic-profiles">
          <div className="ic-profile" id="ic-profile-a">
            <div className="ic-avatar" style="background:rgba(55,138,221,0.1)">👤</div>
            <div className="ic-id">JL-R83Z7Z</div>
            <div className="ic-role">Senior IT Auditor</div>
            <div className="ic-industry">Private Banking</div>
            <div className="ic-reveal-overlay" id="reveal-a">
              <div className="reveal-badge">✓ Identity revealed</div>
              <div className="reveal-name">Priya Sharma</div>
              <div className="reveal-detail">priya.s@••••.com</div>
              <div className="reveal-detail" style="margin-top:2px;color:var(--blue);font-weight:500">HDFC Bank · Pune</div>
            </div>
          </div>
          <div className="ic-divider">⟷</div>
          <div className="ic-profile" id="ic-profile-b">
            <div className="ic-avatar" style="background:rgba(186,117,23,0.1)">💼</div>
            <div className="ic-id">Ankit M.</div>
            <div className="ic-role">Risk Head</div>
            <div className="ic-industry">Private Banking</div>
            <div className="ic-reveal-overlay" id="reveal-b">
              <div className="reveal-badge">✓ Identity revealed</div>
              <div className="reveal-name">Ankit Mehta</div>
              <div className="reveal-detail">a.mehta@••••.com</div>
              <div className="reveal-detail" style="margin-top:2px;color:var(--amber);font-weight:500">Kotak Mahindra Bank · Mumbai</div>
            </div>
          </div>
        </div>
        <div className="ic-consent-note">Both have expressed interest. The moment both consent — identities reveal simultaneously. Neither goes first.</div>
        <button className="ic-btn" id="reveal-btn">See what happens when both consent →</button>
        <p className="ic-small-note">This demo shows the outcome. In the platform, both sides consent independently — the system orchestrates the reveal.</p>
      </div>
    </div>
  </div>
  <a className="scroll-cue" href="#ch6"><div className="scroll-cue-line"></div>Continue</a>
</section>


<section className="chapter" id="ch6">
  <div className="ch-inner">
    <div className="bench-grid">
      <div>
        <div className="ch-label rv">Salary benchmark</div>
        <h2 className="ch-head rv">Not a survey.<br />Not aggregated data.<br /><em>Real people. Your domain.</em></h2>
        <p className="ch-body rv d1" style="margin-top:18px;margin-bottom:28px">Every data point on Job Lounge comes from verified professionals actually on the platform — in your domain, city, and experience band. The people sitting in the same chair as you, right now.</p>
        <div className="source-compare rv d2">
          <div className="source-row"><span className="source-name">Aggregated job portals</span><span className="source-verdict red">Self-reported · 6–18 months old</span></div>
          <div className="source-row"><span className="source-name">Professional network salary tool</span><span className="source-verdict amber">Broad · Not domain-specific</span></div>
          <div className="source-row"><span className="source-name">Job Lounge</span><span className="source-verdict green">Verified · Live · Same role · Same city</span></div>
        </div>
      </div>
      <div className="bench-card rv d1">
        <div className="bench-top">
          <div className="bench-title">Salary distribution</div>
          <div className="bench-live"><span className="bench-live-dot"></span>Live platform data</div>
        </div>
        <div className="bench-domain">IT Audit · BFSI · Pune</div>
        <div className="bench-meta">6–12 years · CISA certified · 47 verified profiles</div>
        <div className="bench-dist-label">Distribution</div>
        <div className="bench-bar-row"><span className="bench-range">20–35L</span><div className="bench-bar-track"><div className="bench-bar-fill c1" style="width:18%"></div></div><span className="bench-count">8</span></div>
        <div className="bench-bar-row"><span className="bench-range">35–50L</span><div className="bench-bar-track"><div className="bench-bar-fill c2" style="width:55%"></div></div><span className="bench-count">26</span></div>
        <div className="bench-bar-row"><span className="bench-range">50–65L</span><div className="bench-bar-track"><div className="bench-bar-fill c3" style="width:38%"></div></div><span className="bench-count">18</span></div>
        <div className="bench-bar-row"><span className="bench-range">65L+</span><div className="bench-bar-track"><div className="bench-bar-fill c4" style="width:22%"></div></div><span className="bench-count">10</span></div>
        <div className="bench-marker">
          <div><div className="bench-marker-label">Your Private ID position</div><div className="bench-marker-value">₹ 42 – 58 L</div></div>
          <div className="bench-marker-badge">p72 · Top 28%</div>
        </div>
        <div className="bench-footnote">Data from 47 verified IT Audit professionals in Pune BFSI. Updates as new profiles join.</div>
      </div>
    </div>
  </div>
  <a className="scroll-cue" href="#ch7"><div className="scroll-cue-line"></div>Continue</a>
</section>


<section className="chapter" id="ch7">
  <div className="ch-inner">
    <div className="search-demo-grid">
      <div className="search-card rv">
        <div className="search-card-label">How a Peer finds you</div>
        <div className="search-input">
          <span className="search-input-icon">🔍</span>
          <span className="search-typed-text" id="s-typed"></span>
          <span id="s-cursor"></span>
        </div>
        <div className="search-res-label" id="s-res-label">2 profiles found · Exact match</div>
        <div id="s-results">
          <div className="s-result"><div className="s-id">JL-R83Z7Z</div><div className="s-tags"><span className="s-tag b">CISA</span><span className="s-tag b">IT Audit</span><span className="s-tag b">6–10 yrs</span><span className="s-tag b">Pune</span></div><div className="s-meta">At market salary · Big 4 background · Open to NBFC</div></div>
          <div className="s-result"><div className="s-id">JL-K72M4X</div><div className="s-tags"><span className="s-tag a">CISA</span><span className="s-tag a">IT Audit</span><span className="s-tag a">8–12 yrs</span><span className="s-tag a">Pune</span></div><div className="s-meta">Above market · NBFC experience · Pune preferred</div></div>
        </div>
      </div>
      <div>
        <div className="ch-label rv">Human search</div>
        <h2 className="ch-head rv">Type how you'd describe<br />the person<br /><em>to a friend.</em></h2>
        <p className="ch-body rv d1" style="margin-top:16px;margin-bottom:26px">Peers don't fill job description forms. They describe the person they need, the way they'd say it on a call. The platform understands intent, domain, and experience — and returns exactly 2 matched profiles.</p>
        <div className="search-feature rv d2"><div className="sf-icon">🎯</div><div className="sf-text"><strong>2 profiles. Not 200.</strong>If you get 2 right profiles, the interview is already a formality.</div></div>
        <div className="search-feature rv d2"><div className="sf-icon">🗣</div><div className="sf-text"><strong>Natural language</strong>"CISA audit NBFC 6 years Pune" — no filters, no dropdowns. Just describe the person.</div></div>
        <div className="search-feature rv d2"><div className="sf-icon">☕</div><div className="sf-text"><strong>The referral conversation — democratised</strong>This is "do you know someone?" — made available to everyone, not just those with the right coffee meetings.</div></div>
      </div>
    </div>
  </div>
  <a className="scroll-cue" href="#ch8"><div className="scroll-cue-line"></div>Continue</a>
</section>


<section className="chapter" id="ch8">
  <div className="ch-inner">
    <div className="fw-grid">
      <div>
        <div className="ch-label rv">Company firewall</div>
        <h2 className="ch-head rv">Your employer<br />cannot see you here.<br /><em>By design. Not policy.</em></h2>
        <p className="ch-body rv d1" style="margin-top:18px;margin-bottom:32px">The moment someone from your company enters the platform, the system identifies the employer conflict and hides your profile from them entirely. Not just your name. Your existence on the platform.</p>
        <div className="fw-features rv d2">
          <div className="fw-feature"><div className="fw-feature-icon">🏢</div><div className="fw-feature-text"><strong>Employer conflict detection</strong>Your company active on platform? You're invisible to them. Hard block — not a checkbox.</div></div>
          <div className="fw-feature"><div className="fw-feature-icon">🔐</div><div className="fw-feature-text"><strong>No trace. No notification.</strong>If someone from your company searches and you don't match — they never know you were here. No "viewed" receipts.</div></div>
          <div className="fw-feature"><div className="fw-feature-icon">✅</div><div className="fw-feature-text"><strong>Pre-consent industry reveal</strong>Before raising your hand, you can confirm the industry — to ensure you're not engaging with your current employer.</div></div>
        </div>
      </div>
      <div className="fw-visual rv d1">
        <canvas id="fw-canvas"></canvas>
        <div className="fw-center">
          <div className="fw-shield-box">
            <div className="fw-shield-icon">🛡</div>
            <div className="fw-shield-label">Firewall</div>
          </div>
        </div>
      </div>
    </div>

    
    <div className="final-cta rv d3">
      <span className="final-cta-text">Ready to see where you stand?</span>
      <a href="/request-access" className="final-cta-btn">Request access →</a>
    </div>
  </div>
</section>
      </div>
    </>
  )
}
