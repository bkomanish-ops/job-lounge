'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type WaitlistEntry = {
  id: string
  email: string
  role_requested: 'lounger' | 'peer' | 'recruiter'
  status: 'pending' | 'approved' | 'held' | 'rejected'
  approved_role: string | null
  created_at: string
}

const ROLE_META = {
  lounger:   { bg: '#E6F1FB', color: '#0C447C', label: 'Lounger' },
  peer:      { bg: '#FAEEDA', color: '#854F0B', label: 'Peer' },
  recruiter: { bg: '#EEEDFE', color: '#3C3489', label: 'Recruiter' },
}

const STATUS_META = {
  pending:  { bg: '#FEF3C7', color: '#854F0B', label: 'Pending' },
  approved: { bg: '#E1F5EE', color: '#0F6E56', label: 'Approved' },
  held:     { bg: '#FEE2E2', color: '#991B1B', label: 'Held' },
  rejected: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
}

export default function AdminPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [allEntries, setAllEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'held' | 'all'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // ── Auth guard ──
  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession()

      console.log('SESSION:', session?.user?.email ?? 'NO SESSION')

      if (!session) {
        router.replace('/login')
        return
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

      if (error || !userData?.is_admin) {
        router.replace('/login')
        return
      }

      setAuthChecked(true)
      fetchAll()
    }

    checkAdmin()
  }, [router])

  async function fetchAll() {
    setLoading(true)
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setAllEntries(data)
    setLoading(false)
  }

  async function updateStatus(
    id: string,
    status: 'approved' | 'held' | 'rejected',
    approvedRole?: string
  ) {
    setActionLoading(id)

    const updates: Record<string, string> = { status }
    if (approvedRole) updates.approved_role = approvedRole
    if (status === 'approved') updates.approved_at = new Date().toISOString()

    const { error } = await supabase
      .from('waitlist')
      .update(updates)
      .eq('id', id)

    setActionLoading(null)

    if (error) {
      showToast('Something went wrong. Please try again.', false)
      return
    }

    setAllEntries(prev =>
      prev.map(e =>
        e.id === id
          ? { ...e, status, approved_role: approvedRole ?? e.approved_role }
          : e
      )
    )

    showToast(
      status === 'approved'
        ? `Approved as ${ROLE_META[approvedRole as keyof typeof ROLE_META]?.label ?? approvedRole}. User can now log in.`
        : status === 'held'
        ? 'Request held.'
        : 'Request rejected.',
      true
    )
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const counts = {
    pending:  allEntries.filter(e => e.status === 'pending').length,
    approved: allEntries.filter(e => e.status === 'approved').length,
    held:     allEntries.filter(e => e.status === 'held' || e.status === 'rejected').length,
    all:      allEntries.length,
  }

  const filtered = filter === 'all'
    ? allEntries
    : filter === 'held'
    ? allEntries.filter(e => e.status === 'held' || e.status === 'rejected')
    : allEntries.filter(e => e.status === filter)

  // ── Blank screen while auth check runs ──
  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>Checking access…</span>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '0 28px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Job Lounge</span>
          <span style={{ fontSize: 11, color: '#94a3b8', padding: '2px 8px', background: '#f1f5f9', borderRadius: 20 }}>Founder Admin</span>
        </div>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {counts.pending > 0 && (
            <span style={{ background: '#fbbf24', color: '#78350f', borderRadius: 20, padding: '2px 8px', fontWeight: 600, marginRight: 8 }}>
              {counts.pending} pending
            </span>
          )}
          Access requests
        </span>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Access Requests</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Review who gets into Job Lounge and assign their role.</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['pending', 'approved', 'held', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 20,
                border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                background: filter === f ? '#0f172a' : '#f1f5f9',
                color: filter === f ? '#fff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={{
                marginLeft: 6, fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px',
                background: filter === f ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                color: filter === f ? '#fff' : '#64748b',
              }}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 13, color: '#94a3b8' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 13, color: '#94a3b8' }}>
            No {filter === 'all' ? '' : filter} requests.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(entry => {
              const roleMeta = ROLE_META[entry.role_requested]
              const statusMeta = STATUS_META[entry.status]
              const isActing = actionLoading === entry.id

              return (
                <div
                  key={entry.id}
                  style={{
                    background: '#fff',
                    border: '0.5px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '16px 20px',
                    borderLeft: entry.status === 'pending' ? '3px solid #fbbf24'
                      : entry.status === 'approved' ? '3px solid #5DCAA5'
                      : '3px solid #e2e8f0',
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>
                      {entry.email}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{getTimeAgo(entry.created_at)}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: statusMeta.bg, color: statusMeta.color, fontWeight: 500 }}>
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Role requested */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: entry.status === 'pending' ? 14 : 0 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Requested as:</span>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: roleMeta.bg, color: roleMeta.color }}>
                      {roleMeta.label}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 4 }}>
                      {entry.role_requested === 'lounger' && '— wants to explore opportunities anonymously'}
                      {entry.role_requested === 'peer' && '— has an open seat, looking to refer'}
                      {entry.role_requested === 'recruiter' && '— hiring professional seeking hidden talent'}
                    </span>
                  </div>

                  {/* Approved role override */}
                  {entry.status === 'approved' && entry.approved_role && entry.approved_role !== entry.role_requested && (
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                      Approved as:{' '}
                      <span style={{ fontWeight: 600, color: ROLE_META[entry.approved_role as keyof typeof ROLE_META]?.color }}>
                        {ROLE_META[entry.approved_role as keyof typeof ROLE_META]?.label}
                      </span>
                      {' '}(overridden from {roleMeta.label})
                    </div>
                  )}

                  {/* Actions — pending */}
                  {entry.status === 'pending' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', marginRight: 4 }}>Approve as:</span>
                      {(['lounger', 'peer', 'recruiter'] as const).map(r => {
                        const rm = ROLE_META[r]
                        const isRequested = r === entry.role_requested
                        return (
                          <button
                            key={r}
                            onClick={() => updateStatus(entry.id, 'approved', r)}
                            disabled={isActing}
                            style={{
                              fontSize: 12, fontWeight: isRequested ? 700 : 500,
                              padding: '6px 14px', borderRadius: 7,
                              border: isRequested ? 'none' : `1px solid ${rm.color}`,
                              cursor: isActing ? 'not-allowed' : 'pointer',
                              background: isRequested ? rm.color : rm.bg,
                              color: isRequested ? '#fff' : rm.color,
                              fontFamily: 'Inter, sans-serif', opacity: isActing ? 0.6 : 1,
                            }}
                          >
                            {isActing ? '…' : rm.label}{isRequested ? ' ✓' : ''}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => updateStatus(entry.id, 'held')}
                        disabled={isActing}
                        style={{
                          fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 7,
                          border: '1px solid #e2e8f0', cursor: isActing ? 'not-allowed' : 'pointer',
                          background: '#f8fafc', color: '#64748b', fontFamily: 'Inter, sans-serif',
                          marginLeft: 8, opacity: isActing ? 0.6 : 1,
                        }}
                      >
                        Hold
                      </button>
                    </div>
                  )}

                  {/* Actions — held/rejected */}
                  {(entry.status === 'held' || entry.status === 'rejected') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', marginRight: 4 }}>Approve as:</span>
                      {(['lounger', 'peer', 'recruiter'] as const).map(r => {
                        const rm = ROLE_META[r]
                        const isRequested = r === entry.role_requested
                        return (
                          <button
                            key={r}
                            onClick={() => updateStatus(entry.id, 'approved', r)}
                            disabled={isActing}
                            style={{
                              fontSize: 12, fontWeight: isRequested ? 700 : 500,
                              padding: '6px 14px', borderRadius: 7,
                              border: isRequested ? 'none' : `1px solid ${rm.color}`,
                              cursor: isActing ? 'not-allowed' : 'pointer',
                              background: isRequested ? rm.color : rm.bg,
                              color: isRequested ? '#fff' : rm.color,
                              fontFamily: 'Inter, sans-serif', opacity: isActing ? 0.6 : 1,
                            }}
                          >
                            {rm.label}{isRequested ? ' ✓' : ''}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: toast.ok ? '#0f172a' : '#991B1B',
          color: '#fff', fontSize: 13, fontWeight: 500,
          padding: '10px 20px', borderRadius: 8, zIndex: 999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          whiteSpace: 'nowrap',
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}