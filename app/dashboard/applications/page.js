import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ApplicationCard from '@/components/ApplicationCard'
import StatusFilterTabs from '@/components/StatusFilterTabs'
import {
  RiFileTextLine,
  RiBriefcaseLine,
  RiTimeLine,
  RiStarFill,
  RiCheckLine,
} from 'react-icons/ri'

async function getApplications(userId, statusFilter) {
  const where = { studentId: userId }
  if (statusFilter && statusFilter !== 'ALL') {
    where.status = statusFilter
  }

  const [applications, counts] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        job: { include: { company: true } },
      },
      orderBy: { appliedAt: 'desc' },
    }),
    prisma.application.groupBy({
      by: ['status'],
      where: { studentId: userId },
      _count: true,
    }),
  ])

  const total = counts.reduce((sum, c) => sum + c._count, 0)
  const countByStatus = (status) =>
    counts.find((c) => c.status === status)?._count || 0

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
      withdrawn: countByStatus('WITHDRAWN'),
    },
  }
}

export default async function ApplicationsPage({ searchParams }) {
  const params = await searchParams
  const session = await auth()
  const { applications, counts } = await getApplications(
    session.user.id,
    params.status
  )

  const statusFilter = params.status || 'ALL'

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-3">
          <RiFileTextLine />
          Track Your Progress
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          My <span className="text-gradient">Applications</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track the status of all your job applications in one place.
        </p>
      </div>

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

      <StatusFilterTabs counts={counts} />

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <RiFileTextLine className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
            {statusFilter === 'ALL'
              ? 'No applications yet'
              : `No ${statusFilter.toLowerCase()} applications`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {statusFilter === 'ALL'
              ? 'Start applying to jobs and track your progress here. Your journey to landing your dream job starts now!'
              : 'No applications match this status filter. Try another status or view all applications.'}
          </p>
          <Link
            href={statusFilter === 'ALL' ? '/jobs' : '/dashboard/applications'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
          >
            <RiBriefcaseLine />
            {statusFilter === 'ALL' ? 'Browse Jobs' : 'View All Applications'}
          </Link>
        </div>
      )}
    </div>
  )
}