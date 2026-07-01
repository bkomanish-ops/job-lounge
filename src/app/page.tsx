'use client'

// src/app/page.tsx
// Serves the full landing experience from /public/experience.html
// Next.js static files in /public are served as-is — no compilation, no CSS stripping.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Replace current history entry so back button works naturally
    window.location.replace('/experience.html')
  }, [])

  // Show nothing while redirecting
  return null
}
