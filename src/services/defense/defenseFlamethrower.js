import axios from 'axios'

export const defenseFlamethrower = (defCards, playerId, gameName, setContent) => {
  if (defCards.length === 0) {
    axios.post(`http://localhost:8000/games/${gameName}/play-defense-car`,
      { player_id: playerId }
    )
    return
  }
  setContent('Elegi una carta ¡Nada de Barbacoas! si queres defenderte.')
  const selectionHandler = (cardId) => {
    axios.post(`http://localhost:8000/games/${gameName}/play-defense-car`,
      { player_id: playerId, car_id: cardId }
    )
    defCards.forEach(card => {
      const element = document.getElementById(`card_${card}`)
      element.removeEventListener('click')
    })
  }

  defCards.forEach(card => {
    const element = document.getElementById(`card_${card}`)
    element.addEventListener('click', (e) => { selectionHandler(card) })
  })
}
