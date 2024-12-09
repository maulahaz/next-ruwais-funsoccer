import { supabase } from './supabase'

// Teams
export const getTeams = async () => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
  if (error) throw error
  return data
}

export const createTeam = async (team) => {
  const { data, error } = await supabase
    .from('teams')
    .insert(team)
  if (error) throw error
  return data
}

// Matches
export const getMatches = async () => {
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:home_team_id(name), away_team:away_team_id(name)')
  if (error) throw error
  return data
}

export const createMatch = async (match) => {
  const { data, error } = await supabase
    .from('matches')
    .insert(match)
  if (error) throw error
  return data
}

// Players
export const getPlayers = async () => {
  const { data, error } = await supabase
    .from('players')
    .select('*, team:team_id(name), match:match_id(*)')
  if (error) throw error
  return data
}

export const createPlayer = async (player) => {
  const { data, error } = await supabase
    .from('players')
    .insert(player)
  if (error) throw error
  return data
}