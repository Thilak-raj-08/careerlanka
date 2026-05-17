import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import CompanyProfileForm from '@/components/CompanyProfileForm'
import { RiBuilding2Line } from 'react-icons/ri'

export default async function CompanyProfilePage() {
  const session = await auth()

  const profile = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-3">
          <RiBuilding2Line />
          Company Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Edit Company <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete your company profile to attract more candidates and build trust.
        </p>
      </div>

      <CompanyProfileForm profile={profile} />
    </div>
  )
}