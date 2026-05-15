'use client'

import toast from 'react-hot-toast'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="text-center max-w-2xl">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 bg-brand-50 dark:bg-brand-900/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
          <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
            Phase 1.2 Complete
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Career<span className="text-gradient">Lanka</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Sri Lanka's Internship & Career Platform
        </p>

        {/* Brand color palette preview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Brand Color Palette
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div
                key={shade}
                className={`bg-brand-${shade} w-10 h-10 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700`}
                title={`brand-${shade}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Test button */}
        <button
          onClick={() => toast.success('Tailwind theme + toaster working! 🎉')}
          className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all duration-200 hover:-translate-y-0.5"
        >
          Test Toast Notification
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-500 mt-8">
          Next: Phase 1.3 - Folder structure + Supabase setup
        </p>
      </div>
    </main>
  )
}