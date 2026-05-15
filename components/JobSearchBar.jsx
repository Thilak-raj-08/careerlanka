'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RiSearchLine, RiCloseLine } from 'react-icons/ri'

export default function JobSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')

  // Sync URL → input on mount/param change
  useEffect(() => {
    setQuery(searchParams.get('search') || '')
  }, [searchParams])

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('search', query.trim())
    } else {
      params.delete('search')
    }
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  const clearSearch = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search jobs by title, company, or skills..."
        className="w-full pl-12 pr-32 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-28 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
        >
          <RiCloseLine className="text-xl" />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  )
}