// CONTACTS PAGE
import React, { useEffect, useState } from 'react'
import { getContacts, addContact, updateContact, deleteContact } from '../lib/supabase'

const ROLES = ['Venue Booker', 'Promoter', 'Producer', 'Engineer', 'Journalist', 'Photographer', 'Videographer', 'PR', 'Manager', 'Label', 'Sync', 'Collab Artist', 'Other']
const STATUSES = ['Active', 'Warm', 'Cold', 'Follow Up']

function Modal({ onClose, onSave, initial = {} }) {
  const [form, setForm] = useState({ name: '', role: 'Venue Booker', company: '', email: '', phone: '', instagram: '', status: 'Active', notes: '', ...initial })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial.id ? 'EDIT CONTACT' : 'NEW CONTACT'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="input" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="select" value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="input" placeholder="Company / Venue" value={form.company || ''} onChange={e => set('company', e.target.value)} />
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
              <label className="form-label">Email</label>
              <input className="input" type="email" placeholder="email@example.com" value={form.email || ''} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="input" placeholder="+1 (555) 000-0000" value={form.phone || ''} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Instagram</label>
            <input className="input" placeholder="@handle" value={form.instagram || ''} onChange={e => set('instagram', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="textarea" value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => form.name && onSave(form)}>Save Contact</button>
        </div>
      </div>
    </div>
  )
}

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const load = async () => { setLoading(true); const { data } = await getContacts(); setContacts(data || []); setLoading(false) }
  useEffect(() => { load() }, [])

  const save = async (form) => {
    if (form.id) { await updateContact(form.id, form) } else { await addContact(form) }
    setModal(null); load()
  }
  const remove = async (id) => { await deleteContact(id); setContacts(contacts.filter(c => c.id !== id)) }

  const statusBadge = s => ({ Active: 'badge-green', Warm: 'badge-yellow', Cold: 'badge-blue', 'Follow Up': 'badge-orange' }[s] || 'badge-blue')
  const filtered = contacts.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.role?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Your Network</div>
        <div className="page-title">CONTACTS & <em>NETWORK</em></div>
        <div className="page-subtitle">Venues, promoters, producers, press — your full Rolodex.</div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 10, flex: 1, marginRight: 12 }}>
            <input className="input" placeholder="🔍 Search contacts..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
          </div>
          <button className="btn btn-accent" onClick={() => setModal({})}>+ Add Contact</button>
        </div>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Role</th><th>Company</th><th>Email</th><th>Instagram</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={7}><div className="empty-state">{search ? 'No results' : 'No contacts yet — start building your network!'}</div></td></tr>}
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td><span className="badge badge-purple">{c.role}</span></td>
                    <td className="color-muted">{c.company || '—'}</td>
                    <td className="mono color-muted" style={{ fontSize: 11 }}>{c.email || '—'}</td>
                    <td className="mono color-muted" style={{ fontSize: 11 }}>{c.instagram || '—'}</td>
                    <td><span className={`badge ${statusBadge(c.status)}`}>{c.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(c)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>✕</button>
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
