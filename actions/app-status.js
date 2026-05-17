'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const UpdateStatusSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(['PENDING', 'REVIEWED', 'SHORTLISTED', 'INTERVIEWING', 'REJECTED', 'HIRED']),
  statusNote: z.string().max(500).optional().or(z.literal('')),
})

const statusMessages = {
  REVIEWED: 'Your application has been reviewed',
  SHORTLISTED: 'Congratulations! You\'ve been shortlisted',
  INTERVIEWING: 'You\'ve been invited for an interview',
  REJECTED: 'Update on your application',
  HIRED: '🎉 Congratulations! You\'ve been hired!',
}

export async function updateApplicationStatus(data) {
  const session = await auth()
  if (!session) return { success: false, error: 'Not authenticated' }
  if (session.user.role !== 'COMPANY') {
    return { success: false, error: 'Only companies can update application status' }
  }

  try {
    const validated = UpdateStatusSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { applicationId, status, statusNote } = validated.data

    // Get application + verify ownership
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: { company: true },
        },
        student: true,
      },
    })

    if (!application) return { success: false, error: 'Application not found' }

    // Verify company owns this job
    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!company || application.job.companyId !== company.id) {
      return { success: false, error: 'Not authorized' }
    }

    // Update application + create notification in transaction
    await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: {
          status,
          statusNote: statusNote?.trim() || null,
          reviewedAt: status !== 'PENDING' ? new Date() : application.reviewedAt,
        },
      }),
      prisma.notification.create({
        data: {
          userId: application.studentId,
          type: 'APPLICATION_STATUS_CHANGED',
          title: statusMessages[status] || 'Application status updated',
          message: `Your application for "${application.job.title}" at ${application.job.company.companyName} has been updated to ${status}.`,
          link: '/dashboard/applications',
        },
      }),
    ])

    revalidatePath('/company/applications')
    revalidatePath(`/company/jobs/${application.job.id}/applications`)
    revalidatePath('/dashboard/applications')

    return { success: true, message: `Status updated to ${status}` }
  } catch (error) {
    console.error('Update status error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}