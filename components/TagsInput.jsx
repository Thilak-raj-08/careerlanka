'use client'

import { useState } from 'react'
import { RiAddLine, RiCloseLine } from 'react-icons/ri'

export default function TagsInput({
  label,
  value = [],
  onChange,
  placeholder = 'Type and press Enter',
  suggestions = [],
  maxTags = 30,
}) {
  const [input, setInput] = useState('')

  const addTag = (tag) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    if (value.includes(trimmed)) return
    if (value.length >= maxTags) return

    onChange([...value, trimmed])
    setInput('')
  }

  const removeTag = (tagToRemove) => {
    onChange(value.filter((t) => t !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      // Remove last tag on backspace when input is empty
      removeTag(value[value.length - 1])
    }
  }

  // Filter suggestions to exclude already-selected
  const filteredSuggestions = suggestions.filter(
    (s) =>
      !value.includes(s) &&
      s.toLowerCase().includes(input.toLowerCase()) &&
      input.trim().length > 0
  )

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {maxTags && value.length > 0 && (
            <span className="ml-2 text-xs text-gray-500">
              ({value.length}/{maxTags})
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <div className="min-h-[48px] w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent flex flex-wrap gap-2 items-center">
          {/* Existing tags */}
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded-md text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-brand-200 dark:hover:bg-brand-900/60 rounded p-0.5"
              >
                <RiCloseLine className="text-sm" />
              </button>
            </span>
          ))}

          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : 'Add another...'}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />

          {/* Add button */}
          {input.trim() && (
            <button
              type="button"
              onClick={() => addTag(input)}
              className="p-1 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded"
            >
              <RiAddLine className="text-lg" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
            {filteredSuggestions.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTag(s)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
        Press Enter to add. Click × to remove.
      </p>
    </div>
  )
}