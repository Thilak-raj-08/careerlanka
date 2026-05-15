import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import JobCard from '@/components/JobCard'
import { timeAgo, formatJobType, jobTypeColor } from '@/lib/utils'
import {
  RiFileTextLine,
  RiBookmarkLine,
  RiBriefcaseLine,
  RiCheckLine,
  RiTimeLine,
  RiArrowRightLine,
  RiUserLine,
  RiSparklingFill,
} from 'react-icons/ri'

async function getDashboardData(userId) {
  const [
    profile,
    applications,
    savedJobsCount,
    applicationsCount,
    pendingCount,
    shortlistedCount,
    recommendedJobs,
  ] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId } }),
    prisma.application.findMany({
      where: { studentId: userId },
      include: { job: { include: { company: true } } },
      orderBy: { appliedAt: 'desc' },
      take: 5,
    }),
    prisma.savedJob.count({ where: { userId } }),
    prisma.application.count({ where: { studentId: userId } }),
    prisma.application.count({
      where: { studentId: userId, status: 'PENDING' },
    }),
    prisma.application.count({
      where: { studentId: userId, status: 'SHORTLISTED' },
    }),
    prisma.job.findMany({
      where: { status: 'ACTIVE' },
      include: { company: true },
      orderBy: [{ isFeatured: 'desc' }, { postedAt: 'desc' }],
      take: 3,
    }),
  ])

  return {
    profile,
    applications,
    stats: { savedJobsCount, applicationsCount, pendingCount, shortlistedCount },
    recommendedJobs,
  }
}

// Status badge colors
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

export default async function DashboardPage() {
  const session = await auth()
  const { profile, applications, stats, recommendedJobs } = await getDashboardData(session.user.id)

  // Profile completion calculation
  const profileFields = [
    profile?.phone,
    profile?.location,
    profile?.bio,
    profile?.headline,
    profile?.resumeUrl,
    profile?.skills?.length > 0,
    profile?.linkedinUrl,
  ]
  const filledFields = profileFields.filter(Boolean).length
  const completion = Math.round((filledFields / profileFields.length) * 100)

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
            Welcome back, {session.user.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-brand-100 mb-4">
            Here's what's happening with your job search today.
          </p>

          {completion < 100 && (
            <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4 inline-block">
              <div className="flex items-center gap-3 mb-2">
                <RiUserLine className="text-xl" />
                <span className="font-medium text-sm">Complete your profile</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{completion}%</span>
              </div>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-1 text-sm mt-2 hover:underline"
              >
                Complete profile <RiArrowRightLine />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Applications',
            value: stats.applicationsCount,
            icon: RiFileTextLine,
            color: 'from-blue-500 to-blue-700',
            href: '/dashboard/applications',
          },
          {
            label: 'Pending',
            value: stats.pendingCount,
            icon: RiTimeLine,
            color: 'from-amber-500 to-orange-600',
            href: '/dashboard/applications?status=PENDING',
          },
          {
            label: 'Shortlisted',
            value: stats.shortlistedCount,
            icon: RiSparklingFill,
            color: 'from-purple-500 to-pink-600',
            href: '/dashboard/applications?status=SHORTLISTED',
          },
          {
            label: 'Saved Jobs',
            value: stats.savedJobsCount,
            icon: RiBookmarkLine,
            color: 'from-emerald-500 to-teal-600',
            href: '/dashboard/saved',
          },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Link
              key={i}
              href={stat.href}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-0.5 group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                <Icon className="text-white text-xl" />
              </div>
              <p className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Two Column: Recent Applications + Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
              Recent Applications
            </h2>
            <Link
              href="/dashboard/applications"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View all
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/jobs/${app.job.slug}`}
                  className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {app.job.company.companyName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {app.job.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {app.job.company.companyName} • {timeAgo(app.appliedAt)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${statusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <RiFileTextLine className="text-gray-400 text-2xl" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                You haven't applied to any jobs yet
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
              >
                <RiBriefcaseLine />
                Browse Jobs
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
              Recommended For You
            </h2>
            <Link
              href="/jobs"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {job.company.companyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {job.company.companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${jobTypeColor(job.type)}`}>
                    {formatJobType(job.type)}
                  </span>
                  {job.location && (
                    <span className="text-gray-500 dark:text-gray-400 truncate">
                      {job.location}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: 'Update Profile',
            description: 'Keep your profile fresh',
            icon: RiUserLine,
            href: '/dashboard/profile',
            color: 'from-blue-500 to-blue-700',
          },
          {
            title: 'Browse Jobs',
            description: 'Find new opportunities',
            icon: RiBriefcaseLine,
            href: '/jobs',
            color: 'from-purple-500 to-purple-700',
          },
          {
            title: 'Saved Jobs',
            description: 'Review your bookmarks',
            icon: RiBookmarkLine,
            href: '/dashboard/saved',
            color: 'from-pink-500 to-pink-700',
          },
        ].map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-0.5 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-md`}>
                <Icon className="text-white text-xl" />
              </div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">
                {action.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}