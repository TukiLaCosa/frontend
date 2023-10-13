'use client'

import CreateUser from '@/app/create-user/page';

export default function Home() {
  return (
    <div className="hero is-flex is-flex-direction-column is-justify-content-center is-fullheight">
      <h1 className="title is-1 is-uppercase is-italic has-text-centered section">Tuki La Cosa</h1>
      <CreateUser> </CreateUser>
    </div>
  )
}
