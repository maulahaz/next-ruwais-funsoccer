import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      //--Fetch Data for Top 10 Players with Most Goals:
      const { data: topPlayers, error: topPlayersError } = await supabase.rpc(
        "top_scorer",
        { limit_num: 5 }
      );
      if (topPlayersError) throw topPlayersError;

      //--Make Function to Get Match Statistic:
      const { data: matchStatistics, error: matchStaticsError } =
        await supabase.rpc("get_team_stat");
      if (matchStaticsError) throw matchStaticsError;

      res
        .status(200)
        .json({ "top-player": topPlayers, "match-stat": matchStatistics });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch data. Error: " + error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
