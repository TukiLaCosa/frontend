import { fetchCards } from '@/components/gameComponents/Table'
import { exchangeIntention, exchangeResponse } from './exchange'
import { setPath } from './setPath'
import axios from 'axios'
import { defenseFlamethrower } from './defense/defenseFlamethrower'

export const turnStates = {
  NOTURN: 'NOTURN',
  DRAW: 'DRAW',
  PLAY: 'PLAY',
  EXCHANGE: 'EXCHANGE'
}

export const handleExchangeDone = (playerID, setCardsPlayer) => {
  fetchCards(playerID, setCardsPlayer)
}

export const handleExchangeIntention = (eventTurn, userId, setContentModal, gameName, cards) => {
  setContentModal(`${eventTurn.player_name} debe intercambiar carta con vos! A continuacion debes seleccionar una carta para intercambiar.`)
  const selectionHandler = (e) => {
    exchangeResponse(e.target.dataset.cardId, userId, gameName, eventTurn)
    // removes eventlistener:
    const removeEventListeners = () => {
      cards.forEach(card => {
        const element = document.getElementById(`card_${card.id}`)
        element.removeEventListener('click', selectionHandler)
      })
    }
    removeEventListeners()
  }
  //check if I am theThing
  let theThing = false
  cards.forEach(card => {
    if (card.name === 'La Cosa') { 
      theThing = true
    } 
  })
  // make cards clickeables
  console.log(theThing)
  cards.forEach(card => {
    if (theThing) { // make all cards clickeable except LaCosa
      if (card.name !== 'La Cosa'){
        const element = document.getElementById(`card_${card.id}`)
        element.dataset.cardId = card.id
        element.addEventListener('click', selectionHandler)  
      }  
    }
    else {
      if ((card.name !== '¡Infectado!')) {
        const element = document.getElementById(`card_${card.id}`)
        element.dataset.cardId = card.id
        element.addEventListener('click', selectionHandler)
      }    
    }
  })
}

export const handleInterchange = (setContentModal, userId, gameName, cards) => {
  console.log(cards)
  setContentModal('Selecciona una carta para intercambiar')
  // make cards clickeables
  const selectionHandler = (e) => {
    exchangeIntention(e.target.dataset.cardId, userId, gameName)
    // removes eventlistener:
    const removeEventListeners = () => {
      cards.forEach(card => {
        const element = document.getElementById(`card_${card.id}`)
        element.removeEventListener('click', selectionHandler)
      })
    }
    removeEventListeners()
  }
  //check if I am theThing
  let theThing = false
  cards.forEach(card => {
    if (card.name === 'La Cosa') { 
      theThing = true
    } 
  })
  // make cards clickeables
  console.log(theThing)
  cards.forEach(card => {
    if (theThing) { // make all cards clickeable except LaCosa
      if (card.name !== 'La Cosa'){
        const element = document.getElementById(`card_${card.id}`)
        element.dataset.cardId = card.id
        element.addEventListener('click', selectionHandler)  
      }  
    }
    else {
      if ((card.name !== '¡Infectado!')) {
        const element = document.getElementById(`card_${card.id}`)
        element.dataset.cardId = card.id
        element.addEventListener('click', selectionHandler)
      }    
    }
  })
}

export const handlePlayerEliminated = (eventTurn, setPlayers, players) => {
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

export const handlerWhisky = async (playerId, playerName, setContentModal, setButtons, setHandleFunction) => {
  try { // esto es un fetchCards (o sea, el servicio), pero todavia no lo tengo mergeado
    const response = await axios.get(
      `http://localhost:8000/players/${playerId}/hand` // luego de este get, se deben mostrar las cartas a todos los demas jugadores
    )
    const data = response.data // guardo los datos q traigo en data
    const cards = await data.map((card) => { // mapea los datos q trae
      return {
        id: card.id,
        name: card.name
      }
    })
    const cardNames = cards.map((card) => card.name) // obtengo solo el nombre de las cartas
    const cardNamesString = cardNames.join(', ') // las uno

    const cardIDs = cards.map((card) => card.id) // obtengo los id de las cartas. Por ahora no los uso
    const cardIDsString = cardIDs.join(', ')
    // modal
    const buttons = [
      {
        text: 'Entendido',
        value: true
      }
    ]
    setButtons(buttons)
    const handleEntendido = (value) => {
      setContentModal('') // solo debe cerrarse el modal. Ver esto luego del merge con lo del intercambio
    }
    setHandleFunction(() => handleEntendido)
    setContentModal(`Las cartas de ${playerName} son: ${cardNamesString}`) // POSIBLE MEJORA: TENIENDO LOS ID DE LAS CARTAS, RENDERIZAR LAS CARTAS
  } catch (error) {
    console.error('Error getting cards:', error)
  }
}

export const handlerTurn = (eventTurn, user, setUserValues, players, game, cards,
  {
    setTurnState, setTurn, setDrawBG, setDiscardBG,
    setPlayBG, setPlayers, setNewRecord,
    setContentModal, setButtons, setHandleFunction, setCardsPlayer
  }) => {
  const userID = user?.id
  const gameName = game?.name
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
        handleInterchange(setContentModal, userID, gameName, cards)
      }
      // setNewRecord(`${eventTurn.player_name} Jugo la carta: ${eventTurn.card_name}`)
      setPlayBG(setPath(eventTurn?.card_id))
      setNewRecord(`${eventTurn?.player_name} jugó la carta ${eventTurn?.card_name}`) // log para la whisky
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
      if (eventTurn.player_id === userID) { // EL BACK NO ESTA MANDANDO EL IDPLYAER
        setTurnState(turnStates.EXCHANGE)
        handleInterchange(setContentModal, userID, gameName, cards)
      }
      break
    case 'player_eliminated':
      handlePlayerEliminated(eventTurn, setPlayers, players)
      const msg = '' + eventTurn?.player_name + ' eliminado por ' + eventTurn?.killer_player_name
      setNewRecord(msg)
      setUserValues({
        id: user.id,
        name: user.name,
        position: eventTurn?.players_positions[userID]
      })
      break
    case 'exchange_intention':
      handleExchangeIntention(eventTurn, userID, setContentModal, gameName, cards)
      break
    case 'exchange_card_start':
      break
    case 'exchange_card_accept':
      break
    case 'exchange_card_finish':
      break
    case 'exchange_done':
      handleExchangeDone(userID, setCardsPlayer)
      setNewRecord(`${eventTurn.player_name} Intercambio carta con el jugador: ${eventTurn.objective_player_name}`)
      break
    case 'seduction_done':
      fetchCards(userID, setCardsPlayer)
      break
    case 'whiskey_card_played':
      handlerWhisky(eventTurn?.player_id, eventTurn?.player_name, setContentModal, setButtons, setHandleFunction)
      break
    case 'flamethrower':
      defenseFlamethrower(eventTurn?.defense_cards, userID, game?.name, setContentModal, setButtons, setHandleFunction, setCardsPlayer)
      break
    default:
      break
  }
}
