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

const CERTIFICATIONS = ['CISA', 'CISM', 'CIA', 'DISA', 'FRM', 'CRISC', 'CPA', 'CA', 'CFA', 'PMP']

const CITIES = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Other']

const MODES = ['On-site', 'Hybrid', 'Remote-first']

const URGENCY = [
  { id: 'immediate', label: 'Immediate', desc: 'Need someone in 30–60 days' },
  { id: 'planned', label: 'Planned', desc: 'Building for next quarter' },
  { id: 'exploratory', label: 'Exploratory', desc: 'Want to see who is quietly available' },
]

const KNOWN_COMPANIES = [
  'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'SBI', 'Yes Bank',
  'IndusInd Bank', 'Bajaj Finance', 'Bajaj Finserv', 'HDFC Ltd', 'LIC Housing Finance',
  'Deloitte', 'PwC', 'EY', 'KPMG', 'Grant Thornton', 'BDO',
  'Accenture', 'TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant',
  'McKinsey', 'BCG', 'Bain', 'Oliver Wyman',
  'SEBI', 'RBI', 'IRDAI', 'PFRDA',
  'Aditya Birla Capital', 'Mahindra Finance', 'Muthoot Finance', 'Shriram Finance',
  'ICICI Prudential', 'HDFC Life', 'SBI Life', 'Max Life', 'Bajaj Allianz',
]

const STEPS = ['The role', 'The hook', 'Your details', 'Done']

// ─── Helpers ──────────────────────────────────────────────────────────────────

const amber = '#854F0B'
const amberLight = '#FAEEDA'
const amberBorder = '#e09020'

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ height: 3, background: '#f1f5f9', borderRadius: 2, marginBottom: 28 }}>
      <div style={{ height: 3, borderRadius: 2, background: amberBorder, width: `${(step / total) * 100}%`, transition: 'width 0.3s' }} />
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
              background: i < current ? amberLight : i === current ? amber : '#f1f5f9',
              color: i < current ? amber : i === current ? '#fff' : '#94a3b8',
              border: i < current ? `0.5px solid ${amberBorder}` : i === current ? 'none' : '0.5px solid #e2e8f0',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 10, color: i === current ? '#0f172a' : '#94a3b8', marginTop: 4, fontWeight: i === current ? 500 : 400 }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1, background: i < current ? amberBorder : '#e2e8f0', margin: '0 6px', marginBottom: 16 }} />
          )}
        </div>
      ))}
    </div>
  )
}

function AnonNote({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: amberLight, borderRadius: 8, padding: '10px 12px', marginBottom: 20 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span style={{ fontSize: 12, color: amber, lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
        border: selected ? `1px solid ${amberBorder}` : '0.5px solid #e2e8f0',
        background: selected ? amberLight : '#fff',
        color: selected ? amber : '#475569',
        fontFamily: 'Inter, sans-serif', fontWeight: selected ? 600 : 400,
      }}
    >
      {label}
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PeerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Step 0 — The role
  const [domain, setDomain] = useState<string[]>([])
  const [certs, setCerts] = useState<string[]>([])
  const [city, setCity] = useState('')
  const [mode, setMode] = useState('')
  const [salaryMin, setSalaryMin] = useState(20)
  const [salaryMax, setSalaryMax] = useState(40)

  // Step 1 — The hook
  const [briefText, setBriefText] = useState('')
  const [urgency, setUrgency] = useState('')

  // Step 2 — Your details
  const [companyName, setCompanyName] = useState('')
  const [companySuggestions, setCompanySuggestions] = useState<string[]>([])
  const [showCompanyName, setShowCompanyName] = useState(true)
  const [workEmail, setWorkEmail] = useState('')
  const [workOtpSent, setWorkOtpSent] = useState(false)
  const [workOtp, setWorkOtp] = useState('')
  const [workEmailVerified, setWorkEmailVerified] = useState(false)
  const [workOtpLoading, setWorkOtpLoading] = useState(false)
  const [workOtpError, setWorkOtpError] = useState('')
  const [skippedVerification, setSkippedVerification] = useState(false)

  // Done state
  const [done, setDone] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  function toggleDomain(d: string) {
    setDomain(prev => prev.includes(d) ? prev.filter(x => x !== d) : prev.length < 3 ? [...prev, d] : prev)
  }

  function toggleCert(c: string) {
    setCerts(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  function handleCompanyInput(val: string) {
    setCompanyName(val)
    if (val.length < 2) { setCompanySuggestions([]); return }
    const matches = KNOWN_COMPANIES.filter(c => c.toLowerCase().includes(val.toLowerCase())).slice(0, 5)
    setCompanySuggestions(matches)
  }

  function selectCompany(c: string) {
    setCompanyName(c)
    setCompanySuggestions([])
  }

  async function saveCustomCompany(name: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || KNOWN_COMPANIES.includes(name)) return
    await supabase.from('custom_options').upsert({
      category: 'company_name',
      value: name,
      added_by: user.id,
      approved: false,
    }, { onConflict: 'category,value' })
  }

  async function sendWorkOtp() {
    if (!workEmail || !workEmail.includes('@')) {
      setWorkOtpError('Please enter a valid work email.')
      return
    }
    setWorkOtpLoading(true)
    setWorkOtpError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: workEmail,
      options: { shouldCreateUser: false },
    })
    setWorkOtpLoading(false)
    if (error) {
      setWorkOtpError('Failed to send OTP. Please try again.')
      return
    }
    setWorkOtpSent(true)
  }

  async function verifyWorkOtp() {
    if (workOtp.length !== 8) { setWorkOtpError('Please enter the 8-digit code.'); return }
    setWorkOtpLoading(true)
    setWorkOtpError('')
    const { error } = await supabase.auth.verifyOtp({
      email: workEmail,
      token: workOtp,
      type: 'email',
    })
    setWorkOtpLoading(false)
    if (error) { setWorkOtpError('Invalid or expired code. Please try again.'); return }
    setWorkEmailVerified(true)
  }

  async function handleFinish(skipped = false) {
    setSaving(true)
    setError('')
    setSkippedVerification(skipped)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Save custom company if not in known list
    if (companyName && !KNOWN_COMPANIES.includes(companyName)) {
      await saveCustomCompany(companyName)
    }

    const companyDomain = workEmail.includes('@') ? workEmail.split('@')[1] : ''

    const { error: profileErr } = await supabase
      .from('peer_profiles')
      .upsert({
        user_id: user.id,
        full_name: '',
        company_name: companyName,
        company_domain: companyDomain,
        work_email: workEmail,
        function_area: domain[0] ?? '',
        city,
        display_company: showCompanyName ? companyName : '',
        show_company_name: showCompanyName,
        verified: workEmailVerified,
        domain,
        seniority_band: '',
        hiring_urgency: urgency,
        brief_text: briefText,
        company_verified: workEmailVerified,
      }, { onConflict: 'user_id' })

    if (profileErr) {
      setError('Failed to save profile. Please try again.')
      setSaving(false)
      return
    }

    // Save requirement
    const { data: { user: u2 } } = await supabase.auth.getUser()
    await supabase.from('requirements').insert({
      posted_by_peer: user.id,
      flash_brief: briefText,
      domain,
      certifications_needed: certs,
      experience_min_years: 5,
      experience_max_years: 20,
      positions_count: 1,
      hiring_city: city,
      company_domain: companyDomain,
      salary_min_paise: salaryMin * 10_000_000,
      salary_max_paise: salaryMax * 10_000_000,
      hiring_intent: urgency,
      expected_timeline: urgency === 'immediate' ? '30-60 days' : urgency === 'planned' ? '60-90 days' : 'Flexible',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    await supabase.from('users').update({ onboarding_done: true }).eq('id', user.id)

    setSaving(false)
    setDone(true)
    setStep(3)
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Job Lounge</span>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: amberLight, color: amber, fontWeight: 600 }}>Peer</span>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '36px 20px' }}>

        <ProgressBar step={step + 1} total={STEPS.length} />
        <StepIndicator current={step} steps={STEPS} />

        {/* ── Step 0: The role ── */}
        {step === 0 && (
          <div style={card}>
            <div style={titleStyle}>What are you hiring for?</div>
            <div style={subStyle}>No JD upload. Three minutes, not three hours. You're writing a flash brief — not a job posting.</div>

            <AnonNote text="You are posting on behalf of your organisation. Your personal identity stays hidden until you choose to reveal it." />

            <label style={labelStyle}>Domain (up to 3)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 20 }}>
              {DOMAINS.map(d => <Chip key={d} label={d} selected={domain.includes(d)} onClick={() => toggleDomain(d)} />)}
            </div>

            <label style={labelStyle}>Must-have certifications</label>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 20 }}>
              {CERTIFICATIONS.map(c => <Chip key={c} label={c} selected={certs.includes(c)} onClick={() => toggleCert(c)} />)}
            </div>

            <label style={labelStyle}>Location</label>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 20 }}>
              {CITIES.map(c => <Chip key={c} label={c} selected={city === c} onClick={() => setCity(c)} />)}
            </div>

            <label style={labelStyle}>Work mode</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {MODES.map(m => <Chip key={m} label={m} selected={mode === m} onClick={() => setMode(m)} />)}
            </div>

            <label style={labelStyle}>CTC band you can offer</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>From</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="range" min={10} max={100} step={2} value={salaryMin}
                    onChange={e => setSalaryMin(Number(e.target.value))}
                    style={{ flex: 1, accentColor: amber }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', minWidth: 40 }}>₹{salaryMin}L</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>To</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="range" min={10} max={150} step={2} value={salaryMax}
                    onChange={e => setSalaryMax(Number(e.target.value))}
                    style={{ flex: 1, accentColor: amber }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', minWidth: 40 }}>₹{salaryMax}L</span>
                </div>
              </div>
            </div>

            <div style={btnRow}>
              <span />
              <button
                onClick={() => domain.length > 0 && city && mode ? setStep(1) : null}
                disabled={domain.length === 0 || !city || !mode}
                style={{ ...nextBtn, background: domain.length === 0 || !city || !mode ? '#cbd5e1' : amber }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: The hook ── */}
        {step === 1 && (
          <div style={card}>
            <div style={titleStyle}>Write the hook — 3 lines max</div>
            <div style={subStyle}>This is what a matched Lounger reads first. Make it feel like a conversation, not a JD. What makes this role actually worth considering?</div>

            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 14px', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 4 }}>What works</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                Mention why the seat is open. Name what's unusual about the opportunity. Be honest about the hard parts. Audit professionals are trained to spot vague language — they'll ignore it.
              </div>
            </div>

            <label style={labelStyle}>Your hook (max 220 characters)</label>
            <textarea
              value={briefText}
              onChange={e => setBriefText(e.target.value.slice(0, 220))}
              placeholder="e.g. Direct report to the CRO. Leading a team of 6. The seat has been open 34 days because the right person doesn't apply on job boards — which is exactly why we're here."
              rows={4}
              style={{
                width: '100%', padding: '10px 12px', fontSize: 13,
                border: '0.5px solid #e2e8f0', borderRadius: 8, outline: 'none',
                fontFamily: 'Inter, sans-serif', color: '#0f172a',
                resize: 'none', boxSizing: 'border-box' as const, marginBottom: 4, lineHeight: 1.6,
              }}
            />
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' as const, marginBottom: 20 }}>
              {220 - briefText.length} left
            </div>

            <label style={labelStyle}>Urgency</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' as const }}>
              {URGENCY.map(u => (
                <div
                  key={u.id}
                  onClick={() => setUrgency(u.id)}
                  style={{
                    flex: 1, minWidth: 120, padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    border: urgency === u.id ? `1.5px solid ${amberBorder}` : '0.5px solid #e2e8f0',
                    background: urgency === u.id ? amberLight : '#fff',
                    textAlign: 'center' as const,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: urgency === u.id ? amber : '#0f172a', marginBottom: 2 }}>{u.label}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{u.desc}</div>
                </div>
              ))}
            </div>

            <div style={btnRow}>
              <button onClick={() => setStep(0)} style={backBtn}>← Back</button>
              <button
                onClick={() => briefText.length > 20 && urgency ? setStep(2) : null}
                disabled={briefText.length < 20 || !urgency}
                style={{ ...nextBtn, background: briefText.length < 20 || !urgency ? '#cbd5e1' : amber }}
              >
                Preview →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Your details ── */}
        {step === 2 && (
          <div style={card}>
            <div style={titleStyle}>Your details</div>
            <div style={subStyle}>Used for company verification. Never shown to Loungers without your consent.</div>

            <AnonNote text="Your work email verifies your company affiliation. Loungers see only your company display name — never your email or personal identity." />

            {/* Company name */}
            <label style={labelStyle}>Company name</label>
            <div style={{ position: 'relative' as const, marginBottom: 20 }}>
              <input
                type="text"
                value={companyName}
                onChange={e => handleCompanyInput(e.target.value)}
                placeholder="Start typing your company name…"
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 13,
                  border: '0.5px solid #e2e8f0', borderRadius: 8, outline: 'none',
                  fontFamily: 'Inter, sans-serif', color: '#0f172a', boxSizing: 'border-box' as const,
                }}
              />
              {companySuggestions.length > 0 && (
                <div style={{
                  position: 'absolute' as const, top: '100%', left: 0, right: 0, zIndex: 10,
                  background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden',
                }}>
                  {companySuggestions.map(c => (
                    <div
                      key={c}
                      onClick={() => selectCompany(c)}
                      style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: '#0f172a', borderBottom: '0.5px solid #f1f5f9' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display preference */}
            <label style={labelStyle}>How should your company appear to Loungers?</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[
                { val: true, label: `Show "${companyName || 'Company name'}"` },
                { val: false, label: 'Show anonymised (e.g. "Mid-size Private Bank")' },
              ].map(opt => (
                <div
                  key={String(opt.val)}
                  onClick={() => setShowCompanyName(opt.val)}
                  style={{
                    flex: 1, padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    border: showCompanyName === opt.val ? `1.5px solid ${amberBorder}` : '0.5px solid #e2e8f0',
                    background: showCompanyName === opt.val ? amberLight : '#fff',
                    fontSize: 12, color: showCompanyName === opt.val ? amber : '#475569',
                    fontWeight: showCompanyName === opt.val ? 600 : 400, lineHeight: 1.5,
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>

            {/* Work email OTP */}
            <label style={labelStyle}>Work email</label>
            {!workEmailVerified ? (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: workOtpSent ? 12 : 20 }}>
                  <input
                    type="email"
                    value={workEmail}
                    onChange={e => { setWorkEmail(e.target.value); setWorkOtpError('') }}
                    placeholder="you@yourcompany.com"
                    disabled={workOtpSent}
                    style={{
                      flex: 1, padding: '10px 14px', fontSize: 13,
                      border: '0.5px solid #e2e8f0', borderRadius: 8, outline: 'none',
                      fontFamily: 'Inter, sans-serif', color: '#0f172a', boxSizing: 'border-box' as const,
                      background: workOtpSent ? '#f8fafc' : '#fff',
                    }}
                  />
                  {!workOtpSent && (
                    <button
                      onClick={sendWorkOtp}
                      disabled={workOtpLoading}
                      style={{ ...nextBtn, background: amber, padding: '10px 16px', fontSize: 12, borderRadius: 8, opacity: workOtpLoading ? 0.7 : 1 }}
                    >
                      {workOtpLoading ? 'Sending…' : 'Send OTP'}
                    </button>
                  )}
                </div>

                {workOtpSent && (
                  <>
                    <div style={{ fontSize: 12, color: '#0F6E56', marginBottom: 8 }}>
                      Code sent to {workEmail}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        value={workOtp}
                        onChange={e => { setWorkOtp(e.target.value.replace(/\D/g, '')); setWorkOtpError('') }}
                        placeholder="8-digit code"
                        autoFocus
                        style={{
                          flex: 1, padding: '10px 14px', fontSize: 18, fontWeight: 600,
                          letterSpacing: 6, textAlign: 'center' as const,
                          border: workOtpError ? '1px solid #e24b4a' : '0.5px solid #e2e8f0',
                          borderRadius: 8, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a',
                          boxSizing: 'border-box' as const,
                        }}
                      />
                      <button
                        onClick={verifyWorkOtp}
                        disabled={workOtpLoading}
                        style={{ ...nextBtn, background: amber, padding: '10px 16px', fontSize: 12, borderRadius: 8, opacity: workOtpLoading ? 0.7 : 1 }}
                      >
                        {workOtpLoading ? 'Verifying…' : 'Verify'}
                      </button>
                    </div>
                    {workOtpError && <p style={{ fontSize: 12, color: '#e24b4a', margin: '0 0 8px' }}>{workOtpError}</p>}
                    <button
                      onClick={() => setWorkOtpSent(false)}
                      style={{ fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 4 }}
                    >
                      ← Change email
                    </button>
                  </>
                )}

                {workOtpError && !workOtpSent && <p style={{ fontSize: 12, color: '#e24b4a', margin: '-12px 0 12px' }}>{workOtpError}</p>}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#E1F5EE', borderRadius: 8, marginBottom: 20, border: '0.5px solid #5DCAA5' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span style={{ fontSize: 13, color: '#085041', fontWeight: 500 }}>{workEmail} — verified</span>
              </div>
            )}

            {error && <p style={{ fontSize: 12, color: '#e24b4a', margin: '0 0 12px' }}>{error}</p>}

            <div style={btnRow}>
              <button onClick={() => setStep(1)} style={backBtn}>← Back</button>
              <div style={{ display: 'flex', gap: 8 }}>
                {!workEmailVerified && (
                  <button
                    onClick={() => handleFinish(true)}
                    disabled={saving || !companyName}
                    style={{ ...backBtn, border: '0.5px solid #e2e8f0', padding: '8px 16px', borderRadius: 20, fontSize: 12 }}
                  >
                    Skip verification
                  </button>
                )}
                <button
                  onClick={() => handleFinish(false)}
                  disabled={saving || !companyName || (!workEmailVerified && !skippedVerification)}
                  style={{
                    ...nextBtn,
                    background: saving || !companyName || (!workEmailVerified && workOtpSent && !skippedVerification) ? '#cbd5e1' : amber,
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Saving…' : 'Complete setup →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 3 && (
          <div style={{ ...card, textAlign: 'center' as const }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: amberLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>
              🎯
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Your flash brief is live</div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
              Job Lounge will match anonymous Lounger profiles to your requirement. You'll be notified when a strong match surfaces.
            </div>

            {/* Verification status */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
              padding: '5px 12px', borderRadius: 20, marginBottom: 20,
              background: workEmailVerified ? '#E1F5EE' : '#FEF3C7',
              color: workEmailVerified ? '#085041' : '#854F0B',
              border: `0.5px solid ${workEmailVerified ? '#5DCAA5' : '#e09020'}`,
            }}>
              {workEmailVerified ? '✓ Verified' : '⏳ Verification pending'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24, textAlign: 'left' as const }}>
              {[
                { label: 'Domain', value: domain.join(', ') },
                { label: 'Urgency', value: URGENCY.find(u => u.id === urgency)?.label ?? '' },
                { label: 'Location', value: `${city} · ${mode}` },
                { label: 'CTC band', value: `₹${salaryMin}L – ₹${salaryMax}L` },
                { label: 'Company', value: companyName },
                { label: 'Certs needed', value: certs.length > 0 ? certs.join(', ') : 'None specified' },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{stat.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/dashboard/peer')}
              style={{ ...nextBtn, background: amber, width: '100%', padding: '12px 0', fontSize: 14 }}
            >
              Go to dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '24px 24px 20px',
}
const titleStyle: React.CSSProperties = {
  fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 4,
}
const subStyle: React.CSSProperties = {
  fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5,
}
const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 500, color: '#475569', display: 'block', marginBottom: 8,
}
const btnRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4,
}
const backBtn: React.CSSProperties = {
  fontSize: 13, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', fontFamily: 'Inter, sans-serif',
}
const nextBtn: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, padding: '8px 24px', borderRadius: 20, border: 'none', cursor: 'pointer', color: '#fff', fontFamily: 'Inter, sans-serif',
}