'use client'

import { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '@/services/WebSocketContext';

export function Chat() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const messagesEndRef = useRef(null);
  let userName = "";
  let gameName = "";

  const { socket, initializeWebSocket } = useWebSocket();

  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user'));
    const game = JSON.parse(localStorage.getItem('game'));
    if (user && game && user.name && game.name) {
      userName = user.name;
      gameName = game.name
    }
  } else {
    console.log('You are on the server')
  }

  const sendMessage = () => {
    if (message) {
      setChatLog((chatLog) => [...chatLog, { content: `${message}`, type: 'sent', name: `${userName}` }]);
      const send = `{
        "event":"message",
        "message":"${message}",
        "from":"${userName}",
        "game_name":"${gameName}"
      }`
      socket.send(send);
      setMessage('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  useEffect(() => {
    initializeWebSocket(JSON.parse(localStorage.getItem('user')).id);
    return (() => {
      socket?.close();
    })
  }, []);

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        if (JSON.parse(event.data).event == 'message') {
          const messageData = JSON.parse(event.data);
          setChatLog((chatLog) => [...chatLog, { content: `${messageData.message}`, type: 'received', name: `${messageData.from}` }]);
        }
      });
    }
  }, [socket]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="box is-shadowless is-flex is-flex-direction-column is-justify-content-end chat full-grid-area" style={{ minHeight: '100%' }}>
      <div className="messages-container" style={{ overflowY: 'auto' }}>
        {chatLog.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <span className="user-name">{msg.name}</span> <span>{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="field is-grouped">
        <div className="control is-expanded">
          <input
            className="input"
            type="text"
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="control">
          <button className="button is-info" onClick={sendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat
