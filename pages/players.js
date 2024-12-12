import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Head from "next/head";
import Link from "next/link";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const playersPerPage = 10;

  useEffect(() => {
    fetchPlayers();
  }, [currentPage, searchTerm]);

  const fetchPlayers = async () => {
    let query = supabase
      .from("players")
      .select(
        `
        *,
        team:team_id (name, team_alias)
      `,
        { count: "exact" }
      )
      .order("name", { ascending: true })
      .range(
        (currentPage - 1) * playersPerPage,
        currentPage * playersPerPage - 1
      );

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    const { data, error, count } = await query;

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
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - Players`}</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Players</h1>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search player..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <div key={player.id} className="border rounded-lg p-4 shadow-md">
              <img
                  src={player.photo ? `/players/${player.id}.jpg` : `/players/user.jpg`}
                // src={`/players/user.jpg`}
                alt={player.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{player.name}</h2>
              <p>
                <strong>Team:</strong> {player.team.team_alias}
              </p>
              <p>
                <strong>Origin:</strong> {player.origin}
              </p>
              <p>
                <strong>Jersey Number:</strong> {player.jersey_num}
              </p>
              <p>
                <strong>Previous Club:</strong> {player.prev_club}
              </p>
              <p>
                <strong>Address:</strong> {player.address}
              </p>
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

        {/* Pagination-1 */}
        {/* <div className="mt-8 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-3 py-1 border rounded ${
                currentPage === page ? "bg-blue-500 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}
        </div> */}

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
