import { PrismaClient } from '@prisma/client'

// Prisma Client singleton pattern
// Why? Next.js hot reload creates multiple instances of PrismaClient,
// which exhausts database connections. This pattern reuses single instance.

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}