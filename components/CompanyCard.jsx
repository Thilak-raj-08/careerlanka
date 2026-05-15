import Link from 'next/link'
import {
  RiBriefcaseLine,
  RiMapPin2Line,
  RiUserLine,
  RiArrowRightLine,
} from 'react-icons/ri'

export default function CompanyCard({ company }) {
  const jobCount = company._count?.jobs || 0

  return (
    <Link
      href={`/companies/${company.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden p-6"
    >
      {/* Header with Logo + Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-2xl shadow-md flex-shrink-0">
          {company.companyName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
            {company.companyName}
          </h3>
          {company.industry && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
              {company.industry}
            </p>
          )}
        </div>
      </div>

      {/* Tagline */}
      {company.tagline && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 italic">
          "{company.tagline}"
        </p>
      )}

      {/* Meta Info */}
      <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
        {company.location && (
          <div className="flex items-center gap-2">
            <RiMapPin2Line className="text-brand-500 flex-shrink-0" />
            <span className="truncate">{company.location}</span>
          </div>
        )}
        {company.size && (
          <div className="flex items-center gap-2">
            <RiUserLine className="text-brand-500 flex-shrink-0" />
            <span>{company.size} employees</span>
          </div>
        )}
      </div>

      {/* Footer: Job count + arrow */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-medium flex items-center gap-1">
            <RiBriefcaseLine />
            {jobCount} {jobCount === 1 ? 'open job' : 'open jobs'}
          </div>
        </div>
        <RiArrowRightLine className="text-brand-500 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}