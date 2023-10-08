'use client'

import './Table.css';
import Chat from '../Chat';
import Card from './Card';
import { setPath } from './Card';
import DiscardDeck from './DiscardDeck';
import PlayCard from './PlayCard';
import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

const cardsPlayerMock = [
  { id: 1, name: "1" },
  { id: 99, name: "2" },
  { id: 32, name: "3" },
  { id: 50, name: "4" },
  // { id: 5, name: "5" },
];

const angle = [-15, -10, 10, 15, 20]

export function selectCard(event) {

  // let element = event.target;

  // if(element.style.border.includes('yellow')){
  //   element.style.border = '';
  // }
  // else{
  //   element.style.border = "1px solid yellow";
  // }
  // console.log(element.style)
}

export function removeFromHand(setCardsPlayer, id){
  setCardsPlayer((cardsPlayer) => {
    const remove = cardsPlayer.findIndex((elem) => elem.id === id);
    cardsPlayer.splice(remove, 1);
    return arrayMove(cardsPlayer, 0, 0);
  });
}

export function addToHand(setCardsPlayer, id){
  setCardsPlayer((cardsPlayer) => {
    if (cardsPlayer.length < 5) {
      return cardsPlayer.concat({ id: id, name: "5" });
    }
    return cardsPlayer;
  });
}

export function handleDragEnd(event, setCardsPlayer, setPlayBG) {
  const { active, over } = event;

  if (over.id == 'discard-deck') {
    // Discarding
    if (active.id == 1) {
      alert('So grasioso bo?');
      alert('`ja eso ái');
      return;
    }
    else if (false) { // Checkque turno
      alert('Paraaaaaaaaa!');
      return;
    }
    removeFromHand(setCardsPlayer, active.id)
  }
  else if (over.id == 'play-card') {
    // Playing
    if(active.id == 1){
      alert('raja de aca ca`eza');
      return;
    }
    if (confirm("¿Quieres jugar esta carta?") == true) {
      let path = setPath(active.id);
      setPlayBG(path);
      removeFromHand(setCardsPlayer, active.id);
    } else {
      setPlayBG(`/cards/rev/109Rev.png`);
    }
    
  }
  else {
    // Just sorting
    console.log(over.id)
    setCardsPlayer((cardsPlayer) => {
      const oldIndex = cardsPlayer.findIndex((elem) => elem.id === active.id);
      const newIndex = cardsPlayer.findIndex((elem) => elem.id === over.id);
      return arrayMove(cardsPlayer, oldIndex, newIndex);
    });
  }

}

export function newCard(setCardsPlayer) {
  let random = Math.floor(Math.random() * (108 - 2 + 1) + 2);
  addToHand(setCardsPlayer, random);
}

function Table() {

  let [cardsPlayer, setCardsPlayer] = useState(cardsPlayerMock);
  let [playBG, setPlayBG ] = useState(`/cards/rev/109Rev.png`);
  let items = [...cardsPlayer, 'discard-deck', 'play-card'];

  useEffect(() => {
    // Make get
  }, []);


  return (
    <div className="table is-flex is-flex-direction-row">
      <div className="table-cards is-flex is-flex-direction-column">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => { handleDragEnd(event, setCardsPlayer, setPlayBG) }} //as onChange
        >
          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
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
                <img
                  id='deck'
                  src={`/cards/rev/revTakeAway.png`}
                  width={180}
                  alt=''
                  style={{borderRadius: '5%'}}
                  onClick={() => { newCard(setCardsPlayer) }}
                />
                <PlayCard
                  id='play-card'
                  src={playBG}
                />
                <DiscardDeck
                  id='discard-deck'
                  src={`/cards/rev/revPanic.png`}
                />
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
            <div className="cards is-flex is-flex-direction-row is-justify-content-center">
              {

                cardsPlayer.map((card, index) => {
                  if (card) {
                    return (
                      <Card id={card.id} selectCard={selectCard} key={card.id} rotation={angle[card.id - 1]}></Card>
                    )
                  }
                  else {
                    return <span key={index}></span>
                  }
                })

              }
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="chat has-text-centered column is-flex is-flex-direction-column is-justify-content-space-evenly">
        <Chat></Chat>
      </div>
    </div>
  );
}

export default Table;