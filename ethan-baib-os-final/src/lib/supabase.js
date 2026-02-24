import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://srojhgnwzzkhlobnvsfu.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyb2poZ253enpraGxvYm52c2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTQ2MzgsImV4cCI6MjA4NzUzMDYzOH0.WUXnz2ErPRwRsEkLSD87Y81j956K8qKUpm7Ha_nNEEk'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── DB HELPERS ────────────────────────────────────────────────────────────

// TASKS
export const getTasks = () => supabase.from('tasks').select('*').order('created_at', { ascending: false })
export const addTask = (task) => supabase.from('tasks').insert([task]).select()
export const updateTask = (id, updates) => supabase.from('tasks').update(updates).eq('id', id).select()
export const deleteTask = (id) => supabase.from('tasks').delete().eq('id', id)

// GIGS
export const getGigs = () => supabase.from('gigs').select('*').order('date', { ascending: true })
export const addGig = (gig) => supabase.from('gigs').insert([gig]).select()
export const updateGig = (id, updates) => supabase.from('gigs').update(updates).eq('id', id).select()
export const deleteGig = (id) => supabase.from('gigs').delete().eq('id', id)

// RELEASES
export const getReleases = () => supabase.from('releases').select('*').order('created_at', { ascending: false })
export const addRelease = (release) => supabase.from('releases').insert([release]).select()
export const updateRelease = (id, updates) => supabase.from('releases').update(updates).eq('id', id).select()
export const deleteRelease = (id) => supabase.from('releases').delete().eq('id', id)

// CATALOG
export const getCatalog = () => supabase.from('catalog').select('*').order('created_at', { ascending: false })
export const addTrack = (track) => supabase.from('catalog').insert([track]).select()
export const updateTrack = (id, updates) => supabase.from('catalog').update(updates).eq('id', id).select()
export const deleteTrack = (id) => supabase.from('catalog').delete().eq('id', id)

// CONTACTS
export const getContacts = () => supabase.from('contacts').select('*').order('name', { ascending: true })
export const addContact = (contact) => supabase.from('contacts').insert([contact]).select()
export const updateContact = (id, updates) => supabase.from('contacts').update(updates).eq('id', id).select()
export const deleteContact = (id) => supabase.from('contacts').delete().eq('id', id)

// FINANCES
export const getIncomes = () => supabase.from('income').select('*').order('date', { ascending: false })
export const addIncome = (item) => supabase.from('income').insert([item]).select()
export const deleteIncome = (id) => supabase.from('income').delete().eq('id', id)

export const getExpenses = () => supabase.from('expenses').select('*').order('date', { ascending: false })
export const addExpense = (item) => supabase.from('expenses').insert([item]).select()
export const deleteExpense = (id) => supabase.from('expenses').delete().eq('id', id)

// ANALYTICS
export const getAnalytics = () => supabase.from('analytics').select('*').order('month', { ascending: false })
export const addAnalytics = (row) => supabase.from('analytics').insert([row]).select()
export const updateAnalytics = (id, updates) => supabase.from('analytics').update(updates).eq('id', id).select()

// GOALS
export const getGoals = () => supabase.from('goals').select('*').order('created_at', { ascending: true })
export const addGoal = (goal) => supabase.from('goals').insert([goal]).select()
export const updateGoal = (id, updates) => supabase.from('goals').update(updates).eq('id', id).select()
export const deleteGoal = (id) => supabase.from('goals').delete().eq('id', id)

// CONTENT POSTS
export const getPosts = () => supabase.from('content_posts').select('*').order('post_date', { ascending: true })
export const addPost = (post) => supabase.from('content_posts').insert([post]).select()
export const updatePost = (id, updates) => supabase.from('content_posts').update(updates).eq('id', id).select()
export const deletePost = (id) => supabase.from('content_posts').delete().eq('id', id)

// NOTES (brainstorm/vision)
export const getNotes = () => supabase.from('notes').select('*')
export const upsertNote = (key, content) => supabase.from('notes').upsert([{ key, content }], { onConflict: 'key' })
