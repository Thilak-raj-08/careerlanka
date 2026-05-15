'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  RiFilterLine,
  RiCloseLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiRefreshLine,
} from 'react-icons/ri'

const jobTypes = [
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'FREELANCE', label: 'Freelance' },
]

const locationTypes = [
  { value: 'REMOTE', label: 'Remote' },
  { value: 'ONSITE', label: 'On-site' },
  { value: 'HYBRID', label: 'Hybrid' },
]

const categories = [
  'Software Development',
  'Mobile Development',
  'Design',
  'Data Engineering',
  'DevOps',
  'Quality Assurance',
  'Marketing',
  'Sales',
]

// Helper to read array values from URL
function getArrayParam(searchParams, key) {
  const value = searchParams.get(key)
  return value ? value.split(',') : []
}

// Collapsible filter group
function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {open ? (
          <RiArrowUpSLine className="text-gray-500 text-xl" />
        ) : (
          <RiArrowDownSLine className="text-gray-500 text-xl" />
        )}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  )
}

// Checkbox item
function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-brand-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-brand-500 focus:ring-2"
      />
      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 transition-colors">
        {label}
      </span>
    </label>
  )
}

export default function JobFilters({ isMobile = false, onClose }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedTypes = getArrayParam(searchParams, 'type')
  const selectedLocations = getArrayParam(searchParams, 'location')
  const selectedCategories = getArrayParam(searchParams, 'category')
  const minSalary = searchParams.get('minSalary') || ''

  const updateFilter = (key, values) => {
    const params = new URLSearchParams(searchParams.toString())
    if (values.length === 0) {
      params.delete(key)
    } else {
      params.set(key, values.join(','))
    }
    params.delete('page') // reset to page 1
    router.push(`/jobs?${params.toString()}`)
  }

  const updateSingle = (key, value) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  const toggleArrayValue = (key, value, currentValues) => {
    const updated = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    updateFilter(key, updated)
  }

  const clearAllFilters = () => {
    const search = searchParams.get('search')
    router.push(search ? `/jobs?search=${search}` : '/jobs')
  }

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedLocations.length > 0 ||
    selectedCategories.length > 0 ||
    minSalary

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <RiFilterLine className="text-brand-600" />
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <RiRefreshLine />
              Clear all
            </button>
          )}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <RiCloseLine className="text-xl" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 max-h-[70vh] overflow-y-auto">
        {/* Job Type */}
        <FilterGroup title="Job Type">
          {jobTypes.map((type) => (
            <CheckboxItem
              key={type.value}
              label={type.label}
              checked={selectedTypes.includes(type.value)}
              onChange={() => toggleArrayValue('type', type.value, selectedTypes)}
            />
          ))}
        </FilterGroup>

        {/* Location Type */}
        <FilterGroup title="Location">
          {locationTypes.map((loc) => (
            <CheckboxItem
              key={loc.value}
              label={loc.label}
              checked={selectedLocations.includes(loc.value)}
              onChange={() => toggleArrayValue('location', loc.value, selectedLocations)}
            />
          ))}
        </FilterGroup>

        {/* Category */}
        <FilterGroup title="Category">
          {categories.map((cat) => (
            <CheckboxItem
              key={cat}
              label={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleArrayValue('category', cat, selectedCategories)}
            />
          ))}
        </FilterGroup>

        {/* Salary */}
        <FilterGroup title="Minimum Salary (LKR/month)">
          <div className="space-y-2">
            {[
              { value: '', label: 'Any salary' },
              { value: '30000', label: 'Rs. 30,000+' },
              { value: '50000', label: 'Rs. 50,000+' },
              { value: '100000', label: 'Rs. 100,000+' },
              { value: '200000', label: 'Rs. 200,000+' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="minSalary"
                  checked={minSalary === opt.value}
                  onChange={() => updateSingle('minSalary', opt.value)}
                  className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </FilterGroup>
      </div>

      {/* Mobile apply button */}
      {isMobile && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  )
}