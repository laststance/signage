import React from 'react'
import ReactDOM from 'react-dom/client'

import SettingsPage from './components/settings/SettingsPage'
import './styles/tailwind.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <SettingsPage />
  </React.StrictMode>,
)
