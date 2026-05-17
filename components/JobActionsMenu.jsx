'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  RiMoreLine,
  RiPlayLine,
  RiPauseLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiEditLine,
  RiExternalLinkLine,
  RiFileTextLine,
} from 'react-icons/ri'
import Link from 'next/link'
import { updateJobStatus, deleteJob } from '@/actions/jobs-management'

export default function JobActionsMenu({ job }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleStatusChange = (newStatus) => {
    setOpen(false)
    startTransition(async () => {
      const result = await updateJobStatus(job.id, newStatus)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteJob(job.id)
      if (result.success) {
        toast.success(result.message)
        setShowDelete(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <RiMoreLine className="text-xl" />
        </button>

        {open && (
          <div className="absolute right-0 top-10 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-20 animate-fadeIn">
            {/* View Public */}
            <Link
              href={`/jobs/${job.slug}`}
              target="_blank"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RiExternalLinkLine className="text-lg text-gray-500" />
              View Public Page
            </Link>

            {/* Applications */}
            <Link
              href={`/company/jobs/${job.id}/applications`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RiFileTextLine className="text-lg text-gray-500" />
              View Applications ({job._count?.applications || 0})
            </Link>

            {/* Edit (placeholder for future) */}
            <Link
              href={`/company/jobs/${job.id}/edit`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RiEditLine className="text-lg text-gray-500" />
              Edit Job
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

            {/* Status changes */}
            {job.status === 'ACTIVE' && (
              <button
                onClick={() => handleStatusChange('PAUSED')}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <RiPauseLine className="text-lg text-amber-500" />
                Pause Job
              </button>
            )}

            {(job.status === 'PAUSED' || job.status === 'DRAFT') && (
              <button
                onClick={() => handleStatusChange('ACTIVE')}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <RiPlayLine className="text-lg text-green-500" />
                {job.status === 'DRAFT' ? 'Publish Job' : 'Resume Job'}
              </button>
            )}

            {job.status !== 'CLOSED' && (
              <button
                onClick={() => handleStatusChange('CLOSED')}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <RiCloseCircleLine className="text-lg text-gray-500" />
                Close Job
              </button>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

            {/* Delete */}
            <button
              onClick={() => {
                setOpen(false)
                setShowDelete(true)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <RiDeleteBinLine className="text-lg" />
              Delete Job
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => !isPending && setShowDelete(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <RiDeleteBinLine className="text-red-600 text-3xl" />
            </div>
            <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white text-center mb-2">
              Delete Job?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete <strong>"{job.title}"</strong>?
              This will also delete all <strong>{job._count?.applications || 0} applications</strong>.
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg"
              >
                {isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}