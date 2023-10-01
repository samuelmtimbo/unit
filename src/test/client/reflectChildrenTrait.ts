import { reflectChildrenTrait } from '../../client/reflectChildrenTrait'
import isEqual from '../../system/f/comparisson/Equals/f'
import * as assert from '../../util/assert'

// DEPRECATED

assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 100,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      { position: 'absolute', width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 100,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 200,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 300,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex' },
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'column' },
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 50,
      width: 100,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'column' },
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 50,
      width: 100,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'row' },
    [
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 25,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 25,
      y: 0,
      width: 25,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 50,
      y: 0,
      width: 25,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 75,
      y: 0,
      width: 25,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'column' },
    [
      { height: '30px' },
      { height: '30px' },
      { width: '100%', height: '100%' },
      { width: '100%', height: '100%' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 0,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 30,
      width: 0,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 60,
      width: 100,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 80,
      width: 100,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'column' },
    [{ height: '30px' }, { height: '30px' }]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 0,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 30,
      width: 0,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'column' },
    [
      { height: '30px' },
      { height: '30px' },
      { height: '30px' },
      { height: '30px' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 0,
      height: 25,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 25,
      width: 0,
      height: 25,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 50,
      width: 0,
      height: 25,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 75,
      width: 0,
      height: 25,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'row' },
    [
      { width: '30px', height: '100%' },
      { width: '30px', height: '100%' },
      { width: '30px', height: '100%' },
      { width: '30px', height: '100%' },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 25,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 25,
      y: 0,
      width: 25,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 50,
      y: 0,
      width: 25,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 75,
      y: 0,
      width: 25,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [{ height: '30px', width: '60px' }]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 60,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'column' },
    [{ height: '30px', width: '60px' }]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 60,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'row' },
    [{ height: '30px', width: '60px' }]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 60,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    { display: 'flex', flexDirection: 'row' },
    [{ height: '30.1px', width: '60.1px' }]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 60.1,
      height: 30.1,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [{ height: '30px', width: '60px' }]
  ),
  [
    {
      x: 20,
      y: 35,
      width: 60,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
    },
    [{ height: '30px', width: '60px' }]
  ),
  [
    {
      x: 20,
      y: 35,
      width: 60,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      { height: '30px', width: '30px' },
      { height: '30px', width: '30px' },
    ]
  ),
  [
    {
      x: 20,
      y: 35,
      width: 30,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 50,
      y: 35,
      width: 30,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      { height: '30px', width: '30px' },
      { height: '30px', width: '30px' },
    ]
  ),
  [
    {
      x: 35,
      y: 20,
      width: 30,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 35,
      y: 50,
      width: 30,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      {
        position: 'relative',
        top: '10px',
        left: '10px',
        height: '30px',
        width: '30px',
      },
      { height: '30px', width: '30px' },
    ]
  ),
  [
    {
      x: 45,
      y: 30,
      width: 30,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 35,
      y: 50,
      width: 30,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        top: '50px',
        left: '50px',
        height: '50px',
        width: '50px',
      },
    ]
  ),
  [
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        top: '20px',
        left: '20px',
        height: '20px',
        width: '20px',
      },
      {
        position: 'absolute',
        top: '50px',
        left: '50px',
        height: '50px',
        width: '50px',
      },
    ]
  ),
  [
    {
      x: 20,
      y: 20,
      width: 20,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        top: '20%',
        left: '20%',
        height: '20%',
        width: '20%',
      },
      {
        position: 'absolute',
        top: '50%',
        left: '50%',
        height: '50%',
        width: '50%',
      },
    ]
  ),
  [
    {
      x: 20,
      y: 20,
      width: 20,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        transform: 'translate(50%, 50%)',
      },
    ]
  ),
  [
    {
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        top: '50px',
        left: '50px',
        height: '50px',
        width: '50px',
        transform: 'translate(50px, 50px)',
      },
    ]
  ),
  [
    {
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      {
        position: 'absolute',
        top: '10px',
        left: '10px',
        height: '100%',
        width: '30px',
      },
      { height: '30px', width: '30px' },
    ]
  ),
  [
    {
      x: 10,
      y: 10,
      width: 30,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 35,
      y: 35,
      width: 30,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        top: '0px',
        left: '0px',
        height: '100%',
        width: 'calc(50%-6px)',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 44,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        top: '0px',
        left: '0px',
        height: '100%',
        width: 'calc(50%-6px)',
      },
      {
        width: '100%',
        height: '100%',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 44,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'start',
    },
    [
      {
        height: '100%',
        width: '100%',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'start',
    },
    [
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 40,
      y: 0,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 40,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 40,
      y: 40,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignContent: 'start',
    },
    [
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 40,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 40,
      y: 0,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 40,
      y: 40,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignContent: 'start',
    },
    [
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
      {
        height: '40px',
        width: '40px',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 40,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 40,
      y: 0,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 40,
      y: 40,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 80,
      y: 0,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 80,
      y: 40,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    ]
  ),
  [
    {
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 25,
      y: 25,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    ]
  ),
  [
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
// TODO
// assert.deepEqual(
//   reflectChildrenTrait(
//     { x: 0, y: 0, width: 100, height: 100, fontSize: 10, sx: 1, sy: 1, opacity: 1 },
//     {
//       display: 'flex',
//       alignContent: 'start',
//       flexDirection: 'column',
//       flexWrap: 'wrap',
//     },
//     [
//       {
//         height: '100%',
//         width: '100%',
//       },
//       {
//         height: '100%',
//         width: '100%',
//       },
//       {
//         height: '100%',
//         width: '100%',
//       },
//     ]
//   ),
//   [
//     { x: 0, y: 0, width: 100, height: 100, fontSize: 10, sx: 1, sy: 1, opacity: 1 },
//     { x: 100, y: 0, width: 100, height: 100, fontSize: 10, sx: 1, sy: 1, opacity: 1 },
//     { x: 200, y: 0, width: 100, height: 100, fontSize: 10, sx: 1, sy: 1, opacity: 1 },
//   ]
// )
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        height: 'fit-content',
        width: 'fit-content',
      },
    ],
    (path) => {
      if (isEqual(path, [0])) {
        return [
          {
            height: '50px',
            width: '50px',
          },
          {
            height: '50px',
            width: '50px',
          },
        ]
      }
    }
  ),
  [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        height: 'fit-content',
        width: 'fit-content',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    ],
    (path) => {
      if (isEqual(path, [0])) {
        return [
          {
            height: '50px',
            width: '50px',
          },
          {
            height: '50px',
            width: '50px',
          },
        ]
      }
    }
  ),
  [
    {
      x: 25,
      y: 0,
      width: 50,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        height: '50px',
        width: '50px',
        border: '3px solid white',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 56,
      height: 56,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        height: '50px',
        width: '50px',
        border: '3px solid',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 56,
      height: 56,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
    },
    [
      {
        height: '50px',
        width: '50px',
        border: '3px solid',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 56,
      height: 56,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
    },
    [
      {
        height: '44px',
        width: '44px',
        border: '3px solid',
      },
      {
        height: '44px',
        width: '44px',
        border: '3px solid',
      },
    ]
  ),
  [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        height: '50px',
        width: '50px',
        margin: '10px',
      },
    ]
  ),
  [
    {
      x: 10,
      y: 10,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      padding: '20px',
    },
    [
      {
        height: '50px',
        width: '50px',
        margin: '10px',
      },
    ]
  ),
  [
    {
      x: 30,
      y: 30,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      {
        height: '50px',
        width: '50px',
      },
    ]
  ),
  [
    {
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    [
      {
        height: '50px',
        width: '50px',
      },
    ]
  ),
  [
    {
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        left: '25px',
        top: '25px',
      },
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        left: '25px',
        top: '75px',
      },
    ]
  ),
  [
    {
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 25,
      y: 75,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'contents',
    },
    [
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        left: '25px',
        top: '25px',
      },
      {
        position: 'absolute',
        height: '50px',
        width: '50px',
        left: '25px',
        top: '75px',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 25,
      y: 75,
      width: 50,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        width: '100%',
        height: '100%',
        transform: 'scaleX(-1)',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: -1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      padding: '20px',
    },
    [
      {
        width: '100%',
        height: '100%',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 20,
      y: 20,
      width: 60,
      height: 60,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      padding: '20px',
    },
    [
      {
        width: '100%',
        height: '100%',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 20,
      y: 20,
      width: 60,
      height: 60,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    },
    [
      {
        width: '100%',
        height: '100%',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 20,
      y: 20,
      width: 60,
      height: 60,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '20px',
    },
    [
      {
        width: '100%',
        height: '100%',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 20,
      width: 100,
      height: 80,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      padding: '20px',
    },
    [
      {
        width: '100%',
        height: '100%',
        padding: '20px',
        boxSizing: 'border-box',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 20,
      y: 20,
      width: 60,
      height: 60,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
    },
    [
      {
        width: '30px',
        height: '30px',
        paddingLeft: '10px',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 40,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [
      {
        width: '200px',
        height: '30px',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 35,
      width: 200,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        width: '100px',
        height: '30px',
        boxSizing: 'content-box',
        border: '10px solid black',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 120,
      height: 50,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        width: '100px',
        height: '30px',
        boxSizing: 'border-box',
        border: '10px solid black',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 30,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    [
      {
        width: '40px',
        height: '40px',
      },
      {
        width: '40px',
        height: '40px',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 50,
      width: 40,
      height: 40,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    [
      {
        width: '40px',
        height: 'fit-content',
        maxHeight: '20px',
      },
      {
        width: '40px',
        height: '20px',
      },
    ],
    () => [{ height: '100px' }],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 40,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 30,
      width: 40,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        right: '0px',
        width: '40px',
        height: '20px',
      },
      {
        left: '10px',
        width: '40px',
        height: '20px',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 60,
      y: 0,
      width: 40,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 10,
      y: 20,
      width: 40,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        width: 'max(200px,300px)',
        height: 'min(200px,300px)',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        width: 'max(100%,50%)',
        height: 'min(200px,100%)',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        width: 'max(200px,300px)',
        height: 'min(200px,300px)',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        width: 'calc(max(100%,50%) - 30px)',
        height: 'calc(min(200px,100%))',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 70,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        position: 'relative',
        width: 'min(calc(100% - 20px), 270px)',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 80,
      height: 0,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'row',
    },
    [
      {
        position: 'absolute',
        right: '0px',
        width: '50px',
        height: '100px',
      },
    ],
    () => [],
    [],
    {}
  ),
  [
    {
      x: 50,
      y: 0,
      width: 50,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'row',
      width: 'fit-content',
    },
    [
      {
        width: 'fit-content',
        height: 'fit-content',
      },
    ],
    () => [{ width: '50px', height: '100px' }],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'row',
      width: 'fit-content',
    },
    [
      {
        padding: '20px',
        width: 'fit-content',
        height: 'fit-content',
      },
    ],
    () => [{ width: '50px', height: '100px' }],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 90,
      height: 140,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        width: '100px',
        aspectRatio: '0.5',
      },
    ],
    () => [{ width: '50px', height: '100px' }],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 200,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {},
    [
      {
        width: 'min(100% - 60px, 600px)',
        aspectRatio: '2',
      },
    ],
    () => [{ width: '50px', height: '100px' }],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 40,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
assert.deepEqual(
  reflectChildrenTrait(
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      display: 'flex',
      flexDirection: 'column',
    },
    [
      {
        width: 'min(100% - 60px, 600px)',
        aspectRatio: '2',
      },
      {
        width: '100px',
        height: '100px',
      },
    ],
    () => [{ width: '50px', height: '100px' }],
    [],
    {}
  ),
  [
    {
      x: 0,
      y: 0,
      width: 40,
      height: 20,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
    {
      x: 0,
      y: 20,
      width: 100,
      height: 100,
      fontSize: 10,
      sx: 1,
      sy: 1,
      opacity: 1,
    },
  ]
)
// assert.deepEqual(
//   reflectChildrenTrait(
//     {
//       x: 0,
//       y: 0,
//       width: 300,
//       height: 100,
//       fontSize: 10,
//       sx: 1,
//       sy: 1,
//       opacity: 1,
//     },
//     {
//       display: 'flex',
//       flexDirection: 'row',
//     },
//     [
//       {
//         width: '100px',
//         height: '100px',
//       },
//       {
//         width: '100%',
//         height: '100px',
//       },
//     ],
//     () => [],
//     [],
//     {}
//   ),
//   [
//     {
//       x: 0,
//       y: 0,
//       width: 75,
//       height: 100,
//       fontSize: 10,
//       sx: 1,
//       sy: 1,
//       opacity: 1,
//     },
//     {
//       x: 0,
//       y: 100,
//       width: 225,
//       height: 100,
//       fontSize: 10,
//       sx: 1,
//       sy: 1,
//       opacity: 1,
//     },
//   ]
// )
