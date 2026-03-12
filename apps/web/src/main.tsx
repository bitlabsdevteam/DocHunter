import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>DocHunter</h1>
      <p>AI Agentic Healthcare Locator for Japan</p>
      <ul>
        <li>Symptom input</li>
        <li>Urgency guidance (non-diagnostic)</li>
        <li>Clinic discovery</li>
        <li>Booking workflow</li>
        <li>Email confirmation</li>
      </ul>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
