'use client'

import { useEffect, useState } from 'react'
import { useUserGame } from '@/services/UserGameContext'
import { useWebSocket } from '@/services/WebSocketContext'

export const getData = async (game, setData) => {
  try {
    const response = await fetch(`http://localhost:8000/games/${game?.name}`)
    if (!response.ok) {
      throw new Error('Network response was not ok [DataGame]')
    }
    const data = await response.json()
    setData(data)
  } catch (error) {
    console.error('Error getting players:', error)
  }
}

function DataGame () {
  const [data, setData] = useState([])
  const { game } = useUserGame()
  const { event } = useWebSocket()

  useEffect(() => {
    getData(game, setData)
  }, [])

  useEffect(() => {
    const eventJSON = JSON.parse(event)
    if (eventJSON?.event === 'player_joined' ||
      eventJSON?.event === 'player_left') {
      getData(game, setData)
    }
  }, [event])

  return (
    <div className='notification is-tuki-modified dataGame is-flex is-justify-content-space-between is-align-items-center'>
      <div>
        <p className='title is-5'>Partida: {data.name}</p>
        <p className='has-text-weight-bold'>Creador: {data.host_player_name}</p>
        <p className='has-text-weight-bold'>Jugadores: {data.num_of_players}/{data.max_players}</p>
        <p className='has-text-weight-bold'>Jugadores mínimos: {data.min_players}</p>
      </div>
    </div>
  )
}

export default DataGame
