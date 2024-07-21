import { $ } from '../../../Class/$'
import { Done } from '../../../Class/Functional/Done'
import { Holder } from '../../../Class/Holder'
import { System } from '../../../system'
import { CA } from '../../../types/interface/CA'
import { wrapOffscreenCanvas } from '../../../wrap/OffscreenCanvas'
import { ID_OFFSCREEN_CANVAS } from '../../_ids'

export interface I {
  width: number
  height: number
  opt: { willReadFrequently?: boolean }
  done: any
}

export interface O {
  canvas: CA & $
}

export default class OffscreenCanvas_ extends Holder<I, O> {
  __ = ['U', 'CA']

  private _offscreen: OffscreenCanvas
  private _offscreen_ctx: OffscreenCanvasRenderingContext2D

  constructor(system: System) {
    super(
      {
        fi: ['width', 'height', 'opt'],
        fo: ['canvas'],
        i: [],
        o: [],
      },
      {
        output: {
          canvas: {
            ref: true,
          },
        },
      },
      system,
      ID_OFFSCREEN_CANVAS
    )
  }

  f({ width, height, opt }: I, done: Done<O>) {
    this._offscreen = new OffscreenCanvas(width, height)
    this._offscreen_ctx = this._offscreen.getContext('2d', opt)

    const canvas = wrapOffscreenCanvas(
      this._offscreen,
      this._offscreen_ctx,
      this.__system
    )

    done({ canvas })
  }
}
