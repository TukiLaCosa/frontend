"use client";

import "@/styles/Table.css";
import Chat from "../Chat";
import Card from "./Card";
import DiscardDeck from "./DiscardDeck";
import PlayCard from "./PlayCard";
import Chair from "./Chair";
import { useEffect, useInsertionEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { sortCards } from "@/services/sortCards";
import { useRouter } from 'next/navigation';
import { playCard, playFlamethrower, getAdjacents } from "@/services/playCard";
import { discardCard } from "@/services/discardCard";
import { newCard } from "@/services/newCard";
import { useUserGame } from "@/services/UserGameContext";
import { useWebSocket } from "@/services/WebSocketContext";
import axios from "axios";
import { closeModal } from "../ExitAndStart";
import '@/styles/game_ended.scss'

export const handleDragEnd = (
  event,
  setCardsPlayer,
  setPlayBG,
  setDiscardBG,
  setShowFlamethrowerConfirmation,
  setPlayingCardId //estado que es necesario para la renderizacion de la "pantalla emergente"
) => {
  const { active, over } = event;

  if (over.id === "discard-deck") {
    // Discarding
    discardCard(setCardsPlayer, setDiscardBG, active.id);
  } else if (over.id === "play-card") {
    // Playing
    setPlayingCardId(active.id)
    playCard(setCardsPlayer, setPlayBG, active.id, setShowFlamethrowerConfirmation);
  } else {
    // Just sorting
    sortCards(setCardsPlayer, over.id, active.id);
  }
};

export const fetchCards = async (user, setCardsPlayer) => {
  const playerId = user?.id;
  try {
    const response = await axios.get(
      `http://localhost:8000/players/${playerId}/hand`
    );
    console.log(response); //
    console.log(response.data);
    const cards = await response.data.map((card) => {
      return {
        id: card.id,
        name: card.name,
      };
    });
    setCardsPlayer(cards);
  } catch (error) {
    console.error("Error getting cards:", error);
  }
};


// FETCH PARA OBTENER LOS DATOS DE LA FINALIZACIÓN DE LA PARTIDA
export const fetchResultsGame = async (gameName, setWinners, setLosers, setWasTheThing, setShowModal) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/games/${gameName}/result`
    );
    console.log(response)
    console.log(response.data)
    const data = response.data; // obtiene el objeto
    setWinners(data.winners.map(winner => winner.name));
    setLosers(data.losers.map(loser => loser.name));

    // Busca al jugador que era "La Cosa" y establece el estado en consecuencia
    const theThingPlayer = data.winners.find(winner => winner.was_the_thing) ||
      data.losers.find(loser => loser.was_the_thing);

    setWasTheThing(theThingPlayer ? theThingPlayer.name : '');
    openModal(setShowModal); // Abre el modal dsp de obtener los resultados
  } catch (error) {
    console.error("Error getting results:", error);
  }
};


// BORRAR LA PARTIDA LUEGO DEL MODAL
export const deleteGame = async (gameName, setShowModal) => {
  closeModal(setShowModal) // cierra el modal
  try {
    const url = `http://localhost:8000/games/${gameName}`
    const response = await axios.delete(url)
    if (!response?.ok) {
      console.log(response)
    }
    localStorage.removeItem('game')
  } catch (error) {
    console.error('Error deleting game:', error)
  }
}

// para abrir un modal
export const openModal = (setShowModal) => {
  setShowModal(true)
}

// PEGARLE A UN ENDPOINT HARDCODEADO PARA FINALIZAR PARTIDA
export const finalizarPartida = async (gameName) => {
  console.log(gameName)
  try {
    const response = await axios.get( // hacer get para finalizar la partida. Luego de pegarle a este endpoint manda el evento de game_ended
      `http://localhost:8000/ws/${gameName}/send-self-event?event=game_ended` // le indico qué evento quiero q dispare por query parameters
    );
    console.log(response);
    console.log(response.data);
  } catch (error) {
    console.error("Error WS:", error);
  }
};

function Table() {
  const [cardsPlayer, setCardsPlayer] = useState([]);
  const [playBG, setPlayBG] = useState("/cards/rev/109Rev.png");
  const [discardBG, setDiscardBG] = useState("/cards/rev/revPanic.png");
  const items = [...cardsPlayer, "discard-deck", "play-card"];
  const angle = [-15, -10, 10, 15, 20];
  const [players, setPlayers] = useState("Vacio");
  const { user, game } = useUserGame();
  const { event } = useWebSocket();
  const [showFlamethrowerConfirmation, setShowFlamethrowerConfirmation] = useState(false);
  const userId = user?.id;
  const [playingCardId, setPlayingCardId] = useState(0);
  const gameName = game?.name;
  const [showModal, setShowModal] = useState(false) // para mostrar el modal de los ganadores, perdedores, etc
  const [winners, setWinners] = useState([]);
  const [losers, setLosers] = useState([]);
  const [wasTheThing, setWasTheThing] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const gameName = game?.name;
    const gameData = axios
      .get(`http://localhost:8000/games/${gameName}`)
      .then((data) => {
        console.log(data);
        setPlayers(data.data.list_of_players);
      });
    if (!gameData?.ok) {
      console.log(gameData);
    }

    fetchCards(user, setCardsPlayer);
  }, []);

  useEffect(() => {
    const eventJSON = JSON.parse(event);
    const eventType = eventJSON?.event;
    if (eventType == "played_card") {
      handlePlayedCardEvent();
    } else if (eventType === "game_ended") { // evento de finalizar partida
      fetchResultsGame(gameName, setWinners, setLosers, setWasTheThing, setShowModal) // le pega al endpoint para obtener los resultados
    } else if (eventType === "game_deleted") { // una vez q se hace el delete de la partida en la q estan todos, se manda este evento y es para que todos los usuarios salgan de ahi
      router.push('/search-game')
    }
  }, [event]);


  return (
    <div className="table is-flex is-flex-direction-row">
      <div className="table-cards is-flex is-flex-direction-column">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            handleDragEnd(event, setCardsPlayer, setPlayBG, setDiscardBG, setShowFlamethrowerConfirmation, setPlayingCardId);
          }} // as onChange
        >
          <button
            className='button is-success is-danger is-large'
            onClick={() => {
              finalizarPartida(gameName);
              openModal(setShowModal); // abre el modal dsp de obtener los resultados
            }}
          >
            Finzalizar Partidaaa
          </button>
          {showModal && (
            <div className='modal is-active'>
              <div className='modal-background' onClick={closeModal} />
              <div className='modal-card'>
                <header className='modal-card-head'>
                  <p className="modal-card-title">La partida ha finalizado y estos son los resultados</p>
                </header>
                <section className="modal-card-body">
                  <div>
                    <h3 className="title">Ganadores:</h3>
                    <ul className="ul">
                      {winners.map((winner, index) => (
                        <li key={index}>{winner}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="title">Perdedores:</h3>
                    <ul className="ul">
                      {losers.map((loser, index) => (
                        <li key={index}>{loser}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="title">La Cosa:</h3>
                    <p>{wasTheThing}</p>
                  </div>
                </section>
                <button className='button is-success is-tuki' onClick={() => { deleteGame(gameName, setShowModal) }}>AFUERA</button>
              </div>
            </div>
          )}

          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            <div
              className="room"
              style={{
                backgroundImage: 'url("/backgrounds/floorBG.gif")',
                backgroundSize: "cover",
                boxShadow: "0 0 5px 5px #c3c4c6",
              }}
            >
              <div className="is-flex is-align-items-end is-justify-content-end item" />
              <div className="is-flex is-align-items-end is-justify-content-space-around item">
                <Chair
                  rotation={0}
                  size={200}
                  type="Whole"
                  className="is-flex is-flex-direction-column has-text-centered"
                  player={players[0]}
                />
                <Chair
                  rotation={0}
                  size={200}
                  type="Whole"
                  className="is-flex is-flex-direction-column has-text-centered"
                  player={players[1]}
                />
              </div>
              <div className="is-flex is-align-items-end is-justify-content-space-around item">
                <Chair
                  rotation={0}
                  size={200}
                  type="Whole"
                  className="is-flex is-flex-direction-column has-text-centered"
                  player={players[2]}
                />
                <Chair
                  rotation={0}
                  size={200}
                  type="Whole"
                  className="is-flex is-flex-direction-column has-text-centered"
                  player={players[3]}
                />
              </div>
              <div className="is-flex is-align-items-end is-justify-content-start item" />
              <div className="is-flex is-align-items-center is-justify-content-end item">
                <Chair
                  rotation={-90}
                  size={120}
                  type="Right"
                  className="is-flex is-flex-direction-row has-text-centered"
                  player={players[4]}
                />
              </div>
              <div
                className="is-flex is-justify-content-space-evenly is-align-items-center item table-cells"
                style={{
                  backgroundImage: 'url("/backgrounds/tableBG.png")',
                  backgroundSize: "cover",
                }}
              >
                <img
                  id="deck"
                  src="/cards/rev/revTakeAway.png"
                  width={180}
                  alt=""
                  style={{ borderRadius: "5%" }}
                  onClick={() => {
                    newCard(setCardsPlayer);
                  }}
                />
                <PlayCard id="play-card" src={playBG} />
                <DiscardDeck id="discard-deck" src={discardBG} />
              </div>
              <div className="is-flex is-align-items-center is-justify-content-start item">
                <Chair
                  rotation={90}
                  size={120}
                  type="Left"
                  className="is-flex is-flex-direction-row-reverse has-text-centered"
                  player={players[5]}
                />
              </div>
              <div className="is-flex is-align-items-center is-justify-content-end item">
                <Chair
                  rotation={-90}
                  size={120}
                  type="Left"
                  className="is-flex is-flex-direction-row has-text-centered"
                  player={players[6]}
                />
              </div>
              <div className="is-flex is-align-items-center is-justify-content-start item">
                <Chair
                  rotation={90}
                  size={120}
                  type="Right"
                  className="is-flex is-flex-direction-row-reverse has-text-centered"
                  player={players[7]}
                />
              </div>
              <div className="is-flex is-align-items-start is-justify-content-end item" />
              <div className="is-flex is-align-items-start is-justify-content-space-around item">
                <Chair
                  rotation={180}
                  size={200}
                  type="Whole"
                  className="is-flex is-flex-direction-column-reverse has-text-centered"
                  player={players[8]}
                />
                <Chair
                  rotation={180}
                  size={200}
                  type="Whole"
                  className="is-flex is-flex-direction-column-reverse has-text-centered"
                  player={players[9]}
                />
              </div>
              <div className="is-flex is-align-items-start is-justify-content-space-around item">
                <Chair
                  rotation={180}
                  size={200}
                  type="Whole"
                  className="is-flex is-flex-direction-column-reverse has-text-centered"
                  player={players[10]}
                />
                <Chair
                  rotation={180}
                  size={200}
                  type="Whole"
                  className="is-flex is-flex-direction-column-reverse has-text-centered"
                  player={players[11]}
                />
              </div>
              <div className="is-flex is-align-items-start is-justify-content-start item item" />
            </div>
            <div
              className="cards is-flex is-flex-direction-row is-justify-content-center"
              style={{
                backgroundImage: 'url("/backgrounds/tableBG.png")',
                backgroundSize: "cover",
                boxShadow: "0 0 5px 5px #138e5a",
              }}
            >
              {cardsPlayer.map((card, index) => {
                if (card) {
                  return (
                    <Card
                      id={card.id}
                      key={card.id}
                      rotation={angle[card.id - 1]}
                    />
                  );
                } else {
                  return <span key={index} />;
                }
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div
        className="chat has-text-centered column is-flex is-flex-direction-column is-justify-content-space-evenly"
        style={{
          backgroundColor: "grey",
        }}
      >
        <Chat />
      </div>
    </div>
  );
}

export default Table;
