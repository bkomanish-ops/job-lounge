'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ─── Data ─────────────────────────────────────────────────────────────────────

const DOMAINS = [
  'IT Audit', 'IS / Cyber Audit', 'Risk & Controls', 'Compliance',
  'Internal Audit', 'SOX / IFC', 'Finance & Accounts', 'Treasury',
  'Credit & Lending', 'Operations', 'Technology', 'HR & Talent',
  'Legal & Secretarial', 'Strategy & PMO', 'Other',
]

const SENIORITY = [
  { id: 'avp', label: 'AVP / Deputy Manager', years: '5–8 yrs' },
  { id: 'vp', label: 'VP / Manager', years: '8–12 yrs' },
  { id: 'svp', label: 'SVP / Senior Manager', years: '12–16 yrs' },
  { id: 'evp', label: 'EVP / AGM / DGM', years: '16–20 yrs' },
  { id: 'c', label: 'GM / C-Suite / Head', years: '20+ yrs' },
]

const URGENCY = [
  { id: 'immediate', label: 'Immediate', desc: 'Need someone in 30–60 days' },
  { id: 'planned', label: 'Planned', desc: 'Building for next quarter' },
  { id: 'exploratory', label: 'Exploratory', desc: 'Want to see who is quietly available' },
]

const STEPS = ['Domain', 'Seat details', 'Work email', 'Done']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ height: 3, background: '#f1f5f9', borderRadius: 2, marginBottom: 28 }}>
      <div style={{ height: 3, borderRadius: 2, background: '#e09020', width: `${((step) / total) * 100}%`, transition: 'width 0.3s' }} />
    </div>
  )
}

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : undefined }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600,
              background: i < current ? '#E1F5EE' : i === current ? '#854F0B' : '#f1f5f9',
              color: i < current ? '#0F6E56' : i === current ? '#fff' : '#94a3b8',
              border: i < current ? '0.5px solid #5DCAA5' : i === current ? 'none' : '0.5px solid #e2e8f0',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 10, color: i === current ? '#0f172a' : '#94a3b8', marginTop: 4, fontWeight: i === current ? 500 : 400 }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1, background: i < current ? '#5DCAA5' : '#e2e8f0', margin: '0 6px', marginBottom: 16 }} />
          )}
        </div>
      ))}
    </div>
  )
}

function AnonNote({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#FAEEDA', borderRadius: 8, padding: '10px 12px', marginBottom: 20 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span style={{ fontSize: 12, color: '#854F0B', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PeerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Step 1 — Domain
  const [domain, setDomain] = useState<string[]>([])

  // Step 2 — Seat details
  const [seniority, setSeniority] = useState('')
  const [urgency, setUrgency] = useState('')
  const [briefText, setBriefText] = useState('')

  // Step 3 — Work email
  const [workEmail, setWorkEmail] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  function toggleDomain(d: string) {
    setDomain(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : prev.length < 3 ? [...prev, d] : prev
    )
  }

  async function handleFinish() {
    if (!workEmail || !workEmail.includes('@')) {
      setError('Please enter a valid work email.')
      return
    }

    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Upsert peer profile
    const { error: profileErr } = await supabase
      .from('peer_profiles')
      .upsert({
        user_id: user.id,
        domain,
        seniority_band: seniority,
        hiring_urgency: urgency,
        brief_text: briefText,
        work_email: workEmail,
        company_verified: false,
      }, { onConflict: 'user_id' })

    if (profileErr) {
      setError('Failed to save profile. Please try again.')
      setSaving(false)
      return
    }

    // Mark onboarding done
    await supabase
      .from('users')
      .update({ onboarding_done: true })
      .eq('id', user.id)

    setSaving(false)
    setStep(3)
  }

  // ─── Step renders ──────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Job Lounge</span>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#FAEEDA', color: '#854F0B', fontWeight: 600 }}>Peer</span>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '36px 20px' }}>

        <ProgressBar step={step + 1} total={STEPS.length} />
        <StepIndicator current={step} steps={STEPS} />

        {/* ── Step 0: Domain ── */}
        {step === 0 && (
          <div style={card}>
            <div style={title}>What domain is the seat in?</div>
            <div style={sub}>Select up to 3 domains that describe the open role.</div>

            <AnonNote text="You are posting on behalf of your organisation. Your personal identity stays hidden until you choose to reveal it." />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {DOMAINS.map(d => (
                <button
                  key={d}
                  onClick={() => toggleDomain(d)}
                  style={{
                    fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                    border: domain.includes(d) ? '1px solid #e09020' : '0.5px solid #e2e8f0',
                    background: domain.includes(d) ? '#FAEEDA' : '#fff',
                    color: domain.includes(d) ? '#854F0B' : '#475569',
                    fontFamily: 'Inter, sans-serif', fontWeight: domain.includes(d) ? 600 : 400,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            <div style={btnRow}>
              <button onClick={() => router.push('/onboarding')} style={backBtn}>← Back</button>
              <button
                onClick={() => domain.length > 0 && setStep(1)}
                disabled={domain.length === 0}
                style={{ ...nextBtn, background: domain.length === 0 ? '#cbd5e1' : '#854F0B' }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Seat details ── */}
        {step === 1 && (
          <div style={card}>
            <div style={title}>Tell us about the seat</div>
            <div style={sub}>This helps match the right Loungers to your requirement.</div>

            <label style={label}>Seniority level needed</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {SENIORITY.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSeniority(s.id)}
                  style={{
                    padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                    border: seniority === s.id ? '1.5px solid #e09020' : '0.5px solid #e2e8f0',
                    background: seniority === s.id ? '#FAEEDA' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: seniority === s.id ? 600 : 400, color: seniority === s.id ? '#854F0B' : '#0f172a' }}>{s.label}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{s.years}</span>
                </div>
              ))}
            </div>

            <label style={label}>How urgent is this?</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {URGENCY.map(u => (
                <div
                  key={u.id}
                  onClick={() => setUrgency(u.id)}
                  style={{
                    flex: 1, minWidth: 120, padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    border: urgency === u.id ? '1.5px solid #e09020' : '0.5px solid #e2e8f0',
                    background: urgency === u.id ? '#FAEEDA' : '#fff',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: urgency === u.id ? '#854F0B' : '#0f172a', marginBottom: 2 }}>{u.label}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{u.desc}</div>
                </div>
              ))}
            </div>

            <label style={label}>Brief (optional, max 220 characters)</label>
            <textarea
              value={briefText}
              onChange={e => setBriefText(e.target.value.slice(0, 220))}
              placeholder="e.g. Mid-size private bank, IT Audit team, CISA preferred, Mumbai based, immediate joining..."
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', fontSize: 13, border: '0.5px solid #e2e8f0',
                borderRadius: 8, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a',
                resize: 'none', boxSizing: 'border-box', marginBottom: 6,
              }}
            />
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', marginBottom: 20 }}>
              {briefText.length}/220
            </div>

            <div style={btnRow}>
              <button onClick={() => setStep(0)} style={backBtn}>← Back</button>
              <button
                onClick={() => seniority && urgency && setStep(2)}
                disabled={!seniority || !urgency}
                style={{ ...nextBtn, background: !seniority || !urgency ? '#cbd5e1' : '#854F0B' }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Work email ── */}
        {step === 2 && (
          <div style={card}>
            <div style={title}>Your work email</div>
            <div style={sub}>We use this to verify your company. It is never shown to anyone on the platform.</div>

            <AnonNote text="Your work email is used only for company verification. Loungers will see your company as 'Mid-size Private Bank' or similar — never your email or name." />

            <label style={label}>Work email address</label>
            <input
              type="email"
              value={workEmail}
              onChange={e => { setWorkEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleFinish()}
              placeholder="you@yourcompany.com"
              autoFocus
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                border: error ? '1px solid #e24b4a' : '0.5px solid #e2e8f0',
                borderRadius: 8, outline: 'none', fontFamily: 'Inter, sans-serif',
                color: '#0f172a', boxSizing: 'border-box', marginBottom: error ? 6 : 20,
              }}
            />
            {error && <p style={{ fontSize: 12, color: '#e24b4a', margin: '0 0 16px' }}>{error}</p>}

            <div style={btnRow}>
              <button onClick={() => setStep(1)} style={backBtn}>← Back</button>
              <button
                onClick={handleFinish}
                disabled={saving}
                style={{ ...nextBtn, background: saving ? '#cbd5e1' : '#854F0B', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving…' : 'Complete setup →'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 3 && (
          <div style={{ ...card, textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FAEEDA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>
              🤝
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>You're all set</div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>
              Your seat is in the system. Job Lounge will match anonymous Lounger profiles to your requirement. You'll be notified when a strong match surfaces.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Domain', value: domain.join(', ') },
                { label: 'Urgency', value: URGENCY.find(u => u.id === urgency)?.label ?? '' },
                { label: 'Seniority', value: SENIORITY.find(s => s.id === seniority)?.label ?? '' },
                { label: 'Company', value: 'Verification pending' },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{stat.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{stat.value}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push('/dashboard/peer')}
              style={{ ...nextBtn, background: '#854F0B', width: '100%', padding: '12px 0', fontSize: 14 }}
            >
              Go to dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff',
  border: '0.5px solid #e2e8f0',
  borderRadius: 14,
  padding: '24px 24px 20px',
}

const title: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: '#0f172a',
  marginBottom: 4,
}

const sub: React.CSSProperties = {
  fontSize: 13,
  color: '#64748b',
  marginBottom: 20,
  lineHeight: 1.5,
}

const label: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: '#475569',
  display: 'block',
  marginBottom: 8,
}

const btnRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 4,
}

const backBtn: React.CSSProperties = {
  fontSize: 13,
  color: '#64748b',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px 0',
  fontFamily: 'Inter, sans-serif',
}

const nextBtn: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  padding: '8px 24px',
  borderRadius: 20,
  border: 'none',
  cursor: 'pointer',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
  transition: 'background 0.15s',
}