import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

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
  constructor() {
    super({
      i: ['any'],
      o: ['position'],
    })
  }

  f({ any }: I, done: Done<O>) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        done({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        })
      })
    } else {
      done(undefined, 'Geolocation API not supported')
    }
  }
}
