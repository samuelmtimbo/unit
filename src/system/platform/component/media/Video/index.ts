import { Element } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { CSOpt } from '../../../../../interface/async/$CS'
import { CS } from '../../../../../interface/CS'
import { PS } from '../../../../../interface/PS'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { Unlisten } from '../../../../../types/Unlisten'
import { listenGlobalComponent } from '../../../../globalComponent'
import Video from './Component'

export interface I {
  style: object
  src: string
  stream: Unit
  controls: boolean
}

export interface O {}

export default class _Video extends Element<I, O> implements CS, PS {
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

  captureStream(
    { frameRate }: CSOpt,
    callback: Callback<MediaStream>
  ): Unlisten {
    let input_src_set: boolean = this._input.src.active()
    let input_stream_set: boolean = this._input.stream.active()

    const input_src_drop_listener = () => {
      input_src_set = false

      if (!input_src_set && !input_stream_set) {
        callback(null)
      }
    }

    const input_stream_drop_listener = () => {
      input_stream_set = false

      if (!input_src_set && !input_stream_set) {
        callback(null)
      }
    }

    const input_src_data_listener = () => {
      input_src_set = true

      reset()
    }

    const input_stream_data_listener = () => {
      input_stream_set = true

      reset()
    }

    let unlisten: Unlisten

    const reset = () => {
      listenGlobalComponent(
        this.__system,
        this.__global_id,
        async (component: Video) => {
          const stream = await component.captureStream({ frameRate })
          callback(stream)
        }
      )
    }

    this._input.src.addListener('drop', input_src_drop_listener)
    this._input.stream.addListener('drop', input_stream_drop_listener)
    this._input.src.addListener('data', input_src_data_listener)
    this._input.stream.addListener('data', input_stream_data_listener)

    reset()

    return () => {
      this._input.src.removeListener('drop', input_src_drop_listener)
      this._input.stream.removeListener('drop', input_stream_drop_listener)
      this._input.src.removeListener('data', input_src_data_listener)
      this._input.stream.removeListener('data', input_stream_data_listener)

      unlisten()
    }
  }

  $captureStream(opt: CSOpt, callback: Callback<MediaStream>): Unlisten {
    return this.captureStream(opt, callback)
  }

  requestPictureInPicture(callback: Callback<PictureInPictureWindow>): void {
    // ...
  }

  $requestPictureInPicture(
    data: {},
    callback: Callback<PictureInPictureWindow>
  ): void {
    return this.requestPictureInPicture(callback)
  }
}
