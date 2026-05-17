import Link from 'next/link'
import ApplicationStatusUpdater from './ApplicationStatusUpdater'
import { timeAgo } from '@/lib/utils'
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPin2Line,
  RiLinkedinFill,
  RiGithubFill,
  RiGlobalLine,
  RiFileTextLine,
  RiTimeLine,
  RiBriefcaseLine,
  RiGraduationCapLine,
} from 'react-icons/ri'

const statusConfig = {
  PENDING: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  REVIEWED: { label: 'Reviewed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  INTERVIEWING: { label: 'Interviewing', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  HIRED: { label: 'Hired', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  WITHDRAWN: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300' },
}

export default function CompanyApplicationCard({ application, showJob = false }) {
  const { student, job } = application
  const profile = student.studentProfile
  const status = statusConfig[application.status] || statusConfig.PENDING

  const canUpdateStatus = application.status !== 'WITHDRAWN' && application.status !== 'HIRED'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
      <div className="p-5">
        {/* Header: Avatar + Name + Status */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
            {student.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-gray-900 dark:text-white truncate">
                  {student.name}
                </h3>
                {profile?.headline && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {profile.headline}
                  </p>
                )}
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 ${status.color}`}>
                {status.label}
              </span>
            </div>

            {showJob && (
              <Link
                href={`/jobs/${job.slug}`}
                className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline mt-1"
              >
                <RiBriefcaseLine /> Applied for: {job.title}
              </Link>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
          <a
            href={`mailto:${student.email}`}
            className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
          >
            <RiMailLine />
            <span className="truncate">{student.email}</span>
          </a>
          {profile?.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
            >
              <RiPhoneLine />
              {profile.phone}
            </a>
          )}
          {profile?.location && (
            <div className="flex items-center gap-1.5">
              <RiMapPin2Line />
              {profile.location}
            </div>
          )}
          {profile?.experience !== null && profile?.experience !== undefined && (
            <div className="flex items-center gap-1.5">
              <RiBriefcaseLine />
              {profile.experience} year{profile.experience === 1 ? '' : 's'} exp
            </div>
          )}
        </div>

        {/* Bio Preview */}
        {profile?.bio && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
            {profile.bio}
          </p>
        )}

        {/* Skills */}
        {profile?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {profile.skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-md"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 6 && (
              <span className="px-2 py-0.5 text-xs text-gray-500">
                +{profile.skills.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Social Links */}
        {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl) && (
          <div className="flex gap-2 mb-4">
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <RiLinkedinFill />
              </a>
            )}
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <RiGithubFill />
              </a>
            )}
            {profile.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"
                aria-label="Portfolio"
              >
                <RiGlobalLine />
              </a>
            )}
          </div>
        )}

        {/* Cover Letter Preview */}
        {application.coverLetter && (
          <details className="mb-4 group">
            <summary className="cursor-pointer text-xs font-medium text-brand-600 hover:underline list-none">
              📝 Read cover letter
            </summary>
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line max-h-48 overflow-y-auto">
              {application.coverLetter}
            </div>
          </details>
        )}

        {/* Status Note (if any) */}
        {application.statusNote && (
          <div className={`p-3 rounded-lg mb-4 text-xs ${status.color}`}>
            <p className="font-medium">Your note:</p>
            <p className="opacity-80 mt-0.5">"{application.statusNote}"</p>
          </div>
        )}
      </div>

      {/* Footer: Timestamps + Actions */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <RiTimeLine />
            Applied {timeAgo(application.appliedAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {application.resumeUrl && (
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RiFileTextLine />
              Resume
            </a>
          )}

          {canUpdateStatus && (
            <ApplicationStatusUpdater
              applicationId={application.id}
              currentStatus={application.status}
            />
          )}
        </div>
      </div>
    </div>
  )
}