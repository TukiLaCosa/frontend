export const turnStates = {
  NOTURN: 'NOTURN',
  DRAW: 'DRAW',
  PLAY: 'PLAY'
  // EXCHANGE: 'EXCHANGE'
}
 
export const handlePlayedCardEvent = () => {

}


export const handlePlayerEliminated = (eventTurn, setShowModal,setEliminatedPlayerName,setEliminatedPlayerId) => {
  setEliminatedPlayerId(eventTurn?.player_id)
  setEliminatedPlayerName(eventTurn?.player_name)
  console.log("estoy a punto de setear el MODAL")
  setShowModal("playerEliminated")
  /**
   * Aqui tengo que llamar a una funcion que haga el poppeo de los players, tiene que tomar el arreglo players modificarlo y setear nuevamente el estado "players":
  popPlayer(eliminatedId)
  */
}
export const handlerTurn = (eventTurn, userID, { setTurnState, setTurn, setDrawBG, setDiscardBG , setShowModal, setEliminatedPlayerName,setEliminatedPlayerId}) => {
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
        //handlePlayedCardEvent()
        setTurnState(turnStates.NOTURN)
      }
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
      setDiscardBG(eventTurn?.card_id)
      break
    case 'player_eliminated':
      console.log("el jugador quemado es",eventTurn?.player_name)
      handlePlayerEliminated(eventTurn, setShowModal,setEliminatedPlayerName,setEliminatedPlayerId)
      setTurnState(turnStates.NOTURN)
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
    default:
      break
  }
}
