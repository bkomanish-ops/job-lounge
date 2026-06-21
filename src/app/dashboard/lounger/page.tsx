'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LoungerProfile {
  id: string;
  domain: string[];
  certifications: string[];
  experience_years: number;
  current_city: string;
  pulse_score_label: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  salary_min_paise: number;
  salary_max_paise: number;
}

interface Match {
  id: string;
  total_score: number;
  employer_blocked: boolean;
  requirements: {
    id: string;
    title: string;
    location: string;
    salary_min_paise: number;
    salary_max_paise: number;
    certifications_needed: string[];
    peer_profiles?: { industry: string; company_domain: string } | null;
    recruiter_profiles?: { company_name: string } | null;
  };
}

interface Signal {
  id: string;
  status: string;
  sent_at: string;
  peer_profiles?: { industry: string } | null;
  recruiter_profiles?: { company_name: string } | null;
  requirements: {
    title: string;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSalaryLakh(paise: number): string {
  const lakhs = paise / 10_000_000;
  return `₹${lakhs.toFixed(0)}L`;
}

function getSalaryRange(minPaise: number, maxPaise: number): string {
  const min = (minPaise / 10_000_000).toFixed(0);
  const max = (maxPaise / 10_000_000).toFixed(0);
  return `₹${min}–${max}L`;
}

function getPulseLabel(label: string | null): { text: string; color: string; arrow: string } {
  switch (label) {
    case 'HIGH':
      return { text: 'High demand', color: '#fff', arrow: '↑' };
    case 'MEDIUM':
      return { text: 'Growing', color: '#fff', arrow: '→' };
    default:
      return { text: 'Steady', color: '#B5D4F4', arrow: '–' };
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#0C447C';
  if (score >= 70) return '#3B6D11';
  if (score >= 60) return '#533AB7';
  if (score >= 50) return '#854F0B';
  return '#73726c';
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return '#185FA5';
  if (score >= 70) return '#639922';
  if (score >= 60) return '#7F77DD';
  if (score >= 50) return '#BA7517';
  return '#888780';
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}

function getAvatarInitials(match: Match): string {
  const peer = match.requirements.peer_profiles;
  const rec = match.requirements.recruiter_profiles;
  if (rec?.company_name) return rec.company_name.slice(0, 2).toUpperCase();
  if (peer?.industry) return peer.industry.slice(0, 2).toUpperCase();
  return 'JL';
}

const AVATAR_COLORS = [
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#EEEDFE', color: '#3C3489' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoungerDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<LoungerProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      // 1. Get authenticated user
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        router.push('/login');
        return;
      }

      // 2. Fetch lounger profile
      const { data: profileData, error: profileErr } = await supabase
        .from('lounger_profiles')
        .select('id, domain, certifications, experience_years, current_city, pulse_score_label, salary_min_paise, salary_max_paise')
        .eq('user_id', user.id)
        .single();

      if (profileErr || !profileData) {
        // Profile not found → send back to onboarding
        router.push('/onboarding/lounger');
        return;
      }

      setProfile(profileData);

      // 3. Fetch top 5 matches by score (excluding employer-blocked)
      const { data: matchData, error: matchErr } = await supabase
        .from('matches')
        .select(`
          id,
          total_score,
          employer_blocked,
          requirements (
            id,
            title,
            location,
            salary_min_paise,
            salary_max_paise,
            certifications_needed,
            peer_profiles ( industry, company_domain ),
            recruiter_profiles ( company_name )
          )
        `)
        .eq('lounger_id', profileData.id)
        .eq('employer_blocked', false)
        .order('total_score', { ascending: false })
        .limit(5);

      if (!matchErr && matchData) {
        setMatches(matchData as unknown as Match[]);
      }

      // 4. Fetch recent signals (last 30 days, status SENT or OPENED)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3_600_000).toISOString();
      const { data: signalData, error: signalErr } = await supabase
        .from('signals')
        .select(`
          id,
          status,
          sent_at,
          requirements (
            title,
            peer_profiles ( industry ),
            recruiter_profiles ( company_name )
          )
        `)
        .eq('lounger_id', profileData.id)
        .in('status', ['SENT', 'OPENED'])
        .gte('sent_at', thirtyDaysAgo)
        .order('sent_at', { ascending: false })
        .limit(4);

      if (!signalErr && signalData) {
        setSignals(signalData as unknown as Signal[]);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Failed to load dashboard. Please refresh.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  // ─── Derived values ────────────────────────────────────────────────────────

  const topScore = matches[0]?.total_score ?? 0;
  const circlingCount = signals.length;
  const pulse = getPulseLabel(profile?.pulse_score_label ?? null);

  // Salary delta vs top match offer
  const profileMinPaise = profile?.salary_min_paise ?? 0;
  const topMatchMaxPaise = matches[0]?.requirements?.salary_max_paise ?? 0;
  const salaryDelta =
    profileMinPaise > 0 && topMatchMaxPaise > 0
      ? Math.round(((topMatchMaxPaise - profileMinPaise) / profileMinPaise) * 100)
      : null;

  const pulseDesc =
    matches.length > 0
      ? `${matches.length} active requirement${matches.length > 1 ? 's' : ''} match your profile this week.`
      : 'No matches yet. The engine runs nightly — check back tomorrow.';

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  const profileLabel =
    profile
      ? `${profile.certifications?.[0] ?? profile.domain?.[0] ?? 'Professional'} · ${profile.current_city}`
      : '';

  // ─── Loading / Error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#64748b' }}>
        Loading your dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#e24b4a' }}>
        {error}
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Nav bar ── */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#0f172a', letterSpacing: '-0.01em' }}>
          Job Lounge
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Lounger</span>
          <button
            onClick={handleSignOut}
            style={{ fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Content ── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 48px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{greeting}</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: '#0f172a', marginTop: 2 }}>{profileLabel}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#0C447C', background: '#E6F1FB', borderRadius: 20, padding: '5px 12px', border: '0.5px solid #B5D4F4' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Fully anonymous
          </div>
        </div>

        {/* New signal banner (only if signals exist) */}
        {signals.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#E1F5EE', border: '0.5px solid #5DCAA5', borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0F6E56', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#085041', flex: 1 }}>
              <strong>New signal:</strong> {signals[0].requirements?.title ?? 'A role'} viewed a profile matching yours {getTimeAgo(signals[0].sent_at)}.
            </span>
            <span style={{ fontSize: 12, color: '#0F6E56', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }}>
              Details ↗
            </span>
          </div>
        )}

        {/* Pulse card */}
        <div style={{ background: '#042C53', borderRadius: 14, padding: '20px 24px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#85B7EB', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your market pulse</span>
            <div style={{ fontSize: 30, fontWeight: 500, color: pulse.color, display: 'flex', alignItems: 'center', gap: 10 }}>
              {pulse.text}
              <span style={{ fontSize: 20, color: '#5DCAA5' }}>{pulse.arrow}</span>
            </div>
            <span style={{ fontSize: 13, color: '#B5D4F4', maxWidth: 320 }}>{pulseDesc}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 52 }}>
              {[22, 18, 30, 26, 34, 40, 52].map((h, i) => (
                <div
                  key={i}
                  style={{ width: 10, height: h, borderRadius: '3px 3px 0 0', background: i === 6 ? '#5DCAA5' : '#185FA5' }}
                />
              ))}
            </div>
            <span style={{ fontSize: 11, color: '#85B7EB' }}>7-week trend</span>
          </div>
        </div>

        {/* 4 metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
          <MetricCard
            label="Signals circling"
            value={String(circlingCount)}
            sub={circlingCount > 0 ? `${circlingCount} in last 30 days` : 'None yet'}
            subColor={circlingCount > 0 ? '#0F6E56' : '#94a3b8'}
          />
          <MetricCard
            label="Total matches"
            value={String(matches.length)}
            sub="Active requirements"
            subColor="#94a3b8"
          />
          <MetricCard
            label="Top match score"
            value={topScore > 0 ? `${topScore}%` : '—'}
            sub={matches[0]?.requirements?.title ?? 'No matches yet'}
            subColor="#185FA5"
          />
          <MetricCard
            label="Salary delta"
            value={salaryDelta !== null ? `+${salaryDelta}%` : '—'}
            sub="vs your current band"
            subColor={salaryDelta !== null && salaryDelta > 0 ? '#0F6E56' : '#94a3b8'}
          />
        </div>

        {/* Two-col: who's circling + top matches */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>

          {/* Who's circling */}
          <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#64748b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              Who's circling (anonymous)
            </div>
            {signals.length === 0 ? (
              <div style={{ fontSize: 13, color: '#94a3b8', padding: '12px 0', textAlign: 'center' }}>
                No signals yet. Matches will appear after the nightly engine runs.
              </div>
            ) : (
              signals.map((sig, i) => {
                const col = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const industry = (sig.requirements as any)?.peer_profiles?.industry ?? (sig.requirements as any)?.recruiter_profiles?.company_name ?? 'Company';
                const initials = industry.slice(0, 2).toUpperCase();
                return (
                  <div key={sig.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < signals.length - 1 ? '0.5px solid #f1f5f9' : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, flexShrink: 0, background: col.bg, color: col.color }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {industry}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{sig.requirements?.title ?? 'Role'}</div>
                    </div>
                    <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>{getTimeAgo(sig.sent_at)}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Top 5 matches */}
          <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#64748b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
              Your top {matches.length > 0 ? matches.length : 0} matches
            </div>
            {matches.length === 0 ? (
              <div style={{ fontSize: 13, color: '#94a3b8', padding: '12px 0', textAlign: 'center' }}>
                No matches yet. Check back after the nightly engine runs.
              </div>
            ) : (
              matches.map((m, i) => {
                const score = Math.round(m.total_score);
                const req = m.requirements;
                const title = req?.title ?? 'Role';
                const location = req?.location ?? '';
                const salary = req ? getSalaryRange(req.salary_min_paise, req.salary_max_paise) : '';
                const cert = req?.certifications_needed?.[0] ?? '';
                const scoreColor = getScoreColor(score);
                const barColor = getScoreBarColor(score);

                return (
                  <div
                    key={m.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < matches.length - 1 ? '0.5px solid #f1f5f9' : 'none', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, minWidth: 38, color: scoreColor }}>{score}%</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        {cert && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, padding: '1px 7px', borderRadius: 20, background: '#E6F1FB', color: '#0C447C', marginRight: 6 }}>
                            {cert}
                          </span>
                        )}
                        {location}{salary ? ` · ${salary}` : ''}
                      </div>
                    </div>
                    <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, width: 60, flexShrink: 0 }}>
                      <div style={{ height: 4, borderRadius: 2, background: barColor, width: `${score}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Salary reflection card */}
        {profile && (
          <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#64748b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              Salary reflection — your profile vs live market
            </div>
            <SalaryBands profile={profile} matches={matches} />
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '0.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                Based on {matches.length} live requirement{matches.length !== 1 ? 's' : ''} · BFSI · {profile.current_city}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, subColor }: { label: string; value: string; sub: string; subColor: string }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px', border: '0.5px solid #e2e8f0' }}>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: '#0f172a' }}>{value}</div>
      <div style={{ fontSize: 11, marginTop: 4, color: subColor }}>{sub}</div>
    </div>
  );
}

function SalaryBands({ profile, matches }: { profile: LoungerProfile; matches: Match[] }) {
  const currentMin = profile.salary_min_paise;
  const currentMax = profile.salary_max_paise;

  // Market P50: avg of all match salary midpoints
  const matchMids = matches.map(m => (m.requirements.salary_min_paise + m.requirements.salary_max_paise) / 2);
  const marketP50 = matchMids.length > 0 ? matchMids.reduce((a, b) => a + b, 0) / matchMids.length : 0;
  const marketP50Max = marketP50 * 1.1;

  // Top match salary
  const topMin = matches[0]?.requirements?.salary_min_paise ?? 0;
  const topMax = matches[0]?.requirements?.salary_max_paise ?? 0;

  // P90 ceiling: max salary across all matches
  const p90 = matches.reduce((max, m) => Math.max(max, m.requirements.salary_max_paise), 0);

  const bands = [
    { label: 'Your current', min: currentMin, max: currentMax, color: '#B5D4F4' },
    { label: 'Market P50', min: marketP50 * 0.9, max: marketP50Max, color: '#5DCAA5' },
    { label: 'Top matches', min: topMin, max: topMax, color: '#378ADD' },
    { label: 'P90 ceiling', min: p90 * 0.85, max: p90, color: '#7F77DD' },
  ];

  const maxPaise = Math.max(...bands.map(b => b.max), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {bands.map((b, i) => {
        const widthPct = Math.round((b.max / maxPaise) * 92);
        const label = b.min > 0 && b.max > 0
          ? `${(b.min / 10_000_000).toFixed(0)}–${(b.max / 10_000_000).toFixed(0)}L`
          : '—';
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#64748b', minWidth: 80 }}>{b.label}</span>
            <div style={{ flex: 1, height: 10, background: '#f1f5f9', borderRadius: 5, position: 'relative' }}>
              <div style={{ height: 10, borderRadius: 5, background: b.color, width: `${widthPct}%` }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#0f172a', minWidth: 64, textAlign: 'right' }}>₹{label}</span>
          </div>
        );
      })}
    </div>
  );
}