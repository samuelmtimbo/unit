import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { Listenable } from './Listenable'
import { Listener } from './Listener'

export function addListener(
  listenable: Listenable,
  listener: Listener
): Unlisten {
  return listener(listenable)
}

export function addListeners(
  listenable: Listenable,
  listeners: Listener[]
): Unlisten {
  const allUnlisten: Unlisten[] = []

  for (const listener of listeners) {
    const unlisten = addListener(listenable, listener)

    allUnlisten.push(unlisten)
  }

  const unlisten = callAll(allUnlisten)

  return unlisten
}
