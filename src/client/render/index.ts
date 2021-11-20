import { AsyncPO } from '../../interface/async/AsyncPO_'
import { PO } from '../../interface/PO'
import { System } from '../../system'
import { Unlisten } from '../../Unlisten'
import { attachApp } from './attachApp'
import { attachCanvas } from './attachCanvas'
import { attachGesture } from './attachGesture'
import { attachLongPress } from './attachLongPress'
import { attachSprite } from './attachSprite'
import { attachSVG } from './attachSVG'
import { renderPod } from './renderPod'

export function render(
  $system: System,
  $pod: PO,
  $root: HTMLElement
): Unlisten {
  $system.root = $root
  $system.mounted = true

  attachSprite($system)
  attachApp($system)
  attachCanvas($system)
  attachGesture($system)
  attachSVG($system)
  attachLongPress($system)

  const $$pod = AsyncPO($pod)

  const unlisten = renderPod($system, $system.foreground.app, $$pod)

  return () => {
    $system.mounted = false
    $system.root = null

    unlisten()
  }
}
