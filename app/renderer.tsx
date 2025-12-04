import React from 'react'
import ReactDOM from 'react-dom/client'

import { WindowContextProvider, menuItems } from '@/lib/window'
import appIcon from '@/resources/build/icon.png'

import App from './components/App'
import '@/lib/window/window.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <WindowContextProvider titlebar={{ title: '', icon: appIcon, menuItems }}>
      <App />
    </WindowContextProvider>
  </React.StrictMode>,
)
