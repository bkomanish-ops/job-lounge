'use client'

// src/app/request-access/page.tsx
// Redirects to the appropriate onboarding flow based on role.
// Modal implementation deferred — onboarding runs as full page for now.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RequestAccessPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/onboarding/lounger')
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F3EF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      fontSize: 13,
      color: '#64748b',
    }}>
      Taking you to onboarding…
    </div>
  )
}
