'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation';
import Game from '@/components/Game'


function SearchGame() {
    const [games, setGames] = useState([]);
    const router = useRouter();
    const [passwords, setPasswords] = useState({});

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios.get('http://localhost:8000/games');
                setGames(response.data);
            } catch (error) {
                console.error('Error getting games:', error);
            }
        }
        fetchGames();
    }, []);

    function handleInput(event, gameName) {
        const newPasswords = { ...passwords };
        newPasswords[gameName] = event.target.value;
        console.log(gameName);
        setPasswords(newPasswords);
    }

    async function handleClick(gameName) {
        let user = JSON.parse(localStorage.getItem('user'));
        const password = passwords[gameName] || '';
        try {
            const data_patch = {
                "player_id": user.id,
                "password": password !== '' ? password : null
            }
            const response = await axios.patch(`http://localhost:8000/games/join/${gameName}`, data_patch);
            if (response?.status == 200) {
                localStorage.setItem('game', `{ "name": "${gameName}"}`);
                router.push('/lobby');
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className="has-text-centered">
            <h2 className="title is-1 is-uppercase is-italic has-text-centered section">Partidas Disponibles</h2>
            <div className="columns is-centered">
                <div className="column is-two-thirds">
                    {
                        games.length === 0 ?
                        (
                            <p className="notification is-warning">No hay partidas disponibles en este momento. Intentá más tarde o creá una.</p>
                        ) :
                        (
                            <ul>
                                {games.map((game, index) => (
                                    <Game key={index} game={game} handleClick={handleClick} handleInput={handleInput}></Game>
                                ))}
                            </ul>
                        )}
                </div>
            </div>
        </div>
    );
}

export default SearchGame;