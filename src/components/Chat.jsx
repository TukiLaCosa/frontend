'use client'

import { useState, useRef, useEffect } from 'react'
import { useWebSocket } from '@/services/WebSocketContext'
import { useUserGame } from '@/services/UserGameContext'

export function Chat () {
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState([])
  const messagesEndRef = useRef(null)
  const { user, game } = useUserGame()
  const { event, sendMessage } = useWebSocket()

  const userName = user.name
  const gameName = game.name

  const sendMessages = () => {
    if (message) {
      setChatLog((chatLog) => [...chatLog, { content: `${message}`, type: 'sent', name: `${userName}` }])
      sendMessage(message, userName, gameName)
      setMessage('')
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatLog])

  useEffect(() => {
    const eventJSON = JSON.parse(event)
    if (eventJSON?.event === 'message') {
      setChatLog((chatLog) => [
        ...chatLog,
        { content: `${eventJSON.message}`, type: 'received', name: `${eventJSON.from}` }
      ])
    }
  }, [event])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessages()
    }
  }

  return (
    <div className='box is-shadowless is-flex is-flex-direction-column is-justify-content-end chat full-grid-area' style={{ minHeight: '100%' }}>
      <div className='messages-container' style={{ overflowY: 'auto' }}>
        {chatLog.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <span className='user-name'>{msg.name}</span> <span>{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='field is-grouped'>
        <div className='control is-expanded'>
          <input
            className='input'
            type='text'
            placeholder='Escribe un mensaje...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className='control'>
          <button className='button is-info' onClick={sendMessages}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
