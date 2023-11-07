'use client'

import '@/styles/Table.css'
import Chat from '../Chat'
import Card from './Card'
import DiscardDeck from './DiscardDeck'
import PlayCard from './PlayCard'
import Chair from './Chair'
import Modal from '../Modal'
import { useEffect, useState } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { sortCards } from '@/services/sortCards'
import { useRouter } from 'next/navigation'
import { playCard } from '@/services/playCard'
import { newCard } from '@/services/newCard'
import { discardCard } from '@/services/discardCard'
import { deleteGame } from '@/services/deleteGame'
import { useUserGame } from '@/services/UserGameContext'
import { useWebSocket } from '@/services/WebSocketContext'
import { handlerTurn, turnStates } from '@/services/handlerTurn'
import axios from 'axios'
import '@/styles/game_ended.scss'
import Record from './Record'

export const handleDragEnd = (event, turnState, user, game, setCardsPlayer, players, setContentModal, setButtons, setHandleFunction) => {
  const { active, over } = event

  if (over.id === 'discard-deck' && turnState === turnStates.PLAY) {
    // Discarding
    if (active.id === 1) {
      setContentModal('No puedes descartar esta carta')
    } else {
      const handleFunction = (value) => {
        console.log('Decision: ', value)
        if (value) {
          discardCard(setCardsPlayer, active.id, user?.id, game?.name)
        }
      }
      setHandleFunction(() => handleFunction)
      const buttons = [
        {
          text: 'Aceptar',
          value: true
        },
        {
          text: 'Cancelar',
          value: false
        }
      ]
      setButtons(buttons)
      setContentModal('¿Seguro que quieres descartar esta carta?')
    }
  } else if (over.id === 'play-card' && turnState === turnStates.PLAY) {
    // Playing
    const played = playCard(setCardsPlayer, active.id, user.id, game.name, user, game, players, setContentModal, setButtons, setHandleFunction)
    if (played) {
      // setTurnState(turnStates.EXCHANGE)
    }
  } else {
    // Just sorting
    sortCards(setCardsPlayer, over.id, active.id)
    // se puede dar un over.id a arrastrar las cartas para que sea posible aunque no sea el turno
  }
}

export const fetchCards = async (user, setCardsPlayer) => {
  const playerId = user?.id
  try {
    const response = await axios.get(
      `http://localhost:8000/players/${playerId}/hand`
    )
    const cards = await response.data.map((card) => {
      return {
        id: card.id,
        name: card.name
      }
    })
    setCardsPlayer(cards)
    console.log(cards)
  } catch (error) {
    console.error('Error getting cards:', error)
  }
}

export const fetchResultsGame = async (gameName, setContentModal, setButtons, setHandleFunction) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/games/${gameName}/result`
    )
    console.log(response.data)
    const data = response.data
    const theThingPlayer = data.winners.find(winner => winner.was_the_thing) ||
      data.losers.find(loser => loser.was_the_thing)
    const message = `
      Los ganadores son :
      ${data.winners.map(winner => `${winner.name}`)}
      \nLos perdedores son:
      ${data.losers.map(loser => `${loser.name}`)}
      \nLa Cosa: ${theThingPlayer?.name}
    `
    const buttons = [
      {
        text: 'Aceptar',
        value: true
      }
    ]
    setButtons(buttons)
    const handleAccept = (value) => {
      deleteGame(gameName)
    }
    setHandleFunction(() => handleAccept)
    setContentModal(message)
  } catch (error) {
    console.error('Error getting results:', error)
  }
}

function Table () {
  const router = useRouter()
  const { user, game, setUserValues, setNewRecord } = useUserGame()
  const wsObject = useWebSocket()
  const wsEvent = wsObject.event
  const [cardsPlayer, setCardsPlayer] = useState([])
  const [playBG, setPlayBG] = useState('/cards/rev/109Rev.png')
  const [discardBG, setDiscardBG] = useState('/cards/rev/revPanic.png')
  const [drawBG, setDrawBG] = useState('/cards/rev/revTakeAway.png')
  const [turnState, setTurnState] = useState(turnStates.NOTURN)
  const [turn, setTurn] = useState(0)
  const items = [...cardsPlayer, 'discard-deck', 'play-card']
  const [players, setPlayers] = useState('vacio')
  const [contentModal, setContentModal] = useState('')
  const [buttons, setButtons] = useState('')
  const [handleFunction, setHandleFunction] = useState(null)
  const turnSeters = { setTurnState, setTurn, setDrawBG, setDiscardBG, setPlayBG, setPlayers, setNewRecord, setContentModal, setButtons, setHandleFunction, setCardsPlayer}
  const userId = user?.id
  const gameName = game?.name

  useEffect(() => {
    const gameName = game?.name
    const fetchGameData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/games/${gameName}`
        )

        const listPlayers = response.data.list_of_players

        const sortedPlayers = listPlayers.sort(
          (a, b) => a.position - b.position
        )

        const position = sortedPlayers.findIndex(
          (player) => player.id === user.id
        )

        console.log(sortedPlayers)
        const userParams = {
          id: user.id,
          name: user.name,
          position
        }

        setUserValues(userParams)
        setPlayers(sortedPlayers)
        setTurn(sortedPlayers[0].id)

        if (user?.id === sortedPlayers[0].id) {
          setTurnState(turnStates.DRAW)
        } else {
          setTurnState(turnStates.NOTURN)
        }
      } catch (error) {
        console.error('Error al obtener los datos del juego:', error)
      }
    }
    fetchGameData()

    if (game?.nextCard === 'STAY_AWAY') {
      setDrawBG('/cards/rev/revTakeAway.png')
    } else if (game?.nextCard === 'PANIC') {
      setDrawBG('/cards/rev/revPanic.png')
    }
    fetchCards(user, setCardsPlayer)
  }, [])

  useEffect(() => {
    const eventJSON = JSON.parse(wsEvent)
    const eventType = eventJSON?.event
    if (eventType === 'game_ended') {
      fetchResultsGame(gameName, setContentModal, setButtons, setHandleFunction)
    } else if (eventType === 'game_deleted') {
      router.push('/search-game')
    } else if (eventType === 'cheat_used') {
      fetchCards(user, setCardsPlayer)
    } else {
      handlerTurn(eventJSON, user, setUserValues, players,game,cardsPlayer, turnSeters)
    }
  }, [wsEvent])

  return (
    <div className='table is-flex is-flex-direction-row'>
      <div className='table-cards is-flex is-flex-direction-column'>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            handleDragEnd(event, turnState, user, game, setCardsPlayer, players, setContentModal, setButtons, setHandleFunction)
          }} // as onChange
        >
          <Modal
            contentModal={contentModal}
            setContentModal={setContentModal}
            buttons={buttons}
            setButtons={setButtons}
            handleButtons={handleFunction}
            setHandleButtons={setHandleFunction}

          />

          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            <div
              className='room'
              style={{
                backgroundImage: 'url("/backgrounds/floorBG.gif")',
                backgroundSize: 'cover',
                boxShadow: '0 0 5px 5px #c3c4c6'
              }}
            >
              <div className='is-flex is-align-items-end is-justify-content-end item' />
              <div className='is-flex is-align-items-end is-justify-content-space-around item'>
                <Chair
                  rotation={0}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column has-text-centered'
                  player={players[0]}
                  turn={turn}
                />
                <Chair
                  rotation={0}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column has-text-centered'
                  player={players[1]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-end is-justify-content-space-around item'>
                <Chair
                  rotation={0}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column has-text-centered'
                  player={players[2]}
                  turn={turn}
                />
                <Chair
                  rotation={0}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column has-text-centered'
                  player={players[3]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-end is-justify-content-start item' />
              <div className='is-flex is-align-items-center is-justify-content-end item'>
                <Chair
                  rotation={-90}
                  size={120}
                  type='Right'
                  className='is-flex is-flex-direction-row has-text-centered'
                  player={players[11]}
                  turn={turn}
                />
              </div>
              <div
                className='is-flex is-justify-content-space-evenly is-align-items-center item table-cells'
                style={{
                  backgroundImage: 'url("/backgrounds/tableBG.png")',
                  backgroundSize: 'cover'
                }}
              >
                <img
                  id='deck'
                  src={drawBG}
                  width={180}
                  alt=''
                  style={{ borderRadius: '5%' }}
                  onClick={() => {
                    newCard(setCardsPlayer, turnState, userId, gameName)
                  }}
                />
                <PlayCard id='play-card' src={playBG} />
                <DiscardDeck id='discard-deck' src={discardBG} />
              </div>
              <div className='is-flex is-align-items-center is-justify-content-start item'>
                <Chair
                  rotation={90}
                  size={120}
                  type='Left'
                  className='is-flex is-flex-direction-row-reverse has-text-centered'
                  player={players[4]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-center is-justify-content-end item'>
                <Chair
                  rotation={-90}
                  size={120}
                  type='Left'
                  className='is-flex is-flex-direction-row has-text-centered'
                  player={players[10]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-center is-justify-content-start item'>
                <Chair
                  rotation={90}
                  size={120}
                  type='Right'
                  className='is-flex is-flex-direction-row-reverse has-text-centered'
                  player={players[5]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-start is-justify-content-end item' />
              <div className='is-flex is-align-items-start is-justify-content-space-around item'>
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[9]}
                  turn={turn}
                />
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[8]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-start is-justify-content-space-around item'>
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[7]}
                  turn={turn}
                />
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[6]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-start is-justify-content-start item item' />
            </div>
            <div
              className='cards is-flex is-flex-direction-row is-justify-content-center'
              style={{
                backgroundImage: 'url("/backgrounds/tableBG.png")',
                backgroundSize: 'cover',
                boxShadow: '0 0 5px 5px #138e5a'
              }}
            >
              {cardsPlayer.map((card, index) => {
                if (card) {
                  return (
                    <Card
                      id={card.id}
                      key={index}
                    />
                  )
                } else {
                  return <span key={index} />
                }
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div
        className='record-chat'
      >
        <Record />
        <Chat />
      </div>
    </div>
  )
}

export default Table
