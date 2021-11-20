import { Element } from '../../../../Class/Element/Element'
import { CA } from '../../../../interface/CA'
import { Dict } from '../../../../types/Dict'

export interface I {
  style: Dict<string>
}

export interface O {
  board: CA
}

export default class FrameElement extends Element<I, O> {
  constructor() {
    super({
      i: ['style'],
      o: ['board'],
    })
  }
}
