'use client'

import { React, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebSocket } from '@/services/WebSocketContext'
import { useUserGame } from '@/services/UserGameContext'
import axios from 'axios'
import Game from '@/components/Game'

export const handleInput = (event, gameName, passwords, setPasswords) => {
  const newPasswords = { ...passwords }
  newPasswords[gameName] = event.target.value
  setPasswords(newPasswords)
}

export const makeBodyRequest = (id, password) => {
  return ({
    player_id: id,
    password: password !== '' ? password : null
  })
}

export const handleClick = async (gameName, passwords, router, user, setGameValues) => {
  const password = passwords[gameName] || ''
  try {
    const dataPatch = makeBodyRequest(user.id, password)
    const response = await axios.patch(`http://localhost:8000/games/join/${gameName}`, dataPatch)
    if (response?.status === 200) {
      const gameParams = {
        name: gameName
      }
      setGameValues(gameParams)
      router.push('/lobby')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

export const fetchGames = async (setGames) => {
  try {
    const response = await axios.get('http://localhost:8000/games')
    setGames(response.data)
  } catch (error) {
    console.error('Error getting games:', error)
  }
}

function SearchGame () {
  const [games, setGames] = useState([])
  const [passwords, setPasswords] = useState({})
  const router = useRouter()
  const { event } = useWebSocket()
  const { user, setGameValues } = useUserGame()

  useEffect(() => {
    fetchGames(setGames)
  }, [])

  useEffect(() => {
    const eventType = JSON.parse(event)?.event
    if (eventType === 'game_deleted' ||
        eventType === 'game_created' ||
        eventType === 'game_started' ||
        eventType === 'game_updated' ||
        eventType === 'player_joined') {
      fetchGames(setGames)
    }
  }, [event])

  return (
    <div className='has-text-centered'>
      <h2 className='title is-1 is-uppercase is-italic has-text-centered section'>Partidas Disponibles</h2>
      <div className='columns is-centered'>
        <div className='column is-two-thirds'>
          {
            games.length === 0
              ? (
                <p className='notification is-warning'>No hay partidas disponibles en este momento. Intentá más tarde o creá una.</p>
                )
              : (
                <ul>
                  {games.map((game, index) => (
                    <Game key={index} game={game} handleClick={(gameName) => handleClick(gameName, passwords, router, user, setGameValues)} handleInput={(event, gameName) => handleInput(event, gameName, passwords, setPasswords)} />
                  ))}
                </ul>
                )
          }
        </div>
      </div>
      <div
        className='searchG'
        style={
          {
            backgroundImage: 'url("/backgrounds/gif2.gif")',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%',
            zIndex: '-1'
          }
        }
      />
    </div>
  )
}

export default SearchGame
