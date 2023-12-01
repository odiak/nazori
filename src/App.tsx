import React, { FC, useState } from 'react'
import { Edit } from './Edit'
import { Picture } from './types'
import { Play } from './Play'

export const App: FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([])
  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <p>なぞり書きの練習</p>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? '編集をおわる' : '編集する'}
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
