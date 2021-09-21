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
      io: {
        path: '6f267de2-b02c-11ea-b55c-db553f4c6c45',
      },
    },
    component: {
      slots: [['io', 'default']],
      subComponents: {
        io: {},
      },
      children: ['io'],
    },
  },
  {
    specs,
    classes,
    components,
  }
)
