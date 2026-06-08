import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import { DonorProvider } from './context/DonorContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <UIProvider>
        <DonorProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </DonorProvider>
      </UIProvider>
    </AuthProvider>
  </React.StrictMode>
)