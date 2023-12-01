import { Point } from '../types'

export function vSub(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function vAdd(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function vDot(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y
}

export function vScale(v: Point, s: number): Point {
  return { x: v.x * s, y: v.y * s }
}
