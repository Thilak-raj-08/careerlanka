import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import PublicNavbar from '@/components/PublicNavbar'
import PublicFooter from '@/components/PublicFooter'
import JobCard from '@/components/JobCard'
import {
  RiCheckboxCircleFill,
  RiFileTextLine,
  RiBriefcaseLine,
  RiArrowRightLine,
  RiBookmarkLine,
} from 'react-icons/ri'

async function getSuccessData(slug, userId) {
  const job = await prisma.job.findUnique({
    where: { slug },
    include: { company: true },
  })

  if (!job) return null

  // Verify application exists
  const application = await prisma.application.findUnique({
    where: {
      jobId_studentId: {
        jobId: job.id,
        studentId: userId,
      },
    },
  })

  if (!application) return null

  // Get similar jobs (different company, same category)
  const similarJobs = await prisma.job.findMany({
    where: {
      id: { not: job.id },
      status: 'ACTIVE',
      category: job.category,
      // Exclude jobs user already applied to
      NOT: {
        applications: {
          some: { studentId: userId },
        },
      },
    },
    include: { company: true },
    take: 3,
  })

  return { job, application, similarJobs }
}

export default async function ApplySuccessPage({ params }) {
  const { slug } = await params

  const session = await auth()
  if (!session) redirect('/sign-in')

  const data = await getSuccessData(slug, session.user.id)
  if (!data) notFound()

  const { job, similarJobs } = data

  return (
    <>
      <PublicNavbar />

      <main className="pt-16 lg:pt-18 min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Success Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12 border border-gray-200 dark:border-gray-700 shadow-lg text-center mb-8">
              {/* Success icon with animation */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl animate-pulse">
                <RiCheckboxCircleFill className="text-white text-5xl" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
                Application <span className="text-gradient">Submitted!</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                Your application for <strong>{job.title}</strong> at <strong>{job.company.companyName}</strong> has been successfully submitted.
              </p>

              {/* Job Card Mini */}
              <div className="bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-800 border border-brand-200 dark:border-brand-800 rounded-2xl p-5 mb-8 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {job.company.companyName.charAt(0)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-display font-bold text-gray-900 dark:text-white truncate">
                      {job.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {job.company.companyName}
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-8 text-left">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
                  What happens next?
                </h3>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>The hiring team at <strong>{job.company.companyName}</strong> will review your application</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>You'll receive a notification when they update your application status</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Track your application status anytime from your dashboard</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/dashboard/applications"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
                >
                  <RiFileTextLine />
                  Track My Applications
                  <RiArrowRightLine />
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <RiBriefcaseLine />
                  Browse More Jobs
                </Link>
              </div>
            </div>

            {/* Similar Jobs Section */}
            {similarJobs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                    You might also like
                  </h2>
                  <Link
                    href="/jobs"
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  )
}