import * as assert from 'assert'
import {
  removeSubComponent,
  removeSubComponentChild,
  setSubComponent,
  setSubComponentChildren,
  setSubComponentSize,
} from '../../../spec/reducers/component'

assert.deepEqual(
  {
    subComponents: {
      0: {
        width: 300,
        height: 200,
      },
      1: {
        width: 240,
        height: 90,
        children: [],
      },
    },
    children: ['0'],
  },
  setSubComponent(
    { unitId: '1', spec: { width: 240, height: 90, children: [] } },
    {
      subComponents: {
        0: {
          width: 300,
          height: 200,
        },
      },
      children: ['0'],
    }
  ),
  'setSubComponent'
)

// removeSubComponent

assert.deepEqual(
  {
    subComponents: {
      1: {
        width: 240,
        height: 90,
        children: [],
      },
    },
  },
  removeSubComponent(
    { id: '0' },
    {
      subComponents: {
        0: {
          width: 300,
          height: 200,
        },
        1: {
          width: 240,
          height: 90,
          children: [],
        },
      },
    }
  ),
  'removeSubComponent'
)

assert.deepEqual(
  {
    subComponents: {
      0: {
        width: 300,
        height: 200,
      },
    },
  },
  setSubComponentSize(
    { id: '0', width: 300, height: 200 },
    {
      subComponents: {},
    }
  ),
  'setSize'
)

assert.deepEqual(
  {
    subComponents: {
      0: {
        width: 300,
        height: 200,
        children: ['1'],
      },
      1: {
        width: 300,
        height: 420,
      },
    },
  },
  setSubComponentChildren(
    { id: '0', children: ['1'] },
    {
      subComponents: {
        0: {
          width: 300,
          height: 200,
        },
        1: {
          width: 300,
          height: 420,
        },
      },
    }
  ),
  'setSubComponentChildren'
)

assert.deepEqual(
  {
    subComponents: {
      0: {
        width: 300,
        height: 200,
        children: [],
      },
      1: {
        width: 300,
        height: 420,
      },
    },
  },
  removeSubComponentChild(
    { id: '0', childId: '1' },
    {
      subComponents: {
        0: {
          width: 300,
          height: 200,
          children: ['1'],
        },
        1: {
          width: 300,
          height: 420,
        },
      },
    }
  ),
  'removeSubComponentChild'
)
