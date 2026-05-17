'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const CompanyProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name too short').max(100),
  tagline: z.string().max(200).optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
  industry: z.string().max(100).optional().or(z.literal('')),
  size: z.string().optional().or(z.literal('')),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  facebookUrl: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
})

export async function updateCompanyProfile(data) {
  const session = await auth()
  if (!session) return { success: false, error: 'Not authenticated' }
  if (session.user.role !== 'COMPANY') {
    return { success: false, error: 'Only companies can update company profile' }
  }

  try {
    const cleaned = {
      ...data,
      tagline: data.tagline?.trim() || null,
      description: data.description?.trim() || null,
      industry: data.industry?.trim() || null,
      size: data.size?.trim() || null,
      foundedYear: data.foundedYear ? parseInt(data.foundedYear) : null,
      website: data.website?.trim() || null,
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      location: data.location?.trim() || null,
      address: data.address?.trim() || null,
      linkedinUrl: data.linkedinUrl?.trim() || null,
      facebookUrl: data.facebookUrl?.trim() || null,
      twitterUrl: data.twitterUrl?.trim() || null,
    }

    const validated = CompanyProfileSchema.safeParse(cleaned)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { companyName, ...profileData } = validated.data

    await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: { name: companyName },
      }),
      prisma.companyProfile.update({
        where: { userId: session.user.id },
        data: { companyName, ...profileData },
      }),
    ])

    revalidatePath('/company/profile')
    revalidatePath('/company/dashboard')

    return { success: true, message: 'Company profile updated successfully!' }
  } catch (error) {
    console.error('Update company profile error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}