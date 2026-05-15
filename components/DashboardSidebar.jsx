'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  RiDashboardLine,
  RiUserLine,
  RiFileTextLine,
  RiBookmarkLine,
  RiBriefcaseLine,
  RiLogoutBoxLine,
  RiSettings4Line,
} from 'react-icons/ri'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: RiDashboardLine },
  { name: 'My Profile', href: '/dashboard/profile', icon: RiUserLine },
  { name: 'My Applications', href: '/dashboard/applications', icon: RiFileTextLine },
  { name: 'Saved Jobs', href: '/dashboard/saved', icon: RiBookmarkLine },
  { name: 'Browse Jobs', href: '/jobs', icon: RiBriefcaseLine },
]

export default function DashboardSidebar({ user }) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col">
      {/* User card */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shadow-md">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="text-xl" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Settings + Logout */}
        <div className="px-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RiSettings4Line className="text-xl" />
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <RiLogoutBoxLine className="text-xl" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          © {new Date().getFullYear()} CareerLanka
        </p>
      </div>
    </aside>
  )
}