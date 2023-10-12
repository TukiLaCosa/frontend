'use client'

// import Image from 'next/image';

import { useEffect, useState } from "react";

function DataGame() {
  const [data, setData] = useState([]);
  let gameName = '';

  useEffect(() => {
    gameName = JSON.parse(localStorage.getItem('game')).name;
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
    <div className="notification is-tuki-modified dataGame is-flex is-justify-content-space-between is-align-items-center">
      <div>
        <p className="title is-5">Partida: {data.name}</p>
        <p className="has-text-weight-bold">Creador: {data.host_player_name}</p>
        <p className="has-text-weight-bold">Jugadores: {data.num_of_players}/{data.max_players}</p>
        <p className="has-text-weight-bold">Jugadores mínimos: {data.min_players}</p>
      </div>
      {/* <div>
        <button className="button is-warning is-large" onClick={() => refresh(true)}>
          <Image src="/images/refresh.svg" alt="Refresh" width={64} height={64} />
        </button>
      </div> */}
    </div>
  );
}

export default DataGame;