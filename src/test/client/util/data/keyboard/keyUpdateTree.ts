import { assert } from '../../../../../util/assert'
import { keyUpdateTree } from '../../../../../util/keyUpdateTree'

assert.deepEqual(keyUpdateTree('', [], '', '[', 0, 0, false), [
  true,
  {
    nextRoot: '[]',
    nextPath: [0],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('', [], '', '{', 0, 0, true), [
  true,
  {
    nextRoot: '{}',
    nextPath: [0],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('', [], '', `'`, 0, 0, false), [
  true,
  {
    nextRoot: `''`,
    nextPath: [],
    nextSelectionStart: 1,
    nextSelectionEnd: 1,
  },
])
assert.deepEqual(keyUpdateTree('', [], '', `"`, 0, 0, true), [
  true,
  {
    nextRoot: '""',
    nextPath: [],
    nextSelectionStart: 1,
    nextSelectionEnd: 1,
  },
])
assert.deepEqual(keyUpdateTree('{}', [0], '', 'Backspace', 0, 0, false), [
  true,
  {
    nextRoot: '',
    nextPath: [],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('{}', [0], '', ',', 0, 0, false), [
  true,
  {
    nextRoot: '{}',
    nextPath: [0],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('{a:1}', [0, 0], 'a', ':', 1, 1, false), [
  true,
  {
    nextRoot: '{a:1}',
    nextPath: [0, 1],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('{}', [0], '', ':', 0, 0, false), [
  true,
  {
    nextRoot: '{:}',
    nextPath: [0, 1],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('[]', [0], '', ']', 0, 0, false), [
  true,
  {
    nextRoot: '[]',
    nextPath: [0],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('[1]', [0], '1', ',', 1, 1, false), [
  true,
  {
    nextRoot: '[1,]',
    nextPath: [1],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('[1,]', [1], '', ',', 0, 0, false), [
  true,
  {
    nextRoot: '[1,]',
    nextPath: [1],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('{}', [0], '', 'Backspace', 0, 0, false), [
  true,
  {
    nextRoot: '',
    nextPath: [],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('{a:}', [0, 1], '', 'Backspace', 0, 0, false), [
  true,
  {
    nextRoot: '{a}',
    nextPath: [0],
    nextSelectionStart: 1,
    nextSelectionEnd: 1,
  },
])
assert.deepEqual(keyUpdateTree('[[]]', [1], '', 'Backspace', 1, 1, false), [
  true,
  {
    nextRoot: '[[]]',
    nextPath: [0, 0],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(
  keyUpdateTree('[[[]]]', [0, 1], '', 'Backspace', 1, 1, false),
  [
    true,
    {
      nextRoot: '[[[]]]',
      nextPath: [0, 0, 0],
      nextSelectionStart: 0,
      nextSelectionEnd: 0,
    },
  ]
)
assert.deepEqual(
  keyUpdateTree('[[[]]]', [0, 1], '', 'Backspace', 1, 1, false),
  [
    true,
    {
      nextRoot: '[[[]]]',
      nextPath: [0, 0, 0],
      nextSelectionStart: 0,
      nextSelectionEnd: 0,
    },
  ]
)
assert.deepEqual(
  keyUpdateTree('{color:"red"}', [0, 1], '"red"', 'Backspace', 0, 0, false),
  [
    true,
    {
      nextRoot: '{color"red"}',
      nextPath: [0],
      nextSelectionStart: 5,
      nextSelectionEnd: 5,
    },
  ]
)
assert.deepEqual(
  keyUpdateTree('{color"red"}', [0], 'color"red"', ':', 5, 5, true),
  [
    true,
    {
      nextRoot: '{color:"red"}',
      nextPath: [0, 1],
      nextSelectionStart: 0,
      nextSelectionEnd: 0,
    },
  ]
)
assert.deepEqual(keyUpdateTree('[invalid]', [0], 'invalid', ',', 2, 2, false), [
  true,
  {
    nextRoot: '[in,valid]',
    nextPath: [1],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('[1,2]', [1], '2', ',', 0, 0, false), [
  true,
  {
    nextRoot: '[1,2]',
    nextPath: [1],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('[1,2]', [1], '2', 'Backspace', 0, 0, false), [
  true,
  {
    nextRoot: '[12]',
    nextPath: [0],
    nextSelectionStart: 1,
    nextSelectionEnd: 1,
  },
])
assert.deepEqual(keyUpdateTree('12', [], '12', '[', 0, 2, false), [
  true,
  {
    nextRoot: '[12]',
    nextPath: [0],
    nextSelectionStart: 0,
    nextSelectionEnd: 2,
  },
])
assert.deepEqual(keyUpdateTree('1[2', [], '1[2', '[', 0, 3, false), [
  true,
  {
    nextRoot: '[1[2]',
    nextPath: [0],
    nextSelectionStart: 0,
    nextSelectionEnd: 3,
  },
])
assert.deepEqual(
  keyUpdateTree('{foo:"bar"}', [0, 1], '"bar"', '}', 5, 5, false),
  [
    true,
    {
      nextRoot: '{foo:"bar"}',
      nextPath: [0, 1],
      nextSelectionStart: 5,
      nextSelectionEnd: 5,
    },
  ]
)
assert.deepEqual(keyUpdateTree('[1,2]', [1], '2', ']', 1, 1, false), [
  true,
  {
    nextRoot: '[1,2]',
    nextPath: [1],
    nextSelectionStart: 1,
    nextSelectionEnd: 1,
  },
])
assert.deepEqual(keyUpdateTree('[1,2]', [0], '1', ',', 1, 1, false), [
  true,
  {
    nextRoot: '[1,2]',
    nextPath: [1],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('{a,b}', [1], 'b', 'Backspace', 0, 0, false), [
  true,
  {
    nextRoot: '{ab}',
    nextPath: [0],
    nextSelectionStart: 1,
    nextSelectionEnd: 1,
  },
])
assert.deepEqual(
  keyUpdateTree('{a:"b",c}', [1], 'c', 'Backspace', 0, 0, false),
  [
    true,
    {
      nextRoot: '{a:"b"c}',
      nextPath: [0, 1],
      nextSelectionStart: 5,
      nextSelectionEnd: 5,
    },
  ]
)
assert.deepEqual(
  keyUpdateTree('{a:"b",c:"d"}', [0, 1], '"b"', ',', 3, 3, false),
  [
    true,
    {
      nextRoot: '{a:"b",,c:"d"}',
      nextPath: [1],
      nextSelectionStart: 0,
      nextSelectionEnd: 0,
    },
  ]
)
assert.deepEqual(
  keyUpdateTree('{a:"b",c:"d"}', [1, 0], 'c', 'Backspace', 0, 0, false),
  [
    true,
    {
      nextRoot: '{a:"b",c:"d"}',
      nextPath: [0, 1],
      nextSelectionStart: 3,
      nextSelectionEnd: 3,
    },
  ]
)
assert.deepEqual(keyUpdateTree('{,c:"d"}', [0], '', 'Backspace', 0, 0, false), [
  true,
  {
    nextRoot: '{c:"d"}',
    nextPath: [0, 0],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('{a:"b",}', [1], '', 'Backspace', 0, 0, false), [
  true,
  {
    nextRoot: '{a:"b"}',
    nextPath: [0, 1],
    nextSelectionStart: 3,
    nextSelectionEnd: 3,
  },
])
assert.deepEqual(
  keyUpdateTree('{a:"b"}', [0, 0], 'a', 'Backspace', 1, 1, false),
  [
    true,
    {
      nextRoot: '{:"b"}',
      nextPath: [0, 0],
      nextSelectionStart: 0,
      nextSelectionEnd: 0,
    },
  ]
)
assert.deepEqual(
  keyUpdateTree('{a:"b"}', [0, 0], 'a', 'Backspace', 0, 1, false),
  [
    true,
    {
      nextRoot: '{:"b"}',
      nextPath: [0, 0],
      nextSelectionStart: 0,
      nextSelectionEnd: 0,
    },
  ]
)
assert.deepEqual(
  keyUpdateTree('{"a":"b","c","d":"e"}', [2], '"c"', 'Backspace', 3, 3, false),
  [
    false,
    {
      nextRoot: '{"a":"b","c","d":"e"}',
      nextPath: [2],
      nextSelectionStart: 2,
      nextSelectionEnd: 2,
    },
  ]
)
assert.deepEqual(keyUpdateTree('[{}]', [0, 0], '', 'ArrowLeft', 0, 0, false), [
  true,
  {
    nextRoot: '[,{}]',
    nextPath: [0],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('[,{}]', [0], '', 'ArrowRight', 0, 0, false), [
  true,
  {
    nextRoot: '[{}]',
    nextPath: [0, 0],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
assert.deepEqual(keyUpdateTree('[{}]', [0, 0], '', 'ArrowRight', 0, 0, false), [
  true,
  {
    nextRoot: '[{},]',
    nextPath: [1],
    nextSelectionStart: 0,
    nextSelectionEnd: 0,
  },
])
