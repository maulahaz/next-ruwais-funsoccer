//-- pages/api/matches/index.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//-- GET all Matches
const getMatches = async (req, res) => {
  const matches = await prisma.match.findMany();
  res.status(200).json(matches);
};

//-- CREATE a new Match
const createMatch = async (req, res) => {
  const {
    venue,
    location,
    status,
    stage_name,
    datetime,
    home_team,
    away_team,
  } = req.body;
  const newMatch = await prisma.match.create({
    data: {
      venue,
      location,
      status,
      stage_name,
      datetime,
      home_team,
      away_team,
    },
  });
  res.status(201).json(newMatch);
};

//--Main API handler
export default async function handler(req, res) {
  if (req.method === "GET") {
    return getMatches(req, res);
  } else if (req.method === "POST") {
    return createMatch(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
// venue             String? //--[Ruwais-2, Ruwais-3]
//   location          String? //--[Abu Dhabi, Dubai]
//   status            String //--[completed, future, live]
//   stage_name        String?  //--[Final, Quarter, ...]
//   attendance        Int?
//   datetime          DateTime  //--[Match Date Time]
//   home_team         String? //--[Match-ID: 1, 2, 3,...]
//   home_team_goals   Int? //--[1, 2, 3,...]
//   away_team         String? //--[Match-ID: 1, 2, 3,...]
//   away_team_goals   Int? //--[1, 2, 3,...]
//   winner            String?  //--[MatchID: Match-A, Match-Gen]
//   winner_id         String?
