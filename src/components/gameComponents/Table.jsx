'use client'

import './Table.css';
import Chat from '../Chat';
import { useState } from 'react';
import Image from 'next/image';

const cardsPlayerMock = [
  {
    id: 1,
    name: "1"
  },
  {
    id: 2,
    name: "2"
  },
  {
    id: 3,
    name: "3"
  },
  {
    id: 4,
    name: "4"
  },
  {
    id: 5,
    name: "5"
  },
];

export function selectCard(event, id) {
  // setCardSelected(id);
  let element = event.target;
  console.log(typeof element.tagName);

  if (element.tagName == 'P') {
    element = element.parentNode
  }

  if (element.style.border == "2px solid blue") {
    element.style.border = "1px solid red";
  }
  else {
    element.style.border = "2px solid blue";
  }
}

function Table() {
  let [cardsPlayer, setCardsPlayer] = useState(cardsPlayerMock);
  let [cardSelected, setCardSelected] = useState(0);

  return (
    <div className="table is-flex is-flex-direction-row is-justify-content-center">
      <div className="cards has-text-centered column is-flex is-flex-direction-column is-justify-content-space-evenly">
        <h2 className='title is-2'>TUS CARTAS</h2>
        {
          cardsPlayer.map((card) => {
            return (
              <div
                className="card is-flex is-flex-direction-row is-justify-content-space-between"
                key={card.id}
                onClick={(event) => { selectCard(event, card.id) }}>
                <Image src={`/cards/front/00${card.id}.png`} width={100} height={50} />
                <p>info de la carta {card.id}</p>
              </div>)
          })
        }
      </div>
      <div className="room">
        <div className="is-flex is-align-items-end is-justify-content-end item">

        </div>
        <div className="is-flex is-align-items-end is-justify-content-space-around item">
          <p>1</p>
          <p>2</p>
        </div>
        <div className="is-flex is-align-items-end is-justify-content-space-around item">
          <p>3</p>
          <p>4</p>
        </div>
        <div className="is-flex is-align-items-end is-justify-content-start item">

        </div>
        <div className="is-flex is-align-items-center is-justify-content-end item">
          <p>12</p>
        </div>
        <div className="is-flex is-justify-content-space-evenly is-align-items-center item table-cells">
          <p>Mazo de cartas</p>
          <p>Mazo de descarte</p>
        </div>
        <div className="is-flex is-align-items-center is-justify-content-start item">
          <p>5</p>
        </div>
        <div className="is-flex is-align-items-center is-justify-content-end item">
          <p>11</p>
        </div>
        <div className="is-flex is-align-items-center is-justify-content-start item">
          <p>6</p>
        </div>
        <div className="is-flex is-align-items-start is-justify-content-end item">

        </div>
        <div className="is-flex is-align-items-start is-justify-content-space-around item">
          <p>9</p>
          <p>10</p>
        </div>
        <div className="is-flex is-align-items-start is-justify-content-space-around item">
          <p>7</p>
          <p>8</p>
        </div>
        <div className="is-flex is-align-items-start is-justify-content-start item item">

        </div>
      </div>
      <div className="chat cards has-text-centered column is-flex is-flex-direction-column is-justify-content-space-evenly" style={{border:"1px solid green"}}>
        <Chat></Chat>
      </div>
    </div>
  );
}

export default Table;