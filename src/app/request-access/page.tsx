'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Role = 'lounger' | 'peer' | 'recruiter' | null

type SubmittedState =
  | 'fresh'           // new request submitted
  | 'pending'         // already submitted, still pending
  | 'approved'        // already approved — go login
  | 'held'            // held or rejected
  | 'registered'      // already in users table

const ROLES = [
  {
    id: 'lounger' as Role,
    text: 'I want to know what opportunities exist for someone like me — without anyone knowing I looked',
  },
  {
    id: 'peer' as Role,
    text: 'I have a seat open and the right person is not visible on any platform',
  },
  {
    id: 'recruiter' as Role,
    text: "I'm a hiring professional and the talent I need doesn't apply on job boards",
  },
]

export default function RequestAccessPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>(null)
  const [submitted, setSubmitted] = useState<SubmittedState | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit() {
    const trimmed = email.trim().toLowerCase()

    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    if (!role) {
      setErrorMsg('Please select what brings you here.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    // Check if already a registered user
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', trimmed)
      .maybeSingle()

    if (existingUser) {
      setSubmitted('registered')
      setLoading(false)
      return
    }

    // Check if already on waitlist
    const { data: existingWaitlist } = await supabase
      .from('waitlist')
      .select('status')
      .eq('email', trimmed)
      .maybeSingle()

    if (existingWaitlist) {
      const s = existingWaitlist.status
      if (s === 'pending') { setSubmitted('pending'); setLoading(false); return }
      if (s === 'approved') { setSubmitted('approved'); setLoading(false); return }
      if (s === 'held' || s === 'rejected') { setSubmitted('held'); setLoading(false); return }
    }

    // New entry — insert
    const { error } = await supabase
      .from('waitlist')
      .insert({ email: trimmed, role_requested: role })

    setLoading(false)

    if (error) {
      // Catch any unexpected duplicate or constraint error gracefully
      if (error.code === '23505') {
        // Race condition — already exists, re-check
        const { data: recheck } = await supabase
          .from('waitlist')
          .select('status')
          .eq('email', trimmed)
          .maybeSingle()
        if (recheck?.status === 'approved') { setSubmitted('approved'); return }
        setSubmitted('pending')
        return
      }
      setErrorMsg('Something went wrong. Please try again.')
      return
    }

    setSubmitted('fresh')
  }

  // ─── Submitted screens ─────────────────────────────────────────────────────

  if (submitted === 'fresh') {
    return (
      <div style={styles.page}>
        <Logo />
        <div style={styles.card}>
          <div style={styles.iconWrap('#E1F5EE')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={styles.heading}>Request received</h2>
          <p style={styles.subtext}>Job Lounge reviews every request personally. You will hear from us within 24 hours at</p>
          <p style={styles.emailDisplay}>{email}</p>
          <p style={styles.hint}>If approved, you will receive a one-time code on this email to complete your registration.</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (submitted === 'pending') {
    return (
      <div style={styles.page}>
        <Logo />
        <div style={styles.card}>
          <div style={styles.iconWrap('#FEF3C7')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 style={styles.heading}>Request under review</h2>
          <p style={styles.subtext}>Your request for</p>
          <p style={styles.emailDisplay}>{email}</p>
          <p style={styles.subtext}>is already under review. Job Lounge will get back to you within 24 hours.</p>
          <p style={{ ...styles.hint, marginTop: 16 }}>Once approved, use the Login option to access your account.</p>
          <button onClick={() => router.push('/login')} style={{ ...styles.primaryBtn, marginTop: 20 }}>
            Go to login →
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  if (submitted === 'approved') {
    return (
      <div style={styles.page}>
        <Logo />
        <div style={styles.card}>
          <div style={styles.iconWrap('#E6F1FB')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0C447C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 style={styles.heading}>You're already approved</h2>
          <p style={styles.subtext}>Your access request for</p>
          <p style={styles.emailDisplay}>{email}</p>
          <p style={styles.subtext}>has already been approved. Please log in to continue.</p>
          <button onClick={() => router.push('/login')} style={{ ...styles.primaryBtn, marginTop: 20 }}>
            Log in now →
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  if (submitted === 'held') {
    return (
      <div style={styles.page}>
        <Logo />
        <div style={styles.card}>
          <div style={styles.iconWrap('#FEE2E2')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 style={styles.heading}>Request not approved</h2>
          <p style={styles.subtext}>We were unable to approve the request for</p>
          <p style={styles.emailDisplay}>{email}</p>
          <p style={styles.hint}>If you believe this is an error, please reach out to Job Lounge directly.</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (submitted === 'registered') {
    return (
      <div style={styles.page}>
        <Logo />
        <div style={styles.card}>
          <div style={styles.iconWrap('#E6F1FB')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0C447C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 style={styles.heading}>Already registered</h2>
          <p style={styles.subtext}>This email is already registered on Job Lounge. Please log in to continue.</p>
          <button onClick={() => router.push('/login')} style={{ ...styles.primaryBtn, marginTop: 20 }}>
            Go to login →
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  // ─── Main form ─────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>
      <Logo />
      <div style={styles.card}>
        <h1 style={{ fontSize: 19, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>
          Request access
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', lineHeight: 1.5 }}>
          Job Lounge is invite-only. Tell us who you are and we'll review your request personally.
        </p>

        <label style={styles.label}>Your personal email</label>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErrorMsg('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="you@gmail.com"
          autoFocus
          style={{
            ...styles.input,
            borderColor: errorMsg && !email ? '#e24b4a' : '#cbd5e1',
            marginBottom: 20,
          }}
        />

        <label style={styles.label}>What brings you to Job Lounge?</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {ROLES.map(r => (
            <div
              key={r.id}
              onClick={() => { setRole(r.id); setErrorMsg('') }}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: role === r.id ? '1.5px solid #4f8ef7' : errorMsg && !role ? '1.5px solid #e24b4a' : '1px solid #e2e8f0',
                background: role === r.id ? '#f0f6ff' : '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                border: role === r.id ? '5px solid #4f8ef7' : '1.5px solid #cbd5e1',
                transition: 'all 0.15s',
              }} />
              <span style={{ fontSize: 13, color: role === r.id ? '#0f172a' : '#475569', lineHeight: 1.5, fontWeight: role === r.id ? 500 : 400 }}>
                {r.text}
              </span>
            </div>
          ))}
        </div>

        {errorMsg && <p style={{ fontSize: 12, color: '#e24b4a', margin: '-12px 0 16px' }}>{errorMsg}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Submitting…' : 'Request access'}
        </button>

        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 20, textAlign: 'center' }}>
          Already have access?{' '}
          <span onClick={() => router.push('/login')} style={{ color: '#4f8ef7', cursor: 'pointer', textDecoration: 'underline' }}>
            Log in
          </span>
        </p>
      </div>
      <Footer />
    </div>
  )
}

// ─── Shared components ────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ marginBottom: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>Job Lounge</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Opportunity First. Identity Later.</div>
    </div>
  )
}

function Footer() {
  return (
    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 20, textAlign: 'center' }}>
      Your identity is never shared without your consent.
    </p>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
  },
  card: {
    background: '#fff',
    border: '0.5px solid #e2e8f0',
    borderRadius: 16,
    padding: '32px 28px',
    width: '100%',
    maxWidth: 420,
  },
  iconWrap: (bg: string) => ({
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  }),
  heading: {
    fontSize: 19,
    fontWeight: 600,
    color: '#0f172a',
    margin: '0 0 8px',
    textAlign: 'center' as const,
  },
  subtext: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.6,
    textAlign: 'center' as const,
    margin: '0 0 4px',
  },
  emailDisplay: {
    fontSize: 14,
    fontWeight: 500,
    color: '#0f172a',
    textAlign: 'center' as const,
    margin: '4px 0 8px',
  },
  hint: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 1.6,
    textAlign: 'center' as const,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: '#475569',
    display: 'block' as const,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    outline: 'none',
    color: '#0f172a',
    background: '#fff',
    boxSizing: 'border-box' as const,
    fontFamily: 'Inter, sans-serif',
    display: 'block' as const,
  },
  primaryBtn: {
    width: '100%',
    padding: '11px 0',
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    background: '#4f8ef7',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    display: 'block' as const,
  },
}