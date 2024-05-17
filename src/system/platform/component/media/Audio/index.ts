import { ElementEE, Element_ } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ME } from '../../../../../types/interface/ME'
import { ID_AUDIO } from '../../../../_ids'
import AudioComp from './Component'

export interface I {
  style: object
  src: string
  stream: Unit
  controls: boolean
  attr: Dict<string>
}

export interface O {}

export interface AudioJ {}
export interface AudioEE extends ElementEE<{}> {}
export interface AudioC extends AudioComp {}

export default class Audio
  extends Element_<I, O, AudioJ, AudioEE, AudioC>
  implements ME
{
  constructor(system: System) {
    super(
      {
        i: ['src', 'stream', 'style', 'controls', 'attr'],
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

  public mediaPlay(): void {
    this.emit('call', { method: 'play', data: [] })
  }

  public mediaPause(): void {
    this.emit('call', { method: 'pause', data: [] })
  }
}
