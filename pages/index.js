import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import Link from "next/link";
import { capitalize } from "../src/utils.ts";
import { FaBars, FaTimes } from "react-icons/fa";
// import { supabase } from "../lib/supabase";
import { goLogin } from "../lib/auth.js";

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
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchMatches();
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = () => {
    const loggedInData = localStorage.getItem("loggedInData");
    if (loggedInData) {
      setUser(JSON.parse(loggedInData));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const loggedinData = await goLogin(email, password, setError);
    // console.log("Data ", loggedinData);
    if (loggedinData) {
      if (loggedinData.auth_level >= 3) {
        router.push("/236/dashboard");
      }
      setUser(loggedinData);
      setIsLoginModalOpen(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInData");
    setUser(null);
    setIsMenuOpen(false);
  };

  const fetchMatches = async () => {
    const data = await fetch("/api/matches");
    const dataJson = await data.json();
    // console.log("All Matches :", dataJson);
    // console.log(
    //   "All Matches data structure:",
    //   JSON.stringify(dataJson[0], null, 2)
    // );
    setMatches(dataJson);
    setIsLoading(false);
  };

  //--Latest Match can be Live match if any (Status Future with Match Datetime -6hrs), or Latest from the Completed matches
  const latestMatch =
    matches.find((match) => match.status === "Live") ||
    matches
      .filter((match) => match.status === "Completed")
      .sort(
        (a, b) =>
          dayjs(b.match_datetime).valueOf() - dayjs(a.match_datetime).valueOf()
      )[0];
  // console.log("latestMatch is: ", latestMatch);

  //--Next Match is any match that DateTime > Now (Can be Next match status is Postpone, Reschedeuld, ..):
  const nextMatch = matches
    .filter(
      (match) =>
        match.status != "Completed" &&
        //--xx hours before datetime:
        // dayjs(match.match_datetime).isBefore(dayjs().add(3, 'hour'))
        //--After 24hrs after datetime:
        // dayjs(match.match_datetime).isAfter(dayjs().startOf("day"))
        //--xx hour after datetime:
        dayjs(match.match_datetime).isAfter(dayjs().add(12, "hour"))
    )
    .sort(
      (a, b) =>
        dayjs(a.match_datetime).valueOf() - dayjs(b.match_datetime).valueOf()
    )[0];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p>Loading the data...</p>
      </div>
    );
  }

  return (
    <div className="bg-black w-full min-h-screen h-full px-6">
      <div className="max-w-[550px] mx-auto relative">
        {/* Menu Button */}
        <div className="absolute top-4 right-0 z-10">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <p className="px-4 py-2 text-sm text-gray-700">
                Hi!..{user ? user.name : "Guest"}
              </p>
              {user && user.auth_level >= 3 && (
                <Link href="/236/manage/matches">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Manage Matches
                  </button>
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>

        {/* Login Modal */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
              <form onSubmit={onSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mb-4 border rounded text-black"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mb-4 border rounded text-black"
                  required
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="text-center p-8 space-y-4">
          <h1 className="text-6xl font-bold tracking-wide">Ruwais Gibol</h1>
          <p className="text-xl">Ruwais Fun Football Winter 2024</p>
          <div className="flex justify-center space-x-2 mt-4">
            <Link href="/schedule">
              <button className="text-sm px-5 py-2 border rounded-full hover:bg-blue-700 transition duration-300">
                Matches
              </button>
            </Link>
            <Link href="/players">
              <button className="text-sm px-5 py-2 border rounded-full hover:bg-blue-700 transition duration-300">
                Players
              </button>
            </Link>
            <Link href="/match-statistic">
              <button className="text-sm px-5 py-2 border rounded-full hover:bg-blue-700 transition duration-300">
                Statistic
              </button>
            </Link>
          </div>
        </div>

        {latestMatch ? (
          <div className="flex justify-center w-full">
            <div className="max-w-[550px] w-full border border-dashed rounded-lg p-6">
              <h2 className="text-3xl text-center">
                {latestMatch.status === "Live" ? "Live Match" : "Latest Match"}
              </h2>
              <div className="text-center mb-2">
                <p>
                  {dayjs(latestMatch.match_datetime).format("DD-MMM-YY HH:mm")}
                </p>
                <p>{latestMatch.venue}</p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <div className="text-center space-y-4">
                  <img
                    src={`/flags/${latestMatch.home_team.name}.png`}
                    className="w-28 object-cover"
                  />
                  <p className="text-lg">{latestMatch.home_team_goals ?? 0}</p>
                  <h3 className="text-lg">
                    {latestMatch.home_team.team_alias}{" "}
                  </h3>
                </div>
                <div className="text-center">
                  <h3 className="space-x-2 text-3xl font-bold mb-6">VS</h3>
                  <div className="text-yellow-300">
                    {latestMatch.status !== "Completed"
                      ? "Live".toUpperCase()
                      : latestMatch.home_team_goals >
                        latestMatch.away_team_goals
                      ? `${latestMatch.home_team.team_alias} Wins`
                      : latestMatch.home_team_goals <
                        latestMatch.away_team_goals
                      ? `${latestMatch.away_team.team_alias} Wins`
                      : "Draw".toUpperCase()}
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <img
                    src={`/flags/${latestMatch.away_team.name}.png`}
                    className="w-28 object-cover"
                  />
                  <p className="text-lg">{latestMatch.away_team_goals ?? 0}</p>
                  <h3 className="text-lg">
                    {latestMatch.away_team.team_alias}
                  </h3>
                </div>
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
        {/* {matches.filter((match) => match.status === "Future").length > 0 && (
        <div className="flex justify-center w-full mt-8">
          <div className="max-w-[550px] w-full border border rounded-lg p-6 mb-8 bg-neutral-900">
            <h2 className="text-3xl text-center">Upcoming Match</h2>
            {(() => {
              const nextMatch = matches
                .filter(
                  (match) =>
                    match.status != "Completed" &&
                    dayjs(match.match_datetime).isAfter(dayjs().startOf("day"))
                )
                .sort(
                  (a, b) =>
                    dayjs(a.match_datetime).valueOf() -
                    dayjs(b.match_datetime).valueOf()
                )[0];

              return (
                <div>
                  <div className="text-center mb-2">
                    <p>
                      {dayjs(nextMatch.match_datetime).format(
                        "DD-MMM-YY HH:mm"
                      )}
                    </p>
                    <p>{nextMatch.venue || "TBA"}</p>
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
                      <h3 className="text-lg">
                        {nextMatch.home_team.team_alias}
                      </h3>
                    </div>
                    <div className="text-center">
                      <h3 className="space-x-2 text-3xl font-bold">VS</h3>
                      <p className="text-sm mt-2 text-yellow-300">
                        {nextMatch.status != "Future"
                          ? nextMatch.status.toUpperCase()
                          : capitalize(
                              dayjs(nextMatch.match_datetime).fromNow()
                            )}
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
                      <h3 className="text-lg">
                        {nextMatch.away_team.team_alias}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )} */}
        {/* 2 */}
        {/* Incoming Match */}
        {/* {matches.filter((match) => match.status === "Future").length > 0 && ( */}
        <div className="flex justify-center w-full mt-8">
          <div className="max-w-[550px] w-full border border rounded-lg p-6 mb-8 bg-neutral-900">
            <h2 className="text-3xl text-center">Upcoming Match</h2>
            {nextMatch ? (
              <div>
                <div className="text-center mb-2">
                  <p>
                    {dayjs(nextMatch.match_datetime).format("DD-MMM-YY HH:mm")}
                  </p>
                  <p>{nextMatch.venue || "TBA"}</p>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div className="text-center space-y-4">
                    <img
                      src={
                        process.env.NEXT_PUBLIC_BASE_URL +
                        `/flags/${nextMatch.home_team.name}.png`
                      }
                      className="w-28 object-cover"
                      alt={nextMatch.home_team}
                    />
                    <h3 className="text-lg">
                      {nextMatch.home_team.team_alias}
                    </h3>
                  </div>
                  <div className="text-center">
                    <h3 className="space-x-2 text-3xl font-bold">VS</h3>
                    <p className="text-sm mt-2 text-yellow-300">
                      {nextMatch.status != "Future"
                        ? nextMatch.status.toUpperCase()
                        : capitalize(dayjs(nextMatch.match_datetime).fromNow())}
                    </p>
                  </div>
                  <div className="text-center space-y-4">
                    <img
                      src={
                        process.env.NEXT_PUBLIC_BASE_URL +
                        `/flags/${nextMatch.away_team.name}.png`
                      }
                      className="w-28 object-cover"
                      alt={nextMatch.away_team}
                    />
                    <h3 className="text-lg">
                      {nextMatch.away_team.team_alias}
                    </h3>
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
          </div>
        </div>
        {/* )} */}
        {/*  */}
      </div>
    </div>
  );
}
