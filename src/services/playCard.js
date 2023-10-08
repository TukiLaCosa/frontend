import { setPath } from "./setPath";
import { removeFromHand } from "./removeFromHand";

export function playCard(setCardsPlayer, setPlayBG, activeId) {
    if (activeId - 21 <= 0) {
        alert('raja de aca ca`eza');
        return;
    }
    if (confirm("¿Quieres jugar esta carta?") == true) {
        let path = setPath(activeId);
        setPlayBG(path);
        removeFromHand(setCardsPlayer, activeId);
    } else {
        setPlayBG(`/cards/rev/109Rev.png`);
    }
}