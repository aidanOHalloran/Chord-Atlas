import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1e293b",
          color: "#fff",
          borderRadius: "8px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#38bdf8", secondary: "#1e293b" },
        },
      }}
    />
  </StrictMode>,
)
