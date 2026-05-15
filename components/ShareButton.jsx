'use client'

import toast from 'react-hot-toast'
import { RiShareLine } from 'react-icons/ri'

export default function ShareButton({ title, url }) {
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : url

    // Try native share API first (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        })
        return
      } catch (err) {
        // User cancelled or share failed - fall back to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      toast.error('Could not copy link')
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share job"
      className="p-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-500 hover:text-brand-600 transition-all duration-200"
    >
      <RiShareLine className="text-xl" />
    </button>
  )
}