import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { IB } from '../../../../../types/interface/IB'
import { IC } from '../../../../../types/interface/IC'
import { wrapImageBitmap } from '../../../../../wrap/ImageBitmap'
import { ID_GRAB_FRAME } from '../../../../_ids'

export type I = {
  opt: {}
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
        fi: ['camera', 'opt'],
        fo: ['image'],
        i: [],
        o: [],
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

        this._input.opt.pull()
      }
    })
  }

  private _err_flag = false

  async f({ camera, opt }: I, done: Done<O>, fail: Fail) {
    let _image: ImageBitmap

    try {
      _image = await this._i.camera.grabFrame()
    } catch (err) {
      fail(err.message.toLowerCase())

      this._err_flag = true

      return
    }

    const image = wrapImageBitmap(_image, this.__system)

    done({ image })
  }
}
