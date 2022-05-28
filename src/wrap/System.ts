import { $ } from '../Class/$'
import { Pod } from '../pod'
import { spawn } from '../spawn'
import { System } from '../system'
import { P } from '../types/interface/P'
import { S } from '../types/interface/S'
import { Unlisten } from '../types/Unlisten'
import { wrapPod } from './Pod'

export function _newPod(
  system: System,
  _system: System,
  _pod: Pod
): [P, Unlisten] {
  const pod = spawn(system)

  const p = wrapPod(pod, _system, _pod)

  return [p, () => {}]
}

export function _newSystem(
  system: System,
  _system: System,
  _pod: Pod
): [S, Unlisten] {
  const {
    api: {
      document: { createElement },
      init: { boot },
    },
  } = system

  const root = createElement('div')

  const new_system = boot(root)

  const _new_system = wrapSystem(new_system, _system, _pod)

  return [
    _new_system,
    () => {
      // TODO
      // destroy system
    },
  ]
}

export function wrapSystem(system: System, _system: System, _pod: Pod): $ & S {
  return new (class System extends $ implements S {
    newPod(): [P, Unlisten] {
      return _newPod(system, _system, _pod)
    }

    newSystem(opt: {}): [S, Unlisten] {
      return _newSystem(system, _system, _pod)
    }
  })(_system, _pod)
}
