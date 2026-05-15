'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { RiBookmarkLine, RiBookmarkFill } from 'react-icons/ri'
import { toggleSaveJob } from '@/actions/jobs'

export default function SaveJobButton({ jobId, initialSaved = false, compact = false }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    if (!session) {
      toast.error('Please sign in to save jobs')
      router.push('/sign-in?callbackUrl=/jobs')
      return
    }

    if (session.user.role !== 'STUDENT') {
      toast.error('Only students can save jobs')
      return
    }

    // Optimistic update
    setSaved(!saved)

    startTransition(async () => {
      const result = await toggleSaveJob(jobId)
      if (result.success) {
        setSaved(result.saved)
        toast.success(result.message)
      } else {
        setSaved(saved) // revert
        toast.error(result.error)
      }
    })
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        aria-label={saved ? 'Unsave job' : 'Save job'}
        className={`p-2.5 rounded-lg border transition-all duration-200 ${
          saved
            ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-600'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-500 hover:text-brand-600'
        }`}
      >
        {saved ? <RiBookmarkFill className="text-xl" /> : <RiBookmarkLine className="text-xl" />}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-lg border transition-all duration-200 ${
        saved
          ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-700 dark:text-brand-300'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-500 hover:text-brand-600'
      } disabled:opacity-50`}
    >
      {saved ? <RiBookmarkFill className="text-lg" /> : <RiBookmarkLine className="text-lg" />}
      {saved ? 'Saved' : 'Save Job'}
    </button>
  )
}