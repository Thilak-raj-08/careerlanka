'use client'

import { useEffect, useRef } from 'react'
import { incrementJobView } from '@/actions/jobs'

export default function ViewCounter({ jobId }) {
  const incrementedRef = useRef(false)

  useEffect(() => {
    // Only increment once per page load
    if (incrementedRef.current) return
    incrementedRef.current = true

    // Wait a bit to ensure user actually viewed (not just bounced)
    const timer = setTimeout(() => {
      incrementJobView(jobId)
    }, 3000)

    return () => clearTimeout(timer)
  }, [jobId])

  return null // No UI - just side effect
}