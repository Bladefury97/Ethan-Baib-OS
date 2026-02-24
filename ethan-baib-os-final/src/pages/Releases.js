import React, { useEffect, useState } from 'react'
import { getReleases, addRelease, updateRelease, deleteRelease } from '../lib/supabase'

const TYPES = ['Single', 'EP', 'Album', 'Remix EP', 'Mixtape']
const STAGES = ['Concept', 'Writing', 'Recording', 'Mixing', 'Mastering', 'Artwork', 'Submitted', 'Scheduled', 'Released']
const DISTRIBUTORS = ['DistroKid', 'TuneCore', 'CD Baby', 'Amuse', 'United Masters', 'Other']

const stageColor = s => ({
  Released: 'badge-green', Scheduled: 'badge-blue', Mastering: 'badge-yellow',
  Mixing: 'badge-yellow', Artwork: 'badge-orange', Submitted: 'badge-blue',
  Recording: 'badge-purple', Writing: 'badge-purple', Concept: 'badge-red',
}[s] || 'badge-blue')

function Modal({ onClose, onSave, initial = {} }) {
  const [form, setForm] = useState({ title: '', type: 'EP', track_count: '', target_date: '', distributor: 'DistroKid', budget: '', stage: 'Concept', notes: '', ...initial })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial.id ? 'EDIT RELEASE' : 'NEW RELEASE'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input className="input" placeholder="e.g. Neon Pulse EP" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="select" value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Track Count</label>
              <input className="input" type="number" placeholder="1" value={form.track_count || ''} onChange={e => set('track_count', e.target.value)} />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Target Drop Date</label>
              <input className="input" type="date" value={form.target_date || ''} onChange={e => set('target_date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Stage</label>
              <select className="select" value={form.stage} onChange={e => set('stage', e.target.value)}>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Distributor</label>
              <select className="select" value={form.distributor || ''} onChange={e => set('distributor', e.target.value)}>
                {DISTRIBUTORS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Budget ($)</label>
              <input className="input" type="number" placeholder="0" value={form.budget || ''} onChange={e => set('budget', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="textarea" value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => form.title && onSave(form)}>Save Release</button>
        </div>
      </div>
    </div>
  )
}

export default function Releases() {
  const [releases, setReleases] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = async () => { setLoading(true); const { data } = await getReleases(); setReleases(data || []); setLoading(false) }
  useEffect(() => { load() }, [])

  const save = async (form) => {
    if (form.id) { await updateRelease(form.id, form) } else { await addRelease(form) }
    setModal(null); load()
  }
  const remove = async (id) => { await deleteRelease(id); setReleases(releases.filter(r => r.id !== id)) }

  const released = releases.filter(r => r.stage === 'Released').length
  const inProgress = releases.filter(r => r.stage !== 'Released' && r.stage !== 'Concept').length
  const totalBudget = releases.reduce((s, r) => s + (Number(r.budget) || 0), 0)

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Drop It Right</div>
        <div className="page-title">RELEASE <em>PLANNER</em></div>
        <div className="page-subtitle">Plan every release from concept to chart week.</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green"><div className="stat-label">Total Projects</div><div className="stat-value">{releases.length}</div></div>
        <div className="stat-card blue"><div className="stat-label">In Progress</div><div className="stat-value">{inProgress}</div></div>
        <div className="stat-card purple"><div className="stat-label">Released</div><div className="stat-value">{released}</div></div>
        <div className="stat-card orange"><div className="stat-label">Total Budget</div><div className="stat-value">${totalBudget.toLocaleString()}</div></div>
      </div>

      {/* CHECKLIST CARD */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">✅ Release Checklist Template</div>
          <span style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--text-muted)' }}>Use this for every release</span>
        </div>
        <div className="card-body">
          <div className="grid-3">
            {[
              { label: '6 Weeks Out', color: 'var(--accent)', items: ['Finalize tracklist', 'Complete mastering', 'Register ISRC codes', 'Submit to distributor'] },
              { label: '3 Weeks Out', color: 'var(--yellow)', items: ['Finalize artwork', 'Submit Spotify editorial pitch', 'Send to press / blogs', 'Schedule social teasers'] },
              { label: 'Release Week', color: 'var(--accent2)', items: ['IG/TikTok launch post', 'Email your newsletter', 'Engage every comment', 'Track first-week stats'] },
            ].map(col => (
              <div key={col.label}>
                <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: col.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{col.label}</div>
                {col.items.map(item => (
                  <div key={item} className="task-item" style={{ cursor: 'default' }}>
                    <div className="task-check" />
                    <div className="task-text" style={{ fontSize: 12 }}>{item}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">◉ All Releases</div>
          <button className="btn btn-accent" onClick={() => setModal({})}>+ New Release</button>
        </div>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Title</th><th>Type</th><th>Tracks</th><th>Drop Date</th>
                <th>Distributor</th><th>Budget</th><th>Stage</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {releases.length === 0 && <tr><td colSpan={8}><div className="empty-state">No releases tracked yet</div></td></tr>}
                {releases.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.title}</td>
                    <td><span className="badge badge-blue">{r.type}</span></td>
                    <td className="mono color-muted">{r.track_count || '—'}</td>
                    <td className="mono color-muted">{r.target_date ? new Date(r.target_date).toLocaleDateString() : 'TBD'}</td>
                    <td className="color-muted">{r.distributor || '—'}</td>
                    <td className="mono color-yellow">{r.budget ? `$${Number(r.budget).toLocaleString()}` : '—'}</td>
                    <td><span className={`badge ${stageColor(r.stage)}`}>{r.stage}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(r)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal !== null && <Modal initial={modal} onClose={() => setModal(null)} onSave={save} />}
    </div>
  )
}
