import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CompanyApplicationCard from '@/components/CompanyApplicationCard'
import {
  RiFileTextLine,
  RiTimeLine,
  RiStarFill,
  RiCheckLine,
  RiBriefcaseLine,
} from 'react-icons/ri'

async function getApplications(userId, statusFilter, jobFilter) {
  const profile = await prisma.companyProfile.findUnique({
    where: { userId },
  })

  if (!profile) return { applications: [], counts: {}, jobs: [] }

  const where = {
    job: { companyId: profile.id },
  }
  if (statusFilter && statusFilter !== 'ALL') {
    where.status = statusFilter
  }
  if (jobFilter && jobFilter !== 'ALL') {
    where.jobId = jobFilter
  }

  const [applications, statusCounts, jobs] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        job: { include: { company: true } },
        student: { include: { studentProfile: true } },
      },
      orderBy: { appliedAt: 'desc' },
    }),
    prisma.application.groupBy({
      by: ['status'],
      where: { job: { companyId: profile.id } },
      _count: true,
    }),
    prisma.job.findMany({
      where: { companyId: profile.id },
      select: { id: true, title: true },
      orderBy: { postedAt: 'desc' },
    }),
  ])

  const countByStatus = (status) =>
    statusCounts.find((c) => c.status === status)?._count || 0
  const total = statusCounts.reduce((sum, c) => sum + c._count, 0)

  return {
    applications,
    counts: {
      total,
      pending: countByStatus('PENDING'),
      reviewed: countByStatus('REVIEWED'),
      shortlisted: countByStatus('SHORTLISTED'),
      interviewing: countByStatus('INTERVIEWING'),
      hired: countByStatus('HIRED'),
      rejected: countByStatus('REJECTED'),
    },
    jobs,
  }
}

export default async function CompanyApplicationsPage({ searchParams }) {
  const params = await searchParams
  const session = await auth()
  const { applications, counts, jobs } = await getApplications(
    session.user.id,
    params.status,
    params.job
  )

  const currentStatus = params.status || 'ALL'
  const currentJob = params.job || 'ALL'

  const tabs = [
    { key: 'ALL', label: 'All', count: counts.total },
    { key: 'PENDING', label: 'Pending', count: counts.pending },
    { key: 'REVIEWED', label: 'Reviewed', count: counts.reviewed },
    { key: 'SHORTLISTED', label: 'Shortlisted', count: counts.shortlisted },
    { key: 'INTERVIEWING', label: 'Interviewing', count: counts.interviewing },
    { key: 'HIRED', label: 'Hired', count: counts.hired },
    { key: 'REJECTED', label: 'Rejected', count: counts.rejected },
  ]

  // Build filter URL helper
  const buildUrl = (newStatus, newJob) => {
    const p = new URLSearchParams()
    if (newStatus && newStatus !== 'ALL') p.set('status', newStatus)
    if (newJob && newJob !== 'ALL') p.set('job', newJob)
    const qs = p.toString()
    return qs ? `/company/applications?${qs}` : '/company/applications'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-3">
          <RiFileTextLine />
          Review Candidates
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          <span className="text-gradient">Applications</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage all applications for your job postings.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, icon: RiFileTextLine, color: 'from-blue-500 to-blue-700' },
          { label: 'Pending', value: counts.pending, icon: RiTimeLine, color: 'from-amber-500 to-orange-600' },
          { label: 'Shortlisted', value: counts.shortlisted + counts.interviewing, icon: RiStarFill, color: 'from-purple-500 to-pink-600' },
          { label: 'Hired', value: counts.hired, icon: RiCheckLine, color: 'from-green-500 to-emerald-600' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-md`}>
                <Icon className="text-white text-lg" />
              </div>
              <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Job Filter Dropdown */}
      {jobs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Job:
          </label>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl(currentStatus, 'ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentJob === 'ALL'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              All Jobs ({counts.total})
            </Link>
            {jobs.map((j) => (
              <Link
                key={j.id}
                href={buildUrl(currentStatus, j.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors truncate max-w-xs ${
                  currentJob === j.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {j.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = currentStatus === tab.key
            return (
              <Link
                key={tab.key}
                href={buildUrl(tab.key, currentJob)}
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

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <CompanyApplicationCard
              key={app.id}
              application={app}
              showJob={currentJob === 'ALL'}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/30 flex items-center justify-center">
            <RiFileTextLine className="text-brand-600 text-4xl" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
            {counts.total === 0 ? 'No applications yet' : 'No applications match filters'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {counts.total === 0
              ? 'When candidates apply to your jobs, they will appear here.'
              : 'Try adjusting filters or view all applications.'}
          </p>
          {counts.total === 0 ? (
            <Link
              href="/company/post-job"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
            >
              <RiBriefcaseLine />
              Post a Job
            </Link>
          ) : (
            <Link
              href="/company/applications"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
            >
              View All Applications
            </Link>
          )}
        </div>
      )}
    </div>
  )
}