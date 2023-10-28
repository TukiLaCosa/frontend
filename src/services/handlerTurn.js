import { setPath } from './setPath'
import { fetchCards } from './fetchCards'

export const turnStates = {
  NOTURN: 'NOTURN',
  DRAW: 'DRAW',
  PLAY: 'PLAY',
  EXCHANGE: 'EXCHANGE'
}

export const handleExchangeDone = (userId, setCardsPlayer) => {
  fetchCards(userId, setCardsPlayer)
}

export const handleExchangeIntention = (eventTurn, setShowModal) => {
    setShowModal('exchange-response')
}

export const handlePlayerEliminated = (eventTurn, setShowModal, setEliminatedPlayerName, setEliminatedPlayerId, setPlayers, players) => {
  setEliminatedPlayerId(eventTurn?.player_id)
  setEliminatedPlayerName(eventTurn?.player_name)
  const updatedListPlayers = players.filter(player => player.id !== eventTurn?.player_id)
  setPlayers(updatedListPlayers)
  setShowModal('playerEliminated')
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
        //setTurnState(turnStates.EXCHANGE)
        //handlePlayedCardEvent()
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
      handleExchangeIntention(eventTurn, setShowModal)
      break
    case 'exchange_card_start':
      break
    case 'exchange_card_accept':
      break
    case 'exchange_card_finish':
      break
    case 'exchange_done':
      handleExchangeDone(user, setCardsPlayer)
      break
    default:
      break
  }
}
