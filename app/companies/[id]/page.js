import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/PublicNavbar'
import PublicFooter from '@/components/PublicFooter'
import JobCard from '@/components/JobCard'
import {
  RiBuilding2Line,
  RiMapPin2Line,
  RiUserLine,
  RiGlobalLine,
  RiCalendarLine,
  RiPhoneLine,
  RiMailLine,
  RiBriefcaseLine,
  RiFacebookFill,
  RiLinkedinFill,
  RiTwitterXFill,
  RiArrowLeftLine,
  RiCheckboxCircleFill,
} from 'react-icons/ri'

async function getCompany(id) {
  const company = await prisma.companyProfile.findUnique({
    where: { id, status: 'APPROVED' },
    include: {
      user: {
        select: { name: true, email: true },
      },
      jobs: {
        where: { status: 'ACTIVE' },
        include: { company: true },
        orderBy: [{ isFeatured: 'desc' }, { postedAt: 'desc' }],
      },
    },
  })

  return company
}

export default async function CompanyDetailPage({ params }) {
  const { id } = await params
  const company = await getCompany(id)

  if (!company) notFound()

  return (
    <>
      <PublicNavbar />

      <main className="pt-16 lg:pt-18 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back to companies */}
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 mb-6 transition-colors"
          >
            <RiArrowLeftLine />
            Back to companies
          </Link>

          {/* Company Hero Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            {/* Cover gradient */}
            <div className="h-32 lg:h-48 bg-gradient-to-br from-brand-500 via-brand-700 to-brand-900 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cg fill=%22white%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M20 0v40M0 20h40%22 stroke=%22white%22 stroke-width=%220.5%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            </div>

            {/* Profile content */}
            <div className="px-6 lg:px-10 pb-8">
              <div className="flex flex-col sm:flex-row items-start gap-6 -mt-16 lg:-mt-20">
                {/* Logo */}
                <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-5xl shadow-xl border-4 border-white dark:border-gray-800 flex-shrink-0">
                  {company.companyName.charAt(0)}
                </div>

                {/* Name + Tagline */}
                <div className="flex-1 pt-4 sm:pt-16 lg:pt-20">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 flex-wrap">
                        {company.companyName}
                        <RiCheckboxCircleFill
                          className="text-brand-500 text-xl"
                          title="Verified company"
                        />
                      </h1>
                      {company.tagline && (
                        <p className="text-gray-600 dark:text-gray-400 italic">
                          "{company.tagline}"
                        </p>
                      )}
                    </div>

                    {/* Visit Website button */}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <RiGlobalLine />
                        Visit Website
                      </a>
                    )}
                  </div>

                  {/* Tags row */}
                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {company.industry && (
                      <div className="flex items-center gap-1.5">
                        <RiBuilding2Line className="text-brand-500" />
                        {company.industry}
                      </div>
                    )}
                    {company.location && (
                      <div className="flex items-center gap-1.5">
                        <RiMapPin2Line className="text-brand-500" />
                        {company.location}
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center gap-1.5">
                        <RiUserLine className="text-brand-500" />
                        {company.size} employees
                      </div>
                    )}
                    {company.foundedYear && (
                      <div className="flex items-center gap-1.5">
                        <RiCalendarLine className="text-brand-500" />
                        Founded {company.foundedYear}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: About + Jobs */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {company.description && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
                    About {company.companyName}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {company.description}
                  </p>
                </div>
              )}

              {/* Open Jobs */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
                    Open Positions
                    <span className="ml-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium">
                      {company.jobs.length}
                    </span>
                  </h2>
                </div>

                {company.jobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {company.jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <RiBriefcaseLine className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      No open positions at the moment. Check back soon!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Contact + Social */}
            <aside className="space-y-6">
              {/* Contact Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <RiBuilding2Line className="text-brand-500" />
                  Contact Information
                </h3>

                <ul className="space-y-3 text-sm">
                  {company.email && (
                    <li className="flex items-start gap-3">
                      <RiMailLine className="text-brand-500 text-lg flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Email
                        </p>
                        <a
                          href={`mailto:${company.email}`}
                          className="text-gray-900 dark:text-white hover:text-brand-600 transition-colors break-all"
                        >
                          {company.email}
                        </a>
                      </div>
                    </li>
                  )}
                  {company.phone && (
                    <li className="flex items-start gap-3">
                      <RiPhoneLine className="text-brand-500 text-lg flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Phone
                        </p>
                        <a
                          href={`tel:${company.phone}`}
                          className="text-gray-900 dark:text-white hover:text-brand-600 transition-colors"
                        >
                          {company.phone}
                        </a>
                      </div>
                    </li>
                  )}
                  {company.location && (
                    <li className="flex items-start gap-3">
                      <RiMapPin2Line className="text-brand-500 text-lg flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Location
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {company.location}
                        </p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Social Links */}
              {(company.linkedinUrl || company.facebookUrl || company.twitterUrl) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-2">
                    {company.linkedinUrl && (
                      <a
                        href={company.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <RiLinkedinFill />
                      </a>
                    )}
                    {company.facebookUrl && (
                      <a
                        href={company.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <RiFacebookFill />
                      </a>
                    )}
                    {company.twitterUrl && (
                      <a
                        href={company.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-900 hover:text-white transition-colors"
                      >
                        <RiTwitterXFill />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-sm font-display font-bold mb-4 flex items-center gap-2">
                  <RiBriefcaseLine />
                  Hiring Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-100 text-sm">Active jobs</span>
                    <span className="text-2xl font-bold">{company.jobs.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-100 text-sm">Total posted</span>
                    <span className="text-2xl font-bold">{company.totalJobsPosted || company.jobs.length}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  )
}