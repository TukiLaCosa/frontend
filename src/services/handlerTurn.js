import { fetchCards } from '@/components/gameComponents/Table'
import { exchangeIntention, exchangeResponse } from './exchange'
import { setPath } from './setPath'

export const turnStates = {
  NOTURN: 'NOTURN',
  DRAW: 'DRAW',
  PLAY: 'PLAY',
  EXCHANGE: 'EXCHANGE'
}

export const handleExchangeDone = (user,setCardsPlayer) => {
  fetchCards(user,setCardsPlayer)
}


/*
handleExchangeIntention deberia: 
1. Mostrar el modalp que avisa que alguienq  uiere iontercambiar con vosCards
*/

export const handleExchangeIntention = (eventTurn, userId,setContentModal,gameName, cards) => {  
  setContentModal(`${eventTurn.player_name} debe intercambiar carta con vos! A continuacion debes seleccionar una carta para intercambiar.`)
  //make cards clickeables
  const selectionHandler = (e) => {
    exchangeResponse(e,userId,gameName, eventTurn)
    //removes eventlistener:
   const removeEventListeners = () => {
    cards.forEach(card => {
      const element = document.getElementById(`card_${card.id}`)
      element.removeEventListener('click', selectionHandler)
    })
    } 
    removeEventListeners()
  }
  cards.forEach(card => {
    const element = document.getElementById(`card_${card.id}`)
    //const id = element.split("card_")[1]
    element.addEventListener('click',(e) => selectionHandler(card.id))
  })
  
}

export const handleInterchange = (setContentModal,userId,gameName,cards) => {
  console.log(cards)
  setContentModal('Selecciona una carta para intercambiar')
  //make cards clickeables
  const selectionHandler = (id) => {
    exchangeIntention(id,userId,gameName)
    //removes eventlistener:
   const removeEventListeners = () => {
      cards.forEach(card => {
      const element = document.getElementById(`card_${card.id}`)
      element.removeEventListener('click', selectionHandler)
      })
    } 
    removeEventListeners()
  }
  cards.forEach(card => {
    const element = document.getElementById(`card_${card.id}`)
    //const id = element.split("card_")[1]
    element.addEventListener('click',(e) => selectionHandler(card.id))
  })
}

export const handlePlayerEliminated = (eventTurn, setPlayers, players) => {
  console.log(players)
  const newPlayers = [...players]
  const index = newPlayers.findIndex((player) => player.id === eventTurn?.eliminated_player_id)
  if (newPlayers[index] !== undefined) {
    newPlayers[index].position = -1
  }
  setPlayers(newPlayers)
  const elem = document.getElementById(eventTurn?.eliminated_player_id)
  elem?.removeAttribute('is-success')
  elem?.setAttribute('class', 'button is-danger')
}

export const handlerTurn = (eventTurn, user, setUserValues, players,game,cards,
  {
    setTurnState, setTurn, setDrawBG, setDiscardBG, setPlayBG, setPlayers, setNewRecord, setContentModal,setCardsPlayer
  }) => {
  const userID = user?.id
  const gameName = game.name
  switch (eventTurn?.event) {
    case 'message':
      break
    case 'new_turn':
      if (eventTurn?.next_player_id !== userID) {
        setTurnState(turnStates.NOTURN)
      } else if (eventTurn?.next_player_id === userID) {
        setTurnState(turnStates.DRAW)
      }
      setTurn(eventTurn?.next_player_id)
      break
    case 'played_card':
      if (eventTurn?.player_id === userID) {
        setTurnState(turnStates.EXCHANGE)
        handleInterchange(setContentModal,userID,gameName,cards)
      }
      //setNewRecord(`${eventTurn.player_name} Jugo la carta: ${eventTurn.card_name}`)
      setPlayBG(setPath(eventTurn?.card_id))
      break
    case 'player_draw_card':
      if (eventTurn?.player_id === userID) {
        setTurnState(turnStates.PLAY)
      }
      if (eventTurn?.next_card === 'STAY_AWAY') {
        setDrawBG('/cards/rev/revTakeAway.png')
      } else if (eventTurn?.next_card === 'PANIC') {
        setDrawBG('/cards/rev/revPanic.png')
      }
      break
    case 'discard_card':
      if (eventTurn?.card_type === 'STAY_AWAY') {
        setDiscardBG('/cards/rev/revTakeAway.png')
      } else if (eventTurn?.card_type === 'PANIC') {
        setDiscardBG('/cards/rev/revPanic.png')
      }
      if (eventTurn.player_id == userID) { // EL BACK NO ESTA MANDANDO EL IDPLYAER
        setTurnState(turnStates.EXCHANGE)
        handleInterchange(setContentModal,userID,gameName,cards)
      }
      break
    case 'player_eliminated':
      handlePlayerEliminated(eventTurn, setPlayers, players)
      const msg = '' + eventTurn?.killer_player_name + ' eliminado por ' + eventTurn?.player_name
      setNewRecord(msg)
      setUserValues({
        id: user.id,
        name: user.name,
        position: eventTurn?.players_positions[userID]
      })
      break
    case 'exchange_intention':
      handleExchangeIntention(eventTurn,userID, setContentModal,gameName,cards)
      break
    case 'exchange_card_start':
      break
    case 'exchange_card_accept':
      break
    case 'exchange_card_finish':
      break
    case 'exchange_done':
    handleExchangeDone(user, setCardsPlayer)
    setNewRecord(`${eventTurn.player_name} Intercambio carta con el jugador: ${eventTurn.player_objective}`) 
      break
    default:
      break
  }
}
