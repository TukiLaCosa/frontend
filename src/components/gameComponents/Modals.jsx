import { useUserGame } from "@/services/UserGameContext";
import { discardCard } from "@/services/discardCard";
import { playFlamethrower } from "@/services/playCard";

const confirmDiscard = (
  setShow,
  { setCardsPlayer, setDiscardBG, cardId },
  userId,
  gameName
) => {
  discardCard(setCardsPlayer, setDiscardBG, cardId, userId, gameName);
  setShow("");
};

function Modals({ show, setShow, discardParams, playingCardId, players }) {
  const { user, game } = useUserGame();
  if (show === "") {
    return null;
  } else if ((show = "discard")) {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Confirmación</p>
            <button
              className="delete"
              aria-label="close"
              onClick={() => setShow("")}
            ></button>
          </header>
          <section className="modal-card-body has-text-centered">
            ¿Realmente quieres descartar esta carta?
          </section>
          <footer className="modal-card-foot is-justify-content-center">
            <button
              className="button is-success"
              onClick={() => {
                confirmDiscard(setShow, discardParams, user?.id, game?.name);
              }}
            >
              Sí
            </button>
            <button className="button is-danger" onClick={() => setShow("")}>
              No
            </button>
          </footer>
        </div>
      </div>
    );
  } else if (show === "Flamethrower") {
    return (
      <div className="modal is-active">
        <div className="modal-background "></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-head">¿A quien quieres quemar?</p>
          </header>

          <section>
            <button
              className="button is-danger"
              onClick={() => setShow('')}
            >
              Cancelar
            </button>
            <button
              className="button is-success"
              onClick={() =>
                playFlamethrower(
                  playingCardId,
                  user.id,
                  players[(user.position - 1) % players.length]?.id,
                  gameName
                )
              }
            >
              Jugador :{players[(user.position - 1) % players.length]?.name}
            </button>
            <button
              className="button is-success"
              onClick={() =>
                playFlamethrower(
                  playingCardId,
                  user.id,
                  players[(user.position + 1) % players.length]?.id,
                  gameName
                )
              }
            >
              Jugador :{players[(user.position + 1) % players.length]?.name}
            </button>
          </section>
        </div>
      </div>
    );
  }
}

export default Modals;
