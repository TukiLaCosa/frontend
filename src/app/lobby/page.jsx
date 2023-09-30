'use client';
import { useEffect, useState } from 'react';
import DataGame from "@/components/DataGame";
import ListPlayers from "@/components/ListPlayers";
import Chat from "@/components/Chat";
import ExitAndStart from "@/components/ExitAndStart";
import '@/styles/grid.scss';

function Lobby() {
    const [players, setPlayers] = useState([]);
    
    useEffect(() => {
        async function fetchPlayers() {
            try {
                const response = await fetch('http://localhost:8000/games/Partidaza');

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log(data)
                setPlayers(data);
            } catch (error) {
                console.error('Error getting players:', error);
            }
        }
        fetchPlayers();
        console.log(players);
    }, []);
    
    return (
        <div className="conteiner">
            <DataGame data={players}/>
            <ListPlayers players={players.playersJoined}/>
            <Chat className="chat"/>
            <ExitAndStart curP={players.curPlayer} minP={players.minPlayer} isHost={false} name={players.name}/>
        </div>
    );
}

export default Lobby;
