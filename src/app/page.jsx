'use client'

import CreateUser from '@/app/create-user/page'

function Home () {
  return (
    <div className='hero is-flex is-flex-direction-column is-justify-content-center is-fullheight'>
      <h1 className='title is-1 is-uppercase is-italic has-text-centered section'>
        La Cosa
      </h1>
      <CreateUser> </CreateUser>
      <div
        className='home'
        style={
          {
            backgroundImage: 'url("/backgrounds/gif2.gif")',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%',
            zIndex: '-1'
          }
        }
      />
    </div>
  )
}

export default Home
