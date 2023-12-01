import React, { FC, PointerEvent, useRef, useState } from 'react'
import { Line, Picture, Point } from './types'
import { drawLine, getPoint } from './utils/canvas'
import { Preview } from './Preview'
import { appendPoint } from './utils/point'

type Props = {
  pictures: Picture[]
  onChange?: (pictures: Picture[]) => void
}

const size = 500

/** drawing */
export const Edit: FC<Props> = ({ pictures: initialPictures, onChange }) => {
  const [pictures, setPictures] = useState<Picture[]>(initialPictures)

  const [editingPictureIndex, setEditingPictureIndex] = useState<number>()

  const ctxRef = useRef<CanvasRenderingContext2D>()

  function canvasRefCallback(canvas: HTMLCanvasElement | null) {
    ctxRef.current = canvas?.getContext('2d') ?? undefined
  }

  const lines = useRef<Line[]>([])
  const drawingLine = useRef<Line>()

  function fireOnChange(pictures: Picture[]) {
    if (onChange) {
      setTimeout(() => onChange(pictures), 0)
    }
  }

  function update() {
    requestAnimationFrame(() => {
      const ctx = ctxRef.current
      if (!ctx) return

      ctx.clearRect(0, 0, size, size)
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 10
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (const line of lines.current) {
        drawLine(ctx, line, size)
      }

      const line = drawingLine.current
      if (line) {
        drawLine(ctx, line, size)
      }
    })
  }

  function onPointerDown(e: PointerEvent<HTMLCanvasElement>) {
    if (drawingLine.current !== undefined) return

    drawingLine.current = [getPointWithFactor(e, size)]
  }
  function onPointerMove(e: PointerEvent<HTMLCanvasElement>) {
    if (drawingLine.current === undefined) return

    drawingLine.current = appendPoint(
      drawingLine.current,
      getPointWithFactor(e, size),
    )

    update()
  }
  function onPointerUp(e: PointerEvent<HTMLCanvasElement>) {
    if (drawingLine.current === undefined) return

    lines.current = [
      ...lines.current,
      appendPoint(drawingLine.current, getPointWithFactor(e, size)),
    ]
    drawingLine.current = undefined

    update()
  }
  function onPointerCancel(e: PointerEvent<HTMLCanvasElement>) {
    if (drawingLine.current === undefined) return

    drawingLine.current = undefined

    update()
  }

  function undo() {
    lines.current = lines.current.slice(0, -1)
    update()
  }

  function clear() {
    lines.current = []
    update()
  }

  function onDone() {
    const currentLines = lines.current.slice()

    if (editingPictureIndex === undefined) {
      if (currentLines.length === 0) return
      setPictures((pictures) => {
        const newPictures = [...pictures, { lines: currentLines }]
        fireOnChange(newPictures)
        return newPictures
      })
    } else {
      setPictures((pictures) => {
        const newPictures = [...pictures]
        if (currentLines.length === 0) {
          newPictures.splice(editingPictureIndex, 1)
        } else {
          newPictures[editingPictureIndex] = { lines: currentLines }
        }
        fireOnChange(newPictures)
        return newPictures
      })
      setEditingPictureIndex(undefined)
    }
    lines.current = []
    update()
  }

  function startEditing(index: number) {
    setEditingPictureIndex(index)
    lines.current = pictures[index]?.lines.slice() ?? []
    update()
  }

  return (
    <>
      {pictures.map((picture, i) => (
        <Preview
          key={i}
          picture={picture}
          isEditing={editingPictureIndex === i}
          onClick={() => startEditing(i)}
        />
      ))}
      <canvas
        width={size}
        height={size}
        style={{
          border: '1px solid #aaa',
          display: 'block',
          touchAction: 'none',
        }}
        ref={canvasRefCallback}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      />
      <button onClick={undo}>undo</button>
      <button onClick={clear} style={{ marginLeft: 8 }}>
        clear
      </button>
      <button onClick={onDone} style={{ marginLeft: 40 }}>
        done
      </button>
    </>
  )
}

function getPointWithFactor(
  e: PointerEvent<HTMLCanvasElement>,
  factor = 1,
): Point {
  const p = getPoint(e)
  return { x: p.x / factor, y: p.y / factor }
}
