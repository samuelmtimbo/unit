import { EE } from '../../interface/EE'

export interface IWakeLockOpt {
  type: 'screen'
}

export interface IWakeLock extends EE<{ done: [] }> {
  done(): void
}
