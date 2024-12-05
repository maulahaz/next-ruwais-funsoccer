//-- pages/api/matches/[id].js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//-- GET a single Match
const getMatch = async (req, res) => {
  const { id } = req.query;
  const match = await prisma.match.findUnique({
    where: { id: Number(id) },
  });
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }
  res.status(200).json(match);
};

//-- UPDATE a Match
const updateMatch = async (req, res) => {
  const { id } = req.query;
  const {
    venue,
    location,
    status,
    stage_name,
    datetime,
    home_team,
    away_team,
    home_team_goals,
    away_team_goals,
    winner,
    winner_id,
  } = req.body;
  const updatedMatch = await prisma.match.update({
    where: { id: Number(id) },
    data: {
      venue,
      location,
      status,
      stage_name,
      datetime,
      home_team,
      away_team,
      home_team_goals,
      away_team_goals,
      winner,
      winner_id,
    },
  });
  res.status(200).json(updatedMatch);
};

//-- DELETE a Match
const deleteMatch = async (req, res) => {
  const { id } = req.query;
  await prisma.match.delete({
    where: { id: Number(id) },
  });
  res.status(204).end();
};

//-- Main API handler
export default async function handler(req, res) {
  if (req.method === "GET") {
    return getMatch(req, res);
  } else if (req.method === "PUT") {
    return updateMatch(req, res);
  } else if (req.method === "DELETE") {
    return deleteMatch(req, res);
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}