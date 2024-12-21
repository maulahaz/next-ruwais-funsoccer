import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase.js";
import Head from "next/head";
import { capitalize } from "../../../src/utils.ts";
import dayjs from "dayjs";
import Link from "next/link";

export default function AdminMatches() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    match_datetime: "",
    stage_name: "",
    season: "",
    venue: "",
    home_team_id: "",
    away_team_id: "",
    home_team_goals: 0,
    away_team_goals: 0,
    status: "Future",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const checkAuthorization = () => {
      const loggedInData = localStorage.getItem("loggedInData");
      if (!loggedInData) {
        router.push({
          pathname: "/236/auth/login",
          query: { error: "You do not have permission to access the page" },
        });
      } else {
        setIsAuthorized(true);
        fetchMatches();
        fetchTeams();
      }
    };

    checkAuthorization();
  }, [router, currentPage, searchTerm]);

  const fetchMatches = async () => {
    let query = supabase
      .from("matches")
      .select(
        `*, home_team:home_team_id (name, team_alias), away_team:away_team_id (name, team_alias)`,
        { count: "exact" }
      )
      .order("match_datetime", { ascending: false });
    // console.log("Before Search: ", query);

    if (searchTerm) {
      query = query.or(
        `id.ilike.%${searchTerm}%, status.ilike.%${searchTerm}%`
      );
    }
    // console.log("After Search: ", query);

    const { data, error, count } = await query.range(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage - 1
    );

    if (error) console.error("Error fetching matches:", error);
    else {
      setMatches(data);
      setTotalPages(Math.ceil(count / itemsPerPage));
    }
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("id, name, team_alias")
      .order("name");
    if (error) console.error("Error fetching teams:", error);
    else setTeams(data);
  };

  const handleCreateMatch = () => {
    setEditingId(null);
    setFormData({
      match_datetime: "",
      stage_name: "",
      season: "",
      venue: "",
      home_team_id: "",
      away_team_id: "",
      home_team_goals: 0,
      away_team_goals: 0,
      status: "Future",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error;
    if (editingId) {
      const { error: updateError } = await supabase
        .from("matches")
        .update(formData)
        .eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("matches")
        .insert(formData);
      error = insertError;
    }

    if (error) {
      console.error("Error updating/creating match:", error);
      setAlertMessage(`Error: ${error.message}`);
      setAlertType("bg-red-100 text-red-700");
    } else {
      setAlertMessage(
        editingId
          ? "Match updated successfully!"
          : "Match created successfully!"
      );
      setAlertType("bg-teal-100 text-teal-700");
      setEditingId(null);
      fetchMatches();
      setFormData({
        match_datetime: "",
        stage_name: "",
        season: "",
        venue: "",
        home_team_id: "",
        away_team_id: "",
        home_team_goals: 0,
        away_team_goals: 0,
        status: "Future",
      });
      setShowModal(false);
    }

    // Clear the alert after 5 seconds
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  const handleEdit = (match) => {
    setFormData({
      match_datetime: match.match_datetime,
      stage_name: match.stage_name,
      season: match.season,
      venue: match.venue,
      home_team_id: match.home_team_id,
      away_team_id: match.away_team_id,
      home_team_goals: match.home_team_goals,
      away_team_goals: match.away_team_goals,
      status: match.status,
    });
    setEditingId(match.id);
    setShowModal(true);
  };

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this match?")) {
  //     const { error } = await supabase.from("matches").delete().eq("id", id);
  //     if (error) console.error("Error deleting match:", error);
  //     else fetchMatches();
  //   }
  // };

  if (!isAuthorized) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p>Checking authorization and Loading data...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - Admin Matches`}</title>
      </Head>

      <h1 className="text-4xl font-bold mb-8">Manage Matches</h1>
      {/* Alert Message */}
      {alertMessage && (
        <div className={`p-4 mb-4 rounded-md ${alertType}`}>{alertMessage}</div>
      )}

      {/* Search and Create */}
      <div className="flex justify-between mb-4">
        {/* Search input */}
        {/* <div className="flex w-3/5">
          <input
            id="searchInput"
            type="text"
            placeholder="Type here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border rounded-l text-black"
          />
          <button
            onClick="{handleReset}"
            className="bg-gray-500 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition-colors"
          >
            Reset
          </button>
        </div> */}
        {/* Create Button */}
        <button
          onClick={handleCreateMatch}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
        >
          Create Match
        </button>
      </div>

      {/* Matches table-1 */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-800 mb-4">
          <thead>
            <tr className="bg-gray-900 text-yellow-200">
              <th className="border border-gray-800 p-2">SN</th>
              <th className="border border-gray-800 p-2">Date</th>
              <th className="border border-gray-800 p-2">Match</th>
              <th className="border border-gray-800 p-2">Stage</th>
              <th className="border border-gray-800 p-2">Home Team</th>
              <th className="border border-gray-800 p-2">Away Team</th>
              <th className="border border-gray-800 p-2">Score</th>
              <th className="border border-gray-800 p-2">Status</th>
              <th className="border border-gray-800 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={match.id} className="hover:bg-gray-800">
                <td className="border border-gray-800 p-2 text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="border border-gray-800 p-2">
                  {dayjs(match.match_datetime).format("DD-MMM-YY HH:mm")}
                </td>
                <td className="border border-gray-800 p-2">Match-{match.id}</td>
                <td className="border border-gray-800 p-2">
                  {match.stage_name}
                </td>
                <td className="border border-gray-800 p-2">
                  {capitalize(match.home_team.team_alias)}
                </td>
                <td className="border border-gray-800 p-2">
                  {capitalize(match.away_team.team_alias)}
                </td>
                <td className="border border-gray-800 p-2 text-center">
                  {match.home_team_goals} - {match.away_team_goals}
                </td>
                <td className="border border-gray-800 p-2">
                  {capitalize(match.status)}
                </td>
                <td className="border border-gray-800 p-2 mr-2 text-center">
                  <button
                    onClick={() => handleEdit(match)}
                    className="bg-yellow-400 text-black px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  {/* <button
                  onClick={() => handleDelete(match.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button> */}
                  <Link href={`/236/match-logs/${match.id}`}>
                    <button className="bg-orange-500 text-white px-2 py-1 rounded">
                      Logs
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-700"
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/">
          <button className="text-sm px-6 py-2 mr-5 border rounded-full hover:bg-orange-200 hover:text-black transition duration-300">
            Homepage
          </button>
        </Link>
        <Link href="/236/dashboard">
          <button className="text-sm px-6 py-2 border rounded-full hover:bg-orange-200 hover:text-black transition duration-300">
            Dashboard
          </button>
        </Link>
      </div>

      {/* Modal for create/edit form */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                {editingId ? "Edit Match" : "Create Match"}
              </h3>
              <div className="mt-2 px-7 py-3">
                <form onSubmit={handleSubmit}>
                  {/* Form fields (similar to your existing form) */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Match date and time
                    </label>
                    <input
                      type="datetime-local"
                      name="match_datetime"
                      value={formData.match_datetime}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Stage Name
                    </label>
                    <input
                      type="text"
                      name="stage_name"
                      value={formData.stage_name}
                      onChange={handleInputChange}
                      placeholder="Stage Name"
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Home Team
                    </label>
                    <select
                      name="home_team_id"
                      value={formData.home_team_id}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="">Select...</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {capitalize(team.team_alias)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Home Team Goals
                    </label>
                    <input
                      type="number"
                      name="home_team_goals"
                      value={formData.home_team_goals}
                      onChange={handleInputChange}
                      placeholder="Home Team Goals"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Away Team
                    </label>
                    <select
                      name="away_team_id"
                      value={formData.away_team_id}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="">Select...</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {capitalize(team.team_alias)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Away Team Goals
                    </label>
                    <input
                      type="number"
                      name="away_team_goals"
                      value={formData.away_team_goals}
                      onChange={handleInputChange}
                      placeholder="Away Team Goals"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Match Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="">Select...</option>
                      <option value="Live">Live</option>
                      <option value="Future">Future</option>
                      <option value="Completed">Completed</option>
                      <option value="Postponed">Postponed</option>
                      <option value="Rescheduled">Rescheduled</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  {/* ... */}
                  <div className="flex items-center justify-center mt-4 gap-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                    >
                      {editingId ? "Update Match" : "Create Match"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EOF Table */}
    </div>
  );
}
