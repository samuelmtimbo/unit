import * as assert from 'assert'
import { evaluate } from '../../spec/evaluate'
import {
  applyGenerics,
  extractGenerics,
  findGenerics,
  getLastLeafPath,
  getNextLeafPath,
  getNextNode,
  getNextNodePath,
  getNodeAtPath,
  getParent,
  getValueType,
  hasGeneric,
  insertNodeAt,
  isTypeMatch,
  isValidValue,
  matchAllExcTypes,
  removeNodeAt,
  updateNodeAt,
} from '../../spec/parser'
import isEqual from '../../system/f/comparisson/Equals/f'
import _classes from '../../system/_classes'
import _specs from '../../system/_specs'
import { ID_IDENTITY } from './id'

// // getTree

// assert(getTree('{a:"1,2,3"}').children.length === 1)
// assert(getTree("{a:'1,2,3'}").children.length === 1)
// assert(getTree("{a:'(1,2,3)'}").children.length === 1)

// // getTreeNodeType

// assert.deepEqual(getTreeNodeType(':'), TreeNodeType.Invalid)
// assert.deepEqual(getTreeNodeType('foo'), TreeNodeType.Invalid)
// // assert.deepEqual(getTreeNodeType('a:'), TreeNodeType.KeyValue)
// // assert.deepEqual(getTreeNodeType(':1'), TreeNodeType.KeyValue)
// assert.deepEqual(getTreeNodeType('{a:}'), TreeNodeType.ObjectLiteral)
// assert.deepEqual(getTreeNodeType('{:1}'), TreeNodeType.ObjectLiteral)
// assert.deepEqual(getTreeNodeType('"a:b"'), TreeNodeType.StringLiteral)
// assert.deepEqual(getTreeNodeType('"\\""'), TreeNodeType.StringLiteral)
// assert.deepEqual(getTreeNodeType('"\r"'), TreeNodeType.StringLiteral)
// assert.deepEqual(
//   getTreeNodeType(
//     `"v=0\r\no=- 7652727450078372599 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 61198 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 201.26.26.115\r\na=candidate:2612718301 1 udp 2122262783 2804:431:e7c2:b2f3:c94:df00:ed4f:6843 54465 typ host generation 0 network-id 2 network-cost 10\r\na=candidate:1333116113 1 udp 2122194687 192.168.15.5 61198 typ host generation 0 network-id 1 network-cost 10\r\na=candidate:3110454533 1 udp 1685987071 201.26.26.115 61198 typ srflx raddr 192.168.15.5 rport 61198 generation 0 network-id 1 network-cost 10\r\na=candidate:3577288237 1 tcp 1518283007 2804:431:e7c2:b2f3:c94:df00:ed4f:6843 9 typ host tcptype active generation 0 network-id 2 network-cost 10\r\na=candidate:32915489 1 tcp 1518214911 192.168.15.5 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\na=ice-ufrag:YRMo\r\na=ice-pwd:Fwnv2ZDO0wzeeuDeWu+MVisV\r\na=fingerprint:sha-256 08:85:1D:A9:71:D2:CA:22:DD:76:E0:1D:59:CA:0E:E2:CA:93:3A:24:3B:09:28:F5:42:E5:D5:E7:79:C6:2B:E5\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"`
//   ),
//   TreeNodeType.StringLiteral
// )
// assert.deepEqual(getTreeNodeType('/abc/'), TreeNodeType.RegexLiteral)
// assert.deepEqual(getTreeNodeType('null'), TreeNodeType.Null)
// assert.deepEqual(getTreeNodeType('1+1'), TreeNodeType.ArithmeticExpression)
// assert.deepEqual(getTreeNodeType('`U`'), TreeNodeType.Class)
// assert.deepEqual(getTreeNodeType('`E`'), TreeNodeType.Class)
// assert.deepEqual(getTreeNodeType('<T>[]'), TreeNodeType.ArrayExpression)
// assert.deepEqual(getTreeNodeType('string[]'), TreeNodeType.ArrayExpression)
// assert.deepEqual(getTreeNodeType("'string|number'"), TreeNodeType.StringLiteral)
// assert.deepEqual(getTreeNodeType('(string)'), TreeNodeType.Expression)
// assert.deepEqual(
//   getTreeNodeType("'{a:number}&{b:string}'"),
//   TreeNodeType.StringLiteral
// )
// assert.deepEqual(getTreeNodeType("'&*::&lt||()><'"), TreeNodeType.StringLiteral)
// assert.deepEqual(
//   getTreeNodeType(
//     "'https://preview.redd.it/award_images/t5_22cerq/80j20o397jj41_NarwhalSalute.png?width=128&amp;height=128&amp;auto=webp&amp;s=5d2c75f44f176f430e936204f9a53b8a2957f2fc'"
//   ),
//   TreeNodeType.StringLiteral
// )
// assert.deepEqual(
//   getTreeNodeType('(a:number,b:number)=>(a+b:number)'),
//   TreeNodeType.ClassLiteral
// )
// assert.deepEqual(getTreeNodeType(`\${${ID_IDENTITY}}`), TreeNodeType.Unit)
// assert.deepEqual(getTreeNodeType('string|number|{}'), TreeNodeType.Or)
// assert.deepEqual(
//   getTreeNodeType(
//     'string|number|{filters?:(string|number|{name?:string,namePrefix?:string})[],optionalServices?:string[],acceptAllDevices?:boolean}'
//   ),
//   TreeNodeType.Or
// )
// assert.deepEqual(getTreeNodeType('<T>["S"]'), TreeNodeType.PropExpression)

// assert.deepEqual(getTree('{,}').children.length, 1)

// // isValidType

// assert(isValidType('/a/'))
// assert(isValidType('regex'))
// assert(isValidType('string'))
// assert(isValidType('number'))
// assert(isValidType('boolean'))
// assert(isValidType('string[]'))
// assert(isValidType('number[]'))
// assert(isValidType('boolean[]'))
// assert(isValidType('object[]'))
// assert(isValidType('(string)'))
// assert(isValidType('(1)'))
// assert(isValidType('(string)[]'))
// assert(isValidType('(string)[]'))
// assert(isValidType('"foo"'))
// assert(isValidType("'foo'"))
// assert(isValidType('string|number'))
// assert(isValidType('string|1'))
// assert(isValidType('string|1|3'))
// assert(isValidType('string&number'))
// assert(isValidType('(string|number)[]'))
// assert(isValidType('{number:1}'))
// assert(isValidType('{}'))
// assert(isValidType('[]'))
// assert(isValidType('1+2'))
// assert(isValidType('1 +2'))
// assert(isValidType('1 + 2'))
// assert(isValidType('{foo:number}'))
// assert(isValidType('{foo:number,bar:string}'))
// assert(
//   isValidType(
//     '"click"|"mousedown"|"mouseup"|"mouseenter"|"mousemove"|"mouseleave"'
//   )
// )
// assert(isValidType('{"foo":"number"}'))
// assert(isValidType('{"foo":"number","bar":{"x":"number","y":"number"}}'))
// assert(isValidType('{foo:number}[]'))
// assert(isValidType('[]'))
// assert(isValidType('[1,2,3]'))
// assert(isValidType('[string,number]'))
// assert(isValidType('3.14'))
// assert(isValidType('<T>'))
// assert(isValidType('string[]'))
// assert(isValidType('number[]'))
// assert(isValidType('string[][]'))
// assert(isValidType('string{}'))
// assert(isValidType('string[]{}'))
// assert(isValidType('[1,2,[3,4],5]'))
// assert(isValidType('{name:string}|{namePrefix:string}'))
// assert(isValidType('string[]|number[]'))
// assert(isValidType('[]|[0,1,2]'))
// assert(
//   isValidType(
//     '{headers:object,statusCode:number,statusMessage:string,data:string}'
//   )
// )
// assert(isValidType('{"a":1,"b":true,"c":{"d":"string"}}'))
// assert(isValidType('(()=>())'))
// assert(isValidType('()=>()'))
// assert(isValidType('(a:number)=>()'))
// assert(isValidType('(a:number,b:number)=>(a+b:number)'))
// assert(isValidType('any'))
// assert(isValidType('<T>["S"]'))
// assert(isValidType('<T>["S","A"]'))

// assert(!isValidType("'foo's bar'"))
// assert(!isValidType('{{}}'))
// assert(!isValidType('{,}'))
// assert(!isValidType(':'))
// assert(!isValidType('b'))
// assert(!isValidType("b'"))
// assert(!isValidType("'''"))
// assert(!isValidType('()'))
// assert(!isValidType('{ foo }'))
// assert(!isValidType('{ foo: bar }'))
// assert(!isValidType('|'))
// assert(!isValidType('string |'))
// assert(!isValidType('string | foo'))
// assert(!isValidType('foo'))
// assert(!isValidType('foo: string'))
// assert(!isValidType("{ a: b' }"))
// assert(!isValidType('foo:true'))
// assert(!isValidType('foo:false'))
// assert(!isValidType('<T>["S",K]'))
// assert(!isValidObjKey('*'))

// assert(isTypeMatch('number', 'number|string'))
// assert(isTypeMatch('string', 'number|string'))
// assert(isTypeMatch('number', '(number|string)'))
// assert(isTypeMatch('string', '(number|string)'))
// assert(isTypeMatch('number[]', '(number|string)[]'))
// assert(isTypeMatch('string[]', '(number|string)[]'))
// assert(isTypeMatch("'number|string'", 'string'))
// assert(isTypeMatch('"number|string"', 'string'))
// assert(isTypeMatch('"foo"', '"foo"|"bar"'))
// assert(isTypeMatch('{a:"foo"}', "{a:'foo'|'bar'}"))
// assert(isTypeMatch('[{a:"bar"}]', "{a:'foo'|'bar'}[]"))
// assert(isTypeMatch('<T>', '<G>'))
// assert(isTypeMatch('number', '<T>'))
// assert(isTypeMatch('<T>', 'number'))
// assert(isTypeMatch('<T>', 'string'))
// assert(isTypeMatch('<T>', 'string[]'))
// assert(isTypeMatch('<T>[]', 'string[]'))
// assert(isTypeMatch('[]', 'string[]'))
// assert(isTypeMatch('string', 'string'))
// assert(isTypeMatch('/abc/', 'regex'))
// assert(isTypeMatch('number', 'number'))
// assert(isTypeMatch('boolean', 'boolean'))
// assert(isTypeMatch('any', 'any'))
// assert(isTypeMatch('number', 'any'))
// assert(isTypeMatch('1', 'any'))
// assert(isTypeMatch('"foo"', 'string'))
// assert(isTypeMatch("'foo'", '"foo"'))
// assert(isTypeMatch('"foo"', '"foo"|"bar"'))
// assert(isTypeMatch('"foo"', "'foo'|'bar'"))
// assert(isTypeMatch("'foo'", "'foo'|'bar'"))
// assert(isTypeMatch('<T>', 'any'))
// assert(isTypeMatch('any', '<T>'))
// assert(isTypeMatch('null', 'null'))
// assert(isTypeMatch('null', 'any'))
// assert(isTypeMatch('string[]', '<T>[]'))
// assert(isTypeMatch('string[]', 'string[]'))
// assert(isTypeMatch('string[]', '(string|number)[]'))
// assert(isTypeMatch('{"x":number,"y":number}', 'object'))
// assert(isTypeMatch('{x:0,y:1}', '{"x":number,"y":number}'))
// assert(
//   isTypeMatch(
//     '{x:10,y:10,width:100,height:100}',
//     '{x:number,y:number,width:number,height:number}'
//   )
// )
// assert(isTypeMatch('{a:number,b:string}', '{a:number,b:string}'))
// assert(isTypeMatch('{a:number,b:string}', '{b:string,a:number}'))
// assert(isTypeMatch('{a:number,b:string}', '{a:number}'))
// assert(isTypeMatch('{a:number,b:string}', '{}'))
// assert(isTypeMatch('{a:"foo"}', "{a:'foo'}"))
// assert(isTypeMatch("{a:'foo'}", '{a:"foo"}'))
// assert(isTypeMatch('{type:"answer"}', "{type:'answer'}"))
// assert(isTypeMatch('{type:"answer",sdp:\'\'}', "{type:'answer',sdp:string}"))
// assert(isTypeMatch('{}', '{a?:number}'))
// assert(isTypeMatch('string[]&object', 'object'))
// assert(isTypeMatch('string[]&object', 'string[]'))
// assert(isTypeMatch('string[]&object', '<A>[]'))
// assert(isTypeMatch('string[]|object', 'string[]|object'))
// assert(isTypeMatch('string[]|{foo:"bar"}', 'string[]|object'))
// assert(isTypeMatch('[]', '[]'))
// assert(isTypeMatch('{a:"foo"}', 'string{}'))
// assert(isTypeMatch('{a:1}', 'number{}'))
// assert(isTypeMatch('[1,2,3]', '[1,2,3]'))
// assert(isTypeMatch('[1,2,3]', '[number,number,number]'))
// assert(isTypeMatch('any', 'number'))
// assert(isTypeMatch('<T>', '<K>[]'))
// assert(isTypeMatch('any', 'object'))
// assert(isTypeMatch('object', '{}'))
// assert(isTypeMatch('object', '{"x":number,"y":number}'))
// assert(isTypeMatch('<T>', ID_IDENTITY))
// assert(isTypeMatch('any', ID_IDENTITY))
assert(isTypeMatch(`\${${ID_IDENTITY}}`, 'any'))
assert(isTypeMatch('`G`', '`G`'))
assert(isTypeMatch('`U`&`G`', '`G`'))
assert(isTypeMatch('`U`&`G`', '`U`&`G`'))
assert(isTypeMatch('`U`&`C`&`G`', '`U`&`G`'))

assert(!isTypeMatch('', 'any'))
assert(!isTypeMatch('abc', 'any'))
assert(!isTypeMatch('', '<T>'))
assert(!isTypeMatch('1', '<T>[]'))
assert(!isTypeMatch('foo', 'string'))
assert(!isTypeMatch('regex', '/abc/'))
assert(!isTypeMatch('foo', '<T>'))
assert(!isTypeMatch('(string|number)[]', 'string[]'))
assert(!isTypeMatch('string[]|object', '<A>[]'))
assert(!isTypeMatch('[]', '[1]'))
assert(!isTypeMatch('[1,2,3]', '[1,2,3,4]'))
assert(!isTypeMatch('[1,2,3]', '[number,number, string]'))
assert(!isTypeMatch('null', ID_IDENTITY))
assert(!isTypeMatch('object', 'class'))
assert(!isTypeMatch('number', 'class'))
assert(!isTypeMatch('number', ID_IDENTITY))
assert(!isTypeMatch(ID_IDENTITY, 'number'))
assert(!isTypeMatch('`G`', '`U`'))
assert(!isTypeMatch('`U`', '`G`'))
assert(!isTypeMatch('`U`', '`G`&`U`'))
assert(!isTypeMatch('`U`&`C`', '`U`&`G`'))
assert(!isTypeMatch('`U`&`G`', '`U`&`C`&`G`'))

// isValidValue

assert(isValidValue('null'))
assert(isValidValue('"foo"'))
assert(isValidValue("'\\\\'"))
assert(isValidValue('"\'foo\'"'))
assert(isValidValue("'\\'foo\\''"))
assert(isValidValue('"\\\'foo\\\'"'))
assert(isValidValue('"\\"foo\\""'))
assert(isValidValue('"foo   "'))
assert(isValidValue('"\t"'))
assert(isValidValue('"\n"'))
assert(isValidValue('"web+unit://ioun.it"'))
assert(isValidValue('"foo\nbar"'))
assert(isValidValue('3.14'))
assert(isValidValue('1'))
assert(isValidValue('1.'))
assert(isValidValue('Infinity'))
assert(isValidValue('-Infinity'))
assert(isValidValue('/abc/'))
assert(isValidValue('true'))
assert(isValidValue('[1,2,3]'))
assert(isValidValue('[1,2,3,]')) // trailing comma
assert(isValidValue('[[1,0],[0,1]]'))
assert(isValidValue('{a}'))
assert(isValidValue('{a:}'))
assert(isValidValue('{a,b,c}'))
assert(isValidValue('{a,b,}'))
assert(isValidValue('{1,2}'))
assert(isValidValue('{1,2,}'))
assert(isValidValue('[{a},{1,2,}]'))
assert(isValidValue('{foo:"bar"}'))
assert(isValidValue('{number:1}'))
assert(isValidValue('{class:1}'))
assert(isValidValue('{foo:"bar",}')) // trailing comma
assert(isValidValue("{Ç:'Ç'}"))
assert(isValidValue(JSON.stringify(["", "\""]))) // prettier-ignore
assert(isValidValue('1e23'))
assert(isValidValue('{foo?:"bar"}'))
assert(isValidValue("{'{}':1}"))
assert(isValidValue("{'{':1}"))
assert(isValidValue('{"{}":1}'))
assert(isValidValue("{':':1}"))
assert(isValidValue('{":":1}'))
assert(
  isValidValue(
    `"v=0\r\no=- 7652727450078372599 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 61198 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 201.26.26.115\r\na=candidate:2612718301 1 udp 2122262783 2804:431:e7c2:b2f3:c94:df00:ed4f:6843 54465 typ host generation 0 network-id 2 network-cost 10\r\na=candidate:1333116113 1 udp 2122194687 192.168.15.5 61198 typ host generation 0 network-id 1 network-cost 10\r\na=candidate:3110454533 1 udp 1685987071 201.26.26.115 61198 typ srflx raddr 192.168.15.5 rport 61198 generation 0 network-id 1 network-cost 10\r\na=candidate:3577288237 1 tcp 1518283007 2804:431:e7c2:b2f3:c94:df00:ed4f:6843 9 typ host tcptype active generation 0 network-id 2 network-cost 10\r\na=candidate:32915489 1 tcp 1518214911 192.168.15.5 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\na=ice-ufrag:YRMo\r\na=ice-pwd:Fwnv2ZDO0wzeeuDeWu+MVisV\r\na=fingerprint:sha-256 08:85:1D:A9:71:D2:CA:22:DD:76:E0:1D:59:CA:0E:E2:CA:93:3A:24:3B:09:28:F5:42:E5:D5:E7:79:C6:2B:E5\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"`
  )
)
assert(
  isValidValue(
    JSON.stringify({
      name: 'Samuel Moreira Timbó',
      birthday: '06/17/1992',
      phone: '+55 11 986918999',
      address:
        'R. Ana Rosa, 48 - Jardim Bela Vista, São José dos Campos - SP, 12209-050',
    })
  )
)
assert(
  isValidValue(
    `'{"error":{"errors":[{"domain":"global","reason":"required","message":"Login Required","locationType":"header","location":"Authorization"}],"code":401,"message":"Login Required"}}'`
  )
)
assert(
  isValidValue(
    `'{ "error": {  "errors": [   {    "domain": "global",    "reason": "required",    "message": "Login Required",    "locationType": "header",    "location": "Authorization"   }  ],  "code": 401,  "message": "Login Required" }}'`
  )
)
assert(
  isValidValue(
    '"(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])).){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])"'
  )
)
// assert(isValidValue('\\frac{1}{2+1}'))
assert(isValidValue(`\${${ID_IDENTITY}}`))
assert(isValidValue('1+2'))
assert(isValidValue('1 +2'))
assert(isValidValue('1 + 2'))
assert(isValidValue('1 + 2 * 3'))
assert(isValidValue('1 + 2 + 3 / 42'))

assert(!isValidValue('foo'))
assert(!isValidValue('{foo:bar}'))
assert(!isValidValue('{{}}'))
assert(!isValidValue('{♥}')) // unicode
assert(!isValidValue('[string]'))
assert(!isValidValue('+123456'))
assert(!isValidValue('[*]'))
assert(!isValidValue('[1,*]'))
assert(!isValidValue('[*,1]'))
assert(!isValidValue('*'))
assert(!isValidValue("{''':1}"))
assert(!isValidValue('{::1}'))
assert(!isValidValue('{""":1}'))
assert(!isValidValue("{{':1}"))
assert(!isValidValue('a + 1'))

// getValueType

const _getValueType = (str: string) => getValueType(_specs, str)

assert.equal(_getValueType('"foo"'), 'string')
assert.equal(_getValueType("'foo'"), 'string')
assert.equal(_getValueType('1'), 'number')
// assert.equal(_getValueType(), 'any[]')
assert.equal(_getValueType('[]'), '<T>[]')
assert.equal(_getValueType('-2e-23'), 'number')
assert.equal(_getValueType('/abc/'), 'regex')
assert.equal(_getValueType('true'), 'boolean')
assert.equal(_getValueType('false'), 'boolean')
assert.equal(_getValueType('{}'), '{}')
assert.equal(_getValueType('{a:1,b:2}'), '{a:number,b:number}')
assert.equal(
  _getValueType(
    `'{ "error": {  "errors": [   {    "domain": "global",    "reason": "required",    "message": "Login Required",    "locationType": "header",    "location": "Authorization"   }  ],  "code": 401,  "message": "Login Required" }}'`
  ),
  'string'
)

// findGenerics

assert.deepEqual(findGenerics('"foo"'), new Set())
assert.deepEqual(findGenerics('<T>'), new Set(['<T>']))
assert.deepEqual(findGenerics('<T>[]'), new Set(['<T>']))
assert.deepEqual(findGenerics('{foo:<T>,bar:<K>}'), new Set(['<T>', '<K>']))

// extractGenerics

const _extractGenerics = (value: string, type: string) =>
  extractGenerics(_specs, value, type)

assert.deepEqual(_extractGenerics('number', '<T>'), { '<T>': 'number' })
assert.deepEqual(_extractGenerics('"foo"', '<T>'), { '<T>': 'string' })
assert.deepEqual(_extractGenerics('1', '<T>'), { '<T>': 'number' })
assert.deepEqual(_extractGenerics('{foo:"bar"}', '<T>'), {
  '<T>': '{foo:string}',
})
assert.deepEqual(_extractGenerics('{foo:"bar"}', '{foo:<T>}'), {
  '<T>': 'string',
})
assert.deepEqual(_extractGenerics('<0>[]', '<1>[]'), { '<1>': '<0>' })
assert.deepEqual(_extractGenerics('number|string', '<0>'), {
  '<0>': 'number|string',
})
assert.deepEqual(_extractGenerics('<0>|<1>', '<2>'), { '<2>': '<0>|<1>' })

// applyGenerics

assert.equal(applyGenerics('<T>', {}), '<T>')
assert.equal(applyGenerics('<T>', { '<T>': 'string' }), 'string')
assert.equal(applyGenerics('<T>[]', { '<T>': 'string' }), 'string[]')
assert.equal(
  applyGenerics('{foo:<A>,bar:<B>}', {
    '<A>': 'object',
    '<B>': 'string',
  }),
  '{foo:object,bar:string}'
)
assert.equal(applyGenerics('<T>', { '<T>': '`P`' }), '`P`')

assert.equal(getNodeAtPath('', [1]), undefined)
assert.equal(getNodeAtPath('"foo"', []), '"foo"')
assert.equal(getNodeAtPath('[0,1,2,3]', []), '[0,1,2,3]')
assert.equal(getNodeAtPath('[0,1,2,3]', [1]), '1')
assert.equal(getNodeAtPath('{foo:"bar"}', []), '{foo:"bar"}')
assert.equal(getNodeAtPath('{foo:"bar"}', [0]), 'foo:"bar"')
assert.equal(getNodeAtPath('{foo:"bar"}', [0, 0]), 'foo')
assert.equal(getNodeAtPath('string[][]', [0]), 'string[]')
assert.equal(getNodeAtPath('string[][]', [0, 0]), 'string')

// getParent

assert.equal(getParent('"foo"', []), undefined)
assert.equal(getParent('{foo:"bar zaz"}', []), undefined)
assert.equal(getParent('{foo:"bar zaz"}', [0]), '{foo:"bar zaz"}')
assert.equal(getParent('{foo:"bar zaz"}', [0, 0]), 'foo:"bar zaz"')
assert.equal(getParent('{foo:"bar zaz"}', [0, 1]), 'foo:"bar zaz"')

// getNextNodePath

assert.deepEqual(getNextNodePath('"foo"', [], 1), undefined)
assert.deepEqual(getNextNodePath('"foo"', [], -1), undefined)
assert.deepEqual(getNextNodePath('[0,1,2,3]', [], 1), [0])
assert.deepEqual(getNextNodePath('[0,1,2,3]', [1], 1), [2])
assert.deepEqual(getNextNodePath('[0,1,2,3]', [1], -1), [0])
assert.deepEqual(getNextNodePath('{foo:"bar"}', [0], 1), [0, 0])
assert.deepEqual(getNextNodePath('{foo:"bar"}', [0], -1), [])
assert.deepEqual(getNextNodePath('{foo:"bar"}', [0, 0], 1), [0, 1])

// getNextNode

assert.equal(getNextNode('"foo"', [], 1), undefined)
assert.equal(getNextNode('"foo"', [], -1), undefined)
assert.equal(getNextNode('[0,1,2,3]', [1], 1), '2')
assert.equal(getNextNode('[0,1,2,3]', [1], -1), '0')
assert.equal(getNextNode('{foo:"bar"}', [0], 1), 'foo')
assert.equal(getNextNode('{foo:"bar"}', [0], -1), '{foo:"bar"}')
assert.equal(getNextNode('{foo:"bar"}', [0, 0], 1), '"bar"')

// getNextLeafPath

assert.deepEqual(getNextLeafPath('"foo"', [], 1), undefined)
assert.deepEqual(getNextLeafPath('"foo"', [], -1), undefined)
assert.deepEqual(getNextLeafPath('[0,1,2,3]', [], 1), [0])
assert.deepEqual(getNextLeafPath('[0,1,2,3]', [1], 1), [2])
assert.deepEqual(getNextLeafPath('[0,1,2,3]', [1], -1), [0])
assert.deepEqual(getNextLeafPath('{foo:"bar"}', [], 1), [0, 0])
assert.deepEqual(getNextLeafPath('{foo:"bar"}', [0], 1), [0, 0])
assert.deepEqual(getNextLeafPath('{foo:"bar"}', [0], -1), undefined)
assert.deepEqual(getNextLeafPath('{foo:"bar"}', [0, 0], 1), [0, 1])
assert.deepEqual(getNextLeafPath('{foo:"bar",}', [1], -1), [0, 1])
assert.deepEqual(getNextLeafPath('{foo:{bar:"zaz"},}', [1], -1), [0, 1, 0, 1])

// getLastLeaf

assert.deepEqual(getLastLeafPath('{}'), [])
assert.deepEqual(getLastLeafPath('{foo:"bar"}'), [0, 1])

// insertNodeAt

assert.equal(insertNodeAt('[0,1,2,3]', [2], '"foo"'), '[0,1,"foo",2,3]')
assert.equal(
  insertNodeAt('{foo:"bar zaz"}', [0], 'no:"flow"'),
  '{no:"flow",foo:"bar zaz"}'
)
assert.equal(insertNodeAt('[]', [0], '1'), '[1]')
assert.equal(updateNodeAt('{a:}', [0, 1], '1'), '{a:1}')

// updateNodeAt

assert.equal(updateNodeAt('"foo"', [], '"bar"'), '"bar"')
assert.equal(updateNodeAt('[0,1,2,3]', [2], '"foo"'), '[0,1,"foo",3]')
assert.equal(updateNodeAt('{foo:"bar zaz"}', [0, 0], '1'), '{1:"bar zaz"}')
assert.equal(updateNodeAt('[]', [0], '1'), '[1]')
assert.equal(updateNodeAt('{a:}', [0, 1], '1'), '{a:1}')

// removeNodeAt

assert.equal(removeNodeAt('"foo"', []), '')
assert.equal(removeNodeAt('[0,1,2,3]', [0]), '[1,2,3]')
assert.equal(removeNodeAt('{foo:"bar zaz"}', [0]), '{}')
assert.equal(removeNodeAt('{foo:}', [0, 1]), '{foo}')

// evaluate

const _evaluate = (str: string) => evaluate(str, _specs, _classes)

assert.deepEqual(_evaluate('1'), 1)
assert.deepEqual(_evaluate('Infinity'), Infinity)
assert.deepEqual(_evaluate('"foo"'), 'foo')
assert.deepEqual(_evaluate("'foo'"), 'foo')
assert.deepEqual(_evaluate('\'"foo"\''), '"foo"')
assert.deepEqual(_evaluate("'\\'foo\\''"), "'foo'")
assert.deepEqual(_evaluate('\'\\"foo\\"\''), '\\"foo\\"')
assert.deepEqual(_evaluate("'\\\\'"), '\\')
assert.deepEqual(_evaluate("'\\'\\\\\\''"), "'\\'")
assert.deepEqual(_evaluate('true'), true)
assert.deepEqual(_evaluate('false'), false)
assert.deepEqual(_evaluate('null'), null)
assert.deepEqual(_evaluate('[]'), [])
assert.deepEqual(_evaluate('[1,2,3]'), [1, 2, 3])
assert.deepEqual(_evaluate('[1,2,3,]'), [1, 2, 3])
assert.deepEqual(_evaluate('{foo:0}'), { foo: 0 })
assert.deepEqual(_evaluate('{foo:0,}'), { foo: 0 })
assert.deepEqual(_evaluate('{foo:"bar zaz"}'), { foo: 'bar zaz' })
assert.deepEqual(_evaluate('{a:1}'), { a: 1 })
assert.deepEqual(_evaluate('{a:"1"}'), { a: '1' })
assert.deepEqual(_evaluate('{1:1}'), { 1: 1 })
assert.deepEqual(_evaluate('{a}'), { a: 'a' })
assert.deepEqual(_evaluate('{a,b}'), { a: 'a', b: 'b' })
assert.deepEqual(_evaluate('{1}'), { 1: '1' })
assert.deepEqual(_evaluate('"\\n"'), '\\n')
assert.deepEqual(
  _evaluate(`\${unit:{id:'${ID_IDENTITY}'}}`).__bundle.unit.id,
  ID_IDENTITY
)
assert.deepEqual(
  _evaluate(
    `'{\\n "error": {\\n  "errors": [\\n   {\\n    "domain": "global",\\n    "reason": "required",\\n    "message": "Login Required",\\n    "locationType": "header",\\n    "location": "Authorization"\\n   }\\n  ],\\n  "code": 401,\\n  "message": "Login Required"\\n }\\n}\\n'`
  ),
  '{\\n "error": {\\n  "errors": [\\n   {\\n    "domain": "global",\\n    "reason": "required",\\n    "message": "Login Required",\\n    "locationType": "header",\\n    "location": "Authorization"\\n   }\\n  ],\\n  "code": 401,\\n  "message": "Login Required"\\n }\\n}\\n'
)

// isGeneric

assert(hasGeneric('<T>'))
assert(hasGeneric('<0>'))
assert(hasGeneric('<0>[]'))

// matchAllType

assert(isEqual(matchAllExcTypes(['any'], ['any']), [[[0, 0]]]))
assert(isEqual(matchAllExcTypes(['string'], ['any']), [[[0, 0]]]))
assert(isEqual(matchAllExcTypes(['any'], ['string']), [[[0, 0]]]))
assert(isEqual(matchAllExcTypes(['number'], ['string']), []))
assert(
  isEqual(matchAllExcTypes(['number', 'number'], ['<T>']), [[[0, 0]], [[1, 0]]])
)
assert(
  isEqual(matchAllExcTypes(['number', 'number'], ['number']), [
    [[0, 0]],
    [[1, 0]],
  ])
)
assert(isEqual(matchAllExcTypes(['number', 'string'], ['number']), [[[0, 0]]]))
