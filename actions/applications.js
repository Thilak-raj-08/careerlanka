'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const ApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID required'),
  coverLetter: z
    .string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(3000, 'Cover letter too long'),
  resumeUrl: z
    .string()
    .url('Please provide a valid resume URL')
    .or(z.literal('')),
})

export async function submitApplication(data) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Please sign in to apply' }
  }

  if (session.user.role !== 'STUDENT') {
    return { success: false, error: 'Only students can apply for jobs' }
  }

  try {
    // Validate input
    const validated = ApplicationSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { jobId, coverLetter, resumeUrl } = validated.data

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: { include: { user: true } } },
    })

    if (!job) return { success: false, error: 'Job not found' }
    if (job.status !== 'ACTIVE') {
      return { success: false, error: 'This job is no longer accepting applications' }
    }

    // Check for duplicate application
    const existing = await prisma.application.findUnique({
      where: {
        jobId_studentId: {
          jobId,
          studentId: session.user.id,
        },
      },
    })

    if (existing) {
      return { success: false, error: 'You have already applied for this job' }
    }

    // Get student profile to use saved resume URL if available
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    })

    const finalResumeUrl = resumeUrl || profile?.resumeUrl || ''

    // Create application + update job count + create notification (all in transaction)
    await prisma.$transaction([
      prisma.application.create({
        data: {
          jobId,
          studentId: session.user.id,
          coverLetter,
          resumeUrl: finalResumeUrl,
          status: 'PENDING',
        },
      }),
      prisma.job.update({
        where: { id: jobId },
        data: { applicationCount: { increment: 1 } },
      }),
      // Notify the company
      prisma.notification.create({
        data: {
          userId: job.company.user.id,
          type: 'APPLICATION_RECEIVED',
          title: 'New Application Received',
          message: `${session.user.name} applied for "${job.title}"`,
          link: `/company/jobs/${job.id}/applications`,
        },
      }),
    ])

    revalidatePath(`/jobs/${job.slug}`)
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/applications')

    return {
      success: true,
      message: 'Application submitted successfully!',
      jobSlug: job.slug,
    }
  } catch (error) {
    console.error('Submit application error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

/**
 * Withdraw an application
 */
export async function withdrawApplication(applicationId) {
  const session = await auth()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) return { success: false, error: 'Application not found' }
    if (application.studentId !== session.user.id) {
      return { success: false, error: 'Not authorized' }
    }
    if (application.status === 'HIRED') {
      return { success: false, error: 'Cannot withdraw a hired application' }
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'WITHDRAWN' },
    })

    revalidatePath('/dashboard/applications')

    return { success: true, message: 'Application withdrawn successfully' }
  } catch (error) {
    console.error('Withdraw error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}