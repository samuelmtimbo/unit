import { ElementEE, Element_ } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { System } from '../../../../../system'
import { CS } from '../../../../../types/interface/CS'
import { IM } from '../../../../../types/interface/IM'
import { ME } from '../../../../../types/interface/ME'
import { PS } from '../../../../../types/interface/PS'
import { ID_VIDEO } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'
import Video_ from './Component'

export interface I {
  style: object
  attr: object
  src: string
  stream: Unit
  controls: boolean
  currentTime: number
}

export interface O {}

export interface VideoJ {}
export interface VideoEE extends ElementEE<{}> {}

export default class Video
  extends Element_<I, O, VideoJ, VideoEE>
  implements CS, PS, IM, ME
{
  __ = [...this.__, 'CS', 'PS', 'IM', 'ME']

  constructor(system: System) {
    super(
      {
        i: ['src', 'stream', 'style', 'controls', 'currentTime', 'attr'],
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
      ID_VIDEO
    )

    this._defaultState = {}
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

  async image(): Promise<any> {
    const localComponent = await firstGlobalComponentPromise(
      this.__system,
      this.__global_id
    )

    return localComponent.$element
  }

  async requestPictureInPicture(): Promise<HTMLVideoElement> {
    const localComponent = (await firstGlobalComponentPromise(
      this.__system,
      this.__global_id
    )) as Video_

    return localComponent.requestPictureInPicture()
  }

  public mediaPlay(): void {
    this.emit('call', { method: 'play', data: [] })
  }

  public mediaPause(): void {
    this.emit('call', { method: 'pause', data: [] })
  }
}
