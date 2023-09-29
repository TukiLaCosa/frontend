'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ListPlayers(){
    const [players, setPlayers] = useState([]);
    
    useEffect(() => {
        async function fetchPlayers() {
          try {
            const response = await axios.get('http://localhost:8000/players');
            setPlayers(response.data);
          } catch (error) {
            console.error('Error getting players:', error);
          }
        }
    
        fetchPlayers();
    }, []);
    

    return <div className="block mt-2 listPlayers" style={{ overflowY: 'auto' }}>
        {players.map((player, index) => (
            <div className="box media" key={index}>
            <div className="media-left">
            <figure className="image is-32x32">+☈+</figure>
            </div>
            <div className="media-content">
            <p className="content">{player.name}</p>
            </div>
            </div>
        ))}
  </div>
}

export default ListPlayers