import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function MatchStatistic() {
  const [matchStatistics, setMatchStatistics] = useState([]);
  const [topPlayer, setTopPlayer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatchStatistics = async () => {
      try {
        const response = await fetch("/api/records");
        const data = await response.json();
        // console.log("Match Record :", data);
        setMatchStatistics(data["match-stat"]);
        setTopPlayer(data["top-player"]);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch Match Statistic:", error);
        setIsLoading(false);
      }
    };

    fetchMatchStatistics();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p>Loading the data...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - Match Statistics`}</title>
      </Head>
      {/* Top Scorer */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Top Scorer</h1>
        {/* <div className="overflow-x-auto"> */}
        <div className="flex items-center justify-center">
          {/* <table> */}
          <table className="table-fixed">
            <thead>
              <tr className="bg-gray-800 text-yellow-200">
                <th className="w-20 px-2">No.</th>
                <th className="w-80 px-2">Player Name</th>
                <th className="w-30 px-2">Total Goals</th>
              </tr>
            </thead>
            <tbody>
              {topPlayer.map((dtTopPlayer, index) => (
                <tr
                  key={index + 1}
                  className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{dtTopPlayer.name}</td>
                  <td className="text-center">{dtTopPlayer.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* match Statistic */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Match Statistics
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-yellow-200">
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Team</th>
                <th className="px-4 py-2">Total Fouls</th>
                <th className="px-4 py-2">Total Yellow Cards</th>
                <th className="px-4 py-2">Total Red Cards</th>
                <th className="px-4 py-2">Total Own Goals</th>
                <th className="px-4 py-2">Total Penalties</th>
              </tr>
            </thead>
            <tbody>
              {matchStatistics.map((match, index) => (
                <tr
                  key={index + 1}
                  className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{match.team_alias}</td>
                  <td className="px-4 py-2 text-center">{match.total_fouls}</td>
                  <td className="px-4 py-2 text-center">
                    {match.total_yellow_cards}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {match.total_red_cards}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {match.total_own_goals}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {match.total_penalties}
                  </td>
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
