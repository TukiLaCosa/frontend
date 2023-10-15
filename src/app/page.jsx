'use client'

import CreateUser from '@/app/create-user/page';

export default function Home() {
  return (
    <div className="hero is-flex is-flex-direction-column is-justify-content-center is-fullheight">
      <h1 className="title is-1 is-uppercase is-italic has-text-centered section">La Cosa</h1>
      <CreateUser> </CreateUser>
      <div
        className="home"
        style={
          {
            "background-image": 'url("/backgrounds/gif2.gif")',
            position: 'fixed',
            top: 0,
            left: 0,
            "background-size": 'cover',
            width: '100%',
            height: '100%',
            "z-index": '-1'
          }
        }>
      </div>
    </div>
  )
}
