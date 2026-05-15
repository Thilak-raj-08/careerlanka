import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/PublicNavbar'
import PublicFooter from '@/components/PublicFooter'
import JobCard from '@/components/JobCard'
import JobFilters from '@/components/JobFilters'
import JobSearchBar from '@/components/JobSearchBar'
import Pagination from '@/components/Pagination'
import MobileFilterButton from '@/components/MobileFilterButton'
import SortDropdown from '@/components/SortDropdown'
import { RiBriefcaseLine, RiSearchEyeLine } from 'react-icons/ri'
import Link from 'next/link'

const PER_PAGE = 9

async function getJobs(searchParams) {
  const search = searchParams.search?.trim()
  const types = searchParams.type?.split(',').filter(Boolean) || []
  const locationTypes = searchParams.location?.split(',').filter(Boolean) || []
  const categories = searchParams.category?.split(',').filter(Boolean) || []
  const minSalary = searchParams.minSalary ? parseInt(searchParams.minSalary) : null
  const page = parseInt(searchParams.page) || 1
  const sort = searchParams.sort || 'newest'

  // Build Prisma where clause
  const where = {
    status: 'ACTIVE',
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { skills: { has: search } },
      { company: { companyName: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (types.length > 0) where.type = { in: types }
  if (locationTypes.length > 0) where.locationType = { in: locationTypes }
  if (categories.length > 0) where.category = { in: categories }
  if (minSalary) where.salaryMin = { gte: minSalary }

  // Sort options
  const orderBy =
    sort === 'salary-high'
      ? [{ salaryMax: 'desc' }]
      : sort === 'salary-low'
      ? [{ salaryMin: 'asc' }]
      : [{ isFeatured: 'desc' }, { postedAt: 'desc' }]

  // Get total + paginated results in parallel
  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      include: { company: true },
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
  ])

  return {
    jobs,
    total,
    page,
    totalPages: Math.ceil(total / PER_PAGE),
  }
}

export default async function JobsPage({ searchParams }) {
  const params = await searchParams
  const { jobs, total, page, totalPages } = await getJobs(params)
  const search = params.search

  return (
    <>
      <PublicNavbar />

      <main className="pt-16 lg:pt-18 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Page Header */}
        <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {search ? (
                  <>
                    Results for <span className="text-gradient">"{search}"</span>
                  </>
                ) : (
                  <>
                    Browse <span className="text-gradient">Jobs</span>
                  </>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find your next opportunity from {total}+ active job listings
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-6 max-w-3xl">
              <JobSearchBar />
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar (desktop) */}
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24">
                  <JobFilters />
                </div>
              </aside>

              {/* Jobs Grid */}
              <div className="lg:col-span-3">
                {/* Result Header */}
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing <span className="font-semibold text-gray-900 dark:text-white">{jobs.length}</span>
                      {' '}of <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
                      {' '}jobs
                      {page > 1 && ` (Page ${page} of ${totalPages})`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Mobile filter button */}
                    <MobileFilterButton />

                    {/* Sort dropdown - client component */}
                    <SortDropdown />
                  </div>
                </div>

                {/* Jobs Grid */}
                {jobs.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>

                    <Pagination currentPage={page} totalPages={totalPages} />
                  </>
                ) : (
                  /* Empty State */
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <RiSearchEyeLine className="text-gray-400 text-4xl" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
                      No jobs found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      {search
                        ? `We couldn't find any jobs matching "${search}". Try different keywords or clear your filters.`
                        : "No jobs match your current filters. Try adjusting them."}
                    </p>
                    <Link
                      href="/jobs"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <RiBriefcaseLine />
                      View All Jobs
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  )
}