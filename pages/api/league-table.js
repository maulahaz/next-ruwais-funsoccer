import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const teams = await prisma.team.findMany({
        select: {
          id: true,
          name: true,
          team_code: true,
          goals: true,
          penalties: true,
        },
        orderBy: [
          { goals: 'desc' },
          { penalties: 'desc' },
        ],
      });

      const matches = await prisma.match.findMany({
        where: {
          status: 'completed',
        },
        select: {
          home_team: true,
          away_team: true,
          home_team_goals: true,
          away_team_goals: true,
          winner: true,
        },
      });

      const leagueTable = teams.map(team => {
        const teamMatches = matches.filter(match => 
          match.home_team === team.team_code || match.away_team === team.team_code
        );

        const wins = teamMatches.filter(match => match.winner === team.team_code).length;
        const losses = teamMatches.filter(match => 
          match.winner && match.winner !== team.team_code
        ).length;
        const draws = teamMatches.filter(match => !match.winner).length;

        const points = wins * 3 + draws;

        return {
          ...team,
          matches_played: teamMatches.length,
          wins,
          draws,
          losses,
          points,
        };
      });

      leagueTable.sort((a, b) => b.points - a.points || b.goals - a.goals);

      res.status(200).json(leagueTable);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch league table data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}