import { useUserGame } from "@/services/UserGameContext";
import { discardCard } from "@/services/discardCard";
import { deleteGame } from "@/services/deleteGame";
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

const endedGame = (gameName, setShow) => {
  deleteGame(gameName);
  setShow("");
};

const flamethrower = (cardId, userId, victimId, gameName, setShow) => {
  playFlamethrower(cardId, userId, victimId, gameName)
  setShow('');
}

const getAdjacent = (players, index) => {
  const left = ((index - 1) % players.length === -1) 
  ? players[players.length -1]
  : players[(index - 1) % players.length]
  const right = players[(index + 1) % players.length]
  console.log(left)
  console.log(right)
  return {
    left: left,
    right: right,
  }
}

function Modals({
  show,
  setShow,
  discardParams,
  flamethrowerParams,
  endedGameParams,
}) {
  const { playingCardId, players } = flamethrowerParams;
  const { winners, losers, wasTheThing } = endedGameParams;
  const { user, game } = useUserGame();

  if (show === "") {
    return null;
  } else if (show === "discard") {
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
            <button className="button is-danger" onClick={() => setShow("")}>
              Cancelar
            </button>
            <button
              className="button is-success"
              onClick={() =>
                flamethrower(
                  playingCardId,
                  user.id,
                  getAdjacent(players, user.position).left.id,
                  game.name,
                  setShow
                )
              }
            >
              {/* Jugador :{players[(user.position - 1) % players.length]?.name} */}
              Jugador :{getAdjacent(players, user.position).left.name}
            </button>
            <button
              className="button is-success"
              onClick={() =>
                flamethrower(
                  playingCardId,
                  user.id,
                  getAdjacent(players, user.position).right.id,
                  game.name,
                  setShow
                )
              }
            >
              Jugador :{getAdjacent(players, user.position).right.name}
            </button>
          </section>
        </div>
      </div>
    );
  } else if (show === "gameEnded") {
    return (
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={() => {
            setShow("");
          }}
        />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              La partida ha finalizado y estos son los resultados
            </p>
          </header>
          <section className="modal-card-body">
            <div>
              <span className="title">Ganadores:</span>
              <ul className="ul">
                {winners.map((winner, index) => (
                  <li key={index}>{winner}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="title">Perdedores:</span>
              <ul className="ul">
                {losers.map((loser, index) => (
                  <li key={index}>{loser}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="title">La Cosa:</span>
              <p>{wasTheThing}</p>
            </div>
          </section>
          <button
            className="button is-success is-tuki"
            onClick={() => {
              endedGame(game.name, setShow);
            }}
          >
            AFUERA
          </button>
        </div>
      </div>
    );
  }
}

export default Modals;
