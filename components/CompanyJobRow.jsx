import Link from 'next/link'
import JobActionsMenu from './JobActionsMenu'
import { timeAgo, formatJobType, jobTypeColor } from '@/lib/utils'
import {
  RiEyeLine,
  RiUserLine,
  RiBookmarkFill,
  RiTimeLine,
  RiMapPin2Line,
} from 'react-icons/ri'

const jobStatusConfig = {
  ACTIVE: {
    label: 'Active',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    dot: 'bg-green-500',
  },
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
    dot: 'bg-gray-400',
  },
  PAUSED: {
    label: 'Paused',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  CLOSED: {
    label: 'Closed',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    dot: 'bg-red-500',
  },
  EXPIRED: {
    label: 'Expired',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
}

export default function CompanyJobRow({ job }) {
  const status = jobStatusConfig[job.status] || jobStatusConfig.DRAFT

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        {/* Status indicator */}
        <div className="flex-shrink-0 mt-1">
          <div className={`w-3 h-3 rounded-full ${status.dot} ${job.status === 'ACTIVE' ? 'animate-pulse' : ''}`}></div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
            <div className="flex-1 min-w-0">
              <Link
                href={`/company/jobs/${job.id}/applications`}
                className="text-base font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 transition-colors block truncate"
              >
                {job.title}
              </Link>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                  {status.label}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${jobTypeColor(job.type)}`}>
                  {formatJobType(job.type)}
                </span>
                {job.isFeatured && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-full">
                    ⭐ Featured
                  </span>
                )}
                {job.isUrgent && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                    🔥 Urgent
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <JobActionsMenu job={job} />
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <RiTimeLine />
              Posted {timeAgo(job.postedAt)}
            </span>
            {job.location && (
              <span className="flex items-center gap-1">
                <RiMapPin2Line />
                {job.location}
              </span>
            )}
            {job.closesAt && (
              <span className="flex items-center gap-1">
                <RiTimeLine />
                Closes {new Date(job.closesAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                <RiEyeLine className="text-brand-500" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{job.viewCount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Views</p>
            </div>
            <Link
              href={`/company/jobs/${job.id}/applications`}
              className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg py-1 transition-colors"
            >
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                <RiUserLine className="text-brand-500" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{job._count?.applications || job.applicationCount}</span>
              </div>
              <p className="text-xs text-brand-600 mt-0.5 font-medium">Applications →</p>
            </Link>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                <RiBookmarkFill className="text-brand-500" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{job.savedCount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Saved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}