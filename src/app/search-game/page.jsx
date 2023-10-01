'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation';


function SearchGame() {
    const [games, setGames] = useState([]);
    const router = useRouter();
    let input;
    const [pass, setPass] = useState('');

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios.get('http://localhost:8000/games');
                //console.log(response.data);
                setGames(response.data);
            } catch (error) {
                console.error('Error getting games:', error);
            }
        }
        fetchGames();
    }, []);

    async function handlerClick(password, game) {
        let user = JSON.parse(localStorage.getItem('user'));
        console.log(user);
        try {
            const data_patch = {
                "player_id": user.id,
                "password": password !== '' ? password : null
            }
            const response = await axios.patch(`http://localhost:8000/games/join/${game}`, data_patch);
            //console.log(response);
            if (response?.status == 200) {
                router.push('/sala');
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    }

    function handlerInput() {
        input = document.getElementById('pass');
        setPass(input.value);
    }
    return (
        <div className="has-text-centered">
            <h2 className="title is-1 is-uppercase is-italic has-text-centered section">Partidas Disponibles</h2>
            <div className="columns is-centered">
                <div className="column is-two-thirds">
                    {games.length === 0 ? ( // Verificar si no hay partidas disponibles
                        <p className="notification is-warning">No hay partidas disponibles en este momento. Intentá más tarde o creá una.</p>
                    ) : (
                        <ul>
                            {games.map((game, index) => (
                                <li className="box has-text-centered" key={index}>
                                    <div className="level">
                                        <div className="level-left is-flex is-flex-direction-column">
                                            <h3>{game.name}</h3>
                                            <p>Jugadores: {game.players_joined}/{game.max_players}</p>
                                        </div>
                                        <div className="level-right buttons">
                                            {game.is_private ? <input id='pass' className='button' type='password' placeholder='Password' onInput={handlerInput}></input> : <></>}
                                            <button className="button is-primary is-tuki" onClick={() => { handlerClick(pass, game.name) }}>Unirse</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchGame;