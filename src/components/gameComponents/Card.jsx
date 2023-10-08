'use client'

import { useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Card.css'

export function setPath(id){
    const zeros = '0'.repeat((3 - id.toString().length) % 3);
    const path = `/cards/front/${zeros}${id}.png`;
    return path;
}

function Card({ id, selectCard, rotation }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        borderRadius: '5%'
    }

    useEffect(() => {
        let card = document.getElementById(`${id}`);
        // card.style.transform = `rotate(${rotation}deg)`;
    }, []);

    return (
        <img
            { ...attributes }
            { ...listeners }
            style={style}
            ref={setNodeRef}
            id={id}
            className='card-img'
            src={setPath(id)}
            width={200} height={100}
            alt=''
            onClick={(e) => { selectCard(e) }}
        />
    );
}

export default Card;