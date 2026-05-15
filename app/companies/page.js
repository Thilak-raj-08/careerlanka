import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/PublicNavbar'
import PublicFooter from '@/components/PublicFooter'
import CompanyCard from '@/components/CompanyCard'
import CompanySearchBar from '@/components/CompanySearchBar'
import {
  RiBuilding2Line,
  RiSearchEyeLine,
  RiBriefcaseLine,
} from 'react-icons/ri'
import Link from 'next/link'

async function getCompanies(searchParams) {
  const search = searchParams.search?.trim()

  const where = {
    status: 'APPROVED',
  }

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { industry: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [companies, totalJobs] = await Promise.all([
    prisma.companyProfile.findMany({
      where,
      include: {
        _count: {
          select: { jobs: { where: { status: 'ACTIVE' } } },
        },
      },
      orderBy: { companyName: 'asc' },
    }),
    prisma.job.count({ where: { status: 'ACTIVE' } }),
  ])

  return { companies, totalJobs }
}

export default async function CompaniesPage({ searchParams }) {
  const params = await searchParams
  const { companies, totalJobs } = await getCompanies(params)
  const search = params.search

  return (
    <>
      <PublicNavbar />

      <main className="pt-16 lg:pt-18 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-brand-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900/30 rounded-full text-sm font-medium text-brand-700 dark:text-brand-300 mb-4">
                <RiBuilding2Line />
                Top Sri Lankan Employers
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-3">
                {search ? (
                  <>
                    Results for <span className="text-gradient">"{search}"</span>
                  </>
                ) : (
                  <>
                    Discover <span className="text-gradient">Companies</span>
                  </>
                )}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Explore {companies.length}+ verified companies hiring across Sri Lanka with {totalJobs}+ active job openings.
              </p>

              {/* Search Bar */}
              <CompanySearchBar />
            </div>
          </div>
        </section>

        {/* Companies Grid */}
        <section className="py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Result Header */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{companies.length}</span>
                {' '}{companies.length === 1 ? 'company' : 'companies'} found
              </p>
            </div>

            {companies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <RiSearchEyeLine className="text-gray-400 text-4xl" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
                  No companies found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {search
                    ? `We couldn't find companies matching "${search}". Try different keywords.`
                    : 'No companies available at the moment.'}
                </p>
                <Link
                  href="/companies"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
                >
                  <RiBuilding2Line />
                  View All Companies
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 lg:p-12 text-center text-white">
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
                Are You a Company?
              </h2>
              <p className="text-brand-100 mb-6 max-w-2xl mx-auto">
                Join CareerLanka and reach thousands of talented students looking for their next opportunity.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-700 font-medium rounded-lg hover:bg-brand-50 transition-colors"
              >
                <RiBriefcaseLine />
                Post a Job for Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  )
}