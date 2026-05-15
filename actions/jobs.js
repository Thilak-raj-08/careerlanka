'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Toggle save/unsave a job for the current user
 */
export async function toggleSaveJob(jobId) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Please sign in to save jobs' }
  }

  if (session.user.role !== 'STUDENT') {
    return { success: false, error: 'Only students can save jobs' }
  }

  try {
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    })

    if (existing) {
      // Unsave
      await prisma.savedJob.delete({
        where: { id: existing.id },
      })
      await prisma.job.update({
        where: { id: jobId },
        data: { savedCount: { decrement: 1 } },
      })
      revalidatePath(`/jobs/${jobId}`)
      return { success: true, saved: false, message: 'Job removed from saved' }
    } else {
      // Save
      await prisma.savedJob.create({
        data: { userId: session.user.id, jobId },
      })
      await prisma.job.update({
        where: { id: jobId },
        data: { savedCount: { increment: 1 } },
      })
      revalidatePath(`/jobs/${jobId}`)
      return { success: true, saved: true, message: 'Job saved successfully' }
    }
  } catch (error) {
    console.error('Toggle save job error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

/**
 * Increment view count for a job
 */
export async function incrementJobView(jobId) {
  try {
    await prisma.job.update({
      where: { id: jobId },
      data: { viewCount: { increment: 1 } },
    })
    return { success: true }
  } catch (error) {
    console.error('Increment view error:', error)
    return { success: false }
  }
}