import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Lounge — Know what you're worth. Without anyone knowing you looked.",
  description:
    "A private intelligence platform for senior professionals. See who's hiring for your profile — anonymously — before you decide if you're even interested.",
};

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --amber: #f59e0b;
          --amber-d: #d97706;
          --amber-l: #fde68a;
          --navy: #0a0f1e;
          --navy-m: #1e3a5f;
          --off: #f8fafc;
          --slate: #64748b;
          --slate-l: #94a3b8;
          --border: #e2e8f0;
        }

        body {
          font-family: 'Inter', sans-serif;
          color: var(--navy);
          background: #fff;
          -webkit-font-smoothing: antialiased;
        }

        .syne { font-family: 'Syne', sans-serif; }

        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); border: 0;
        }

        /* PULSE ANIMATION */
        .pulse-dot {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--amber);
          animation: pulse-anim 1.8s ease-in-out infinite;
          vertical-align: middle;
          margin-right: 6px;
        }
        @keyframes pulse-anim {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .35; transform: scale(.6); }
        }

        /* PAGE WRAPPER */
        .page-wrap {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* NAV */
        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 0 1rem;
          border-bottom: .5px solid var(--border);
        }
        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800; color: var(--navy);
          display: flex; align-items: center; gap: 8px;
          text-decoration: none;
        }
        .logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--amber), #f97316);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-links { display: flex; align-items: center; gap: 6px; }
        .nav-link {
          font-size: 12.5px; color: var(--slate);
          cursor: pointer; background: none; border: none;
          padding: 6px 10px; font-family: 'Inter', sans-serif;
          border-radius: 8px;
        }
        .nav-link:hover { background: var(--off); }
        .nav-divider { width: 1px; height: 16px; background: var(--border); margin: 0 4px; }
        .btn-hire {
          font-size: 12.5px; padding: 7px 18px;
          border-radius: 8px; border: .5px solid var(--border);
          cursor: pointer; background: #fff; color: var(--navy);
          font-family: 'Inter', sans-serif;
        }
        .btn-join-nav {
          font-size: 12.5px; padding: 7px 18px;
          border-radius: 8px; border: none;
          cursor: pointer;
          background: linear-gradient(135deg, var(--amber), #f97316);
          color: #fff; font-family: 'Inter', sans-serif; font-weight: 600;
        }

        /* HERO */
        .hero { padding: 52px 0 44px; border-bottom: .5px solid var(--border); }
        .hero-tag {
          display: inline-flex; align-items: center;
          background: #FEF3C7; border: .5px solid #FDE68A;
          border-radius: 20px; padding: 5px 14px; margin-bottom: 22px;
        }
        .hero-tag-txt {
          font-size: 11px; font-weight: 700; color: #92400E;
          letter-spacing: 1.5px; text-transform: uppercase;
        }
        .hero-h1 {
          font-family: 'Syne', sans-serif;
          font-size: 44px; font-weight: 800; color: var(--navy);
          line-height: 1.1; letter-spacing: -.8px; margin-bottom: 16px;
        }
        .hero-h1 .grad {
          background: linear-gradient(90deg, var(--amber), #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 16px; color: var(--slate);
          line-height: 1.75; max-width: 520px; margin-bottom: 28px;
        }
        .hero-ctas { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .btn-gold {
          font-size: 14px; padding: 12px 28px;
          border-radius: 22px; border: none; cursor: pointer;
          background: linear-gradient(135deg, var(--amber), #f97316);
          color: #fff; font-family: 'Inter', sans-serif; font-weight: 600;
        }
        .btn-outline {
          font-size: 14px; padding: 12px 28px;
          border-radius: 22px; border: .5px solid var(--border);
          cursor: pointer; background: #fff; color: var(--navy);
          font-family: 'Inter', sans-serif;
        }
        .btn-outline:hover { background: var(--off); }
        .hero-micro { font-size: 12px; color: var(--slate-l); }
        .hero-social {
          display: flex; align-items: center; gap: 8px;
          margin-top: 24px; padding-top: 24px;
          border-top: .5px solid var(--border);
        }
        .sp-av {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600;
          margin-right: -8px; border: 2px solid #fff;
        }
        .sp-txt { font-size: 12px; color: var(--slate); margin-left: 16px; }

        /* DIVIDER LABEL */
        .divider-row { display: flex; align-items: center; gap: 14px; margin: 36px 0 28px; }
        .divider-line { flex: 1; height: .5px; background: var(--border); }
        .divider-txt {
          font-size: 11px; font-weight: 700; color: var(--slate-l);
          letter-spacing: 1.5px; text-transform: uppercase; white-space: nowrap;
        }

        /* WHO GRID */
        .who-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 36px; }
        .who-card { border-radius: 14px; padding: 24px; border: .5px solid var(--border); }
        .who-card.lounger { background: #F0F9FF; }
        .who-card.gladiator { background: #FFFBEB; }
        .who-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
        .who-label.l { color: #0369A1; }
        .who-label.g { color: #92400E; }
        .who-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800; color: var(--navy);
          margin-bottom: 8px; line-height: 1.25;
        }
        .who-desc { font-size: 12.5px; color: var(--slate); line-height: 1.65; margin-bottom: 16px; }
        .who-list { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
        .who-list-item { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--navy); }
        .who-list-item i { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
        .btn-who-l {
          font-size: 13px; padding: 9px 20px; border-radius: 20px;
          border: none; cursor: pointer;
          background: #0369A1; color: #fff;
          font-family: 'Inter', sans-serif; font-weight: 500;
        }
        .btn-who-g {
          font-size: 13px; padding: 9px 20px; border-radius: 20px;
          border: none; cursor: pointer;
          background: linear-gradient(135deg, var(--amber), #f97316);
          color: #fff; font-family: 'Inter', sans-serif; font-weight: 500;
        }

        /* INDUSTRIES */
        .industry-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 36px; }
        .ind-tag {
          font-size: 12px; padding: 6px 14px;
          border-radius: 20px; border: .5px solid var(--border);
          color: var(--slate); background: #fff;
        }
        .ind-tag.hot { background: #FEF3C7; border-color: #FDE68A; color: #92400E; }

        /* SECTIONS */
        .section { padding: 0 0 36px; }
        .section-label {
          font-size: 10px; font-weight: 700; color: var(--amber-d);
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;
        }
        .section-h2 {
          font-family: 'Syne', sans-serif;
          font-size: 27px; font-weight: 800; color: var(--navy);
          line-height: 1.18; letter-spacing: -.4px; margin-bottom: 10px;
        }
        .section-sub { font-size: 13.5px; color: var(--slate); line-height: 1.75; margin-bottom: 22px; max-width: 540px; }

        /* PROBLEM CARDS */
        .two-col-p { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .p-card { border-radius: 12px; padding: 16px; border: .5px solid var(--border); background: #fff; }
        .p-card-title { font-size: 13px; font-weight: 600; color: var(--navy); margin-bottom: 4px; display: flex; align-items: center; gap: 7px; }
        .p-card-text { font-size: 12px; color: var(--slate); line-height: 1.6; }

        /* STEPS */
        .steps-list { display: flex; flex-direction: column; }
        .step { display: flex; gap: 16px; padding: 14px 0; border-bottom: .5px solid var(--border); }
        .step:last-child { border-bottom: none; }
        .step-n {
          width: 28px; height: 28px; border-radius: 50%;
          background: #FEF3C7; color: #92400E;
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px;
        }
        .step-title { font-size: 13.5px; font-weight: 600; color: var(--navy); margin-bottom: 3px; }
        .step-desc { font-size: 12px; color: var(--slate); line-height: 1.6; }

        /* MARKET TEST */
        .market-test {
          background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
          border: .5px solid #FDE68A; border-radius: 18px;
          padding: 34px 36px; margin-bottom: 36px; text-align: center;
        }
        .mt-eyebrow { font-size: 10px; font-weight: 700; color: #92400E; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
        .mt-h2 { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: var(--navy); line-height: 1.25; margin-bottom: 8px; }
        .mt-sub { font-size: 13px; color: var(--slate); line-height: 1.7; margin-bottom: 20px; max-width: 400px; margin-left: auto; margin-right: auto; }
        .mt-form { display: flex; gap: 8px; max-width: 380px; margin: 0 auto 10px; }
        .mt-input {
          flex: 1; font-size: 13px; padding: 9px 14px;
          border-radius: 18px; border: .5px solid #FCD34D;
          background: #fff; color: var(--navy);
          font-family: 'Inter', sans-serif; outline: none;
        }
        .mt-btn {
          font-size: 13px; padding: 9px 18px; border-radius: 18px;
          border: none; cursor: pointer;
          background: linear-gradient(135deg, var(--amber), #f97316);
          color: #fff; font-family: 'Inter', sans-serif; font-weight: 600;
          white-space: nowrap;
        }
        .mt-micro { font-size: 11px; color: #92400E; opacity: .6; }

        /* TESTIMONIALS */
        .testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 36px; }
        .testi-card { background: #fff; border: .5px solid var(--border); border-radius: 14px; padding: 18px; }
        .testi-quote { font-size: 13px; color: var(--navy); line-height: 1.75; margin-bottom: 12px; font-style: italic; }
        .testi-av {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600;
        }
        .testi-name { font-size: 12px; font-weight: 600; color: var(--navy); }
        .testi-role { font-size: 11px; color: var(--slate-l); }

        /* STATS */
        .stats-strip { display: flex; border: .5px solid var(--border); border-radius: 12px; overflow: hidden; background: #fff; margin-bottom: 36px; }
        .stat-cell { flex: 1; padding: 14px; text-align: center; border-right: .5px solid var(--border); }
        .stat-cell:last-child { border-right: none; }
        .stat-v { font-size: 20px; font-weight: 700; }
        .stat-l { font-size: 11px; color: var(--slate-l); margin-top: 3px; }

        /* FOOTER CTA */
        .footer-cta { text-align: center; padding: 8px 0 32px; }
        .footer-h2 { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: var(--navy); margin-bottom: 8px; }
        .footer-sub { font-size: 13px; color: var(--slate); margin-bottom: 18px; }
        .footer-micro { font-size: 11px; color: var(--slate-l); margin-top: 8px; }
        .footer-bar {
          border-top: .5px solid var(--border); padding: 16px 0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-links { display: flex; gap: 16px; }
        .footer-link { font-size: 11px; color: var(--slate-l); cursor: pointer; }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .hero-h1 { font-size: 30px; }
          .who-grid { grid-template-columns: 1fr; }
          .two-col-p { grid-template-columns: 1fr; }
          .testi-grid { grid-template-columns: 1fr; }
          .stats-strip { flex-wrap: wrap; }
          .stat-cell { flex: 1 1 45%; border-right: none; border-bottom: .5px solid var(--border); }
          .nav-link { display: none; }
          .mt-form { flex-direction: column; }
        }
      `}</style>

      <div className="page-wrap">
        <h1 className="sr-only">Job Lounge — anonymous market intelligence platform connecting professionals with hiring teams across industries</h1>

        {/* NAV */}
        <nav className="nav">
          <a href="/" className="logo">
            <div className="logo-icon">
              <i className="ti ti-radar" style={{ fontSize: "14px", color: "#fff" }} aria-hidden="true" />
            </div>
            Job Lounge
          </a>
          <div className="nav-links">
            <button className="nav-link">How it works</button>
            <button className="nav-link">Industries</button>
            <div className="nav-divider" />
            <button className="btn-hire">I&apos;m hiring</button>
            <a href="/onboarding"><button className="btn-join-nav">Join the Lounge</button></a>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-tag">
            <span className="pulse-dot" />
            <span className="hero-tag-txt">Invite-only · Now open across industries</span>
          </div>
          <h2 className="hero-h1">
            Know what you&apos;re worth.<br />
            <span className="grad">Without anyone knowing</span><br />
            you looked.
          </h2>
          <p className="hero-sub">
            A private intelligence platform for senior professionals. See who&apos;s hiring for your profile — anonymously — before you decide if you&apos;re even interested. No resume. No exposure. No noise.
          </p>
          <div className="hero-ctas">
            <a href="/onboarding"><button className="btn-gold">Join the Lounge — it&apos;s free →</button></a>
            <button className="btn-outline">I&apos;m hiring talent</button>
          </div>
          <p className="hero-micro">No name. No LinkedIn. No employer. Your market pulse in 14 days.</p>
          <div className="hero-social">
            <div className="sp-av" style={{ background: "#E6F1FB", color: "#0C447C" }}>AM</div>
            <div className="sp-av" style={{ background: "#E1F5EE", color: "#085041" }}>RS</div>
            <div className="sp-av" style={{ background: "#EEEDFE", color: "#3C3489" }}>VP</div>
            <div className="sp-av" style={{ background: "#FAEEDA", color: "#633806" }}>NJ</div>
            <span className="sp-txt">Growing community of senior professionals across Finance, Risk, Tech, Legal, Strategy &amp; more</span>
          </div>
        </div>

        {/* WHO IS THIS FOR */}
        <div className="divider-row">
          <div className="divider-line" /><div className="divider-txt">Who is this for</div><div className="divider-line" />
        </div>

        <div className="who-grid">
          <div className="who-card lounger">
            <div className="who-label l">Job Loungers — professionals</div>
            <div className="who-title">You&apos;re good at what you do. You&apos;re just not sure you&apos;re being paid for it.</div>
            <div className="who-desc">Quietly explore your market value without updating your LinkedIn or floating a resume anywhere.</div>
            <div className="who-list">
              <div className="who-list-item"><i className="ti ti-check" style={{ color: "#0369A1" }} aria-hidden="true" />Anonymous profile — no name, no employer</div>
              <div className="who-list-item"><i className="ti ti-check" style={{ color: "#0369A1" }} aria-hidden="true" />See your live match score &amp; salary benchmark</div>
              <div className="who-list-item"><i className="ti ti-check" style={{ color: "#0369A1" }} aria-hidden="true" />Raise your hand — or don&apos;t. No pressure ever</div>
              <div className="who-list-item"><i className="ti ti-check" style={{ color: "#0369A1" }} aria-hidden="true" />Identity reveals only when both sides agree</div>
            </div>
            <a href="/onboarding"><button className="btn-who-l">Join the Lounge — free →</button></a>
          </div>
          <div className="who-card gladiator">
            <div className="who-label g">Corporate Gladiators — hiring teams</div>
            <div className="who-title">The right hire never applies openly. That&apos;s why you can&apos;t find them.</div>
            <div className="who-desc">Access a pre-qualified, quietly-open talent bench — no recruiter taking 8.33%, no JD floating in public.</div>
            <div className="who-list">
              <div className="who-list-item"><i className="ti ti-check" style={{ color: "#92400E" }} aria-hidden="true" />Post a 3-line flash brief in under 4 minutes</div>
              <div className="who-list-item"><i className="ti ti-check" style={{ color: "#92400E" }} aria-hidden="true" />See match-scored candidates instantly</div>
              <div className="who-list-item"><i className="ti ti-check" style={{ color: "#92400E" }} aria-hidden="true" />Signal directly — avg first response in 18h</div>
              <div className="who-list-item"><i className="ti ti-check" style={{ color: "#92400E" }} aria-hidden="true" />Zero recruiter fee</div>
            </div>
            <button className="btn-who-g">Request Gladiator access →</button>
          </div>
        </div>

        {/* INDUSTRIES */}
        <div className="divider-row">
          <div className="divider-line" /><div className="divider-txt">Open across industries</div><div className="divider-line" />
        </div>

        <div className="section" style={{ paddingBottom: "28px" }}>
          <h2 className="section-h2">Senior talent, across every domain.</h2>
          <p className="section-sub">Job Lounge is built for any professional senior enough to know their market — and senior enough to risk being seen looking. Any industry. Any function.</p>
          <div className="industry-tags">
            {["Finance & Banking", "Risk & Compliance", "IT Audit"].map(t => (
              <span key={t} className="ind-tag hot">{t}</span>
            ))}
            {["Strategy & Consulting", "Technology & Product", "Legal & Regulatory", "Insurance", "Fintech", "Healthcare", "FMCG & Retail", "Manufacturing", "Real Estate"].map(t => (
              <span key={t} className="ind-tag">{t}</span>
            ))}
            <span className="ind-tag" style={{ color: "var(--slate-l)", fontStyle: "italic" }}>+ any domain</span>
          </div>
        </div>

        {/* PROBLEM */}
        <div className="divider-row">
          <div className="divider-line" /><div className="divider-txt">The problem</div><div className="divider-line" />
        </div>

        <div className="section">
          <h2 className="section-h2">You&apos;re too exposed to even test the market.</h2>
          <p className="section-sub">LinkedIn shows your employer who you&apos;re talking to. Naukri feels junior. Headhunters brief your office by accident. The senior professional has no private way to understand their own value — until now.</p>
          <div className="two-col-p">
            <div className="p-card">
              <div className="p-card-title"><i className="ti ti-eye" style={{ color: "#993C1D", fontSize: "15px" }} aria-hidden="true" />LinkedIn exposes you</div>
              <div className="p-card-text">Profile views and connection requests are visible to anyone — including your current employer or team.</div>
            </div>
            <div className="p-card">
              <div className="p-card-title"><i className="ti ti-mood-sad" style={{ color: "#854F0B", fontSize: "15px" }} aria-hidden="true" />Job boards feel junior</div>
              <div className="p-card-text">Built for volume. A VP-level professional doesn&apos;t want to sit next to a fresher résumé in a recruiter&apos;s stack.</div>
            </div>
            <div className="p-card">
              <div className="p-card-title"><i className="ti ti-phone-off" style={{ color: "#712B13", fontSize: "15px" }} aria-hidden="true" />Recruiters are noisy</div>
              <div className="p-card-text">8.33% of your first year&apos;s salary — and they sometimes brief your employer before you&apos;ve decided anything.</div>
            </div>
            <div className="p-card">
              <div className="p-card-title"><i className="ti ti-help" style={{ color: "#3C3489", fontSize: "15px" }} aria-hidden="true" />You don&apos;t know your number</div>
              <div className="p-card-text">What are people with your profile actually earning right now? Glassdoor is stale. Peers won&apos;t say.</div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="divider-row">
          <div className="divider-line" /><div className="divider-txt">How it works</div><div className="divider-line" />
        </div>

        <div className="section">
          <h2 className="section-h2">Your market, on your terms.</h2>
          <div className="steps-list">
            <div className="step">
              <div className="step-n">1</div>
              <div>
                <div className="step-title">Build your anonymous profile — 5 minutes, no resume</div>
                <div className="step-desc">Function, industry, experience, location, salary expectation. No name, no company, no LinkedIn. Your market fingerprint, not your CV.</div>
              </div>
            </div>
            <div className="step">
              <div className="step-n">2</div>
              <div>
                <div className="step-title">Your market pulse goes live in 14 days</div>
                <div className="step-desc">We match you against live requirements from Corporate Gladiators. Match score, salary benchmark, who&apos;s circling — all completely private to you.</div>
              </div>
            </div>
            <div className="step">
              <div className="step-n">3</div>
              <div>
                <div className="step-title">Gladiators signal you — you decide if you&apos;re interested</div>
                <div className="step-desc">A 3-line flash brief arrives. You raise your hand anonymously — or you don&apos;t. No pressure, no follow-up unless you choose it.</div>
              </div>
            </div>
            <div className="step">
              <div className="step-n">4</div>
              <div>
                <div className="step-title">Identity reveals only when both sides agree</div>
                <div className="step-desc">Mutual opt-in, always. Your employer is never notified. Your name stays yours until you decide otherwise — even if you raise your hand ten times.</div>
              </div>
            </div>
          </div>
        </div>

        {/* MARKET TEST */}
        <div className="market-test">
          <div className="mt-eyebrow">The anonymous market test</div>
          <h2 className="mt-h2 syne">Curious what you&apos;re worth right now?<br />A private read in 14 days.</h2>
          <p className="mt-sub">No resume. No exposure. Just your function and experience — and we&apos;ll show you exactly where you sit in the current market.</p>
          <div className="mt-form">
            <input className="mt-input" type="email" placeholder="Your email (private — never shared)" />
            <button className="mt-btn">Request access</button>
          </div>
          <p className="mt-micro">Invite-only · 48hr confirmation · Never shared with employers or Gladiators</p>
        </div>

        {/* TESTIMONIALS */}
        <div className="section">
          <div className="section-label">Early Loungers</div>
          <h2 className="section-h2">What the first members are saying.</h2>
          <div className="testi-grid">
            <div className="testi-card">
              <div className="testi-quote">&ldquo;Found out a company had been searching for someone with my exact profile for over a month. I didn&apos;t even know that seat existed.&rdquo;</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="testi-av" style={{ background: "#E6F1FB", color: "#0C447C" }}>AM</div>
                <div><div className="testi-name">Audit Manager</div><div className="testi-role">9 yrs experience · Mumbai</div></div>
              </div>
            </div>
            <div className="testi-card">
              <div className="testi-quote">&ldquo;The salary benchmark alone was worth it. I was 18% below market. I didn&apos;t even need to move — I used it in my appraisal conversation.&rdquo;</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="testi-av" style={{ background: "#E1F5EE", color: "#085041" }}>RS</div>
                <div><div className="testi-name">Risk &amp; Assurance Lead</div><div className="testi-role">11 yrs experience · Pune</div></div>
              </div>
            </div>
            <div className="testi-card">
              <div className="testi-quote">&ldquo;LinkedIn always felt like my manager was watching. This is the first time I checked my market without anxiety.&rdquo;</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="testi-av" style={{ background: "#EEEDFE", color: "#3C3489" }}>VP</div>
                <div><div className="testi-name">VP — Financial Services</div><div className="testi-role">13 yrs experience · Mumbai</div></div>
              </div>
            </div>
            <div className="testi-card">
              <div className="testi-quote">&ldquo;Raised my hand for two roles. No awkward calls, no resume floating around. One turned into a conversation. That&apos;s the first time a job search felt dignified.&rdquo;</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="testi-av" style={{ background: "#FAEEDA", color: "#633806" }}>NJ</div>
                <div><div className="testi-name">Compliance Lead</div><div className="testi-role">14 yrs experience · Pune</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="divider-row">
          <div className="divider-line" /><div className="divider-txt">The numbers</div><div className="divider-line" />
        </div>
        <div className="stats-strip">
          <div className="stat-cell"><div className="stat-v" style={{ color: "#185FA5" }}>14</div><div className="stat-l">Avg matched profiles per requirement</div></div>
          <div className="stat-cell"><div className="stat-v" style={{ color: "#0F6E56" }}>18h</div><div className="stat-l">Avg time to first response</div></div>
          <div className="stat-cell"><div className="stat-v" style={{ color: "#854F0B" }}>₹0</div><div className="stat-l">Recruiter fee for Gladiators</div></div>
          <div className="stat-cell"><div className="stat-v" style={{ color: "#3C3489" }}>100%</div><div className="stat-l">Anonymous until you choose otherwise</div></div>
        </div>

        {/* FOOTER CTA */}
        <div className="footer-cta">
          <h2 className="footer-h2 syne">Your market is moving.<br />Are you watching?</h2>
          <p className="footer-sub" style={{ maxWidth: "420px", margin: "0 auto 18px" }}>Join the Lounge. Know your number. Stay in control — across any industry, any function, any city.</p>
          <a href="/onboarding"><button className="btn-gold">Join the Lounge — free →</button></a>
          <p className="footer-micro">Invite-only · Senior professionals across India · All industries welcome</p>
        </div>

        <div className="footer-bar">
          <div className="logo" style={{ fontSize: "14px" }}>
            <div className="logo-icon" style={{ width: "26px", height: "26px", borderRadius: "7px" }}>
              <i className="ti ti-radar" style={{ fontSize: "12px", color: "#fff" }} aria-hidden="true" />
            </div>
            Job Lounge
          </div>
          <div className="footer-links">
            <span className="footer-link">Privacy</span>
            <span className="footer-link">How it works</span>
            <span className="footer-link">For Gladiators</span>
            <span className="footer-link">Contact</span>
          </div>
        </div>
      </div>
    </>
  );
}