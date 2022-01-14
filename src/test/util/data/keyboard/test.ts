import { assert } from '../../../../util/assert'
import { keydownUpdateTree } from '../../../../util/keyUpdateTree'

assert.deepEqual(keydownUpdateTree('', [], '', '[', 0, false), [
  true,
  {
    nextRoot: '[]',
    nextPath: [0],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keydownUpdateTree('', [], '', '{', 0, true), [
  true,
  {
    nextRoot: '{}',
    nextPath: [0],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keydownUpdateTree('', [], '', `'`, 0, false), [
  true,
  {
    nextRoot: `''`,
    nextPath: [],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keydownUpdateTree('', [], '', `"`, 0, true), [
  true,
  {
    nextRoot: '""',
    nextPath: [],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keydownUpdateTree('', [], '', '{', 0, true), [
  true,
  {
    nextRoot: '{}',
    nextPath: [0],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keydownUpdateTree('{}', [0], '', 'Backspace', 0, false), [
  true,
  {
    nextRoot: '',
    nextPath: [],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keydownUpdateTree('{}', [0], '', ',', 0, false), [
  true,
  {
    nextRoot: '{}',
    nextPath: [0],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keydownUpdateTree('[]', [0], '', ']', 0, false), [
  true,
  {
    nextRoot: '[]',
    nextPath: [0],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keydownUpdateTree('[1]', [0], '1', ',', 1, false), [
  true,
  {
    nextRoot: '[1,]',
    nextPath: [1],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keydownUpdateTree('[1,]', [1], '', ',', 0, false), [
  true,
  {
    nextRoot: '[1,]',
    nextPath: [1],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keydownUpdateTree('{}', [0], '', 'Backspace', 0, false), [
  true,
  {
    nextRoot: '',
    nextPath: [],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keydownUpdateTree('{a:}', [0, 1], '', 'Backspace', 0, false), [
  true,
  {
    nextRoot: '{a}',
    nextPath: [0],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keydownUpdateTree('[[]]', [1], '', 'Backspace', 1, false), [
  true,
  {
    nextRoot: '[[]]',
    nextPath: [0, 0],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(
  keydownUpdateTree('[[[]]]', [0, 1], '', 'Backspace', 1, false),
  [
    true,
    {
      nextRoot: '[[[]]]',
      nextPath: [0, 0, 0],
      nextSelectionStart: 0,
    },
  ]
)
assert.deepEqual(
  keydownUpdateTree('{color:"red"}', [0, 1], '"red"', 'Backspace', 0, false),
  [
    true,
    {
      nextRoot: '{color"red"}',
      nextPath: [0],
      nextSelectionStart: 5,
    },
  ]
)
assert.deepEqual(
  keydownUpdateTree('{color"red"}', [0], 'color"red"', ':', 5, true),
  [
    true,
    {
      nextRoot: '{color:"red"}',
      nextPath: [0,1],
      nextSelectionStart: 0,
    },
  ]
)
