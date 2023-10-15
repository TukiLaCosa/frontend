'use client'

import { useEffect, useState } from "react";
import { useUserGame } from "@/services/UserGameContext";

function DataGame() {
  const [data, setData] = useState([]);
  const { game } = useUserGame();
  let gameName = '';

  useEffect(() => {
    gameName = game?.name;
    const getData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/games/${gameName}`);
        if (!response.ok) {
          throw new Error('Network response was not ok [DataGame]');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error getting players:', error);
      }
    }
    getData();
  }, []);

  return (
    <div className="notification is-tuki dataGame is-flex is-justify-content-space-between is-align-items-center">
      <div>
        <p className="title is-4">Partida: {data.name}</p>
        <p className="has-text-weight-bold">Creador: {data.host_player_name}</p>
        <p className="has-text-weight-bold">Jugadores mínimos: {data.min_players}</p>
        <p className="has-text-weight-bold">Jugadores unidos: {data.num_of_players}/{data.max_players}</p>
      </div>
      <div
        className="createG"
        style={
          {
            backgroundImage: 'url("/backgrounds/gif2.gif")',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%',
            zIndex: '-1'
          }
        }>
      </div>
    </div>
  );
}

export default DataGame;