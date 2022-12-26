import { UNTITLED } from '../../../constant/STRING'
import { BundleSpec } from '../../../types/BundleSpec'
import render from './render'

const spec_id = '657f619a-abad-45b1-b5b7-5c121b13a5a5'

const spec = {
  inputs: {
    a: {
      plug: {
        0: {},
      },
    },
  },
  outputs: {
    a: {
      plug: {
        0: {},
      },
    },
  },
  id: spec_id,
}

const bundlle: BundleSpec = {
  spec,
  specs: {
    [spec_id]: spec,
  },
}

render({
  spec: {
    private: true,
    name: UNTITLED,
    units: {
      root: {
        id: '9aba266d-5200-4281-b477-749c9b3c5815',
        input: {
          bundle: {},
        },
      },
    },
    render: true,
    component: {
      slots: [['root', 'default']],
      subComponents: {
        root: {},
      },
      children: ['root'],
    },
  },
  specs: {},
})
