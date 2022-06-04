import { Element, ElementEE } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { CSOpt } from '../../../../../types/interface/async/$CS'
import { CS } from '../../../../../types/interface/CS'
import { PS } from '../../../../../types/interface/PS'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import VideoComp from './Component'

export interface I {
  style: object
  src: string
  stream: Unit
  controls: boolean
}

export interface O {}

export interface VideoJ {}
export interface VideoEE extends ElementEE<{}> {}
export interface VideoC extends VideoComp {}

export default class Video
  extends Element<I, O, VideoJ, VideoEE, VideoC>
  implements CS, PS
{
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

    this._defaultState = {}
  }

  async captureStream({ frameRate }: CSOpt): Promise<MediaStream> {
    // TODO
    // const stream = await this._element.captureStream({ frameRate })
    throw new APINotSupportedError('Video Capture')
  }

  requestPictureInPicture(callback: Callback<PictureInPictureWindow>): void {
    // TODO
  }
}
