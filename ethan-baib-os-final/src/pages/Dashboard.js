import React, { useEffect, useState } from 'react'
import { getTasks, getGigs, getReleases, getIncomes, getExpenses, updateTask } from '../lib/supabase'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [gigs, setGigs] = useState([])
  const [releases, setReleases] = useState([])
  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [note, setNote] = useState(localStorage.getItem('eb_brainstorm') || '')

  useEffect(() => {
    getTasks().then(r => setTasks(r.data || []))
    getGigs().then(r => setGigs(r.data || []))
    getReleases().then(r => setReleases(r.data || []))
    getIncomes().then(r => setIncomes(r.data || []))
    getExpenses().then(r => setExpenses(r.data || []))
  }, [])

  const totalRevenue = incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0)
  const pendingTasks = tasks.filter(t => !t.done).length
  const upcomingGigs = gigs.filter(g => g.status === 'Confirmed' || g.status === 'Pending').length

  const toggleTask = async (task) => {
    const updated = { ...task, done: !task.done }
    setTasks(tasks.map(t => t.id === task.id ? updated : t))
    await updateTask(task.id, { done: !task.done })
  }

  const stageBadge = (stage) => {
    const map = {
      'Released': 'badge-green', 'Scheduled': 'badge-blue',
      'Mastering': 'badge-yellow', 'Mixing': 'badge-yellow',
      'Recording': 'badge-purple', 'Concept': 'badge-orange',
    }
    return map[stage] || 'badge-blue'
  }

  const gigStatus = (status) => {
    if (status === 'Confirmed') return 'badge-green'
    if (status === 'Pending') return 'badge-yellow'
    if (status === 'Completed') return 'badge-lime'
    return 'badge-red'
  }

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Welcome Back</div>
        <div className="page-title">ETHAN BAIB <em>HQ</em></div>
        <div className="page-subtitle">Your music career, fully in control.</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-label">Monthly Revenue</div>
          <div className="stat-value">${totalRevenue.toLocaleString()}</div>
          <div className="stat-change up">↑ All time logged income</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Active Gigs</div>
          <div className="stat-value">{upcomingGigs}</div>
          <div className="stat-change">{gigs.length} total booked</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Tasks Pending</div>
          <div className="stat-value">{pendingTasks}</div>
          <div className="stat-change">{tasks.length} total tasks</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Releases Tracked</div>
          <div className="stat-value">{releases.length}</div>
          <div className="stat-change">{releases.filter(r => r.stage === 'Released').length} released</div>
        </div>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 16 }}>
        {/* TASKS */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">☐ Priority Tasks</div>
            <a href="/tasks" className="btn btn-ghost btn-sm">View All →</a>
          </div>
          <div className="card-body" style={{ padding: '8px 18px' }}>
            {tasks.length === 0 && <div className="empty-state">No tasks yet — add some in Task Manager</div>}
            {tasks.slice(0, 7).map(task => (
              <div key={task.id} className="task-item" onClick={() => toggleTask(task)}>
                <div className={`task-check ${task.done ? 'checked' : ''}`} />
                <div className={`task-text ${task.done ? 'done' : ''}`}>{task.title}</div>
                {task.category && (
                  <span className="badge badge-purple">{task.category}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* UPCOMING GIGS */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⚡ Upcoming Gigs</div>
            <a href="/gigs" className="btn btn-ghost btn-sm">All →</a>
          </div>
          <div className="card-body" style={{ padding: '8px 18px' }}>
            {gigs.length === 0 && <div className="empty-state">No gigs yet</div>}
            {gigs.slice(0, 4).map(gig => {
              const d = gig.date ? new Date(gig.date) : null
              return (
                <div key={gig.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: 6, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d ? d.toLocaleString('default', { month: 'short' }) : '—'}</div>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: 'var(--accent)', lineHeight: 1 }}>{d ? d.getDate() : '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{gig.venue}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {gig.city} · {gig.type}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--green)' }}>{gig.pay ? `$${gig.pay}` : 'TBD'}</div>
                    <span className={`badge ${gigStatus(gig.status)}`}>{gig.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* RELEASE PIPELINE */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">◉ Release Pipeline</div>
            <a href="/releases" className="btn btn-ghost btn-sm">Manage →</a>
          </div>
          <div className="card-body" style={{ padding: '8px 18px' }}>
            {releases.length === 0 && <div className="empty-state">No releases tracked yet</div>}
            {releases.slice(0, 4).map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 6, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🎵</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                  <div className="mono color-muted">{r.type} · {r.target_date ? new Date(r.target_date).toLocaleDateString() : 'TBD'}</div>
                </div>
                <span className={`badge ${stageBadge(r.stage)}`}>{r.stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BRAINSTORM PAD */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">✎ Brainstorm Pad</div>
            <span style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--text-muted)' }}>Auto-saves locally</span>
          </div>
          <div className="card-body">
            <textarea
              className="textarea"
              style={{ minHeight: 180 }}
              placeholder="Dump your ideas here... lyrics, concepts, collab ideas, whatever's in your head."
              value={note}
              onChange={e => { setNote(e.target.value); localStorage.setItem('eb_brainstorm', e.target.value) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
