import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      //--Fetch teams
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id, name, team_code, team_alias')

      if (teamsError) throw teamsError

      //--Fetch matches
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select(`home_team_id, away_team_id, home_team_goals, away_team_goals, status, home_team:home_team_id (name, team_alias),
        away_team:away_team_id (name, team_alias)`)
        .eq('status', 'Completed')

      if (matchesError) throw matchesError

      const leagueTable = teams.map(team => {
        const teamMatches = matches.filter(match => 
          match.home_team_id === team.id || match.away_team_id === team.id
        )

        const wins = teamMatches.filter(match => 
          (match.home_team_id === team.id && match.home_team_goals > match.away_team_goals) ||
          (match.away_team_id === team.id && match.away_team_goals > match.home_team_goals)
        ).length

        const draws = teamMatches.filter(match => 
          match.home_team_goals === match.away_team_goals
        ).length

        const losses = teamMatches.filter(match => 
          (match.home_team_id === team.id && match.home_team_goals < match.away_team_goals) ||
          (match.away_team_id === team.id && match.away_team_goals < match.home_team_goals)
        ).length

        const goalsFor = teamMatches.reduce((total, match) => 
          total + (match.home_team_id === team.id ? match.home_team_goals : match.away_team_goals), 0
        )

        const goalsAgainst = teamMatches.reduce((total, match) => 
          total + (match.home_team_id === team.id ? match.away_team_goals : match.home_team_goals), 0
        )

        return {
          ...team,
          matches_played: teamMatches.length,
          wins,
          draws,
          losses,
          goals_for: goalsFor,
          goals_against: goalsAgainst,
          goal_difference: goalsFor - goalsAgainst,
          points: wins * 3 + draws
        }
      })

      leagueTable.sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference)

      res.status(200).json(leagueTable)
    } catch (error) {
      console.error('Error fetching league table data:', error)
      res.status(500).json({ error: 'Failed to fetch league table data' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

