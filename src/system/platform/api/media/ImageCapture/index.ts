import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { apiNotSuportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { IC } from '../../../../../types/interface/IC'
import { MST } from '../../../../../types/interface/MST'
import { wrapImageCapture } from '../../../../../wrap/ImageCapture'
import { ID_IMAGE_CAPTURE } from '../../../../_ids'

export type I = {
  track: MST
  init: any
  done: any
}

export type O = {
  camera: IC
}

export default class ImageCapture_ extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['init', 'track'],
        fo: ['camera'],
        i: [],
        o: [],
      },
      {
        input: {
          track: {
            ref: true,
          },
        },
        output: {
          camera: {
            ref: true,
          },
        },
      },
      system,
      ID_IMAGE_CAPTURE
    )
  }

  async f({ init, track }: I, done: Done<O>) {
    const {
      api: {
        window: { ImageCapture },
      },
    } = this.__system

    if (!ImageCapture) {
      done(undefined, apiNotSuportedError('Image Capture'))

      return
    }

    const _track = await track.mediaStreamTrack()

    _track.onmute = () => {
      // console.log('onmute')
    }

    _track.onunmute = () => {
      // console.log('onunmute')
    }

    _track.onended = () => {
      // console.log('onended')
    }

    // @ts-ignore
    const imageCapture = new ImageCapture(_track)

    const camera = wrapImageCapture(imageCapture, this.__system)

    done({ camera })
  }

  d() {
    //
  }
}
