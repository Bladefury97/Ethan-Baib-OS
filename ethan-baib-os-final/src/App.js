import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Vision from './pages/Vision'
import Catalog from './pages/Catalog'
import Releases from './pages/Releases'
import Gigs from './pages/Gigs'
import Social from './pages/Social'
import Analytics from './pages/Analytics'
import EPK from './pages/EPK'
import Finances from './pages/Finances'
import Contacts from './pages/Contacts'
import Tasks from './pages/Tasks'
import Brand from './pages/Brand'
import Tools from './pages/Tools'
import './App.css'

const NAV = [
  { section: 'Overview', items: [
    { path: '/', icon: '⌂', label: 'Dashboard' },
    { path: '/vision', icon: '✦', label: 'Vision & Goals' },
  ]},
  { section: 'Music', items: [
    { path: '/catalog', icon: '♪', label: 'Music Catalog' },
    { path: '/releases', icon: '◉', label: 'Release Planner' },
    { path: '/gigs', icon: '⚡', label: 'Gig Tracker' },
  ]},
  { section: 'Growth', items: [
    { path: '/social', icon: '◈', label: 'Social & Content' },
    { path: '/analytics', icon: '▲', label: 'Analytics' },
    { path: '/brand', icon: '◐', label: 'Brand & Visuals' },
  ]},
  { section: 'Business', items: [
    { path: '/epk', icon: '✉', label: 'Press Kit (EPK)' },
    { path: '/finances', icon: '$', label: 'Finances' },
    { path: '/contacts', icon: '◌', label: 'Contacts' },
  ]},
  { section: 'Tools', items: [
    { path: '/tasks', icon: '☐', label: 'Task Manager' },
    { path: '/tools', icon: '⚙', label: 'Tools & Links' },
  ]},
]

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-logo">
          <div className="logo-text">ETHAN BAIB</div>
          <div className="logo-sub">Artist Operating System</div>
        </div>
        <div className="sidebar-artist">
          <div className="artist-avatar">EB</div>
          <div>
            <div className="artist-name">Ethan Baib</div>
            <div className="artist-role">Independent Artist</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ section, items }) => (
            <div key={section} className="nav-section">
              <div className="nav-section-label">{section}</div>
              {items.map(({ path, icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{icon}</span>
                  <span className="nav-label">{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-version">v1.0 · Built with ♥</div>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div className="topbar-right">
            <div className="topbar-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/releases" element={<Releases />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/social" element={<Social />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/epk" element={<EPK />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tools" element={<Tools />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
