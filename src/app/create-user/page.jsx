'use client'

import { useEffect, useState } from 'react'
import { useWebSocket } from '@/services/WebSocketContext'
import { useUserGame } from '@/services/UserGameContext'
import Link from 'next/link'
import axios from 'axios'

let userNameInput
let searchGameButton
let createGameButton

export const check = (userName) => {
  const userRegEx = /^[a-zA-Z][a-zA-Z0-9]{3,7}$/
  return userRegEx.test(userName)
}

export const checkUserName = (userName, setIsCorrect, setClassName) => {
  if (check(userName)) {
    setIsCorrect(true)
    setClassName('is-tuki')
  } else {
    setIsCorrect(false)
    setClassName('is-danger')
  }
}

export const onUserExist = (setExistUser) => {
  setExistUser(true)
  userNameInput.setAttribute('disabled', '')
  searchGameButton.removeAttribute('disabled')
  createGameButton.removeAttribute('disabled')
}

export const editUser = async (setExistUser, userID) => {
  setExistUser(false)
  userNameInput.removeAttribute('disabled')
  createGameButton.setAttribute('disabled', '')
  searchGameButton.setAttribute('disabled', '')
  const url = `http://127.0.0.1:8000/players/${userID}`
  const response = await axios.delete(url)
  if (!response?.ok) {
    console.log(response)
  }
}

export const createUser = async (isCorrect, setClassName, setExistUser, initializeWebSocket, setUserValues) => {
  if (isCorrect) {
    const newUser = { name: userNameInput.value }

    try {
      const response = await axios.post('http://localhost:8000/players/', newUser)
      if (response?.status === 201) {
        onUserExist(setExistUser)
        setClassName('is-success')
        initializeWebSocket(response.data.id)
        const userParams = {
          id: response.data.id,
          name: response.data.name
        }
        setUserValues(userParams)
      }
    } catch (error) {
      if (error.code === 'ERR_BAD_REQUEST') {
        console.error('Request error')
      } else {
        console.error('Server Error')
      }
    }
  }
}

function CreateUser () {
  const [className, setClassName] = useState('is-tuki')
  const [isCorrect, setIsCorrect] = useState(false)
  const [existUser, setExistUser] = useState(false)
  const { initializeWebSocket } = useWebSocket()
  const { user, setUserValues } = useUserGame()

  useEffect(() => {
    userNameInput = document.getElementById('name')
    searchGameButton = document.getElementById('search-game')
    createGameButton = document.getElementById('create-game')
  }, [className])

  useEffect(() => {
    const userPrev = user?.name
    if (userPrev != null) {
      userNameInput.placeHolder = userPrev
      userNameInput.value = userPrev
      onUserExist(setExistUser)
    }
  }, [user])

  return (
    <section className='hero is-halfheight is-flex is-flex-direction-column is-justify-content-space-evenly is-align-items-center'>
      <div className='level section'>
        <h2 className='title is-3 level-item'>Ingresa un nombre de usuario</h2>
      </div>
      <div className='level'>
        <input type='text' id='name' className={`input is-large ${className}`} onInput={() => { checkUserName(userNameInput.value, setIsCorrect, setClassName) }} placeholder='Nombre' />
        {
          !existUser
            ? <button id='create-user' className='button is-tuki is-large' onClick={() => { createUser(isCorrect, setClassName, setExistUser, initializeWebSocket, setUserValues) }}>Crear usuario</button>
            : <button id='edit-user' className='button is-tuki is-large' onClick={() => { editUser(setExistUser, user?.id) }} disabled={false}>Editar Usuario</button>
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

export default CreateUser
