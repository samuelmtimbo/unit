import { EventEmitter, EventEmitter_EE } from '../../EventEmitter'
import { System } from '../../system'
import { Unlisten } from '../../types/Unlisten'

export type User_EE = { signin: [string]; signout: [] }

export type UserEmitter = EventEmitter_EE<User_EE> & User_EE

export const eventEmitter = new EventEmitter<UserEmitter>()

export function isSignedIn(system: System): boolean {
  const {
    id: { user },
  } = system
  return !!user
}

export async function signIn(system: System, pbKey: string) {}

export function signOut() {}

export function addSignOutListener(
  system: System,
  listener: () => void
): Unlisten {
  // console.log('addSignOutListener')
  eventEmitter.addListener('signout', listener)
  return () => {
    eventEmitter.removeListener('signout', listener)
  }
}

export function addSignInListener(
  system: System,
  listener: (user: string) => void
): Unlisten {
  // console.log('addSignInListener')
  eventEmitter.addListener('signin', listener)
  return () => {
    eventEmitter.removeListener('signin', listener)
  }
}
