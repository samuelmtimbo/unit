import { assert } from '../../../../util/assert'
import { keyUpdateTree } from '../../../../util/keyUpdateTree'

assert.deepEqual(keyUpdateTree('', [], '', '[', 0, false), [
  true,
  {
    nextRoot: '[]',
    nextPath: [0],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keyUpdateTree('', [], '', '{', 0, true), [
  true,
  {
    nextRoot: '{}',
    nextPath: [0],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keyUpdateTree('', [], '', `'`, 0, false), [
  true,
  {
    nextRoot: `''`,
    nextPath: [],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keyUpdateTree('', [], '', `"`, 0, true), [
  true,
  {
    nextRoot: '""',
    nextPath: [],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keyUpdateTree('', [], '', '{', 0, true), [
  true,
  {
    nextRoot: '{}',
    nextPath: [0],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keyUpdateTree('{}', [0], '', 'Backspace', 0, false), [
  true,
  {
    nextRoot: '',
    nextPath: [],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keyUpdateTree('{}', [0], '', ',', 0, false), [
  true,
  {
    nextRoot: '{}',
    nextPath: [0],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keyUpdateTree('[]', [0], '', ']', 0, false), [
  true,
  {
    nextRoot: '[]',
    nextPath: [0],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keyUpdateTree('[1]', [0], '1', ',', 1, false), [
  true,
  {
    nextRoot: '[1,]',
    nextPath: [1],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keyUpdateTree('[1,]', [1], '', ',', 0, false), [
  true,
  {
    nextRoot: '[1,]',
    nextPath: [1],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keyUpdateTree('{}', [0], '', 'Backspace', 0, false), [
  true,
  {
    nextRoot: '',
    nextPath: [],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keyUpdateTree('{a:}', [0, 1], '', 'Backspace', 0, false), [
  true,
  {
    nextRoot: '{a}',
    nextPath: [0],
    nextSelectionStart: 1,
  },
])
assert.deepEqual(keyUpdateTree('[[]]', [1], '', 'Backspace', 1, false), [
  true,
  {
    nextRoot: '[[]]',
    nextPath: [0, 0],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keyUpdateTree('[[[]]]', [0, 1], '', 'Backspace', 1, false), [
  true,
  {
    nextRoot: '[[[]]]',
    nextPath: [0, 0, 0],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(keyUpdateTree('[[[]]]', [0, 1], '', 'Backspace', 1, false), [
  true,
  {
    nextRoot: '[[[]]]',
    nextPath: [0, 0, 0],
    nextSelectionStart: 0,
  },
])
assert.deepEqual(
  keyUpdateTree('{color:"red"}', [0, 1], '"red"', 'Backspace', 0, false),
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
  keyUpdateTree('{color"red"}', [0], 'color"red"', ':', 5, true),
  [
    true,
    {
      nextRoot: '{color:"red"}',
      nextPath: [0, 1],
      nextSelectionStart: 0,
    },
  ]
)
