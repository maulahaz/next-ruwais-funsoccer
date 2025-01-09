import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("matches").select(
        `id, match_datetime, stage_name, season, venue, home_team_id, away_team_id, home_team_goals, away_team_goals, status, 
          home_team_goals_by, away_team_goals_by,  
          home_team:home_team_id (name, team_alias),
          away_team:away_team_id (name, team_alias)`
      );
      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch matches. Error: " + error.message });
    }
  } else if (req.method === "POST") {
    const { data, error } = await supabase.from("matches").insert([req.body]);

    if (error) res.status(500).json({ error: error.message });
    else res.status(201).json(data);
  }
}
