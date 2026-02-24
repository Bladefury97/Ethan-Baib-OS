import React, { useEffect, useState } from 'react'
import { getAnalytics, addAnalytics, updateAnalytics } from '../lib/supabase'

export default function Analytics() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ month: '', spotify: '', apple: '', ig_followers: '', tiktok: '', youtube: '', gigs: '', revenue: '', notes: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const load = async () => { setLoading(true); const { data } = await getAnalytics(); setRows(data || []); setLoading(false) }
  useEffect(() => { load() }, [])

  const save = async () => {
    await addAnalytics(form)
    setAdding(false)
    setForm({ month: '', spotify: '', apple: '', ig_followers: '', tiktok: '', youtube: '', gigs: '', revenue: '', notes: '' })
    load()
  }

  const latest = rows[0] || {}
  const prev = rows[1] || {}
  const diff = (key) => {
    const a = Number(latest[key] || 0); const b = Number(prev[key] || 0)
    if (!b) return null
    const pct = Math.round(((a - b) / b) * 100)
    return pct
  }

  const StatBar = ({ label, value, max, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 100, fontSize: 12, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, (value / max) * 100)}%`, background: color, borderRadius: 4 }} />
      </div>
      <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text-mid)', width: 70, textAlign: 'right' }}>{Number(value || 0).toLocaleString()}</div>
    </div>
  )

  const maxSpotify = Math.max(...rows.map(r => Number(r.spotify || 0)), 1)
  const maxIG = Math.max(...rows.map(r => Number(r.ig_followers || 0)), 1)

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Numbers Don't Lie</div>
        <div className="page-title">ANALYTICS & <em>METRICS</em></div>
        <div className="page-subtitle">Track your growth across every platform, every month.</div>
      </div>

      {latest.spotify && (
        <div className="stats-grid">
          {[
            { label: 'Spotify', key: 'spotify', color: 'green' },
            { label: 'Instagram', key: 'ig_followers', color: 'purple' },
            { label: 'TikTok', key: 'tiktok', color: 'orange' },
            { label: 'YouTube', key: 'youtube', color: 'blue' },
          ].map(({ label, key, color }) => {
            const d = diff(key)
            return (
              <div key={key} className={`stat-card ${color}`}>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{Number(latest[key] || 0).toLocaleString()}</div>
                {d !== null && <div className={`stat-change ${d >= 0 ? 'up' : 'down'}`}>{d >= 0 ? `↑ ${d}%` : `↓ ${Math.abs(d)}%`} vs prev</div>}
              </div>
            )
          })}
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">🎧 Streaming Growth</div></div>
          <div className="card-body">
            {rows.slice(0, 6).map(r => <StatBar key={r.id} label={r.month ? new Date(r.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : '—'} value={r.spotify} max={maxSpotify} color="var(--accent)" />)}
            {rows.length === 0 && <div className="empty-state">Log your first month below</div>}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">📱 Instagram Growth</div></div>
          <div className="card-body">
            {rows.slice(0, 6).map(r => <StatBar key={r.id} label={r.month ? new Date(r.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : '—'} value={r.ig_followers} max={maxIG} color="var(--accent3)" />)}
            {rows.length === 0 && <div className="empty-state">Log your first month below</div>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">📊 Monthly Stats Log</div>
          <button className="btn btn-accent" onClick={() => setAdding(!adding)}>+ Log Month</button>
        </div>
        {adding && (
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
            <div className="grid-3" style={{ gap: 10, marginBottom: 10 }}>
              <div><label className="form-label">Month</label><input className="input" type="month" value={form.month} onChange={e => set('month', e.target.value)} /></div>
              <div><label className="form-label">Spotify Listeners</label><input className="input" type="number" placeholder="0" value={form.spotify} onChange={e => set('spotify', e.target.value)} /></div>
              <div><label className="form-label">Apple Music</label><input className="input" type="number" placeholder="0" value={form.apple} onChange={e => set('apple', e.target.value)} /></div>
              <div><label className="form-label">Instagram Followers</label><input className="input" type="number" placeholder="0" value={form.ig_followers} onChange={e => set('ig_followers', e.target.value)} /></div>
              <div><label className="form-label">TikTok Followers</label><input className="input" type="number" placeholder="0" value={form.tiktok} onChange={e => set('tiktok', e.target.value)} /></div>
              <div><label className="form-label">YouTube Subs</label><input className="input" type="number" placeholder="0" value={form.youtube} onChange={e => set('youtube', e.target.value)} /></div>
              <div><label className="form-label">Gigs Played</label><input className="input" type="number" placeholder="0" value={form.gigs} onChange={e => set('gigs', e.target.value)} /></div>
              <div><label className="form-label">Revenue ($)</label><input className="input" type="number" placeholder="0" value={form.revenue} onChange={e => set('revenue', e.target.value)} /></div>
              <div><label className="form-label">Notes</label><input className="input" placeholder="Key events this month" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-accent" onClick={save}>Save Month</button>
              <button className="btn btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        )}
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Month</th><th>Spotify</th><th>Apple</th><th>Instagram</th><th>TikTok</th><th>YouTube</th><th>Gigs</th><th>Revenue</th><th>Notes</th></tr></thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan={9}><div className="empty-state">No data yet — log your first month!</div></td></tr>}
                {rows.map(r => (
                  <tr key={r.id}>
                    <td className="mono">{r.month ? new Date(r.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</td>
                    <td className="mono color-accent">{Number(r.spotify || 0).toLocaleString()}</td>
                    <td className="mono color-muted">{Number(r.apple || 0).toLocaleString()}</td>
                    <td className="mono" style={{ color: 'var(--accent3)' }}>{Number(r.ig_followers || 0).toLocaleString()}</td>
                    <td className="mono color-muted">{Number(r.tiktok || 0).toLocaleString()}</td>
                    <td className="mono color-muted">{Number(r.youtube || 0).toLocaleString()}</td>
                    <td className="mono color-muted">{r.gigs || '—'}</td>
                    <td className="mono color-green">{r.revenue ? `$${Number(r.revenue).toLocaleString()}` : '—'}</td>
                    <td className="color-muted" style={{ fontSize: 11 }}>{r.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
