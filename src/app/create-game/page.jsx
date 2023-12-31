'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useUserGame } from '@/services/UserGameContext'
import axiosClient from '@/services/http-client/axios-client'

export const verifyUser = (router, user) => {
  if (user == null) {
    router.push('/')
  }
}

export const makeBodyRequest = (data, user) => {
  const host = user?.id
  const password = data.password !== '' ? data.password : null
  return {
    name: data.name,
    min_players: data.minPlayers,
    max_players: data.maxPlayers,
    password,
    host_player_id: host
  }
}

export const createGame = async (data, router, user, setGameValues) => {
  const newGame = makeBodyRequest(data, user)
  try {
    const response = await axiosClient.post('games/', newGame)
    if (response?.status === 201) {
      const gameParams = {
        name: data.name
      }
      setGameValues(gameParams)
      router.push('/lobby')
    }
  } catch (error) {
    if (error.code === 'ERR_BAD_REQUEST') {
      console.error('Request error', error)
    } else {
      console.error('Server Error', error)
    }
  }
}

function CreateGame () {
  const { user, setGameValues } = useUserGame()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  useEffect(() => {
    verifyUser(router, user)
  })

  return (
    <section className='hero is-halfheight is-flex is-flex-direction-column is-justify-content-space-evenly is-align-items-center'>
      <div className='level section'>
        <h2 className='title is-3 level-item'>Ingresa los datos de la partida</h2>
      </div>
      <div className='level section'>
        <form onSubmit={handleSubmit(data => createGame(data, router, user, setGameValues))} label='form'>
          <div className='field'>
            <label className='label is-large'>Nombre de la partida:</label>
            <input
              id='name'
              className={`input ${errors.name ? 'is-danger' : 'is-tuki'} is-large`}
              type='text'
              placeholder='Nombre de la partida'
              {...register('name', {
                required: {
                  value: true,
                  message: 'El nombre es requerido'
                },
                pattern: {
                  value: /^[a-zA-Z0-9]{1,10}$/,
                  message: 'Nombre invalido'
                }
              })}
            />
          </div>
          <div className='field'>
            <label className='label is-large'>Cantidad mínima de jugadores:</label>
            <input
              id='minPlayers'
              type='number'
              className={`input ${errors.minPlayers ? 'is-danger' : 'is-tuki'} is-large`}
              {...register('minPlayers', {
                required: true,
                min: 4,
                max: 12
              })}
            />
          </div>
          <div className='field'>
            <label className='label is-large'>Cantidad máxima de jugadores:</label>
            <input
              id='maxPlayers'
              type='number'
              className={`input ${errors.maxPlayers ? 'is-danger' : 'is-tuki'} is-large`}
              {...register('maxPlayers', {
                required: true,
                min: watch('minPlayers'),
                max: 12
              })}
            />
          </div>
          <div className='field'>
            <label className='label is-large'>Contraseña (opcional):</label>
            <input
              id='pass'
              className={`input ${errors.password ? 'is-danger' : 'is-tuki'} is-large`}
              {...register('password', {
                pattern: {
                  value: /^[a-zA-Z0-9]{1,16}$/,
                  message: 'Contraseña invalida'
                }
              })}
            />
          </div>
          <button
            id='sendButton'
            className='button is-tuki is-large'
            type='submit'
            label='form'
          >
            Enviar
          </button>
        </form>
      </div>
      <div
        className='createG'
        style={
          {
            backgroundImage: 'url("/backgrounds/gif2.gif")',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%',
            zIndex: '-1'
          }
        }
      />
    </section>
  )
}

export default CreateGame
