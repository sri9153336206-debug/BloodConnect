import { useEffect, useState, useMemo } from 'react'
import { Trash2, Search, CheckCircle, Clock, Mail, Phone, RefreshCw } from 'lucide-react'
import {
  adminGetAllQueries,
  adminDeleteQuery,
  adminResolveQuery,
} from '../../services/adminApi.js'
import { useUI }        from '../../context/UIContext.jsx'
import { InlineLoader } from '../../components/ui/Loader.jsx'
import Badge            from '../../components/ui/Badge.jsx'
import Button           from '../../components/ui/Button.jsx'

const ManageQueriesPage = () => {
  const { showSuccess, showError, openDeleteModal } = useUI()

  const [queries,     setQueries]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState('all')

  const fetchQueries = async () => {
    try {
      const data = await adminGetAllQueries()
      setQueries(data)
    } catch (err) {
      showError(err.message || 'Failed to fetch queries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueries()
  }, [])

  // ── Stats ──────────────────────────────────────────
  const stats = useMemo(() => {
    const total = queries.length
    const pending = queries.filter(q => q.status === 'pending').length
    const resolved = total - pending
    return { total, pending, resolved }
  }, [queries])

  // ── Subjects List (for filter) ─────────────────────
  const subjects = useMemo(() => {
    const set = new Set()
    queries.forEach(q => {
      if (q.subject) set.add(q.subject)
    })
    return Array.from(set)
  }, [queries])

  // ── Filtering Logic ───────────────────────────────
  const filtered = useMemo(() => {
    return queries.filter(q => {
      const s = search.toLowerCase()
      const matchSearch = !search ||
        q.name?.toLowerCase()?.includes(s) ||
        q.email?.toLowerCase()?.includes(s) ||
        q.subject?.toLowerCase()?.includes(s) ||
        q.message?.toLowerCase()?.includes(s)

      const matchStatus = statusFilter === 'all' || q.status === statusFilter
      const matchSubject = subjectFilter === 'all' || q.subject === subjectFilter

      return matchSearch && matchStatus && matchSubject
    })
  }, [queries, search, statusFilter, subjectFilter])

  // ── Handle Delete ─────────────────────────────────
  const handleDelete = (queryDoc) => {
    openDeleteModal({
      itemName: `message from ${queryDoc.name}`,
      onConfirm: async () => {
        try {
          await adminDeleteQuery(queryDoc.id)
          setQueries(prev => prev.filter(q => q.id !== queryDoc.id))
          showSuccess('Query message deleted.')
        } catch (err) {
          showError(err.message || 'Failed to delete query.')
        }
      },
    })
  }

  // ── Handle Toggle Status ──────────────────────────
  const handleToggleStatus = async (queryDoc) => {
    const nextStatus = queryDoc.status === 'pending' ? 'resolved' : 'pending'
    try {
      await adminResolveQuery(queryDoc.id, nextStatus)
      setQueries(prev => prev.map(q =>
        q.id === queryDoc.id ? { ...q, status: nextStatus } : q
      ))
      showSuccess(`Query status updated to ${nextStatus}.`)
    } catch (err) {
      showError(err.message || 'Failed to update status.')
    }
  }

  // ── Date Formatter ────────────────────────────────
  const formatDate = (isoString) => {
    if (!isoString) return '—'
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  if (loading) return <InlineLoader message="Loading queries..." />

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Queries</h2>
          <p className="text-sm text-gray-500">Contact form submissions and user requests</p>
        </div>
        <button
          type="button"
          onClick={() => { setLoading(true); fetchQueries(); }}
          className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
          title="Refresh Queries"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Queries</p>
          <p className="text-2xl font-bold text-gray-950 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 border-l-4 border-l-yellow-400">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 border-l-4 border-l-green-400">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resolved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject, message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 bg-white"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subj => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>
      </div>

      {/* Query Cards */}
      <div className="space-y-4">
        {filtered.map(queryDoc => (
          <div
            key={queryDoc.id}
            className={[
              'bg-white rounded-2xl border border-gray-100 p-5 transition-all',
              queryDoc.status === 'pending' ? 'border-l-4 border-l-yellow-500' : 'border-l-4 border-l-green-500'
            ].join(' ')}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              
              {/* Left Side: Sender Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                    {queryDoc.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{queryDoc.name}</h3>
                    <p className="text-xs text-gray-400">{formatDate(queryDoc.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <a
                    href={`mailto:${queryDoc.email}`}
                    className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                  >
                    <Mail size={12} />
                    {queryDoc.email}
                  </a>
                  {queryDoc.phone && (
                    <a
                      href={`tel:${queryDoc.phone}`}
                      className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                    >
                      <Phone size={12} />
                      {queryDoc.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Right Side: Status Badge + Actions */}
              <div className="flex items-center md:justify-end gap-2 self-start md:self-auto">
                <Badge
                  variant={queryDoc.status === 'pending' ? 'pending' : 'success'}
                  size="sm"
                  showDot
                />
                
                {/* Resolve Action */}
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleToggleStatus(queryDoc)}
                  className="flex items-center gap-1 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  {queryDoc.status === 'pending' ? (
                    <>
                      <CheckCircle size={13} className="text-green-500" />
                      Resolve
                    </>
                  ) : (
                    <>
                      <Clock size={13} className="text-yellow-600" />
                      Pending
                    </>
                  )}
                </Button>

                {/* Delete Action */}
                <button
                  type="button"
                  onClick={() => handleDelete(queryDoc)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete query"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>

            <hr className="my-4 border-gray-50" />

            {/* Message Details */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Subject: {queryDoc.subject || 'General Inquiry'}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100 whitespace-pre-line">
                {queryDoc.message}
              </p>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400 text-sm">
            No queries match your current filter selections.
          </div>
        )}
      </div>

    </div>
  )
}

export default ManageQueriesPage
