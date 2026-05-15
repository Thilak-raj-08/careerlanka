import Link from 'next/link'
import {
  RiBriefcaseLine,
  RiMapPin2Line,
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiFireFill,
  RiStarFill,
  RiBookmarkLine,
} from 'react-icons/ri'
import {
  formatSalary,
  timeAgo,
  formatJobType,
  formatLocationType,
  jobTypeColor,
  truncate,
} from '@/lib/utils'

export default function JobCard({ job }) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className="p-6">
        {/* Header: Company logo + badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Company logo placeholder (first letter) */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {job.company.companyName?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                {job.company.companyName}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                <RiTimeLine />
                {timeAgo(job.postedAt)}
              </div>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {job.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                <RiStarFill className="text-xs" />
                Featured
              </span>
            )}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                <RiFireFill className="text-xs" />
                Urgent
              </span>
            )}
          </div>
        </div>

        {/* Job title */}
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
          {job.title}
        </h3>

        {/* Description preview */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {truncate(job.description, 120)}
        </p>

        {/* Meta info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <RiMapPin2Line className="text-brand-500 flex-shrink-0" />
            <span className="truncate">
              {job.location || formatLocationType(job.locationType)}
              {job.location && ` • ${formatLocationType(job.locationType)}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <RiMoneyDollarCircleLine className="text-brand-500 flex-shrink-0" />
            <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}</span>
          </div>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${jobTypeColor(job.type)}`}>
            {formatJobType(job.type)}
          </span>

          {/* Top 3 skills */}
          {job.skills?.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills?.length > 3 && (
            <span className="px-2.5 py-1 text-xs font-medium text-gray-500">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}