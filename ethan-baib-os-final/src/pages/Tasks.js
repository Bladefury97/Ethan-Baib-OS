import React, { useEffect, useState } from 'react'
import { getTasks, addTask, updateTask, deleteTask } from '../lib/supabase'

const CATEGORIES = ['Release', 'Promo', 'Studio', 'Social', 'Admin', 'Gig', 'Merch']
const PRIORITIES = ['Urgent', 'High', 'Medium', 'Low']
const COLUMNS = ['To Do', 'In Progress', 'Done', 'Blocked']

const priorityColor = p => ({ Urgent: 'badge-red', High: 'badge-orange', Medium: 'badge-yellow', Low: 'badge-blue' }[p] || 'badge-blue')
const catColor = c => ({ Release: 'badge-lime', Promo: 'badge-orange', Studio: 'badge-purple', Social: 'badge-yellow', Admin: 'badge-blue', Gig: 'badge-green', Merch: 'badge-red' }[c] || 'badge-blue')

function Modal({ onClose, onSave, initial = {} }) {
  const [form, setForm] = useState({ title: '', category: 'Release', priority: 'Medium', due_date: '', notes: '', status: 'To Do', ...initial })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial.id ? 'EDIT TASK' : 'NEW TASK'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input className="input" placeholder="What needs to be done?" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="select" value={form.priority} onChange={e => set('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="select" value={form.status} onChange={e => set('status', e.target.value)}>
                {COLUMNS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input className="input" type="date" value={form.due_date || ''} onChange={e => set('due_date', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="textarea" placeholder="Any extra details..." value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => form.title && onSave(form)}>Save Task</button>
        </div>
      </div>
    </div>
  )
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState('All')

  const load = async () => {
    setLoading(true)
    const { data } = await getTasks()
    setTasks(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async (form) => {
    if (form.id) {
      await updateTask(form.id, form)
    } else {
      await addTask(form)
    }
    setModal(null)
    load()
  }

  const toggle = async (task) => {
    const newStatus = task.status === 'Done' ? 'To Do' : 'Done'
    await updateTask(task.id, { status: newStatus })
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
  }

  const remove = async (id) => {
    await deleteTask(id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter || t.category === filter)

  const pending = tasks.filter(t => t.status !== 'Done').length
  const done = tasks.filter(t => t.status === 'Done').length
  const urgent = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Stay Moving</div>
        <div className="page-title">TASK <em>MANAGER</em></div>
        <div className="page-subtitle">Your daily operations, projects, and deadlines.</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card purple"><div className="stat-label">Pending</div><div className="stat-value">{pending}</div></div>
        <div className="stat-card green"><div className="stat-label">Completed</div><div className="stat-value">{done}</div></div>
        <div className="stat-card orange"><div className="stat-label">Urgent</div><div className="stat-value">{urgent}</div></div>
        <div className="stat-card blue"><div className="stat-label">Total</div><div className="stat-value">{tasks.length}</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', ...COLUMNS, ...CATEGORIES].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-accent' : 'btn-ghost'}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <button className="btn btn-accent" onClick={() => setModal({})}>+ New Task</button>
        </div>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th style={{ width: 32 }}></th>
                <th>Task</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7}><div className="empty-state">No tasks yet. Add one above!</div></td></tr>
                )}
                {filtered.map(task => (
                  <tr key={task.id}>
                    <td>
                      <div className={`task-check ${task.status === 'Done' ? 'checked' : ''}`} onClick={() => toggle(task)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ fontWeight: 500 }} className={task.status === 'Done' ? 'color-muted' : ''}>{task.title}</td>
                    <td>{task.category && <span className={`badge ${catColor(task.category)}`}>{task.category}</span>}</td>
                    <td>{task.priority && <span className={`badge ${priorityColor(task.priority)}`}>{task.priority}</span>}</td>
                    <td>
                      <span className={`badge ${task.status === 'Done' ? 'badge-green' : task.status === 'Blocked' ? 'badge-red' : task.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}>{task.status}</span>
                    </td>
                    <td className="mono color-muted">{task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(task)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(task.id)}>✕</button>
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
