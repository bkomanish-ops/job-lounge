'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface LoungerProfile {
  user_id: string;
  domain: string[];
  certifications: string[];
  skills: string[];
  experience_years: string;
  current_city: string;
  pulse_label: string | null;
  salary_min_paise: number;
  salary_max_paise: number;
  jl_id: string;
}

function toArr(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : [val]; } catch { return [val]; }
  }
  return [];
}

function formatLakh(paise: number): string {
  return `₹${(paise / 10_000_000).toFixed(0)}L`;
}

function getPulse(label: string | null): { text: string; arrow: string } {
  switch (label) {
    case 'HIGH':   return { text: 'High demand', arrow: '↑' };
    case 'MEDIUM': return { text: 'Growing',     arrow: '→' };
    default:       return { text: 'Steady',      arrow: '–' };
  }
}

export default function LoungerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<LoungerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) { router.push('/login'); return; }

      const { data, error: profileErr } = await supabase
        .from('lounger_profiles')
        .select('user_id, domain, certifications, skills, experience_years, current_city, pulse_label, salary_min_paise, salary_max_paise, jl_id')
        .eq('user_id', user.id)
        .single();

      if (profileErr || !data) { router.push('/onboarding/lounger'); return; }
      setProfile(data);
    } catch (err) {
      setError('Failed to load dashboard. Please refresh.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#64748b' }}>
      Loading your dashboard…
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#e24b4a' }}>
      {error}
    </div>
  );

  if (!profile) return null;

  const domainArr = toArr(profile.domain);
  const certsArr  = toArr(profile.certifications);
  const skillsArr = toArr(profile.skills);
  const pulse     = getPulse(profile.pulse_label);

  const subtitleParts = [certsArr[0] ?? domainArr[0] ?? 'Professional', profile.current_city].filter(Boolean);
  const subtitle = subtitleParts.join(' · ');

  const sMin = profile.salary_min_paise;
  const sMax = profile.salary_max_paise;
  const p50Min  = Math.round(sMax * 1.05);
  const p50Max  = Math.round(sMax * 1.20);
  const topMin  = Math.round(sMax * 1.20);
  const topMax  = Math.round(sMax * 1.50);
  const p90Min  = Math.round(sMax * 1.50);
  const p90Max  = Math.round(sMax * 1.80);
  const maxBand = p90Max;
  const bw = (v: number) => `${Math.min(92, Math.round((v / maxBand) * 92))}%`;

  const salaryBands = [
    { label: 'Your current', min: sMin,   max: sMax,   color: '#B5D4F4' },
    { label: 'Market P50',   min: p50Min, max: p50Max, color: '#5DCAA5' },
    { label: 'Top matches',  min: topMin, max: topMax, color: '#378ADD' },
    { label: 'P90 ceiling',  min: p90Min, max: p90Max, color: '#7F77DD' },
  ];

  const metrics = [
    { label: 'Signals circling', value: '—', sub: 'After first match run', subColor: '#94a3b8' },
    { label: 'Profile views',    value: '—', sub: 'Last 30 days',          subColor: '#94a3b8' },
    { label: 'Top match score',  value: '—', sub: 'No matches yet',        subColor: '#94a3b8' },
    { label: 'Salary delta',     value: '—', sub: 'vs your current band',  subColor: '#94a3b8' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Nav ── */}
      <nav style={{
        background: '#fff', borderBottom: '0.5px solid #e2e8f0',
        padding: '0 24px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', letterSpacing: '-0.01em' }}>
          Job Lounge
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{profile.jl_id}</span>
          <button
            onClick={handleSignOut}
            style={{ fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Content ── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 20px 48px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>Welcome onboard!</span>
            <span style={{ fontSize: 18, fontWeight: 500, color: '#0f172a' }}>{subtitle}</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: '#0C447C',
            background: '#E6F1FB', borderRadius: 20,
            padding: '5px 12px', border: '0.5px solid #B5D4F4',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Fully anonymous
          </div>
        </div>

        {/* Pulse card */}
        <div style={{
          background: '#042C53', borderRadius: 14, padding: '20px 24px',
          marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#85B7EB', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              Your market pulse
            </span>
            <div style={{ fontSize: 32, fontWeight: 500, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
              {pulse.text}
              <span style={{ fontSize: 20, color: '#5DCAA5' }}>{pulse.arrow}</span>
            </div>
            <span style={{ fontSize: 13, color: '#B5D4F4', maxWidth: 320 }}>
              Matching engine runs nightly. Check back tomorrow for live matches.
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 52 }}>
              {[22, 18, 30, 26, 34, 40, 52].map((h, i) => (
                <div key={i} style={{
                  width: 10, height: h,
                  borderRadius: '3px 3px 0 0',
                  background: i === 6 ? '#5DCAA5' : '#185FA5',
                }} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: '#85B7EB' }}>7-week trend</span>
          </div>
        </div>

        {/* 4 metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, marginBottom: 20 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              background: '#f8fafc', borderRadius: 10,
              padding: '14px 16px', border: '0.5px solid #e2e8f0',
            }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: '#0f172a' }}>{m.value}</div>
              <div style={{ fontSize: 11, marginTop: 4, color: m.subColor }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Two col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>

          {/* Who's circling */}
          <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{
              fontSize: 13, fontWeight: 500, color: '#64748b',
              marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              Who's circling (anonymous)
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', padding: '20px 0', textAlign: 'center' as const }}>
              No signals yet. Appears after the nightly engine runs.
            </div>
          </div>

          {/* Top matches */}
          <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
            <div style={{
              fontSize: 13, fontWeight: 500, color: '#64748b',
              marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              Your top matches
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', padding: '20px 0', textAlign: 'center' as const }}>
              Best-fit requirements appear here once the engine runs.
            </div>
          </div>

        </div>

        {/* Salary reflection */}
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{
            fontSize: 13, fontWeight: 500, color: '#64748b',
            marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            Salary reflection — your profile vs live market
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 14 }}>
            Estimated bands — live data populates after first matching run
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {salaryBands.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#64748b', minWidth: 80 }}>{b.label}</span>
                <div style={{ flex: 1, height: 10, background: '#f1f5f9', borderRadius: 5, position: 'relative' as const }}>
                  <div style={{
                    position: 'absolute', left: 0, height: 10,
                    borderRadius: 5, background: b.color, width: bw(b.max),
                  }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#0f172a', minWidth: 72, textAlign: 'right' as const }}>
                  {formatLakh(b.min)}–{formatLakh(b.max)}
                </span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 12, paddingTop: 10, borderTop: '0.5px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              Based on your profile · {domainArr[0] ?? 'BFSI'} · {profile.current_city || 'India'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}