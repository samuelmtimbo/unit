import { Graph } from '../../../../Class/Graph'
import { ID_CREATE_SERVER, ID_LISTEN_0 } from '../../../../system/_ids'
import { system } from '../../../util/system'

const graph = new Graph({}, {}, system)

graph.addUnitSpec('createserver', { unit: { id: ID_CREATE_SERVER } })
graph.addUnitSpec('listen', { unit: { id: ID_LISTEN_0 } })

graph.setUnitPinData('createserver', 'input', 'opt', {})
graph.setUnitPinData('listen', 'input', 'port', 9999)

graph.addMerge(
  {
    createserver: {
      output: {
        server: true,
      },
    },
    listen: {
      input: {
        server: true,
      },
    },
  },
  ''
)

graph.setUnitPinData('createserver', 'input', 'close', 0)
