import dayjs from "dayjs";

export default function MatchRow({ match, index }) {
  return (
    <tr className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
      <td className="px-4 py-2 text-center">
        {dayjs(match.match_datetime).format("DD MMM YYYY HH:mm")}
      </td>
      <td className="px-4 py-2 text-center">
        {match.home_team.team_alias}{" "}
        <span className="text-orange-200"> vs</span>{" "}
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
  );
}