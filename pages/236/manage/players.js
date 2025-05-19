import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabase.js";
import Head from "next/head";
import { capitalize } from "../../../src/utils.ts";

export default function AdminPlayers() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    origin: "",
    photo: "",
    phone: "",
    address: "",
    team_id: "",
    prev_club: "",
    jersey_num: "",
    position: "",
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
        fetchPlayers();
        fetchTeams();
      }
    };

    checkAuthorization();
  }, [router, currentPage, searchTerm]);

  const fetchPlayers = async () => {
    let query = supabase
      .from("players")
      .select(`*, team:team_id (name, team_alias)`, { count: "exact" })
      .order("name");

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,alias.ilike.%${searchTerm}%`
      );
    }

    const { data, error, count } = await query.range(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage - 1
    );

    if (error) console.error("Error fetching players:", error);
    else {
      setPlayers(data);
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

  const handleCreatePlayer = () => {
    setEditingId(null);
    setFormData({
      name: "",
      alias: "",
      origin: "",
      photo: "",
      phone: "",
      address: "",
      team_id: "",
      prev_club: "",
      jersey_num: "",
      position: "",
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
        .from("players")
        .update(formData)
        .eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("players")
        .insert(formData);
      error = insertError;
    }

    if (error) {
      console.error("Error updating/creating player:", error);
      setAlertMessage(`Error: ${error.message}`);
      setAlertType("bg-red-100 text-red-700");
    } else {
      setAlertMessage(
        editingId
          ? "Player updated successfully!"
          : "Player created successfully!"
      );
      setAlertType("bg-teal-100 text-teal-700");
      setEditingId(null);
      fetchPlayers();
      setFormData({
        name: "",
        alias: "",
        origin: "",
        photo: "",
        phone: "",
        address: "",
        team_id: "",
        prev_club: "",
        jersey_num: "",
        position: "",
      });
      setShowModal(false);
    }

    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  const handleEdit = (player) => {
    setFormData({
      name: player.name,
      alias: player.alias,
      origin: player.origin,
      photo: player.photo,
      phone: player.phone,
      address: player.address,
      team_id: player.team_id,
      prev_club: player.prev_club,
      jersey_num: player.jersey_num,
      position: player.position,
    });
    setEditingId(player.id);
    setShowModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

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
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - Admin Players`}</title>
      </Head>

      <h1 className="text-4xl font-bold mb-8">Manage Players</h1>
      {alertMessage && (
        <div className={`p-4 mb-4 rounded-md ${alertType}`}>{alertMessage}</div>
      )}

      <div className="flex justify-between mb-4">
        <div className="flex w-3/5">
          <input
            type="text"
            placeholder="Search by name or alias..."
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
        <button
          onClick={handleCreatePlayer}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
        >
          Create Player
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-800 mb-4">
          <thead>
            <tr className="bg-gray-900 text-yellow-200">
              <th className="border border-gray-800">SN</th>
              <th className="border border-gray-800">Name</th>
              <th className="border border-gray-800">Alias</th>
              <th className="border border-gray-800">Team</th>
              <th className="border border-gray-800">Jersey #</th>
              <th className="border border-gray-800">Position</th>
              <th className="border border-gray-800">Phone</th>
              <th className="border border-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id} className="hover:bg-gray-800">
                <td className="border border-gray-800 text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="border border-gray-800">{player.name}</td>
                <td className="border border-gray-800">{player.alias}</td>
                <td className="border border-gray-800">
                  {player.team ? capitalize(player.team.team_alias) : "N/A"}
                </td>
                <td className="border border-gray-800">{player.jersey_num}</td>
                <td className="border border-gray-800">{player.position}</td>
                <td className="border border-gray-800">{player.phone}</td>
                <td className="border border-gray-800 p-1 text-center">
                  <button
                    onClick={() => handleEdit(player)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Modal for creating/editing player */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-black">
              {editingId ? "Edit Player" : "Create Player"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full p-2 mb-2 border rounded text-black"
                required
              />
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleInputChange}
                placeholder="Alias"
                className="w-full p-2 mb-2 border rounded text-black"
              />
              <div className="flex items-center justify-center mt-4 gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                >
                  {editingId ? "Update Player" : "Create Player"}
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
      )}
    </div>
  );
}
