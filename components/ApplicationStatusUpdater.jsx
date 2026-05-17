'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  RiCloseLine,
  RiCheckLine,
  RiStarLine,
  RiCalendarCheckLine,
  RiCloseCircleLine,
  RiHandCoinLine,
  RiEyeLine,
} from 'react-icons/ri'
import { updateApplicationStatus } from '@/actions/app-status'

const statusOptions = [
  { value: 'REVIEWED', label: 'Mark as Reviewed', icon: RiEyeLine, color: 'text-blue-600' },
  { value: 'SHORTLISTED', label: 'Shortlist Candidate', icon: RiStarLine, color: 'text-purple-600' },
  { value: 'INTERVIEWING', label: 'Move to Interview', icon: RiCalendarCheckLine, color: 'text-indigo-600' },
  { value: 'HIRED', label: 'Hire Candidate', icon: RiHandCoinLine, color: 'text-green-600' },
  { value: 'REJECTED', label: 'Reject Application', icon: RiCloseCircleLine, color: 'text-red-600' },
]

export default function ApplicationStatusUpdater({ applicationId, currentStatus }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [note, setNote] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleUpdate = () => {
    if (!selectedStatus) {
      toast.error('Please select a status')
      return
    }

    startTransition(async () => {
      const result = await updateApplicationStatus({
        applicationId,
        status: selectedStatus,
        statusNote: note,
      })

      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        setSelectedStatus('')
        setNote('')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-colors border border-brand-200 dark:border-brand-800"
      >
        Update Status
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => !isPending && setOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <button
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RiCloseLine className="text-xl" />
            </button>

            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-1">
              Update Application Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Current: <strong>{currentStatus}</strong>
            </p>

            {/* Status options */}
            <div className="space-y-2 mb-5">
              {statusOptions
                .filter((opt) => opt.value !== currentStatus)
                .map((opt) => {
                  const Icon = opt.icon
                  const isSelected = selectedStatus === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedStatus(opt.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`text-xl ${opt.color}`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {opt.label}
                      </span>
                      {isSelected && <RiCheckLine className="ml-auto text-brand-600" />}
                    </button>
                  )
                })}
            </div>

            {/* Optional note */}
            {selectedStatus && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Note to candidate (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g., 'Please prepare a 30-min introduction call' or 'Thank you for applying'"
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {note.length}/500 — Visible to the candidate
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!selectedStatus || isPending}
                className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 disabled:cursor-not-allowed text-white font-medium rounded-lg"
              >
                {isPending ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}