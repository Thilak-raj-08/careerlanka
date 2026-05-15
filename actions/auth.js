'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Validation schema
const SignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['STUDENT', 'COMPANY'], {
    message: 'Please select an account type',
  }),
})

export async function signUpAction(formData) {
  try {
    const validated = SignUpSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
    })

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0].message,
      }
    }

    const { name, email, password, role } = validated.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists',
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        ...(role === 'STUDENT' && {
          studentProfile: {
            create: {},
          },
        }),
        ...(role === 'COMPANY' && {
          companyProfile: {
            create: {
              companyName: name,
              status: 'PENDING',
            },
          },
        }),
      },
    })

    return {
      success: true,
      message: 'Account created successfully! Please sign in.',
      userId: user.id,
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}