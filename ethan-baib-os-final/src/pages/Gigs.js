import React, { useEffect, useState } from 'react'
import { getGigs, addGig, updateGig, deleteGig } from '../lib/supabase'

const TYPES = ['Headline', 'Support', 'Opening', 'Festival', 'Private', 'Showcase']
const STATUSES = ['Confirmed', 'Pending', 'Completed', 'Cancelled']

function Modal({ onClose, onSave, initial = {} }) {
  const [form, setForm] = useState({ venue: '', city: '', date: '', type: 'Headline', pay: '', status: 'Pending', soundcheck: '', set_length: '', contact: '', notes: '', ...initial })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial.id ? 'EDIT GIG' : 'NEW GIG'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Venue *</label>
              <input className="input" placeholder="Venue name" value={form.venue} onChange={e => set('venue', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="input" placeholder="City, State" value={form.city || ''} onChange={e => set('city', e.target.value)} />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="input" type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="select" value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Pay ($)</label>
              <input className="input" type="number" placeholder="0" value={form.pay || ''} onChange={e => set('pay', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="select" value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Soundcheck Time</label>
              <input className="input" placeholder="e.g. 6:00 PM" value={form.soundcheck || ''} onChange={e => set('soundcheck', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Set Length</label>
              <input className="input" placeholder="e.g. 45 min" value={form.set_length || ''} onChange={e => set('set_length', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Promoter / Contact</label>
            <input className="input" placeholder="Contact name or email" value={form.contact || ''} onChange={e => set('contact', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="textarea" value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => form.venue && onSave(form)}>Save Gig</button>
        </div>
      </div>
    </div>
  )
}

export default function Gigs() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = async () => { setLoading(true); const { data } = await getGigs(); setGigs(data || []); setLoading(false) }
  useEffect(() => { load() }, [])

  const save = async (form) => {
    if (form.id) { await updateGig(form.id, form) } else { await addGig(form) }
    setModal(null); load()
  }
  const remove = async (id) => { await deleteGig(id); setGigs(gigs.filter(g => g.id !== id)) }

  const statusBadge = s => ({ Confirmed: 'badge-green', Pending: 'badge-yellow', Completed: 'badge-lime', Cancelled: 'badge-red' }[s] || 'badge-blue')

  const totalPay = gigs.filter(g => g.status === 'Completed').reduce((s, g) => s + (Number(g.pay) || 0), 0)
  const confirmed = gigs.filter(g => g.status === 'Confirmed').length
  const pending = gigs.filter(g => g.status === 'Pending').length

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Hit the Stage</div>
        <div className="page-title">GIG <em>TRACKER</em></div>
        <div className="page-subtitle">Every performance, payday, and follow-up in one place.</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green"><div className="stat-label">Total Gigs</div><div className="stat-value">{gigs.length}</div></div>
        <div className="stat-card orange"><div className="stat-label">Earned (Completed)</div><div className="stat-value">${totalPay.toLocaleString()}</div></div>
        <div className="stat-card blue"><div className="stat-label">Confirmed</div><div className="stat-value">{confirmed}</div></div>
        <div className="stat-card purple"><div className="stat-label">Pending</div><div className="stat-value">{pending}</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🎤 All Performances</div>
          <button className="btn btn-accent" onClick={() => setModal({})}>+ Add Gig</button>
        </div>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Date</th><th>Venue</th><th>City</th><th>Type</th>
                <th>Pay</th><th>Set</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {gigs.length === 0 && <tr><td colSpan={8}><div className="empty-state">No gigs yet — add your first performance!</div></td></tr>}
                {gigs.map(g => (
                  <tr key={g.id}>
                    <td className="mono color-muted">{g.date ? new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}</td>
                    <td style={{ fontWeight: 500 }}>{g.venue}</td>
                    <td className="color-muted">{g.city || '—'}</td>
                    <td><span className="badge badge-purple">{g.type}</span></td>
                    <td className={g.pay ? 'color-green mono' : 'color-muted mono'}>{g.pay ? `$${Number(g.pay).toLocaleString()}` : 'TBD'}</td>
                    <td className="mono color-muted">{g.set_length || '—'}</td>
                    <td><span className={`badge ${statusBadge(g.status)}`}>{g.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(g)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(g.id)}>✕</button>
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
