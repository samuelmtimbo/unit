import { ElementEE, Element_ } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { CS } from '../../../../../types/interface/CS'
import { IM } from '../../../../../types/interface/IM'
import { ME } from '../../../../../types/interface/ME'
import { PS } from '../../../../../types/interface/PS'
import { CSOpt } from '../../../../../types/interface/async/$CS'
import { ID_VIDEO } from '../../../../_ids'
import VideoComp from './Component'

export interface I {
  style: object
  src: string
  stream: Unit
  controls: boolean
  currentTime: number
}

export interface O {}

export interface VideoJ {}
export interface VideoEE extends ElementEE<{}> {}
export interface VideoC extends VideoComp {}

export default class Video
  extends Element_<I, O, VideoJ, VideoEE, VideoC>
  implements CS, PS, IM, ME
{
  constructor(system: System) {
    super(
      {
        i: ['src', 'stream', 'style', 'controls', 'currentTime'],
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

  async captureStream({ frameRate }: CSOpt): Promise<MediaStream> {
    // TODO
    // const stream = await this._element.captureStream({ frameRate })
    // throw new APINotSupportedError('Video Capture')

    const localComponents = this.__system.getLocalComponents(this.__global_id)

    const firstLocalComponent: any = localComponents[0]

    if (firstLocalComponent) {
      return firstLocalComponent.$element.captureStream({ frameRate })
    }

    return new Promise((resolve) => {
      this.__system.emitter.addListener(this.__global_id, (localComponent) => {
        resolve(localComponent.$element.captureStream({ frameRate }))
      })
    })
  }

  async image(): Promise<any> {
    const { getLocalComponents } = this.__system

    const localComponents = getLocalComponents(this.__global_id)

    if (localComponents.length === 0) {
      return null
    }

    const localComponent = localComponents[0]

    return localComponent.$element
  }

  requestPictureInPicture(callback: Callback<PictureInPictureWindow>): void {
    // TODO
  }

  public mediaPlay(): void {
    this.emit('call', { method: 'play', data: [] })
  }

  public mediaPause(): void {
    this.emit('call', { method: 'pause', data: [] })
  }
}
