'use client'

// src/app/request-access/page.tsx
// Opens the onboarding modal automatically on load.
// Backdrop click or ✕ → go back to landing page.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingModal } from '@/components/OnboardingModal'
import LoungerOnboardingPage from '@/app/onboarding/lounger/page'

export default function RequestAccessPage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  function handleClose() {
    setOpen(false)
    router.push('/')
  }

  return (
    <>
      {/* Minimal background so something shows if modal is closed */}
      <div style={{ minHeight: '100vh', background: '#F5F3EF' }} />
      <OnboardingModal open={open} onClose={handleClose}>
        <LoungerOnboardingPage />
      </OnboardingModal>
    </>
  )
}
