import React, { FC, useState } from 'react'
import { Edit } from './Edit'
import { Picture } from './types'
import { Play } from './Play'

export const App: FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([])
  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Finish editing' : 'Edit'}
      </button>
      {isEditing ? (
        <div>
          <Edit pictures={pictures} onChange={setPictures} />
        </div>
      ) : (
        <Play pictures={pictures} />
      )}
    </>
  )
}
