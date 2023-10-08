'use client'

import './Table.css';
import Chat from '../Chat';
import Card from './Card';
import DiscarDeck from './DiscardDeck';
import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

const cardsPlayerMock = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
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

export function handleDragEnd(event, setCardsPlayer) {
  const { active, over } = event;

  if (over.id == 'discard-deck') {
    setCardsPlayer((cardsPlayer) => {
      const remove = cardsPlayer.findIndex((elem) => elem.id === active.id);
      cardsPlayer.splice(remove, 1);
      return arrayMove(cardsPlayer, 0, 0);;
    });
  }
  else  {
    setCardsPlayer((cardsPlayer) => {
      const oldIndex = cardsPlayer.findIndex((elem) => elem.id === active.id);
      const newIndex = cardsPlayer.findIndex((elem) => elem.id === over.id);
      return arrayMove(cardsPlayer, oldIndex, newIndex);
    });
  }
  
}

function Table() {
  let [cardsPlayer, setCardsPlayer] = useState(cardsPlayerMock);
  let items = [...cardsPlayer, 'discard-deck'];

  useEffect(() => {
    // Make get
  }, []);

  return (
    <div className="table is-flex is-flex-direction-row">
      <div className="table-cards is-flex is-flex-direction-column">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => { handleDragEnd(event, setCardsPlayer) }} //as onChange
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
                  // className='card-img'
                  src={`/cards/rev/revTakeAway.png`}
                  width={180}
                  alt=''
                  onClick={(e) => { selectCard(e) }}
                />
                <DiscarDeck
                  id='discard-deck'
                  src={`/cards/rev/revPanic.png`}
                  selectCard={selectCard}
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
                  if(card){
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