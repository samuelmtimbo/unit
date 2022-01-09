import { EventEmitter, EventEmitter_EE } from '../../EventEmitter'
import { UserSpec } from '../../server/model/UserSpec'
import { Unlisten } from '../../types/Unlisten'

let _user: UserSpec | null = null

export type User_EE = { signin: [UserSpec]; signout: [] }

export type UserEmitter = EventEmitter_EE<User_EE> & User_EE

export const eventEmitter = new EventEmitter<UserEmitter>()

export function isSignedIn(): boolean {
  return !!_user
}

export async function signIn() {}

export function signOut() {
  _user = null
  eventEmitter.emit('signout')
}

export function addSignOutListener(listener: () => void): Unlisten {
  // console.log('addSignOutListener')
  eventEmitter.addListener('signout', listener)
  return () => {
    eventEmitter.removeListener('signout', listener)
  }
}

export function addSignInListener(
  listener: (user: UserSpec) => void
): Unlisten {
  // console.log('addSignInListener')
  eventEmitter.addListener('signin', listener)
  return () => {
    eventEmitter.removeListener('signin', listener)
  }
}
