import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export type I = {
  any: any
}

export type O = {
  position: {
    latitude: number
    longitude: number
  }
}

export default class CurrentPosition extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['any'],
        o: ['position'],
      },
      {},
      system,
      pod
    )
  }

  async f({ any }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        geolocation: { getCurrentPosition },
      },
    } = this.__system

    let position
    try {
      position = await getCurrentPosition()
    } catch (err) {
      done(undefined, err.message)
      return
    }

    done({ position })
  }
}
