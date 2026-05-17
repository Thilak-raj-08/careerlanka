'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Generate URL-friendly slug from title
function generateSlug(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)

  // Add random suffix to ensure uniqueness
  const random = Math.random().toString(36).substring(2, 8)
  return `${base}-${random}`
}

const JobSchema = z.object({
  title: z.string().min(5, 'Job title must be at least 5 characters').max(150),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters').max(3000),
  benefits: z.string().max(2000).optional().or(z.literal('')),
  type: z.enum(['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE']),
  locationType: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
  location: z.string().max(100).optional().or(z.literal('')),
  category: z.string().max(100).optional().or(z.literal('')),
  salaryMin: z.number().min(0).optional().nullable(),
  salaryMax: z.number().min(0).optional().nullable(),
  showSalary: z.boolean(),
  skills: z.array(z.string()).max(20, 'Maximum 20 skills'),
  experienceMin: z.number().min(0).max(50),
  educationLevel: z.string().max(100).optional().or(z.literal('')),
  closesAt: z.string().optional().or(z.literal('')),
  isUrgent: z.boolean(),
  status: z.enum(['DRAFT', 'ACTIVE']),
})

export async function createJob(data) {
  const session = await auth()
  if (!session) return { success: false, error: 'Not authenticated' }
  if (session.user.role !== 'COMPANY') {
    return { success: false, error: 'Only companies can post jobs' }
  }

  try {
    // Check if company is approved
    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!company) return { success: false, error: 'Company profile not found' }
    if (company.status !== 'APPROVED') {
      return { success: false, error: 'Your account must be approved to post jobs' }
    }

    // Clean and convert data
    const cleaned = {
      ...data,
      benefits: data.benefits?.trim() || null,
      location: data.location?.trim() || null,
      category: data.category?.trim() || null,
      educationLevel: data.educationLevel?.trim() || null,
      salaryMin: data.salaryMin ? parseInt(data.salaryMin) : null,
      salaryMax: data.salaryMax ? parseInt(data.salaryMax) : null,
      experienceMin: parseInt(data.experienceMin) || 0,
    }

    const validated = JobSchema.safeParse(cleaned)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { closesAt, ...jobData } = validated.data

    // Create job with unique slug
    const slug = generateSlug(jobData.title)

    const job = await prisma.job.create({
      data: {
        ...jobData,
        slug,
        companyId: company.id,
        closesAt: closesAt ? new Date(closesAt) : null,
      },
    })

    // Update company's totalJobsPosted
    await prisma.companyProfile.update({
      where: { id: company.id },
      data: { totalJobsPosted: { increment: 1 } },
    })

    revalidatePath('/company/jobs')
    revalidatePath('/company/dashboard')
    revalidatePath('/jobs')

    return {
      success: true,
      message: jobData.status === 'ACTIVE'
        ? 'Job published successfully! 🎉'
        : 'Job saved as draft',
      jobId: job.id,
      slug: job.slug,
    }
  } catch (error) {
    console.error('Create job error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

/**
 * Update an existing job
 */
export async function updateJob(jobId, data) {
  const session = await auth()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!company) return { success: false, error: 'Not authorized' }

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job || job.companyId !== company.id) {
      return { success: false, error: 'Not authorized' }
    }

    const cleaned = {
      ...data,
      benefits: data.benefits?.trim() || null,
      location: data.location?.trim() || null,
      category: data.category?.trim() || null,
      educationLevel: data.educationLevel?.trim() || null,
      salaryMin: data.salaryMin ? parseInt(data.salaryMin) : null,
      salaryMax: data.salaryMax ? parseInt(data.salaryMax) : null,
      experienceMin: parseInt(data.experienceMin) || 0,
    }

    const validated = JobSchema.safeParse(cleaned)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { closesAt, ...jobData } = validated.data

    await prisma.job.update({
      where: { id: jobId },
      data: {
        ...jobData,
        closesAt: closesAt ? new Date(closesAt) : null,
      },
    })

    revalidatePath('/company/jobs')
    revalidatePath(`/jobs/${job.slug}`)

    return { success: true, message: 'Job updated successfully!' }
  } catch (error) {
    console.error('Update job error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

/**
 * Update job status (PAUSE, CLOSE, REOPEN)
 */
export async function updateJobStatus(jobId, newStatus) {
  const session = await auth()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!company) return { success: false, error: 'Not authorized' }

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job || job.companyId !== company.id) {
      return { success: false, error: 'Not authorized' }
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { status: newStatus },
    })

    revalidatePath('/company/jobs')
    revalidatePath('/jobs')

    return { success: true, message: `Job status updated to ${newStatus}` }
  } catch (error) {
    console.error('Update status error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

/**
 * Delete a job (and all its applications)
 */
export async function deleteJob(jobId) {
  const session = await auth()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id },
    })
    if (!company) return { success: false, error: 'Not authorized' }

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job || job.companyId !== company.id) {
      return { success: false, error: 'Not authorized' }
    }

    await prisma.job.delete({ where: { id: jobId } })

    revalidatePath('/company/jobs')
    revalidatePath('/jobs')

    return { success: true, message: 'Job deleted successfully' }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}