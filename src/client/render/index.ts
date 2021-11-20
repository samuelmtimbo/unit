import callAll from '../../callAll'
import { AsyncPO } from '../../interface/async/AsyncPO_'
import { System } from '../../system'
import { Unlisten } from '../../Unlisten'
import init from '../init'
import { attachApp } from './attachApp'
import { attachCanvas } from './attachCanvas'
import { attachGesture } from './attachGesture'
import { attachLongPress } from './attachLongPress'
import { attachSprite } from './attachSprite'
import { attachSVG } from './attachSVG'
import { renderPod } from './renderPod'

export function render($system: System, $root: HTMLElement): Unlisten {
  $system.root = $root
  $system.mounted = true

  attachSprite($system)
  attachApp($system)
  attachCanvas($system)
  attachGesture($system)
  attachSVG($system)
  attachLongPress($system)

  const { pod: $pod } = $system

  const $$pod = AsyncPO($pod)

  const unlisten_init = init($system, $root)

  const unlisten_pod = renderPod($system, $system.foreground.app, $$pod)

  const unlisten = callAll([unlisten_init, unlisten_pod])

  return () => {
    $system.mounted = false
    $system.root = null

    unlisten()
  }
}
