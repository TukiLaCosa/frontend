'use client'

import { useSortable } from '@dnd-kit/sortable'

function DiscardDeck ({ id, src }) {
  const {
    attributes,
    listeners,
    setNodeRef
  } = useSortable({
    id
  })

  const style = {
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
  )
}

export default DiscardDeck
