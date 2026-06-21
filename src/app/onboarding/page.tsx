'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Role = 'lounger' | 'peer' | 'recruiter'

const ROLES = [
  {
    id: 'lounger' as Role,
    icon: '🔍',
    label: 'Lounger',
    color: '#4f8ef7',
    bg: '#E6F1FB',
    border: '#B5D4F4',
    title: 'I want to know my market value',
    desc: 'Explore live opportunities anonymously. See who is hiring for your profile — without your employer ever knowing you looked.',
    points: [
      'Your name and employer stay hidden',
      'See salary bands and role matches',
      'Raise your hand only when you choose',
    ],
  },
  {
    id: 'peer' as Role,
    icon: '🤝',
    label: 'Peer',
    color: '#e09020',
    bg: '#FAEEDA',
    border: '#F5D5A0',
    title: 'I have a seat open',
    desc: 'Post a flash brief and see matched profiles instantly. The right person is not on any job board — they are here.',
    points: [
      'Post in under 4 minutes',
      'Matched profiles surface anonymously',
      'Identity reveals only on mutual consent',
    ],
  },
  {
    id: 'recruiter' as Role,
    icon: '🎯',
    label: 'Recruiter',
    color: '#7c6ef5',
    bg: '#EEEDFE',
    border: '#C4B5FD',
    title: 'I place talent professionally',
    desc: 'Access verified professionals who do not appear on open platforms. Every brief reviewed before matches are shown.',
    points: [
      'Founder-verified access only',
      'Pre-scored anonymous profiles',
      'No CV without mutual consent',
    ],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [approvedRole, setApprovedRole] = useState<Role | null>(null)

  useEffect(() => {
    checkUserState()
  }, [])

  async function checkUserState() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    // Check if already onboarded
    const { data: userData } = await supabase
      .from('users')
      .select('roles, onboarding_done')
      .eq('id', user.id)
      .maybeSingle()

    if (userData?.onboarding_done && userData.roles?.length > 0) {
      router.push(`/dashboard/${userData.roles[0]}`)
      return
    }

    // Get approved role from waitlist
    const { data: waitlistData } = await supabase
      .from('waitlist')
      .select('approved_role, role_requested')
      .eq('email', user.email)
      .maybeSingle()

    if (waitlistData?.approved_role) {
      setApprovedRole(waitlistData.approved_role as Role)
      setSelected([waitlistData.approved_role as Role])
    } else if (waitlistData?.role_requested) {
      setApprovedRole(waitlistData.role_requested as Role)
      setSelected([waitlistData.role_requested as Role])
    }

    setChecking(false)
  }

  function toggleRole(role: Role) {
    setSelected(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  async function handleContinue() {
    if (selected.length === 0) return

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Update roles in users table
    const { error } = await supabase
      .from('users')
      .update({ roles: selected })
      .eq('id', user.id)

    setLoading(false)

    if (error) {
      console.error('Failed to update roles:', error)
      return
    }

    // Go to first selected role's onboarding
    router.push(`/onboarding/${selected[0]}`)
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#64748b', fontSize: 13 }}>
        Loading…
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Job Lounge</span>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>Step 1 of 2 — Choose your role</span>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0f172a', margin: '0 0 8px' }}>
            Welcome to Job Lounge
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            {approvedRole
              ? `Your access was approved as ${ROLES.find(r => r.id === approvedRole)?.label}. You can also add another role if relevant.`
              : 'Select the role that describes why you are here. You can add more roles later.'}
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {ROLES.map(role => {
            const isSelected = selected.includes(role.id)
            const isApproved = role.id === approvedRole

            return (
              <div
                key={role.id}
                onClick={() => toggleRole(role.id)}
                style={{
                  background: '#fff',
                  border: isSelected ? `2px solid ${role.color}` : '1px solid #e2e8f0',
                  borderRadius: 14,
                  padding: '20px 22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  position: 'relative',
                  boxShadow: isSelected ? `0 0 0 3px ${role.bg}` : 'none',
                }}
              >
                {/* Approved badge */}
                {isApproved && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    fontSize: 11, fontWeight: 600, padding: '2px 10px',
                    borderRadius: 20, background: role.bg, color: role.color,
                    border: `1px solid ${role.border}`,
                  }}>
                    Approved ✓
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>

                  {/* Checkbox */}
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2,
                    border: isSelected ? 'none' : '1.5px solid #cbd5e1',
                    background: isSelected ? role.color : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {isSelected && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Role header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 18 }}>{role.icon}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                        background: role.bg, color: role.color,
                      }}>
                        {role.label}
                      </span>
                    </div>

                    <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>
                      {role.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55, marginBottom: 10 }}>
                      {role.desc}
                    </div>

                    {/* Points */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {role.points.map(pt => (
                        <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: '#475569' }}>
                          <span style={{ color: role.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                          {pt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Multi-role note */}
        {selected.length > 1 && (
          <div style={{
            fontSize: 12, color: '#64748b', background: '#f8fafc',
            border: '0.5px solid #e2e8f0', borderRadius: 8,
            padding: '10px 14px', marginBottom: 20, lineHeight: 1.6,
          }}>
            You selected <strong style={{ color: '#0f172a' }}>{selected.length} roles</strong>. We will complete{' '}
            <strong style={{ color: '#0f172a' }}>{ROLES.find(r => r.id === selected[0])?.label}</strong> onboarding first.
            You can set up the remaining role from your dashboard.
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={selected.length === 0 || loading}
          style={{
            width: '100%',
            padding: '12px 0',
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            background: selected.length === 0 ? '#cbd5e1' : '#0f172a',
            border: 'none',
            borderRadius: 10,
            cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'Saving…' : selected.length === 0
            ? 'Select a role to continue'
            : `Continue as ${selected.map(r => ROLES.find(x => x.id === r)?.label).join(' + ')} →`}
        </button>

      </div>
    </div>
  )
}