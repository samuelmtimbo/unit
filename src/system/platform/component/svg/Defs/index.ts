import { Element } from '../../../../../Class/Element/Element'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
}

export interface O {}

export default class Defs extends Element<I, O> {
  constructor() {
    super({
      i: ['style'],
      o: [],
    })
  }
}
