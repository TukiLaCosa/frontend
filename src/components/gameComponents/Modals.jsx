import { useUserGame } from '@/services/UserGameContext'
import { discardCard } from '@/services/discardCard'

const confirmDiscard = (setShow, { setCardsPlayer, setDiscardBG, cardId }, userId, gameName) => {
  discardCard(setCardsPlayer, setDiscardBG, cardId, userId, gameName)
  setShow(false)
}

function Modals ({ show, setShow, discardParams }) {
  const { user, game } = useUserGame()
  if (!show) {
    return null
  }
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Confirmación</p>
          <button className="delete" aria-label="close" onClick={() => setShow(false)}></button>
        </header>
        <section className="modal-card-body has-text-centered">
          ¿Realmente quieres descartar esta carta?
        </section>
        <footer className="modal-card-foot is-justify-content-center">
          <button className="button is-success" onClick={() => { confirmDiscard(setShow, discardParams, user?.id, game?.name) }}>Sí</button>
          <button className="button is-danger" onClick={() => setShow(false)}>No</button>
        </footer>
      </div>
    </div>
  )
}

export default Modals
