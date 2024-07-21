import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { IB } from '../../../../../types/interface/IB'
import { IC } from '../../../../../types/interface/IC'
import { wrapImageBitmap } from '../../../../../wrap/ImageBitmap'
import { ID_GRAB_FRAME } from '../../../../_ids'

export type I = {
  init: any
  camera: IC
  done: any
}

export type O = {
  image: IB
}

export default class GrabFrame extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['camera'],
        fo: [],
        i: ['init'],
        o: ['image'],
      },
      {
        input: {
          camera: {
            ref: true,
          },
        },
        output: {
          image: {
            ref: true,
          },
        },
      },
      system,
      ID_GRAB_FRAME
    )

    this.addListener('take_err', () => {
      if (this._err_flag) {
        this._err_flag = false

        this._input.init.pull()
      }
    })
  }

  private _err_flag = false

  async f({ camera }: I, done: Done<O>) {
    this._forward_if_ready()
  }

  d() {}

  private _forward_if_ready = async () => {
    if (this._input.camera.active() && this._input.init.active()) {
      let _image: ImageBitmap

      try {
        _image = await this._i.camera.grabFrame()
      } catch (err) {
        this.err(err.message.toLowerCase())

        this._err_flag = true

        return
      }

      const image = wrapImageBitmap(_image, this.__system)

      this._output.image.push(image)

      this._input.init.pull()
    }
  }

  async onIterDataInputData(name: keyof I, data: any): Promise<void> {
    super.onIterDataInputData(name, data)

    if (name === 'init') {
      this._forward_if_ready()
    }
  }
}
