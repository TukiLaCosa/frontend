'use client';
import { useState, useRef, useEffect } from 'react';

export function Chat() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const messagesEndRef = useRef(null);
  let userName = "";

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      userName = user.name + ":";
    }
  } catch (error) {
    console.error("Error obteniendo el nombre de usuario:", error);
  }
  const sendMessage = () => {
    if (message) {
      setChatLog([...chatLog, { content:`${message}`, type: 'sent' }]);
      setMessage('');
    }
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
  return (
    <div className="box is-shadowless is-flex is-flex-direction-column is-justify-content-space-between chat full-grid-area">
      <div className="messages-container" style={{height: '90vh' ,overflowY: 'auto' }}>
        {chatLog.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <span className="user-name">{userName}</span> <span>{msg.content}</span>
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
        <div className="control" style={{position: "sticky", bottom: "0" ,}}>
          <button className="button is-info" onClick={sendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat
