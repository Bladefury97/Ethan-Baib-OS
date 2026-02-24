import React, { useEffect, useState } from 'react'
import { getIncomes, addIncome, deleteIncome, getExpenses, addExpense, deleteExpense } from '../lib/supabase'

const INCOME_CATS = ['Live', 'Streaming', 'Merch', 'Sync', 'Teaching', 'Publishing', 'Other']
const EXPENSE_CATS = ['Studio', 'Gear', 'Marketing', 'Distribution', 'Travel', 'Design', 'Software', 'Other']

function AddRow({ onSave, cats, type }) {
  const [form, setForm] = useState({ date: '', description: '', category: cats[0], amount: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const save = () => {
    if (!form.amount) return
    onSave(form)
    setForm({ date: '', description: '', category: cats[0], amount: '' })
  }
  return (
    <tr style={{ background: 'var(--surface2)' }}>
      <td><input className="input" type="date" style={{ fontSize: 11, padding: '5px 8px' }} value={form.date} onChange={e => set('date', e.target.value)} /></td>
      <td><input className="input" placeholder="Description" style={{ fontSize: 11, padding: '5px 8px' }} value={form.description} onChange={e => set('description', e.target.value)} /></td>
      <td>
        <select className="select" style={{ fontSize: 11, padding: '5px 8px' }} value={form.category} onChange={e => set('category', e.target.value)}>
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>
      </td>
      <td><input className="input" type="number" placeholder="0.00" style={{ fontSize: 11, padding: '5px 8px' }} value={form.amount} onChange={e => set('amount', e.target.value)} /></td>
      <td><button className="btn btn-accent btn-sm" onClick={save}>+ Add</button></td>
    </tr>
  )
}

export default function Finances() {
  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('income')

  const load = async () => {
    setLoading(true)
    const [i, e] = await Promise.all([getIncomes(), getExpenses()])
    setIncomes(i.data || [])
    setExpenses(e.data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const totalIncome = incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0)
  const totalExpenses = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const net = totalIncome - totalExpenses

  const catBadge = cat => {
    const map = { Live: 'badge-purple', Streaming: 'badge-green', Merch: 'badge-blue', Sync: 'badge-yellow', Teaching: 'badge-orange', Studio: 'badge-purple', Gear: 'badge-blue', Marketing: 'badge-orange', Distribution: 'badge-green', Travel: 'badge-yellow', Design: 'badge-red' }
    return map[cat] || 'badge-blue'
  }

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Get Paid</div>
        <div className="page-title">FINANCES & <em>INCOME</em></div>
        <div className="page-subtitle">Know your numbers. Know your worth.</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-label">Total Income</div>
          <div className="stat-value">${totalIncome.toLocaleString()}</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">${totalExpenses.toLocaleString()}</div>
        </div>
        <div className={`stat-card ${net >= 0 ? 'blue' : 'purple'}`}>
          <div className="stat-label">Net Profit</div>
          <div className="stat-value">${Math.abs(net).toLocaleString()}</div>
          <div className={`stat-change ${net >= 0 ? 'up' : 'down'}`}>{net >= 0 ? '↑ In profit' : '↓ In the red'}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Margin</div>
          <div className="stat-value">{totalIncome > 0 ? Math.round((net / totalIncome) * 100) : 0}%</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className={`btn ${tab === 'income' ? 'btn-accent' : 'btn-ghost'}`} onClick={() => setTab('income')}>💰 Income ({incomes.length})</button>
        <button className={`btn ${tab === 'expenses' ? 'btn-accent' : 'btn-ghost'}`} onClick={() => setTab('expenses')}>💸 Expenses ({expenses.length})</button>
      </div>

      {tab === 'income' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">💰 Income Log</div>
            <div className="mono color-muted">Total: <span className="color-green">${totalIncome.toLocaleString()}</span></div>
          </div>
          {loading ? <div className="loading">Loading...</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th></th></tr></thead>
                <tbody>
                  <AddRow cats={INCOME_CATS} type="income" onSave={async (form) => { await addIncome(form); load() }} />
                  {incomes.length === 0 && <tr><td colSpan={5}><div className="empty-state">No income logged yet</div></td></tr>}
                  {incomes.map(item => (
                    <tr key={item.id}>
                      <td className="mono color-muted">{item.date ? new Date(item.date).toLocaleDateString() : '—'}</td>
                      <td>{item.description || '—'}</td>
                      <td>{item.category && <span className={`badge ${catBadge(item.category)}`}>{item.category}</span>}</td>
                      <td className="mono color-green">+${Number(item.amount || 0).toLocaleString()}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={async () => { await deleteIncome(item.id); setIncomes(incomes.filter(i => i.id !== item.id)) }}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'expenses' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">💸 Expense Log</div>
            <div className="mono color-muted">Total: <span style={{ color: 'var(--red)' }}>${totalExpenses.toLocaleString()}</span></div>
          </div>
          {loading ? <div className="loading">Loading...</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th></th></tr></thead>
                <tbody>
                  <AddRow cats={EXPENSE_CATS} type="expense" onSave={async (form) => { await addExpense(form); load() }} />
                  {expenses.length === 0 && <tr><td colSpan={5}><div className="empty-state">No expenses logged yet</div></td></tr>}
                  {expenses.map(item => (
                    <tr key={item.id}>
                      <td className="mono color-muted">{item.date ? new Date(item.date).toLocaleDateString() : '—'}</td>
                      <td>{item.description || '—'}</td>
                      <td>{item.category && <span className={`badge ${catBadge(item.category)}`}>{item.category}</span>}</td>
                      <td className="mono" style={{ color: 'var(--red)' }}>-${Number(item.amount || 0).toLocaleString()}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={async () => { await deleteExpense(item.id); setExpenses(expenses.filter(e => e.id !== item.id)) }}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
