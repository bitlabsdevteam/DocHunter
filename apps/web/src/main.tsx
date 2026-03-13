import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

type Clinic = {
  name: string
  address: string
  distanceKm: number
  specialty: string
  availabilityHint: string
  bookingMode: 'external_link' | 'phone' | 'mcp_booking'
  sourceUrl?: string
}

function App() {
  const [symptoms, setSymptoms] = useState('Fever and sore throat')
  const [city, setCity] = useState('Tokyo')
  const [specialty, setSpecialty] = useState('general medicine')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Clinic[]>([])
  const [error, setError] = useState<string | null>(null)

  async function runDiscovery() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, city, specialty }),
      })

      const payload = await res.json()
      if (!res.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Discovery failed')
      }

      setResults(Array.isArray(payload.data) ? payload.data : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unexpected error')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>DocHunter MVP</h1>
      <p>Single-agent-first healthcare locator for Japan (non-diagnostic).</p>

      <section style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
        <label>
          Symptoms
          <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} style={{ width: '100%' }} />
        </label>
        <label>
          City
          <input value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Specialty
          <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={{ width: '100%' }} />
        </label>
        <button onClick={runDiscovery} disabled={loading || !symptoms.trim()} style={{ width: 220 }}>
          {loading ? 'Searching clinics…' : 'Find Clinics (Perplexity)'}
        </button>
      </section>

      {error ? <p style={{ color: 'crimson' }}>Error: {error}</p> : null}

      <section style={{ display: 'grid', gap: 12 }}>
        {results.map((clinic) => (
          <article key={`${clinic.name}-${clinic.address}`} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <strong>{clinic.name}</strong>
            <div>{clinic.address}</div>
            <div>
              {clinic.specialty} · {clinic.distanceKm.toFixed(1)} km
            </div>
            <div>{clinic.availabilityHint}</div>
            {clinic.sourceUrl ? (
              <a href={clinic.sourceUrl} target="_blank" rel="noreferrer">
                Source
              </a>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
