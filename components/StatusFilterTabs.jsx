'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function StatusFilterTabs({ counts }) {
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') || 'ALL'

  const tabs = [
    { key: 'ALL', label: 'All', count: counts.total },
    { key: 'PENDING', label: 'Pending', count: counts.pending },
    { key: 'SHORTLISTED', label: 'Shortlisted', count: counts.shortlisted },
    { key: 'INTERVIEWING', label: 'Interviewing', count: counts.interviewing },
    { key: 'HIRED', label: 'Hired', count: counts.hired },
    { key: 'REJECTED', label: 'Rejected', count: counts.rejected },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.key
          const href = tab.key === 'ALL' ? '/dashboard/applications' : `/dashboard/applications?status=${tab.key}`

          return (
            <Link
              key={tab.key}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab.count}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}