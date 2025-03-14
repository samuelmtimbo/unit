import { InterceptOpt, ServerHandler } from '../API'
import { $, $Events } from '../Class/$'
import { Graph } from '../Class/Graph'
import { System } from '../system'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { EE } from '../types/interface/EE'
import { S } from '../types/interface/S'
import { Listener } from '../types/Listener'
import { Unlisten } from '../types/Unlisten'

export type S_EE<I extends Dict<any> = any, O extends Dict<any> = any> = {
  hashchange: [string[]]
}

export type SystemEvents<_EE extends Dict<any[]>> = $Events<_EE & S_EE> & S_EE

export function wrapSystem(system: System, _system: System): $<any> & S & EE {
  const system_: $ & S = new (class System extends $<any> implements S {
    intercept(opt: InterceptOpt, handler: ServerHandler): Unlisten {
      return system.intercept(opt, handler)
    }
    start(bundle: BundleSpec): Graph {
      return system.start(bundle)
    }
    addListener(event: any, listener: Listener<any>): Unlisten {
      return system.addListener(event, listener)
    }
  })(_system)

  return system_
}
