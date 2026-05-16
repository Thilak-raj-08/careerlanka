import Link from 'next/link'
import WithdrawButton from './WithdrawButton'
import { timeAgo, formatJobType, formatSalary, jobTypeColor } from '@/lib/utils'
import {
  RiBriefcaseLine,
  RiMapPin2Line,
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiExternalLinkLine,
  RiCheckLine,
  RiInformationLine,
  RiStarFill,
  RiCalendarCheckLine,
  RiCloseCircleLine,
} from 'react-icons/ri'

const statusConfig = {
  PENDING: {
    label: 'Pending Review',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    icon: RiTimeLine,
    description: 'Your application is awaiting review',
  },
  REVIEWED: {
    label: 'Reviewed',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    icon: RiInformationLine,
    description: 'Application has been reviewed',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    icon: RiStarFill,
    description: "Congrats! You've been shortlisted",
  },
  INTERVIEWING: {
    label: 'Interviewing',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    icon: RiCalendarCheckLine,
    description: 'Interview process in progress',
  },
  REJECTED: {
    label: 'Not Selected',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    icon: RiCloseCircleLine,
    description: "Unfortunately, you weren't selected",
  },
  HIRED: {
    label: 'Hired',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    icon: RiCheckLine,
    description: '🎉 Congratulations! You got hired!',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
    icon: RiCloseCircleLine,
    description: 'You withdrew this application',
  },
}

export default function ApplicationCard({ application }) {
  const { job } = application
  const status = statusConfig[application.status] || statusConfig.PENDING
  const StatusIcon = status.icon

  const canWithdraw = ['PENDING', 'REVIEWED', 'SHORTLISTED'].includes(application.status)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {job.company.companyName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/jobs/${job.slug}`}
              className="font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 transition-colors block truncate"
            >
              {job.title}
            </Link>
            <Link
              href={`/companies/${job.company.id}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors block truncate"
            >
              {job.company.companyName}
            </Link>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 ${status.color}`}
        >
          <StatusIcon className="text-sm" />
          <span className="hidden sm:inline">{status.label}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mb-4">
        <span className={`px-2 py-0.5 rounded-full font-medium ${jobTypeColor(job.type)}`}>
          {formatJobType(job.type)}
        </span>
        {job.location && (
          <span className="flex items-center gap-1">
            <RiMapPin2Line />
            {job.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <RiMoneyDollarCircleLine />
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
        </span>
      </div>

      <div className={`p-3 rounded-lg mb-4 text-sm ${status.color}`}>
        <p className="font-medium">{status.description}</p>
        {application.statusNote && (
          <p className="text-xs mt-1 opacity-80">"{application.statusNote}"</p>
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <RiTimeLine />
            Applied {timeAgo(application.appliedAt)}
          </span>
          {application.reviewedAt && (
            <span className="flex items-center gap-1">
              <RiInformationLine />
              Reviewed {timeAgo(application.reviewedAt)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-colors"
          >
            <RiExternalLinkLine />
            View Job
          </Link>

          {canWithdraw && (
            <WithdrawButton
              applicationId={application.id}
              jobTitle={job.title}
            />
          )}
        </div>
      </div>
    </div>
  )
}