import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function Schedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchScheduleData = async () => {
    const data = await fetch("/api/matches");
    const dataJson = await data.json();
    // console.log("All Matches :", dataJson);
    // console.log(
    //   "All Matches data structure:",
    //   JSON.stringify(dataJson[0], null, 2)
    // );
    setScheduleData(dataJson);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  // useEffect(() => {
  //   const fetchScheduleData = async () => {
  //     try {
  //       const response = await fetch("/api/schedule");
  //       const data = await response.json();
  //       setScheduleData(data);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Failed to fetch schedule data:", error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchScheduleData();
  // }, []);

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
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - Match Schedule`}</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Match Schedule</h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-yellow-200">
                <th className="px-4 py-2">Date & Time</th>
                <th className="px-4 py-2">Match</th>
                <th className="px-4 py-2">Stage</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Venue</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData
                .sort((b, a) =>
                  dayjs(a.match_datetime).diff(dayjs(b.match_datetime))
                )
                .map((match, index) => (
                  <tr
                    key={match.id}
                    className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                  >
                    <td className="px-4 py-2 text-center">
                      {dayjs(match.match_datetime).format("DD MMM YYYY HH:mm")}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {match.home_team.team_alias}{" "}
                      <span className="text-gray-400"> vs</span>{" "}
                      {match.away_team.team_alias}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {match.stage_name || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {match.status || "N/A"}
                    </td>
                    {match.status === "Completed" ? (
                      <td className="px-4 py-2 text-center">
                        {match.home_team_goals + " - " + match.away_team_goals}
                      </td>
                    ) : (
                      <td className="px-4 py-2 text-center">-</td>
                    )}

                    <td className="px-4 py-2 text-center">
                      {match.venue || "TBA"}
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
