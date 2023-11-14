import { fetchCards } from '@/components/gameComponents/Table'
import { exchangeIntention, exchangeResponse } from './exchange'
import { setPath } from './setPath'
import { defendChangePlaces, setFPlayers } from './plays/playChangePlaces'
import { defendBetterRun } from './plays/playBetterRun'
import axiosClient from './http-client/axios-client'
import { defenseFlamethrower } from './defense/defenseFlamethrower'
import { defenseSeduction } from './defense/defenseSeduction'

export const turnStates = {
  NOTURN: 'NOTURN',
  DRAW: 'DRAW',
  PLAY: 'PLAY',
  EXCHANGE: 'EXCHANGE'
}

export const isNeighbor = (players, idPlayer, idNeighbor) => {
  console.log('players: ', players)
  console.log('idPlayer:', idPlayer)
  console.log('idVecino: ', idNeighbor)
  const playersAlive = players.filter((player) => player.position !== -1)
  const myIndex = playersAlive.findIndex((player) => player.id === idPlayer)
  const neiIndex = playersAlive.findIndex((player) => player.id === idNeighbor)
  console.log('My index: ', myIndex, 'index vecino: ', neiIndex)
  const left = (myIndex + 1) % playersAlive.length
  const right = (myIndex - 1) % playersAlive.length
  console.log('left: ', left, 'right: ', right)
  console.log('resultado: ', left === neiIndex || right === neiIndex)
  return left === neiIndex || right === neiIndex
}

export const setInfected = async (userId, setUserValues, setGameValues, infectedEvent, setContentModal) => {
  if (infectedEvent.infected_id === userId) {
    await setUserValues({ status: 'INFECTED' })
    await setContentModal('Has sido infectado por ' + infectedEvent.the_thing_name)
    await setGameValues({ theThing: infectedEvent.the_thing_id })
  } else if (infectedEvent.the_thing_id === userId) {
    await setContentModal('Has infectado a ' + infectedEvent.infected_name)
  }
}

export const getPlayerName = (players, playerId) => {
  console.log('Datos entrada:', players, playerId)
  const playerIndex = players?.findIndex((player) => player.id === playerId)
  const playerName = players[playerIndex]?.name
  console.log('getPlayerName:', playerIndex, playerName)
  return playerName
}

export const handleExchangeDone = async (playerID, setCardsPlayer) => {
  await fetchCards(playerID, setCardsPlayer)
}

export const handleExchangeIntention = async (eventTurn, userId, setContentModal, gameName, cards, players) => {
  const playerName = getPlayerName(players, eventTurn.player_id)
  await setContentModal(`${playerName} debe intercambiar carta con vos! A continuacion debes seleccionar una carta para intercambiar.`)
  const selectionHandler = async (e) => {
    await exchangeResponse(e.target.dataset.cardId, userId, gameName)
    const removeEventListeners = () => {
      cards.forEach(card => {
        const element = document.getElementById(`card_${card.id}`)
        element.removeEventListener('mousedown', selectionHandler)
      })
    }
    removeEventListeners()
  }

  const cardIds = cards.map(card => card.id)
  console.log('handler turn Cards', cards)
  const theThing = cardIds.includes(1)
  console.log('handler turn i am thething', theThing)
  const infectedCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
  const panicCards = [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108]
  cards.forEach(card => {
    if (theThing && !panicCards.includes(card.id)) {
      if (card.id !== 1) {
        const element = document.getElementById(`card_${card.id}`)
        element.dataset.cardId = card.id
        element.addEventListener('mousedown', selectionHandler)
      }
    } else {
      if (!infectedCards.includes(card.id) && !panicCards.includes(card.id)) {
        const element = document.getElementById(`card_${card.id}`)
        element.dataset.cardId = card.id
        element.addEventListener('mousedown', selectionHandler)
      }
    }
  })
}

export const handleInterchange = async (setContentModal, userId, gameName, cards) => {
  console.log(cards)
  await setContentModal('Selecciona una carta para intercambiar')

  const selectionHandler = (e) => {
    exchangeIntention(e.target.dataset.cardId, userId, gameName)

    const removeEventListeners = () => {
      cards.forEach(card => {
        const element = document.getElementById(`card_${card.id}`)
        element.removeEventListener('mousedown', selectionHandler)
      })
    }
    removeEventListeners()
  }

  const cardIds = cards.map(card => card.id)
  console.log('handler turn Cards ids', cardIds)
  const theThing = cardIds.includes(1)
  console.log('handler turn i am thething', theThing)
  const infectedCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
  const panicCards = [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108]
  cards.forEach(card => {
    if (theThing) {
      if (card.id !== 1) {
        const element = document.getElementById(`card_${card.id}`)
        element.dataset.cardId = card.id
        element.addEventListener('mousedown', selectionHandler)
      }
    } else {
      if (!infectedCards.includes(card.id) && !panicCards.includes(card.id)) {
        const element = document.getElementById(`card_${card.id}`)
        element.dataset.cardId = card.id
        element.addEventListener('mousedown', selectionHandler)
      }
    }
  })
}

export const handlePlayerEliminated = async (eventTurn, setPlayers, players) => {
  const newPlayers = [...players]
  const index = newPlayers.findIndex((player) => player.id === eventTurn?.eliminated_player_id)
  if (newPlayers[index] !== undefined) {
    newPlayers[index].position = -1
  }
  await setPlayers(newPlayers)
  const elem = document.getElementById(eventTurn?.eliminated_player_id)
  elem?.removeAttribute('is-success')
  elem?.setAttribute('class', 'button is-danger')
}

export const handlerWhisky = async (playerId, playerName, setContentModal, setButtons, setHandleFunction) => {
  try {
    const response = await axiosClient.get(
      `players/${playerId}/hand`
    )
    const data = response.data
    const cards = await data.map((card) => {
      return {
        id: card.id,
        name: card.name
      }
    })
    const cardNames = cards.map((card) => card.name)
    const cardNamesString = cardNames.join(', ')

    // const cardIDs = cards.map((card) => card.id) // obtengo los id de las cartas. Por ahora no los uso
    // const cardIDsString = cardIDs.join(', ')
    const buttons = [
      {
        text: 'Entendido',
        value: true
      }
    ]
    setButtons(buttons)
    const handleEntendido = (value) => {
      setContentModal('')
    }
    setHandleFunction(() => handleEntendido)
    setContentModal(`Las cartas de ${playerName} son: ${cardNamesString}`)
  } catch (error) {
    console.error('Error getting cards:', error)
  }
}

export const handlerTurn = async (eventTurn, user, setUserValues, players, game, cards, setGameValues,
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
        await setTurnState(turnStates.NOTURN)
      } else if (eventTurn?.next_player_id === userID) {
        await setTurnState(turnStates.DRAW)
      }
      await setGameValues({ turn: eventTurn?.next_player_id })
      await setTurn(eventTurn?.next_player_id)
      break
    case 'played_card':
      // eslint-disable-next-line no-case-declarations
      const cardWithIntention = ['Seducción', 'Lanzallamas', '¡Cambio de lugar!', '¡Más vale que corras!']
      if (eventTurn?.player_id === userID &&
        (!cardWithIntention.includes(eventTurn?.card_name))
      ) {
        await handleInterchange(setContentModal, userID, gameName, cards)
      }
      await setPlayBG(setPath(eventTurn?.card_id))
      await setNewRecord(`${eventTurn?.player_name} jugó la carta ${eventTurn?.card_name}`)
      break
    case 'player_draw_card':
      if (eventTurn?.player_id === userID) {
        await setTurnState(turnStates.PLAY)
      }
      if (eventTurn?.next_card === 'STAY_AWAY') {
        await setDrawBG('/cards/rev/revTakeAway.png')
      } else if (eventTurn?.next_card === 'PANIC') {
        await setDrawBG('/cards/rev/revPanic.png')
      }
      break
    case 'discard_card':
      if (eventTurn?.card_type === 'STAY_AWAY') {
        await setDiscardBG('/cards/rev/revTakeAway.png')
      } else if (eventTurn?.card_type === 'PANIC') {
        await setDiscardBG('/cards/rev/revPanic.png')
      }
      if (eventTurn.player_id === userID) {
        await setTurnState(turnStates.EXCHANGE)
        await handleInterchange(setContentModal, userID, gameName, cards)
      }
      break
    case 'player_eliminated':
      await handlePlayerEliminated(eventTurn, setPlayers, players)
      // eslint-disable-next-line no-case-declarations
      const msg = '' + eventTurn?.eliminated_player_name + ' eliminado por ' + eventTurn?.killer_player_name
      await setNewRecord(msg)
      if (eventTurn?.eliminated_player_id === user.id) {
        setUserValues({
          id: user.id,
          name: user.name,
          position: -1
        })
      }
      if (eventTurn?.killer_player_id === user.id) {
        await setTurnState(turnStates.EXCHANGE)
        await handleInterchange(setContentModal, userID, gameName, cards)
      }
      break
    case 'exchange_intention':
      await handleExchangeIntention(eventTurn, userID, setContentModal, gameName, cards, players)
      break
    case 'exchange_done':
      if (eventTurn.player_name === user?.name) {
        await setTurnState(turnStates.EXCHANGE)
      }
      await handleExchangeDone(userID, setCardsPlayer)
      await setNewRecord(`${eventTurn.player_name} intercambio carta con el jugador: ${eventTurn.objective_player_name}`)
      break
    case 'whiskey_card_played':
      await handlerWhisky(eventTurn?.player_id, eventTurn?.player_name, setContentModal, setButtons, setHandleFunction)
      break
    case 'change_places':
      await defendChangePlaces(userID, gameName, eventTurn, setContentModal, setButtons, setHandleFunction, setCardsPlayer)
      break
    case 'better_run':
      await defendBetterRun(userID, gameName, eventTurn, setContentModal, setButtons, setHandleFunction, setCardsPlayer)
      break
    case 'change_done':
      await setFPlayers(gameName, setPlayers, eventTurn, setNewRecord)
      if (eventTurn.player_id === user.id) {
        await setTurnState(turnStates.EXCHANGE)
        await handleInterchange(setContentModal, userID, gameName, cards)
      }
      break
    case 'flamethrower':
      (async () => {
        try {
          await defenseFlamethrower(eventTurn?.defense_cards, userID, game?.name, setContentModal, setButtons, setHandleFunction, setCardsPlayer)
        } catch (error) {
          console.error('Error al manejar el evento:', error)
        }
      })()
      break
    case 'exchange_offer':
      (async () => {
        try {
          const defenseResult = await defenseSeduction(eventTurn?.defense_cards, userID, game?.name, setContentModal, setButtons, setHandleFunction, setCardsPlayer)
          if (!defenseResult) {
            await setTurnState(turnStates.EXCHANGE)
            await handleExchangeIntention(eventTurn, userID, setContentModal, gameName, cards, players)
          }
        } catch (error) {
          console.error('Error al manejar el evento:', error)
        }
      })()
      break
    case 'defense_card_played':
      // eslint-disable-next-line no-case-declarations
      const objectiveName = getPlayerName(players, eventTurn?.objective_player_id)
      // eslint-disable-next-line no-case-declarations
      const playerName = getPlayerName(players, eventTurn?.player_id)
      // eslint-disable-next-line no-case-declarations
      const defendedAction = {
        exchange_offer: 'un intercambio de cartas',
        change_places: 'un intercambio de lugares',
        better_run: 'un intercambio de lugares',
        flamethrower: 'un lanzallamazo'
      }
      await setNewRecord('El jugador ' + objectiveName + ' se defendio de ' + defendedAction[eventTurn?.action_type] + ' lanzado por ' + playerName)
      if (eventTurn?.player_id === userID &&
        eventTurn?.action_type !== 'exchange_offer') {
        await setTurnState(turnStates.EXCHANGE)
        await handleInterchange(setContentModal, userID, gameName, cards)
      } else if (eventTurn?.objective_player_id === userID &&
        eventTurn?.card_id >= 73 &&
        eventTurn?.card_id <= 76) {
        await setContentModal('La carta que quisieron intercambiarte era ' + eventTurn?.card_to_exchange)
      }
      break
    case 'suspicious_card_played':
      await setContentModal(`La carta revelada del jugador es:${eventTurn.card_name}. A continuacion debes elegir una carta para intercambiar.`)
      break
    case 'analysis_card_played':
      await setContentModal(`Las cartas de ${eventTurn?.player_name} son: ${eventTurn?.cards}. A continuacion debes elegir una carta para intercambiar.`)
      break
    case 'new_infected':
      await setInfected(userID, setUserValues, setGameValues, eventTurn, setContentModal)
      if (userID === eventTurn.infected_id && isNeighbor(players, userID, eventTurn.the_thing_id)) {
        await setTurn(userID)
        await setTurnState(turnStates.DRAW)
      } else if (userID === eventTurn.the_thing_id && isNeighbor(players, userID, eventTurn.infected_id)) {
        await setTurn(eventTurn.the_thing_i)
        await setTurnState(turnStates.NOTURN)
      }
      break
    default:
      break
  }
}
