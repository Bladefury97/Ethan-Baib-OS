import React, { useEffect, useState } from 'react'
import { getCatalog, addTrack, updateTrack, deleteTrack } from '../lib/supabase'

const TYPES = ['Single', 'EP Track', 'Album Track', 'Demo', 'Remix', 'Unreleased']
const STAGES = ['Idea', 'Writing', 'Recording', 'Mixing', 'Mastering', 'Scheduled', 'Released']
const KEYS = ['C', 'Cm', 'C#', 'Db', 'D', 'Dm', 'D#', 'Eb', 'E', 'Em', 'F', 'Fm', 'F#', 'Gb', 'G', 'Gm', 'G#', 'Ab', 'A', 'Am', 'A#', 'Bb', 'B', 'Bm']

const stageColor = s => ({ Released: 'badge-green', Scheduled: 'badge-blue', Mastering: 'badge-yellow', Mixing: 'badge-yellow', Recording: 'badge-purple', Writing: 'badge-purple', Idea: 'badge-red' }[s] || 'badge-blue')

function Modal({ onClose, onSave, initial = {} }) {
  const [form, setForm] = useState({ title: '', type: 'Single', bpm: '', key: 'Am', isrc: '', release_date: '', stage: 'Idea', streams: '', distributor: '', notes: '', ...initial })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial.id ? 'EDIT TRACK' : 'NEW TRACK'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="input" placeholder="Track title" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="select" value={form.type} onChange={e => set('type', e.target.value)}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">BPM</label>
              <input className="input" type="number" placeholder="120" value={form.bpm || ''} onChange={e => set('bpm', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Key</label>
              <select className="select" value={form.key || 'Am'} onChange={e => set('key', e.target.value)}>{KEYS.map(k => <option key={k}>{k}</option>)}</select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Stage</label>
              <select className="select" value={form.stage} onChange={e => set('stage', e.target.value)}>{STAGES.map(s => <option key={s}>{s}</option>)}</select>
            </div>
            <div className="form-group">
              <label className="form-label">Release Date</label>
              <input className="input" type="date" value={form.release_date || ''} onChange={e => set('release_date', e.target.value)} />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">ISRC Code</label>
              <input className="input" placeholder="US-XXX-24-00001" value={form.isrc || ''} onChange={e => set('isrc', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Streams</label>
              <input className="input" type="number" placeholder="0" value={form.streams || ''} onChange={e => set('streams', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="textarea" value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => form.title && onSave(form)}>Save Track</button>
        </div>
      </div>
    </div>
  )
}

export default function Catalog() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = async () => { setLoading(true); const { data } = await getCatalog(); setTracks(data || []); setLoading(false) }
  useEffect(() => { load() }, [])

  const save = async (form) => {
    if (form.id) { await updateTrack(form.id, form) } else { await addTrack(form) }
    setModal(null); load()
  }
  const remove = async (id) => { await deleteTrack(id); setTracks(tracks.filter(t => t.id !== id)) }

  const released = tracks.filter(t => t.stage === 'Released').length
  const totalStreams = tracks.reduce((s, t) => s + (Number(t.streams) || 0), 0)

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Your Body of Work</div>
        <div className="page-title">MUSIC <em>CATALOG</em></div>
        <div className="page-subtitle">Every song, every version, every detail — documented.</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green"><div className="stat-label">Total Tracks</div><div className="stat-value">{tracks.length}</div></div>
        <div className="stat-card blue"><div className="stat-label">Released</div><div className="stat-value">{released}</div></div>
        <div className="stat-card purple"><div className="stat-label">In Progress</div><div className="stat-value">{tracks.length - released}</div></div>
        <div className="stat-card orange"><div className="stat-label">Total Streams</div><div className="stat-value">{totalStreams > 1000 ? `${(totalStreams/1000).toFixed(1)}K` : totalStreams}</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🎵 Discography</div>
          <button className="btn btn-accent" onClick={() => setModal({})}>+ Add Track</button>
        </div>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Type</th><th>BPM</th><th>Key</th><th>ISRC</th><th>Release Date</th><th>Stage</th><th>Streams</th><th>Actions</th></tr></thead>
              <tbody>
                {tracks.length === 0 && <tr><td colSpan={9}><div className="empty-state">No tracks yet — start logging your music!</div></td></tr>}
                {tracks.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.title}</td>
                    <td><span className="badge badge-blue">{t.type}</span></td>
                    <td className="mono color-muted">{t.bpm || '—'}</td>
                    <td className="mono color-muted">{t.key || '—'}</td>
                    <td className="mono color-muted" style={{ fontSize: 10 }}>{t.isrc || 'Pending'}</td>
                    <td className="mono color-muted">{t.release_date ? new Date(t.release_date).toLocaleDateString() : 'TBD'}</td>
                    <td><span className={`badge ${stageColor(t.stage)}`}>{t.stage}</span></td>
                    <td className="mono color-green">{t.streams ? Number(t.streams).toLocaleString() : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(t)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(t.id)}>✕</button>
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
