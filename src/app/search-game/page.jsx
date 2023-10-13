'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation';
import Game from '@/components/Game';
import { useWebSocket } from '@/services/WebSocketContext';

export function handleInput(event, gameName, passwords, setPasswords) {
	const newPasswords = { ...passwords };
	newPasswords[gameName] = event.target.value;
	console.log(gameName);
	setPasswords(newPasswords);
}

export function makeBodyRequest(id, password) {
	return ({
		"player_id": id,
		"password": password !== '' ? password : null
	});
}

export async function handleClick(gameName, passwords, router) {
	let user = JSON.parse(localStorage.getItem('user'));
	const password = passwords[gameName] || '';
	try {
		const data_patch = makeBodyRequest(user.id, password);
		const response = await axios.patch(`http://localhost:8000/games/join/${gameName}`, data_patch);
		if (response?.status == 200) {
			localStorage.setItem('game', `{ "name": "${gameName}"}`);
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
		if(eventType == 'game_deleted' || eventType == 'game_created'){
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
										<Game key={index} game={game} handleClick={(gameName) => handleClick(gameName, passwords, router)} handleInput={(event, gameName) => handleInput(event, gameName, passwords, setPasswords)}></Game>
									))}
								</ul>
							)}
				</div>
			</div>
		</div>
	);
}

export default SearchGame;