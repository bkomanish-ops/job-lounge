'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LoungerProfile {
  user_id: string;
  domain: string[];
  certifications: string[];
  experience_years: string;
  current_city: string;
  pulse_label: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  salary_min_paise: number;
  salary_max_paise: number;
  jl_id: string;
  skills: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPulseLabel(label: string | null): { text: string; color: string; arrow: string } {
  switch (label) {
    case 'HIGH':   return { text: 'High demand', color: '#fff', arrow: '↑' };
    case 'MEDIUM': return { text: 'Growing',     color: '#fff', arrow: '→' };
    default:       return { text: 'Steady',      color: '#B5D4F4', arrow: '–' };
  }
}

function formatLakh(paise: number): string {
  return `₹${(paise / 10_000_000).toFixed(0)}L`;
}

// ─── Component ───────────────────────────────────────────────────────────────

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

      const { data: profileData, error: profileErr } = await supabase
        .from('lounger_profiles')
        .select('user_id, domain, certifications, skills, experience_years, current_city, pulse_label, salary_min_paise, salary_max_paise, jl_id')
        .eq('user_id', user.id)
        .single();

      if (profileErr || !profileData) {
        router.push('/onboarding/lounger');
        return;
      }

      setProfile(profileData);
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

  if (!profile) return null;

  const pulse = getPulseLabel(profile.pulse_label);
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';
  function toArr(val: any): string[] {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try { const p = JSON.parse(val); return Array.isArray(p) ? p : [val]; } catch { return [val]; }
    }
    return [];
  }

  const domainArr = toArr(profile.domain);
  const skillsArr = toArr(profile.skills);
  const certsArr = toArr(profile.certifications);
  const profileLabel = `${domainArr[0] ?? 'Professional'} · ${profile.current_city}`;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#0f172a', letterSpacing: '-0.01em' }}>Job Lounge</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>{profile.jl_id}</span>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
            Sign out
          </button>
        </div>
      </nav>

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

        {/* Pulse card */}
        <div style={{ background: '#042C53', borderRadius: 14, padding: '20px 24px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#85B7EB', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your market pulse</span>
            <div style={{ fontSize: 30, fontWeight: 500, color: pulse.color, display: 'flex', alignItems: 'center', gap: 10 }}>
              {pulse.text}
              <span style={{ fontSize: 20, color: '#5DCAA5' }}>{pulse.arrow}</span>
            </div>
            <span style={{ fontSize: 13, color: '#B5D4F4' }}>Matching engine runs nightly. Check back tomorrow for live matches.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 52 }}>
              {[22, 18, 30, 26, 34, 40, 52].map((h, i) => (
                <div key={i} style={{ width: 10, height: h, borderRadius: '3px 3px 0 0', background: i === 6 ? '#5DCAA5' : '#185FA5' }} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: '#85B7EB' }}>7-week trend</span>
          </div>
        </div>

        {/* Profile summary */}
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '20px 24px', marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#64748b', marginBottom: 16 }}>Your anonymous profile</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Industry</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {domainArr.map(d => (
                  <span key={d} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: '#E6F1FB', color: '#0C447C' }}>{d}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Experience</div>
              <div style={{ fontSize: 13, color: '#0f172a' }}>{profile.experience_years}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Salary band</div>
              <div style={{ fontSize: 13, color: '#0f172a' }}>
                {formatLakh(profile.salary_min_paise)} – {formatLakh(profile.salary_max_paise)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Location</div>
              <div style={{ fontSize: 13, color: '#0f172a' }}>{profile.current_city}</div>
            </div>
          </div>
          {skillsArr.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skillsArr.slice(0, 6).map((s: string) => (
                  <span key={s} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: '#f1f5f9', color: '#475569' }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coming soon panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '20px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', marginBottom: 6 }}>Signals</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Who's circling your profile will appear here after the first matching run.</div>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '20px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', marginBottom: 6 }}>Top matches</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Your best-fit requirements will appear here once the engine runs.</div>
          </div>
        </div>

      </div>
    </div>
  );
}