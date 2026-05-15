import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// Public routes - no auth required
const publicRoutes = [
  '/',
  '/jobs',
  '/companies',
  '/about',
  '/sign-in',
  '/sign-up',
]

// Auth routes - redirect to dashboard if already logged in
const authRoutes = ['/sign-in', '/sign-up']

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  const isPublicRoute = publicRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  )
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')

  // Always allow API auth routes
  if (isApiAuthRoute) return NextResponse.next()

  // Redirect logged-in users away from sign-in/sign-up
  if (isAuthRoute && isLoggedIn) {
    const dashboardUrl =
      userRole === 'COMPANY'
        ? '/company/dashboard'
        : userRole === 'ADMIN'
        ? '/admin'
        : '/dashboard'
    return NextResponse.redirect(new URL(dashboardUrl, nextUrl))
  }

  // Redirect non-logged-in users away from protected routes
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl))
  }

  return NextResponse.next()
})

// Routes where middleware should run
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}