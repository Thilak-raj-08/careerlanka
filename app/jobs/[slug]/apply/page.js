import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import PublicNavbar from '@/components/PublicNavbar'
import PublicFooter from '@/components/PublicFooter'
import ApplyForm from '@/components/ApplyForm'
import {
  RiArrowLeftLine,
  RiSendPlaneFill,
} from 'react-icons/ri'

async function getJobForApply(slug) {
  const job = await prisma.job.findUnique({
    where: { slug },
    include: { company: true },
  })
  return job
}

export default async function ApplyPage({ params }) {
  const { slug } = await params

  // Auth check
  const session = await auth()
  if (!session) {
    redirect(`/sign-in?callbackUrl=/jobs/${slug}/apply`)
  }

  if (session.user.role !== 'STUDENT') {
    redirect(`/jobs/${slug}`)
  }

  // Fetch job
  const job = await getJobForApply(slug)
  if (!job) notFound()

  // Check if already applied
  const existing = await prisma.application.findUnique({
    where: {
      jobId_studentId: {
        jobId: job.id,
        studentId: session.user.id,
      },
    },
  })

  if (existing) {
    // Already applied — redirect back to job
    redirect(`/jobs/${slug}?error=already-applied`)
  }

  // Job not active?
  if (job.status !== 'ACTIVE') {
    redirect(`/jobs/${slug}?error=not-active`)
  }

  // Get student profile (for saved resume URL)
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <>
      <PublicNavbar />

      <main className="pt-16 lg:pt-18 min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href={`/jobs/${slug}`}
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 mb-6 transition-colors"
            >
              <RiArrowLeftLine />
              Back to job details
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-3">
                <RiSendPlaneFill />
                Application Form
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Apply for this <span className="text-gradient">Position</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Take a moment to write a thoughtful cover letter — it makes a big difference!
              </p>
            </div>

            {/* Form */}
            <ApplyForm
              job={job}
              profile={profile}
              savedResumeUrl={profile?.resumeUrl}
            />
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  )
}