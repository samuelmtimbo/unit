import { ElementEE, Element_ } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { CS } from '../../../../../types/interface/CS'
import { ME } from '../../../../../types/interface/ME'
import { ID_AUDIO } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

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

export default class Audio
  extends Element_<I, O, AudioJ, AudioEE>
  implements ME, CS
{
  __ = [...this.__, 'CS', 'ME']

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

  async captureStream({
    frameRate,
  }: {
    frameRate: number
  }): Promise<MediaStream> {
    const firstLocalComponent: any = await firstGlobalComponentPromise(
      this.__system,
      this.__global_id
    )

    if (firstLocalComponent) {
      return firstLocalComponent.$element.captureStream({ frameRate })
    }
  }

  public mediaPlay(): void {
    this.emit('call', { method: 'play', data: [] })
  }

  public mediaPause(): void {
    this.emit('call', { method: 'pause', data: [] })
  }
}
