import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import JobCard from '@/components/JobCard'
import { timeAgo } from '@/lib/utils'
import {
  RiBookmarkLine,
  RiBriefcaseLine,
  RiTimeLine,
  RiHeartLine,
} from 'react-icons/ri'

async function getSavedJobs(userId) {
  const savedJobs = await prisma.savedJob.findMany({
    where: { userId },
    include: {
      job: {
        include: { company: true },
      },
    },
    orderBy: { savedAt: 'desc' },
  })

  // Filter out jobs that are no longer active (optional - show all for now)
  return savedJobs
}

export default async function SavedJobsPage() {
  const session = await auth()
  const savedJobs = await getSavedJobs(session.user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-3">
          <RiBookmarkLine />
          Your Bookmarks
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Saved <span className="text-gradient">Jobs</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {savedJobs.length > 0
            ? `You have ${savedJobs.length} saved job${savedJobs.length === 1 ? '' : 's'}. Apply before they expire!`
            : 'Bookmark jobs you like to review them later.'}
        </p>
      </div>

      {/* Saved Jobs Grid */}
      {savedJobs.length > 0 ? (
        <>
          {/* Quick stats banner */}
          <div className="bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-800 border border-brand-200 dark:border-brand-800 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                <RiHeartLine className="text-white text-xl" />
              </div>
              <div>
                <p className="font-display font-bold text-gray-900 dark:text-white">
                  {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Latest save: {timeAgo(savedJobs[0].savedAt)}
                </p>
              </div>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <RiBriefcaseLine />
              Find More Jobs
            </Link>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {savedJobs.map((saved) => (
              <div key={saved.id} className="relative">
                {/* Saved timestamp ribbon */}
                <div className="absolute -top-2 -right-2 z-10 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-brand-600 text-white rounded-full shadow-md">
                  <RiTimeLine className="text-xs" />
                  {timeAgo(saved.savedAt)}
                </div>

                {/* Status indicator if job is no longer active */}
                {saved.job.status !== 'ACTIVE' && (
                  <div className="absolute top-3 left-3 z-10 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    No longer accepting
                  </div>
                )}

                <JobCard job={saved.job} />
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/30 flex items-center justify-center">
            <RiBookmarkLine className="text-brand-600 text-4xl" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
            No saved jobs yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Browse jobs and click the bookmark icon to save them for later. Your saved jobs will appear here for easy access.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
          >
            <RiBriefcaseLine />
            Browse Jobs Now
          </Link>

          {/* Helpful tips */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 max-w-md mx-auto text-left">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              💡 Tips for saving jobs:
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• Save jobs that match your skills and goals</li>
              <li>• Review saved jobs before they expire</li>
              <li>• Apply to your favorites first</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}