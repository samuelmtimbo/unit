import { EventEmitter2 } from 'eventemitter2'
import { UserSpec } from '../../server/model/UserSpec'
import { Unlisten } from '../../Unlisten'

let _user: UserSpec | null = null

export const eventEmitter = new EventEmitter2()

eventEmitter.setMaxListeners(100)

export function isSignedIn(): boolean {
  return !!_user
}

export async function signIn() {}

export function signOut() {
  _user = null
  eventEmitter.emit('signout')
}

export function addSignOutListener(
  listener: (user: UserSpec) => void
): Unlisten {
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
