'use client';
import { useState } from 'react';

export function Chat() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = () => {
    if (message) {
      setChatLog([...chatLog, message]);
      setMessage('');
    }
  };

  return (
    <div className="is-flex is-flex-direction-column chat">
      <div className="section">
        <div className="section over">
          <div className="content">
            {chatLog.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="control">
            <button className="button is-info" onClick={sendMessage}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat