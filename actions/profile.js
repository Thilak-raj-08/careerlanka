'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const ProfileSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100),
  phone: z.string().max(20).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  headline: z.string().max(150).optional().or(z.literal('')),
  bio: z.string().max(1000).optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid Portfolio URL').optional().or(z.literal('')),
  skills: z.array(z.string()).max(30, 'Maximum 30 skills'),
  languages: z.array(z.string()).max(10),
  preferredJobTypes: z.array(z.string()).max(5),
  preferredLocations: z.array(z.string()).max(10),
  experience: z.number().min(0).max(50).optional().nullable(),
  expectedSalaryMin: z.number().min(0).optional().nullable(),
  expectedSalaryMax: z.number().min(0).optional().nullable(),
  openToWork: z.boolean(),
})

export async function updateStudentProfile(data) {
  const session = await auth()
  if (!session) return { success: false, error: 'Not authenticated' }
  if (session.user.role !== 'STUDENT') {
    return { success: false, error: 'Only students can update their profile' }
  }

  try {
    const cleaned = {
      ...data,
      phone: data.phone?.trim() || null,
      location: data.location?.trim() || null,
      headline: data.headline?.trim() || null,
      bio: data.bio?.trim() || null,
      linkedinUrl: data.linkedinUrl?.trim() || null,
      githubUrl: data.githubUrl?.trim() || null,
      portfolioUrl: data.portfolioUrl?.trim() || null,
      experience: data.experience ? parseInt(data.experience) : null,
      expectedSalaryMin: data.expectedSalaryMin ? parseInt(data.expectedSalaryMin) : null,
      expectedSalaryMax: data.expectedSalaryMax ? parseInt(data.expectedSalaryMax) : null,
    }

    const validated = ProfileSchema.safeParse(cleaned)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { name, ...profileData } = validated.data

    await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: { name },
      }),
      prisma.studentProfile.upsert({
        where: { userId: session.user.id },
        update: profileData,
        create: { userId: session.user.id, ...profileData },
      }),
    ])

    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard')

    return { success: true, message: 'Profile updated successfully!' }
  } catch (error) {
    console.error('Update profile error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}