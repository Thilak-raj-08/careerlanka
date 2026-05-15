'use client'

import { useState } from 'react'
import { RiFilterLine } from 'react-icons/ri'
import JobFilters from './JobFilters'

export default function MobileFilterButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm"
      >
        <RiFilterLine />
        Filters
      </button>

      {/* Drawer Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-full sm:max-w-md max-h-[90vh] animate-slideUp">
            <JobFilters isMobile onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}