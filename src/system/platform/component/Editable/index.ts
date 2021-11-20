import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'
import { Style } from '../../Props'

export interface I {
  style: Style
}

export interface O {}

export default class Editable extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style'],
        o: [],
      },
      config
    )
  }
}
