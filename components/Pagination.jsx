'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    router.push(`/jobs?${params.toString()}`)
    // Scroll to top of results
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 1 // pages on each side of current
    const pages = []

    pages.push(1)
    if (currentPage - delta > 2) pages.push('...')
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i)
    }
    if (currentPage + delta < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        <RiArrowLeftLine />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      {getVisiblePages().map((page, idx) =>
        page === '...' ? (
          <span
            key={`dots-${idx}`}
            className="px-3 py-2 text-sm text-gray-500"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors min-w-[40px] ${
              currentPage === page
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        <span className="hidden sm:inline">Next</span>
        <RiArrowRightLine />
      </button>
    </div>
  )
}