import { arrayMove } from '@dnd-kit/sortable'

export const removeFromHand = (setCardsPlayer, id) => {
  setCardsPlayer((cardsPlayer) => {
    const remove = cardsPlayer.findIndex((elem) => elem.id === id)
    cardsPlayer.splice(remove, 1)
    return arrayMove(cardsPlayer, 0, 0)
  })
}
