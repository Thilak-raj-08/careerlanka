import Link from 'next/link'
import { RiBriefcaseLine, RiCheckLine } from 'react-icons/ri'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Top Logo */}
        <div className="p-6 lg:p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-display font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
              <RiBriefcaseLine className="text-white text-xl" />
            </div>
            Career<span className="text-brand-600">Lanka</span>
          </Link>
        </div>

        {/* Form Content (centered) */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Bottom Footer */}
        <div className="p-6 lg:p-8 text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} CareerLanka. All rights reserved.
        </div>
      </div>

      {/* Right Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-brand-400/30 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative flex flex-col justify-center items-center p-12 text-white w-full">
          <div className="max-w-md">
            <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
              Your Career Journey Starts Here
            </h2>
            <p className="text-brand-100 text-lg mb-10 leading-relaxed">
              Sri Lanka's premier platform connecting talented students with top companies for internships and career opportunities.
            </p>

            {/* Feature list */}
            <ul className="space-y-4">
              {[
                'Browse 1000+ jobs and internships',
                'Direct connections with verified companies',
                'Track your applications easily',
                'Free for students - always',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mt-0.5">
                    <RiCheckLine className="text-white text-sm" />
                  </div>
                  <span className="text-brand-50">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-brand-200">Companies</p>
              </div>
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-brand-200">Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1K+</p>
                <p className="text-sm text-brand-200">Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}