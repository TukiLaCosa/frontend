import React, { createContext, useContext, useState } from 'react';

export const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {

    const [socket , setSocket] = useState(null);

    const initializeWebSocket = (id) => {
        if (id) {
            const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/${id}`);
            setSocket(newSocket);

            // newSocket.onopen = () => {
            //     console.log('WebSocket connection opened');
            //     // Send user ID to the server when the connection is established
            //     // newSocket.send(`User ID: ${userId}`);
            // };

            // newSocket.onmessage = (event) => {
            //     console.log('Received a websocket message:', event.data);
            //     // Handle WebSocket messages here
            // };

            // newSocket.onclose = () => {
            //     console.log('WebSocket connection closed');
            //     // Handle reconnection logic if needed
            // };
        }
      };

    return (
        <WebSocketContext.Provider value={{ socket, initializeWebSocket }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    return useContext(WebSocketContext);
}
