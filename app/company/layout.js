import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CompanySidebar from '@/components/CompanySidebar'
import DashboardHeader from '@/components/DashboardHeader'

export default async function CompanyDashboardLayout({ children }) {
  const session = await auth()

  if (!session) redirect('/sign-in?callbackUrl=/company/dashboard')

  if (session.user.role === 'STUDENT') redirect('/dashboard')
  if (session.user.role === 'ADMIN') redirect('/admin')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={session.user} />

      <div className="flex">
        <CompanySidebar user={session.user} />

        <main className="flex-1 lg:ml-64 pt-16 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}