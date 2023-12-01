import { Line, Point } from '../types'
import { vAdd, vDot, vScale, vSub } from './vector'

export function appendPoint(line: Line, point: Point): Line {
  const lastPoint = line[line.length - 1]
  if (
    lastPoint !== undefined &&
    lastPoint.x === point.x &&
    lastPoint.y === point.y
  ) {
    return line
  }

  return [...line, point]
}

export function distanceToSegment(
  p: Point,
  a: Point,
  b: Point,
): [distance: number, nearestPoint: Point] {
  const ab = vSub(b, a)
  const ap = vSub(p, a)
  const t = vDot(ap, ab) / vDot(ab, ab)
  let q: Point
  if (t < 0) {
    q = a
  } else if (t > 1) {
    q = b
  } else {
    q = vAdd(a, vScale(ab, t))
  }

  const s = vSub(p, q)
  const distance = Math.sqrt(vDot(s, s))
  return [distance, q]
}
