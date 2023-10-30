import { setPath } from './setPath'
import axios from 'axios'

export const turnStates = {
  NOTURN: 'NOTURN',
  DRAW: 'DRAW',
  PLAY: 'PLAY'
  // EXCHANGE: 'EXCHANGE'
}

export const handlePlayedCardEvent = () => {

}

export const handlePlayerEliminated = (eventTurn, setShowModal, setEliminatedPlayerName, setEliminatedPlayerId, setPlayers, players) => {
  setEliminatedPlayerId(eventTurn?.player_id)
  setEliminatedPlayerName(eventTurn?.player_name)
  const updatedListPlayers = players.filter(player => player.id !== eventTurn?.player_id)
  setPlayers(updatedListPlayers)
  setShowModal('playerEliminated')
}

export const handlerWhisky = async (playerId, setCardsPlayer) => {
  try { // esto es un fetchCards (o sea, el servicio), pero todavia no lo tengo mergeado
    const response = await axios.get(
      `http://localhost:8000/players/${playerId}/hand`
    )
    const cards = await response.data.map((card) => { // mapea los datos q trae
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

export const handlerTurn = (eventTurn, user, setUserValues, players,
  {
    setTurnState, setTurn, setDrawBG, setDiscardBG, setPlayBG, setShowModal,
    setEliminatedPlayerName, setEliminatedPlayerId, setPlayers, setCardsPlayer
  }) => {
  const userID = user.id
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
        // setTurnState(turnStates.EXCHANGE)
        // handlePlayedCardEvent()
      }
      setPlayBG(setPath(eventTurn?.card_id))
      // que todos visualicen que se jugo.
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
      break
    case 'player_eliminated':
      handlePlayerEliminated(eventTurn, setShowModal, setEliminatedPlayerName, setEliminatedPlayerId, setPlayers, players)
      setUserValues({
        id: user.id,
        name: user.name,
        position: eventTurn?.players_positions[userID]
      })
      break
    case 'exchange_intention':
      break
    case 'exchange_card_start':
      break
    case 'exchange_card_accept':
      break
    case 'exchange_card_finish':
      break
    case 'exchange_done':
      break
    case 'whiskey_card_played':
      // una vez que se le pega a este endpoint, se hace un fetch de las cartas del jugador
      handlerWhisky(eventTurn?.player_id, setCardsPlayer)
    default:
      break
  }
}
