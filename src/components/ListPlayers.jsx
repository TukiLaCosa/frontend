'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

// const listUsers = () => {
//     fetch("http://127.0.0.1:8000/players/")
//     .then(response => response.json())
//     .catch(data => console.log(data))
// }



function ListPlayers({className}){
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
    

    return <div className="box listPlayers" style={{ overflowY: 'auto' }}>
        {players.map((player, index) => (
            <div className="media" key={index}>
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