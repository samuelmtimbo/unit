import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export type I = {
  a: any
}

export type O = {
  devices: {
    deviceId: string
    groupId: string
    kind: string
    label: string
  }[]
}

export default class EnumerateDevices extends Functional<I, O> {
  constructor() {
    super({
      i: ['a'],
      o: ['devices'],
    })
  }

  f({ a }: I, done: Done<O>) {
    if (!navigator.mediaDevices) {
      return done(undefined, 'navigator.mediaDevices not supported.')
    }

    if (!navigator.mediaDevices.enumerateDevices) {
      return done(
        undefined,
        'navigator.mediaDevices.enumerateDevices not supported.'
      )
    }

    navigator.mediaDevices.enumerateDevices().then((ds) => {
      done({
        devices: ds.map((d) => ({
          deviceId: d.deviceId,
          kind: d.kind,
          groupId: d.groupId,
          label: d.label,
        })),
      })
    })
  }
}
