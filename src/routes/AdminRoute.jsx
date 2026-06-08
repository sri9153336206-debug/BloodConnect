import { Navigate } from 'react-router-dom'
import { useAuth }  from '../context/AuthContext.jsx'
import { Spinner }  from '../components/ui/Loader.jsx'

const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" color="red" />
      </div>
    )
  }

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute