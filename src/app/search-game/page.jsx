'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation';
import Game from '@/components/Game';
import { useWebSocket } from '@/services/WebSocketContext';
import { useUserGame } from '@/services/UserGameContext';

export function handleInput(event, gameName, passwords, setPasswords) {
	const newPasswords = { ...passwords };
	newPasswords[gameName] = event.target.value;
	setPasswords(newPasswords);
}

export function makeBodyRequest(id, password) {
	return ({
		"player_id": id,
		"password": password !== '' ? password : null
	});
}

export async function handleClick(gameName, passwords, router, user, setGameValues) {
	const password = passwords[gameName] || '';
	try {
		const data_patch = makeBodyRequest(user.id, password);
		const response = await axios.patch(`http://localhost:8000/games/join/${gameName}`, data_patch);
		if (response?.status == 200) {
			setGameValues(gameName, '', '');
			// localStorage.setItem('game', `{ "name": "${gameName}"}`);
			router.push('/lobby');
		}
	}
	catch (error) {
		console.error('Error:', error);
	}
}

function SearchGame() {
	const [games, setGames] = useState([]);
	const [passwords, setPasswords] = useState({});
	const router = useRouter();
	const { event } = useWebSocket();
	const { user, setGameValues } = useUserGame();

	async function fetchGames() {
		try {
			const response = await axios.get('http://localhost:8000/games');
			setGames(response.data);
		} catch (error) {
			console.error('Error getting games:', error);
		}
	}

	useEffect(() => {
		fetchGames();
	}, []);

	useEffect(() => {
		let eventType = JSON.parse(event)?.event;
		if(eventType == 'game_deleted'
		   	|| eventType == 'game_created'
			|| eventType == 'game_started'
			|| eventType == 'game_updated'
			|| eventType == 'player_joined') {
			fetchGames();
		}
	}, [event]);

	return (
		<div className='has-text-centered'>
			<h2 className='title is-1 is-uppercase is-italic has-text-centered section'>Partidas Disponibles</h2>
			<div className='columns is-centered'>
				<div className='column is-two-thirds'>
					{
						games.length === 0 ?
							(
								<p className='notification is-warning'>No hay partidas disponibles en este momento. Intentá más tarde o creá una.</p>
							) :
							(
								<ul>
									{games.map((game, index) => (
										<Game key={index} game={game} handleClick={(gameName) => handleClick(gameName, passwords, router, user, setGameValues)} handleInput={(event, gameName) => handleInput(event, gameName, passwords, setPasswords)}></Game>
									))}
								</ul>
							)}
				</div>
			</div>
			<div
                className="searchG"
                style={
                    {
                        backgroundImage: 'url("/backgrounds/gif2.gif")',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        backgroundSize: 'cover',
                        width: '100%',
                        height: '100%',
                        "z-index": '-1'
                    }
                }>
            </div>
		</div>
	);
}

export default SearchGame;