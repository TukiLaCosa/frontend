import { useUserGame } from '@/services/UserGameContext'
import { discardCard } from '@/services/discardCard'

const confirmDiscard = (setShow, { setCardsPlayer, setDiscardBG, cardId }, userId, gameName) => {
  discardCard(setCardsPlayer, setDiscardBG, cardId, userId, gameName)
  setShow('')
}

function Modals ({ show, setShow, discardParams, playingCardId, players }) {
  const { user, game } = useUserGame()
  if (show==='') {
    return null
  } else if (show='discard') {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Confirmación</p>
            <button className="delete" aria-label="close" onClick={() => setShow('')}></button>
          </header>
          <section className="modal-card-body has-text-centered">
            ¿Realmente quieres descartar esta carta?
          </section>
          <footer className="modal-card-foot is-justify-content-center">
            <button className="button is-success" onClick={() => { confirmDiscard(setShow, discardParams, user?.id, game?.name) }}>Sí</button>
            <button className="button is-danger" onClick={() => setShow('')}>No</button>
          </footer>
        </div>
      </div>
    )
  } else if (show==='Flamethrower') {
    return (
      <div className="confirmation-dialog">
        <p>Pregunta: ¿A quien quieres quemar?</p>
        <button onClick={() => setShow('')}>
          Cancelar
        </button>
        <button
          onClick={() =>
            playFlamethrower(playingCardId, user.id, players[(user.position-1)%players.length]?.id, game.name)
          }
        >
          Jugador :{players[(user.position-1)%players.length]?.name}
        </button>
        <button
          onClick={() =>
            playFlamethrower(playingCardId, user.id, players[(user.position+1)%players.length]?.id, game.name)
          }
        >
          Jugador :{players[(user.position+1)%players.length]?.name}
        </button>
      </div>
    )}
}
  

export default Modals
