import React, { useState, useEffect } from 'react'

// ── VISION ─────────────────────────────────────────────────────────────────
export function Vision() {
  const [statement, setStatement] = useState(localStorage.getItem('eb_statement') || '')
  const [dreams, setDreams] = useState(localStorage.getItem('eb_dreams') || '')
  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eb_goals') || '[]') } catch { return [] }
  })
  const [newGoal, setNewGoal] = useState({ text: '', target: '', progress: 0, category: 'Growth' })

  const saveGoals = (g) => { setGoals(g); localStorage.setItem('eb_goals', JSON.stringify(g)) }
  const addGoal = () => {
    if (!newGoal.text) return
    saveGoals([...goals, { ...newGoal, id: Date.now() }])
    setNewGoal({ text: '', target: '', progress: 0, category: 'Growth' })
  }
  const updateProgress = (id, val) => saveGoals(goals.map(g => g.id === id ? { ...g, progress: Number(val) } : g))
  const removeGoal = (id) => saveGoals(goals.filter(g => g.id !== id))

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">The Big Picture</div>
        <div className="page-title">VISION & <em>GOALS</em></div>
        <div className="page-subtitle">Where you're going and how you'll get there.</div>
      </div>
      <div className="grid-2">
        <div>
          <div className="section-label" style={{ marginBottom: 12 }}>ARTIST STATEMENT</div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-body">
              <textarea className="textarea" style={{ minHeight: 120 }}
                placeholder="Who are you as an artist? What do you stand for? What's your sound and mission? Write it here — this is your north star."
                value={statement}
                onChange={e => { setStatement(e.target.value); localStorage.setItem('eb_statement', e.target.value) }}
              />
            </div>
          </div>

          <div className="section-label" style={{ marginBottom: 12 }}>DREAM MILESTONES</div>
          <div className="card">
            <div className="card-body">
              <textarea className="textarea" style={{ minHeight: 150 }}
                placeholder={"The big scary exciting dreams. Don't hold back.\n\n🎤 Play a headline show at —\n🌍 Tour internationally\n💿 Get a TV/film placement\n🏆 Win a music award\n🎙️ Feature with —"}
                value={dreams}
                onChange={e => { setDreams(e.target.value); localStorage.setItem('eb_dreams', e.target.value) }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="section-label" style={{ marginBottom: 12 }}>2025 GOALS</div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <input className="input" placeholder="Goal description" value={newGoal.text} onChange={e => setNewGoal(g => ({ ...g, text: e.target.value }))} />
                <div className="grid-2">
                  <input className="input" placeholder="Target date" value={newGoal.target} onChange={e => setNewGoal(g => ({ ...g, target: e.target.value }))} />
                  <select className="select" value={newGoal.category} onChange={e => setNewGoal(g => ({ ...g, category: e.target.value }))}>
                    {['Growth', 'Releases', 'Live', 'Income', 'Social', 'Brand'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button className="btn btn-accent" onClick={addGoal}>+ Add Goal</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {goals.length === 0 && <div className="empty-state" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>No goals yet — add some above!</div>}
            {goals.map(g => (
              <div key={g.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{g.text}</div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeGoal(g.id)}>✕</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${g.progress}%`, background: 'var(--accent)', borderRadius: 4, transition: 'width 0.3s' }} />
                  </div>
                  <input type="range" min="0" max="100" value={g.progress} onChange={e => updateProgress(g.id, e.target.value)} style={{ width: 80, accentColor: 'var(--accent)' }} />
                  <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--accent)', width: 32 }}>{g.progress}%</div>
                </div>
                <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
                  <span className="badge badge-purple">{g.category}</span>
                  {g.target && <span style={{ marginLeft: 8 }}>📅 {g.target}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SOCIAL ──────────────────────────────────────────────────────────────────
export function Social() {
  const [platforms, setPlatforms] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eb_platforms') || 'null') } catch { return null }
  } || [
    { name: 'Spotify', icon: '🎵', handle: '', url: '', followers: '' },
    { name: 'Apple Music', icon: '🎵', handle: '', url: '', followers: '' },
    { name: 'Instagram', icon: '📷', handle: '', url: '', followers: '' },
    { name: 'TikTok', icon: '🎵', handle: '', url: '', followers: '' },
    { name: 'YouTube', icon: '▶', handle: '', url: '', followers: '' },
    { name: 'Twitter/X', icon: '🐦', handle: '', url: '', followers: '' },
    { name: 'SoundCloud', icon: '🎵', handle: '', url: '', followers: '' },
    { name: 'Bandcamp', icon: '🎵', handle: '', url: '', followers: '' },
    { name: 'Discord', icon: '💬', handle: '', url: '', followers: '' },
    { name: 'Newsletter', icon: '✉', handle: '', url: '', followers: '' },
  ])

  const update = (i, k, v) => {
    const updated = platforms.map((p, idx) => idx === i ? { ...p, [k]: v } : p)
    setPlatforms(updated)
    localStorage.setItem('eb_platforms', JSON.stringify(updated))
  }

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Stay Consistent</div>
        <div className="page-title">SOCIAL & <em>PLATFORMS</em></div>
        <div className="page-subtitle">All your handles and links in one hub.</div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">◈ Platform Hub</div><div style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--text-muted)' }}>Auto-saves as you type</div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Platform</th><th>Handle / Username</th><th>URL / Link</th><th>Followers</th></tr></thead>
            <tbody>
              {platforms.map((p, i) => (
                <tr key={p.name}>
                  <td style={{ fontWeight: 500 }}>{p.icon} {p.name}</td>
                  <td><input className="input" placeholder="@yourhandle" value={p.handle} onChange={e => update(i, 'handle', e.target.value)} style={{ padding: '5px 8px', fontSize: 12 }} /></td>
                  <td><input className="input" placeholder="https://..." value={p.url} onChange={e => update(i, 'url', e.target.value)} style={{ padding: '5px 8px', fontSize: 12 }} /></td>
                  <td><input className="input" type="number" placeholder="0" value={p.followers} onChange={e => update(i, 'followers', e.target.value)} style={{ padding: '5px 8px', fontSize: 12, maxWidth: 100 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📅 Content Strategy</div></div>
        <div className="card-body">
          <div className="grid-2">
            <div>
              <div className="section-label" style={{ marginBottom: 12, fontSize: 10 }}>CONTENT PILLARS</div>
              {[
                { emoji: '🎵', label: 'Behind the Music / Studio', pct: '40%' },
                { emoji: '🎤', label: 'Live Moments & Gig Recaps', pct: '25%' },
                { emoji: '👤', label: 'Personal / Lifestyle / Brand', pct: '20%' },
                { emoji: '📣', label: 'Promotional Release Content', pct: '15%' },
              ].map(p => (
                <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 16 }}>{p.emoji}</span>
                  <div style={{ flex: 1, fontSize: 13 }}>{p.label}</div>
                  <span className="badge badge-lime">{p.pct}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="section-label" style={{ marginBottom: 12, fontSize: 10 }}>POSTING CADENCE</div>
              {[
                { platform: 'Instagram', freq: '4x / week', color: 'var(--accent3)' },
                { platform: 'TikTok', freq: '3x / week', color: 'var(--accent2)' },
                { platform: 'YouTube', freq: '1x / month', color: 'var(--red)' },
                { platform: 'Newsletter', freq: '2x / month', color: 'var(--accent)' },
              ].map(p => (
                <div key={p.platform} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, fontSize: 13 }}>{p.platform}</div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: p.color }}>{p.freq}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── EPK ─────────────────────────────────────────────────────────────────────
export function EPK() {
  const fields = ['bio_short', 'bio_long', 'genre', 'booking_email', 'press_email', 'website', 'epk_url', 'spotify_monthly', 'ig_followers', 'years_active']
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eb_epk') || '{}') } catch { return {} }
  })
  const set = (k, v) => {
    const updated = { ...data, [k]: v }
    setData(updated)
    localStorage.setItem('eb_epk', JSON.stringify(updated))
  }

  const [mentions, setMentions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eb_mentions') || '[]') } catch { return [] }
  })
  const [newMention, setNewMention] = useState({ outlet: '', type: 'Feature', date: '', link: '' })
  const addMention = () => {
    if (!newMention.outlet) return
    const updated = [...mentions, { ...newMention, id: Date.now() }]
    setMentions(updated); localStorage.setItem('eb_mentions', JSON.stringify(updated))
    setNewMention({ outlet: '', type: 'Feature', date: '', link: '' })
  }
  const removeMention = (id) => {
    const updated = mentions.filter(m => m.id !== id)
    setMentions(updated); localStorage.setItem('eb_mentions', JSON.stringify(updated))
  }

  const TEMPLATES = {
    spotify: `Hi [Curator Name],\n\nMy name is Ethan Baib, an independent [genre] artist from [city]. My new track "[Song Name]" drops on [date] via [distributor].\n\n"[Song Name]" is a [mood/vibe] track about [theme]. It would be a great fit for your "[Playlist Name]" playlist based on [reason].\n\nSpotify: [link]\nStreaming preview: [link]\n\nThank you for your time and consideration!\n\nEthan Baib`,
    venue: `Hi [Booker Name],\n\nMy name is Ethan Baib, and I'm reaching out to inquire about booking opportunities at [Venue Name].\n\nI'm an independent [genre] artist based in [city] with [X] monthly Spotify listeners and a growing local following. I'd love to discuss performing at your venue on [proposed dates].\n\nYou can check out my music here: [link]\nEPK: [link]\n\nI'd love to set up a call to discuss further. What does your booking process look like?\n\nBest,\nEthan Baib`,
    press: `Hi [Writer/Editor Name],\n\nI'm Ethan Baib, an independent [genre] artist dropping my new [single/EP/album] "[Title]" on [date].\n\n[1-2 sentence hook about the release — what makes it unique, what it's about, why it matters now]\n\n[Artist stats / credibility — monthly listeners, past press, notable shows]\n\nI'd love to offer you an exclusive premiere or interview. I'm happy to send stems, a press kit, or hop on a quick call.\n\nStreaming link: [link]\nDownload: [link]\nEPK: [link]\n\nThank you!\nEthan Baib`,
    collab: `Hey [Artist Name],\n\nI'm Ethan Baib — a [genre] artist from [city]. I've been following your work for a while and I'm a huge fan of [specific song/project].\n\nI'm working on [project description] and I think your style would complement it perfectly. I had an idea for [brief concept] — something in the vein of [reference].\n\nNo pressure at all, but if you're open to it, I'd love to share some demos and see if anything resonates.\n\nMy music: [link]\n\nEither way, keep creating — your stuff is incredible.\n\nEthan`,
  }

  const [activeTemplate, setActiveTemplate] = useState('spotify')

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Your Story to the World</div>
        <div className="page-title">PRESS KIT <em>(EPK)</em></div>
        <div className="page-subtitle">Everything a booker, journalist, or curator needs.</div>
      </div>

      {/* EPK HERO */}
      <div style={{ background: 'linear-gradient(135deg, #111 0%, #1a0a2e 50%, #0a1a0e 100%)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 60, letterSpacing: 4, lineHeight: 1, marginBottom: 8 }}>ETHAN BAIB</div>
        <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 14 }}>{data.genre || 'Your Genre Here'}</div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['Spotify Monthly', data.spotify_monthly || '—'], ['IG Followers', data.ig_followers || '—'], ['Years Active', data.years_active || '—']].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: 'var(--accent)' }}>{v}</div>
              <div style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><div className="card-title">📝 Artist Bios</div></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="form-label">Short Bio (100 words)</label>
                <textarea className="textarea" placeholder="Brief, punchy bio for press and playlists..." value={data.bio_short || ''} onChange={e => set('bio_short', e.target.value)} style={{ minHeight: 80 }} />
              </div>
              <div>
                <label className="form-label">Long Bio (300 words)</label>
                <textarea className="textarea" placeholder="Full artist biography for features, EPK pages, and booking..." value={data.bio_long || ''} onChange={e => set('bio_long', e.target.value)} style={{ minHeight: 120 }} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">📬 Contact Info</div></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['genre', 'Genre / Sounds Like'],
                ['booking_email', 'Booking Email'],
                ['press_email', 'Press / Media Email'],
                ['website', 'Website URL'],
                ['epk_url', 'EPK Link'],
                ['spotify_monthly', 'Spotify Monthly Listeners'],
                ['ig_followers', 'Instagram Followers'],
                ['years_active', 'Years Active'],
              ].map(([k, label]) => (
                <div key={k}>
                  <label className="form-label">{label}</label>
                  <input className="input" value={data[k] || ''} onChange={e => set(k, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><div className="card-title">📰 Press Mentions</div></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <input className="input" placeholder="Outlet name" value={newMention.outlet} onChange={e => setNewMention(m => ({ ...m, outlet: e.target.value }))} />
                <div className="grid-2">
                  <select className="select" value={newMention.type} onChange={e => setNewMention(m => ({ ...m, type: e.target.value }))}>
                    {['Feature', 'Review', 'Interview', 'Playlist', 'Mention'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <input className="input" type="date" value={newMention.date} onChange={e => setNewMention(m => ({ ...m, date: e.target.value }))} />
                </div>
                <input className="input" placeholder="Link to article" value={newMention.link} onChange={e => setNewMention(m => ({ ...m, link: e.target.value }))} />
                <button className="btn btn-accent" onClick={addMention}>+ Add Mention</button>
              </div>
              {mentions.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{m.outlet}</div>
                    <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--text-muted)' }}>{m.type} · {m.date}</div>
                  </div>
                  {m.link && <a href={m.link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">↗</a>}
                  <button className="btn btn-danger btn-sm" onClick={() => removeMention(m.id)}>✕</button>
                </div>
              ))}
              {mentions.length === 0 && <div className="empty-state" style={{ padding: 20 }}>No press yet — keep grinding!</div>}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Pitch Templates</div>
            </div>
            <div style={{ display: 'flex', gap: 6, padding: '10px 18px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
              {[['spotify', 'Spotify Pitch'], ['venue', 'Venue Booking'], ['press', 'PR / Blog'], ['collab', 'Collab Outreach']].map(([k, l]) => (
                <button key={k} className={`btn btn-sm ${activeTemplate === k ? 'btn-accent' : 'btn-ghost'}`} onClick={() => setActiveTemplate(k)}>{l}</button>
              ))}
            </div>
            <div className="card-body">
              <textarea className="textarea" style={{ minHeight: 200, fontFamily: 'DM Mono', fontSize: 11, lineHeight: 1.8 }} value={TEMPLATES[activeTemplate]} readOnly />
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => navigator.clipboard.writeText(TEMPLATES[activeTemplate])}>Copy Template</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── BRAND ────────────────────────────────────────────────────────────────────
export function Brand() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eb_brand') || '{}') } catch { return {} }
  })
  const set = (k, v) => { const u = { ...data, [k]: v }; setData(u); localStorage.setItem('eb_brand', JSON.stringify(u)) }

  const ASSETS = ['Press Photo 1 — Hi-Res (300dpi)', 'Press Photo 2 — Live Shot', 'Logo — Full Color (SVG)', 'Logo — White (SVG)', 'Logo — Black (SVG)', 'Artwork Files (Layered PSD)', 'Social Media Templates (IG)', 'Social Media Templates (Stories)', 'Banner / Header Images', 'Official Music Videos', 'Lyric Videos']
  const [checklist, setChecklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eb_brand_checklist') || '{}') } catch { return {} }
  })
  const toggleCheck = (item) => {
    const u = { ...checklist, [item]: !checklist[item] }
    setChecklist(u); localStorage.setItem('eb_brand_checklist', JSON.stringify(u))
  }

  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Look & Feel</div>
        <div className="page-title">BRAND & <em>VISUALS</em></div>
        <div className="page-subtitle">Your visual identity, assets, and content strategy.</div>
      </div>
      <div className="grid-2">
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><div className="card-title">🎨 Brand Identity</div></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['primary_colors', 'Primary Colors (hex codes)'], ['fonts', 'Primary Font(s)'], ['aesthetic', 'Visual Aesthetic / Vibe'], ['moodboard', 'Moodboard Link (Pinterest etc)'], ['tagline', 'Artist Tagline / Slogan']].map(([k, l]) => (
                <div key={k}>
                  <label className="form-label">{l}</label>
                  <input className="input" value={data[k] || ''} onChange={e => set(k, e.target.value)} />
                </div>
              ))}
              <div>
                <label className="form-label">Brand Notes</label>
                <textarea className="textarea" value={data.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Any other brand guidelines, dos and don'ts..." />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">📁 Asset Checklist</div>
              <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--accent)' }}>{Object.values(checklist).filter(Boolean).length} / {ASSETS.length} ready</div>
            </div>
            <div className="card-body" style={{ padding: '8px 18px' }}>
              {ASSETS.map(item => (
                <div key={item} className="task-item" onClick={() => toggleCheck(item)}>
                  <div className={`task-check ${checklist[item] ? 'checked' : ''}`} />
                  <div className={`task-text ${checklist[item] ? 'done' : ''}`}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── TOOLS ────────────────────────────────────────────────────────────────────
export function Tools() {
  const sections = [
    { title: '🎵 Distribution', tools: [['DistroKid', 'https://distrokid.com', 'Most popular indie distributor'], ['TuneCore', 'https://tunecore.com', 'Keep 100% royalties'], ['CD Baby', 'https://cdbaby.com', 'One-time fee option'], ['Amuse', 'https://amuse.io', 'Free tier available'], ['United Masters', 'https://unitedmasters.com', 'Great for hip-hop']] },
    { title: '🎨 Creative Tools', tools: [['Canva', 'https://canva.com', 'Design artwork & socials'], ['Adobe Express', 'https://express.adobe.com', 'Quick content creation'], ['CapCut', 'https://capcut.com', 'Video editing for TikTok'], ['LANDR', 'https://landr.com', 'AI mastering'], ['Splice', 'https://splice.com', 'Samples & sounds']] },
    { title: '📈 Promotion', tools: [['SubmitHub', 'https://submithub.com', 'Pitch to blogs & playlists'], ['Mailchimp', 'https://mailchimp.com', 'Email newsletter'], ['Chartmetric', 'https://chartmetric.com', 'Analytics & tracking'], ['Linktree', 'https://linktr.ee', 'One link for everything'], ['Daily Playlists', 'https://dailyplaylists.com', 'Playlist pitching']] },
    { title: '🛒 Merchandise', tools: [['Shopify', 'https://shopify.com', 'Full merch store'], ['Bandcamp', 'https://bandcamp.com', 'Music + merch direct to fans'], ['Printful', 'https://printful.com', 'Print-on-demand merch'], ['Spring', 'https://spri.ng', 'Creator merch platform'], ['Printify', 'https://printify.com', 'POD alternative']] },
    { title: '📊 Analytics', tools: [['Spotify for Artists', 'https://artists.spotify.com', 'Official Spotify dashboard'], ['Apple Music for Artists', 'https://artists.apple.com', 'Apple analytics'], ['Soundcharts', 'https://soundcharts.com', 'Multi-platform tracking'], ['Google Analytics', 'https://analytics.google.com', 'Website traffic'], ['Social Blade', 'https://socialblade.com', 'Social media growth tracker']] },
    { title: '⚖️ Business & Legal', tools: [['Copyright.gov', 'https://copyright.gov', 'Register your music'], ['ASCAP', 'https://ascap.com', 'PRO — register your songs'], ['BMI', 'https://bmi.com', 'Alternative PRO'], ['Wave Accounting', 'https://waveapps.com', 'Free accounting software'], ['HelloSign', 'https://hellosign.com', 'e-Contract signing']] },
  ]
  return (
    <div className="page-anim">
      <div className="page-header">
        <div className="page-eyebrow">Your Arsenal</div>
        <div className="page-title">TOOLS & <em>RESOURCES</em></div>
        <div className="page-subtitle">Every platform you need to run your career.</div>
      </div>
      <div className="grid-2">
        {sections.map(s => (
          <div key={s.title} className="card">
            <div className="card-header"><div className="card-title">{s.title}</div></div>
            <div className="card-body" style={{ padding: '8px 18px' }}>
              {s.tools.map(([name, url, desc]) => (
                <a key={name} href={url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', cursor: 'pointer' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>🔗</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--accent)' }}>↗</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
