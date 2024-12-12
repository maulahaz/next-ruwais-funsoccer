import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function MatchStatistic() {
  const [matchStatistics, setMatchStatistics] = useState([]);
  const [topPlayer, setTopPlayer] = useState([]);
  const [leagueData, setLeagueData] = useState([]);
  const [isLoadingMatchStatistics, setIsLoadingMatchStatistics] = useState(true);
  const [isLoadingLeagueData, setIsLoadingLeagueData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeagueData = async () => {
    try {
      const response = await fetch("/api/league-table");
      const data = await response.json();
        // console.log("League Matches :", data);
      //   console.log(
      //     "All Matches data structure:",
      //     JSON.stringify(data[0], null, 2)
      //   );
      setLeagueData(data);
      setIsLoadingLeagueData(false);
    } catch (error) {
      console.error("Failed to fetch league data:", error);
      setIsLoadingLeagueData(false);
    }
  };

  const fetchMatchStatistics = async () => {
    try {
      const response = await fetch("/api/records");
      const data = await response.json();
      // console.log("Match Record :", data);
      setMatchStatistics(data["match-stat"]);
      setTopPlayer(data["top-player"]);
      setIsLoadingMatchStatistics(false);
    } catch (error) {
      console.error("Failed to fetch Match Statistic:", error);
      setIsLoadingMatchStatistics(false);
    }
  };

  useEffect(() => {
    fetchLeagueData();
    fetchMatchStatistics();
  }, []);

  if (isLoadingMatchStatistics) {
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
      {/* Table */}
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Match Table</h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-yellow-200">
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Team</th>
                <th className="px-4 py-2">Played</th>
                <th className="px-4 py-2">Won</th>
                <th className="px-4 py-2">Drawn</th>
                <th className="px-4 py-2">Lost</th>
                <th className="px-4 py-2">GF</th>
                <th className="px-4 py-2">GA</th>
                <th className="px-4 py-2">GD</th>
                <th className="px-4 py-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {leagueData.map((team, index) => (
                <tr
                  key={team.id}
                  className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{team.team_alias}</td>
                  <td className="px-4 py-2 text-center">
                    {team.matches_played}
                  </td>
                  <td className="px-4 py-2 text-center">{team.wins}</td>
                  <td className="px-4 py-2 text-center">{team.draws}</td>
                  <td className="px-4 py-2 text-center">{team.losses}</td>
                  <td className="px-4 py-2 text-center">{team.goals_for}</td>
                  <td className="px-4 py-2 text-center">
                    {team.goals_against}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {team.goal_difference}
                  </td>
                  <td className="px-4 py-2 text-center font-bold">
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <th className="text-left w-40 px-2">Player Name</th>
                <th className="text-left w-40 px-2">Team</th>
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
                  <td className="text-left">{dtTopPlayer.name}</td>
                  <td className="text-left">{dtTopPlayer.team}</td>
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
          <Link href="/">
            <button className="text-sm px-6 py-2 border rounded-full hover:bg-orange-200 hover:text-black transition duration-300">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
