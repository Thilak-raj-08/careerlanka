'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  RiUserLine,
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiGraduationCapLine,
  RiBuilding2Line,
  RiArrowRightLine,
} from 'react-icons/ri'
import { signUpAction } from '@/actions/auth'

export default function SignUpPage() {
  const router = useRouter()
  const [role, setRole] = useState('STUDENT')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    formData.append('role', role)

    const result = await signUpAction(formData)

    if (result.success) {
      toast.success(result.message)
      router.push('/sign-in')
    } else {
      toast.error(result.error)
    }

    setLoading(false)
  }

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Create your account
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join CareerLanka and start your journey today
        </p>
      </div>

      {/* Role Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          I want to join as:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              role === 'STUDENT'
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <RiGraduationCapLine
              className={`text-3xl mx-auto mb-2 ${
                role === 'STUDENT'
                  ? 'text-brand-600'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            />
            <p
              className={`text-sm font-semibold ${
                role === 'STUDENT'
                  ? 'text-brand-700 dark:text-brand-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Student
            </p>
            <p className="text-xs text-gray-500 mt-1">Looking for jobs</p>
          </button>

          <button
            type="button"
            onClick={() => setRole('COMPANY')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              role === 'COMPANY'
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <RiBuilding2Line
              className={`text-3xl mx-auto mb-2 ${
                role === 'COMPANY'
                  ? 'text-brand-600'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            />
            <p
              className={`text-sm font-semibold ${
                role === 'COMPANY'
                  ? 'text-brand-700 dark:text-brand-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Company
            </p>
            <p className="text-xs text-gray-500 mt-1">Hiring talent</p>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {role === 'STUDENT' ? 'Full Name' : 'Company Name'}
          </label>
          <div className="relative">
            <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder={role === 'STUDENT' ? 'John Doe' : 'Acme Corp Pvt Ltd'}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              required
              minLength={8}
              placeholder="Min 8 chars, with uppercase, lowercase, number"
              className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <RiEyeOffLine className="text-lg" /> : <RiEyeLine className="text-lg" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Must contain uppercase, lowercase, and number
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all duration-200 hover:-translate-y-0.5 disabled:transform-none mt-2"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <RiArrowRightLine className="text-lg" />
            </>
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-brand-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-brand-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="font-medium text-brand-600 hover:text-brand-700 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}