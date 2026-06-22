'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Step = 'email' | 'otp'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>('email')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // ─── Step 1: Email ─────────────────────────────────────────────────────────

  async function handleEmailSubmit() {
    const trimmed = email.trim().toLowerCase()

    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    const { data: waitlistEntry } = await supabase
      .from('waitlist')
      .select('status')
      .eq('email', trimmed)
      .maybeSingle()

    if (!waitlistEntry) {
      setErrorMsg('not_registered')
      setLoading(false)
      return
    }

    if (waitlistEntry.status === 'pending') {
      setErrorMsg('pending')
      setLoading(false)
      return
    }

    if (waitlistEntry.status === 'held' || waitlistEntry.status === 'rejected') {
      setErrorMsg('not_approved')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { shouldCreateUser: true },
    })

    setLoading(false)

    if (error) {
      setErrorMsg('otp_failed')
      return
    }

    setStep('otp')
  }

  // ─── Step 2: OTP ───────────────────────────────────────────────────────────

  async function handleOtpVerify() {
    if (otp.length !== 8) {
      setErrorMsg('Please enter the 8-digit code.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: 'email',
    })

    if (error || !data.user) {
      setErrorMsg('Invalid or expired code. Please try again.')
      setLoading(false)
      return
    }

    // Wait for handle_new_auth_user trigger to create the public.users row
    // Retry up to 5 times with 500ms delay
    let userData = null
    for (let i = 0; i < 5; i++) {
      const { data: row } = await supabase
        .from('users')
        .select('roles, onboarding_done')
        .eq('id', data.user.id)
        .maybeSingle()

      if (row) {
        userData = row
        break
      }

      await new Promise(res => setTimeout(res, 500))
    }

    setLoading(false)

    console.log('USER ID:', data.user.id)
    console.log('USER DATA:', JSON.stringify(userData))

    if (!userData || !userData.roles || userData.roles.length === 0 || !userData.onboarding_done) {
      router.push('/onboarding')
      return
    }

    router.push(`/dashboard/${userData.roles[0]}`)
  }

  async function handleResend() {
    setOtp('')
    setErrorMsg('')
    setLoading(true)

    await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    })

    setLoading(false)
    setErrorMsg('resent')
  }

  // ─── Error renderer ────────────────────────────────────────────────────────

  function renderEmailError() {
    if (!errorMsg) return null

    if (errorMsg === 'not_registered') {
      return (
        <div style={errorBox('#FEF3C7', '#854F0B')}>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: '#854F0B' }}>
            This email is not registered on Job Lounge.
          </p>
          <button
            onClick={() => router.push('/request-access')}
            style={inlineBtn('#854F0B', '#FEF3C7')}
          >
            Request access →
          </button>
        </div>
      )
    }

    if (errorMsg === 'pending') {
      return (
        <div style={errorBox('#FEF3C7', '#854F0B')}>
          <p style={{ margin: 0, fontSize: 13, color: '#854F0B', lineHeight: 1.6 }}>
            Your access request is still under review. Job Lounge will get back to you within 24 hours.
          </p>
        </div>
      )
    }

    if (errorMsg === 'not_approved') {
      return (
        <div style={errorBox('#FEE2E2', '#991B1B')}>
          <p style={{ margin: 0, fontSize: 13, color: '#991B1B', lineHeight: 1.6 }}>
            Your access request was not approved. Please contact Job Lounge for more information.
          </p>
        </div>
      )
    }

    if (errorMsg === 'otp_failed') {
      return (
        <div style={errorBox('#FEE2E2', '#991B1B')}>
          <p style={{ margin: 0, fontSize: 13, color: '#991B1B' }}>
            Failed to send OTP. Please try again.
          </p>
        </div>
      )
    }

    return null
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>

      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#0f172a', letterSpacing: '-0.01em' }}>
          Job Lounge
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
          Opportunity First. Identity Later.
        </div>
      </div>

      <div style={styles.card}>

        {/* ── Email step ── */}
        {step === 'email' && (
          <>
            <h1 style={styles.heading}>Log in</h1>
            <p style={styles.subtext}>
              Enter your registered email. We'll send you a one-time code.
            </p>

            <label style={styles.label}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrorMsg('') }}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
              placeholder="you@gmail.com"
              autoFocus
              style={{ ...styles.input, marginBottom: errorMsg ? 12 : 20 }}
            />

            {renderEmailError()}

            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Checking…' : 'Send OTP'}
            </button>

            <p style={styles.footerText}>
              Don't have access yet?{' '}
              <span
                onClick={() => router.push('/request-access')}
                style={styles.link}
              >
                Request access
              </span>
            </p>
          </>
        )}

        {/* ── OTP step ── */}
        {step === 'otp' && (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: '#E6F1FB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C447C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <h1 style={styles.heading}>Enter your code</h1>
            <p style={{ ...styles.subtext, marginBottom: 2 }}>
              We sent an 8-digit code to
            </p>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', textAlign: 'center', margin: '0 0 20px' }}>
              {email}
            </p>

            <label style={styles.label}>One-time code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={otp}
              onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setErrorMsg('') }}
              onKeyDown={e => e.key === 'Enter' && handleOtpVerify()}
              placeholder="00000000"
              autoFocus
              style={{
                ...styles.input,
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: 10,
                textAlign: 'center',
                borderColor: errorMsg && errorMsg !== 'resent' ? '#e24b4a' : '#cbd5e1',
                marginBottom: errorMsg ? 8 : 20,
              }}
            />

            {errorMsg === 'resent' ? (
              <p style={{ fontSize: 12, color: '#0F6E56', margin: '0 0 14px' }}>
                A new code has been sent.
              </p>
            ) : errorMsg ? (
              <p style={{ fontSize: 12, color: '#e24b4a', margin: '0 0 14px' }}>
                {errorMsg}
              </p>
            ) : null}

            <button
              onClick={handleOtpVerify}
              disabled={loading}
              style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1, marginBottom: 12 }}
            >
              {loading ? 'Verifying…' : 'Verify & log in'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => { setStep('email'); setOtp(''); setErrorMsg('') }}
                style={styles.ghostBtn}
              >
                ← Change email
              </button>
              <button
                onClick={handleResend}
                disabled={loading}
                style={styles.ghostBtn}
              >
                Resend code
              </button>
            </div>
          </>
        )}

      </div>

      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 20, textAlign: 'center' }}>
        Your identity is never shared without your consent.
      </p>
    </div>
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
    maxWidth: 400,
  },
  heading: {
    fontSize: 19,
    fontWeight: 600,
    color: '#0f172a',
    margin: '0 0 6px',
    textAlign: 'center' as const,
  },
  subtext: {
    fontSize: 13,
    color: '#64748b',
    margin: '0 0 20px',
    lineHeight: 1.5,
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
  ghostBtn: {
    fontSize: 12,
    color: '#64748b',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 0',
    fontFamily: 'Inter, sans-serif',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 20,
    textAlign: 'center' as const,
  },
  link: {
    color: '#4f8ef7',
    cursor: 'pointer',
    textDecoration: 'underline' as const,
  },
}

function errorBox(bg: string, border: string): React.CSSProperties {
  return {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 8,
    padding: '12px 14px',
    marginBottom: 16,
  }
}

function inlineBtn(color: string, bg: string): React.CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 600,
    color,
    background: bg,
    border: `1px solid ${color}`,
    borderRadius: 6,
    padding: '5px 12px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  }
}