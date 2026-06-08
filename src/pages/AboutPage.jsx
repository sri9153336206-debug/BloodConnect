import { useNavigate } from 'react-router-dom'
import {
  Droplets,
  Heart,
  Users,
  Shield,
  Target,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
} from 'lucide-react'
import { useDonors }  from '../context/DonorContext.jsx'
import { useAuth }    from '../context/AuthContext.jsx'
import Button         from '../components/ui/Button.jsx'
import {
  BloodGroupStats,
} from '../components/features/BloodGroupSelector.jsx'
import {
  APP_META,
  APP_STATS,
  WHY_DONATE,
  CONTACT_INFO,
} from '../constants/index.js'

// ════════════════════════════════════════════════════
//  ABOUT PAGE
// ════════════════════════════════════════════════════
const AboutPage = () => {

  const navigate              = useNavigate()
  const { isLoggedIn }        = useAuth()
  const { stats, donors }     = useDonors()

  // ── Blood Group Stats From Real Donors ────────────
  const bloodGroupStats = donors.reduce((acc, d) => {
    acc[d.bloodGroup] = (acc[d.bloodGroup] ?? 0) + 1
    return acc
  }, {})

  // ── Icon Map ──────────────────────────────────────
  const whyIcons = {
    heart:    <Heart    size={24} />,
    activity: <Droplets size={24} />,
    users:    <Users    size={24} />,
    shield:   <Shield   size={24} />,
  }

  const whyColors = {
    red:    { bg: 'bg-red-100',    text: 'text-red-600'    },
    green:  { bg: 'bg-green-100',  text: 'text-green-600'  },
    blue:   { bg: 'bg-blue-100',   text: 'text-blue-600'   },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  }

  // ── Team Members ──────────────────────────────────
  const team = [
    {
      name:  'Sridhar Sharma',
      role:  'Founder & CEO',
      emoji: '👨‍💼',
      bio:   'Blood donation advocate with 10+ years of experience in healthcare technology.',
    },
    {
      name:  'Sridhar Singh',
      role:  'Lead Developer',
      emoji: '👨‍💻',
      bio:   'Full-stack developer passionate about building technology that saves lives.',
    },
    {
      name:  'Dr. Sridhar Kumar',
      role:  'Medical Advisor',
      emoji: '👨‍⚕️',
      bio:   'MBBS with specialization in hematology and blood bank management.',
    },
  ]

  // ── Timeline ──────────────────────────────────────
  const timeline = [
    {
      year:  '2025',
      title: 'Founded',
      desc:  'BloodConnect was founded with a mission to make blood donation accessible to everyone.',
      color: 'bg-red-600',
    },
    {
      year:  '2026',
      title: 'First 500 Donors',
      desc:  'Reached our first milestone of 500 registered donors across Bihar.',
      color: 'bg-blue-600',
    },
    {
      year:  '2026',
      title: '1000+ Lives Saved',
      desc:  'Our platform helped connect donors with recipients, saving over 1000 lives.',
      color: 'bg-green-600',
    },
    {
      year:  '2027',
      title: 'National Expansion',
      desc:  'Expanded to 50+ cities across India with 2500+ registered donors.',
      color: 'bg-purple-600',
    },
  ]

  // ── Render ───────────────────────────────────────
  return (
    <div className="min-h-screen">

      {/* ══════════════════════════════════════════
           HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="bg-red-600 py-20 relative overflow-hidden">

        {/* Decorations */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          {/* Icon */}
          <div className={[
            'w-16 h-16 rounded-2xl bg-white/20',
            'flex items-center justify-center',
            'mx-auto mb-6 animate-heartbeat',
          ].join(' ')}>
            <Droplets size={32} className="text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About BloodConnect
          </h1>
          <p className="text-xl text-red-100 leading-relaxed max-w-2xl mx-auto">
            {APP_META.description}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {APP_STATS.map(stat => (
              <div
                key={stat.id}
                className="bg-white/10 rounded-2xl py-4 px-3"
              >
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-red-100 text-xs font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
           MISSION SECTION
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <span className={[
                'inline-flex items-center gap-2',
                'px-3 py-1.5 rounded-full mb-4',
                'bg-red-50 text-red-600',
                'text-xs font-semibold uppercase tracking-wide',
              ].join(' ')}>
                <Target size={12} />
                Our Mission
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Connecting Donors With Those In Need
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                BloodConnect is a platform that connects voluntary blood
                donors with people in need. Our mission is to make blood
                availability easy and save more lives by bridging the gap
                between donors and recipients through technology.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                We believe that no one should lose their life due to
                unavailability of blood. With BloodConnect, finding the
                right donor is just a few clicks away — anytime, anywhere.
              </p>

              {/* Mission Points */}
              <ul className="space-y-3">
                {[
                  'Make blood donation accessible to everyone',
                  'Connect donors with recipients in real time',
                  'Build a community of lifesavers',
                  'Provide 24/7 availability for emergencies',
                ].map(point => (
                  <li
                    key={point}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-green-500 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-600">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Impact Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon:  <Droplets size={24} />,
                  value: `${stats.total}+`,
                  label: 'Registered Donors',
                  bg:    'bg-red-50',
                  color: 'text-red-600',
                },
                {
                  icon:  <Heart size={24} />,
                  value: '1.2K+',
                  label: 'Lives Saved',
                  bg:    'bg-pink-50',
                  color: 'text-pink-600',
                },
                {
                  icon:  <Users size={24} />,
                  value: '50+',
                  label: 'Cities Covered',
                  bg:    'bg-blue-50',
                  color: 'text-blue-600',
                },
                {
                  icon:  <Shield size={24} />,
                  value: '100%',
                  label: 'Verified Donors',
                  bg:    'bg-green-50',
                  color: 'text-green-600',
                },
              ].map(card => (
                <div
                  key={card.label}
                  className={[
                    'rounded-2xl p-5',
                    'flex flex-col items-center text-center',
                    'border border-gray-50',
                    'hover:shadow-md transition-shadow duration-200',
                    card.bg,
                  ].join(' ')}
                >
                  <div className={['mb-3', card.color].join(' ')}>
                    {card.icon}
                  </div>
                  <p className={[
                    'text-2xl font-bold mb-1',
                    card.color,
                  ].join(' ')}>
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           WHY DONATE SECTION
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Blood Donation?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Blood donation is a simple act that can have a massive
              impact on someone's life. Here's why it matters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_DONATE.map(item => {
              const colors = whyColors[item.color] ?? whyColors.red
              return (
                <div
                  key={item.id}
                  className={[
                    'bg-white rounded-2xl p-6 text-center',
                    'border border-gray-100',
                    'hover:shadow-lg hover:border-gray-200',
                    'transition-all duration-200',
                    'group',
                  ].join(' ')}
                >
                  <div className={[
                    'w-14 h-14 rounded-2xl mx-auto mb-4',
                    'flex items-center justify-center',
                    'transition-all duration-200',
                    'group-hover:scale-110',
                    colors.bg,
                    colors.text,
                  ].join(' ')}>
                    {whyIcons[item.icon]}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
           BLOOD GROUP DISTRIBUTION
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Donors by Blood Group
            </h2>
            <p className="text-gray-500">
              Current distribution of registered donors across blood groups
            </p>
          </div>

          <BloodGroupStats stats={bloodGroupStats} />

          {/* Find Donors CTA */}
          <div className="text-center mt-8">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/find-donors')}
              rightIcon={<ArrowRight size={16} />}
            >
              Find Donors by Blood Group
            </Button>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
           HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              How BloodConnect Works
            </h2>
            <p className="text-gray-500">
              Finding or becoming a blood donor is simple and fast
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* For Recipients */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className={[
                'w-10 h-10 rounded-xl bg-blue-100 text-blue-600',
                'flex items-center justify-center mb-4',
              ].join(' ')}>
                <Users size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-4">
                For Recipients
              </h3>
              <ol className="space-y-3">
                {[
                  'Go to Find Donors page',
                  'Enter your blood group and location',
                  'Browse available donors nearby',
                  'Call or message a donor directly',
                ].map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-3"
                  >
                    <span className={[
                      'w-6 h-6 rounded-full flex-shrink-0',
                      'bg-blue-100 text-blue-600',
                      'flex items-center justify-center',
                      'text-xs font-bold',
                    ].join(' ')}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-600 mt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="mt-5"
                onClick={() => navigate('/find-donors')}
              >
                Find Donors Now
              </Button>
            </div>

            {/* For Donors */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className={[
                'w-10 h-10 rounded-xl bg-red-100 text-red-600',
                'flex items-center justify-center mb-4',
              ].join(' ')}>
                <Droplets size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-4">
                For Donors
              </h3>
              <ol className="space-y-3">
                {[
                  'Create a free account',
                  'Register as a blood donor',
                  'Fill in your blood group and location',
                  'Toggle availability and wait to be contacted',
                ].map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-3"
                  >
                    <span className={[
                      'w-6 h-6 rounded-full flex-shrink-0',
                      'bg-red-100 text-red-600',
                      'flex items-center justify-center',
                      'text-xs font-bold',
                    ].join(' ')}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-600 mt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                className="mt-5"
                onClick={() =>
                  navigate(isLoggedIn ? '/register-donor' : '/signup')
                }
              >
                Become a Donor
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           TIMELINE
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Our Journey
            </h2>
            <p className="text-gray-500">
              From a small idea to a life-saving platform
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div
              className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100"
              aria-hidden="true"
            />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className="relative flex items-start gap-6 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Year Circle */}
                  <div className={[
                    'w-16 h-16 rounded-2xl flex-shrink-0',
                    'flex items-center justify-center',
                    'text-white font-bold text-sm',
                    'z-10',
                    item.color,
                  ].join(' ')}>
                    {item.year}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           TEAM SECTION
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Meet The Team
            </h2>
            <p className="text-gray-500">
              The people behind BloodConnect
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map(member => (
              <div
                key={member.name}
                className={[
                  'bg-white rounded-2xl p-6',
                  'border border-gray-100',
                  'text-center',
                  'hover:shadow-lg hover:border-red-100',
                  'transition-all duration-200',
                ].join(' ')}
              >
                {/* Avatar Emoji */}
                <div className={[
                  'w-16 h-16 rounded-2xl mx-auto mb-4',
                  'bg-red-50',
                  'flex items-center justify-center',
                  'text-3xl',
                ].join(' ')}>
                  {member.emoji}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-red-600 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           CONTACT QUICK ROW
      ══════════════════════════════════════════ */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Have a question?
              </h3>
              <p className="text-sm text-gray-500">
                We're here to help. Reach out to our team.
              </p>
            </div>
            <div className="flex items-center gap-4">
              
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className={[
                  'flex items-center gap-2',
                  'px-4 py-2.5 rounded-xl',
                  'border border-gray-200',
                  'text-sm font-medium text-gray-600',
                  'hover:border-red-300 hover:text-red-600',
                  'transition-all duration-150',
                ].join(' ')}
              >
                <Phone size={15} />
                {CONTACT_INFO.phone}
              </a>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/contact')}
                rightIcon={<ArrowRight size={16} />}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-red-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-red-100 text-lg mb-8">
            Join thousands of donors and help save lives in your community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="white"
              size="lg"
              onClick={() =>
                navigate(isLoggedIn ? '/register-donor' : '/signup')
              }
              leftIcon={<Heart size={18} />}
            >
              {isLoggedIn ? 'Become a Donor' : 'Get Started Free'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/find-donors')}
              className="border-white text-white hover:bg-white/10"
            >
              Find Donors
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}

export default AboutPage