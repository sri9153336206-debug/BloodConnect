import { useEffect, useState, useMemo } from 'react'
import { Trash2, Search, ShieldCheck } from 'lucide-react'
import {
  adminGetAllUsers,
  adminDeleteUser,
  adminChangeUserRole,
} from '../../services/adminApi.js'
import { useUI }        from '../../context/UIContext.jsx'
import { InlineLoader } from '../../components/ui/Loader.jsx'
import { RoleBadge }    from '../../components/ui/Badge.jsx'

const ManageUsersPage = () => {
  const { showSuccess, openDeleteModal } = useUI()

  const [users,      setUsers]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    adminGetAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return users.filter(u => {
      const q = search.toLowerCase()
      const matchSearch = !search ||
        u.name?.toLowerCase()?.includes(q) ||
        u.email?.toLowerCase()?.includes(q)
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      return matchSearch && matchRole
    })
  }, [users, search, roleFilter])

  const handleDelete = (user) => {
    openDeleteModal({
      itemName: user.name,
      onConfirm: async () => {
        await adminDeleteUser(user.id)
        setUsers(prev => prev.filter(u => u.id !== user.id))
        showSuccess(`${user.name} deleted.`)
      },
    })
  }

  const handleRoleChange = async (id, role) => {
    const updated = await adminChangeUserRole(id, role)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    showSuccess('Role updated.')
  }

  if (loading) return <InlineLoader message="Loading users..." />

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manage Users</h2>
        <p className="text-sm text-gray-500">{users.length} total accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 bg-white"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="donor">Donor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Blood</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{user.location ?? '—'}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-red-500">
                    {user.bloodGroup ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* Role Selector */}
                      {user.role !== 'admin' && (
                        <select
                          value={user.role}
                          onChange={e => handleRoleChange(user.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:border-red-400 bg-white"
                        >
                          <option value="user">User</option>
                          <option value="donor">Donor</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                      {/* Delete */}
                      {user.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <ShieldCheck size={16} className="text-red-400" title="Admin — cannot delete" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No users match your filters
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  )
}

export default ManageUsersPage