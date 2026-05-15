import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import ProfileForm from '@/components/ProfileForm'
import { RiUserSettingsLine } from 'react-icons/ri'

async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { studentProfile: true },
  })
  return user
}

export default async function ProfilePage() {
  const session = await auth()
  const user = await getUserProfile(session.user.id)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-3">
          <RiUserSettingsLine />
          Profile Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Edit Your <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete your profile to attract more recruiters and increase your chances of being hired.
        </p>
      </div>

      {/* Form */}
      <ProfileForm user={user} profile={user.studentProfile} />
    </div>
  )
}