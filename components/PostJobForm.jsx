'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import TagsInput from './TagsInput'
import { createJob } from '@/actions/jobs-management'
import {
  RiBriefcaseLine,
  RiMapPin2Line,
  RiMoneyDollarCircleLine,
  RiFireFill,
  RiSendPlaneFill,
  RiDraftLine,
  RiInformationLine,
  RiCalendarLine,
} from 'react-icons/ri'

const jobTypes = [
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'FREELANCE', label: 'Freelance' },
]

const locationTypes = [
  { value: 'ONSITE', label: 'On-site' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
]

const categories = [
  'Software Development',
  'Mobile Development',
  'Web Development',
  'Data Engineering',
  'DevOps',
  'Quality Assurance',
  'UI/UX Design',
  'Product Management',
  'Marketing',
  'Sales',
  'Customer Support',
  'HR',
  'Finance',
  'Other',
]

const educationLevels = [
  'High School',
  'Diploma',
  'HND',
  "Bachelor's",
  "Master's",
  'PhD',
  'No specific requirement',
]

const skillSuggestions = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Next.js', 'Node.js',
  'PHP', 'Laravel', 'Java', 'Spring Boot', 'Python', 'Django',
  'C#', '.NET', 'MySQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker',
  'Git', 'Figma', 'Adobe XD',
]

export default function PostJobForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    type: 'FULL_TIME',
    locationType: 'ONSITE',
    location: '',
    category: '',
    salaryMin: '',
    salaryMax: '',
    showSalary: true,
    skills: [],
    experienceMin: 0,
    educationLevel: '',
    closesAt: '',
    isUrgent: false,
    status: 'ACTIVE',
  })

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (asDraft = false) => {
    if (!form.title.trim()) {
      toast.error('Please enter a job title')
      return
    }
    if (form.description.length < 50) {
      toast.error('Description must be at least 50 characters')
      return
    }

    const submitData = {
      ...form,
      status: asDraft ? 'DRAFT' : 'ACTIVE',
    }

    startTransition(async () => {
      const result = await createJob(submitData)
      if (result.success) {
        toast.success(result.message)
        if (asDraft) {
          router.push('/company/jobs')
        } else {
          router.push(`/jobs/${result.slug}`)
        }
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(false)
      }}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Basic Information
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Job Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <RiBriefcaseLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Software Engineering Intern"
                maxLength={150}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
              rows={6}
              minLength={50}
              maxLength={5000}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <p className={`text-xs mt-1 ${form.description.length < 50 ? 'text-red-500' : 'text-gray-500'}`}>
              {form.description.length}/5000 (min 50)
            </p>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.requirements}
              onChange={(e) => updateField('requirements', e.target.value)}
              placeholder="List skills, qualifications, and experience required..."
              rows={5}
              minLength={20}
              maxLength={3000}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.requirements.length}/3000
            </p>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Benefits & Perks
            </label>
            <textarea
              value={form.benefits}
              onChange={(e) => updateField('benefits', e.target.value)}
              placeholder="Health insurance, flexible hours, learning budget, etc. (comma-separated)"
              rows={3}
              maxLength={2000}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Job Type & Location */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Job Type & Location
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Job Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {jobTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Work Mode <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.locationType}
              onChange={(e) => updateField('locationType', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {locationTypes.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Location {form.locationType !== 'REMOTE' && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <RiMapPin2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required={form.locationType !== 'REMOTE'}
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="Colombo, Sri Lanka"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Compensation
        </h2>

        <div className="space-y-4">
          {/* Show salary toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.showSalary}
              onChange={(e) => updateField('showSalary', e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Show salary publicly (recommended for transparency)
            </span>
          </label>

          {/* Salary range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Minimum (LKR/month)
              </label>
              <div className="relative">
                <RiMoneyDollarCircleLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={form.salaryMin}
                  onChange={(e) => updateField('salaryMin', e.target.value)}
                  placeholder="30000"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Maximum (LKR/month)
              </label>
              <div className="relative">
                <RiMoneyDollarCircleLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={form.salaryMax}
                  onChange={(e) => updateField('salaryMax', e.target.value)}
                  placeholder="50000"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements & Skills */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Skills & Experience
        </h2>

        <div className="space-y-4">
          <TagsInput
            label="Required Skills"
            value={form.skills}
            onChange={(skills) => updateField('skills', skills)}
            placeholder="React, JavaScript, etc."
            suggestions={skillSuggestions}
            maxTags={20}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Minimum Experience (years)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={form.experienceMin}
                onChange={(e) => updateField('experienceMin', e.target.value)}
                placeholder="0 for freshers"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Education Level
              </label>
              <select
                value={form.educationLevel}
                onChange={(e) => updateField('educationLevel', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select</option>
                {educationLevels.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Application Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
          Application Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Application Deadline
            </label>
            <div className="relative">
              <RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={form.closesAt}
                onChange={(e) => updateField('closesAt', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty for no deadline
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isUrgent}
              onChange={(e) => updateField('isUrgent', e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded"
            />
            <RiFireFill className="text-red-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Mark as urgent hiring
            </span>
          </label>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex gap-3">
        <RiInformationLine className="text-blue-600 text-2xl flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
            💡 Pro tips for a great job post
          </p>
          <ul className="text-blue-800 dark:text-blue-400 space-y-1 text-xs">
            <li>• Write clear, specific requirements (avoid jargon)</li>
            <li>• Be transparent about salary range — gets 3x more applications</li>
            <li>• List 5-8 skills (too many overwhelms candidates)</li>
            <li>• Mention growth opportunities in benefits section</li>
          </ul>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-gray-50/95 dark:via-gray-900/95 pb-4 pt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isPending}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RiDraftLine />
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-medium rounded-lg shadow-lg shadow-brand-500/30 transition-all duration-200 hover:-translate-y-0.5 disabled:transform-none"
          >
            {isPending ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Publishing...
              </>
            ) : (
              <>
                <RiSendPlaneFill />
                Publish Job
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}