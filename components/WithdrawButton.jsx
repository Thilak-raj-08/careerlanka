'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { RiDeleteBinLine, RiCloseLine, RiAlertLine } from 'react-icons/ri'
import { withdrawApplication } from '@/actions/applications'

export default function WithdrawButton({ applicationId, jobTitle }) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleWithdraw = () => {
    startTransition(async () => {
      const result = await withdrawApplication(applicationId)
      if (result.success) {
        toast.success(result.message)
        setShowConfirm(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <RiDeleteBinLine />
        Withdraw
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => !isPending && setShowConfirm(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RiCloseLine className="text-xl" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <RiAlertLine className="text-red-600 text-3xl" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white text-center mb-2">
              Withdraw Application?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to withdraw your application for{' '}
              <strong>"{jobTitle}"</strong>? This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors"
              >
                {isPending ? 'Withdrawing...' : 'Yes, Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}