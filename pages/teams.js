import { useState, useEffect } from 'react'
import { getTeams } from '../lib/db'

export default function Teams() {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsData = await getTeams()
      setTeams(teamsData)
    }
    fetchTeams()
  }, [])

  return (
    <div>
      <h1>Teams</h1>
      {teams.map(team => (
        <div key={team.id}>
          <h2>{team.name}</h2>
          <p>Alias: {team.team_alias}</p>
          <p>Captain: {team.captain}</p>
        </div>
      ))}
    </div>
  )
}