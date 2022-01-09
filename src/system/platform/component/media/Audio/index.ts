import { Element } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  style: object
  src: string
  stream: Unit
  controls: boolean
}

export interface O {}

export default class Audio extends Element<I, O> {
  constructor(system: System, pod: Pod) {
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
      },
      system,
      pod
    )
  }
}
