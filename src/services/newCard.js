import axios from 'axios'
import { addToHand } from './addToHand'
import { useUserGame } from './UserGameContext'
import { turnStates } from './handlerTurn'

export const newCard = async (setCardsPlayer, turnState) => {
  const { user, game } = useUserGame()

  if (turnState === turnStates.DRAW) {
    const userId = user?.id
    const gameName = game?.name
    const body = { player_id: userId }
    const url = `http://localhost:8000/games/${gameName}/draw-card`
    const response = await axios.patch(url, body)
    if (response?.status === 200) {
      addToHand(setCardsPlayer, response.data.id)
    } else {
      console.log('Error response: ', response)
    }
  } else {
    alert('No es tu turno')
  }
}
