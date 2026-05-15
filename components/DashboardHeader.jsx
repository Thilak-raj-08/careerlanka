'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  RiBriefcaseLine,
  RiMenuLine,
  RiCloseLine,
  RiDashboardLine,
  RiUserLine,
  RiFileTextLine,
  RiBookmarkLine,
  RiLogoutBoxLine,
} from 'react-icons/ri'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: RiDashboardLine },
  { name: 'My Profile', href: '/dashboard/profile', icon: RiUserLine },
  { name: 'Applications', href: '/dashboard/applications', icon: RiFileTextLine },
  { name: 'Saved Jobs', href: '/dashboard/saved', icon: RiBookmarkLine },
  { name: 'Browse Jobs', href: '/jobs', icon: RiBriefcaseLine },
]

export default function DashboardHeader({ user }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
            <RiBriefcaseLine className="text-white text-lg" />
          </div>
          <span className="text-lg font-display font-bold text-gray-900 dark:text-white hidden sm:inline">
            Career<span className="text-brand-600">Lanka</span>
          </span>
        </Link>

        {/* User Avatar (desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Welcome, <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
          </span>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shadow-md">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {mobileMenuOpen ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg animate-fadeIn">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="text-xl" />
                  {item.name}
                </Link>
              )
            })}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600"
            >
              <RiLogoutBoxLine className="text-xl" />
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}