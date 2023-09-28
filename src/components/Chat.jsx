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
          <p className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </p>
          <p className="control">
            <button className="button is-info" onClick={sendMessage}>
              Enviar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}




// function Chat({className}){
//     return <div className={className}>
//         <div>
//             <p>17:30 Funalo: Apurense papá me saca de la compu</p>
//             <p>19:40 Mengano: Si ahí le mandamos, tranqui.</p>
//         </div>
//         <div>
//             <input/>
//             <button>enviar</button>
//         </div>

//     </div>
// }

export default Chat