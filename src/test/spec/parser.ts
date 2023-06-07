import * as assert from 'assert'
import { evaluateBundleStr } from '../../client/idFromUnitValue'
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
  getTree,
  getTreeNodeType,
  getValueType,
  hasGeneric,
  insertNodeAt,
  isTypeMatch,
  isValidObjKey,
  isValidType,
  isValidValue,
  matchAllExcTypes,
  removeNodeAt,
  TreeNodeType,
  updateNodeAt,
} from '../../spec/parser'
import isEqual from '../../system/f/comparisson/Equals/f'
import _classes from '../../system/_classes'
import _specs from '../../system/_specs'
import { system } from '../util/system'
import { ID_IDENTITY } from '../../system/_ids'

// getTree

assert(getTree('{a:"1,2,3"}').children.length === 1)
assert(getTree("{a:'1,2,3'}").children.length === 1)
assert(getTree("{a:'(1,2,3)'}").children.length === 1)
assert(getTree('[true,true,]').children.length === 3)

assert(getTree('[true,true,]').children[2].value === '')
assert(
  getTree('{a:[true,true,]}').children[0].children[1].children[2].value === ''
)

// getTreeNodeType

assert.deepEqual(getTreeNodeType(':'), TreeNodeType.Invalid)
assert.deepEqual(getTreeNodeType('foo'), TreeNodeType.Invalid)
assert.deepEqual(getTreeNodeType('[1[]'), TreeNodeType.Invalid)
// assert.deepEqual(getTreeNodeType('a:'), TreeNodeType.KeyValue)
// assert.deepEqual(getTreeNodeType(':1'), TreeNodeType.KeyValue)
assert.deepEqual(getTreeNodeType('{a:}'), TreeNodeType.ObjectLiteral)
assert.deepEqual(getTreeNodeType('{:1}'), TreeNodeType.ObjectLiteral)
assert.deepEqual(getTreeNodeType('"a:b"'), TreeNodeType.StringLiteral)
assert.deepEqual(getTreeNodeType('"\\""'), TreeNodeType.StringLiteral)
assert.deepEqual(getTreeNodeType('"\r"'), TreeNodeType.StringLiteral)
assert.deepEqual(
  getTreeNodeType(
    `"v=0\r\no=- 7652727450078372599 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 61198 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 201.26.26.115\r\na=candidate:2612718301 1 udp 2122262783 2804:431:e7c2:b2f3:c94:df00:ed4f:6843 54465 typ host generation 0 network-id 2 network-cost 10\r\na=candidate:1333116113 1 udp 2122194687 192.168.15.5 61198 typ host generation 0 network-id 1 network-cost 10\r\na=candidate:3110454533 1 udp 1685987071 201.26.26.115 61198 typ srflx raddr 192.168.15.5 rport 61198 generation 0 network-id 1 network-cost 10\r\na=candidate:3577288237 1 tcp 1518283007 2804:431:e7c2:b2f3:c94:df00:ed4f:6843 9 typ host tcptype active generation 0 network-id 2 network-cost 10\r\na=candidate:32915489 1 tcp 1518214911 192.168.15.5 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\na=ice-ufrag:YRMo\r\na=ice-pwd:Fwnv2ZDO0wzeeuDeWu+MVisV\r\na=fingerprint:sha-256 08:85:1D:A9:71:D2:CA:22:DD:76:E0:1D:59:CA:0E:E2:CA:93:3A:24:3B:09:28:F5:42:E5:D5:E7:79:C6:2B:E5\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"`
  ),
  TreeNodeType.StringLiteral
)
assert.deepEqual(getTreeNodeType('/abc/'), TreeNodeType.RegexLiteral)
assert.deepEqual(getTreeNodeType('null'), TreeNodeType.Null)
assert.deepEqual(getTreeNodeType('1+1'), TreeNodeType.ArithmeticExpression)
assert.deepEqual(getTreeNodeType('`U`'), TreeNodeType.Class)
assert.deepEqual(getTreeNodeType('`E`'), TreeNodeType.Class)
assert.deepEqual(getTreeNodeType('`V<T>`'), TreeNodeType.Class)
assert.deepEqual(getTreeNodeType('<T>[]'), TreeNodeType.ArrayExpression)
assert.deepEqual(getTreeNodeType('string[]'), TreeNodeType.ArrayExpression)
assert.deepEqual(getTreeNodeType("'string|number'"), TreeNodeType.StringLiteral)
assert.deepEqual(getTreeNodeType('(string)'), TreeNodeType.Expression)
assert.deepEqual(
  getTreeNodeType("'{a:number}&{b:string}'"),
  TreeNodeType.StringLiteral
)
assert.deepEqual(getTreeNodeType("'&*::&lt||()><'"), TreeNodeType.StringLiteral)
assert.deepEqual(
  getTreeNodeType(
    "'https://preview.redd.it/award_images/t5_22cerq/80j20o397jj41_NarwhalSalute.png?width=128&amp;height=128&amp;auto=webp&amp;s=5d2c75f44f176f430e936204f9a53b8a2957f2fc'"
  ),
  TreeNodeType.StringLiteral
)
assert.deepEqual(
  getTreeNodeType('(a:number,b:number)=>(a+b:number)'),
  TreeNodeType.ClassLiteral
)
assert.deepEqual(getTreeNodeType(`\${${ID_IDENTITY}}`), TreeNodeType.Unit)
assert.deepEqual(getTreeNodeType('string|number|{}'), TreeNodeType.Or)
assert.deepEqual(
  getTreeNodeType(
    'string|number|{filters?:(string|number|{name?:string,namePrefix?:string})[],optionalServices?:string[],acceptAllDevices?:boolean}'
  ),
  TreeNodeType.Or
)
assert.deepEqual(getTreeNodeType('<T>["S"]'), TreeNodeType.PropExpression)
assert.deepEqual(getTreeNodeType('unit://123'), TreeNodeType.Url)

assert.deepEqual(getTree('{,}').children.length, 1)

// isValidType

assert(isValidType('/a/'))
assert(isValidType('regex'))
assert(isValidType('string'))
assert(isValidType('number'))
assert(isValidType('boolean'))
assert(isValidType('string[]'))
assert(isValidType('number[]'))
assert(isValidType('boolean[]'))
assert(isValidType('object[]'))
assert(isValidType('(string)'))
assert(isValidType('(1)'))
assert(isValidType('(string)[]'))
assert(isValidType('(string)[]'))
assert(isValidType('"foo"'))
assert(isValidType("'foo'"))
assert(isValidType('string|number'))
assert(isValidType('string|1'))
assert(isValidType('string|1|3'))
assert(isValidType('string&number'))
assert(isValidType('(string|number)[]'))
assert(isValidType('{number:1}'))
assert(isValidType('{}'))
assert(isValidType('[]'))
assert(isValidType('1+2'))
assert(isValidType('1 +2'))
assert(isValidType('1 + 2'))
assert(isValidType('{a:number,}'))
assert(isValidType('{foo:number}'))
assert(isValidType('{foo:number,bar:string}'))
assert(
  isValidType(
    '"click"|"mousedown"|"mouseup"|"mouseenter"|"mousemove"|"mouseleave"'
  )
)
assert(isValidType('{"foo":"number"}'))
assert(isValidType('{"foo":"number","bar":{"x":"number","y":"number"}}'))
assert(isValidType('{foo:number}[]'))
assert(isValidType('[]'))
assert(isValidType('[1,2,3]'))
assert(isValidType('[string,number]'))
assert(isValidType('3.14'))
assert(isValidType('<T>'))
assert(isValidType('`V<T>`'))
assert(isValidType('string[]'))
assert(isValidType('number[]'))
assert(isValidType('string[][]'))
assert(isValidType('string{}'))
assert(isValidType('string[]{}'))
assert(isValidType('[1,2,[3,4],5]'))
assert(isValidType('{name:string}|{namePrefix:string}'))
assert(isValidType('string[]|number[]'))
assert(isValidType('[]|[0,1,2]'))
assert(
  isValidType(
    '{headers:object,statusCode:number,statusMessage:string,data:string}'
  )
)
assert(isValidType('{"a":1,"b":true,"c":{"d":"string"}}'))
assert(isValidType('(()=>())'))
assert(isValidType('()=>()'))
assert(isValidType('(a:number)=>()'))
assert(isValidType('(a:number,b:number)=>(a+b:number)'))
assert(isValidType('any'))
assert(isValidType('<T>["S"]'))
assert(isValidType('<T>["S","A"]'))

assert(!isValidType("'foo's bar'"))
assert(!isValidType('{{}}'))
assert(!isValidType('{,}'))
assert(!isValidType(':'))
assert(!isValidType('b'))
assert(!isValidType("b'"))
assert(!isValidType("'''"))
assert(!isValidType('()'))
assert(!isValidType('{ foo }'))
assert(!isValidType('{ foo: bar }'))
assert(!isValidType('|'))
assert(!isValidType('string |'))
assert(!isValidType('string | foo'))
assert(!isValidType('foo'))
assert(!isValidType('foo: string'))
assert(!isValidType("{ a: b' }"))
assert(!isValidType('foo:true'))
assert(!isValidType('foo:false'))
assert(!isValidType('<T>["S",K]'))
assert(!isValidObjKey('*'))

const _isTypeMatch = (a: string, b: string) => isTypeMatch(system.specs, a, b)

assert(_isTypeMatch('number', 'number|string'))
assert(_isTypeMatch('string', 'number|string'))
assert(_isTypeMatch('number', '(number|string)'))
assert(_isTypeMatch('string', '(number|string)'))
assert(_isTypeMatch('number[]', '(number|string)[]'))
assert(_isTypeMatch('string[]', '(number|string)[]'))
assert(_isTypeMatch("'number|string'", 'string'))
assert(_isTypeMatch('"number|string"', 'string'))
assert(_isTypeMatch('"foo"', '"foo"|"bar"'))
assert(_isTypeMatch('{a:"foo"}', "{a:'foo'|'bar'}"))
assert(_isTypeMatch('[{a:"bar"}]', "{a:'foo'|'bar'}[]"))
assert(_isTypeMatch('<T>', '<G>'))
assert(_isTypeMatch('number', '<T>'))
assert(_isTypeMatch('<T>', 'number'))
assert(_isTypeMatch('<T>', 'string'))
assert(_isTypeMatch('<T>', 'string[]'))
assert(_isTypeMatch('<T>[]', 'string[]'))
assert(_isTypeMatch('[]', 'string[]'))
assert(_isTypeMatch('string', 'string'))
assert(_isTypeMatch('/abc/', 'regex'))
assert(_isTypeMatch('number', 'number'))
assert(_isTypeMatch('boolean', 'boolean'))
assert(_isTypeMatch('any', 'any'))
assert(_isTypeMatch('number', 'any'))
assert(_isTypeMatch('1', 'any'))
assert(_isTypeMatch('"foo"', 'string'))
assert(_isTypeMatch("'foo'", '"foo"'))
assert(_isTypeMatch('"foo"', '"foo"|"bar"'))
assert(_isTypeMatch('"foo"', "'foo'|'bar'"))
assert(_isTypeMatch("'foo'", "'foo'|'bar'"))
assert(_isTypeMatch('<T>', 'any'))
assert(_isTypeMatch('any', '<T>'))
assert(_isTypeMatch('null', 'null'))
assert(_isTypeMatch('null', 'any'))
assert(_isTypeMatch('string[]', '<T>[]'))
assert(_isTypeMatch('string[]', 'string[]'))
assert(_isTypeMatch('string[]', '(string|number)[]'))
assert(_isTypeMatch('{a:1,}', 'object'))
assert(_isTypeMatch('{"x":number,"y":number}', 'object'))
assert(_isTypeMatch('{x:0,y:1}', '{"x":number,"y":number}'))
assert(
  _isTypeMatch(
    '{x:10,y:10,width:100,height:100}',
    '{x:number,y:number,width:number,height:number}'
  )
)
assert(_isTypeMatch('{a:number,b:string}', '{a:number,b:string}'))
assert(_isTypeMatch('{a:number,b:string}', '{b:string,a:number}'))
assert(_isTypeMatch('{a:number,b:string}', '{a:number}'))
assert(_isTypeMatch('{a:number,b:string}', '{}'))
assert(_isTypeMatch('{a:"foo"}', "{a:'foo'}"))
assert(_isTypeMatch("{a:'foo'}", '{a:"foo"}'))
assert(_isTypeMatch('{type:"answer"}', "{type:'answer'}"))
assert(_isTypeMatch('{type:"answer",sdp:\'\'}', "{type:'answer',sdp:string}"))
assert(_isTypeMatch('{}', '{a?:number}'))
assert(_isTypeMatch('string[]&object', 'object'))
assert(_isTypeMatch('string[]&object', 'string[]'))
assert(_isTypeMatch('string[]&object', '<A>[]'))
assert(_isTypeMatch('string[]|object', 'string[]|object'))
assert(_isTypeMatch('string[]|{foo:"bar"}', 'string[]|object'))
assert(_isTypeMatch('[]', '[]'))
assert(_isTypeMatch('{a:"foo"}', 'string{}'))
assert(_isTypeMatch('{a:1}', 'number{}'))
assert(_isTypeMatch('[1,2,3]', '[1,2,3]'))
assert(_isTypeMatch('[1,2,3]', '[number,number,number]'))
assert(_isTypeMatch('any', 'number'))
assert(_isTypeMatch('<T>', '<K>[]'))
assert(_isTypeMatch('any', 'object'))
assert(_isTypeMatch('object', '{}'))
assert(_isTypeMatch('object', '{"x":number,"y":number}'))
assert(_isTypeMatch('<T>', ID_IDENTITY))
assert(_isTypeMatch('any', ID_IDENTITY))
assert(_isTypeMatch(`\${${ID_IDENTITY}}`, 'any'))
assert(_isTypeMatch('`G`', '`G`'))
assert(_isTypeMatch('`U`&`G`', '`G`'))
assert(_isTypeMatch('`U`&`G`', '`U`&`G`'))
assert(_isTypeMatch('`U`&`C`&`G`', '`U`&`G`'))
assert(_isTypeMatch('`G`', '`EE`'))
assert(_isTypeMatch('`G`', '`U`'))
assert(_isTypeMatch('`U`&`G`', '`U`&`C`&`G`'))
assert(_isTypeMatch(`\${unit:{id:'${ID_IDENTITY}'}}`, '`U`'))

assert(!_isTypeMatch('', 'any'))
assert(!_isTypeMatch('abc', 'any'))
assert(!_isTypeMatch('', '<T>'))
assert(!_isTypeMatch('1', '<T>[]'))
assert(!_isTypeMatch('foo', 'string'))
assert(!_isTypeMatch('regex', '/abc/'))
assert(!_isTypeMatch('foo', '<T>'))
assert(!_isTypeMatch('(string|number)[]', 'string[]'))
assert(!_isTypeMatch('string[]|object', '<A>[]'))
assert(!_isTypeMatch('[]', '[1]'))
assert(!_isTypeMatch('[1,2,3]', '[1,2,3,4]'))
assert(!_isTypeMatch('[1,2,3]', '[number,number, string]'))
assert(!_isTypeMatch('{background: "color"}', 'object'))
assert(!_isTypeMatch('null', ID_IDENTITY))
assert(!_isTypeMatch('object', 'class'))
assert(!_isTypeMatch('number', 'class'))
assert(!_isTypeMatch('number', ID_IDENTITY))
assert(!_isTypeMatch(ID_IDENTITY, 'number'))
assert(!_isTypeMatch('`U`', '`G`'))
assert(!_isTypeMatch('`U`', '`G`&`U`'))
assert(!_isTypeMatch('`U`&`C`', '`U`&`G`'))
assert(!_isTypeMatch('`U`&`C`&`V`&`J`', '`G`'))

// isValidValue

assert(isValidValue('null'))
assert(isValidValue('"foo"'))
assert(isValidValue("'\\\\'"))
assert(isValidValue('"\'foo\'"'))
assert(isValidValue("'\\'foo\\''"))
assert(isValidValue('"\\\'foo\\\'"'))
assert(isValidValue('"\\"foo\\""'))
assert(isValidValue('"\\"foo\\""'))
assert(isValidValue('"\\"\\\\"foo\\\\"\\""'))
assert(isValidValue('"\\"\\\\"\\\\\\"foo\\\\\\"\\\\"\\""'))
// assert(!isValidValue('"\\"\\\\"\\\\"foo\\\\\\"\\\\"\\""')) // TODO
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
assert(isValidValue('{a,}'))
assert(isValidValue('{a:1,}'))
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
assert(!isValidValue('{foo: "bar"}'))

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
assert.deepEqual(findGenerics('`V<T>`'), new Set(['<T>']))
assert.deepEqual(findGenerics('`V`'), new Set())
assert.deepEqual(findGenerics('`EE`'), new Set())

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
assert.deepEqual(_extractGenerics('`V<{value:string}>`', '`V<T>`'), {
  '<T>': '{value:string}',
})

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
assert.equal(applyGenerics('<T>', { '<T>': '`CH`' }), '`CH`')
assert.equal(applyGenerics('`V<T>`', { '<T>': '{}' }), '`V<{}>`')
assert.equal(applyGenerics('`V<T>`', { '<T>': '<A>' }), '`V<A>`')

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
// assert.deepEqual(_evaluate("'\\'foo\\''"), "'foo'")
assert.deepEqual(_evaluate('\'\\"foo\\"\''), '"foo"')
assert.deepEqual(_evaluate('"\\"foo\\""'), '"foo"')
assert.deepEqual(_evaluate('"\\"\\\\\\"foo\\\\\\"\\""'), '"\\"foo\\""')
// assert.deepEqual(_evaluate('"\\"\\\\"foo\\\\"\\""'), '"\\"foo\\""')
assert.deepEqual(_evaluate("'\\\\'"), '\\')
// assert.deepEqual(_evaluate("'\\'\\\\\\''"), "'\\'")
assert.deepEqual(_evaluate('"\\""'), '"')
assert.deepEqual(_evaluate('"\\"input/a\\""'), '"input/a"')
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
assert.deepEqual(_evaluate('{a,}'), { a: 'a' })
assert.deepEqual(_evaluate('{1}'), { 1: '1' })
assert.deepEqual(_evaluate('"\n"'), '\n')
assert.deepEqual(
  _evaluate(`\${unit:{id:'${ID_IDENTITY}'}}`).__bundle.unit.id,
  ID_IDENTITY
)
assert.deepEqual(
  _evaluate(
    `'{\n "error": {\n  "errors": [\n   {\n    "domain": "global",\n    "reason": "required",\n    "message": "Login Required",\n    "locationType": "header",\n    "location": "Authorization"\n   }\n  ],\n  "code": 401,\n  "message": "Login Required"\n }\n}\n'`
  ),
  '{\n "error": {\n  "errors": [\n   {\n    "domain": "global",\n    "reason": "required",\n    "message": "Login Required",\n    "locationType": "header",\n    "location": "Authorization"\n   }\n  ],\n  "code": 401,\n  "message": "Login Required"\n }\n}\n'
)

// isGeneric

assert(hasGeneric('<T>'))
assert(hasGeneric('<0>'))
assert(hasGeneric('<0>[]'))
assert(hasGeneric('`V<T>`'))

// matchAllType

const _matchAllExcTypes = (types: string[], excTypes: string[]) =>
  matchAllExcTypes(system.specs, types, excTypes)

assert(isEqual(_matchAllExcTypes(['any'], ['any']), [[[0, 0]]]))
assert(isEqual(_matchAllExcTypes(['string'], ['any']), [[[0, 0]]]))
assert(isEqual(_matchAllExcTypes(['any'], ['string']), [[[0, 0]]]))
assert(isEqual(_matchAllExcTypes(['number'], ['string']), []))
assert(
  isEqual(_matchAllExcTypes(['number', 'number'], ['<T>']), [
    [[0, 0]],
    [[1, 0]],
  ])
)
assert(
  isEqual(_matchAllExcTypes(['number', 'number'], ['number']), [
    [[0, 0]],
    [[1, 0]],
  ])
)
assert(isEqual(_matchAllExcTypes(['number', 'string'], ['number']), [[[0, 0]]]))

assert.deepEqual(
  evaluateBundleStr(
    "${unit:{id:'dc5852d3-b212-48ee-9f05-6ea2de2ef515',input:{},output:{},memory:{input:{},output:{},memory:{unit:{},merge:{},exposedMerge:{},waitAll:{input:'{}',output:'{}',memory:'{__buffer:[],_forwarding:false,_backwarding:false,_forwarding_empty:false,_looping:false}'}}}},specs:{\"dc5852d3-b212-48ee-9f05-6ea2de2ef515\":{type:'`U`&`G`&`C`',name:'untitled',units:{},merges:{},inputs:{},outputs:{},metadata:{icon:null,description:''},id:'dc5852d3-b212-48ee-9f05-6ea2de2ef515'}}}",
    system.specs,
    system.classes
  ),
  {
    unit: {
      id: 'dc5852d3-b212-48ee-9f05-6ea2de2ef515',
      input: {},
      output: {},
      memory: {
        input: {},
        output: {},
        memory: {
          unit: {},
          merge: {},
          exposedMerge: {},
          waitAll: {
            input: '{}',
            output: '{}',
            memory:
              '{__buffer:[],_forwarding:false,_backwarding:false,_forwarding_empty:false,_looping:false}',
          },
        },
      },
    },
    specs: {
      'dc5852d3-b212-48ee-9f05-6ea2de2ef515': {
        type: '`U`&`G`&`C`',
        name: 'untitled',
        units: {},
        merges: {},
        inputs: {},
        outputs: {},
        metadata: { icon: null, description: '' },
        id: 'dc5852d3-b212-48ee-9f05-6ea2de2ef515',
      },
    },
  }
)

// assert(
//   isTypeMatch(
//     system,
//     "${unit:{id:'dc5852d3-b212-48ee-9f05-6ea2de2ef515',input:{},output:{},memory:{input:{},output:{},memory:{unit:{},merge:{},exposedMerge:{},waitAll:{input:'{}',output:'{}',memory:'{__buffer:[],_forwarding:false,_backwarding:false,_forwarding_empty:false,_looping:false}'}}}},specs:{\"dc5852d3-b212-48ee-9f05-6ea2de2ef515\":{type:'`U`&`G`&`C`',name:'untitled',units:{},merges:{},inputs:{},outputs:{},metadata:{icon:null,description:''},id:'dc5852d3-b212-48ee-9f05-6ea2de2ef515'}}}",
//     '`G`'
//   )
// )

// assert(
//   _getTypeTree(
//     '{name:"cybermilla 0",inputs:{},outputs:{click:{plug:{0:{unitId:"onclick",pinId:"event"},1:{unitId:"onclick0",pinId:"event"},2:{unitId:"onclick1",pinId:"event"}}}},units:{cybermillabutton:{id:"91bbfe94-8960-4ef0-946d-d786a8dfceb6",input:{style:{data:"{background:\\"#FD5F55\\",background:\\"radial-gradient(ellipse at center, #ffffff -100%, #FD5F55 50%)\\"}\\"},value:{data:"\\"Fashion\\""}},output:{},metadata:{component:{width:274.7310791015625,height:122.5975341796875},position:{x:-550,y:57}}},cybermillabutton0:{id:"91bbfe94-8960-4ef0-946d-d786a8dfceb6",input:{style:{data:"{background:\\"#A6496A\\",background:\\"radial-gradient(ellipse at center, #ffffff -100%, #A6496A 50%)\\"}"},value:{data:"\\"Design"\\"}}},onclick:{id:"97c94516-add1-11ea-ba72-8f55299b735c",input:{element:{}},output:{event:{}},metadata:{position:{x:-368,y:57}}},onclick0:{id:"97c94516-add1-11ea-ba72-8f55299b735c",input:{element:{}},output:{event:{}},metadata:{position:{x:93,y:62}}},onclick1:{id:"97c94516-add1-11ea-ba72-8f55299b735c",input:{element:{}},output:{event:{}},metadata:{position:{x:343,y:39}}}},merges:{0:{onclick:{input:{element:true}},cybermillabutton:{output:{_self:true}}},1:{onclick0:{input:{element:true}},cybermillabutton0:{output:{_self:true}}},2:{onclick1:{input:{element:true}},cybermillabutton1:{output:{_self:true}}}},render:true,component:{subComponents:{box:{children:["box4"],childSlot:{box4:"default"}},box4:{children:["image","textdiv","textdiv0","box5"],childSlot:{image:"default",textdiv:"default",textdiv0:"default",box5:"default"}},box5:{children:["cybermillabutton","cybermillabutton0","cybermillabutton1"],childSlot:{cybermillabutton:"default",cybermillabutton0:"default",cybermillabutton1:"default"}},textdiv:{children:[]},textdiv0:{children:[]},image:{children:[]},cybermillabutton:{children:[]},cybermillabutton0:{children:[]},cybermillabutton1:{children:[]}},children:["box"],defaultWidth:480,defaultHeight:690},metadata:{complexity:26},type:"`U`&`G`&`C`",id:"56304648-a9f7-483b-ac7d-2bc63f0bf67f"}'
//   )
// )

assert(
  isValidValue(
    `\${unit:{id:"9988a56e-6bee-46c8-864c-e351d84bc7e2",input:{value:{data:"\\"\\n\\nThis is indeed a test\\""}}}}`
  )
)

assert.equal(_evaluate('"\n"'), '\n')
assert.equal(_evaluate('"\\"\\n\\""'), '"\\n"')

assert(
  isValidValue(
    '${unit:{id:"9f1e9240-08d7-46f4-bb57-11de177b987f"},specs:{"9f1e9240-08d7-46f4-bb57-11de177b987f":{name:"empty",units:{unit:{id:"6f0be5f2-bc6f-4f68-8826-91b69c4aacb7",input:{},output:{}}},merges:{},inputs:{},outputs:{},metadata:{icon:null,description:"empty graph",complexity:2,tags:["core"]},id:"9f1e9240-08d7-46f4-bb57-11de177b987f",type:"`U`&`G`",system:true},"6f0be5f2-bc6f-4f68-8826-91b69c4aacb7":{type:"`U`&`G`",name:"untitled",units:{textarea:{id:"83ec6688-b80b-4ef2-861f-14245ef392c0",input:{value:{ignored:false,constant:false},style:{ignored:false,constant:true,data:"{fontSize:\\"14px\\"}",metadata:{position:{x:52,y:-34}}},placeholder:{ignored:true,constant:false,metadata:{position:{x:52,y:-61}}}},output:{value:{ignored:true,constant:false,metadata:{position:{x:311,y:9}}}},metadata:{position:{x:178,y:9}}},spark:{id:"3be8272d-310a-4aa2-84a1-71f590a8227a",input:{a:{ignored:false,constant:true,data:"\\"M50 100 a 50  50 1 1 1 0 1z M50 100 a 50  50 1, 1, 1, 0, 1M 96 100 a 4  4 1 1 1 0 1M 100 100 m 0 -30 l 0 -50 m -25 5 a 60 60 1 0 1 50 1 \nM 100 100 m 0 -30 l 0 -50 m -25 5 a 60 60 1 0 1 50 1 \n\nM 100 100 m 25 -25 l 25 -25 m -10 -10 a 60 60 0 0 1 20 20 \nM 100 100 m 30 0 l 50 0 m -5 -25 a 60 60 1 0 1 0 50 \n\nM 100 100 m 30 0 l 50 0 m -5 -25 a 60 60 1 0 1 0 50 \nM 100 100 m 25 25 l 25 25 m 10 -10 a 60 60 1 0 1 -20 20\n\nM 100 100 m 0 30 l 0 50 m 25 -5 a 60 60 1 0 1 -50 0 \nM 100 100 m 0 30 l 0 50 m 25 -5 a 60 60 1 0 1 -50 0 \n\nM 100 100 m -25 25 l -25 25 m 10 10 a 60 60 1 0 1 -20 -20 \nM 100 100 m -30 0 l -50 0 m 5 25 a 60 60 0 0 1 0 -50 \n\nM 100 100 m -30 0 l -50 0 m 5 25 a 60 60 0 0 1 0 -50 \nM 100 100 m -25 -25 l -25 -25 m -10 10 a 60 60 0 0 1 20 -20\\""}},output:{a:{ignored:false,constant:false}},metadata:{position:{x:13,y:95}}},onvalue:{id:"d0e6f14c-400c-42f3-bfd6-1bbe0146f490",input:{element:{constant:false,ignored:false}},output:{event:{constant:false,ignored:false,data:"\\"M50 100 a 50  50 1 1 1 0 1z \nM50 100 a 50  50 1, 1, 1, 0, 1\n\nM 96 100 a 4  4 1 1 1 0 1\n\nM 100 100 m 0 -30 l 0 -50 m -25 5 a 60 60 1 0 1 50 1 \nM 100 100 m 0 -30 l 0 -50 m -25 5 a 60 60 1 0 1 50 1 \n\nM 100 100 m 25 -25 l 25 -25 m -10 -10 a 60 60 0 0 1 20 20 \nM 100 100 m 30 0 l 50 0 m -5 -25 a 60 60 1 0 1 0 50 \n\nM 100 100 m 30 0 l 50 0 m -5 -25 a 60 60 1 0 1 0 50 \nM 100 100 m 25 25 l 25 25 m 10 -10 a 60 60 1 0 1 -20 20\n\nM 100 100 m 0 30 l 0 50 m 25 -5 a 60 60 1 0 1 -50 0 \nM 100 100 m 0 30 l 0 50 m 25 -5 a 60 60 1 0 1 -50 0 \n\nM 100 100 m -25 25 l -25 25 m 10 10 a 60 60 1 0 1 -20 -20 \nM 100 100 m -30 0 l -50 0 m 5 25 a 60 60 0 0 1 0 -50 \n\nM 100 100 m -30 0 l -50 0 m 5 25 a 60 60 0 0 1 0 -50 \nM 100 100 m -25 -25 l -25 -25 m -10 10 a 60 60 0 0 1 20 -20\\""}},metadata:{position:{x:22,y:4}}},removenewline:{id:"1a0773eb-559c-47e2-81d7-fc28bc80076d",input:{str:{constant:false,ignored:false,data:"\\"M50 100 a 50  50 1 1 1 0 1z \nM50 100 a 50  50 1, 1, 1, 0, 1\n\nM 96 100 a 4  4 1 1 1 0 1\n\nM 100 100 m 0 -30 l 0 -50 m -25 5 a 60 60 1 0 1 50 1 \nM 100 100 m 0 -30 l 0 -50 m -25 5 a 60 60 1 0 1 50 1 \n\nM 100 100 m 25 -25 l 25 -25 m -10 -10 a 60 60 0 0 1 20 20 \nM 100 100 m 30 0 l 50 0 m -5 -25 a 60 60 1 0 1 0 50 \n\nM 100 100 m 30 0 l 50 0 m -5 -25 a 60 60 1 0 1 0 50 \nM 100 100 m 25 25 l 25 25 m 10 -10 a 60 60 1 0 1 -20 20\n\nM 100 100 m 0 30 l 0 50 m 25 -5 a 60 60 1 0 1 -50 0 \nM 100 100 m 0 30 l 0 50 m 25 -5 a 60 60 1 0 1 -50 0 \n\nM 100 100 m -25 25 l -25 25 m 10 10 a 60 60 1 0 1 -20 -20 \nM 100 100 m -30 0 l -50 0 m 5 25 a 60 60 0 0 1 0 -50 \n\nM 100 100 m -30 0 l -50 0 m 5 25 a 60 60 0 0 1 0 -50 \nM 100 100 m -25 -25 l -25 -25 m -10 10 a 60 60 0 0 1 20 -20\\""}},output:{str:{constant:false,ignored:false,data:"\\"M50 100 a 50  50 1 1 1 0 1z M50 100 a 50  50 1, 1, 1, 0, 1\n\nM 96 100 a 4  4 1 1 1 0 1\n\nM 100 100 m 0 -30 l 0 -50 m -25 5 a 60 60 1 0 1 50 1 \nM 100 100 m 0 -30 l 0 -50 m -25 5 a 60 60 1 0 1 50 1 \n\nM 100 100 m 25 -25 l 25 -25 m -10 -10 a 60 60 0 0 1 20 20 \nM 100 100 m 30 0 l 50 0 m -5 -25 a 60 60 1 0 1 0 50 \n\nM 100 100 m 30 0 l 50 0 m -5 -25 a 60 60 1 0 1 0 50 \nM 100 100 m 25 25 l 25 25 m 10 -10 a 60 60 1 0 1 -20 20\n\nM 100 100 m 0 30 l 0 50 m 25 -5 a 60 60 1 0 1 -50 0 \nM 100 100 m 0 30 l 0 50 m 25 -5 a 60 60 1 0 1 -50 0 \n\nM 100 100 m -25 25 l -25 25 m 10 10 a 60 60 1 0 1 -20 -20 \nM 100 100 m -30 0 l -50 0 m 5 25 a 60 60 0 0 1 0 -50 \n\nM 100 100 m -30 0 l -50 0 m 5 25 a 60 60 0 0 1 0 -50 \nM 100 100 m -25 -25 l -25 -25 m -10 10 a 60 60 0 0 1 20 -20\\""}},metadata:{position:{x:-57,y:50}}},untitled:{id:"79c37c2e-4a2b-445f-af75-5599cc6bf31c",metadata:{position:{x:-183,y:-34}},input:{style:{metadata:{position:{x:-53,y:-62}},constant:true,data:"{fill:\\"currentColor\\",fillRule:\\"evenodd\\",strokeWidth:\\"6px\\",strokeLinecap:\\"round\\"}"},d:{}},output:{}}},merges:{0:{textarea:{output:{_self:true}},onvalue:{input:{element:true}}},1:{spark:{output:{a:true}},textarea:{input:{value:true}}},2:{spark:{input:{a:true}},removenewline:{output:{str:true}}},3:{removenewline:{input:{str:true}},onvalue:{output:{event:true}},untitled:{input:{d:true}}}},inputs:{},outputs:{},metadata:{icon:null,description:"",complexity:22,position:{merge:{1:{x:52,y:67},2:{x:-34,y:91},3:{x:-40,y:4}}}},id:"6f0be5f2-bc6f-4f68-8826-91b69c4aacb7",component:{subComponents:{textarea:{},untitled:{}},children:["textarea","untitled"],defaultWidth:200,defaultHeight:150}}}}'
  )
)
