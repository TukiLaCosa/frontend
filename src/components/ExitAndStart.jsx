'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';

function ExitAndStart({ curP, minP, isHost, name }) {
  const ready = (curP >= minP);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleStartClick = () => {
    router.push(`/game/${name}`);
  }

  const handleExitClick = () => {
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }


  async function cancelGame() {
    let id = localStorage.getItem("user").id;
    try {
      const response = await axios.delete(`http://localhost:8000/games/${name}`);
      localStorage.removeItem('game');
    } catch (error) {
      console.error('Error deleting data:', error);
    }

    router.push('/search-game');
  }

  return (
    <div className="colums buttons">
      <div className="column">
        {
          isHost ?
            <button className="button is-danger is-large" onClick={handleExitClick}>Cancelar</button>
            :
            <button className="button is-danger is-large" disabled>Cancelar</button>
        }
      </div>
      <div className="column">
        {
          ready && isHost ?
            <button className="button is-success is-large" onClick={handleStartClick}>Iniciar</button>
            :
            <button className="button is-success is-large" disabled>Iniciar</button>
        }
      </div>

      {showModal && isHost && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">¿Estas seguro de abandonar la partida?</p>
              <button className="delete" aria-label="close" onClick={closeModal}></button>
            </header>
            <section className="modal-card-body">
              {isHost
                ? "Sos el creador de la partida, si abandonas se cerrara esta Sala expulsando a todos los jugadores"
                : "Tus compañeros te van a extrañar..."}
            </section>
            <footer className="modal-card-foot">
              <button className="button is-danger" onClick={() => { cancelGame(); closeModal() }}>Irse</button>
              <button className="button is-tuki" onClick={closeModal}>{"Irsen't"}</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExitAndStart;
