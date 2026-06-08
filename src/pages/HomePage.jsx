import { useNavigate, Link } from 'react-router-dom'
import {
  Droplets,
  Search,
  ArrowRight,
  Heart,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Star,
} from 'lucide-react'
import { useAuth }   from '../context/AuthContext.jsx'
import { useDonors } from '../context/DonorContext.jsx'
import { HeroSearchBar }       from '../components/features/SearchBar.jsx'
import { FeaturedDonorCard }   from '../components/features/DonorCard.jsx'
import { DonorGridSkeleton }   from '../components/ui/Loader.jsx'
import {
  APP_STATS,
  HOME_FEATURES,
  WHY_DONATE,
  BLOOD_GROUPS,
} from '../constants/index.js'

// ════════════════════════════════════════════════════
//  HOME PAGE
// ════════════════════════════════════════════════════
const HomePage = () => {

  const navigate                   = useNavigate()
  const { isLoggedIn, currentUser } = useAuth()
  const { donors, loading, stats }  = useDonors()

  // ── Top Available Donors For Featured Section ─────
  const featuredDonors = donors
    .filter(d => d.availability)
    .slice(0, 3)

  // ── Icon Map For Features ─────────────────────────
  const featureIcons = {
    search: <Search  size={24} />,
    shield: <Shield  size={24} />,
    clock:  <Clock   size={24} />,
    heart:  <Heart   size={24} />,
  }

  // ── Icon Map For Why Donate ───────────────────────
  const whyIcons = {
    heart:    <Heart    size={22} />,
    activity: <Droplets size={22} />,
    users:    <Users    size={22} />,
    shield:   <Shield   size={22} />,
  }

  // ── Why Donate Colors ─────────────────────────────
  const whyColors = {
    red:    'bg-red-100 text-red-600',
    green:  'bg-green-100 text-green-600',
    blue:   'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  // ── Render ───────────────────────────────────────
  return (
    <div className="page-enter">

      {/* ══════════════════════════════════════════
           HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative bg-white hero-pattern overflow-hidden">

        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── Left: Text Content ─────────────── */}
            <div className="relative z-10">

              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                  Emergency Blood Finder
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Find{' '}
                <span className="text-red-600">Blood Donors</span>
                <br />
                In Emergencies
              </h1>

              {/* Subheading */}
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                Search by blood group and location instantly.
                Every drop can save a life. Connect with
                verified donors near you in seconds.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => navigate('/find-donors')}
                  className={[
                    'inline-flex items-center justify-center gap-2',
                    'px-8 py-3.5 rounded-2xl',
                    'bg-red-600 hover:bg-red-700',
                    'text-white font-bold text-base',
                    'shadow-lg shadow-red-200 hover:shadow-xl',
                    'transition-all duration-200',
                  ].join(' ')}
                >
                  <Search size={20} />
                  Find Donors
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(isLoggedIn ? '/register-donor' : '/signup')
                  }
                  className={[
                    'inline-flex items-center justify-center gap-2',
                    'px-8 py-3.5 rounded-2xl',
                    'border-2 border-red-600 text-red-600',
                    'hover:bg-red-50',
                    'font-bold text-base',
                    'transition-all duration-200',
                  ].join(' ')}
                >
                  <Droplets size={20} />
                  Become a Donor
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                {/* Avatars */}
                <div className="flex -space-x-2">
                  {['R', 'P', 'A', 'N'].map((initial, i) => (
                    <div
                      key={i}
                      className={[
                        'w-8 h-8 rounded-full border-2 border-white',
                        'bg-red-500 text-white',
                        'flex items-center justify-center',
                        'text-xs font-bold flex-shrink-0',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                {/* Rating */}
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                        aria-hidden="true"
                      />
                    ))}
                    <span className="text-sm font-bold text-gray-700 ml-1">
                      4.8
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Trusted by {stats.total}+ donors
                  </p>
                </div>
              </div>

            </div>

            {/* ── Right: Illustration ────────────── */}
            <div className="relative hidden lg:flex justify-center items-center">

              {/* Big Blood Drop Background */}
              <div className={[
                'w-80 h-80 rounded-full',
                'bg-gradient-to-br from-red-50 to-red-100',
                'flex items-center justify-center',
                'relative',
              ].join(' ')}>

                {/* Center Icon */}
                <div className={[
                  'w-40 h-40 rounded-full',
                  'bg-red-600',
                  'flex items-center justify-center',
                  'shadow-2xl shadow-red-300',
                  'animate-heartbeat',
                ].join(' ')}>
                  <Droplets size={64} className="text-white" aria-hidden="true" />
                </div>

                {/* Floating Stat Cards */}
                <FloatingCard
                  className="absolute -top-4 -right-8"
                  icon="💉"
                  value={`${stats.available}+`}
                  label="Available Now"
                  color="bg-green-500"
                />
                <FloatingCard
                  className="absolute -bottom-4 -left-8"
                  icon="🏥"
                  value={`${stats.total}+`}
                  label="Donors"
                  color="bg-red-600"
                />
                <FloatingCard
                  className="absolute top-1/2 -right-16 -translate-y-1/2"
                  icon="❤️"
                  value="24/7"
                  label="Available"
                  color="bg-blue-500"
                />

              </div>

            </div>

          </div>

          {/* ── Hero Search Bar ────────────────── */}
          <div className="mt-12 max-w-3xl">
            <HeroSearchBar />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
           STATS SECTION
      ══════════════════════════════════════════ */}
      <section className="bg-red-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {APP_STATS.map(stat => (
              <div
                key={stat.id}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-red-100 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           FEATURES SECTION
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Choose BloodConnect?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We make finding blood donors fast, safe, and reliable
              so you can focus on what matters most.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOME_FEATURES.map(feature => (
              <div
                key={feature.id}
                className={[
                  'bg-white rounded-2xl p-6',
                  'border border-gray-100',
                  'hover:shadow-lg hover:border-red-100',
                  'transition-all duration-200',
                  'group',
                ].join(' ')}
              >
                {/* Icon */}
                <div className={[
                  'w-12 h-12 rounded-2xl mb-4',
                  'bg-red-50 text-red-600',
                  'flex items-center justify-center',
                  'group-hover:bg-red-600 group-hover:text-white',
                  'transition-all duration-200',
                ].join(' ')}>
                  {featureIcons[feature.icon]}
                </div>

                {/* Text */}
                <h3 className="font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
           BLOOD GROUP QUICK SEARCH
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Find Donors By Blood Group
            </h2>
            <p className="text-gray-500">
              Tap a blood group to instantly find matching donors
            </p>
          </div>

          {/* Blood Group Grid */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-2xl mx-auto">
            {BLOOD_GROUPS.map(group => (
              <Link
                key={group}
                to={`/find-donors?bloodGroup=${encodeURIComponent(group)}`}
                className={[
                  'flex flex-col items-center justify-center',
                  'h-16 md:h-20 rounded-2xl',
                  'bg-red-50 hover:bg-red-600',
                  'text-red-600 hover:text-white',
                  'border-2 border-red-100 hover:border-red-600',
                  'font-bold text-lg',
                  'transition-all duration-200',
                  'shadow-sm hover:shadow-lg hover:shadow-red-200',
                  'hover:scale-105',
                  'group',
                ].join(' ')}
                aria-label={`Find ${group} blood donors`}
              >
                <Droplets
                  size={16}
                  className="mb-1 opacity-60 group-hover:opacity-100"
                  aria-hidden="true"
                />
                {group}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
           FEATURED DONORS SECTION
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Available Donors
              </h2>
              <p className="text-gray-500">
                {stats.available} donors ready to help right now
              </p>
            </div>
            <Link
              to="/find-donors"
              className={[
                'hidden sm:flex items-center gap-2',
                'text-red-600 font-semibold text-sm',
                'hover:text-red-700',
                'transition-colors duration-150',
              ].join(' ')}
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Donors Grid */}
          {loading ? (
            <DonorGridSkeleton count={3} />
          ) : featuredDonors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDonors.map(donor => (
                <FeaturedDonorCard
                  key={donor.id}
                  donor={donor}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No available donors right now.
              </p>
            </div>
          )}

          {/* View All Button (mobile) */}
          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/find-donors"
              className={[
                'inline-flex items-center gap-2',
                'px-6 py-3 rounded-xl',
                'bg-red-600 text-white',
                'font-semibold text-sm',
                'hover:bg-red-700',
                'transition-colors duration-200',
              ].join(' ')}
            >
              View All Donors
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
           WHY DONATE SECTION
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Blood Donation Matters
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Blood donation is one of the most impactful acts
                of kindness. Every donation can save up to 3 lives
                and costs you nothing but a few minutes of your time.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WHY_DONATE.map(item => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3"
                  >
                    <div className={[
                      'w-10 h-10 rounded-xl flex-shrink-0',
                      'flex items-center justify-center',
                      whyColors[item.color] ?? whyColors.red,
                    ].join(' ')}>
                      {whyIcons[item.icon]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() =>
                    navigate(isLoggedIn ? '/register-donor' : '/signup')
                  }
                  className={[
                    'inline-flex items-center gap-2',
                    'px-6 py-3 rounded-xl',
                    'bg-red-600 hover:bg-red-700',
                    'text-white font-semibold',
                    'transition-colors duration-200',
                    'shadow-sm hover:shadow-md',
                  ].join(' ')}
                >
                  <Heart size={18} />
                  Become a Donor Today
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Right: Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  value: '3',
                  unit:  'Lives',
                  label: 'Saved per donation',
                  bg:    'bg-red-600',
                  text:  'text-white',
                },
                {
                  value: '90',
                  unit:  'Days',
                  label: 'Between donations',
                  bg:    'bg-white',
                  text:  'text-gray-900',
                  border: 'border border-gray-100',
                },
                {
                  value: '10',
                  unit:  'Mins',
                  label: 'Donation takes',
                  bg:    'bg-white',
                  text:  'text-gray-900',
                  border: 'border border-gray-100',
                },
                {
                  value: '450',
                  unit:  'ml',
                  label: 'Blood per donation',
                  bg:    'bg-gray-900',
                  text:  'text-white',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className={[
                    'rounded-2xl p-6',
                    'flex flex-col justify-between',
                    'shadow-sm',
                    card.bg,
                    card.border ?? '',
                  ].filter(Boolean).join(' ')}
                >
                  <div>
                    <span className={[
                      'text-4xl font-bold',
                      card.text,
                    ].join(' ')}>
                      {card.value}
                    </span>
                    <span className={[
                      'text-lg font-semibold ml-1',
                      card.text,
                      'opacity-70',
                    ].join(' ')}>
                      {card.unit}
                    </span>
                  </div>
                  <p className={[
                    'text-sm mt-2',
                    card.text,
                    'opacity-70',
                  ].join(' ')}>
                    {card.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           CTA BANNER
      ══════════════════════════════════════════ */}
      {!isLoggedIn && (
        <section className="py-16 bg-red-600 dot-pattern">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <Droplets
              size={48}
              className="text-white/30 mx-auto mb-4 animate-heartbeat"
              aria-hidden="true"
            />

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Save a Life?
            </h2>
            <p className="text-red-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of blood donors on BloodConnect
              and make a difference in someone's life today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className={[
                  'inline-flex items-center gap-2',
                  'px-8 py-4 rounded-2xl',
                  'bg-white text-red-600',
                  'font-bold text-base',
                  'hover:bg-red-50',
                  'shadow-lg hover:shadow-xl',
                  'transition-all duration-200',
                ].join(' ')}
              >
                <Heart size={20} />
                Create Free Account
              </button>
              <button
                type="button"
                onClick={() => navigate('/find-donors')}
                className={[
                  'inline-flex items-center gap-2',
                  'px-8 py-4 rounded-2xl',
                  'border-2 border-white text-white',
                  'font-bold text-base',
                  'hover:bg-white/10',
                  'transition-all duration-200',
                ].join(' ')}
              >
                <Search size={20} />
                Find Donors
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Welcome back banner for logged-in users */}
      {isLoggedIn && (
        <section className="py-12 bg-red-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Welcome back, {currentUser?.name?.split(' ')[0]}! 👋
                </h2>
                <p className="text-red-100 text-sm">
                  Help save lives by keeping your donor profile up to date.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/find-donors')}
                  className={[
                    'px-5 py-2.5 rounded-xl',
                    'bg-white text-red-600',
                    'font-semibold text-sm',
                    'hover:bg-red-50',
                    'transition-colors duration-200',
                  ].join(' ')}
                >
                  Find Donors
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className={[
                    'px-5 py-2.5 rounded-xl',
                    'border-2 border-white text-white',
                    'font-semibold text-sm',
                    'hover:bg-white/10',
                    'transition-colors duration-200',
                  ].join(' ')}
                >
                  My Profile
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

export default HomePage

// ════════════════════════════════════════════════════
//  FLOATING CARD — hero decoration
// ════════════════════════════════════════════════════
const FloatingCard = ({
  icon,
  value,
  label,
  color,
  className = '',
}) => (
  <div className={[
    'bg-white rounded-2xl shadow-xl',
    'px-4 py-3 flex items-center gap-3',
    'border border-gray-100',
    'animate-fade-in',
    className,
  ].filter(Boolean).join(' ')}>
    <div className={[
      'w-8 h-8 rounded-xl flex-shrink-0',
      'flex items-center justify-center text-white text-sm',
      color,
    ].join(' ')}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
)