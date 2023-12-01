import { Line, Point } from '../types'

export function drawLine(
  ctx: CanvasRenderingContext2D,
  line: Line,
  factor = 1,
) {
  const [first, ...rest] = line
  if (first === undefined || rest.length === 0) return

  ctx.beginPath()
  ctx.moveTo(first.x * factor, first.y * factor)
  for (const { x, y } of rest) {
    ctx.lineTo(x * factor, y * factor)
  }
  ctx.stroke()
}

type EventLike = {
  clientX: number
  clientY: number
  currentTarget: {
    offsetLeft: number
    offsetTop: number
  }
}

export function getPoint(e: EventLike): Point {
  const x = e.clientX - e.currentTarget.offsetLeft
  const y = e.clientY - e.currentTarget.offsetTop
  return { x, y }
}
