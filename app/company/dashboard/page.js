import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { timeAgo, formatJobType, jobTypeColor } from '@/lib/utils'
import {
  RiBriefcaseLine,
  RiFileTextLine,
  RiEyeLine,
  RiTimeLine,
  RiUserLine,
  RiAddCircleLine,
  RiArrowRightLine,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
} from 'react-icons/ri'

async function getDashboardData(userId) {
  const profile = await prisma.companyProfile.findUnique({
    where: { userId },
  })

  if (!profile) return null

  const [
    activeJobs,
    totalJobs,
    totalApplications,
    pendingApplications,
    recentJobs,
    recentApplications,
    totalViews,
  ] = await Promise.all([
    prisma.job.count({ where: { companyId: profile.id, status: 'ACTIVE' } }),
    prisma.job.count({ where: { companyId: profile.id } }),
    prisma.application.count({
      where: { job: { companyId: profile.id } },
    }),
    prisma.application.count({
      where: { job: { companyId: profile.id }, status: 'PENDING' },
    }),
    prisma.job.findMany({
      where: { companyId: profile.id },
      orderBy: { postedAt: 'desc' },
      take: 5,
      include: {
        _count: { select: { applications: true } },
      },
    }),
    prisma.application.findMany({
      where: { job: { companyId: profile.id } },
      orderBy: { appliedAt: 'desc' },
      take: 5,
      include: {
        job: true,
        student: {
          include: { studentProfile: true },
        },
      },
    }),
    prisma.job.aggregate({
      where: { companyId: profile.id },
      _sum: { viewCount: true },
    }),
  ])

  return {
    profile,
    stats: {
      activeJobs,
      totalJobs,
      totalApplications,
      pendingApplications,
      totalViews: totalViews._sum.viewCount || 0,
    },
    recentJobs,
    recentApplications,
  }
}

// Status color helper
function statusColor(status) {
  const map = {
    PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    REVIEWED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    SHORTLISTED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    INTERVIEWING: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    HIRED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    WITHDRAWN: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

export default async function CompanyDashboardPage() {
  const session = await auth()
  const data = await getDashboardData(session.user.id)

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Company profile not found. Please contact support.
        </p>
      </div>
    )
  }

  const { profile, stats, recentJobs, recentApplications } = data

  return (
    <div className="space-y-6">
      {/* Status Alert (if not approved) */}
      {profile.status === 'PENDING' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex gap-3">
          <RiAlertLine className="text-amber-600 dark:text-amber-400 text-2xl flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-300">
              Account Pending Approval
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-400 mt-1">
              Your company account is being reviewed. You can post jobs after approval. Make sure your company profile is complete.
            </p>
            <Link
              href="/company/profile"
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-300 mt-2 hover:underline"
            >
              Complete profile <RiArrowRightLine />
            </Link>
          </div>
        </div>
      )}

      {profile.status === 'REJECTED' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 flex gap-3">
          <RiCloseCircleLine className="text-red-600 text-2xl flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-300">
              Account Rejected
            </p>
            <p className="text-sm text-red-800 dark:text-red-400 mt-1">
              {profile.rejectionReason || 'Please update your profile and contact support.'}
            </p>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2 flex items-center gap-2 flex-wrap">
            Welcome back, {profile.companyName}! 🏢
            {profile.status === 'APPROVED' && (
              <RiCheckboxCircleLine className="text-green-300 text-2xl" title="Verified" />
            )}
          </h1>
          <p className="text-brand-100 mb-4">
            {stats.pendingApplications > 0
              ? `You have ${stats.pendingApplications} pending application${stats.pendingApplications === 1 ? '' : 's'} to review.`
              : 'Manage your jobs and applications from here.'}
          </p>

          {profile.status === 'APPROVED' && (
            <Link
              href="/company/post-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-700 font-medium rounded-lg hover:bg-brand-50 transition-colors shadow-md"
            >
              <RiAddCircleLine />
              Post New Job
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Jobs',
            value: stats.activeJobs,
            icon: RiBriefcaseLine,
            color: 'from-blue-500 to-blue-700',
            href: '/company/jobs',
          },
          {
            label: 'Total Applications',
            value: stats.totalApplications,
            icon: RiFileTextLine,
            color: 'from-purple-500 to-pink-600',
            href: '/company/applications',
          },
          {
            label: 'Pending Review',
            value: stats.pendingApplications,
            icon: RiTimeLine,
            color: 'from-amber-500 to-orange-600',
            href: '/company/applications?status=PENDING',
          },
          {
            label: 'Total Views',
            value: stats.totalViews,
            icon: RiEyeLine,
            color: 'from-emerald-500 to-teal-600',
          },
        ].map((stat, i) => {
          const Icon = stat.icon
          const Card = stat.href ? Link : 'div'
          return (
            <Card
              key={i}
              href={stat.href}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                <Icon className="text-white text-xl" />
              </div>
              <p className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Two Columns: Recent Jobs + Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
              Your Recent Jobs
            </h2>
            <Link
              href="/company/jobs"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View all
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/company/jobs/${job.id}/applications`}
                  className="block p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate flex-1">
                      {job.title}
                    </p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                      job.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{timeAgo(job.postedAt)}</span>
                    <span className="flex items-center gap-1">
                      <RiUserLine /> {job._count.applications} applications
                    </span>
                    <span className="flex items-center gap-1">
                      <RiEyeLine /> {job.viewCount} views
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <RiBriefcaseLine className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                No jobs posted yet
              </p>
              <Link
                href="/company/post-job"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
              >
                <RiAddCircleLine />
                Post Your First Job
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
              Recent Applications
            </h2>
            <Link
              href="/company/applications"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View all
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {app.student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {app.student.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Applied for {app.job.title}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${statusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-13">
                    {timeAgo(app.appliedAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <RiFileTextLine className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No applications yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}