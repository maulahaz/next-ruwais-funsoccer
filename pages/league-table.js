import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function LeagueTable() {
  const [leagueData, setLeagueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await fetch('/api/league-table');
        const data = await response.json();
        setLeagueData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch league data:', error);
        setIsLoading(false);
      }
    };

    fetchLeagueData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - League Table`}</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">League Table</h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Team</th>
                <th className="px-4 py-2">Played</th>
                <th className="px-4 py-2">Won</th>
                <th className="px-4 py-2">Drawn</th>
                <th className="px-4 py-2">Lost</th>
                <th className="px-4 py-2">GF</th>
                <th className="px-4 py-2">GD</th>
                <th className="px-4 py-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {leagueData.map((team, index) => (
                <tr key={team.id} className={index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{team.name}</td>
                  <td className="px-4 py-2 text-center">{team.matches_played}</td>
                  <td className="px-4 py-2 text-center">{team.wins}</td>
                  <td className="px-4 py-2 text-center">{team.draws}</td>
                  <td className="px-4 py-2 text-center">{team.losses}</td>
                  <td className="px-4 py-2 text-center">{team.goals_for}</td>
                  <td className="px-4 py-2 text-center">{team.goals_difference}</td>
                  <td className="px-4 py-2 text-center font-bold">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}