import { Element, ElementEE } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import AudioComp from './Component'

export interface I {
  style: object
  src: string
  stream: Unit
  controls: boolean
}

export interface O {}

export interface AudioJ {}
export interface AudioEE extends ElementEE<{}> {}
export interface AudioC extends AudioComp {}

export default class Audio extends Element<I, O, AudioJ, AudioEE, AudioC> {
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
