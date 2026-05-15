'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  RiSendPlaneFill,
  RiFileTextLine,
  RiLink,
  RiInformationLine,
  RiArrowLeftLine,
} from 'react-icons/ri'
import { submitApplication } from '@/actions/applications'

export default function ApplyForm({ job, profile, savedResumeUrl }) {
  const router = useRouter()
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeUrl, setResumeUrl] = useState(savedResumeUrl || '')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (coverLetter.length < 50) {
      toast.error('Cover letter must be at least 50 characters')
      return
    }

    if (!resumeUrl.trim()) {
      toast.error('Please provide a resume URL')
      return
    }

    startTransition(async () => {
      const result = await submitApplication({
        jobId: job.id,
        coverLetter,
        resumeUrl,
      })

      if (result.success) {
        toast.success(result.message)
        router.push(`/jobs/${result.jobSlug}/apply/success`)
      } else {
        toast.error(result.error)
      }
    })
  }

  // Sample cover letter template suggestion
  const insertTemplate = () => {
    const template = `Dear ${job.company.companyName} Hiring Team,

I am excited to apply for the ${job.title} position at ${job.company.companyName}. As a motivated software engineering graduate from Sri Lanka, I believe my skills and passion for technology make me a strong fit for this role.

My experience includes [briefly mention 2-3 relevant skills/projects from your profile]. I am particularly drawn to ${job.company.companyName} because [research the company and add a personal touch].

I am eager to contribute to your team and grow as a developer in a dynamic environment. Thank you for considering my application. I look forward to discussing how I can add value to ${job.company.companyName}.

Best regards,
[Your Name]`
    setCoverLetter(template)
    toast.success('Template inserted. Personalize it!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Summary Card */}
      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {job.company.companyName.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-brand-700 dark:text-brand-300 font-medium mb-0.5">
              You're applying for
            </p>
            <h3 className="font-display font-bold text-gray-900 dark:text-white">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {job.company.companyName} • {job.location || 'Remote'}
            </p>
          </div>
        </div>
      </div>

      {/* Cover Letter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="text-base font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <RiFileTextLine className="text-brand-500" />
            Cover Letter <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={insertTemplate}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            Insert Template
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Introduce yourself and explain why you're a great fit. Be specific about why you want this role.
        </p>

        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Dear Hiring Manager,

I am writing to express my interest in..."
          rows={12}
          required
          minLength={50}
          maxLength={3000}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />

        <div className="flex items-center justify-between mt-2 text-xs">
          <span
            className={
              coverLetter.length < 50
                ? 'text-red-500'
                : 'text-gray-500 dark:text-gray-400'
            }
          >
            {coverLetter.length < 50
              ? `${50 - coverLetter.length} more characters needed`
              : '✓ Minimum length met'}
          </span>
          <span className="text-gray-500">
            {coverLetter.length}/3000
          </span>
        </div>
      </div>

      {/* Resume URL */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <label className="text-base font-display font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <RiLink className="text-brand-500" />
          Resume Link <span className="text-red-500">*</span>
        </label>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Provide a link to your resume (Google Drive, Dropbox, your portfolio, etc.)
        </p>

        <input
          type="url"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          required
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        {/* Tips */}
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-2">
          <RiInformationLine className="text-blue-600 dark:text-blue-400 text-lg flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Tips:</p>
            <ul className="space-y-0.5">
              <li>• Make sure the link is publicly accessible (anyone with link can view)</li>
              <li>• Use Google Drive, Dropbox, or your personal portfolio</li>
              <li>• Test the link before submitting</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Reminder */}
      {!profile?.skills?.length && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex gap-3">
          <RiInformationLine className="text-amber-600 dark:text-amber-400 text-2xl flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-amber-900 dark:text-amber-300 mb-1">
              Complete your profile first
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Recruiters will view your profile after you apply. Make sure to add your skills and bio.
            </p>
            <button
              type="button"
              onClick={() => router.push('/dashboard/profile')}
              className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-300 hover:underline"
            >
              Update profile →
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <RiArrowLeftLine />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || coverLetter.length < 50}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-brand-500/30 transition-all duration-200 hover:-translate-y-0.5 disabled:transform-none"
        >
          {isPending ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Submitting...
            </>
          ) : (
            <>
              <RiSendPlaneFill className="text-lg" />
              Submit Application
            </>
          )}
        </button>
      </div>
    </form>
  )
}