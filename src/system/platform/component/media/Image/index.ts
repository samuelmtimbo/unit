import { Element } from '../../../../../Class/Element/Element'

export interface I {
  src: string
  style: object
}

export interface O {}

export default class Image extends Element<I, O> {
  constructor() {
    super({
      i: ['src', 'style'],
      o: ['click'],
    })
  }
}
