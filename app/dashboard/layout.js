import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'
import DashboardHeader from '@/components/DashboardHeader'

export default async function StudentDashboardLayout({ children }) {
  const session = await auth()

  // Redirect if not logged in
  if (!session) redirect('/sign-in?callbackUrl=/dashboard')

  // Redirect non-students to their appropriate dashboard
  if (session.user.role === 'COMPANY') redirect('/company/dashboard')
  if (session.user.role === 'ADMIN') redirect('/admin')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Header */}
      <DashboardHeader user={session.user} />

      <div className="flex">
        {/* Sidebar (desktop) */}
        <DashboardSidebar user={session.user} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-16 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}