import { UNTITLED } from '../constant/STRING'
import classes from '../system/_classes'
import components from '../system/_components'
import specs from '../system/_specs'
import { renderSpec } from './render/renderSpec'
import root from './root'

renderSpec(
  root,
  {
    name: UNTITLED,
    units: {
      root: {
        id: '9aba266d-5200-4281-b477-749c9b3c5815',
      },
    },
    component: {
      slots: [['root', 'default']],
      subComponents: {
        root: {},
      },
      children: ['root'],
    },
  },
  {
    specs,
    classes,
    components,
    host: {},
  }
)
