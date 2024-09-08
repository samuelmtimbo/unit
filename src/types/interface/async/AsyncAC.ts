import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { AC } from '../AC'
import { $AC, $AC_C, $AC_G, $AC_R, $AC_W } from './$AC'
import { $AN } from './$AN'

export const AsyncACGet = (context: AC): $AC_G => ({})

export const AsyncACCall = (context: AC): $AC_C => ({})

export const AsyncACWatch = (context: AC): $AC_W => {
  return {}
}

export const AsyncACRef = (context: AC): $AC_R => ({
  $getDestination: function (data: {}): $AN {
    throw new MethodNotImplementedError()
  },
  $createOscillator: function (data: OscillatorOptions): $AN {
    throw new MethodNotImplementedError()
  },
  $createAnalyser: function (data: AnalyserOptions): $AN {
    throw new MethodNotImplementedError()
  },
})

export const AsyncAC = (context: AC): $AC => {
  return {
    ...AsyncACGet(context),
    ...AsyncACCall(context),
    ...AsyncACWatch(context),
    ...AsyncACRef(context),
  }
}
