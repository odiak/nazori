import React, { FC } from 'react'
import { Picture } from './types'
import { drawLine } from './utils/canvas'

const size = 100

type Props = { picture: Picture; isEditing?: boolean; onClick?: () => void }

export const Preview: FC<Props> = ({ picture, isEditing, onClick }) => {
  function canvasRefCallback(canvas: HTMLCanvasElement | null) {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, 100, 100)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const line of picture.lines) {
      drawLine(ctx, line, size)
    }
  }

  return (
    <canvas
      width={size}
      height={size}
      ref={canvasRefCallback}
      style={{
        border: isEditing ? '1px solid #f55' : '1px solid #ddd',
        marginRight: 4,
      }}
      onClick={onClick}
    />
  )
}
