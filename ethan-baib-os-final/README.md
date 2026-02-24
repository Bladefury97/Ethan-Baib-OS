# 🎵 Ethan Baib — Artist OS
### Your complete music career management app

---

## 🚀 DEPLOYMENT GUIDE (Step by Step)

Follow these steps exactly and you'll have your app live in ~15 minutes.

---

### STEP 1 — Set Up Supabase Database

1. Go to **[supabase.com](https://supabase.com)** and log in
2. Open your `artist-os` project
3. In the left sidebar, click **SQL Editor**
4. Click **New Query**
5. Open the file `supabase-schema.sql` from this folder
6. Copy the entire contents and paste into the SQL editor
7. Click **Run** (green button)
8. You should see "Success. No rows returned" — that means it worked!

---

### STEP 2 — Get Your Supabase Keys

1. In Supabase, go to **Settings** (gear icon, bottom left)
2. Click **API**
3. Copy:
   - **Project URL** → looks like `https://abcdefghijkl.supabase.co`
   - **anon public** key → long string starting with `eyJ...`

---

### STEP 3 — Deploy to Vercel

1. Go to **[github.com](https://github.com)** and create a free account if you don't have one
2. Create a **New Repository** called `ethan-baib-os`
3. Upload all the files from this folder to the repo (drag and drop the whole folder)
4. Go to **[vercel.com](https://vercel.com)** and sign up with your GitHub account
5. Click **Add New Project**
6. Select your `ethan-baib-os` repository
7. Before clicking Deploy, click **Environment Variables** and add:
   - `REACT_APP_SUPABASE_URL` = your Project URL from Step 2
   - `REACT_APP_SUPABASE_ANON_KEY` = your anon key from Step 2
8. Click **Deploy**
9. Wait ~2 minutes — Vercel will give you a URL like `ethan-baib-os.vercel.app`

**That's it! Your app is live. 🎉**

---

### STEP 4 — Optional: Custom Domain

1. In Vercel, go to your project → **Settings → Domains**
2. Add your custom domain (e.g. `ethanbaib.com`)
3. Follow Vercel's DNS instructions for your domain registrar

---

## 📱 FEATURES

| Section | What it does |
|---|---|
| 🏠 Dashboard | Overview of all your stats, tasks, gigs, and releases |
| ✦ Vision & Goals | Artist statement, goal tracking with progress bars |
| 🎵 Music Catalog | Full discography database with BPM, key, ISRC, streams |
| ◉ Release Planner | Release pipeline + pre-release checklist template |
| ⚡ Gig Tracker | All performances with pay, status, soundcheck details |
| ◈ Social & Content | Platform hub with handles + content strategy |
| ▲ Analytics | Monthly stats log with visual growth bars |
| ✉ Press Kit (EPK) | Bio, press contacts, mentions, 4 pitch templates |
| 💰 Finances | Income + expense log with P&L summary |
| ◌ Contacts | Full network CRM with roles and follow-up status |
| ☐ Task Manager | Full task database with categories, priorities, statuses |
| ◐ Brand & Visuals | Brand identity + asset checklist |
| ⚙ Tools & Links | Curated resource directory (30+ tools) |

---

## 🛠 LOCAL DEVELOPMENT

If you want to run it locally first:

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Edit .env and add your Supabase keys

# 3. Start the app
npm start
# Opens at http://localhost:3000
```

---

## 📂 FILE STRUCTURE

```
ethan-baib-os/
├── public/
│   └── index.html
├── src/
│   ├── App.js          ← Main layout + navigation
│   ├── App.css         ← All global styles
│   ├── index.js        ← React entry point
│   ├── lib/
│   │   └── supabase.js ← Database client + all queries
│   └── pages/
│       ├── Dashboard.js
│       ├── Tasks.js
│       ├── Gigs.js
│       ├── Releases.js
│       ├── Catalog.js
│       ├── Finances.js
│       ├── Contacts.js
│       ├── Analytics.js
│       └── OtherPages.js (Vision, Social, EPK, Brand, Tools)
├── supabase-schema.sql ← Run this in Supabase SQL Editor
├── vercel.json         ← Vercel deployment config
├── .env.example        ← Template for your env variables
└── package.json
```

---

## 💡 TIPS

- **Data saves to Supabase** — accessible from any device, any browser
- **Some sections save locally** (brainstorm pad, brand identity, EPK text, platform handles) — these use browser localStorage and are device-specific
- **To update** — push changes to GitHub and Vercel auto-deploys
- **To back up data** — in Supabase, go to Settings → Backups

---

Built with React + Supabase + Vercel 🖤
