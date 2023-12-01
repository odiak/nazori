import React, { FC, useState } from 'react'
import { Edit } from './Edit'
import { Picture } from './types'
import { Play } from './Play'

export const App: FC = () => {
  const [pictures, setPictures] = useState<Picture[]>(
    () => restorePictures() ?? [],
  )
  const [isEditing, setIsEditing] = useState(false)

  function onChangePictures(pictures: Picture[]) {
    setPictures(pictures)
    savePictures(pictures)
  }

  return (
    <>
      <p>なぞり書きの練習</p>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? '編集をおわる' : '編集する'}
      </button>
      {isEditing ? (
        <div>
          <Edit pictures={pictures} onChange={onChangePictures} />
        </div>
      ) : (
        <Play pictures={pictures} />
      )}
    </>
  )
}

function restorePictures(): Picture[] | undefined {
  const picturesStr = localStorage.getItem('nazori-pictures')
  if (!picturesStr) return
  try {
    return JSON.parse(picturesStr)
  } catch (e) {
    console.error(e)
    return
  }
}

function savePictures(pictures: Picture[]) {
  localStorage.setItem('nazori-pictures', JSON.stringify(pictures))
}
