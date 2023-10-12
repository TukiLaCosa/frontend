'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

let userNameInput;
let searchGameButton;
let createGameButton;

export function check(userName) {
	let userRegEx = /^[a-zA-Z][a-zA-Z0-9]{3,7}$/;

	return userRegEx.test(userName);
}

export function checkUserName(userName, setIsCorrect, setClassName) {
	if (check(userName)) {
		setIsCorrect(true);
		setClassName('is-tuki');
	}
	else {
		setIsCorrect(false);
		setClassName('is-danger');
	}
}

export function onUserExist(setExistUser) {
	setExistUser(true);
	userNameInput.setAttribute('disabled', '');
	searchGameButton.removeAttribute('disabled');
	createGameButton.removeAttribute('disabled');
}

export async function editUser(setExistUser){
	setExistUser(false);
	userNameInput.removeAttribute('disabled');
	createGameButton.setAttribute('disabled', '');
	searchGameButton.setAttribute('disabled', '');
	const userID = JSON.parse(localStorage.getItem('user')).id;
	const url = `http://127.0.0.1:8000/players/${userID}`;
	const response = await axios.delete(url);
	localStorage.clear();
	console.log(response);
}

export async function createUser(isCorrect, setClassName, setExistUser) {
	if (isCorrect) {
		const newUser = { name: userNameInput.value };

		try {
			const response = await axios.post('http://localhost:8000/players/', newUser);
			if (response?.status == 201) {
				onUserExist(setExistUser);
				setClassName('is-success');
				localStorage.setItem('user', `{ "id": ${response.data.id}, "name": "${response.data.name}"}`);
			}
		}
		catch (error) {
			if (error.code === 'ERR_BAD_REQUEST') {
				console.error('Request error');
			}
			else {
				console.error('Server Error');
			}
		}
	}
}

function CreateUser() {
	let [className, setClassName] = useState('is-tuki');
	let [isCorrect, setIsCorrect] = useState(false);
	let [existUser, setExistUser] = useState(false);

	useEffect(() => {
		userNameInput = document.getElementById('name');
		searchGameButton = document.getElementById('search-game');
		createGameButton = document.getElementById('create-game');

		const userPrev = localStorage.getItem('user');

		if (userPrev) {
			userNameInput.placeHolder = JSON.parse(userPrev).name;
			userNameInput.value = JSON.parse(userPrev).name;
			onUserExist(setExistUser);
		}

	}, [className]);

	return (
		<section className='hero is-halfheight is-flex is-flex-direction-column is-justify-content-space-evenly is-align-items-center'>
			<div className='level section'>
				<h2 className='title is-3 level-item'>Ingresa un nombre de usuario</h2>
			</div>
			<div className='level'>
				<input type='text' id='name' className={`input is-large ${className}`} onInput={() => { checkUserName(userNameInput.value, setIsCorrect, setClassName) }} placeholder='Nombre' />
				{
					!existUser ?
						<button id='create-user' className='button is-tuki is-large' onClick={() => { createUser(isCorrect, setClassName, setExistUser) }}>Crear usuario</button>
						:
						<button id='edit-user' className='button is-tuki is-large' onClick={() => { editUser(setExistUser) }} disabled={false}>Editar Usuario</button>
				}
			</div>
			<div className='level buttons are-large'>
				<Link href='/create-game' className='section'>
					<button id='create-game' className='button is-tuki' disabled>Crear Partida</button>
				</Link>
				<Link href='/search-game' className='section'>
					<button id='search-game' className='button is-tuki' disabled>Buscar Partida</button>
				</Link>
			</div>
		</section>
	)
}

export default CreateUser;