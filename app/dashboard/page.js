import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { RiLogoutBoxLine, RiUserLine, RiBriefcaseLine } from 'react-icons/ri'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                Welcome, {session.user.name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {session.user.email}
              </p>
            </div>
          </div>

          {/* Role Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-6">
            <RiUserLine />
            Logged in as: {session.user.role}
          </div>

          {/* Status Message */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h2 className="font-display font-bold text-green-900 dark:text-green-300 mb-1">
                  Phase 1 Complete!
                </h2>
                <p className="text-sm text-green-800 dark:text-green-400">
                  Authentication is fully working. Sign up, login, session management, role-based redirect — all functional.
                </p>
              </div>
            </div>
          </div>

          {/* Session info */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <RiBriefcaseLine /> Session Details
            </h3>
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
{JSON.stringify(session.user, null, 2)}
            </pre>
          </div>

          {/* Sign Out */}
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/sign-in' })
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              <RiLogoutBoxLine className="text-lg" />
              Sign Out
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            Next: Phase 2 - Build the public pages (landing page, browse jobs)
          </p>
        </div>
      </div>
    </div>
  )
}