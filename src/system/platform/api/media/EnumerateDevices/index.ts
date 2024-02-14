import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { DeviceInfo } from '../../../../../types/global/DeviceInfo'
import { ID_ENUMERATE_DEVICES } from '../../../../_ids'

export type I = {
  any: any
}

export type O = {
  devices: DeviceInfo[]
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

    let devices: DeviceInfo[]

    try {
      devices = (await enumerateDevices()).map((d) => ({
        deviceId: d.deviceId,
        kind: d.kind,
        groupId: d.groupId,
        label: d.label,
      }))
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done({ devices })
  }
}
