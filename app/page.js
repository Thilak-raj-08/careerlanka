import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/PublicNavbar'
import PublicFooter from '@/components/PublicFooter'
import JobCard from '@/components/JobCard'
import {
  RiSearchLine,
  RiBriefcaseLine,
  RiBuilding2Line,
  RiUserSmileLine,
  RiArrowRightLine,
  RiCheckLine,
  RiUserAddLine,
  RiFileTextLine,
  RiCheckboxCircleFill,
  RiStarFill,
} from 'react-icons/ri'

// Popular search tags
const popularTags = [
  'Internship',
  'React',
  'Java',
  'Remote',
  'Frontend',
  'Backend',
  'UI/UX',
]

// How it works steps
const steps = [
  {
    icon: RiUserAddLine,
    title: 'Create Your Profile',
    description: 'Sign up in seconds. Build a beautiful profile that showcases your skills and education.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: RiSearchLine,
    title: 'Discover Opportunities',
    description: 'Browse internships and jobs from top Sri Lankan companies. Filter by location, type, and skills.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: RiFileTextLine,
    title: 'Apply with One Click',
    description: 'Apply to jobs instantly with your saved profile. Track your applications in real-time.',
    color: 'from-pink-500 to-pink-700',
  },
]

// Sample testimonials
const testimonials = [
  {
    name: 'Sahana Perera',
    role: 'Software Engineering Graduate',
    avatar: 'S',
    color: 'from-pink-500 to-rose-600',
    rating: 5,
    quote: 'CareerLanka helped me land my first internship at WSO2. The platform is so easy to use, and I got responses within days!',
  },
  {
    name: 'Kavinda Silva',
    role: 'CS Student, University of Moratuwa',
    avatar: 'K',
    color: 'from-blue-500 to-indigo-600',
    rating: 5,
    quote: 'I love how I can filter jobs by location and type. Found a remote internship that matched my skills perfectly.',
  },
  {
    name: 'Priya Krishnan',
    role: 'HR Manager, IFS Sri Lanka',
    avatar: 'P',
    color: 'from-emerald-500 to-teal-600',
    rating: 5,
    quote: 'The quality of candidates on CareerLanka is amazing. We hired 3 interns this year through the platform.',
  },
]

// Fetch live data from database
async function getLandingPageData() {
  const [featuredJobs, jobCount, companyCount, applicationCount] = await Promise.all([
    prisma.job.findMany({
      where: { status: 'ACTIVE' },
      include: { company: true },
      orderBy: [{ isFeatured: 'desc' }, { postedAt: 'desc' }],
      take: 6,
    }),
    prisma.job.count({ where: { status: 'ACTIVE' } }),
    prisma.companyProfile.count({ where: { status: 'APPROVED' } }),
    prisma.application.count(),
  ])

  const featuredCompanies = await prisma.companyProfile.findMany({
    where: { status: 'APPROVED' },
    include: { _count: { select: { jobs: true } } },
    take: 5,
  })

  return {
    featuredJobs,
    featuredCompanies,
    stats: { jobs: jobCount, companies: companyCount, applications: applicationCount },
  }
}

export default async function HomePage() {
  const { featuredJobs, featuredCompanies, stats } = await getLandingPageData()

  return (
    <>
      <PublicNavbar />

      <main className="pt-16 lg:pt-18">
        {/* ============================================
            HERO SECTION
            ============================================ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-900 dark:via-gray-900 dark:to-brand-900/30 py-16 lg:py-24">
          {/* Decorative blobs */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-brand-300/20 dark:bg-brand-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Top badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-100 dark:bg-brand-900/30 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                  🇱🇰 Sri Lanka's #1 Career Platform
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Find Your Dream{' '}
                <span className="text-gradient">Career</span>
                <br />
                Right Here in Sri Lanka
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Discover thousands of internships and job opportunities from top Sri Lankan companies. Your career journey starts now.
              </p>

              {/* Search Bar */}
              <form
                action="/jobs"
                className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Job title, company, or skills"
                    className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <RiSearchLine />
                  Search Jobs
                </button>
              </form>

              {/* Popular searches */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Popular:</span>
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/jobs?search=${tag}`}
                    className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            STATS SECTION
            ============================================ */}
        <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-8">
              {[
                { icon: RiBriefcaseLine, label: 'Active Jobs', value: stats.jobs, suffix: '+' },
                { icon: RiBuilding2Line, label: 'Companies', value: stats.companies, suffix: '+' },
                { icon: RiUserSmileLine, label: 'Applications', value: stats.applications, suffix: '+' },
              ].map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 mb-3">
                      <Icon className="text-brand-600 text-2xl" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                      {stat.value}{stat.suffix}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================
            FEATURED JOBS SECTION
            ============================================ */}
        <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-800/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-medium text-brand-600 uppercase tracking-widest mb-2">
                  Latest Opportunities
                </p>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                  Featured <span className="text-gradient">Jobs</span>
                </h2>
              </div>
              <Link
                href="/jobs"
                className="hidden sm:inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors"
              >
                View all jobs
                <RiArrowRightLine />
              </Link>
            </div>

            {featuredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No jobs available yet. Check back soon!
              </div>
            )}

            {/* Mobile View All */}
            <div className="text-center mt-10 sm:hidden">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
              >
                View All Jobs
                <RiArrowRightLine />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================
            HOW IT WORKS SECTION
            ============================================ */}
        <section className="py-16 lg:py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-brand-600 uppercase tracking-widest mb-2">
                Simple Process
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
                How <span className="text-gradient">CareerLanka</span> Works
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Get hired in 3 simple steps. No complicated forms, no waiting weeks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700"></div>

              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl text-center">
                    {/* Step number */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className={`w-24 h-24 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg relative z-10`}>
                      <Icon className="text-white text-4xl" />
                    </div>

                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================
            FEATURED COMPANIES SECTION
            ============================================ */}
        <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-800/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-brand-600 uppercase tracking-widest mb-2">
                Trusted by Top Brands
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                Featured <span className="text-gradient">Companies</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {featuredCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.id}`}
                  className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                    {company.companyName.charAt(0)}
                  </div>
                  <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {company.companyName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {company._count.jobs} {company._count.jobs === 1 ? 'job' : 'jobs'} open
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            TESTIMONIALS SECTION
            ============================================ */}
        <section className="py-16 lg:py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-brand-600 uppercase tracking-widest mb-2">
                Success Stories
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
                What People <span className="text-gradient">Say</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <RiStarFill key={idx} className="text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{t.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold shadow-md`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-display font-bold text-gray-900 dark:text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            CTA SECTION
            ============================================ */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-3xl p-8 lg:p-16 text-center text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>

              <div className="relative max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
                  Ready to Start Your Career Journey?
                </h2>
                <p className="text-lg text-brand-100 mb-8">
                  Join thousands of students who found their dream jobs through CareerLanka. It's free, fast, and effective.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 font-medium rounded-lg shadow-lg hover:bg-brand-50 transition-all hover:-translate-y-0.5"
                  >
                    Sign Up Free
                    <RiArrowRightLine />
                  </Link>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/20 transition-all hover:-translate-y-0.5"
                  >
                    Browse Jobs
                  </Link>
                </div>

                {/* Features */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-brand-100">
                  {['Free Forever', 'No Credit Card', 'Verified Companies'].map((f) => (
                    <div key={f} className="flex items-center gap-1.5">
                      <RiCheckboxCircleFill className="text-white" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  )
}