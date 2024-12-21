import { supabase } from "../../../lib/supabase";

//-- GET Players
const getPlayers = async (req, res) => {
  const { data: dtPlayer, error: error }= await supabase.from("players").select("*");
  if (!dtPlayer) {
    return res.status(404).json({ error: "Player not found" });
  }

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json(dtPlayer);
};

//-- CREATE a Player
const createPlayer = async (req, res) => {
  const { data, error } = await supabase.from("players").insert([req.body]);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json(data);
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getPlayers(req, res);
  } else if (req.method === "POST") {
    return createPlayer(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
