import { Element } from '../../../../../Class/Element/Element'
import { Unit } from '../../../../../Class/Unit'

export interface I {
  style: object
  src: string
  stream: Unit
  controls: boolean
}

export interface O {}

export default class Audio extends Element<I, O> {
  constructor() {
    super(
      {
        i: ['src', 'stream', 'style', 'controls'],
        o: [],
      },
      {
        input: {
          stream: {
            ref: true,
          },
        },
      }
    )
  }
}
