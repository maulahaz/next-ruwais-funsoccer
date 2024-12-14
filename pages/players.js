import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Head from "next/head";
import Link from "next/link";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const playersPerPage = 12;
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("id, name, team_alias")
      .order("name");
    if (error) {
      console.error("Error fetching teams:", error);
    } else {
      setTeams(data);
    }
  };

  const fetchPlayers = async () => {
    let query = supabase
      .from("players")
      .select(`*, team:team_id (name, team_alias)`, { count: "exact" })
      .order("name", { ascending: true })
      .range(
        (currentPage - 1) * playersPerPage,
        currentPage * playersPerPage - 1
      );

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%, alias.ilike.%${searchTerm}%`
      );
    }
    //
    if (selectedTeam) {
      query = query.eq("team_id", selectedTeam);
    }
    //
    const { data, error, count } = await query;
    // console.log("Result:", { data, error, count });

    if (error) {
      console.error("Error fetching players:", error);
    } else {
      setPlayers(data);
      setTotalPages(Math.ceil(count / playersPerPage));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedTeam(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId === selectedTeam ? null : teamId);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, [currentPage, searchTerm, selectedTeam]);

  return (
    <div className="bg-black min-h-screen text-white">
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - Players`}</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Players</h1>

        <div className="flex flex-col mb-4">
          <h3 className="text-lg mb-2 mr-4">Filter by name or alias:</h3>
          <div className="flex">
            <input
              id="searchInput"
              type="text"
              placeholder="Type here..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-grow p-2 border rounded-l text-black"
            />
            <button
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Filter by Team */}
        <div className="mb-4 flex flex-wrap gap-2">
          <h3 className="text-lg mb-2 mr-4">Filter by Team:</h3>
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team.id)}
              className={`px-3 py-1 rounded ${
                selectedTeam === team.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              } hover:bg-blue-600 hover:text-white transition-colors`}
            >
              {team.team_alias}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="border rounded-lg p-4 shadow-md flex items-start max-w-2xl"
            >
              <div className="mr-4 flex-shrink-0">
                <a href={"/player-detail/" + player.id}>
                  <div className="w-24 h-24 rounded-full border-2 border-white overflow-hidden">
                    <img
                      src={
                        player.photo
                          ? `/players/${player.id}.jpg`
                          : `/players/user.jpg`
                      }
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </a>
                <h2 className="text-xl font-semibold mt-2 text-center">
                  {player.name}
                </h2>
                <p className="text-sm text-center">{player.alias ?? "-"}</p>
              </div>
              <div className="flex-grow">
                <p>
                  <strong>Team:</strong> {player.team.team_alias}
                </p>
                <p>
                  <strong>Position:</strong> {player.position}
                </p>
                <p>
                  <strong>Jersey Number:</strong> {player.jersey_num}
                </p>
                <p>
                  <strong>Origin:</strong> {player.origin}
                </p>
                <p>
                  <strong>Previous Club:</strong> {player.prev_club}
                </p>
                <p>
                  <strong>Address:</strong> {player.address} {player.phone}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-blue-500 text-white rounded disabled:bg-gray-500"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-1 bg-blue-500 text-white rounded disabled:bg-gray-500"
          >
            Next
          </button>
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
