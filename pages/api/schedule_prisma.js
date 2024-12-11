import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const schedule = await prisma.match.findMany({
        select: {
          id: true,
          match_datetime: true,
          home_team: true,
          away_team: true,
          stage_name: true,
          status: true,
          venue: true,
          home_team_goals: true,
          away_team_goals: true,
        },
        orderBy: {
          datetime: 'asc',
        },
      });

      res.status(200).json(schedule);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch schedule data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}