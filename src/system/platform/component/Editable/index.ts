import { Element } from '../../../../Class/Element/Element'
import { Style } from '../../Props'

export interface I {
  style: Style
}

export interface O {}

export default class Editable extends Element<I, O> {
  constructor() {
    super({
      i: ['style'],
      o: [],
    })
  }
}
