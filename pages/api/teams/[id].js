//-- pages/api/teams/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//-- GET a single Team
const getTeam = async (req, res) => {
  const { id } = req.query;
  const team = await prisma.team.findUnique({
    where: { id: Number(id) },
  });
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  res.status(200).json(team);
};

//-- UPDATE a Team
const updateTeam = async (req, res) => {
  const { id } = req.query;
  const { name, team_code, captain, description } = req.body;
  const updatedTeam = await prisma.team.update({
    where: { id: Number(id) },
    data: { name, team_code, captain, description },
  });
  res.status(200).json(updatedTeam);
};

//-- DELETE a Team
const deleteTeam = async (req, res) => {
  const { id } = req.query;
  await prisma.team.delete({
    where: { id: Number(id) },
  });
  res.status(204).end();
};

//-- Main API handler
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getTeam(req, res);
  } else if (req.method === 'PUT') {
    return updateTeam(req, res);
  } else if (req.method === 'DELETE') {
    return deleteTeam(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}