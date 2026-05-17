import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PostJobForm from '@/components/PostJobForm'
import {
  RiAddCircleLine,
  RiAlertLine,
  RiArrowLeftLine,
} from 'react-icons/ri'

export default async function PostJobPage() {
  const session = await auth()
  const profile = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  })

  // Company status check
  if (profile?.status !== 'APPROVED') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <RiAlertLine className="text-amber-600 text-3xl" />
          </div>
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Account Not Approved
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your company account must be approved before you can post jobs. Please complete your profile and wait for admin review.
          </p>
          <Link
            href="/company/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/company/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 mb-6 transition-colors"
      >
        <RiArrowLeftLine />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-3">
          <RiAddCircleLine />
          New Job Posting
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Post a New <span className="text-gradient">Job</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a compelling job posting to attract the best candidates for your team.
        </p>
      </div>

      <PostJobForm />
    </div>
  )
}