'use client';
import Image from "next/image";

function ListPlayers({ players, hostID }) {
  const monstersContext = require.context('!@svgr/webpack!../../public/monsters', false, /\.svg$/);
  const monsters = monstersContext.keys().map(monstersContext);

  function RandomMonster() {
    const randomIndex = Math.floor(Math.random() * monsters.length);
    const SelectedMonster = monsters[randomIndex].default;
    return <SelectedMonster className="monster-image" />;
  }

  return <div className="block mt-2 listPlayers" style={{ overflowY: 'auto' }}>
    {players?.map((player, index) => (
      <div className="box media" key={index}>
        <div className="media-left">
          <figure className="image is-64x64">
            <RandomMonster />
          </figure>
        </div>
        <div className="media-content">
          <p className="content">
          {player.id===hostID && <Image src="/icons/crown-solid.svg" alt="Host" width="20" height="20"/>}
          {player.name}</p>
        </div>
      </div>
    ))}
  </div>
}

export default ListPlayers