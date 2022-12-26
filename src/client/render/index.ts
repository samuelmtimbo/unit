import { System } from '../../system'
import { $Graph } from '../../types/interface/async/$Graph'
import { Unlisten } from '../../types/Unlisten'
import { renderGraph } from './renderGraph'

export function render(system: System, $graph: $Graph): Unlisten {
  const unlisten = renderGraph(system.foreground.app, system, $graph)

  return () => {
    system.mounted = false
    system.root = null

    unlisten()
  }
}
