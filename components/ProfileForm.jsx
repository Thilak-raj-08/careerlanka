'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { updateStudentProfile } from '@/actions/profile'
import TagsInput from './TagsInput'
import {
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPin2Line,
  RiBriefcaseLine,
  RiLinkedinFill,
  RiGithubFill,
  RiGlobalLine,
  RiSaveLine,
  RiToggleFill,
  RiToggleLine,
} from 'react-icons/ri'

// Common skill suggestions
const skillSuggestions = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Next.js', 'Nuxt.js',
  'Node.js', 'Express', 'PHP', 'Laravel', 'Java', 'Spring Boot',
  'Python', 'Django', 'C#', '.NET', 'HTML5', 'CSS3', 'Tailwind CSS',
  'Bootstrap', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS',
  'Docker', 'Kubernetes', 'Git', 'GitHub', 'GitLab', 'Figma',
  'Adobe XD', 'Photoshop', 'Illustrator',
]

const languageSuggestions = ['English', 'Tamil', 'Sinhala', 'Hindi']

const locationSuggestions = [
  'Colombo', 'Jaffna', 'Kandy', 'Galle', 'Negombo', 'Anuradhapura',
  'Trincomalee', 'Batticaloa', 'Matara', 'Remote',
]

const jobTypeOptions = [
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'FREELANCE', label: 'Freelance' },
]

export default function ProfileForm({ user, profile }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    name: user.name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    headline: profile?.headline || '',
    bio: profile?.bio || '',
    linkedinUrl: profile?.linkedinUrl || '',
    githubUrl: profile?.githubUrl || '',
    portfolioUrl: profile?.portfolioUrl || '',
    skills: profile?.skills || [],
    languages: profile?.languages || [],
    preferredJobTypes: profile?.preferredJobTypes || [],
    preferredLocations: profile?.preferredLocations || [],
    experience: profile?.experience ?? '',
    expectedSalaryMin: profile?.expectedSalaryMin ?? '',
    expectedSalaryMax: profile?.expectedSalaryMax ?? '',
    openToWork: profile?.openToWork ?? true,
  })

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleJobType = (type) => {
    setForm((prev) => ({
      ...prev,
      preferredJobTypes: prev.preferredJobTypes.includes(type)
        ? prev.preferredJobTypes.filter((t) => t !== type)
        : [...prev.preferredJobTypes, type],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    startTransition(async () => {
      const result = await updateStudentProfile(form)
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
      {/* Status Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${form.openToWork ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {form.openToWork ? 'Open to Work' : 'Not Looking'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Show recruiters you're available
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => updateField('openToWork', !form.openToWork)}
          className="text-3xl"
        >
          {form.openToWork ? (
            <RiToggleFill className="text-brand-600" />
          ) : (
            <RiToggleLine className="text-gray-400" />
          )}
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full pl-10 pr-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
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
                placeholder="+94 70 123 4567"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Location */}
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

          {/* Headline */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Professional Headline
            </label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => updateField('headline', e.target.value)}
              placeholder="e.g., Final year Software Engineering student"
              maxLength={150}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.headline.length}/150 characters
            </p>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              About Me
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Tell us about yourself, your skills, and what you're looking for..."
              rows={5}
              maxLength={1000}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.bio.length}/1000 characters
            </p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Skills & Languages
        </h2>

        <div className="space-y-5">
          <TagsInput
            label="Skills"
            value={form.skills}
            onChange={(skills) => updateField('skills', skills)}
            placeholder="React, JavaScript, PHP..."
            suggestions={skillSuggestions}
            maxTags={30}
          />

          <TagsInput
            label="Languages"
            value={form.languages}
            onChange={(langs) => updateField('languages', langs)}
            placeholder="English, Tamil, Sinhala..."
            suggestions={languageSuggestions}
            maxTags={10}
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Social Links
        </h2>

        <div className="space-y-4">
          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              LinkedIn URL
            </label>
            <div className="relative">
              <RiLinkedinFill className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-lg" />
              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => updateField('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              GitHub URL
            </label>
            <div className="relative">
              <RiGithubFill className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white text-lg" />
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => updateField('githubUrl', e.target.value)}
                placeholder="https://github.com/yourusername"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Portfolio URL
            </label>
            <div className="relative">
              <RiGlobalLine className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-600 text-lg" />
              <input
                type="url"
                value={form.portfolioUrl}
                onChange={(e) => updateField('portfolioUrl', e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Job Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Job Preferences
        </h2>

        <div className="space-y-5">
          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={form.experience}
              onChange={(e) => updateField('experience', e.target.value)}
              placeholder="0 for fresher"
              className="w-full md:w-48 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Job Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred Job Types
            </label>
            <div className="flex flex-wrap gap-2">
              {jobTypeOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => toggleJobType(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.preferredJobTypes.includes(opt.value)
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Locations */}
          <TagsInput
            label="Preferred Locations"
            value={form.preferredLocations}
            onChange={(locs) => updateField('preferredLocations', locs)}
            placeholder="Colombo, Remote..."
            suggestions={locationSuggestions}
            maxTags={10}
          />

          {/* Expected Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Expected Salary Range (LKR/month)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                value={form.expectedSalaryMin}
                onChange={(e) => updateField('expectedSalaryMin', e.target.value)}
                placeholder="Minimum"
                className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="number"
                min="0"
                value={form.expectedSalaryMax}
                onChange={(e) => updateField('expectedSalaryMax', e.target.value)}
                placeholder="Maximum"
                className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
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