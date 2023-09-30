'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation';


function PartidasDisponibles() {
    const [games, setGames] = useState([]);
    const router = useRouter();
    let input;
    const [pass, setPass] = useState('');

    function handlerInput(){
        input = document.getElementById('pass');
        setPass(input.value);
    }
    async function handlerClick(password, game) {
        let user = JSON.parse(localStorage.getItem('user'));
        console.log(user);
        try {
            const data_patch = {
                "player_id": user['id'],
                "password": password !== '' ? password : 'a'
            }
            const response = await axios.patch(`http://localhost:8000/games/join/${game}`, data_patch);
            console.log(response);
            if (response?.status == 200) {
                router.push('/sala');
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    }

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

    return (
        <div className="has-text-centered">
            <h2 className="title is-1 is-uppercase is-italic has-text-centered section">Partidas Disponibles</h2>
            <section className="has-text-centered">
                <div className="columns is-multiline is-centered">
                    <div className="column is-one-third">
                        <ul className="has-text-centered">
                            {games.map((game, index) => (
                                <li className="box has-tex-centered" key={index}>
                                    <div className="partida is-tuki">
                                        <h3>{game.name}</h3>
                                        <p>Jugadores: {game.players_joined}/{game.max_players}</p>
                                        {game.is_private ? <input id='pass' placeholder='Password' onInput={handlerInput}></input> : <></>}
                                        <button className="button is-primary is-tuki" onClick={() => { handlerClick(pass, game.name) }}>Unirse</button>
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