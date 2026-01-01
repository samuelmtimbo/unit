import { Graph } from '../../../Class/Graph'
import { RemoteRef } from '../../../client/RemoteRef'
import { makeRemoteObjectAPI } from '../../../client/makeRemoteUnitAPI'
import { ID_IDENTITY, ID_RANDOM_COLOR_BOX } from '../../../system/_ids'
import RemoteGraph from '../../../system/f/meta/RemoteGraph'
import { $Graph } from '../../../types/interface/async/$Graph'
import { system } from '../../util/system'

const graph = new Graph({}, {}, system)

const post = (data) => {
  remote.pushInput('message', data)
}

const api = makeRemoteObjectAPI(graph, ['U', 'G', 'C'])

const ref = new RemoteRef(api, post)

graph.play()

const remote = new RemoteGraph(system)

remote.play()

remote.push('opt', {})

remote.getOutput('message').addListener('data', (message) => {
  ref.exec(message)
})

const local = remote.getOutput('graph').peak() as $Graph

local.$watchGraph(
  {
    events: [
      'input',
      'output',
      'ref_input',
      'ref_output',
      'err',
      'take_err',
      'catch_err',
    ],
  },
  (event) => {
    // console.log('event', event)
  }
)

local.$addUnit({
  unitId: 'identity',
  bundle: { unit: { id: ID_IDENTITY } },
})

local.$setUnitPinData({
  unitId: 'identity',
  type: 'input',
  pinId: 'a',
  data: '1',
})

local.$addUnit({
  unitId: 'randomcolorbox',
  bundle: { unit: { id: ID_RANDOM_COLOR_BOX } },
})
