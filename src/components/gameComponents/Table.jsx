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
// import { swapCards } from '@/services/swapCards'
import axios from 'axios'

const cardsPlayerMock = [
  { id: 1, name: '1' },
  { id: 99, name: '2' },
  { id: 32, name: '3' },
  { id: 50, name: '4' }
]
export const turnStates = {
  NOTURN: 'NOTURN',
  DRAW: 'DRAW',
  PLAY: 'PLAY',
  DISCARD: 'DISCARD',
  EXCHANGE: 'EXCHANGE'
}
const { wsEvent } = useWebSocket()

export const handleDragEnd = (event, turnState, { setCardsPlayer, setPlayBG, setDiscardBG, setTurnState }) => {
  const { active, over } = event

  if (over.id === 'discard-deck' &&
    (turnState === turnStates.DISCARD ||
    turnState === turnStates.PLAY)) {
    // Discarding
    discardCard(setCardsPlayer, setDiscardBG, active.id)
    setTurnState(turnStates.EXCHANGE)
  } else if (over.id === 'play-card' && turnState === turnStates.PLAY) {
    // Playing
    playCard(setCardsPlayer, setPlayBG, active.id)
    setTurnState(turnStates.EXCHANGE)
  } else {
    // Just sorting
    sortCards(setCardsPlayer, over.id, active.id)
    // se puede dar un over.id a arrastrar las cartas para que sea posible aunque no sea el turno
  }
}

function Table () {
  const [cardsPlayer, setCardsPlayer] = useState(cardsPlayerMock)
  const [playBG, setPlayBG] = useState('/cards/rev/109Rev.png')
  const [discardBG, setDiscardBG] = useState('/cards/rev/revPanic.png')
  const [turnState, setTurnState] = useState(turnStates.DRAW)
  // Recordar cambiar a cero
  const items = [...cardsPlayer, 'discard-deck', 'play-card']
  const angle = [-15, -10, 10, 15, 20]
  const [players, setPlayers] = useState('Vacio')
  const { game } = useUserGame()
  const dragEndSeters = { setCardsPlayer, setPlayBG, setDiscardBG, setTurnState }

  useEffect(() => {
    const eventJSON = JSON.parse(wsEvent)
    if (eventJSON?.event === 'message') return
  }, [wsEvent])

  useEffect(() => {
    const gameName = game?.name
    const gameData = axios.get(`http://localhost:8000/games/${gameName}`)
      .then((data) => {
        console.log(data)
        setPlayers(data.data.list_of_players)
      })
    if (!gameData?.ok) {
      console.log(gameData)
    }
  }, [])

  return (
    <div className='table is-flex is-flex-direction-row'>
      <div className='table-cards is-flex is-flex-direction-column'>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => { handleDragEnd(event, turnState, dragEndSeters) }} // as onChange
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
                />
                <Chair
                  rotation={0}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column has-text-centered'
                  player={players[1]}
                />
              </div>
              <div className='is-flex is-align-items-end is-justify-content-space-around item'>
                <Chair
                  rotation={0}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column has-text-centered'
                  player={players[2]}
                />
                <Chair
                  rotation={0}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column has-text-centered'
                  player={players[3]}
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
                  // src={deckCard} y pasamos setDeckCard a newCard?
                  src='/cards/rev/revTakeAway.png'
                  width={180}
                  alt=''
                  style={{ borderRadius: '5%' }}
                  onClick={() => { newCard(setCardsPlayer, setTurnState, turnState, turnStates) }}
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
                />
              </div>
              <div className='is-flex is-align-items-center is-justify-content-end item'>
                <Chair
                  rotation={-90}
                  size={120}
                  type='Left'
                  className='is-flex is-flex-direction-row has-text-centered'
                  player={players[6]}
                />
              </div>
              <div className='is-flex is-align-items-center is-justify-content-start item'>
                <Chair
                  rotation={90}
                  size={120}
                  type='Right'
                  className='is-flex is-flex-direction-row-reverse has-text-centered'
                  player={players[7]}
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
                />
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[9]}
                />
              </div>
              <div className='is-flex is-align-items-start is-justify-content-space-around item'>
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[10]}
                />
                <Chair
                  rotation={180}
                  size={200}
                  type='Whole'
                  className='is-flex is-flex-direction-column-reverse has-text-centered'
                  player={players[11]}
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
                      <Card id={card.id} key={card.id} rotation={angle[card.id - 1]} />
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
