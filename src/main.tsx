import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureAdParams } from './lib/attribution'

/* До рендера: метки рекламы есть в адресе только на первой странице после клика */
captureAdParams()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
