'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWebSocket } from '@/services/WebSocketContext'
import axios from 'axios'
import { useUserGame } from '@/services/UserGameContext'

export const fetchDataGame = async (user, gameName, setIsHost, setHostId, setIsReady) => {
  try {
    const url = `http://127.0.0.1:8000/games/${gameName}`
    const response = await axios.get(url)

    if (response?.status !== 200) {
      throw new Error('Network response was not ok [ListPlayers]')
    } else {
      setIsHost(response.data.host_player_id === user.id)
      setHostId(response.data.host_player_id)
      setIsReady(response.data.num_of_players >= response.data.min_players)
    }
  } catch (error) {
    console.error('Error getting players of game:', error)
  }
}

export const initGame = async (gameName, hostID, router) => {
  const url = `http://127.0.0.1:8000/games/${gameName}/init?host_player_id=${hostID}`
  const response = await axios.patch(url)
  if (!response?.ok) {
    console.log(response)
  }
  router.push('/game')
}

export const cancelGame = async (gameName, router) => {
  try {
    const url = `http://localhost:8000/games/${gameName}`
    const response = await axios.delete(url)
    if (!response?.ok) {
      console.log(response)
    }
    localStorage.removeItem('game')
  } catch (error) {
    console.error('Error deleting data:', error)
  }

  router.push('/search-game')
}

export const leaveGame = async (user, game, router) => {
  try {
    const playerID = user?.id
    const gameName = game?.name
    const url = `http://localhost:8000/games/leave/${gameName}?player_id=${playerID}`
    const response = await axios.patch(url)
    if (!response?.ok) {
      console.log(response)
    }
  } catch (error) {
    console.error('Error leaving data:', error)
  }

  router.push('/search-game')
}

export const handleExitClick = (user, game, isHost, router, setShowModal) => {
  if (isHost) {
    setShowModal(true)
  } else {
    leaveGame(user, game, router)
  }
}

export const closeModal = (setShowModal) => {
  setShowModal(false)
}

function ExitAndStart () {
  const { event } = useWebSocket()
  const { user, game } = useUserGame()
  const [gameName, setGameName] = useState(game?.name)
  const [isHost, setIsHost] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [hostID, setHostId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const name = game?.name
    setGameName(name)
    fetchDataGame(user, gameName, setIsHost, setHostId, setIsReady)
  }, [])

  useEffect(() => {
    const eventJSON = JSON.parse(event)
    const eventType = eventJSON?.event
    if (eventType === 'player_joined' || eventType === 'player_left') {
      fetchDataGame(user, gameName, setIsHost, setHostId, setIsReady)
    } else if (eventType === 'game_started' && eventJSON?.game_name === game.name) {
      const gameStarted = JSON.parse(event)?.game_name
      if (gameStarted === gameName) {
        router.push('/game')
      }
    } else if (eventType === 'game_canceled') {
      router.push('/search-game')
    } else if (eventType === 'game_deleted' && eventJSON?.game_name === game.name) {
      router.push('/search-game')
    }
  }, [event])

  return (
    <div className='colums buttons'>
      <div className='column'>
        <button
          className='button is-danger is-large'
          onClick={() => {
            handleExitClick(user, game, isHost, router, setShowModal)
          }}
        >
          Cancelar
        </button>
      </div>
      <div className='column'>
        <button className='button is-success is-large' onClick={() => { initGame(gameName, hostID, router) }} disabled={!(isHost && isReady)}>Iniciar</button>
      </div>

      {showModal && isHost && (
        <div className='modal is-active'>
          <div className='modal-background' onClick={closeModal} />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>¿Estas seguro de abandonar la partida?</p>
              <button className='delete' aria-label='close' onClick={closeModal} />
            </header>
            <section className='modal-card-body'>
              {isHost
                ? 'Sos el creador de la partida, si abandonas se cerrara esta Sala expulsando a todos los jugadores'
                : 'Tus compañeros te van a extrañar...'}
            </section>
            <footer className='modal-card-foot'>
              <button
                className='button is-danger'
                onClick={() => {
                  cancelGame(gameName, router)
                  closeModal(setShowModal)
                }}
              >
                Irse
              </button>
              <button className='button is-tuki' onClick={closeModal}>Irsen't</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExitAndStart
