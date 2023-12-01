import React, { FC, PointerEvent, useMemo, useRef, useState } from 'react'
import { Picture, Point } from './types'
import { drawLine, getPoint } from './utils/canvas'
import { vAdd, vDot, vScale, vSub } from './utils/vector'
import { appendPoint, distanceToSegment } from './utils/point'

type Props = {
  pictures: Picture[]
}

const size = 500
const distanceThreshold = 40

export const Play: FC<Props> = ({ pictures: rawPictures }) => {
  const pictures = useMemo(
    () => scalePictures(rawPictures, size),
    [rawPictures],
  )

  const [currentPictureIndex, setCurrentPictureIndex] = useState(() =>
    Math.floor(Math.random() * pictures.length),
  )
  const lineIndex = useRef(0)
  const pointIndex = useRef(0)
  const currentPoint = useRef(
    pictures[currentPictureIndex]?.lines[lineIndex.current]?.[
      pointIndex.current
    ] ?? { x: 0, y: 0 },
  )
  const isTouching = useRef(false)

  const ctxRef = useRef<CanvasRenderingContext2D>()
  const canvasWidth = useRef(1)

  function canvasRefCallback(canvas: HTMLCanvasElement | null) {
    ctxRef.current = canvas?.getContext('2d') ?? undefined

    if (canvas) {
      canvasWidth.current = canvas.getBoundingClientRect().width
    }

    update()
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

      const lines = pictures[currentPictureIndex]?.lines ?? []
      for (const line of lines.slice(0, lineIndex.current)) {
        drawLine(ctx, line)
      }

      ctx.strokeStyle = '#999'

      for (const line of lines.slice(lineIndex.current + 1)) {
        drawLine(ctx, line)
      }

      ctx.strokeStyle = '#f44'

      const line = lines[lineIndex.current] ?? []
      drawLine(ctx, line)

      ctx.strokeStyle = '#00f'
      drawLine(
        ctx,
        appendPoint(
          line.slice(0, pointIndex.current + 1),
          currentPoint.current,
        ),
      )

      ctx.fillStyle = isTouching.current ? '#33f' : '#66f'
      ctx.beginPath()
      ctx.arc(
        currentPoint.current.x,
        currentPoint.current.y,
        isTouching.current ? 18 : 10,
        0,
        2 * Math.PI,
      )
      ctx.fill()
    })
  }

  function onPointerDown(e: PointerEvent<HTMLCanvasElement>) {
    const p = getPointScaled(e)
    const q = currentPoint.current

    if (distanceWithin(p, q, distanceThreshold)) {
      isTouching.current = true
      update()
    }
  }
  function onPointerMove(e: PointerEvent<HTMLCanvasElement>) {
    if (!isTouching.current) return

    const line = pictures[currentPictureIndex]!.lines[lineIndex.current]!

    const p = getPointScaled(e)

    let i = pointIndex.current
    const start = i
    const end = Math.min(line.length - 2, i + 6)
    let distance = Number.POSITIVE_INFINITY
    let nearest: Point | undefined

    for (let j = start; j <= end; j++) {
      const [d, q] = distanceToSegment(p, line[j]!, line[j + 1]!)
      if (d < distance) {
        distance = d
        nearest = q
        i = j
      }
    }

    if (nearest === undefined || distance >= distanceThreshold) {
      isTouching.current = false
      currentPoint.current = line[0]!
      pointIndex.current = 0
      update()
      return
    }

    currentPoint.current = nearest
    pointIndex.current = i
    update()
  }
  function onPointerUp(e: PointerEvent<HTMLCanvasElement>) {
    if (!isTouching.current) return

    const lines = pictures[currentPictureIndex]!.lines
    const currentLine = lines[lineIndex.current]!

    if (
      pointIndex.current === currentLine.length - 2 ||
      distanceWithin(
        currentPoint.current,
        currentLine[currentLine.length - 1]!,
        distanceThreshold,
      )
    ) {
      pointIndex.current = 0
      lineIndex.current += 1

      if (lineIndex.current === lines.length) {
        lineIndex.current = 0
        if (pictures.length >= 2) {
          while (true) {
            const newIndex = Math.floor(Math.random() * pictures.length)
            if (newIndex !== currentPictureIndex) {
              setCurrentPictureIndex(newIndex)
              currentPoint.current = pictures[newIndex]!.lines[0]![0]!
              break
            }
          }
        } else {
          currentPoint.current = pictures[currentPictureIndex]!.lines[0]![0]!
        }
      } else {
        currentPoint.current = lines[lineIndex.current]![0]!
      }
    }
    isTouching.current = false
    update()
  }
  function onPointerCancel(e: PointerEvent<HTMLCanvasElement>) {
    isTouching.current = false
    update()
  }

  if (pictures.length === 0) {
    return <div>データがありません</div>
  }

  return (
    <>
      <canvas
        width={size}
        height={size}
        ref={canvasRefCallback}
        style={{
          border: '1px solid #aaa',
          display: 'block',
          touchAction: 'none',
          maxWidth: '100%',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      />
    </>
  )
}

function scalePictures(pictures: Picture[], factor: number): Picture[] {
  return pictures.map((p) => ({
    lines: p.lines.map((line) =>
      line.map(({ x, y }) => ({ x: x * factor, y: y * factor })),
    ),
  }))
}

function distanceWithin(a: Point, b: Point, distance: number): boolean {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < distance ** 2
}

function getPointScaled(e: PointerEvent<HTMLCanvasElement>): Point {
  const p = getPoint(e)
  const factor = e.currentTarget.getBoundingClientRect().width / size
  return { x: p.x / factor, y: p.y / factor }
}
