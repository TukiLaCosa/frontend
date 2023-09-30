'use client';
import { useEffect, useState } from 'react';
import DataGame from "@/components/DataGame";
import ListPlayers from "@/components/ListPlayers";
import Chat from "@/components/Chat";
import ExitAndStart from "@/components/ExitAndStart";
import '@/styles/grid.scss';

function Lobby() {
    const [dataGame, setDataGame] = useState([]);
    
    useEffect(() => {
        async function fetchDataGame() {
            try {
                const response = await fetch('http://localhost:8000/games/Partidaza');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setDataGame(data);
            } catch (error) {
                console.error('Error getting players:', error);
            }
        }
        fetchDataGame();
    }, []);
    
    return (
        <div className="conteiner">
            <DataGame data={dataGame}/>
            <ListPlayers players={dataGame.playersJoined}/>
            <Chat/>
            <ExitAndStart curP={dataGame.curPlayer} minP={dataGame.minPlayer} isHost={false} name={dataGame.name}/>
        </div>
    );
}

export default Lobby;
