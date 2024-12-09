import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabase";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(utc);

const getDay = (datetime) => {
  return dayjs(datetime).isToday()
    ? "Today"
    : "" + dayjs(datetime).isTomorrow()
    ? "Tomorrow"
    : "";
};

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const prefixImgUrl = process.env.BASE_URL + "public/flags/";

  const fetchTeams = async () => {
    const { data, error } = await supabase.from("teams").select("*");

    if (error) console.error("Error fetching teams:", error);
    else {
      // console.log("Teams :", data);
      // console.log("Teams data structure:", JSON.stringify(data[0], null, 2));
      setTeams(data);
    }
    setIsLoading(false);
  };

  const fetchMatches = async () => {
    const data = await fetch("/api/matches");
    const dataJson = await data.json();
    console.log("BaseURL :", process.env.NEXT_PUBLIC_BASE_URL);
    // console.log("All Matches :", dataJson);
    // console.log(
    //   "All Matches data structure:",
    //   JSON.stringify(dataJson[0], null, 2)
    // );
    setMatches(dataJson);
    setIsLoading(false);
  };

  //--Latest Match can be Live match if any, or Latest from the Completed matches
  const latestMatch =
    matches.find((match) => match.status === "Live") ||
    matches
      .filter((match) => match.status === "Completed")
      .sort(
        (a, b) =>
          dayjs(b.match_datetime).valueOf() - dayjs(a.match_datetime).valueOf()
      )[0];

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  if (!matches.length) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p>Loading the data...</p>
      </div>
    );
  }

  return (
    <div className="bg-black w-full min-h-screen h-full px-6">
      <div className="text-center p-8 space-y-4">
        <h1 className="text-6xl font-bold tracking-wide">Ruwais Gibol</h1>
        <p className="text-xl">Ruwais Fun Football Winter 2024</p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link href="/schedule">
            <button className="text-sm px-6 py-2 border rounded-full hover:bg-blue-700 transition duration-300">
              Schedule
            </button>
          </Link>
          <Link href="/league-table">
            <button className="text-sm px-6 py-2 border rounded-full hover:bg-blue-700 transition duration-300">
              Table
            </button>
          </Link>
          <button className="text-sm px-6 py-2 border rounded-full hover:bg-blue-700 transition duration-300">
            Top Scorer
          </button>
        </div>
      </div>

      {latestMatch ? (
        <div className="flex justify-center w-full">
          <div className="max-w-[550px] w-full border border-dashed rounded-lg p-6">
            <h2 className="text-2xl pb-4">
              {latestMatch.status === "Live" ? "Live match" : "Latest match"}
            </h2>
            <div className="flex justify-between text-sm text-gray-400 -mt-2 mb-2">
              <p className="inline-block">
                {dayjs(latestMatch.match_datetime).utc().format("DD-MMM-YY")}
              </p>
              <p className="inline-block">Venue: {latestMatch.venue}.</p>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="text-center space-y-4">
                <Image
                  src={`/flags/${latestMatch.home_team.name}.png`}
                  width={100}
                  height={100}
                  className="w-28 object-cover"
                />
                {/* <img
                  src={`/flags/${latestMatch.home_team.name}.png`}
                  className="w-28 object-cover"
                /> */}
                <h3 className="text-lg">{latestMatch.home_team.name} </h3>
              </div>
              <div className="text-center">
                <h3 className="space-x-2 text-4xl font-bold">
                  <span>{latestMatch.home_team_goals ?? 0}</span>
                  <span>{" : "}</span>
                  <span>{latestMatch.away_team_goals ?? 0}</span>
                </h3>
                <div>
                  {/* {latestMatch.winner}{" "}
                  {latestMatch.winner !== "Draw" && "Wins"} */}
                  {latestMatch.status !== "Completed"
                    ? "Live"
                    : latestMatch.home_team_goals > latestMatch.away_team_goals
                    ? `${latestMatch.home_team.name} Wins`
                    : latestMatch.home_team_goals < latestMatch.away_team_goals
                    ? `${latestMatch.away_team.name} Wins`
                    : "Draw"}
                </div>
              </div>
              <div className="text-center space-y-4">
                <Image
                  src={`/flags/${latestMatch.away_team.name}.png`}
                  width={100}
                  height={100}
                  className="w-28 object-cover"
                />
                {/* <img
                  src={`/flags/${latestMatch.away_team.name}.png`}
                  className="w-28 object-cover"
                /> */}
                <h3 className="text-lg">{latestMatch.away_team.name}</h3>
              </div>
              {/* -- Add Link to All matches */}
            </div>
            <div className="mt-4 text-right">
              <Link href="/schedule">
                <a className="text-sm text-blue-400 hover:text-blue-300 transition duration-300">
                  All Matches
                </a>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <div className="max-w-[550px] w-full border border-dashed rounded-lg p-6">
            <h2 className="text-2xl pb-4">Match not available</h2>
          </div>
        </div>
      )}
      {/* Incoming Match */}
      {matches.filter((match) => match.status === "Future").length > 0 && (
        <div className="flex justify-center w-full mt-8">
          <div className="max-w-[550px] w-full border border rounded-lg p-6 bg-neutral-900">
            <h2 className="text-2xl pb-4">Upcoming Match</h2>
            {(() => {
              const nextMatch = matches
                .filter((match) => match.status === "Future")
                .sort(
                  (b, a) =>
                    dayjs(a.datetime).valueOf() - dayjs(b.datetime).valueOf()
                )[0];

              return (
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <p>
                      {dayjs(nextMatch.match_datetime)
                        .utc()
                        .format("DD-MMM-YY HH:mm")}
                    </p>
                    <p>Venue: {nextMatch.venue || "TBA"}</p>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="text-center space-y-4">
                      <img
                        src={
                          process.env.NEXT_PUBLIC_BASE_URL +
                          `flags/${nextMatch.home_team.name}.png`
                        }
                        className="w-28 object-cover"
                        alt={nextMatch.home_team}
                      />
                      <h3 className="text-lg">{nextMatch.home_team.name}</h3>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">VS</h3>
                      <p className="text-sm mt-2">
                        {dayjs(nextMatch.match_datetime).fromNow()}
                      </p>
                    </div>
                    <div className="text-center space-y-4">
                      <img
                        src={
                          process.env.NEXT_PUBLIC_BASE_URL +
                          `flags/${nextMatch.away_team.name}.png`
                        }
                        className="w-28 object-cover"
                        alt={nextMatch.away_team}
                      />
                      <h3 className="text-lg">{nextMatch.away_team.name}</h3>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
