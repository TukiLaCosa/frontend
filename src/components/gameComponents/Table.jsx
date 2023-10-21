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
import { playCard, playFlamethrower, getAdjacents } from "@/services/playCard";
import { discardCard } from "@/services/discardCard";
import { newCard } from "@/services/newCard";
import { useUserGame } from "@/services/UserGameContext";
import { useWebSocket } from "@/services/WebSocketContext";
import axios from "axios";

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
    setPlayingCardId(active.id);
    playCard(
      setCardsPlayer,
      setPlayBG,
      active.id,
      setShowFlamethrowerConfirmation
    );
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
    console.log("CAAAARTAAAAAAS", response); //
    console.log(response.data);
    const cards = await response.data.map((card) => {
      return {
        id: card.id,
        name: card.name,
      };
    });
    setCardsPlayer(cards);
    console.log(cards);
  } catch (error) {
    console.error("Error getting cards:", error);
  }
};

function Table() {
  const [cardsPlayer, setCardsPlayer] = useState([]);
  const [playBG, setPlayBG] = useState("/cards/rev/109Rev.png");
  const [discardBG, setDiscardBG] = useState("/cards/rev/revPanic.png");
  const items = [...cardsPlayer, "discard-deck", "play-card"];
  const angle = [-15, -10, 10, 15, 20];
  const [players, setPlayers] = useState("vacio");
  const [leftAdjacent, setLeftAdjacent] = useState(0)
  const [rightAdjacent, setRightAdjacent] = useState(0)
  const [listPlayers, setListPlayers] = useState([]);
  const { user, game } = useUserGame();
  const { event } = useWebSocket();
  const [showFlamethrowerConfirmation, setShowFlamethrowerConfirmation] =
    useState(false);
  const userId = user?.id;
  const [playingCardId, setPlayingCardId] = useState(0);
  const gameName = game?.name;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameName = game?.name;
        const response = await axios.get(
          `http://localhost:8000/games/${gameName}`
        );

        const list_players = await response.data.list_of_players.map(
          (player) => {
            return {
              player_id: player.id,
              position: player.position,
            };
          }
        );
        setLeftAdjacent(list_players[(user.position-1)%list_players.length]?.player_id)
        setRightAdjacent(list_players[(user.position-1)%list_players.length]?.player_id)
        setPlayers(response.data.list_of_players);
        setListPlayers(list_players);
        return;
      } catch (error) {
        console.error("Error getting players info", error);
      }
    };
    fetchData();
    fetchCards(user,setCardsPlayer)
  }, []);

  useEffect(() => {
    const eventJSON = JSON.parse(event);
    const eventType = eventJSON?.event;
    if (eventType == "played_card") {
      handlePlayedCardEvent(); // falta definir
    }
  }, [event]);

  return (
    <div className="table is-flex is-flex-direction-row">
      <div className="table-cards is-flex is-flex-direction-column">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            handleDragEnd(
              event,
              setCardsPlayer,
              setPlayBG,
              setDiscardBG,
              setShowFlamethrowerConfirmation,
              setPlayingCardId
            );
          }} // as onChange
        >
          {showFlamethrowerConfirmation && (
            <div className="confirmation-dialog">
              <p>Pregunta: ¿A quien quieres quemar?</p>
              <button onClick={() => setShowFlamethrowerConfirmation(false)}>
                Cancelar
              </button>
              <button
                onClick={() =>
                  playFlamethrower(playingCardId, userId, listPlayers[(user.position-1)%listPlayers.length]?.player_id, gameName)
                }
              >
                Jugador :{listPlayers[(user.position-1)%listPlayers.length]?.position}
              </button>
              <button
                onClick={() =>
                  playFlamethrower(playingCardId, userId, listPlayers[(user.position+1)%listPlayers.length]?.player_id, gameName)
                }
              >
                Jugador :{listPlayers[(user.position+1)%listPlayers.length]?.position}
              </button>
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
