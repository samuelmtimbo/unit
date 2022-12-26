import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { IDeviceInfo } from '../../../../../types/global/IDeviceInfo'
import { ID_ENUMERATE_DEVICES } from '../../../../_ids'

export type I = {
  any: any
}

export type O = {
  devices: IDeviceInfo[]
}

export default class EnumerateDevices extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['devices'],
      },
      {},
      system,
      ID_ENUMERATE_DEVICES
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
