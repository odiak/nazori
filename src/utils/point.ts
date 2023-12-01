import { Line, Point } from '../types'

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
