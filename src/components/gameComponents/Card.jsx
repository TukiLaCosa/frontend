'use client'

import { useSortable } from '@dnd-kit/sortable'
import { setPath } from '@/services/setPath'
import { CSS } from '@dnd-kit/utilities'
import './Card.css'

function Card ({ id, selectCard }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderRadius: '5%'
  }

  return (
    <img
      {...attributes}
      {...listeners}
      style={style}
      ref={setNodeRef}
      id={id}
      className='card-img'
      src={setPath(id)}
      width={200} height={100}
      alt=''
      onClick={(e) => { selectCard(e) }}
    />
  )
}

export default Card
