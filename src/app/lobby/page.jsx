'use client';
import { useEffect, useState } from 'react';
import DataGame from "@/components/DataGame";
import ListPlayers from "@/components/ListPlayers";
import Chat from "@/components/Chat";
import ExitAndStart from "@/components/ExitAndStart";
import '@/styles/grid.scss';

function Lobby() {
    const [dataGame, setDataGame] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    
    useEffect(() => {
        const game = JSON.parse(localStorage.getItem('game'))
        async function fetchDataGame() {
            try {
                const response = await fetch(`http://localhost:8000/games/${game.name}`);
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
            <ListPlayers players={dataGame.list_of_players}/>
            <Chat />
            <ExitAndStart curP={dataGame.num_of_players} minP={dataGame.min_players} isHost={user.id===dataGame.host_player_id} name={dataGame.name}/>
        </div>
    );
}

export default Lobby;
