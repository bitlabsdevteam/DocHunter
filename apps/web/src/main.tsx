import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'

type Clinic = {
  id: string
  name: string
  address: string
  distanceKm: number
  specialty: string
  availabilityHint: string
  bookingMode: 'external_link' | 'phone' | 'mcp_booking'
}

type LocateCarePayload = {
  flow: Array<{ agent: string; summary: string }>
  triage: { urgency: string; specialty: string; emergencyBypass: boolean; disclaimer: string }
  recommendations: Clinic[]
  model: { provider: 'openai' | 'gemini'; model: string }
  mcp: { toolsUsed: string[]; mode: string }
}

function App() {
  const [symptoms, setSymptoms] = useState('Fever and sore throat for two days')
  const [city, setCity] = useState('Tokyo')
  const [email, setEmail] = useState('demo@example.com')
  const [modelProvider, setModelProvider] = useState<'openai' | 'gemini'>('openai')

  const [loading, setLoading] = useState(false)
  const [carePlan, setCarePlan] = useState<LocateCarePayload | null>(null)
  const [selected, setSelected] = useState<Clinic | null>(null)
  const [bookingRef, setBookingRef] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function runFlow() {
    setLoading(true)
    setError(null)
    setCarePlan(null)
    setSelected(null)
    setBookingRef(null)
    setConfirmation(null)

    try {
      const res = await fetch('/api/locate-care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, city, modelProvider }),
      })
      const payload = await res.json()
      if (!res.ok || !payload.ok) throw new Error(payload.error ?? 'Flow failed')
      setCarePlan(payload)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  async function requestBooking(clinic: Clinic) {
    setError(null)
    const res = await fetch('/api/booking-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId: clinic.id, providerName: clinic.name, userEmail: email, requestedTime: 'Next available' }),
    })
    const payload = await res.json()
    if (!res.ok || !payload.ok) {
      setError(payload.error ?? 'Booking intent failed')
      return
    }
    setSelected(clinic)
    setBookingRef(payload.booking.bookingReference)
  }

  async function sendConfirmation() {
    if (!selected || !bookingRef) return
    const res = await fetch('/api/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: email,
        providerName: selected.name,
        providerAddress: selected.address,
        bookingReference: bookingRef,
      }),
    })
    const payload = await res.json()
    if (!res.ok || !payload.ok) {
      setError(payload.error ?? 'Confirmation failed')
      return
    }
    setConfirmation(`Confirmation queued to ${payload.confirmation.to}`)
  }

  const canBook = useMemo(() => !!carePlan?.recommendations?.length && !!email, [carePlan, email])

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', maxWidth: 960, margin: '0 auto', padding: 24, lineHeight: 1.4 }}>
      <h1>DocHunter MVP</h1>
      <p>Symptom → safety triage → provider recommendation → booking intent handoff.</p>

      <section style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
        <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} style={{ width: '100%' }} />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <select value={modelProvider} onChange={(e) => setModelProvider(e.target.value as 'openai' | 'gemini')}>
          <option value="openai">OpenAI (default GPT-5.4)</option>
          <option value="gemini">Gemini</option>
        </select>
        <button onClick={runFlow} disabled={loading || !symptoms.trim()}>{loading ? 'Running agents…' : 'Run Care Locator Flow'}</button>
      </section>

      {error ? <p style={{ color: 'crimson' }}>Error: {error}</p> : null}

      {carePlan ? (
        <section style={{ display: 'grid', gap: 12 }}>
          <article style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <strong>Model Route:</strong> {carePlan.model.provider} / {carePlan.model.model}
            <div><strong>Urgency:</strong> {carePlan.triage.urgency}</div>
            <div><strong>Specialty:</strong> {carePlan.triage.specialty}</div>
            <div><strong>MCP Mode:</strong> {carePlan.mcp.mode}</div>
            <div><strong>MCP Tools:</strong> {carePlan.mcp.toolsUsed.join(', ')}</div>
            <div>{carePlan.triage.disclaimer}</div>
          </article>

          <article style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <strong>Agent Flow Trace</strong>
            <ol>
              {carePlan.flow.map((step, i) => (
                <li key={i}><strong>{step.agent}:</strong> {step.summary}</li>
              ))}
            </ol>
          </article>

          <article style={{ display: 'grid', gap: 10 }}>
            {carePlan.recommendations.map((clinic) => (
              <div key={clinic.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
                <strong>{clinic.name}</strong>
                <div>{clinic.address}</div>
                <div>{clinic.specialty} · {clinic.distanceKm.toFixed(1)} km</div>
                <div>{clinic.availabilityHint}</div>
                <button disabled={!canBook} onClick={() => requestBooking(clinic)} style={{ marginTop: 8 }}>
                  Select + Create Booking Intent
                </button>
              </div>
            ))}
          </article>

          {bookingRef ? (
            <article style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              <strong>Booking Intent Created:</strong> {bookingRef}
              <div>Selected provider: {selected?.name}</div>
              <button onClick={sendConfirmation} style={{ marginTop: 8 }}>Send Confirmation</button>
            </article>
          ) : null}

          {confirmation ? <p style={{ color: 'green' }}>{confirmation}</p> : null}
        </section>
      ) : null}
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
