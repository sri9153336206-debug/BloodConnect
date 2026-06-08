import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  MessageSquare,
  Clock,
  ArrowRight,
  User,
  AlertCircle,
} from 'lucide-react'
import { useUI }   from '../context/UIContext.jsx'
import Input, { Textarea } from '../components/ui/Input.jsx'
import Button              from '../components/ui/Button.jsx'
import { OverlayLoader }   from '../components/ui/Loader.jsx'
import {
  validateContactForm,
  hasErrors,
} from '../utils/validators.js'
import {
  CONTACT_INFO,
  SOCIAL_LINKS,
} from '../constants/index.js'
import { submitContactQuery } from '../services/mockApi.js'

// ════════════════════════════════════════════════════
//  CONTACT INFO CARD
// ════════════════════════════════════════════════════
const ContactInfoCard = ({
  icon,
  title,
  value,
  subtitle,
  href,
  color = 'red',
}) => {

  const colorClasses = {
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',    hover: 'hover:border-red-200'   },
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   hover: 'hover:border-blue-200'  },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  hover: 'hover:border-green-200' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', hover: 'hover:border-purple-200'},
  }

  const colors  = colorClasses[color] ?? colorClasses.red
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href
    ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={[
        'flex items-start gap-4 p-5',
        'bg-white rounded-2xl border border-gray-100',
        'transition-all duration-200',
        href ? 'hover:shadow-md cursor-pointer' : '',
        href ? colors.hover : '',
        'group',
      ].filter(Boolean).join(' ')}
    >
      {/* Icon */}
      <div className={[
        'w-11 h-11 rounded-xl flex-shrink-0',
        'flex items-center justify-center',
        'transition-colors duration-200',
        colors.bg,
        colors.icon,
      ].join(' ')}>
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className={[
          'text-sm font-semibold text-gray-800',
          'truncate',
          href ? 'group-hover:text-red-600 transition-colors duration-150' : '',
        ].join(' ')}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </Wrapper>
  )
}

// ════════════════════════════════════════════════════
//  SOCIAL ICON MAP
// ════════════════════════════════════════════════════
const SocialIconMap = {
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

// ════════════════════════════════════════════════════
//  CONTACT PAGE
// ════════════════════════════════════════════════════
const ContactPage = () => {

  const navigate        = useNavigate()
  const { showSuccess } = useUI()

  // ── Form State ────────────────────────────────────
  const [form, setForm] = useState({
    name:    '',
    email:   '',
    subject: '',
    message: '',
  })

  const [errors,     setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  // ── Handle Change ─────────────────────────────────
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // ── Handle Submit ─────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault()

    // validate
    const formErrors = validateContactForm({
      name:    form.name,
      email:   form.email,
      message: form.message,
    })

    if (hasErrors(formErrors)) {
      setErrors(formErrors)
      return
    }

    setSubmitting(true)

    try {
      await submitContactQuery(form)
      setSubmitted(true)
      showSuccess('Message sent successfully! We will get back to you soon.')
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit contact query. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  // ── Handle Reset ──────────────────────────────────
  const handleReset = () => {
    setForm({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    setSubmitted(false)
  }

  // ── Subject Options ───────────────────────────────
  const subjectOptions = [
    'General Inquiry',
    'Donor Registration Help',
    'Finding a Donor',
    'Technical Issue',
    'Partnership Opportunity',
    'Feedback',
    'Emergency Blood Need',
    'Other',
  ]

  // ── FAQ Quick Links ───────────────────────────────
  const faqLinks = [
    'Who can donate blood?',
    'How do I search for donors?',
    'How do I register as a donor?',
    'Is my information safe?',
  ]

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════════
           HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">

            {/* Icon */}
            <div className={[
              'w-14 h-14 rounded-2xl bg-red-50 text-red-600',
              'flex items-center justify-center mx-auto mb-5',
            ].join(' ')}>
              <MessageSquare size={28} />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Contact Us
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              We are here to help you. Reach out to us for any
              queries, feedback, or support.
            </p>

          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Contact Info ──────────────── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Contact Cards */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-gray-800 mb-4">
                Get In Touch
              </h2>

              <ContactInfoCard
                icon={<Phone size={20} />}
                title="Phone Number"
                value={CONTACT_INFO.phone}
                subtitle="Mon–Sat, 9am–6pm"
                href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
                color="red"
              />

              <ContactInfoCard
                icon={<Mail size={20} />}
                title="Email Address"
                value={CONTACT_INFO.email}
                subtitle="We reply within 24 hours"
                href={`mailto:${CONTACT_INFO.email}`}
                color="blue"
              />

              <ContactInfoCard
                icon={<MapPin size={20} />}
                title="Location"
                value={CONTACT_INFO.location}
                subtitle="Headquarters"
                color="green"
              />

              <ContactInfoCard
                icon={<Clock size={20} />}
                title="Working Hours"
                value="24/7 Emergency Support"
                subtitle="Regular: 9am – 6pm IST"
                color="purple"
              />
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4">
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(social => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className={[
                      'w-9 h-9 rounded-xl',
                      'flex items-center justify-center',
                      'bg-gray-50 hover:bg-red-600',
                      'text-gray-500 hover:text-white',
                      'border border-gray-100 hover:border-red-600',
                      'transition-all duration-200',
                    ].join(' ')}
                  >
                    {SocialIconMap[social.icon]}
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4">
                Quick Answers
              </h3>
              <ul className="space-y-2">
                {faqLinks.map(question => (
                  <li key={question}>
                    <button
                      type="button"
                      onClick={() => navigate('/faq')}
                      className={[
                        'w-full flex items-center gap-2',
                        'text-left text-sm text-gray-600',
                        'hover:text-red-600',
                        'transition-colors duration-150',
                        'py-1',
                      ].join(' ')}
                    >
                      <ArrowRight
                        size={13}
                        className="text-red-400 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => navigate('/faq')}
                className={[
                  'w-full mt-3 py-2 rounded-xl',
                  'text-xs font-semibold text-red-600',
                  'border border-red-100 hover:bg-red-50',
                  'transition-colors duration-150',
                ].join(' ')}
              >
                View All FAQs →
              </button>
            </div>

          </div>

          {/* ── Right: Contact Form ─────────────── */}
          <div className="lg:col-span-2">

            {/* Success State */}
            {submitted ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center animate-scale-in">

                {/* Icon */}
                <div className={[
                  'w-20 h-20 rounded-full bg-green-100',
                  'flex items-center justify-center',
                  'mx-auto mb-5',
                ].join(' ')}>
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Message Sent!
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-2 max-w-sm mx-auto">
                  Thank you for reaching out,{' '}
                  <strong className="text-gray-700">{form.name}</strong>!
                  We have received your message and will
                  get back to you at{' '}
                  <strong className="text-gray-700">{form.email}</strong>{' '}
                  within 24 hours.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleReset}
                  >
                    Send Another Message
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => navigate('/')}
                  >
                    Go to Home
                  </Button>
                </div>

              </div>
            ) : (

              /* Form State */
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative">

                {/* Overlay Loader */}
                <OverlayLoader
                  visible={submitting}
                  message="Sending your message..."
                />

                {/* Form Header */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">
                    Send us a Message
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Fill out the form below and we'll get back to you shortly
                  </p>
                </div>

                {/* Form Body */}
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="p-6 space-y-5"
                >

                  {/* Name + Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      error={errors.name}
                      required
                      leftIcon={<User size={16} />}
                      autoComplete="name"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      error={errors.email}
                      required
                      leftIcon={<Mail size={16} />}
                      autoComplete="email"
                    />
                  </div>

                  {/* Phone (optional) */}
                  <Input
                    label="Phone Number (optional)"
                    type="tel"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    leftIcon={<Phone size={16} />}
                    autoComplete="tel"
                  />

                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={e => handleChange('subject', e.target.value)}
                      className={[
                        'w-full px-4 py-2.5 rounded-xl',
                        'border border-gray-200 bg-white',
                        'text-sm text-gray-700',
                        'hover:border-gray-300',
                        'focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500',
                        'transition-all duration-200 appearance-none cursor-pointer',
                        'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")]',
                        'bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat pr-9',
                      ].join(' ')}
                    >
                      <option value="">Select a subject</option>
                      {subjectOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <Textarea
                    label="Your Message"
                    placeholder="Write your message here... Please include as much detail as possible so we can help you better."
                    value={form.message}
                    onChange={e => handleChange('message', e.target.value)}
                    error={errors.message}
                    required
                    rows={5}
                    maxLength={500}
                    helperText="Minimum 10 characters required"
                  />

                  {/* Privacy Note */}
                  <div className={[
                    'flex items-start gap-2.5 p-3 rounded-xl',
                    'bg-blue-50 border border-blue-100',
                  ].join(' ')}>
                    <AlertCircle
                      size={15}
                      className="text-blue-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-blue-600 leading-relaxed">
                      Your information is kept private and will
                      only be used to respond to your inquiry.
                      We never share your data with third parties.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={submitting}
                    leftIcon={<Send size={18} />}
                  >
                    {submitting ? 'Sending Message...' : 'Send Message'}
                  </Button>

                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
           EMERGENCY CONTACT BANNER
      ══════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className={[
          'bg-red-600 rounded-2xl p-6',
          'flex flex-col sm:flex-row items-center justify-between gap-5',
        ].join(' ')}>
          <div>
            <h3 className="text-white font-bold text-lg mb-1">
              Need Blood Urgently?
            </h3>
            <p className="text-red-100 text-sm">
              Don't wait — search our donor database right now
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
              className={[
                'inline-flex items-center justify-center gap-2',
                'px-5 py-2.5 rounded-xl',
                'bg-white text-red-600',
                'font-semibold text-sm',
                'hover:bg-red-50',
                'transition-colors duration-200',
                'whitespace-nowrap',
              ].join(' ')}
            >
              <Phone size={16} />
              Call Now
            </a>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/find-donors')}
              className="border-white text-white hover:bg-white/10 whitespace-nowrap"
            >
              Find Donors
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ContactPage