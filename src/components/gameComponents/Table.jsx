'use client'

import '@/styles/Table.css'
import Chat from '../Chat'
import Card from './Card'
import DiscardDeck from './DiscardDeck'
import PlayCard from './PlayCard'
import Chair from './Chair'
import { useEffect, useState } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { sortCards } from '@/services/sortCards'
import { playCard } from '@/services/playCard'
import { discardCard } from '@/services/discardCard'
import { newCard } from '@/services/newCard'
import { useUserGame } from '@/services/UserGameContext'
import { useWebSocket } from '@/services/WebSocketContext'
import { handlerTurn, turnStates } from '@/services/handlerTurn'
// import { swapCards } from '@/services/swapCards'
import axios from 'axios'

export const handleDragEnd = (event, turnState, user, game, { setCardsPlayer, setPlayBG, setDiscardBG, setTurnState }) => {
  const { active, over } = event

  if (over.id === 'discard-deck' &&
    (turnState === turnStates.PLAY)) {
    // Discarding
    discardCard(setCardsPlayer, setDiscardBG, active.id, user?.id, game?.name)
    // para que no pueda descartar más de una vez
    // tener ojo con cartas que obliguen a alguien a descartar.
    setTurnState(turnState.NOTURN)
  } else if (over.id === 'play-card' && turnState === turnStates.PLAY) {
    // Playing
    const played = playCard(setCardsPlayer, setPlayBG, active.id)
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
    const response = await axios.get(`http://localhost:8000/players/${playerId}/hand`)
    const cards = await response.data.map((card) => {
      return {
        id: card.id, name: card.name
      }
    })
    setCardsPlayer(cards)
  } catch (error) {
    console.error('Error getting cards:', error)
  }
}

function Table () {
  const { user, game } = useUserGame()
  const wsObject = useWebSocket()
  const [cardsPlayer, setCardsPlayer] = useState([])
  const [playBG, setPlayBG] = useState('/cards/rev/109Rev.png')
  const [discardBG, setDiscardBG] = useState('/cards/rev/revPanic.png')
  const [drawBG, setDrawBG] = useState('/cards/rev/revTakeAway.png')
  const [turnState, setTurnState] = useState(turnStates.NOTURN)
  const [turn, setTurn] = useState(0)
  // Recordar cambiar a cero
  const items = [...cardsPlayer, 'discard-deck', 'play-card']
  const angle = [-15, -10, 10, 15, 20]
  const [players, setPlayers] = useState('Vacio')
  const wsEvent = wsObject.event
  const dragEndSeters = { setCardsPlayer, setPlayBG, setDiscardBG, setTurnState }
  const turnSeters = { setTurnState, setTurn, setDrawBG, setDiscardBG }

  useEffect(() => {
    const eventJSON = JSON.parse(wsEvent)
    handlerTurn(eventJSON, user?.id, turnSeters)
  }, [wsEvent])

  useEffect(() => {
    const gameName = game?.name
    const fetchGameData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/games/${gameName}`)
        const listPlayers = response.data.list_of_players
        const sortedPlayers = listPlayers.sort((a, b) => a.position - b.position)
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

  return (
    <div className='table is-flex is-flex-direction-row'>
      <div className='table-cards is-flex is-flex-direction-column'>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => { handleDragEnd(event, turnState, user, game, dragEndSeters) }} // as onChange
        >
          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            <div
              className='room'
              style={
                {
                  backgroundImage: 'url("/backgrounds/floorBG.gif")',
                  backgroundSize: 'cover',
                  boxShadow: '0 0 5px 5px #c3c4c6'
                }
              }
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
                  player={players[4]}
                  turn={turn}
                />
              </div>
              <div
                className='is-flex is-justify-content-space-evenly is-align-items-center item table-cells'
                style={
                  {
                    backgroundImage: 'url("/backgrounds/tableBG.png")',
                    backgroundSize: 'cover'
                  }
                }
              >
                <img
                  id='deck'
                  src={drawBG}
                  width={180}
                  alt=''
                  style={{ borderRadius: '5%' }}
                  onClick={() => { newCard(setCardsPlayer, setTurnState, turnState) }}
                />
                <PlayCard
                  id='play-card'
                  src={playBG}
                />
                <DiscardDeck
                  id='discard-deck'
                  src={discardBG}
                />
              </div>
              <div className='is-flex is-align-items-center is-justify-content-start item'>
                <Chair
                  rotation={90}
                  size={120}
                  type='Left'
                  className='is-flex is-flex-direction-row-reverse has-text-centered'
                  player={players[5]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-center is-justify-content-end item'>
                <Chair
                  rotation={-90}
                  size={120}
                  type='Left'
                  className='is-flex is-flex-direction-row has-text-centered'
                  player={players[6]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-center is-justify-content-start item'>
                <Chair
                  rotation={90}
                  size={120}
                  type='Right'
                  className='is-flex is-flex-direction-row-reverse has-text-centered'
                  player={players[7]}
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
                  player={players[8]}
                  turn={turn}
                />
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[9]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-start is-justify-content-space-around item'>
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[10]}
                  turn={turn}
                />
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[11]}
                  turn={turn}
                />
              </div>
              <div className='is-flex is-align-items-start is-justify-content-start item item' />
            </div>
            <div
              className='cards is-flex is-flex-direction-row is-justify-content-center'
              style={
                {
                  backgroundImage: 'url("/backgrounds/tableBG.png")',
                  backgroundSize: 'cover',
                  boxShadow: '0 0 5px 5px #138e5a'
                }
              }
            >
              {

                cardsPlayer.map((card, index) => {
                  if (card) {
                    return (
                      <Card id={card.id} key={index} rotation={angle[card.id - 1]} />
                    )
                  } else {
                    return <span key={index} />
                  }
                })

              }
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div
        className='chat has-text-centered column is-flex is-flex-direction-column is-justify-content-space-evenly'
        style={{
          backgroundColor: 'grey'
        }}
      >
        <Chat />
      </div>
    </div>
  )
}

export default Table
