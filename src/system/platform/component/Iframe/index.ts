import { Element } from '../../../../Class/Element/Element'

export interface I {
  src: string
  style: object
}

export interface O {}

export default class Iframe extends Element<I, O> {
  constructor() {
    super({
      i: ['src', 'srcdoc', 'style'],
      o: [],
    })
  }
}
