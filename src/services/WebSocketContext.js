import React, { createContext, useContext, useState } from 'react'

export const WebSocketContext = createContext()

export function WebSocketProvider ({ children }) {
  const [socket, setSocket] = useState(null)
  const [event, setEvent] = useState(null)

  const initializeWebSocket = (id) => {
    if (id) {
      const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/${id}`)
      setSocket(newSocket)

      newSocket.onopen = () => {
        console.log('WebSocket connection opened')
      }

      newSocket.onmessage = (e) => {
        console.log(e.data)
        setEvent(e.data)
      }

      newSocket.onclose = () => {
        console.log('WebSocket connection closed')
        setSocket(new WebSocket(`ws://127.0.0.1:8000/ws/${id}`))
      }

      newSocket.onerror = (e) => {
        console.log('error', e)
      }
    }
  }

  const sendMessage = (message, userName, gameName) => {
    const send = `{
            "event":"message",
            "message":"${message}",
            "from":"${userName}",
            "game_name":"${gameName}"
          }`
    socket.send(send)
  }

  return (
    <WebSocketContext.Provider value={{ event, initializeWebSocket, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  return useContext(WebSocketContext)
}
