import { useEffect, useState, useMemo } from 'react'
import { useNavigate }                  from 'react-router-dom'
import { Trash2, Eye, ToggleLeft, ToggleRight, Search, Check, X } from 'lucide-react'
import {
  adminGetAllDonors,
  adminDeleteDonor,
  adminToggleDonorAvailability,
  adminApproveDonor,
  adminRejectDonor,
} from '../../services/adminApi.js'
import { useUI }            from '../../context/UIContext.jsx'
import { InlineLoader }     from '../../components/ui/Loader.jsx'
import { AvailabilityBadge, BloodGroupBadge, StatusBadge } from '../../components/ui/Badge.jsx'
import { BLOOD_GROUPS }     from '../../constants/index.js'

const ManageDonorsPage = () => {
  const navigate = useNavigate()
  const { showSuccess, showError, openDeleteModal } = useUI()

  const [donors,      setDonors]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [bloodFilter, setBloodFilter] = useState('')
  const [availFilter, setAvailFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    adminGetAllDonors()
      .then(setDonors)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return donors.filter(d => {
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase())
      const matchBlood  = !bloodFilter || d.bloodGroup === bloodFilter
      const matchAvail  = availFilter === 'all' || (availFilter === 'available' ? d.availability : !d.availability)
      
      const donorStatus = d.status ?? 'approved'
      const matchStatus = statusFilter === 'all' || donorStatus === statusFilter
      
      return matchSearch && matchBlood && matchAvail && matchStatus
    })
  }, [donors, search, bloodFilter, availFilter, statusFilter])

  const handleDelete = (donor) => {
    openDeleteModal({
      itemName: donor.name,
      onConfirm: async () => {
        await adminDeleteDonor(donor.id)
        setDonors(prev => prev.filter(d => d.id !== donor.id))
        showSuccess(`${donor.name} deleted.`)
      },
    })
  }

  const handleToggle = async (id) => {
    const updated = await adminToggleDonorAvailability(id)
    setDonors(prev => prev.map(d => d.id === id ? updated : d))
    showSuccess('Availability updated.')
  }

  const handleApprove = async (id) => {
    try {
      const updated = await adminApproveDonor(id)
      setDonors(prev => prev.map(d => d.id === id ? updated : d))
      showSuccess('Donor application approved!')
    } catch (err) {
      showError(err.message || 'Failed to approve donor.')
    }
  }

  const handleReject = async (id) => {
    try {
      const updated = await adminRejectDonor(id)
      setDonors(prev => prev.map(d => d.id === id ? updated : d))
      showSuccess('Donor application rejected.')
    } catch (err) {
      showError(err.message || 'Failed to reject donor.')
    }
  }

  if (loading) return <InlineLoader message="Loading donors..." />

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manage Donors</h2>
        <p className="text-sm text-gray-500">{donors.length} total donors</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
          />
        </div>

        {/* Blood Group */}
        <select
          value={bloodFilter}
          onChange={e => setBloodFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 bg-white"
        >
          <option value="">All Blood Groups</option>
          {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        {/* Availability */}
        <select
          value={availFilter}
          onChange={e => setAvailFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 bg-white"
        >
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        {/* Approval Status */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 bg-white"
        >
          <option value="all">All Approval Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Donor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Blood</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Donations</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(donor => (
                <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {donor.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{donor.name}</p>
                        <p className="text-xs text-gray-400">{donor.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{donor.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 items-start">
                      <StatusBadge status={donor.status ?? 'approved'} size="xs" />
                      {(donor.status === 'approved' || !donor.status) && (
                        <AvailabilityBadge available={donor.availability} showDot size="sm" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{donor.donationsCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* Approve / Reject Actions */}
                      {(donor.status ?? 'approved') !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(donor.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          title="Approve donor"
                        >
                          <Check size={15} />
                        </button>
                      )}
                      {(donor.status ?? 'approved') !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleReject(donor.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Reject donor"
                        >
                          <X size={15} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => navigate(`/donor/${donor.id}`)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View profile"
                      >
                        <Eye size={15} />
                      </button>
                      {(donor.status === 'approved' || !donor.status) && (
                        <button
                          type="button"
                          onClick={() => handleToggle(donor.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          title="Toggle availability"
                        >
                          {donor.availability
                            ? <ToggleRight size={15} />
                            : <ToggleLeft  size={15} />
                          }
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(donor)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete donor"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No donors match your filters
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          Showing {filtered.length} of {donors.length} donors
        </div>
      </div>
    </div>
  )
}

export default ManageDonorsPage