'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { updateCompanyProfile } from '@/actions/company'
import {
  RiBuilding2Line,
  RiInformationLine,
  RiGlobalLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPin2Line,
  RiLinkedinFill,
  RiFacebookFill,
  RiTwitterXFill,
  RiSaveLine,
  RiCheckboxCircleFill,
  RiTimeLine,
  RiCloseCircleFill,
} from 'react-icons/ri'

const industryOptions = [
  'Information Technology',
  'Software Development',
  'IT Services & Consulting',
  'Mobile Development',
  'Food Technology',
  'E-Commerce',
  'Financial Services',
  'Healthcare',
  'Education',
  'Marketing & Advertising',
  'Telecommunications',
  'Manufacturing',
  'Retail',
  'Hospitality',
  'Other',
]

const sizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
]

const statusConfig = {
  PENDING: {
    label: 'Pending Approval',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    icon: RiTimeLine,
  },
  APPROVED: {
    label: 'Verified',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    icon: RiCheckboxCircleFill,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    icon: RiCloseCircleFill,
  },
  SUSPENDED: {
    label: 'Suspended',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
    icon: RiCloseCircleFill,
  },
}

export default function CompanyProfileForm({ profile }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const status = statusConfig[profile?.status] || statusConfig.PENDING
  const StatusIcon = status.icon

  const [form, setForm] = useState({
    companyName: profile?.companyName || '',
    tagline: profile?.tagline || '',
    description: profile?.description || '',
    industry: profile?.industry || '',
    size: profile?.size || '',
    foundedYear: profile?.foundedYear ?? '',
    website: profile?.website || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    address: profile?.address || '',
    linkedinUrl: profile?.linkedinUrl || '',
    facebookUrl: profile?.facebookUrl || '',
    twitterUrl: profile?.twitterUrl || '',
  })

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await updateCompanyProfile(form)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Badge */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${status.color}`}>
            <StatusIcon />
            {status.label}
          </div>
          {profile?.verifiedAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Verified on {new Date(profile.verifiedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {profile?.totalJobsPosted !== undefined && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">{profile.totalJobsPosted}</strong> jobs posted total
          </div>
        )}
      </div>

      {/* Company Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Company Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <RiBuilding2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              placeholder="e.g., Building the future of food"
              maxLength={200}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              About Company
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Tell us about your company, mission, and what makes you unique..."
              rows={6}
              maxLength={2000}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.description.length}/2000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Industry
            </label>
            <select
              value={form.industry}
              onChange={(e) => updateField('industry', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select industry</option>
              {industryOptions.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Company Size
            </label>
            <select
              value={form.size}
              onChange={(e) => updateField('size', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select size</option>
              {sizeOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Founded Year
            </label>
            <input
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={form.foundedYear}
              onChange={(e) => updateField('foundedYear', e.target.value)}
              placeholder="2005"
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Website
            </label>
            <div className="relative">
              <RiGlobalLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={form.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Public Email
            </label>
            <div className="relative">
              <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="careers@company.com"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Phone
            </label>
            <div className="relative">
              <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+94 11 123 4567"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Location
            </label>
            <div className="relative">
              <RiMapPin2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="Colombo, Sri Lanka"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Full street address"
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Social Media
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              LinkedIn
            </label>
            <div className="relative">
              <RiLinkedinFill className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-lg" />
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => updateField('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Facebook
            </label>
            <div className="relative">
              <RiFacebookFill className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-lg" />
              <input
                type="url"
                value={form.facebookUrl}
                onChange={(e) => updateField('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/yourcompany"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Twitter / X
            </label>
            <div className="relative">
              <RiTwitterXFill className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white text-lg" />
              <input
                type="url"
                value={form.twitterUrl}
                onChange={(e) => updateField('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/yourcompany"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-gray-50/95 dark:via-gray-900/95 pb-4 pt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-lg shadow-lg shadow-brand-500/30 transition-all duration-200 hover:-translate-y-0.5 disabled:transform-none"
        >
          {isPending ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Saving...
            </>
          ) : (
            <>
              <RiSaveLine className="text-lg" />
              Save Profile
            </>
          )}
        </button>
      </div>
    </form>
  )
}