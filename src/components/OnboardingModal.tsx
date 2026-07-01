'use client'

// ─────────────────────────────────────────────────────────────────────────────
// OnboardingModal
//
// Usage on landing page (src/app/page.tsx):
//   const [showOnboarding, setShowOnboarding] = useState(false)
//   <button onClick={() => setShowOnboarding(true)}>Request Access</button>
//   <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />
//
// Usage on request-access page (src/app/request-access/page.tsx):
//   Auto-opens on mount. On completion → redirect to dashboard.
//
// The modal wraps the full LoungerOnboardingPage content in a slide-up overlay.
// On step 6 completion → router.push('/dashboard/lounger')
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode  // Pass <LoungerOnboardingContent /> here
}

export function OnboardingModal({ open, onClose, children }: OnboardingModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose()
  }

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(4,44,83,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'backdrop-in 0.25s ease',
      }}
    >
      <style>{`
        @keyframes backdrop-in { from { opacity:0 } to { opacity:1 } }
        @keyframes modal-up { from { transform:translateY(40px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      `}</style>

      <div
        style={{
          width: '100%', maxWidth: 620,
          maxHeight: '92vh',
          background: '#f8fafc',
          borderRadius: '18px 18px 0 0',
          overflowY: 'auto',
          animation: 'modal-up 0.3s cubic-bezier(0.22,0.61,0.36,1)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky', top: 12,
            float: 'right', marginRight: 16, marginTop: 12,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(0,0,0,0.07)', border: 'none',
            cursor: 'pointer', fontSize: 16, color: '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter, sans-serif', zIndex: 10,
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* The onboarding content */}
        <div style={{ paddingBottom: 32 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
