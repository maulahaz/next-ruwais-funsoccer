import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";
import { supabase } from "../../../lib/supabase";

export default function MatchLogs() {
  const router = useRouter();
  const { matchId } = router.query;

  const [logs, setLogs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({
    log_name: "",
    log_datetime: "",
    player_id: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    if (matchId) {
      fetchLogs();
      fetchPlayers();
    }
  }, [matchId]);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("match_logs")
      .select("*, player:player_id(name, alias)")
      .eq("match_id", matchId)
      .order("log_datetime", { ascending: false });

    if (error) console.error("Error fetching logs:", error);
    else setLogs(data);
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, alias")
      .order("name", { ascending: true });

    if (error) console.error("Error fetching players:", error);
    else setPlayers(data);
  };

  const handleCreateLog = () => {
    setFormData({
      log_name: "",
      log_datetime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      player_id: "",
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (log) => {
    setFormData({
      log_name: log.log_name,
      log_datetime: dayjs(log.log_datetime).format("YYYY-MM-DDTHH:mm:ss"),
      player_id: log.player_id,
    });
    setEditingId(log.id);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const logData = {
      ...formData,
      match_id: matchId,
    };

    let { data, error } = {};
    if (editingId) {
      ({ data, error } = await supabase
        .from("match_logs")
        .update(logData)
        .eq("id", editingId));
    } else {
      ({ data, error } = await supabase.from("match_logs").insert([logData]));
    }

    if (error) {
      setAlertMessage("Error saving log: " + error.message);
      setAlertType("bg-red-100 border-red-400 text-red-700");
    } else {
      setAlertMessage("Log saved successfully!");
      setAlertType("bg-green-100 border-green-400 text-green-700");
      fetchLogs();
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      const { error } = await supabase.from("match_logs").delete().eq("id", id);

      if (error) {
        setAlertMessage("Error deleting log: " + error.message);
        setAlertType("bg-red-100 border-red-400 text-red-700");
      } else {
        setAlertMessage("Log deleted successfully!");
        setAlertType("bg-green-100 border-green-400 text-green-700");
        fetchLogs();
      }
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - Match Logs`}</title>
      </Head>

      <h1 className="text-4xl font-bold mb-8">Manage Match Logs</h1>

      {alertMessage && (
        <div className={`p-4 mb-4 rounded-md ${alertType}`}>{alertMessage}</div>
      )}

      <div className="flex justify-between mb-4">
        <button
          onClick={handleCreateLog}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
        >
          Create Match Log
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-800 mb-4">
          <thead>
            <tr className="bg-gray-900 text-yellow-200">
              <th className="border border-gray-800 p-2">ID</th>
              <th className="border border-gray-800 p-2">Log Name</th>
              <th className="border border-gray-800 p-2">Date Time</th>
              <th className="border border-gray-800 p-2">Player</th>
              <th className="border border-gray-800 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-800 p-4 text-center text-gray-500"
                >
                  Data not available
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={log.id} className="hover:bg-gray-800">
                  <td className="border border-gray-800 p-2">{index + 1}</td>
                  {/* <td className="border border-gray-800 p-2">{log.id}</td> */}
                  <td className="border border-gray-800 p-2">{log.log_name}</td>
                  <td className="border border-gray-800 p-2">
                    {dayjs(log.log_datetime).format("DD-MMM-YY HH:mm:ss")}
                  </td>
                  <td className="border border-gray-800 p-2">
                    {log.player.name+"-"+log.player.alias}
                  </td>
                  <td className="border border-gray-800 p-2 text-center">
                    <button
                      onClick={() => handleEdit(log)}
                      className="bg-yellow-400 text-black px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <Link href="/236/matches">
          <button className="text-sm px-6 py-2 border rounded-full hover:bg-orange-200 hover:text-black transition duration-300">
            Back to Matches
          </button>
        </Link>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                {editingId ? "Edit Log" : "Create Log"}
              </h3>
              <form onSubmit={handleSubmit} className="mt-2 px-7 py-3">
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Log Name
                  </label>
                  <select
                    name="log_name"
                    value={formData.log_name}
                    onChange={handleInputChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select...</option>
                    <option value="Goal">Goal</option>
                    <option value="Foul">Foul</option>
                    <option value="Yellow Card">Yellow Card</option>
                    <option value="Red Card">Red Card</option>
                    <option value="Own Goal">Own Goal</option>
                    <option value="Penalty">Penalty</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Date Time
                  </label>
                  <input
                    type="datetime-local"
                    name="log_datetime"
                    value={formData.log_datetime}
                    onChange={handleInputChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Player
                  </label>
                  <select
                    name="player_id"
                    value={formData.player_id}
                    onChange={handleInputChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Player</option>
                    {players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name + "-" + player.alias}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
