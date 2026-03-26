// ============================================================
// NEXTERRA — SUPABASE CONNECTION & FEATURE MODULES
// Project URL: https://ymobaxfurtumdscwcxia.supabase.co
// 
// HOW TO USE:
//   1. Copy this file into your project as: src/supabase.js
//   2. Replace YOUR_ANON_KEY_HERE with your actual anon key
//      (find it in Supabase → Project Settings → API)
//   3. Import any function you need, e.g.:
//      import { castVote, getProposals } from './supabase.js'
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ── CLIENT SETUP ────────────────────────────────────────────
const SUPABASE_URL = 'https://ymobaxfurtumdscwcxia.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltb2JheGZ1cnR1bWRzY3djeGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2Mzk3NjgsImV4cCI6MjA4OTIxNTc2OH0.esw9d9RfzR_YjuOiwPhs0jTXT_c7IvlJ32IlpSAJf08'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


// ============================================================
// AUTH — Login, Signup, Logout, Current User
// ============================================================

/** Sign up a new user */
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  })
  if (error) throw error
  return data
}

/** Log in an existing user */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/** Log out */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/** Get the currently logged-in user (null if not logged in) */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/** Listen for login/logout changes */
export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}


// ============================================================
// PROFILES — User profile read/update
// ============================================================

/** Get any user's profile by their user ID */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

/** Update the logged-in user's profile */
export async function updateProfile(updates) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Upload a profile avatar image */
export async function uploadAvatar(file) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const ext = file.name.split('.').pop()
  const path = `${user.id}/avatar.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  await updateProfile({ avatar_url: data.publicUrl })
  return data.publicUrl
}


// ============================================================
// PROPOSALS & ASKS — Read, create, filter
// ============================================================

/** Get all proposals/asks (optionally filter by type, focus_area, status) */
export async function getProposals({ type, focusArea, status } = {}) {
  let query = supabase
    .from('proposals')
    .select(`
      *,
      profiles ( full_name, institution, credibility_score, avatar_url )
    `)
    .order('created_at', { ascending: false })

  if (type) query = query.eq('type', type)
  if (focusArea) query = query.eq('focus_area', focusArea)
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) throw error
  return data
}

/** Get a single proposal by ID */
export async function getProposal(proposalId) {
  const { data, error } = await supabase
    .from('proposals')
    .select(`*, profiles ( full_name, institution, credibility_score, avatar_url )`)
    .eq('id', proposalId)
    .single()
  if (error) throw error
  return data
}

/** Submit a new proposal or ask */
export async function submitProposal({ type, title, description, countries, focusArea, fundingGoal, daoId, deadline }) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase
    .from('proposals')
    .insert({
      type,
      title,
      description,
      countries,
      focus_area: focusArea,
      funding_goal: fundingGoal,
      dao_id: daoId,
      deadline,
      author_id: user.id
    })
    .select()
    .single()
  if (error) throw error
  return data
}


// ============================================================
// VOTING — Cast votes, check if already voted
// ============================================================

/** Cast a vote on a proposal ('for' or 'against') */
export async function castVote(proposalId, vote) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Please log in to vote')

  const { error } = await supabase
    .from('votes')
    .insert({ proposal_id: proposalId, user_id: user.id, vote })

  if (error?.code === '23505') throw new Error('You have already voted on this proposal')
  if (error) throw error
  return true
}

/** Check if the current user has already voted on a proposal */
export async function getUserVote(proposalId) {
  const user = await getCurrentUser()
  if (!user) return null
  const { data } = await supabase
    .from('votes')
    .select('vote')
    .eq('proposal_id', proposalId)
    .eq('user_id', user.id)
    .single()
  return data?.vote ?? null
}

/** Subscribe to live vote count changes on a proposal */
export function subscribeToVotes(proposalId, callback) {
  return supabase
    .channel(`votes-${proposalId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'votes',
      filter: `proposal_id=eq.${proposalId}`
    }, () => {
      getProposal(proposalId).then(callback)
    })
    .subscribe()
}


// ============================================================
// FUNDING — Fund a proposal, get transactions
// ============================================================

/** Record a funding transaction */
export async function fundProposal({ proposalId, amount, currency = 'USD', paymentMethod, externalRef }) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      proposal_id: proposalId,
      type: 'fund',
      amount,
      currency,
      payment_method: paymentMethod,
      external_ref: externalRef,
      status: 'pending'
    })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Get the current user's transaction history */
export async function getMyTransactions() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase
    .from('transactions')
    .select(`*, proposals ( title )`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}


// ============================================================
// DAOs — Read DAOs, members, treasury
// ============================================================

/** Get all DAOs */
export async function getDAOs(status) {
  let query = supabase
    .from('daos')
    .select(`*, profiles ( full_name, avatar_url )`)
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data
}

/** Get a single DAO with its members */
export async function getDAO(daoId) {
  const { data, error } = await supabase
    .from('daos')
    .select(`
      *,
      profiles ( full_name, avatar_url ),
      dao_members ( user_id, role, profiles ( full_name, avatar_url, credibility_score ) )
    `)
    .eq('id', daoId)
    .single()
  if (error) throw error
  return data
}

/** Join a DAO */
export async function joinDAO(daoId) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const { error } = await supabase
    .from('dao_members')
    .insert({ dao_id: daoId, user_id: user.id })
  if (error?.code === '23505') throw new Error('Already a member of this DAO')
  if (error) throw error
  return true
}


// ============================================================
// COMMUNITY — Posts, comments, likes
// ============================================================

/** Get community feed posts */
export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles ( full_name, role, institution, avatar_url, credibility_score ),
      comments (
        id, content, created_at,
        profiles ( full_name, avatar_url )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data
}

/** Create a new community post */
export async function createPost(content) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase
    .from('posts')
    .insert({ content, author_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Add a comment to a post */
export async function addComment(postId, content) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, content, author_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Like a post */
export async function likePost(postId) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')
  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: user.id })
  if (error?.code === '23505') throw new Error('Already liked')
  if (error) throw error
  return true
}

/** Subscribe to new community posts in real time */
export function subscribeToPosts(callback) {
  return supabase
    .channel('posts-feed')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' },
      payload => callback(payload.new)
    )
    .subscribe()
}


// ============================================================
// INTELLIGENCE — Alerts, patterns, risk signals
// ============================================================

/** Get all intelligence patterns/alerts */
export async function getIntelligence({ type, severity } = {}) {
  let query = supabase
    .from('intelligence_patterns')
    .select('*')
    .order('created_at', { ascending: false })
  if (type) query = query.eq('type', type)
  if (severity) query = query.eq('severity', severity)
  const { data, error } = await query
  if (error) throw error
  return data
}

/** Subscribe to new critical alerts in real time */
export function subscribeToAlerts(callback) {
  return supabase
    .channel('intelligence-alerts')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'intelligence_patterns',
      filter: `severity=eq.critical`
    }, payload => callback(payload.new))
    .subscribe()
}


// ============================================================
// FUNDING CALLS — RFPs, grants, tenders
// ============================================================

/** Get open funding calls */
export async function getFundingCalls() {
  const { data, error } = await supabase
    .from('funding_calls')
    .select('*')
    .order('deadline', { ascending: true })
  if (error) throw error
  return data
}


// ============================================================
// REALTIME HELPERS — Unsubscribe from a channel
// ============================================================

/** Unsubscribe from any realtime channel when leaving a page */
export function unsubscribe(channel) {
  if (channel) supabase.removeChannel(channel)
}
