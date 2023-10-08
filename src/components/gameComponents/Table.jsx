'use client'

import './Table.css';
import Chat from '../Chat';
import Card from './Card';
import DiscardDeck from './DiscardDeck';
import PlayCard from './PlayCard';
import Chair from './Chair';
import { setPath } from './Card';
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

const angle = [-15, -10, 10, 15, 20];

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

export function removeFromHand(setCardsPlayer, id) {
  setCardsPlayer((cardsPlayer) => {
    const remove = cardsPlayer.findIndex((elem) => elem.id === id);
    cardsPlayer.splice(remove, 1);
    return arrayMove(cardsPlayer, 0, 0);
  });
}

export function addToHand(setCardsPlayer, id) {
  setCardsPlayer((cardsPlayer) => {
    if (cardsPlayer.length < 5) {
      return cardsPlayer.concat({ id: id, name: "5" });
    }
    return cardsPlayer;
  });
}

export function sortCards(setCardsPlayer, overId, activeId) {
  setCardsPlayer((cardsPlayer) => {
    const oldIndex = cardsPlayer.findIndex((elem) => elem.id === activeId);
    const newIndex = cardsPlayer.findIndex((elem) => elem.id === overId);
    return arrayMove(cardsPlayer, oldIndex, newIndex);
  });
}

export function handleDragEnd(event, setCardsPlayer, setPlayBG, setDiscardBG) {
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
    if (confirm("¿Quieres descartar esta carta?") == true) {
      let path = setPath(active.id);
      setDiscardBG(path);
      removeFromHand(setCardsPlayer, active.id)
    } else {
      setDiscardBG(`/cards/rev/revPanic.png`);
    }

  }
  else if (over.id == 'play-card') {
    // Playing
    if (active.id - 21 <= 0) {
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
    sortCards(setCardsPlayer, over.id, active.id)
  }

}

export function newCard(setCardsPlayer) {
  let random = Math.floor(Math.random() * (108 - 2 + 1) + 2);
  addToHand(setCardsPlayer, random);
}

function Table() {

  let [cardsPlayer, setCardsPlayer] = useState(cardsPlayerMock);
  // let [items, setItems] = useState([...cardsPlayerMock, 'discard-deck', 'play-card']);
  let [playBG, setPlayBG] = useState(`/cards/rev/109Rev.png`);
  let [discardBG, setDiscardBG] = useState(`/cards/rev/revPanic.png`);
  let items = [...cardsPlayer, 'discard-deck', 'play-card'];

  useEffect(() => {
    // Make get
  }, []);


  return (
    <div className="table is-flex is-flex-direction-row">
      <div className="table-cards is-flex is-flex-direction-column">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => { handleDragEnd(event, setCardsPlayer, setPlayBG, setDiscardBG) }} //as onChange
        >
          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            <div
              className="room"
              style={
                {
                  backgroundImage: 'url("/backgrounds/floorBG2.png")',
                  backgroundSize: 'cover',
                  boxShadow: '0 0 5px 5px #c3c4c6'
                }
              }>
              <div className="is-flex is-align-items-end is-justify-content-end item">

              </div>
              <div className="is-flex is-align-items-end is-justify-content-space-around item">
                <Chair rotation={0} size={200} type={'Whole'} />
                <Chair rotation={0} size={200} type={'Whole'} />
              </div>
              <div className="is-flex is-align-items-end is-justify-content-space-around item">
                <Chair rotation={0} size={200} type={'Whole'} />
                <Chair rotation={0} size={200} type={'Whole'} />
              </div>
              <div className="is-flex is-align-items-end is-justify-content-start item">

              </div>
              <div className="is-flex is-align-items-center is-justify-content-end item">
                <Chair rotation={-90} size={120} type={'Right'} />
              </div>
              <div
                className="is-flex is-justify-content-space-evenly is-align-items-center item table-cells"
                style={
                  {
                    backgroundImage: 'url("/backgrounds/tableBG.png")',
                    backgroundSize: 'cover'
                  }
                }
              >
                <img
                  id='deck'
                  src={`/cards/rev/revTakeAway.png`}
                  width={180}
                  alt=''
                  style={{ borderRadius: '5%' }}
                  onClick={() => { newCard(setCardsPlayer) }}
                />
                <PlayCard
                  id='play-card'
                  src={playBG}
                />
                <DiscardDeck
                  id='discard-deck'
                  src={discardBG}
                />
              </div>
              <div className="is-flex is-align-items-center is-justify-content-start item">
                <Chair rotation={90} size={120} type={'Left'} />
              </div>
              <div className="is-flex is-align-items-center is-justify-content-end item">
                <Chair rotation={-90} size={120} type={'Left'} />
              </div>
              <div className="is-flex is-align-items-center is-justify-content-start item">
                <Chair rotation={90} size={120} type={'Right'} />
              </div>
              <div className="is-flex is-align-items-start is-justify-content-end item">

              </div>
              <div className="is-flex is-align-items-start is-justify-content-space-around item">
                <Chair rotation={180} size={200} type={'Whole'} />
                <Chair rotation={180} size={200} type={'Whole'} />
              </div>
              <div className="is-flex is-align-items-start is-justify-content-space-around item">
                <Chair rotation={180} size={200} type={'Whole'} />
                <Chair rotation={180} size={200} type={'Whole'} />
              </div>
              <div className="is-flex is-align-items-start is-justify-content-start item item">

              </div>
            </div>
            <div
              className="cards is-flex is-flex-direction-row is-justify-content-center"
              style={
                {
                  backgroundImage: 'url("/backgrounds/tableBG.png")',
                  backgroundSize: 'cover',
                  boxShadow: '0 0 5px 5px #138e5a'
                }
              }
            >
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
      <div
        className="chat has-text-centered column is-flex is-flex-direction-column is-justify-content-space-evenly"
        style={{
          backgroundColor: 'grey'
        }}
      >
        <Chat></Chat>
      </div>
    </div>
  );
}

export default Table;