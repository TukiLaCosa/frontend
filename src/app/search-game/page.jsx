'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

function PartidasDisponibles() {
    const [games, setGames] = useState([]);
    let user;

    useEffect(() => {
        user = JSON.parse(localStorage.getItem('user'));
        async function fetchGames() {
            try {
                const response = await axios.get('http://localhost:8000/games');
                console.log(response.data);
                setGames(response.data);
            } catch (error) {
                console.error('Error getting games:', error);
            }
        }

        fetchGames();
    }, []);

    return (
        <div className="has-text-centered">
            <h2 className="title is-1 is-uppercase is-italic has-text-centered section">Partidas Disponibles</h2>
            <section className="has-text-centered">
                <div className="columns is-multiline is-centered">
                    <div className="column is-one-third">
                        <ul className="has-text-centered">
                            {games.map((game) => (
                                <li className="box has-tex-centered">
                                    <div className="partida is-tuki">
                                        <h3>{game.name}</h3>
                                        <p>Jugadores: {game.players_joined}/{game.max_players}</p>
                                        <button className="button is-primary is-tuki">Unirse</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PartidasDisponibles;