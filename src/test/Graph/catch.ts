import * as assert from 'assert'
import { Graph } from '../../Class/Graph'
import { SELF } from '../../constant/SELF'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_CATCH, ID_THROW } from '../../system/_ids'
import { pod, system } from '../util/system'

const graph = new Graph({}, {}, system, pod)

0 && watchUnitAndLog(graph)
0 && watchGraphAndLog(graph)

graph.play()

graph.addUnit({ unit: { id: ID_THROW } }, 'throw')
graph.addUnit({ unit: { id: ID_CATCH } }, 'catch')

const catchy = graph.refUnit('catch')
const throwy = graph.refUnit('throw')

throwy.pushInput('message', 'booom!')

assert.equal(throwy.peakInput('message'), 'booom!')
assert.equal(throwy.getErr(), 'booom!')

graph.addMerge(
  {
    throw: {
      output: {
        [SELF]: true,
      },
    },
    catch: {
      input: {
        unit: true,
      },
    },
  },
  '0'
)

assert.equal(catchy.peakOutput('err'), 'booom!')
assert.equal(throwy.peakInput('message'), 'booom!')

assert.equal(catchy.takeOutput('err'), 'booom!')
assert.equal(throwy.peakInput('message'), undefined)

throwy.pushInput('message', 'kpop!')

assert.equal(catchy.peakOutput('err'), 'kpop!')

graph.removeMerge('0')

assert.equal(catchy.peakOutput('err'), undefined)
assert.equal(throwy.getErr(), 'kpop!')

graph.addMerge(
  {
    throw: {
      output: {
        [SELF]: true,
      },
    },
    catch: {
      input: {
        unit: true,
      },
    },
  },
  '0'
)

assert.equal(catchy.peakOutput('err'), 'kpop!')
assert.equal(throwy.peakInput('message'), 'kpop!')
assert.equal(throwy.getErr(), null)
assert.equal(graph.getErr(), null)

throwy.setInputConstant('message', true)

assert.equal(catchy.takeOutput('err'), 'kpop!')
assert.equal(catchy.takeOutput('err'), 'kpop!')
assert.equal(catchy.takeOutput('err'), 'kpop!')
assert.equal(catchy.takeOutput('err'), 'kpop!')
assert.equal(catchy.takeOutput('err'), 'kpop!')

throwy.setInputConstant('message', false)

assert.equal(catchy.takeOutput('err'), 'kpop!')
assert.equal(catchy.takeOutput('err'), null)

throwy.push('message', 'xxx')

assert.equal(catchy.peakOutput('err'), 'xxx')

assert.equal(throwy.takeInput('message'), 'xxx')

assert.equal(catchy.peakOutput('err'), null)
