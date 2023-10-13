'use client'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function PlayCard({ id, src}) {

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
        // transform: CSS.Transform.toString(transform),
        // transition
        borderRadius: '5%'
    }

    return (
        <img
            {...attributes}
            {...listeners}
            style={style}
            ref={setNodeRef}
            id={id}
            src={src}
            width={180}
            alt=''
        />
    );
}

export default PlayCard;