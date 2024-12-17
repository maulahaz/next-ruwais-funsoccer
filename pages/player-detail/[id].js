import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import Head from "next/head";
import Link from "next/link";

export default function PlayerDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [playerImages, setPlayerImages] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlayerDetails();
    }
  }, [id]);

  const fetchPlayerDetails = async () => {
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select(`*, team:team_id (name, team_alias)`)
      .eq("id", id)
      .single();

    if (playerError) {
      console.error("Error fetching player details:", playerError);
    } else {
      // console.log("Player Data :", playerData);
      setPlayer(playerData);
      setCurrentImage(
        playerData.photo ? `/players/${playerData.id}.jpg` : `/players/user.jpg`
      );
    }

    //--Fetch player statistics
    const { data: statsData, error: statsError } = await supabase
      .from("match_logs")
      .select("log_name")
      .eq("player_id", id);

    if (statsError) {
      console.error("Error fetching player statistics:", statsError);
    } else {
      const stats = {
        goals: statsData.filter((log) => log.log_name === "Goal").length,
        yellowCards: statsData.filter((log) => log.log_name === "Yellow Card")
          .length,
        redCards: statsData.filter((log) => log.log_name === "Red Card").length,
        cleanSheets: statsData.filter((log) => log.log_name === "Clean Sheet")
          .length,
      };
      setPlayer((prevPlayer) => ({ ...prevPlayer, ...stats }));
    }

    //--Fetch player images
    const { data: imageData, error: imageError } = await supabase
      .from("match_files")
      .select("*")
      .eq("player_id", id)
      .limit(5);

    // console.log("Player Images :", imageData);

    if (imageError) {
      console.error("Error fetching player images:", imageError);
    } else {
      setPlayerImages(imageData);
    }

    setLoading(false);
  };

  const handleEdit = () => {
    alert("You don't have authority to edit");
  };

  if (loading) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p>Loading the data...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="bg-black h-screen w-screen flex items-center justify-center">
        <p>Player not found</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_SITE_NAME} - ${player.alias}`}</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-center">{player.name}</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="rounded-lg overflow-hidden shadow-lg mb-4 w-[350px] h-[350px] mx-auto">
              <img
                src={currentImage}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center space-x-2">
              {playerImages.map((image, index) => (
                <div
                  key={image.id}
                  className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setCurrentImage(image.file_url)}
                >
                  <img
                    src={image.file_url}
                    alt={`${player.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {playerImages.length < 5 && (
                <div
                  className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() =>
                    setCurrentImage(
                      player.photo
                        ? `/players/${player.id}.jpg`
                        : `/players/default.jpg`
                    )
                  }
                >
                  <img
                    src={
                      player.photo
                        ? `/players/${player.id}.jpg`
                        : `/players/default.jpg`
                    }
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <p>
                    Alias: <strong>{player.alias}</strong>
                  </p>
                  <p>
                    Team: <strong>{player.team.team_alias}</strong>
                  </p>
                  <p>
                    Position: <strong> {player.position || "N/A"}</strong>
                  </p>
                  <p>
                    Jersey Number: <strong>{player.jersey_num || "N/A"}</strong>
                  </p>
                </div>
                <div>
                  <p>
                    Origin: <strong>{player.origin || "N/A"}</strong>
                  </p>
                  <p>
                    Previous Club: <strong>{player.prev_club || "N/A"}</strong>
                  </p>
                  <p>
                    Address: <strong>{player.address || "N/A"}</strong>
                  </p>
                  <p>
                    Phone: <strong>{player.phone || "N/A"}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Statistics</h3>
              <div className="grid md:grid-cols-4 grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-3xl font-bold">{player.goals || 0}</p>
                  <p>Goals</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {player.yellowCards || 0}
                  </p>
                  <p>Yellow Cards</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{player.redCards || 0}</p>
                  <p>Red Cards</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {player.cleanSheets || 0}
                  </p>
                  <p>Clean sheets</p>
                </div>
              </div>
              <br></br>
              <p className="tx-sm italic">
                Note: This data still not link properly
              </p>
            </div>
            <div className="pt-4 text-right">
              <button
                onClick={handleEdit}
                className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/players">
            <button className="text-sm px-6 py-2 border rounded-full hover:bg-orange-200 hover:text-black transition duration-300">
              Back to Players
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
