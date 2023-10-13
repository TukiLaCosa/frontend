import { arrayMove } from '@dnd-kit/sortable';

export function sortCards(setCardsPlayer, overId, activeId) {
    setCardsPlayer((cardsPlayer) => {
        const oldIndex = cardsPlayer.findIndex((elem) => elem.id === activeId);
        const newIndex = cardsPlayer.findIndex((elem) => elem.id === overId);
        return arrayMove(cardsPlayer, oldIndex, newIndex);
    });
}