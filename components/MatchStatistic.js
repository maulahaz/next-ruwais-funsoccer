import { useQuery, useQueryClient } from 'react-query';
import { supabase } from '../lib/supabase';

const fetchMatchStatistics = async () => {
  const { data, error } = await supabase
    .from('match_logs')
    .select('player_id, log_name')
    .join('players', 'players.id = match_logs.player_id')
    .join('teams', 'teams.id = players.team_id')
    .groupBy('teams.id, teams.team_alias')
    .count('CASE WHEN log_name = \'Foul\' THEN 1 END as total_fouls',
      'CASE WHEN log_name = \'Yellow Card\' THEN 1 END as total_yellow_cards',
      'CASE WHEN log_name = \'Red Card\' THEN 1 END as total_red_cards',
      'CASE WHEN log_name = \'Penalty\' THEN 1 END as total_penalties')
    .orderBy('teams.id');

  if (error) {
    throw error;
  }

  return data;
};

const MatchStatistics = () => {
  const { data, error, isLoading } = useQuery(
    'match-statistics', // key
    fetchMatchStatistics // function to fetch data
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Match Statistics</h2>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Total Fouls</th>
            <th>Total Yellow Cards</th>
            <th>Total Red Cards</th>
            <th>Total Penalties</th>
          </tr>
        </thead>
        <tbody>
          {data.map((team) => (
            <tr key={team.id}>
              <td>{team.team_alias}</td>
              <td>{team.total_fouls}</td>
              <td>{team.total_yellow_cards}</td>
              <td>{team.total_red_cards}</td>
              <td>{team.total_penalties}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchStatistics;