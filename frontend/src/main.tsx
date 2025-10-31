import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Hide fallback message if present (indicates the app mounted)
const fallbackEl = document.getElementById('app-fallback')
if (fallbackEl) fallbackEl.style.display = 'none'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
