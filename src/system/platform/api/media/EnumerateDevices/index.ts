import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { IDeviceInfo } from '../../../../../types/global/IDeviceInfo'

export type I = {
  any: any
}

export type O = {
  devices: IDeviceInfo[]
}

export default class EnumerateDevices extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['any'],
        o: ['devices'],
      },
      {},
      system,
      pod
    )
  }

  async f({}: I, done: Done<O>) {
    const {
      api: {
        media: { enumerateDevices },
      },
    } = this.__system

    try {
      const devices = await enumerateDevices()

      done({ devices })
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
