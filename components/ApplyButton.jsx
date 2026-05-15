'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { RiSendPlaneFill, RiCheckLine } from 'react-icons/ri'

export default function ApplyButton({ jobSlug, jobId, alreadyApplied = false }) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleClick = () => {
    if (!session) {
      toast('Please sign in to apply', { icon: '👋' })
      router.push(`/sign-in?callbackUrl=/jobs/${jobSlug}`)
      return
    }

    if (session.user.role !== 'STUDENT') {
      toast.error('Only students can apply for jobs')
      return
    }

    if (alreadyApplied) {
      toast('You have already applied for this job', { icon: 'ℹ️' })
      return
    }

    // Navigate to apply page (Phase 3 la build pannrom)
    router.push(`/jobs/${jobSlug}/apply`)
  }

  if (alreadyApplied) {
    return (
      <button
        disabled
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium rounded-xl border border-green-200 dark:border-green-800 cursor-not-allowed"
      >
        <RiCheckLine className="text-xl" />
        Already Applied
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all duration-200 hover:-translate-y-0.5"
    >
      <RiSendPlaneFill className="text-xl" />
      Apply Now
    </button>
  )
}