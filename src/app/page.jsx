'use client'

import CreateUser from '@/app/create-user/page';
import { WebSocketProvider } from '@/services/WebSocketContext';
import { useState } from 'react';

export default function Home({ Component, pageProps }) {
  let [wsID, setWsId] = useState(null);
  return (
    <div className="hero is-flex is-flex-direction-column is-justify-content-center is-fullheight">
      <h1 className="title is-1 is-uppercase is-italic has-text-centered section">Tuki La Cosa</h1>
      <CreateUser> </CreateUser>
    </div>
  )
}
