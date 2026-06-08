import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter.jsx'
import Toast from './components/ui/Toast.jsx'
import { GlobalModal } from './components/ui/Modal.jsx'
import { useUI } from './context/UIContext.jsx'

const AppContent = () => {
  const { toasts, removeToast } = useUI()

  return (
    <>
      <AppRouter />
      <GlobalModal />
      {/* Global Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App