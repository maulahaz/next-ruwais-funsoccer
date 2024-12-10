//-- pages/api/teams/index.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//-- GET all Teams
const getTeams = async (req, res) => {
  const teams = await prisma.team.findMany();
  res.status(200).json(teams);
};

//-- CREATE a new Team
const createTeam = async (req, res) => {
  const { name, team_code, captain, description } = req.body;
  const newTeam = await prisma.team.create({
    data: {
      name,
      team_code,
      captain,
      description
    },
  });
  res.status(201).json(newTeam);
};

//--Main API handler
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getTeams(req, res);
  } else if (req.method === 'POST') {
    return createTeam(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}