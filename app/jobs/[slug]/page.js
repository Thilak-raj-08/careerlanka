import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import PublicNavbar from '@/components/PublicNavbar'
import PublicFooter from '@/components/PublicFooter'
import JobCard from '@/components/JobCard'
import SaveJobButton from '@/components/SaveJobButton'
import ApplyButton from '@/components/ApplyButton'
import ShareButton from '@/components/ShareButton'
import ViewCounter from '@/components/ViewCounter'
import {
  formatSalary,
  timeAgo,
  formatJobType,
  formatLocationType,
  jobTypeColor,
} from '@/lib/utils'
import {
  RiBriefcaseLine,
  RiMapPin2Line,
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiEyeLine,
  RiUserLine,
  RiGlobalLine,
  RiCalendarLine,
  RiBuilding2Line,
  RiCheckLine,
  RiAwardLine,
  RiBookmarkFill,
  RiArrowLeftLine,
} from 'react-icons/ri'

async function getJob(slug, userId) {
  const job = await prisma.job.findUnique({
    where: { slug },
    include: {
      company: true,
    },
  })

  if (!job) return null

  // Check if current user has saved/applied
  let isSaved = false
  let hasApplied = false

  if (userId) {
    const [saved, application] = await Promise.all([
      prisma.savedJob.findUnique({
        where: { userId_jobId: { userId, jobId: job.id } },
      }),
      prisma.application.findUnique({
        where: { jobId_studentId: { jobId: job.id, studentId: userId } },
      }),
    ])
    isSaved = !!saved
    hasApplied = !!application
  }

  // Get similar jobs (same category or company)
  const similarJobs = await prisma.job.findMany({
    where: {
      id: { not: job.id },
      status: 'ACTIVE',
      OR: [
        { category: job.category },
        { companyId: job.companyId },
      ],
    },
    include: { company: true },
    orderBy: { postedAt: 'desc' },
    take: 3,
  })

  return { job, isSaved, hasApplied, similarJobs }
}

export default async function JobDetailPage({ params }) {
  const { slug } = await params
  const session = await auth()
  const userId = session?.user?.id

  const data = await getJob(slug, userId)
  if (!data) notFound()

  const { job, isSaved, hasApplied, similarJobs } = data

  // Format requirements as bullet list
  const requirementLines = job.requirements
    .split(/\.|\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 5)

  const benefitLines = job.benefits
    ? job.benefits
        .split(/,|\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 2)
    : []

  return (
    <>
      <ViewCounter jobId={job.id} />
      <PublicNavbar />

      <main className="pt-16 lg:pt-18 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back to jobs */}
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 mb-6 transition-colors"
          >
            <RiArrowLeftLine />
            Back to all jobs
          </Link>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  {/* Company Logo */}
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-2xl lg:text-3xl shadow-lg flex-shrink-0">
                    {job.company.companyName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <Link
                      href={`/companies/${job.company.id}`}
                      className="text-base text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors font-medium"
                    >
                      {job.company.companyName}
                    </Link>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <ShareButton title={job.title} url={`/jobs/${slug}`} />
                    <SaveJobButton jobId={job.id} initialSaved={isSaved} compact />
                  </div>
                </div>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full ${jobTypeColor(job.type)}`}>
                    <RiBriefcaseLine />
                    {formatJobType(job.type)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    <RiMapPin2Line />
                    {job.location || formatLocationType(job.locationType)}
                    {job.location && ` • ${formatLocationType(job.locationType)}`}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    <RiMoneyDollarCircleLine />
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                  </span>
                </div>

                {/* Meta Info Row */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <RiTimeLine />
                    Posted {timeAgo(job.postedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RiEyeLine />
                    {job.viewCount} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RiUserLine />
                    {job.applicationCount} applicants
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RiBookmarkFill className="text-brand-500" />
                    {job.savedCount} saved
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
                  About the Role
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {requirementLines.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <RiCheckLine className="text-brand-500 text-xl flex-shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                {/* Skills */}
                {job.skills?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Skills Required:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-sm bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-lg font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Benefits */}
              {benefitLines.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
                    What We Offer
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefitLines.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <RiAwardLine className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Sidebar */}
            <aside className="space-y-6">
              {/* Apply Card (Sticky) */}
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Ready to Apply?
                  </p>
                  <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">
                    Don't miss this opportunity!
                  </h3>

                  <ApplyButton jobSlug={slug} jobId={job.id} alreadyApplied={hasApplied} />

                  <div className="mt-3 flex gap-2">
                    <SaveJobButton jobId={job.id} initialSaved={isSaved} />
                  </div>

                  {job.closesAt && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                        <RiCalendarLine />
                        Applications close on{' '}
                        <strong>
                          {new Date(job.closesAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Company Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <RiBuilding2Line className="text-brand-500" />
                    About the Company
                  </h3>

                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {job.company.companyName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/companies/${job.company.id}`}
                        className="font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 transition-colors block truncate"
                      >
                        {job.company.companyName}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {job.company.industry}
                      </p>
                    </div>
                  </div>

                  {job.company.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {job.company.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {job.company.size && (
                      <div className="flex items-center gap-2">
                        <RiUserLine className="text-gray-400" />
                        <span>{job.company.size} employees</span>
                      </div>
                    )}
                    {job.company.location && (
                      <div className="flex items-center gap-2">
                        <RiMapPin2Line className="text-gray-400" />
                        <span>{job.company.location}</span>
                      </div>
                    )}
                    {job.company.website && (
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        <RiGlobalLine />
                        <span className="truncate">{job.company.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/companies/${job.company.id}`}
                    className="mt-4 inline-block w-full text-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    View Company Profile →
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* Similar Jobs Section */}
          {similarJobs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Similar <span className="text-gradient">Jobs</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {similarJobs.map((similarJob) => (
                  <JobCard key={similarJob.id} job={similarJob} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <PublicFooter />
    </>
  )
}