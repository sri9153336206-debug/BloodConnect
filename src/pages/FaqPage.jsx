import { useState, useMemo } from 'react'
import { useNavigate }       from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Droplets,
  Phone,
  ArrowRight,
  X,
  MessageSquare,
} from 'lucide-react'
import { useUI }        from '../context/UIContext.jsx'
import Button           from '../components/ui/Button.jsx'
import { SimpleSearchInput } from '../components/features/SearchBar.jsx'
import { FAQ_DATA, CONTACT_INFO } from '../constants/index.js'

// ════════════════════════════════════════════════════
//  FAQ CATEGORIES
// ════════════════════════════════════════════════════
const FAQ_CATEGORIES = [
  { id: 'all',      label: 'All Questions', icon: <HelpCircle size={15} /> },
  { id: 'donation', label: 'Donation',      icon: <Droplets   size={15} /> },
  { id: 'platform', label: 'Platform',      icon: <MessageSquare size={15} /> },
  { id: 'safety',   label: 'Safety',        icon: <Phone      size={15} /> },
]

// ── Assign categories to FAQ items ───────────────────
const CATEGORIZED_FAQ = FAQ_DATA.map((item, i) => ({
  ...item,
  category: i < 3
    ? 'donation'
    : i < 6
    ? 'platform'
    : 'safety',
}))

// ════════════════════════════════════════════════════
//  FAQ ITEM COMPONENT
// ════════════════════════════════════════════════════
const FaqItem = ({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}) => {
  return (
    <div
      className={[
        'border rounded-2xl overflow-hidden',
        'transition-all duration-200',
        isOpen
          ? 'border-red-200 shadow-sm'
          : 'border-gray-100 hover:border-gray-200',
        'bg-white',
      ].join(' ')}
    >
      {/* Question Button */}
      <button
        type="button"
        onClick={onToggle}
        className={[
          'w-full flex items-center justify-between',
          'px-5 py-4 text-left',
          'focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-inset',
          'transition-colors duration-150',
          isOpen ? 'bg-red-50' : 'hover:bg-gray-50',
        ].join(' ')}
        aria-expanded={isOpen}
        id={`faq-question-${index}`}
        aria-controls={`faq-answer-${index}`}
      >
        {/* Left: Number + Question */}
        <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
          <span className={[
            'flex-shrink-0 w-6 h-6 rounded-full',
            'flex items-center justify-center',
            'text-xs font-bold mt-0.5',
            isOpen
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-500',
            'transition-colors duration-150',
          ].join(' ')}>
            {index + 1}
          </span>
          <span className={[
            'text-sm font-semibold leading-relaxed',
            isOpen ? 'text-red-700' : 'text-gray-800',
            'transition-colors duration-150',
          ].join(' ')}>
            {question}
          </span>
        </div>

        {/* Right: Chevron */}
        <div className={[
          'flex-shrink-0 w-7 h-7 rounded-full',
          'flex items-center justify-center',
          'transition-all duration-200',
          isOpen
            ? 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-400',
        ].join(' ')}>
          {isOpen
            ? <ChevronUp   size={15} />
            : <ChevronDown size={15} />
          }
        </div>
      </button>

      {/* Answer */}
      {isOpen && (
        <div
          id={`faq-answer-${index}`}
          role="region"
          aria-labelledby={`faq-question-${index}`}
          className="px-5 pb-5 animate-fade-in"
        >
          {/* Divider */}
          <div className="border-t border-red-100 mb-4" />

          {/* Answer Text */}
          <p className="text-sm text-gray-600 leading-relaxed pl-9">
            {answer}
          </p>

          {/* Helpful Actions */}
          <div className="flex items-center gap-3 mt-4 pl-9">
            <p className="text-xs text-gray-400">
              Was this helpful?
            </p>
            <button
              type="button"
              className={[
                'text-xs font-medium px-2.5 py-1 rounded-full',
                'bg-green-50 text-green-600',
                'hover:bg-green-100',
                'transition-colors duration-150',
              ].join(' ')}
              onClick={() => {}}
            >
              👍 Yes
            </button>
            <button
              type="button"
              className={[
                'text-xs font-medium px-2.5 py-1 rounded-full',
                'bg-gray-50 text-gray-500',
                'hover:bg-gray-100',
                'transition-colors duration-150',
              ].join(' ')}
              onClick={() => {}}
            >
              👎 No
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════
//  FAQ PAGE
// ════════════════════════════════════════════════════
const FaqPage = () => {

  const navigate        = useNavigate()
  const { showInfo }    = useUI()

  // ── State ─────────────────────────────────────────
  const [openId,       setOpenId]       = useState(null)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // ── Toggle FAQ Item ───────────────────────────────
  const handleToggle = (id) => {
    setOpenId(prev => prev === id ? null : id)
  }

  // ── Filter FAQs ───────────────────────────────────
  const filteredFaqs = useMemo(() => {
    let result = [...CATEGORIZED_FAQ]

    // category filter
    if (activeCategory !== 'all') {
      result = result.filter(f => f.category === activeCategory)
    }

    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
      )
    }

    return result
  }, [searchQuery, activeCategory])

  // ── Expand All / Collapse All ─────────────────────
  const allIds    = filteredFaqs.map(f => f.id)
  const allOpen   = openId !== null

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════════
           HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Icon */}
          <div className={[
            'w-14 h-14 rounded-2xl bg-red-50 text-red-600',
            'flex items-center justify-center mx-auto mb-5',
          ].join(' ')}>
            <HelpCircle size={28} />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Find answers to common questions about BloodConnect,
            blood donation, and how our platform works.
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto">
            <SimpleSearchInput
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search questions..."
              size="lg"
            />
          </div>

          {/* Search Result Count */}
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-3 animate-fade-in">
              {filteredFaqs.length > 0
                ? `Found ${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : `No results for "${searchQuery}"`
              }
            </p>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════
           MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {FAQ_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id)
                setOpenId(null)
              }}
              className={[
                'flex items-center gap-1.5',
                'px-4 py-2 rounded-full',
                'text-sm font-semibold',
                'border transition-all duration-150',
                activeCategory === cat.id
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600',
              ].join(' ')}
              aria-pressed={activeCategory === cat.id}
            >
              {cat.icon}
              {cat.label}
              {/* Count Badge */}
              <span className={[
                'ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold',
                activeCategory === cat.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500',
              ].join(' ')}>
                {cat.id === 'all'
                  ? FAQ_DATA.length
                  : CATEGORIZED_FAQ.filter(f => f.category === cat.id).length
                }
              </span>
            </button>
          ))}
        </div>

        {/* Controls Row */}
        {filteredFaqs.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">
                {filteredFaqs.length}
              </span>
              {' '}question{filteredFaqs.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenId(filteredFaqs[0]?.id ?? null)}
                className={[
                  'text-xs font-medium text-red-600',
                  'hover:text-red-700',
                  'transition-colors duration-150',
                ].join(' ')}
              >
                Expand First
              </button>
              <span className="text-gray-200" aria-hidden="true">|</span>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className={[
                  'text-xs font-medium text-gray-500',
                  'hover:text-gray-700',
                  'transition-colors duration-150',
                ].join(' ')}
              >
                Collapse All
              </button>
            </div>
          </div>
        )}

        {/* FAQ List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <FaqItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
                index={index}
              />
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-16 animate-fade-in">
            <div className={[
              'w-16 h-16 rounded-full bg-gray-100',
              'flex items-center justify-center',
              'mx-auto mb-4',
            ].join(' ')}>
              <Search size={28} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              No results found
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              We couldn't find any FAQ matching "{searchQuery}".
              Try different keywords or browse by category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
              className={[
                'inline-flex items-center gap-2',
                'px-4 py-2 rounded-xl',
                'border border-gray-200',
                'text-sm font-medium text-gray-600',
                'hover:border-red-300 hover:text-red-600',
                'transition-all duration-150',
              ].join(' ')}
            >
              <X size={14} />
              Clear Search
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════
             STILL HAVE QUESTIONS
        ══════════════════════════════════════════ */}
        <div className={[
          'mt-10 rounded-2xl p-6',
          'bg-white border border-gray-100',
          'text-center',
        ].join(' ')}>
          <div className={[
            'w-12 h-12 rounded-xl bg-red-50 text-red-500',
            'flex items-center justify-center mx-auto mb-4',
          ].join(' ')}>
            <MessageSquare size={22} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
            Can't find the answer you're looking for?
            Our friendly team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/contact')}
              leftIcon={<MessageSquare size={16} />}
            >
              Contact Us
            </Button>
            
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
              className={[
                'inline-flex items-center gap-2',
                'px-5 py-2.5 rounded-xl',
                'border-2 border-gray-200',
                'text-sm font-semibold text-gray-600',
                'hover:border-red-300 hover:text-red-600',
                'transition-all duration-200',
              ].join(' ')}
            >
              <Phone size={16} />
              {CONTACT_INFO.phone}
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickLinkCard
            icon={<Droplets size={20} className="text-red-500" />}
            title="Find Blood Donors"
            description="Search donors by blood group and location"
            onClick={() => navigate('/find-donors')}
          />
          <QuickLinkCard
            icon={<HelpCircle size={20} className="text-blue-500" />}
            title="Become a Donor"
            description="Register and help save lives in your area"
            onClick={() => navigate('/register-donor')}
          />
        </div>

      </div>
    </div>
  )
}

export default FaqPage

// ════════════════════════════════════════════════════
//  QUICK LINK CARD HELPER
// ════════════════════════════════════════════════════
const QuickLinkCard = ({
  icon,
  title,
  description,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'flex items-start gap-3 p-4',
      'bg-white rounded-2xl border border-gray-100',
      'hover:border-red-200 hover:shadow-sm',
      'transition-all duration-150',
      'text-left group',
    ].join(' ')}
  >
    <div className={[
      'w-10 h-10 rounded-xl flex-shrink-0',
      'bg-gray-50 group-hover:bg-red-50',
      'flex items-center justify-center',
      'transition-colors duration-150',
    ].join(' ')}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800 group-hover:text-red-700 transition-colors duration-150">
        {title}
      </p>
      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
        {description}
      </p>
    </div>
    <ArrowRight
      size={15}
      className="text-gray-300 group-hover:text-red-400 mt-0.5 flex-shrink-0 transition-colors duration-150"
      aria-hidden="true"
    />
  </button>
)