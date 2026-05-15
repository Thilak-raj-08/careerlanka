// Format salary range with currency
export function formatSalary(min, max, currency = 'LKR', period = 'month') {
  if (!min && !max) return 'Salary not disclosed'

  const formatNum = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num
  }

  const symbol = currency === 'LKR' ? 'Rs.' : currency
  const periodLabel = period === 'month' ? '/mo' : period === 'year' ? '/yr' : '/hr'

  if (min && max) {
    return `${symbol} ${formatNum(min)} - ${formatNum(max)}${periodLabel}`
  }
  if (min) return `${symbol} ${formatNum(min)}+${periodLabel}`
  return `Up to ${symbol} ${formatNum(max)}${periodLabel}`
}

// Time ago - "2 days ago", "1 hour ago"
export function timeAgo(date) {
  if (!date) return ''

  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return 'Just now'

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }
  return 'Just now'
}

// Job type display - "INTERNSHIP" → "Internship"
export function formatJobType(type) {
  const map = {
    INTERNSHIP: 'Internship',
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
    FREELANCE: 'Freelance',
  }
  return map[type] || type
}

// Location type display
export function formatLocationType(type) {
  const map = {
    REMOTE: 'Remote',
    ONSITE: 'On-site',
    HYBRID: 'Hybrid',
  }
  return map[type] || type
}

// Job type badge color (Tailwind classes)
export function jobTypeColor(type) {
  const map = {
    INTERNSHIP: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    FULL_TIME: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    PART_TIME: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    CONTRACT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    FREELANCE: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

// Truncate text
export function truncate(text, length = 150) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}