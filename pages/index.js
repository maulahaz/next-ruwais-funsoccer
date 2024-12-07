import useWorldcupJson from "../hooks/useWorldcupJson";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { useState, useEffect } from "react";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(utc);
dayjs.extend(timezone);

const getDay = (datetime) => {
  return dayjs(datetime).isToday()
    ? "Today"
    : "" + dayjs(datetime).isTomorrow()
    ? "Tomorrow"
    : "";
};

export default function Home() {
  // const [currentMatch, nextMatch, completedMatch, hasLiveMatch, error] = useWorldcupJson();
  const [maxCompletedMatch, setMaxCompletedMatch] = useState(4);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  // const prefixImgUrl = "https://api.fifa.com/api/v3/picture/flags-sq-3/";
  const baseUrl = "localhost:3000/";
  const prefixImgUrl = baseUrl + "public/flags/";

  //--Latest Match can be Live match if any, or Latest from the Completed matches
  const latestMatch =
    matches.find((match) => match.status === "live") ||
    matches
      .filter((match) => match.status === "completed")
      .sort(
        (a, b) => dayjs(b.datetime).valueOf() - dayjs(a.datetime).valueOf()
      )[0];

  const fetchTeams = async () => {
    const res = await fetch("/api/teams");
    const dataTeams = await res.json();
    // console.log("Teams :", dataTeams);
    setTeams(dataTeams);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchMatches = async () => {
    const res = await fetch("/api/matches");
    const dataMatches = await res.json();
    console.log("Matches :", dataMatches);
    console.log(
      "Matches data structure:",
      JSON.stringify(dataMatches[0], null, 2)
    );
    setMatches(dataMatches);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // if (error) {
  //   return (
  //     <div className="bg-black h-screen w-screen flex items-center justify-center">
  //       <p>Failed loading the data.</p>
  //     </div>
  //   );
  // }

  // if (!currentMatch) {
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
        <h1 className="text-6xl font-bold tracking-wide">
          Ruwais Gibol
        </h1>
        <p className="text-xl">
          Ruwais Fun Football Winter 2024
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <button className="text-sm px-6 py-2 border rounded-full hover:bg-blue-700 transition duration-300">Schedule </button>
          <button className="text-sm px-6 py-2 border rounded-full hover:bg-blue-700 transition duration-300">Table </button>
          <button className="text-sm px-6 py-2 border rounded-full hover:bg-blue-700 transition duration-300">Top Scorer </button>
          
        </div>
      </div>


      {latestMatch ? (
        <div className="flex justify-center w-full">
          <div className="max-w-[550px] w-full border border-dashed rounded-lg p-6">
            <h2 className="text-2xl pb-4">{latestMatch.status === "live" ? "Live match" : "Latest match"}</h2>
            <div className="flex justify-between text-sm text-gray-400 -mt-2 mb-2">
              <p className="inline-block">{dayjs(latestMatch.datetime).utc().format("DD-MMM-YY")}.</p>
              <p className="inline-block">Venue: {latestMatch.venue}.</p>
              <p className="inline-block">
                Attendance: {latestMatch.attendance + " person" || "TBA"}
              </p>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="text-center space-y-4">
                <img src={`/flags/${latestMatch.home_team}.png`} className="w-28 object-cover" />
                <h3 className="text-lg">{latestMatch.home_team} </h3>
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
                  {latestMatch.status !== "completed"
                    ? "Live"
                    : `${latestMatch.winner} ${
                        latestMatch.winner !== "Draw" ? "Wins" : ""
                      }`}
                </div>
              </div>
              <div className="text-center space-y-4">
                <img src={`/flags/${latestMatch.away_team}.png`} className="w-28 object-cover" />
                <h3 className="text-lg">{latestMatch.away_team}</h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <div className="max-w-[550px] w-full border border-dashed rounded-lg p-6">
            <h2 className="text-2xl pb-4">No Live Matches</h2>
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="max-w-[550px] mx-auto w-full">
          <h2 className="text-3xl">Future Match</h2>
          <div className="py-4">
            <ul className="space-y-4">
              {matches
                .filter((item) => item.status === "future")
                .sort(
                  (a, b) =>
                    dayjs(a.datetime).valueOf() - dayjs(b.datetime).valueOf()
                )
                .slice(0, 4)
                .map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="w-4">
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      <div className="h-full px-1 pb-3 pt-1">
                        <span className="block w-[4px] opacity-50 bg-amber-50 h-full"></span>
                      </div>
                    </div>
                    <div>
                      <p className="text-amber-400 text-sm">
                        {dayjs(item.datetime).utc().format("DD-MMM-YY HH:mm")}
                      </p>
                      <div className="py-2">
                        <h3 className="font-light text-xl">
                          {item.home_team} vs {item.away_team}
                        </h3>
                        <p className="opacity-75">
                          Coming up {dayjs(item.datetime).fromNow()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-[550px] mx-auto w-full">
          <h2 className="text-3xl">Completed Match</h2>
          <div className="py-4">
            <ul className="space-y-4">
              {matches
                .filter((item) => item.status === "completed")
                .reverse()
                .slice(0, maxCompletedMatch)
                .map((item, index) => {
                  console.log("Match item:", item);
                  return (
                    <li key={item.id} className="flex gap-4">
                      <div className="w-4">
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        {index !== maxCompletedMatch - 1 && (
                          <div className="h-full px-1 pb-3 pt-1">
                            <span className="block w-[4px] opacity-50 bg-amber-50 h-full"></span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-amber-400 text-sm">
                          {dayjs(item.datetime).utc().format("DD-MMM-YY HH:mm")}
                        </p>
                        <div className="py-2">
                          <h3 className="font-light text-xl space-x-2">
                            <span>
                              {item.home_team} -vs- {item.away_team},{" "}
                            </span>
                            <span className="font-bold text-amber-400">
                              {item.home_team.goals ?? 0} :{" "}
                              {item.away_team.goals ?? 0}
                            </span>
                          </h3>
                          <p>
                            Result: {item.winner}{" "}
                            {item.winner !== "Draw" && "Wins"}
                          </p>
                          <p className="opacity-75">
                            {dayjs(item.datetime).fromNow()}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
            {maxCompletedMatch == 4 ? (
              <div className="w-full flex justify-center p-2">
                <button
                  onClick={() => setMaxCompletedMatch(matches.length)}
                  className="text-sm px-6 py-2 border rounded-full"
                >
                  Show more
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center p-2">
                <button
                  onClick={() => setMaxCompletedMatch(4)}
                  className="text-sm px-6 py-2 border rounded-full"
                >
                  Show less
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
