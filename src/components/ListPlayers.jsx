'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useWebSocket } from '@/services/WebSocketContext'
import { useUserGame } from '@/services/UserGameContext'
import axiosClient from '@/services/http-client/axios-client'
export const fetchDataGame = async (gameName, setDataGame, setHostId) => {
  try {
    const url = `games/${gameName}`
    const response = await axiosClient.get(url)

    if (response?.status !== 200) {
      throw new Error('Network response was not ok [ListPlayers]')
    } else {
      setDataGame(response.data)
      setHostId(response.data.host_player_id)
    }
  } catch (error) {
    console.error('Error getting players of game:', error)
  }
}

export function RandomMonster ({ monsters }) {
  const randomIndex = Math.floor(Math.random() * monsters.length)
  const SelectedMonster = monsters[randomIndex].default
  return <SelectedMonster className='monster-image' />
}

function ListPlayers () {
  const { game } = useUserGame()
  const { event } = useWebSocket()
  const [dataGame, setDataGame] = useState({})
  const [gameName, setGameName] = useState(game?.name)
  const [hostID, setHostId] = useState(null)

  const monstersContext = require.context('!@svgr/webpack!../../public/monsters', false, /\.svg$/)
  const monsters = monstersContext.keys().map(monstersContext)

  useEffect(() => {
    const name = game?.name
    setGameName(name)
    fetchDataGame(gameName, setDataGame, setHostId)
  }, [])

  useEffect(() => {
    const eventType = JSON.parse(event)?.event
    if (eventType === 'player_joined' || eventType === 'player_left') {
      fetchDataGame(gameName, setDataGame, setHostId)
    }
  }, [event])

  return (
    <div className='block mt-2 listPlayers' style={{ overflowY: 'auto' }}>
      {dataGame?.list_of_players?.map((player, index) => (
        <div className='box media' key={index}>
          <div className='media-left'>
            <figure className='image is-64x64'>
              <RandomMonster monsters={monsters} />
            </figure>
          </div>
          <div className='media-content'>
            <p className='content'>
              {player?.id === hostID && <Image src='/icons/crown-solid.svg' alt='Host' width='20' height='20' />}
              {player?.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ListPlayers
