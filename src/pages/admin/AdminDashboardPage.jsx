import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import { Droplets, Users, Heart, Activity, ArrowRight, RotateCcw, MessageSquare, UserCheck } from 'lucide-react'
import { adminGetStats, adminResetData } from '../../services/adminApi.js'
import { useUI }    from '../../context/UIContext.jsx'
import { InlineLoader } from '../../components/ui/Loader.jsx'
import { BLOOD_GROUPS } from '../../constants/index.js'

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    red:    'bg-red-50 text-red-600',
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
      <div className={['w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', colors[color]].join(' ')}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const { showSuccess, showError, openDeleteModal } = useUI()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  const handleReset = () => {
    openDeleteModal({
      itemName: 'all data',
      onConfirm: () => {
        (async () => {
          try {
            await adminResetData()
            const updatedStats = await adminGetStats()
            setStats(updatedStats)
            showSuccess('All data reset to default.')
          } catch (err) {
            showError(err.message ?? 'Failed to reset data.')
          }
        })()
      },
    })
  }

  if (loading) return <InlineLoader message="Loading stats..." />

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Platform overview</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          <RotateCcw size={14} />
          Reset Data
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Donors"     value={stats.totalDonors}     icon={<Droplets size={22} />} color="red"    />
        <StatCard label="Available Now"    value={stats.availableDonors} icon={<Heart    size={22} />} color="green"  />
        <StatCard label="Registered Users" value={stats.totalUsers}      icon={<Users    size={22} />} color="blue"   />
        <StatCard label="Total Donations"  value={stats.totalDonations}  icon={<Activity size={22} />} color="purple" />
        <StatCard label="Pending Queries"  value={stats.pendingQueries ?? 0} icon={<MessageSquare size={22} />} color="orange" />
        <StatCard label="Pending Approvals" value={stats.pendingApprovals ?? 0} icon={<UserCheck size={22} />} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Blood Group Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Donors by blood group</h3>
          <div className="space-y-3">
            {BLOOD_GROUPS.map(group => {
              const count   = stats.byBloodGroup[group] ?? 0
              const pct     = stats.totalDonors > 0
                ? Math.round((count / stats.totalDonors) * 100) : 0
              return (
                <div key={group} className="flex items-center gap-3">
                  <div className="w-10 h-8 rounded-lg bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {group}
                  </div>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* City Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Donors by city</h3>
          <div className="space-y-2.5">
            {Object.entries(stats.byCity)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([city, count]) => (
                <div key={city} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{city}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: `${(count / stats.totalDonors) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-4">{count}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Donors',  desc: 'View, edit, delete donors', path: '/admin/donors',  color: 'border-red-200 hover:border-red-400' },
          { label: 'Manage Users',   desc: 'View, change roles, delete users', path: '/admin/users',   color: 'border-blue-200 hover:border-blue-400' },
          { label: 'Manage Queries', desc: 'View and resolve contact inquiries', path: '/admin/queries', color: 'border-orange-200 hover:border-orange-400' },
        ].map(link => (
          <button
            key={link.path}
            type="button"
            onClick={() => navigate(link.path)}
            className={['flex items-center justify-between p-5 bg-white rounded-2xl border-2 transition-all duration-150 group', link.color].join(' ')}
          >
            <div className="text-left">
              <p className="font-bold text-gray-800 group-hover:text-red-700">{link.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-red-500 transition-colors" />
          </button>
        ))}
      </div>

    </div>
  )
}

export default AdminDashboardPage