import { addToHand } from "./addToHand";

export function newCard(setCardsPlayer) {
    let random = Math.floor(Math.random() * (108 - 2 + 1) + 2);
    addToHand(setCardsPlayer, random);
}