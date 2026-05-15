'use client'

import Link from 'next/link'
import {
  RiBriefcaseLine,
  RiFacebookFill,
  RiTwitterFill,
  RiLinkedinFill,
  RiInstagramLine,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiHeartFill,
  RiSendPlaneFill,
} from 'react-icons/ri'

const forStudents = [
  { name: 'Browse Jobs', href: '/jobs' },
  { name: 'Browse Companies', href: '/companies' },
  { name: 'Career Resources', href: '/resources' },
  { name: 'Resume Tips', href: '/resources/resume' },
  { name: 'Sign Up as Student', href: '/sign-up' },
]

const forCompanies = [
  { name: 'Post a Job', href: '/company/post-job' },
  { name: 'Browse Candidates', href: '/company/candidates' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Hiring Guide', href: '/resources/hiring' },
  { name: 'Sign Up as Company', href: '/sign-up' },
]

const company = [
  { name: 'About Us', href: '/about' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
]

const socials = [
  { icon: RiFacebookFill, href: 'https://facebook.com', label: 'Facebook' },
  { icon: RiTwitterFill, href: 'https://twitter.com', label: 'Twitter' },
  { icon: RiLinkedinFill, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: RiInstagramLine, href: 'https://instagram.com', label: 'Instagram' },
]

export default function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="h-1 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800"></div>

      <div className="bg-gradient-to-br from-brand-700 to-brand-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                Stay in the loop
              </h3>
              <p className="text-brand-100 text-sm">
                Get weekly updates on new internships and job opportunities in Sri Lanka
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('Newsletter signup coming soon!')
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-brand-700 font-medium rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-2"
              >
                <RiSendPlaneFill /> Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
                <RiBriefcaseLine className="text-white text-xl" />
              </div>
              <span className="text-xl font-display font-bold text-white">
                Career<span className="text-brand-400">Lanka</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-sm">
              Sri Lanka's premier platform connecting talented students with top companies for internships and career opportunities. Built with passion, designed for success.
            </p>

            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <RiMailLine className="text-brand-400" />
                <a href="mailto:hello@careerlanka.com" className="hover:text-brand-400 transition-colors">
                  hello@careerlanka.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <RiPhoneLine className="text-brand-400" />
                <span>+94 70 185 6212</span>
              </li>
              <li className="flex items-center gap-2">
                <RiMapPin2Line className="text-brand-400" />
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
              For Students
            </h3>
            <ul className="space-y-2">
              {forStudents.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
              For Companies
            </h3>
            <ul className="space-y-2">
              {forCompanies.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-500 rounded-full"></span>
              Company
            </h3>
            <ul className="space-y-2">
              {company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} <span className="text-white font-medium">CareerLanka</span>.
              All rights reserved. Made with{' '}
              <RiHeartFill className="inline text-red-500 animate-pulse" /> in Sri Lanka
            </p>

            <div className="flex items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-brand-600 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Icon className="text-lg" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}