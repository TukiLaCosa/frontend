'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useWebSocket } from "@/services/WebSocketContext";
import axios from 'axios';

function ExitAndStart() {
  const [gameName, setGameName] = useState(JSON.parse(localStorage.getItem('game')).name);
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hostID, setHostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { socket, initializeWebSocket } = useWebSocket();

  async function fetchDataGame() {

    try {
      const url = `http://127.0.0.1:8000/games/${gameName}`;
      const response = await axios.get(url);

      if (response?.status != 200) {
        throw new Error('Network response was not ok [ListPlayers]');
      } else {
        setIsHost(response.data.host_player_id == JSON.parse(localStorage.getItem('user')).id);
        setHostId(response.data.host_player_id);
        setIsReady(response.data.num_of_players >= response.data.min_players);
        setGameName(response.data.name);
      }
    } catch (error) {
      console.error('Error getting players of game:', error);
    }
  }

  async function initGame() {
    const url = `http://127.0.0.1:8000/games/${gameName}/init?host_player_id=${hostID}`;
    const response = await axios.patch(url);
    console.log(response);
    // router.push(`/game`);
  }

  useEffect(() => {
    let ID = JSON.parse(localStorage.getItem('user')).id;
    initializeWebSocket(ID);
    let name = JSON.parse(localStorage.getItem('game')).name;
    setGameName(name);
    fetchDataGame();
    return (() => {
      socket?.close();
    })
  }, []);

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.event == 'player_joined') {
          fetchDataGame();
        } else if (message.event == 'game_started') {
          router.push(`/game`);
        } else if (message.event == 'game_deleted') {
          router.push(`/search-game`);
        }
      });
    }
  }, [socket]);

  const handleStartClick = () => {
    initGame();
  }

  const handleExitClick = () => {
    if (isHost) {
      setShowModal(true);
    } else {
      alert("si t qre i ite");
      // eliminar jugador de la partida
    }
  }

  const closeModal = () => {
    setShowModal(false);
  }

  async function cancelGame() {
    try {
      const response = await axios.delete(`http://localhost:8000/games/${gameName}`);
      localStorage.removeItem('game');
    } catch (error) {
      console.error('Error deleting data:', error);
    }

    router.push('/search-game');
  }

  return (
    <div className="colums buttons">
      <div className="column">
        <button className="button is-danger is-large" onClick={handleExitClick}>Cancelar</button>
      </div>
      <div className="column">
        <button className="button is-success is-large" onClick={handleStartClick} disabled={!(isHost && isReady)}>Iniciar</button>
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
              <button className="button is-tuki" onClick={closeModal}>Irsen't</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExitAndStart;
