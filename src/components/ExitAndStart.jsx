'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useWebSocket } from "@/services/WebSocketContext";
import axios from 'axios';
import { useUserGame } from "@/services/UserGameContext";

function ExitAndStart() {
  const { event } = useWebSocket();
  const { user, game } = useUserGame();
  const [gameName, setGameName] = useState(game?.name);
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hostID, setHostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  async function fetchDataGame() {

    try {
      const url = `http://127.0.0.1:8000/games/${gameName}`;
      const response = await axios.get(url);

      if (response?.status != 200) {
        throw new Error('Network response was not ok [ListPlayers]');
      } else {
        setIsHost(response.data.host_player_id == user.id);
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
    router.push(`/game`);
  }

  useEffect(() => {
    let name = game?.name;
    setGameName(name);
    fetchDataGame();
  }, []);

  useEffect(() => {
    let eventJSON = JSON.parse(event);
    let eventType = eventJSON?.event;
    if (eventType == 'player_joined' || eventType == 'player_left') {
      fetchDataGame();
    } else if (eventType == 'game_started' && eventJSON?.game_name == game.name) {
      let gameStarted = JSON.parse(event)?.game_name;
      if (gameStarted == gameName) {
        router.push(`/game`);
      }
    } else if (eventType == 'game_canceled') {
      router.push(`/search-game`);
    } else if (eventType == 'game_deleted' && eventJSON?.game_name == game.name){
      router.push(`/search-game`);
    }
  }, [event]);

  const handleStartClick = () => {
    initGame();
  }

  const handleExitClick = (user) => {
    if (isHost) {
      setShowModal(true);
    } else {
      leaveGame(user);
    }
  }

  const closeModal = () => {
    setShowModal(false);
  }

  async function cancelGame() {
    try {
      const url = `http://localhost:8000/games/${gameName}`;
      const response = await axios.delete(url);
      localStorage.removeItem('game');
    } catch (error) {
      console.error('Error deleting data:', error);
    }

    router.push('/search-game');
  }

  async function leaveGame(user) {
    try {
      const playerID = user.id;
      const url = `http://localhost:8000/games/leave/${gameName}?player_id=${playerID}`;
      const response = await axios.patch(url);
    } catch (error) {
      console.error('Error leaving data:', error);
    }

    router.push('/search-game');
  }

  return (
    <div className="colums buttons">
      <div className="column">
        <button className="button is-danger is-large" onClick={() => { handleExitClick(user) }}>Cancelar</button>
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
