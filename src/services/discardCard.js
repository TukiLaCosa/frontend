import { setPath } from "./setPath";
import { removeFromHand } from "./removeFromHand";

export function discardCard(setCardsPlayer, setDiscardBG, activeId) {
    if (activeId == 1) {
        alert('So grasioso bo?');
        alert('`ja eso ái');
        return;
    }
    else if (false) { // Checkeo turno
        alert('Paraaaaaaaaa!');
        return;
    }
    if (confirm("¿Quieres descartar esta carta?") == true) {
        let path = setPath(activeId);
        setDiscardBG(path);
        removeFromHand(setCardsPlayer, activeId)
    } else {
        setDiscardBG(`/cards/rev/revPanic.png`);
    }
}