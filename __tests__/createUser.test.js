import '@testing-library/jest-dom'
import axios from 'axios'
import { fireEvent, render, screen } from '@testing-library/react'
import React, { useState as useStateMock } from 'react'
// import { Server, WebSocket } from 'jest-websocket-mock'

import { check, checkUserName, createUser } from '@/app/create-user/page'
import CreateUser from '@/app/create-user/page.jsx'
import { WebSocketProvider } from '@/services/WebSocketContext'
import { UserGameProvider } from '@/services/UserGameContext'
// import { after } from 'node:test'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}))

jest.mock('axios')

describe('Tests for creating users', () => {
  describe('Tests for check', () => {
    test('Correct name', () => {
      expect(check('abc123')).toBeTruthy()
    })

    test('Void String', () => {
      expect(check('')).toBeFalsy()
    })

    test('Less than four characters (3)', () => {
      expect(check('abc')).toBeFalsy()
    })

    test('More than eigth characters (9)', () => {
      expect(check('abcdefghi')).toBeFalsy()
    })

    test('Only numbers', () => {
      expect(check('123456')).toBeFalsy()
    })

    test('Start with a number', () => {
      expect(check('1abc')).toBeFalsy()
    })

    describe('Special characters', () => {
      test('/', () => {
        expect(check('/abc123')).toBeFalsy()
        expect(check('abc/123')).toBeFalsy()
        expect(check('abc123/')).toBeFalsy()
      })

      test('+', () => {
        expect(check('+abc123')).toBeFalsy()
        expect(check('abc+123')).toBeFalsy()
        expect(check('abc123+')).toBeFalsy()
      })

      test('-', () => {
        expect(check('-abc123')).toBeFalsy()
        expect(check('abc-123')).toBeFalsy()
        expect(check('abc123-')).toBeFalsy()
      })

      test('*', () => {
        expect(check('*abc123')).toBeFalsy()
        expect(check('abc*123')).toBeFalsy()
        expect(check('abc123*')).toBeFalsy()
      })

      test('%', () => {
        expect(check('%abc123')).toBeFalsy()
        expect(check('abc%123')).toBeFalsy()
        expect(check('abc123%')).toBeFalsy()
      })

      test('@', () => {
        expect(check('@abc123')).toBeFalsy()
        expect(check('abc@123')).toBeFalsy()
        expect(check('abc123@')).toBeFalsy()
      })
    })
  })

  const setClassNameMock = jest.fn()
  const setIsCorrectMock = jest.fn()
  const setState = jest.fn()

  describe('Tests for checkUserName', () => {
    describe('Call setIsCorrect', () => {
      test('With right user name', () => {
        checkUserName('abcd', setIsCorrectMock, setClassNameMock)
        expect(setIsCorrectMock).toBeCalledWith(true)
      })

      test('With wrong user name', () => {
        checkUserName('', setIsCorrectMock, setClassNameMock)
        expect(setIsCorrectMock).toBeCalledWith(false)
      })
    })

    describe('Call setClassName', () => {
      test('Whit right user name', () => {
        checkUserName('abcd', setIsCorrectMock, setClassNameMock)
        expect(setClassNameMock).toBeCalledWith('is-tuki')
      })

      test('Whit wrong user name', () => {
        checkUserName('abcd', setIsCorrectMock, setClassNameMock)
        expect(setClassNameMock).toBeCalledWith('is-danger')
      })
    })

    describe('Right className', () => {
      beforeEach(() => {
        useStateMock.mockImplementation((init) => [init, setState])
        setClassNameMock.mockRestore()
        setIsCorrectMock.mockRestore()
      })

      afterEach(() => {
        useStateMock.mockRestore()
      })

      const socketContextMockValue = {
        event: jest.value,
        initializeWebSocket: jest.fn(),
        sendMessage: jest.fn()
      }

      const userContextMockValue = {
        user: jest.value,
        game: jest.value,
        setUserValues: jest.fn(),
        setGameValues: jest.fn()
      }

      test('At start', () => {
        render(
          <WebSocketProvider value={socketContextMockValue}>
            <UserGameProvider value={userContextMockValue}>
              <CreateUser />
            </UserGameProvider>
          </WebSocketProvider>
        )
        expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-tuki')
        expect(screen.getByRole('button', { name: 'Crear usuario' })).not.toHaveAttribute('disabled')
        expect(screen.getByRole('button', { name: 'Crear Partida' })).toHaveAttribute('disabled')
        expect(screen.getByRole('button', { name: 'Buscar Partida' })).toHaveAttribute('disabled')
        expect(screen.queryByText('Editar Usuario')).toBeNull()
      })

      test('At wrong user name input', () => {
        // let init = 'is-danger'
        // const initP = init
        // const setClassName = (value) => { init = value }
        // useStateMock.mockImplementation(() => [initP, setClassName])
        // setClassNameMock.mockImplementation((value) => value)
        // const setClassName = jest.spyOn('react', 'setState')
        // const state = useStateMock()
        // let init = 'is-danger'
        // const initP = init
        // const fun = (v) => { init = v }
        // setClassNameMock.mockImplementationOnce(() => ['is-danger', fun])
        // render(
        //   <WebSocketProvider value={socketContextMockValue}>
        //     <UserGameProvider value={userContextMockValue}>
        //       <CreateUser />
        //     </UserGameProvider>
        //   </WebSocketProvider>
        // )
        // jest.spyOn(React, 'useState').mockRestore()
        // const input = screen.getByPlaceholderText('Nombre')
        // fireEvent.change(input, { target: { value: 'abcd' } })
        // const button = screen.getByRole('button', { name: 'Crear usuario' })
        // fireEvent.click(button)
        // checkUserName('abcd', setIsCorrectMock, setClassNameMock)
        // expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-danger')
        // expect(setClassNameMock).toBeCalled()
      })

      // test('At right user name input', () => {
      //   useStateMock.mockImplementationOnce(() => ['is-tuki', setClassNameMock])
      //   render(<CreateUser />)
      //   checkUserName('abcd', setIsCorrectMock, setClassNameMock)
      //   expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-tuki')
      // })
    })
  })

  // describe('Tests for createUser', () => {
  //   beforeAll(() => {
  //     console.error = jest.fn()
  //   })

  //   afterAll(() => {
  //     console.error.mockRestore()
  //   })

  //   describe('Call setClassName correctly', () => {
  //     const localStorageMock = {
  //       getItem: jest.fn(),
  //       setItem: jest.fn(),
  //       removeItem: jest.fn(),
  //       clear: jest.fn()
  //     }

  //     beforeAll(() => {
  //       Object.defineProperty(window, 'localStorage', {
  //         value: localStorageMock,
  //         writable: true
  //       })
  //     })

  //     test('With is NOT correct', () => {
  //       setClassNameMock.mockReset()
  //       createUser(false, setClassNameMock)
  //       expect(setClassNameMock).not.toBeCalled()
  //     })

  //     test('With IS correct & success response', async () => {
  //       const responseData = { id: '1', name: 'user', status: '201' }
  //       axios.post.mockResolvedValue(responseData)
  //       await createUser(true, setClassNameMock)
  //       expect(setClassNameMock).toBeCalledWith('is-success')
  //     })

  //     test('With IS correct & bad response', async () => {
  //       const responseData = { id: '1', name: 'user', status: '404' }
  //       axios.post.mockResolvedValue(responseData)
  //       await createUser(true, setClassNameMock)
  //       setClassNameMock.mockReset()
  //       expect(setClassNameMock).not.toBeCalled()
  //     })
  //   })

  //   describe('Set disabled', () => {
  //     test('At start', () => {
  //       render(<CreateUser />)
  //       expect(screen.getByRole('button', { name: /Crear Partida/i })).toBeDisabled()
  //       expect(screen.getByRole('button', { name: /Buscar Partida/i })).toBeDisabled()
  //     })

  //     test('At wrong user name', async () => {
  //       render(<CreateUser />)
  //       const responseData = { id: '1', name: 'user', status: '201' }
  //       axios.post.mockResolvedValue(responseData)
  //       await createUser(false, setClassNameMock)
  //       expect(screen.getByRole('button', { name: /Crear Partida/i })).toBeDisabled()
  //       expect(screen.getByRole('button', { name: /Buscar Partida/i })).toBeDisabled()
  //     })

  //     test('At wrong response', async () => {
  //       render(<CreateUser />)
  //       const responseData = { id: '1', name: 'user', status: '404' }
  //       axios.post.mockResolvedValue(responseData)
  //       await createUser(true, setClassNameMock)
  //       expect(screen.getByRole('button', { name: /Crear Partida/i })).toBeDisabled()
  //       expect(screen.getByRole('button', { name: /Buscar Partida/i })).toBeDisabled()
  //     })

  //     test('At right response', async () => {
  //       render(<CreateUser />)
  //       const responseData = { id: '1', name: 'user', status: '201' }
  //       axios.post.mockResolvedValue(responseData)
  //       await createUser(true, setClassNameMock)
  //       expect(screen.getByRole('button', { name: /Crear Partida/i })).not.toBeDisabled()
  //       expect(screen.getByRole('button', { name: /Buscar Partida/i })).not.toBeDisabled()
  //     })
  //   })
  // })
})
