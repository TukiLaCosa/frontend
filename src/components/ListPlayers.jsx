'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { useWebSocket } from '@/services/WebSocketContext';
import axios from "axios";


function ListPlayers() {
  const [dataGame, setDataGame] = useState({});
  const { socket, initializeWebSocket } = useWebSocket();
  const [gameName, setGameName] = useState(JSON.parse(localStorage.getItem('game')).name);
  const [hostID, setHostId] = useState(null);

  const monstersContext = require.context('!@svgr/webpack!../../public/monsters', false, /\.svg$/);
  const monsters = monstersContext.keys().map(monstersContext);

  async function fetchDataGame() {
    try {
      const url = `http://127.0.0.1:8000/games/${gameName}`;
      const response = await axios.get(url);

      if (response?.status != 200) {
        throw new Error('Network response was not ok [ListPlayers]');
      } else {
        setDataGame(response.data);
        setHostId(response.data.host_player_id);
      }
    } catch (error) {
      console.error('Error getting players of game:', error);
    }
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
        const message = JSON.parse(event.data).event;
        if (message == 'player_joined' || message == 'game_updated') {
          fetchDataGame();
        }
      });
    }
  }, [socket]);

  function RandomMonster() {
    const randomIndex = Math.floor(Math.random() * monsters.length);
    const SelectedMonster = monsters[randomIndex].default;
    return <SelectedMonster className="monster-image" />;
  }

  return <div className="block mt-2 listPlayers" style={{ overflowY: 'auto' }}>
    {dataGame?.list_of_players?.map((player, index) => (
      <div className="box media" key={index}>
        <div className="media-left">
          <figure className="image is-64x64">
            <RandomMonster />
          </figure>
        </div>
        <div className="media-content">
          <p className="content">
            {player.id == hostID && <Image src="/icons/crown-solid.svg" alt="Host" width="20" height="20" />}
            {player.name}</p>
        </div>
      </div>
    ))}
  </div>
}

export default ListPlayers