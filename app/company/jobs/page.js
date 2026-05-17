import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CompanyJobRow from '@/components/CompanyJobRow'
import {
  RiBriefcaseLine,
  RiAddCircleLine,
} from 'react-icons/ri'

async function getCompanyJobs(userId, statusFilter) {
  const profile = await prisma.companyProfile.findUnique({
    where: { userId },
  })

  if (!profile) return { jobs: [], counts: { total: 0, active: 0, draft: 0, paused: 0, closed: 0 } }

  const where = { companyId: profile.id }
  if (statusFilter && statusFilter !== 'ALL') {
    where.status = statusFilter
  }

  const [jobs, allCounts] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { postedAt: 'desc' },
    }),
    prisma.job.groupBy({
      by: ['status'],
      where: { companyId: profile.id },
      _count: true,
    }),
  ])

  const countByStatus = (status) =>
    allCounts.find((c) => c.status === status)?._count || 0

  const total = allCounts.reduce((sum, c) => sum + c._count, 0)

  return {
    jobs,
    counts: {
      total,
      active: countByStatus('ACTIVE'),
      draft: countByStatus('DRAFT'),
      paused: countByStatus('PAUSED'),
      closed: countByStatus('CLOSED'),
    },
  }
}

export default async function CompanyJobsPage({ searchParams }) {
  const params = await searchParams
  const session = await auth()
  const { jobs, counts } = await getCompanyJobs(session.user.id, params.status)
  const currentStatus = params.status || 'ALL'

  const tabs = [
    { key: 'ALL', label: 'All Jobs', count: counts.total },
    { key: 'ACTIVE', label: 'Active', count: counts.active },
    { key: 'DRAFT', label: 'Drafts', count: counts.draft },
    { key: 'PAUSED', label: 'Paused', count: counts.paused },
    { key: 'CLOSED', label: 'Closed', count: counts.closed },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-3">
            <RiBriefcaseLine />
            Your Job Postings
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Manage <span className="text-gradient">Jobs</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all your job postings in one place.
          </p>
        </div>

        <Link
          href="/company/post-job"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-md transition-all hover:-translate-y-0.5"
        >
          <RiAddCircleLine />
          Post New Job
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = currentStatus === tab.key
            const href = tab.key === 'ALL' ? '/company/jobs' : `/company/jobs?status=${tab.key}`
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

      {/* Jobs List */}
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <CompanyJobRow key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/30 flex items-center justify-center">
            <RiBriefcaseLine className="text-brand-600 text-4xl" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
            {currentStatus === 'ALL' ? 'No jobs yet' : `No ${currentStatus.toLowerCase()} jobs`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {currentStatus === 'ALL'
              ? 'Create your first job posting to start receiving applications from talented candidates.'
              : 'No jobs match this filter. Try another status or view all jobs.'}
          </p>
          <Link
            href={currentStatus === 'ALL' ? '/company/post-job' : '/company/jobs'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
          >
            {currentStatus === 'ALL' ? (
              <>
                <RiAddCircleLine />
                Post Your First Job
              </>
            ) : (
              <>
                <RiBriefcaseLine />
                View All Jobs
              </>
            )}
          </Link>
        </div>
      )}
    </div>
  )
}