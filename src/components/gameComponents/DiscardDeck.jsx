'use client'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function DiscarDeck({ id, src, selectCard }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: 'discard-deck'
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <img
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            id={id}
            src={src}
            width={180}
            alt=''
            onClick={(e) => { selectCard(e) }}
        />
    );
}

export default DiscarDeck;