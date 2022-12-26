import { ElementEE, Element_ } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { System } from '../../../../../system'
import { ID_AUDIO } from '../../../../_ids'
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

export default class Audio extends Element_<I, O, AudioJ, AudioEE, AudioC> {
  constructor(system: System) {
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
      ID_AUDIO
    )
  }
}
