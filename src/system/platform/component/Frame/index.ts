import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'
import { CA } from '../../../../interface/CA'
import { Dict } from '../../../../types/Dict'

export interface I {
  style: Dict<string>
}

export interface O {
  board: CA
}

export default class FrameElement extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style'],
        o: ['board'],
      },
      config
    )
  }
}
