import { supabase } from "../../../lib/supabase";

//-- GET Player by id
const getPlayer = async (req, res) => {
  const { id } = req.query;
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Player not found" });
  return res.status(200).json(data);
};

//-- UPDATE Player
const updatePlayer = async (req, res) => {
  try {
    const idx = req.query;
    const id = parseInt(idx.id);
    const updatedData = req.body;

    const { data, error } = await supabase
      .from("players")
      .update({ address: updatedData.address, phone: updatedData.phone })
      .eq("id", id)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: "Update Success" });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      message: error.message || "An error occurred while updating the player",
    });
  }
};

//-- DELETE Player
const deletePlayer = async (req, res) => {
  const { id } = req.query;
  const { error } = await supabase.from("players").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).end();
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getPlayer(req, res);
  } else if (req.method === "PUT") {
    return updatePlayer(req, res);
  } else if (req.method === "DELETE") {
    return deletePlayer(req, res);
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
