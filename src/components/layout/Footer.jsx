import { Link } from 'react-router-dom'
import {
  Droplets,
  Phone,
  Mail,
  MapPin,
  Heart,
} from 'lucide-react'
import {
  APP_META,
  CONTACT_INFO,
  SOCIAL_LINKS,
  NAV_LINKS,
} from '../../constants/index.js'

// ════════════════════════════════════════════════════
//  FOOTER COMPONENT
// ════════════════════════════════════════════════════
const Footer = () => {

  const currentYear = new Date().getFullYear()

  // ── Quick Links ───────────────────────────────────
  const quickLinks = [
    { label: 'Home',          path: '/'               },
    { label: 'Find Donors',   path: '/find-donors'    },
    { label: 'Become a Donor',path: '/register-donor' },
    { label: 'About Us',      path: '/about'          },
    { label: 'Contact Us',    path: '/contact'        },
    { label: 'FAQ',           path: '/faq'            },
  ]

  // ── Legal Links ───────────────────────────────────
  const legalLinks = [
    { label: 'Privacy Policy',   path: '/privacy'  },
    { label: 'Terms of Service', path: '/terms'    },
    { label: 'Cookie Policy',    path: '/cookies'  },
  ]

  // ── Social Icon Map ───────────────────────────────
const socialIconMap = {
  facebook: (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  ),
}

  // ── Render ───────────────────────────────────────
  return (
    <footer className="bg-gray-900 text-gray-300">

      {/* ── Top CTA Banner ────────────────────── */}
      <div className="bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Left Text */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white">
                Every drop of blood can save a life
              </h3>
              <p className="text-red-100 text-sm mt-1">
                Register as a donor today and be someone's hero.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/register-donor"
                className={[
                  'px-6 py-2.5 rounded-xl',
                  'bg-white text-red-600',
                  'font-semibold text-sm',
                  'hover:bg-red-50',
                  'transition-colors duration-200',
                  'shadow-sm',
                  'whitespace-nowrap',
                ].join(' ')}
              >
                Become a Donor
              </Link>
              <Link
                to="/find-donors"
                className={[
                  'px-6 py-2.5 rounded-xl',
                  'border-2 border-white text-white',
                  'font-semibold text-sm',
                  'hover:bg-white/10',
                  'transition-colors duration-200',
                  'whitespace-nowrap',
                ].join(' ')}
              >
                Find Donors
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Main Footer Content ────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Column 1: Brand ─────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">

            {/* Logo */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-4 group"
              aria-label="BloodConnect Home"
            >
              <div className={[
                'w-8 h-8 rounded-full',
                'bg-red-600 group-hover:bg-red-500',
                'flex items-center justify-center',
                'transition-colors duration-200',
              ].join(' ')}>
                <Droplets size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Blood<span className="text-red-500">Connect</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              {APP_META.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className={[
                    'w-8 h-8 rounded-full',
                    'bg-gray-800 hover:bg-red-600',
                    'flex items-center justify-center',
                    'text-gray-400 hover:text-white',
                    'transition-all duration-200',
                  ].join(' ')}
                >
                  {socialIconMap[social.icon]}
                </a>
              ))}
            </div>

          </div>

          {/* ── Column 2: Quick Links ────────────── */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={[
                      'text-sm text-gray-400',
                      'hover:text-red-400',
                      'transition-colors duration-150',
                      'flex items-center gap-1.5 group',
                    ].join(' ')}
                  >
                    <span className={[
                      'w-1 h-1 rounded-full bg-red-600',
                      'group-hover:w-2 transition-all duration-200',
                    ].join(' ')} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Blood Groups ───────────── */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Find By Blood Group
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <Link
                  key={group}
                  to={`/find-donors?bloodGroup=${encodeURIComponent(group)}`}
                  className={[
                    'flex items-center justify-center',
                    'h-9 rounded-lg',
                    'bg-gray-800 hover:bg-red-600',
                    'text-gray-300 hover:text-white',
                    'text-xs font-bold',
                    'transition-all duration-200',
                    'border border-gray-700 hover:border-red-600',
                  ].join(' ')}
                  aria-label={`Find ${group} donors`}
                >
                  {group}
                </Link>
              ))}
            </div>

            {/* Donation Info */}
            <div className="mt-5 p-3 bg-gray-800 rounded-xl border border-gray-700">
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="text-red-400 font-semibold">Did you know?</span>
                {' '}One blood donation can save up to{' '}
                <span className="text-white font-semibold">3 lives</span>.
              </p>
            </div>
          </div>

          {/* ── Column 4: Contact Info ───────────── */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">

              {/* Phone */}
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 group"
                  aria-label={`Call us at ${CONTACT_INFO.phone}`}
                >
                  <div className={[
                    'w-8 h-8 rounded-lg flex-shrink-0',
                    'bg-gray-800 group-hover:bg-red-600',
                    'flex items-center justify-center',
                    'text-gray-400 group-hover:text-white',
                    'transition-all duration-200 mt-0.5',
                  ].join(' ')}>
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-sm text-gray-300 group-hover:text-red-400 transition-colors duration-150">
                      {CONTACT_INFO.phone}
                    </p>
                  </div>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-start gap-3 group"
                  aria-label={`Email us at ${CONTACT_INFO.email}`}
                >
                  <div className={[
                    'w-8 h-8 rounded-lg flex-shrink-0',
                    'bg-gray-800 group-hover:bg-red-600',
                    'flex items-center justify-center',
                    'text-gray-400 group-hover:text-white',
                    'transition-all duration-200 mt-0.5',
                  ].join(' ')}>
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm text-gray-300 group-hover:text-red-400 transition-colors duration-150 break-all">
                      {CONTACT_INFO.email}
                    </p>
                  </div>
                </a>
              </li>

              {/* Location */}
              <li>
                <div className="flex items-start gap-3">
                  <div className={[
                    'w-8 h-8 rounded-lg flex-shrink-0',
                    'bg-gray-800',
                    'flex items-center justify-center',
                    'text-gray-400 mt-0.5',
                  ].join(' ')}>
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-sm text-gray-300">
                      {CONTACT_INFO.location}
                    </p>
                  </div>
                </div>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────── */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-xs text-gray-500 text-center sm:text-left">
              © {currentYear}{' '}
              <span className="text-gray-400 font-medium">
                BloodConnect
              </span>
              . All rights reserved. Made with{' '}
              <Heart
                size={12}
                className="inline text-red-500 fill-red-500 mx-0.5"
                aria-hidden="true"
              />{' '}
              to save lives.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-4">
              {legalLinks.map((link, index) => (
                <span key={link.path} className="flex items-center gap-4">
                  <Link
                    to={link.path}
                    className={[
                      'text-xs text-gray-500',
                      'hover:text-red-400',
                      'transition-colors duration-150',
                      'whitespace-nowrap',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span
                      className="text-gray-700"
                      aria-hidden="true"
                    >
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer