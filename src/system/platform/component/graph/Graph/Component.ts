import { $Component } from '../../../../../async/$Component'
import { $G } from '../../../../../async/$G'
import { $Graph } from '../../../../../async/$Graph'
import { AsyncGraph } from '../../../../../async/AsyncGraph'
import callAll from '../../../../../callAll'
import { Graph } from '../../../../../Class/Graph'
import { addListeners } from '../../../../../client/addListener'
import {
  ANIMATION_T,
  ifLinearTransition,
} from '../../../../../client/animation'
import classnames from '../../../../../client/classnames'
import { HEXToHSV, isHEX, nameToColor } from '../../../../../client/color'
import {
  getSpecRadius as getSpecRadiusById,
  UNIT_MIN_RADIUS,
} from '../../../../../client/complexity'
import {
  Component,
  componentFromSpecId,
  component_,
} from '../../../../../client/component'
import DataTree from '../../../../../client/component/DataTree/Component'
import Datum from '../../../../../client/component/Datum/Component'
import {
  getDatumSize,
  MAX_HEIGHT as DATUM_MAX_HEIGHT,
  MAX_WIDTH as DATUM_MAX_WIDTH,
} from '../../../../../client/component/getDatumSize'
import mergeProps from '../../../../../client/component/mergeProps'
import mergeStyle from '../../../../../client/component/mergeStyle'
// import mergeStyle from '../../../../../../client/component/mergeStyle'
import Minimap, {
  MINIMAP_HEIGHT,
  MINIMAP_WIDTH,
} from '../../../../../client/component/Minimap/Component'
import Search from '../../../../../client/component/Search/Component'
import Selection from '../../../../../client/component/Selection/Component'
import { Context } from '../../../../../client/context'
import {
  parentClass,
  parentComponent,
} from '../../../../../client/createParent'
import debounce from '../../../../../client/debounce'
import { dragAndDrop } from '../../../../../client/dnd'
import { getCircle, getLine, getRectangle } from '../../../../../client/drawing'
import { Element, findRef } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import { makeBlurListener } from '../../../../../client/event/focus/blur'
import { makeFocusListener } from '../../../../../client/event/focus/focus'
import { makeInputListener } from '../../../../../client/event/input'
import {
  IOKeyboardEvent,
  isKeyPressed,
  makeShortcutListener,
  Shortcut,
} from '../../../../../client/event/keyboard'
import { IOPointerEvent } from '../../../../../client/event/pointer'
import {
  CLICK_TIMEOUT,
  makeClickListener,
  POINTER_CLICK_RADIUS,
} from '../../../../../client/event/pointer/click'
import { makePointerCancelListener } from '../../../../../client/event/pointer/pointercancel'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerEnterListener } from '../../../../../client/event/pointer/pointerenter'
import { makePointerLeaveListener } from '../../../../../client/event/pointer/pointerleave'
import { makePointerMoveListener } from '../../../../../client/event/pointer/pointermove'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import {
  IOFrameResizeEvent,
  makeResizeListener,
} from '../../../../../client/event/resize'
import {
  IOWheelEvent,
  makeWheelListener,
} from '../../../../../client/event/wheel'
import {
  add_link_to_graph,
  add_node_to_graph,
  build_subgraph,
  change_link_source_on_graph,
  change_link_target_on_graph,
  G,
  getSubPinSpecNodeId,
  remove_link_from_graph,
  remove_node_from_graph,
} from '../../../../../client/graph'
import {
  getDatumNodeId,
  getErrNodeId,
  getExternalNodeId,
  getIdFromMergeNodeId,
  getInternalNodeId,
  getLinkId,
  getMergeNodeId,
  getOutputNodeId,
  getPinLinkId,
  getPinLinkIdFromPinNodeId,
  getPinNodeId,
  getSelfPinNodeId,
  getTypeFromLinkPinNodeId,
  getTypeNodeId,
  isBaseSpec,
  isBaseSpecId,
  isComponent,
  isComponentSpec,
  isDatumLinkId,
  isExternalLinkId,
  isExternalNodeId,
  isInputPinId as isInputPinNodeId,
  isMergeNodeId,
  isOutputPinId,
  isPinLinkId,
  isUnitNodeId,
  randomInArray,
  segmentDatumLinkId,
  segmentDatumNodeId,
  segmentErrNodeId,
  segmentExposedNodeId,
  segmentExternalLinkId,
  segmentInternalNodeId,
  segmentLinkPinNodeId,
  segmentMergeNodeId,
  segmentPinLinkId,
} from '../../../../../client/id'
import { MAX_Z_INDEX } from '../../../../../client/MAX_Z_INDEX'
import { Mode } from '../../../../../client/mode'
import parentElement from '../../../../../client/parentElement'
import { _pinTypeMatch } from '../../../../../client/parser'
import { showNotification } from '../../../../../client/showNotification'
import { SimLink, SimNode, Simulation } from '../../../../../client/simulation'
import {
  emptySpec,
  getComponentSpec,
  getSpec,
  getSpecInputs,
  getSpecOutputs,
  newMergeIdInSpec,
  newSpecId,
  newUnitIdInSpec,
  newUnitIdInSpecId,
  setSpec,
} from '../../../../../client/spec'
import { userSelect } from '../../../../../client/style/userSelect'
import {
  applyTheme,
  BLUE,
  DARK_LINK_YELLOW,
  DARK_YELLOW,
  getThemeLinkModeColor,
  getThemeModeColor,
  GREEN,
  LINK_BLUE,
  LINK_GREEN,
  LINK_YELLOW,
  NONE,
  OPAQUE_RED,
  RED,
  setAlpha,
  themeBackgroundColor,
  YELLOW,
} from '../../../../../client/theme'
import {
  addVector,
  applyVector,
  centerToSurfaceDistance,
  Circle,
  describeArc,
  distance,
  jigglePoint,
  Line,
  lineIntersect,
  normalize,
  NULL_VECTOR,
  Point,
  pointDistance,
  pointInNode,
  Position,
  randomInCircle,
  randomInRadius,
  randomInRect,
  randomUnitVector,
  Rect,
  Shape,
  Size,
  surfaceDistance,
  unitVector,
  _surfaceDistance,
} from '../../../../../client/util/geometry'
import { getUnitPinPosition } from '../../../../../client/util/geometry/unit/getUnitPinPosition'
import { textToClipboard } from '../../../../../client/util/web/clipboard'
import { downloadJSON } from '../../../../../client/util/web/downloadJSON'
import {
  translate,
  Zoom,
  zoomIdentity,
  zoomInvert,
  zoomTransformCenteredAt,
} from '../../../../../client/zoom'
import { DEFAULT_EVENTS } from '../../../../../constant/DEFAULT_EVENTS'
import {
  DATA_LINK_DISTANCE,
  ERR_LINK_DISTANCE,
  EXPOSED_LINK_DISTANCE,
  LINK_DISTANCE,
  LINK_DISTANCE_IGNORED,
  TYPE_LINK_DISTANCE,
} from '../../../../../constant/LINK_DISTANCE'
import { PIN_RADIUS } from '../../../../../constant/PIN_RADIUS'
import { SELF } from '../../../../../constant/SELF'
import { GraphMergePinDataMomentData } from '../../../../../debug/GraphMergePinDataMoment'
import { GraphMoment } from '../../../../../debug/GraphMoment'
import { GraphUnitErrMomentData } from '../../../../../debug/GraphUnitErrMoment'
import { GraphUnitPinDataMomentData } from '../../../../../debug/GraphUnitPinDataMoment'
import { GraphUnitPinDropMomentData } from '../../../../../debug/GraphUnitPinDropMoment'
import { GraphUnitPropMomentData } from '../../../../../debug/GraphUnitPropMoment'
import { GraphUnitSpecMomentData } from '../../../../../debug/GraphUnitSpecMoment'
import { Moment } from '../../../../../debug/Moment'
import { PinDataMomentData } from '../../../../../debug/PinDataMoment'
import { PinDropMomentData } from '../../../../../debug/PinDropMoment'
import { GraphExposedPinEventData } from '../../../../../debug/watchGraphExposedPinEvent'
import { GraphExposedPinSetMomentData } from '../../../../../debug/watchGraphExposedPinSetEvent'
import { GraphMergeMomentData } from '../../../../../debug/watchGraphMergeEvent'
import { GraphMergePinMomentData } from '../../../../../debug/watchGraphPinMergeEvent'
import { GraphPlugMomentData } from '../../../../../debug/watchGraphPlugEvent'
import { GraphSpecUnitMomentData } from '../../../../../debug/watchGraphUnitEvent'
import { UnitGraphSpecMomentData } from '../../../../../debug/watchUnitLeafEvent'
import { GraphState } from '../../../../../GraphState'
import NOOP from '../../../../../NOOP'
import { randomValueOfType } from '../../../../../randomValue'
import {
  removeDatum,
  REMOVE_DATUM,
  setDatum,
  SET_DATUM,
} from '../../../../../spec/actions/data'
import {
  addMerge,
  addUnit,
  ADD_UNIT,
  coverPin,
  coverPinSet,
  exposePin,
  exposePinSet,
  mergeMerges,
  plugPin,
  removeUnit,
  setPinSetFunctional,
  setUnitPinIgnored,
  unplugPin,
} from '../../../../../spec/actions/spec'
import { graphComplexity } from '../../../../../spec/complexity'
import { emptyGraphSpec } from '../../../../../spec/emptySpec'
import { evaluate } from '../../../../../spec/evaluate'
import {
  ANY_TREE,
  getTree,
  getValueTree,
  TreeNode,
  TreeNodeType,
  _getValueType,
  _isTypeMatch,
  _isValidValue,
  _matchAllExcTypes,
} from '../../../../../spec/parser'
import * as componentReducer from '../../../../../spec/reducers/component'
import * as specReducer from '../../../../../spec/reducers/spec'
import { escape } from '../../../../../spec/stringify'
import {
  TypeTreeMap,
  _getGraphTypeMap,
  _getSpecTypeInterfaceByPath,
  _moreSpecific,
} from '../../../../../spec/type'
import {
  forEachPinOnMerge,
  getInputNodeId,
  oppositePinKind,
} from '../../../../../spec/util'
import { State } from '../../../../../State'
import {
  Action,
  BaseComponentSpec,
  ComponentSpec,
  ComponentSpecs,
  GraphComponentSpec,
  GraphDataSpec,
  GraphExposedPinSpec,
  GraphExposedPinsSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphSubComponentSpec,
  GraphUnitMetadataSpec,
  GraphUnitPinSpec,
  GraphUnitSpec,
  Kind,
  PinSpec,
  Spec,
  Specs,
  UnitsSpec,
} from '../../../../../types'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../Unlisten'
import { forEach, last, pull, push } from '../../../../../util/array'
import { randomId, randomIdNotIn } from '../../../../../util/id'
import {
  clone,
  getObjSingleKey,
  invertObj,
  isEmptyObject,
  mapObjKey,
  _keyCount,
} from '../../../../../util/object'
import { getTextAreaSize } from '../../../../../util/text/getTextAreaSize'
import { getTextWidth } from '../../../../../util/text/getTextWidth'
import swap from '../../../../core/array/Swap/f'
import assocPath from '../../../../core/object/AssocPath/f'
import dissocPath from '../../../../core/object/DissocPath/f'
import forEachKeyValue from '../../../../core/object/ForEachKeyValue/f'
import keyCount from '../../../../core/object/KeyCount/f'
import { clamp } from '../../../../core/relation/Clamp/f'
import _dissoc from '../../../../f/object/Dissoc/f'
import keys from '../../../../f/object/Keys/f'
import Class from '../../core/Class/Component'
import GUI from '../../core/GUI/Component'
import Modes from '../../core/Modes/Component'
import { default as Resize, IOResizeEvent } from '../../core/Resize/Component'
import Transcend from '../../core/Transcend/Component'
import Div from '../../Div/Component'
import Frame from '../../Frame/Component'
import Icon from '../../Icon/Component'
import SVGDefs from '../../svg/Defs/Component'
import SVGG from '../../svg/G/Component'
import SVGMarker from '../../svg/Marker/Component'
import SVGPath from '../../svg/Path/Component'
import SVGRect from '../../svg/Rect/Component'
import SVGSVG from '../../svg/SVG/Component'
import SVGText from '../../svg/SVGText/Component'
import SVGTextPath from '../../svg/TextPath/Component'
import TextInput from '../../value/TextInput/Component'
import ZoomComponent from '../../Zoom/Component'
import { GraphSpecUnitMoveMomentData } from './../../../../../debug/watchGraphUnitMoveEvent'

const UNIT_NAME_MAX_SIZE: number = 30
const UNIT_CORE_MAX_CHAR_LINE: number = 12
const UNIT_CORE_NAME_FONT_SIZE: number = 12

const LINK_TEXT_FONT_SIZE: number = 10

const PIN_NAME_MAX_SIZE: number = 12

const MIN_WIDTH: number = 45
// const MAX_WIDTH: number = 668
const MAX_WIDTH: number = Infinity
const MIN_HEIGHT: number = 45
// const MAX_HEIGHT: number = 668
const MAX_HEIGHT: number = Infinity

export const NEAR = 24

const oppositeMomentEvent = {
  data: 'drop',
  drop: 'data',
}

export const getOppositeMoment = (moment: any): any => {
  const { type, event, data } = moment
  return {
    type,
    event: oppositeMomentEvent[event],
    data,
  }
}

const FF_ANIMATE_FULLWINDOW = true
const FF_PREVENT_FRAMEOUT_ANIMATE_FULLWINDOW = true

export const enable_mode_keyboard = (
  component: Component,
  callback: (mode: string) => void
): Unlisten => {
  const { $system } = component
  // console.log('enable_mode_keyboard')
  const _mode_keydown: Dict<boolean> = {}

  const shortcuts: Shortcut[] = []
  for (const mode in MODE_TO_KEY) {
    const mode_key = MODE_TO_KEY[mode]

    if (isKeyPressed($system, mode_key)) {
      _mode_keydown[mode_key] = true
      callback(mode as Mode)
    }

    shortcuts.push({
      combo: mode_key,
      strict: false,
      keydown: (key: string, event: IOKeyboardEvent) => {
        const { ctrlKey } = event
        if (ctrlKey) {
          return
        }

        // console.log('keydown', key)
        if (mode_key === key) {
          _mode_keydown[key] = true
          callback(mode as Mode)
        }
      },
      keyup: (key: string) => {
        // console.log('keyup', key)
        // AD HOC this might come from a "focusout" event,
        // resultant of search being shown
        // setTimeout(() => {
        delete _mode_keydown[key]

        if (key === MODE_TO_KEY[mode]) {
          const mode_keydown = Object.keys(_mode_keydown)
          const mode_keydown_count = mode_keydown.length
          if (mode_keydown_count > 0) {
            callback(KEY_TO_MODE[mode_keydown[mode_keydown_count - 1]] as Mode)
          } else {
            callback('none')
          }
        }
        // }, 0)
      },
    })
  }
  const shortcutListener = makeShortcutListener(shortcuts)
  const keyboard_unlisten = component.addEventListener(shortcutListener)
  return keyboard_unlisten
  // const $keyboard = new KeyboardController(component.$context.$element)
  // const shortcutGroupId = $keyboard.addShortcutGroup(shortcuts)
  // return () => {
  //   $keyboard.removeShortcutGroup(shortcutGroupId)
  // }
}

// export const SUBGRAPH_MAX_D: number = 9  * LINK_DISTANCE
export const SUBGRAPH_MAX_D: number = 6 * LINK_DISTANCE
// export const SUBGRAPH_MAX_D: number = Infinity
// export const SUBGRAPH_MAX_D: number = 2 * LINK_DISTANCE
export const NOT_SUBGRAPH_MAX_D: number = 2 * LINK_DISTANCE

export const describeArrowSemicircle = (r: number): string => {
  r += 1
  const k = (PIN_RADIUS + 1) / r
  return describeArc(r + 0.5, 1, r, 270 - 60 * k, 270 + 60 * k)
}

export const describeArrowShape = (shape: Shape, r: number): string => {
  if (shape === 'circle') {
    return describeArrowSemicircle(r)
  } else {
    return ARROW_FLAT
  }
}

export const ARROW_NONE = ''
export const ARROW_MEMORY = 'M-6,4 L0,1 L-6,-2'
export const ARROW_NORMAL = 'M-0.25,2.25 L2,1 L-0.25,-0.25'
export const ARROW_FLAT = 'M0,8 L0,-5.5'
export const ARROW_SEMICIRCLE = describeArrowSemicircle(PIN_RADIUS)
export const ID_ARROW_MEMORY = 'id-arrow-memory'
export const ID_ARROW_NORMAL = 'id-arrow-normal'
export const ID_ARROW_SEMICIRCLE = 'id-arrow-semicircle'

export const LAYOUT_HORIZONTAL_PADDING = 45
export const LAYOUT_VERTICAL_PADDING = 75

export interface LinkProps {
  className?: string
  hidden?: boolean

  stroke?: string
  opacity?: number
  strokeWidth?: number
  strokeDasharray?: number

  text?: string
  textHidden?: boolean
  textDy?: number
  textOpacity?: number

  showStart?: boolean
  showEnd?: boolean

  startMarker?: SVGPath | null
  startMarkerX?: number

  endMarker?: SVGPath | null
  endMarkerX?: number
}

export interface LinkArrowOpt {
  fill?: string
}

export interface LinkMarkerOpt {
  component?: Element | null
  x?: number
}

export interface UnitPinPosition {
  input: Dict<Position>
  output: Dict<Position>
}

export interface ExposedPosition {
  internal: Position
  external: Position
}

export interface SelectionOpt {
  className?: string
  style?: object
  width: number
  height: number
  paddingX?: number
  paddingY?: number
  shape: Shape
  strokeWidth?: number
  strokeDasharray?: number
  stroke?: string
}

export interface AreaOpt {
  className?: string
  width: number
  height: number
  style?: Dict<string>
}

export interface _Props {
  className?: string
  style?: Dict<string>
  disabled?: boolean

  fullwindow?: boolean

  parent?: _GraphComponent

  pod: $Graph
  component: Component

  frame?: Component
  frameOut?: boolean

  zoomable?: boolean
  minZoom?: number
  maxZoom?: number
  zoom?: Zoom
  zoomTranslate?: boolean
  zoomDraggable?: boolean

  animate?: boolean
}

const _DEFAULT_STYLE = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  touchAction: 'none',
  ...userSelect('none'),
}

export interface DefaultProps {
  style: Dict<string>
  zoomable: boolean
  minZoom: number
  maxZoom: number
  zoomTranslate: boolean
  zoomDraggable: boolean
  animate: boolean
}

const defaultProps: DefaultProps = {
  style: {},

  zoomable: true,
  minZoom: 1,
  maxZoom: 6,
  zoomDraggable: true,
  zoomTranslate: true,

  animate: true,
}

// zoom

export const ZOOM_INTENSITY = 0.05

// selection

export const NOT_SELECTED_AREA = { x0: 0, y0: 0, x1: 0, y1: 0 }

// area

export const NODE_PADDING: number = 12

// crud

export const KEY_TO_MODE = {
  q: 'info',
  f: 'change',
  d: 'remove',
  s: 'add',
  a: 'data',
  Shift: 'multiselect',
}

export const MODE_TO_KEY: Dict<string> = {
  info: 'q',
  add: 's',
  remove: 'd',
  change: 'f',
  data: 'a',
  multiselect: 'Shift',
}

const hashCode = function (str: string) {
  let hash = 0
  if (str.length === 0) {
    return hash
  }
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32 bit integer
  }
  return hash
}

export const newSpecPinId = (
  spec: GraphSpec,
  type: 'input' | 'output',
  start: string
): string => {
  let newPinId = start
  let newPinCharCode = 97
  while ((spec[`${type}s`] || {})[newPinId]) {
    newPinCharCode++
    newPinId = String.fromCharCode(newPinCharCode)
  }
  return newPinId
}

export const LAYER_NONE = 0
export const LAYER_NORMAL = 1
export const LAYER_COLLAPSE = 2
export const LAYER_SEARCH = 3
export const LAYER_IGNORED = 4
export const LAYER_EXPOSED = 5
export const LAYER_DATA_LINKED = 6
export const LAYER_DATA = 7
export const LAYER_ERR = 8
export const LAYER_TYPE = 9

export const NODE_MASS_RELATIVE: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // none           // 0
  [0, 1, 0, 1, 1, 1, 0, 1, 1, 1], // normal         // 1
  [0, 1, 0, 1, 1, 1, 0, 1, 1, 1], // collapse       // 2
  [0, 0, 0, 1, 1, 1, 0, 1, 1, 1], // search         // 3
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // ignored        // 4
  [0, 0, 0, 0, 0, 1, 0, 1, 1, 1], // exposed        // 5
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // data (linked)  // 6
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // data           // 7
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1], // err            // 8
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // type           // 9
]

export const LINK_MASS_RELATIVE: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
]

const SCMD = LINK_DISTANCE / SUBGRAPH_MAX_D / 3 // SUBGRAPH_CLOSE_MAX_D

export const SUBGRAPH_RELATIVE_MAX_D: number[][] = [
  [1, 1, 1, 1, 1, SCMD, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, SCMD, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, SCMD, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, SCMD, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, SCMD, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, SCMD, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
]

const NSCMD = LINK_DISTANCE / NOT_SUBGRAPH_MAX_D / 3 // NOT_SUBGRAPH_CLOSE_MAX_D

export const NOT_SUBGRAPH_RELATIVE_MAX_D: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

export type GraphSimLink = SimLink<{ type: string }>
export type GraphSimLinks = Dict<GraphSimLink>
export type GraphSimNode = SimNode<{ layer: number }>
export type GraphSimNodes = Dict<GraphSimNode>

const DEFAULT_STYLE = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  touchAction: 'none',
  ...userSelect('none'),
}

const _tree_cache: {
  [value: string]: TreeNode
} = {}

export const _getTree = (value: string): TreeNode => {
  if (_tree_cache[value]) {
    return _tree_cache[value]
  }
  const tree = getTree(value)
  _tree_cache[value] = tree
  return tree
}

export const _getValueTree = (value: string): TreeNode => {
  if (_tree_cache[value]) {
    return _tree_cache[value]
  }
  const tree = getValueTree(value)
  _tree_cache[value] = tree
  return tree
}

const _evaluate_cache: {
  [value: string]: any
} = {}

export const _evaluate = (value: string): any => {
  if (_evaluate_cache[value]) {
    return _evaluate_cache[value]
  }
  const data = evaluate(value)
  _evaluate_cache[value] = data
  return data
}

export interface Props {
  className?: string

  style?: Dict<string>

  disabled?: boolean

  pod?: $Graph

  graph?: _GraphComponent

  fullwindow?: boolean

  component?: Component
  frame?: $Component
  fallback?: Component
  background?: Div
  transcend?: Transcend
  root?: Frame

  zoom?: Zoom

  animate?: boolean
}

export const GRAPH_SPEC_ID = 'e80c912e-7508-11ea-966b-436805345ff0'

export default class GraphComponent extends Element<HTMLElement, Props> {
  private _root: Frame

  private _graph: _GraphComponent

  private _component: Component

  private _fallback_frame: Component

  private _transcend: Transcend

  private _fallback_pod: $Graph

  private _unlisten_fallback_pod: Dict<Unlisten> = {}

  private _pod: $Graph

  private _frame: Component
  private _frame_out: boolean = false

  private _background: Div

  private _unlisten_graph: Unlisten
  private _unlisten_transcend: Unlisten

  constructor($props: Props) {
    super($props)

    let {
      pod,
      className,
      style,
      zoom,
      animate = true,
      component,
      fullwindow,
      graph,
      fallback,
      transcend,
      background,
      root,
    } = $props

    const spec = {}

    const fallback_graph = new Graph(spec)
    this._fallback_pod = AsyncGraph(fallback_graph)
    this._pod = pod || this._fallback_pod

    this._fallback_frame = fallback || this._create_fallback_frame()
    this._frame = this._fallback_frame

    transcend =
      transcend ||
      new Transcend({
        down: fullwindow,
      })
    this._unlisten_transcend = transcend.addEventListener(
      makeClickListener({
        onLongPress: this._on_transcend_long_press,
        onLongClickCancel: this._on_transcend_long_click_cancel,
        onLongClick: this._on_transcend_long_click,
      })
    )
    this._transcend = transcend
    this.$ref['transcend'] = transcend

    component = component || parentComponent({})
    this._component = component

    graph =
      graph ||
      new _GraphComponent({
        className,
        style,
        pod: this._pod,
        frame: this._frame,
        component: this._component,
        animate,
        zoom,
        fullwindow,
      })
    graph.enter()
    this._graph = graph

    this._listen_graph()

    this._reset_frame()

    background =
      background ||
      new Div({
        style: {
          className: 'graph-background',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        },
      })
    this._background = background

    root =
      root ||
      new Frame({
        className: 'graph-root',
        style: {
          // position: 'absolute',
          position: 'relative',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        },
      })
    root.registerParentRoot(this._background)
    root.registerParentRoot(this._graph)
    root.registerParentRoot(this._fallback_frame)
    root.registerParentRoot(this._transcend)
    this._root = root

    if (pod === undefined || pod === null) {
      this._pod.$play({})
    }

    const $element = parentElement()

    this.$element = $element
    this.$slot = {
      default: this._graph.$slot['default'],
      '1': this._background.$slot['default'], // background
    }
    this.$subComponent = {
      background,
      root,
      graph,
      frame: this._fallback_frame,
      transcend,
    }
    this.$unbundled = false

    this.registerRoot(this._root)
  }

  moment(path, data: { type: 'unit' | 'graph'; moment: Moment }): void {
    this._graph.moment(path, data)
  }

  private _create_fallback_frame = (): Div => {
    const fallback_frame = new Div({
      className: 'graph-fallback-frame',
      style: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        pointerEvents: 'none',
      },
    })

    return fallback_frame
  }

  private _listen_graph = (): void => {
    this._unlisten_graph = this._graph.addEventListeners([
      makeCustomListener('compose', this._on_compose, false),
      makeCustomListener('transcend', this._on_transcend, false),
      makeCustomListener('enter_fullwindow', this._on_enter_fullwindow, false),
      makeCustomListener('leave_fullwindow', this._on_leave_fullwindow, false),
      makeCustomListener('zoom', this._on_zoom),
    ])
  }

  private _listen_transcend = (): void => {
    this._unlisten_transcend = this._transcend.addEventListener(
      makeClickListener({
        onLongPress: this._on_transcend_long_press,
        onLongClickCancel: this._on_transcend_long_click_cancel,
        onLongClick: this._on_transcend_long_click,
      })
    )
  }

  private _reset_frame = (): void => {
    // console.log('Graph', 'reset_component')
    let { frame } = this.$props

    if (frame) {
      frame.$component({}, (_frame) => {
        this._frame = _frame
        this._frame_out = true

        this._graph.setProp('frame', this._frame)
        this._graph.setProp('frameOut', this._frame_out)
      })
    } else {
      this._frame = this._fallback_frame
      this._frame_out = false

      this._graph.setProp('frame', this._frame)
      this._graph.setProp('frameOut', this._frame_out)
    }
  }

  private _on_transcend_long_press = (event: IOPointerEvent): void => {
    const {
      $method: { showLongPress },
    } = this.$system

    showLongPress(event, {})
  }

  private _on_transcend_long_click = () => {
    // console.log('Graph', '_on_transcend_long_click')
    setTimeout(() => {
      this._on_transcend()
    }, 0)
  }

  private _on_transcend_long_click_cancel = () => {
    //
  }

  private _context_unlisten: Unlisten

  public onMount(): void {
    // console.log('Graph', 'onMount')
    this._context_unlisten = addListeners(this.$context, [
      makeCustomListener('enabled', this._on_context_enabled),
      makeCustomListener('disabled', this._on_context_disabled),
    ])

    this._refresh_pod()
  }

  public onUnmount(): void {
    // console.log('Graph', 'onUnmount')
    this._context_unlisten()
  }

  private _on_context_enabled = (): void => {
    // console.log('Graph', '_on_context_enabled')
    this._refresh_pod()
  }

  private _on_context_disabled = (): void => {
    // console.log('Graph', '_on_context_disabled')
    this._refresh_pod()
  }

  private _refresh_pod = () => {
    const { disabled } = this.$props
    if (this._pod === this._fallback_pod) {
      if (disabled === undefined) {
        if (this.$context) {
          const { $disabled } = this.$context
          if ($disabled) {
            this._pod.$pause({})
          } else {
            this._pod.$play({})
          }
        } else {
          this._pod.$pause({})
        }
      } else if (disabled) {
        this._pod.$pause({})
      } else {
        this._pod.$play({})
      }
    }
  }

  private _on_compose = () => {
    const id = newSpecId()

    const spec = this._graph.getSpec()

    spec.name = 'new'

    // AD HOC
    // force update complexity
    delete spec.metadata?.complexity

    setSpec(id, spec)

    const parent_unit_id = randomId()

    this._pod = this._pod.$transcend({
      id,
      unitId: parent_unit_id,
      _: ['$U', '$C', '$G'],
    })

    const parent_unit: GraphUnitSpec = {
      path: id,
      metadata: {},
    }

    if (isComponentSpec(spec.component)) {
      const { width, height } = this._graph.getMaxComponentSpecSizeSize()
      parent_unit.metadata.component = {
        width,
        height,
      }

      this._pod.$setMetadata({
        path: ['units', parent_unit_id, 'metadata', 'component'],
        data: { width, height },
      })

      const { width: defaultWidth, height: defaultHeight } =
        this._graph.getMaxComponentLayoutSize()

      this._pod.$setMetadata({
        path: ['component'],
        data: { defaultWidth, defaultHeight },
      })
    }

    this._graph.setProp('disabled', true)

    this._fallback_pod = this._pod

    this._component.compose()

    const component = parentComponent({})
    component.$subComponent = {
      [parent_unit_id]: this._component,
    }
    component.pushRoot(this._component)
    this._component = component

    this._unlisten_graph()

    this._root.unregisterParentRoot(this._background)
    this._root.unregisterParentRoot(this._graph)

    const graph = new _GraphComponent({
      pod: this._pod,
      frame: this._frame,
      frameOut: this._frame_out,
      component,
    })
    graph.enter()

    this._graph.setProp('parent', graph)

    graph.cacheSubgraph(parent_unit_id, this._graph)

    this._graph = graph

    this._listen_graph()

    this.$subComponent.graph = graph

    this._root.unshiftParentRoot(this._graph, 'default')
    this._root.prependParentRoot(this._graph, 'default')

    this._root.unshiftParentRoot(this._background, 'default')
    this._root.prependParentRoot(this._background, 'default')

    this._refresh_pod()

    graph.focus()
  }

  // TODO
  private _on_transcend = (): void => {
    // console.log('Graph', '_on_transcend')

    const { $width, $height } = this.$context

    const id = newSpecId()

    const unit_id = 'untitled'

    const unit_graph_id = 'graph'

    // TODO bulk

    const fullwindow = this._graph.isFullwindow()

    const next_pod = this._pod.$transcend({
      id,
      unitId: unit_id,
      _: ['$U', '$C', '$G'],
    })

    next_pod.$addUnit({
      id: unit_graph_id,
      unit: {
        path: 'e80c912e-7508-11ea-966b-436805345ff0',
        state: {
          fullwindow,
          // zoom: { k: 1, x: -$width / 2, y: -$height / 2 },
        },
      },
    })

    next_pod.$moveUnit({
      id: unit_id,
      unitId: unit_graph_id,
      inputId: 'pod',
    })

    // const Parent = parentClass()
    // const component = new Parent({})
    // this._component = component

    // if (fullwindow) {
    //   this._graph.leaveFullwindow(false)
    // }

    // this._graph.setProp('component', this._component)

    // this._graph.setProp('pod', this._pod)

    // this._graph.enterFullwindow(false)

    // this._graph.leaveFullwindow(true)

    // this._graph.select_node('graph')

    // this._graph.unlock_sub_component('graph')

    // setTimeout(() => {
    // }, 0)

    const spec = emptySpec()

    const GRAPH_WIDTH = 300
    const GRAPH_HEIGHT = 300
    const PADDING = 60

    let max_width = Number.MIN_SAFE_INTEGER
    let max_height = Number.MIN_SAFE_INTEGER

    const nodes = this._graph.get_nodes()

    for (const node_id in nodes) {
      const node = nodes[node_id]
      const { width, height } = node
      max_width = Math.max(max_width, width)
      max_height = Math.max(max_height, height)
    }

    const _width = clamp(max_width, GRAPH_WIDTH - PADDING, $width)
    const _height = clamp(max_height, GRAPH_HEIGHT - PADDING, $height)

    const width = _width + PADDING
    const height = _height + PADDING

    spec.units = spec.units || {}
    spec.units[unit_graph_id] = {
      path: GRAPH_SPEC_ID,
      input: {
        disabled: {
          data: false,
        },
      },
      metadata: {
        component: {
          width,
          height,
        },
      },
    }
    spec.component = {
      subComponents: {
        [unit_graph_id]: {},
      },
      children: [unit_graph_id],
    }

    this._unlisten_graph()
    this._unlisten_transcend()

    this.unregisterRoot(this._root)

    this._root.unregisterParentRoot(this._transcend)
    this._root.unregisterParentRoot(this._fallback_frame)
    this._root.unregisterParentRoot(this._graph)
    this._root.unregisterParentRoot(this._background)

    let graph_slot = this._graph.$slot['default']
    let graph_slot_element = graph_slot.$element as HTMLElement
    // const graph_slot_children = []
    // while (graph_slot_element.firstChild) {
    //   graph_slot_children.unshift(graph_slot_element.lastChild)
    //   graph_slot_element.removeChild(graph_slot_element.lastChild)
    // }

    let background_slot = this._background.$slot['default']
    let background_slot_element = background_slot.$element as HTMLElement
    const background_slot_children = []
    while (background_slot_element.firstChild) {
      background_slot_children.unshift(background_slot_element.lastChild)
      background_slot_element.removeChild(background_slot_element.lastChild)
    }

    const unit_graph = new GraphComponent({
      graph: this._graph,
      fallback: this._fallback_frame,
      transcend: this._transcend,
      background: this._background,
      root: this._root,
      component: this._component,
      // pod: this._pod,
    })

    const transcend = new Transcend()
    this._transcend = transcend
    this._listen_transcend()
    this.$ref['transcend'] = transcend

    const fallback_frame = this._create_fallback_frame()
    this._fallback_frame = fallback_frame

    const Parent = parentClass()
    const component = new Parent({})
    component.$subComponent = {
      [unit_graph_id]: unit_graph,
    }
    component.pushRoot(unit_graph)
    this._component = component

    this._pod = next_pod

    const graph = new _GraphComponent({
      pod: this._pod,
      component: this._component,
      frame: this._fallback_frame,
      // fullwindow: true,
    })
    graph.enter()
    this._graph = graph
    this._listen_graph()

    this._reset_frame()

    const background = new Div({
      style: {
        className: 'graph-background',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
      },
    })
    this._background = background

    const root = new Frame({
      className: 'graph-root',
      style: {
        // position: 'absolute',
        position: 'relative',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      },
    })
    this._root = root

    graph_slot = this._graph.$slot['default']
    graph_slot_element = graph_slot.$element as HTMLElement

    background_slot = this._background.$slot['default']
    background_slot_element = background_slot.$element

    this.$slot = {
      default: graph_slot,
      '1': background_slot,
    }

    // for (const child of graph_slot_children) {
    //   graph_slot_element.appendChild(child)
    // }

    for (const child of background_slot_children) {
      background_slot_element.appendChild(child)
    }

    this.$subComponent = {
      background,
      root,
      graph,
      frame: this._fallback_frame,
      transcend,
    }

    this._root.registerParentRoot(this._background)
    this._root.registerParentRoot(this._graph)
    this._root.registerParentRoot(this._fallback_frame)
    this._root.registerParentRoot(this._transcend)

    this.registerRoot(this._root)

    this._graph.enterFullwindow(false)

    this._graph.leaveFullwindow(true)

    this._graph.temp_fixate_node(unit_graph_id, 100)

    this._graph.select_node('graph')

    this._graph.unlock_sub_component('graph')

    unit_graph.focus()
  }

  private _on_enter_fullwindow = () => {
    // console.log('Graph', '_on_enter_fullwindow')
    this.set('fullwindow', true)
  }

  private _on_leave_fullwindow = () => {
    // console.log('Graph', '_on_leave_fullwindow')
    this.set('fullwindow', false)
  }

  private _on_zoom = (zoom) => {
    // console.log('Graph', '_on_zoom')
    this.set('zoom', zoom)
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('Graph', name, current)
    if (prop === 'style') {
      this._root.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    } else if (prop === 'disabled') {
      this._refresh_pod()
    } else if (prop === 'pod') {
      const { pod } = this.$props
      this._pod = pod || this._fallback_pod
      this._graph.setProp('pod', this._pod)
    } else if (prop === 'frame') {
      this._reset_frame()
    } else if (prop === 'fullwindow') {
      this._graph.setProp('fullwindow', current)
    } else if (prop === 'zoom') {
      this._graph.setProp('zoom', current)
    }
  }
}

const MAX_DEBUG_BUFFER_SIZE: number = 1000

export type LayoutLayer = {
  layer: Div
  height: Div
  children: Div
  layers: Div
}

export type LayoutNode = {
  x: number
  y: number
  width: number
  height: number
  k: number
}

export class _GraphComponent extends Element<HTMLDivElement, _Props> {
  private _spec: GraphSpec = emptyGraphSpec

  private _disabled: boolean = true

  private _focused: boolean = false

  private _graph: Div
  private _main: Div
  private _subgraph: Div

  private _unlisten_minimap: Unlisten | undefined = undefined
  private _minimap_screen: SVGRect
  private _minimap_pointer_down: boolean = false

  private _subgraph_cache: Dict<_GraphComponent> = {}
  private _subgraph_graph: _GraphComponent | null = null
  private _subgraph_unit_id: string | null = null
  private _subgraph_depth: number = 0
  private _subgraph_unlisten: Unlisten

  private _is_fullwindow: boolean = false
  private _is_all_fullwindow: boolean = false

  private _zoom: Zoom = zoomIdentity
  private _touch_zoom_position_start = {
    x: 0,
    y: 0,
  }
  private _zoom_timeout: NodeJS.Timer | null = null
  private _touch_zoom_position = { x: 0, y: 0 }
  private _touch_zoom_d: number
  private _zooming = false
  private _translating: boolean = false

  private _unit_datum: {
    input: Dict<string>
    output: Dict<string>
  } = {
    input: {},
    output: {},
  }

  private _layout_comp: Div

  private _layout_root: LayoutLayer

  private _layout_layer: Dict<LayoutLayer> = {}

  private _layout_scroll_animation: number

  private _layout_core: Dict<Div> = {}

  private _zoom_comp: ZoomComponent
  private _zoom_comp_alt: ZoomComponent

  private _node_comp: Dict<Div> = {}
  private _node_content: Dict<Div> = {}
  private _node_selection: Dict<Selection> = {}

  private _link_comp: Dict<SVGG> = {}
  private _link_base: Dict<SVGPath> = {}
  private _link_base_area: Dict<SVGPath> = {}
  private _link_text: Dict<SVGText> = {}
  private _link_text_value: Dict<string> = {}
  private _link_text_path: Dict<SVGTextPath> = {}
  private _link_marker_end: Dict<SVGPath> = {}
  private _link_marker_start: Dict<SVGPath> = {}

  private _core: Dict<Div> = {}
  private _core_content: Dict<Div> = {}
  private _core_area: Dict<Div> = {}
  private _core_icon: Dict<Icon> = {}
  private _core_name: Dict<Div> = {}
  private _core_description: Dict<Div> = {}

  private _edit_node_name_id: string | null = null

  private _core_component_overlay: Dict<Div> = {}
  private _core_component_resize: Dict<Resize> = {}
  private _layout_core_children_counter: Dict<Div> = {}
  private _core_component_frame: Dict<Frame> = {}
  private _core_component_self: Dict<Div> = {}

  private _core_component_max_width: number[] = []
  private _core_component_max_height: number[] = []
  private _core_component_max_width_id: string[] = []
  private _core_component_max_height_id: string[] = []
  private _layout_core_unlisten: Dict<Unlisten> = {}
  private _core_component_context: Dict<Context> = {}
  private _core_component_unlocked: Dict<boolean> = {}
  private _core_component_unlocked_count: number = 0

  private _pin: Dict<Div> = {}
  private _pin_name: Dict<TextInput> = {}

  private _pin_link_start_marker: Dict<SVGPath> = {}
  private _pin_link_end_marker: Dict<SVGPath> = {}

  private _link_pin_constant_count: number = 0
  private _link_pin_memory_count: number = 0

  private _exposed_pin_set_count: number = 0

  private _exposed_pin_plugged_count = 0
  private _exposed_pin_unplugged_count = 0

  private _exposed_link_start_marker: Dict<SVGPath> = {}
  private _exposed_link_end_marker: Dict<SVGPath> = {}
  private _exposed_int_plugged: Dict<string> = {}
  private _exposed_ext_plugged: Dict<string> = {}
  private _exposed_ext_unplugged: Dict<boolean> = {}
  private _exposed_int_unplugged: Dict<boolean> = {}

  private _merge: Dict<Div> = {}
  private _merge_input: Dict<Div> = {}
  private _merge_output: Dict<Div> = {}

  private _datum_container: Dict<Div> = {}
  private _datum_area: Dict<Div> = {}
  private _datum: Dict<Datum> = {}
  private _datum_overlay: Dict<Div> = {}
  private _datum_unlisten: Dict<Unlisten> = {}

  private _err_comp: Dict<Div> = {}
  private _err_area: Dict<Div> = {}
  private _err_overlay: Dict<Div> = {}

  private _edit_datum_id: string | null = null
  private _edit_datum_node_id: string | null = null
  private _edit_datum_path: number[] | null = null
  private _edit_datum_commited: boolean = false

  private _type_container: Dict<Div> = {}
  private _type: Dict<DataTree> = {}

  private _node_unlisten: Dict<Unlisten> = {}
  private _link_unlisten: Dict<Unlisten> = {}

  private _node: GraphSimNodes = {}
  private _node_fixed: Dict<boolean> = {}
  private _node_draggable: Dict<boolean> = {}

  private _link_force_count_k: Dict<number> = {}

  private _node_type: Dict<string> = {}
  private _link_type: Dict<string> = {}

  private _selection_opt: Dict<SelectionOpt> = {}

  private _link: GraphSimLinks = {}
  private _pin_link: GraphSimLinks = {}
  private _exposed_link: GraphSimLinks = {}
  private _data_link: GraphSimLinks = {}
  private _type_link: GraphSimLinks = {}
  private _collapse_link: GraphSimLinks = {}
  private _search_link: GraphSimLinks = {}
  private _ignored_link: GraphSimLinks = {}
  private _visible_data_link: GraphSimLinks = {}
  private _err_link: GraphSimLinks = {}

  private _unit_node: GraphSimNodes = {}
  private _pin_node: GraphSimNodes = {}
  private _normal_node: GraphSimNodes = {}
  private _data_node: GraphSimNodes = {}
  private _err_node: GraphSimNodes = {}
  private _type_node: GraphSimNodes = {}
  private _collapse_node: GraphSimNodes = {}
  private _search_node: GraphSimNodes = {}
  private _ignored_node: GraphSimNodes = {}
  private _exposed_node: GraphSimNodes = {}
  private _exposed_ext_node: GraphSimNodes = {}
  private _exposed_int_node: GraphSimNodes = {}
  private _visible_data_node: GraphSimNodes = {}
  private _hidden_data_node: GraphSimNodes = {}
  private _linked_data_node: GraphSimNodes = {}
  private _visible_linked_data_node: GraphSimNodes = {}
  private _visible_unlinked_data_node: GraphSimNodes = {}
  private _unlinked_data_node: GraphSimNodes = {} // TODO

  private _layer_node: GraphSimNodes[] = []
  private _layer_link: GraphSimLinks[] = []

  private _err: Dict<string> = {}

  private _unit_to_unit: Dict<number> = {}

  private _unit_count: number = 0

  private _unit_component_count: number = 0

  private _unit_active_pin_count: Dict<number> = {}

  private _component_nodes: GraphSimNodes = {}

  private _pressed_node_pointer_count: number = 0
  private _node_pressed_count: Dict<number> = {}
  private _pressed_node_count: number = 0
  private _pressed_node_id_pointer_id: Dict<Dict<boolean>> = {}
  private _pointer_id_pressed_node_id: Dict<string> = {}
  private _pointer_id_hover_link_id: Dict<string> = {}

  private _link_id_hover_pointer_id: Dict<number> = {}

  private _drag_count: number = 0
  private _drag_node_id: Dict<boolean> = {}
  private _drag_node_pointer_id: Dict<number> = {}

  private _static: boolean = false
  private _static_position: Dict<Position> = {}
  private _static_count: Dict<number> = {}
  private _static_subgraph_anchor: Dict<Dict<boolean>> = {}
  private _static_subgraph_anchor_count: Dict<number> = {}

  private _hover_node_count: number = 0
  private _hover_node_pointer_count: Dict<number> = {}
  private _hover_node_id: Dict<boolean> = {}
  private _hover_node_id_pointer_id: Dict<Dict<boolean>> = {}

  private _pointer_id_hover_node_id: Dict<string> = {}

  private _selected_node_count: number = 0
  private _selected_node_id: Dict<boolean> = {}

  private _selected_component_count: number = 0
  private _selected_component: Dict<boolean> = {}

  private _compatible_node_id: Dict<boolean> = {}

  private _resize_node_id_pointer_id: Dict<number> = {}
  private _resize_pointer_id_node_id: Dict<string> = {}

  private _fullwindow_component_set: Set<string> = new Set()
  private _fullwindow_component_ids: string[] = []

  private _datum_tree: Dict<TreeNode> = {}

  private _datum_to_pin: Dict<string> = {}
  private _pin_to_datum: Dict<string> = {}

  private _pin_datum_tree: Dict<TreeNode> = {}

  private _pin_to_internal: Dict<string> = {}

  private _pin_to_merge: Dict<string> = {}
  private _merge_to_pin: Dict<Dict<boolean>> = {}
  private _merge_to_input: Dict<Dict<boolean>> = {}
  private _merge_to_output: Dict<Dict<boolean>> = {}

  private _merge_pin_count: Dict<number> = {}
  private _merge_output_count: Dict<number> = {}
  private _merge_active_output_count: Dict<number> = {}
  private _merge_input_count: Dict<number> = {}
  private _merge_active_input_count: Dict<number> = {}
  private _merge_ref: Dict<boolean> = {}

  private _merge_to_ref_unit: Dict<string> = {}
  private _ref_unit_to_merge: Dict<string> = {}

  // TODO
  // check lifecycle
  private _merge_to_ref_output: Dict<string> = {}
  private _ref_output_to_merge: Dict<string> = {}
  private _ref_output_pin_icon: Dict<Icon> = {}

  private _node_graph: G = {}

  private _node_to_subgraph: Dict<string> = {}
  private _subgraph_to_node: Dict<Set<string>> = {}

  private _node_layer: Dict<number> = {}
  private _link_layer: Dict<number> = {}

  private _layout_node: Dict<LayoutNode> = {}
  private _layout_target_node: Dict<LayoutNode> = {}
  private _layout_animation: Dict<number> = {}
  private _layout_path: string[] = []
  private _layout_component_count: Dict<number> = {}
  private _sub_component_parent: Dict<string> = {}

  private _layout_dragging: boolean = false
  private _layout_drag_node_count: number = 0
  private _layout_drag_node: Dict<boolean> = {}
  private _layout_drag_index: Dict<number> = {}
  private _layout_drag_direction: Dict<undefined | 'up' | 'down'> = {}
  private _layout_drag_start_scroll_top: Dict<number> = {}
  private _layout_drag_start_scroll_height: Dict<number> = {}
  private _layout_drag_swap: Dict<string> = {}
  private _layout_drag_swap_index: Dict<number> = {}
  private _layout_drag_start_children: Dict<string[]> = {}
  private _layout_drag_start_position: Dict<Position> = {}
  private _layout_drag_init_position: Dict<Position> = {}

  private _pointer_down: Dict<boolean> = {}
  private _pointer_down_position: Dict<Position> = {}
  private _pointer_down_count: number = 0
  private _pointer_position: Dict<Position> = {}
  private _pointer_down_move_count: Dict<number> = {}

  private _long_press_pointer: Set<number> = new Set()
  private _long_press_count: number = 0

  private _long_press_screen_position: Position = NULL_VECTOR

  private _long_press_background_pointer: Set<number> = new Set()
  private _long_press_background_count: number = 0

  private _long_press_collapsing: boolean = false
  private _long_press_collapse_pointer_id: number | null = null
  private _long_press_collapse_screen_position: Position = NULL_VECTOR
  private _long_press_collapse_world_position: Position = NULL_VECTOR
  private _long_press_collapse_frame: number
  private _long_press_collapse_unit_id: string | null = null
  private _long_press_collapse_remaining: number = 0

  // multiselect area

  private _multiselect_area_svg: SVGSVG
  private _multiselect_area_svg_rect: SVGRect
  private _multiselect_area_start_position: Position = {
    x: 0,
    y: 0,
  }
  private _multiselect_area_rect: {
    x0: number
    y0: number
    x1: number
    y1: number
  } = NOT_SELECTED_AREA
  private _multiselect_area_node: Dict<boolean> = {}
  private _multiselect_area_ing: boolean = false

  // simulation

  private _simulation: Simulation<{}, { type: string }>
  private _simulation_layer: number = 0
  private _simulation_end: boolean = false

  private _long_click_compose_timeout: NodeJS.Timer | null = null

  private _debug_interval: NodeJS.Timeout | null = null
  private _debug_buffer: Moment<any>[] = []
  private _debug_cursor: number = -1

  private _control_lock: boolean = false

  private _temp_control_lock: boolean = false
  private _temp_control_unlock: boolean = false

  private _search_lock: boolean = false
  private _search_hidden: boolean = true
  private _search_unit_id: string | null = null
  private _search_unit_graph_position: Position | null = null
  private _search_unit_component_size: Size | null = null
  private _search_unit_spec_id: string | null = null
  private _search_unit_merges: GraphMergesSpec = {}
  private _search_unit_ref_merge_id: string | null = null
  private _search_unit_ref_merge: GraphMergeSpec | null = null
  private _search_unit_input_count: number
  private _search_unit_output_count: number
  private _search_fallback_position: Position

  private _search_unit_merged_pin_ids: { input: string[]; output: string[] } = {
    input: [],
    output: [],
  }
  private _search_option_valid_pin_matches: Dict<{
    input: number[][][]
    output: number[][][]
  }> = {}

  private _search_unit_exposed_pin_ids: {
    input: Dict<[string, string]>
    output: Dict<[string, string]>
  } = { input: {}, output: {} }

  private _search_change_unit_spec_id: string | null = null

  private _search_unit_datum_id: string | null = null
  private _search_unit_datum_node_id: string | null = null
  private _search_unit_datum_spec_id: string

  // crud

  private _mode: Mode = 'none'
  private _mode_pointer: Dict<boolean> = {}

  // cancel

  private _cancel_click: boolean = false
  private _cancel_long_click: boolean = false
  private _cancel_double_click: boolean = false
  private _cancel_node_long_click: boolean = false

  // drawing

  private _capturing_gesture: boolean = false
  private _restart_gesture: boolean = false

  // err

  private _removing_err: boolean = false

  // layout

  private _tree_layout: boolean = false

  // dragging

  private _green_drag: boolean = false
  private _green_drag_node_id: string | null = null
  private _green_drag_clone_id: string | null = null

  private _yellow_drag: boolean = false
  private _yellow_drag_node_id: string | null = null
  private _yellow_drag_clone_id: string | null = null

  private _blue_drag: boolean = false
  private _blue_drag_init_id: string | null = null
  private _blue_drag_init_start_position: Dict<Position> = {}
  private _blue_drag_init_pin_to_anchor: Dict<string> = {}
  private _blue_drag_init_anchor_to_pin: Dict<string> = {}
  private _blue_drag_init_swap: Dict<string> = {}
  private _blue_drag_hover_id: string | null = null
  private _blue_drag_hover_position: Dict<Position> = {}
  private _blue_drag_hover_merge_anchor: Dict<string> = {}
  private _blue_drag_hover_swap: Dict<string> = {}

  private _animating_enter_fullwindow: Dict<boolean> = {}
  private _animating_leave_fullwindow: Dict<boolean> = {}

  private _abort_leave_fullwindow: Dict<
    () => {
      x: number
      y: number
      w: number
      h: number
    }
  > = {}

  private _abort_enter_fullwindow: Dict<
    () => {
      x: number
      y: number
      w: number
      h: number
    }
  > = {}

  private _refresh_theme = (): void => {
    const { $theme, $color } = this.$context
    // const { $color } = this.$context
    // const $theme = 'dark'

    const { style = {} } = this.$props

    let { color = $color } = style

    color = nameToColor(color) || color

    const data = $theme === 'dark' ? YELLOW : DARK_YELLOW
    const data_link = $theme === 'dark' ? LINK_YELLOW : DARK_LINK_YELLOW

    if (isHEX(color)) {
      const [, s, v] = HEXToHSV(color)
      let k: number = 1
      // color correction
      if ($theme === 'dark') {
        k = v / 100
      } else {
        k = (s / 100) * ((100 - v) / 100)
      }
      this._theme = {
        node: applyTheme($theme, color, 0),
        text: applyTheme($theme, color, 10 * k),
        selected: applyTheme($theme, color, 20 * k),
        pin_text: applyTheme($theme, color, 30 * k),
        type: applyTheme($theme, color, 30 * k),
        sub_text: applyTheme($theme, color, 40 * k),
        link: applyTheme($theme, color, 50 * k),
        hovered: applyTheme($theme, color, 60 * k),
        data,
        data_link,
      }
    } else {
      this._theme = {
        node: color,
        text: color,
        pin_text: color,
        selected: color,
        type: color,
        sub_text: color,
        link: color,
        hovered: color,
        data,
        data_link,
      }
    }
  }

  private _theme: {
    node: string
    text: string
    pin_text: string
    selected: string
    type: string
    sub_text: string
    link: string
    hovered: string
    data: string
    data_link: string
  } = {
    node: 'currentColor',
    text: 'currentColor',
    pin_text: 'currentColor',
    selected: 'currentColor',
    type: 'currentColor',
    sub_text: 'currentColor',
    link: 'currentColor',
    hovered: 'currentColor',
    data: 'currentColor',
    data_link: 'currentColor',
  }

  private _component: Component
  private _frame_out: boolean = false

  private _pod: $Graph

  // context

  private _x: number = 0
  private _y: number = 0
  private _sx: number = 1
  private _sy: number = 1
  private _width: number = 0
  private _height: number = 0

  constructor($props: _Props) {
    super({ ...defaultProps, ...$props })

    const {
      parent,
      style = {},
      component,
      frameOut,
      fullwindow,
      zoom,
      animate,
      pod,
      frame,
    } = this.$props as _Props & DefaultProps

    this._pod = pod

    this._component = component
    this._frame_out = frameOut

    this._zoom = zoom || zoomIdentity

    this._frame = frame

    const zoom_comp = new ZoomComponent({
      className: 'graph-zoom',
      style: {
        transition: ifLinearTransition(animate, 'opacity'),
      },
      width: 0,
      height: 0,
      zoom: this._zoom,
    })
    this._zoom_comp = zoom_comp

    const zoom_comp_alt = new ZoomComponent({
      className: 'graph-zoom-alt',
      style: {
        pointerEvents: 'none',
      },
      width: 0,
      height: 0,
      zoom: this._zoom,
    })
    this._zoom_comp_alt = zoom_comp_alt

    const area_select_rect = new SVGRect({
      className: 'graph-area-select-rect',
      style: {
        pointerEvents: 'none',
        fill: 'none',
        strokeDasharray: '6',
        strokeWidth: '1',
        stroke: this._theme.selected,
      },
    })
    this._multiselect_area_svg_rect = area_select_rect

    const area_select_svg = new SVGSVG({
      className: 'graph-area-select-svg',
      width: 0,
      height: 0,
      style: {
        display: 'none',
        width: '0',
        height: '0',
        position: 'absolute',
        top: '0',
      },
    })
    area_select_svg.appendChild(area_select_rect)
    this._multiselect_area_svg = area_select_svg

    this._simulation = new Simulation({
      alpha: 0.25,
      // alphaDecay: 0,
      // alphaDecay: 0.1,
      alphaDecay: 0.025,
      alphaTarget: 0,
      n: 6,
      // velocityDecay: 0.25,
      velocityDecay: 0.1,
      force: this._force,
    })
    this._simulation.nodes(this._node)
    this._simulation.links(this._link)
    this._simulation.addListener('tick', this._on_simulation_tick)
    this._simulation.addListener('end', this._on_simulation_end)

    // const layout_root_simulation = this._create_layout_simulation(
    //   this._layout_root_node
    // )
    // this._layout_root_simulation = layout_root_simulation

    const subgraph = new Div({
      className: 'graph-subgraph',
      style: {
        display: 'none',
      },
    })
    this._subgraph = subgraph

    const layout_root = this._create_layout_layer({
      className: 'graph-layout-root',
      style: {},
    })
    this._layout_root = layout_root

    const layout_comp = new Div({
      className: 'graph-layout',
      style: {
        pointerEvents: 'none',
      },
    })
    this._layout_comp = layout_comp
    layout_comp.registerParentRoot(layout_root.layer)

    const main = new Div({
      className: 'graph-main',
      style: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
      },
    })
    main.addEventListener(makePointerDownListener(this._on_pointer_down))
    main.addEventListener(makePointerMoveListener(this._on_pointer_move))
    main.addEventListener(makePointerUpListener(this._on_pointer_up))
    main.addEventListener(makePointerEnterListener(this._on_pointer_enter))
    main.addEventListener(makePointerLeaveListener(this._on_pointer_leave))
    main.addEventListener(makePointerCancelListener(this._on_pointer_cancel))
    main.addEventListener(
      makeClickListener({
        onClick: this._on_click,
        onDoubleClick: this._on_double_click,
        onLongClick: this._on_long_click,
        onLongPress: this._on_long_press,
        onLongClickCancel: this._on_long_click_cancel,
        onClickHold: this._on_click_hold,
      })
    )
    // prevent focus if "pointerdown" is on background
    const preventFocusListener = (event: Event): boolean => {
      const { target } = event
      // AD HOC
      if (
        target === this._zoom_comp._svg.$element ||
        (target instanceof Node && this._layout_comp.$element.contains(target))
      ) {
        event.preventDefault()
        return false
      }
    }
    main.$element.addEventListener('mousedown', preventFocusListener)
    main.$element.addEventListener('touchdown', preventFocusListener)
    // main.preventDefault('mousedown')
    // main.preventDefault('touchdown')
    main.$element.addEventListener('_dragdrop', (event: CustomEvent) => {
      const {
        detail: { pointerId, clientX, clientY },
      } = event

      event.stopPropagation()

      const { $x, $y } = this.$context

      const spec = this.$system.$flag.__DRAG__AND__DROP__[pointerId]

      const position = this._screen_to_world(clientX, clientY)

      this.paste_spec(spec, { x: position.x - $x, y: position.y - $y })

      this.focus()
    })
    // @ts-ignore
    main.$element.__DROP__TARGET__ = true
    main.registerParentRoot(zoom_comp)
    main.registerParentRoot(zoom_comp_alt)
    main.registerParentRoot(layout_comp)
    main.registerParentRoot(area_select_svg)

    // main.$element.addEventListener('drop', (event: DragEvent) => {
    //   event.stopPropagation()
    //   const { dataTransfer } = event

    //   const processDrop = (type: string) => {
    //     if (type.startsWith('__unit__/__graph__')) {
    //       const data = dataTransfer.getData(type)
    //       if (data) {
    //         const { clientX, clientY } = event
    //         const position = this._screen_to_world(clientX, clientY)
    //         this._paste_text(data, position)
    //         this.focus()
    //       }
    //     }
    //   }

    //   if (dataTransfer) {
    //     if (isPhone) {
    //       // @ts-ignore
    //       const { _data } = dataTransfer
    //       for (const type in _data) {
    //         processDrop(type)
    //       }
    //     } else {
    //       let { items } = dataTransfer
    //       for (let i = 0; i < items.length; i++) {
    //         const item = items[i]
    //         const { type } = item
    //         processDrop(type)
    //       }
    //     }
    //   }
    // })
    main.$element.addEventListener('_dragenter', (event) => {
      // event.preventDefault()
    })
    main.$element.addEventListener('_dragover', (event) => {
      // event.preventDefault()
    })
    this._main = main

    const graph = new Div({
      className: 'graph',
      style: {
        ..._DEFAULT_STYLE,
        ...style,
      },
      tabIndex: -1,
    })
    graph.addEventListener(makeWheelListener(this._on_wheel))
    graph.addEventListener(makeFocusListener(this._on_focus))
    graph.addEventListener(makeBlurListener(this._on_blur))
    graph.registerParentRoot(subgraph)
    graph.registerParentRoot(main)
    this._graph = graph

    const $element = parentElement()

    this.$element = $element
    this.$slot = graph.$slot
    this.$subComponent = {
      graph,
      subgraph,
      main,
    }
    this.$unbundled = false

    this.registerRoot(graph)

    if (fullwindow) {
      this._enter_all_fullwindow(false)
    }
  }

  private _spec_refresh_node_position = (): void => {
    return this.__spec_refresh_node_position(this._spec)
  }

  private __spec_refresh_node_position = (spec: GraphSpec): void => {
    this._set_units_position(spec.units)
  }

  private _disable = (): void => {
    // console.log('Graph', '_disable', this._disabled)
    if (!this._disabled) {
      // console.log('Graph', '_disable')
      this._disabled = true

      if (this._subgraph_unit_id) {
        const sub_graph = this._subgraph_cache[this._subgraph_unit_id]
        sub_graph.setProp('disabled', true)
      } else {
        if (this._core_component_unlocked_count > 0) {
          for (const unit_id in this._core_component_unlocked) {
            this._disable_core_frame(unit_id)
          }
        } else {
          this._disable_input()

          this._disable_transcend()
        }
      }
    }
  }

  private _enable = (): void => {
    if (this._disabled) {
      // console.log('Graph', '_enable')
      this._disabled = false

      if (this._subgraph_unit_id) {
        const sub_graph = this._subgraph_cache[this._subgraph_unit_id]
        sub_graph.setProp('disabled', false)
      } else {
        if (this._core_component_unlocked_count > 0) {
          for (const unit_id in this._core_component_unlocked) {
            this._enable_core_frame(unit_id)
          }
        } else {
          if (
            !this._subgraph_unit_id &&
            (!this._is_fullwindow || this._frame_out)
          ) {
            if (this._control_lock) {
              this._enable_input()
            }
          }

          if (!this._subgraph_unit_id) {
            this._enable_transcend()
          }
        }
      }
    }
  }

  private _enable_minimap(): void {
    const { $width, $height } = this.$context

    if (this._minimap && !this._unlisten_minimap) {
      // console.log('Graph', '_enable_minimap')

      const wheel_listener = makeWheelListener(this._on_minimap_wheel)
      const pointer_down_listener = makePointerDownListener(
        this._on_minimap_pointer_down
      )
      const pointer_move_listener = makePointerMoveListener(
        this._on_minimap_pointer_move
      )
      const pointer_up_listener = makePointerUpListener(
        this._on_minimap_pointer_up
      )

      this._unlisten_minimap = this._minimap.addEventListeners([
        wheel_listener,
        pointer_down_listener,
        pointer_move_listener,
        pointer_up_listener,
      ])

      if (this._tree_layout) {
        this._set_minimap_to_layout()
      } else {
        this._set_minimap_to_graph()
      }

      const minimap_screen = new SVGRect({
        x: this._zoom.x,
        y: this._zoom.y,
        width: $width / this._zoom.k,
        height: $height / this._zoom.k,
        style: {
          display: this._unit_count > 0 ? 'block' : 'none',
          fill: 'none',
          stroke: this._theme.link,
        },
      })
      this._minimap_screen = minimap_screen

      this._minimap.setChildren([minimap_screen])

      this._refresh_minimap_color()

      this._tick_minimap()
    }
  }

  private _disable_minimap(): void {
    if (this._minimap && this._unlisten_minimap) {
      // console.log('Graph', '_disable_minimap')

      this._unlisten_minimap()
      this._unlisten_minimap = undefined

      this._minimap.setChildren([])

      this._tick_minimap()
    }
  }

  private _init: boolean = false

  private _load: boolean = false

  private _context_unlisten: Unlisten

  onDestroy() {
    // console.log('Graph', 'onDestroy')
    if (this._subgraph_graph) {
      this._subgraph_graph.destroy()
    }
    this._disable()
    this._stop_debugger()
    this._clear_debugger()
    this._stop_graph_simulation()
    this._plunk_pod(this._pod)
  }

  onMount() {
    // console.log('Graph', 'onMount')
    const { $x, $y, $sx, $sy, $width, $height, $disabled } = this.$context

    const { parent, fullwindow, frame } = this.$props

    this._disable_control_lock()

    this._control = findRef(this, 'control') as GUI | null

    this._enable_control_lock()

    if (this._control) {
      if (!this._disabled) {
        if (this._is_fullwindow) {
          this._control.show()
        } else {
          this._control.hide()
        }
      }
    }

    this._search = findRef(this, 'search') as Search | null
    this._minimap = findRef(this, 'minimap') as Minimap | null
    this._modes = findRef(this, 'modes') as Modes | null

    const transcend = findRef(this, 'transcend') as Transcend | null
    if (this._transcend) {
      this._disable_transcend()
    }

    this._transcend = transcend

    if (this._transcend) {
      if (this._enabled()) {
        if (!this._subgraph_unit_id) {
          this._enable_transcend()
        }
      }
    }

    this._context_unlisten = addListeners(this.$context, [
      makeResizeListener(this._on_context_resize),
      makeCustomListener('enabled', this._on_context_enabled),
      makeCustomListener('disabled', this._on_context_disabled),
      makeCustomListener('themechanged', this._on_context_theme_changed),
      makeCustomListener('colorchanged', this._on_context_color_changed),
    ])

    if (!this._init) {
      if ($width !== 0 && $height !== 0) {
        this._resize($width, $height)

        this._width = $width
        this._height = $height
      }
    }

    if (!parent) {
      if (this._transcend) {
        if ($disabled) {
          this._transcend.hide(this._init)
        } else {
          this._transcend.show(this._init)
        }
      }
    }

    if (!this._init) {
      this._init = true
      this._reset_spec()
    }

    this._refresh_theme()
    this._refresh_color()
    this._refresh_enabled()

    this._start_graph_simulation(LAYER_NORMAL)
  }

  public onUnmount(): void {
    // console.log('Graph', 'onUnmount')
    this._context_unlisten()

    this._disable()

    this._stop_graph_simulation()

    this._control = null
    this._search = null
    this._minimap = null
    this._modes = null
    this._transcend = null
  }

  private _get_specs(): Specs {
    return globalThis.__specs
  }

  private _get_components(): ComponentSpecs {
    return globalThis.__components
  }

  public get_subraph_depth = (): number => {
    return this._subgraph_depth
  }

  public get_units = (): UnitsSpec => {
    const { units } = this._spec
    return units || {}
  }

  private _get_unit = (id: string): GraphUnitSpec => {
    const units = this.get_units()
    return units[id]
  }

  private _get_unit_spec_id = (id: string): string => {
    const unit = this._get_unit(id)
    const { path } = unit
    return path
  }

  private _get_unit_spec_name = (unit_id: string): string => {
    const id = this._get_unit_spec_id(unit_id)
    const spec = getSpec(id)
    const { name = '' } = spec
    return name
  }

  private _get_unit_name = (unit_id: string): string => {
    const spec_name = this._get_unit_spec_name(unit_id)
    const metadata = this._get_unit_metadata(unit_id)
    const { rename } = metadata
    return rename || spec_name
  }

  private _get_merges = (): GraphMergesSpec => {
    const { merges } = this._spec
    return merges || {}
  }

  private _get_inputs = (): GraphExposedPinsSpec => {
    const { inputs = {} } = this._spec
    return inputs
  }

  private _get_outputs = (): GraphExposedPinsSpec => {
    const { outputs = {} } = this._spec
    return outputs
  }

  private _get_merge = (merge_node_id: string): GraphMergeSpec => {
    const { id } = segmentMergeNodeId(merge_node_id)
    return this.__get_merge(id)
  }

  private __get_merge = (merge_id: string): GraphMergeSpec => {
    const merges = this._get_merges()
    return merges[merge_id]
  }

  private _get_merge_by_node_id = (merge_node_id: string): GraphMergeSpec => {
    const { id } = segmentMergeNodeId(merge_node_id)
    const merge = this.__get_merge(id)
    return merge
  }

  // TODO
  // _unit_to_merge
  private _get_unit_merges = (unit_id: string): GraphMergesSpec => {
    const merges = this._get_merges()
    const unit_merges: GraphMergesSpec = {}
    for (const merge_id in merges) {
      const merge = merges[merge_id]
      if (merge[unit_id]) {
        unit_merges[merge_id] = merge
      }
    }
    return unit_merges
  }

  private _get_graph_unit_pin_spec = (
    unit_id: string,
    type: 'input' | 'output',
    pin_id: string
  ): GraphUnitPinSpec => {
    const unit = this._get_unit(unit_id)
    return (!!unit[type] && unit[type]![pin_id]) || {}
  }

  private _get_unit_pin_spec = (pin_node_id: string): PinSpec => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    const pin_spec = this.__get_unit_pin_spec(unitId, type, pinId)
    return pin_spec
  }

  private __get_unit_pin_spec = (
    unit_id: string,
    type: 'input' | 'output',
    pin_id: string
  ): PinSpec => {
    let spec: Spec
    if (unit_id === this._search_unit_id) {
      spec = getSpec(this._search_unit_spec_id!)
    } else {
      spec = this._get_unit_spec(unit_id)
    }
    if (type === 'output') {
      if (pin_id === SELF) {
        return {
          name: SELF,
          type: 'any',
          ref: true,
        }
      }
    }
    const pin_spec: PinSpec = spec[`${type}s`][pin_id]
    return pin_spec
  }

  private _get_unit_path = (unit_id: string): string => {
    const unit = this._get_unit(unit_id)
    const { path } = unit
    return path
  }

  private _get_unit_spec = (unit_id: string): Spec => {
    const path = this._get_unit_path(unit_id)
    const spec = getSpec(path)
    return spec
  }

  private _pod_get_unit_state = (
    unit_id: string,
    callback: (state: State) => void
  ): void => {
    return this._pod.$getUnitState({ unitId: unit_id }, callback)
  }

  private _pod_get_graph_state = (
    callback: (state: GraphState) => void
  ): void => {
    return this._pod.$getGraphState({}, callback)
  }

  private _get_unit_component_spec = (unit_id: string): ComponentSpec => {
    const path = this._get_unit_path(unit_id)
    const component = getComponentSpec(path)
    return component
  }

  private _get_exposed_pin_spec = (
    type: 'input' | 'output',
    pin_id: string
  ): GraphExposedPinSpec => {
    return (this._spec[`${type}s`] || {})[pin_id]
  }

  private _has_exposed_pin_named = (
    type: 'input' | 'output',
    pin_id: string
  ): boolean => {
    return !!(this._spec[`${type}s`] || {})[pin_id]
  }

  private _has_exposed_input_named = (pin_id: string): boolean => {
    return this._has_exposed_pin_named('input', pin_id)
  }

  private _has_exposed_output_named = (pin_id: string): boolean => {
    return this._has_exposed_pin_named('output', pin_id)
  }

  private _get_exposed_sub_pin_spec = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string
  ): GraphExposedSubPinSpec => {
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    const sub_pin = pin[sub_pin_id]
    return sub_pin
  }

  private _get_pin_exposed_id = (
    type: 'input' | 'output',
    pin_node_id: string
  ): { pinId: string; subPinId: string } | { pinId: null; subPinId: null } => {
    const pinSpecs = this._spec[`${type}s`]
    for (let pinId in pinSpecs) {
      const pinSpec = pinSpecs[pinId]
      const { pin } = pinSpec
      for (let subPinId in pin) {
        const subPinSpec = pin[subPinId]
        const { unitId, pinId: _pinId, mergeId } = subPinSpec
        if (this._is_merge_node_id(pin_node_id)) {
          const { id: pinMergeId } = segmentMergeNodeId(pin_node_id)
          if (pinMergeId === mergeId) {
            return { pinId, subPinId }
          }
        } else {
          const { unitId: pinUnitId, pinId: pinPinId } =
            segmentLinkPinNodeId(pin_node_id)
          if (pinUnitId === unitId && pinPinId === _pinId) {
            return { pinId, subPinId }
          }
        }
      }
    }
    return { pinId: null, subPinId: null }
  }

  private _get_component_fallback_size = (): {
    width: number
    height: number
  } => {
    // AD HOC
    if (this.$context) {
      const { $height, $width } = this.$context
      return {
        width: $width / 9,
        height: $height / 9,
      }
    } else {
      return {
        width: 120,
        height: 120,
      }
    }
  }

  private _get_unit_base_component_spec = (unitId: string): ComponentSpec => {
    const components = this._get_components()
    const unit = this._get_unit(unitId)
    return components[unit.path] || {}
  }

  private _get_component_spec(): GraphComponentSpec {
    const { component = {} } = this._spec
    return component
  }

  private _get_unit_sub_component_spec = (
    unitId: string
  ): GraphSubComponentSpec | null => {
    const component = this._get_component_spec()
    return (
      (component &&
        component.subComponents &&
        component.subComponents[unitId]) ||
      null
    )
  }

  private _get_unit_metadata = (unit_id: string): GraphUnitMetadataSpec => {
    const unit = this._get_unit(unit_id)
    const { metadata = {} } = unit
    return metadata
  }

  private _get_unit_metadata_component = (
    unitId: string
  ): { width?: number; height?: number } => {
    const metadata = this._get_unit_metadata(unitId)
    const { component = {} } = metadata
    return component
  }

  private _get_unit_component_default_size = (unitId: string): Size => {
    const { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT } =
      this._get_component_fallback_size()
    const component = this._get_unit_component_spec(unitId)
    const width =
      (component && (component as BaseComponentSpec).defaultWidth) ||
      DEFAULT_WIDTH
    const height =
      (component && (component as BaseComponentSpec).defaultHeight) ||
      DEFAULT_HEIGHT
    return { width, height }
  }

  private _get_unit_component_layout_size = (unit_id: string): Size => {
    const { width: defaultWidth, height: defaultHeight } =
      this._get_unit_component_default_size(unit_id)
    const component_metadata = this._get_unit_metadata_component(unit_id)
    const sub_component = this._get_unit_sub_component_spec(unit_id) || {}
    const width =
      sub_component.width || component_metadata.width || defaultWidth
    const height =
      sub_component.height || component_metadata.height || defaultHeight
    return { width, height }
  }

  private _get_unit_component_graph_size = (unit_id: string): Size => {
    const { width: defaultWidth, height: defaultHeight } =
      this._get_unit_component_default_size(unit_id)
    const component_metadata = this._get_unit_metadata_component(unit_id)
    const width = component_metadata.width || defaultWidth
    const height = component_metadata.height || defaultHeight
    return { width, height }
  }

  private _get_node_anchor_node_id = (node_id: string): string => {
    if (this._is_pin_node_id(node_id)) {
      return this._get_pin_anchor_node_id(node_id)
    } else if (this._is_internal_pin_node_id(node_id)) {
      return this._get_internal_pin_anchor_node_id(node_id)
    } else {
      return node_id
    }
  }

  private _get_internal_pin_anchor_node_id(node_id: string): string {
    const { type, id, subPinId } = segmentInternalNodeId(node_id)
    return this._get_exposed_pin_internal_node_id(type, id, subPinId)
  }

  private _get_merge_anchor_node_id = (merge_node_id: string): string => {
    const merge_unit_id = this._merge_to_ref_unit[merge_node_id]
    const merge_ref_output_id = this._merge_to_ref_output[merge_node_id]
    if (merge_unit_id) {
      return merge_unit_id
    } else if (merge_ref_output_id) {
      return merge_ref_output_id
    } else {
      return merge_node_id
    }
  }

  private _get_pin_anchor_node_id = (pin_node_id: string): string => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      const pin_merge_node_id = this._pin_to_merge[pin_node_id]
      if (pin_merge_node_id) {
        return this._get_merge_anchor_node_id(pin_merge_node_id)
      } else {
        return pin_node_id
      }
    } else {
      return this._get_merge_anchor_node_id(pin_node_id)
    }
  }

  private _get_datum_pin_anchor_node_id = (
    datum_node_id: string
  ): string | null => {
    let anchor_node_id: string | null = null
    const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    if (datum_pin_node_id) {
      anchor_node_id = this._get_pin_anchor_node_id(datum_pin_node_id)
    }
    return anchor_node_id
  }

  private _is_input_merge = (merge_node_id: string): boolean => {
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    return this._merge_output_count[merge_id] === 0
  }

  private _is_output_merge = (merge_node_id: string): boolean => {
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    return this._merge_input_count[merge_id] === 0
  }

  private _is_link_pin_merged = (pin_node_id: string): boolean => {
    const merge_node_id = this._pin_to_merge[pin_node_id]
    const merged = !!merge_node_id
    return merged
  }

  private _link_pin_ignored: Dict<boolean> = {}

  private _is_link_pin_ignored = (pin_node_id: string): boolean => {
    if (this._link_pin_ignored[pin_node_id] !== undefined) {
      return this._link_pin_ignored[pin_node_id]
    }

    const {
      unitId: unit_id,
      type,
      pinId: pin_id,
    } = segmentLinkPinNodeId(pin_node_id)

    const pin_spec: PinSpec = this.__get_unit_pin_spec(unit_id, type, pin_id)

    const { defaultIgnored } = pin_spec

    const unit_pin_spec: GraphUnitPinSpec = this._get_graph_unit_pin_spec(
      unit_id,
      type,
      pin_id
    )
    const { ignored } = unit_pin_spec

    let pin_ignored: boolean = false
    if (typeof ignored === 'boolean') {
      pin_ignored = ignored
    } else if (defaultIgnored === true) {
      pin_ignored = true
    }

    this._link_pin_ignored[pin_node_id] = pin_ignored

    return pin_ignored
  }

  private _is_link_pin_ref = (pin_node_id: string): boolean => {
    const ref = this._get_link_pin_ref(pin_node_id)
    return !!ref
  }

  private _is_link_pin_init = (pin_node_id: string): boolean => {
    const init = this._get_link_pin_init(pin_node_id)
    return !!init
  }

  private _get_link_pin_init = (pin_node_id: string): string | undefined => {
    const pin_spec: PinSpec = this._get_unit_pin_spec(pin_node_id)
    const { init } = pin_spec
    return init
  }

  private _get_link_pin_ref = (pin_node_id: string): boolean | undefined => {
    const pin_spec: PinSpec = this._get_unit_pin_spec(pin_node_id)
    const { ref } = pin_spec
    return ref
  }

  private _is_merge_ref = (pin_node_id: string): boolean => {
    return this._merge_ref[pin_node_id]
  }

  private _is_pin_ref = (pin_node_id: string): boolean => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      return this._is_link_pin_ref(pin_node_id)
    } else if (this._is_merge_node_id(pin_node_id)) {
      return this._is_merge_ref(pin_node_id)
    } else {
      return false
    }
  }

  private _is_input_pin_ref = (pin_node_id: string): boolean => {
    return this._is_input_node_id(pin_node_id) && this._is_pin_ref(pin_node_id)
  }

  private _is_link_pin_constant = (pin_node_id: string): boolean => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    const unit_pin_spec = this._get_graph_unit_pin_spec(unitId, type, pinId)
    const { constant } = unit_pin_spec
    return !!constant
  }

  private _is_link_pin_memory = (pin_node_id: string): boolean => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    const unit_pin_spec = this._get_graph_unit_pin_spec(unitId, type, pinId)
    const { memory } = unit_pin_spec
    return !!memory
  }

  private _is_same_subgraph = (a_id: string, b_id: string): boolean => {
    const a_sg_id = this._node_to_subgraph[a_id]
    const b_sg_id = this._node_to_subgraph[b_id]
    return a_sg_id === b_sg_id
  }

  private _reset_spec = (): void => {
    this._load = false
    this._pod.$getSpec({}, (spec) => {
      this._spec = clone(spec)
      this._load = true
      if (this._init) {
        this._reset()
        this._setup_pod(this._pod)
      }
    })
  }

  private _reset() {
    const spec = this._spec

    // console.log('Graph', 'reset', spec)

    this._unit_datum = {
      input: {},
      output: {},
    }

    // this._cached_graph = {}

    this._layout_core = {}

    this._layout_layer = {}

    this._cancel_node_long_click = false

    this._layout_scroll_animation = undefined

    this._zoom_comp.removeChildren('default')
    this._zoom_comp.removeChildren('svg')

    this._layout_root.children.removeChildren('default')
    this._layout_root.layers.removeChildren('default')

    this._node_comp = {}
    this._node_content = {}
    this._node_selection = {}

    this._link_comp = {}
    this._link_base = {}
    this._link_base_area = {}
    this._link_text = {}
    this._link_text_value = {}
    this._link_text_path = {}
    this._link_marker_end = {}
    this._link_marker_start = {}

    this._node = {}
    this._node_fixed = {}
    this._node_draggable = {}

    this._node_type = {}
    this._link_type = {}

    this._selection_opt = {}

    this._link = {}
    this._pin_link = {}
    this._exposed_link = {}
    this._data_link = {}
    this._visible_data_link = {}
    this._type_link = {}
    this._collapse_link = {}
    this._search_link = {}
    this._ignored_link = {}
    this._err_link = {}

    this._unit_node = {}
    this._pin_node = {}
    this._normal_node = {}
    this._collapse_node = {}
    this._exposed_node = {}
    this._type_node = {}
    this._search_node = {}
    this._ignored_node = {}
    this._exposed_ext_node = {}
    this._exposed_int_node = {}
    this._visible_data_node = {}
    this._hidden_data_node = {}
    this._linked_data_node = {}
    this._unlinked_data_node = {}
    this._visible_linked_data_node = {}
    this._visible_unlinked_data_node = {}
    this._data_node = {}
    this._err_node = {}

    this._layer_node = []
    this._layer_node[0] = {}
    this._layer_node[LAYER_NORMAL] = this._normal_node
    this._layer_node[LAYER_COLLAPSE] = this._collapse_node
    this._layer_node[LAYER_SEARCH] = this._search_node
    this._layer_node[LAYER_IGNORED] = this._ignored_node
    this._layer_node[LAYER_EXPOSED] = this._exposed_node
    this._layer_node[LAYER_DATA_LINKED] = this._visible_linked_data_node
    this._layer_node[LAYER_DATA] = this._visible_unlinked_data_node
    this._layer_node[LAYER_ERR] = this._err_node
    this._layer_node[LAYER_TYPE] = this._type_node

    this._layer_link = []
    this._layer_link[0] = {}
    this._layer_link[LAYER_NORMAL] = this._pin_link
    this._layer_link[LAYER_COLLAPSE] = this._collapse_link
    this._layer_link[LAYER_SEARCH] = this._search_link
    this._layer_link[LAYER_IGNORED] = this._ignored_link
    this._layer_link[LAYER_EXPOSED] = this._exposed_link
    this._layer_link[LAYER_DATA_LINKED] = this._visible_data_link
    this._layer_link[LAYER_ERR] = this._err_link
    this._layer_link[LAYER_TYPE] = this._type_link

    this._err = {}

    this._unit_to_unit = {}

    this._unit_count = 0

    this._unit_component_count = 0

    this._unit_active_pin_count = {}

    this._component_nodes = {}

    this._pressed_node_pointer_count = 0
    this._node_pressed_count = {}
    this._pressed_node_count = 0
    this._pressed_node_id_pointer_id = {}
    this._pointer_id_pressed_node_id = {}
    this._pointer_id_hover_link_id = {}

    this._link_id_hover_pointer_id = {}

    this._drag_count = 0
    this._drag_node_id = {}
    this._drag_node_pointer_id = {}

    this._static = false
    this._static_position = {}
    this._static_count = {}
    this._static_subgraph_anchor = {}
    this._static_subgraph_anchor_count = {}

    this._hover_node_count = 0
    this._hover_node_pointer_count = {}
    this._hover_node_id = {}
    this._hover_node_id_pointer_id = {}

    this._pointer_id_hover_node_id = {}

    this._selected_node_count = 0
    this._selected_node_id = {}

    this._selected_component_count = 0
    this._selected_component = {}

    this._compatible_node_id = {}

    this._resize_node_id_pointer_id = {}
    this._resize_pointer_id_node_id = {}

    this._fullwindow_component_set = new Set()
    this._fullwindow_component_ids = []

    this._datum_tree = {}

    this._datum_to_pin = {}
    this._pin_to_datum = {}

    this._pin_datum_tree = {}

    this._pin_to_internal = {}

    this._pin_to_merge = {}
    this._merge_to_pin = {}
    this._merge_to_input = {}
    this._merge_to_output = {}

    this._merge_pin_count = {}
    this._merge_input_count = {}
    this._merge_output_count = {}
    this._merge_active_output_count = {}
    this._merge_active_input_count = {}
    this._merge_ref = {}

    this._merge_to_ref_unit = {}
    this._ref_unit_to_merge = {}

    this._merge_to_ref_output = {}
    this._ref_output_to_merge = {}

    this._ref_output_pin_icon = {}

    this._node_graph = {}

    this._node_to_subgraph = {}
    this._subgraph_to_node = {}

    this._node_layer = {}
    this._link_layer = {}

    this._layout_target_node = {}
    this._layout_path = []
    this._layout_component_count = {}
    this._sub_component_parent = {}

    this._layout_drag_node = {}
    this._layout_drag_index = {}
    this._layout_drag_direction = {}
    this._layout_drag_start_scroll_top = {}
    this._layout_drag_start_scroll_height = {}
    this._layout_drag_swap = {}
    this._layout_drag_swap_index = {}
    this._layout_drag_start_children = {}
    this._layout_drag_start_position = {}
    this._layout_drag_init_position = {}

    this._pointer_down = {}
    this._pointer_down_position = {}
    this._pointer_down_count = 0
    this._pointer_position = {}
    this._pointer_down_move_count = {}

    this._long_press_pointer = new Set()
    this._long_press_count = 0
    this._long_press_screen_position = NULL_VECTOR

    this._long_press_background_pointer = new Set()
    this._long_press_background_count = 0

    this._long_press_collapsing = false
    this._long_press_collapse_pointer_id = null
    this._long_press_collapse_world_position = NULL_VECTOR

    this._simulation.nodes(this._node)
    this._simulation.links(this._link)

    this._core = {}
    this._core_content = {}
    this._core_area = {}
    this._core_icon = {}
    this._core_name = {}
    this._core_description = {}

    this._core_component_overlay = {}
    this._core_component_resize = {}
    this._layout_core_children_counter = {}
    this._core_component_frame = {}
    this._core_component_self = {}

    this._core_component_max_width = []
    this._core_component_max_height = []
    this._core_component_max_width_id = []
    this._core_component_max_height_id = []
    this._layout_core_unlisten = {}
    this._core_component_context = {}
    this._core_component_unlocked = {}
    this._core_component_unlocked_count = 0

    this._pin = {}
    this._pin_name = {}

    this._pin_link_start_marker = {}
    this._pin_link_end_marker = {}

    this._link_pin_constant_count = 0
    this._link_pin_memory_count = 0

    this._exposed_pin_set_count = 0

    this._exposed_pin_plugged_count = 0
    this._exposed_pin_unplugged_count = 0

    this._exposed_link_start_marker = {}
    this._exposed_link_end_marker = {}
    this._exposed_int_plugged = {}
    this._exposed_ext_plugged = {}
    this._exposed_ext_unplugged = {}
    this._exposed_int_unplugged = {}

    this._merge = {}
    this._merge_input = {}
    this._merge_output = {}

    this._datum_container = {}
    this._datum_area = {}
    this._datum = {}
    this._datum_overlay = {}
    this._datum_unlisten = {}

    this._err_comp = {}
    this._err_area = {}
    this._err_overlay = {}

    this._edit_datum_id = null
    this._edit_datum_node_id = null
    this._edit_datum_path = null
    this._edit_datum_commited = false

    this._type_container = {}
    this._type = {}

    this._node_unlisten = {}
    this._link_unlisten = {}

    const {
      units = {},
      merges = {},
      data,
      inputs = {},
      outputs = {},
      metadata = {},
    } = spec

    this._simulation_prevent_restart = true

    for (let datum_id in data) {
      const datum_value = data[datum_id]
      const { x, y } = randomInRect(
        this._width / 4,
        this._height / 4,
        (3 * this._width) / 4,
        (3 * this._height) / 4
      )
      this._add_datum(datum_id, datum_value, {
        x,
        y,
      })
    }

    this._unit_to_unit = {}

    for (let unit_id in units) {
      const unit: GraphUnitSpec = units[unit_id]
      const { metadata = {} } = unit
      const { position } = metadata
      const p = this._jiggle_screen_center()
      if (position) {
        p.x += position.x
        p.y += position.y
      }
      this._sim_add_core(unit_id, unit, p)
      if (this._is_unit_component(unit_id)) {
        const layout_position = NULL_VECTOR

        const parent_id = this._get_sub_component_spec_parent_id(unit_id)

        this._sim_add_core_component(unit_id, parent_id, layout_position)

        this._mem_add_unit_component(unit_id)
        this._pod_add_unit_component(unit_id)

        if (this._is_fullwindow) {
          this._fullwindow_component_ids.push(unit_id)
          this._fullwindow_component_set.add(unit_id)
          if (this._in_component_control) {
            const frame = this._core_component_frame[unit_id]
            const core_content = this._core_content[unit_id]

            core_content.removeChild(frame)

            this._graph.appendChild(frame, 'default')

            this._couple_sub_component(unit_id)
          }
        } else {
          if (this._in_component_control) {
            if (this._subgraph_unit_id !== unit_id) {
              this._enter_sub_component_frame(unit_id)
            }
          }
        }
      }
      const unit_pin_position = this._get_spec_init_unit_pin_position(
        spec,
        unit_id
      )
      this._sim_add_unit_pins(unit_id, unit, unit_pin_position)
    }

    for (let merge_id in merges) {
      const merge: GraphMergeSpec = merges[merge_id]
      const p = this._jiggle_screen_center()
      const { position: metadata_position = {} } = metadata
      const { merge: merge_position = {} } = metadata_position
      const position = merge_position[merge_id]
      if (position) {
        p.x += position.x
        p.y += position.y
      }
      this._sim_add_merge(merge_id, merge, p)
      this._sim_collapse_merge(merge_id)
    }

    for (let inputId in inputs) {
      const pinSpec = inputs[inputId]
      this._sim_add_exposed_pin_set('input', inputId, pinSpec)
    }

    for (let outputId in outputs) {
      const pinSpec = outputs[outputId]
      this._sim_add_exposed_pin_set('output', outputId, pinSpec)
    }

    this._rebuild_subgraph()

    this._simulation_prevent_restart = false

    this._start_graph_simulation(LAYER_NORMAL)

    this._start_debugger()
  }

  private _get_spec_init_unit_pin_position = (
    spec: GraphSpec,
    unit_id: string
  ): UnitPinPosition => {
    const { units = {} } = spec
    const unit: GraphUnitSpec = units[unit_id]
    const { path } = unit
    const pin_position: UnitPinPosition = { input: {}, output: {} }
    this._for_each_spec_id_pin(
      path,
      (type: 'input' | 'output', pin_id: string) => {
        const pin = (unit[type] || {})[pin_id] || {}
        const { metadata = {} } = pin
        const { position } = metadata
        if (position) {
          const p = this._jiggle_screen_center()
          p.x += position.x
          p.y += position.y
          pin_position[type][pin_id] = p
        }
      }
    )
    return pin_position
  }

  public getSpec = (): GraphSpec => {
    if (this._subgraph_graph) {
      // subgraph is in control
      return this._subgraph_graph.getSpec()
    } else {
      return this._spec
    }
  }

  public getMaxComponentSpecSizeSize(): Size {
    const { component } = this.$props

    let max_width = Number.MIN_SAFE_INTEGER
    let max_height = Number.MIN_SAFE_INTEGER

    for (const sub_component_id in component.$subComponent) {
      const { width, height } =
        this._get_unit_component_graph_size(sub_component_id)
      max_width = Math.max(max_width, width)
      max_height = Math.max(max_height, height)
    }

    return {
      width: max_width,
      height: max_height,
    }
  }

  public getMaxComponentLayoutSize(): Size {
    const { component } = this.$props

    let max_width = Number.MIN_SAFE_INTEGER
    let max_height = Number.MIN_SAFE_INTEGER

    for (const sub_component_id in component.$subComponent) {
      const { width, height } =
        this._get_unit_component_graph_size(sub_component_id)
      max_width = Math.max(max_width, width)
      max_height = Math.max(max_height, height)
    }

    return {
      width: max_width,
      height: max_height,
    }
  }

  public getZoom = (): Zoom => {
    return this._zoom
  }

  private _add_unit(
    unit_id: string,
    unit: GraphUnitSpec,
    position: Position,
    pin_position: UnitPinPosition = {
      input: {},
      output: {},
    },
    layout_position: Position,
    parent_id: string | null
  ): void {
    // console.trace('Graph', '_add_unit')
    this._spec_add_unit(unit_id, unit)
    if (this._is_unit_component(unit_id)) {
      if (parent_id) {
        this._mem_move_sub_component_child(parent_id, unit_id)
      }
      this._spec_append_component(parent_id, unit_id)
    }
    this._sim_add_unit(
      unit_id,
      unit,
      position,
      pin_position,
      parent_id,
      layout_position
    )
    this._pod_add_unit(unit_id, unit)
    this._start_graph_simulation(LAYER_NORMAL)
  }

  public add_unit(
    unit_id: string,
    unit: GraphUnitSpec,
    position: Position,
    pin_position: UnitPinPosition = {
      input: {},
      output: {},
    },
    layout_position: Position,
    parent_id: string | null
  ): void {
    this._add_unit(
      unit_id,
      unit,
      position,
      pin_position,
      layout_position,
      parent_id
    )
    this._dispatchAction(addUnit(unit_id, unit))
  }

  private _enter_all_sub_component_frame(): void {
    for (const unit_id in this._component_nodes) {
      this._enter_sub_component_frame(unit_id)
    }
  }

  public _leave_all_sub_component_frame(): void {
    for (const unit_id in this._component_nodes) {
      this._leave_sub_component_frame(unit_id)
    }
  }

  private _get_sub_component = (unit_id: string): Component | undefined => {
    // const { component } = this.$props
    // if (component) {
    // const { $subComponent = {} } = component
    if (this._component) {
      const { $subComponent: $subComponent = {} } = this._component
      const sub_component = $subComponent[unit_id]
      if (sub_component) {
        return sub_component
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  }

  private _get_sub_component_spec = (
    unit_id: string
  ): GraphSubComponentSpec => {
    const component_spec = this._get_component_spec()
    const { subComponents = {} } = component_spec
    const subComponent = subComponents[unit_id]
    return subComponent
  }

  private _get_sub_component_spec_children = (unit_id: string): string[] => {
    const sub_component_spec = this._get_sub_component_spec(unit_id)
    const { children = [] } = sub_component_spec
    return children
  }

  private _decompose_sub_component(unit_id: string): void {
    // console.log('Graph', '_decompose_sub_component', unit_id)
    const sub_component = this._get_sub_component(unit_id)!
    sub_component.decompose()
  }

  private _compose_sub_component(unit_id: string): void {
    // console.log('Graph', '_compose_sub_component', unit_id)
    const sub_component = this._get_sub_component(unit_id)!
    sub_component.compose()
  }

  private _spec_add_unit = (id: string, unit: GraphUnitSpec) => {
    this._spec = specReducer.addUnit({ id, unit }, this._spec)
    this._spec_update_metadata_complexity()
  }

  private _spec_append_component = (
    parent_id: string | null,
    id: string
  ): void => {
    // console.log('Graph', '_spec_append_component', parent_id, id)
    this._spec.component = this._spec.component || { subComponents: {} }

    this._spec.component = componentReducer.setSubComponent(
      { id, spec: { children: [] } },
      this._spec.component || {}
    )

    if (parent_id) {
      this._spec.component = componentReducer.appendSubComponentChild(
        { id: parent_id, childId: id },
        this._spec.component || {}
      )
    } else {
      this._spec.component = componentReducer.appendChild(
        { id },
        this._spec.component || {}
      )
    }

    const { width, height } = this._get_unit_component_graph_size(id)
    this._update_max_component_size(id, width, height)

    this._spec_component_set_default_size()
  }

  private _animate_all_current_layout_layer_node = (): void => {
    // console.log('Graph', '_animate_all_current_layout_layer_node')
    const current_layer = this._get_current_layout_layer_id()
    this._animate_all_layout_layer_node(current_layer)
  }

  private _animate_all_layout_layer = (): void => {
    this._animate_all_layout_layer_node(null)
    for (const layer of this._layout_path) {
      this._animate_all_layout_layer_node(layer)
    }
  }

  private _animate_all_layout_layer_node = (layer: string | null): void => {
    const layer_children = this._get_layout_layer_children(layer)

    for (const _sub_component_id of layer_children) {
      if (this._layout_drag_node[_sub_component_id]) {
        continue
      }

      const layout_node = this._layout_node[_sub_component_id]

      this._animate_layout_core(
        _sub_component_id,
        layout_node,
        () => {
          return this._layout_target_node[_sub_component_id]
        },
        () => {}
      )
    }
  }

  private _spec_update_metadata_complexity = debounce(() => {
    const c = graphComplexity(this._spec)
    this._spec = specReducer.setMetadata(
      { path: ['metadata', 'complexity'], value: c },
      this._spec
    )
  }, 1000)

  private _flush_debugger = (): void => {
    // console.log('Graph', '_flush_debugger')
    let cursor = this._debug_cursor + 1

    const input: Dict<Dict<any>> = {}

    const output: Dict<Dict<any>> = {}

    const merge: Dict<any> = {}

    const handler: Dict<Dict<Function>> = {
      input: {
        data: (_data: GraphUnitPinDataMomentData) => {
          const { unitId, pinId, data } = _data
          input[unitId] = input[unitId] || {}
          input[unitId][pinId] = data
        },
        drop: (_data: GraphUnitPinDropMomentData) => {
          const { unitId, pinId } = _data
          input[unitId] = input[unitId] || {}
          input[unitId][pinId] = undefined
        },
      },
      output: {
        data: (_data: GraphUnitPinDataMomentData) => {
          const { unitId, pinId, data } = _data
          output[unitId] = output[unitId] || {}
          output[unitId][pinId] = data
        },
        drop: (_data: GraphUnitPinDropMomentData) => {
          const { unitId, pinId } = _data
          output[unitId] = output[unitId] || {}
          output[unitId][pinId] = undefined
        },
      },
      merge: {
        data: (moment: GraphMoment) => {
          const { id, data } = moment
          merge[id] = data
        },
        drop: (moment: GraphMoment) => {
          const { id } = moment
          merge[id] = undefined
        },
      },
      unit: this._graph_moment_handler['unit'],
    }

    while (cursor < this._debug_buffer.length) {
      const moment = this._debug_buffer[cursor]

      const { event, type, data } = moment
      handler[type][event](data)

      cursor++
    }

    for (const unit_id in input) {
      const unit_input = input[unit_id]
      for (const pin_id in unit_input) {
        const pin_node_id = getInputNodeId(unit_id, pin_id)
        const data = unit_input[pin_id]
        if (this._is_pin_active(pin_node_id)) {
          if (data === undefined) {
            this._graph_debug_drop_pin_data(pin_node_id)
          } else {
            this._graph_debug_set_pin_data(pin_node_id, data)
          }
        } else {
          if (data === undefined) {
            //
          } else {
            this._graph_debug_set_pin_data(pin_node_id, data)
          }
        }
      }
    }

    for (const unit_id in output) {
      const unit_output = output[unit_id]
      for (const pin_id in unit_output) {
        const pin_node_id = getOutputNodeId(unit_id, pin_id)
        const data = unit_output[pin_id]
        if (this._is_pin_active(pin_node_id)) {
          if (data === undefined) {
            this._graph_debug_drop_pin_data(pin_node_id)
          } else {
            this._graph_debug_set_pin_data(pin_node_id, data)
          }
        } else {
          if (data === undefined) {
            //
          } else {
            this._graph_debug_set_pin_data(pin_node_id, data)
          }
        }
      }
    }

    for (const merge_id in merge) {
      const data = merge[merge_id]
      const merge_node_id = getMergeNodeId(merge_id)
      if (this._is_pin_active(merge_node_id)) {
        if (data === undefined) {
          this._graph_debug_drop_pin_data(merge_node_id)
        } else {
          this._graph_debug_set_pin_data(merge_node_id, data)
        }
      } else {
        if (data === undefined) {
          //
        } else {
          this._graph_debug_set_pin_data(merge_node_id, data)
        }
      }
    }

    this._clear_debugger()
  }

  private _pod_add_unit(unit_id: string, unit: GraphUnitSpec): void {
    // console.log('Graph', '_pod_add_unit', unit_id, unit)
    this._flush_debugger()

    this._pod.$addUnit({
      id: unit_id,
      unit,
    })
  }

  private _pod_add_unit_component = (unit_id: string): void => {
    // console.log('Graph', '_pod_add_unit_component', unit_id)
    const sub_component = this._get_sub_component(unit_id)!
    const _ = component_(sub_component)
    const sub_unit = this._pod.$refUnit({ unitId: unit_id, _ }) as $Component
    sub_component.connect(sub_unit)
  }

  private _disconnect_sub_component = (unit_id: string): void => {
    const sub_component = this._get_sub_component(unit_id)!
    if (sub_component) {
      sub_component.disconnect()
    }
  }

  private _disconnect_all_sub_component = (): void => {
    // console.log('Graph', '_disconnect_all_sub_component')
    for (const component_id in this._component.$subComponent) {
      this._disconnect_sub_component(component_id)
    }
  }

  private _get_unit_radius = (
    unit_id: string,
    use_cache: boolean = true
  ): number => {
    const path = this._get_unit_path(unit_id)
    const r = getSpecRadiusById(path, use_cache)
    return r
  }

  private _sim_add_pin_datum = (
    unit_id: string,
    type: 'input' | 'output',
    pin_id: string,
    position: Position,
    data: string
  ) => {
    // console.log('Graph', '_sim_add_pin_datum', unit_id, type, pin_id)
    const pin_node_id = getPinNodeId(unit_id, type, pin_id)
    const datum_id = this._new_datum_id()
    const datum_node_id = getDatumNodeId(datum_id)
    const { x, y } = position
    this._sim_add_datum_node(datum_id, data, {
      x,
      y,
    })
    this._sim_add_datum_link(datum_node_id, pin_node_id)
  }

  private _sim_add_unit_pins = (
    unit_id: string,
    unit: GraphUnitSpec,
    pin_position: UnitPinPosition = {
      input: {},
      output: {},
    }
  ): void => {
    const spec = this._get_unit_spec(unit_id)

    const { inputs = {}, outputs = {} } = spec
    const inputCount: number = Object.keys(inputs).length
    const outputCount: number = Object.keys(outputs).length

    const core_node = this._node[unit_id]

    const { x: core_x, y: core_y, r: core_r } = core_node

    const _pin_position = (
      type: 'input' | 'output',
      pin_id: string,
      i: number,
      total: number
    ): Position | undefined => {
      const pin_node_id = getPinNodeId(unit_id, type, pin_id)

      const position: Position =
        pin_position[type][pin_id] ||
        getUnitPinPosition(
          i,
          total,
          type,
          PIN_RADIUS,
          core_x,
          core_y,
          core_r,
          undefined,
          LINK_DISTANCE
        )

      return position
    }

    const _sim_add_pin = (
      type: 'input' | 'output',
      pin_id: string,
      position: Position | undefined
    ): void => {
      const pin_node_id = getPinNodeId(unit_id, type, pin_id)
      const merged = this._is_link_pin_merged(pin_node_id)

      this._node_type[pin_node_id] = 'p'

      if (!merged) {
        this._sim_add_link_pin_node(unit_id, type, pin_id, position)
        this._sim_add_link_pin_link(unit_id, type, pin_id)
      } else {
        this._sim_add_link_pin_link(unit_id, type, pin_id)
      }
    }

    let i = 0
    for (let input_pin_id in inputs) {
      const input_node_id = getInputNodeId(unit_id, input_pin_id)
      const ignored = this._is_link_pin_ignored(input_node_id)
      const position: Position =
        pin_position['input'][input_pin_id] ||
        getUnitPinPosition(
          i,
          inputCount,
          'input',
          PIN_RADIUS,
          core_x,
          core_y,
          core_r,
          undefined,
          LINK_DISTANCE
        )
      _sim_add_pin('input', input_pin_id, position)
      if (!ignored) {
        i++
      }
    }

    let o = 0
    for (let output_pin_id in outputs) {
      const output_node_id = getOutputNodeId(unit_id, output_pin_id)
      const ignored = this._is_link_pin_ignored(output_node_id)
      const position: Position =
        pin_position['input'][output_pin_id] ||
        getUnitPinPosition(
          o,
          outputCount,
          'output',
          PIN_RADIUS,
          core_x,
          core_y,
          core_r,
          undefined,
          LINK_DISTANCE
        )
      _sim_add_pin('output', output_pin_id, position)
      if (!ignored) {
        o++
      }
    }
  }

  private _sim_add_unit(
    unit_id: string,
    unit: GraphUnitSpec,
    position: Position,
    pin_position: UnitPinPosition = {
      input: {},
      output: {},
    },
    parent_id: string | null,
    layout_position?: Position
  ): void {
    // log('Graph', '_sim_add_unit')
    this._sim_add_core(unit_id, unit, position)
    if (this._is_unit_component(unit_id)) {
      layout_position = layout_position || NULL_VECTOR
      this._sim_add_core_component(unit_id, parent_id, layout_position)
    }
    this._sim_add_unit_pins(unit_id, unit, pin_position)
  }

  private _sim_add_core = (
    unit_id: string,
    unit: GraphUnitSpec,
    position: Position
  ): void => {
    // console.log('Graph', '_sim_add_core', unit_id, unit, position)
    const { path } = unit

    const spec = getSpec(path)

    const is_base = isBaseSpec(spec)

    const is_component: boolean = isComponent(path)

    let r: number
    let width: number
    let height: number
    let shape: Shape

    if (is_component) {
      const size = this._get_unit_component_graph_size(unit_id)
      width = size.width + 2
      height = size.height + 2
      r = Math.max(width, height) / 2
      shape = 'rect'
    } else {
      r = getSpecRadiusById(path, true)
      width = 2 * r
      height = 2 * r
      shape = 'circle'
    }

    const { x, y } = position

    this._sim_add_node(unit_id, {
      _x: x,
      _y: y,
      x,
      y,
      fx: undefined,
      fy: undefined,
      shape,
      r,
      width,
      height,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      hx: 0,
      hy: 0,
      layer: LAYER_NORMAL,
    })

    this._node_type[unit_id] = 'u'
    this._node_layer[unit_id] = LAYER_NORMAL

    const node = this._node[unit_id]
    this._unit_node[unit_id] = node
    this._normal_node[unit_id] = node

    const self_pin_node_id = getSelfPinNodeId(unit_id)
    this._node_type[self_pin_node_id] = 'p'

    const core_node = this._node_comp[unit_id]
    const core_node_content = this._node_content[unit_id]

    const core_selection = this._create_selection(unit_id, {
      width,
      height,
      shape,
      stroke: NONE,
    })

    const core_area = this._create_touch_area({
      className: 'core-area',
      width,
      height,
      style: {
        borderRadius: is_component ? '0' : '50%',
      },
    })
    this._core_area[unit_id] = core_area

    let icon = (spec.metadata && spec.metadata.icon) || undefined

    if (icon === undefined) {
      if (is_base) {
        icon = 'question'
      } else {
        // core icon is not visible if graph is empty
        const { count: unit_count } = keyCount({
          obj: (spec as GraphSpec).units || {},
        })
        if (unit_count > 0) {
          icon = 'question'
        }
      }
    }

    const icon_width = r
    const icon_height = icon_width

    const core_icon = new Icon({
      icon,
      style: {
        position: 'absolute',
        width: `${icon_width}px`,
        height: `${icon_height}px`,
        top: '50%',
        left: '50%',
        display: is_component ? 'none' : 'block',
        // fill: this._theme.node,
        fill: 'transparent',
        stroke: this._theme.node,
        transform: 'translate(-50%, -50%)',
      },
    })
    this._core_icon[unit_id] = core_icon

    const spec_name = spec.name || ''

    const { width: name_width, height: name_height } = getTextAreaSize(
      spec_name,
      UNIT_CORE_NAME_FONT_SIZE,
      UNIT_CORE_MAX_CHAR_LINE
    )

    const core_name = new Div({
      className: 'core-name',
      style: {
        position: 'absolute',
        display: 'flex',
        fontSize: '12px',
        borderColor: NONE,
        borderWidth: '0px',
        borderStyle: 'solid',
        textDecoration: 'none',
        justifyContent: 'center',
        textAlign: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
        touchAction: 'none',
        webkitUserSelect: 'none',
        color: this._theme.text,
        width: `${name_width + 2}px`,
        height: `${name_height + 2}px`,
        overflowWrap: 'break-word',
        // whiteSpace: 'break-spaces',
        wordBreak: 'break-word',
        left: `50%`,
        top: 'calc(100% + 3px)',
        transform: `translateX(-50%)`,
      },
      innerText: spec_name,
    })
    // this._sim_setup_node_name(unit_id, core_name)
    this._core_name[unit_id] = core_name

    const spec_description: string =
      (spec.metadata && spec.metadata.description) || '...'

    const { width: description_width, height: description_height } =
      getTextAreaSize(spec_description, 10, 30)

    const core_description = new Div({
      className: 'core-description',
      style: {
        position: 'absolute',
        display: 'none',
        fontSize: '10px',
        borderColor: NONE,
        borderWidth: '0px',
        borderStyle: 'solid',
        textDecoration: 'none',
        justifyContent: 'center',
        textAlign: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
        touchAction: 'none',
        webkitUserSelect: 'none',
        color: this._theme.pin_text,
        width: `${description_width}px`,
        height: `${description_height}px`,
        overflowWrap: 'break-word',
        // whiteSpace: 'break-spaces',
        left: `50%`,
        top: `calc(100% + ${name_height + 6}px)`,
        transform: `translateX(-50%)`,
      },
      innerText: spec_description,
    })
    this._core_description[unit_id] = core_description

    const core_content = new Div({
      style: {
        position: 'relative',
      },
    })
    core_content.appendChild(core_selection)
    core_content.appendChild(core_area)
    core_content.appendChild(core_icon)
    core_content.appendChild(core_name)
    core_content.appendChild(core_description)
    this._core_content[unit_id] = core_content

    const core = new Div({
      className: 'core',
      style: {
        width: `${width}px`,
        height: `${height}px`,
        // position: 'relative',
        position: 'absolute',
        borderWidth: '1px',
        borderRadius: shape === 'circle' ? '50%' : '0',
        borderColor: this._theme.node,
        borderStyle: 'solid',
        boxSizing: 'border-box',
        // boxSizing: 'content-box',
        touchAction: 'none',
      },
    })
    core.appendChild(core_content)
    this._core[unit_id] = core

    core_node_content.appendChild(core)

    this._zoom_comp.appendChild(core_node)

    this._unit_count++

    if (this._unit_count === 1) {
      if (this._minimap_screen) {
        this._minimap_screen.$element.style.display = 'block'
      }
    }

    if (this._static) {
      if (!this._ascend_node_dict[unit_id]) {
        this._start_node_static(unit_id)
      }
    }

    this._refresh_core_border_color(unit_id)
  }

  private _sim_add_core_component_frame = (unit_id: string): void => {
    const { $theme, $color } = this.$context

    const core_content = this._core_content[unit_id]

    const core_component_frame = new Frame({
      className: 'core-component-frame',
      disabled: true,
      color: $color,
      theme: $theme,
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
    })
    const { $$context } = core_component_frame
    this._core_component_frame[unit_id] = core_component_frame
    this._core_component_context[unit_id] = $$context
    core_content.appendChild(core_component_frame)
  }

  private _sim_add_core_resize = (unit_id: string): void => {
    const core_content = this._core_content[unit_id]

    const core_resize = new Resize({ disabled: true, l: 21 })
    core_resize.addEventListener(
      makeCustomListener('resizestart', (data: IOResizeEvent) => {
        this._on_component_resize_start(unit_id, data)
      })
    )
    core_resize.addEventListener(
      makeCustomListener('resized', (data: IOResizeEvent) => {
        this._on_component_resize(unit_id, data)
      })
    )
    core_resize.addEventListener(
      makeCustomListener('resizeend', (data: {}) => {
        this._on_component_resize_end(unit_id, data)
      })
    )
    this._core_component_resize[unit_id] = core_resize
    core_content.appendChild(core_resize)
  }

  private _sim_add_layout_core_children_counter = (unit_id: string): void => {
    const { animate } = this.$props

    const layout_core = this._layout_core[unit_id]

    const component_children = this._get_sub_component_spec_children(unit_id)
    const component_children_count = component_children.length
    const component_children_counter = new Div({
      style: {
        // display: 'none',
        opacity: '0',
        position: 'absolute',
        width: 'auto',
        height: 'auto',
        left: '50%',
        top: '-24px',
        transform: 'translate(-50%)',
        pointerEvents: 'none',
        transition: ifLinearTransition(animate, 'opacity'),
      },
      innerText: `${component_children_count}`,
    })
    this._layout_core_children_counter[unit_id] = component_children_counter
    layout_core.appendChild(component_children_counter)
  }

  private _sim_add_core_component_overlay = (unit_id: string): void => {
    const core_content = this._core_content[unit_id]

    const core_overlay = this._create_overlay({ className: 'core-overlay' })
    this._core_component_overlay[unit_id] = core_overlay
    core_content.appendChild(core_overlay)
  }

  private _sim_add_core_component = (
    unit_id: string,
    parent_id: string | null,
    layout_position: Position
  ) => {
    // console.log('Graph', '_sim_add_core_component', unit_id, parent_id)
    this._unit_component_count++

    this._component_nodes[unit_id] = this._node[unit_id]

    this._sim_add_core_component_frame(unit_id)
    this._sim_add_core_resize(unit_id)
    this._sim_add_core_component_overlay(unit_id)

    this._sim_add_layout_core(unit_id, parent_id, layout_position)
    this._sim_add_layout_core_children_counter(unit_id)

    // this._sub_component_parent[unit_id] = parent_id

    if (this._tree_layout) {
      const layout_core = this._layout_core[unit_id]

      this._listen_layout_core(unit_id, layout_core)

      if (parent_id && !this._layout_path.includes(parent_id)) {
        console.log('TODO')
      } else {
        this._move_core_content_graph_to_layout(unit_id)
        this._show_layout_core(unit_id)
      }
    }
  }

  private _refresh_current_layout_node_target_position = (): void => {
    const current_layout_layer = this._get_current_layout_layer_id()
    this._refresh_layout_node_target_position(current_layout_layer)
  }

  private _refresh_layout_root_node_size = () => {
    // console.log('Graph', '_refresh_layout_root_node_size')
    return this._refresh_layout_node_size(null)
  }

  private _refresh_layout_node_size = (layer: string): void => {
    // console.log('Graph', '_refresh_layout_node_size', layer)
    const { $width, $height } = this.$context

    const children = this._get_layout_layer_children(layer)

    for (let i = 0; i < children.length; i++) {
      const child_id = children[i]

      const layout_size = this._get_unit_component_layout_size(child_id)

      let { width, height } = layout_size

      width = Math.min(width, $width - 2 * LAYOUT_HORIZONTAL_PADDING)
      height = Math.min(height, $height - 2 * LAYOUT_VERTICAL_PADDING)

      const layout_target_node = this._layout_target_node[child_id]

      layout_target_node.width = width
      layout_target_node.height = height
    }
  }

  private _refresh_all_layout_node_size = (): void => {
    this._refresh_layout_node_size(null)
    for (const layer of this._layout_path) {
      this._refresh_layout_node_size(layer)
    }
  }

  private _refresh_layout_node_target_position = (
    parent_id: string | null
  ): void => {
    // console.log('Graph', '_refresh_layout_node_position', parent_id)
    const { $width, $height } = this.$context

    const children =
      parent_id === null
        ? this._get_component_spec_children()
        : this._get_sub_component_spec_children(parent_id)

    const layout_component_ij = {}

    let row_total_width_sum: number[] = []
    let row_total_max_height: number[] = []
    let total_height: number = 0
    let row = 0
    let column = 0
    for (let i = 0; i < children.length; i++) {
      const child_id = children[i]

      const layout_node = this._layout_target_node[child_id]

      const { width, height } = layout_node

      if (row_total_width_sum[row] + width >= $width - 150) {
        total_height += (row_total_max_height[row] ?? 0) + 60
        row++
        column = 0
      }
      layout_component_ij[child_id] = [row, column]
      row_total_width_sum[row] = (row_total_width_sum[row] ?? 0) + width
      row_total_max_height[row] = Math.max(
        row_total_max_height[row] ?? 0,
        height
      )
      if (column > 0) {
        row_total_width_sum[row] += 60
      }
      column++
    }
    total_height += row_total_max_height[row]

    let partial_row_width_sum: number[] = []
    let partial_max_height_sum: number[] = []

    for (let i = 0; i < children.length; i++) {
      const child_id = children[i]

      const layout_node = this._layout_target_node[child_id]

      const [row, column] = layout_component_ij[child_id]

      const { width } = layout_node

      const row_partial_max_height_sum = partial_max_height_sum[row] ?? 0
      const row_row_total_max_height = row_total_max_height[row]
      const x =
        -row_total_width_sum[row] / 2 +
        (partial_row_width_sum[row] ?? 0) +
        column * 60 +
        width / 2
      let y: number
      if (total_height > $height - 120) {
        y =
          row_partial_max_height_sum +
          row * 60 -
          $height / 2 +
          60 +
          row_row_total_max_height / 2
      } else {
        y =
          row_partial_max_height_sum +
          row * 60 -
          total_height / 2 +
          row_row_total_max_height / 2
      }

      const layout_layer = this._get_layout_layer(parent_id)

      layout_layer.height.$element.style.height = `${
        total_height + 2 * LAYOUT_VERTICAL_PADDING
      }px`

      const layout_target_node = this._layout_target_node[child_id]

      layout_target_node.x = x
      layout_target_node.y = y

      if (!partial_max_height_sum[row + 1]) {
        partial_max_height_sum[row + 1] =
          row_partial_max_height_sum + row_total_max_height[row]
      }
      partial_row_width_sum[row] = (partial_row_width_sum[row] ?? 0) + width
    }
  }

  private _move_all_layout_node_target_position = (
    parent_id: string | null
  ) => {
    const { animate } = this.$props

    if (animate) {
      this._animate_all_layout_layer_node(parent_id)
    } else {
      this._set_all_layout_layer_core_position(parent_id)
    }
  }

  private _move_all_current_layout_node_target_position = () => {
    const current_layer = this._get_current_layout_layer_id()

    this._move_all_layout_node_target_position(current_layer)
  }

  private _sim_add_layout_core = (
    unit_id: string,
    parent_id: string | null,
    layout_position: Position
  ): void => {
    const { x, y } = layout_position

    const { width, height } = this._get_unit_component_graph_size(unit_id)

    const layout_core = new Div({
      style: {
        // display: 'none',
        opacity: '0',
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        width: `${width + 2}px`,
        height: `${height + 2}px`,
        transform: 'translate(-50%, -50%)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'currentColor',
        boxSizing: 'border-box',
        touchAction: 'none',
        // margin: '30px',
      },
    })
    this._layout_core[unit_id] = layout_core

    const layout_node: LayoutNode = {
      x,
      y,
      width,
      height,
      k: 1,
    }

    this._layout_node[unit_id] = layout_node
    this._layout_target_node[unit_id] = clone(layout_node)

    if (parent_id) {
      const parent_layout_layer = this._ensure_layout_layer(parent_id)

      parent_layout_layer.children.appendChild(layout_core)
    } else {
      this._layout_root.children.appendChild(layout_core)
    }
  }

  private _search_adding_unit: boolean = false

  private _sim_add_unit_component = (unit_id: string): void => {
    this._mem_add_unit_component(unit_id)
    if (this._in_component_control) {
      this._place_sub_component(unit_id)
    }
  }

  private _set_sub_component_index = (
    sub_component_id: string,
    i: number
  ): void => {
    // console.log('Graph', '_set_sub_component_index', i)
    this._sub_component_index[sub_component_id] = i
  }

  private _mem_add_unit_component = (unit_id: string): void => {
    const { component } = this.$props

    this._search_adding_unit = true

    let sub_component = component.$subComponent[unit_id]

    // RETURN
    // add directly on parent
    if (!sub_component) {
      const spec_id = this._get_unit_spec_id(unit_id)
      sub_component = componentFromSpecId(spec_id, {})
      component.setSubComponent(unit_id, sub_component)
      component.pushRoot(sub_component)
    }

    const sub_component_count = _keyCount(component.$subComponent)

    this._set_sub_component_index(unit_id, sub_component_count - 1)

    this._search_adding_unit = false
  }

  private _set_unit_name = (unit_id: string, value: string): void => {
    if (value.match(/\n/g) || value.length > UNIT_NAME_MAX_SIZE) {
      const core_name = this._core_name[unit_id]
      const name = this._get_unit_name(unit_id)
      core_name.setProp('value', name)
      return
    }
    this._spec_set_unit_metadata_rename(unit_id, value)
    this._sim_set_unit_name(unit_id, value)
    this._pod_set_unit_name(unit_id, value)
  }

  private _sim_set_unit_name = (unit_id: string, value: string): void => {
    // console.log('Graph', '_sim_set_unit_name', unit_id, value)
    const core_name = this._core_name[unit_id]
    const { width, height } = getTextAreaSize(
      value,
      UNIT_CORE_NAME_FONT_SIZE,
      UNIT_CORE_MAX_CHAR_LINE
    )
    // mergeStyle(core_name, {
    //   width: `${width + 2}px`,
    //   height: `${height + 2}px`,
    // })
    core_name.$element.style.width = `${width + 2}px`
    core_name.$element.style.height = `${height + 2}px`
  }

  private _pod_set_unit_name = (unit_id: string, value: string): void => {
    // TODO
  }

  private _spec_set_unit_metadata_rename = (
    unit_id: string,
    value: string
  ): void => {
    this._spec = specReducer.setMetadata(
      { path: ['units', unit_id, 'metadata', 'rename'], value },
      this._spec
    )
  }

  private _set_unit_pin_metadata_rename = (
    pin_node_id: string,
    value: string
  ): void => {
    this._spec_set_unit_pin_metadata_rename(pin_node_id, value)
  }

  private _spec_set_unit_pin_metadata_rename = (
    pin_node_id: string,
    value: string
  ): void => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    this._spec = specReducer.setMetadata(
      { path: ['units', unitId, type, pinId, 'metadata', 'rename'], value },
      this._spec
    )
  }

  private _set_exposed_pin_name = (
    exposed_pin_node_id: string,
    name: string
  ): void => {
    const { type, id } = segmentExposedNodeId(exposed_pin_node_id)
    this._pod_set_exposed_pin_name(type, id, name)
    this._sim_set_exposed_pin_name(type, id, name)
    this._spec_set_exposed_pin_name(type, id, name)
  }

  private _spec_set_exposed_pin_name = (
    type: 'input' | 'output',
    id: string,
    newId: string
  ): void => {
    // console.log('Graph', '_spec_set_exposed_pin_name', type, id, name)
    // this._spec = specReducer.setPinSetName({ type, id, name }, this._spec)
    this._spec = specReducer.setPinSetId({ type, id, newId }, this._spec)
  }

  private _sim_set_exposed_pin_name = (
    type: 'input' | 'output',
    id: string,
    newId: string
  ): void => {
    const pin_spec = this._get_exposed_pin_spec(type, id)
    const position = this._get_exposed_pin_set_position(type, id)
    this._sim_remove_exposed_pin_set(type, id)
    this._sim_add_exposed_pin_set(type, newId, pin_spec, position)
  }

  private _pod_set_exposed_pin_name = (
    type: 'input' | 'output',
    id: string,
    value: string
  ): void => {
    // TODO
  }

  private _get_err_size = (err: string): Size => {
    // let { width, height } = getTextSize(err, 12, 18)
    let { width, height } = getTextAreaSize(err, 12, 18)
    const MAX_ERR_HEIGHT = 48 + 1
    height = Math.min(height, MAX_ERR_HEIGHT)
    return { width, height }
  }

  private _sim_add_unit_err = (unit_id: string, err: string): void => {
    // console.log('Graph', '_sim_add_unit_err')
    const err_node_id = getErrNodeId(unit_id)

    // const escaped_err = escape(err)
    const escaped_err = err

    const { width, height } = this._get_err_size(err)

    const r = Math.max(width, height) / 2

    // const unit_node = this._node[unit_id]
    // const { x, y } = randomInRadius(unit_node.x, unit_node.y, LINK_DISTANCE)
    const { x, y } = this._err_initial_position(unit_id)

    const shape = 'rect'

    const err_node = this._sim_add_node(err_node_id, {
      _x: x,
      _y: y,
      x,
      y,
      fx: undefined,
      fy: undefined,
      shape,
      r,
      width,
      height,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      hx: 0,
      hy: 0,
      layer: LAYER_ERR,
    })
    this._node_type[err_node_id] = 'x'
    this._node_layer[err_node_id] = LAYER_ERR

    const node = this._node[err_node_id]
    this._err_node[err_node_id] = node

    const node_content = this._node_content[err_node_id]

    const err_selection = this._create_selection(err_node_id, {
      width,
      height,
      shape,
      stroke: NONE,
    })

    const err_area = this._create_touch_area({
      className: 'err-area',
      width,
      height,
    })
    this._err_area[err_node_id] = err_area

    const err_comp = new Div({
      className: 'err',
      style: {
        width: `${width}px`,
        height: `${height}px`,
        fontSize: '12px',
        textAlign: 'center',
        wordBreak: 'break-all',
        overflowWrap: 'break-word',
        overflow: 'auto',
        color: OPAQUE_RED,
        ...userSelect('auto'),
      },
      innerText: escaped_err,
    })
    err_comp.stopPropagation('wheel')
    this._err_comp[unit_id] = err_comp

    const err_overlay = this._create_overlay({
      className: 'err-overlay',
    })
    this._err_overlay[err_node_id] = err_overlay

    node_content.appendChild(err_area)
    node_content.appendChild(err_selection)
    node_content.appendChild(err_comp)
    node_content.appendChild(err_overlay)

    const source_id = unit_id
    const target_id = err_node_id
    const link_id = getLinkId(unit_id, err_node_id)
    const d = ERR_LINK_DISTANCE

    const err_link = this._sim_add_link(
      link_id,
      {
        source_id,
        target_id,
        d,
        s: 1,
        padding: {
          source: -6,
          target: -6,
        },
        detail: {
          type: 'x',
        },
      },
      {
        stroke: OPAQUE_RED,
        strokeWidth: 1,
      }
    )

    this._err_link[link_id] = this._link[link_id]
    this._link_layer[link_id] = LAYER_ERR

    this._zoom_comp.appendChild(err_node)

    this._zoom_comp.appendChild(err_link, 'svg')

    this._start_graph_simulation(LAYER_ERR)
  }

  private _pod_remove_unit_err = (unitId: string): void => {
    this._pod.$takeUnitErr({ unitId })
  }

  private _sim_remove_unit_err = (unit_id: string): void => {
    const err_node_id = getErrNodeId(unit_id)

    const link_id = getLinkId(unit_id, err_node_id)
    delete this._err_link[link_id]
    this._sim_remove_link(link_id)

    delete this._err[unit_id]
    delete this._err_comp[unit_id]
    delete this._err_area[err_node_id]
    delete this._err_node[err_node_id]

    this._sim_remove_node(err_node_id)
  }

  private _sim_set_unit_err = (unit_id: string, err: string): void => {
    this._err[unit_id] = err
    const err_node_id = getErrNodeId(unit_id)
    const err_component = this._err_comp[unit_id]
    const { width, height } = this._get_err_size(err)
    const r = Math.max(width, height) / 2
    this._resize_node(err_node_id, r, width, height)
    this._resize_selection(err_node_id, width, height)
    // mergeStyle(err_component, {
    //   width: `${width}px`,
    //   height: `${height}px`,
    // })
    err_component.$element.style.width = `${width}px`
    err_component.$element.style.height = `${height}px`
    const escaped_err = escape(err)
    console.log('escaped_err', escaped_err)
    err_component.setProp('innerText', escaped_err)
  }

  public add_exposed_pin_set = (
    type: 'input' | 'output',
    pin_id: string,
    pin_spec: GraphExposedPinSpec,
    position: Dict<{ int?: Position; ext?: Position }> = {}
  ) => {
    this._add_exposed_pin_set(type, pin_id, pin_spec, position)
    this._dispatchAction(exposePinSet(type, pin_id, pin_spec))
  }

  private _add_exposed_pin_set = (
    type: 'input' | 'output',
    pin_id: string,
    pin_spec: GraphExposedPinSpec,
    position: Dict<{ int?: Position; ext?: Position }> = {}
  ) => {
    this._state_add_exposed_pin_set(type, pin_id, pin_spec, position)
    this._pod_add_exposed_pin_set(type, pin_id, pin_spec)
  }

  private _state_add_exposed_pin_set = (
    type: 'input' | 'output',
    pin_id: string,
    pin_spec: GraphExposedPinSpec,
    position: Dict<{ int?: Position; ext?: Position }> = {}
  ) => {
    this._spec_add_exposed_pin_set(type, pin_id, pin_spec)
    this._sim_add_exposed_pin_set(type, pin_id, pin_spec, position)
  }

  private _spec_add_exposed_pin_set = (
    type: 'input' | 'output',
    id: string,
    pin: GraphExposedPinSpec
  ) => {
    // console.log('_spec_add_exposed_pin_set', type, id, pin)
    this._spec = specReducer.exposePinSet({ id, type, pin }, this._spec)
  }

  private _pod_add_exposed_pin_set = (
    type: 'input' | 'output',
    id: string,
    pin: GraphExposedPinSpec
  ): void => {
    console.log('Graph', '_pod_add_exposed_pin_set', id, type, pin)
    this._pod.$exposePinSet({
      type,
      id,
      pin,
    })
  }

  private _pod_add_unit_exposed_pin_set = (
    unitId: string,
    type: 'input' | 'output',
    id: string,
    pin: GraphExposedPinSpec
  ): void => {
    this._pod.$exposeUnitPinSet({
      unitId,
      id,
      type,
      pin,
    })
  }

  private _sim_add_exposed_pin_set = (
    type: 'input' | 'output',
    pin_id: string,
    pin_spec: GraphExposedPinSpec,
    position: Dict<{ int?: Position; ext?: Position }> = {}
  ): void => {
    const { pin, metadata = {} } = pin_spec
    const { position: metadata_position = {} } = metadata

    this._exposed_pin_set_count++

    for (let sub_pin_id in pin) {
      let p = position[sub_pin_id]
      if (!p) {
        const pin_metadata_position = metadata_position[sub_pin_id]
        if (pin_metadata_position) {
          p = { ext: this._jiggle_screen_center() }
          p.ext.x += pin_metadata_position.x
          p.ext.y += pin_metadata_position.y
        }
      }
      const sub_pin_spec = pin[sub_pin_id]
      this._sim_add_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec, p)
    }
  }

  public add_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    pin_spec: GraphExposedPinSpec,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec,
    position: { int?: Point; ext?: Point }
  ): void => {
    // console.log(
    //   'Graph',
    //   'add_exposed_pin',
    //   type,
    //   pin_id,
    //   pin_spec,
    //   sub_pin_id,
    //   sub_pin_spec
    // )
    this._add_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec, position)
    this._dispatchAction(exposePin(type, pin_id, sub_pin_id, sub_pin_spec))
  }

  private _add_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec,
    position: { int?: Point; ext?: Point }
  ): void => {
    this._state_add_exposed_pin(
      type,
      pin_id,
      sub_pin_id,
      sub_pin_spec,
      position
    )
    this._pod_add_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
  }

  private _spec_add_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec
  ) => {
    this._spec = specReducer.exposePin(
      {
        id: pin_id,
        type,
        subPinId: sub_pin_id,
        subPin: sub_pin_spec,
      },
      this._spec
    )
  }

  private _state_add_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec,
    position: { int?: Point; ext?: Point }
  ): void => {
    this._spec_add_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
    this._sim_add_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec, position)
  }

  private _sim_setup_node_name = (node_id: string, name_component: any) => {
    name_component.addEventListener(
      makeFocusListener(() => {
        this._on_node_name_focus(node_id)
      })
    )
    name_component.addEventListener(
      makeBlurListener(() => {
        this._on_node_name_blur(node_id)
      })
    )
    name_component.addEventListener(
      makeInputListener((value: string) => {
        this._on_node_name_input(node_id, value)
      })
    )
  }

  private _on_node_name_focus = (node_id: string): void => {
    this._edit_node_name_id = node_id
    this._disable_crud()
    this._disable_keyboard()
  }

  private _on_node_name_blur = (node_id: string): void => {
    this._enable_crud()
    this._enable_keyboard()
    this._edit_node_name_id = null
  }

  private _on_node_name_input = (node_id: string, value: string): void => {
    this._set_node_name(node_id, value)
  }

  private _set_node_name = (node_id: string, value: string): void => {
    if (this._is_unit_node_id(node_id)) {
      this._set_unit_name(node_id, value)
    } else if (this._is_link_pin_node_id(node_id)) {
      this._set_unit_pin_metadata_rename(node_id, value)
    } else if (this._is_external_pin_node_id(node_id)) {
      if (value.length > PIN_NAME_MAX_SIZE) {
        return
      }

      this._set_exposed_pin_name(node_id, value)

      // AD HOC
      // node will be deleted (blur) and added again with a new id
      const { type, id, subPinId } = segmentExposedNodeId(node_id)
      const new_external_pin_node_id = getExternalNodeId(type, value, subPinId)
      const pin_name = this._pin_name[new_external_pin_node_id]
      pin_name.focus()
    }
  }

  private _sim_add_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec,
    position: { int?: Position; ext?: Position } = {}
  ): void => {
    const ext_pin_node_id = getExternalNodeId(type, pin_id, sub_pin_id)
    const int_pin_node_id = getInternalNodeId(type, pin_id, sub_pin_id)

    const functional = this.__is_exposed_pin_functional(type, pin_id)

    this._exposed_pin_unplugged_count++

    const { x, y } =
      position.ext ||
      randomInRect(
        this._width / 4,
        this._height / 4,
        (3 * this._width) / 4,
        (3 * this._height) / 4
      )

    const r = PIN_RADIUS
    const width = 2 * r
    const height = 2 * r

    const input = type === 'input'
    const output = type === 'output'

    const active = false

    const shape = 'circle'

    const color = this._get_exposed_sub_pin_color(type)

    this._sim_add_node(ext_pin_node_id, {
      _x: x,
      _y: y,
      x,
      y,
      fx: undefined,
      fy: undefined,
      shape,
      r,
      width,
      height,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      hx: 0,
      hy: 0,
      layer: LAYER_EXPOSED,
    })
    // this._pin_nodes[ext_pin_node_id] = this._nodes[ext_pin_node_id]
    this._node_type[ext_pin_node_id] = 'e'
    this._node_layer[ext_pin_node_id] = LAYER_EXPOSED

    const node = this._node[ext_pin_node_id]

    this._exposed_node[ext_pin_node_id] = node
    this._exposed_ext_node[ext_pin_node_id] = node

    const pin_node = this._node_comp[ext_pin_node_id]
    const pin_node_content = this._node_content[ext_pin_node_id]

    const pin = this._create_pin({
      className: classnames('pin', type),
      r,
      style: {
        borderColor: active ? this._theme.data : color,
        backgroundColor: input ? 'none' : active ? this._theme.data : color,
      },
      shape,
    })
    this._pin[ext_pin_node_id] = pin
    pin_node_content.appendChild(pin)

    const pin_selection = this._create_selection(ext_pin_node_id, {
      width,
      height,
      shape,
      stroke: NONE,
    })
    pin.appendChild(pin_selection)

    const pin_area = this._create_touch_area({
      className: 'pin-area',
      width,
      height,
      style: {
        borderRadius: '50%',
      },
    })
    pin.appendChild(pin_area)

    const pin_name = this._create_pin_name({
      className: 'pin-name',
      r,
      style: {
        color,
      },
      // name,
      name: pin_id,
    })
    this._sim_setup_node_name(ext_pin_node_id, pin_name)
    this._pin_name[ext_pin_node_id] = pin_name
    pin.appendChild(pin_name)

    this._zoom_comp.appendChild(pin_node)

    let anchor_node_id: string

    const { unitId, pinId, mergeId } = sub_pin_spec

    if (unitId && pinId) {
      if (pinId === SELF) {
        anchor_node_id = unitId
      } else {
        anchor_node_id = getPinNodeId(unitId, type, pinId)
        this._pin_to_internal[anchor_node_id] = int_pin_node_id
      }
      this._exposed_ext_plugged[ext_pin_node_id] = anchor_node_id
      this._exposed_int_plugged[int_pin_node_id] = anchor_node_id
    } else if (mergeId) {
      anchor_node_id = getMergeNodeId(mergeId)
      this._exposed_ext_plugged[ext_pin_node_id] = anchor_node_id
      this._exposed_int_plugged[int_pin_node_id] = anchor_node_id
      this._pin_to_internal[anchor_node_id] = int_pin_node_id
    } else {
      const int_pin_position =
        position.int || randomInRadius(x, y, LINK_DISTANCE)
      this._sim_add_internal_pin(type, pin_id, sub_pin_id, int_pin_position)
      anchor_node_id = int_pin_node_id
      this._exposed_ext_unplugged[ext_pin_node_id] = true
      this._exposed_int_unplugged[int_pin_node_id] = true
    }

    const link_id_source_id = input ? ext_pin_node_id : int_pin_node_id
    const link_id_target_id = input ? int_pin_node_id : ext_pin_node_id
    const link_id = getLinkId(link_id_source_id, link_id_target_id)

    const source_id = input ? ext_pin_node_id : anchor_node_id
    const target_id = input ? anchor_node_id : ext_pin_node_id

    const anchor_shape = this._get_node_shape(anchor_node_id)
    const anchor_r = this._get_node_r(anchor_node_id)

    const ARROW_SHAPE = describeArrowShape(anchor_shape, anchor_r)

    const start_d = input ? '' : ARROW_SHAPE
    const end_d = input ? `${functional ? ARROW_MEMORY : ''}${ARROW_SHAPE}` : ''
    const marker_style = {
      fill: 'none',
      strokeWidth: '1',
      stroke: color,
      transition: `d ${ANIMATION_T}s linear`,
    }
    const start_marker = new SVGPath({ d: start_d, style: marker_style })
    this._exposed_link_start_marker[ext_pin_node_id] = start_marker
    const end_marker = new SVGPath({ d: end_d, style: marker_style })
    this._exposed_link_end_marker[ext_pin_node_id] = end_marker

    const padding = {
      target: input ? -1.5 : output ? 0 : 0,
      source: input ? 0 : output ? -1.5 : 0,
    }

    const pin_link = this._sim_add_link(
      link_id,
      {
        source_id,
        target_id,
        d: EXPOSED_LINK_DISTANCE,
        s: 1,
        padding,
        detail: {
          type: 'e',
        },
      },
      {
        text: '',
        stroke: color,
        strokeWidth: 1,
        strokeDasharray: 0,
        startMarker: start_marker,
        endMarker: end_marker,
      }
    )

    this._exposed_link[link_id] = this._link[link_id]
    this._link_layer[link_id] = LAYER_EXPOSED

    this._zoom_comp.appendChild(pin_link, 'svg')

    this._start_graph_simulation(LAYER_EXPOSED)
  }

  private _sim_add_internal_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    { x, y }: Position
  ): void => {
    const int_pin_node_id = getInternalNodeId(type, pin_id, sub_pin_id)

    const r = PIN_RADIUS
    const width = 2 * r
    const height = 2 * r

    const shape = 'circle'

    this._sim_add_node(int_pin_node_id, {
      _x: x,
      _y: y,
      x,
      y,
      fx: undefined,
      fy: undefined,
      shape,
      r,
      width,
      height,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      hx: 0,
      hy: 0,
      layer: LAYER_EXPOSED,
    })
    // this._pin_nodes[int_pin_node_id] = this._nodes[int_pin_node_id]
    this._node_type[int_pin_node_id] = 'i'
    this._node_layer[int_pin_node_id] = LAYER_EXPOSED

    const node = this._node[int_pin_node_id]

    this._exposed_node[int_pin_node_id] = node
    this._exposed_int_node[int_pin_node_id] = node

    const internal_pin_node = this._node_comp[int_pin_node_id]
    const internal_pin_node_content = this._node_content[int_pin_node_id]

    const internal_pin_el = this._create_pin({
      className: classnames('pin', type),
      r,
      style: {},
      shape,
    })
    this._pin[int_pin_node_id] = internal_pin_el
    internal_pin_node_content.appendChild(internal_pin_el)

    const internal_pin_area = this._create_touch_area({
      className: 'pin-area',
      width,
      height,
      style: {
        borderRadius: '50%',
      },
    })
    internal_pin_el.appendChild(internal_pin_area)

    const internal_pin_selection = this._create_selection(int_pin_node_id, {
      width,
      height,
      shape,
      stroke: NONE,
    })
    internal_pin_el.appendChild(internal_pin_selection)

    this._zoom_comp.appendChild(internal_pin_node)
  }

  private _pod_add_exposed_pin = (
    type: 'input' | 'output',
    id: string,
    subPinId: string,
    subPin: GraphExposedSubPinSpec
  ): void => {
    this._pod.$exposePin({
      type,
      id,
      subPinId,
      subPin,
    })
  }

  private _swap_sim_unit = (unit_id: string, unit_spec: string) => {
    // TODO
  }

  private _merge_pin_line_vector = (merge_node_id: string): Position => {
    const merge_node = this._node[merge_node_id]
    const merge_to_pin = this._merge_to_pin[merge_node_id]

    const { _x: x, _y: y } = merge_node

    let count = 0
    let sx = 0
    let sy = 0
    for (let merge_pin_node_id in merge_to_pin) {
      const { unitId } = segmentLinkPinNodeId(merge_pin_node_id)
      const unit = this._node[unitId]
      const p = unitVector(unit._x, unit._y, x, y)
      sx += p.x
      sy += p.y
      count++
    }

    const mx = sx / count
    const my = sy / count

    const m = { x: mx, y: my }

    // const amx = Math.abs(mx)
    // const amy = Math.abs(my)
    // if (amx >= 0 && amx < 0.1 && amy >= 0 && amy < 0.1) {
    //   return { x: 0, y: -1 }
    // }

    if (mx === 0 && my === 0) {
      return { x: 0, y: -1 }
    }

    const u = normalize(m)

    return u
  }

  private _link_pin_line_vector = (pin_node_id: string): Position => {
    // [ASSUMPTION]
    // unit and pin nodes' are visible
    const { unitId } = segmentLinkPinNodeId(pin_node_id)
    const unit_node = this._node[unitId]
    const pin_node = this._node[pin_node_id]
    const u = unitVector(unit_node._x, unit_node._y, pin_node._x, pin_node._y)
    return u
  }

  private _pin_line_vector = (pin_node_id: string): Position => {
    if (this._is_merge_node_id(pin_node_id)) {
      return this._merge_pin_line_vector(pin_node_id)
    } else {
      return this._link_pin_line_vector(pin_node_id)
    }
  }

  private _pin_line_position = (pin_node_id: string, D: number): Position => {
    const u = this._pin_line_vector(pin_node_id)
    const pin = this._node[pin_node_id]
    const x = pin.x + u.x * D
    const y = pin.y + u.y * D
    return { x, y }
  }

  private _err_initial_position = (unit_id: string): Position => {
    const { x, y, height } = this._node[unit_id]
    return { x, y: y - height / 2 - ERR_LINK_DISTANCE }
  }

  private _pin_datum_initial_position = (pin_node_id: string): Position => {
    return this._pin_line_position(pin_node_id, DATA_LINK_DISTANCE)
  }

  private _pin_type_initial_position = (pin_node_id: string): Position => {
    const u = this._pin_line_vector(pin_node_id)
    const { x, y } = this._node[pin_node_id]
    const type_tree: TreeNode = this._get_pin_type(pin_node_id)
    const { width, height } = this._get_datum_tree_size(type_tree)
    const S = centerToSurfaceDistance(
      {
        width,
        height,
        x,
        y,
        r: width / 2,
        shape: 'rect',
      },
      u
    )
    const R = randomUnitVector()
    const d = TYPE_LINK_DISTANCE + S
    return {
      // x: x + u.x * d + R.x,
      x,
      y: y - d - R.y,
    }
  }

  private _find_merge_pin = (
    merge_node_id: string,
    predicate: (pin_node_id: string) => boolean = () => true
  ): string | null => {
    const pins = this._merge_to_pin[merge_node_id]
    for (let pin_node_id in pins) {
      if (predicate(pin_node_id)) {
        return pin_node_id
      }
    }
    return null
  }

  private _pin_type_of_kind = (
    pin_node_id: string,
    kind: 'input' | 'output'
  ): TreeNode => {
    if (this._is_merge_node_id(pin_node_id)) {
      return this._get_merge_pin_type(pin_node_id, kind)
    } else {
      return this._link_pin_type(pin_node_id)
    }
  }

  private _get_merge_pin_type = (
    merge_node_id: string,
    kind: 'input' | 'output'
  ): TreeNode => {
    const merge_ref_unit = this._merge_to_ref_unit[merge_node_id]
    const { id } = segmentMergeNodeId(merge_node_id)
    const merge = this.__get_merge(id)
    return this._get_merge_spec_type(merge, kind)
  }

  private _get_merge_spec_type = (
    merge: GraphMergeSpec,
    kind: Kind
  ): TreeNode => {
    let type: TreeNode = ANY_TREE
    forEachPinOnMerge(merge, (unit_id, _kind, pin_id) => {
      if (_kind === kind) {
        const pin_type = this.__link_pin_type(unit_id, _kind, pin_id)
        type = _moreSpecific(type, pin_type)
      }
    })
    return type
  }

  private _pin_type_cache: TypeTreeMap = {}

  private _link_pin_type = (pin_node_id: string): TreeNode => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    return this.__link_pin_type(unitId, type, pinId)
  }

  private __link_pin_type = (
    unit_id: string,
    kind: Kind,
    pin_id: string
  ): TreeNode => {
    const specs = this._get_specs()

    // TODO invalidate cache when graph is modified (?)
    const graph_type_map = _getGraphTypeMap(
      this._spec,
      specs,
      this._pin_type_cache
    )
    const graph_pin_type = graph_type_map[unit_id][kind][pin_id]
    return graph_pin_type
  }

  private _get_pin_type = (pin_node_id: string): TreeNode => {
    let type_tree: TreeNode
    if (this._is_link_pin_node_id(pin_node_id)) {
      return this._get_link_pin_type(pin_node_id)
    } else {
      type_tree =
        this._pin_type_of_kind(pin_node_id, 'input') ||
        this._pin_type_of_kind(pin_node_id, 'output')
    }
    return type_tree
  }

  private _get_ext_pin_type = (ext_pin_node_id: string): TreeNode => {
    const { type, id } = segmentExposedNodeId(ext_pin_node_id)
    return this.__get_ext_pin_type(type, id)
  }

  private __get_ext_pin_type = (
    type: 'input' | 'output',
    id: string
  ): TreeNode => {
    const pin_spec = this._get_exposed_pin_spec(type, id)
    const { pin = {} } = pin_spec
    let type_tree = getTree('any')
    for (const sub_pin_id in pin) {
      const sub_pin_spec = pin[sub_pin_id]
      const { unitId, mergeId } = sub_pin_spec
      if (unitId || mergeId) {
        const pin_node_id = getSubPinSpecNodeId(type, sub_pin_spec)
        const sub_pin_type: TreeNode = this._get_pin_type(pin_node_id)
        type_tree = _moreSpecific(type_tree, sub_pin_type)
      }
    }
    return type_tree
  }

  private _get_link_pin_type = (pin_node_id: string): TreeNode => {
    const { type, pinId } = segmentLinkPinNodeId(pin_node_id)
    if (type === 'output' && pinId === SELF) {
      return ANY_TREE
    }
    const type_tree = this._pin_type_of_kind(pin_node_id, type)
    return type_tree
  }

  private _sim_add_pin_type = (
    pin_node_id: string,
    { x, y }: Position
  ): void => {
    const type_node_id = getTypeNodeId(pin_node_id)

    const shape = 'rect'

    const type_tree: TreeNode = this._get_pin_type(pin_node_id)

    let { width, height } = this._get_datum_tree_size(type_tree)
    const r = width / 2

    const type_node_el = this._sim_add_node(type_node_id, {
      _x: x,
      _y: y,
      x,
      y,
      fx: undefined,
      fy: undefined,
      shape,
      r,
      width,
      height,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      hx: 0,
      hy: 0,
      layer: LAYER_TYPE,
    })
    this._node_type[type_node_id] = 't'
    this._node_layer[type_node_id] = LAYER_TYPE

    const node = this._node[type_node_id]
    this._type_node[type_node_id] = node

    const type_datum = new DataTree({
      style: {},
      data: type_tree,
    })
    this._type[type_node_id] = type_datum

    const type_container = new Div({
      className: 'graph-type',
      style: {
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'overlay',
        color: this._theme.type,
        pointerEvents: 'none',
      },
    })
    type_container.appendChild(type_datum)
    this._type_container[type_node_id] = type_container

    const node_content = this._node_content[type_node_id]

    const type_selection = this._create_selection(type_node_id, {
      width,
      height,
      shape,
      stroke: NONE,
    })

    node_content.appendChild(type_selection)
    node_content.appendChild(type_container)

    this._zoom_comp.appendChild(type_node_el)

    const link_id = getLinkId(type_node_id, pin_node_id)

    const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)

    // const hidden = true
    const hidden = false

    const d = TYPE_LINK_DISTANCE

    const type_link = this._sim_add_link(
      link_id,
      {
        source_id: type_node_id,
        target_id: anchor_node_id,
        d,
        s: 1,
        padding: {
          source: -6,
          target: -6,
        },
        detail: {
          type: 't',
        },
      },
      {
        stroke: this._theme.sub_text,
        strokeWidth: 1,
        hidden,
      }
    )

    // AD HOC
    const link_comp = this._link_comp[link_id]
    // mergeStyle(link_comp, {
    //   pointerEvents: 'none',
    // })
    link_comp.$element.style.pointerEvents = 'none'

    this._type_link[link_id] = this._link[link_id]
    this._link_layer[link_id] = LAYER_TYPE

    this._zoom_comp.appendChild(type_link, 'svg')

    this._start_graph_simulation(LAYER_TYPE)
  }

  private _sim_add_pin_type_node = (
    pin_node_id: string,
    { x, y }: Position
  ) => {}

  private _sim_add_pin_type_link = (
    pin_node_id: string,
    { x, y }: Position
  ) => {}

  private _create_layout_layer = ({
    className,
    style = {},
  }: {
    className: string
    style: Dict<any>
  }): { layer: Div; height: Div; children: Div; layers: Div } => {
    const layer = new Div({
      className,
      style: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: '0',
        left: '0',
        flexWrap: 'wrap',
        // padding: `${LAYOUT_VERTICAL_PADDING}px ${LAYOUT_HORIZONTAL_PADDING}px ${LAYOUT_VERTICAL_PADDING}px ${LAYOUT_HORIZONTAL_PADDING}px`,
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: `opacity ${ANIMATION_T}s linear`,
        // touchAction: 'none',
        ...style,
      },
    })

    const height = new Div({
      className: `${className}-height`,
      style: {
        position: 'absolute',
        pointerEvents: 'none',
      },
    })
    layer.appendChild(height)

    const children = new Div({
      className: `${className}-children`,
      style: {
        position: 'absolute',
        overflowY: 'hidden',
        overflowX: 'unset',
      },
    })
    layer.appendChild(children)

    const layers = new Div({
      className: `${className}-layers`,
      style: {
        position: 'absolute',
        pointerEvents: 'none',
      },
    })
    layer.appendChild(layers)

    return { layer, height, children, layers }
  }

  private _create_touch_area = ({
    className,
    width,
    height,
    style,
  }: AreaOpt): Div => {
    const area = new Div({
      className,
      style: {
        width: `${width + NODE_PADDING}px`,
        height: `${height + NODE_PADDING}px`,
        zIndex: '-1',
        backgroundColor: NONE,
        // backgroundColor: setAlpha(randomColorString(), 0.5),
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        ...style,
      },
    })
    return area
  }

  private _sim_add_link_pin_node = (
    unit_id: string,
    type: 'input' | 'output',
    pin_id: string,
    { x, y }: Position
  ): void => {
    const pin_node_id = getPinNodeId(unit_id, type, pin_id)

    const input = type === 'input'
    const output = !input
    const ignored = this._is_link_pin_ignored(pin_node_id)
    const ref = this._is_link_pin_ref(pin_node_id)
    const init = this._is_link_pin_init(pin_node_id)

    let r = PIN_RADIUS

    let shape: Shape = 'circle'

    // shape = "rect"

    if (init) {
      r -= 2
    }

    const ref_output = ref && output

    let pin_icon_name: string | null = null

    if (ref_output) {
      const spec = this._get_unit_spec(unit_id)
      const pin_spec = this._get_unit_pin_spec(pin_node_id)

      const { pin } = pin_spec as GraphExposedPinSpec

      if (pin) {
        // assume a ref output can only
        const sub_pin_id = getObjSingleKey(pin)
        const sub_pin = pin[sub_pin_id]
        const { unitId, pinId, mergeId } = sub_pin
        const { units = {} } = spec as GraphSpec

        let ref_unit_id: string
        if (unitId && pinId) {
          ref_unit_id = unitId
        } else {
          const { merges = {}, units = {} } = spec as GraphSpec
          const merge = merges[mergeId]
          for (const unitId in merge) {
            const mergeUnit = merge[unitId]
            const { output = {} } = mergeUnit
            for (const output_id in output) {
              ref_unit_id = unitId
              break
            }
          }
        }

        const unit = units[ref_unit_id]

        const { path } = unit
        const unit_spec = getSpec(path)
        const unit_component = isComponent(path)
        const unit_r = getSpecRadiusById(path)
        if (unit_component) {
          shape = 'rect'
        }
        // r = 0.8 * unit_r
        r = unit_r
        pin_icon_name = unit_spec.metadata?.icon || 'circle'
      } else {
        // assume it is a primitive
        // r = 0.8 * UNIT_MIN_RADIUS
        r = UNIT_MIN_RADIUS
        const { icon, component } = pin_spec
        pin_icon_name = icon || 'circle'
        if (component) {
          shape = 'rect'
        }
      }
    }

    let width = 2 * r
    let height = 2 * r

    const datum_node_id = this._pin_to_datum[pin_node_id]
    const merge_node_id = this._pin_to_merge[pin_node_id]

    const active = !!datum_node_id || (merge_node_id && ref)

    this._sim_add_node(pin_node_id, {
      _x: x,
      _y: y,
      x,
      y,
      fx: undefined,
      fy: undefined,
      shape,
      r,
      width,
      height,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      hx: 0,
      hy: 0,
      layer: ignored ? LAYER_IGNORED : LAYER_NORMAL,
    })
    this._node_layer[pin_node_id] = ignored ? LAYER_IGNORED : LAYER_NORMAL

    const node = this._node[pin_node_id]

    this._pin_node[pin_node_id] = node

    if (ignored) {
      this._ignored_node[pin_node_id] = node
    } else {
      this._normal_node[pin_node_id] = node
    }

    const pin_node = this._node_comp[pin_node_id]
    const pin_node_content = this._node_content[pin_node_id]

    const opacity = ignored ? (this._mode === 'add' ? '0.5' : `0`) : `1`

    const pin_border_color =
      ref && input ? NONE : active ? this._theme.data : this._theme.node

    const pin_background_color =
      input || ref_output
        ? 'none'
        : active
        ? this._theme.data
        : this._theme.node

    const pin = this._create_pin({
      className: classnames('pin', type),
      r,
      style: {
        borderColor: pin_border_color,
        backgroundColor: pin_background_color,
        opacity,
      },
      shape,
    })
    this._pin[pin_node_id] = pin
    pin_node_content.appendChild(pin)

    const pin_name = this._create_pin_name({
      className: 'pin-name',
      r,
      style: {
        color: this._theme.pin_text,
        opacity,
      },
      // name: pin_spec_name,
      name: pin_id,
    })
    this._pin_name[pin_node_id] = pin_name
    pin_node_content.appendChild(pin_name)

    this._sim_setup_node_name(pin_node_id, pin_name)

    if (ref_output) {
      const ref_output_pin_icon = new Icon({
        icon: pin_icon_name,
        className: 'pin-icon',
        style: {
          position: 'absolute',
          width: `${r}px`,
          height: `${r}px`,
          top: '50%',
          left: '50%',
          // fill: 'currentColor',
          stroke: 'currentColor',
          color: 'currentColor',
          transform: 'translate(-50%, -50%)',
        },
      })
      this._ref_output_pin_icon[pin_node_id] = ref_output_pin_icon
      pin.appendChild(ref_output_pin_icon)
    }

    const pin_selection = this._create_selection(pin_node_id, {
      width,
      height,
      shape,
      stroke: NONE,
      className: 'pin-selection',
    })
    pin.appendChild(pin_selection)

    const pin_area = this._create_touch_area({
      className: 'pin-area',
      width,
      height,
      style: {
        borderRadius: '50%',
      },
    })
    pin.appendChild(pin_area)

    this._zoom_comp.appendChild(pin_node)

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _hide_datum = (datum_node_id: string): void => {
    if (this._hidden_data_node[datum_node_id]) {
      return
    }
    // console.log('Graph', '_hide_datum', datum_node_id)

    this._hidden_data_node[datum_node_id] = this._node[datum_node_id]
    delete this._visible_data_node[datum_node_id]

    const datum_node_content = this._node_content[datum_node_id]
    // mergeStyle(datum_node_content, {
    //   display: 'none',
    // })
    datum_node_content.$element.style.display = 'none'

    const pin_node_id = this._datum_to_pin[datum_node_id]
    if (pin_node_id) {
      const datum_link_id = getLinkId(datum_node_id, pin_node_id)

      delete this._visible_data_link[datum_link_id]
      delete this._visible_linked_data_node[datum_node_id]
      delete this._visible_unlinked_data_node[datum_node_id]

      const datum_link_comp = this._link_comp[datum_link_id]
      // mergeStyle(datum_link_comp, {
      //   display: 'none',
      // })
      datum_link_comp.$element.style.display = 'none'
    }
  }

  private _refresh_datum_visible = (datum_node_id: string): void => {
    // console.log('Graph', '_refresh_datum_visible', datum_node_id)
    if (this._should_hide_datum(datum_node_id)) {
      this._hide_datum(datum_node_id)
    } else {
      this._show_datum(datum_node_id)
    }
  }

  private _show_datum = (datum_node_id: string): void => {
    if (!this._hidden_data_node[datum_node_id]) {
      return
    }
    // console.log('Graph', '_show_datum', datum_node_id)

    const pin_node_id = this._datum_to_pin[datum_node_id]

    if (this._invalid_datum_node_id[datum_node_id]) {
      const data = this._invalid_datum_data[datum_node_id]
      delete this._invalid_datum_data[datum_node_id]
      delete this._invalid_datum_node_id[datum_node_id]
      this.__graph_debug_set_pin_data(pin_node_id, datum_node_id, data)
    }

    delete this._hidden_data_node[datum_node_id]
    this._visible_data_node[datum_node_id] = this._node[datum_node_id]

    const datum_node_content = this._node_content[datum_node_id]
    // mergeStyle(datum_node_content, {
    //   display: 'block',
    // })
    datum_node_content.$element.style.display = 'block'

    if (pin_node_id) {
      const datum_link_id = getLinkId(datum_node_id, pin_node_id)

      this._visible_data_link[datum_link_id] = this._link[datum_link_id]
      this._link_layer[datum_link_id] = LAYER_DATA_LINKED

      const datum_node = this._node[datum_node_id]
      if (this._linked_data_node[datum_node_id]) {
        this._visible_linked_data_node[datum_node_id] = datum_node
        this._set_node_layer(datum_node_id, LAYER_DATA_LINKED)
      } else {
        this._visible_unlinked_data_node[datum_node_id] = datum_node
        this._set_node_layer(datum_node_id, LAYER_DATA)
      }

      const datum_link_comp = this._link_comp[datum_link_id]
      // mergeStyle(datum_link_comp, {
      //   display: 'block',
      // })
      datum_link_comp.$element.style.display = 'block'
    }

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _sim_add_link_pin_link = (
    unit_id: string,
    type: 'input' | 'output',
    pin_id: string
  ): void => {
    // console.log('Graph', '_sim_add_link_pin_link', unit_id, type, pin_id)
    const pin_node_id = getPinNodeId(unit_id, type, pin_id)

    const ignored = this._is_link_pin_ignored(pin_node_id)
    const ref = this._is_link_pin_ref(pin_node_id)
    const init = this._is_link_pin_init(pin_node_id)

    const unit_pin_spec: GraphUnitPinSpec = this._get_graph_unit_pin_spec(
      unit_id,
      type,
      pin_id
    )
    const { constant, memory } = unit_pin_spec

    if (constant) {
      this._link_pin_constant_count++
    }

    if (memory) {
      this._link_pin_memory_count++
    }

    const pin_spec_name: string = pin_id

    const input = type === 'input'
    const output = !input

    const datum_node_id = this._pin_to_datum[pin_node_id]

    const merge_node_id = this._pin_to_merge[pin_node_id]
    const merge_unit_id =
      merge_node_id && this._merge_to_ref_unit[merge_node_id]

    const active = !!datum_node_id || (merge_unit_id && ref)

    const stroke = active
      ? ref || init
        ? this._theme.data
        : this._theme.data_link
      : ref || init
      ? this._theme.node
      : this._theme.link

    const anchor_id = this._get_pin_anchor_node_id(pin_node_id)
    const source_id = input ? anchor_id : unit_id
    const target_id = input ? unit_id : anchor_id

    const merged = this._is_link_pin_merged(pin_node_id)

    const pin_link_text = pin_spec_name
    const pin_link_text_hidden = !merged
    const pin_link_stroke_dash_array = constant ? 3 : 0
    const pin_link_stroke = stroke
    const pin_link_stroke_width = ref || memory || init ? 1 : 3
    const pin_link_opacity = ignored ? (this._mode === 'add' ? 0.5 : 0) : 1
    const pin_link_start_marker_d = ref && input ? ARROW_SEMICIRCLE : ''
    const pin_link_start_marker_hidden = ref && input && merge_unit_id
    const pin_link_start_marker = new SVGPath({
      d: pin_link_start_marker_d,
      style: {
        display: pin_link_start_marker_hidden ? 'none' : 'block',
        fill: 'none',
        strokeWidth: '1',
        stroke,
      },
    })
    this._pin_link_start_marker[pin_node_id] = pin_link_start_marker

    const pin_link_end_marker_d = init
      ? ARROW_NONE
      : ref || memory
      ? ARROW_MEMORY
      : ARROW_NORMAL

    const pin_link_end_marker_fill = ref || memory ? 'none' : pin_link_stroke
    const pin_link_end_marker_stroke = ref || memory ? pin_link_stroke : 'none'
    const pin_link_end_marker_stroke_width = ref || memory ? '1px' : '0'
    const pin_link_end_marker = new SVGPath({
      d: pin_link_end_marker_d,
      style: {
        fill: pin_link_end_marker_fill,
        stroke: pin_link_end_marker_stroke,
        strokeWidth: pin_link_end_marker_stroke_width,
      },
    })
    this._pin_link_end_marker[pin_node_id] = pin_link_end_marker

    // const d = LINK_DISTANCE
    let d = ignored ? LINK_DISTANCE_IGNORED : LINK_DISTANCE

    if (init) {
      d /= 2
    }

    const padding = {
      source: 0.5,
      target: -5.75,
    }

    // if (ref && input && !merged) {
    if (ref && input) {
      padding.source = -1.5
    }

    if (ref || memory) {
      padding.target = -1
    }

    if (init) {
      padding.target = 0
    }

    if (output && merged) {
      const output_merge = this._is_output_merge(merge_node_id)
      if (!output_merge) {
        padding.target = -6
      }
    }

    const link_id = getLinkId(
      input ? pin_node_id : unit_id,
      input ? unit_id : pin_node_id
    )

    let s = 1

    const pin_link = this._sim_add_link(
      link_id,
      {
        source_id,
        target_id,
        d,
        s,
        padding,
        detail: {
          type: 'p',
        },
      },
      {
        text: pin_link_text,
        textHidden: pin_link_text_hidden,
        stroke: pin_link_stroke,
        strokeWidth: pin_link_stroke_width,
        strokeDasharray: pin_link_stroke_dash_array,
        startMarker: pin_link_start_marker,
        endMarker: pin_link_end_marker,
        opacity: pin_link_opacity,
      }
    )

    const link = this._link[link_id]

    if (ignored) {
      this._ignored_link[link_id] = link
      this._link_layer[link_id] = LAYER_IGNORED
    } else {
      this._pin_link[link_id] = link
      this._link_layer[link_id] = LAYER_NORMAL
    }

    this._zoom_comp.appendChild(pin_link, 'svg')
  }

  private _sim_add_node = (node_id: string, node: GraphSimNode): Div => {
    // console.log('Graph', '_sim_add_node', node_id)
    const { x, y, width, height } = node

    const node_comp = new Div({
      id: node_id,
      className: 'node',
      style: {
        position: 'absolute',
        transform: `translate(${x}px, ${y}px)`,
        width: '0',
        height: '0',
      },
    })

    this._node_unlisten[node_id] = this._listen_node(node_id, node_comp)

    this._node_comp[node_id] = node_comp

    const node_content = new Div({
      className: 'node-content',
      style: {
        position: 'absolute',
        width: 'fit-content',
        height: 'fit-content',
        transform: `translate(-${width / 2}px, -${height / 2}px)`,
      },
    })
    this._node_content[node_id] = node_content

    node_comp.appendChild(node_content)

    this._node[node_id] = node

    add_node_to_graph(this._node_graph, node_id)

    this._rebuild_subgraph()

    return node_comp
  }

  public add_merge = (
    merge_id: string,
    merge: GraphMergeSpec,
    position: Position
  ): void => {
    this._add_merge(merge_id, merge, position)
    this._dispatchAction(addMerge(merge_id, merge))
  }

  private _add_merge = (
    merge_id: string,
    merge: GraphMergeSpec,
    position: Position
  ): void => {
    // console.log('Graph', '_add_merge')
    const merge_node_id = getMergeNodeId(merge_id)

    this._state_add_merge(merge_id, merge, position)
    this._pod_add_merge(merge_id, merge)

    // TODO
    // _ui_add_merge (?)
    this._refresh_ref_merge_active(merge_node_id)
  }

  private _refresh_ref_merge_active = (merge_node_id: string): void => {
    const merge_unit_id = this._merge_to_ref_unit[merge_node_id]
    if (merge_unit_id) {
      this._refresh_core_border_color(merge_unit_id)
    }

    const merge_pin_node_id = this._merge_to_pin[merge_node_id]
    for (const pin_node_id in merge_pin_node_id) {
      const { unitId, type } = segmentLinkPinNodeId(pin_node_id)
      if (type === 'input') {
        this._refresh_link_pin_link_color(pin_node_id)
      }
      this._refresh_core_border_color(unitId)
    }
  }

  private _spec_add_merge = (merge_id: string, merge: GraphMergeSpec): void => {
    this._spec = specReducer.addMerge({ id: merge_id, merge }, this._spec)
  }

  private _state_add_merge = (
    merge_id: string,
    merge: GraphMergeSpec,
    position: Position
  ): void => {
    // console.log('Graph', '_state_add_merge')
    this._sim_add_merge(merge_id, merge, position)
    this._spec_add_merge(merge_id, merge)
  }

  private _sim_add_merge = (
    merge_id: string,
    merge: GraphMergeSpec,
    position?: Position
  ): void => {
    // console.log('Graph', '_sim_add_merge', merge_id, merge)
    const merge_node_id = getMergeNodeId(merge_id)

    let merge_ref = false
    let merge_unit_id: string | undefined

    this._merge_to_pin[merge_node_id] = {}
    this._merge_to_input[merge_node_id] = {}
    this._merge_to_output[merge_node_id] = {}
    this._merge_pin_count[merge_id] = 0
    this._merge_input_count[merge_id] = 0
    this._merge_output_count[merge_id] = 0

    const merge_input_unit: Dict<boolean> = {}
    const merge_output_unit: Dict<boolean> = {}

    const merge_exposed_set = new Set<{ type; id; subPinId }>()

    let merge_ref_output_id: string | null = null
    let merge_output_ref: boolean = false

    for (let unit_id in merge) {
      const unit = merge[unit_id]
      const { input = {}, output = {} } = unit

      if (Object.keys(input).length > 0) {
        merge_input_unit[unit_id] = true
      }
      if (Object.keys(output).length > 0) {
        merge_output_unit[unit_id] = true
      }

      for (let input_id in input) {
        const input_node_id = getPinNodeId(unit_id, 'input', input_id)

        if (!merge_ref) {
          const input_ref = this._is_link_pin_ref(input_node_id)
          merge_ref = merge_ref || input_ref
        }

        const int_node_id = this._pin_to_internal[input_node_id]
        if (int_node_id) {
          const { id, subPinId } = segmentExposedNodeId(int_node_id)
          this._sim_unplug_exposed_pin('input', id, subPinId)
          merge_exposed_set.add({ type: 'input', id, subPinId })
        }
      }

      for (let output_id in output) {
        const output_node_id = getPinNodeId(unit_id, 'output', output_id)

        if (output_id === SELF) {
          merge_unit_id = unit_id

          this._merge_to_ref_unit[merge_node_id] = merge_unit_id
          this._ref_unit_to_merge[merge_unit_id] = merge_node_id
        } else {
          if (!merge_ref_output_id) {
            const output_ref = this._is_link_pin_ref(output_node_id)
            if (output_ref) {
              merge_ref_output_id = output_node_id
              merge_ref = true

              this._ref_output_to_merge[merge_ref_output_id] = merge_node_id
              this._merge_to_ref_output[merge_node_id] = merge_ref_output_id
            }
          }
        }

        const int_node_id = this._pin_to_internal[output_node_id]
        if (int_node_id) {
          const { id, subPinId } = segmentExposedNodeId(int_node_id)
          this._sim_unplug_exposed_pin('output', id, subPinId)
          merge_exposed_set.add({ type: 'output', id, subPinId })
        }
      }
    }

    this._merge_ref[merge_node_id] = merge_ref

    // if (merge_unit_id) {
    //   this._merge_to_ref_unit[merge_node_id] = merge_unit_id
    //   this._ref_unit_to_merge[merge_unit_id] = merge_node_id
    // }

    // if (merge_ref_output_id) {
    //   this._ref_output_to_merge[merge_ref_output_id] = merge_node_id
    //   this._merge_to_ref_output[merge_node_id] = merge_ref_output_id
    // }

    this._node_type[merge_node_id] = 'm'

    if (!merge_unit_id && !merge_ref_output_id) {
      this._sim_add_merge_pin_node(merge_id, position)
    }

    for (const { type, id, subPinId } of merge_exposed_set) {
      this._sim_plug_exposed_pin(type, id, subPinId, { mergeId: merge_id })
    }

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _sim_add_merge_pin_node = (merge_id: string, { x, y }: Position) => {
    const merge_node_id = getMergeNodeId(merge_id)

    const r = PIN_RADIUS
    const width = 2 * r
    const height = 2 * r

    const input_count = this._merge_input_count[merge_id]
    const output_count = this._merge_output_count[merge_id]

    const input_merge = output_count === 0
    const output_merge = input_count === 0

    // TODO
    const spot_output = false
    const spot_input = false

    const shape = 'circle'
    // const shape = "rect"

    this._sim_add_node(merge_node_id, {
      _x: x,
      _y: y,
      x,
      y,
      fx: undefined,
      fy: undefined,
      shape,
      r,
      width,
      height,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      hx: 0,
      hy: 0,
      layer: LAYER_NORMAL,
    })
    this._node_layer[merge_node_id] = LAYER_NORMAL

    const node = this._node[merge_node_id]
    this._pin_node[merge_node_id] = node
    this._normal_node[merge_node_id] = node

    const merge_node = this._node_comp[merge_node_id]
    const merge_node_content = this._node_content[merge_node_id]

    const merge_ref = this._merge_ref[merge_node_id]

    const merge = new Div({
      className: 'pin',
      style: {
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: shape === 'circle' ? '50%' : '0',
        boxSizing: 'border-box',
      },
    })
    this._merge[merge_node_id] = merge
    merge_node_content.appendChild(merge)

    const merge_selection = this._create_selection(merge_node_id, {
      width,
      height,
      shape,
      stroke: NONE,
    })
    merge.appendChild(merge_selection)

    const merge_input_visibility = output_merge ? 'hidden' : 'visible'
    const merge_input_color = merge_ref ? NONE : this._theme.node
    const merge_input = this._create_pin({
      className: 'merge-input',
      style: {
        visibility: merge_input_visibility,
        borderColor: merge_input_color,
      },
      r,
      shape,
    })
    this._merge_input[merge_node_id] = merge_input
    merge.appendChild(merge_input)

    const merge_output_reduced = !spot_output && !output_merge && !merge_ref
    const merge_output_visibility = input_merge ? 'hidden' : 'visible'
    const merge_output_r = merge_output_reduced ? r - 2 : r
    const merge_output_color = this._theme.node
    const merge_output = this._create_pin({
      className: 'merge-output',
      style: {
        // position: 'absolute',
        visibility: merge_output_visibility,
        backgroundColor: merge_output_color,
        color: merge_output_color,
        borderColor: merge_output_color,
        transform: merge_output_reduced ? `translate(${2}px, ${2}px)` : '',
      },
      r: merge_output_r,
      shape,
    })
    this._merge_output[merge_node_id] = merge_output
    merge.appendChild(merge_output)

    const merge_area = this._create_touch_area({
      className: 'merge-area',
      width,
      height,
      style: {
        borderRadius: '50%',
      },
    })
    merge.appendChild(merge_area)

    this._zoom_comp.appendChild(merge_node)
  }

  private _pod_add_merge = (merge_id: string, merge: GraphMergeSpec): void => {
    // console.log('Graph', '_pod_add_merge', merge_id)
    this._pod.$addMerge({
      id: merge_id,
      merge,
    })
  }

  public add_datum = (datum_id: string, value: string, position: Position) => {
    this._add_datum(datum_id, value, position)
    this._dispatchAction(setDatum(datum_id, value))
  }

  private _add_datum = (
    datum_id: string,
    value: string,
    position: Position
  ) => {
    this._sim_add_datum_node(datum_id, value, position)
  }

  private _sim_add_datum_node = (
    datum_id: string,
    value: string,
    { x, y }: Position
  ): void => {
    // console.log('Graph', '_sim_add_datum_node', datum_id, value)
    const tree = _getValueTree(value)

    this._datum_tree[datum_id] = tree

    const datum_node_id = getDatumNodeId(datum_id)

    const shape = this._get_datum_tree_shape(tree)

    let { width, height } = this._get_datum_tree_size(tree)
    const r = width / 2

    const datum_node = this._sim_add_node(datum_node_id, {
      _x: x,
      _y: y,
      x,
      y,
      fx: undefined,
      fy: undefined,
      shape,
      r,
      width,
      height,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      hx: 0,
      hy: 0,
      layer: LAYER_DATA,
    })
    const node = this._node[datum_node_id]

    this._node_type[datum_node_id] = 'd'
    this._node_layer[datum_node_id] = LAYER_DATA
    this._data_node[datum_node_id] = node

    this._visible_data_node[datum_node_id] = node

    this._unlinked_data_node[datum_node_id] = node
    this._visible_unlinked_data_node[datum_node_id] = node

    const valid = _isValidValue(tree)

    const color = valid ? this._theme.data : this._theme.type

    const datum_class_literal: boolean = tree.type === TreeNodeType.Unit

    const datum_container = new Div({
      className: classnames('graph-datum', {
        valid,
      }),
      style: {
        display: 'flex',
        width: `${width}px`,
        height: `${height}px`,
        overflow: datum_class_literal ? 'hidden' : 'auto',
        scrollbarColor: color,
        color,
        touchAction: 'none',
      },
    })
    this._datum_container[datum_node_id] = datum_container

    const node_content = this._node_content[datum_node_id]

    const datum_selection = this._create_selection(datum_node_id, {
      width,
      height,
      shape,
      stroke: NONE,
    })

    const datum_area = this._create_touch_area({
      className: 'datum-area',
      width,
      height,
    })
    this._datum_area[datum_node_id] = datum_area

    let datum: Datum | any
    if (datum_class_literal) {
      datum = new Class({
        id: value,
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      })
      const unlisten = NOOP
      this._datum_unlisten[datum_id] = unlisten
    } else {
      datum = new Datum({
        style: {},
        data: tree,
      })
      const unlisten = datum.addEventListeners([
        makeCustomListener('datumchange', (event) => {
          this._on_datum_change(datum_id, event)
        }),
        makeCustomListener('datumblur', (event) => {
          this._on_datum_blur(datum_id, event)
        }),
        makeCustomListener('datumfocus', (event) => {
          this._on_datum_focus(datum_id, event)
        }),
      ])
      this._datum_unlisten[datum_id] = unlisten
    }
    datum.stopPropagation('wheel')
    this._datum[datum_node_id] = datum

    const datum_overlay = this._create_overlay({
      className: 'datum-overlay',
    })
    this._datum_overlay[datum_node_id] = datum_overlay

    datum_container.setChildren([datum_area, datum, datum_overlay])

    node_content.appendChild(datum_selection)
    node_content.appendChild(datum_container)

    this._zoom_comp.appendChild(datum_node)

    this._reset_datum_color(datum_node_id)

    this._start_graph_simulation(LAYER_DATA_LINKED)
  }

  private _inc_merge_input_active = (merge_node_id: string): void => {
    this._merge_active_input_count[merge_node_id] =
      this._merge_active_input_count[merge_node_id] || 0
    this._merge_active_input_count[merge_node_id]++
    // console.log('Graph', '_inc_merge_input_active', merge_node_id, this._merge_active_input_count[merge_node_id])
    this._refresh_merge_pin_pin_color(merge_node_id, 'input')
  }

  private _dec_merge_input_active = (merge_node_id: string): void => {
    this._merge_active_input_count[merge_node_id]--
    // console.log('Graph', '_dec_merge_input_active', merge_node_id, this._merge_active_input_count[merge_node_id])
    this._refresh_merge_pin_pin_color(merge_node_id, 'input')
  }

  private _inc_merge_output_active = (merge_node_id: string): void => {
    // console.log('Graph', '_inc_merge_output_active', merge_node_id)
    this._merge_active_output_count[merge_node_id] =
      this._merge_active_output_count[merge_node_id] || 0
    this._merge_active_output_count[merge_node_id]++
    this._refresh_merge_pin_pin_color(merge_node_id, 'output')
  }

  private _dec_merge_output_active = (merge_node_id: string): void => {
    // console.log('Graph', '_dec_merge_output_active', merge_node_id)
    this._merge_active_output_count[merge_node_id]--
    this._refresh_merge_pin_pin_color(merge_node_id, 'output')
  }

  private _inc_unit_pin_active = (unit_id: string): void => {
    // console.log('Graph', '_inc_unit_pin_active', unit_id)
    this._unit_active_pin_count[unit_id] =
      this._unit_active_pin_count[unit_id] || 0
    this._unit_active_pin_count[unit_id]++
    this._refresh_core_border_color(unit_id)
  }

  private _dec_unit_pin_active = (unit_id: string): void => {
    // console.log('Graph', '_dec_unit_pin_active', unit_id)
    this._unit_active_pin_count[unit_id]--
    if (this._unit_active_pin_count[unit_id] === 0) {
      delete this._unit_active_pin_count[unit_id]
      this._refresh_core_border_color(unit_id)
    }
  }

  private _inc_merge_input_count = (merge_id: string): void => {
    this._merge_input_count[merge_id] = this._merge_input_count[merge_id] || 0
    this._merge_input_count[merge_id]++
  }

  private _dec_merge_input_count = (merge_id: string): void => {
    this._merge_input_count[merge_id] = this._merge_input_count[merge_id] || 0
    this._merge_input_count[merge_id]--
  }

  private _inc_merge_output_count = (merge_id: string): void => {
    this._merge_output_count[merge_id]++
  }

  private _dec_merge_output_count = (merge_id: string): void => {
    this._merge_output_count[merge_id]--
  }

  private _inc_merge_pin_count = (merge_id: string): void => {
    this._merge_pin_count[merge_id] = this._merge_pin_count[merge_id] || 0
    this._merge_pin_count[merge_id]++
  }

  private _dec_merge_pin_count = (merge_id: string): void => {
    this._merge_pin_count[merge_id]--
  }

  private _refresh_core_border_color = (unit_id: string): void => {
    if (
      this._is_node_hovered(unit_id) ||
      this._is_node_dragged(unit_id) ||
      this._is_node_selected(unit_id)
    ) {
      this._set_core_mode_color(unit_id)
    } else {
      this._reset_core_border_color(unit_id)
    }
  }

  private _set_merge_pin_color = (
    merge_node_id: string,
    type: 'input' | 'output',
    color: string
  ): void => {
    // console.log('Graph', '_set_merge_pin_color', merge_node_id, type, color)
    if (type === 'input') {
      this._set_merge_input_color(merge_node_id, color)
    } else {
      this._set_merge_output_color(merge_node_id, color)
    }
  }

  private _set_output_r = (pin_node_id: string, r: number): void => {
    if (this._is_merge_node_id(pin_node_id)) {
      this._set_merge_output_r(pin_node_id, r)
    } else {
      this._set_link_output_r(pin_node_id, r)
    }
  }

  private _set_output_reduced = (
    pin_node_id: string,
    reduced: boolean
  ): void => {
    if (reduced) {
      this._set_output_r(pin_node_id, PIN_RADIUS - 2)
    } else {
      this._set_output_r(pin_node_id, PIN_RADIUS)
    }
  }

  private _set_link_output_r = (link_pin_node_id: string, r: number): void => {
    // console.log('Graph', '_set_link_output_r', link_pin_node_id, r)
    const pin = this._pin[link_pin_node_id]
    const d = 2 * r
    const t = PIN_RADIUS - r
    // mergeStyle(pin, {
    //   width: `${d}px`,
    //   height: `${d}px`,
    //   transform: `translate(${t}px, ${t}px)`,
    // })
    pin.$element.style.width = `${d}px`
    pin.$element.style.height = `${d}px`
    pin.$element.style.transform = `translate(${t}px, ${t}px)`
  }

  private _set_merge_output_r = (merge_node_id: string, r: number): void => {
    // console.log('Graph', '_set_merge_output_r', merge_node_id, r)
    const d = 2 * r
    const t = PIN_RADIUS - r
    const merge_output = this._merge_output[merge_node_id]
    // mergeStyle(merge_output, {
    //   width: `${d}px`,
    //   height: `${d}px`,
    //   transform: `translate(${t}px, ${t}px)`,
    // })
    merge_output.$element.style.width = `${d}px`
    merge_output.$element.style.height = `${d}px`
    merge_output.$element.style.transform = `translate(${t}px, ${t}px)`
  }

  private _set_merge_input_active = (merge_node_id: string): void => {
    if (this._is_merge_ref(merge_node_id)) {
      const merge_unit_id = this._merge_to_ref_unit[merge_node_id]
      if (merge_unit_id) {
        this._set_core_border_color(merge_unit_id, this._theme.data)
      }
    } else {
      this._set_merge_input_color(merge_node_id, this._theme.data)
    }
  }

  private _set_merge_input_color = (
    merge_node_id: string,
    borderColor: string
  ): void => {
    // console.log('Graph', '_set_merge_input_color', merge_node_id, borderColor)
    const merge_input = this._merge_input[merge_node_id]
    // mergeStyle(merge_input, {
    //   borderColor,
    // })
    merge_input.$element.style.borderColor = borderColor
  }

  private _set_merge_input_visibility = (
    merge_node_id: string,
    visibility: string
  ): void => {
    const merge_input = this._merge_input[merge_node_id]
    // mergeStyle(merge_input, {
    //   visibility,
    // })
    merge_input.$element.style.visibility = visibility
  }

  private _set_merge_input_inactive = (merge_node_id: string): void => {
    // console.log('Graph', '_set_merge_input_inactive')
    if (this._is_merge_ref(merge_node_id)) {
      const merge_unit_id = this._merge_to_ref_unit[merge_node_id]
      const { id: merge_id } = segmentMergeNodeId(merge_node_id)
      if (merge_unit_id && this._merge_input_count[merge_id] === 0) {
        this._set_core_border_color(merge_unit_id, this._theme.node)
      }
    } else {
      this._set_merge_input_color(merge_node_id, this._theme.node)
    }
  }

  private _set_merge_output_active = (merge_node_id: string): void => {
    this._set_merge_output_color(merge_node_id, this._theme.data)
  }

  private _set_merge_output_visibility = (
    merge_node_id: string,
    visibility: string
  ): void => {
    const merge_output = this._merge_output[merge_node_id]
    // mergeStyle(merge_output, {
    //   visibility,
    // })
    merge_output.$element.style.visibility = visibility
  }

  private _set_merge_output_color = (
    merge_node_id: string,
    color: string
  ): void => {
    // console.log('Graph', '_set_merge_output_color', merge_node_id, color)
    const merge_output = this._merge_output[merge_node_id]
    // mergeStyle(merge_output, {
    //   borderColor: color,
    //   backgroundColor: color,
    // })
    merge_output.$element.style.borderColor = color
    merge_output.$element.style.backgroundColor = color
  }

  private _set_merge_output_inactive = (merge_node_id: string): void => {
    this._set_merge_output_color(merge_node_id, this._theme.node)
  }

  private _sim_add_datum_link = (
    datum_node_id: string,
    pin_node_id: string
  ): void => {
    // console.log('Graph', '_add_datum_link', datum_node_id, pin_node_id)
    this._datum_to_pin[datum_node_id] = pin_node_id

    const datum_node = this._data_node[datum_node_id]
    this._linked_data_node[datum_node_id] = datum_node

    if (this._visible_data_node[datum_node_id]) {
      this._visible_linked_data_node[datum_node_id] = datum_node
      this._set_node_layer(datum_node_id, LAYER_DATA_LINKED)
    }

    delete this._unlinked_data_node[datum_node_id]
    delete this._visible_unlinked_data_node[datum_node_id]

    this._pin_to_datum[pin_node_id] = datum_node_id

    const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)

    const link_id = getLinkId(datum_node_id, pin_node_id)

    const d = DATA_LINK_DISTANCE

    const data_link = this._sim_add_link(
      link_id,
      {
        source_id: datum_node_id,
        target_id: anchor_node_id,
        d,
        s: 1,
        padding: {
          source: -6,
          target: -6,
        },
        detail: {
          type: 'd',
        },
      },
      {
        stroke: this._theme.data,
        strokeWidth: 1,
      }
    )

    const link = this._link[link_id]

    this._data_link[link_id] = link
    this._visible_data_link[link_id] = link
    this._link_layer[link_id] = LAYER_DATA_LINKED

    this._zoom_comp.appendChild(data_link, 'svg')

    if (this._is_link_pin_node_id(pin_node_id)) {
      const { unitId } = segmentLinkPinNodeId(pin_node_id)
      this._refresh_link_pin_color(pin_node_id)
      this._refresh_core_border_color(unitId)
    } else {
      const merge_to_pin = this._merge_to_pin[pin_node_id]
      for (const merge_pin_node_id in merge_to_pin) {
        const merge_pin_datum_node_id = this._pin_to_datum[merge_pin_node_id]
        if (merge_pin_datum_node_id) {
          this._refresh_datum_visible(merge_pin_datum_node_id)
        }
      }
    }

    if (this._is_link_pin_node_id(pin_node_id)) {
      this._refresh_link_pin_color(pin_node_id)
    }

    const { id: datum_id } = segmentDatumNodeId(datum_node_id)

    this._mem_set_pin_datum(pin_node_id, datum_id)

    this._refresh_datum_visible(datum_node_id)

    this._start_graph_simulation(LAYER_DATA_LINKED)
  }

  private _mem_set_pin_datum = (
    pin_node_id: string,
    datum_id: string
  ): void => {
    const pin_datum_tree = this._datum_tree[datum_id]

    this._pin_datum_tree[pin_node_id] = pin_datum_tree

    if (this._is_link_pin_node_id(pin_node_id)) {
      if (!this._is_link_pin_ignored(pin_node_id)) {
        const { unitId, type } = segmentLinkPinNodeId(pin_node_id)

        this._inc_unit_pin_active(unitId)

        const pin_merge_node_id = this._pin_to_merge[pin_node_id]
        if (pin_merge_node_id) {
          if (type === 'input') {
            this._inc_merge_input_active(pin_merge_node_id)
          } else {
            this._inc_merge_output_active(pin_merge_node_id)
          }
        }
      }
    } else {
      this._inc_merge_input_active(pin_node_id)
    }

    this._refresh_pin_color(pin_node_id)
  }

  private _segregate_node_id = (
    node_ids: Dict<any>
  ): {
    units: string[]
    links: string[]
    merges: string[]
    data: string[]
    inputs: string[]
    outputs: string[]
  } => {
    const units: string[] = []
    const links: string[] = []
    const merges: string[] = []
    const data: string[] = []
    const inputs: string[] = []
    const outputs: string[] = []

    for (const node_id in node_ids) {
      if (this._is_unit_node_id(node_id)) {
        units.push(node_id)
      } else if (this._is_link_pin_node_id(node_id)) {
        links.push(node_id)
      } else if (this._is_merge_node_id(node_id)) {
        merges.push(node_id)
      } else if (this._is_datum_node_id(node_id)) {
        data.push(node_id)
      } else if (this._is_exposed_pin_node_id(node_id)) {
        // TODO
      }
    }

    return { units, links, merges, data, inputs, outputs }
  }

  private _tick_node = (node_id: string): void => {
    const node = this._node[node_id]
    const { x, y } = node
    const node_comp = this._node_comp[node_id]
    // mergeStyle(node_comp, { transform: `translate(${x}px, ${y}px)` })
    node_comp.$element.style.transform = `translate(${x}px, ${y}px)`

    if (this._long_press_collapsing) {
      if (this._selected_node_id[node_id]) {
        const { x: cx, y: cy } = this._long_press_collapse_world_position
        const dx = x - cx
        const dy = y - cy
        const r = Math.sqrt(dx * dx + dy * dy)
        if (r < 3) {
          this._long_press_collapse_node(node_id)
        }
      }
    }
  }

  private _tick_link = (link_id: string): void => {
    const sim_link = this._link[link_id]

    const {
      source_id,
      target_id,
      padding = { source: 0, target: 0 },
    } = sim_link

    const source = this._node[source_id]
    const target = this._node[target_id]

    const { l, u, d } = surfaceDistance(source, target)

    const link_base = this._link_base[link_id]
    const link_base_area = this._link_base_area[link_id]

    // if (d < 3 || l === 0) {
    //   link_base.setProp('d', '')
    //   link_base_area.setProp('d', '')
    //   return
    // }

    const nu = { x: -u.x, y: -u.y }

    const sl = Math.sign(l)

    let padding_source = sl * padding.source
    let padding_target = sl * padding.target

    // const link_marker_start = this._link_marker_start[link_id]
    // const link_marker_end = this._link_marker_end[link_id]
    // if (Math.abs(l) <= Math.abs(padding_source - padding_target)) {
    //   link_marker_start && mergeStyle(link_marker_start, { opacity: '0' })
    //   link_marker_end && mergeStyle(link_marker_end, { opacity: '0' })
    //   padding_source = 0
    //   padding_target = 0
    // } else {
    //   link_marker_start && mergeStyle(link_marker_start, { opacity: '1' })
    //   link_marker_end && mergeStyle(link_marker_end, { opacity: '1' })
    // }

    // if (is_inside(source, target)) {
    //   padding_source = -padding_source
    //   u.x = -u.x
    //   u.y = -u.y
    // }

    // if (is_inside(target, source)) {
    //   padding_target = -padding_target
    //   nu.x = -nu.x
    //   nu.y = -nu.y
    // }

    const link_text_value = this._link_text_value[link_id]
    const link_text_value_width = getTextWidth(
      link_text_value,
      LINK_TEXT_FONT_SIZE,
      Infinity
    )
    const link_text = this._link_text[link_id]
    if (link_text_value_width > l - 4) {
      link_text.setProp('dx', -(l - 4) / 2)
    } else {
      link_text.setProp('dx', -link_text_value_width / 2)
    }

    const { x: x0, y: y0 } = pointInNode(source, u, padding_source)
    const { x: x1, y: y1 } = pointInNode(target, nu, padding_target)

    const link_start_marker_id = this._link_start_marker_id(link_id)
    const link_end_marker_id = this._link_end_marker_id(link_id)

    // -1 to avoid flickering
    if (x1 > x0 - 1) {
      const d = `M ${x0} ${y0} L ${x1} ${y1}`
      link_base.$element.setAttribute('d', d)
      link_base_area.$element.setAttribute('d', d)
      link_base.$element.setAttribute(
        'marker-start',
        `url(#${link_start_marker_id})`
      )
      link_base.$element.setAttribute(
        'marker-end',
        `url(#${link_end_marker_id})`
      )
      // link_base.setProp('d', d)
      // link_base_area.setProp('d', d)
      // link_base.setProp('markerStart', `url(#${link_start_marker_id})`)
      // link_base.setProp('markerEnd', `url(#${link_end_marker_id})`)
    } else {
      const d = `M ${x1} ${y1} L ${x0} ${y0}`
      link_base.$element.setAttribute('d', d)
      link_base_area.$element.setAttribute('d', d)
      link_base.$element.setAttribute(
        'marker-start',
        `url(#${link_end_marker_id})`
      )
      link_base.$element.setAttribute(
        'marker-end',
        `url(#${link_start_marker_id})`
      )
      // link_base.setProp('d', d)
      // link_base_area.setProp('d', d)
      // link_base.setProp('markerStart', `url(#${link_end_marker_id})`)
      // link_base.setProp('markerEnd', `url(#${link_start_marker_id})`)
    }
  }

  private _random_id = randomId()

  private _tick_minimap = () => {
    if (this._control_lock) {
      if (!this._input_disabled) {
        if (this._minimap) {
          this._minimap.tick()
        }
      }
    }
  }

  private _sim_add_link = (
    link_id: string,
    sim_link: GraphSimLink,
    link_opt: LinkProps = {}
  ): SVGG => {
    const link = this._create_link(link_id, link_opt)

    this._link_comp[link_id] = link

    this._link[link_id] = sim_link

    this._link_unlisten[link_id] = this._listen_link(link_id, link)

    const { source_id, target_id } = sim_link

    add_link_to_graph(this._node_graph, source_id, target_id)

    this._rebuild_subgraph()

    return link
  }

  private _set_node_hovered = (
    node_id: string,
    pointer_id: number,
    hovered: boolean
  ) => {
    // console.log('Graph', '_set_node_hovered', node_id, hovered)
    if (hovered) {
      if (
        !this._hover_node_id_pointer_id[node_id] ||
        !this._hover_node_id_pointer_id[node_id][pointer_id]
      ) {
        if (this._hover_node_pointer_count[node_id] === undefined) {
          this._hover_node_pointer_count[node_id] = 0
        }
        this._hover_node_pointer_count[node_id]++
        if (this._hover_node_id_pointer_id[node_id] === undefined) {
          this._hover_node_id_pointer_id[node_id] = {}
        }
        this._hover_node_id_pointer_id[node_id][pointer_id] = true
        this._pointer_id_hover_node_id[pointer_id] = node_id

        if (this._hover_node_pointer_count[node_id] === 1) {
          this._hover_node_id[node_id] = true
          this._hover_node_count++

          if (this._has_node(node_id)) {
            this._refresh_node_selection(node_id)
          }

          if (this._is_merge_node_id(node_id)) {
            const merge_datum_node_id = this._get_merge_datum_node_id(node_id)
            if (merge_datum_node_id) {
              this._refresh_datum_visible(merge_datum_node_id)
            }
          } else if (this._is_link_pin_node_id(node_id)) {
            const pin_datum_node_id = this._pin_to_datum[node_id]
            if (pin_datum_node_id) {
              this._refresh_datum_visible(pin_datum_node_id)
            }
          } else if (this._is_unit_node_id(node_id)) {
            if (this._is_unit_component(node_id)) {
              if (this._core_component_unlocked_count > 0) {
                const unlocked_component_id = getObjSingleKey(
                  this._core_component_unlocked
                )
                if (node_id !== unlocked_component_id) {
                  this._lock_sub_component(unlocked_component_id, true)
                  this.deselect_node(unlocked_component_id)
                  this._unlock_sub_component(node_id)
                  this.select_node(node_id)
                }
              }
            }
          }

          if (this._mode === 'info') {
            if (this._is_node_infoable(node_id)) {
              if (this._hover_node_count === 1) {
                this._set_all_nodes_links_opacity(0.2)
                if (this._selected_node_count > 0) {
                  for (const selected_node_id in this._selected_node_id) {
                    this._hide_node_info(selected_node_id)
                  }
                }
              }
              this._show_node_info(node_id)
            }
          }

          const anchor_node_id = this._get_node_anchor_node_id(node_id)
          if (anchor_node_id && !this._selected_node_id[anchor_node_id]) {
            this._set_selected_node_color('none')
          }

          this._set_node_mode_color(node_id)
        }
      }
    } else {
      if (
        this._hover_node_id_pointer_id[node_id] &&
        this._hover_node_id_pointer_id[node_id][pointer_id]
      ) {
        this._hover_node_pointer_count[node_id]--
        delete this._hover_node_id_pointer_id[node_id][pointer_id]
        delete this._pointer_id_hover_node_id[pointer_id]

        if (this._hover_node_pointer_count[node_id] === 0) {
          delete this._hover_node_id[node_id]
          this._hover_node_count--

          if (this._has_node(node_id)) {
            this._refresh_node_selection(node_id)
          }

          if (this._is_merge_node_id(node_id)) {
            const merge_datum_node_id = this._get_merge_datum_node_id(node_id)
            if (merge_datum_node_id) {
              this._refresh_datum_visible(merge_datum_node_id)
            }
          } else if (this._is_link_pin_node_id(node_id)) {
            const pin_datum_node_id = this._pin_to_datum[node_id]
            if (pin_datum_node_id) {
              this._refresh_datum_visible(pin_datum_node_id)
            }
          } else if (this._is_datum_node_id(node_id)) {
            this._refresh_datum_visible(node_id)
          }

          if (this._mode === 'info') {
            if (this._is_node_infoable(node_id)) {
              this._hide_node_info(node_id)
              if (this._hover_node_count === 0) {
                if (this._selected_node_count > 0) {
                  this._set_all_nodes_links_opacity(0.2)
                  for (const selected_node_id in this._selected_node_id) {
                    this._show_node_info(selected_node_id)
                  }
                } else {
                  this._set_all_nodes_links_opacity(1)
                }
              }
            }
          }

          if (!this._drag_node_id[node_id]) {
            if (this._is_link_pin_node_id(node_id)) {
              const { unitId } = segmentLinkPinNodeId(node_id)
              if (!this._drag_node_id[unitId]) {
                const merge_node_id = this._pin_to_merge[node_id]
                if (merge_node_id) {
                  const merge_anchor_node_id =
                    this._get_merge_anchor_node_id(merge_node_id)
                  this._refresh_node_color(merge_anchor_node_id)
                  this._refresh_link_pin_link_color(node_id)
                } else {
                  this._refresh_node_color(node_id)
                }
              }
            } else {
              this._refresh_node_color(node_id)
            }
          }

          this._refresh_selected_node_color()
        }
      }
    }
  }

  private _is_node_mode_colorable = (
    node_id: string,
    mode: string
  ): boolean => {
    switch (mode) {
      case 'add':
        return this._is_node_duplicatable(node_id)
      case 'change':
        return this._is_node_changeable(node_id)
      case 'remove':
        return this._is_node_removable(node_id)
      case 'data':
        return this._is_node_dataable(node_id)
      default:
        return false
    }
  }

  private _set_core_mode_color = (unit_id: string): void => {
    const { $theme } = this.$context
    const color = this._get_color()
    if (this._mode === 'none') {
      this._reset_core_border_color(unit_id)
    } else {
      if (this._is_node_mode_colorable(unit_id, this._mode)) {
        const mode_color = getThemeModeColor($theme, this._mode, color)
        this._set_core_and_layout_core_border_color(unit_id, mode_color)
      }
    }
  }

  private _set_node_mode_color = (node_id: string): void => {
    this.__set_node_mode_color(node_id, this._mode)
  }

  private __set_node_mode_color = (node_id: string, mode: Mode): void => {
    // console.log('Graph', '__set_node_mode_color', node_id, mode)
    const { $theme } = this.$context

    this._reset_node_color(node_id)

    // AD HOC
    // do not apply mode color during search
    if (!this._search_hidden) {
      return
    }

    const color = this._get_color()

    if (this.__is_mode_colored(mode)) {
      if (this._is_node_mode_colorable(node_id, mode)) {
        const mode_color = getThemeModeColor($theme, mode, color)
        const mode_link_color = getThemeLinkModeColor($theme, mode)
        const mode_text_color = mode_link_color
        const mode_pin_icon_color = mode_color
        if (this._is_unit_node_id(node_id)) {
          if (mode === 'data') {
            this._set_unit_core_shell_color(node_id, mode_color)
            // this._set_unit_inputs_shell_color(
            //   node_id,
            //   mode_color,
            //   link_color,
            //   text_color
            // )
            this._set_unit_pins_shell_color(
              node_id,
              mode_color,
              mode_link_color,
              mode_text_color,
              mode_pin_icon_color
            )
          } else {
            this._set_unit_color(
              node_id,
              mode_color,
              mode_link_color,
              mode_text_color,
              mode_pin_icon_color
            )

            // if mode is 'remove' update unit linked err and data color
            if (mode === 'remove') {
              if (this._err[node_id]) {
                const err_node_id = getErrNodeId(node_id)
                this._set_err_color(err_node_id, mode_color)
              }

              this._for_each_unit_pin(node_id, (pin_node_id, type) => {
                const datum_node_id = this._pin_to_datum[pin_node_id]
                if (datum_node_id) {
                  this._set_datum_color(
                    datum_node_id,
                    mode_color,
                    mode_link_color
                  )
                }

                // const { pinId, subPinId } = this._get_pin_exposed_id(
                //   type,
                //   pin_node_id
                // )
                // if (pinId !== null && subPinId !== null) {
                //   this._set_exposed_sub_pin_color(
                //     type,
                //     pinId,
                //     subPinId,
                //     mode_color
                //   )
                // }
              })
            }
          }
        } else if (this._is_link_pin_node_id(node_id)) {
          this._set_link_pin_color(
            node_id,
            mode_color,
            mode_link_color,
            mode_text_color,
            mode_pin_icon_color
          )
          if (mode === 'remove') {
            const datum_node_id = this._pin_to_datum[node_id]
            if (datum_node_id) {
              this._set_datum_color(datum_node_id, mode_color, mode_link_color)
            }
          }
        } else if (this._is_merge_node_id(node_id)) {
          if (mode === 'data') {
            this._set_merge_input_color(node_id, mode_color)
            const merge_inputs = this._merge_to_input[node_id]
            for (const input_node_id in merge_inputs) {
              this._set_link_pin_link_color(input_node_id, mode_link_color)
            }
          } else {
            const merge_inputs = this._merge_to_input[node_id]
            for (const input_node_id in merge_inputs) {
              const { unitId } = segmentLinkPinNodeId(input_node_id)
              if (
                this._is_node_hovered(input_node_id) ||
                this._is_node_hovered(unitId) ||
                this._is_node_selected(input_node_id) ||
                this._is_node_selected(unitId)
              ) {
                this._set_merge_input_color(node_id, mode_color)
                break
              }
            }
            const merge_outputs = this._merge_to_output[node_id]
            for (const output_node_id in merge_outputs) {
              const { unitId } = segmentLinkPinNodeId(output_node_id)
              if (
                this._is_node_hovered(output_node_id) ||
                this._is_node_hovered(unitId) ||
                this._is_node_selected(output_node_id) ||
                this._is_node_selected(unitId)
              ) {
                this._set_merge_output_color(node_id, mode_color)
                break
              }
            }
          }
        } else if (this._is_datum_node_id(node_id)) {
          this._set_datum_color(node_id, mode_color, mode_link_color)
        } else if (this._is_err_node_id(node_id)) {
          this._set_err_color(node_id, mode_color)
        } else if (this._is_exposed_pin_node_id(node_id)) {
          const { type, id, subPinId } = segmentExposedNodeId(node_id)
          if (mode === 'change') {
            this._set_exposed_pin_set_color(type, id, mode_color)
          } else {
            this._set_exposed_sub_pin_color(type, id, subPinId, mode_color)
          }
        }
      }
    }
  }

  private _refresh_selected_node_color = (): void => {
    this._set_selected_node_color(this._mode)
  }

  private _set_selected_node_color = (mode: Mode): void => {
    for (const selected_node_id in this._selected_node_id) {
      this.__set_node_mode_color(selected_node_id, mode)
    }
  }

  private _reset_node_color = (node_id: string): void => {
    // console.log('Graph', '_reset_node_color', node_id)
    if (this._is_unit_node_id(node_id)) {
      this._reset_unit_color(node_id)

      this._for_each_unit_pin(node_id, (pin_node_id, type) => {
        const datum_node_id = this._pin_to_datum[pin_node_id]
        if (datum_node_id) {
          this._reset_datum_color(datum_node_id)
        }

        const { pinId, subPinId } = this._get_pin_exposed_id(type, pin_node_id)
        if (pinId !== null && subPinId !== null) {
          this._reset_exposed_sub_pin_color(type, pinId, subPinId)
        }
      })
    } else if (this._is_link_pin_node_id(node_id)) {
      this._reset_link_pin_color(node_id)
    } else if (this._is_merge_node_id(node_id)) {
      this._reset_merge_pin_pin_color(node_id, 'input')
      this._reset_merge_pin_pin_color(node_id, 'output')
      const merge_inputs = this._merge_to_input[node_id]
      for (const input_node_id in merge_inputs) {
        this._refresh_link_pin_link_color(input_node_id)
      }
    } else if (this._is_datum_node_id(node_id)) {
      this._reset_datum_color(node_id)
    } else if (this._is_err_node_id(node_id)) {
      this._reset_err_color(node_id)
    } else if (this._is_exposed_pin_node_id(node_id)) {
      const { type, id, subPinId } = segmentExposedNodeId(node_id)
      // this._reset_exposed_pin_set_color(type, id)
      this._reset_exposed_sub_pin_color(type, id, subPinId)
    }
  }

  private _is_mode_colored = (): boolean => {
    return this.__is_mode_colored(this._mode)
  }

  private __is_mode_colored = (mode: Mode): boolean => {
    return (
      mode === 'add' ||
      mode === 'remove' ||
      mode === 'change' ||
      mode === 'data'
    )
  }

  // REMOVE
  private _refresh_node_color = (node_id: string): void => {
    // console.log('Graph', '_refresh_node_color', node_id)
    if (this._is_mode_colored()) {
      // TODO BUG a node might be colored through connection
      if (
        this._is_node_hovered(node_id) ||
        this._is_node_dragged(node_id) ||
        this._is_node_selected(node_id) ||
        this._is_node_ascend(node_id)
      ) {
        this._set_node_mode_color(node_id)
      } else {
        this._reset_node_color(node_id)
      }
    } else {
      this._reset_node_color(node_id)
    }
  }

  private _reset_unit_color = (unit_id: string): void => {
    // console.log('Graph', '_reset_unit_color', unit_id)
    if (this._search_unit_id === unit_id) {
      const { $theme } = this.$context
      const node_color = getThemeModeColor($theme, this._mode, 'currentColor')
      const link_color = getThemeLinkModeColor($theme, this._mode)
      const pin_icon_color = node_color
      this._set_unit_color(
        unit_id,
        node_color,
        link_color,
        link_color,
        pin_icon_color
      )
    } else {
      this._for_each_unit_pin(
        unit_id,
        (pin_node_id: string, type: 'input' | 'output') => {
          const merge_node_id = this._pin_to_merge[pin_node_id]
          if (merge_node_id) {
            this._reset_link_pin_link_color(pin_node_id)
            const merge_unit_id = this._merge_to_ref_unit[merge_node_id]
            const merge_output_ref = this._merge_to_ref_output[merge_node_id]
            if (merge_unit_id) {
            } else if (merge_output_ref === pin_node_id) {
              this._reset_link_pin_color(pin_node_id)
            } else {
              this._reset_merge_pin_pin_color(merge_node_id, type)
            }
          } else {
            this._reset_link_pin_color(pin_node_id)
          }
        }
      )
      this._reset_core_border_color(unit_id)
      this._reset_soul_color(unit_id)
      if (this._err[unit_id]) {
        const err_node_id = getErrNodeId(unit_id)
        this._reset_err_color(err_node_id)
      }
    }
  }

  private _refresh_merge_pin_color = (merge_node_id: string): void => {
    this._refresh_merge_pin_pin_color(merge_node_id, 'input')
    this._refresh_merge_pin_pin_color(merge_node_id, 'output')
  }

  private _refresh_merge_pin_pin_color = (
    merge_node_id: string,
    type: 'input' | 'output'
  ) => {
    if (this._is_mode_colored()) {
      if (
        this._is_node_hovered(merge_node_id) ||
        this._is_node_selected(merge_node_id)
      ) {
        this._set_node_mode_color(merge_node_id)
      } else {
        const merge_input_node_ids = this._merge_to_input[merge_node_id]
        for (const merge_input_node_id in merge_input_node_ids) {
          if (
            this._is_node_hovered(merge_input_node_id) ||
            this._is_node_selected(merge_input_node_id)
          ) {
            this._set_node_mode_color(merge_node_id)
            return
          }
        }
        this._reset_merge_pin_pin_color(merge_node_id, type)
      }
    } else {
      this._reset_merge_pin_pin_color(merge_node_id, type)
    }
  }

  private _reset_merge_pin_pin_color = (
    merge_node_id: string,
    type: 'input' | 'output'
  ) => {
    // console.log('Graph', '_reset_merge_pin_pin_color', merge_node_id)
    const merge_ref_output_id = this._merge_to_ref_output[merge_node_id]
    if (merge_ref_output_id) {
      return
    }
    if (type === 'input') {
      this._reset_merge_input_pin_color(merge_node_id)
    } else {
      this._reset_merge_output_pin_color(merge_node_id)
    }
  }

  private _reset_merge_input_pin_color = (merge_node_id: string): void => {
    // console.log('Graph', '_reset_merge_input_pin_color', merge_node_id)
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    const search_unit_merge_pins = this._search_unit_merges[merge_id]
    if (
      search_unit_merge_pins &&
      search_unit_merge_pins[this._search_unit_id] &&
      search_unit_merge_pins[this._search_unit_id]['input']
    ) {
      const { $theme } = this.$context
      const node_color = getThemeModeColor($theme, this._mode, 'currentColor')
      this._set_merge_input_color(merge_node_id, node_color)
    } else if (this._merge_active_input_count[merge_node_id] > 0) {
      this._set_merge_input_active(merge_node_id)
    } else {
      this._set_merge_input_inactive(merge_node_id)
    }
  }

  private _reset_merge_output_pin_color = (merge_node_id: string): void => {
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    const search_unit_merge_pins = this._search_unit_merges[merge_id]
    if (
      search_unit_merge_pins &&
      search_unit_merge_pins[this._search_unit_id] &&
      search_unit_merge_pins[this._search_unit_id]['output']
    ) {
      const { $theme } = this.$context
      const node_color = getThemeModeColor($theme, this._mode, 'currentColor')
      this._set_merge_output_color(merge_node_id, node_color)
    } else if (this._merge_active_output_count[merge_node_id] > 0) {
      this._set_merge_output_active(merge_node_id)
    } else {
      this._set_merge_output_inactive(merge_node_id)
    }
  }

  private _set_all_nodes_links_opacity = (opacity: number): void => {
    this._set_nodes_links_opacity(opacity, this._node, this._link)
  }

  private _set_nodes_links_opacity = (
    opacity: number,
    nodes: Dict<any>,
    links: Dict<any>
  ): void => {
    for (const node_id in nodes) {
      this._set_node_opacity(node_id, opacity)
    }

    for (const link_id in links) {
      this._set_link_opacity(link_id, opacity)
    }
  }

  private _info_node_id: Set<string> = new Set()

  private _show_node_info = (node_id: string): void => {
    // console.log('Graph', '_show_node_info', node_id)

    this._info_node_id.add(node_id)

    if (this._is_unit_node_id(node_id)) {
      this._show_unit_info(node_id)
      this._for_each_unit_pin(node_id, (pin_node_id: string) => {
        if (!this._is_link_pin_ignored(pin_node_id)) {
          this.__show_pin_info(pin_node_id)
        }
      })
    } else if (this._is_link_pin_node_id(node_id)) {
      if (!this._is_link_pin_ignored(node_id)) {
        this._show_pin_info(node_id)
      }
    } else if (this._is_merge_node_id(node_id)) {
      this.__show_pin_info(node_id)

      const merge_to_pin = this._merge_to_pin[node_id]
      for (const pin_node_id in merge_to_pin) {
        this._show_pin_info(pin_node_id)
        // const { unitId } = segmentLinkPinNodeId(pin_node_id)
        // this._show_unit_info(unitId)
      }
    } else if (this._is_external_pin_node_id(node_id)) {
      this._show_ext_pin_info(node_id)
    }
  }

  private _show_pin_info = (pin_node_id: string): void => {
    this.__show_pin_info(pin_node_id)

    const { unitId } = segmentLinkPinNodeId(pin_node_id)
    this._set_node_opacity(unitId, 1)
    this._for_each_unit_pin(unitId, (pin_node_id: string) => {
      if (!this._is_link_pin_ignored(pin_node_id)) {
        this._show_pin_info_opacity(pin_node_id)
      }
    })
  }

  private _show_unit_info = (unit_id: string): void => {
    this._set_node_opacity(unit_id, 1)
    this._show_core_description(unit_id)
  }

  private _set_node_opacity = (unit_id: string, opacity: number): void => {
    const node_comp = this._node_content[unit_id]
    // mergeStyle(node_comp, {
    //   opacity: `${opacity}`,
    // })
    node_comp.$element.style.opacity = `${opacity}`
  }

  private _set_link_opacity = (link_id: string, opacity: number): void => {
    const link_comp = this._link_comp[link_id]
    // mergeStyle(link_comp, {
    //   opacity: `${opacity}`,
    // })
    link_comp.$element.style.opacity = `${opacity}`
  }

  private __show_pin_info = (pin_node_id: string): void => {
    this._show_pin_info_opacity(pin_node_id)

    const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)

    if (this._is_pin_node_id(anchor_node_id)) {
      const { x, y } = this._pin_type_initial_position(anchor_node_id)

      const type_node_id = getTypeNodeId(anchor_node_id)
      if (!this._has_node(type_node_id)) {
        this._sim_add_pin_type(anchor_node_id, { x, y })
      }
    }
  }

  private _show_pin_info_opacity = (pin_node_id: string): void => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
      this._set_link_opacity(link_id, 1)
    }

    const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)

    if (this._is_pin_node_id(anchor_node_id)) {
      this._set_node_opacity(anchor_node_id, 1)

      const type_node_id = getTypeNodeId(anchor_node_id)
      if (this._has_node(type_node_id)) {
        this._set_node_opacity(type_node_id, 1)

        // const type_link_id = getLinkId(type_node_id, pin_node_id)
        const type_link_id = getLinkId(type_node_id, anchor_node_id)
        this._set_link_opacity(type_link_id, 1)
      }

      const pin_datum_node_id = this._pin_to_datum[anchor_node_id]
      if (pin_datum_node_id) {
        const datum_link_id = getLinkId(pin_datum_node_id, pin_node_id)
        this._set_node_opacity(pin_datum_node_id, 1)
        this._set_link_opacity(datum_link_id, 1)
      }
    }
  }

  private _show_ext_pin_info = (ext_pin_node_id: string): void => {
    // TODO
  }

  private _show_link_pin_name = (pin_node_id: string): void => {
    // console.log('Graph', '_show_link_pin_name', pin_node_id)
    const pin_name = this._pin_name[pin_node_id]
    // mergeStyle(pin_name, {
    //   display: 'block',
    // })
    pin_name.$element.style.display = 'block'
  }

  private _hide_link_pin_name = (pin_node_id: string): void => {
    // console.log('Graph', '_hide_link_pin_name', pin_node_id)
    const pin_name = this._pin_name[pin_node_id]
    // mergeStyle(pin_name, {
    //   display: 'none',
    // })
    pin_name.$element.style.display = 'none'
  }

  private _should_show_node_info = (node_id: string): boolean => {
    return (
      this._is_node_hovered(node_id) ||
      (this._is_node_selected(node_id) && this._hover_node_count === 0)
    )
  }

  private _refresh_node_info = (node_id: string): void => {
    // console.log('Graph', '_refresh_node_info', node_id)
    if (this._mode === 'info') {
      if (this._should_show_node_info(node_id)) {
        this._show_node_info(node_id)
      } else {
        if (this._is_link_pin_node_id(node_id)) {
          const { unitId } = segmentLinkPinNodeId(node_id)
          if (this._should_show_node_info(unitId)) {
            this._show_node_info(node_id)
          } else {
            this._hide_node_info(node_id)
          }
        } else if (this._is_unit_node_id(node_id)) {
          if (this._should_show_node_info(node_id)) {
            this._show_node_info(node_id)
          } else {
            this._hide_node_info(node_id)
          }
        } else {
          this._hide_node_info(node_id)
        }
      }
    } else {
      this._hide_node_info(node_id)
    }
  }

  private _hide_node_info = (node_id: string): void => {
    // console.log('Graph', '_hide_node_info', node_id)

    this._info_node_id.delete(node_id)

    if (this._is_unit_node_id(node_id)) {
      this._hide_unit_info(node_id)
      this._for_each_unit_pin(node_id, (pin_node_id: string) => {
        if (!this._is_link_pin_ignored(pin_node_id)) {
          this._refresh_node_info(pin_node_id)
        }
      })
    } else if (this._is_link_pin_node_id(node_id)) {
      this._hide_pin_info(node_id)

      const { unitId } = segmentLinkPinNodeId(node_id)
      this._hide_unit_info(unitId)
    } else if (this._is_merge_node_id(node_id)) {
      this._hide_pin_info(node_id)
    }
  }

  private _hide_unit_info = (unit_id: string): void => {
    this._hide_core_description(unit_id)
  }

  private _hide_pin_info = (pin_node_id: string) => {
    // console.log('Graph', '_hide_pin_info')
    const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)
    const type_node_id = getTypeNodeId(anchor_node_id)
    if (this._has_node(type_node_id)) {
      this._sim_remove_pin_type(anchor_node_id)
    }
  }

  private _refresh_class_literal_datum_node_selection = (
    datum_node_id: string
  ) => {
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    const node_selection = this._node_selection[datum_node_id]
    const tree = this._datum_tree[datum_id]
    const { width, height } = this._get_datum_tree_size(tree)
    const shape = this._get_datum_tree_shape(tree)
    node_selection.setProp('shape', shape)
    node_selection.setProp('width', width + 6)
    node_selection.setProp('height', height + 6)
  }

  private _hide_link = (link_id: string): void => {
    const link_base = this._link_base[link_id]
    const link_base_area = this._link_base_area[link_id]
    // mergeStyle(link_base, {
    //   display: 'none',
    // })
    link_base.$element.style.display = 'none'
    // mergeStyle(link_base_area, {
    //   display: 'none',
    // })
    link_base_area.$element.style.display = 'none'
  }

  private _show_link = (link_id: string): void => {
    const link_base = this._link_base[link_id]
    const link_base_area = this._link_base_area[link_id]
    // mergeStyle(link_base, {
    //   display: 'block',
    // })
    link_base.$element.style.display = 'block'
    // mergeStyle(link_base_area, {
    //   display: 'block',
    // })
    link_base_area.$element.style.display = 'block'
  }

  private _set_link_pin_color = (
    pin_node_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    icon_color: string
  ): void => {
    const merge_node_id = this._pin_to_merge[pin_node_id]
    if (merge_node_id) {
      const merge_ref_output_id = this._merge_to_ref_output[merge_node_id]
      if (merge_ref_output_id === pin_node_id) {
        this._set_link_pin_pin_color(pin_node_id, node_color, icon_color)
        this._set_link_pin_pin_text_color(pin_node_id, text_color)
      } else {
        if (!this._is_merge_ref(merge_node_id)) {
          const { type } = segmentLinkPinNodeId(pin_node_id)
          this._set_merge_pin_color(merge_node_id, type, node_color)
        }
      }
    } else {
      this._set_link_pin_pin_color(pin_node_id, node_color, icon_color)
      this._set_link_pin_pin_text_color(pin_node_id, text_color)
    }
    this._set_link_pin_link_color(pin_node_id, link_color)
    this._set_link_pin_link_text_color(pin_node_id, text_color)
  }

  private _reset_link_pin_pin_color = (pin_node_id: string): void => {
    // console.log('Graph', '_reset_link_pin_pin_color', pin_node_id)
    const { type, unitId } = segmentLinkPinNodeId(pin_node_id)

    if (this._search_unit_id === unitId) {
      const { $theme } = this.$context
      const link_color = getThemeLinkModeColor($theme, this._mode)
      const node_color = getThemeModeColor($theme, this._mode, 'currentColor')
      const icon_color = node_color
      this._set_link_pin_color(
        pin_node_id,
        node_color,
        link_color,
        link_color,
        icon_color
      )
    } else {
      const pin_datum_tree = this._pin_datum_tree[pin_node_id]
      if (pin_datum_tree) {
        this._set_link_pin_pin_color(
          pin_node_id,
          this._theme.data,
          this._theme.node
        )
        this._set_link_pin_pin_text_color(pin_node_id, this._theme.pin_text)
      } else {
        const default_pin_color = this._default_pin_color(pin_node_id)
        this._set_link_pin_pin_color(
          pin_node_id,
          default_pin_color,
          default_pin_color
        )
        this._set_link_pin_pin_text_color(pin_node_id, this._theme.pin_text)
      }

      const merge_node_id = this._pin_to_merge[pin_node_id]
      if (merge_node_id) {
        this._reset_merge_pin_pin_color(merge_node_id, type)
      }

      const pin_datum_node_id = this._pin_to_datum[pin_node_id]
      if (pin_datum_node_id) {
        this._reset_datum_color(pin_datum_node_id)
      }
    }
  }

  private _default_pin_color = (pin_node_id: string): string => {
    const color = this._theme.node
    return color
  }

  private _default_link_color = (pin_node_id: string): string => {
    const ref = this._is_link_pin_ref(pin_node_id)
    const init = this._is_link_pin_init(pin_node_id)
    const color = ref || init ? this._theme.node : this._theme.link
    return color
  }

  private _refresh_link_pin_link_color = (pin_node_id: string): void => {
    // console.log('Graph', '_refresh_link_pin_link_color')
    if (this._is_mode_colored()) {
      const { unitId } = segmentLinkPinNodeId(pin_node_id)
      if (
        this._is_node_selected(pin_node_id) ||
        this._is_node_hovered(pin_node_id) ||
        this._is_node_selected(unitId) ||
        this._is_node_hovered(unitId)
      ) {
        this._set_node_mode_color(pin_node_id)
      } else {
        this._reset_link_pin_link_color(pin_node_id)
      }
    } else {
      this._reset_link_pin_link_color(pin_node_id)
    }
  }

  private _reset_link_pin_link_color = (pin_node_id: string): void => {
    // console.log('Graph', '_reset_link_pin_link_color')
    const datum_tree = this._pin_datum_tree[pin_node_id]
    const merge_node_id = this._pin_to_merge[pin_node_id]
    const merge_unit_id =
      merge_node_id && this._merge_to_ref_unit[merge_node_id]

    const { unitId } = segmentLinkPinNodeId(pin_node_id)

    const set_data_color = () => {
      // console.log('set_data_color', pin_node_id)
      this._set_link_pin_link_color(pin_node_id, this._theme.data_link)
      this._set_link_pin_link_text_color(pin_node_id, this._theme.pin_text)
    }

    const set_default_color = () => {
      // console.log('set_default_color', pin_node_id)
      this._set_link_pin_link_color(
        pin_node_id,
        this._default_link_color(pin_node_id)
      )
      this._set_link_pin_link_text_color(pin_node_id, this._theme.pin_text)
    }

    if (this._search_unit_id === unitId) {
      const { $theme } = this.$context
      const link_color = getThemeLinkModeColor($theme, this._mode)
      this._set_link_pin_link_color(pin_node_id, link_color)
      this._set_link_pin_link_text_color(pin_node_id, link_color)
    } else if (datum_tree) {
      set_data_color()
    } else if (merge_unit_id) {
      set_data_color()
    } else {
      set_default_color()
    }
  }

  private _is_link_pin_visible = (pin_node_id: string): boolean => {
    if (this._is_link_pin_merged(pin_node_id)) {
      const ref_output_merge_node_id = this._ref_output_to_merge[pin_node_id]
      if (ref_output_merge_node_id) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  private _reset_link_pin_color = (pin_node_id: string): void => {
    // console.log('Graph', '_reset_link_pin_color', pin_node_id)
    if (this._is_link_pin_visible(pin_node_id)) {
      this._reset_link_pin_pin_color(pin_node_id)
    }
    this._reset_link_pin_link_color(pin_node_id)
  }

  private _reset_core_border_color = (unit_id: string): void => {
    // console.log('Graph', '_reset_core_border_color', unit_id)
    if (this._search_unit_id === unit_id) {
      this._set_core_and_layout_core_border_color(unit_id, GREEN)
    } else if (this._err[unit_id]) {
      this._set_core_and_layout_core_border_color(unit_id, OPAQUE_RED)
    } else if (this._unit_active_pin_count[unit_id] > 0) {
      this._set_core_border_color(unit_id, this._theme.data)
      this._set_layout_core_border_color(unit_id, this._theme.node)
    } else if (this._ref_unit_to_merge[unit_id]) {
      this._set_core_border_color(unit_id, this._theme.data)
      this._set_layout_core_border_color(unit_id, this._theme.node)
    } else {
      // AD HOC
      let has_merged_ref_input: boolean = false
      const spec = this._get_unit_spec(unit_id)
      const { inputs = {} } = spec
      for (let input_id in inputs) {
        const input = inputs[input_id]
        const { ref } = input
        if (ref) {
          const input_node_id = getInputNodeId(unit_id, input_id)
          const merge_node_id = this._pin_to_merge[input_node_id]
          if (merge_node_id) {
            const merge_unit_id = this._merge_to_ref_unit[merge_node_id]
            if (merge_unit_id) {
              has_merged_ref_input = true
              break
            }
          }
        }
      }

      if (has_merged_ref_input) {
        this._set_core_border_color(unit_id, this._theme.data)
        this._set_layout_core_border_color(unit_id, this._theme.node)
      } else {
        this._set_core_border_color(unit_id, this._theme.node)
        this._set_layout_core_border_color(unit_id, this._theme.node)
      }
    }
  }

  private _reset_soul_color = (unit_id: string): void => {
    this._set_core_icon_color(unit_id, this._theme.node)
    this._set_core_name_color(unit_id, this._theme.node)
  }

  private _reset_datum_color = (datum_node_id: string): void => {
    // console.log('_reset_datum_color', datum_node_id)
    if (this._search_unit_datum_node_id === datum_node_id) {
      const { $theme } = this.$context
      const node_color = getThemeModeColor($theme, 'data', 'currentColor')
      const link_color = getThemeLinkModeColor($theme, 'data')
      this._set_datum_color(datum_node_id, node_color, link_color)
    } else {
      const { id: datum_id } = segmentDatumNodeId(datum_node_id)
      const datum_tree = this._datum_tree[datum_id]
      const valid = _isValidValue(datum_tree)
      if (valid) {
        this._set_datum_color(
          datum_node_id,
          this._theme.data,
          this._theme.data_link
        )
      } else {
        this._set_datum_color(datum_node_id, this._theme.type, this._theme.type)
      }
    }
  }

  private _reset_err_color = (err_node_id: string): void => {
    this._set_err_color(err_node_id, OPAQUE_RED)
  }

  private _set_drag_node = (node_id: string, dragged: boolean) => {
    // console.log('Graph', '_set_drag_node', node_id, dragged)
    const was_dragged = this._drag_node_id[node_id]
    if (was_dragged && !dragged) {
      this._drag_count--
      delete this._drag_node_id[node_id]
    } else if (!was_dragged && dragged) {
      this._drag_count++
      this._drag_node_id[node_id] = true
    }

    if (this._drag_count === 1) {
      this._start_static()
    } else if (this._drag_count === 0) {
      this._stop_static()
    }

    this._refresh_compatible()
  }

  public resize_sub_component = (
    unit_id: string,
    width: number,
    height: number
  ) => {
    // console.log('Graph', 'resize_component')
    if (this._tree_layout) {
      this._layout_resize_sub_component(unit_id, width, height)
      // this._component_resize_component(unit_id, width, height)
    } else {
      this._sim_resize_sub_component(unit_id, width, height)
      this._spec_resize_sub_component(unit_id, width, height)
      this._component_resize_sub_component(unit_id, width, height)
    }
  }

  private _spec_resize_sub_component = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    this._spec = specReducer.setUnitMetadata(
      { id: unit_id, path: ['component', 'width'], value: width },
      this._spec
    )
    this._spec = specReducer.setUnitMetadata(
      { id: unit_id, path: ['component', 'height'], value: height },
      this._spec
    )

    this._update_max_component_size(unit_id, width, height)
  }

  private _update_max_component_size = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    const component_max_width_length = this._core_component_max_width.length
    if (component_max_width_length === 0) {
      this._core_component_max_width = [width]
      this._core_component_max_width_id = [unit_id]
    } else {
      for (let i = 0; i < component_max_width_length; i++) {
        if (width > this._core_component_max_width[i]) {
          this._core_component_max_width.splice(i, 0, width)
          this._core_component_max_width_id.splice(i, 0, unit_id)
          break
        }
      }
    }

    const component_max_height_length = this._core_component_max_height.length
    if (component_max_height_length === 0) {
      this._core_component_max_height = [height]
      this._core_component_max_height_id = [unit_id]
    } else {
      for (let i = 0; i < component_max_height_length; i++) {
        if (height > this._core_component_max_height[i]) {
          this._core_component_max_height.splice(i, 0, height)
          this._core_component_max_height_id.splice(i, 0, unit_id)
          break
        }
      }
    }
  }

  private _spec_component_set_default_size = (): void => {
    // console.log('Graph', '_spec_component_set_default_size')
    // detault this component width and height to
    // max width and max height of its sub components
    const defaultWidth =
      this._core_component_max_width[this._core_component_max_width.length - 1]
    const defaultHeight =
      this._core_component_max_height[
        this._core_component_max_height.length - 1
      ]
    this._spec.component = this._spec.component || {}
    this._spec.component = componentReducer.setSize(
      {
        defaultWidth,
        defaultHeight,
      },
      this._spec.component
    )
  }

  private _pod_component_set_default_size = (): void => {
    // console.log('Graph', '_pod_component_set_default_size')
    const defaultWidth =
      this._core_component_max_width[this._core_component_max_width.length - 1]
    const defaultHeight =
      this._core_component_max_height[
        this._core_component_max_height.length - 1
      ]
    this._pod_set_metadata(['component'], { defaultWidth, defaultHeight })
  }

  private _component_resize_sub_component = (
    unit_id: string,
    width: number,
    height: number
  ) => {
    // console.log(
    //   'Graph',
    //   '_component_resize_sub_component',
    //   unit_id,
    //   width,
    //   height
    // )
    width = Math.floor(width)
    height = Math.floor(height)
    this._spec.component = this._spec.component || {}
    this._spec.component = componentReducer.setSubComponentSize(
      { id: unit_id, width, height },
      this._spec.component
    )

    this._spec_component_set_default_size()
  }

  private _sim_resize_sub_component = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    this._resize_node(unit_id, width / 2, width, height)
    this._resize_core(unit_id, width, height)

    this._update_max_component_size(unit_id, width, height)
  }

  private _resize_layout_core = (
    sub_component_id: string,
    width: number,
    height: number
  ) => {
    // console.log('Graph', '_resize_layout_core', sub_component_id, width, height)
    this.__resize_layout_core(sub_component_id, width, height)

    this._refresh_current_layout_node_target_position()

    this._animate_all_current_layout_layer_node()
  }

  private __scale_layout_core = (unit_id: string, k: number): void => {
    // console.log('Graph', '_resize_layout_core', width, height)
    const layout_node = this._layout_node[unit_id]

    layout_node.k = k

    const layout_core = this._layout_core[unit_id]

    layout_core.$element.style.transform = `translate(-50%, -50%) scale(${k})`
  }

  private __resize_layout_core = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    // console.log('Graph', '_resize_layout_core', width, height)
    this._set_layout_core_size(unit_id, width, height)

    this._resize_core_area(unit_id, width, height)

    this._resize_core_selection(unit_id, width, height)
  }

  private _set_layout_core_size = (
    sub_component_id: string,
    width: number,
    height: number
  ): void => {
    const layout_core = this._layout_core[sub_component_id]

    // mergeStyle(layout_core, {
    //   width: `${width}px`,
    //   height: `${height}px`,
    // })
    layout_core.$element.style.width = `${width}px`
    layout_core.$element.style.height = `${height}px`

    const layout_node = this._layout_node[sub_component_id]

    layout_node.width = width
    layout_node.height = height

    if (this._control_lock) {
      if (this._minimap) {
        this._tick_minimap()
      }
    }
  }

  private _resize_core = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    // console.log('Graph', '_resize_core', width, height)
    const core = this._core[unit_id]
    // mergeStyle(core, {
    //   // width: `${width + 2}px`,
    //   // height: `${height + 2}px`,
    //   width: `${width}px`,
    //   height: `${height}px`,
    // })
    core.$element.style.width = `${width}px`
    core.$element.style.height = `${height}px`
    this._resize_core_area(unit_id, width, height)
    this._resize_core_selection(unit_id, width, height)
  }

  private _resize_core_selection = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    this._resize_selection(unit_id, width + 2, height + 2)
  }

  private _resize_core_area = (
    unit_id: string,
    width: number,
    height: number
  ) => {
    const core_area = this._core_area[unit_id]
    // mergeStyle(core_area, {
    //   width: `${width + NODE_PADDING + 2}px`,
    //   height: `${height + NODE_PADDING + 2}px`,
    // })
    core_area.$element.style.width = `${width + NODE_PADDING + 2}px`
    core_area.$element.style.height = `${height + NODE_PADDING + 2}px`
  }

  private _layout_resize_sub_component = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    // console.log('Graph', '_layout_resize_component')
    this._resize_layout_core(unit_id, width, height)

    const layout_target_node = this._layout_target_node[unit_id]

    layout_target_node.width = width
    layout_target_node.height = height
  }

  private _resize_node = (
    node_id: string,
    r: number,
    width: number,
    height: number
  ): void => {
    const node = this._node[node_id]
    node.r = r
    node.width = width
    node.height = height
    const node_content = this._node_content[node_id]
    // mergeStyle(node_content, {
    //   transform: `translate(-${width / 2}px, -${height / 2}px)`,
    // })
    node_content.$element.style.transform = `translate(-${width / 2}px, -${
      height / 2
    }px)`

    if (this._minimap) {
      this._tick_minimap()
    }
  }

  private _resize_datum = (
    datum_node_id: string,
    width: number,
    height: number
  ) => {
    this._resize_node(datum_node_id, width / 2, width, height)
    const datum_container = this._datum_container[datum_node_id]

    // mergeStyle(datum_container, {
    //   width: `${width}px`,
    //   height: `${height}px`,
    // })
    datum_container.$element.style.width = `${width}px`
    datum_container.$element.style.height = `${height}px`

    const datum_area = this._datum_area[datum_node_id]

    // mergeStyle(datum_area, {
    //   width: `${width + NODE_PADDING}px`,
    //   height: `${height + NODE_PADDING}px`,
    // })
    datum_area.$element.style.width = `${width + NODE_PADDING}px`
    datum_area.$element.style.height = `${height + NODE_PADDING}px`

    this._resize_selection(datum_node_id, width, height)
    this._start_graph_simulation(LAYER_DATA_LINKED)
  }

  private _create_selection = (
    node_id: string,
    selection_opt: SelectionOpt
  ): Selection => {
    const {
      width,
      height,
      shape,
      stroke = this._theme.node,
      strokeWidth = 1,
      strokeDasharray = 6,
      paddingX = 6,
      paddingY = 6,
    } = selection_opt

    const selection = new Selection({
      width: width + paddingX,
      height: height + paddingY,
      shape,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeDashOffset: 8,
    })

    this._node_selection[node_id] = selection
    this._selection_opt[node_id] = selection_opt

    return selection
  }

  private _resize_selection = (
    node_id: string,
    width: number,
    height: number
  ): void => {
    const selection_opt = this._selection_opt[node_id]
    const { shape, strokeWidth = 1, paddingX = 6, paddingY = 6 } = selection_opt
    const selection = this._node_selection[node_id]
    let _width = width + paddingX
    let _height = height + paddingY
    selection.setProp('width', _width)
    selection.setProp('height', _height)
    selection_opt.width = width
    selection_opt.height = height
  }

  private _create_overlay = ({
    className,
  }: { className?: string } = {}): Div => {
    const overlay_el = new Div({
      className,
      style: {
        position: 'absolute',
        top: '0',
        width: 'calc(100% + 2px)',
        height: 'calc(100% + 2px)',
        zIndex: `${MAX_Z_INDEX - 1}`,
        transform: 'translate(-1px, -1px)',
      },
    })
    return overlay_el
  }

  private _id: string = randomId()

  private _link_start_marker_id = (link_id: string): string => {
    return `${this._id}-link-start-${hashCode(link_id)}`
  }

  private _link_end_marker_id = (link_id: string): string => {
    return `${this._id}-link-end-${hashCode(link_id)}`
  }

  private _create_pin = ({
    className,
    style,
    r,
    shape = 'circle',
  }: {
    className: string
    style: Dict<string>
    r: number
    shape: Shape
  }): Div => {
    const width = 2 * r
    const height = 2 * r

    const pin = new Div({
      className,
      style: {
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: shape === 'circle' ? '50%' : '0',
        borderWidth: '1px',
        borderColor: NONE,
        borderStyle: 'solid',
        backgroundColor: NONE,
        boxSizing: 'border-box',
        ...style,
      },
    })

    return pin
  }

  private _create_pin_name = ({
    className,
    name,
    r,
    style,
  }: {
    className: string
    r: number
    style: Dict<string>
    name: string
  }): TextInput => {
    const pin_name = new TextInput({
      className,
      value: name,
      style: {
        position: 'absolute',
        borderWidth: '0px',
        borderStyle: 'solid',
        borderColor: NONE,
        // padding: '1px',
        fontSize: '10px',
        textAlign: 'center',
        justifyContent: 'center',
        width: `${name.length * 6}px`,
        height: 'auto',
        left: `${r}px`,
        top: `${2 * r + 2}px`,
        transform: 'translateX(-50%)',
        overflowY: 'hidden',
        overflowX: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
        webkitUserSelect: 'none', // TODO remove
        touchAction: 'none',
        ...style,
      },
      maxLength: PIN_NAME_MAX_SIZE,
    })

    return pin_name
  }

  private _create_link = (link_id: string, link_opt: LinkProps) => {
    let {
      hidden = false,
      stroke = this._theme.link,
      strokeWidth = 3,
      strokeDasharray = 0,
      text = '',
      textHidden = true,
      textOpacity = 1,
      startMarker = null,
      startMarkerX = 0,
      endMarker = null,
      endMarkerX = 0,
      opacity = 1,
    } = link_opt

    const link_start_id = this._link_start_marker_id(link_id)
    const link_start = this._create_link_marker(link_start_id, {
      component: startMarker,
      x: startMarkerX,
    })
    if (startMarker) {
      this._link_marker_start[link_id] = startMarker
    }
    const link_end_id = this._link_end_marker_id(link_id)
    const link_end = this._create_link_marker(link_end_id, {
      component: endMarker,
      x: endMarkerX,
    })
    if (endMarker) {
      this._link_marker_end[link_id] = endMarker
    }
    const link_defs = new SVGDefs({})
    link_defs.appendChild(link_start)
    link_defs.appendChild(link_end)

    const link_base_id = `${this._id}-link-base-${link_id}`
    const link_base = new SVGPath({
      id: link_base_id,
      className: 'link-base',
      markerStart: `url(#${link_start_id})`,
      markerEnd: `url(#${link_end_id})`,
      style: {
        display: hidden ? 'none' : 'block',
        strokeWidth: `${strokeWidth}`,
        stroke,
        strokeDasharray: `${strokeDasharray}px`,
        opacity: `${opacity}`,
      },
    })
    this._link_base[link_id] = link_base

    const link_base_area = new SVGPath({
      id: link_base_id,
      className: 'link-base-area',
      style: {
        display: hidden ? 'none' : 'block',
        strokeWidth: `${6 + strokeWidth}`,
        stroke: NONE,
      },
    })
    this._link_base_area[link_id] = link_base_area

    this._link_text_value[link_id] = text

    const link_text_path = new SVGTextPath({
      href: `#${link_base_id}`,
      startOffset: '50%',
      spacing: 'auto',
      lenghtAdjust: 'spacingAndGlyphs',
      textContent: text,
      style: {
        strokeWidth: '0px',
      },
    })
    this._link_text_path[link_id] = link_text_path

    const link_text = new SVGText({
      dy: 12,
      dx: 0,
      textAnchor: 'start',
      style: {
        display: textHidden ? 'none' : 'block',
        opacity: `${textOpacity}`,
        fill: this._theme.pin_text,
        fontSize: `${LINK_TEXT_FONT_SIZE}px`,
        userSelect: 'none',
        webkitUserSelect: 'none',
        touchAction: 'none',
      },
    })
    link_text.appendChild(link_text_path)
    this._link_text[link_id] = link_text

    const link = new SVGG({
      className: 'link',
    })
    link.appendChild(link_defs)
    link.appendChild(link_base)
    link.appendChild(link_base_area)
    link.appendChild(link_text)

    return link
  }

  private _create_link_marker = (
    id: string,
    { component, x = 0 }: LinkMarkerOpt
  ): SVGMarker => {
    const marker = new SVGMarker({
      id,
      markerHeight: 30,
      markerWidth: 30,
      refX: 0 + x,
      refY: 1,
      orient: 'auto-start-reverse',
      style: {
        overflow: 'visible',
      },
    })
    if (component) {
      marker.appendChild(component)
    }
    return marker
  }

  private _simulation_prevent_restart: boolean = false

  private _start_graph_simulation = (layer: number): void => {
    // console.log('Graph', '_start_simulation')
    if (this._simulation_prevent_restart) {
      return
    }
    if (this._simulation_end) {
      this._simulation_layer = layer
    } else {
      this._simulation_layer = Math.min(this._simulation_layer, layer)
    }
    this._simulation_end = false
    this._simulation.alpha(0.25)
    this._simulation.start()
  }

  private _stop_graph_simulation = (): void => {
    // console.log('Graph', '_stop_simulation')
    this._simulation.stop()
  }

  private _get_current_layout_layer_id = (): string | null => {
    const current_layout_layer_id = last(this._layout_path) || null
    return current_layout_layer_id
  }

  private _get_current_layout_layer = (): LayoutLayer => {
    const layout_id = this._get_current_layout_layer_id()
    return this._get_layout_layer(layout_id)
  }

  private _get_layout_layer = (parent_id: string | null): LayoutLayer => {
    if (parent_id) {
      return this._layout_layer[parent_id]
    } else {
      return this._layout_root
    }
  }

  private _get_layout_layer_children = (layer: string | null): string[] => {
    if (layer) {
      return this._get_sub_component_spec_children(layer)
    } else {
      return this._get_component_spec_children()
    }
  }

  private _get_layout_layer_parent_children = (
    sub_component_id: string
  ): string[] => {
    const parent_id = this._sub_component_parent[sub_component_id] || null
    return this._get_layout_layer_children(parent_id)
  }

  private _get_current_layout_layer_children = (): string[] => {
    const current_layout_layer = this._get_current_layout_layer_id()
    return this._get_layout_layer_children(current_layout_layer)
  }

  private _high_zoom: boolean = false

  public _set_zoom = (zoom: Zoom) => {
    // console.log('Graph', '_set_zoom', zoom)
    const { maxZoom = defaultProps.maxZoom } = this.$props
    const { $height, $width } = this.$context

    const dx = zoom.x - this._zoom.x
    const dy = zoom.y - this._zoom.y
    const dk = zoom.k - this._zoom.k

    this._zoom = zoom

    const { k, x, y } = zoom

    this._zoom_comp.setProp('zoom', zoom)
    this._zoom_comp_alt.setProp('zoom', zoom)

    if (this._tree_layout) {
      //
    } else {
      if (this._minimap_screen) {
        this._minimap_screen.setProp('x', x - 4.5)
        this._minimap_screen.setProp('y', y - 4.5)
        this._minimap_screen.setProp('width', $width / k)
        this._minimap_screen.setProp('height', $height / k)
      }
    }

    // if (k > 3) {
    //   mergeStyle(this._main, { opacity: `${(6 - k) / 3}`, })
    // } else if (k < 1) {
    //   mergeStyle(this._main, { opacity: `${k - 0.5}`, })
    // } else {
    //   mergeStyle(this._main, { opacity: '1', })
    // }

    if (k > 0.75 * maxZoom) {
      if (!this._high_zoom) {
        this._on_high_zoom()
      }
    } else {
      if (this._high_zoom) {
        this._on_low_zoom()
      }
    }

    if (this._exposed_pin_unplugged_count > 0) {
      this._start_graph_simulation(LAYER_EXPOSED)
    }
  }

  public set_zoom = (zoom: Zoom) => {
    // console.log('Graph', '_set_zoom', zoom)
    const dx = zoom.x - this._zoom.x
    const dy = zoom.y - this._zoom.y
    const dk = zoom.k - this._zoom.k

    this._zoom = zoom

    const { k, x, y } = zoom

    this._set_zoom(zoom)

    this.dispatchEvent('zoom', { k, x, y, dk, dx, dy }, false)
  }

  private _on_high_zoom = () => {
    this._high_zoom = true
    // console.log('_on_high_zoom')
    // for (const pin_node_id in this._pin_name) {
    //   const pin_name = this._pin_name[pin_node_id]
    //   mergeStyle(pin_name, {
    //     // borderColor: this._theme.pin_text,
    //     textDecoration: 'underline',
    //     pointerEvents: 'all',
    //   })
    // }
    // for (const unit_id in this._core_name) {
    //   const core_name = this._core_name[unit_id]
    //   mergeStyle(core_name, {
    //     textDecoration: 'underline',
    //     pointerEvents: 'all',
    //   })
    // }
  }

  private _on_low_zoom = (): void => {
    this._high_zoom = false
    // console.log('_on_low_zoom')
    // for (const pin_node_id in this._pin_name) {
    //   const pin_name = this._pin_name[pin_node_id]
    //   mergeStyle(pin_name, {
    //     textDecoration: NONE,
    //     pointerEvents: 'none',
    //   })
    // }
    // for (const unit_id in this._core_name) {
    //   const core_name = this._core_name[unit_id]
    //   mergeStyle(core_name, {
    //     textDecoration: NONE,
    //     pointerEvents: 'none',
    //   })
    // }
  }

  private _on_zoom_start = () => {
    // console.log('Graph', '_on_zoom_start')
  }

  private _on_zoom_end = () => {
    if (this._zoom.k < 1 && this._pointer_down_count < 2) {
      const zoom_spring_frame = () => {
        const { $width, $height } = this.$context
        this._zoom_in(-100, $width / 2, $height / 2)
        if (this._zoom.k < 1) {
          requestAnimationFrame(zoom_spring_frame)
        }
      }
      requestAnimationFrame(zoom_spring_frame)
    }
  }

  private _on_pointer_leave = (event: IOPointerEvent) => {
    // console.log('Graph', '_on_pointer_leave')
    const { pointerId } = event

    // AD HOC
    // #2006
    // Safari (on OSX) will emit "pointerleave" when setPointerCapture is called
    // when pressing a node, which might inadvertedly release it, breaking add mode
    if (this._mode === 'add' && this._pointer_id_pressed_node_id[pointerId]) {
      return
    }

    this._on_pointer_up(event)
  }

  private _pointer_inside: Dict<boolean> = {}

  private _on_pointer_enter = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_pointer_enter')
  }

  private _on_pointer_cancel = (event: IOPointerEvent) => {
    console.log('Graph', '_on_pointer_cancel')
    this._on_pointer_up(event)
  }

  private _screen_center = (): Position => {
    return {
      x: this._width / 2,
      y: this._height / 2,
    }
  }

  private _world_screen_center = (): Position => {
    const { x, y } = this._screen_center()
    const world_screen_center = this._screen_to_world(x, y)
    return world_screen_center
  }

  private _screen_to_world = (x: number, y: number): Position => {
    const position = {
      x: x / this._zoom.k + this._zoom.x,
      y: y / this._zoom.k + this._zoom.y,
    }
    return position
  }

  private _world_to_screen = (x: number, y: number): Position => {
    const position = {
      x: (x - this._zoom.x) * this._zoom.k,
      y: (y - this._zoom.y) * this._zoom.k,
    }
    return position
  }

  private _jiggle_screen_center = (): Position => {
    const screen_center = this._world_screen_center()
    const jiggled_screen_center = jigglePoint(screen_center)
    return jiggled_screen_center
  }

  private _distance_to_center = (point: Point): number => {
    const center = this._world_screen_center()
    const d = pointDistance(point, center)
    return d
  }

  private _set_node_position = (node_id: string, position: Position): void => {
    const node = this._node[node_id]
    const { x, y } = position
    node.x = x
    node.y = y
    if (node.fx !== undefined) {
      node.fx = x
    }
    if (node.fy !== undefined) {
      node.fy = y
    }
  }

  private _set_node_layer = (node_id: string, layer: number): void => {
    // console.log('Graph', '_set_node_layer', node_id, layer)
    const node = this._node[node_id]

    const { layer: prev_layer } = node

    delete this._layer_node[Math.abs(prev_layer)][node_id]

    this._node_layer[node_id] = layer

    this._layer_node[Math.abs(layer)][node_id] = node

    node.layer = layer
  }

  private _set_link_layer = (link_id: string, layer: number): void => {
    // console.log('Graph', '_set_link_layer', link_id, layer)
    const prev_layer = this._link_layer[link_id]

    delete this._layer_link[Math.abs(prev_layer)][link_id]

    const link = this._link[link_id]

    this._layer_link[Math.abs(layer)][link_id] = link

    this._link_layer[link_id] = layer
  }

  public _get_node = (node_id: string): GraphSimNode => {
    const node = this._node[node_id]
    return node
  }

  public get_nodes = (): GraphSimNodes => {
    return this._node
  }

  private _get_node_position = (node_id: string): Position => {
    const node = this._get_node(node_id)
    const { x, y } = node
    return { x, y }
  }

  private _get_node_screen_position = (node_id: string): Position => {
    const node = this._get_node(node_id)

    const { x: _x, y: _y, width, height } = node

    const { x, y } = this._world_to_screen(_x - width / 2, _y - height / 2)

    return { x, y }
  }

  private _get_node_shape = (node_id: string): Shape => {
    const node = this._get_node(node_id)
    const { shape } = node
    return shape
  }

  private _get_node_r = (node_id: string): number => {
    const node = this._get_node(node_id)
    const { r } = node
    return r
  }

  private _on_search_item_selected = ({ id }: { id: string }) => {
    // console.log('Graph', '_on_search_item_selected', id)
    if (!this._control_lock) {
      return
    }

    if (!this._search_hidden) {
      this._swap_search_unit(id)
    }
  }

  private _swap_search_unit = (id: string) => {
    if (this._mode === 'add') {
      this._swap_add_search_unit(id)
    } else if (this._mode === 'change') {
      this._swap_change_search_unit(id)
    } else if (this._mode === 'data') {
      this._swap_data_search_unit(id)
    }
  }

  private _swap_add_search_unit = (id: string): void => {
    const search_unit_id = this._search_unit_id

    let position: Position

    if (this._search_unit_graph_position) {
      position = this._search_unit_graph_position
    } else {
      const screen_center = this._world_screen_center()
      const u = randomUnitVector()
      position = {
        x: screen_center.x + u.x,
        y: screen_center.y + u.y,
      }
    }

    const is_component = isComponent(id)

    let layout_node: Position

    if (this._search_unit_id) {
      if (is_component) {
        if (this._is_unit_component(this._search_unit_id)) {
          layout_node = this._layout_node[this._search_unit_id]
        }
      }

      this._sim_remove_unit(this._search_unit_id)
      this._spec_remove_unit(this._search_unit_id)
    } else {
      this._search_fallback_position = this._world_screen_center()
    }

    const unit_id = this._new_unit_id(id)

    this._add_search_unit(
      unit_id,
      id,
      position,
      { input: {}, output: {} },
      layout_node
    )

    if (this._is_unit_component(unit_id)) {
      if (this._search_unit_component_size) {
        const { width, height } = this._search_unit_component_size
        this.resize_sub_component(unit_id, width, height)
      }
    }
  }

  private _swap_change_search_unit = (id: string): void => {
    // console.log('Graph', '_swap_change_search_unit')
    if (this._search_unit_spec_id !== id) {
      const search_unit_id = this._search_unit_id

      if (search_unit_id) {
        const pin_id_merge_swap: {
          input: Dict<string>
          output: Dict<string>
        } = {
          input: {},
          output: {},
        }

        const {
          input: search_option_valid_input_matches = [],
          output: search_option_valid_output_matches = [],
        } = this._search_option_valid_pin_matches[id]

        const search_option_valid_input_match =
          search_option_valid_input_matches[0] || []
        const search_option_valid_output_match =
          search_option_valid_output_matches[0] || []

        const search_option_valid_pin_match = {
          input: search_option_valid_input_match,
          output: search_option_valid_output_match,
        }

        const search_spec = this._get_unit_spec(search_unit_id)
        const { inputs: search_inputs = {}, outputs: search_outputs = {} } =
          search_spec
        const search_pin_bag = {
          input: clone(search_inputs),
          output: clone(search_outputs),
        }

        const position = this._get_node_position(search_unit_id)
        let layout_position = position

        if (this._is_unit_component(search_unit_id)) {
          layout_position = this._layout_node[search_unit_id]
        }

        const search_pin_position = this._get_unit_pin_position(search_unit_id)

        const swap_spec = getSpec(id)
        const { inputs: swap_inputs = {}, outputs: swap_outputs = {} } =
          swap_spec
        const swap_input_ids = Object.keys(swap_inputs)
        const swap_output_ids = Object.keys(swap_outputs)
        const swap_pin_ids = {
          input: swap_input_ids,
          output: swap_output_ids,
        }
        const swap_pin_bag = {
          input: clone(swap_inputs),
          output: clone(swap_outputs),
        }

        const pin_position: UnitPinPosition = {
          input: {},
          output: {},
        }

        const swap_merges: GraphMergesSpec = {}

        this._search_unit_merges = swap_merges

        const set_merge_swap = (type: 'input' | 'output'): void => {
          const search_option_valid_type_match =
            search_option_valid_pin_match[type]

          for (let i = 0; i < search_option_valid_type_match.length; i++) {
            const valid_pin_match = search_option_valid_type_match[i]
            const [a, b] = valid_pin_match
            const pin_id = this._search_unit_merged_pin_ids[type][a]
            const swap_pin_id = swap_pin_ids[type][b]

            pin_id_merge_swap[type][pin_id] = swap_pin_id
            pin_position[type][swap_pin_id] = search_pin_position[type][pin_id]

            this._search_unit_merged_pin_ids[type][a] = swap_pin_id

            delete search_pin_bag[type][pin_id]
            delete swap_pin_bag[type][swap_pin_id]
          }
        }

        set_merge_swap('input')
        set_merge_swap('output')

        function set_bag_swap(
          search_type: 'input' | 'output',
          swap_type: 'input' | 'output'
        ) {
          for (const pin_id in search_pin_bag[search_type]) {
            const swap_pin_id = getObjSingleKey(swap_pin_bag[swap_type])
            if (swap_pin_id) {
              pin_position[swap_type][swap_pin_id] =
                search_pin_position[search_type][pin_id]
              delete swap_pin_bag[swap_type][swap_pin_id]
            } else {
              break
            }
          }
        }

        set_bag_swap('input', 'input')
        set_bag_swap('output', 'output')
        set_bag_swap('input', 'output')
        set_bag_swap('output', 'input')

        const replace_merges = (type: 'input' | 'output'): void => {
          for (const pin_id in pin_id_merge_swap[type]) {
            const pin_node_id = getPinNodeId(search_unit_id, type, pin_id)
            const merge_node_id = this._pin_to_merge[pin_node_id]
            if (merge_node_id) {
              const { id: merge_id } = segmentMergeNodeId(merge_node_id)
              if (!swap_merges[merge_id]) {
                const merge_spec = this.__get_merge(merge_id)
                const swap_merge_spec = clone(merge_spec)
                delete swap_merge_spec[search_unit_id][type]![pin_id]
                const swap_pin_id = pin_id_merge_swap[type][pin_id]
                swap_merge_spec[search_unit_id][type]![swap_pin_id] = true
                swap_merges[merge_id] = swap_merge_spec
              }
            }
          }
        }

        replace_merges('input')
        replace_merges('output')

        const replace_exposed = (kind: Kind): void => {
          const exposed_kind_pin_ids = this._search_unit_exposed_pin_ids[kind]
          for (const pin_id in exposed_kind_pin_ids) {
          }
        }

        replace_exposed('input')
        replace_exposed('output')

        const merge_position: Dict<Position> = {}
        for (const merge_id in swap_merges) {
          const merge_node_id = getMergeNodeId(merge_id)
          const merge_ref_unit_id = this._merge_to_ref_unit[merge_node_id]
          if (merge_ref_unit_id) {
            merge_position[merge_id] =
              this._get_node_position(merge_ref_unit_id)
          } else {
            merge_position[merge_id] = this._get_node_position(merge_node_id)
          }
        }

        const ref_merge_node_id = this._ref_unit_to_merge[search_unit_id]
        let ref_merge_id: string | null = null
        let ref_merge: GraphMergeSpec | null = null
        if (ref_merge_node_id) {
          ref_merge_id = getIdFromMergeNodeId(ref_merge_node_id)
          ref_merge = this.__get_merge(ref_merge_id)
        }

        this._state_remove_unit(search_unit_id)

        const unit_id = search_unit_id || this._new_unit_id(id)

        this._add_search_unit(
          unit_id,
          id,
          position,
          pin_position,
          layout_position
        )

        if (ref_merge_id && ref_merge) {
          if (unit_id !== search_unit_id) {
            ref_merge[unit_id] = clone(ref_merge[search_unit_id])
            delete ref_merge[search_unit_id]
          }
          this._state_add_merge(ref_merge_id, ref_merge, position)
          this._sim_collapse_merge(ref_merge_id)
        }

        if (this._is_unit_component(unit_id)) {
          if (this._search_unit_component_size) {
            const { width, height } = this._search_unit_component_size
            this.resize_sub_component(unit_id, width, height)
          }
        }

        for (const merge_id in swap_merges) {
          const merge = swap_merges[merge_id]

          const merge_node_id = getMergeNodeId(merge_id)

          const position = merge_position[merge_id]

          let has_merge = !!this.__get_merge(merge_id)

          if (!has_merge) {
            this._spec_add_merge(merge_id, merge)
            this._sim_add_merge(merge_id, merge, position)
          }

          forEachPinOnMerge(merge, (unit_id: string, type, pin_id) => {
            const pin_node_id = getPinNodeId(unit_id, type, pin_id)

            if (this._has_node(pin_node_id)) {
              this._spec_set_link_pin_ignored(pin_node_id, false)
              this._sim_set_unit_pin_ignored(pin_node_id, false)

              this.__spec_merge_link_pin_merge_pin(
                merge_id,
                unit_id,
                type,
                pin_id
              )
              this._sim_merge_link_pin_merge_pin(pin_node_id, merge_node_id)

              if (unit_id === search_unit_id) {
                this._refresh_pin_color(pin_node_id)
              }
            }
          })
        }

        this._search_unit_spec_id = id
        this._search_unit_ref_merge_id = ref_merge_id
        this._search_unit_ref_merge = ref_merge
      }
    }
  }

  private _data_search_unit = (unit_id: string, id: string): void => {
    console.log('Graph', '_data_search_unit')
  }

  private _add_data_search_unit = (
    spec_id: string,
    position: Position
  ): void => {
    const datum_id = this._new_datum_id()
    const datum_node_id = getDatumNodeId(datum_id)
    this._search_unit_datum_id = datum_id
    this._search_unit_datum_node_id = datum_node_id
    this._search_unit_datum_spec_id = spec_id
    this._add_datum(datum_id, spec_id, position)
  }

  private _remove_data_search_unit = (): void => {
    if (this._search_unit_datum_node_id) {
      this._remove_datum(this._search_unit_datum_node_id)
      this._search_unit_datum_id = null
      this._search_unit_datum_node_id = null
    }
  }

  private _swap_data_search_unit = (id: string): void => {
    // console.log('Graph', '_swap_data_search_unit')

    if (this._search_unit_datum_id) {
      this._remove_data_search_unit()
      // const datum_node_id = getDatumNodeId(this._search_unit_datum_id)
      // const datum = this._datum[datum_node_id]
      // this._search_unit_datum_spec_id = id
      // this._datum_tree[this._search_unit_datum_id] = getTree(id)
      // datum.setProp('id', id)
    }
    const position = this._jiggle_screen_center()
    this._add_data_search_unit(id, position)
  }

  private _new_unit_id = (
    spec_id: string,
    blacklist: Set<string> = new Set()
  ): string => {
    return newUnitIdInSpec(this._spec, spec_id, blacklist)
  }

  private _new_merge_id = (blacklist: Set<string> = new Set()): string => {
    return newMergeIdInSpec(this._spec, blacklist)
  }

  private _new_datum_id = (blacklist: Set<string> = new Set()): string => {
    let datum_id: string
    do {
      datum_id = randomIdNotIn(this._datum_tree)
    } while (blacklist.has(datum_id))
    return datum_id
  }

  private _new_input_id = (
    input_id: string,
    blacklist: Set<string> = new Set()
  ): string => {
    let new_input_id: string = input_id
    let i = 0
    while (
      this._has_exposed_input_named(new_input_id) ||
      blacklist.has(new_input_id)
    ) {
      new_input_id = `${input_id}${i}`
      i++
    }
    return new_input_id
  }

  private _new_output_id = (
    output_id: string,
    blacklist: Set<string> = new Set()
  ): string => {
    let new_output_id: string = output_id
    let i = 0
    while (
      this._has_exposed_output_named(new_output_id) ||
      blacklist.has(new_output_id)
    ) {
      new_output_id = `${output_id}${i}`
      i++
    }
    return new_output_id
  }

  private _new_sub_pin_id = (
    type: 'input' | 'output',
    pin_id: string
  ): string => {
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const id = randomIdNotIn(exposed_pin_spec.pin || {})
    return id
  }

  private _remove_search_unit = (): void => {
    if (this._search_unit_id) {
      this._sim_remove_unit(this._search_unit_id)
      this._spec_remove_unit(this._search_unit_id)
      this._search_unit_id = null
      this._search_unit_spec_id = null
    }
  }

  private _get_sub_component_target_parent_id = (): string | null => {
    let parent_id: string | null = null
    if (this._tree_layout) {
      const current_layout_layer = this._get_current_layout_layer_id()
      if (current_layout_layer) {
        parent_id = current_layout_layer
      }
    }
    return parent_id
  }

  private _add_search_unit = (
    unit_id: string,
    path: string,
    position: Position,
    pin_position: UnitPinPosition = {
      input: {},
      output: {},
    },
    layout_position: Position
  ): void => {
    // console.log('Graph', '_add_search_unit')
    this._search_unit_id = unit_id
    this._search_unit_spec_id = path

    // set ignored true if defaultIgnored is true

    const spec = getSpec(path)
    const { inputs = {}, outputs = {} } = spec
    const input = {}
    for (let inputId in inputs) {
      input[inputId] = {}

      const inputSpec = inputs[inputId]
      const { defaultIgnored } = inputSpec
      if (defaultIgnored === true) {
        input[inputId].ignored = true
      }
    }
    const output = {}
    for (let outputId in outputs) {
      output[outputId] = {}
      const outputSpec = outputs[outputId]
      const { defaultIgnored } = outputSpec
      if (defaultIgnored === true) {
        output[outputId].ignored = true
      }
    }
    const unit_spec: GraphUnitSpec = {
      path,
      input,
      output,
    }

    this._spec_add_unit(unit_id, unit_spec)

    let parent_id: string | null = null

    if (this._is_unit_component(unit_id)) {
      parent_id = this._get_sub_component_target_parent_id()
      this._spec_append_component(parent_id, unit_id)
    }

    this._sim_add_unit(
      unit_id,
      unit_spec,
      position,
      pin_position,
      parent_id,
      layout_position
    )

    const link_color = this._mode === 'add' ? LINK_GREEN : LINK_BLUE
    const node_color = this._mode === 'add' ? GREEN : BLUE
    const pin_icon_color = node_color
    this._set_unit_color(
      unit_id,
      node_color,
      link_color,
      link_color,
      pin_icon_color
    )

    if (this._mode === 'add') {
      this._set_unit_layer(unit_id, LAYER_SEARCH)
    }

    if (this._tree_layout) {
      this._refresh_layout_node_target_position(parent_id)
      this._move_all_layout_node_target_position(parent_id)
    }
  }

  // TODO
  private _swap_pointer_pressed_node = (
    pointer_id: number,
    node_id: string
  ): void => {
    const hovered_node_id = this._pointer_id_hover_node_id[pointer_id]
    if (hovered_node_id) {
      this._set_node_hovered(hovered_node_id, pointer_id, false)
    }
    this._set_node_hovered(node_id, pointer_id, true)

    const pressed_node_id = this._pointer_id_pressed_node_id[pointer_id]
    if (pressed_node_id) {
      this.__set_node_pressed(pressed_node_id, pointer_id, false)
    }
    this.__set_node_pressed(pressed_node_id, pointer_id, true)
  }

  private _set_unit_layer = (unit_id: string, layer: number): void => {
    // console.log('Graph', '_set_unit_layer', unit_id)
    this._set_node_layer(unit_id, layer)
    this._for_each_unit_pin(
      unit_id,
      (pin_node_id: string, type: 'input' | 'output') => {
        if (!this._is_link_pin_ignored(pin_node_id)) {
          this._set_node_layer(pin_node_id, layer)

          const link_id = getPinLinkIdFromPinNodeId(pin_node_id)

          this._set_link_layer(link_id, layer)

          const datum_node_id = this._pin_to_datum[pin_node_id]
          if (datum_node_id) {
            this._set_node_layer(datum_node_id, layer)
          }
        }

        const { pinId, subPinId } = this._get_pin_exposed_id(type, pin_node_id)
        if (pinId !== null && subPinId !== null) {
          const ext_pin_node_id = getExternalNodeId(type, pinId, subPinId)
          this._set_node_layer(ext_pin_node_id, layer)
        }
      }
    )
  }

  private _set_core_icon = (unit_id: string, icon: string): void => {
    const core_icon = this._core_icon[unit_id]
    core_icon.setProp('icon', icon)
  }

  private _show_core_icon = (unit_id: string): void => {
    const core_icon = this._core_icon[unit_id]
    // mergeStyle(core_icon, {
    //   display: 'block',
    // })
    core_icon.$element.style.display = 'block'
  }

  private _hide_core_icon = (unit_id: string): void => {
    const core_icon = this._core_icon[unit_id]
    // mergeStyle(core_icon, {
    //   display: 'none',
    // })
    core_icon.$element.style.display = 'none'
  }

  private _set_core_icon_color = (unit_id: string, fill: string): void => {
    const core_icon = this._core_icon[unit_id]
    // mergeStyle(core_icon, {
    //   fill,
    // })
    // core_icon.$element.style.fill = fill
    core_icon.$element.style.stroke = fill
  }

  private _set_core_name_color = (unit_id: string, color: string): void => {
    const core_name = this._core_name[unit_id]
    // mergeStyle(core_name, {
    //   color,
    // })
    core_name.$element.style.color = color
  }

  private _set_unit_core_color = (
    unit_id: string,
    node_color: string
  ): void => {
    // console.log('Graph', '_set_unit_core_color')
    this._set_unit_core_shell_color(unit_id, node_color)
    this._set_unit_core_ghost_color(unit_id, node_color)
  }

  private _set_unit_core_shell_color = (
    unit_id: string,
    color: string
  ): void => {
    this._set_core_and_layout_core_border_color(unit_id, color)
  }

  private _set_unit_core_ghost_color = (
    unit_id: string,
    node_color: string
  ): void => {
    this._set_core_icon_color(unit_id, node_color)
    this._set_core_name_color(unit_id, node_color)
  }

  private _set_unit_color = (
    unit_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ): void => {
    // console.log('Graph', '_set_unit_color')
    this._set_unit_core_color(unit_id, node_color)
    this._set_unit_pins_color(
      unit_id,
      node_color,
      link_color,
      text_color,
      pin_icon_color
    )
  }

  private _set_unit_pins_color = (
    unit_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ) => {
    this._set_unit_pins_shell_color(
      unit_id,
      node_color,
      link_color,
      text_color,
      pin_icon_color
    )
    this._set_unit_pins_ghost_color(
      unit_id,
      node_color,
      link_color,
      text_color,
      pin_icon_color
    )
  }

  private _set_unit_shell_color = (
    unit_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ): void => {
    this._set_unit_core_shell_color(unit_id, node_color)
    this._set_unit_pins_shell_color(
      unit_id,
      node_color,
      link_color,
      text_color,
      pin_icon_color
    )
  }

  private _set_unit_pins_shell_color = (
    unit_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ): void => {
    this._for_each_unit_pin(unit_id, (pin_node_id, type) => {
      const merge_node_id = this._pin_to_merge[pin_node_id]
      if (merge_node_id) {
        if (this._is_link_pin_visible(pin_node_id)) {
          this._set_link_pin_pin_color(pin_node_id, node_color, pin_icon_color)
        } else {
          if (!this._is_merge_ref(merge_node_id)) {
            this._set_merge_pin_color(merge_node_id, type, node_color)
          }
        }
      } else {
        this._set_link_pin_pin_color(pin_node_id, node_color, pin_icon_color)
      }
      const ref = this._is_link_pin_ref(pin_node_id)
      this._set_link_pin_link_color(pin_node_id, ref ? node_color : link_color)
      this._set_pin_text_color(pin_node_id, text_color)
    })
  }

  private _set_unit_inputs_color = (
    unit_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ): void => {
    this._for_each_unit_input(unit_id, (pin_node_id) => {
      this._set_unit_pin_color(
        pin_node_id,
        node_color,
        link_color,
        text_color,
        pin_icon_color
      )
    })
  }

  private _set_unit_inputs_shell_color = (
    unit_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ): void => {
    this._for_each_unit_input(unit_id, (input_node_id) => {
      this._set_unit_pin_shell_color(
        input_node_id,
        node_color,
        link_color,
        text_color,
        pin_icon_color
      )
    })
  }

  private _set_unit_pin_color = (
    pin_node_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ) => {
    if (!this._is_link_pin_ignored(pin_node_id)) {
      this._set_unit_pin_ghost_color(
        pin_node_id,
        node_color,
        link_color,
        text_color,
        pin_icon_color
      )
      this._set_unit_pin_shell_color(
        pin_node_id,
        node_color,
        link_color,
        text_color,
        pin_icon_color
      )
    }
  }

  private _set_unit_pin_ghost_color = (
    pin_node_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ) => {
    this._set_pin_text_color(pin_node_id, text_color)
  }

  private _set_unit_pin_shell_color = (
    pin_node_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ) => {
    const { type } = segmentLinkPinNodeId(pin_node_id)
    const merge_node_id = this._pin_to_merge[pin_node_id]
    if (merge_node_id) {
      if (!this._is_merge_ref(merge_node_id)) {
        this._set_merge_pin_color(merge_node_id, type, node_color)
      }
    } else {
      this._set_link_pin_pin_color(pin_node_id, node_color, pin_icon_color)
    }
    const ref = this._is_link_pin_ref(pin_node_id)
    this._set_link_pin_link_color(pin_node_id, ref ? node_color : link_color)
  }

  private _set_unit_ghost_color = (
    unit_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ): void => {
    this._set_unit_core_ghost_color(unit_id, node_color)
    this._set_unit_pins_ghost_color(
      unit_id,
      node_color,
      link_color,
      text_color,
      pin_icon_color
    )
  }

  private _set_unit_pins_ghost_color = (
    unit_id: string,
    node_color: string,
    link_color: string,
    text_color: string,
    pin_icon_color: string
  ): void => {
    this._for_each_unit_pin(unit_id, (pin_node_id, type) => {
      // if (!this._is_link_pin_ignored(pin_node_id)) {
      this._set_unit_pin_ghost_color(
        pin_node_id,
        node_color,
        link_color,
        text_color,
        pin_icon_color
      )
      // }
    })
  }

  private _set_datum_color = (
    datum_node_id: string,
    color: string,
    link_color: string
  ) => {
    // console.log('Graph', '_set_datum_color', color)
    const datum_container = this._datum_container[datum_node_id]
    // mergeStyle(datum_container, {
    //   color,
    // })
    datum_container.$element.style.color = color
    const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    if (datum_pin_node_id) {
      this._set_datum_link_color(datum_node_id, link_color)
    }
  }

  private _set_datum_link_color = (
    datum_node_id: string,
    color: string
  ): void => {
    const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    const datum_link_id = getLinkId(datum_node_id, datum_pin_node_id)
    this._set_link_color(datum_link_id, color)
  }

  private _set_err_color = (err_node_id: string, color: string): void => {
    const { unitId } = segmentErrNodeId(err_node_id)
    const err_component = this._err_comp[unitId]
    // mergeStyle(err_component, { color })
    err_component.$element.style.color = color
    const err_link_id = getLinkId(unitId, err_node_id)
    this._set_link_color(err_link_id, color)
  }

  private _on_search_item_pick = ({ id }: { id: string }) => {
    // console.log('Graph', '_on_search_item_pick', id)
    if (!this._control_lock) {
      return
    }

    const search_unit_id = this._search_unit_id
    const search_unit_datum_id = this._search_unit_datum_id
    if (search_unit_id) {
      this._commit_search_unit()
      this._shift_search()

      this._refresh_node_color(search_unit_id)
      this._for_each_unit_input(search_unit_id, (pin_node_id: string) => {
        this._refresh_node_color(pin_node_id)
      })
    } else if (search_unit_datum_id) {
      this._commit_search_unit()
      this._shift_search()
    }
  }

  private _on_search_empty = (): void => {
    // console.log('Graph', '_on_search_empty')
    if (this._search_unit_id) {
      if (this._mode === 'add') {
        this._remove_search_unit()
      }
    }
  }

  private _on_search_shape = ({ shape }: { shape: Shape }): void => {
    // console.log('Graph', '_on_search_shape', shape)
    if (this._tree_layout && shape === 'circle') {
      this._leave_tree_layout()
    } else if (!this._tree_layout && shape === 'rect') {
      this._enter_tree_layout()
    }
  }

  private _show_core_name = (unit_id: string): void => {
    const core_name = this._core_name[unit_id]
    // mergeStyle(core_name, {
    //   display: 'flex',
    // })
    core_name.$element.style.display = 'flex'
  }

  private _hide_core_name = (unit_id: string): void => {
    const core_name = this._core_name[unit_id]
    // mergeStyle(core_name, {
    //   display: 'none',
    // })
    core_name.$element.style.display = 'none'
  }

  private _commit_search_unit = () => {
    // console.log('Graph', '_commit_search_unit')
    const { animate } = this.$props

    this._search_fallback_position = this._world_screen_center()

    const unit_id = this._search_unit_id

    if (unit_id) {
      if (this._mode === 'add' || this._mode === 'change') {
        this._set_unit_color(
          unit_id,
          this._theme.node,
          this._theme.link,
          this._theme.pin_text,
          this._theme.node
        )

        const unit = this._get_unit(unit_id)

        this._refresh_unit_layer(unit_id)

        if (this._mode === 'add') {
          this._pod_add_unit(unit_id, unit)
          this._dispatchAction(addUnit(unit_id, unit))
        } else if (this._mode === 'change') {
          // TODO this._pod_swap_unit(unit_id, unit)
          this._pod_remove_unit(unit_id)
          this._pod_add_unit(unit_id, unit)
          this._dispatchAction(addUnit(unit_id, unit))
        }

        for (const merge_id in this._search_unit_merges) {
          const merge_node_id = getMergeNodeId(merge_id)
          const merge = this._search_unit_merges[merge_id]
          const merge_pin_count = this._merge_pin_count[merge_id]
          if (merge_pin_count > 2) {
            // the merge alreary exists on the pod, but the
            // search unit's pin hasn't yet been added
            let type: 'input' | 'output'
            let pin_id: string
            const merge_unit = merge[unit_id]!
            // TODO pretify
            if (merge_unit['input']) {
              type = 'input'
              pin_id = getObjSingleKey(merge_unit.input || {})
            } else {
              type = 'output'
              pin_id = getObjSingleKey(merge_unit.output || {})
            }
            this.__pod_merge_link_pin_merge_pin(merge_id, unit_id, type, pin_id)
          } else {
            this._pod_add_merge(merge_id, merge)
          }

          this._refresh_merge_pin_pin_color(merge_node_id, 'input')
          this._refresh_merge_pin_pin_color(merge_node_id, 'output')
        }

        if (this._search_unit_ref_merge_id) {
          this._pod_add_merge(
            this._search_unit_ref_merge_id,
            this._search_unit_ref_merge!
          )
        }

        if (this._is_unit_component(unit_id)) {
          this._sim_add_unit_component(unit_id)
          this._pod_add_unit_component(unit_id)

          const parent_id = this._get_sub_component_target_parent_id()
          if (parent_id) {
            this._mem_move_sub_component_child(parent_id, unit_id)
          }
        }

        this._refresh_unit_compatibility(unit_id)

        this._start_graph_simulation(LAYER_NORMAL)

        if (this._tree_layout) {
          const parent_id = this._sub_component_parent[unit_id] || null

          this._move_all_layout_node_target_position(parent_id)
        }
      } else if (this._mode === 'remove') {
        this._remove_search_unit()
      }
    }

    const datum_node_id = this._search_unit_datum_node_id
    if (datum_node_id) {
      this._search_unit_datum_id = null
      this._search_unit_datum_node_id = null

      this._reset_datum_color(datum_node_id)
    }
  }

  private _shift_search = (): void => {
    // console.log('Graph', '_shift_search')
    if (this._is_shift_pressed()) {
      const position = this._jiggle_screen_center()
      const layout_position = this._jiggle_screen_center()
      const spec_id = this._search_unit_spec_id!
      const new_unit_id = this._new_unit_id(spec_id)
      this._add_search_unit(
        new_unit_id,
        spec_id,
        position,
        { input: {}, output: {} },
        layout_position
      )
    } else {
      const search_unit_id = this._search_unit_id
      this._search_unit_id = null
      this._search_unit_datum_id = null
      this._search_unit_datum_node_id = null
      this._search_unit_merges = {}
      this._hide_search()
      this._refresh_node_color(search_unit_id!)
    }
  }

  private _refresh_unit_compatibility = (unit_id: string) => {
    const display_node_id = this._get_display_node_id()
    if (display_node_id.length > 0) {
      const { all_pin, all_pin_ref, all_pin_ref_unit, all_data } =
        this._is_all_node(display_node_id)

      if (all_pin) {
        if (all_pin_ref) {
          if (!all_pin_ref_unit[unit_id]) {
            this._compatible_node_id[unit_id] = true
            this._refresh_node_fixed(unit_id)
            this._refresh_node_selection(unit_id)
          }
        } else {
          this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
            if (this._is_pin_all_pin_match(pin_node_id, display_node_id)) {
              this._compatible_node_id[pin_node_id] = true
              this._refresh_node_fixed(pin_node_id)
              this._refresh_node_selection(pin_node_id)
            }
          })
        }
      } else if (all_data) {
        this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
          if (this._is_pin_all_datum_match(pin_node_id, display_node_id)) {
            this._compatible_node_id[pin_node_id] = true
            this._refresh_node_fixed(pin_node_id)
            this._refresh_node_selection(pin_node_id)
          }
        })
      }
    }
  }

  private _on_search_list_shown = () => {
    // console.log('Graph', '_on_search_list_shown')
    const { animate } = this.$props

    this._search_hidden = false

    if (!this._control_lock) {
      return
    }

    if (
      this._mode === 'none' ||
      this._mode === 'info' ||
      this._mode === 'multiselect'
    ) {
      this._set_crud_mode('add')
    }

    this._disable_keyboard()

    this._start_graph_simulation(LAYER_NORMAL)

    if (this._tree_layout) {
      this._refresh_all_layout_node_target_position()

      if (animate) {
        this._animate_all_current_layout_layer_node()
      } else {
        this._set_all_current_layout_layer_core_position()
      }
    }
  }

  private _on_search_list_hidden = () => {
    // console.log('Graph', '_on_search_list_hidden')
    this._search_hidden = true

    if (!this._control_lock) {
      return
    }

    if (!this._search_adding_unit) {
      if (this._search_unit_id) {
        const search_unit_id = this._search_unit_id

        if (this._mode === 'add' || this._mode === 'none') {
          this._sim_remove_unit(search_unit_id)
          this._spec_remove_unit(search_unit_id)
        } else if (this._mode === 'change') {
          this._swap_search_unit(this._search_change_unit_spec_id!)
          this._search_change_unit_spec_id = null
        } else if (this._mode === 'remove') {
          // TODO
        }

        this._search_unit_id = null
        this._search_unit_spec_id = null
        this._search_unit_graph_position = null
        this._search_unit_component_size = null

        this._search_option_valid_pin_matches = {}

        if (this._mode === 'change') {
          for (const merge_id in this._search_unit_merges) {
            const merge = this._search_unit_merges[merge_id]
            this._pod_add_merge(merge_id, merge)
          }
          this._reset_unit_color(search_unit_id)
        }
      }
    }

    if (this._search_unit_datum_node_id) {
      const search_unit_datum_node_id = this._search_unit_datum_node_id
      if (this._mode === 'data' || this._mode === 'none') {
        this._remove_datum(search_unit_datum_node_id)
      }

      this._search_unit_datum_id = null
      this._search_unit_datum_node_id = null
    }

    // this._set_search_mode('add')
    this._set_crud_mode('none')
    this._set_search_filter(() => true)

    this.focus()

    this._enable_keyboard()
    // this._enable_crud()

    if (this._search_fallback_position) {
      const { x, y } = this._search_fallback_position
      this._zoom_center_at(x, y)
    }
  }

  private _on_enter_mode = ({ mode }: { mode: Mode }) => {
    // console.log('Graph', '_on_enter_mode', mode)
    const { $theme } = this.$context

    const prev_mode = this._mode

    this._mode = mode

    const color = this._get_color()

    const mode_color = getThemeModeColor($theme, mode, color)

    if (this._search_hidden) {
      if (
        this.__is_freeze_mode(prev_mode) &&
        !this.__is_freeze_mode(this._mode)
      ) {
        for (const node_id in this._drag_node_id) {
          this._descend_node(node_id)
        }
      }

      if (prev_mode !== 'none' && this._mode === 'none') {
        for (const selected_node_id in this._selected_node_id) {
          if (this._is_unit_node_id(selected_node_id)) {
            this._enable_core_resize(selected_node_id)
          } else if (this._is_datum_node_id(selected_node_id)) {
            this._disable_datum_overlay(selected_node_id)
          }
        }
      } else if (prev_mode === 'none' && this._mode !== 'none') {
        for (const selected_node_id in this._selected_node_id) {
          if (this._is_unit_node_id(selected_node_id)) {
            this._disable_core_resize(selected_node_id)
          } else if (this._is_datum_node_id(selected_node_id)) {
            this._enable_datum_overlay(selected_node_id)
          }
        }
      }

      const mode_node = (node_id: string): void => {
        this._set_node_mode_color(node_id)
      }

      if (this._hover_node_count > 0) {
        let selected_count = 0
        for (const hovered_node_id in this._hover_node_id) {
          const anchor_node_id = this._get_node_anchor_node_id(hovered_node_id)
          mode_node(hovered_node_id)
          mode_node(anchor_node_id)
          if (this._is_node_selected(anchor_node_id)) {
            selected_count++
          }
        }
        if (selected_count > 0) {
          for (const selected_node_id in this._selected_node_id) {
            mode_node(selected_node_id)
          }
        }
      } else if (this._selected_node_count > 0) {
        for (const selected_node_id in this._selected_node_id) {
          mode_node(selected_node_id)
        }
      }

      if (prev_mode !== 'add' && this._mode === 'add') {
        const units = this.get_units()
        for (const unit_id in units) {
          this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
            if (this._is_link_pin_ignored(pin_node_id)) {
              this._set_link_pin_opacity(pin_node_id, '0.5')
              this._set_link_pin_pointer_events(pin_node_id, 'inherit')
            }
          })
        }
        this._start_graph_simulation(LAYER_NORMAL)
        // if (this._tree_layout) {
        //   this._start_layout_current_layer_simulation()
        // }
      } else if (prev_mode === 'add' && this._mode !== 'add') {
        const units = this.get_units()
        for (let unit_id in units) {
          this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
            if (this._is_link_pin_ignored(pin_node_id)) {
              this._set_link_pin_opacity(pin_node_id, '0')
              this._set_link_pin_pointer_events(pin_node_id, 'none')
            }
          })
        }
      }

      if (prev_mode !== 'info' && this._mode === 'info') {
        if (this._hover_node_count > 0) {
          this._set_all_nodes_links_opacity(0.2)
          for (const hovered_node_id in this._hover_node_id) {
            this._show_node_info(hovered_node_id)
          }
        } else if (this._selected_node_count > 0) {
          this._set_all_nodes_links_opacity(0.2)
          for (const selected_node_id in this._selected_node_id) {
            this._show_node_info(selected_node_id)
          }
        }
      } else if (prev_mode === 'info' && this._mode !== 'info') {
        if (this._info_node_id.size > 0) {
          this._set_all_nodes_links_opacity(1)
          for (const info_node_id of this._info_node_id) {
            this._hide_node_info(info_node_id)
          }
        }
      }

      if (prev_mode !== 'change' && this._mode === 'change') {
        for (const drag_node_id in this._drag_node_id) {
          const pointer_id = getObjSingleKey(
            this._pressed_node_id_pointer_id[drag_node_id]
          )
          this._on_node_blue_drag_start(
            drag_node_id,
            Number.parseInt(pointer_id, 10)
          )
        }
      } else if (prev_mode === 'change' && this._mode !== 'change') {
        for (const drag_node_id in this._drag_node_id) {
          this._on_unit_blue_drag_end(drag_node_id)
        }
      }

      if (prev_mode !== 'remove' && this._mode === 'remove') {
        for (const drag_node_id in this._drag_node_id) {
          const pointer_id = getObjSingleKey(
            this._pressed_node_id_pointer_id[drag_node_id]
          )
          this._on_node_red_drag_start(
            drag_node_id,
            Number.parseInt(pointer_id, 10)
          )
        }
      } else if (prev_mode === 'remove' && this._mode !== 'remove') {
        for (const drag_node_id in this._drag_node_id) {
          this._on_node_red_drag_end(drag_node_id)
        }

        if (this._drag_and_drop) {
          const pointerId = this._drag_and_drop_pointer
          const position = this._pointer_position[pointerId]

          const spec = this.$system.$flag.__DRAG__AND__DROP__[pointerId]

          const _position = this._screen_to_world(position.x, position.y)

          this.paste_spec(spec, _position)

          this._cancel_drag_and_drop()

          this.focus()
        }
      }

      if (prev_mode !== 'multiselect' && this._mode === 'multiselect') {
        if (this._long_press_count > 0) {
          if (this._pointer_down_count === 1) {
            const pointer_id = Number.parseInt(
              getObjSingleKey(this._pointer_down)
            )
            const pointer_node_id =
              this._pointer_id_pressed_node_id[pointer_id] || null
            if (pointer_node_id) {
              if (this._is_unit_node_id(pointer_node_id)) {
                this._start_long_press_collapse(
                  pointer_id,
                  pointer_node_id,
                  this._long_press_screen_position
                )
              }
            } else {
              this._start_long_press_collapse(
                pointer_id,
                null,
                this._long_press_screen_position
              )
            }
          }
        }
        // mergeStyle(this._grid, {
        //   touchAction: 'none',
        // })

        this._refresh_compatible()
      } else if (prev_mode === 'multiselect' && this._mode !== 'multiselect') {
        if (this._long_press_collapsing) {
          this._stop_long_press_collapse()
        }
        // mergeStyle(this._grid, {
        //   touchAction: 'all',
        // })
        this._restart_gesture = false

        this._refresh_compatible()
      }
    } else {
      if (this._search_unit_id) {
        const search_unit_id = this._search_unit_id
        if (prev_mode !== mode) {
          if (mode === 'none') {
            this._hide_search()
          } else if (mode === 'change') {
            // this._commit_search_unit()
            this._blue_click_unit(search_unit_id)
          } else if (mode === 'remove') {
            // TODO
          } else if (mode === 'add') {
            // this._commit_search_unit()
            // const position = this._get_node_position(search_unit_id)
            // const new_unit_id = this._new_unit_id()
            // this._add_search_unit(new_unit_id, this._search_unit_spec_id!, position)
          } else if (mode === 'data') {
            const spec_id = this._get_unit_spec_id(search_unit_id)
            const position = this._get_node_position(search_unit_id)
            this._remove_search_unit()
            this._add_data_search_unit(spec_id, position)
          }
        }

        this._set_node_mode_color(this._search_unit_id)
      }

      if (this._search_unit_datum_node_id) {
        const search_unit_datum_node_id = this._search_unit_datum_node_id
        if (prev_mode !== mode) {
          if (mode === 'change') {
            // TODO
          } else if (mode === 'remove') {
            // TODO
          } else if (mode === 'add') {
            const position = this._get_node_position(search_unit_datum_node_id)
            const layout_position = position
            const spec_id = this._search_unit_datum_spec_id
            this._remove_data_search_unit()
            const new_unit_id = this._new_unit_id(spec_id)
            this._add_search_unit(
              new_unit_id,
              spec_id,
              position,
              { input: {}, output: {} },
              layout_position
            )
          } else if (mode === 'data') {
            // TODO
          }
        }
      }
    }

    if (this._search) {
      const color = this._get_color()
      this._search.setProp(
        'selectedColor',
        getThemeModeColor($theme, mode, color)
      )
    }

    this.dispatchEvent('_graph_mode', { mode })
  }

  private _disable_crud = (): void => {
    if (this._modes && this._unlisten_crud) {
      // console.log('Graph', '_disable_crud')
      this._unlisten_crud()
      this._unlisten_crud = undefined
    }
  }

  private _refresh_tree_sub_component_index = (): void => {
    // console.log('Graph', '_refresh_tree_sub_component_index')
    const children = this._get_component_spec_children()
    let i = 0
    for (const sub_component_id of children) {
      i = this._set_tree_sub_component_index(sub_component_id, i)
    }

    if (this._is_fullwindow) {
      this._reorder_fullwindow_component_ids()
    }
  }

  private _reorder_fullwindow_component_ids = () => {
    this._fullwindow_component_ids = this._order_sub_component_ids(
      this._fullwindow_component_ids
    )
  }

  private _reorder_all_fullwindow = (): void => {
    this._decouple_all_fullwindow_component()
    this._reorder_fullwindow_component_ids()
    this._couple_all_fullwindow_component()
  }

  private _sub_component_index: Dict<number> = {}

  private _set_tree_sub_component_index = (
    sub_component_id: string,
    i: number
  ): number => {
    // console.log('Graph', '_set_tree_sub_component_index', sub_component_id, i)
    this._sub_component_index[sub_component_id] = i
    const children = this._get_sub_component_spec_children(sub_component_id)
    i++
    for (let child_id of children) {
      i = this._set_tree_sub_component_index(child_id, i)
    }
    return i
  }

  private _on_transcend_click = (): void => {
    if (this._core_component_unlocked_count > 0) {
      this._lock_all_component()
    } else {
      if (this._is_fullwindow) {
        this._leave_all_fullwindow(true)
      } else {
        this._enter_default_fullwindow()
      }
    }
  }

  private _order_sub_component_ids = (
    sub_component_ids: string[]
  ): string[] => {
    return sub_component_ids.sort((a, b) => {
      const a_index = this._sub_component_index[a]
      const b_index = this._sub_component_index[b]
      return a_index - b_index
    })
  }

  private _enter_default_fullwindow = (): void => {
    if (this._selected_component_count > 0) {
      this._enter_all_selected_fullwindow(true)
    } else {
      this._enter_all_fullwindow(true)
    }
  }

  private _enter_all_fullwindow = (animate: boolean): void => {
    // console.log('Graph', '_enter_all_fullwindow')
    const { component } = this.$props
    this._is_all_fullwindow = true
    const all_component_ids = Object.keys(component.$subComponent)
    const ordered_all_component_ids =
      this._order_sub_component_ids(all_component_ids)
    this._enter_fullwindow(animate, ordered_all_component_ids)
  }

  private _enter_all_selected_fullwindow = (animate: boolean) => {
    // console.log('Graph', '_enter_all_selected_fullwindow')
    const selected_sub_component_ids = Object.keys(this._selected_component)
    const ordered_selected_sub_component_ids = this._order_sub_component_ids(
      selected_sub_component_ids
    )
    this._enter_fullwindow(animate, ordered_selected_sub_component_ids)
  }

  private _get_sub_component_index = (sub_component_id: string): number => {
    const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)
    if (parent_id) {
      return this._get_sub_component_parent_root_index(sub_component_id)
    } else {
      return this._get_sub_component_root_index(sub_component_id)
    }
  }

  private _get_sub_component_root_index = (unit_id: string): number => {
    const children = this._get_component_spec_children()
    const index = children.indexOf(unit_id)
    return index
  }

  private _get_sub_component_parent_root_index = (
    sub_component_id: string
  ): number => {
    const parent_sub_component_id =
      this._get_sub_component_spec_parent_id(sub_component_id)
    const parent_sub_component_children = this._get_sub_component_spec_children(
      parent_sub_component_id
    )
    const sub_component_index =
      parent_sub_component_children.indexOf(sub_component_id)
    return sub_component_index
  }

  private _get_sub_component_tree_index = (
    sub_component_id: string
  ): number => {
    const parent_sub_component_id =
      this._get_sub_component_spec_parent_id(sub_component_id)
    if (parent_sub_component_id) {
      const parent_sub_component_children =
        this._get_sub_component_spec_children(parent_sub_component_id)
      const parent_sub_component_index = this._get_sub_component_tree_index(
        parent_sub_component_id
      )
      const sub_component_index =
        parent_sub_component_children.indexOf(sub_component_id)
      const index = parent_sub_component_index + sub_component_index
      return index
    } else {
      return this._get_sub_component_root_index(sub_component_id)
    }
  }

  private _leave_all_fullwindow = (animate: boolean) => {
    // console.log('Graph', '_leave_all_fullwindow')
    this._leave_fullwindow(animate)

    this._fullwindow_component_set = new Set()
    this._fullwindow_component_ids = []

    this._is_all_fullwindow = false
  }

  private _animate_frame = (
    unit_id: string,
    {
      x0,
      y0,
      w0,
      h0,
      k0,
    }: {
      x0: number
      y0: number
      w0: number
      h0: number
      k0: number
    },
    f: () => {
      x1: number
      y1: number
      w1: number
      h1: number
      k1: number
    },
    N: number,
    callback: () => void
  ): (() => { x: number; y: number; w: number; h: number }) => {
    const frame = this._core_component_frame[unit_id]

    let x = x0
    let y = y0

    let w = w0
    let h = h0

    let k = k0

    frame.$element.style.left = `${x}px`
    frame.$element.style.top = `${y}px`
    frame.$element.style.width = `${w}px`
    frame.$element.style.height = `${h}px`
    frame.$element.style.transform = `scale(${k})`

    let i = 1

    let abort = false

    const animate = () => {
      if (abort) {
        return
      }

      const { x1, y1, w1, h1, k1 } = f()

      const dx = x1 - x0
      const dy = y1 - y0

      const dw = w1 - w0
      const dh = h1 - h0

      const dk = k1 - k0

      const ddx = dx / N
      const ddy = dy / N

      const ddw = dw / N
      const ddh = dh / N

      const ddk = dk / N

      x += ddx
      y += ddy

      w += ddw
      h += ddh

      k += ddk

      frame.$element.style.left = `${x}px`
      frame.$element.style.top = `${y}px`
      frame.$element.style.width = `${w}px`
      frame.$element.style.height = `${h}px`
      frame.$element.style.transform = `scale(${k})`

      if (i < N) {
        requestAnimationFrame(animate)
        i++
      } else {
        callback()
      }
    }

    if (N === 0) {
      callback()
    } else {
      requestAnimationFrame(animate)
    }

    return () => {
      abort = true

      callback()

      return { x, y, w, h }
    }
  }

  private _leave_fullwindow = (animate: boolean = true) => {
    // console.log('Graph', '_leave_fullwindow')
    const { frameOut } = this.$props

    this._is_fullwindow = false

    if (!this._frame_out) {
      this._set_fullwindow_frame_off(animate)
    }

    if (this._in_component_control) {
      this._leave_component_frame()

      const sub_component_ids = this._fullwindow_component_ids

      if (
        FF_ANIMATE_FULLWINDOW &&
        (!FF_PREVENT_FRAMEOUT_ANIMATE_FULLWINDOW || !frameOut)
      ) {
        const { $width, $height } = this.$context

        let i = 0

        for (const sub_component_id of sub_component_ids) {
          const frame = this._core_component_frame[sub_component_id]

          const { width: _w0, height: _h0 } =
            this._get_unit_component_graph_size(sub_component_id)

          const { x: _x0, y: _y0 } = this._get_node_position(sub_component_id)

          let x0 = 0
          let y0 = 0

          y0 += i * $width

          let w0 = $width
          let h0 = $height

          const w1 = _w0
          const h1 = _h0

          if (this._animating_enter_fullwindow[sub_component_id]) {
            const abort = this._abort_enter_fullwindow[sub_component_id]

            const { x, y, w, h } = abort()

            x0 = x
            y0 = y
            w0 = w
            h0 = h

            delete this._animating_enter_fullwindow[sub_component_id]
            delete this._abort_enter_fullwindow[sub_component_id]
          }

          this._decouple_sub_component(sub_component_id)

          if (this._tree_layout) {
            const parent_id =
              this._get_sub_component_spec_parent_id(sub_component_id)
            if (parent_id) {
              if (this._layout_path.includes(parent_id)) {
                this._enter_sub_component_frame(sub_component_id)
              } else {
                this._append_sub_component_parent_root(
                  parent_id,
                  sub_component_id
                )
              }
            } else {
              this._enter_sub_component_frame(sub_component_id)
            }
          } else {
            this._enter_sub_component_frame(sub_component_id)
          }

          this._animating_leave_fullwindow[sub_component_id] = true

          this._abort_leave_fullwindow[sub_component_id] = this._animate_frame(
            sub_component_id,
            { x0, y0, w0, h0, k0: 1 },
            () => {
              if (this._tree_layout) {
                const { $width, $height } = this.$context

                const { x, y, width, height } =
                  this._layout_node[sub_component_id]

                const x1 = x + $width / 2 - width / 2
                const y1 = y + $height / 2 - height / 2
                const w1 = width
                const h1 = height

                return { x1, y1, w1, h1, k1: 1 }
              } else {
                const { x: _x0, y: _y0 } =
                  this._get_node_screen_position(sub_component_id)
                const { width: _w0, height: _h0 } =
                  this._get_unit_component_graph_size(sub_component_id)

                const { k } = this._zoom

                const k_1 = k - 1

                const x1 = _x0 + k + (_w0 * k_1) / 2
                const y1 = _y0 + k + (_h0 * k_1) / 2

                // const { x: x1, y: y1 } = this._world_to_screen(
                //   _x0 + k - _w0 * k_1 / 2,
                //   _y0 + k - _h0 * k_1 / 2
                // )

                // const { x: x1, y: y1 } = this._world_to_screen(
                //   _x0 - _w0 * (k - 1) / 2 - w0 /2,
                //   _y0 - _h0 * (k - 1) / 2
                // )

                const k1 = k

                return { x1, y1, w1, h1, k1 }
              }
            },
            animate ? (12 * ANIMATION_T) / 0.2 : 0,
            () => {
              const core_content = this._core_content[sub_component_id]

              this._graph.removeChild(frame, 'default')

              core_content.appendChild(frame)

              frame.$element.style.width = '100%'
              frame.$element.style.height = '100%'
              frame.$element.style.left = '0'
              frame.$element.style.top = '0'
              frame.$element.style.transform = ''

              this._animating_leave_fullwindow[sub_component_id] = false
            }
          )

          i++
        }
      } else {
        this._decouple_all_fullwindow_component()

        if (this._tree_layout) {
          for (const sub_component_id of sub_component_ids) {
            const parent_id =
              this._get_sub_component_spec_parent_id(sub_component_id)

            if (parent_id) {
              if (this._layout_path.includes(parent_id)) {
                this._enter_sub_component_frame(sub_component_id)
              } else {
                this._append_sub_component_parent_root(
                  parent_id,
                  sub_component_id
                )
              }
            } else {
              this._enter_sub_component_frame(sub_component_id)
            }
          }
        } else {
          for (const sub_component_id of sub_component_ids) {
            this._enter_sub_component_frame(sub_component_id)
          }
        }
      }
    }

    if (!this._frame_out) {
      if (!this._disabled) {
        this._enable_input()
      }
    }

    if (!this._disabled) {
      if (this._transcend) {
        this._transcend.up()
      }

      this.focus()
    }

    this.dispatchEvent('leave_fullwindow', {}, false)
  }

  private _place_sub_component = (sub_component_id: string): void => {
    // console.log('Graph', '_place_sub_component', sub_component_id)
    if (this._is_all_fullwindow) {
      this._fullwindow_component_set.add(sub_component_id)
      push(this._fullwindow_component_ids, sub_component_id)
      this._couple_sub_component(sub_component_id)
    } else {
      this._enter_sub_component_frame(sub_component_id)
    }
  }

  private _displace_sub_component = (sub_component_id: string): void => {
    if (this._is_sub_component_fullwindow(sub_component_id)) {
      this._decouple_sub_component(sub_component_id)
    } else {
      this._leave_sub_component_frame(sub_component_id)
    }
  }

  private _displace_all_sub_component = (): void => {
    const { component } = this.$props
    for (const component_id in component.$subComponent) {
      this._displace_sub_component(component_id)
    }
  }

  private _couple_all_fullwindow_component = (): void => {
    for (const sub_component_id of this._fullwindow_component_ids) {
      this._couple_sub_component(sub_component_id)
    }
  }

  private _couple_sub_component = (sub_component_id: string): void => {
    // console.log('Graph', '_couple_sub_component', sub_component_id)
    this.__move_sub_component(
      sub_component_id,
      (parent_id) => {
        this._append_sub_component_parent_root(parent_id, sub_component_id)
      },
      () => {
        this._append_sub_component_root(sub_component_id)
      }
    )
  }

  private _couple_sub_component_at = (
    sub_component_id: string,
    at: number
  ): void => {
    this.__move_sub_component(
      sub_component_id,
      (parent_id) => {
        this._insert_sub_component_parent_root_at(
          parent_id,
          sub_component_id,
          at
        )
      },
      () => {
        this._insert_sub_component_root_at(sub_component_id, at)
      }
    )
  }

  private _get_sub_component_fullwindow_parent_id = (
    sub_component_id: string
  ): string => {
    let parent_id = this._get_sub_component_spec_parent_id(sub_component_id)
    while (parent_id && !this._is_sub_component_fullwindow(parent_id)) {
      parent_id = this._get_sub_component_spec_parent_id(parent_id)
    }
    return parent_id
  }

  private __move_sub_component = (
    sub_component_id: string,
    parent_root_callback: (parent_id: string) => void,
    root_callback: () => void
  ): void => {
    const parent_id =
      this._get_sub_component_fullwindow_parent_id(sub_component_id)
    if (parent_id) {
      parent_root_callback(parent_id)
    } else {
      root_callback()
    }
  }

  private _descend_sub_component = (sub_component_id: string): void => {
    this.__move_sub_component(
      sub_component_id,
      (parent_id) => {
        this._remove_sub_component_parent_root(parent_id, sub_component_id)
        this._enter_sub_component_frame(sub_component_id)
      },
      () => {
        this._remove_sub_component_root(sub_component_id)
        this._enter_sub_component_frame(sub_component_id)
      }
    )
  }

  public decouple_all_fullwindow_component = (): void => {
    for (const sub_component_id of this._fullwindow_component_ids) {
      this._decouple_sub_component(sub_component_id)
    }
  }

  private _decouple_all_fullwindow_component = (): void => {
    for (const sub_component_id of this._fullwindow_component_ids) {
      this._decouple_sub_component(sub_component_id)
    }
  }

  private _decouple_sub_component = (sub_component_id: string): void => {
    // console.log('Graph', '_decouple_sub_component', sub_component_id)
    this.__move_sub_component(
      sub_component_id,
      (parent_id) => {
        this._remove_sub_component_parent_root(parent_id, sub_component_id)
      },
      () => {
        this._remove_sub_component_root(sub_component_id)
      }
    )
  }

  private _unlisten_crud: Unlisten | undefined

  private _enable_crud = (): void => {
    if (this._modes) {
      if (!this._unlisten_crud) {
        // console.log('Graph', '_enable_crud')
        this._unlisten_crud = this._modes.addEventListeners([
          makeCustomListener('entermode', this._on_enter_mode),
        ])

        this._modes.setProp('mode', this._mode)

        this._mode = this._modes.getMode()
      }
    }
  }

  private _keyboard_unlisten: Unlisten | undefined

  private _is_shift_pressed = (): boolean => {
    const { $system } = this
    const { $input } = $system
    const { $keyboard } = $input
    // return $keyboard.pressed.indexOf('Alt') > -1
    return $keyboard.$pressed.indexOf(16) > -1
  }

  private _unlisten_escape: Unlisten | undefined

  private _enable_escape = (): void => {
    if (!this._unlisten_escape) {
      this._unlisten_escape = this.addEventListener(
        makeShortcutListener([
          {
            combo: 'Escape',
            keydown: this._on_escape_keydown,
            strict: false,
          },
        ])
      )
    }
  }

  private _disable_escape = (): void => {
    if (this._unlisten_escape) {
      this._unlisten_escape()
      this._unlisten_escape = undefined
    }
  }

  private _unlisten_enter: Unlisten | undefined

  private _enable_enter = (): void => {
    if (!this._unlisten_enter) {
      this._unlisten_enter = this.addEventListener(
        makeShortcutListener([
          {
            combo: 'Enter',
            keydown: this._on_enter_keydown,
          },
        ])
      )
    }
  }

  private _disable_enter = (): void => {
    if (this._unlisten_enter) {
      this._unlisten_enter()
      this._unlisten_enter = undefined
    }
  }

  private _enable_keyboard = (): void => {
    if (!this._keyboard_unlisten) {
      // console.log('Graph', '_enable_keyboard')

      const combo_list: Shortcut[] = [
        {
          combo: ['Backspace', 'Delete'],
          keydown: this._on_backspace_keydown,
        },
        {
          // combo: 'Ctrl + p',
          // combo: 'p',
          // combo: 'space',
          combo: ['Ctrl + ;'],
          keydown: this._on_ctrl_semicolon_keydown,
          strict: false,
          // keyup: this._on_ctrl_p_keydown,
        },
        {
          // combo: 'p',
          combo: ';',
          keydown: (key, { ctrlKey }) => {
            if (ctrlKey) {
              this._on_ctrl_semicolon_keydown()
            }
          },
        },
        {
          combo: ['Ctrl + s'],
          keydown: (key, { ctrlKey }) => {
            this._on_ctrl_s_keydown()
          },
        },
        {
          combo: 'l',
          strict: true,
          keydown: this._on_l_keydown,
        },
        {
          combo: 't',
          strict: true,
          keydown: this._on_t_keydown,
        },
        {
          combo: 'Ctrl + a',
          keydown: this._on_ctrl_a_keydown,
        },
        {
          combo: 'Ctrl + c',
          keydown: this._on_ctrl_c_keydown,
        },
        {
          combo: 'Ctrl + x',
          keydown: this._on_ctrl_x_keydown,
        },
        {
          combo: 'Ctrl + v',
          keydown: this._on_ctrl_v_keydown,
        },
        {
          combo: 'Ctrl + z',
          keydown: this._on_ctrl_z_keydown,
        },
        {
          combo: 'Ctrl + Shift + z',
          keydown: this._on_ctrl_shift_z_keydown,
        },
      ]
      const shortcutListener = makeShortcutListener(combo_list)
      this._keyboard_unlisten = this.addEventListener(shortcutListener)
    }

    this._enable_mode_keyboard()
  }

  private _unlisten_mode_keyboard: Unlisten | undefined = undefined

  private _enable_mode_keyboard = (): void => {
    if (this._modes && !this._unlisten_mode_keyboard) {
      this._unlisten_mode_keyboard = enable_mode_keyboard(
        this,
        (mode: Mode) => {
          if (!this._search_hidden) {
            return false
          }

          if (this._edit_datum_node_id) {
            return false
          }

          this._set_crud_mode(mode)

          return true
        }
      )
    }
  }

  private _disable_mode_keyboard = (): void => {
    if (this._unlisten_mode_keyboard) {
      this._unlisten_mode_keyboard()
      this._unlisten_mode_keyboard = undefined
    }
  }

  private _unlisten_search: Unlisten | undefined

  private _control: GUI | null = null
  private _search: Search | null = null
  private _minimap: Minimap | null = null
  private _modes: Modes | null = null

  private _transcend: Transcend | null = null

  // private _frame: Frame | null = null
  private _frame: Component | null = null

  private _lock_control = (): void => {
    if (this._control) {
      if (!this._control_lock) {
        if (!this._disabled) {
          // console.log('Graph', '_lock_control')
          this._control_lock = true
          this._control.dispatchEvent('lock', {}, false)
          if (
            !this._subgraph_unit_id &&
            (!this._is_fullwindow || this._frame_out) &&
            (this._temp_control_lock ||
              this._core_component_unlocked_count === 0)
          ) {
            this._enable_input()
          }
        }
      }
    }
  }

  private _enable_search = (): void => {
    if (this._search && !this._unlisten_search) {
      // console.log('Graph', '_enable_search')

      const selectedListener = makeCustomListener(
        'selected',
        this._on_search_item_selected
      )
      const shownListener = makeCustomListener(
        'shown',
        this._on_search_list_shown
      )
      const hiddenListener = makeCustomListener(
        'hidden',
        this._on_search_list_hidden
      )
      const pickListener = makeCustomListener('pick', this._on_search_item_pick)
      const emptyListener = makeCustomListener('empty', this._on_search_empty)
      const shapeListener = makeCustomListener('shape', this._on_search_shape)

      this._unlisten_search = this._search.addEventListeners([
        selectedListener,
        shownListener,
        hiddenListener,
        pickListener,
        emptyListener,
        shapeListener,
      ])

      this._search.setProp('selectedColor', GREEN)

      const shape = this._tree_layout ? 'rect' : 'circle'
      this._search.setShape(shape)

      if (this._search_hidden) {
        this._hide_search()
      } else {
        this._show_search()
      }
    }
  }

  private _disable_search = (): void => {
    if (this._unlisten_search) {
      // console.log('Graph', '_disable_search')
      this._unlisten_search()
      this._unlisten_search = undefined
    }
  }

  private _unlisten_transcend: Unlisten | undefined

  private _enable_transcend = (): void => {
    // console.log('Graph', '_enable_transcend')
    if (this._transcend) {
      if (!this._unlisten_transcend) {
        this._unlisten_transcend = this._transcend.addEventListener(
          makeClickListener({
            onClick: this._on_transcend_click,
          })
        )

        if (this._is_fullwindow) {
          this._transcend.down(false)
        } else {
          this._transcend.up(false)
        }

        this._transcend.show(true)
      }
    }
  }

  private _disable_transcend = (): void => {
    if (this._transcend) {
      if (this._unlisten_transcend) {
        this._unlisten_transcend()
        this._unlisten_transcend = undefined
        this._transcend.hide(true)
      }
    }
  }

  private _disable_keyboard = (): void => {
    if (this._keyboard_unlisten) {
      // console.log('Graph', '_disable_keyboard')
      this._keyboard_unlisten()
      this._keyboard_unlisten = undefined
    }

    this._disable_mode_keyboard()
  }

  private _pointer_up_all_pressed_pointer_id = () => {
    for (const pointer_id in this._pointer_id_pressed_node_id) {
      const pointerId = Number.parseInt(pointer_id)
      this.__on_pointer_up(pointerId)
    }
  }

  private _layout_core_animation_count: number = 0

  private _animate_layout_core = (
    sub_component_id: string,
    n0: {
      x: number
      y: number
      width: number
      height: number
      k: number
    },
    _n1: () => {
      x: number
      y: number
      width: number
      height: number
      k: number
    },
    callback: () => void
  ) => {
    // console.log('Graph', '_animate_layout_core', sub_component_id)
    if (this._layout_animation[sub_component_id] !== undefined) {
      cancelAnimationFrame(this._layout_animation[sub_component_id])
      this._layout_core_animation_count--
    }

    this._layout_core_animation_count++

    const { x: x0, y: y0, width: w0, height: h0, k: k0 } = n0

    this._set_layout_core_position(sub_component_id, x0, y0)
    this.__resize_layout_core(sub_component_id, w0, h0)
    this.__scale_layout_core(sub_component_id, k0)

    const animate = () => {
      const {
        x,
        y,
        width: w,
        height: h,
        k,
      } = this._layout_node[sub_component_id]

      const { x: x1, y: y1, width: w1, height: h1, k: k1 } = _n1()

      const c = 1 / 3

      const dx = x1 - x
      const dy = y1 - y
      const dw = w1 - w
      const dh = h1 - h
      const dk = k1 - k

      let ended = true

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        ended = false

        const _x = x + dx * c
        const _y = y + dy * c

        this._set_layout_core_position(sub_component_id, _x, _y)
      }

      if (Math.abs(dw) > 1 || Math.abs(dh) > 1) {
        ended = false

        const _w = w + dw * c
        const _h = h + dh * c

        this.__resize_layout_core(sub_component_id, _w, _h)
      }

      if (Math.abs(dk) > 0.01) {
        ended = false

        const _k = k + dk * c

        this.__scale_layout_core(sub_component_id, _k)
      }

      if (ended) {
        this._set_layout_core_position(sub_component_id, x1, y1)

        this.__resize_layout_core(sub_component_id, w1, h1)

        this.__scale_layout_core(sub_component_id, k1)

        delete this._layout_animation[sub_component_id]

        this._layout_core_animation_count--

        if (this._layout_core_animation_count === 0) {
          this._on_all_layout_core_animation_end()
        }

        callback()
      } else {
        this._layout_animation[sub_component_id] =
          requestAnimationFrame(animate)
      }
    }

    this._layout_animation[sub_component_id] = requestAnimationFrame(animate)
  }

  private _on_all_layout_core_animation_end = (): void => {
    // console.log('Graph', '_on_all_layout_core_animation_end')
    if (this._tree_layout) {
      //
    } else {
      this._set_minimap_to_graph()
    }
  }

  private _animate_layout_core_up = (
    sub_component_id: string,
    callback: () => void
  ): void => {
    const { $width, $height } = this.$context

    const graph_node = this._node[sub_component_id]

    let { x, y } = this._world_to_screen(graph_node.x, graph_node.y)

    x -= $width / 2
    y -= $height / 2

    const { width: _w0, height: _h0 } =
      this._get_unit_component_graph_size(sub_component_id)

    const { k } = this._zoom

    const w0 = _w0
    const h0 = _h0
    const k0 = k

    const anchor_id = this._get_layout_node_anchor_id(sub_component_id)

    this._animate_layout_core(
      sub_component_id,
      { x, y, width: w0, height: h0, k: k0 },
      () => {
        if (anchor_id === sub_component_id) {
          const anchor_node = this._layout_target_node[anchor_id]
          return anchor_node
        } else {
          const anchor_node = this._layout_node[anchor_id]
          return anchor_node
        }
      },
      callback
    )
  }

  private _enter_tree_layout = (): void => {
    // console.log('Graph', '_enter_tree_layout')
    const { animate } = this.$props

    this._pointer_up_all_pressed_pointer_id()

    this._tree_layout = true

    const opacity = '0.25'
    // mergeStyle(this._zoom_comp, { opacity })
    this._zoom_comp._root.$element.style.opacity = opacity

    // mergeStyle(this._layout_comp, { display: 'flex' })

    // this._layout_root_comp.$element.style.display = 'flex'

    this._layout_comp.$element.style.pointerEvents = 'inherit'

    if (this._layout_path.length > 0) {
      this._refresh_all_layout_layer_opacity()
    } else {
      this._layout_root.children.$element.style.opacity = '1'
    }

    const current_layout_layer = this._get_current_layout_layer()

    current_layout_layer.layer.$element.style.overflowY = 'auto'
    current_layout_layer.children.$element.style.overflowY = 'visible'

    for (const layer_id of this._layout_path) {
      const layer_layer = this._layout_layer[layer_id]

      layer_layer.children.$element.style.opacity = '1'
      layer_layer.children.$element.style.overflowY = 'hidden'

      layer_layer.layer.$element.style.overflowY = 'hidden'
    }

    this._refresh_all_layout_node_target_position()

    for (const sub_component_id in this._component.$subComponent) {
      const layout_core = this._layout_core[sub_component_id]

      this._listen_layout_core(sub_component_id, layout_core)

      this._show_layout_core(sub_component_id)

      this._refresh_component_children_counter(sub_component_id)

      const parent_id = this._sub_component_parent[sub_component_id]

      if (!this._layout_core_content_placed[sub_component_id]) {
        this._move_core_content_graph_to_layout(sub_component_id)
      }

      if (animate) {
        this._animate_layout_core_up(sub_component_id, () => {
          if (parent_id) {
            if (!this._layout_path.includes(parent_id)) {
              this._component_insert_child(parent_id, sub_component_id)
            }
          }
        })
      } else {
        const { x, y } = this._layout_target_node[sub_component_id]

        this._set_layout_core_position(sub_component_id, x, y)
      }
    }

    this._set_minimap_to_layout()
  }

  private _refresh_all_layout_node_target_position = () => {
    this._refresh_layout_node_target_position(null)
    for (const layer of this._layout_path) {
      this._refresh_layout_node_target_position(layer)
    }
  }

  private _listen_layout_core = (
    unit_id: string,
    component: Component
  ): void => {
    const unlisten = this._listen_node(unit_id, component)
    this._layout_core_unlisten[unit_id] = unlisten
  }

  private _unlisten_component = (unit_id: string): void => {
    const unlisten = this._layout_core_unlisten[unit_id]
    unlisten()
  }

  private _listen_node = (node_id: string, component: Component): Unlisten => {
    return component.addEventListeners([
      makePointerDownListener((event: IOPointerEvent) => {
        this._on_node_pointer_down(node_id, event)
      }),
      makePointerUpListener((event: IOPointerEvent) => {
        this._on_node_pointer_up(node_id, event)
      }),
      makePointerEnterListener((event: IOPointerEvent) => {
        this._on_node_pointer_enter(node_id, event)
      }),
      makePointerLeaveListener((event: IOPointerEvent) => {
        this._on_node_pointer_leave(node_id, event)
      }),
      makePointerCancelListener((event: IOPointerEvent) => {
        this._on_node_pointer_cancel(node_id, event)
      }),
      makeClickListener({
        onClick: (event: IOPointerEvent) => {
          this._on_node_click(node_id, event)
        },
        onDoubleClick: (event: IOPointerEvent) => {
          this._on_node_double_click(node_id, event)
        },
        onLongClick: (event: IOPointerEvent) => {
          this._on_node_long_click(node_id, event)
        },
        onLongPress: (event: IOPointerEvent) => {
          this._on_node_long_press(node_id, event)
        },
        onClickHold: (event: IOPointerEvent) => {
          this._on_node_click_hold(node_id, event)
        },
      }),
    ])
  }

  private _listen_link = (link_id: string, link: Element): Unlisten => {
    return link.addEventListeners([
      makePointerDownListener((event: IOPointerEvent) => {
        this._on_link_pointer_down(link_id, event)
      }),
      makePointerEnterListener((event: IOPointerEvent) => {
        this._on_link_pointer_enter(link_id, event)
      }),
      makePointerLeaveListener((event: IOPointerEvent) => {
        this._on_link_pointer_leave(link_id, event)
      }),
      makeClickListener({
        onClick: (event: IOPointerEvent) => {
          this._on_link_click(link_id, event)
        },
        onDoubleClick: (event: IOPointerEvent) => {
          this._on_link_click(link_id, event)
        },
      }),
    ])
  }

  private _layout_parent_root_placed: Dict<boolean> = {}

  private _animate_layout_core_down = (
    sub_component_id: string,
    callback: () => void
  ): void => {
    const layout_node = this._layout_node[sub_component_id]

    this._animate_layout_core(
      sub_component_id,
      layout_node,
      () => {
        const { $width, $height } = this.$context

        const graph_node = this._node[sub_component_id]

        const { x: _x, y: _y, width: _width, height: _height } = graph_node

        const position = this._world_to_screen(_x, _y)

        const { x: __x, y: __y } = position

        const parent_layout_layer =
          this._get_parent_layout_layer(sub_component_id)

        const { scrollTop = 0 } = parent_layout_layer.layer.$element

        const x = __x - $width / 2
        const y = __y - $height / 2 + scrollTop

        const { k } = this._zoom

        const width = _width
        const height = _height

        return { x, y, width, height, k }
      },
      callback
    )
  }

  private _leave_tree_layout = (): void => {
    console.log('Graph', '_leave_tree_layout')
    const { animate } = this.$props

    this._pointer_up_all_pressed_pointer_id()

    this._tree_layout = false

    const opacity = '1'
    // mergeStyle(this._zoom_comp, { opacity })
    this._zoom_comp._root.$element.style.opacity = opacity

    this._layout_comp.$element.style.pointerEvents = 'none'

    const children = this._get_component_spec_children()
    for (const sub_component_id of children) {
      this._layout_uncollapse_sub_component(sub_component_id)
    }

    this._layout_root.children.$element.style.opacity = '1'
    this._layout_root.layer.$element.style.overflowY = 'hidden'
    for (const layer_id of this._layout_path) {
      const layer_layer = this._layout_layer[layer_id]
      layer_layer.children.$element.style.opacity = '1'
      layer_layer.layer.$element.style.overflowY = 'hidden'
      layer_layer.children.$element.style.overflowY = 'hidden'
    }

    for (const sub_component_id in this._component.$subComponent) {
      this._refresh_component_children_counter(sub_component_id)

      this._show_layout_core(sub_component_id)

      this._unlisten_component(sub_component_id)

      if (animate) {
        this._animate_layout_core_down(sub_component_id, () => {
          if (this._layout_core_content_placed[sub_component_id]) {
            this._move_core_content_layout_to_graph(sub_component_id)

            const { width, height } =
              this._get_unit_component_graph_size(sub_component_id)
            this._resize_core_area(sub_component_id, width, height)
            this._resize_core_selection(sub_component_id, width, height)

            this._hide_layout_core(sub_component_id)
          }
        })
      } else {
        this._move_core_content_layout_to_graph(sub_component_id)

        this._hide_layout_core(sub_component_id)
      }
    }

    // this._set_minimap_to_graph()
  }

  private _set_minimap_to_graph = (): void => {
    if (this._minimap) {
      this._minimap.setProp('nodes', this._unit_node)
      this._minimap.setProp('links', this._unit_to_unit)
      this._minimap.tick()
    }
  }

  private _set_minimap_to_layout = (): void => {
    if (this._minimap) {
      this._minimap.setProp('nodes', this._layout_node)
      this._minimap.setProp('links', {})
      this._minimap.tick()
    }
  }

  private _resize = (width: number, height: number): void => {
    // console.log('Graph', '_resize', width, height)

    const widthStr = `${width}px`
    const heightStr = `${height}px`

    mergeProps(this._zoom_comp, {
      width,
      height,
    })
    mergeProps(this._zoom_comp_alt, {
      width,
      height,
    })

    // mergeStyle(this._multiselect_area_svg, {
    //   width: widthStr,
    //   height: heightStr,
    // })
    this._multiselect_area_svg.$element.style.width = widthStr
    this._multiselect_area_svg.$element.style.height = heightStr

    if (this._minimap_screen) {
      this._minimap_screen.setProp('width', width / this._zoom.k)
      this._minimap_screen.setProp('height', height / this._zoom.k)
    }

    if (this._tree_layout) {
      this._refresh_all_layout_node_target_position()
    }
  }

  private _on_context_resize = ({
    width,
    height,
  }: IOFrameResizeEvent): void => {
    // console.log('Graph', '_on_context_resize')
    this._resize(width, height)

    const dw = width - this._width
    const dh = height - this._height

    this._width = width
    this._height = height

    const zoom = translate(this._zoom, dw / 2, dh / 2)
    this.set_zoom(zoom)

    for (const unit_id in this._subgraph_cache) {
      if (this._subgraph_unit_id !== unit_id) {
        const graph = this._subgraph_cache[unit_id]
        const graph_zoom = graph.getZoom()
        const graph_translated_zoom = translate(graph_zoom, dw / 2, dh / 2)
        graph.setProp('zoom', graph_translated_zoom)
      }
    }

    if (this._tree_layout) {
      this._refresh_all_layout_node_size()

      this._refresh_all_layout_node_target_position()

      this._animate_all_layout_layer()
    }

    if (this._exposed_pin_unplugged_count > 0) {
      this._start_graph_simulation(LAYER_EXPOSED)
    }
  }

  private _on_context_enabled = (): void => {
    // console.log('Graph', '_on_context_enabled')
    this._refresh_enabled()
  }

  private _on_context_disabled = (): void => {
    // console.log('Graph', '_on_context_disabled')
    this._refresh_enabled()
  }

  private _on_context_theme_changed = (): void => {
    const { $theme } = this.$context

    this._refresh_color()

    for (let component_id in this._core_component_frame) {
      const frame = this._core_component_frame[component_id]
      frame.setProp('theme', $theme)
    }
  }

  private _on_context_color_changed = (): void => {
    const { $color } = this.$context

    this._refresh_color()

    const color = this._get_color()

    for (let component_id in this._core_component_context) {
      const frame = this._core_component_frame[component_id]
      frame.setProp('color', color)
    }
  }

  private _on_focus = () => {
    // console.log('Graph', '_on_focus')
    if (this._subgraph_graph) {
      this._subgraph_graph.focus()
    } else {
      this._focused = true

      this._lock_control()
    }
  }

  private _on_blur = () => {
    // console.log('Graph', '_on_blur')
    this._focused = false
  }

  private _disable_input = (): void => {
    if (!this._input_disabled) {
      // console.trace('Graph', '_disable_input')
      this._input_disabled = true

      this._disable_keyboard()
      this._disable_enter()
      this._disable_escape()

      this._disable_crud()
      this._disable_search()
      this._disable_minimap()

      this._hide_control()
    }
  }

  private _input_disabled: boolean = true

  private _enable_input = (): void => {
    if (this._input_disabled) {
      // console.trace('Graph', '_enable_input')
      this._input_disabled = false

      this._enable_keyboard()
      this._enable_enter()
      this._enable_escape()

      this._enable_crud()
      this._enable_search()
      this._enable_minimap()

      this._show_control()
    }
  }

  private _on_node_pointer_enter = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_pointer_enter', node_id)
    const { pointerId } = event

    if (!this._pointer_id_hover_node_id[pointerId]) {
      if (
        !this._pointer_id_pressed_node_id[pointerId] ||
        this._pointer_id_pressed_node_id[pointerId] === node_id
      ) {
        this._set_node_hovered(node_id, pointerId, true)
      }
    }
  }

  private _on_node_pointer_leave = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_pointer_leave', node_id)
    const { pointerId } = event

    if (this._pointer_id_hover_node_id[pointerId]) {
      this._set_node_hovered(node_id, pointerId, false)
    }
  }

  private _get_node_comp = (node_id: string): Div => {
    if (this._tree_layout) {
      return this._layout_core[node_id]
    } else {
      return this._node_comp[node_id]
    }
  }

  private _on_node_pointer_down = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_pointer_down', node_id)
    if (this._resize_node_id_pointer_id[node_id] !== undefined) {
      return
    }

    if (this._edit_node_name_id === node_id) {
      return
    }

    const { pointerId } = event

    this._set_node_pointer_capture(node_id, pointerId)

    this.__set_node_pressed(node_id, pointerId, true)

    // if (
    //   this._search_unit_id &&
    //   ((this._is_unit_node_id(node_id) && node_id === this._search_unit_id) ||
    //     (this._is_link_pin_node_id(node_id) &&
    //       getUnitIdFromPinId(node_id) === this._search_unit_id))
    // ) {
    if (this._search_unit_id || this._search_unit_datum_id) {
      this._commit_search_unit()
      this._shift_search()
    }

    if (
      this._search_unit_datum_node_id &&
      this._is_datum_node_id(node_id) &&
      this._search_unit_datum_node_id === node_id
    ) {
      this._search_unit_datum_id = null
      this._search_unit_datum_node_id = null
      // this._shift_search()
      this._hide_search()
      return
    }

    // the node might've been deleted
    if (this._has_node(node_id)) {
      // if (this._tree_layout) {
      //   if (this._is_unit_node_id(node_id)) {
      //     this._on_layout_component_drag_start(node_id, event)
      //   }
      // }

      this._refresh_node_selection(node_id)
      this._set_node_mode_color(node_id)

      // TODO this does not make sense
      if (this._drag_node_id[node_id]) {
        const { clientX, clientY } = event
        const [x, y] = zoomInvert(
          this._zoom,
          clientX - this._translate_x,
          clientY - this._translate_y
        )
        this._node_drag_start(node_id, x, y)
      }
    }
  }

  private _on_node_pointer_move = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_node_pointer_move', node_id)
  }

  private _on_node_pointer_up = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_node_pointer_up', node_id)
    const { pointerId } = event
    this._release_node_pointer_capture(node_id, pointerId)
  }

  private _on_node_pointer_cancel = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // log('Graph', '_on_node_pointer_cancel', node_id)
    this._on_node_pointer_up(node_id, event)
  }

  private _on_node_drag_start = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // log('Graph', '_on_node_drag_start', node_id)
    const { clientX, clientY } = event
    const [x, y] = zoomInvert(this._zoom, clientX, clientY)
    this._node_drag_start(node_id, x, y)
  }

  private _node_drag_start = (node_id: string, x: number, y: number) => {
    // console.log('Graph', '_node_drag_start', node_id, x, y)
    // if (this._node_draggable[node_id] === false) {
    //   return
    // }

    this._set_drag_node(node_id, true)

    const node_layer = this._get_node_default_layer(node_id)
    this._start_graph_simulation(node_layer)

    const node = this._node[node_id]

    node.hx = x - node.x
    node.hy = y - node.y

    node.fx = node.x
    node.fy = node.y

    this._on_node_static_start(node_id)
  }

  private _start_static = (): void => {
    // console.log('Graph', '_start_static')
    this._static = true
    // for (const node_id in this._node) {
    for (const node_id in this._unit_node) {
      this._start_node_static(node_id)
    }
  }

  private _start_node_static = (node_id: string): void => {
    // console.log('Graph', '_start_node_static', node_id)
    const node = this._node[node_id]
    const { x, y } = node
    this._static_position[node_id] = { x, y }
    this._static_count[node_id] = 0
  }

  private _stop_static = (): void => {
    // console.log('Graph', '_stop_static')
    this._static = false
  }

  private _on_node_drag_move = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_drag_move', node_id)
    const { clientX, clientY } = event
    const [x, y] = zoomInvert(this._zoom, clientX, clientY)
    this._node_drag_move(node_id, x, y)
  }

  private _node_drag_move = (node_id: string, x: number, y: number) => {
    // console.log('Graph', '_node_drag_move', node_id, x, y)
    // if (this._node_draggable[node_id] === false) {
    //   return
    // }

    const node = this._node[node_id]
    node.fx = x - node.hx
    node.fy = y - node.hy
    node.x = node.fx
    node.y = node.fy

    // this._tick()
  }

  private _on_node_drag_end = (node_id: string) => {
    // console.log('Graph', '_on_node_drag_end', node_id)
    delete this._drag_node_pointer_id[node_id]

    const node = this._node[node_id]

    node.hx = 0
    node.hy = 0
    node.fx = undefined
    node.fy = undefined

    this._set_drag_node(node_id, false)

    this._on_node_static_end(node_id)

    if (this._is_draggable_mode()) {
      this._drop_node(node_id)
    }
  }

  private _on_node_static_start = (node_id: string): void => {
    // console.log('Graph', '_on_node_static_start', node_id)
    const subgraph_id = this._node_to_subgraph[node_id]
    this._static_subgraph_anchor[subgraph_id] =
      this._static_subgraph_anchor[subgraph_id] || {}
    this._static_subgraph_anchor_count[subgraph_id] =
      this._static_subgraph_anchor_count[subgraph_id] || 0
    if (!this._static_subgraph_anchor[subgraph_id][node_id]) {
      const subgraph = this._subgraph_to_node[subgraph_id]
      for (const n_id of subgraph) {
        if (this._is_unit_node_id(n_id)) {
          this._static_count[n_id]++
          this._static_subgraph_anchor[subgraph_id][node_id] = true
        }
      }
    }
  }

  private _on_node_static_end = (node_id: string): void => {
    // console.log('Graph', '_on_node_static_end', node_id)
    const subgraph_id = this._node_to_subgraph[node_id]
    if (
      this._static_subgraph_anchor[subgraph_id] &&
      this._static_subgraph_anchor[subgraph_id][node_id]
    ) {
      const subgraph = this._subgraph_to_node[subgraph_id]
      for (const n_id of subgraph) {
        if (this._is_unit_node_id(n_id)) {
          this._static_count[n_id]--
          this._static_position[n_id] = this._get_node_position(n_id)
          if (this._static_count[n_id] === 0) {
            delete this._static_count[n_id]
            delete this._static_position[n_id]
          }
        }
      }
      delete this._static_subgraph_anchor[subgraph_id][node_id]
      this._static_subgraph_anchor_count[subgraph_id]--
      if (this._static_subgraph_anchor_count[subgraph_id] === 0) {
        delete this._static_subgraph_anchor_count[subgraph_id]
        delete this._static_subgraph_anchor[subgraph_id]
      }
    }
  }

  private _find_node = (
    filter: (node_id: string, node: GraphSimNode) => boolean
  ): string | null => {
    for (let node_id in this._node) {
      const node = this._node[node_id]
      if (filter(node_id, node)) {
        return node_id
      }
    }
    return null
  }

  private _node_node_surface_distance = (
    a_id: string,
    b_id: string
  ): number => {
    const a_node = this._node[a_id]
    const b_node = this._node[b_id]
    const { l } = surfaceDistance(a_node, b_node)
    return l
  }

  private _find_nearest_core_id = (
    node_id: string,
    maxDistance: number = NEAR,
    distance: (a: SimNode<any>, b: SimNode<any>) => number = (
      a: SimNode<any>,
      b: SimNode<any>
    ) => surfaceDistance(a, b).l,
    filter: (node_id: string) => boolean = () => true
  ): string | null => {
    const node = this._node[node_id]
    let nearest: string | null = null
    let nearest_l: number = Infinity
    for (let n_id in this._unit_node) {
      if (n_id !== node_id) {
        const n = this._node[n_id]
        if (filter(n_id)) {
          const d = distance(node, n)
          if (d < maxDistance / this._zoom.k && d < nearest_l) {
            nearest = n_id
            nearest_l = d
          }
        }
      }
    }
    return nearest
  }

  private _find_inside_node_id = (
    point: Point,
    nodes: GraphSimNodes,
    padding: number
  ): string | null => {
    for (let n_id in nodes) {
      const n = nodes[n_id]
      if (n.shape === 'circle') {
        const d = pointDistance(point, n)
        if (d <= n.r + padding) {
          return n_id
        }
      } else {
        const { x, y, width, height } = n
        if (
          point.x >= x - width / 2 - padding &&
          point.x <= x + width / 2 + padding &&
          point.y >= y - height / 2 - padding &&
          point.y <= y + height / 2 + padding
        ) {
          return n_id
        }
      }
    }
    return null
  }

  private _find_inside_core_and_pin_id = (
    point: Point,
    padding: number
  ): string | null => {
    // const nodes = {
    //   ...this._unit_node,
    //   ...this._pin_node,
    // }
    const nodes = this._normal_node
    return this._find_inside_node_id(point, nodes, padding)
  }

  private _find_inside_core_id = (
    point: Point,
    padding: number
  ): string | null => {
    return this._find_inside_node_id(point, this._unit_node, padding)
  }

  private _find_nearest_node_id = (
    node_id: string,
    max_distance: number = NEAR,
    filter: (node_id: string, n_id: string) => boolean = () => true,
    nodes: GraphSimNodes = this._node
  ): string => {
    const node = nodes[node_id]
    let nearest: string[] = []
    const nearest_l: Dict<number> = {}
    for (let n_id in nodes) {
      if (n_id !== node_id) {
        const n = nodes[n_id]
        if (filter(node_id, n_id)) {
          const { l } = surfaceDistance(node, n)
          if (l < max_distance / this._zoom.k) {
            nearest.push(n_id)
            nearest_l[n_id] = l
          }
        }
      }
    }
    nearest = nearest.sort((a, b) => nearest_l[a] - nearest_l[b])
    return nearest[0]
  }

  private _find_nearest_pin_node_id = (
    node_id: string,
    max_distance: number = NEAR,
    filter: (node_id: string) => boolean = () => true
  ): string => {
    return this._find_nearest_node_id(
      node_id,
      max_distance,
      filter,
      this._pin_node
    )
  }

  private _is_pin_unit_connected = (
    pin_node_id: string,
    unit_id: string
  ): boolean => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      const { unitId } = segmentLinkPinNodeId(pin_node_id)
      return unitId === unit_id
    } else {
      const merge = this._get_merge_by_node_id(pin_node_id)
      return !!merge[unit_id]
    }
  }

  private _is_unit_node_match = (unit_id: string, node_id: string): boolean => {
    if (
      this._is_input_node_id(node_id) &&
      this._is_pin_ref(node_id) &&
      !this._is_pin_unit_connected(node_id, unit_id)
    ) {
      const { unitId } = segmentLinkPinNodeId(node_id)

      const merge_node_id = this._ref_unit_to_merge[unit_id]
      if (merge_node_id) {
        const merge = this._get_merge(merge_node_id)
        if (merge[unitId]) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    } else {
      return false
    }
  }

  private _drop_unit = (unit_id: string): void => {
    const nearest_ref_pin_node_id: string = this._find_nearest_node_id(
      unit_id,
      NEAR,
      this._is_unit_node_match
    )
    if (nearest_ref_pin_node_id) {
      this._merge_pin_unit(nearest_ref_pin_node_id, unit_id)
    }
  }

  private _is_pin_node_match = (
    pin_node_id: string,
    node_id: string
  ): boolean => {
    const ref = this._is_pin_ref(pin_node_id)
    if (this._is_unit_node_id(node_id)) {
      if (ref) {
        return this._is_ref_pin_unit_match(pin_node_id, node_id)
      } else {
        return false
      }
    } else if (this._is_link_pin_node_id(node_id)) {
      if (!this._is_link_pin_ignored(node_id)) {
        if (this._is_pin_pin_match(pin_node_id, node_id)) {
          return true
        }
      }
    } else if (this._is_merge_node_id(node_id)) {
      if (this._is_pin_pin_match(pin_node_id, node_id)) {
        return true
      }
    } else if (this._is_internal_pin_node_id(node_id)) {
      if (this._is_ext_pin_match(pin_node_id, node_id)) {
        return true
      }
    }
    return false
  }

  private _drop_pin = (pin_node_id: string): void => {
    const is_link_pin = this._is_link_pin_node_id(pin_node_id)
    const is_link_pin_ignored =
      is_link_pin && this._is_link_pin_ignored(pin_node_id)

    if (is_link_pin_ignored) {
      return
    }

    const nearest_compatible_node_id: string = this._find_nearest_node_id(
      pin_node_id,
      NEAR,
      this._is_pin_node_match,
      {...this._node, ...this._exposed_int_node },
    )
    if (nearest_compatible_node_id) {
      if (this._is_pin_node_id(nearest_compatible_node_id)) {
        let merge_node_id: string
        const output_ref_merge_node_id =
          this._ref_output_to_merge[nearest_compatible_node_id]
        if (output_ref_merge_node_id) {
          merge_node_id = this._merge_pin_pin(
            pin_node_id,
            output_ref_merge_node_id
          )
        } else {
          merge_node_id = this._merge_pin_pin(
            pin_node_id,
            nearest_compatible_node_id
          )
        }
        const anchor_node_id = this._get_merge_anchor_node_id(merge_node_id)
        this._drop_node(anchor_node_id)
      } else if (this._is_unit_node_id(nearest_compatible_node_id)) {
        this._merge_pin_unit(pin_node_id, nearest_compatible_node_id)
      } else if (this._is_internal_pin_node_id(nearest_compatible_node_id)) {
        if (this._is_ext_pin_match(pin_node_id, nearest_compatible_node_id)) {
          const { id, type, subPinId } = segmentExposedNodeId(nearest_compatible_node_id)
          if (is_link_pin) {
            const { unitId, pinId } = segmentLinkPinNodeId(pin_node_id)
            this.plug_exposed_pin(type, id, subPinId, { unitId, pinId })
          } else {
            const { id: mergeId } = segmentMergeNodeId(pin_node_id)
            this.plug_exposed_pin(type, id, subPinId, { mergeId })
          }
        }
      }
    }
  }

  private _is_pin_active = (pin_node_id: string): boolean => {
    const datum_node_id = this._pin_to_datum[pin_node_id]
    return !!datum_node_id
  }

  private _is_datum_node_match = (
    datum_node_id: string,
    node_id: string
  ): boolean => {
    if (
      (this._is_link_pin_node_id(node_id) || this._is_merge_node_id(node_id)) &&
      this._is_datum_pin_match(datum_node_id, node_id)
    ) {
      return true
    }
    return false
  }

  private _drop_datum = (datum_node_id: string): void => {
    const nearest_compatible_node_id: string = this._find_nearest_node_id(
      datum_node_id,
      NEAR,
      this._is_datum_node_match
    )
    if (nearest_compatible_node_id) {
      this._move_datum_to_pin(datum_node_id, nearest_compatible_node_id)
    }
  }

  private _is_exp_pin_node_match = (
    exposed_pin_node_id: string,
    node_id: string
  ): boolean => {
    const { type, id } = segmentExposedNodeId(exposed_pin_node_id)
    if (
      (this._is_pin_node_id(node_id) &&
        this._is_exp_pin_pin_match(type, id, node_id)) ||
      (this._is_unit_node_id(node_id) &&
        this._is_exp_pin_unit_match(type, id, node_id))
    ) {
      return true
    } else {
      return false
    }
  }

  private _drop_exposed_pin = (exposed_pin_node_id: string): void => {
    const { type, id, subPinId } = segmentExposedNodeId(exposed_pin_node_id)
    const exposed_ext_node_id = getExternalNodeId(type, id, subPinId)
    const exposed_int_node_id = getInternalNodeId(type, id, subPinId)
    if (!this._exposed_ext_plugged[exposed_ext_node_id]) {
      const nearest_compatible_node_id: string = this._find_nearest_node_id(
        exposed_int_node_id,
        NEAR,
        this._is_exp_pin_node_match
      )
      if (nearest_compatible_node_id) {
        if (this._is_pin_node_id(nearest_compatible_node_id)) {
          const pin_node_id = nearest_compatible_node_id
          this.__plug_exposed_pin_to(type, id, subPinId, pin_node_id)
        } else {
          // this._is_unit_node_id(nearest_compatible_node_id)
          const unit_id = nearest_compatible_node_id
          const pin_node_id = getSelfPinNodeId(unit_id)
          this.__plug_exposed_pin_to(type, id, subPinId, pin_node_id)
        }
      }
    }
  }

  private _drop_node = (node_id: string): void => {
    // console.log('_drop_node', node_id)
    this._cancel_long_click = true
    setTimeout(() => {
      this._cancel_long_click = false
    }, 0)

    if (this._tree_layout) {
    } else {
      if (this._is_unit_node_id(node_id)) {
        this._drop_unit(node_id)
      } else if (this._is_pin_node_id(node_id)) {
        this._drop_pin(node_id)
      } else if (this._is_datum_node_id(node_id)) {
        this._drop_datum(node_id)
      } else if (this._is_exposed_pin_node_id(node_id)) {
        this._drop_exposed_pin(node_id)
      }
    }
  }

  public isFullwindow(): boolean {
    return this._is_fullwindow
  }

  public leaveFullwindow(animate: boolean): void {
    this._leave_all_fullwindow(animate)
  }

  public enterFullwindow(animate: boolean): void {
    this._enter_all_fullwindow(animate)
  }

  public getPath(): string[] {
    if (this._subgraph_unit_id) {
      return [this._subgraph_unit_id, ...this._subgraph_graph.getPath()]
    }
    return []
  }

  public focus(options: FocusOptions | undefined = { preventScroll: true }) {
    // console.log('Graph', 'focus')
    this._graph.focus(options)
  }

  public temp_fixate_node = (node_id: string, t: number = 100): void => {
    this._set_node_fixed(node_id, true)
    setTimeout(() => {
      this._set_node_fixed(node_id!, false)
    }, t)
  }

  public _set_node_fixed = (node_id: string, fixed: boolean): void => {
    // console.log('Graph', 'set_node_fixed')
    this._node_fixed[node_id] = fixed
    const node = this._node[node_id]
    if (fixed) {
      node.fx = node.x
      node.fy = node.y
    } else {
      node.fx = undefined
      node.fy = undefined
    }

    const default_node_layer = this._get_node_default_layer(node_id)
    this._start_graph_simulation(default_node_layer)
  }

  private _set_all_node_fixed = (fixed: boolean): void => {
    for (const node_id in this._node) {
      this._set_node_fixed(node_id, fixed)
    }
  }

  private _set_all_unit_node_fixed = (fixed: boolean): void => {
    for (const unit_id in this._unit_node) {
      this._set_node_fixed(unit_id, fixed)
    }

    for (const pin_node_id in this._pin_node) {
      this._set_node_fixed(pin_node_id, fixed)
    }
  }

  private _refresh_all_node_fixed = (): void => {
    for (const node_id in this._node) {
      this._refresh_node_fixed(node_id)
    }
  }

  private _set_node_draggable = (node_id: string, draggable: boolean): void => {
    this._node_draggable[node_id] = draggable
  }

  private _hide_core_overlay = (unit_id: string): void => {
    const core_overlay = this._core_component_overlay[unit_id]
    if (core_overlay) {
      // mergeStyle(core_overlay, {
      //   display: 'none',
      // })
      core_overlay.$element.style.display = 'none'
    }
  }

  private _show_core_overlay = (unit_id: string): void => {
    const core_overlay = this._core_component_overlay[unit_id]
    if (core_overlay) {
      // mergeStyle(core_overlay, {
      //   display: 'block',
      // })
      core_overlay.$element.style.display = 'block'
    }
  }

  private _hide_err_overlay = (err_node_id: string): void => {
    const err_overlay = this._err_overlay[err_node_id]
    if (err_overlay) {
      // mergeStyle(err_overlay, {
      //   display: 'none',
      // })
      err_overlay.$element.style.display = 'none'
    }
  }

  private _show_err_overlay = (err_node_id: string): void => {
    const err_overlay = this._err_overlay[err_node_id]
    if (err_overlay) {
      // mergeStyle(err_overlay, {
      //   display: 'block',
      // })
      err_overlay.$element.style.display = 'block'
    }
  }

  private _unlock_all_component = (): void => {
    const { component } = this.$props
    for (const component_id in component.$subComponent) {
      this._unlock_sub_component(component_id)
    }
  }

  public unlock_sub_component = (unit_id: string): void => {
    this._unlock_sub_component(unit_id)
  }

  private _unlock_sub_component = (unit_id: string): void => {
    // console.log('Graph', '_unlock_component')
    const component = this._get_sub_component(unit_id)
    if (component) {
      if (!this._core_component_unlocked[unit_id]) {
        this._core_component_unlocked[unit_id] = true
        this._core_component_unlocked_count++

        if (this._core_component_unlocked_count === 1) {
          this._disable_input()
        }

        this._refresh_selection_dasharray(unit_id)

        this._enable_core_frame(unit_id)

        this._hide_core_overlay(unit_id)

        this._focus_sub_component(unit_id)

        const core_area = this._core_area[unit_id]
        // mergeStyle(core_area, {
        //   display: 'none',
        // })
        core_area.$element.style.display = 'none'

        // setTimeout(() => {
        //   this._hide_core_overlay(unit_id)
        // }, 0)
      }
    }
  }

  private _on_control_lock = () => {
    // console.log('Graph', '_on_control_lock')
    if (!this._temp_control_lock) {
      if (!this._focused) {
        this._unlock_control()
      }
    }
  }

  private _unlock_control = (): void => {
    // console.log('Graph', '_unlock_control')
    if (this._control_lock) {
      this._control_lock = false

      this._disable_input()
    }
  }

  private _control_lock_unlisten: Unlisten

  private _enable_control_lock = () => {
    if (this._control) {
      this._control_lock_unlisten = this._control.addEventListeners([
        makeCustomListener('lock', this._on_control_lock),
        makeCustomListener('temp_lock', this._on_control_temp_lock),
        makeCustomListener('temp_unlock', this._on_control_temp_unlock),
      ])
    }
  }

  private _disable_control_lock = (): void => {
    if (this._control_lock_unlisten) {
      this._control_lock_unlisten()
      this._control_lock_unlisten = undefined
    }
  }

  private _on_control_temp_lock = (): void => {
    if (!this._temp_control_lock) {
      if (!this._temp_control_unlock) {
        // console.log('Graph', '_on_control_temp_lock')
        this._temp_control_unlock = true
        this._unlock_control()
      }
    }
  }

  private _on_control_temp_unlock = (): void => {
    if (!this._temp_control_lock) {
      if (this._temp_control_unlock) {
        // console.log('Graph', '_on_control_temp_unlock')
        this._temp_control_unlock = false
        this._lock_control()
      }
    }
  }

  private _lock_sub_component = (
    unit_id: string,
    unlocking: boolean = false
  ) => {
    // console.log('Graph', '_lock_sub_component')
    delete this._core_component_unlocked[unit_id]

    this._core_component_unlocked_count--

    this._disable_core_frame(unit_id)

    this._blur_sub_component(unit_id)

    if (this._core_component_unlocked_count === 0) {
      if (!unlocking) {
        this._enable_input()
        this._enable_transcend()
      }
    }

    const core_area = this._core_area[unit_id]
    // mergeStyle(core_area, {
    //   display: 'block',
    // })
    core_area.$element.style.display = 'block'

    this._show_core_overlay(unit_id)

    this._refresh_selection_dasharray(unit_id)
  }

  private _lock_all_component = (): void => {
    for (const component_id in this._core_component_unlocked) {
      this._lock_sub_component(component_id)
    }
  }

  private _lock_all_component_but = (component_id: string): void => {
    for (const c_id in this._core_component_unlocked) {
      if (c_id !== component_id) {
        this._lock_sub_component(c_id)
      }
    }
  }

  private _set_node_selected = (node_id: string, selected: boolean) => {
    const was_selected = this._selected_node_id[node_id]
    if (was_selected && !selected) {
      this.deselect_node(node_id)
    } else if (!was_selected && selected) {
      this.select_node(node_id)
    }
  }

  private _is_node_id = (node_id: string): boolean => {
    return this._is_pin_node_id(node_id) || this._is_unit_node_id(node_id)
  }

  private _is_unit_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 'u'
  }

  private _is_pin_node_id = (node_id: string): boolean => {
    return this._is_link_pin_node_id(node_id) || this._is_merge_node_id(node_id)
  }

  private _is_link_pin_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 'p'
  }

  private _is_link_input_node_id = (node_id: string): boolean => {
    return this._is_link_pin_node_id(node_id) && isInputPinNodeId(node_id)
  }

  private _is_link_output_node_id = (node_id: string): boolean => {
    return this._is_link_pin_node_id(node_id) && isOutputPinId(node_id)
  }

  private _is_input_node_id = (node_id: string): boolean => {
    return (
      this._is_link_input_node_id(node_id) ||
      (this._is_merge_node_id(node_id) && this._is_input_merge(node_id))
    )
  }

  private _is_output_node_id = (node_id: string): boolean => {
    return (
      this._is_link_output_node_id(node_id) ||
      (this._is_merge_node_id(node_id) && this._is_output_merge(node_id))
    )
  }

  private _is_node_selected = (node_id: string): boolean => {
    return !!this._selected_node_id[node_id]
  }

  private _is_node_hovered = (node_id: string): boolean => {
    return !!this._hover_node_id[node_id]
  }

  private _is_node_dragged = (node_id: string): boolean => {
    return !!this._drag_node_id[node_id]
  }

  private _is_node_ascend = (node_id: string): boolean => {
    return !!this._ascend_node_dict[node_id]
  }

  private _is_merge_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 'm'
  }

  private _is_datum_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 'd'
  }

  private _is_type_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 't'
  }

  private _is_err_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 'x'
  }

  private _is_external_pin_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 'e'
  }

  private _is_internal_pin_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 'i'
  }

  private _is_exposed_pin_node_id = (node_id: string): boolean => {
    return (
      this._is_external_pin_node_id(node_id) ||
      this._is_internal_pin_node_id(node_id)
    )
  }

  private _get_pin_datum_node_id = (
    pin_node_id: string
  ): string | undefined => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      return this._pin_to_datum[pin_node_id]
    } else {
      return this._get_merge_datum_node_id(pin_node_id)
    }
  }

  private _get_merge_datum_node_id = (
    merge_node_id: string
  ): string | undefined => {
    const merge_datum_node_id = this._pin_to_datum[merge_node_id]
    if (merge_datum_node_id) {
      return merge_datum_node_id
    } else {
      return this._get_merge_first_datum_node_id(merge_node_id)
    }
  }

  private _get_merge_first_datum_node_id = (
    merge_node_id: string
  ): string | undefined => {
    return (
      this._get_merge_first_output_datum_node_id(merge_node_id) ||
      this._get_merge_first_input_datum_node_id(merge_node_id)
    )
  }

  private _get_merge_first_input_datum_node_id = (
    merge_node_id: string
  ): string | undefined => {
    // TODO `find key`
    const merge_to_input = this._merge_to_pin[merge_node_id]
    for (const merge_pin_node_id in merge_to_input) {
      const merge_pin_datum_node_id = this._pin_to_datum[merge_pin_node_id]
      if (merge_pin_datum_node_id) {
        return merge_pin_datum_node_id
      }
    }
    return undefined
  }

  private _get_merge_first_output_datum_node_id = (
    merge_node_id: string
  ): string | undefined => {
    // TODO `find key`
    const merge_to_output = this._merge_to_output[merge_node_id]
    for (const merge_pin_node_id in merge_to_output) {
      const merge_pin_datum_node_id = this._pin_to_datum[merge_pin_node_id]
      if (merge_pin_datum_node_id) {
        return merge_pin_datum_node_id
      }
    }
    return undefined
  }

  public select_node = (node_id: string): void => {
    // console.log('Graph', 'select_node', node_id)

    if (this._selected_node_id[node_id]) {
      return
    }

    this._selected_node_count++
    this._selected_node_id[node_id] = true

    if (this._is_unit_node_id(node_id)) {
      if (this._is_unit_component(node_id)) {
        this._selected_component_count++
        this._selected_component[node_id] = true
        this._enable_core_resize(node_id)
        this._disable_core_touch_area(node_id)
      }
    } else if (this._is_datum_node_id(node_id)) {
      if (this._mode === 'multiselect') {
        // TODO
      } else {
        const datum_anchor_node_id = this._get_datum_pin_anchor_node_id(node_id)
        if (
          !datum_anchor_node_id ||
          !this._is_output_node_id(datum_anchor_node_id)
        ) {
          this._disable_datum_overlay(node_id)
        }
      }
    } else if (this._is_merge_node_id(node_id)) {
      if (this._mode === 'multiselect') {
        // TODO
      } else {
        const merge_datum_node_id = this._get_merge_datum_node_id(node_id)
        if (merge_datum_node_id) {
          this._show_datum(merge_datum_node_id)
        }
      }
    } else if (this._is_err_node_id(node_id)) {
      this._hide_err_overlay(node_id)
    }

    if (this._has_node(node_id)) {
      this._refresh_node_selection(node_id)
      this._refresh_compatible()
    }

    if (this._mode === 'info') {
      if (this._hover_node_count === 0) {
        if (this._selected_node_count === 1) {
          this._set_all_nodes_links_opacity(0.2)
        }
        this._show_node_info(node_id)
      }
    }
  }

  private _enable_core_resize = (unit_id: string): void => {
    // console.log('Graph', '_enable_core_resize', unit_id)
    const core_resize = this._core_component_resize[unit_id]
    if (core_resize) {
      core_resize.setProp('disabled', false)
    }
  }

  private _enable_core_frame = (unit_id: string) => {
    const frame = this._core_component_frame[unit_id]
    frame.setProp('disabled', false)
  }

  private _disable_core_frame = (unit_id: string) => {
    const frame = this._core_component_frame[unit_id]
    frame.setProp('disabled', true)
  }

  private _disable_core_resize = (unit_id: string): void => {
    // console.log('Graph', '_disable_core_resize')
    const core_resize = this._core_component_resize[unit_id]
    if (core_resize) {
      core_resize.setProp('disabled', true)
    }
  }

  private _enable_core_touch_area = (unit_id: string): void => {
    // console.log('Graph', '_enable_core_touch_area')
    const core_area = this._core_area[unit_id]
    // mergeStyle(core_area, {
    //   pointerEvents: 'inherit',
    // })
    core_area.$element.style.pointerEvents = 'inherit'
  }

  private _disable_core_touch_area = (unit_id: string): void => {
    // console.log('Graph', '_disable_core_touch_area')
    const core_area = this._core_area[unit_id]
    // mergeStyle(core_area, {
    //   pointerEvents: 'none',
    // })
    core_area.$element.style.pointerEvents = 'none'
  }

  private __deselect_node = (node_id: string): void => {
    this._selected_node_count--
    delete this._selected_node_id[node_id]

    if (this._is_unit_node_id(node_id)) {
      if (this._is_unit_component(node_id)) {
        this._selected_component_count--
        delete this._selected_component[node_id]
        this._disable_core_resize(node_id)
        this._enable_core_touch_area(node_id)

        // this._lock_component(node_id)
      }
    } else if (this._is_link_pin_node_id(node_id)) {
      //
    } else if (this._is_merge_node_id(node_id)) {
      const merge_datum_node_id = this._get_merge_datum_node_id(node_id)
      if (merge_datum_node_id) {
        this._refresh_datum_visible(merge_datum_node_id)
      }
    } else if (this._is_datum_node_id(node_id)) {
      this._enable_datum_overlay(node_id)
      this._refresh_datum_visible(node_id)
    } else if (this._is_err_node_id(node_id)) {
      this._show_err_overlay(node_id)
    }

    this._refresh_compatible()
  }

  public deselect_node = (node_id: string): void => {
    // console.log('Graph', 'deselect_node', node_id)

    if (!this._selected_node_id[node_id]) {
      return
    }

    this.__deselect_node(node_id)

    this._refresh_node_selection(node_id)
    this._refresh_node_color(node_id)

    if (this._mode === 'info') {
      if (this._hover_node_count === 0) {
        this._hide_node_info(node_id)
        if (this._selected_node_count === 0) {
          this._set_all_nodes_links_opacity(1)
        }
      }
    }
  }

  private _toggle_select = (node_id: string): void => {
    if (this._is_node_selected(node_id)) {
      this.deselect_node(node_id)
    } else {
      this.select_node(node_id)
    }
  }

  private _select_all = (): void => {
    for (const node_id in this._node) {
      this.select_node(node_id)
    }
  }

  private _toggle_select_all = (): void => {
    for (const node_id in this._node) {
      this._toggle_select(node_id)
    }
  }

  private _deselect_all = (): void => {
    forEachKeyValue(this._selected_node_id, (_, node_id) => {
      this.deselect_node(node_id)
    })
  }

  private _deselect_all_but = (node_id: string) => {
    forEachKeyValue(this._selected_node_id, (_, n_id) => {
      if (n_id !== node_id) {
        this.deselect_node(n_id)
      }
    })
  }

  private _enable_node_overlay = (node_id: string): void => {}

  private _enable_datum_overlay = (datum_node_id: string): void => {
    const datum_overlay = this._datum_overlay[datum_node_id]
    // mergeStyle(datum_overlay, {
    //   display: 'block',
    // })
    datum_overlay.$element.style.display = 'block'
  }

  private _disable_node_overlay = (node_id: string): void => {
    // TODO
  }

  private _disable_datum_overlay = (datum_node_id: string): void => {
    // console.log('Graph', '_disable_datum_overlay', datum_node_id)
    const datum_overlay = this._datum_overlay[datum_node_id]
    // mergeStyle(datum_overlay, {
    //   display: 'none',
    // })
    datum_overlay.$element.style.display = 'none'
  }

  private _hide_control = (): void => {
    // console.log('Graph', '_hide_control')
    if (this._control) {
      this._control.hide()
    }
  }

  private _show_control = (): void => {
    // console.log('Graph', '_show_control')
    if (this._control) {
      this._control.show()
    }
  }

  private _disable_frame_pointer = (): void => {
    // console.log('Graph', '_disable_frame_pointer')
    // mergeStyle(this._frame, {
    //   pointerEvents: 'none',
    // })
    this._frame.$element.style.pointerEvents = 'none'
  }

  private _enable_frame_pointer = (): void => {
    // console.log('Graph', '_enable_frame_pointer')
    // mergeStyle(this._frame, {
    //   pointerEvents: 'all',
    // })
    this._frame.$element.style.pointerEvents = 'all'
  }

  private _set_fullwindow_frame_off = (animate: boolean): void => {
    // console.log('Graph', '_set_fullwindow_frame_off')
    this._disable_frame_pointer()

    if (animate) {
      const animation = this._main.$element.animate(
        [
          {
            opacity: '0.25',
          },
          {
            opacity: '1',
          },
        ],
        { duration: ANIMATION_T * 1000 }
      )
      animation.onfinish = () => {
        this._main.$element.style.opacity = '1'
      }
    } else {
      this._main.$element.style.opacity = '1'
    }
  }

  private _set_fullwindow_frame_on = (animate: boolean): void => {
    // console.log('Graph', '_set_fullwindow_frame_on')
    this._enable_frame_pointer()

    if (animate) {
      const animation = this._main.$element.animate(
        [
          {
            opacity: '1',
          },
          {
            opacity: '0.25',
          },
        ],
        { duration: ANIMATION_T * 1000 }
      )
      animation.onfinish = () => {
        this._main.$element.style.opacity = '0.25'
      }
    } else {
      this._main.$element.style.opacity = '0.25'
    }
  }

  private _enter_fullwindow = (
    animate: boolean,
    sub_component_ids: string[]
  ) => {
    // console.log('Graph', '_enter_fullwindow', animate, sub_component_ids)
    this._is_fullwindow = true

    if (!this._frame_out) {
      this._set_fullwindow_frame_on(animate)

      if (!this._frame_out) {
        if (!this._disabled) {
          this._disable_input()
        }
      }
    }

    this._fullwindow_component_set = new Set(sub_component_ids)
    this._fullwindow_component_ids = sub_component_ids

    if (this._in_component_control) {
      if (
        FF_ANIMATE_FULLWINDOW &&
        (!FF_PREVENT_FRAMEOUT_ANIMATE_FULLWINDOW || !this._frame_out)
      ) {
        const { $width, $height } = this.$context

        const { k } = this._zoom

        this._enter_component_frame()

        const last_sub_component_id = last(sub_component_ids)

        let i = 0

        for (const sub_component_id of this._fullwindow_component_ids) {
          const frame = this._core_component_frame[sub_component_id]

          const is_last_sub_component =
            sub_component_id === last_sub_component_id

          let last_sub_component: Component

          if (is_last_sub_component) {
            last_sub_component = this._get_sub_component(last_sub_component_id)

            last_sub_component.focus()
          }

          let x0: number
          let y0: number
          let w0: number
          let h0: number

          if (this._tree_layout) {
            const { $width, $height } = this.$context

            const { x, y, width, height } = this._layout_node[sub_component_id]

            x0 = x + $width / 2 - width / 2
            y0 = y + $height / 2 - height / 2
            w0 = width
            h0 = height
          } else {
            const { x: _x0, y: _y0 } =
              this._get_node_screen_position(sub_component_id)
            const { width: _w0, height: _h0 } =
              this._get_unit_component_graph_size(sub_component_id)

            const k_1 = k - 1

            x0 = _x0 + k + (_w0 * k_1) / 2
            y0 = _y0 + k + (_h0 * k_1) / 2
            w0 = _w0
            h0 = _h0
          }

          const w1 = $width
          const h1 = $height

          const x1 = 0

          let y1 = 0

          y1 += i * $height

          if (this._animating_leave_fullwindow[sub_component_id]) {
            const abort = this._abort_leave_fullwindow[sub_component_id]

            const { x, y, w, h } = abort()

            x0 = x
            y0 = y
            w0 = w
            h0 = h

            delete this._animating_leave_fullwindow[sub_component_id]
            delete this._abort_leave_fullwindow[sub_component_id]
          }

          const k0 = this._tree_layout ? 1 : k
          const k1 = 1

          const core_content = this._core_content[sub_component_id]

          core_content.removeChild(frame)

          frame.$element.style.left = `${x0}px`
          frame.$element.style.top = `${y0}px`
          frame.$element.style.width = `${w0}px`
          frame.$element.style.height = `${h0}px`
          frame.$element.style.transform = `scale(${k0})`

          this._graph.appendChild(frame, 'default')

          this._animating_enter_fullwindow[sub_component_id] = true

          this._abort_enter_fullwindow[sub_component_id] = this._animate_frame(
            sub_component_id,
            { x0, y0, w0, h0, k0 },
            () => {
              return { x1, y1, w1, h1, k1 }
            },
            animate ? (12 * ANIMATION_T) / 0.2 : 0,
            () => {
              if (this._tree_layout) {
                const parent_id =
                  this._get_sub_component_spec_parent_id(sub_component_id)
                if (parent_id) {
                  if (this._layout_path.includes(parent_id)) {
                    this._leave_sub_component_frame(sub_component_id)
                  } else {
                    this._remove_sub_component_parent_root(
                      parent_id,
                      sub_component_id
                    )
                  }
                } else {
                  this._leave_sub_component_frame(sub_component_id)
                }
              } else {
                this._leave_sub_component_frame(sub_component_id)
              }

              this._couple_sub_component(sub_component_id)

              if (is_last_sub_component) {
                last_sub_component.focus()
              }

              this._animating_enter_fullwindow[sub_component_id] = false
            }
          )

          i++
        }
      } else {
        if (this._tree_layout) {
          for (const sub_component_id of sub_component_ids) {
            const parent_id =
              this._get_sub_component_spec_parent_id(sub_component_id)
            if (parent_id) {
              this._remove_sub_component_parent_root(
                parent_id,
                sub_component_id
              )
            } else {
              this._leave_sub_component_frame(sub_component_id)
            }

            if (!this._frame_out) {
              const frame = this._core_component_frame[sub_component_id]

              this._graph.appendChild(frame, 'default')
            }
          }
        } else {
          for (const sub_component_id of sub_component_ids) {
            this._leave_sub_component_frame(sub_component_id)

            if (!this._frame_out) {
              const frame = this._core_component_frame[sub_component_id]

              this._graph.appendChild(frame, 'default')
            }
          }
        }

        this._enter_component_frame()

        this._couple_all_fullwindow_component()

        if (sub_component_ids.length > 0) {
          const last_sub_component_id = last(sub_component_ids)
          const last_sub_component = this._get_sub_component(
            last_sub_component_id
          )
          last_sub_component.focus()
        }
      }
    }

    if (!this._disabled) {
      if (this._transcend) {
        this._transcend.down(animate)
      }
    }

    this.dispatchEvent('enter_fullwindow', {}, false)
  }

  private _fullwindow_datum_id: string | null = null

  private _enter_datum_fullwindow = (datum_id: string): void => {
    this._fullwindow_datum_id = datum_id
    // TODO
  }

  private _leave_datum_fullwindow = (datum_id: string): void => {
    this._fullwindow_datum_id = null
    // TODO
  }

  private _node_selection_color = (node_id: string): string => {
    const selected = this._selected_node_id[node_id]
    const hovered = this._hover_node_pointer_count[node_id] > 0
    const pressed = this._node_pressed_count[node_id] > 0
    const compatible = this._compatible_node_id[node_id]
    if (compatible) {
      return GREEN
    } else if (selected) {
      return this._theme.selected
    } else if (hovered || pressed) {
      return this._theme.hovered
    }
    return NONE
  }

  private _get_node_selection_dasharray = (node_id: string): number => {
    if (this._core_component_unlocked[node_id]) {
      return 18
    } else {
      if (this._edit_datum_node_id === node_id) {
        return 18
      }
      return 6
    }
    // const focused = this._focus_node_id === node_id
    // const hovered = this._hover_node_id[node_id]
    // const compatible = this._compatible_node_id[node_id]
    // if (focused || (!this._shift && (hovered || compatible))) {
    //   // const node = this._nodes[node_id]
    //   // const { width, height } = node
    //   // return (width + height) / 4
    //   return 8
    // } else {
    //   return 4
    // }
  }

  private _pin_unit_ids = (pin_node_id: string): Dict<any> => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      const { unitId } = segmentLinkPinNodeId(pin_node_id)
      return { [unitId]: true }
    } else if (this._is_merge_node_id(pin_node_id)) {
      const { id: merge_id } = segmentMergeNodeId(pin_node_id)
      return this.__get_merge(merge_id)
    } else {
      return {}
    }
  }

  private _should_hide_datum = (datum_node_id: string): boolean => {
    if (
      this._is_node_selected(datum_node_id) ||
      this._is_node_hovered(datum_node_id)
    ) {
      return false
    }

    const pin_node_id = this._datum_to_pin[datum_node_id]
    if (pin_node_id) {
      if (this._is_link_pin_node_id(pin_node_id)) {
        if (this._is_link_pin_ignored(pin_node_id)) {
          return true
        }

        if (this._is_link_pin_ref(pin_node_id)) {
          return true
        }

        const merge_node_id = this._pin_to_merge[pin_node_id]
        if (merge_node_id) {
          const { id: merge_id } = segmentMergeNodeId(merge_node_id)
          const merge_datum_node_id = this._pin_to_datum[merge_node_id]
          const input_merge = this._merge_output_count[merge_id] === 0
          if (input_merge) {
            if (merge_datum_node_id) {
              return true
            } else {
              return false
            }
          }
          const output_merge = this._merge_input_count[merge_id] === 0
          if (output_merge) {
            return false
          }

          if (
            this._is_node_selected(merge_node_id) ||
            this._is_node_hovered(merge_node_id)
          ) {
            if (this._mode === 'remove') {
              return true
            }
          }

          const merge_first_datum_node_id =
            this._get_merge_datum_node_id(merge_node_id)

          // console.log(
          //   'merge_first_datum_node_id',
          //   merge_first_datum_node_id,
          //   this._is_node_selected(merge_node_id),
          //   this._is_node_hovered(merge_node_id),
          //   this._is_node_hovered(merge_first_datum_node_id)
          // )

          if (merge_first_datum_node_id) {
            if (
              this._is_node_selected(merge_node_id) ||
              this._is_node_hovered(merge_node_id) ||
              this._is_node_hovered(merge_first_datum_node_id)
            ) {
              if (datum_node_id === merge_first_datum_node_id) {
                return false
              }
            } else if (this._is_node_hovered(pin_node_id)) {
              return false
            }
          }
          return true
        } else {
          return false
        }
      } else {
        if (
          this._is_node_selected(pin_node_id) ||
          this._is_node_hovered(pin_node_id)
        ) {
          return false
        }
        const { id: merge_id } = segmentMergeNodeId(pin_node_id)
        const input_merge = this._merge_output_count[merge_id] === 0
        const output_merge = this._merge_input_count[merge_id] === 0
        return !input_merge && !output_merge
      }
    } else {
      return false
    }
  }

  private _is_pin_pin_match(a: string, b: string): boolean {
    // a pin is not compatible with itself
    if (a === b) {
      return false
    }

    if (isExternalNodeId(a) || isExternalNodeId(b)) {
      return false
    }

    // TODO
    // should be able to merge pins from the same unit (?)
    const firstUnitIds = this._pin_unit_ids(a)
    const secondUnitIds = this._pin_unit_ids(b)

    for (const unitId in firstUnitIds) {
      if (secondUnitIds[unitId]) {
        return false
      }
    }

    // if (this._is_pin_constant(a) || this._is_pin_constant(b)) {
    //   return false
    // }

    // if (this._is_pin_ignored(a) || this._is_pin_ignored(b)) {
    //   return false
    // }

    const a_link_pin = this._is_link_pin_node_id(a)
    const b_link_pin = this._is_link_pin_node_id(b)

    const a_ref = this._is_pin_ref(a)
    const b_ref = this._is_pin_ref(b)

    if (a_ref !== b_ref) {
      return false
    }

    if (a_link_pin && b_link_pin) {
      const { type: a_type } = segmentLinkPinNodeId(a)
      const { type: b_type } = segmentLinkPinNodeId(b)
      if (a_ref && !b_ref) {
        return false
      } else if (!a_ref && b_ref) {
        return false
      } else if (a_ref && b_ref) {
        if (a_type === 'output' && b_type === 'output') {
          return false
        }
      }
      return this._is_link_pin_link_pin_type_match(a, a_type, b, b_type)
    } else if (a_link_pin && !b_link_pin) {
      const { type: a_type } = segmentLinkPinNodeId(a)
      if (this._is_input_merge(b)) {
        return this._is_link_pin_link_pin_type_match(a, a_type, b, 'input')
      } else if (this._is_output_merge(b)) {
        return this._is_link_pin_link_pin_type_match(a, a_type, b, 'output')
      } else {
        return this._is_link_pin_link_pin_type_match(
          a,
          a_type,
          b,
          oppositePinKind(a_type)
        )
      }
    } else if (!a_link_pin && b_link_pin) {
      const { type: b_type } = segmentLinkPinNodeId(b)
      if (this._is_input_merge(a)) {
        return this._is_link_pin_link_pin_type_match(a, 'input', b, b_type)
      } else if (this._is_output_merge(a)) {
        return this._is_link_pin_link_pin_type_match(a, 'output', b, b_type)
      } else {
        return this._is_link_pin_link_pin_type_match(
          a,
          oppositePinKind(b_type),
          b,
          b_type
        )
      }
    } else {
      const a_input = this._is_input_merge(a)
      const b_input = this._is_input_merge(b)
      const a_output = this._is_output_merge(a)
      const b_output = this._is_output_merge(b)

      if (a_ref && b_ref) {
        // TODO
        return true
      } else if (!a_ref && !b_ref) {
        if (a_input && b_input) {
          return this._is_link_pin_link_pin_type_match(a, 'input', b, 'input')
        } else if (a_input && b_output) {
          return this._is_link_pin_link_pin_type_match(a, 'input', b, 'output')
        } else if (a_output && b_input) {
          return this._is_link_pin_link_pin_type_match(a, 'output', b, 'input')
        } else if (a_output && b_output) {
          return this._is_link_pin_link_pin_type_match(a, 'output', b, 'output')
        } else if (a_input) {
          return this._is_link_pin_link_pin_type_match(a, 'input', b, 'output')
        } else if (b_input) {
          return this._is_link_pin_link_pin_type_match(a, 'output', b, 'input')
        } else if (a_output) {
          return this._is_link_pin_link_pin_type_match(a, 'output', b, 'input')
        } else if (b_output) {
          return this._is_link_pin_link_pin_type_match(a, 'input', b, 'output')
        } else {
          return (
            this._is_link_pin_link_pin_type_match(a, 'input', b, 'output') &&
            this._is_link_pin_link_pin_type_match(a, 'output', b, 'input')
          )
        }
      } else {
        return false
      }
    }
  }

  private _is_exp_pin_pin_match = (
    type: 'input' | 'output',
    pin_id: string,
    pin_node_id: string
  ): boolean => {
    const { pinId: pin_exposed_id } = this._get_pin_exposed_id(
      type,
      pin_node_id
    )
    if (pin_exposed_id === pin_id) {
      return false
    }

    let plugged = false
    const exp_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exp_pin_spec
    for (const sub_pin_id in pin) {
      const sub_pin = pin[sub_pin_id]
      const { unitId, mergeId } = sub_pin
      if (unitId || mergeId) {
        plugged = true
        continue
      }
    }

    if (this._is_link_pin_node_id(pin_node_id)) {
      const { type: _type } = segmentLinkPinNodeId(pin_node_id)
      if (type === _type) {
        if (!plugged) {
          return true
        }

        const exp_pin_type = this.__get_ext_pin_type(type, pin_id)
        const link_pin_type = this._get_link_pin_type(pin_node_id)
        if (type === 'input') {
          return _isTypeMatch(exp_pin_type, link_pin_type)
        } else {
          return _isTypeMatch(link_pin_type, exp_pin_type)
        }
      }
    } else if (this._is_merge_node_id(pin_node_id)) {
      if (
        (type === 'input' && !this._is_output_merge(pin_node_id)) ||
        (type === 'output' && !this._is_input_merge(pin_node_id))
      ) {
        if (!plugged) {
          return true
        }

        const exp_pin_type = this.__get_ext_pin_type(type, pin_id)
        const merge_pin_type = this._get_merge_pin_type(pin_node_id, type)
        if (type === 'input') {
          return _isTypeMatch(exp_pin_type, merge_pin_type)
        } else {
          return _isTypeMatch(merge_pin_type, exp_pin_type)
        }
      }
    }
    return false
  }

  private _get_unit_type = (unit_id: string): TreeNode => {
    const unit_spec = this._get_unit_spec(unit_id)
    const { type: unit_type = '`U`' } = unit_spec
    const unit_type_tree = getTree(unit_type)
    return unit_type_tree
  }

  private _is_ref_pin_unit_match = (
    pin_node_id: string,
    unit_id: string
  ): boolean => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      const { type } = segmentLinkPinNodeId(pin_node_id)
      if (type === 'output') {
        return false
      } else {
        if (this._is_pin_unit_connected(pin_node_id, unit_id)) {
          return false
        } else {
          return this._is_ref_pin_unit_type_match(pin_node_id, unit_id)
        }
      }
    } else {
      if (this._is_pin_unit_connected(pin_node_id, unit_id)) {
        return false
      } else {
        return this._is_ref_pin_unit_type_match(pin_node_id, unit_id)
      }
    }
  }

  private _is_ref_pin_unit_type_match = (
    pin_node_id: string,
    unit_id: string
  ): boolean => {
    const pin_type_tree = this._get_pin_type(pin_node_id)
    const unit_type_tree = this._get_unit_type(unit_id)
    const is_type_match = _isTypeMatch(unit_type_tree, pin_type_tree)
    return is_type_match
  }

  private _is_exp_pin_unit_match = (
    type: 'input' | 'output',
    pin_id: string,
    unit_id: string
  ): boolean => {
    if (type === 'input') {
      return false
    } else {
      const exp_pin_type_tree = this.__get_ext_pin_type(type, pin_id)
      const unit_type_tree = this._get_unit_type(unit_id)
      const is_type_match = _isTypeMatch(unit_type_tree, exp_pin_type_tree)
      return is_type_match
    }
  }

  private _runtime_pin_type = (
    pin_node_id: string,
    kind: 'input' | 'output'
  ) => {
    // const pin_datum_node_id = this._pin_to_datum[pin_node_id]
    // if (pin_datum_node_id && kind === 'output') {
    //   const { id: pin_datum_id } = segmentDatumNodeId(pin_datum_node_id)
    //   const pin_datum_tree = this._datum_tree[pin_datum_id]
    //   return _getValueType(pin_datum_tree)
    // } else {
    //   return this._pin_type_of_kind(pin_node_id, kind)
    // }
    return this._pin_type_of_kind(pin_node_id, kind)
  }

  private _is_link_pin_link_pin_type_match = (
    a: string,
    a_type: 'input' | 'output',
    b: string,
    b_type: 'input' | 'output'
  ): boolean => {
    const source_type = this._runtime_pin_type(a, a_type)
    const target_type = this._runtime_pin_type(b, b_type)
    return _pinTypeMatch(source_type, a_type, target_type, b_type)
  }

  private _is_unit_pin_match = (
    unit_id: string,
    pin_node_id: string
  ): boolean => {
    const ref = this._is_pin_ref(pin_node_id)
    if (ref) {
      return this._is_ref_pin_unit_match(pin_node_id, unit_id)
    } else {
      return false
    }
  }

  private _is_datum_pin_match = (
    datum_node_id: string,
    pin_node_id: string
  ): boolean => {
    // if (this._datum_to_pin[datumNodeId]) {
    //   return false
    // }
    // if (this._datum_to_pin[datumNodeId] === pinNodeId) {
    //   return false
    // }

    // const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    // if (datum_pin_node_id && this._is_link_pin_merged(datum_pin_node_id)) {
    //   return false
    // }

    // if (isMergeNodeId(pinNodeId) && !this._is_input_merge(pinNodeId)) {
    //   return false
    // }

    if (this._drag_node_id[pin_node_id]) {
      return false
    }

    const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    if (datum_pin_node_id) {
      if (this._is_node_selected(pin_node_id)) {
        if (datum_pin_node_id === pin_node_id) {
          return false
        }

        const datum_pin_merge_node_id = this._pin_to_merge[datum_pin_node_id]
        if (datum_pin_merge_node_id === pin_node_id) {
          return false
        }
      }
    }

    if (this._is_pin_ref(pin_node_id)) {
      return false
    }

    if (isMergeNodeId(pin_node_id) && this._is_output_merge(pin_node_id)) {
      return false
    }

    // cannot add data to output
    if (isOutputPinId(pin_node_id)) {
      return false
    }

    if (
      this._is_link_pin_node_id(pin_node_id) &&
      this._is_link_pin_ignored(pin_node_id)
    ) {
      return false
    }

    if (isExternalNodeId(pin_node_id)) {
      return false
    }

    return this._is_datum_pin_type_match(datum_node_id, pin_node_id)
  }

  private _is_datum_pin_type_match = (
    datum_node_id: string,
    pin_node_id: string
  ): boolean => {
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    const data = this._datum_tree[datum_id]

    const pin_type = this._pin_type_of_kind(pin_node_id, 'input')

    if (!_isValidValue(data)) {
      return false
    }

    const datum_type = _getValueType(data)
    return _isTypeMatch(datum_type, pin_type)

    // return _isTypeMatch(data, pin_type)
  }

  private _get_display_node_id = (): string[] => {
    if (this._drag_count > 0) {
      return keys({ obj: this._drag_node_id }).keys
    }

    if (this._selected_node_count > 0) {
      return keys({ obj: this._selected_node_id }).keys
    }

    return []
  }

  private _is_ext_all_pin_match = (
    pin_node_id: string,
    all_ext_node_id: string[]
  ): boolean => {
    if (all_ext_node_id.length === 2) {
      const ext_node_id = all_ext_node_id[0]
      return this._is_ext_pin_match(pin_node_id, ext_node_id)
    }
    return false
  }

  private _is_ext_pin_match = (
    pin_node_id: string,
    ext_node_id: string
  ) => {
    const { type } = segmentExposedNodeId(ext_node_id)
    return getTypeFromLinkPinNodeId(pin_node_id) === type
  }

  private _is_pin_all_pin_match = (
    pin_node_id: string,
    all_pin_node_id: string[]
  ): boolean => {
    let compatible = true
    for (const _pin_node_id of all_pin_node_id) {
      compatible =
        compatible && this._is_pin_pin_match(pin_node_id, _pin_node_id)
      if (!compatible) {
        break
      }
    }
    return compatible
  }

  private _is_pin_all_unit_match = (
    pin_node_id: string,
    all_unit_id: string[]
  ): boolean => {
    if (all_unit_id.length > 1) {
      return false
    }

    const [unit_id] = all_unit_id

    return this._is_unit_pin_match(unit_id, pin_node_id)
  }

  private _is_unit_all_pin_match = (
    unit_id: string,
    all_pin_node_id: string[]
  ): boolean => {
    let compatible = true
    for (const _pin_node_id of all_pin_node_id) {
      compatible =
        compatible && this._is_ref_pin_unit_match(_pin_node_id, unit_id)
      if (!compatible) {
        break
      }
    }
    return compatible
  }

  private _is_datum_all_pin_match = (
    datum_node_id: string,
    all_pin_node_id: string[]
  ): boolean => {
    let compatible = true
    for (const _pin_node_id of all_pin_node_id) {
      compatible =
        compatible && this._is_datum_pin_match(datum_node_id, _pin_node_id)
      if (!compatible) {
        break
      }
    }
    return compatible
  }

  private _is_pin_all_datum_match = (
    pin_node_id: string,
    all_datum_node_id: string[]
  ): boolean => {
    let compatible = true
    for (const datum_node_id of all_datum_node_id) {
      compatible =
        compatible && this._is_datum_pin_match(datum_node_id, pin_node_id)
      if (!compatible) {
        break
      }
    }
    return compatible
  }

  private _is_all_node = (
    node_ids: string[]
  ): {
    all_pin: boolean
    all_pin_ref: boolean
    all_ext_pin: boolean
    all_data: boolean
    all_unit: boolean
    all_pin_ref_unit: Dict<boolean>
  } => {
    let all_pin = true
    let all_pin_link = true
    let all_pin_ref = true
    let all_data = true
    let all_pin_ref_unit = {}
    let all_unit = true
    let all_ext_pin = true

    for (let node_id of node_ids) {
      all_pin = all_pin && this._is_pin_node_id(node_id)
      all_pin_link =
        all_pin && all_pin_link && this._is_link_pin_node_id(node_id)
      all_pin_ref = all_pin && all_pin_ref && this._is_pin_ref(node_id)
      if (all_pin_ref) {
        if (this._is_link_pin_node_id(node_id)) {
          const { unitId } = segmentLinkPinNodeId(node_id)
          all_pin_ref_unit[unitId] = true
        } else {
          const { id: merge_id } = segmentMergeNodeId(node_id)
          const merge = this.__get_merge(merge_id)
          const { keys: merge_units } = keys({ obj: merge })
          for (const unit_id of merge_units) {
            all_pin_ref_unit[unit_id] = true
          }
        }
      }
      all_ext_pin =
        all_ext_pin &&
        (this._is_external_pin_node_id(node_id) ||
          this._is_internal_pin_node_id(node_id))
      all_data = all_data && this._is_datum_node_id(node_id)
      all_unit = all_unit && this._is_unit_node_id(node_id)
    }

    return {
      all_pin,
      all_pin_ref,
      all_pin_ref_unit,
      all_ext_pin,
      all_data,
      all_unit,
    }
  }

  private _all_pin: boolean = false
  private _all_pin_ref: boolean = false
  private _all_pin_ref_unit: Dict<boolean> = {}
  private _all_ext_pin: boolean = false
  private _all_data: boolean = false
  private _all_unit: boolean = false

  private _refresh_compatible = (): void => {
    // console.log('Graph', 'refresh_compatible')
    const prev_compatible_node_id = this._compatible_node_id
    const display_node_id = this._get_display_node_id()
    this._compatible_node_id = {}
    if (display_node_id.length > 0 && this._mode !== 'multiselect') {
      const {
        all_pin,
        all_pin_ref,
        all_pin_ref_unit,
        all_ext_pin,
        all_data,
        all_unit,
      } = this._is_all_node(display_node_id)

      this._all_pin = all_pin
      this._all_pin_ref = all_pin_ref
      this._all_pin_ref_unit = all_pin_ref_unit
      this._all_ext_pin = all_ext_pin
      this._all_data = all_data
      this._all_unit = all_unit

      if (all_pin) {
        if (all_pin_ref) {
          for (const unit_id in this._unit_node) {
            if (!all_pin_ref_unit[unit_id]) {
              if (this._is_unit_all_pin_match(unit_id, display_node_id)) {
                this._compatible_node_id[unit_id] = true
              }
            }
          }
          for (const pin_node_id in this._pin_node) {
            if (this._is_pin_all_pin_match(pin_node_id, display_node_id)) {
              this._compatible_node_id[pin_node_id] = true
            }
          }
        } else {
          for (let pin_node_id in this._pin_node) {
            if (this._is_pin_all_pin_match(pin_node_id, display_node_id)) {
              this._compatible_node_id[pin_node_id] = true
            }
          }
          for (const datum_node_id in this._data_node) {
            if (this._is_datum_all_pin_match(datum_node_id, display_node_id)) {
              this._compatible_node_id[datum_node_id] = true
            }
          }
          console.log(display_node_id.length)
          if (display_node_id.length === 1) {
            const pin_node_id = display_node_id[0]
            for (const internal_node_id in this._exposed_int_unplugged) {
              const { type, id } = segmentInternalNodeId(internal_node_id)
              if (this._is_exp_pin_pin_match(type, id, pin_node_id)) {
                this._compatible_node_id[internal_node_id] = true
              }
            }
          }
        }
      } else if (all_unit) {
        for (let pin_node_id in this._pin_node) {
          if (this._is_input_pin_ref(pin_node_id)) {
            if (this._is_link_pin_node_id(pin_node_id)) {
              const { unitId } = segmentLinkPinNodeId(pin_node_id)
              if (!display_node_id.includes(unitId)) {
                if (this._is_pin_all_unit_match(pin_node_id, display_node_id)) {
                  this._compatible_node_id[pin_node_id] = true
                }
              }
            } else {
              let compatible = true
              const merge = this._get_merge_by_node_id(pin_node_id)
              for (const unit_id in merge) {
                if (display_node_id.includes(unit_id)) {
                  compatible = false
                  break
                }
              }
              this._compatible_node_id[pin_node_id] = compatible
            }
          }
        }
      } else if (all_data) {
        for (let pin_node_id in this._pin_node) {
          if (this._is_pin_all_datum_match(pin_node_id, display_node_id)) {
            this._compatible_node_id[pin_node_id] = true
          }
        }
      } else if (all_ext_pin) {
        // AD HOC there should be only a single exposed pin
        if (display_node_id.length <= 2) {
          const ext_node_id = display_node_id[0]
          const { type, id } = segmentExposedNodeId(ext_node_id)
          for (let unit_id in this._unit_node) {
            if (this._is_exp_pin_unit_match(type, id, unit_id)) {
              this._compatible_node_id[unit_id] = true
            }
          }
          for (let pin_node_id in this._pin_node) {
            if (this._is_exp_pin_pin_match(type, id, pin_node_id)) {
              this._compatible_node_id[pin_node_id] = true
            }
          }
        }
      }
    }

    for (let node_id in prev_compatible_node_id) {
      this._refresh_node_fixed(node_id)
      this._refresh_node_selection(node_id)
    }

    console.log(this._compatible_node_id)
    for (let node_id in this._compatible_node_id) {
      this._refresh_node_fixed(node_id)
      this._refresh_node_selection(node_id)
    }
  }

  private _refresh_all_compatible_unit = () => {
    for (let unit_id in this._unit_node) {
      this._refresh_node_fixed(unit_id)
      this._refresh_node_selection(unit_id)
    }
  }

  private _refresh_all_compatible_pin = () => {
    for (let pin_node_id in this._pin_node) {
      this._refresh_node_fixed(pin_node_id)
      this._refresh_node_selection(pin_node_id)
    }
  }

  private _refresh_all_compatible_data = () => {
    for (let datum_node_id in this._datum) {
      this._refresh_node_fixed(datum_node_id)
      this._refresh_node_selection(datum_node_id)
    }
  }

  private _refresh_fixed = (): void => {
    for (let node_id in this._node) {
      this._refresh_node_fixed(node_id)
    }
  }

  private _refresh_node_fixed = (node_id: string): void => {
    let fixed = false
    if (
      this._drag_node_id[node_id] ||
      (!this._all_data &&
        this._compatible_node_id[node_id] &&
        (this._is_node_id(node_id) || this._is_internal_pin_node_id(node_id)))
    ) {
      fixed = true
    }
    this._set_node_fixed(node_id, fixed)
  }

  private _refresh_unit_fixed = (unit_id: string) => {
    this._refresh_node_fixed(unit_id)
    this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
      const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)
      this._refresh_node_fixed(anchor_node_id)
    })
  }

  private _refresh_unit_layer = (unit_id: string): void => {
    // console.log('Graph', '_refresh_unit_layer', unit_id)
    this._refresh_node_layer(unit_id)
    this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
      if (!this._is_link_pin_merged(pin_node_id)) {
        this._refresh_node_layer(pin_node_id)
        const datum_node_id = this._pin_to_datum[pin_node_id]
        if (datum_node_id) {
          this._refresh_node_layer(datum_node_id)
        }
      }
    })
  }

  private _refresh_selection = (): void => {
    // console.log('Graph', '_refresh_selection')
    for (let node_id in this._node) {
      this._refresh_node_selection(node_id)
    }
  }

  private _refresh_node_selection = (node_id: string): void => {
    this._refresh_selection_color(node_id)
    this._refresh_selection_dasharray(node_id)
  }

  private _get_node_default_layer = (node_id: string): number => {
    if (this._is_unit_node_id(node_id)) {
      return LAYER_NORMAL
    } else if (this._is_merge_node_id(node_id)) {
      return LAYER_NORMAL
    } else if (this._is_link_pin_node_id(node_id)) {
      if (this._is_link_pin_ignored(node_id)) {
        return LAYER_IGNORED
      } else {
        return LAYER_NORMAL
      }
    } else if (this._is_exposed_pin_node_id(node_id)) {
      return LAYER_EXPOSED
    } else if (this._is_datum_node_id(node_id)) {
      if (this._linked_data_node[node_id]) {
        return LAYER_DATA_LINKED
      } else {
        return LAYER_DATA
      }
    } else if (this._is_err_node_id(node_id)) {
      return LAYER_ERR
    } else if (this._is_type_node_id(node_id)) {
      return LAYER_TYPE
    } else {
      return LAYER_NORMAL
    }
  }

  private _refresh_node_layer = (node_id: string): void => {
    const default_layer = this._get_node_default_layer(node_id)
    this._set_node_layer(node_id, default_layer)
  }

  private _refresh_selection_color = (node_id: string): void => {
    // console.log('Graph', '_refresh_selection_color')
    const selection = this._node_selection[node_id]
    const stroke = this._node_selection_color(node_id)
    selection.setProp('stroke', stroke)
  }

  private _refresh_selection_dasharray = (node_id: string): void => {
    const selection_stroke_dasharray =
      this._get_node_selection_dasharray(node_id)
    this._set_selection_dasharray(node_id, selection_stroke_dasharray)
  }

  private _set_selection_dasharray = (
    node_id: string,
    dasharray: number
  ): void => {
    const selection = this._node_selection[node_id]
    selection.setProp('strokeDasharray', dasharray)
  }

  private _on_node_click = (node_id: string, event: IOPointerEvent) => {
    // log('Graph', '_on_node_click')
    if (this._resize_node_id_pointer_id[node_id]) {
      return
    }

    if (this._mode === 'none') {
      if (this._compatible_node_id[node_id]) {
        const display_node_id = this._get_display_node_id()

        const display_node_count = display_node_id.length

        if (display_node_count > 0) {
          const {
            all_pin,
            all_pin_ref,
            all_pin_ref_unit,
            all_data,
            all_unit,
            all_ext_pin,
          } = this._is_all_node(display_node_id)

          if (all_pin) {
            if (this._is_pin_node_id(node_id)) {
              const merge_node_id = this._merge_pin_pin(
                display_node_id[0],
                node_id
              )
              for (let i = 1; i < display_node_count; i++) {
                this._merge_link_pin_merge_pin(
                  display_node_id[i],
                  merge_node_id
                )
              }
              const merge_anchor_node_id =
                this._get_merge_anchor_node_id(merge_node_id)
              this.select_node(merge_anchor_node_id)
              this._cancel_click = true
            } else if (this._is_datum_node_id(node_id)) {
              for (let i = 1; i < display_node_count; i++) {
                const clone_datum_node_id = this._duplicate_datum(node_id)
                this._move_datum_to_pin(clone_datum_node_id, display_node_id[i])
              }
              this._move_datum_to_pin(node_id, display_node_id[0])
            } else if (this._is_unit_node_id(node_id)) {
              for (let i = 0; i < display_node_count; i++) {
                this._merge_pin_unit(display_node_id[i], node_id)
              }
              this.select_node(node_id)
            } else if (this._is_internal_pin_node_id(node_id)) {
              const { type, id, subPinId } = segmentInternalNodeId(node_id)
              const pin_node_id = display_node_id[0]
              this.__plug_exposed_pin_to(type, id, subPinId, pin_node_id)
            }
          } else if (all_data) {
            for (let i = 0; i < display_node_count; i++) {
              this._move_datum_to_pin(display_node_id[i], node_id)
            }
            return
          } else if (all_unit) {
            const unit_id = display_node_id[0]
            if (this._is_pin_node_id(node_id)) {
              this._merge_pin_unit(node_id, unit_id)
              this.select_node(unit_id)
              this._cancel_click = true
            }
          } else if (all_ext_pin) {
            if (this._is_pin_node_id(node_id)) {
              const internal_node_id = display_node_id[0]
              const { type, id, subPinId } =
                segmentInternalNodeId(internal_node_id)
              this.__plug_exposed_pin_to(type, id, subPinId, node_id)
            }
          }
        }
      } else {
        if (this._core_component_unlocked_count > 0) {
          if (this._is_unit_node_id(node_id)) {
            if (this._is_unit_component(node_id)) {
              this._lock_all_component_but(node_id)
              this.select_node(node_id)
              this._unlock_sub_component(node_id)
            } else {
              this.select_node(node_id)
              this._deselect_all_but(node_id)
              this._lock_all_component_but(node_id)
            }
          } else {
            this.select_node(node_id)
            this._deselect_all_but(node_id)
            this._lock_all_component_but(node_id)
          }
        } else {
          if (this._selected_node_count === 1) {
            this.select_node(node_id)
            this._deselect_all_but(node_id)
          } else {
            this.select_node(node_id)
          }
        }
      }
    } else if (this._mode === 'multiselect') {
      if (this._is_node_selectable(node_id)) {
        if (this._selected_node_id[node_id]) {
          this.deselect_node(node_id)
        } else {
          this.select_node(node_id)
        }
      }
    } else if (this._mode === 'info') {
      this._info_node(node_id)
      this._deselect_all()
      this.select_node(node_id)
    } else if (this._mode === 'add') {
      if (this._is_node_duplicatable(node_id)) {
        this._green_click_node(node_id)
      }
    } else if (this._mode === 'remove') {
      this._on_node_red_click(node_id, event)
    } else if (this._mode === 'change') {
      if (this._is_node_changeable(node_id)) {
        this._change_node(node_id)
      }
    } else if (this._mode === 'data') {
      this._yellow_click_node(node_id)
    }
  }

  private _on_node_red_click = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_red_click', node_id)
    this._cancel_click = true
    if (this._is_node_removable(node_id)) {
      // AD HOC let system finish pointer event cycle (Bot on Mobile)
      setTimeout(() => {
        const anchor_node_id = this._get_node_anchor_node_id(node_id)
        if (this._selected_node_id[anchor_node_id]) {
          this.cut_selected_nodes()
        } else {
          if (this._is_link_pin_node_id(node_id)) {
            this._set_link_pin_ignored(node_id, true)
          } else {
            this.cut_single_node(node_id)
          }
        }
      }, 0)
    }
  }

  private _is_node_removable = (node_id: string): boolean => {
    // TODO
    return true
  }

  private _is_node_dataable = (node_id: string): boolean => {
    return (
      this._is_unit_node_id(node_id) ||
      this._is_link_input_node_id(node_id) ||
      (this._is_merge_node_id(node_id) && !this._is_output_merge(node_id)) ||
      (this._is_datum_node_id(node_id) && this._is_datum_class_literal(node_id))
    )
  }

  private _is_node_infoable = (node_id: string): boolean => {
    return !this._is_type_node_id(node_id)
  }

  private _spec_remove_datum = (node_id: string): void => {
    // TODO
  }

  private _spec_remove_node = (node_id: string): void => {
    // console.log('Graph', '_remove_node', node_id)
    if (this._is_unit_node_id(node_id)) {
      this._spec_remove_unit(node_id)
    } else if (this._is_link_pin_node_id(node_id)) {
      this._spec_set_link_pin_ignored(node_id, true)
    } else if (this._is_merge_node_id(node_id)) {
      this.__spec_remove_merge(node_id)
    } else if (this._is_datum_node_id(node_id)) {
      this._spec_remove_datum(node_id)
    } else if (this._is_exposed_pin_node_id(node_id)) {
      this._spec_remove_exposed_sub_pin(node_id)
    }
  }

  private _pod_remove_datum = (datum_node_id: string) => {
    const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    if (datum_pin_node_id) {
      this._pod_remove_pin_datum(datum_pin_node_id)
    }
  }

  private _pod_remove_node = (node_id: string): void => {
    if (this._is_unit_node_id(node_id)) {
      this._pod_remove_unit(node_id)
    } else if (this._is_link_pin_node_id(node_id)) {
      this._pod_set_unit_pin_ignored(node_id, true)
    } else if (this._is_merge_node_id(node_id)) {
      this._pod_remove_merge(node_id)
    } else if (this._is_datum_node_id(node_id)) {
      this._pod_remove_datum(node_id)
    } else if (this._is_exposed_pin_node_id(node_id)) {
      this._pod_remove_exposed_sub_pin(node_id)
    }
  }

  private _remove_node = (node_id: string): void => {
    // console.log('Graph', '_remove_node', node_id)
    if (this._is_unit_node_id(node_id)) {
      this.remove_unit(node_id)
    } else if (this._is_link_pin_node_id(node_id)) {
      this.set_link_pin_ignored(node_id, true)
    } else if (this._is_merge_node_id(node_id)) {
      this._remove_merge(node_id)
    } else if (this._is_datum_node_id(node_id)) {
      this.remove_datum(node_id)
    } else if (this._is_exposed_pin_node_id(node_id)) {
      this.remove_exposed_sub_pin(node_id)
    }
  }

  private _dispatchAction = (action: Action): void => {
    this.dispatchEvent('_graph_action', action)
    this.dispatchEvent('_graph_spec', { spec: this._spec })
  }

  public remove_exposed_sub_pin = (exposed_pin_node_id: string): void => {
    const { id, type, subPinId } = segmentExposedNodeId(exposed_pin_node_id)
    this._remove_exposed_sub_pin(exposed_pin_node_id)
    this._dispatchAction(coverPin(id, type, subPinId))
  }

  private _remove_exposed_sub_pin = (exposed_pin_node_id: string): void => {
    // console.log('Graph', '_remove_exposed_sub_pin', exposed_pin_node_id)
    const { id, type, subPinId } = segmentExposedNodeId(exposed_pin_node_id)

    const pin_count = this._get_exposed_pin_set_count(exposed_pin_node_id)
    if (pin_count === 1 || pin_count === 0) {
      this.__remove_exposed_pin_set(type, id)
    } else {
      this.__sim_remove_exposed_sub_pin(type, id, subPinId)
      this.__spec_remove_exposed_sub_pin(type, id, subPinId)
      this.__pod_remove_exposed_sub_pin(type, id, subPinId)
    }
  }

  private _get_exposed_pin_set_count = (
    exposed_pin_node_id: string
  ): number => {
    const { id, type } = segmentExposedNodeId(exposed_pin_node_id)
    const exposed_pin_spec = this._get_exposed_pin_spec(type, id)
    const { pin } = exposed_pin_spec
    const { count } = keyCount({ obj: pin || {} })
    return count
  }

  private _spec_remove_exposed_sub_pin = (exposed_node_id: string): void => {
    const { id, type, subPinId } = segmentExposedNodeId(exposed_node_id)
    this.__spec_remove_exposed_sub_pin(type, id, subPinId)
  }

  private __spec_remove_exposed_sub_pin = (
    type: 'input' | 'output',
    id: string,
    subPinId: string
  ): void => {
    // console.log('Graph', '_spec_remove_exposed_sub_pin', type, id, subPinId)
    this._spec = specReducer.coverPin({ id, type, subPinId }, this._spec)
  }

  private _sim_remove_exposed_sub_pin = (exposed_pin_node_id: string) => {
    const { type, id, subPinId } = segmentExposedNodeId(exposed_pin_node_id)
    this.__sim_remove_exposed_sub_pin(type, id, subPinId)
  }

  private __sim_remove_exposed_sub_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '__sim_remove_exposed_sub_pin',
    //   type,
    //   pin_id,
    //   sub_pin_id
    // )
    const input = type === 'input'
    const ext_pin_node_id = getExternalNodeId(type, pin_id, sub_pin_id)
    // const int_pin_node_id = this._get_exposed_pin_internal_node_id(
    //   type,
    //   pin_id,
    //   sub_pin_id
    // )
    const int_pin_node_id = getInternalNodeId(type, pin_id, sub_pin_id)

    const source_id = input ? ext_pin_node_id : int_pin_node_id
    const target_id = input ? int_pin_node_id : ext_pin_node_id
    const link_id = getLinkId(source_id, target_id)
    this._sim_remove_link(link_id)

    delete this._exposed_link[link_id]

    this._sim_remove_exposed_ext_node(ext_pin_node_id)

    const pin_node_id = this._exposed_int_plugged[int_pin_node_id]
    if (pin_node_id) {
      delete this._pin_to_internal[pin_node_id]
      delete this._exposed_int_plugged[int_pin_node_id]
    } else {
      this._sim_remove_exposed_int_node(int_pin_node_id)
    }
  }

  private _sim_remove_exposed_ext_node = (ext_pin_node_id: string) => {
    delete this._exposed_node[ext_pin_node_id]
    delete this._exposed_ext_node[ext_pin_node_id]
    delete this._exposed_ext_plugged[ext_pin_node_id]
    delete this._exposed_ext_unplugged[ext_pin_node_id]
    delete this._pin_name[ext_pin_node_id]

    this._sim_remove_node(ext_pin_node_id)
  }

  private _sim_remove_exposed_int_node = (int_pin_node_id: string) => {
    delete this._exposed_node[int_pin_node_id]
    delete this._exposed_int_node[int_pin_node_id]
    delete this._exposed_int_unplugged[int_pin_node_id]

    this._sim_remove_node(int_pin_node_id)
  }

  private _pod_remove_exposed_sub_pin = (exposed_node_id: string): void => {
    const { type, id, subPinId } = segmentExposedNodeId(exposed_node_id)
    this.__pod_remove_exposed_sub_pin(type, id, subPinId)
  }

  private __pod_remove_exposed_sub_pin = (
    type: 'input' | 'output',
    id: string,
    subPinId: string
  ): void => {
    this._pod.$coverPin({
      type,
      id,
      subPinId,
    })
  }

  private _set_link_pin_r = (pin_node_id: string, r: number): void => {
    const pin = this._pin[pin_node_id]

    const width = 2 * r
    const height = 2 * r

    // mergeStyle(pin, {
    //   width: `${width}px`,
    //   height: `${height}px`,
    // })
    pin.$element.style.width = `${width}px`
    pin.$element.style.height = `${height}px`

    this._resize_node(pin_node_id, r, width, height)
    this._resize_selection(pin_node_id, width, height)
  }

  private _set_link_pin_d = (pin_node_id: string, d: number): void => {
    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const link = this._link[link_id]
    link.d = d
  }

  private _set_link_pin_padding_source = (
    pin_node_id: string,
    padding: number
  ): void => {
    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const link = this._link[link_id]
    link.padding.source = padding
  }

  private _set_link_pin_padding_target = (
    pin_node_id: string,
    padding: number
  ): void => {
    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const link = this._link[link_id]
    link.padding.target = padding
  }

  private _set_link_pin_start_marker_hidden = (
    pin_node_id: string,
    hidden: boolean
  ): void => {
    const start_marker = this._pin_link_start_marker[pin_node_id]
    // mergeStyle(start_marker, {
    //   display: hidden ? 'none' : 'block',
    // })
    start_marker.$element.style.display = hidden ? 'none' : 'block'
  }

  private _set_link_pin_end_marker_hidden = (
    pin_node_id: string,
    hidden: boolean
  ): void => {
    const end_marker = this._pin_link_end_marker[pin_node_id]
    // mergeStyle(end_marker, {
    //   display: hidden ? 'none' : 'block',
    // })
    end_marker.$element.style.display = hidden ? 'none' : 'block'
  }

  public set_link_pin_ignored = (
    pin_node_id: string,
    ignored: boolean
  ): void => {
    // console.log('Graph', 'set_link_pin_ignored')
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    this._set_link_pin_ignored(pin_node_id, ignored)
    this._dispatchAction(setUnitPinIgnored(unitId, type, pinId, ignored))
  }

  private _set_link_pin_ignored = (
    pin_node_id: string,
    ignored: boolean
  ): void => {
    // console.log('_set_link_pin_ignored', pin_node_id, ignored)

    const merge_node_id = this._pin_to_merge[pin_node_id]
    if (merge_node_id) {
      this._remove_pin_or_merge(pin_node_id)
    }

    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    this._sim_set_unit_pin_ignored(pin_node_id, ignored)
    this.__spec_set_link_pin_ignored(unitId, type, pinId, ignored)
    this.__pod_set_unit_pin_ignored(unitId, type, pinId, ignored)
    // if (ignored) {
    //   this.__pod_set_unit_pin_ignored(unitId, type, pinId, true)
    //   this._sim_set_unit_pin_ignored(pin_node_id, true)
    //   this.__spec_set_link_pin_ignored(unitId, type, pinId, true)
    // } else {
    //   this.__spec_set_link_pin_ignored(unitId, type, pinId, false)
    //   this._sim_set_unit_pin_ignored(pin_node_id, false)
    //   this.__pod_set_unit_pin_ignored(unitId, type, pinId, false)
    // }
  }

  private _sim_set_unit_pin_ignored = (
    pin_node_id: string,
    ignored: boolean
  ) => {
    // console.log('Graph', '_sim_set_unit_pin_ignored', pin_node_id, ignored)
    const { unitId } = segmentLinkPinNodeId(pin_node_id)

    const internal_node_id = this._pin_to_internal[pin_node_id]
    if (internal_node_id) {
      const { type, id, subPinId } = segmentInternalNodeId(internal_node_id)
      this._sim_unplug_exposed_pin(type, id, subPinId)
    }

    const datum_node_id = this._pin_to_datum[pin_node_id]

    this._link_pin_ignored[pin_node_id] = ignored

    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)

    if (ignored) {
      this._set_node_layer(pin_node_id, LAYER_IGNORED)
      this._set_link_layer(link_id, LAYER_IGNORED)
      this._set_link_pin_d(pin_node_id, LINK_DISTANCE_IGNORED)
      this._set_link_pin_opacity(pin_node_id, '0')
      this._set_link_pin_pointer_events(pin_node_id, 'none')
      if (datum_node_id) {
        this._dec_unit_pin_active(unitId)
      }
    } else {
      this._set_node_layer(pin_node_id, LAYER_NORMAL)
      this._set_link_layer(link_id, LAYER_NORMAL)
      this._set_link_pin_d(pin_node_id, LINK_DISTANCE)
      this._set_link_pin_opacity(pin_node_id, '1')
      this._set_link_pin_pointer_events(pin_node_id, 'inherit')

      if (datum_node_id) {
        this._inc_unit_pin_active(unitId)

        this._refresh_datum_visible(datum_node_id)
      }
    }

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _pod_set_unit_pin_ignored = (
    pin_node_id: string,
    ignored: boolean
  ): void => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    this.__pod_set_unit_pin_ignored(unitId, type, pinId, ignored)
  }

  private __pod_set_unit_pin_ignored = (
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    ignored: boolean
  ): void => {
    this._pod.$setUnitPinIgnored({
      unitId,
      type,
      pinId,
      ignored,
    })
  }

  private _spec_set_link_pin_ignored = (
    pin_node_id: string,
    ignored: boolean
  ): void => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    this.__spec_set_link_pin_ignored(unitId, type, pinId, ignored)
  }

  private __spec_set_link_pin_ignored = (
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    ignored: boolean
  ): void => {
    this._spec = specReducer.setUnitPinIgnored(
      { unitId, type, pinId, ignored },
      this._spec
    )
  }

  private _spec_set_link_pin_constant = (
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    constant: boolean
  ): void => {
    if (type === 'input') {
      this._spec = specReducer.setUnitInputConstant(
        { unitId, pinId, constant },
        this._spec
      )
    } else {
      this._spec = specReducer.setUnitOutputConstant(
        { unitId, pinId, constant },
        this._spec
      )
    }
  }

  private _spec_set_link_pin_memory = (
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    memory: boolean
  ): void => {
    // TODO
    this._spec.units = this._spec.units || {}
    this._spec.units[unitId][type] = this._spec.units[unitId][type] || {}
    this._spec.units[unitId][type]![pinId] =
      this._spec.units[unitId][type]![pinId] || {}
    this._spec.units[unitId][type]![pinId].memory = memory
  }

  private _is_node_duplicatable = (node_id: string): boolean => {
    if (this._is_link_pin_node_id(node_id)) {
      return true
    } else if (this._is_unit_node_id(node_id)) {
      return true
    } else if (this._is_datum_node_id(node_id)) {
      return true
    } else if (this._is_exposed_pin_node_id(node_id)) {
      return true
    } else if (this._is_merge_node_id(node_id)) {
      return true
    } else {
      return false
    }
  }

  private _green_click_node = (node_id: string): string | null => {
    if (this._is_node_selected(node_id)) {
      this.copy_selected_nodes()
      // TODO
      // should return list of nodes for dragging
    } else {
      // if (this._is_unit_node_id(node_id)) {
      //   return this._green_click_unit(node_id)
      // } else if (this._is_link_pin_node_id(node_id)) {
      //   return this._duplicate_link_pin(node_id)
      // } else if (this._is_datum_node_id(node_id)) {
      //   return this._duplicate_datum(node_id)
      // } else if (this._is_exposed_pin_node_id(node_id)) {
      //   return this._duplicate_exposed_pin(node_id)
      // } else {
      //   return null
      // }
      if (this._is_link_pin_node_id(node_id)) {
        return this._duplicate_link_pin(node_id)
      }
      this.copy_single_node(node_id)
      return node_id
    }
    return null
  }

  private _set_unit_fixed = (unit_id: string, fixed: boolean) => {
    this._set_node_fixed(unit_id, fixed)
    this._for_each_unit_pin(unit_id, (pin_node_id) => {
      const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)
      this._set_node_fixed(anchor_node_id, fixed)
    })
  }

  private _green_click_unit = (unit_id: string): null => {
    // log('Graph', '_duplicate_unit')
    // const unit = this._get_unit(unit_id)
    // const new_unit_id = this._new_unit_id()
    // const new_unit = clone(unit)
    // const unit_position = this._get_node_position(unit_id)
    // const unit_pin_position = this._get_unit_pin_position(unit_id)
    // this.add_unit(new_unit_id, new_unit, unit_position, unit_pin_position)
    // if (this._is_unit_component(new_unit_id)) {
    //   this._add_unit_component(new_unit_id)
    //   this._pod_add_unit_component(unit_id)
    //   const { width, height } = this._get_unit_component_spec_size(unit_id)
    //   this.resize_sub_component(new_unit_id, width, height)
    // }
    // return new_unit_id
    if (this._is_node_selected(unit_id)) {
      this.copy_selected_nodes()
    } else {
      this.copy_single_node(unit_id)
    }
    return null
  }

  private _green_click_datum = () => {}

  private _sim_duplicate_unit = (unit_id: string): string => {
    const unit = this._get_unit(unit_id)

    const { path } = unit

    const new_unit_id = this._new_unit_id(path)
    const new_unit = clone(unit)

    const unit_position = this._get_node_position(unit_id)
    const unit_pin_position = this._get_unit_pin_position(unit_id)
    const unit_layout_position = NULL_VECTOR

    this._spec_add_unit(new_unit_id, new_unit)

    let parent_id: string | null = null

    if (this._is_unit_component(new_unit_id)) {
      parent_id = this._get_sub_component_target_parent_id()

      this._spec_append_component(parent_id, new_unit_id)
    }
    this._sim_add_unit(
      new_unit_id,
      new_unit,
      unit_position,
      unit_pin_position,
      parent_id,
      unit_layout_position
    )

    if (this._is_unit_component(new_unit_id)) {
      const { width, height } = this._get_unit_component_graph_size(unit_id)
      this.resize_sub_component(new_unit_id, width, height)
    }

    return new_unit_id
  }

  private _duplicate_link_pin = (pin_node_id: string): string | null => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      if (this._is_link_pin_ignored(pin_node_id)) {
        this.set_link_pin_ignored(pin_node_id, false)
      }
    }
    return null
  }

  private _duplicate_datum = (datum_node_id: string): string => {
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    const datum_tree = this._datum_tree[datum_id]
    const { x, y } = this._get_node_position(datum_node_id)
    const new_datum_id = this._new_datum_id()
    const new_datum_node_id = getDatumNodeId(new_datum_id)
    this.add_datum(new_datum_id, datum_tree.value, { x, y })
    return new_datum_node_id
  }

  private _duplicate_exposed_pin = (exposed_node_id: string): string => {
    const { type, id, subPinId } = segmentExposedNodeId(exposed_node_id)
    const ext_node_id = getExternalNodeId(type, id, subPinId)
    const int_node_id = getExternalNodeId(type, id, subPinId)
    const new_sub_pin_id = this._new_sub_pin_id(type, id)
    this.add_exposed_pin(type, id, {}, new_sub_pin_id, {}, {})
    const new_exposed_ext_node_id = getExternalNodeId(type, id, new_sub_pin_id)
    const new_exposed_int_node_id = getInternalNodeId(type, id, new_sub_pin_id)
    this._transfer_node_position(ext_node_id, new_exposed_ext_node_id)
    this._transfer_node_position(int_node_id, new_exposed_int_node_id)
    return new_exposed_ext_node_id
  }

  private _transfer_node_position = (
    source_node_id: string,
    target_node_id: string
  ): void => {
    this._set_node_position(
      target_node_id,
      this._get_node_position(source_node_id)
    )
  }

  private _is_node_changeable = (node_id: string): boolean => {
    if (this._is_unit_node_id(node_id)) {
      return true
    } else if (this._is_link_pin_node_id(node_id)) {
      return true
    } else if (this._is_exposed_pin_node_id(node_id)) {
      return true
    } else if (this._is_datum_node_id(node_id)) {
      const datum_pin_node_id = this._datum_to_pin[node_id]
      if (datum_pin_node_id) {
        if (isOutputPinId(datum_pin_node_id)) {
          return false
        }
      }
      return true
    } else if (this._is_merge_node_id(node_id)) {
      return true
    } else {
      return false
    }
  }

  private _set_search_text = (text: string): void => {
    if (this._search) {
      this._search.setValue(text)
    }
  }

  private _set_search_filter = (filter: (id: string) => boolean) => {
    // console.log('Graph', '_set_search_filter')
    if (this._search) {
      this._search.setProp('filter', filter)
    }
  }

  private _set_search_selected = (id: string) => {
    if (this._search) {
      this._search.setProp('selected', id)
    }
  }

  private _info_node = (node_id: string): void => {
    if (this._is_pin_node_id(node_id)) {
      this._info_pin(node_id)
    } else if (this._is_unit_node_id(node_id)) {
      this._info_unit(node_id)
    } else if (this._is_external_pin_node_id(node_id)) {
      this._info_ext_pin(node_id)
    }
  }

  private _temp_cancel_double_click = () => {
    this._cancel_double_click = true
    setTimeout(() => {
      this._cancel_double_click = false
    }, CLICK_TIMEOUT)
  }

  private _yellow_click_node = (node_id: string): void => {
    if (this._is_pin_node_id(node_id)) {
      this._yellow_click_pin(node_id)
    } else if (this._is_unit_node_id(node_id)) {
      this._yellow_click_unit(node_id)
    } else if (this._is_datum_node_id(node_id)) {
      if (this._is_datum_class_literal(node_id)) {
        this._yellow_click_class_literal(node_id)
      }
    }
  }

  private _yellow_click_unit = (unit_id: string): void => {
    this._yellow_click_unit_0(unit_id)

    // this._temp_cancel_double_click()
    // const spec_id = this._get_unit_spec_id(unit_id)
    // const position = this._get_node_position(unit_id)
    // this._remove_unit(unit_id)
    // const datum_id = this._new_datum_id()
    // this._add_datum(datum_id, spec_id, position)
  }

  private _yellow_click_class_literal = (datum_node_id: string): void => {
    this._temp_cancel_double_click()
    this._yellow_click_unit_0_to_unit(datum_node_id)
  }

  private _yellow_click_unit_0_to_unit = (datum_node_id: string): void => {
    const position = this._get_node_position(datum_node_id)
    const pin_position = { input: {}, output: {} }
    const layout_position = NULL_VECTOR

    const { id: datum_id } = segmentDatumNodeId(datum_node_id)

    const tree = this._datum_tree[datum_id]

    const { value: spec_id } = tree

    this._remove_datum(datum_node_id)

    const new_unit_id = this._new_unit_id(spec_id)

    this._add_unit(
      new_unit_id,
      { path: spec_id },
      position,
      pin_position,
      layout_position,
      null
    )
    this.temp_fixate_node(new_unit_id)
    if (this._is_unit_component(new_unit_id)) {
      this._sim_add_unit_component(new_unit_id)
      this._pod_add_unit_component(new_unit_id)
    }
  }

  private _info_unit = (unit_id: string): void => {
    // TODO
  }

  private _show_core_description = (unit_id: string): void => {
    const core_description = this._core_description[unit_id]
    // mergeStyle(core_description, {
    //   display: 'flex',
    // })
    core_description.$element.style.display = 'flex'
  }

  private _hide_core_description = (unit_id: string): void => {
    const core_description = this._core_description[unit_id]
    // mergeStyle(core_description, {
    //   display: 'none',
    // })
    core_description.$element.style.display = 'none'
  }

  private _info_pin = (pin_node_id: string): void => {
    // TODO
  }

  private _info_ext_pin = (ext_pin_node_id: string) => {
    // TODO
  }

  private _yellow_click_pin = (pin_node_id: string): void => {
    if (
      this._is_link_input_node_id(pin_node_id) ||
      (this._is_merge_node_id(pin_node_id) &&
        !this._is_output_merge(pin_node_id))
    ) {
      let value: string

      const random_from_type = () => {
        const pin_type = this._get_pin_type(pin_node_id)
        value = randomValueOfType(pin_type)
      }

      if (this._is_link_pin_node_id(pin_node_id)) {
        const pin_spec = this._get_unit_pin_spec(pin_node_id)
        const { metadata = {} } = pin_spec
        const { examples = [] } = metadata
        if (examples.length > 0) {
          value = randomInArray(examples)
        } else {
          random_from_type()
        }
      } else {
        random_from_type()
      }

      this._set_pin_data(pin_node_id, value)
    }
  }

  private _yellow_click_unit_0 = (unit_id: string): void => {
    this._for_each_unit_input(unit_id, (input_node_id: string) => {
      if (!this._is_pin_ref(input_node_id)) {
        const datum_node_id = this._pin_to_datum[input_node_id]
        if (!datum_node_id) {
          this._yellow_click_pin(input_node_id)
        }
      }
    })
  }

  private _spec_type_interface_cache: Dict<any> = {}

  private _blue_click_unit = (unit_id: string): void => {
    const spec_id = this._get_unit_spec_id(unit_id)

    this._search_unit_id = unit_id
    this._search_unit_spec_id = spec_id
    this._search_change_unit_spec_id = spec_id

    this._search_unit_merged_pin_ids = {
      input: [],
      output: [],
    }

    this._search_unit_exposed_pin_ids = {
      input: {},
      output: {},
    }

    const search_unit_merged_pin_types: {
      input: TreeNode[]
      output: TreeNode[]
    } = {
      input: [],
      output: [],
    }

    this._for_each_unit_pin(unit_id, (pin_node_id, kind, pin_id) => {
      const merge_node_id = this._pin_to_merge[pin_node_id]
      if (merge_node_id) {
        this._search_unit_merged_pin_ids[kind].push(pin_id)
        const opposite_kind = oppositePinKind(kind)
        const merge = this._get_merge(merge_node_id)
        // this unit should not be considered on merge type
        const _merge = _dissoc(merge, unit_id)
        const merge_type = this._get_merge_spec_type(_merge, opposite_kind)
        search_unit_merged_pin_types[kind].push(merge_type)
      }

      const int_pin_node_id = this._pin_to_internal[pin_node_id]
      if (int_pin_node_id) {
        const { id, subPinId } = segmentExposedNodeId(int_pin_node_id)
        this._search_unit_exposed_pin_ids[kind][pin_id] = [id, subPinId]
      }
    })
    const search_unit_merge_input_count =
      this._search_unit_merged_pin_ids.input.length
    const search_unit_merge_output_count =
      this._search_unit_merged_pin_ids.output.length

    this._set_search_filter((id: string) => {
      const inputs = getSpecInputs(id)
      const outputs = getSpecOutputs(id)

      const input_ids = Object.keys(inputs)
      const output_ids = Object.keys(outputs)

      const input_count = input_ids.length
      const output_count = output_ids.length

      const { input, output } = _getSpecTypeInterfaceByPath(
        id,
        globalThis.__specs,
        this._spec_type_interface_cache,
        {}
      )
      const input_types = input_ids.map((input_id) => input[input_id])
      const output_types = output_ids.map((output_id) => output[output_id])

      if (
        input_count >= search_unit_merge_input_count &&
        output_count >= search_unit_merge_output_count
      ) {
        if (this._search_option_valid_pin_matches[id]) {
          return true
        } else {
          // TODO
          // filter by ref / non-ref
          const input_matches = _matchAllExcTypes(
            search_unit_merged_pin_types.input,
            input_types
          )
          const valid_input_matches = input_matches.filter((input_match) => {
            return input_match.length === search_unit_merge_input_count
          })
          if (
            search_unit_merge_input_count > 0 &&
            valid_input_matches.length === 0
          ) {
            return false
          }

          const output_matches = _matchAllExcTypes(
            search_unit_merged_pin_types.output,
            output_types
          )
          const valid_output_matches = output_matches.filter((output_match) => {
            return output_match.length === search_unit_merge_output_count
          })
          if (
            search_unit_merge_output_count > 0 &&
            valid_output_matches.length === 0
          ) {
            return false
          }

          this._search_option_valid_pin_matches[id] = {
            input: valid_input_matches,
            output: valid_output_matches,
          }
        }

        return true
      } else {
        return false
      }
    })

    // AD HOC
    // [Android] click will not be over when search is focused
    // imediatelly blurring
    // setTimeout(() => {
    // AD HOC
    this._set_search_text('')
    this._set_search_selected(spec_id)
    this._show_search()
    // this._set_search_selected(spec_id)
    // }, 0)
  }

  private _change_datum = (datum_node_id: string): void => {
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    const tree = this._datum_tree[datum_id]
    const value = tree.value
    const type = _getValueType(tree)
    const pin_node_id = this._datum_to_pin[datum_node_id]
    if (pin_node_id) {
      const pin_type = this._get_pin_type(pin_node_id)
      let next_value: string
      do {
        next_value = randomValueOfType(pin_type)
      } while (value === next_value && value !== 'null')
      this._set_pin_data(pin_node_id, next_value)
    } else {
      let next_value: string
      do {
        next_value = randomValueOfType(type)
      } while (value === next_value && value !== 'null')
      const next_tree = _getValueTree(next_value)
      const datum = this._datum[datum_node_id]
      if (next_tree.type === TreeNodeType.Unit) {
        const { value: id } = next_tree
        datum.setProp('id', id)
        this._datum_tree[datum_id] = next_tree
        this._refresh_class_literal_datum_node_selection(datum_node_id)
      } else {
        const datum = this._datum[datum_node_id]
        datum.setProp('data', next_tree)
      }
    }
  }

  private _change_node = (node_id: string): void => {
    if (this._is_unit_node_id(node_id)) {
      this._blue_click_unit(node_id)
    } else if (this._is_link_pin_node_id(node_id)) {
      this._toggle_link_pin_constant(node_id)
    } else if (this._is_datum_node_id(node_id)) {
      this._change_datum(node_id)
    } else if (this._is_exposed_pin_node_id(node_id)) {
      this._toggle_exposed_pin_functional(node_id)
    }
  }

  private _toggle_link_pin_constant = (pin_node_id: string): void => {
    // console.log('_toggle_link_pin_constant', pin_node_id)
    const constant = this._is_link_pin_constant(pin_node_id)
    this._set_link_pin_constant(pin_node_id, !constant)
  }

  private _toggle_link_pin_memory = (pin_node_id: string): void => {
    const memory = this._is_link_pin_memory(pin_node_id)
    this._set_link_pin_memory(pin_node_id, !memory)
  }

  private _is_exposed_pin_functional = (exposed_node_id: string): boolean => {
    const { type, id } = segmentExposedNodeId(exposed_node_id)
    return this.__is_exposed_pin_functional(type, id)
  }

  private __is_exposed_pin_functional = (
    type: 'input' | 'output',
    id: string
  ): boolean => {
    const pin_spec = this._get_exposed_pin_spec(type, id)
    const { functional } = pin_spec
    return !!functional
  }

  private _toggle_exposed_pin_functional = (exposed_node_id: string): void => {
    const functional = this._is_exposed_pin_functional(exposed_node_id)
    this._set_exposed_pin_functional(exposed_node_id, !functional)
  }

  public set_exposed_pin_functional = (
    exposed_node_id: string,
    functional: boolean
  ) => {
    const { type, id } = segmentExposedNodeId(exposed_node_id)
    this._set_exposed_pin_functional(exposed_node_id, functional)
    this._dispatchAction(setPinSetFunctional(type, id, functional))
  }

  private _set_exposed_pin_functional = (
    exposed_node_id: string,
    functional: boolean
  ): void => {
    this._spec_set_exposed_pin_functional(exposed_node_id, functional)
    this._sim_set_exposed_pin_functional(exposed_node_id, functional)
    this._pod_set_exposed_pin_functional(exposed_node_id, functional)
  }

  private _spec_set_exposed_pin_functional = (
    exposed_node_id: string,
    functional: boolean
  ): void => {
    const { type, id } = segmentExposedNodeId(exposed_node_id)
    this._spec = specReducer.setPinSetFunctional(
      { type, id, functional },
      this._spec
    )
  }

  private _sim_set_exposed_pin_functional = (
    exposed_node_id: string,
    functional: boolean
  ): void => {
    const { type, id } = segmentExposedNodeId(exposed_node_id)
    const pin_spec = this._get_exposed_pin_spec(type, id)
    const { pin = {} } = pin_spec
    for (let subPinId in pin) {
      const ext_pin_node_id = getExternalNodeId(type, id, subPinId)
      const end_marker = this._exposed_link_end_marker[ext_pin_node_id]
      if (type === 'input') {
        end_marker.setProp(
          'd',
          `${functional ? ARROW_MEMORY : ''}${ARROW_SEMICIRCLE}`
        )
      } else {
        end_marker.setProp('d', `${functional ? ARROW_MEMORY : ''}`)
      }
    }
  }

  private _pod_set_exposed_pin_functional = (
    exposed_node_id: string,
    functional: boolean
  ): void => {
    const { type, id } = segmentExposedNodeId(exposed_node_id)
    this._pod.$setPinSetFunctional({
      type,
      id,
      functional,
    })
  }

  public _spec_set_exposed_pin_ref = (
    type: 'input' | 'output',
    id: string,
    ref: boolean
  ): void => {
    this._spec = specReducer.setPinSetRef({ type, id, ref }, this._spec)
  }

  private _set_link_pin_constant = (
    pin_node_id: string,
    constant: boolean
  ): void => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const link_base = this._link_base[link_id]
    if (constant) {
      this._link_pin_constant_count++

      // mergeStyle(link_base, {
      //   strokeDasharray: '3',
      // })
      link_base.$element.style.strokeDasharray = '3'
    } else {
      this._link_pin_constant_count--

      // mergeStyle(link_base, {
      //   strokeDasharray: '',
      // })
      link_base.$element.style.strokeDasharray = ''
    }

    this._spec_set_link_pin_constant(unitId, type, pinId, constant)

    const datum_node_id = this._pin_to_datum[pin_node_id]
    if (datum_node_id) {
      if (constant) {
        const { id: datum_id } = segmentDatumNodeId(datum_node_id)
        const tree = this._datum_tree[datum_id]
        const { value } = tree
        this._spec_set_pin_data(pin_node_id, value)
      } else {
        this._spec_remove_pin_data(pin_node_id)
      }
    }

    this._pod_set_link_pin_constant(unitId, type, pinId, constant)
  }

  private _pod_set_link_pin_constant = (
    unitId,
    type,
    pinId,
    constant: boolean
  ) => {
    this._pod.$setUnitPinConstant({
      unitId,
      type,
      pinId,
      constant,
    })
  }

  private _set_link_pin_memory = (
    pin_node_id: string,
    memory: boolean
  ): void => {
    const { $theme } = this.$context

    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const link_base = this._link_base[link_id]
    const link_arrow = this._pin_link_end_marker[pin_node_id]
    const link = this._link[link_id]
    if (memory) {
      this._link_pin_memory_count++

      // mergeStyle(link_base, {
      //   strokeWidth: '1px',
      // })
      link_base.$element.style.strokeWidth = '1px'
    } else {
      this._link_pin_memory_count--

      // mergeStyle(link_base, {
      //   strokeWidth: '3px',
      // })
      link_base.$element.style.strokeWidth = '3px'
    }
    let pin_link_current_color = this._theme.link
    if (
      this._hover_node_id[pin_node_id] &&
      ['add', 'remove', 'change'].indexOf(this._mode) !== -1
    ) {
      pin_link_current_color = getThemeLinkModeColor($theme, this._mode)
    }
    const pin_link_end_marker_d = memory ? ARROW_MEMORY : ARROW_NORMAL
    const pin_link_end_marker_fill = memory ? 'none' : pin_link_current_color
    const pin_link_end_marker_stroke = memory ? pin_link_current_color : 'none'
    const pin_link_end_marker_stroke_width = memory ? '1px' : '0'
    link_arrow.setProp('d', pin_link_end_marker_d)
    // mergeStyle(link_arrow, {
    //   fill: pin_link_end_marker_fill,
    //   stroke: pin_link_end_marker_stroke,
    //   strokeWidth: pin_link_end_marker_stroke_width,
    // })
    link_arrow.$element.style.fill = pin_link_end_marker_fill
    link_arrow.$element.style.stroke = pin_link_end_marker_stroke
    link_arrow.$element.style.strokeWidth = pin_link_end_marker_stroke_width
    link.padding = link.padding || { source: 0, target: 0 }
    if (memory) {
      link.padding.target = -1
    } else {
      link.padding.target = -5.75
    }

    this._spec_set_link_pin_memory(unitId, type, pinId, memory)

    // TODO
    // this._controller.setUnitPinMemory({ unitId, type, pinId, constant: memory })
  }

  private _on_node_double_click = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_double_click', node_id)
    const { pointerId } = event

    if (this._resize_node_id_pointer_id[node_id]) {
      return
    }

    if (this._is_unit_node_id(node_id)) {
      this._on_unit_double_click(node_id, event)
    } else if (this._is_pin_node_id(node_id)) {
      this._on_pin_double_click(node_id, event)
    } else if (this._is_datum_node_id(node_id)) {
      this._on_datum_double_click(node_id, event)
    }
  }

  private _on_pin_double_click = (
    pin_node_id: string,
    event: IOPointerEvent
  ): void => {
    if (this._mode === 'none') {
      if (
        this._is_link_input_node_id(pin_node_id) ||
        (this._is_merge_node_id(pin_node_id) &&
          !this._is_output_merge(pin_node_id))
      ) {
        this.deselect_node(pin_node_id)

        const pin_datum_node_id = this._get_pin_datum_node_id(pin_node_id)
        if (pin_datum_node_id) {
          const { id: datum_id } = segmentDatumNodeId(pin_datum_node_id)
          this._show_datum(pin_datum_node_id)
          this.select_node(pin_datum_node_id)
          this._focus_datum(datum_id, [])
        } else {
          const datum_id = this._new_datum_id()
          const datum_node_id = getDatumNodeId(datum_id)
          const position = this._pin_line_position(pin_node_id, LINK_DISTANCE)
          this._add_empty_datum(datum_id, position)
          this._sim_add_datum_link(datum_node_id, pin_node_id)
        }
      }
    } else {
      this._on_node_click(pin_node_id, event)
    }
  }

  private _on_datum_double_click = (node_id: string, event: IOPointerEvent) => {
    if (this._mode === 'none') {
      const datum_overlay = this._datum_overlay[node_id]
      // mergeStyle(datum_overlay, {
      //   display: 'none',
      // })
      datum_overlay.$element.style.display = 'none'

      // if (!this._edit_datum_node_id) {
      // const { id: datum_id } = segmentDatumNodeId(node_id)
      // TODO calculate best focus point
      // const tree = this._datum_tree[datum_id]
      // const path = _getNextLeafPath(tree, [], 1)
      // this._focus_datum(datum_id, path)
      // }
    } else if (this._mode === 'multiselect') {
      this._on_node_click(node_id, event)
    } else {
      this._on_node_click(node_id, event)
    }
  }

  private _on_unit_double_click = (
    unit_id: string,
    event: IOPointerEvent
  ): void => {
    // this.dispatchEvent('unit-double-click', { id: unit_id }

    if (this._mode === 'none') {
      if (!this._resize_node_id_pointer_id[unit_id]) {
        if (this._is_unit_component(unit_id)) {
          this._unlock_sub_component(unit_id)
          this._focus_sub_component(unit_id)
        }
      }
    } else {
      this._on_node_click(unit_id, event)
    }
  }

  private _focus_sub_component = (unit_id: string): void => {
    // console.log('Graph', '_focus_sub_component', unit_id)
    const sub_component = this._get_sub_component(unit_id)
    sub_component.focus()
  }

  private _blur_sub_component = (unit_id: string): void => {
    // console.log('Graph', '_blur_sub_component', unit_id)
    const sub_component = this._get_sub_component(unit_id)
    sub_component.blur()
  }

  private _is_sub_component_fullwindow = (
    sub_component_id: string
  ): boolean => {
    const is_ascended = this._fullwindow_component_set.has(sub_component_id)
    return is_ascended
  }

  private _subgraph_return_fullwindow = false
  private _subgraph_return_fullwindow_component_ids: string[] = []

  private _enter_subgraph = (unit_id: string): void => {
    const unit: GraphUnitSpec = this._get_unit(unit_id)

    const { path: id } = unit

    if (!isBaseSpecId(id)) {
      const color = this._get_color()

      for (const component_id in this._selected_component) {
        this._disable_core_resize(component_id)
      }

      const is_component = this._is_unit_component(unit_id)

      let fullwindow = false

      if (is_component) {
        if (this._is_sub_component_fullwindow(unit_id)) {
          fullwindow = true
        }
      }

      let sub_component = this._get_sub_component(unit_id)

      if (this._is_fullwindow) {
        this._subgraph_return_fullwindow = true
        this._subgraph_return_fullwindow_component_ids =
          this._fullwindow_component_ids
        this._leave_all_fullwindow(true)
      }

      if (is_component) {
        this._leave_sub_component_frame(unit_id)

        this._decompose_sub_component(unit_id)
      }

      let graph = this._subgraph_cache[unit_id]

      if (graph) {
        // mergeStyle(graph, {
        //   display: 'block',
        // })
        graph.$element.style.display = 'block'
      } else {
        if (!sub_component) {
          sub_component = parentComponent({})
        }

        const pod = this._pod.$refUnit({
          unitId: unit_id,
          _: ['$U', '$C', '$G'],
        }) as $Graph

        graph = new _GraphComponent({
          pod,
          style: { color },
          disabled: true,
          parent: this,
          frame: this._frame,
          frameOut: this._frame_out,
          fullwindow,
          component: sub_component,
        })

        this.cacheSubgraph(unit_id, graph)
      }

      this._subgraph_unlisten = graph.addEventListeners([
        makeCustomListener('leave', this._on_subgraph_leave),
        makeCustomListener('enterunit', this._on_subgraph_enter_unit),
        makeCustomListener('leaveunit', this._on_subgraph_leave_unit),
      ])

      this._subgraph_graph = graph
      this._subgraph_unit_id = unit_id
      this._subgraph_depth = 1 + graph.get_subraph_depth()

      // mergeStyle(this._subgraph, {
      //   display: 'block',
      // })
      this._subgraph.$element.style.display = 'block'

      // mergeStyle(this._main, {
      //   pointerEvents: 'none',
      //   opacity: '0.25',
      // })
      this._main.$element.style.pointerEvents = 'none'
      this._main.$element.style.opacity = '0.25'

      // this._disable_input()
      this._disable_transcend()

      graph.enter()

      graph.setProp('disabled', false)

      graph.focus()

      this.dispatchEvent('enterunit', {}, false)
    }
  }

  public cacheSubgraph(unit_id: string, graph: _GraphComponent) {
    this._subgraph_cache[unit_id] = graph
    this._subgraph.appendChild(graph)
  }

  private _in_component_control: boolean = false

  public _take_component_control = (): void => {
    if (this._in_component_control) {
      return
    }

    this._in_component_control = true

    if (this._is_fullwindow) {
      this._enter_component_frame()
      this._couple_all_fullwindow_component()
    } else {
      this._enter_all_sub_component_frame()
    }
  }

  public _lose_component_control = (): void => {
    if (!this._in_component_control) {
      return
    }

    this._in_component_control = false

    if (this._is_fullwindow) {
      this._decouple_all_fullwindow_component()
      this._leave_component_frame()
    } else {
      this._leave_all_sub_component_frame()
    }
  }

  public enter = () => {
    // console.log('Graph', 'enter')
    this._take_component_control()
  }

  public leave = (): void => {
    const { parent } = this.$props
    // console.log('Graph', 'leave')

    if (parent) {
      this._plunk_pod(this._pod)

      this._lose_component_control()

      // this._disable_input()
      this._disable_transcend()

      const { units, links, merges, data, inputs, outputs } =
        this._segregate_node_id(this._pressed_node_id_pointer_id)

      this.dispatchEvent(
        'leave',
        { units, links, merges, data, inputs, outputs },
        false
      )
    } else {
      if (this._tree_layout) {
        return
      }

      if (this._can_leave()) {
        if (this._mode === 'multiselect') {
          this._plunk_pod(this._pod)

          this._disable_transcend()
          // this._disable_input()

          if (this._multiselect_area_ing) {
            this._on_multiselect_area_end()
          }

          this._compose()
        }
      }
    }
  }

  private _can_leave = (): boolean => {
    const { parent } = this.$props

    if (this._tree_layout) {
      return false
    }

    // only accept "leaving" if there is a parent or there is "at least one edit"
    return (
      !!parent ||
      this._unit_count > 1 ||
      this._exposed_pin_set_count > 0 ||
      this._link_pin_constant_count > 0 ||
      this._link_pin_memory_count > 0
    )
  }

  private _compose(): void {
    this._lose_component_control()

    this.dispatchEvent('compose', {}, false)
  }

  private _on_subgraph_leave = ({
    units,
    data,
  }: {
    units: string[]
    data: string[]
  }) => {
    // log(data)
    this._leave_subgraph()
  }

  private _on_subgraph_enter_unit = (): void => {
    this._subgraph_depth++
    // console.log('Graph', '_on_subgraph_enter_unit', this._subgraph_depth)
    this._refresh_main_opacity()
  }

  private _on_subgraph_leave_unit = (): void => {
    this._subgraph_depth--
    // console.log('Graph', '_on_subgraph_leave_unit', this._subgraph_depth)
    this._refresh_main_opacity()
  }

  private _refresh_main_opacity = () => {
    let opacity: number = 0
    if (this._subgraph_depth < 4) {
      opacity = Math.pow(0.25, this._subgraph_depth)
    }
    // mergeStyle(this._main, {
    //   opacity: `${opacity}`,
    // })
    this._main.$element.style.opacity = `${opacity}`
  }

  public _leave_subgraph = (): void => {
    // console.log('Graph', '_leave_subgraph')
    if (this._subgraph_graph && this._subgraph_unit_id) {
      // recursively leave unit
      this._subgraph_graph._leave_subgraph()

      const unit_id = this._subgraph_unit_id

      this._subgraph_unlisten()

      this._subgraph_graph.setProp('disabled', true)

      // mergeStyle(this._subgraph, {
      //   display: 'none',
      // })
      this._subgraph.$element.style.display = 'none'

      // mergeStyle(this._main, {
      //   opacity: '1',
      //   pointerEvents: 'all',
      // })
      this._main.$element.style.opacity = '1'
      this._main.$element.style.pointerEvents = 'all'

      // mergeStyle(this._subgraph_graph, {
      //   display: 'none',
      // })
      this._subgraph_graph.$element.style.display = 'none'

      this._subgraph_graph = null
      this._subgraph_unit_id = null
      this._subgraph_depth = 0

      this._refresh_main_opacity()

      for (const component_id in this._selected_component) {
        this._enable_core_resize(component_id)
      }

      if (this._is_unit_component(unit_id)) {
        this._compose_sub_component(unit_id)
        this._enter_sub_component_frame(unit_id)
      }

      if (this._subgraph_return_fullwindow) {
        this._enter_fullwindow(
          false,
          this._subgraph_return_fullwindow_component_ids
        )
        this._subgraph_return_fullwindow = false
        this._subgraph_return_fullwindow_component_ids = []
      }

      if (this._enabled()) {
        this._enable_transcend()

        this.focus()
      }

      this.dispatchEvent('leaveunit', {}, false)
    }
  }

  private _enter_component_frame = (): void => {
    // this._frame.registerRoot(this._component)
    // TODO
    // this._frame.registerSiblingRoot(this._component)
    this._frame.registerParentRoot(this._component)
  }

  private _leave_component_frame = (): void => {
    // this._frame.unregisterRoot(this._component)
    // TODO
    // this._frame.unregisterSiblingRoot(this._component)
    this._frame.unregisterParentRoot(this._component)
  }

  private _enter_sub_component_frame = (unit_id: string): void => {
    // console.log('Graph', '_enter_sub_component_frame', unit_id)
    const sub_component = this._get_sub_component(unit_id)
    const core_component_frame = this._core_component_frame[unit_id]
    core_component_frame.appendChild(sub_component)
  }

  private _leave_sub_component_frame = (unit_id: string): void => {
    // console.log('Graph', '_leave_sub_component_frame', unit_id)
    const sub_component = this._get_sub_component(unit_id)
    const core_component_frame = this._core_component_frame[unit_id]
    core_component_frame.removeChild(sub_component)
  }

  private _refresh_all_layout_layer_opacity = () => {
    const l = this._layout_path.length

    if (l > 0) {
      for (let i = 0; i < l - 1; i++) {
        const layout_layer_id = this._layout_path[i]
        const layout_layer = this._layout_layer[layout_layer_id]
        layout_layer.children.$element.style.opacity = `${0.25 / (l - 1 - i)}`
      }
      this._layout_root.children.$element.style.opacity = `${0.25 / l}`
    }
  }

  private _layout_enter_sub_component = (sub_component_id: string): void => {
    // console.log('Graph', '_layout_enter_sub_component', sub_component_id)
    const prev_layout_layer = this._get_parent_layout_layer(sub_component_id)

    this._layout_path.push(sub_component_id)

    const layout_layer = this._ensure_layout_layer(sub_component_id)

    const children = this._get_sub_component_spec_children(sub_component_id)

    const parent_component = this._get_sub_component(sub_component_id)

    const parent_layout_node = this._layout_node[sub_component_id]

    this._refresh_layout_node_target_position(sub_component_id)

    for (const child_id of children) {
      const child_component = this._get_sub_component(child_id)

      parent_component.removeParentRoot(child_component)

      this._enter_sub_component_frame(child_id)

      this._show_layout_core(child_id)

      this._animate_layout_core(
        child_id,
        parent_layout_node,
        () => {
          return this._layout_target_node[child_id]
        },
        () => {}
      )
    }

    prev_layout_layer.layer.$element.style.overflowY = 'hidden'
    prev_layout_layer.children.$element.style.overflowY = 'hidden'

    this._refresh_all_layout_layer_opacity()

    prev_layout_layer.children.$element.style.pointerEvents = 'none'

    prev_layout_layer.layers.$element.style.pointerEvents = 'inherit'

    layout_layer.layer.$element.style.overflowY = 'auto'
    layout_layer.children.$element.style.overflowY = 'visible'
  }

  private _layout_leave_sub_component = () => {
    // console.log('Graph', '_layout_leave_sub_component')
    const sub_component_id = this._get_current_layout_layer_id()

    const children = this._get_sub_component_spec_children(sub_component_id)

    for (const child_id of children) {
      this._animate_layout_core(
        child_id,
        this._layout_node[child_id],
        () => {
          return this._layout_node[sub_component_id]
        },
        () => {
          this._component_insert_child(sub_component_id, child_id)
        }
      )
    }

    this._layout_path.pop()

    const prev_unit_id = this._get_current_layout_layer_id()

    const prev_layout_layer = prev_unit_id
      ? this._layout_layer[prev_unit_id]
      : this._layout_root

    const layout_layer = this._layout_layer[sub_component_id]

    layout_layer.layer.$element.style.overflowY = 'hidden'
    layout_layer.children.$element.style.overflowY = 'hidden'

    prev_layout_layer.layer.$element.style.overflowY = 'auto'
    prev_layout_layer.children.$element.style.overflowY = 'visible'

    this._refresh_all_layout_layer_opacity()

    prev_layout_layer.children.$element.style.opacity = '1'

    prev_layout_layer.children.$element.style.pointerEvents = 'inherit'

    prev_layout_layer.layers.$element.style.pointerEvents = 'none'
  }

  private _ensure_layout_layer = (
    sub_component_id: string
  ): { layer: Div; height: Div; children: Div; layers: Div } => {
    let layout_layer = this._layout_layer[sub_component_id]

    if (!layout_layer) {
      layout_layer = this._create_layout_layer({
        className: 'graph-layout-layer',
        style: {},
      })

      const parent_layer = this._get_parent_layout_layer(sub_component_id)

      parent_layer.layers.appendChild(layout_layer.layer)

      this._layout_layer[sub_component_id] = layout_layer
    }

    return layout_layer
  }

  private _is_component_parent = (unit_id: string): boolean => {
    const children_count = this._get_component_children_count(unit_id)
    const is_parent = children_count > 0
    return is_parent
  }

  private _get_layout_layer_selected_count = (): number => {
    let layout_layer_selected_count = 0

    const current_layout_layer = this._get_current_layout_layer_id()

    if (current_layout_layer) {
      for (const sub_component_id in this._selected_component) {
        const sub_component_parent =
          this._get_sub_component_spec_parent_id(sub_component_id)
        if (sub_component_parent === current_layout_layer) {
          layout_layer_selected_count++
        }
      }
    } else {
      for (const sub_component_id in this._selected_component) {
        const sub_component_parent =
          this._get_sub_component_spec_parent_id(sub_component_id)
        if (!sub_component_parent) {
          layout_layer_selected_count++
        }
      }
    }

    return layout_layer_selected_count
  }

  private _on_node_long_click = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_long_click')
    if (this._cancel_node_long_click) {
      this._cancel_node_long_click = false
      return
    }

    if (this._tree_layout) {
      // if (this._is_component_parent()) {
      this._layout_enter_sub_component(node_id)
      // }
    } else {
      if (this._is_unit_node_id(node_id)) {
        if (!this._resize_node_id_pointer_id[node_id]) {
          if (this._mode === 'none') {
            if (!this._is_unit_base(node_id)) {
              this._enter_subgraph(node_id)
            }
          } else if (this._mode === 'multiselect') {
            // TODO
          } else if (this._mode === 'info') {
            if (this._tree_layout) {
              // TODO sub-component
            } else {
              if (!this._is_unit_base(node_id)) {
                this._enter_subgraph(node_id)
              }
            }
          } else {
            // TODO mode action on soul
          }
        }
      } else if (this._is_link_pin_node_id(node_id)) {
        if (this._mode === 'change') {
          this._toggle_link_pin_memory(node_id)
        }
      }
    }
  }

  private _append_sub_component_children = (
    parent_id: string,
    children: string[]
  ): void => {
    const { animate } = this.$props

    // console.log('Graph', '_append_sub_component_children', parent_id, children)
    for (const child_id of children) {
      this._append_sub_component_child(parent_id, child_id)
    }

    const parent_parent_id = this._sub_component_parent[parent_id] || null

    this._move_all_layout_node_target_position(parent_parent_id)
  }

  private _append_sub_component_child = (
    parent_id: string,
    child_id: string
  ): void => {
    // console.log('Graph', '_append_sub_component_child', parent_id, child_id)
    const { animate } = this.$props

    const is_child_fullwindow = this._is_sub_component_fullwindow(child_id)

    if (is_child_fullwindow) {
      this._decouple_sub_component(child_id)
    }

    this._mem_move_sub_component_child(parent_id, child_id)

    this._layout_append_sub_component_child(parent_id, child_id)

    this._spec_append_sub_component_child(parent_id, child_id)

    if (is_child_fullwindow) {
      this._couple_sub_component(child_id)
    }

    this._refresh_current_layout_node_target_position()

    if (animate) {
      const layout_node = this._layout_node[child_id]

      this._animate_layout_core(
        child_id,
        layout_node,
        () => {
          return this._layout_node[parent_id]
        },
        () => {
          this._component_insert_child(parent_id, child_id)
        }
      )
    } else {
      this._component_insert_child(parent_id, child_id)
    }
  }

  private _set_all_current_layout_layer_core_position = (): void => {
    const current_layer = this._get_current_layout_layer_id()

    this._set_all_layout_layer_core_position(current_layer)
  }

  private _set_all_layout_layer_core_position = (
    layer: string | null
  ): void => {
    // console.log('Graph', '_set_all_layout_layer_core_position', layer)
    const children = this._get_layout_layer_children(layer)

    for (const child_id of children) {
      const { x, y } = this._layout_target_node[child_id]

      this._set_layout_core_position(child_id, x, y)
    }
  }

  private _mem_move_sub_component_child = (
    parent_id: string,
    child_id: string
  ): void => {
    // console.log('Graph', '_mem_move_sub_component_child', parent_id, child_id)
    const { component } = this.$props

    const child_component = this._get_sub_component(child_id)!

    const current_parent_id = this._sub_component_parent[child_id]
    if (current_parent_id) {
      const current_parent_component =
        this._get_sub_component(current_parent_id)
      current_parent_component.pullParentRoot(child_component)
    } else {
      component.pullRoot(child_component)
    }

    this._mem_append_sub_component_child(parent_id, child_id)
  }

  private _mem_append_sub_component_child = (
    parent_id: string,
    child_id: string
  ): void => {
    // console.log('Graph', '_mem_append_sub_component_child', parent_id, child_id)
    const parent_component = this._get_sub_component(parent_id)!
    const child_component = this._get_sub_component(child_id)!

    const slot = this._get_sub_component_slot_name(child_id)
    parent_component.pushParentRoot(child_component, slot)

    this._refresh_component_children_counter_up(
      parent_id,
      1 + (this._layout_component_count[child_id] || 0)
    )

    this._sub_component_parent[child_id] = parent_id
  }

  private _layout_append_sub_component_child = (
    parent_id: string,
    child_id: string
  ): void => {
    // console.log('Graph', '_layout_append_component_child', parent_id, child_id)
    const parent_component = this._get_sub_component(parent_id)
    const child_component = this._get_sub_component(child_id)

    const layout_core = this._layout_core[child_id]

    const parent_layout_layer = this._get_parent_layout_layer(child_id)

    const next_parent_layout_layer = this._ensure_layout_layer(parent_id)

    parent_layout_layer.children.removeChild(layout_core)

    next_parent_layout_layer.children.appendChild(layout_core)

    const layout_layer = this._get_layout_layer(child_id)

    if (layout_layer) {
      parent_layout_layer.layers.removeChild(layout_layer.layer)

      next_parent_layout_layer.layers.appendChild(layout_layer.layer)
    }
  }

  private _get_parent_layout_layer = (
    sub_component_id: string
  ): LayoutLayer => {
    const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)
    if (parent_id) {
      return this._layout_layer[parent_id]
    } else {
      return this._layout_root
    }
  }

  private _collapse_sub_component = (sub_component_id: string): void => {
    const sub_component = this._get_sub_component(sub_component_id)
    sub_component.collapse()
  }

  private _uncollapse_sub_component = (sub_component_id: string): void => {
    const sub_component = this._get_sub_component(sub_component_id)
    sub_component.uncollapse()
  }

  private _append_sub_component_root = (unit_id: string): void => {
    // console.log('Graph', '_append_sub_component_root', unit_id)
    const sub_component = this._get_sub_component(unit_id)
    this._component.appendRoot(sub_component)
  }

  private _insert_sub_component_root_at = (
    unit_id: string,
    at: number
  ): void => {
    // console.log('Graph', '_insert_sub_component_root_at', unit_id)
    const sub_component = this._get_sub_component(unit_id)
    this._component.insertRootAt(sub_component, at)
  }

  private _append_sub_component_parent_root = (
    parent_id: string,
    child_id: string
  ): void => {
    const parent_component = this._get_sub_component(parent_id)
    const child_component = this._get_sub_component(child_id)
    const slot = this._get_sub_component_slot_name(child_id)
    parent_component.appendParentRoot(child_component, slot)
  }

  private _insert_sub_component_parent_root_at = (
    parent_id: string,
    child_id: string,
    at: number
  ): void => {
    // console.log('Graph', '_insert_sub_component_parent_root_at', unit_id)
    const parent_component = this._get_sub_component(parent_id)
    const child_component = this._get_sub_component(child_id)
    const slot = this._get_sub_component_slot_name(child_id)
    parent_component.insertParentRootAt(child_component, at, slot)
  }

  private _remove_sub_component_parent_root = (
    sub_component_id: string,
    child_id: string
  ): void => {
    const sub_component = this._get_sub_component(sub_component_id)
    const sub_component_child = this._get_sub_component(child_id)
    sub_component.removeParentRoot(sub_component_child)
  }

  private _remove_sub_component_root = (sub_component_id: string): void => {
    // console.log('Graph', '_remove_sub_component_root', sub_component_id)
    const sub_component = this._get_sub_component(sub_component_id)
    this._component.removeRoot(sub_component)
  }

  private _layout_collapse_sub_component = (
    sub_component_id: string,
    parent: string | null
  ): void => {
    // console.log('Graph', '_layout_collapse_sub_component')
    this._refresh_component_children_counter(sub_component_id)

    const sub_component = this._get_sub_component(sub_component_id)!

    if (!this._layout_path.includes(sub_component_id)) {
      const sub_component_children =
        this._get_sub_component_spec_children(sub_component_id)

      for (const child_id of sub_component_children) {
        if (!this._is_fullwindow) {
          this._leave_sub_component_frame(child_id)
        }
        this._layout_collapse_sub_component(child_id, sub_component_id)
      }

      if (!this._is_fullwindow) {
        sub_component.collapse()
      }
    }

    const layout_core = this._layout_core[sub_component_id]

    this._listen_layout_core(sub_component_id, layout_core)

    const { width, height } =
      this._get_unit_component_layout_size(sub_component_id)

    this._resize_layout_core(sub_component_id, width, height)
  }

  private _layout_uncollapse_sub_component = (
    sub_component_id: string
  ): void => {
    // console.log('Graph', '_layout_uncollapse_sub_component', sub_component_id)
    const sub_component = this._get_sub_component(sub_component_id)

    const is_dismembered = this._layout_path.includes(sub_component_id)

    const sub_component_children =
      this._get_sub_component_spec_children(sub_component_id)

    if (!this._is_fullwindow) {
      for (const sub_child_id of sub_component_children) {
        if (!is_dismembered) {
          const sub_child_component = this._get_sub_component(sub_child_id)

          if (sub_component.$mountParentRoot.includes(sub_child_component)) {
            sub_component.removeParentRoot(sub_child_component)

            this._enter_sub_component_frame(sub_child_id)
          }
        }

        this._layout_uncollapse_sub_component(sub_child_id)
      }
    }

    // this._refresh_component_children_counter(sub_component_id)

    // const sub_component = this._get_sub_component(sub_component_id)

    // if (!this._layout_path.includes(sub_component_id)) {
    //   if (!this._is_fullwindow) {
    //     sub_component.uncollapse()
    //   }

    //   const sub_component_children =
    //     this._get_sub_component_spec_children(sub_component_id)
    //   for (const child_id of sub_component_children) {
    //     if (!this._is_fullwindow) {
    //       this._enter_sub_component_frame(child_id)
    //     }
    //     this._layout_uncollapse_sub_component(child_id)
    //   }
    // }

    // this._unlisten_component(sub_component_id)

    // const { width, height } =
    //   this._get_unit_component_spec_size(sub_component_id)
    // this._resize_core_area(sub_component_id, width, height)
    // this._resize_core_selection(sub_component_id, width, height)
  }

  private _move_core_content_layout_to_graph = (
    sub_component_id: string
  ): void => {
    const core = this._core[sub_component_id]
    const layout_core = this._layout_core[sub_component_id]
    const core_content = this._core_content[sub_component_id]

    layout_core.removeChild(core_content)

    core.appendChild(core_content)

    this._layout_core_content_placed[sub_component_id] = false
  }

  private _move_core_content_graph_to_layout = (
    sub_component_id: string
  ): void => {
    const core = this._core[sub_component_id]
    const layout_core = this._layout_core[sub_component_id]
    const core_content = this._core_content[sub_component_id]

    core.removeChild(core_content)

    layout_core.appendChild(core_content)

    this._layout_core_content_placed[sub_component_id] = true
  }

  private _get_component_children_count = (unit_id: string): number => {
    // const children = this._get_component_children(unit_id)
    // const children_count = children.length
    const children_count = this._layout_component_count[unit_id] || 0
    return children_count
  }

  private _refresh_component_children_counter = (unit_id: string): void => {
    // console.log('Graph', '_refresh_component_children_counter', unit_id)
    const children_counter = this._layout_core_children_counter[unit_id]

    const children_count = this._get_component_children_count(unit_id)

    children_counter.setProp('innerText', `${children_count}`)

    if (this._tree_layout) {
      if (children_count > 0) {
        children_counter.$element.style.opacity = '1'
      } else {
        children_counter.$element.style.opacity = '0'
      }
    } else {
      children_counter.$element.style.opacity = '0'
    }
  }

  private _refresh_component_children_counter_up = (
    unit_id: string,
    offset: number
  ): void => {
    // console.log('Graph', '_refresh_component_children_counter_up', unit_id, offset)
    let p = unit_id
    while (p) {
      this._layout_component_count[p] =
        (this._layout_component_count[p] ?? 0) + offset

      this._refresh_component_children_counter(p)

      p = this._sub_component_parent[p]
    }
  }

  private _spec_append_sub_component_child = (
    parent_id: string,
    child_id: string
  ): void => {
    // console.log('Graph', '_spec_append_component_child', parent_id, child_id)
    const prev_parent_id = this._get_sub_component_spec_parent_id(child_id)

    if (prev_parent_id) {
      this._spec.component = componentReducer.removeSubComponentChild(
        { id: prev_parent_id, childId: child_id },
        this._spec.component || {}
      )
    } else {
      this._spec.component = componentReducer.removeChild(
        { id: child_id },
        this._spec.component || {}
      )
    }

    const children = this._get_sub_component_spec_children(parent_id)
    this._spec.component = componentReducer.setSubComponentChildren(
      { id: parent_id, children: [...children, child_id] },
      this._spec.component || {}
    )

    this._refresh_component_children_counter(parent_id)

    this._refresh_tree_sub_component_index()
  }

  private _get_component_spec_children = (): string[] => {
    this._spec.component = this._spec.component || { children: [] }
    const children = this._spec.component.children || []
    return children
  }

  private _get_sub_component_spec_layer = (unit_id: string): string[] => {
    const parent_id = this._get_sub_component_spec_parent_id(unit_id)
    if (parent_id) {
      return this._get_sub_component_spec_children(parent_id)
    } else {
      return this._get_component_spec_children()
    }
  }

  private _get_sub_component_spec_parent_id = (
    unit_id: string
  ): string | null => {
    // TODO cache parent
    const component_spec = this._get_component_spec()
    const { subComponents } = component_spec
    for (const sub_component_id in subComponents) {
      const sub_component = subComponents[sub_component_id]
      const { children = [] } = sub_component
      for (const child_id of children) {
        if (child_id === unit_id) {
          return sub_component_id
        }
      }
    }
    return null
  }

  private _get_sub_component_layout_parent = (
    sub_component_id: string
  ): string | null => {
    const parent_id = this._sub_component_parent[sub_component_id] || null

    return parent_id
  }

  private _remove_sub_component_children = (
    parent_id: string,
    next_parent_id: string | null
  ): void => {
    const { animate } = this.$props

    const children = this._get_sub_component_spec_children(parent_id)

    for (const child_id of children) {
      this._remove_sub_component_child(parent_id, child_id, next_parent_id)
    }

    this._refresh_current_layout_node_target_position()

    if (animate) {
      this._animate_all_layout_layer_node(next_parent_id)
    } else {
      this._set_all_layout_layer_core_position(next_parent_id)
    }
  }

  private _remove_sub_component_child = (
    parent_id: string,
    child_id: string,
    next_parent_id: string | null
  ): void => {
    const { animate } = this.$props

    const is_child_fullwindow = this._is_sub_component_fullwindow(child_id)

    if (is_child_fullwindow) {
      this._decouple_sub_component(child_id)
    }

    this._layout_remove_sub_component_child(parent_id, child_id, next_parent_id)

    this._spec_remove_sub_component_child(parent_id, child_id, next_parent_id)

    this._refresh_current_layout_node_target_position()

    if (animate) {
      this._animate_layout_core(
        child_id,
        this._layout_node[parent_id],
        () => {
          return this._layout_target_node[child_id]
        },
        () => {}
      )
    } else {
      const { x, y } = this._layout_target_node[child_id]

      this._set_layout_core_position(child_id, x, y)
    }

    if (is_child_fullwindow) {
      this._couple_sub_component(child_id)
    }
  }

  private _layout_remove_sub_component_children = (
    parent_id: string,
    next_parent_id: string | null
  ): void => {
    const children = this._get_sub_component_spec_children(parent_id)
    for (const child_id of children) {
      this._layout_remove_sub_component_child(
        parent_id,
        child_id,
        next_parent_id
      )
    }
  }

  private _layout_remove_sub_component_child = (
    parent_id: string,
    child_id: string,
    next_parent_id: string | null
  ): void => {
    // console.log(
    //   'Graph',
    //   '_layout_remove_sub_component_child',
    //   parent_id,
    //   child_id,
    //   next_parent_id
    // )
    const { component } = this.$props

    const parent_component = this._get_sub_component(parent_id)!
    const child_component = this._get_sub_component(child_id)!

    if (this._tree_layout) {
      if (!this._is_fullwindow) {
        parent_component.removeParentRoot(child_component)

        this._enter_sub_component_frame(child_id)
      }

      parent_component.pullParentRoot(child_component)

      if (next_parent_id) {
        const next_parent_component = this._get_sub_component(next_parent_id)
        // TODO
        const slot_name = 'default'
        next_parent_component.pushParentRoot(child_component, slot_name)
      } else {
        component.pushRoot(child_component)
      }

      this._show_layout_core(child_id)
    }

    this._refresh_component_children_counter_up(
      parent_id,
      -(1 + (this._layout_component_count[child_id] || 0))
    )

    if (next_parent_id) {
      this._sub_component_parent[child_id] = next_parent_id
    } else {
      delete this._sub_component_parent[child_id]
    }

    this._layout_drag_init_position[child_id] = this._layout_node[child_id]

    const parent_parent_id = this._get_sub_component_spec_parent_id(parent_id)

    const layout_core = this._layout_core[child_id]

    const parent_layout_layer = this._layout_layer[parent_id]

    const next_parent_layout_layer = parent_parent_id
      ? this._layout_layer[parent_parent_id]
      : this._layout_root

    parent_layout_layer.children.removeChild(layout_core)

    next_parent_layout_layer.children.appendChild(layout_core)

    const layout_layer = this._get_layout_layer(child_id)

    if (layout_layer) {
      parent_layout_layer.layers.removeChild(layout_layer.layer)

      next_parent_layout_layer.layers.appendChild(layout_layer.layer)
    }
  }

  private _show_layout_core = (unit_id: string): void => {
    // console.log('Graph', '_show_layout_core', unit_id)
    const layout_core = this._layout_core[unit_id]
    // mergeStyle(layout_core, { display: 'block' })
    // layout_core.$element.style.display = 'block'
    layout_core.$element.style.pointerEvents = 'inherit'
    layout_core.$element.style.opacity = '1'
  }

  private _hide_layout_core = (unit_id: string): void => {
    // console.log('Graph', '_hide_layout_core', unit_id)
    const layout_core = this._layout_core[unit_id]
    // mergeStyle(layout_core, { display: 'none' })
    // layout_core.$element.style.display = 'none'
    layout_core.$element.style.pointerEvents = 'none'
    layout_core.$element.style.opacity = '0'
  }

  private _spec_remove_component_children = (
    parent_id: string,
    next_parent_id: string | null
  ): void => {
    const children = this._get_sub_component_spec_children(parent_id)

    for (const child_id of children) {
      this._spec_remove_sub_component_child(parent_id, child_id, next_parent_id)
    }

    this._refresh_component_children_counter(parent_id)
  }

  private _spec_remove_sub_component_child = (
    parent_id: string,
    child_id: string,
    next_parent_id: string
  ): void => {
    this._spec.component = componentReducer.removeSubComponentChild(
      { id: parent_id, childId: child_id },
      this._spec.component || {}
    )

    if (next_parent_id) {
      this._spec.component = componentReducer.appendSubComponentChild(
        { id: next_parent_id, childId: child_id },
        this._spec.component || {}
      )

      this._sub_component_parent[child_id] = next_parent_id
    } else {
      this._spec.component = componentReducer.appendChild(
        { id: child_id },
        this._spec.component || {}
      )

      delete this._sub_component_parent[child_id]
    }
  }

  private _is_node_long_press_able = (node_id: string): boolean => {
    if (this._is_unit_node_id(node_id)) {
      if (!this._is_unit_base(node_id)) {
        return true
      }
    }

    return false
  }

  private _on_node_long_press = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    console.log('Graph', '_on_node_long_press')
    const { pointerId, clientX, clientY } = event

    this._set_long_press_pointer(pointerId, clientX, clientY)

    if (this._resize_node_id_pointer_id[node_id]) {
      return
    }

    if (this._is_node_long_press_able(node_id)) {
      this._animate_long_press(event, 'out')
    }

    if (this._tree_layout) {
      if (this._is_unit_node_id(node_id)) {
        if (this._is_node_selected(node_id)) {
          this._cancel_node_long_click = true
          const next_parent_id = this._get_current_layout_layer_id()
          this._remove_sub_component_children(node_id, next_parent_id)
        } else {
          const layout_layer_selected_count =
            this._get_layout_layer_selected_count()

          if (layout_layer_selected_count > 0) {
            this._cancel_node_long_click = true
            if (this._selected_component_count > 0) {
              const children_id: string[] = []

              for (const selected_node_id in this._selected_component) {
                const current_parent = this._get_current_layout_layer_id()

                if (
                  (this._sub_component_parent[selected_node_id] || null) ===
                  current_parent
                ) {
                  children_id.push(selected_node_id)
                }
              }

              this._append_sub_component_children(node_id, children_id)
            }
          }
        }
      }
    } else {
      if (this._mode === 'multiselect') {
        if (this._is_unit_node_id(node_id)) {
          if (this._is_node_selected(node_id)) {
            if (this._is_unit_base(node_id)) {
              //
            } else {
              this._cancel_long_click = true
              this._explode_unit(node_id)
            }
          } else {
            if (this._is_unit_base(node_id)) {
              //
            } else {
              const { pointerId } = event

              this._set_node_fixed(node_id, true)

              this._set_node_layer(node_id, LAYER_COLLAPSE)

              this._start_long_press_collapse(pointerId, node_id, this._long_press_screen_position)
            }
          }
        }
      }
    }
  }

  private _explode_unit = (unit_id: string): void => {
    console.log('Graph', '_explode_unit', unit_id)
    const map_unit_id = {}
    const map_merge_id = {}

    const _spec = this._get_unit_spec(unit_id) as GraphSpec

    const { units: _units = {}, merges: _merges = {} } = _spec

    const set_unit_id = new Set<string>()
    const set_merge_id = new Set<string>()

    for (const _unitId in _units) {
      const _unit = _units[_unitId]
      const { path: _unit_spec_id } = _unit
      // if (hasUnitId(this._spec, _unitId)) {
      const _next_unit_id = this._new_unit_id(_unit_spec_id, set_unit_id)
      set_unit_id.add(_next_unit_id)
      map_unit_id[_unitId] = _next_unit_id
      // }
    }

    for (const _mergeId in _merges) {
      // if (hasMergeId(this._spec, _mergeId)) {
      const _next_merge_id = this._new_merge_id(set_merge_id)
      set_merge_id.add(_next_merge_id)
      map_merge_id[_mergeId] = _next_merge_id
      // }
    }

    this._state_explode_unit(unit_id, map_unit_id, map_merge_id)
    this._pod_explode_unit(unit_id, map_unit_id, map_merge_id)
  }

  private _state_explode_unit = (
    unit_id: string,
    map_unit_id: Dict<string>,
    map_merge_id: Dict<string>
  ): void => {
    console.log('Graph', '_state_explode_unit', unit_id)
    const spec = this._get_unit_spec(unit_id) as GraphSpec

    const {
      units = {},
      merges = {},
      component = { subComponents: {}, children: [] },
    } = spec

    const position = this._get_node_position(unit_id)

    this._state_remove_unit(unit_id)

    const graph = { units, merges, component }

    this._state_paste_spec(
      graph,
      position,
      map_unit_id,
      map_merge_id,
      {},
      {},
      {}
    )
  }

  private _pod_explode_unit = (
    unit_id: string,
    map_unit_id: Dict<string>,
    map_merge_id: Dict<string>
  ): void => {
    console.log('Graph', '_pod_explode_unit', unit_id)
    const graph_pod = this._pod.$refUnit({
      unitId: unit_id,
      _: ['$U', '$C', '$G'],
    }) as $Graph

    graph_pod.$getGraphPinData({}, (state) => {
      const _state = mapObjKey(state, (value, key) => {
        return map_unit_id[key]
      })
      this._process_graph_pin_data(_state)
    })

    graph_pod.$getGraphErr({}, (state: Dict<string | null>) => {
      const _state = mapObjKey(state, (value, key) => {
        return map_unit_id[key]
      })
      this._process_graph_err(_state)
    })

    graph_pod.$getGraphState({}, (state: Dict<any>) => {
      const _state = mapObjKey(state, (value, key) => {
        return map_unit_id[key]
      })
      this._process_graph_state(_state)
    })

    graph_pod.$getGraphChildren({}, (state: Dict<any>) => {
      const _state = mapObjKey(state, (value, key) => {
        return map_unit_id[key]
      })
      this._process_graph_children(_state)
    })

    graph_pod.$getGraphMergeInputData({}, (state: Dict<any>) => {
      const _state = mapObjKey(state, (value, key) => {
        return map_merge_id[key]
      })
      this._process_graph_merge_data(_state)
    })

    this._pod.$explodeUnit({
      unitId: unit_id,
      mapUnitId: map_unit_id,
      mapMergeId: map_merge_id,
    })

    for (const _unit_id in map_unit_id) {
      const _next_unit_id = map_unit_id[_unit_id]
      if (this._is_unit_component(_next_unit_id)) {
        this._pod_add_unit_component(_next_unit_id)
      }
    }
  }

  private _on_node_click_hold = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_click_hold')
    if (this._tree_layout) {
      return
    }

    if (this._resize_node_id_pointer_id[node_id]) {
      return
    }

    this._animate_long_press(event, 'out')

    if (this._is_unit_node_id(node_id)) {
      // AD HOC
      // #2064
      const node_comp = this._get_node_comp(node_id)
      node_comp.$element.dispatchEvent(new PointerEvent('pointerleave', event))

      this._start_gesture(event)
    } else if (this._is_pin_node_id(node_id)) {
      // AD HOC
      // #2064
      const node_comp = this._get_node_comp(node_id)
      node_comp.$element.dispatchEvent(new PointerEvent('pointerleave', event))

      this._start_gesture(event)
    }
  }

  private _merge_pin_pin = (
    pin_0_node_id: string,
    pin_1_node_id: string
  ): string => {
    // console.log('Graph', '_merge_pin_pin', pin_0_node_id, pin_1_node_id)
    if (
      this._is_link_pin_node_id(pin_0_node_id) &&
      this._is_link_pin_node_id(pin_1_node_id)
    ) {
      return this._merge_link_pin_link_pin(pin_0_node_id, pin_1_node_id)
    } else if (
      this._is_link_pin_node_id(pin_0_node_id) &&
      this._is_merge_node_id(pin_1_node_id)
    ) {
      return this._merge_link_pin_merge_pin(pin_0_node_id, pin_1_node_id)
    } else if (
      this._is_merge_node_id(pin_0_node_id) &&
      this._is_link_pin_node_id(pin_1_node_id)
    ) {
      return this._merge_link_pin_merge_pin(pin_1_node_id, pin_0_node_id)
    } else {
      return this._merge_merge_pin_merge_pin(pin_1_node_id, pin_0_node_id)
    }
  }

  private _merge_pin_unit = (pin_node_id: string, unit_id: string) => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      this._merge_link_pin_unit(pin_node_id, unit_id)
    } else {
      this._merge_merge_pin_unit(pin_node_id, unit_id)
    }
  }

  private _merge_link_pin_unit = (
    pin_node_id: string,
    unit_id: string
  ): void => {
    const ref = this._get_link_pin_ref(pin_node_id)!

    if (ref) {
      const { type } = segmentLinkPinNodeId(pin_node_id)
      const { pinId, subPinId } = this._get_pin_exposed_id(type, pin_node_id)
      if (pinId && subPinId) {
        this._unplug_exposed_pin(type, pinId, subPinId)
      }
    }

    const ref_node_id = getSelfPinNodeId(unit_id)
    const ref_merge_pin_node_id = this._pin_to_merge[ref_node_id]
    if (ref_merge_pin_node_id) {
      this._merge_link_pin_merge_pin(pin_node_id, ref_merge_pin_node_id)
    } else {
      this._merge_link_pin_link_pin(pin_node_id, ref_node_id)
    }
  }

  private _sim_merge_link_pin_unit = (
    pin_node_id: string,
    unit_id: string
  ): void => {
    const ref_node_id = getSelfPinNodeId(unit_id)
    const ref_merge_pin_node_id = this._pin_to_merge[ref_node_id]
    if (ref_merge_pin_node_id) {
      this._sim_merge_link_pin_merge_pin(pin_node_id, ref_merge_pin_node_id)
    } else {
      this._sim_merge_link_pin_link_pin(pin_node_id, ref_node_id)
    }
  }

  private _merge_merge_pin_unit = (
    merge_node_id: string,
    unit_id: string
  ): void => {
    const self_pin_node_id = getSelfPinNodeId(unit_id)
    this._merge_link_pin_merge_pin(self_pin_node_id, merge_node_id)
  }

  public merge_merge_pin_merge_pin = (
    merge_0_node_id: string,
    merge_1_node_id: string
  ) => {
    const { id: merge_0_id } = segmentMergeNodeId(merge_0_node_id)
    const { id: merge_1_id } = segmentMergeNodeId(merge_1_node_id)
    this._merge_merge_pin_merge_pin(merge_0_node_id, merge_1_node_id)
    this._dispatchAction(mergeMerges(merge_0_id, merge_1_id))
  }

  private _merge_merge_pin_merge_pin = (
    merge_0_node_id: string,
    merge_1_node_id: string
  ): string => {
    const { id: merge_0_id } = segmentMergeNodeId(merge_0_node_id)
    const { id: merge_1_id } = segmentMergeNodeId(merge_1_node_id)

    this._sim_merge_merge_pin_merge_pin(merge_0_node_id, merge_1_node_id)
    this._spec_merge_merge_pin_merge_pin(merge_0_id, merge_1_id)
    this._pod_merge_merge_pin_merge_pin(merge_0_id, merge_1_id)

    return merge_0_node_id
  }

  private _pod_merge_merge_pin_merge_pin = (
    merge_0_id: string,
    merge_1_id: string
  ) => {
    this._pod.$mergeMerges({
      mergeIds: [merge_0_id, merge_1_id],
    })
  }

  private _spec_merge_merge_pin_merge_pin = (
    merge_0_id: string,
    merge_1_id: string
  ) => {
    this._spec = specReducer.mergeMerges(
      { a: merge_0_id, b: merge_1_id },
      this._spec
    )
  }

  private _sim_merge_merge_pin_merge_pin = (
    merge_0_node_id: string,
    merge_1_node_id: string
  ) => {
    const merge_1_to_pin_node_id = {
      ...this._merge_to_pin[merge_1_node_id],
    }

    this._sim_remove_merge(merge_1_node_id)

    for (let pin_node_id in merge_1_to_pin_node_id) {
      this._sim_merge_link_pin_merge_pin(pin_node_id, merge_0_node_id)
    }
  }

  private _merge_link_pin_link_pin = (
    pin_0_node_id: string,
    pin_1_node_id: string
  ): string => {
    // console.log(
    //   'Graph',
    //   '_merge_link_pin_link_pin',
    //   pin_0_node_id,
    //   pin_1_node_id
    // )
    const {
      unitId: unitId0,
      type: type0,
      pinId: pinId0,
    } = segmentLinkPinNodeId(pin_0_node_id)
    const {
      unitId: unitId1,
      type: type1,
      pinId: pinId1,
    } = segmentLinkPinNodeId(pin_1_node_id)
    const merge = {
      [unitId0]: {
        [type0]: {
          [pinId0]: true,
        },
      },
      [unitId1]: {
        [type1]: {
          [pinId1]: true,
        },
      },
    }
    const merge_id = this._new_merge_id()
    this._pod_add_merge(merge_id, merge)
    this._spec_add_merge(merge_id, merge)
    const merge_node_id = this.__sim_merge_link_pin_link_pin(
      merge_id,
      pin_0_node_id,
      pin_1_node_id
    )
    return merge_node_id
  }

  private _sim_merge_link_pin_link_pin = (
    pin_0_node_id: string,
    pin_1_node_id: string
  ): string => {
    const merge_id = this._new_merge_id()

    return this.__sim_merge_link_pin_link_pin(
      merge_id,
      pin_0_node_id,
      pin_1_node_id
    )
  }

  private __sim_merge_link_pin_link_pin = (
    merge_id: string,
    pin_0_node_id: string,
    pin_1_node_id: string
  ): string => {
    const {
      unitId: pin_0_unit_id,
      type: pin_0_type,
      pinId: pin_0_pin_id,
    } = segmentLinkPinNodeId(pin_0_node_id)

    const {
      unitId: pin_1_unit_id,
      type: pin_1_type,
      pinId: pin_1_pin_id,
    } = segmentLinkPinNodeId(pin_1_node_id)

    const merge_node_id = getMergeNodeId(merge_id)

    const pin_0_link_input = pin_0_type === 'input'
    const pin_1_link_input = pin_1_type === 'input'

    const pin_0_link_ref = this._is_link_pin_ref(pin_0_node_id)
    const pin_1_link_ref = this._is_link_pin_ref(pin_1_node_id)

    const pin_0_output_ref = !pin_0_link_input && pin_0_link_ref
    const pin_1_output_ref = !pin_1_link_input && pin_1_link_ref

    let merge_unit_id: string | undefined
    if (pin_0_output_ref) {
      merge_unit_id = pin_0_unit_id
    } else if (pin_1_output_ref) {
      merge_unit_id = pin_1_unit_id
    }

    const merge = {
      [pin_0_unit_id]: {
        [pin_0_type]: {
          [pin_0_pin_id]: true,
        },
      },
      [pin_1_unit_id]: {
        [pin_1_type]: {
          [pin_1_pin_id]: true,
        },
      },
    }

    let position: Position
    if (!merge_unit_id) {
      const { x: x0, y: y0 } = this._node[pin_0_node_id]
      const { x: x1, y: y1 } = this._node[pin_1_node_id]
      const x = (x0 + x1) / 2
      const y = (y0 + y1) / 2
      position = { x, y }
    } else {
      const { x, y } = this._node[merge_unit_id]
      position = { x, y }
    }

    this._sim_add_merge(merge_id, merge, position)

    this._sim_merge_link_pin_merge_pin(pin_0_node_id, merge_node_id)
    this._sim_merge_link_pin_merge_pin(pin_1_node_id, merge_node_id)

    return merge_node_id
  }

  private _merge_link_pin_merge_pin = (
    pin_node_id: string,
    merge_node_id: string
  ): string => {
    // console.log(
    //   'Graph',
    //   '_merge_link_pin_merge_pin',
    //   pin_node_id,
    //   merge_node_id
    // )
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    const {
      unitId: unit_id,
      type,
      pinId: pin_id,
    } = segmentLinkPinNodeId(pin_node_id)
    this.__spec_merge_link_pin_merge_pin(merge_id, unit_id, type, pin_id)
    this._sim_merge_link_pin_merge_pin(pin_node_id, merge_node_id)
    this.__pod_merge_link_pin_merge_pin(merge_id, unit_id, type, pin_id)

    return merge_node_id
  }

  private __pod_merge_link_pin_merge_pin(
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ) {
    this._pod.$addPinToMerge({
      mergeId,
      unitId,
      type,
      pinId,
    })
  }

  private __spec_merge_link_pin_merge_pin(
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ) {
    // console.log('Graph', '_spec_merge_link_pin_merge_pin')
    this._spec = specReducer.addPinToMerge(
      { id: mergeId, unitId, type, pinId },
      this._spec
    )
  }

  private _sim_merge_link_pin_merge_pin(
    pin_node_id: string,
    merge_node_id: string
  ) {
    // console.log('Graph', '_sim_merge_link_pin_merge_pin', pin_node_id, merge_node_id)
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)

    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    const is_input = type === 'input'
    const is_output = !is_input
    const is_pin_link_ref = this._is_link_pin_ref(pin_node_id)
    const is_pin_output_ref = is_output && is_pin_link_ref
    const is_pin_output_self = pinId === SELF

    if (is_pin_output_self) {
      this._merge_to_ref_unit[merge_node_id] = unitId
      this._ref_unit_to_merge[unitId] = merge_node_id
      this._sim_change_all_merge_input_to(merge_node_id, unitId)
      if (this._has_node(merge_node_id)) {
        this._sim_remove_merge_node(merge_node_id)
      }
    } else if (is_pin_output_ref) {
      this._merge_to_ref_output[merge_node_id] = pin_node_id
      this._ref_output_to_merge[pin_node_id] = merge_node_id
      this._sim_change_all_merge_input_to(merge_node_id, pin_node_id)
      if (this._has_node(merge_node_id)) {
        this._sim_remove_merge_node(merge_node_id)
      }
    } else {
      this._sim_change_link_pin_to_merge(pin_node_id, merge_node_id)
    }

    const merge_ref = this._merge_ref[merge_node_id]

    this._pin_to_merge[pin_node_id] = merge_node_id
    this._merge_to_pin[merge_node_id][pin_node_id] = true
    if (is_input) {
      this._merge_to_input[merge_node_id][pin_node_id] = true

      this._inc_merge_input_count(merge_id)

      if (!merge_ref) {
        this._set_merge_input_visibility(merge_node_id, 'visible')
      }
    } else {
      this._merge_to_output[merge_node_id][pin_node_id] = true

      this._inc_merge_output_count(merge_id)

      if (!merge_ref) {
        this._set_merge_output_visibility(merge_node_id, 'visible')
      }
    }
    this._inc_merge_pin_count(merge_id)

    const merge_input = this._merge_input[merge_node_id]
    const merge_output = this._merge_output[merge_node_id]

    if (is_input) {
      if (!merge_ref) {
        // mergeStyle(merge_input, {
        //   visibility: 'visible',
        // })
        merge_input.$element.style.visibility = 'visible'
        const merge_output_width = 2 * PIN_RADIUS - 4
        // mergeStyle(merge_output, {
        //   width: `${merge_output_width}px`,
        //   height: `${merge_output_width}px`,
        //   transform: `translate(${2}px, ${2}px)`,
        // })
        merge_output.$element.style.width = `${merge_output_width}px`
        merge_output.$element.style.height = `${merge_output_width}px`
        merge_output.$element.style.transform = `translate(${2}px, ${2}px)`
      }
    } else {
      if (!merge_ref) {
        // mergeStyle(merge_output, {
        //   visibility: 'visible',
        // })
        merge_output.$element.style.visibility = 'visible'
      }
    }

    if (is_input) {
      const merge_to_output = this._merge_to_output[merge_node_id]
      for (const output_node_id in merge_to_output) {
        const { unitId: _unitId } = segmentLinkPinNodeId(output_node_id)
        const merge_link_id = getLinkId(_unitId, unitId)
        this._unit_to_unit[merge_link_id] =
          this._unit_to_unit[merge_link_id] || 0
        this._unit_to_unit[merge_link_id]++
      }
    } else {
      const merge_to_input = this._merge_to_input[merge_node_id]
      for (const input_node_id in merge_to_input) {
        const { unitId: _unitId } = segmentLinkPinNodeId(input_node_id)
        const merge_link_id = getLinkId(unitId, _unitId)
        this._unit_to_unit[merge_link_id] =
          this._unit_to_unit[merge_link_id] || 0
        this._unit_to_unit[merge_link_id]++
      }
    }

    if (is_pin_output_ref) {
    } else {
      this._sim_remove_link_pin_pin(pin_node_id)
    }

    for (const pin_node_id in this._merge_to_pin[merge_node_id]) {
      const pin_datum_node_id = this._pin_to_datum[pin_node_id]
      if (pin_datum_node_id) {
        this._refresh_datum_visible(pin_datum_node_id)
      }
    }

    if (merge_ref) {
      this._refresh_core_border_color(unitId)
    } else {
      this._refresh_merge_pin_color(merge_node_id)
    }

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _set_ref_link_pin_start_marker_r = (
    pin_node_id: string,
    r: number
  ): void => {
    // console.log('_set_ref_link_pin_start_marker_r', pin_node_id, r)
    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const start_marker = this._link_marker_start[link_id]
    const start_marker_d = describeArrowSemicircle(r)
    start_marker.setProp('d', start_marker_d)
  }

  private _set_ref_link_pin_start_marker_to_node_r = (
    pin_node_id: string,
    node_id: string,
    padding: number = 0
  ): void => {
    const r = this._get_node_r(node_id)
    this._set_ref_link_pin_start_marker_r(pin_node_id, r + padding)
  }

  private _sim_change_link_pin_to_merge = (
    pin_node_id: string,
    merge_node_id: string
  ): void => {
    const { type } = segmentLinkPinNodeId(pin_node_id)
    const input = type === 'input'
    const datum_node_id = this._pin_to_datum[pin_node_id]
    const merge_unit_id = this._merge_to_ref_unit[merge_node_id]
    const merge_ref_output_id = this._merge_to_ref_output[merge_node_id]
    const pin_link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    if (merge_unit_id) {
      this._sim_change_link_node(pin_link_id, merge_unit_id, input)

      this._set_link_pin_padding_source(pin_node_id, -1.75)
      this._set_ref_link_pin_start_marker_to_node_r(
        pin_node_id,
        merge_unit_id,
        1.75
      )

      this._set_link_pin_link_color(pin_node_id, this._theme.data)

      // this._refresh_merge_pin_color(merge_unit_id)
    } else if (merge_ref_output_id) {
      this._sim_change_link_node(pin_link_id, merge_ref_output_id, input)

      this._set_link_pin_padding_source(pin_node_id, -1.75)
      this._set_ref_link_pin_start_marker_to_node_r(
        pin_node_id,
        merge_ref_output_id,
        1.75
      )
    } else {
      this._sim_change_link_node(pin_link_id, merge_node_id, input)
      if (datum_node_id) {
        const datum_link_id = getLinkId(datum_node_id, pin_node_id)
        this._sim_change_link_target(datum_link_id, merge_node_id)
        this._refresh_datum_visible(datum_node_id)
      }
    }
    if (datum_node_id) {
      if (input) {
        this._inc_merge_input_active(merge_node_id)
      } else {
        this._inc_merge_output_active(merge_node_id)
      }
    }
    this._show_link_text(pin_link_id)
  }

  private _show_link_text = (link_id: string): void => {
    const pin_link_text_path = this._link_text[link_id]
    // mergeStyle(pin_link_text_path, {
    //   display: 'block',
    // })
    pin_link_text_path.$element.style.display = 'block'
  }

  private _hide_link_text = (link_id: string): void => {
    const pin_link_text_path = this._link_text[link_id]
    // mergeStyle(pin_link_text_path, {
    //   display: 'none',
    // })
    pin_link_text_path.$element.style.display = 'none'
  }

  private _sim_change_link_node = (
    link_id: string,
    node_id: string,
    source: boolean
  ) => {
    if (source) {
      this._sim_change_link_source(link_id, node_id)
    } else {
      this._sim_change_link_target(link_id, node_id)
    }
  }

  private _sim_change_link_source = (link_id: string, source_id: string) => {
    const link = this._link[link_id]

    const prev_source_id = link.source_id

    link.source_id = source_id

    const { target_id } = link

    change_link_source_on_graph(
      this._node_graph,
      prev_source_id,
      source_id,
      target_id
    )

    this._rebuild_subgraph()
  }

  private _sim_change_link_target = (link_id: string, target_id: string) => {
    const link = this._link[link_id]

    const prev_target_id = link.target_id

    const { source_id } = link

    link.target_id = target_id

    change_link_target_on_graph(
      this._node_graph,
      source_id,
      prev_target_id,
      target_id
    )

    this._rebuild_subgraph()
  }

  private _move_datum_to_pin = (
    datum_node_id: string,
    pin_node_id: string
  ): void => {
    // console.log('Graph', '_move_datum_to_pin', datum_node_id, pin_node_id)
    const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    if (datum_pin_node_id && datum_pin_node_id !== pin_node_id) {
      this._remove_datum_link(datum_node_id)
    }

    const pin_datum_node_id = this._pin_to_datum[pin_node_id]
    if (pin_datum_node_id) {
      this._sim_remove_datum_link(pin_datum_node_id)
    }

    this._sim_add_datum_link(datum_node_id, pin_node_id)

    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    const tree = this._datum_tree[datum_id]
    const { value } = tree

    const is_link_pin = this._is_link_pin_node_id(pin_node_id)
    if (is_link_pin) {
      const is_link_pin_constant = this._is_link_pin_constant(pin_node_id)
      if (is_link_pin_constant) {
        this._spec_set_pin_data(pin_node_id, value)
      }
    }

    if (this._edit_datum_node_id === datum_node_id) {
      this._edit_datum_commited = true
    }

    this._pod_set_pin_data(pin_node_id, value)
  }

  // TODO
  public action(action: Action): void {
    const { type, data } = action
    if (type === ADD_UNIT) {
      const { id, unit } = data
      const position = this._world_screen_center()
      this._add_unit(
        id,
        unit,
        position,
        { input: {}, output: {} },
        { x: 0, y: 0 },
        null
      )
    } else if (type === SET_DATUM) {
      const { id, value } = data
      const { x, y } = this._world_screen_center()
      if (this._datum_tree[id]) {
        const tree = _getValueTree(value)
        this._sim_set_datum(id, tree)
      } else {
        this._add_datum(id, value, { x, y })
      }
    } else if (type === REMOVE_DATUM) {
      const { id } = data
      const datum_node_id = getDatumNodeId(id)
      this._remove_datum(datum_node_id)
    }
  }

  private _pod_push_data = (
    type: 'input' | 'output',
    id: string,
    data: string
  ): void => {
    this._pod.$push({ id, data })
  }

  private _pod_take_input = (id: string): void => {
    this._pod.$takeInput({ id })
  }

  private _set_pin_data = (pin_node_id: string, data: string): void => {
    // console.log('Graph', '_set_pin_data', pin_node_id, value)
    this._spec_set_pin_data(pin_node_id, data)
    this._sim_set_pin_data(pin_node_id, data)
    this._pod_set_pin_data(pin_node_id, data)
  }

  private _sim_set_pin_data = (pin_node_id: string, data: any): void => {
    // console.log('Graph', '_sim_set_pin_data', pin_node_id, data)
    if (this._is_link_pin_node_id(pin_node_id)) {
      this._refresh_link_pin_color(pin_node_id)
    }
  }

  private _spec_set_pin_data = (pin_node_id: string, data: any): void => {
    if (this._is_link_pin_node_id(pin_node_id)) {
      if (this._is_link_pin_constant(pin_node_id)) {
        const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
        this._spec = specReducer.setUnitPinData(
          { unitId, type, pinId, data },
          this._spec
        )
      }
    } else {
      const merge_pin_node_id = this._merge_to_pin[pin_node_id]
      for (const pin_node_id in merge_pin_node_id) {
        this._spec_set_pin_data(pin_node_id, data)
      }
    }
  }

  private _pod_set_pin_data = (pin_node_id: string, data: any): void => {
    // console.log('Graph', '_pod_set_pin_data', pin_node_id, data)
    this._flush_debugger()
    const { pinId: exposed_pin_id } = this._get_pin_exposed_id(
      'input',
      pin_node_id
    )
    if (exposed_pin_id) {
      this._pod_push_data('input', exposed_pin_id, data)
    } else {
      if (this._is_link_pin_node_id(pin_node_id)) {
        const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
        this._pod_set_link_pin_data(unitId, type, pinId, data)
      } else {
        const { id } = segmentMergeNodeId(pin_node_id)
        this._pod_set_merge_pin_data(id, data)
      }
    }
  }

  private _pod_set_link_pin_data = (
    unitId: string,
    type: 'input' | 'output',
    pinId: string,
    data: string
  ) => {
    // AD HOC
    // data = stringify(data)
    // console.log('Graph', '_pod_set_link_pin_data', unitId, type, pinId, data)
    this._pod.$setUnitPinData({
      unitId,
      pinId,
      type,
      data,
    })
  }

  private _pod_set_merge_pin_data = (mergeId: string, data: string): void => {
    // console.log('Graph', '_pod_set_merge_pin_data', mergeId, data)
    this._pod.$setMergeData({
      id: mergeId,
      data,
    })
  }

  private _pod_set_metadata = (path: string[], data: any): void => {
    this._pod.$setMetadata({ path, data })
  }

  private _set_core_border_color = (
    unit_id: string,
    borderColor: string
  ): void => {
    // console.log('Graph', '_set_core_border_color', unit_id, borderColor)
    const core = this._core[unit_id]
    if (core) {
      // mergeStyle(core, { borderColor })
      core.$element.style.borderColor = borderColor
    }
  }

  private _set_core_and_layout_core_border_color = (
    unit_id: string,
    borderColor: string
  ): void => {
    this._set_core_border_color(unit_id, borderColor)
    this._set_layout_core_border_color(unit_id, borderColor)
  }

  private _set_layout_core_border_color = (
    unit_id: string,
    borderColor: string
  ) => {
    const layout_core = this._layout_core[unit_id]
    if (layout_core) {
      // mergeStyle(layout_core, {
      //   borderColor,
      // })
      layout_core.$element.style.borderColor = borderColor
    }
  }

  private _set_link_pin_opacity = (
    pin_node_id: string,
    opacity: string
  ): void => {
    const pin = this._pin[pin_node_id]
    if (pin) {
      // mergeStyle(pin, { opacity })
      pin.$element.style.opacity = opacity
    }

    const pin_name = this._pin_name[pin_node_id]
    if (pin_name) {
      // mergeStyle(pin_name, {
      //   opacity,
      // })
      pin_name.$element.style.opacity = opacity
    }

    const pin_link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const pin_link = this._link_base[pin_link_id]
    // mergeStyle(pin_link, { opacity })
    pin_link.$element.style.opacity = opacity
  }

  private _set_link_pin_pointer_events = (
    pin_node_id: string,
    pointerEvents: string
  ) => {
    const pin = this._pin[pin_node_id]
    if (pin) {
      // mergeStyle(pin, { pointerEvents })
      pin.$element.style.pointerEvents = pointerEvents
    }

    const pin_link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const pin_link = this._link_comp[pin_link_id]
    // mergeStyle(pin_link, { pointerEvents })
    pin_link.$element.style.pointerEvents = pointerEvents
  }

  private _set_exposed_pin_set_opacity = (
    type: 'input' | 'output',
    pin_id: string,
    opacity: number
  ): void => {
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this._set_exposed_sub_pin_opacity(type, pin_id, sub_pin_id, opacity)
    }
  }

  private _set_exposed_sub_pin_opacity = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    opacity: number
  ): void => {
    const _opacity = `${opacity}`

    const input = type === 'input'
    const ext_pin_node_id = getExternalNodeId(type, pin_id, sub_pin_id)
    const external_pin = this._pin[ext_pin_node_id]
    // mergeStyle(external_pin, {
    //   opacity: `${opacity}`,
    // })
    external_pin.$element.style.opacity = _opacity

    const int_pin_node_id = getInternalNodeId(type, pin_id, sub_pin_id)
    const internal_pin = this._pin[int_pin_node_id]
    // mergeStyle(internal_pin, {
    //   opacity: `${opacity}`,
    // })
    internal_pin.$element.style.opacity = _opacity

    const source_id = input ? ext_pin_node_id : int_pin_node_id
    const target_id = input ? int_pin_node_id : ext_pin_node_id
    const link_id = getLinkId(source_id, target_id)
    const link_base = this._link_base[link_id]
    // mergeStyle(link_base, {
    //   opacity: `${opacity}`,
    // })
    link_base.$element.style.opacity = _opacity
  }

  private _get_exposed_pin_internal_node_id = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string
  ): string => {
    const sub_pin_spec = this._get_exposed_sub_pin_spec(
      type,
      pin_id,
      sub_pin_id
    )
    return this._get_exposed_pin_spec_internal_node_id(type, sub_pin_spec)
  }

  private _get_exposed_pin_spec_internal_node_id = (
    type: 'input' | 'output',
    sub_pin_spec: GraphExposedSubPinSpec
  ): string => {
    const { mergeId, unitId, pinId } = sub_pin_spec
    if (mergeId) {
      const merge_node_id = getMergeNodeId(mergeId)
      const merge_anchor_node_id = this._get_merge_anchor_node_id(merge_node_id)
      return merge_anchor_node_id
    } else {
      if (pinId === SELF) {
        return unitId
      } else {
        return getPinNodeId(unitId!, type, pinId!)
      }
    }
  }

  private _set_exposed_sub_pin_color = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    stroke: string
  ): void => {
    const int_pin_node_id = getInternalNodeId(type, pin_id, sub_pin_id)
    const ext_pin_node_id = getExternalNodeId(type, pin_id, sub_pin_id)

    const input = type === 'input'

    const external_pin = this._pin[ext_pin_node_id]
    // mergeStyle(external_pin, {
    //   borderColor: stroke,
    // })

    // AD HOC
    // whoever called this method did so using spec data not sim data
    if (!external_pin) {
      return
    }

    external_pin.$element.style.borderColor = stroke
    if (!input) {
      // mergeStyle(external_pin, {
      //   backgroundColor: stroke,
      // })
      external_pin.$element.style.backgroundColor = stroke
    }
    const name_comp = this._pin_name[ext_pin_node_id]
    // mergeStyle(name_comp, { color: stroke })
    name_comp.$element.style.color = stroke

    const end_marker = this._exposed_link_end_marker[ext_pin_node_id]
    const start_marker = this._exposed_link_start_marker[ext_pin_node_id]
    // mergeStyle(end_marker, { stroke })
    end_marker.$element.style.stroke = stroke
    // mergeStyle(start_marker, { stroke })
    start_marker.$element.style.stroke = stroke

    const source_id = input ? ext_pin_node_id : int_pin_node_id
    const target_id = input ? int_pin_node_id : ext_pin_node_id
    const link_id = getLinkId(source_id, target_id)
    const link_base = this._link_base[link_id]
    // mergeStyle(link_base, { stroke })
    link_base.$element.style.stroke = stroke
  }

  private _refresh_exposed_pin_set_color = (
    type: 'input' | 'output',
    pin_id: string
  ): void => {
    console.log('Graph', '_refresh_exposed_pin_set_color', type, pin_id)
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this._refresh_exposed_sub_pin_color(type, pin_id, sub_pin_id)
    }
  }

  private _reset_exposed_pin_set_color = (
    type: 'input' | 'output',
    pin_id: string
  ): void => {
    // console.log('Graph', '_reset_exposed_pin_set_color', type, pin_id)
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this._reset_exposed_sub_pin_color(type, pin_id, sub_pin_id)
    }
  }

  private _get_exposed_sub_pin_color = (type: 'input' | 'output'): string => {
    // const color = type === 'input' ? CYAN : type === 'output' ? MAGENTA : WHITE
    const color = this._theme.node
    return color
  }

  private _refresh_exposed_sub_pin_color = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string
  ) => {
    // TODO
    const ext_pin_node_id = getExternalNodeId(type, pin_id, sub_pin_id)
    const int_pin_node_id = getInternalNodeId(type, pin_id, sub_pin_id)
    if (
      this._is_node_hovered(ext_pin_node_id) ||
      this._is_node_selected(ext_pin_node_id) ||
      this._is_node_ascend(ext_pin_node_id) ||
      this._is_node_hovered(int_pin_node_id) ||
      this._is_node_selected(int_pin_node_id) ||
      this._is_node_ascend(int_pin_node_id)
    ) {
      this._set_node_mode_color(ext_pin_node_id)
    } else {
      this._reset_exposed_sub_pin_color(type, pin_id, sub_pin_id)
    }
  }

  private _reset_exposed_sub_pin_color = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_reset_exposed_sub_pin_color',
    //   type,
    //   pin_id,
    //   sub_pin_id
    // )
    let color: string
    if (this._unit_datum[type][pin_id]) {
      color = this._theme.data
    } else {
      color = this._get_exposed_sub_pin_color(type)
    }
    this._set_exposed_sub_pin_color(type, pin_id, sub_pin_id, color)
  }

  private _set_exposed_pin_set_color = (
    type: 'input' | 'output',
    pin_id: string,
    color: string
  ): void => {
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this._set_exposed_sub_pin_color(type, pin_id, sub_pin_id, color)
    }
  }

  private _set_exposed_pin_set_layer = (
    type: 'input' | 'output',
    pin_id: string,
    layer: number
  ): void => {
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this._set_exposed_sub_pin_layer(type, pin_id, sub_pin_id, layer)
    }
  }

  private _set_exposed_sub_pin_layer = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id,
    layer: number
  ): void => {
    const int_pin_node_id = this._get_exposed_pin_internal_node_id(
      type,
      pin_id,
      sub_pin_id
    )
    const ext_pin_node_id = getExternalNodeId(type, pin_id, sub_pin_id)
    this._set_node_layer(int_pin_node_id, layer)
    this._set_node_layer(ext_pin_node_id, layer)
  }

  private _set_link_pin_link_color = (
    pin_node_id: string,
    color: string
  ): void => {
    // console.log('Graph', '_set_link_pin_link_color', pin_node_id, color)
    const {
      unitId: unit_id,
      type,
      pinId: pin_id,
    } = segmentLinkPinNodeId(pin_node_id)
    const pin_link_id = getPinLinkId(unit_id, type, pin_id)
    this._set_link_color(pin_link_id, color)
    const pin_memory = this._is_link_pin_memory(pin_node_id)
    const pin_ref = this._is_link_pin_ref(pin_node_id)
    const end_marker = this._pin_link_end_marker[pin_node_id]
    const start_marker = this._pin_link_start_marker[pin_node_id]
    if (end_marker) {
      if (pin_memory || pin_ref) {
        // mergeStyle(end_marker, { stroke: color })
        end_marker.$element.style.stroke = color
      } else {
        // mergeStyle(end_marker, { fill: color })
        end_marker.$element.style.fill = color
      }
    }
    if (start_marker) {
      if (pin_memory || pin_ref) {
        // mergeStyle(start_marker, {
        //   stroke: color,
        // })
        start_marker.$element.style.stroke = color
      } else {
        // mergeStyle(start_marker, { fill: color })
        start_marker.$element.style.fill = color
      }
    }
  }

  private _set_link_color = (link_id: string, color: string): void => {
    // console.log('_set_link_color', link_id, color)
    const link_base = this._link_base[link_id]
    // mergeStyle(link_base, { stroke: color })
    link_base.$element.style.stroke = color
  }

  private _set_link_pin_pin_color = (
    pin_node_id: string,
    color: string,
    icon_color: string
  ): void => {
    const { type } = segmentLinkPinNodeId(pin_node_id)
    const output = type === 'output'
    const pin = this._pin[pin_node_id]
    const ref = this._is_link_pin_ref(pin_node_id)
    const borderColor = ref && !output ? NONE : color
    // mergeStyle(pin, {
    //   borderColor,
    // })
    pin.$element.style.borderColor = borderColor
    if (type === 'output' && !ref) {
      // mergeStyle(pin, {
      //   backgroundColor: color,
      // })
      pin.$element.style.backgroundColor = color
    }

    const ref_output_pin_icon = this._ref_output_pin_icon[pin_node_id]
    if (ref_output_pin_icon) {
      ref_output_pin_icon.$element.style.stroke = icon_color
    }
  }

  private _refresh_pin_color = (pin_node_id: string): void => {
    // console.log('Graph', '_refresh_pin_color', pin_node_id)
    if (this._is_link_pin_node_id(pin_node_id)) {
      this._refresh_link_pin_color(pin_node_id)
    } else {
      this._refresh_merge_pin_pin_color(pin_node_id, 'input')
      this._refresh_merge_pin_pin_color(pin_node_id, 'output')
    }
  }

  private _refresh_link_pin_color = (pin_node_id: string) => {
    // console.log('Graph', '_refresh_link_pin_color', pin_node_id)
    const { unitId } = segmentLinkPinNodeId(pin_node_id)
    if (
      this._is_node_hovered(pin_node_id) ||
      this._is_node_selected(pin_node_id) ||
      this._is_node_hovered(unitId) ||
      this._is_node_selected(unitId)
    ) {
      this._set_node_mode_color(pin_node_id)
    } else {
      this._reset_link_pin_color(pin_node_id)
    }
  }

  private _set_pin_text_color = (pin_node_id: string, color: string): void => {
    if (this._is_link_pin_merged(pin_node_id)) {
      this._set_link_pin_link_text_color(pin_node_id, color)
    } else {
      this._set_link_pin_pin_text_color(pin_node_id, color)
    }
  }

  private _set_link_pin_pin_text_color = (
    pin_node_id: string,
    color: string
  ): void => {
    const pin_name = this._pin_name[pin_node_id]
    // mergeStyle(pin_name, {
    //   color,
    // })
    pin_name.$element.style.color = color
  }

  private _set_link_pin_link_text_color = (
    pin_node_id: string,
    fill: string
  ): void => {
    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const link_text = this._link_text[link_id]
    // mergeStyle(link_text, {
    //   fill,
    // })
    link_text.$element.style.fill = fill
  }

  public remove_datum = (datum_node_id: string) => {
    // console.log('Graph', 'remove_datum', datum_node_id)
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    this._remove_datum(datum_node_id)
    this._dispatchAction(removeDatum(datum_id))
  }

  private _remove_datum = (datum_node_id: string) => {
    // console.log('Graph', '_remove_datum', datum_node_id)
    this._pod_remove_datum(datum_node_id)
    this._sim_remove_datum(datum_node_id)
  }

  private _remove_datum_link = (datum_node_id: string): void => {
    // console.log('Graph', '_remove_datum_link')
    const pin_node_id = this._datum_to_pin[datum_node_id]
    this._sim_remove_datum_link(datum_node_id)
    this._pod_remove_pin_datum(pin_node_id)
  }

  private _spec_remove_pin_data = (pin_node_id: string): void => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    this._spec = specReducer.removeUnitPinData(
      { unitId, type, pinId },
      this._spec
    )
  }

  private _sim_remove_datum_link = (datum_node_id: string) => {
    const pin_node_id = this._datum_to_pin[datum_node_id]

    const link_id = getLinkId(datum_node_id, pin_node_id)

    delete this._datum_to_pin[datum_node_id]
    delete this._pin_to_datum[pin_node_id]

    delete this._linked_data_node[datum_node_id]
    delete this._visible_linked_data_node[datum_node_id]
    const datum_node = this._data_node[datum_node_id]
    this._unlinked_data_node[datum_node_id] = datum_node
    if (this._visible_data_node[datum_node_id]) {
      this._visible_unlinked_data_node[datum_node_id] = datum_node
      this._set_node_layer(datum_node_id, LAYER_DATA)
    }

    delete this._visible_data_link[link_id]

    delete this._data_link[link_id]

    this._sim_remove_link(link_id)

    // removing a datum link might've made the datum valid
    this._refresh_node_color(datum_node_id)

    this._refresh_compatible()

    delete this._pin_datum_tree[pin_node_id]

    if (this._is_link_pin_node_id(pin_node_id)) {
      const { unitId, type } = segmentLinkPinNodeId(pin_node_id)

      if (!this._is_link_pin_ignored(pin_node_id)) {
        this._dec_unit_pin_active(unitId)

        this._set_pin_text_color(pin_node_id, this._theme.pin_text)
      }

      const pin_merge_node_id = this._pin_to_merge[pin_node_id]
      if (pin_merge_node_id) {
        if (type === 'input') {
          this._dec_merge_input_active(pin_merge_node_id)
        } else {
          this._dec_merge_output_active(pin_merge_node_id)
        }
      }
    } else {
      this._dec_merge_input_active(pin_node_id)
    }

    if (this._is_link_pin_node_id(pin_node_id)) {
      this._refresh_link_pin_color(pin_node_id)
    }

    this._start_graph_simulation(LAYER_DATA_LINKED)
  }

  private _pod_remove_pin_datum = (pin_node_id: string) => {
    // console.log('Graph', '_pod_remove_pin_datum', pin_node_id)
    this._flush_debugger()
    const { pinId: exposed_pin_id } = this._get_pin_exposed_id(
      'input',
      pin_node_id
    )
    if (exposed_pin_id) {
      this._pod_take_input(exposed_pin_id)
    } else {
      if (this._is_merge_node_id(pin_node_id)) {
        const { id } = segmentMergeNodeId(pin_node_id)
        this._pod.$removeMergeData({ id })
      } else {
        const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
        this._pod.$removeUnitPinData({
          unitId,
          type,
          pinId,
        })
      }
    }
  }

  private _remove_pin_from_merge = (
    merge_node_id: string,
    pin_node_id: string
  ): void => {
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    this.__pod_remove_pin_from_merge(merge_id, unitId, type, pinId)
    this._state_remove_pin_from_merge(merge_node_id, pin_node_id)
  }

  private _state_remove_pin_from_merge = (
    merge_node_id: string,
    pin_node_id: string
  ): void => {
    // console.log('Graph', '_spec_remove_pin_from_merge')
    this._sim_remove_pin_from_merge(merge_node_id, pin_node_id)
    this._spec_remove_pin_from_merge(merge_node_id, pin_node_id)
  }

  private _spec_remove_pin_from_merge = (
    merge_node_id: string,
    pin_node_id: string
  ): void => {
    // console.log('Graph', '_spec_remove_pin_from_merge')
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    this.__spec_remove_pin_from_merge(merge_id, unitId, type, pinId)
  }

  private __spec_remove_pin_from_merge = (
    merge_id: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ): void => {
    // console.log('Graph', '_spec_remove_pin_from_merge')
    this._spec = specReducer.removePinFromMerge(
      { id: merge_id, unitId, type, pinId },
      this._spec
    )
  }

  private _sim_change_all_merge_input_to = (
    merge_node_id: string,
    node_id: string
  ): void => {
    const merge_to_input = this._merge_to_input[merge_node_id]
    for (const input_node_id in merge_to_input) {
      const link_id = getPinLinkIdFromPinNodeId(input_node_id)
      this._sim_change_link_source(link_id, node_id)

      const node_shape = this._get_node_shape(node_id)
      const node_r = this._get_node_r(node_id)
      const link_start_marker = this._link_marker_start[link_id]
      const ARROW_SHAPE = describeArrowShape(node_shape, node_r)
      link_start_marker.setProp('d', ARROW_SHAPE)

      const datum_node_id = this._pin_to_datum[input_node_id]
      if (datum_node_id) {
        const datum_link_id = getLinkId(datum_node_id, input_node_id)
        this._sim_change_link_target(datum_link_id, node_id)
      }
    }
  }

  private _sim_remove_pin_from_merge = (
    merge_node_id: string,
    pin_node_id: string,
    position?: Position
  ): void => {
    // console.log(
    //   'Graph',
    //   '_sim_remove_pin_from_merge',
    //   merge_node_id,
    //   pin_node_id
    // )

    position = position || this._get_merge_position(merge_node_id)

    const { id: merge_id } = segmentMergeNodeId(merge_node_id)

    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    const pin_ref = this._is_link_pin_ref(pin_node_id)

    const is_input = type === 'input'

    const is_output = !is_input

    const output_ref = is_output && pin_ref

    const merge_ref = this._is_merge_ref(merge_node_id)

    const merge_unit_id = this._merge_to_ref_unit[merge_node_id]
    const merge_output_ref = this._merge_to_ref_output[merge_node_id]

    const merge: GraphMergeSpec = this.__get_merge(merge_id)

    delete this._pin_to_merge[pin_node_id]
    delete this._merge_to_pin[merge_node_id][pin_node_id]
    delete this._merge_to_input[merge_node_id][pin_node_id]
    delete this._merge_to_output[merge_node_id][pin_node_id]

    const pin_ouptut_self = this._is_link_pin_output_ref(type, pinId)

    if (pin_ouptut_self) {
      delete this._merge_to_ref_unit[merge_node_id]
      delete this._ref_unit_to_merge[unitId]
    }

    if (output_ref) {
      delete this._merge_to_ref_output[merge_node_id]
      delete this._ref_output_to_merge[pin_node_id]
    }

    if (is_input) {
      this._dec_merge_input_count(merge_id)
    } else {
      this._dec_merge_output_count(merge_id)
    }
    this._dec_merge_pin_count(merge_id)

    if (!pin_ouptut_self && !output_ref) {
      // const merge_anchor_node_id = this._get_merge_anchor_node_id(merge_node_id)

      // const unit_node = this._get_node(unitId)
      // const merge_anchor_node = this._get_node(merge_anchor_node_id)

      // const { l, u } = surfaceDistance(unit_node, {
      //   ...merge_anchor_node,
      //   x: position.x,
      //   y: position.y,
      // })

      // const nu = oppositeVector(u)

      // const anchor_position = pointInNode(unit_node, nu)

      // const pin_position = addVector(anchor_position, {
      //   x: u.x * l,
      //   y: u.y * l,
      // })

      // this._sim_add_link_pin_node(unitId, type, pinId, pin_position)
      this._sim_add_link_pin_node(unitId, type, pinId, position)

      const source_id = is_input ? pin_node_id : unitId
      const target_id = is_input ? unitId : pin_node_id

      const link_id = getLinkId(source_id, target_id)

      this._sim_change_link_source(link_id, source_id)
      this._sim_change_link_target(link_id, target_id)

      this._hide_link_text(link_id)
    } else {
      const pin_unit_position = this._get_node_position(unitId)
      this._sim_add_merge_pin_node(merge_id, pin_unit_position)
      this._sim_change_all_merge_input_to(merge_node_id, merge_node_id)
    }

    const merge_input = this._merge_input[merge_node_id]
    const merge_output = this._merge_output[merge_node_id]

    if (is_input) {
      if (this._merge_input_count[merge_id] === 0) {
        if (!merge_ref) {
          // mergeStyle(merge_input, {
          //   visibility: 'hidden',
          // })
          merge_input.$element.style.visibility = 'hidden'
          const merge_output_width = 2 * PIN_RADIUS
          // mergeStyle(merge_output, {
          //   width: `${merge_output_width}px`,
          //   height: `${merge_output_width}px`,
          //   transform: '',
          // })
          merge_output.$element.style.width = `${merge_output_width}px`
          merge_output.$element.style.height = `${merge_output_width}px`
          merge_output.$element.style.transform = ''
        }
      }
    } else {
      if (this._merge_output_count[merge_id] === 0) {
        if (!merge_ref) {
          // mergeStyle(merge_output, {
          //   visibility: 'hidden',
          // })
          merge_output.$element.style.visibility = 'hidden'
        }
      }
    }

    const datum_node_id = this._pin_to_datum[pin_node_id]
    if (datum_node_id) {
      if (is_input) {
        this._dec_merge_input_active(merge_node_id)
      } else {
        this._dec_merge_output_active(merge_node_id)
      }
      const datum_link_id = getLinkId(datum_node_id, pin_node_id)
      this._sim_change_link_target(datum_link_id, pin_node_id)

      if (!merge_ref) {
        const { x, y } = this._pin_datum_initial_position(pin_node_id)
        const datum_node = this._node[datum_node_id]
        datum_node.x = x
        datum_node.y = y
        this._show_datum(datum_node_id)
      }
    }

    if (is_input && (merge_ref || merge_output_ref)) {
      this._set_link_pin_padding_source(pin_node_id, -1.5)
      this._set_link_pin_start_marker_hidden(pin_node_id, false)
      this._set_ref_link_pin_start_marker_r(pin_node_id, PIN_RADIUS)
    }

    if (is_input) {
      const merge_to_output = this._merge_to_output[merge_node_id]
      for (const output_node_id in merge_to_output) {
        const { unitId: _unitId } = segmentLinkPinNodeId(output_node_id)
        const merge_link_id = getLinkId(_unitId, unitId)
        this._unit_to_unit[merge_link_id]--
        if (this._unit_to_unit[merge_link_id] === 0) {
          delete this._unit_to_unit[merge_link_id]
        }
      }
    } else {
      const merge_to_input = this._merge_to_input[merge_node_id]
      for (const input_node_id in merge_to_input) {
        const { unitId: _unitId } = segmentLinkPinNodeId(input_node_id)
        const merge_link_id = getLinkId(unitId, _unitId)
        this._unit_to_unit[merge_link_id]--
        if (this._unit_to_unit[merge_link_id] === 0) {
          delete this._unit_to_unit[merge_link_id]
        }
      }
    }

    if (!merge_ref) {
      this._refresh_merge_pin_pin_color(merge_node_id, type)

      const merge_datum_node_id = this._get_merge_datum_node_id(merge_node_id)
      if (merge_datum_node_id) {
        this._refresh_datum_visible(merge_datum_node_id)
      }
    }

    if (merge_ref) {
      this._refresh_core_border_color(unitId)
    }
  }

  private __pod_remove_pin_from_merge = (
    mergeId: string,
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ) => {
    this._flush_debugger()
    this._pod.$removePinFromMerge({
      mergeId,
      unitId,
      type,
      pinId,
    })
  }

  private _get_merge_pin_not_equal = (
    merge_node_id: string,
    pin_node_id: string
  ): string => {
    const merge_to_pin = this._merge_to_pin[merge_node_id]
    let other_pin_node_id: string
    for (const p_id in merge_to_pin) {
      if (p_id !== pin_node_id) {
        other_pin_node_id = p_id
        break
      }
    }
    return other_pin_node_id!
  }

  private _is_blue_drag_init_anchor = (node_id: string): boolean => {
    const blue_drag_init_anchor_node_id =
      this._blue_drag_init_anchor_to_pin[node_id]
    return !!blue_drag_init_anchor_node_id
  }

  private _update_blue_drag_init_anchor = (
    anchor_node_id: string,
    new_anchor_node_id: string
  ): void => {
    const blue_drag_init_anchor_node_id =
      this._blue_drag_init_anchor_to_pin[anchor_node_id]
    if (blue_drag_init_anchor_node_id) {
      delete this._blue_drag_init_anchor_to_pin[anchor_node_id]
      this._blue_drag_init_anchor_to_pin[anchor_node_id] =
        blue_drag_init_anchor_node_id
      this._blue_drag_init_pin_to_anchor[blue_drag_init_anchor_node_id] =
        anchor_node_id
    }
  }

  private __remove_pin_or_merge = (
    pin_node_id: string,
    remove_pin: (merge_node_id: string) => void,
    remove_merge: (
      merge_node_id: string,
      other_link_pin_node_id: string
    ) => void
  ): string => {
    // console.log('Graph', '_remove_pin_or_merge')
    const merge_node_id = this._pin_to_merge[pin_node_id]
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    const merge_pin_count = this._merge_pin_count[merge_id]
    if (merge_pin_count > 2) {
      remove_pin(merge_node_id)
      return merge_node_id
    } else {
      const other_pin_node_id = this._get_merge_pin_not_equal(
        merge_node_id,
        pin_node_id
      )
      remove_merge(merge_node_id, other_pin_node_id)
      return other_pin_node_id!
    }
  }

  private _remove_pin_or_merge = (
    pin_node_id: string,
    position?: Position
  ): string => {
    // console.log('Graph', '_remove_pin_or_merge', pin_node_id)
    return this.__remove_pin_or_merge(
      pin_node_id,
      (merge_node_id) => {
        this._remove_pin_from_merge(merge_node_id, pin_node_id)
      },
      (merge_node_id, other_pin_node_id: string) => {
        if (this._is_blue_drag_init_anchor(merge_node_id)) {
          this._update_blue_drag_init_anchor(merge_node_id, other_pin_node_id)
        }
        const internal_node_id = this._pin_to_internal[merge_node_id]
        if (internal_node_id) {
          const { id, type, subPinId } = segmentExposedNodeId(internal_node_id)
          this._unplug_exposed_pin(type, id, subPinId)
        }

        this._remove_merge(merge_node_id)

        if (internal_node_id) {
          const { id, type, subPinId } = segmentExposedNodeId(internal_node_id)
          const {
            unitId,
            type: _type,
            pinId,
          } = segmentLinkPinNodeId(other_pin_node_id)
          if (type === _type) {
            this._plug_exposed_pin(_type, id, subPinId, {
              unitId,
              pinId,
            })
          }
        }
      }
    )
  }

  private _sim_remove_pin_or_merge = (
    pin_node_id: string,
    position?: Position
  ): string => {
    // console.log('Graph', '_sim_remove_pin_or_merge')
    return this.__remove_pin_or_merge(
      pin_node_id,
      (merge_node_id) => {
        this._sim_remove_pin_from_merge(merge_node_id, pin_node_id, position)
      },
      (merge_node_id, other_pin_node_id: string) => {
        if (this._is_blue_drag_init_anchor(merge_node_id)) {
          this._update_blue_drag_init_anchor(merge_node_id, other_pin_node_id)
        }
        this._sim_remove_merge(merge_node_id)
      }
    )
  }

  private _state_remove_pin_or_merge = (pin_node_id: string): string => {
    // console.log('Graph', '_sim_remove_pin_or_merge')
    return this.__remove_pin_or_merge(
      pin_node_id,
      (merge_node_id) => {
        this._state_remove_pin_from_merge(merge_node_id, pin_node_id)
      },
      (merge_node_id, other_pin_node_id: string) => {
        this._state_remove_merge(merge_node_id)
      }
    )
  }

  private _sim_remove_pin_type = (pin_node_id: string): void => {
    const type_node_id = getTypeNodeId(pin_node_id)

    if (!this._has_node(type_node_id)) {
      return
    }

    const type_link_id = getLinkId(type_node_id, pin_node_id)

    delete this._type_link[type_link_id]

    this._sim_remove_link(type_link_id)

    delete this._type_container[type_node_id]
    delete this._type_node[type_node_id]
    delete this._type[type_node_id]

    this._sim_remove_node(type_node_id)
  }

  private _sim_remove_link_pin_pin = (pin_node_id: string): void => {
    // console.log('Graph', 'remove_link_pin', pin_node_id)
    delete this._pin[pin_node_id]
    delete this._pin_node[pin_node_id]
    delete this._pin_name[pin_node_id]

    delete this._link_pin_ignored[pin_node_id]

    delete this._normal_node[pin_node_id]
    delete this._ignored_node[pin_node_id]

    this._sim_remove_pin_type(pin_node_id)

    this._sim_remove_node(pin_node_id)
  }

  private _sim_remove_link_pin_link = (pin_node_id: string): void => {
    // console.log('Graph', '_sim_remove_link_pin_link', pin_node_id)
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    const link_id = getPinLinkId(unitId, type, pinId)

    // const pin_datum_tree = this._pin_datum_tree[pin_node_id]
    // if (pin_datum_tree) {
    //   const { unitId } = segmentLinkPinNodeId(pin_node_id)
    //   this._dec_unit_pin_active(unitId)
    //   delete this._pin_datum_tree[pin_node_id]
    // }

    delete this._pin_link_start_marker[pin_node_id]
    delete this._pin_link_end_marker[pin_node_id]

    delete this._pin_link[link_id]

    this._sim_remove_link(link_id)
  }

  private _remove_merge = (merge_node_id: string): void => {
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    this._pod_remove_merge(merge_node_id)
    this._sim_remove_merge(merge_node_id)
    this.__spec_remove_merge(merge_id)
  }

  private _state_remove_merge = (merge_node_id: string): void => {
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    this._sim_remove_merge(merge_node_id)
    this.__spec_remove_merge(merge_id)
  }

  private __state_remove_merge = (merge_id: string): void => {
    this.__sim_remove_merge(merge_id)
    this.__spec_remove_merge(merge_id)
  }

  private _pod_remove_merge = (merge_node_id: string): void => {
    // console.log('Graph', '_pod_remove_merge', merge_node_id)
    this._flush_debugger()
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    this._pod.$removeMerge({
      id: merge_id,
    })
    const merge_datum_node_id = this._pin_to_datum[merge_node_id]
    if (merge_datum_node_id) {
      this._pod_remove_datum(merge_datum_node_id)
    }
  }

  private __spec_remove_merge = (merge_id: string): void => {
    this._spec = specReducer.removeMerge({ id: merge_id }, this._spec)
  }

  private _is_link_pin_output_ref = (
    type: 'input' | 'output',
    pinId: string
  ): boolean => {
    return type === 'output' && pinId === SELF
  }

  private _sim_remove_merge = (merge_node_id: string): void => {
    // console.log('Graph', '_sim_remove_merge', merge_node_id)

    const anchor_node_id = this._get_merge_anchor_node_id(merge_node_id)

    const anchor_position = this._get_node_position(anchor_node_id)

    const merge_to_pin = clone(this._merge_to_pin[merge_node_id])
    const merge_to_input = clone(this._merge_to_input[merge_node_id])
    for (let pin_node_id in merge_to_pin) {
      this._sim_remove_pin_from_merge(
        merge_node_id,
        pin_node_id,
        anchor_position
      )
    }

    const int_pin_node_id = this._pin_to_internal[merge_node_id]
    if (int_pin_node_id) {
      const { type, id, subPinId } = segmentExposedNodeId(int_pin_node_id)
      this._sim_unplug_exposed_pin(type, id, subPinId)
    }

    const merge_datum_node_id = this._pin_to_datum[merge_node_id]
    if (merge_datum_node_id) {
      this._sim_remove_datum(merge_datum_node_id)
    }

    const merge_ref = this._is_merge_ref(merge_node_id)
    const merge_unit_id = this._merge_to_ref_unit[merge_node_id]

    const merge_ref_output_id = this._merge_to_ref_output[merge_node_id]

    delete this._merge_to_pin[merge_node_id]
    delete this._merge_to_input[merge_node_id]
    delete this._merge_to_output[merge_node_id]
    delete this._merge_pin_count[merge_node_id]
    delete this._merge_input_count[merge_node_id]
    delete this._merge_output_count[merge_node_id]
    delete this._merge_active_output_count[merge_node_id]
    delete this._merge_active_input_count[merge_node_id]
    delete this._merge_ref[merge_node_id]

    delete this._merge[merge_node_id]
    delete this._merge_input[merge_node_id]
    delete this._merge_output[merge_node_id]

    delete this._pin_datum_tree[merge_node_id]

    if (merge_ref) {
      if (merge_unit_id) {
        delete this._merge_to_ref_unit[merge_node_id]
        delete this._ref_unit_to_merge[merge_unit_id]
        this._refresh_core_border_color(merge_unit_id)
        for (const input_node_id in merge_to_input) {
          const { unitId } = segmentLinkPinNodeId(input_node_id)
          this._refresh_core_border_color(unitId)
          this._refresh_link_pin_link_color(input_node_id)
        }
      } else {
        // merge_ref_output_id
        delete this._merge_to_ref_output[merge_node_id]
        delete this._ref_output_to_merge[merge_ref_output_id]
      }
    }

    this._sim_remove_pin_type(merge_node_id)

    this._sim_remove_merge_node(merge_node_id)

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _sim_remove_merge_node = (merge_node_id: string): void => {
    delete this._pin_node[merge_node_id]
    delete this._normal_node[merge_node_id]

    this._sim_remove_node(merge_node_id)
  }

  private __sim_remove_merge = (merge_id: string): void => {
    // console.log('Graph', '__sim_remove_merge', merge_node_id)
    const merge_node_id = getMergeNodeId(merge_id)
    this._sim_remove_merge(merge_node_id)
  }

  private _sim_remove_link = (link_id: string): void => {
    // console.log('Graph', '_sim_remove_link', link_id)
    this._unlisten_link(link_id)

    const link_el = this._link_comp[link_id]

    this._zoom_comp.removeChild(link_el, 'svg')

    const hover_pointer_id = this._link_id_hover_pointer_id[link_id]
    if (hover_pointer_id) {
      delete this._link_id_hover_pointer_id[link_id]
      delete this._pointer_id_hover_link_id[hover_pointer_id]
    }

    delete this._link_comp[link_id]
    delete this._link_base[link_id]
    delete this._link_base_area[link_id]
    delete this._link_text[link_id]
    delete this._link_text_value[link_id]
    delete this._link_text_path[link_id]
    delete this._link_marker_end[link_id]
    delete this._link_marker_start[link_id]
    delete this._link_force_count_k[link_id]

    const layer = this._link_layer[link_id]
    delete this._layer_link[layer][link_id]
    delete this._link_layer[link_id]

    // remove from simulation

    const link = this._link[link_id]

    delete this._link[link_id]

    // remove from graph

    const { source_id, target_id } = link

    remove_link_from_graph(this._node_graph, source_id, target_id)
    this._rebuild_subgraph()
  }

  private _unlisten_node = (node_id: string): void => {
    const unwatch = this._node_unlisten[node_id]
    delete this._node_unlisten[node_id]
    unwatch()
  }

  private _unlisten_link = (link_id: string): void => {
    const unwatch = this._link_unlisten[link_id]
    delete this._link_unlisten[link_id]
    unwatch()
  }

  private __set_node_pressed = (
    node_id: string,
    pointerId: number,
    pressed: boolean
  ): void => {
    if (pressed) {
      this._pressed_node_pointer_count++
      this._node_pressed_count[node_id] = this._node_pressed_count[node_id] || 0
      this._node_pressed_count[node_id]++
      if (this._node_pressed_count[node_id] === 1) {
        this._pressed_node_count++
      }
      this._pressed_node_id_pointer_id[node_id] =
        this._pressed_node_id_pointer_id[node_id] || {}
      this._pressed_node_id_pointer_id[node_id][pointerId] = true
      this._pointer_id_pressed_node_id[pointerId] = node_id
    } else {
      this._pressed_node_pointer_count--
      this._node_pressed_count[node_id]--
      if (this._node_pressed_count[node_id] === 0) {
        this._pressed_node_count--
      }
      delete this._pressed_node_id_pointer_id[node_id][pointerId]
      if (this._node_pressed_count[node_id] === 0) {
        delete this._pressed_node_id_pointer_id[node_id]
      }
      delete this._pointer_id_pressed_node_id[pointerId]
    }
  }

  private _sim_remove_node = (node_id: string): void => {
    // console.log('Graph', '_sim_remove_node', node_id)
    if (this._selected_node_id[node_id]) {
      this.__deselect_node(node_id)
    }

    if (this._drag_node_id[node_id]) {
      this._set_drag_node(node_id, false)
    }

    if (this._pressed_node_id_pointer_id[node_id]) {
      for (const pointer_id in this._pressed_node_id_pointer_id[node_id]) {
        this.__set_node_pressed(node_id, Number.parseInt(pointer_id, 10), false)
      }
      delete this._pressed_node_id_pointer_id[node_id]
      delete this._node_pressed_count[node_id]
    }

    if (this._hover_node_id[node_id]) {
      delete this._hover_node_id[node_id]
      delete this._hover_node_pointer_count[node_id]
      for (let pointer_id in this._hover_node_id_pointer_id[node_id]) {
        delete this._pointer_id_hover_node_id[pointer_id]
      }
      delete this._hover_node_id_pointer_id[node_id]
      this._hover_node_count--
    }

    delete this._static_count[node_id]
    delete this._static_position[node_id]
    delete this._static_subgraph_anchor[node_id]
    delete this._static_subgraph_anchor_count[node_id]

    this._unlisten_node(node_id)

    const node_el = this._node_comp[node_id]

    this._zoom_comp.removeChild(node_el, 'default')

    delete this._node[node_id]
    delete this._node_fixed[node_id]
    delete this._node_draggable[node_id]

    // delete this._node_type[node_id]

    delete this._node_selection[node_id]
    delete this._node_comp[node_id]
    delete this._node_content[node_id]

    delete this._compatible_node_id[node_id]

    const layer = this._node_layer[node_id]
    delete this._node_layer[node_id]
    delete this._layer_node[layer][node_id]

    remove_node_from_graph(this._node_graph, node_id)

    this._rebuild_subgraph()
  }

  private _rebuild_subgraph = () => {
    if (this._drag_count > 0) {
      for (const node_id in this._drag_node_id) {
        this._on_node_static_end(node_id)
      }
    }

    this._node_to_subgraph = {}
    this._subgraph_to_node = {}
    build_subgraph(
      this._node_graph,
      this._node_to_subgraph,
      this._subgraph_to_node,
      {}
    )

    if (this._drag_count > 0) {
      for (const node_id in this._drag_node_id) {
        this._on_node_static_start(node_id)
      }
    }
  }

  private _on_link_pointer_down = (
    link_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_link_pointer_down', link_id)
    if (this._mode === 'none') {
      const node_id = this._link_id_to_node_id(link_id)
      if (node_id) {
        const { clientX, clientY } = event
        const { x, y } = this._screen_to_world(clientX, clientY)
        if (this._is_link_pin_merged(node_id)) {
          this._remove_pin_or_merge(node_id)
        }
        this._set_node_position(node_id, { x, y })
        this._on_node_pointer_enter(node_id, event)
        this._on_node_pointer_down(node_id, event)
        this._on_node_drag_start(node_id, event)
      }
    }
  }

  private _link_id_to_node_id = (link_id: string): string | null => {
    if (isPinLinkId(link_id)) {
      const { pinNodeId } = segmentPinLinkId(link_id)
      return pinNodeId
    } else if (isDatumLinkId(link_id)) {
      const { datumNodeId } = segmentDatumLinkId(link_id)
      return datumNodeId
    } else if (isExternalLinkId(link_id)) {
      const { externalNodeId } = segmentExternalLinkId(link_id)
      return externalNodeId
    } else {
      return null
    }
  }

  private _on_link_pointer_enter = (link_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_link_pointer_enter', link_id)
    const { pointerId } = event

    this._pointer_id_hover_link_id[pointerId] = link_id
    this._link_id_hover_pointer_id[link_id] = pointerId

    const node_id = this._link_id_to_node_id(link_id)
    if (node_id) {
      this._on_node_pointer_enter(node_id, event)
    }
  }

  private _on_link_pointer_leave = (link_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_link_pointer_leave', link_id)
    const { pointerId } = event

    delete this._pointer_id_hover_link_id[pointerId]
    delete this._link_id_hover_pointer_id[link_id]

    const node_id = this._link_id_to_node_id(link_id)
    if (node_id) {
      if (this._pointer_id_pressed_node_id[pointerId] !== node_id) {
        this._on_node_pointer_leave(node_id, event)
      }
    }
  }

  private _on_link_click = (link_id: string, event: IOPointerEvent): void => {
    if (isPinLinkId(link_id)) {
      const { pinNodeId } = segmentPinLinkId(link_id)
      // if (!this._is_link_pin_merged(pinNodeId)) {
      if (
        this._mode === 'remove' ||
        this._mode === 'change' ||
        this._mode === 'add' ||
        this._mode === 'data'
      ) {
        this._on_node_click(pinNodeId, event)
      }
      // }
    } else if (isExternalLinkId(link_id)) {
      const { externalNodeId } = segmentExternalLinkId(link_id)
      this._on_node_click(externalNodeId, event)
    } else if (isDatumLinkId(link_id)) {
      const { datumNodeId } = segmentDatumLinkId(link_id)
      this._on_node_click(datumNodeId, event)
    }
  }

  private _on_component_resize_start = (
    unit_id: string,
    { direction, pointerId }: IOResizeEvent
  ) => {
    // console.log('Graph', '_on_component_resize_start', unit_id)
    this._resize_node_id_pointer_id[unit_id] = pointerId
    this._resize_pointer_id_node_id[pointerId] = unit_id

    const cursor = `${direction}-resize`
    // mergeStyle(this._graph, {
    //   cursor,
    // })
    this._graph.$element.style.cursor = cursor

    if (this._selected_node_id[unit_id]) {
      for (let selected_node_id in this._selected_node_id) {
        if (
          isUnitNodeId(selected_node_id) &&
          this._is_unit_component(selected_node_id)
        ) {
          this._resize_start_component(selected_node_id)
        }
      }
    } else {
      this._resize_start_component(unit_id)
    }
  }

  private _on_component_resize = (
    unit_id: string,
    { dx, dy, dw, dh }: IOResizeEvent
  ): void => {
    // console.log('Graph', '_on_component_resize')
    if (this._drag_count > 0) {
      return
    }

    if (this._selected_node_id[unit_id]) {
      for (let selected_node_id in this._selected_node_id) {
        if (
          isUnitNodeId(selected_node_id) &&
          this._is_unit_component(selected_node_id)
        ) {
          this._delta_resize_component(selected_node_id, dx, dy, dw, dh)
        }
      }
    } else {
      this._delta_resize_component(unit_id, dx, dy, dw, dh)
    }
  }

  private _on_component_resize_end = (unit_id: string, event: {}) => {
    // console.log('Graph', '_on_component_resize_end', unit_id, event)
    const cursor = 'default'
    // mergeStyle(this._graph, {
    //   cursor,
    // })
    this._graph.$element.style.cursor = cursor

    const pointer_id = this._resize_node_id_pointer_id[unit_id]

    delete this._resize_node_id_pointer_id[unit_id]
    delete this._resize_pointer_id_node_id[pointer_id]

    if (this._selected_node_id[unit_id]) {
      for (let selected_node_id in this._selected_node_id) {
        if (
          isUnitNodeId(selected_node_id) &&
          this._is_unit_component(selected_node_id)
        ) {
          this._resize_end_component(selected_node_id)
        }
      }
    } else {
      this._resize_end_component(unit_id)
    }
  }

  private _get_datum_tree = (datum_node_id: string): TreeNode | undefined => {
    const { id } = segmentDatumNodeId(datum_node_id)
    const tree = this._datum_tree[id]
    return tree
  }

  private _is_datum_tree_valid = (datum_node_id: string): boolean => {
    const tree = this._get_datum_tree(datum_node_id)
    return _isValidValue(tree)
  }

  private _is_pin_datum_tree_valid = (pin_node_id: string): boolean => {
    const tree = this._pin_datum_tree[pin_node_id]
    return tree && _isValidValue(tree)
  }

  private _get_datum_tree_shape = (tree: TreeNode): Shape => {
    if (tree.type === TreeNodeType.Unit) {
      const spec_id = tree.value
      if (isComponent(spec_id)) {
        return 'rect'
      } else {
        return 'circle'
      }
    } else {
      return 'rect'
    }
  }

  private _get_datum_tree_size = (tree: TreeNode): Size => {
    if (tree.type === TreeNodeType.Unit) {
      const spec_id = tree.value
      const r = getSpecRadiusById(spec_id, true) - 1.5
      return {
        width: 2 * r,
        height: 2 * r,
      }
      // return {
      //   width: CLASS_DEFAULT_WIDTH,
      //   height: CLASS_DEFAULT_HEIGHT,
      // }
    } else {
      let { width, height } = getDatumSize(tree)
      const overflowX = width > DATUM_MAX_WIDTH ? 3 : 0
      const overflowY = height > DATUM_MAX_HEIGHT ? 3 : 0
      width = Math.min(width, DATUM_MAX_WIDTH) + overflowY
      height = Math.min(height, DATUM_MAX_HEIGHT) + overflowX
      return { width, height }
    }
  }

  private _on_datum_change = (
    datum_id: string,
    { data }: { data: TreeNode }
  ) => {
    // console.log('Graph', '_on_datum_change')
    if (datum_id === this._edit_datum_id) {
      this._edit_datum_commited = false
      this._edit_datum_never_changed = false
    }
    this._sim_set_datum(datum_id, data)
  }

  private _focus_datum = (datum_id: string, path: number[]): void => {
    const datum_node_id = getDatumNodeId(datum_id)
    const datum = this._datum[datum_node_id]
    if (datum) {
      datum.focusChild(path, { preventScroll: true })
    }
  }

  private _for_each_unit_pin = (
    unit_id: string,
    callback: (
      pin_node_id: string,
      type: 'input' | 'output',
      pin_id: string
    ) => void
  ) => {
    const spec = this._get_unit_spec(unit_id)
    this._for_each_spec_input(spec, (input_id) => {
      const input_node_id = getInputNodeId(unit_id, input_id)
      callback(input_node_id, 'input', input_id)
    })
    this._for_each_spec_output(spec, (output_id) => {
      const output_node_id = getOutputNodeId(unit_id, output_id)
      callback(output_node_id, 'output', output_id)
    })
  }

  private _for_each_unit_input = (
    unit_id: string,
    callback: (input_node_id: string, input_id: string) => void
  ) => {
    const spec = this._get_unit_spec(unit_id)
    this._for_each_spec_input(spec, (input_id: string) => {
      const input_node_id = getInputNodeId(unit_id, input_id)
      callback(input_node_id, input_id)
    })
  }

  private _for_each_unit_merged_pin = (
    unit_id: string,
    callback: (input_node_id: string, input_id: string) => void
  ) => {}

  private _for_each_spec_id_pin = (
    id: string,
    callback: (type: 'input' | 'output', pin_id: string) => void
  ) => {
    this._for_each_spec_id_input(id, (input_id) => {
      callback('input', input_id)
    })
    this._for_each_spec_id_output(id, (output_id) => {
      callback('output', output_id)
    })
  }

  private _for_each_spec_id_input = (
    id: string,
    callback: (pin_id: string) => void
  ) => {
    const spec = getSpec(id)
    return this._for_each_spec_input(spec, callback)
  }

  private _for_each_spec_input = (
    spec: Spec,
    callback: (input_id: string) => void
  ) => {
    const { inputs = {} } = spec
    for (let input_id in inputs) {
      callback(input_id)
    }
  }

  private _for_each_spec_id_output = (
    id: string,
    callback: (output_id: string) => void
  ) => {
    const spec = getSpec(id)
    const { outputs = {} } = spec
    for (let output_id in outputs) {
      callback(output_id)
    }
  }

  private _for_each_spec_output = (
    spec: Spec,
    callback: (pin_id: string) => void
  ) => {
    const { outputs = {} } = spec
    for (let output_id in outputs) {
      callback(output_id)
    }
  }

  private _for_each_unit_output = (
    unit_id: string,
    callback: (pin_node_id: string, output_id: string) => void
  ) => {
    const spec = this._get_unit_spec(unit_id)
    this._for_each_spec_output(spec, (output_id: string) => {
      const output_node_id = getOutputNodeId(unit_id, output_id)
      callback(output_node_id, output_id)
    })
  }

  public set_datum = (datum_id: string, tree: TreeNode) => {
    this._sim_set_datum(datum_id, tree)
    this._dispatchAction(setDatum(datum_id, tree.value))
  }

  private _sim_set_datum = (datum_id: string, tree: TreeNode) => {
    this._datum_tree[datum_id] = tree
    const datum_node_id = getDatumNodeId(datum_id)

    if (tree.type === TreeNodeType.Unit) {
      // @ts-ignore
      const datum = this._datum[datum_node_id] as Class
      datum.setProp('id', tree.value)
    } else {
      const { width, height } = this._get_datum_tree_size(tree)

      const datum_pin_node_id = this._datum_to_pin[datum_node_id]
      const datum_link_id: string | undefined =
        datum_pin_node_id && getLinkId(datum_node_id, datum_pin_node_id)

      this._resize_datum(datum_node_id, width, height)

      let color: string = this._theme.type

      let valid: boolean
      if (datum_pin_node_id) {
        valid = this._is_datum_pin_type_match(datum_node_id, datum_pin_node_id)
      } else {
        valid = _isValidValue(tree)
      }

      if (valid) {
        color = this._theme.data
      }

      this._set_datum_color(datum_node_id, color, color)

      if (datum_pin_node_id) {
        this._set_link_color(datum_link_id, color)
      }
    }

    this._refresh_compatible()
  }

  private _edit_datum_just_blurred: boolean = false
  private _edit_datum_never_changed: boolean = true

  private _on_datum_blur = (datum_id: string, { data }: { data: TreeNode }) => {
    // console.log('Graph', '_on_datum_blur')
    if (this._edit_datum_id === datum_id) {
      const edit_datum_id = this._edit_datum_id
      const edit_datum_node_id = this._edit_datum_node_id!

      this._edit_datum_id = null
      this._edit_datum_node_id = null
      this._edit_datum_path = null

      this._refresh_selection_dasharray(edit_datum_node_id)

      const prevent =
        this._edit_datum_commited || this._edit_datum_never_changed
      this._commit_data_value(edit_datum_id, data, prevent)

      this._edit_datum_just_blurred = true
      setTimeout(() => {
        this._edit_datum_just_blurred = false
      }, 0)
    }

    if (!this._disabled && this._control_lock) {
      this._enable_crud()
      this._enable_keyboard()
    }
  }

  private _commit_data_value = (
    datum_id: string,
    tree: TreeNode,
    prevent: boolean = false
  ) => {
    this._edit_datum_commited = true

    // console.log('Graph', '_commit_data_value')
    const datum_node_id = getDatumNodeId(datum_id)
    const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    if (datum_pin_node_id) {
      if (this._is_datum_pin_type_match(datum_node_id, datum_pin_node_id)) {
        if (!prevent) {
          this._set_pin_data(datum_pin_node_id, tree.value)
        }
      } else {
        this._remove_datum_link(datum_node_id)
        if (tree.value === '') {
          if (this._has_node(datum_node_id)) {
            this._sim_remove_datum(datum_node_id)
          }
        }
        // this._start_graph_simulation(LAYER_DATA_LINKED)
      }
    } else {
      if (tree.value === '') {
        if (this._has_node(datum_node_id)) {
          this._sim_remove_datum(datum_node_id)
        }
      }
    }
  }

  private _on_datum_focus = (
    datum_id: string,
    { data, path }: { data: any; path: number[] }
  ) => {
    // console.log('Graph', '_on_datum_focus')
    const datum_node_id = getDatumNodeId(datum_id)

    this._edit_datum_id = datum_id
    this._edit_datum_node_id = datum_node_id
    this._edit_datum_path = path
    this._edit_datum_never_changed = true

    // this._set_node_fixed(datum_node_id, true)
    this._set_selection_dasharray(datum_node_id, 18)

    this._disable_crud()
    this._disable_keyboard()
  }

  private _sim_remove_datum = (datum_node_id: string): void => {
    // console.log('Graph', '_sim_remove_datum', datum_node_id)
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)

    const unlisten = this._datum_unlisten[datum_id]
    unlisten()

    if (this._edit_datum_node_id === datum_node_id) {
      this._edit_datum_node_id = null
      this._edit_datum_id = null
      this._edit_datum_path = null

      this._enable_crud()
      this._enable_keyboard()

      this.focus()
    }

    const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    if (datum_pin_node_id) {
      this._sim_remove_datum_link(datum_node_id)
    }

    delete this._data_node[datum_node_id]

    this._sim_remove_node(datum_node_id)

    delete this._visible_data_node[datum_node_id]
    delete this._hidden_data_node[datum_node_id]
    delete this._linked_data_node[datum_node_id]
    delete this._visible_linked_data_node[datum_node_id]
    delete this._visible_unlinked_data_node[datum_node_id]
    delete this._unlinked_data_node[datum_node_id]

    delete this._invalid_datum_data[datum_node_id]
    delete this._invalid_datum_node_id[datum_node_id]

    delete this._datum[datum_node_id]
    delete this._datum_container[datum_node_id]
    delete this._datum_area[datum_node_id]
    delete this._datum_overlay[datum_node_id]

    delete this._datum_tree[datum_id]

    this._start_graph_simulation(LAYER_DATA_LINKED)
  }

  private _remove_unit_merges = (unit_id: string): Dict<string> => {
    const anchor_node_id: Dict<string> = {}
    this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
      const merge_node_id = this._pin_to_merge[pin_node_id]
      if (merge_node_id) {
        const a_id = this._remove_pin_or_merge(pin_node_id)
        anchor_node_id[pin_node_id] = a_id
        this._refresh_link_pin_color(pin_node_id)
      }
    })
    return anchor_node_id
  }

  public remove_unit = (unit_id: string) => {
    this._remove_unit(unit_id)
    this._dispatchAction(removeUnit(unit_id))
  }

  private _remove_unit = (unit_id: string) => {
    this._pod_remove_unit(unit_id)
    this._state_remove_unit(unit_id)
  }

  public state_remove_unit = (unit_id: string) => {
    this._state_remove_unit(unit_id)
  }

  private _state_remove_unit = (unit_id: string) => {
    this._sim_remove_unit(unit_id)
    this._spec_remove_unit(unit_id)
  }

  private _spec_remove_unit = (unit_id: string) => {
    // console.log('Graph', '_spec_remove_unit', unit_id)
    if (this._is_unit_component(unit_id)) {
      this._spec_remove_component(unit_id)
    }

    this._spec = specReducer.removeUnit({ id: unit_id }, this._spec)

    this._spec_update_metadata_complexity()
  }

  private _spec_remove_component = (unit_id: string) => {
    // console.log('Graph', '_spec_remove_component', unit_id)
    const parent_id = this._get_sub_component_spec_parent_id(unit_id)

    this._spec_remove_component_children(unit_id, parent_id)

    if (parent_id) {
      this._spec.component = componentReducer.removeSubComponentChild(
        { id: parent_id, childId: unit_id },
        this._spec.component || {}
      )
    } else {
      this._spec.component = componentReducer.removeChild(
        { id: unit_id },
        this._spec.component || {}
      )
    }

    this._spec.component = componentReducer.removeSubComponent(
      { id: unit_id },
      this._spec.component || {}
    )

    // AD HOC
    if (
      this._spec.component &&
      this._spec.component.subComponents &&
      Object.keys(this._spec.component.subComponents).length === 0
    ) {
      this._spec = dissocPath(this._spec, ['component'])
    }

    delete this._layout_node[unit_id]
    delete this._layout_target_node[unit_id]
    delete this._layout_core_content_placed[unit_id]
    delete this._layout_layer[unit_id]

    this._refresh_tree_sub_component_index()

    this._refresh_layout_node_target_position(parent_id)

    if (this._tree_layout) {
      this._move_all_layout_node_target_position(parent_id)
    }
  }

  private _pod_remove_unit = (unit_id: string): void => {
    this._flush_debugger()
    this._pod.$removeUnit({ id: unit_id })
    if (this._is_unit_component(unit_id)) {
      this._disconnect_sub_component(unit_id)
    }
  }

  private _sim_remove_link_pin = (pin_node_id: string): void => {
    // console.log('Graph', '_sim_remove_link_pin', pin_node_id)
    const { unitId } = segmentLinkPinNodeId(pin_node_id)

    const int_pin_node_id = this._pin_to_internal[pin_node_id]
    if (int_pin_node_id) {
      const { type, id, subPinId } = segmentExposedNodeId(int_pin_node_id)
      this._sim_unplug_exposed_pin(type, id, subPinId)
    }

    const output_ref_merge_node_id = this._ref_output_to_merge[pin_node_id]
    if (output_ref_merge_node_id) {
      this._sim_remove_merge(output_ref_merge_node_id)
    }

    const datum_node_id = this._pin_to_datum[pin_node_id]
    if (datum_node_id) {
      this._sim_remove_datum(datum_node_id)
    }

    const pin_datum_tree = this._pin_datum_tree[pin_node_id]
    if (pin_datum_tree) {
      this._dec_unit_pin_active(unitId)
      delete this._pin_datum_tree[pin_node_id]
    }

    const merge_node_id = this._pin_to_merge[pin_node_id]
    if (merge_node_id) {
      this._sim_remove_pin_or_merge(pin_node_id)
    }

    this._sim_remove_link_pin_link(pin_node_id)

    if (!this._is_link_pin_merged(pin_node_id)) {
      this._sim_remove_link_pin_pin(pin_node_id)
    }

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _sim_remove_component = (unit_id: string): void => {
    // console.log('Graph', '_sim_remove_component')
    const { component } = this.$props

    const parent_id = this._get_sub_component_spec_parent_id(unit_id)

    this._layout_remove_sub_component_children(unit_id, parent_id)

    if (this._is_sub_component_fullwindow(unit_id)) {
      this._decouple_sub_component(unit_id)
      this._fullwindow_component_set.delete(unit_id)
      pull(this._fullwindow_component_ids, unit_id)
    }

    this._unit_component_count--

    const sub_component = this._get_sub_component(unit_id)
    if (sub_component) {
      const parent_id = this._get_sub_component_spec_parent_id(unit_id)
      if (parent_id) {
        const parent_sub_component = this._get_sub_component(parent_id)!
        parent_sub_component.pullParentRoot(sub_component)
      } else {
        component.pullRoot(sub_component)
      }
      component.removeSubComponent(unit_id)

      sub_component.destroy()
    }

    const layout_core = this._layout_core[unit_id]

    const parent_layout_layer = this._get_parent_layout_layer(unit_id)

    parent_layout_layer.children.removeChild(layout_core)

    const layout_layer = this._get_layout_layer(unit_id)

    if (layout_layer) {
      parent_layout_layer.layers.removeChild(layout_layer.layer)
    }

    delete this._layout_core[unit_id]

    const layout_parent_id = this._sub_component_parent[unit_id] || null
    if (layout_parent_id) {
      this._refresh_component_children_counter_up(
        layout_parent_id,
        -(1 + (this._layout_component_count[unit_id] || 0))
      )

      delete this._sub_component_parent[unit_id]
    }

    if (this._layout_animation[unit_id]) {
      cancelAnimationFrame(this._layout_animation[unit_id])
      delete this._layout_animation[unit_id]
    }

    delete this._component_nodes[unit_id]
    delete this._core_component_context[unit_id]
    delete this._core_component_resize[unit_id]
    delete this._core_component_overlay[unit_id]
    delete this._core_component_frame[unit_id]
  }

  private _sim_remove_unit_core = (unit_id: string) => {
    // console.log('Graph', '_sim_remove_core', unit_id)
    const unit_self_output_id = getSelfPinNodeId(unit_id)

    const ref_merge_node_id = this._ref_unit_to_merge[unit_id]
    if (ref_merge_node_id) {
      this._sim_remove_pin_or_merge(unit_self_output_id)
      // this._sim_remove_pin_from_merge(ref_merge_node_id, unit_self_output_id)
    }

    const unit_self_pin_exposed_id = this._get_pin_exposed_id(
      'output',
      unit_self_output_id
    )
    const { pinId, subPinId } = unit_self_pin_exposed_id
    if (pinId && subPinId) {
      this._sim_unplug_exposed_pin('output', pinId, subPinId)
    }

    delete this._node_type[unit_self_output_id]

    if (this._err[unit_id] !== undefined) {
      this._sim_remove_unit_err(unit_id)
    }

    this._sim_remove_node(unit_id)

    delete this._core[unit_id]
    delete this._core_content[unit_id]
    delete this._core_area[unit_id]
    delete this._core_name[unit_id]
    delete this._core_description[unit_id]
    delete this._core_icon[unit_id]

    delete this._normal_node[unit_id]

    const core_graph = this._subgraph_cache[unit_id]
    if (core_graph) {
      // the subgraph the user is in has been removed
      if (this._subgraph_unit_id === unit_id) {
        this._leave_subgraph()
      }

      this._subgraph.removeChild(core_graph)

      delete this._subgraph_cache[unit_id]
    }

    delete this._unit_node[unit_id]

    delete this._err[unit_id]

    delete this._graph_state[unit_id]

    this._unit_count--

    if (this._minimap_screen) {
      this._minimap_screen.$element.style.display = 'none'
    }
  }

  private _sim_remove_unit_pins = (unit_id: string): void => {
    this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
      this._sim_remove_link_pin(pin_node_id)
      // AD HOC
      // delay node type deletion until they are completely detroyed
      delete this._node_type[pin_node_id]
    })
  }

  private _sim_remove_unit = (unit_id: string): void => {
    // console.log('Graph', '_sim_remove_unit', unit_id)
    if (this._is_unit_component(unit_id)) {
      this._sim_remove_component(unit_id)
    }
    this._sim_remove_unit_pins(unit_id)
    this._sim_remove_unit_core(unit_id)
  }

  private _remove_nodes = (node_ids: string[]) => {
    // log('Graph', '_remove_nodes')
    const { unit_ids, merge_ids, link_pin_ids, exposed_ids, datum_ids } =
      this._decant_node_ids(node_ids)

    this._flush_debugger()

    let removed_exposed_sub_pin_id: {
      input: Dict<Set<string>>
      output: Dict<Set<string>>
    } = { input: {}, output: {} }
    let removed_exposed_pin_id: { input: Set<string>; output: Set<string> } = {
      input: new Set(),
      output: new Set(),
    }

    for (const exposed_pin_node_id of exposed_ids) {
      const { type, id, subPinId } = segmentExposedNodeId(exposed_pin_node_id)
      if (!removed_exposed_pin_id[type].has(id)) {
        const pin_count = this._get_exposed_pin_set_count(exposed_pin_node_id)
        if (pin_count === 1 || pin_count === 0) {
          removed_exposed_pin_id[type].add(id)
          this._pod_remove_exposed_pin_set(type, id)
        } else {
          if (
            !removed_exposed_sub_pin_id[type][id] ||
            !removed_exposed_sub_pin_id[type][id].has(subPinId)
          ) {
            removed_exposed_sub_pin_id[type][id] =
              removed_exposed_sub_pin_id[type][id] || new Set()
            removed_exposed_sub_pin_id[type][id].add(subPinId)
            this.__pod_remove_exposed_sub_pin(type, id, subPinId)
          }
        }
      }
    }

    const removed_unit = new Set<string>()

    const removed_merge = new Set<string>()

    for (const merge_node_id of merge_ids) {
      removed_merge.add(merge_node_id)
      this._pod_remove_merge(merge_node_id)
    }

    for (const unit_id of unit_ids) {
      removed_unit.add(unit_id)
      this._pod_remove_unit(unit_id)
    }

    for (const datum_node_id of datum_ids) {
      const datum_pin_node_id = this._datum_to_pin[datum_node_id]
      if (datum_pin_node_id) {
        if (this._is_link_pin_node_id(datum_pin_node_id)) {
          const { unitId } = segmentLinkPinNodeId(datum_pin_node_id)
          if (!removed_unit.has(unitId)) {
            this._pod_remove_datum(datum_node_id)
          }
        } else {
          if (!removed_merge.has(datum_pin_node_id)) {
            this._pod_remove_datum(datum_node_id)
          }
        }
      } else {
        this._pod_remove_datum(datum_node_id)
      }
    }

    for (const datum_node_id of datum_ids) {
      if (this._has_node(datum_node_id)) {
        this._sim_remove_datum(datum_node_id)
      }
    }

    removed_exposed_sub_pin_id = { input: {}, output: {} }
    removed_exposed_pin_id = { input: new Set(), output: new Set() }

    for (const exposed_pin_node_id of exposed_ids) {
      const { type, id, subPinId } = segmentExposedNodeId(exposed_pin_node_id)
      if (!removed_exposed_pin_id[type].has(id)) {
        const pin_count = this._get_exposed_pin_set_count(exposed_pin_node_id)
        if (pin_count === 1 || pin_count === 0) {
          removed_exposed_pin_id[type].add(id)
          this._sim_remove_exposed_pin_set(type, id)
        } else {
          if (
            !removed_exposed_sub_pin_id[type][id] ||
            !removed_exposed_sub_pin_id[type][id].has(subPinId)
          ) {
            removed_exposed_sub_pin_id[type][id] =
              removed_exposed_sub_pin_id[type][id] || new Set()
            removed_exposed_sub_pin_id[type][id].add(subPinId)
            this.__sim_remove_exposed_sub_pin(type, id, subPinId)
          }
        }
      }
    }

    for (const merge_node_id of merge_ids) {
      this._sim_remove_merge(merge_node_id)
    }

    for (const unit_id of unit_ids) {
      const merge_node_id = this._ref_unit_to_merge[unit_id]
      if (merge_node_id) {
        const self_pin_node_id = getSelfPinNodeId(unit_id)
        this._sim_remove_pin_or_merge(self_pin_node_id)
      }
      this._sim_remove_unit(unit_id)
    }

    for (const datum_node_id of datum_ids) {
      this._spec_remove_datum(datum_node_id)
    }

    removed_exposed_sub_pin_id = { input: {}, output: {} }
    removed_exposed_pin_id = { input: new Set(), output: new Set() }

    for (const exposed_pin_node_id of exposed_ids) {
      const { type, id, subPinId } = segmentExposedNodeId(exposed_pin_node_id)
      if (!removed_exposed_pin_id[type].has(id)) {
        const pin_count = this._get_exposed_pin_set_count(exposed_pin_node_id)
        if (pin_count === 1 || pin_count === 0) {
          removed_exposed_pin_id[type].add(id)
          this._spec_remove_exposed_pin_set(type, id)
        } else {
          if (
            !removed_exposed_sub_pin_id[type][id] ||
            !removed_exposed_sub_pin_id[type][id].has(subPinId)
          ) {
            removed_exposed_sub_pin_id[type][id] =
              removed_exposed_sub_pin_id[type][id] || new Set()
            removed_exposed_sub_pin_id[type][id].add(subPinId)
            this.__spec_remove_exposed_sub_pin(type, id, subPinId)
          }
        }
      }
    }
    for (const merge_node_id of merge_ids) {
      this.__spec_remove_merge(merge_node_id)
    }
    for (const unit_id of unit_ids) {
      this._spec_remove_unit(unit_id)
    }
  }

  private _spec_remove_nodes = (node_ids: string[]) => {
    for (const node_id of node_ids) {
      this._spec_remove_node(node_id)
    }
  }

  private _pod_remove_nodes = (node_ids: string[]) => {
    for (const node_id of node_ids) {
      this._pod_remove_node(node_id)
    }
  }

  private _sim_remove_exposed_pin_set = (
    type: 'input' | 'output',
    pin_id: string
  ): void => {
    // console.log('Graph', '_sim_remove_exposed_pin_set')
    this._exposed_pin_set_count--
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this.__sim_remove_exposed_sub_pin(type, pin_id, sub_pin_id)
    }
  }

  public remove_exposed_pin_set = (
    type: 'input' | 'output',
    pin_id: string
  ): void => {
    this.__remove_exposed_pin_set(type, pin_id)
    this._dispatchAction(coverPinSet(type, pin_id))
  }

  private __remove_exposed_pin_set = (
    type: 'input' | 'output',
    id: string
  ): void => {
    console.log('Graph', '_remove_exposed_pin_set', type, id)
    this._sim_remove_exposed_pin_set(type, id)
    this._spec_remove_exposed_pin_set(type, id)
    this._pod_remove_exposed_pin_set(type, id)
  }

  private _spec_remove_exposed_pin_set = (
    type: 'input' | 'output',
    id: string
  ): void => {
    // console.log('Graph', '_spec_remove_exposed_pin_set', type, id)
    this._spec = specReducer.coverPinSet({ id, type }, this._spec)
  }

  private _pod_remove_exposed_pin_set = (
    type: 'input' | 'output',
    id: string
  ): void => {
    // console.log('Graph', '_pod_remove_exposed_pin_set')
    this._pod.$coverPinSet({
      type,
      id,
    })
  }

  private __plug_exposed_pin_to = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    pin_node_id: string
  ): void => {
    let sub_pin_spec: GraphExposedSubPinSpec
    if (this._is_link_pin_node_id(pin_node_id)) {
      const { unitId, pinId } = segmentLinkPinNodeId(pin_node_id)
      sub_pin_spec = { unitId, pinId }
    } else {
      const { id: mergeId } = segmentMergeNodeId(pin_node_id)
      sub_pin_spec = { mergeId }
    }

    const pin_internal_pin_id = this._pin_to_internal[pin_node_id]
    if (pin_internal_pin_id) {
      const { id, subPinId } = segmentExposedNodeId(pin_internal_pin_id)
      this._unplug_exposed_pin(type, id, subPinId)
    }

    this.plug_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
  }

  public plug_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec
  ): void => {
    this._plug_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
    this._dispatchAction(plugPin(type, pin_id, sub_pin_id, sub_pin_spec))
  }

  private _plug_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec
  ): void => {
    // console.log('Graph', '_plug_exposed_pin')
    this._spec_plug_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
    this._sim_plug_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
    this._pod_plug_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
  }

  private _spec_plug_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec
  ): void => {
    const pin_node_id = getSubPinSpecNodeId(type, sub_pin_spec)
    // if pin is a ref, mark pin spec as a ref too
    const ref = this._is_pin_ref(pin_node_id)
    if (ref) {
      this._spec_set_exposed_pin_ref(type, pin_id, true)
    }

    this._spec = specReducer.plugPin(
      {
        type,
        id: pin_id,
        subPinId: sub_pin_id,
        subPinSpec: sub_pin_spec,
      },
      this._spec
    )
  }

  private _sim_refresh_exposed_pin_marker = (
    type: 'input' | 'output',
    ext_pin_node_id: string,
    int_pin_node_id: string,
    anchor_node_id: string | null
  ): void => {
    const input = type === 'input'

    const link_id_source_id = input ? ext_pin_node_id : int_pin_node_id
    const link_id_target_id = input ? int_pin_node_id : ext_pin_node_id

    const link_id = getLinkId(link_id_source_id, link_id_target_id)

    const start_marker = this._link_marker_start[link_id]
    const end_marker = this._link_marker_end[link_id]

    const marker = input ? end_marker : start_marker

    if (anchor_node_id) {
      const anchor_shape = this._get_node_shape(anchor_node_id)
      const anchor_r = this._get_node_r(anchor_node_id)
      const start_marker_d = describeArrowShape(anchor_shape, anchor_r)
      marker.setProp('d', start_marker_d)
    } else {
      const start_marker_d = describeArrowSemicircle(PIN_RADIUS)
      marker.setProp('d', start_marker_d)
    }
  }

  private _sim_plug_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec
  ): void => {
    // console.log(
    //   'Graph',
    //   '_sim_plug_exposed_pin',
    //   type,
    //   sub_pin_id,
    //   sub_pin_spec
    // )
    const ext_pin_node_id = getExternalNodeId(type, pin_id, sub_pin_id)
    const int_pin_node_id = getInternalNodeId(type, pin_id, sub_pin_id)

    const input = type === 'input'

    this._exposed_pin_plugged_count++
    this._exposed_pin_unplugged_count--

    const anchor_node_id: string = this._get_exposed_pin_spec_internal_node_id(
      type,
      sub_pin_spec
    )

    this._sim_refresh_exposed_pin_marker(
      type,
      ext_pin_node_id,
      int_pin_node_id,
      anchor_node_id
    )

    this._exposed_ext_plugged[ext_pin_node_id] = anchor_node_id
    this._exposed_int_plugged[int_pin_node_id] = anchor_node_id
    this._pin_to_internal[anchor_node_id] = int_pin_node_id

    delete this._exposed_ext_unplugged[ext_pin_node_id]
    delete this._exposed_int_unplugged[int_pin_node_id]

    const source_id = input ? ext_pin_node_id : int_pin_node_id
    const target_id = input ? int_pin_node_id : ext_pin_node_id
    const link_id = getLinkId(source_id, target_id)
    this._sim_change_link_node(link_id, anchor_node_id, !input)

    this._sim_remove_exposed_int_node(int_pin_node_id)

    this._start_graph_simulation(LAYER_EXPOSED)
  }

  private _pod_plug_exposed_pin = (
    type: 'input' | 'output',
    id: string,
    subPinId: string,
    subPin: GraphExposedSubPinSpec
  ): void => {
    // console.log('Graph', '_pod_plug_exposed_pin')
    this._pod.$plugPin({
      type,
      id,
      subPinId,
      subPin,
    })
  }

  public unplug_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string
  ): void => {
    this._unplug_exposed_pin(type, pin_id, sub_pin_id)
    this._dispatchAction(unplugPin(type, pin_id, sub_pin_id))
  }

  private _unplug_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string
  ): void => {
    // console.log('Graph', '_unplug_exposed_pin')
    this._sim_unplug_exposed_pin(type, pin_id, sub_pin_id)
    this._spec_unplug_exposed_pin(type, pin_id, sub_pin_id)
    this._pod_unplug_exposed_pin(type, pin_id, sub_pin_id)
  }

  private _spec_unplug_exposed_pin = (
    type: 'input' | 'output',
    id: string,
    subPinId: string
  ): void => {
    // console.log('Graph', '_spec_unplug_exposed_pin', type, id, subPinId)
    this._spec = specReducer.unplugPin({ type, id, subPinId }, this._spec)
  }

  private _sim_unplug_exposed_pin = (
    type: 'input' | 'output',
    pin_id: string,
    sub_pin_id: string
  ): void => {
    // console.log('Graph', '_sim_unplug_exposed_pin', type, pin_id, sub_pin_id)
    const sub_pin_spec = this._get_exposed_sub_pin_spec(
      type,
      pin_id,
      sub_pin_id
    )

    const ext_pin_node_id = getExternalNodeId(type, pin_id, sub_pin_id)
    const int_pin_node_id = getInternalNodeId(type, pin_id, sub_pin_id)

    const input = type === 'input'

    const anchor_node_id: string = this._get_exposed_pin_spec_internal_node_id(
      type,
      sub_pin_spec
    )

    this._sim_refresh_exposed_pin_marker(
      type,
      ext_pin_node_id,
      int_pin_node_id,
      null
    )

    delete this._exposed_ext_plugged[ext_pin_node_id]
    delete this._exposed_int_plugged[int_pin_node_id]

    delete this._pin_to_internal[anchor_node_id]

    this._exposed_ext_unplugged[ext_pin_node_id] = true
    this._exposed_int_unplugged[int_pin_node_id] = true

    this._exposed_pin_plugged_count--
    this._exposed_pin_unplugged_count++

    const pin_position = this._get_node_position(anchor_node_id)
    const ext_pin_position = this._get_node_position(ext_pin_node_id)
    const u = unitVector(
      ext_pin_position.x,
      ext_pin_position.y,
      pin_position.x,
      pin_position.y
    )
    const x = ext_pin_position.x + u.x * 1.5 * LINK_DISTANCE
    const y = ext_pin_position.y + u.y * 1.5 * LINK_DISTANCE

    this._sim_add_internal_pin(type, pin_id, sub_pin_id, { x, y })

    const source_id = input ? ext_pin_node_id : int_pin_node_id
    const target_id = input ? int_pin_node_id : ext_pin_node_id
    const link_id = getLinkId(source_id, target_id)
    this._sim_change_link_node(link_id, int_pin_node_id, !input)

    this._refresh_exposed_sub_pin_color(type, pin_id, sub_pin_id)
  }

  private _pod_unplug_exposed_pin = (
    type: 'input' | 'output',
    id: string,
    subPinId: string
  ): void => {
    this._pod.$unplugPin({
      type,
      id,
      subPinId,
    })
  }

  private _has_node = (node_id: string): boolean => {
    return !!this._node[node_id]
  }

  private _has_link = (link_id: string): boolean => {
    return !!this._link[link_id]
  }

  private _resize_start_component = (unit_id: string): void => {
    // console.log('Graph', '_resize_start_component')
    if (this._tree_layout) {
      //
    } else {
      this._sim_resize_start_component(unit_id)
    }
  }

  private _sim_resize_start_component = (unit_id: string): void => {
    const node = this._node[unit_id]
    node.fx = node.x
    node.fy = node.y
  }

  private _delta_resize_component = (
    unit_id: string,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void => {
    // console.log('Graph', unit_id, dx, dy, dw, dh)
    if (this._tree_layout) {
      this._layout_delta_resize_component(unit_id, dx, dy, dw, dh)
    } else {
      this._spec_delta_resize_component(unit_id, dx, dy, dw, dh)
    }
  }

  private _spec_delta_resize_component = (
    unit_id: string,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void => {
    const { $sx } = this.$context

    const { width, height } = this._get_unit_component_graph_size(unit_id)

    let nextWidth = width
    let nextHeight = height

    const k = this._zoom.k * $sx
    dw = dw / k
    dh = dh / k
    dx = dx / k
    dy = dy / k

    const tryWidth = width + dw
    const tryHeight = height + dh

    let resized = false
    if (
      dw !== 0 &&
      (dw > 0 || tryWidth >= MIN_WIDTH) &&
      (dw < 0 || tryWidth <= MAX_WIDTH)
    ) {
      nextWidth = tryWidth
      resized = true
    }
    if (
      dh !== 0 &&
      (dh > 0 || tryHeight >= MIN_HEIGHT) &&
      (dh < 0 || tryHeight <= MAX_HEIGHT)
    ) {
      nextHeight = tryHeight
      resized = true
    }
    if (resized) {
      this._sim_resize_sub_component(unit_id, nextWidth, nextHeight)
      this._spec_resize_sub_component(unit_id, nextWidth, nextHeight)

      const node = this._node[unit_id]
      node.fx! += dx
      node.fy! += dy
      node.x = node.fx!
      node.y = node.fy!

      this._start_graph_simulation(LAYER_NORMAL)
    }
  }

  private _layout_delta_resize_component = (
    unit_id: string,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void => {
    const { $width } = this.$context
    const { width, height } = this._get_unit_component_layout_size(unit_id)

    let nextWidth = width
    let nextHeight = height

    const _dw = 2 * dw
    const _dh = 2 * dh

    const tryWidth = width + _dw
    const tryHeight = height + _dh

    const _MAX_WIDTH = Math.min(
      MAX_WIDTH,
      $width - 2 * LAYOUT_HORIZONTAL_PADDING
    )

    let resized = false
    if (
      dw !== 0 &&
      (dw > 0 || tryWidth >= MIN_WIDTH) &&
      (dw < 0 || tryWidth <= _MAX_WIDTH)
    ) {
      nextWidth = tryWidth
      resized = true
    }
    if (
      dh !== 0 &&
      (dh > 0 || tryHeight >= MIN_HEIGHT) &&
      (dh < 0 || tryHeight <= MAX_HEIGHT)
    ) {
      nextHeight = tryHeight
      resized = true
    }

    if (resized) {
      this._layout_resize_sub_component(unit_id, nextWidth, nextHeight)
      this._component_resize_sub_component(unit_id, nextWidth, nextHeight)
    }
  }

  private _resize_end_component = (unit_id: string): void => {
    const node = this._node[unit_id]
    node.fx = undefined
    node.fy = undefined

    const { width, height } = this._get_unit_component_graph_size(unit_id)

    this._pod_set_unit_metadata_component_size(unit_id, width, height)

    this._pod_component_set_default_size()
  }

  private _pod_set_unit_metadata_component_size = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    this._pod_set_metadata(['units', unit_id, 'metadata', 'component'], {
      width,
      height,
    })
  }

  private _is_node_selectable = (node_id: string): boolean => {
    // if (this._is_external_pin_node_id(node_id)) {
    //   return false
    // }
    if (this._is_datum_node_id(node_id) && this._hidden_data_node[node_id]) {
      return false
    }
    return true
  }

  private _is_unit_component = (unit_id: string): boolean => {
    const unit = this._get_unit(unit_id)
    const { path } = unit
    return isComponent(path)
  }

  private _is_unit_base = (unit_id: string): boolean => {
    const spec_id = this._get_unit_spec_id(unit_id)
    return isBaseSpecId(spec_id)
  }

  private _is_datum_class_literal = (datum_node_id: string): boolean => {
    const datum_tree = this._get_datum_tree(datum_node_id)
    const is_class_literal = datum_tree.type === TreeNodeType.Unit
    return is_class_literal
  }

  private _get_unit_position = (unit_id: string): Dict<Position> => {
    const position: Dict<Position> = {}
    position[unit_id] = this._get_node_position(unit_id)
    this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
      const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)
      position[pin_node_id] = this._get_node_position(anchor_node_id)
    })
    return position
  }

  private _get_unit_state = (unit_id: string): State => {
    const state = this._graph_state[unit_id]
    return state
  }

  private _set_unit_position = (
    unit_id: string,
    position: Dict<Position>
  ): void => {
    const unit_position = position[unit_id]
    this._set_node_position(unit_id, unit_position)
    this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
      const pin_position = position[pin_node_id]
      this._set_node_position(pin_node_id, pin_position)
    })
  }

  private _get_unit_pin_position = (unit_id: string): UnitPinPosition => {
    const unit_pin_position: UnitPinPosition = {
      input: {},
      output: {},
    }
    this._for_each_unit_pin(unit_id, (pin_node_id, type, pin_id) => {
      const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)
      unit_pin_position[type][pin_id] = this._get_node_position(anchor_node_id)
    })
    return unit_pin_position
  }

  private _get_merge_position = (merge_node_id: string): Position => {
    const merge_unit_id = this._merge_to_ref_unit[merge_node_id]
    if (merge_unit_id) {
      const unit_node = this._node[merge_unit_id]
      const { x, y } = unit_node
      return { x, y }
    }

    const merge_ref_output_id = this._merge_to_ref_output[merge_node_id]
    if (merge_ref_output_id) {
      const ref_output_node = this._node[merge_ref_output_id]
      const { x, y } = ref_output_node
      return { x, y }
    }

    const merge_node = this._node[merge_node_id]
    const { x, y } = merge_node
    return { x, y }
  }

  private _get_exposed_pin_set_position = (
    type: 'input' | 'output',
    id: string
  ): Dict<{ int?: Position; ext?: Position }> => {
    const position = {}
    const pin_spec = this._get_exposed_pin_spec(type, id)
    const { pin = {} } = pin_spec
    for (const sub_pin_id in pin) {
      const ext_pin_node_id = getExternalNodeId(type, id, sub_pin_id)
      const int_pin_node_id = getInternalNodeId(type, id, sub_pin_id)
      const internal_pin_anchor_node_id =
        this._get_internal_pin_anchor_node_id(int_pin_node_id)
      const int = this._get_node_position(internal_pin_anchor_node_id)
      const ext = this._get_node_position(ext_pin_node_id)
      position[sub_pin_id] = { int, ext }
    }
    return position
  }

  private _on_pointer_down = (event: IOPointerEvent, _event: PointerEvent) => {
    // console.log('Graph', '_on_pointer_down')
    const { pointerId } = event

    const { clientX, clientY } = event

    // if (event.button === 2) {
    //   return
    // }

    if (this._restart_gesture) {
      this._start_gesture(event)
      return
    }

    if (!this._search_hidden) {
      _event.preventDefault()
    }

    if (this._control) {
      if (!this._control_lock) {
        this._temp_control_lock = true

        this._control.dispatchEvent('temp_lock', {}, false)

        this._lock_control()
        // this.focus()
      }
    }

    const position = { x: clientX, y: clientY }

    this._pointer_position[pointerId] = position

    if (!this._pointer_down[pointerId]) {
      this._pointer_down[pointerId] = true
      this._pointer_down_move_count[pointerId] = 0
      this._pointer_down_position[pointerId] = position
      this._pointer_down_count++
    }

    if (this._is_background_pointer_event(event)) {
      this._main.setPointerCapture(pointerId)
    }

    if (this._mode === 'multiselect') {
      this._on_multiselect_area_start(event)
    }

    if (!this._long_press_collapsing) {
      if (this._pointer_down_count === 2) {
        const [pointer_id_0, pointer_id_1] = Object.keys(this._pointer_down)
        const { x: x0, y: y0 } = this._pointer_position[pointer_id_0]
        const { x: x1, y: y1 } = this._pointer_position[pointer_id_1]
        const d = distance(x0, y0, x1, y1)
        if (this._pressed_node_pointer_count === 0) {
          const x = (x0 + x1) / 2
          const y = (y0 + y1) / 2
          const position = {
            x,
            y,
          }
          this._touch_zoom_position_start = position
          this._touch_zoom_position = position
          this._touch_zoom_d = d
        } else if (
          this._pressed_node_pointer_count === 2 &&
          Object.keys(this._pressed_node_id_pointer_id).length === 1
        ) {
          const [[node_id]] = Object.entries(this._pressed_node_id_pointer_id)
          const node = this._node[node_id]
          const { x, y, width, height } = node
          const position = {
            x: x + width / 2 - this._zoom.x,
            y: y + height / 2 - this._zoom.y,
          }
          this._touch_zoom_position_start = position
          this._touch_zoom_position = position
          this._touch_zoom_d = d
        }
      }
    }
  }

  private _zoom_center_at_node = (node_id: string) => {
    const { x, y } = this._node[node_id]
    this._zoom_center_at(x, y)
  }

  private _zoom_center_at = (x: number, y: number): void => {
    const { $width, $height } = this.$context
    const zoom = zoomTransformCenteredAt(x, y, this._zoom.k, $width, $height)
    this.set_zoom(zoom)
  }

  private _translate_x: number = 0
  private _translate_y: number = 0

  private _ui_move_component = (unit_id: string, i: number): void => {
    // console.log('Graph', '_ui_move_component', unit_id, i)
    this._spec_move_component(unit_id, i)

    this._layout_move_sub_component(unit_id, i)

    this._sim_move_component(unit_id, i)

    if (this._is_fullwindow) {
      this._reorder_all_fullwindow()
    }

    this._animate_all_current_layout_layer_node()
  }

  private _layout_move_sub_component = (unit_id: string, i: number): void => {
    const sub_component = this._get_sub_component(unit_id)
    const parent_id = this._get_sub_component_spec_parent_id(unit_id)
    if (parent_id) {
      const parent_sub_component = this._get_sub_component(parent_id)
      parent_sub_component.pullParentRoot(sub_component)
      const slot = this._get_sub_component_slot_name(unit_id)
      parent_sub_component.fitParentRoot(sub_component, i, slot)
    } else {
      const { component } = this.$props
      component.pullRoot(sub_component)
      component.fitRoot(sub_component, i)
    }
  }

  private _spec_move_component = (unit_id: string, i: number): void => {
    // console.log('Graph', '_spec_move_component', a, b)
    const parent_id = this._get_sub_component_spec_parent_id(unit_id)

    const children = this._get_sub_component_spec_layer(unit_id)

    const a_i = children.indexOf(unit_id)

    let _children = [...children]

    _children.splice(a_i, 1)
    _children.splice(i, 0, unit_id)

    if (parent_id) {
      this._spec.component = componentReducer.setSubComponentChildren(
        { id: parent_id, children: _children },
        this._spec.component || {}
      )
    } else {
      this._spec.component = componentReducer.setChildren(
        { children: _children },
        this._spec.component || {}
      )
    }

    this._refresh_tree_sub_component_index()
  }

  private _sim_move_component = (unit_id: string, i: number): void => {
    // console.log('Graph', '_sim_move_component', unit_id, i)
    const parent_id = this._get_sub_component_spec_parent_id(unit_id)
    this._refresh_layout_node_target_position(parent_id)
  }

  private _pod_move_component_after = (a: string, b: string): void => {
    // console.log('Graph', '_pod_move_component_after', a, b)
  }

  private _ui_swap_component_children = (a: string, b: string): void => {
    // console.log('Graph', '_ui_swap_component_children', a, b)
    this._spec_swap_component_children(a, b)
    this._sim_swap_component_children(a, b)
  }

  private _spec_swap_component_children = (a_id: string, b_id: string) => {
    const children = this._get_component_spec_children()

    const a_i = children.indexOf(a_id)
    const b_i = children.indexOf(b_id)

    const _children = swap(children, a_i, b_i)

    this._spec.component = componentReducer.setChildren(
      { children: _children },
      this._spec.component || {}
    )

    this._refresh_tree_sub_component_index()
  }

  private _sim_swap_component_children = (a: string, b: string) => {
    this._refresh_current_layout_node_target_position()
  }

  private _pod_swap_component_children = (a: string, b: string) => {}

  private _on_layout_component_drag_start = (
    unit_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_layout_component_drag_start', unit_id)
    const { clientX, clientY } = event

    this._layout_drag_node_count++
    if (this._layout_drag_node_count === 1) {
      this._layout_dragging = true
    }
    this._layout_drag_node[unit_id] = true
    this._layout_drag_index[unit_id] =
      this._get_sub_component_tree_index(unit_id)
    this._layout_drag_direction[unit_id] = undefined

    const parent_layout_layer = this._get_parent_layout_layer(unit_id)

    this._layout_drag_start_scroll_top[unit_id] =
      parent_layout_layer.layer.$element.scrollTop
    this._layout_drag_start_scroll_height[unit_id] =
      parent_layout_layer.layer.$element.scrollHeight
    this._layout_drag_start_position[unit_id] = { x: clientX, y: clientY }

    const children = this._get_sub_component_spec_layer(unit_id)

    this._layout_drag_start_children[unit_id] = children

    for (const child_id of children) {
      const layout_target_node = this._layout_target_node[child_id]

      const { x, y } = layout_target_node

      this._layout_drag_init_position[child_id] = { x, y }
    }

    const layout_core = this._layout_core[unit_id]
    // mergeStyle(layout_core, {
    //   zIndex: '1000',
    // })
    layout_core.$element.style.zIndex = '1000'
  }

  private _on_layout_component_drag_move = (
    unit_id: string,
    event: IOPointerEvent
  ) => {
    const { clientX, clientY } = event

    const drag_start_position = this._layout_drag_start_position[unit_id]
    const scroll_top_start = this._layout_drag_start_scroll_top[unit_id]
    const position = this._layout_drag_init_position[unit_id]

    const parent_layout_layer = this._get_parent_layout_layer(unit_id)

    const { scrollTop = 0 } = parent_layout_layer.layer.$element

    if (drag_start_position.y >= clientY) {
      this._layout_drag_direction[unit_id] = 'down'
    } else {
      this._layout_drag_direction[unit_id] = 'up'
    }

    const x = clientX + position.x - drag_start_position.x
    const y =
      clientY +
      position.y -
      drag_start_position.y +
      (scrollTop - scroll_top_start)

    this._set_layout_core_position(unit_id, x, y)

    const layout_target_node = this._layout_target_node[unit_id]

    layout_target_node.x = x
    layout_target_node.y = y

    this._refresh_drag_layout_component_index(unit_id)

    this._refresh_drag_layout_component_scroll(unit_id)
  }

  private _refresh_drag_layout_component_index = (unit_id: string) => {
    const { x, y, width, height } = this._layout_node[unit_id]

    const node = { x, y, width, height, shape: 'rect' as Shape, r: width }

    let closest_unit_id: string | null = null

    let D = Number.MAX_SAFE_INTEGER

    const layout_layer_node = this._get_layout_layer_parent_children(unit_id)

    for (const _unit_id of layout_layer_node) {
      if (unit_id !== _unit_id) {
        const _position = this._layout_drag_init_position[_unit_id]
        const _node = this._layout_node[_unit_id]

        const { x: _x, y: _y } = _position
        const { width: _width, height: _height } = _node

        const { d, l } = surfaceDistance(node, {
          x: _x,
          y: _y,
          width: _width,
          height: _height,
          r: _width / 2,
          shape: 'rect',
        })
        if (l < 0) {
          if (d < D) {
            closest_unit_id = _unit_id
            D = d
          }
        }
      }
    }

    const start_children = this._layout_drag_start_children[unit_id]

    const init_drag_index = this._layout_drag_index[unit_id]

    const layout_drag_swap = this._layout_drag_swap[unit_id]
    const layout_drag_swap_index = this._layout_drag_swap_index[unit_id]

    // console.log('closest_unit_id', closest_unit_id)

    if (closest_unit_id) {
      if (layout_drag_swap !== closest_unit_id) {
        // if (layout_drag_swap) {
        //   this._ui_move_component(layout_drag_swap, init_drag_index)
        // }
        const closest_unit_index = start_children.indexOf(closest_unit_id)
        this._layout_drag_swap[unit_id] = closest_unit_id
        this._layout_drag_swap_index[unit_id] = closest_unit_index
        this._ui_move_component(unit_id, closest_unit_index)
      }
    } else {
      const layout_drag_swap = this._layout_drag_swap[unit_id]
      if (layout_drag_swap) {
        delete this._layout_drag_swap[unit_id]
        delete this._layout_drag_swap_index[unit_id]
        // this._ui_move_component(layout_drag_swap, layout_drag_swap_index)
        this._ui_move_component(unit_id, init_drag_index)
      }
    }
  }

  private _refresh_drag_layout_component_scroll = (unit_id: string) => {
    // console.log('Graph', '_refresh_drag_layout_scroll', unit_id)
    const start_scroll_height = this._layout_drag_start_scroll_height[unit_id]
    const drag_direction = this._layout_drag_direction[unit_id]
    const D = 1 / 2

    this._refresh_layout_component_scroll(
      unit_id,
      start_scroll_height,
      drag_direction,
      D,
      (d: number) => {
        const node = this._layout_node[unit_id]
        this._set_layout_core_position(unit_id, node.x, node.y + d)

        this._refresh_drag_layout_component_index(unit_id)
        this._refresh_drag_layout_component_scroll(unit_id)
      }
    )
  }

  private _refresh_layout_component_scroll = (
    unit_id: string,
    start_scroll_height: number,
    drag_direction: 'up' | 'down',
    D: number,
    tick: (d: number) => void
  ): void => {
    // console.log('Graph', '_refresh_layout_component_scroll', unit_id)
    const { $height } = this.$context

    const node = this._layout_node[unit_id]

    if (this._layout_scroll_animation) {
      cancelAnimationFrame(this._layout_scroll_animation)
      this._layout_scroll_animation = undefined
    }

    let animate = false
    let d = 0

    const parent_layout_layer = this._get_parent_layout_layer(unit_id)

    const { scrollTop = 0, scrollHeight } = parent_layout_layer.layer.$element

    const PADDING = 60

    const { y, height } = node

    if (drag_direction === 'up' && scrollTop < start_scroll_height - $height) {
      const dy = y + height / 2 - scrollTop - $height / 2 + PADDING
      if (dy > 0) {
        animate = true
        d = D * dy
      }
    } else if (drag_direction === 'down' && scrollTop > 0) {
      const dy = y - height / 2 + $height / 2 - scrollTop - PADDING
      if (dy < 0) {
        animate = true
        d = D * dy
      }
    }

    if (animate) {
      const frame = () => {
        parent_layout_layer.layer.$element.scrollTop = Math.min(
          scrollTop + d,
          scrollHeight
        )

        tick(d)
      }

      this._layout_scroll_animation = requestAnimationFrame(frame)
    }
  }

  private _on_layout_component_drag_end = (node_id: string): void => {
    // console.log('Graph', '_on_layout_component_drag_end', node_id)
    const layout_core = this._layout_core[node_id]
    // mergeStyle(layout_core, {
    //   zIndex: '',
    // })
    layout_core.$element.style.zIndex = ''

    this._layout_drag_node_count--
    if (this._layout_drag_node_count === 0) {
      this._layout_dragging = false
    }
    delete this._layout_drag_node[node_id]
    delete this._layout_drag_index[node_id]
    delete this._layout_drag_swap[node_id]
    delete this._layout_drag_start_position[node_id]
    delete this._layout_drag_direction[node_id]
    delete this._layout_drag_start_scroll_height[node_id]
    delete this._layout_drag_start_scroll_top[node_id]

    const children = this._get_component_spec_children()
    for (const child_id of children) {
      delete this._layout_drag_init_position[child_id]
    }

    if (this._layout_scroll_animation) {
      cancelAnimationFrame(this._layout_scroll_animation)
      this._layout_scroll_animation = undefined
    }

    const parent_id = this._sub_component_parent[node_id] || null

    this._refresh_layout_node_target_position(parent_id)

    this._animate_all_layout_layer_node(parent_id)
  }

  private _drag_start = (node_id: string, event: IOPointerEvent): void => {
    // console.log('_drag_start', node_id)
    const { clientX, clientY, pointerId } = event

    const layer = this._get_node_default_layer(node_id)
    this._start_graph_simulation(layer)

    const [x, y] = zoomInvert(
      this._zoom,
      clientX - this._translate_x,
      clientY - this._translate_y
    )

    this._drag_node_pointer_id[node_id] = pointerId
    this._node_drag_start(node_id, x, y)
    if (this._selected_node_id[node_id]) {
      for (let selected_node_id in this._selected_node_id) {
        if ((this._node_pressed_count[selected_node_id] || 0) === 0) {
          this._drag_node_pointer_id[selected_node_id] = pointerId
          this._node_drag_start(selected_node_id, x, y)
        }
      }
    }
    if (this._is_external_pin_node_id(node_id)) {
      const { type, id, subPinId } = segmentExposedNodeId(node_id)
      const exposed_int_node_id = getInternalNodeId(type, id, subPinId)
      if (this._has_node(exposed_int_node_id)) {
        this._drag_node_pointer_id[exposed_int_node_id] = pointerId
        this._node_drag_start(exposed_int_node_id, x, y)
      }
    } else if (this._is_internal_pin_node_id(node_id)) {
      const { type, id, subPinId } = segmentExposedNodeId(node_id)
      const exposed_ext_node_id = getExternalNodeId(type, id, subPinId)
      this._drag_node_pointer_id[exposed_ext_node_id] = pointerId
      this._node_drag_start(exposed_ext_node_id, x, y)
    }
  }

  private _drag_move = (node_id: string, event: IOPointerEvent): void => {
    // console.log('_drag_move', node_id)
    const { clientX, clientY, pointerId } = event

    const node_layer = this._get_node_default_layer(node_id)
    this._start_graph_simulation(node_layer)

    const [x, y] = zoomInvert(
      this._zoom,
      clientX - this._translate_x,
      clientY - this._translate_y
    )

    if (this._is_draggable_mode()) {
      this._node_drag_move(node_id, x, y)

      if (this._selected_node_id[node_id]) {
        for (let selected_node_id in this._selected_node_id) {
          if ((this._node_pressed_count[selected_node_id] || 0) === 0) {
            if (this._drag_node_pointer_id[selected_node_id] !== pointerId) {
              this._drag_node_pointer_id[selected_node_id] = pointerId
              this._node_drag_start(selected_node_id, x, y)
            }
            this._node_drag_move(selected_node_id, x, y)
          }
        }
      }
    }
    if (this._is_datum_node_id(node_id)) {
      const pull_datum = (datum_node_id: string) => {
        const datum_anchor_node_id =
          this._get_datum_pin_anchor_node_id(datum_node_id)
        if (datum_anchor_node_id) {
          const datum_pin_node = this._node[datum_anchor_node_id]
          const datum_node = this._node[datum_node_id]
          const { l } = surfaceDistance(datum_pin_node, datum_node)
          if (l > 2 * LINK_DISTANCE) {
            this._remove_datum_link(datum_node_id)
          }
        }
      }
      if (this._selected_node_id[node_id]) {
        for (let selected_node_id in this._selected_node_id) {
          if (this._is_datum_node_id(selected_node_id)) {
            pull_datum(selected_node_id)
          }
        }
      } else {
        pull_datum(node_id)
      }
    } else if (this._is_internal_pin_node_id(node_id)) {
      const { type, id, subPinId } = segmentExposedNodeId(node_id)
      const exposed_ext_node_id = getExternalNodeId(type, id, subPinId)
      if (this._is_draggable_mode()) {
        this._node_drag_move(exposed_ext_node_id, x, y)
      }
    } else if (this._is_external_pin_node_id(node_id)) {
      const { type, id, subPinId } = segmentExposedNodeId(node_id)
      const exposed_int_node_id = getInternalNodeId(type, id, subPinId)
      if (this._has_node(exposed_int_node_id)) {
        if (this._is_draggable_mode()) {
          this._node_drag_move(exposed_int_node_id, x, y)
        }
      } else {
        let anchor_node_id: string | undefined =
          this._get_exposed_pin_internal_node_id(type, id, subPinId)
        if (anchor_node_id) {
          const exposed_pin_node = this._node[node_id]
          const pin_node = this._node[anchor_node_id]
          const { l } = surfaceDistance(exposed_pin_node, pin_node)
          if (l > 1.5 * LINK_DISTANCE) {
            this.unplug_exposed_pin(type, id, subPinId)
            this._drag_node_pointer_id[exposed_int_node_id] = pointerId
            this._node_drag_start(exposed_int_node_id, x, y)
            this._node_drag_move(exposed_int_node_id, x, y)
          }
        }
      }
    } else if (this._is_err_node_id(node_id)) {
      const { unitId } = segmentErrNodeId(node_id)
      const err_node = this._node[node_id]
      const unit_node = this._node[unitId]
      const { l } = surfaceDistance(unit_node, err_node)
      if (l > 1.5 * LINK_DISTANCE) {
        this._pod_remove_unit_err(unitId)
        // AD HOC
        this._removing_err = true
      }
    }
  }

  private _on_node_green_drag_start = (
    node_id: string,
    event: IOPointerEvent,
    _event: PointerEvent
  ): string => {
    // console.log('Graph', '_on_node_green_drag_start', node_id)
    const { pointerId } = event

    let new_node_id: string | null
    if (this._is_unit_node_id(node_id)) {
      new_node_id = this._sim_duplicate_unit(node_id)
    } else {
      new_node_id = this._duplicate_datum(node_id)
    }

    if (new_node_id) {
      this._green_drag = true
      this._green_drag_node_id = node_id
      this._green_drag_clone_id = new_node_id

      this._on_node_pointer_leave(node_id, event)
      this._on_pointer_up(event)

      this._set_drag_node(node_id, false)

      this._on_node_pointer_down(new_node_id, event)
      this._on_pointer_down(event, _event)

      this._set_drag_node(new_node_id, true)

      this._ascend_node(new_node_id, pointerId)
    }

    return new_node_id
  }

  private _on_node_green_drag_end = (node_id: string) => {
    if (this._is_unit_node_id(node_id)) {
      const unit = this._get_unit(node_id)

      const new_unit = clone(unit)

      if (this._mode === 'data') {
        const green_drag_node_id = this._green_drag_node_id
        const state = this._get_unit_state(green_drag_node_id)
        const _state = clone(state)
        console.log(_state)
        new_unit.state = _state

        if (this._is_unit_component(green_drag_node_id)) {
          const component = this._get_sub_component(green_drag_node_id)

          const { $children } = component

          const children = $children.map((c) => {
            const { id } = c.constructor as typeof Component
            return {
              id,
              state: {}, // TODO
            }
          })

          new_unit.children = children
        }
      }

      this._pod_add_unit(node_id, new_unit)

      if (this._is_unit_component(node_id)) {
        this._sim_add_unit_component(node_id)
        this._pod_add_unit_component(node_id)
      }
    }
    this._green_drag = false
    this._green_drag_node_id = null
    this._green_drag_clone_id = null
  }

  private _on_node_red_drag_start = (
    node_id: string,
    pointer_id: number
  ): void => {
    if (this._is_unit_node_id(node_id)) {
      this._on_unit_red_drag_start(node_id)
    } else if (this._is_link_pin_node_id(node_id)) {
      const { unitId } = segmentLinkPinNodeId(node_id)
      this._on_node_red_drag_start(unitId, pointer_id)
    }

    this._ascend_node(node_id, pointer_id)
  }

  // private _set_all_nodes_fixed = () => {
  // }

  private _on_node_red_drag_end = (node_id: string): void => {}

  private _on_unit_red_drag_start = (unit_id: string): void => {
    // console.log('Graph', '_on_unit_red_drag_start')
    this._remove_unit_merges(unit_id)

    const unit_merge_node_id = this._ref_unit_to_merge[unit_id]
    if (unit_merge_node_id) {
      const self_pin_node_id = getSelfPinNodeId(unit_id)
      this._remove_pin_from_merge(unit_merge_node_id, self_pin_node_id)
    }
  }

  private _on_node_blue_drag_start = (
    node_id: string,
    pointer_id: number
  ): void => {
    if (this._is_unit_node_id(node_id)) {
      this._on_unit_blue_drag_start(node_id)
    } else if (this._is_datum_node_id(node_id)) {
      this._on_datum_blue_drag_start(node_id)
    }
    this._ascend_node(node_id, pointer_id)
  }

  private _on_unit_blue_drag_start = (unit_id: string): void => {
    this._blue_drag = true
    this._blue_drag_init_id = unit_id
    this._blue_drag_init_start_position = this._get_unit_position(unit_id)
    this._blue_drag_init_pin_to_anchor = this._remove_unit_merges(unit_id)
    this._blue_drag_init_anchor_to_pin = invertObj(
      this._blue_drag_init_pin_to_anchor
    )

    this._set_all_unit_node_fixed(true)
    this._refresh_unit_fixed(unit_id)

    this._refresh_unit_blue_drag_anchor(
      this._blue_drag_init_pin_to_anchor,
      true
    )
  }

  private _on_datum_blue_drag_start = (datum_node_id: string): void => {
    // TODO
  }

  private _refresh_unit_blue_drag_anchor = (
    unit_merge_anchor: Dict<string>,
    anchored: boolean
  ): void => {
    for (const pin_node_id in unit_merge_anchor) {
      const { type } = segmentLinkPinNodeId(pin_node_id)
      const merge_anchor_node_id = unit_merge_anchor[pin_node_id]
      if (anchored) {
        const merge_anchor_position =
          this._get_node_position(merge_anchor_node_id)
        this._set_node_position(pin_node_id, merge_anchor_position)
      }
      if (merge_anchor_node_id) {
        if (type === 'input') {
          if (this._is_output_node_id(merge_anchor_node_id)) {
            this._set_output_reduced(merge_anchor_node_id, anchored)
          }
        } else {
          this._set_output_reduced(pin_node_id, anchored)
        }
        this._set_node_fixed(pin_node_id, anchored)
      }
    }
  }

  private _on_unit_blue_drag_move = (unit_id: string): void => {
    if (this._blue_drag_init_id === unit_id) {
      const init_unit_position = this._node[this._blue_drag_init_id]
      const init_unit_start_position =
        this._blue_drag_init_start_position[unit_id]

      if (this._blue_drag_hover_id) {
        const hover_init_position =
          this._blue_drag_hover_position[this._blue_drag_hover_id]
        const d = pointDistance(init_unit_position, hover_init_position)
        if (d > NEAR / 2) {
          this._blue_drag_hover_return()
          this._refresh_unit_fixed(this._blue_drag_init_id)
          this._for_each_unit_output(
            this._blue_drag_init_id,
            (output_node_id) => {
              this._set_output_reduced(output_node_id, false)
            }
          )
          this._blue_drag_hover_id = null
        }
      } else {
        if (
          pointDistance(init_unit_position, init_unit_start_position) >
          NEAR / 2
        ) {
          this._refresh_unit_fixed(unit_id)
          this._refresh_unit_blue_drag_anchor(
            this._blue_drag_init_pin_to_anchor,
            false
          )
        } else {
          this._refresh_unit_blue_drag_anchor(
            this._blue_drag_init_pin_to_anchor,
            true
          )
        }
      }

      const nearest_unit_id = this._find_nearest_core_id(
        unit_id,
        NEAR / 2,
        (a, b) => pointDistance(a, b),
        (node_id: string) => {
          if (node_id === this._blue_drag_hover_id) {
            return false
          }
          return true
        }
      )

      if (nearest_unit_id) {
        if (this._blue_drag_hover_id) {
          this._blue_drag_hover_return()
        }

        this._blue_drag_hover_id = nearest_unit_id

        this._blue_drag_hover_merge_anchor =
          this._remove_unit_merges(nearest_unit_id)

        this._blue_drag_hover_position =
          this._get_unit_position(nearest_unit_id)

        this._set_all_unit_node_fixed(true)

        this._refresh_unit_fixed(unit_id)

        this._refresh_unit_fixed(nearest_unit_id)
        this._negate_unit_layer(nearest_unit_id)

        const blue_drag_init_unit_position =
          this._blue_drag_init_start_position[this._blue_drag_init_id]
        this._set_node_position(nearest_unit_id, blue_drag_init_unit_position)
        this._set_node_fixed(nearest_unit_id, true)

        // TODO this._set_unit_position(node_id, this._blue_drag_unit_init_position)
        let remaining_init_merge_anchor = clone(
          this._blue_drag_init_pin_to_anchor
        )
        this._for_each_unit_pin(
          this._blue_drag_hover_id,
          (pin_node_id: string, type) => {
            let matched = false
            for (const init_pin_node_id in remaining_init_merge_anchor) {
              const { type: _type } = segmentLinkPinNodeId(init_pin_node_id)
              if (type === _type) {
                if (
                  this._is_link_pin_link_pin_type_match(
                    pin_node_id,
                    type,
                    init_pin_node_id,
                    _type
                  )
                ) {
                  const init_anchor_node_id =
                    remaining_init_merge_anchor[init_pin_node_id]
                  const init_pin_node_position =
                    this._blue_drag_init_start_position[init_pin_node_id]
                  this._blue_drag_hover_swap[pin_node_id] = init_anchor_node_id
                  this._set_node_position(pin_node_id, init_pin_node_position)
                  if (type === 'input') {
                    if (this._is_output_node_id(init_anchor_node_id)) {
                      this._set_output_reduced(init_anchor_node_id, true)
                    }
                  } else {
                    this._set_output_reduced(pin_node_id, true)
                  }
                  this._set_node_fixed(pin_node_id, true)
                  remaining_init_merge_anchor = _dissoc(
                    remaining_init_merge_anchor,
                    init_pin_node_id
                  )
                  matched = true
                  break
                }
              }
            }
            if (!matched) {
              // TODO
            }
          }
        )

        let remaining_hover_merge_anchor = clone(
          this._blue_drag_hover_merge_anchor
        )
        this._for_each_unit_pin(
          this._blue_drag_init_id,
          (pin_node_id: string, type) => {
            for (const hover_pin_node_id in remaining_hover_merge_anchor) {
              const { type: _type } = segmentLinkPinNodeId(hover_pin_node_id)
              if (type === _type) {
                if (
                  this._is_link_pin_link_pin_type_match(
                    pin_node_id,
                    type,
                    hover_pin_node_id,
                    _type
                  )
                ) {
                  const hover_anchor_node_id =
                    remaining_hover_merge_anchor[hover_pin_node_id]
                  const hover_pin_node_position =
                    this._blue_drag_hover_position[hover_pin_node_id]
                  this._blue_drag_init_swap[pin_node_id] = hover_anchor_node_id
                  this._set_node_position(pin_node_id, hover_pin_node_position)
                  if (type === 'input') {
                    if (this._is_output_node_id(hover_anchor_node_id)) {
                      this._set_output_reduced(hover_anchor_node_id, true)
                    }
                  } else {
                    this._set_output_reduced(pin_node_id, true)
                  }
                  this._set_node_fixed(pin_node_id, true)
                  remaining_hover_merge_anchor = _dissoc(
                    remaining_hover_merge_anchor,
                    hover_pin_node_id
                  )
                  break
                }
              }
            }
          }
        )
      }
    }
  }

  private _on_unit_blue_drag_end = (unit_id: string): void => {
    this._refresh_all_node_fixed()

    this._refresh_unit_layer(unit_id)

    if (this._blue_drag_hover_id) {
      this._refresh_unit_layer(this._blue_drag_hover_id)
      this._refresh_unit_fixed(this._blue_drag_hover_id)

      for (const pin_node_id in this._blue_drag_hover_swap) {
        this._drop_node(pin_node_id)
      }
    } else {
      for (const node_id in this._blue_drag_init_start_position) {
        const position = this._blue_drag_init_start_position[node_id]
        this._set_node_position(node_id, position)
      }

      for (const pin_node_id in this._blue_drag_init_pin_to_anchor) {
        this._drop_node(pin_node_id)
      }
    }

    this._blue_drag = false
    this._blue_drag_init_id = null
    this._blue_drag_init_start_position = {}
    this._blue_drag_init_pin_to_anchor = {}
    this._blue_drag_init_anchor_to_pin = {}
    this._blue_drag_init_swap = {}
    this._blue_drag_hover_id = null
    this._blue_drag_hover_position = {}
    this._blue_drag_hover_merge_anchor = {}
    this._blue_drag_hover_swap = {}
  }

  private _on_node_yellow_drag_start = (event: IOPointerEvent): void => {
    console.log('Graph', '_on_node_yellow_drag_start')
  }

  private _on_node_yellow_drag_end = (event: IOPointerEvent): void => {
    console.log('Graph', '_on_node_yellow_drag_start')
  }

  private _on_multiselect_area_start = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_multiselect_area_start')
    const { pointerId, clientX, clientY } = event
    this._multiselect_area_ing = true
    this._multiselect_area_start_position = {
      x: clientX,
      y: clientY,
    }
    // mergeStyle(this._multiselect_area_svg, {
    //   display: 'block',
    // })
    this._multiselect_area_svg.$element.style.display = 'block'
  }

  private _on_multiselect_area = (event: IOPointerEvent): void => {
    const { pointerId, clientX, clientY } = event
    const { x, y } = this._multiselect_area_start_position
    const minX = Math.min(x, clientX)
    const maxX = Math.max(x, clientX)
    const minY = Math.min(y, clientY)
    const maxY = Math.max(y, clientY)
    this._multiselect_area_rect = {
      x0: minX,
      y0: minY,
      x1: maxX,
      y1: maxY,
    }
    this._tick_multiselect_area()
  }

  private _on_multiselect_area_end = (): void => {
    // console.log('Graph', '_on_multiselect_area_end')
    this._multiselect_area_ing = false
    this._multiselect_area_rect = NOT_SELECTED_AREA
    this._multiselect_area_node = {}
    // mergeStyle(this._multiselect_area_svg, {
    //   display: 'none',
    // })
    this._multiselect_area_svg.$element.style.display = 'none'
    this._tick_multiselect_area()
  }

  private _tick_multiselect_area = (): void => {
    const { x0, y0, x1, y1 } = this._multiselect_area_rect

    this._multiselect_area_svg_rect.setProp('x', x0)
    this._multiselect_area_svg_rect.setProp('y', y0)
    this._multiselect_area_svg_rect.setProp('width', x1 - x0)
    this._multiselect_area_svg_rect.setProp('height', y1 - y0)

    if (this._tree_layout) {
      const children = this._get_current_layout_layer_children()

      for (let i = 0; i < children.length; i++) {
        const child_id = children[i]
        const _$context = this._core_component_context[child_id]
        const { $x, $y, $width, $height } = _$context
        const cx = $x + $width / 2
        const cy = $y + $height / 2
        if (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) {
          if (!this._multiselect_area_node[child_id]) {
            this._multiselect_area_node[child_id] = true
            if (this._selected_node_id[child_id]) {
              this.deselect_node(child_id)
            } else {
              this.select_node(child_id)
            }
          }
        } else {
          if (this._multiselect_area_node[child_id]) {
            this._multiselect_area_node[child_id] = false
            this.deselect_node(child_id)
          }
        }
      }
    } else {
      const { x: ix0, y: iy0 } = this._screen_to_world(x0, y0)
      const { x: ix1, y: iy1 } = this._screen_to_world(x1, y1)

      for (let node_id in this._node) {
        const node = this._node[node_id]
        if (this._is_node_selectable(node_id)) {
          const { x, y, width, height } = node
          if (
            // x + width / 2 >= ix0 &&
            // x - width / 2 <= ix1 &&
            // y + height / 2 >= iy0 &&
            // y - height / 2 <= iy1
            x >= ix0 &&
            x <= ix1 &&
            y >= iy0 &&
            y <= iy1
          ) {
            if (!this._multiselect_area_node[node_id]) {
              this._multiselect_area_node[node_id] = true
              if (this._selected_node_id[node_id]) {
                this.deselect_node(node_id)
              } else {
                this.select_node(node_id)
              }
            }
          } else {
            if (this._multiselect_area_node[node_id]) {
              this._multiselect_area_node[node_id] = false
              this.deselect_node(node_id)
            }
          }
        }
      }
    }
  }

  private _on_translate = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_translate')
    const { pointerId, clientX, clientY } = event

    const { x, y } = this._pointer_position[pointerId]
    this._translate_x = clientX - x
    this._translate_y = clientY - y
    const zoom = translate(this._zoom, this._translate_x, this._translate_y)
    this.set_zoom(zoom)

    this._translate_pressed_node()

    if (!this._search_hidden) {
      this._start_graph_simulation(LAYER_SEARCH)
    }
  }

  private _ascend_z_count: number = 0

  private _ascend_node_dict: Dict<boolean> = {}

  private _ascend_node_z = (node_id: string): void => {
    if (this._ascend_node_dict[node_id]) {
      return
    }
    // console.log('Graph', '_ascend_node_z', node_id)

    this._ascend_z_count++
    this._ascend_node_dict[node_id] = true

    if (this._ascend_z_count === 1) {
      // mergeStyle(this._zoom_comp_alt, {
      //   pointerEvents: 'all',
      // })
      this._zoom_comp_alt.$element.style.pointerEvents = 'all'
    }

    const node_comp = this._get_node_comp(node_id)
    this._zoom_comp.removeChild(node_comp, 'default')
    this._zoom_comp_alt.appendChild(node_comp, 'default')

    if (this._is_link_pin_node_id(node_id)) {
      const link_id = getPinLinkIdFromPinNodeId(node_id)
      const link_comp = this._link_comp[link_id]
      this._zoom_comp.removeChild(link_comp, 'svg')
      this._zoom_comp_alt.appendChild(link_comp, 'svg')
    }
  }

  private _descend_node_z = (node_id: string): void => {
    if (!this._ascend_node_dict[node_id]) {
      return
    }
    // console.log('Graph', '_descend_node_z', node_id)

    this._ascend_z_count--
    delete this._ascend_node_dict[node_id]

    const node_comp = this._get_node_comp(node_id)
    this._zoom_comp_alt.removeChild(node_comp, 'default')
    this._zoom_comp.appendChild(node_comp, 'default')

    if (this._is_link_pin_node_id(node_id)) {
      const link_id = getPinLinkIdFromPinNodeId(node_id)
      const link_comp = this._link_comp[link_id]
      this._zoom_comp_alt.removeChild(link_comp, 'svg')
      this._zoom_comp.appendChild(link_comp, 'svg')
    }

    if (this._ascend_z_count === 0) {
      // mergeStyle(this._zoom_comp_alt, {
      //   pointerEvents: 'none',
      // })
      this._zoom_comp_alt.$element.style.pointerEvents = 'none'
    }
  }

  private _negate_unit_layer = (unit_id: string): void => {
    // console.log('Graph', '_negate_unit_layer', unit_id)
    this._set_unit_layer(unit_id, -LAYER_NORMAL)
  }

  private _negate_node_layer = (node_id: string): void => {
    // console.log('Graph', '_negate_node_layer', node_id)
    const default_layer = this._get_node_default_layer(node_id)
    this._set_node_layer(node_id, -default_layer)
  }

  private _set_node_pointer_capture = (
    node_id: string,
    pointer_id: number
  ): void => {
    const node_comp = this._get_node_comp(node_id)
    node_comp.setPointerCapture(pointer_id)
  }

  private _release_node_pointer_capture = (
    node_id: string,
    pointer_id: number
  ): void => {
    const node_comp = this._get_node_comp(node_id)
    node_comp.releasePointerCapture(pointer_id)
  }

  private _ascend_node = (node_id: string, pointer_id: number): void => {
    // console.log('Graph', '_ascend_node', node_id)

    // TODO set node negative layer
    this._negate_node_layer(node_id)
    this._ascend_node_z(node_id)

    // reset pointer capture (probably because node was moved in the DOM)
    this._set_node_pointer_capture(node_id, pointer_id)

    if (this._is_unit_node_id(node_id)) {
      this._for_each_unit_pin(
        node_id,
        (pin_node_id: string, type: 'input' | 'output') => {
          if (!this._is_link_pin_merged(pin_node_id)) {
            this._negate_node_layer(pin_node_id)
            this._ascend_node_z(pin_node_id)

            const datum_node_id = this._pin_to_datum[pin_node_id]
            if (datum_node_id) {
              this._negate_node_layer(datum_node_id)
            }
          }

          const { pinId, subPinId } = this._get_pin_exposed_id(
            type,
            pin_node_id
          )
          if (pinId !== null && subPinId !== null) {
            const ext_pin_node_id = getExternalNodeId(type, pinId, subPinId)
            this._negate_node_layer(ext_pin_node_id)
          }
        }
      )
    }
  }

  private _descend_node = (node_id: string): void => {
    // console.log('Graph', '_descend_node', node_id)

    this._refresh_node_layer(node_id)
    this._descend_node_z(node_id)

    if (this._is_unit_node_id(node_id)) {
      this._for_each_unit_pin(
        node_id,
        (pin_node_id: string, type: 'input' | 'output') => {
          if (!this._is_link_pin_merged(pin_node_id)) {
            this._descend_node_z(pin_node_id)
            this._refresh_node_layer(pin_node_id)

            const datum_node_id = this._pin_to_datum[pin_node_id]
            if (datum_node_id) {
              this._refresh_node_layer(datum_node_id)
            }
          }

          const { pinId, subPinId } = this._get_pin_exposed_id(
            type,
            pin_node_id
          )
          if (pinId !== null && subPinId !== null) {
            const ext_pin_node_id = getExternalNodeId(type, pinId, subPinId)
            this._refresh_node_layer(ext_pin_node_id)
          }
        }
      )
    }
  }

  private _on_pointer_move = (event: IOPointerEvent, _event: PointerEvent) => {
    // console.log('Graph', '_on_pointer_move')

    const { pointerId, clientX, clientY } = event

    const { zoomDraggable } = this.$props

    const pointer_down_position = this._pointer_down_position[pointerId]

    if (this._pointer_down[pointerId]) {
      this._pointer_down_move_count[pointerId]++
    }

    if (
      zoomDraggable &&
      !this._long_press_collapsing &&
      !this._capturing_gesture &&
      !this._removing_err
    ) {
      if (
        this._multiselect_area_ing &&
        this._pointer_down_count === 1 &&
        this._pressed_node_pointer_count === 0
      ) {
        this._on_multiselect_area(event)
      }
    }

    const pressed_node_id = this._pointer_id_pressed_node_id[pointerId]

    const resize_unit_id = this._resize_pointer_id_node_id[pointerId]

    if (
      !pressed_node_id &&
      !resize_unit_id &&
      !this._long_press_collapsing &&
      !this._capturing_gesture &&
      !this._tree_layout &&
      !this._multiselect_area_ing &&
      !this._removing_err &&
      !this._drag_and_drop
    ) {
      if (
        this._pointer_down_count === this._pressed_node_pointer_count + 1 &&
        !this._pointer_id_pressed_node_id[pointerId] &&
        this._pointer_position[pointerId]
      ) {
        // must happen before pointer position is updated
        this._on_translate(event)
      }
    }

    this._pointer_position[pointerId] = {
      x: clientX,
      y: clientY,
    }

    if (pressed_node_id) {
      if (this._edit_node_name_id === pressed_node_id) {
        return
      }

      if (
        this._node_pressed_count[pressed_node_id] === 1 &&
        !this._resize_node_id_pointer_id[pressed_node_id] &&
        this._edit_datum_node_id !== pressed_node_id &&
        this._edit_node_name_id !== pressed_node_id &&
        !this._capturing_gesture &&
        !this._core_component_unlocked[pressed_node_id]
      ) {
        if (this._tree_layout) {
          if (this._is_unit_node_id(pressed_node_id)) {
            if (this._is_unit_component(pressed_node_id)) {
              if (this._layout_drag_node[pressed_node_id]) {
                this._on_layout_component_drag_move(pressed_node_id, event)
              } else {
                this._on_layout_component_drag_start(pressed_node_id, event)
              }
            }
          }
        } else {
          if (this._is_draggable_mode()) {
            // delay "drag start" conditioning it to pointer's "first move"
            if (!this._drag_node_id[pressed_node_id]) {
              if (
                this._is_freeze_mode()
                // this._mode === 'add' ||
                // (isMobile && this._is_datum_node_id(pressed_node_id))
              ) {
                // if (isMobile) {
                // for Add Drag to start, we need to be sure the node won't be
                // duplicated by Click by waiting the pointer to move at least
                // `POINTER_CLICK_RADIUS` from initial pointer down position
                const d = pointDistance(
                  this._pointer_down_position[pointerId],
                  {
                    x: clientX,
                    y: clientY,
                  }
                )
                if (d < POINTER_CLICK_RADIUS) {
                  return
                }
                // }
              }

              let drag_node_id = pressed_node_id

              if (
                this._is_unit_node_id(pressed_node_id) ||
                this._is_datum_node_id(pressed_node_id)
              ) {
                if (this._mode === 'data') {
                  if (!this._green_drag) {
                    drag_node_id = this._on_node_green_drag_start(
                      pressed_node_id,
                      event,
                      _event
                    )
                  }
                } else if (this._mode === 'add') {
                  if (!this._green_drag) {
                    drag_node_id = this._on_node_green_drag_start(
                      pressed_node_id,
                      event,
                      _event
                    )
                  }
                } else if (this._mode === 'remove') {
                  this._on_node_red_drag_start(drag_node_id, pointerId)
                } else if (this._mode === 'change') {
                  if (this._is_unit_node_id(drag_node_id)) {
                    this._on_unit_blue_drag_start(drag_node_id)
                    this._ascend_node(drag_node_id, pointerId)
                  } else if (this._is_datum_node_id(drag_node_id)) {
                    const { id: datum_id } = segmentDatumNodeId(drag_node_id)
                    const tree = this._datum_tree[datum_id]
                    const tree_type = _getValueType(tree)

                    const new_datum_node_id =
                      this._duplicate_datum(drag_node_id)

                    let value: string
                    do {
                      value = randomValueOfType(tree_type)
                    } while (value === tree.value && value !== 'null')
                    const new_tree = _getValueTree(value)
                    const new_datum = this._datum[new_datum_node_id]
                    new_datum.setProp('data', new_tree)

                    this._green_drag = true
                    this._green_drag_node_id = pressed_node_id
                    this._green_drag_clone_id = new_datum_node_id

                    // AD HOC should change state in place instead
                    // of simulating events...
                    this._on_node_pointer_leave(pressed_node_id, event)
                    this._on_pointer_up(event)

                    // this._on_node_pointer_enter(new_datum_node_id, event)
                    this._on_node_pointer_down(new_datum_node_id, event)
                    // this._on_pointer_move(event)

                    drag_node_id = new_datum_node_id
                    this._ascend_node(drag_node_id, pointerId)
                  }
                }
              }
              this._drag_start(drag_node_id, event)

              // on Add Drag, the node is only duplicated after the pointer "has
              // moved enough" - in which case we need to correct its `hx` and `hy`
              if (
                this._is_freeze_mode()
                // this._mode === 'add' ||
                // (isMobile && this._is_datum_node_id(pressed_node_id))
              ) {
                // if (isMobile) {
                const { x, y } = this._get_node_position(drag_node_id)
                const { x: px, y: py } = pointer_down_position
                const [_px, _py] = zoomInvert(
                  this._zoom,
                  px - this._translate_x,
                  py - this._translate_y
                )
                const node = this._node[drag_node_id]
                node.hx = _px - x
                node.hy = _py - y
                // }
              }
            } else {
              this._drag_move(pressed_node_id, event)

              if (this._is_unit_node_id(pressed_node_id)) {
                if (this._blue_drag) {
                  this._on_unit_blue_drag_move(pressed_node_id)
                }

                if (this._long_press_collapse_unit_id === pressed_node_id) {
                  this._long_press_collapse_world_position =
                    this._get_node_position(pressed_node_id)
                }
              }
            }
          }
        }
      }
    }

    if (
      this._pointer_down_count === 2 &&
      keyCount({ obj: this._resize_node_id_pointer_id }).count === 0
    ) {
      const [pointer_id_0, pointer_id_1] = Object.keys(this._pointer_down)
      const { x: x0, y: y0 } = this._pointer_position[pointer_id_0]
      const { x: x1, y: y1 } = this._pointer_position[pointer_id_1]
      if (this._multiselect_area_ing) {
        const minX = Math.min(x0, x1)
        const maxX = Math.max(x0, x1)
        const minY = Math.min(y0, y1)
        const maxY = Math.max(y0, y1)
        this._multiselect_area_rect = {
          x0: minX,
          y0: minY,
          x1: maxX,
          y1: maxY,
        }
        this._tick_multiselect_area()
      } else {
        if (this._tree_layout) {
          return
        }

        if (this._subgraph_graph) {
          return
        }

        const d = distance(x0, y0, x1, y1)

        if (!this._zooming) {
          if (Math.abs(d - this._touch_zoom_d) > 60) {
            this._zooming = true
            this._touch_zoom_d = d
          }
        } else {
          const delta = this._touch_zoom_d - d
          if (this._pressed_node_pointer_count === 0) {
            const delta = this._touch_zoom_d - d
            this._zoom_in(
              delta,
              this._touch_zoom_position_start.x,
              this._touch_zoom_position_start.y
            )
          } else if (
            this._pressed_node_pointer_count === 2 &&
            this._pressed_node_count === 1 &&
            pressed_node_id
          ) {
            const pressed_node = this._node[pressed_node_id]
            const { x, y, width, height } = pressed_node
            this._zoom_in(
              delta / 2,
              x + width / 2 - this._zoom.x,
              y + height / 2 - this._zoom.y
            )
          }
          this._touch_zoom_d = d
        }
      }
    }
  }

  private _translate_pressed_node = () => {
    for (let node_id in this._pressed_node_id_pointer_id) {
      const pointer_id = Object.keys(
        this._pressed_node_id_pointer_id[node_id]
      )[0]
      const { x: pointer_x, y: pointer_y } = this._pointer_position[pointer_id]
      const [p_x, p_y] = zoomInvert(this._zoom, pointer_x, pointer_y)
      if (this._selected_node_id[node_id]) {
        for (let selected_node_id in this._selected_node_id) {
          this._translate_node(
            selected_node_id,
            p_x,
            p_y,
            this._translate_x,
            this._translate_y
          )
        }
      } else {
        this._translate_node(
          node_id,
          p_x,
          p_y,
          this._translate_x,
          this._translate_y
        )

        if (this._is_external_pin_node_id(node_id)) {
          const { type, id, subPinId } = segmentExposedNodeId(node_id)
          const exposed_int_node_id = getInternalNodeId(type, id, subPinId)
          if (this._has_node(exposed_int_node_id)) {
            this._translate_node(
              exposed_int_node_id,
              p_x,
              p_y,
              this._translate_x,
              this._translate_y
            )
          }
        } else if (this._is_internal_pin_node_id(node_id)) {
          const { type, id, subPinId } = segmentExposedNodeId(node_id)
          const exposed_ext_node_id = getExternalNodeId(type, id, subPinId)
          this._translate_node(
            exposed_ext_node_id,
            p_x,
            p_y,
            this._translate_x,
            this._translate_y
          )
        }
      }
    }
  }

  private _translate_search_node = () => {
    if (this._search_unit_id && this._mode === 'add') {
      const { x: pointer_x, y: pointer_y } = this._world_screen_center()
      const [p_x, p_y] = zoomInvert(this._zoom, pointer_x, pointer_y)
      this._translate_node(
        this._search_unit_id,
        p_x,
        p_y,
        this._translate_x,
        this._translate_y
      )
      this._for_each_unit_pin(this._search_unit_id, (pin_node_id: string) => {
        this._translate_node(
          pin_node_id,
          p_x,
          p_y,
          this._translate_x,
          this._translate_y
        )
      })
    }
  }

  private _translate_node = (
    node_id: string,
    x: number,
    y: number,
    translate_x: number,
    translate_y: number
  ): void => {
    const node = this._node[node_id]
    const nx = node.x - translate_x / this._zoom.k
    const ny = node.y - translate_y / this._zoom.k
    node.hx = x - node.x
    node.hy = y - node.y
    node.fx = nx
    node.fy = ny
    node.x = nx
    node.y = ny
  }

  public add_new_exposed_pin_set_at = (
    pin_id: string,
    type: 'input' | 'output',
    pin_spec: GraphExposedPinSpec,
    ext: Point,
    int: Point
  ) => {
    this.add_exposed_pin_set(type, pin_id, pin_spec, { 0: { ext, int } })
  }

  private _on_capture_gesture_end = (
    event: IOPointerEvent,
    track: Point[]
  ): void => {
    // console.log('Graph', '_on_capture_gesture_end')
    const { $x, $y, $sx, $sy } = this.$context

    const { x: zx, y: zy, k: zk } = this._zoom

    let l = track.length

    this._capturing_gesture = false

    // const t = Math.round(0.1 * l) // trim
    // track.splice(0, t)
    // track.splice(l - t, t)

    let line: Line | null = null
    let rect: Rect | null = null
    let circle: Circle | null = null

    l = track.length

    const _x = (x: number): number => {
      return (x - $x) / $sx / zk + zx
    }

    const _y = (y: number): number => {
      return (y - $y) / $sy / zk + zy
    }

    if (l > 6) {
      const line = getLine(track, 25)
      if (line) {
        // console.log('line', line)
        if (this._mode === 'none' || this._mode === 'multiselect') {
          const x0 = _x(line.x0)
          const y0 = _y(line.y0)
          const p0 = { x: x0, y: y0 }
          const x1 = _x(line.x1)
          const y1 = _y(line.y1)
          const p1 = { x: x1, y: y1 }

          const source_node_id = this._find_inside_core_and_pin_id(
            {
              x: x0,
              y: y0,
            },
            2 * NODE_PADDING
          )
          const target_node_id = this._find_inside_core_and_pin_id(
            {
              x: x1,
              y: y1,
            },
            2 * NODE_PADDING
          )

          if (source_node_id && target_node_id) {
            // TODO
          } else if (source_node_id || target_node_id) {
            const node_id = (source_node_id || target_node_id) as string

            const node_position = this._get_node_position(node_id)
            const { x, y } = node_position

            const d0 = distance(x0, y0, x, y)
            const d1 = distance(x1, y1, x, y)

            let type: 'input' | 'output'
            if (d0 > d1) {
              type = 'input'
            } else {
              type = 'output'
            }

            if (this._is_unit_node_id(node_id)) {
              const unit = this._get_unit(node_id)
              const { path: id } = unit
              if (!isBaseSpecId(id)) {
                const pin_spec = {
                  name: type,
                  pin: { 0: {} },
                }

                let spec = this._get_unit_spec(node_id) as GraphSpec

                const pinId = newSpecPinId(spec, type, 'a')

                spec = specReducer.exposePinSet(
                  {
                    id: pinId,
                    type,
                    pin: pin_spec,
                  },
                  spec
                )

                setSpec(id, spec)

                this.temp_fixate_node(node_id)

                const position = type === 'input' ? p0 : p1

                this._sim_add_link_pin_node(node_id, type, pinId, position)
                this._sim_add_link_pin_link(node_id, type, pinId)

                // update cached simulation if any
                const core_graph = this._subgraph_cache[node_id]
                if (core_graph) {
                  core_graph._spec_add_exposed_pin_set(type, pinId, pin_spec)
                  core_graph._sim_add_exposed_pin_set(type, pinId, pin_spec)
                }

                this._pod_add_unit_exposed_pin_set(
                  node_id,
                  type,
                  pinId,
                  pin_spec
                )
              }
            } else if (this._is_pin_node_id(node_id)) {
              let _type: 'input' | 'output'

              let is_link_pin_node_id = this._is_link_pin_node_id(node_id)

              if (is_link_pin_node_id) {
                const { type: __type } = segmentLinkPinNodeId(node_id)
                _type = __type
              } else {
                if (this._is_input_merge(node_id)) {
                  _type = 'input'
                } else if (this._is_output_merge(node_id)) {
                  _type = 'output'
                } else {
                  _type = type
                }
              }

              let new_pin_sub_pin_id = '0'

              if (_type === type) {
                let new_pin_id: string
                let new_pin_sub_spec: GraphExposedSubPinSpec
                if (is_link_pin_node_id) {
                  const { unitId, pinId } = segmentLinkPinNodeId(node_id)
                  new_pin_id = newSpecPinId(this._spec, type, pinId)
                  new_pin_sub_spec = {
                    unitId,
                    pinId,
                  }
                } else {
                  const first_merge_pin = this._find_merge_pin(
                    node_id,
                    () => true
                  )
                  const { id: mergeId } = segmentMergeNodeId(node_id)
                  const { pinId } = segmentLinkPinNodeId(first_merge_pin)
                  new_pin_id = newSpecPinId(this._spec, type, pinId)
                  new_pin_sub_spec = {
                    mergeId,
                  }
                }

                const u = unitVector(x0, y0, x1, y1)
                const p0u = applyVector(p0, u, LINK_DISTANCE)
                const ext_node_position = type === 'input' ? p0 : p0u
                const int_node_position = type === 'input' ? p0u : p0

                const pin_exposed_pin = this._get_pin_exposed_id(type, node_id)

                const {
                  pinId: pin_exposed_pin_pin_id,
                  subPinId: pin_exposed_pin_sub_pin_id,
                } = pin_exposed_pin

                if (pin_exposed_pin_pin_id && pin_exposed_pin_sub_pin_id) {
                  new_pin_sub_pin_id = this._new_sub_pin_id(
                    type,
                    pin_exposed_pin_pin_id
                  )

                  this.add_exposed_pin(
                    type,
                    pin_exposed_pin_pin_id,
                    {},
                    new_pin_sub_pin_id,
                    {},
                    {
                      ext: ext_node_position,
                      int: int_node_position,
                    }
                  )
                } else {
                  this.add_new_exposed_pin_set_at(
                    new_pin_id,
                    type,
                    {
                      pin: {
                        [new_pin_sub_pin_id]: {},
                      },
                    },
                    ext_node_position,
                    int_node_position
                  )

                  this._plug_exposed_pin(
                    type,
                    new_pin_id,
                    new_pin_sub_pin_id,
                    new_pin_sub_spec
                  )
                }
              }
            }
          } else {
            const center = this._world_screen_center()
            const { x: cx, y: cy } = center

            const d = distance(x0, y0, x1, y1)

            if (d > LINK_DISTANCE) {
              const d0 = distance(x0, y0, cx, cy)
              const d1 = distance(x1, y1, cx, cy)

              let type: 'input' | 'output'
              if (d0 > d1) {
                type = 'input'
              } else {
                type = 'output'
              }

              const newPinId = newSpecPinId(this._spec, type, 'a')

              const u = unitVector(x0, y0, x1, y1)
              const p0u = applyVector(p0, u, LINK_DISTANCE)
              const ext_node_position = type === 'input' ? p0 : p0u
              const int_node_position = type === 'input' ? p0u : p0

              this.add_new_exposed_pin_set_at(
                newPinId,
                type,
                {
                  pin: {
                    0: {},
                  },
                },
                ext_node_position,
                int_node_position
              )
            }
          }
        }
      } else {
        // AD HOC
        // calculate contained nodes only if curve is (seems to be) closed
        if (pointDistance(track[0], track[l - 1]) > 3 * NEAR) {
          return
        }

        // close track
        track.push(track[0])

        const contained_nodes: string[] = []

        // const pointer_track_sample = linearSample(
        //   pointer_track.slice(6, l - 6),
        //   10
        // )
        const pointer_track_sample = track

        const _is_node_inside = (node_id: string): boolean => {
          const node = this._node[node_id]
          let intersect_count = 0
          for (let i = 1; i < pointer_track_sample.length; i++) {
            const point = pointer_track_sample[i]
            const px = _x(point.x)
            const py = _y(point.y)
            const previous = pointer_track_sample[i - 1]
            const ppx = _x(previous.x)
            const ppy = _y(previous.y)
            const intersect = lineIntersect(
              px,
              py,
              ppx,
              ppy,
              node.x,
              node.y,
              Number.MAX_SAFE_INTEGER,
              Number.MAX_SAFE_INTEGER
            )
            if (intersect) {
              intersect_count++
            }
          }
          const intersected = intersect_count % 2 === 1
          return intersected
        }

        for (let node_id in this._node) {
          if (_is_node_inside(node_id)) {
            contained_nodes.push(node_id)
          }
        }

        if (contained_nodes.length > 0) {
          if (this._mode === 'none') {
            forEach(contained_nodes, (unit_id) => {
              this.select_node(unit_id)
            })
          } else if (this._mode === 'add') {
            // TODO
          }
        } else {
          if ((rect = getRectangle(track))) {
            const x = _x(rect.x + rect.width / 2)
            const y = _y(rect.y + rect.height / 2)
            const width = Math.max(rect.width / $sx / this._zoom.k, MIN_WIDTH)
            const height = Math.max(
              rect.height / $sx / this._zoom.k,
              MIN_HEIGHT
            )
            const position = { x, y }

            if (this._mode === 'none' || this._mode === 'multiselect') {
              const newUUID = newSpecId()

              const newSpec = this._add_empty_spec(newUUID)
              newSpec.component = {
                defaultWidth: width,
                defaultHeight: height,
              }

              const unit = {
                path: newUUID,
              }

              const new_unit_id = this._new_unit_id(newUUID)

              this._add_unit(
                new_unit_id,
                unit,
                position,
                { input: {}, output: {} },
                { x: 0, y: 0 },
                null
              )

              this._sim_add_unit_component(new_unit_id)
              this._pod_add_unit_component(new_unit_id)
            } else if (this._mode === 'add') {
              this._search_unit_graph_position = position
              this._search_unit_component_size = {
                width,
                height,
              }
              this._set_search_filter((id: string) => {
                if (isComponent(id)) {
                  return true
                } else {
                  return false
                }
              })
              this._show_search()
            } else if (this._mode === 'change') {
              // TODO
            }
          } else if ((circle = getCircle(track, 0.3))) {
            // console.log('circle', circle)
            const x = _x(circle.x)
            const y = _y(circle.y)
            const position = { x, y }
            if (this._mode === 'none' || this._mode === 'multiselect') {
              const new_spec_id = newSpecId()

              this._add_empty_spec(new_spec_id)

              const newUnitId = this._new_unit_id(new_spec_id)

              const unit = {
                path: new_spec_id,
              }

              this.add_unit(
                newUnitId,
                unit,
                {
                  x,
                  y,
                },
                { input: {}, output: {} },
                { x: 0, y: 0 },
                null
              )
            } else if (this._mode === 'add') {
              this._search_unit_graph_position = position
              this._set_search_filter((id: string) => {
                if (!isComponent(id)) {
                  return true
                } else {
                  return false
                }
              })
              this._show_search()
            } else if (this._mode === 'change') {
              // TODO
            }
          }
        }
      }
    }

    if (this._mode === 'multiselect') {
      this._restart_gesture = true
    }
  }

  private _is_draggable_mode = (): boolean => {
    return this.__is_draggable_mode(this._mode)
  }

  private __is_draggable_mode = (mode: Mode): boolean => {
    return (
      mode === 'none' ||
      mode === 'info' ||
      mode === 'data' ||
      mode === 'add' ||
      mode === 'remove' ||
      mode === 'change' ||
      mode === 'multiselect'
    )
  }

  private _is_freeze_mode = (): boolean => {
    return this.__is_freeze_mode(this._mode)
  }

  private __is_freeze_mode = (mode: Mode): boolean => {
    return (
      mode === 'add' ||
      mode === 'remove' ||
      mode === 'change' ||
      mode === 'data'
    )
  }

  private _blue_drag_hover_return = (): void => {
    // console.log('Graph', '_blue_drag_hover_return')
    const unit_id = this._blue_drag_hover_id!
    this._refresh_unit_layer(unit_id)
    this._set_unit_fixed(unit_id, true)

    for (const node_id in this._blue_drag_hover_position) {
      const position = this._blue_drag_hover_position[node_id]
      if (this._has_node(node_id)) {
        this._set_node_position(node_id, position)
      }
    }

    this._for_each_unit_output(unit_id, (output_node_id) => {
      this._set_output_reduced(output_node_id, false)
    })

    for (const pin_node_id in this._blue_drag_hover_merge_anchor) {
      const merge_anchor_pin_node_id =
        this._blue_drag_hover_merge_anchor[pin_node_id]
      if (
        this._has_node(pin_node_id) &&
        this._has_node(merge_anchor_pin_node_id)
      ) {
        this._merge_pin_pin(pin_node_id, merge_anchor_pin_node_id)
      }
    }

    this._blue_drag_hover_id = null
  }

  private __on_pointer_up = (pointerId: number): void => {
    // console.log('Graph', '_on_pointer_up')
    if (this._control) {
      if (this._temp_control_lock) {
        this._temp_control_lock = false

        this._control.dispatchEvent('temp_unlock', {}, false)
      }
    }

    if (this._pointer_down[pointerId]) {
      delete this._pointer_down[pointerId]
      delete this._pointer_down_position[pointerId]
      delete this._pointer_down_move_count[pointerId]
      this._pointer_down_count--
    }

    if (this._long_press_pointer.has(pointerId)) {
      this._long_press_pointer.delete(pointerId)
      this._long_press_count--
    }

    if (this._long_press_background_pointer.has(pointerId)) {
      this._long_press_background_pointer.delete(pointerId)
      this._long_press_background_count--
    }

    this._removing_err = false

    if (this._main.$element.hasPointerCapture(pointerId)) {
      this._main.releasePointerCapture(pointerId)
    }

    const pressed_node_id = this._pointer_id_pressed_node_id[pointerId]
    if (pressed_node_id) {
      this.__set_node_pressed(pressed_node_id, pointerId, false)

      if (this._tree_layout) {
        if (this._is_unit_node_id(pressed_node_id)) {
          if (this._is_unit_component(pressed_node_id)) {
            this._on_layout_component_drag_end(pressed_node_id)
          }
        }
      } else {
        if (this._drag_node_id[pressed_node_id]) {
          if (this._is_draggable_mode()) {
            if (this._is_freeze_mode()) {
              if (
                this._is_unit_node_id(pressed_node_id) ||
                this._is_datum_node_id(pressed_node_id)
              ) {
                this._descend_node(pressed_node_id)
              }
            }

            const green_drag_clone_id = this._green_drag_clone_id
            if (green_drag_clone_id) {
              this._on_node_green_drag_end(green_drag_clone_id)
            }

            if (this._blue_drag) {
              if (this._is_unit_node_id(pressed_node_id)) {
                this._on_unit_blue_drag_end(this._blue_drag_init_id!)
              }
            }

            this._on_node_drag_end(pressed_node_id)

            if (this._is_freeze_mode()) {
              if (this._is_unit_node_id(pressed_node_id)) {
                this._for_each_unit_pin(
                  pressed_node_id,
                  (pin_node_id: string) => {
                    if (!this._is_link_pin_merged(pin_node_id)) {
                      if (!this._is_link_pin_merged(pin_node_id)) {
                        this._drop_node(pin_node_id)
                      }
                    }
                  }
                )

                this._refresh_node_color(pressed_node_id)
              }
            }

            if (this._selected_node_id[pressed_node_id]) {
              for (let selected_node_id in this._selected_node_id) {
                if ((this._node_pressed_count[selected_node_id] || 0) === 0) {
                  this._on_node_drag_end(selected_node_id)
                }
              }
            } else {
            }
          }
          if (this._is_external_pin_node_id(pressed_node_id)) {
            const { type, id, subPinId } = segmentExposedNodeId(pressed_node_id)
            const exposed_int_node_id = getInternalNodeId(type, id, subPinId)
            if (this._has_node(exposed_int_node_id)) {
              this._drag_node_pointer_id[exposed_int_node_id] = pointerId
              if (this._is_draggable_mode()) {
                this._on_node_drag_end(exposed_int_node_id)
              }
            }
          } else if (this._is_internal_pin_node_id(pressed_node_id)) {
            const { type, id, subPinId } = segmentExposedNodeId(pressed_node_id)
            const exposed_ext_node_id = getExternalNodeId(type, id, subPinId)
            if (this._is_draggable_mode()) {
              this._on_node_drag_end(exposed_ext_node_id)
            }
          }
        }
        // if (this._focus_node_id[pressed_node_id]) {
        //   this._hide_core_overlay(pressed_node_id)
        // }
      }
      if (this._has_node(pressed_node_id)) {
        this._refresh_node_color(pressed_node_id)
        this._refresh_node_selection(pressed_node_id)
      }
    }

    if (this._long_press_pointer.has(pointerId)) {
      this._long_press_pointer.delete(pointerId)
      if (this._long_click_cancel_pointer_id.has(pointerId)) {
        this._long_click_cancel_pointer_id.delete(pointerId)
      }
      this._long_press_count--
    }

    if (pointerId === this._long_press_collapse_pointer_id) {
      this._stop_long_press_collapse()
    }

    // if (this._zooming && this._pointer_down_count === 0 && this._zoom.k < 1) {
    //   this._on_zoom_end()
    // }

    if (this._pointer_down_count === 0) {
      this._zooming = false
    }

    if (this._multiselect_area_ing) {
      this._on_multiselect_area_end()
    }

    this._translating = false

    // this._area_selecting = false
  }

  private _on_pointer_up = (event: IOPointerEvent) => {
    // console.log('Graph', '_on_pointer_up')
    const { pointerId } = event

    this.__on_pointer_up(pointerId)
  }

  private _on_wheel = (
    { deltaY, ctrlKey, altKey, clientX, clientY }: IOWheelEvent,
    _event: WheelEvent
  ) => {
    // console.log('Graph', '_on_wheel')

    if (this._tree_layout) {
      return
    }

    if (this._subgraph_graph) {
      return
    }

    // RETURN
    // @ts-ignore
    if (window.visualViewport) {
      // @ts-ignore
      const scale = window.visualViewport.scale || 1
      if (scale > 1) {
        return
      }
    }

    if (!ctrlKey) {
      // can only zoom if alt is pressed
      if (!altKey) {
        const { $width, $height } = this.$context
        if (
          clientX > 0 &&
          clientY > 0 &&
          clientX < $width &&
          clientY < $height
        ) {
          this._zoom_in(deltaY, clientX, clientY)
        }

        _event.preventDefault()
      }
    }
  }

  private _is_background_pointer_event = ({
    pointerId,
  }: {
    pointerId: number
  }): boolean => {
    if (
      this._pointer_id_hover_node_id[pointerId] ||
      this._pointer_id_hover_link_id[pointerId] ||
      this._pointer_id_pressed_node_id[pointerId] ||
      this._long_press_collapse_pointer_id === pointerId
    ) {
      return false
    } else {
      return true
    }
  }

  private _on_click = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_click')
    if (keyCount({ obj: this._resize_node_id_pointer_id }).count > 0) {
      return
    }

    const { pointerId, clientX, clientY } = event

    if (this._cancel_click) {
      this._cancel_click = false
      return
    }

    if (this._is_background_pointer_event(event)) {
      if (this._core_component_unlocked_count === 0) {
        if (this._edit_datum_just_blurred) {
        } else {
          this._deselect_all()
        }
      }

      if (this._core_component_unlocked_count > 0) {
        this._lock_all_component()
      }

      // blur any focused input (search, edit datum, etc.)
      if (!this._focused) {
        this.focus()
      }
    }
  }

  private _set_crud_mode = (mode: Mode): void => {
    // console.log('Graph', '_set_crud_mode', mode)
    if (this._modes) {
      this._modes.setProp('mode', mode)
    }
  }

  private _on_double_click = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_double_click')

    if (this._cancel_double_click) {
      return
    }

    if (this._mode === 'multiselect') {
      this._restart_gesture = false
      return
    }

    if (this._is_background_pointer_event(event)) {
      if (this._tree_layout) {
        //
      } else {
        const { clientX, clientY } = event
        const position = this._screen_to_world(clientX, clientY)
        if (this._mode === 'none') {
          const datum_id = this._new_datum_id()
          this._add_empty_datum(datum_id, position)
        } else if (this._mode === 'add') {
          // this._zoom_center_at(clientX, clientY)
          // this._show_search()
          const position = this._screen_to_world(clientX, clientY)
          this._paste_clipboard(position)
        } else if (this._mode === 'data') {
          const datum_id = this._new_datum_id()
          this._add_random_datum(datum_id, position)
        }
      }
    }
  }

  private _add_empty_spec = (id: string): GraphSpec => {
    const newSpec = emptySpec()
    setSpec(id, newSpec)
    return newSpec
  }

  private _add_empty_datum = (datum_id: string, { x, y }: Position): void => {
    // log('Graph', '_add_empty_datum')
    this.add_datum(datum_id, '', { x, y })
    const datum_node_id = getDatumNodeId(datum_id)
    this.select_node(datum_node_id)
    this._set_crud_mode('none')
    setTimeout(() => {
      this._focus_datum(datum_id, [])
    }, 0)
  }

  private _add_random_datum = (datum_id: string, { x, y }: Position): void => {
    const value = randomInArray([
      '0',
      '1',
      '2',
      '3',
      `'foo'`,
      `'bar'`,
      `'zaz'`,
      'true',
      'false',
      '{}',
      '[]',
    ])
    this.add_datum(datum_id, value, { x, y })
  }

  private _on_long_click = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_long_click')
    if (this._cancel_long_click) {
      this._cancel_long_click = false
      return
    }

    if (this._is_background_pointer_event(event)) {
      if (this._tree_layout) {
        const current_layout_layer = this._get_current_layout_layer_id()
        if (current_layout_layer) {
          this._layout_leave_sub_component()
        }
      } else {
        // if (this._mode === 'none') {
        setTimeout(() => {
          if (this._can_leave()) {
            this.leave()
          }
        }, 0)
        // }
      }
    }
  }

  private _drag_and_drop: boolean = false
  private _drag_and_drop_pointer: number | null = null

  private _transcend_pointer_id: number | null = null
  private _transcend_timeout: NodeJS.Timeout | null = null
  private _transcend_on_pointer_up: boolean = false

  private _start_long_press_collapse = (
    pointerId: number,
    unitId: string | null,
    { x: _x, y: _y }: Position
  ) => {
    console.log('Graph', '_start_long_press_collapse', pointerId, _x, _y)
    const { x, y } = this._screen_to_world(_x, _y)

    this._long_press_collapsing = true
    this._long_press_collapse_pointer_id = pointerId
    this._long_press_collapse_screen_position = { x: _x, y: _y }
    this._long_press_collapse_world_position = { x, y }
    this._long_press_collapse_unit_id = unitId
    this._long_press_collapse_remaining = this._selected_node_count

    for (const selected_node_id in this._selected_node_id) {
      this._set_node_layer(selected_node_id, LAYER_COLLAPSE)

      if (this._is_pin_node_id(selected_node_id)) {
        const datum_node_id = this._pin_to_datum[selected_node_id]
        if (datum_node_id) {
          this._hide_datum(datum_node_id)
        }
      }
    }

    this._simulation.alphaDecay(0)

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _stop_long_press_collapse = () => {
    console.log('Graph', '_stop_long_press_collapse')

    setTimeout(() => {
      this._stop_static()

      this._long_press_collapsing = false
      this._long_press_collapse_pointer_id = null
      this._long_press_collapse_world_position = NULL_VECTOR

      // cancelAnimationFrame(this._long_press_collapse_frame)

      for (const selected_node_id in this._selected_node_id) {
        this._on_node_static_end(selected_node_id)

        this._refresh_node_layer(selected_node_id)

        if (this._is_pin_node_id(selected_node_id)) {
          const datum_node_id = this._pin_to_datum[selected_node_id]
          if (datum_node_id) {
            this._refresh_datum_visible(datum_node_id)
          }
        }
      }

      this._simulation.alphaDecay(0.01)

      this._start_graph_simulation(LAYER_NORMAL)
    }, 0)
  }

  private _long_press_collapse_node = (node_id: string): void => {
    // console.log('Graph', '_long_press_collapse_node', node_id)
    if (!this._long_press_collapse_unit_id) {
      const new_spec: GraphSpec = clone(emptyGraphSpec)

      const new_name = 'untitled'

      new_spec.name = new_name
      new_spec.metadata = new_spec.metadata || {}
      new_spec.metadata.icon = null

      const new_spec_id = newSpecId()

      setSpec(new_spec_id, new_spec)

      const new_unit_id = this._new_unit_id(new_spec_id)

      const new_unit = {
        path: new_spec_id,
      }

      this._long_press_collapse_unit_id = new_unit_id

      this._add_unit(
        new_unit_id,
        new_unit,
        this._long_press_collapse_world_position,
        { input: {}, output: {} },
        { x: 0, y: 0 },
        null
      )

      // this.set_node_fixed(new_unit_id, true)

      // this._negate_unit_layer(new_unit_id)

      this._set_node_layer(new_unit_id, LAYER_COLLAPSE)

      const pointer_id = this._long_press_collapse_pointer_id

      const { x: clientX, y: clientY } =
        this._long_press_collapse_screen_position

      this._set_node_hovered(new_unit_id, pointer_id, true)
      this._set_node_pointer_capture(new_unit_id, pointer_id)
      this.__set_node_pressed(new_unit_id, pointer_id, true)

      const [x, y] = zoomInvert(this._zoom, clientX, clientY)
      this._node_drag_start(new_unit_id, x, y)
    }

    this._inject_node_into_graph(this._long_press_collapse_unit_id, node_id)

    this._long_press_collapse_remaining--

    if (this._long_press_collapse_remaining === 0) {
      this._refresh_node_fixed(this._long_press_collapse_unit_id)
      this._refresh_unit_layer(this._long_press_collapse_unit_id)
    }
  }

  private _inject_node_into_graph = (
    unit_id: string,
    node_id: string
  ): void => {
    // console.log('Graph', '_inject_node_into_graph')
    if (this._is_unit_node_id(node_id)) {
      this._move_unit_into_graph(unit_id, node_id)
    } else if (this._is_link_pin_node_id(node_id)) {
      const { unitId, type, pinId } = segmentLinkPinNodeId(node_id)
      this._move_link_pin_into_graph(unit_id, unitId, type, pinId)
    } else if (this._is_merge_node_id(node_id)) {
      // TODO
    } else if (this._is_datum_node_id(node_id)) {
      // TODO
    }
  }

  private _move_unit_into_graph = (graph_id: string, unit_id: string): void => {
    // console.log('Graph', '_move_unit_into_graph', graph_id, unit_id)
    const unit_spec_id = this._get_unit_spec_id(unit_id)

    const graph_spec_id = this._get_unit_spec_id(graph_id)

    const next_unit_id = newUnitIdInSpecId(graph_spec_id, unit_spec_id)

    this._pod_move_unit_into_graph(graph_id, unit_id, next_unit_id)
    this._state_move_unit_into_graph(graph_id, unit_id, next_unit_id)
  }

  private _state_move_unit_into_graph = (
    graph_id: string,
    unit_id: string,
    next_unit_id: string
  ): void => {
    // console.log('Graph', '_state_move_unit_into_graph', graph_id, unit_id)
    // this._sim_move_unit_into_graph(graph_id, unit_id, next_unit_id)
    // this._spec_move_unit_into_graph(graph_id, unit_id, next_unit_id)
    const graph_spec_id = this._get_unit_spec_id(graph_id)
    const graph_spec = this._get_unit_spec(graph_id) as GraphSpec

    const unit = this._get_unit(unit_id)

    let updated_graph_spec = specReducer.addUnit(
      { id: next_unit_id, unit },
      graph_spec
    )

    const is_graph_component = this._is_unit_component(graph_id)

    if (this._is_unit_component(unit_id)) {
      updated_graph_spec.component = componentReducer.setSubComponent(
        { id: next_unit_id, spec: { children: [], childSlot: {} } },
        updated_graph_spec.component
      )
      updated_graph_spec.component = componentReducer.appendChild(
        { id: next_unit_id },
        updated_graph_spec.component
      )

      const { width, height } = this._get_unit_component_graph_size(unit_id)
      const { defaultWidth = MIN_WIDTH, defaultHeight = MIN_HEIGHT } =
        updated_graph_spec.component
      const _defaultWidth = Math.max(defaultWidth, width)
      const _defaultHeight = Math.max(defaultHeight, height)
      updated_graph_spec.component = componentReducer.setSize(
        { defaultWidth: _defaultWidth, defaultHeight: _defaultHeight },
        updated_graph_spec.component
      )

      setSpec(graph_spec_id, updated_graph_spec)

      if (!is_graph_component) {
        this._set_core_shape(graph_id, 'rect')

        this._spec_append_component(null, graph_id)

        this._sim_add_core_component(graph_id, null, { x: 0, y: 0 })

        this._sim_add_unit_component(graph_id)
        this._pod_add_unit_component(graph_id)
      } else {
        const graph_sub_component = this._get_sub_component(graph_id)
        const unit_sub_component = this._get_sub_component(unit_id)

        const unit_parent_id = this._get_sub_component_layout_parent(unit_id)

        this._leave_sub_component_frame(unit_id)

        if (unit_parent_id) {
          this._component.pullParentRoot(unit_sub_component)
        } else {
          this._component.pullRoot(unit_sub_component)
        }

        graph_sub_component.setSubComponent(next_unit_id, unit_sub_component)
        graph_sub_component.pushRoot(unit_sub_component)
        graph_sub_component.appendRoot(unit_sub_component)
      }
    }

    delete updated_graph_spec.metadata.complexity

    this._refresh_core_size(graph_id)

    if (!updated_graph_spec.metadata || !updated_graph_spec.metadata.icon) {
      updated_graph_spec.metadata.icon = 'question'

      if (!isComponent(graph_spec_id)) {
        this._set_core_icon(graph_id, 'question')
        this._show_core_icon(graph_id)
      }
    }

    setSpec(graph_spec_id, updated_graph_spec)

    this._for_each_unit_pin(unit_id, (pin_node_id, type, pin_id) => {
      let next_pin_id = pin_id
      let i = 0
      while (updated_graph_spec[`${type}s`][next_pin_id]) {
        next_pin_id = `${pin_id}${i}`
        i++
      }

      updated_graph_spec = specReducer.exposePinSet(
        {
          id: next_pin_id,
          type,
          pin: { pin: { '0': { unitId: next_unit_id, pinId: pin_id } } },
        },
        updated_graph_spec
      )

      setSpec(graph_spec_id, updated_graph_spec)

      const next_pin_node_id = getPinNodeId(graph_id, type, next_pin_id)

      const { x, y } = this._long_press_collapse_world_position

      const position = randomInCircle(x, y, LINK_DISTANCE)

      this._node_type[next_pin_node_id] = 'p'

      this._sim_add_link_pin_node(graph_id, type, next_pin_id, position)
      this._sim_add_link_pin_link(graph_id, type, next_pin_id)

      const merge_node_id = this._pin_to_merge[pin_node_id]

      if (merge_node_id) {
        const { id: merge_id } = segmentMergeNodeId(merge_node_id)

        this._sim_remove_pin_from_merge(merge_node_id, pin_node_id)
        this.__spec_remove_pin_from_merge(merge_id, unit_id, type, pin_id)

        this.__spec_merge_link_pin_merge_pin(
          merge_id,
          graph_id,
          type,
          next_pin_id
        )
        this._sim_merge_link_pin_merge_pin(next_pin_node_id, merge_node_id)
      }
    })

    this._sim_remove_unit(unit_id)
    this._spec_remove_unit(unit_id)
  }

  private _sim_move_unit_into_graph = (
    graph_id: string,
    unit_id: string,
    next_unit_id: string
  ): void => {
    // console.log('Graph', '_sim_insert_node_into_graph', graph_id, unit_id, next_unit_id)
    const unit_merges = this._get_unit_merges(unit_id)

    for (const merge_id in unit_merges) {
      const merge = unit_merges[merge_id]

      const unit_merge = merge[unit_id]

      const { input = {}, output = {} } = unit_merge

      const merge_node_id = getMergeNodeId(merge_id)

      for (const input_id in input) {
        const pin_node_id = getPinNodeId(unit_id, 'input', input_id)

        this._sim_remove_pin_from_merge(merge_node_id, pin_node_id)

        this._sim_merge_link_pin_merge_pin(pin_node_id, merge_node_id)
      }
    }

    this._sim_remove_unit(unit_id)
  }

  private _spec_move_unit_into_graph = (
    graph_id: string,
    unit_id: string,
    next_unit_id: string
  ): void => {
    // console.log('Graph', '_spec_insert_node_into_graph', graph_id, unit_id, next_unit_id)
    const graph_spec_id = this._get_unit_spec_id(graph_id)
    const graph_spec = this._get_unit_spec(graph_id) as GraphSpec

    const unit = this._get_unit(unit_id)

    let updated_graph_spec = specReducer.addUnit(
      { id: next_unit_id, unit },
      graph_spec
    )

    const unit_merges = this._get_unit_merges(unit_id)

    for (const merge_id in unit_merges) {
      const merge = unit_merges[merge_id]

      const unit_merge = merge[unit_id]

      const { input = {}, output = {} } = unit_merge

      for (const input_id in input) {
        const next_input_id = input_id // TODO

        updated_graph_spec = specReducer.exposeInputSet(
          {
            id: next_input_id,
            input: { pin: { '0': { unitId: next_unit_id, pinId: input_id } } },
          },
          updated_graph_spec
        )

        this.__spec_remove_pin_from_merge(merge_id, unit_id, 'input', input_id)

        this.__spec_merge_link_pin_merge_pin(
          merge_id,
          graph_id,
          'input',
          next_input_id
        )
      }
    }

    setSpec(graph_spec_id, updated_graph_spec)

    this._spec_remove_unit(unit_id)
  }

  private _pod_move_unit_into_graph = (
    graph_id: string,
    unit_id: string,
    next_unit_id: string
  ): void => {
    // console.log('Graph', '_pod_move_unit_into_graph', graph_id, unit_id, next_unit_id)
    this._pod.$moveUnitInto({
      graphId: graph_id,
      unitId: unit_id,
      nextUnitId: next_unit_id,
    })
  }

  private _move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type: 'input' | 'output',
    pin_id: string
  ): void => {
    console.log('Graph', '_move_link_pin_into_graph', graph_id, unit_id)

    const next_pin_id = 'TODO' // TODO

    this._state_move_link_pin_into_graph(
      graph_id,
      unit_id,
      type,
      pin_id,
      next_pin_id
    )
    this._pod_move_link_pin_into_graph(
      graph_id,
      unit_id,
      type,
      pin_id,
      next_pin_id
    )
  }

  private _state_move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type: 'input' | 'output',
    pin_id: string,
    next_pin_id: string
  ): void => {
    // console.log('Graph', '_state_move_link_pin_into_graph', graph_id, unit_id)
    this._sim_move_link_pin_into_graph(
      graph_id,
      unit_id,
      type,
      pin_id,
      next_pin_id
    )
    this._spec_move_link_pin_into_graph(
      graph_id,
      unit_id,
      type,
      pin_id,
      next_pin_id
    )
  }

  private _sim_move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type: 'input' | 'output',
    pin_id: string,
    next_pin_id: string
  ): void => {
    // console.log('Graph', '_sim_move_link_pin_into_graph', graph_id, unit_id, type, pin_id, next_pin_id)
  }

  private _spec_move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type: 'input' | 'output',
    pin_id: string,
    next_pin_id: string
  ): void => {
    // console.log('Graph', '_spec_move_link_pin_into_graph', graph_id, unit_id, type, pin_id, next_pin_id)
  }

  private _pod_move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type,
    pin_id: string,
    next_pin_id: string
  ): void => {
    // console.log('Graph', '_pod_move_link_pin_into_graph', graph_id, unit_id, type, pin_id, next_pin_id)
    this._pod.$moveLinkPinInto({
      graphId: graph_id,
      unitId: unit_id,
      type,
      pinId: pin_id,
      nextPinId: next_pin_id,
    })
  }

  private _move_merge_into_graph = (
    graph_id: string,
    merge_id: string,
    next_merge_id: string
  ): void => {
    console.log('Graph', '_move_merge_into_graph', graph_id, merge_id)
    this._state_move_merge_into_graph(graph_id, merge_id, next_merge_id)
    this._pod_move_merge_into_graph(graph_id, merge_id, next_merge_id)
  }

  private _state_move_merge_into_graph = (
    graph_id: string,
    merge_id: string,
    pin_id: string
  ): void => {
    // console.log('Graph', '_state_move_merge_into_graph', graph_id, merge_id)
    this._sim_move_merge_into_graph(graph_id, merge_id, pin_id)
    this._spec_move_merge_into_graph(graph_id, merge_id, pin_id)
  }

  private _sim_move_merge_into_graph = (
    graph_id: string,
    merge_id: string,
    pin_id: string
  ): void => {
    // console.log('Graph', '_sim_move_merge_into_graph', graph_id, merge_id, pin_id)
  }

  private _spec_move_merge_into_graph = (
    graph_id: string,
    merge_id: string,
    next_merge_id: string
  ): void => {
    // console.log('Graph', '_spec_move_merge_into_graph', graph_id, merge_id, next_merge_id)
  }

  private _pod_move_merge_into_graph = (
    graph_id: string,
    merge_id: string,
    next_merge_id: string
  ): void => {
    // console.log('Graph', '_pod_move_merge_into_graph', graph_id, merge_id, next_merge_id)
    this._pod.$moveMergePinInto({
      graphId: graph_id,
      mergeId: merge_id,
      nextMergeId: next_merge_id,
    })
  }

  private _set_long_press_pointer = (pointerId: number, x: number, y: number): void => {
    this._long_press_screen_position = { x, y } // TODO should be a dict
    this._long_press_pointer.add(pointerId)
    this._long_press_count++
  }

  private _on_long_press = (
    event: IOPointerEvent,
    _event: PointerEvent
  ): void => {
    console.log('Graph', '_on_long_press')
    const { pointerId, clientX, clientY, screenX, screenY } = event

    this._set_long_press_pointer(pointerId, clientX, clientY)

    if (this._is_background_pointer_event(event)) {
      this._long_press_background_pointer.add(pointerId)
      this._long_press_background_count++

      this._animate_long_press(event, 'in')

      if (this._tree_layout) {
        //
      } else {
        if (this._mode === 'multiselect') {
          if (this._pointer_down_count === 1) {
            if (this._selected_node_count > 0) {
              this._start_static()

              for (const selected_node_id in this._selected_node_id) {
                this._on_node_static_start(selected_node_id)
              }

              this._start_long_press_collapse(
                pointerId,
                null,
                this._long_press_screen_position
              )
            } else {
              // this._leave()
            }
          }
        } else if (this._mode === 'info') {
          // TODO
        } else if (
          this._mode === 'add' ||
          this._mode === 'change' ||
          this._mode === 'remove' ||
          this._mode === 'data'
        ) {
          if (!this._capturing_gesture && this._search_hidden) {
            this._drag_and_drop = true
            this._drag_and_drop_pointer = pointerId
            // this._zoom_comp.setProp('draggable', true)

            const svg = this._minimap._map_el.$element.cloneNode(
              true
            ) as SVGSVGElement
            svg.removeChild(svg.childNodes[1])

            const { $theme } = this.$context
            const fallback_color = this._get_color()
            const color = getThemeModeColor($theme, this._mode, fallback_color)

            const width = MINIMAP_WIDTH
            const height = MINIMAP_HEIGHT
            svg.setAttribute('stroke', color)
            svg.style.color = color
            svg.style.position = 'fixed'
            svg.style.zIndex = `${MAX_Z_INDEX}`
            svg.style.width = `${width}px`
            svg.style.height = `${height}px`
            svg.style.pointerEvents = 'none'

            // this._main.releasePointerCapture(pointerId)
            // this._release_pointer_down(pointerId)

            const spec = clone(this._spec)

            const { units } = spec
            // position calculation is based on Center of Mass calculation,
            // which won't work when there aren no units at all
            if (!isEmptyObject(units)) {
              this._set_units_position(units)
            }

            if (this._mode === 'data') {
              for (const unit_id in this._graph_state) {
                const unit_state = this._graph_state[unit_id]
                const unit = units[unit_id]
                unit.state = unit_state
              }
            }

            // console.log(spec)

            this._drag_and_drop_cancel = dragAndDrop(
              this.$system,
              svg,
              pointerId,
              // clientX,
              // clientY,
              screenX,
              screenY,
              width,
              height,
              spec,
              (foundTarget: boolean) => {
                this._drag_and_drop = false
                this._drag_and_drop_pointer = null

                if (this._enabled()) {
                  this._start_debugger()
                }

                if (!foundTarget) {
                  const position = this._screen_to_world(clientX, clientY)

                  this.paste_spec(spec, position)

                  this.focus()
                }
              }
            )

            if (this._mode === 'change' || this._mode === 'remove') {
              this._stop_debugger()

              const all_node_ids = Object.keys(this._node)
              this._remove_nodes(all_node_ids)
            }
          }
        }
      }
    }
  }

  private _long_click_cancel_pointer_id = new Set<number>()

  private _on_long_click_cancel = (event): void => {
    // console.log('Graph', '_on_long_click_cancel')
    const { pointerId } = event
    const hovered_pointer_id = this._pointer_id_hover_node_id[pointerId]
    if (hovered_pointer_id) {
      this._long_click_cancel_pointer_id.add(pointerId)
    } else {
      //
    }
  }

  private _drag_and_drop_cancel: Unlisten

  private _cancel_drag_and_drop = () => {
    // console.log('Graph', '_cancel_drag_and_drop')
    if (this._drag_and_drop_cancel) {
      this._drag_and_drop_cancel()
    }

    this._drag_and_drop = false
  }

  private _on_click_hold = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_click_hold')

    if (this._is_background_pointer_event(event)) {
      this._animate_long_press(event, 'in')

      if (!this._capturing_gesture) {
        this._start_gesture(event)
      }
    } else {
    }
  }

  private _animate_long_press = (
    event: IOPointerEvent,
    direction: 'in' | 'out'
  ): void => {
    // console.log('Graph', '_animate_long_press', direction)
    const {
      $method: { showLongPress },
    } = this.$system

    const { $theme } = this.$context

    const color = this._get_color()

    const stroke = getThemeModeColor($theme, this._mode, color)

    showLongPress(event, { stroke, direction })
  }

  private _start_gesture = (event: IOPointerEvent): void => {
    // console.log('Graph', '_start_gesture')
    if (!this._capturing_gesture) {
      const {
        $method: { captureGesture },
      } = this.$system

      const { $theme } = this.$context

      this._capturing_gesture = true

      const color = this._get_color()
      const strokeStyle = getThemeModeColor($theme, this._mode, color)
      const lineWidth = 2

      captureGesture(
        event,
        { strokeStyle, lineWidth },
        this._on_capture_gesture_end
      )

      // AD HOC
      // #2064
      // Safari (OSX) will not emit "pointerleave" when an element "outside"
      // (the system's canvas in this case) calls setPointerCapture
      // this._main.$element.dispatchEvent(new PointerEvent('pointerleave', event))
      // this.$context.$element.dispatchEvent(
      //   new PointerEvent('pointerleave', event)
      // )
    }
  }

  private _on_backspace_keydown = () => {
    // console.log('Graph', '_on_backspace_keydown')
    if (!this._edit_datum_id && !this._edit_node_name_id) {
      this._remove_selected_nodes()
    }
  }

  private _clear_debugger = (): void => {
    this._debug_buffer = []
    this._debug_cursor = -1
  }

  private _remove_selected_nodes = (): void => {
    if (this._selected_node_count > 0) {
      const selected_node_list = keys({ obj: this._selected_node_id }).keys
      this._remove_nodes(selected_node_list)
    }
  }

  private _on_ctrl_semicolon_keydown = () => {
    // console.log('Graph', '_on_ctrl_p_keydown')
    if (this._focused) {
      if (this._search_hidden) {
        this._show_search()
      } else {
        this._hide_search()
      }
    }
  }

  private _on_ctrl_s_keydown = () => {
    // console.log('Graph', '_on_ctrl_s_keydown')
    const { name } = this._spec
    // const { $method: {} } = this.$system
    downloadJSON(name, this._spec, null, 2)
  }

  private _decant_node_ids = (
    node_ids: string[]
  ): {
    unit_ids: string[]
    merge_ids: string[]
    link_pin_ids: string[]
    exposed_ids: string[]
    datum_ids: string[]
  } => {
    const unit_ids: string[] = []
    const merge_ids: string[] = []
    const link_pin_ids: string[] = []
    const exposed_ids: string[] = []
    const datum_ids: string[] = []

    for (const node_id of node_ids) {
      if (this._is_unit_node_id(node_id)) {
        unit_ids.push(node_id)
      } else if (this._is_link_pin_node_id(node_id)) {
        link_pin_ids.push(node_id)
      } else if (this._is_merge_node_id(node_id)) {
        merge_ids.push(node_id)
      } else if (this._is_exposed_pin_node_id(node_id)) {
        exposed_ids.push(node_id)
      } else if (this._is_datum_node_id(node_id)) {
        datum_ids.push(node_id)
      }
    }

    return {
      unit_ids,
      merge_ids,
      link_pin_ids,
      exposed_ids,
      datum_ids,
    }
  }

  public _copy_nodes = (node_ids: string[]) => {
    // log('Graph', '_copy_nodes')
    const graph: GraphSpec = {}

    const units: UnitsSpec = {}
    const merges: GraphMergesSpec = {}
    const inputs: GraphExposedPinsSpec = {}
    const outputs: GraphExposedPinsSpec = {}
    const component: GraphComponentSpec = {}
    const data: GraphDataSpec = {}

    const { unit_ids, merge_ids, link_pin_ids, exposed_ids, datum_ids } =
      this._decant_node_ids(node_ids)

    const _ref_unit_merge_count: Dict<number> = {}

    for (const unit_id of unit_ids) {
      const unit = this._get_unit(unit_id)
      units[unit_id] = unit

      const unit_merges = this._get_unit_merges(unit_id)

      for (const unit_merge_id in unit_merges) {
        if (this._merge_ref[unit_merge_id]) {
          _ref_unit_merge_count[unit_merge_id] =
            _ref_unit_merge_count[unit_merge_id] ?? 0
          _ref_unit_merge_count[unit_merge_id] += 1
          if (_ref_unit_merge_count[unit_merge_id] === 2) {
            merge_ids.push(unit_merge_id)
          }
        }
      }

      if (this._is_unit_component(unit_id)) {
        component.children = component.children || []
        component.subComponents = component.subComponents || {}
        component.children.push(unit_id)
        // TODO
        // should copy hierarchy too
        component.subComponents[unit_id] = {}
      }
    }

    for (const merge_node_id of merge_ids) {
      const { id: merge_id } = segmentMergeNodeId(merge_node_id)

      const merge = this.__get_merge(merge_id)

      const partial_merge: GraphMergeSpec = {}
      for (const unit_id in merge) {
        if (units[unit_id]) {
          const merge_unit = merge[unit_id]
          partial_merge[unit_id] = merge_unit
        }
      }

      merges[merge_id] = partial_merge
    }

    for (const datum_node_id of datum_ids) {
      const { id: datum_id } = segmentDatumNodeId(datum_node_id)
      const tree = this._datum_tree[datum_id]
      const { value } = tree
      data[datum_id] = value
    }

    if (!isEmptyObject(units)) {
      this._set_units_position(units)

      graph.units = units
    }

    if (!isEmptyObject(component)) {
      graph.component = component
    }

    if (!isEmptyObject(merges)) {
      graph.merges = merges
    }

    if (!isEmptyObject(inputs)) {
      graph.inputs = inputs
    }

    if (!isEmptyObject(outputs)) {
      graph.outputs = outputs
    }

    if (!isEmptyObject(data)) {
      graph.data = data
    }

    // console.log(graph)

    const json = JSON.stringify(graph)

    textToClipboard(json, (_, err: string) => {
      if (err) {
        this._show_err(err)
      }
    })
  }

  public _show_err = (err: string): void => {
    // TODO
    console.error(err)
  }

  public cut_nodes = (node_ids: string[]) => {
    this._copy_nodes(node_ids)
    this._remove_nodes(node_ids)
  }

  public cut_single_node = (node_id: string): void => {
    const node_ids = [node_id]
    this.cut_nodes(node_ids)
  }

  public cut_selected_nodes = () => {
    // console.log('Graph', 'cut_selected_nodes')
    const node_ids = Object.keys(this._selected_node_id)
    this.cut_nodes(node_ids)
  }

  public copy_single_node = (node_id: string): void => {
    const node_ids = [node_id]
    this._copy_nodes(node_ids)
  }

  public copy_selected_nodes = () => {
    const node_ids = Object.keys(this._selected_node_id)
    this._copy_nodes(node_ids)
  }

  private _validate_graph_spec = (data: any): boolean => {
    // TODO
    return true
  }

  private _paste_clipboard = async (position: Position) => {
    if (navigator && navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText()
      this._paste_text(text, position)
    } else {
      showNotification('Clipboard API not supported', {
        color: RED,
        borderColor: RED,
      })
    }
  }

  private _paste_text = (text: string, position: Position): void => {
    let json: GraphSpec | undefined = undefined
    try {
      json = JSON.parse(text) as GraphSpec
    } catch {
      // TODO
    }

    if (json) {
      const valid = this._validate_graph_spec(json)
      if (valid) {
        this.paste_spec(json, position)
      } else {
        // TODO
      }
    }
  }

  public paste_spec = (graph: GraphSpec, position: Position) => {
    console.log('Graph', 'paste_spec', graph)
    const {
      units = {},
      merges = {},
      inputs = {},
      outputs = {},
      data = {},
    } = graph

    const map_unit_id: Dict<string> = {}
    const map_merge_id: Dict<string> = {}
    const map_input_id: Dict<string> = {}
    const map_output_id: Dict<string> = {}
    const map_datum_id: Dict<string> = {}

    const set_unit_id: Set<string> = new Set()
    const set_merge_id: Set<string> = new Set()
    const set_input_id: Set<string> = new Set()
    const set_output_id: Set<string> = new Set()
    const set_datum_id: Set<string> = new Set()

    for (const unit_id in units) {
      const unit = units[unit_id]
      const { path } = unit
      const new_unit_id = this._new_unit_id(path, set_unit_id)
      set_unit_id.add(new_unit_id)
      map_unit_id[unit_id] = new_unit_id
    }

    for (const merge_id in merges) {
      const new_merge_id = this._new_merge_id(set_merge_id)
      set_merge_id.add(new_merge_id)
      map_merge_id[merge_id] = new_merge_id
    }

    for (const input_id in inputs) {
      const new_input_id = this._new_input_id(input_id, set_input_id)
      set_input_id.add(new_input_id)
      map_input_id[input_id] = new_input_id
    }

    for (const output_id in outputs) {
      const new_output_id: string = this._new_output_id(
        output_id,
        set_output_id
      )
      set_output_id.add(new_output_id)
      map_output_id[output_id] = new_output_id
    }

    for (const datum_id in data) {
      const new_datum_id = this._new_datum_id(set_datum_id)
      set_datum_id.add(new_datum_id)
      map_datum_id[datum_id] = new_datum_id
    }

    this._paste_spec(
      graph,
      position,
      map_unit_id,
      map_merge_id,
      map_input_id,
      map_output_id,
      map_datum_id
    )
  }

  public _remap_graph = (
    graph: GraphSpec,
    map_unit_id: Dict<string>,
    map_merge_id: Dict<string>,
    map_input_id: Dict<string>,
    map_output_id: Dict<string>,
    map_datum_id: Dict<string>
  ): GraphSpec => {
    const {
      units = {},
      merges = {},
      inputs = {},
      outputs = {},
      component = {},
      data = {},
    } = graph

    const _graph: GraphSpec = {
      units: {},
      merges: {},
      inputs: {},
      outputs: {},
      component: {
        subComponents: {},
        children: [],
      },
      data: {},
    }

    for (const unit_id in units) {
      const unit = units[unit_id]
      const new_unit_id = map_unit_id[unit_id] ?? unit_id
      _graph.units[new_unit_id] = unit
    }

    for (const merge_id in merges) {
      const merge = merges[merge_id]
      const new_merge_id = map_merge_id[merge_id] ?? merge_id
      const new_merge: GraphMergeSpec = {}
      for (const unit_id in merge) {
        const unit = merge[unit_id]
        const new_unit_id = map_unit_id[unit_id]
        new_merge[new_unit_id] = unit
      }
      _graph.merges[new_merge_id] = new_merge
    }

    const type_pins = { input: inputs, output: outputs }
    const type_map_pin_id = { input: map_input_id, output: map_output_id }

    for (const _type of ['input', 'output']) {
      const type = _type as 'input' | 'output'
      const pins = type_pins[type]
      const map_pin_id = type_map_pin_id[type]
      for (const pin_id in pins) {
        const type_pin = pins[pin_id]
        const { pin = {} } = type_pin

        const new_pin_id = map_pin_id[pin_id] || pin_id

        const new_pin: GraphExposedPinSpec = {
          ...type_pin,
          pin: {},
        }

        for (const sub_pin_id in pin) {
          const sub_pin = pin[sub_pin_id]
          const { unitId, pinId, mergeId } = sub_pin
          if (unitId && pinId) {
            const new_unit_id = map_unit_id[unitId]
            new_pin.pin[sub_pin_id] = { unitId: new_unit_id, pinId }
          } else if (mergeId) {
            const new_merge_id = map_merge_id[mergeId]
            new_pin.pin[sub_pin_id] = { mergeId: new_merge_id }
          }
        }

        _graph[`${type}s`][new_pin_id] = new_pin
      }
    }

    const { subComponents = {}, children = [] } = component

    for (const child_id of children) {
      const new_unit_id = map_unit_id[child_id]
      _graph.component.children.push(new_unit_id)
    }

    for (const unit_id in subComponents) {
      const sub_component = subComponents[unit_id]
      const { children = [], childSlot = {} } = sub_component
      const new_unit_id = map_unit_id[unit_id]
      _graph.component.subComponents[new_unit_id] = {
        children: [],
        childSlot: {},
      }
      for (const child_id of children) {
        const new_child_id = map_unit_id[unit_id]
        _graph.component.subComponents[new_unit_id].children.push(new_unit_id)
        _graph.component.subComponents[new_unit_id].childSlot[new_child_id] =
          childSlot[child_id]
      }
    }

    for (const datum_id in data) {
      const value = data[datum_id]
      const new_datum_id = map_datum_id[datum_id] || datum_id
      _graph.data[new_datum_id] = value
    }

    return _graph
  }

  public _paste_spec = (
    graph: GraphSpec,
    position: Position,
    map_unit_id: Dict<string>,
    map_merge_id: Dict<string>,
    map_input_id: Dict<string>,
    map_output_id: Dict<string>,
    map_datum_id: Dict<string>
  ): void => {
    // console.log('Graph', '_paste_spec', graph)
    const _graph = this._remap_graph(
      graph,
      map_unit_id,
      map_merge_id,
      map_input_id,
      map_output_id,
      map_datum_id
    )

    this.__paste_spec(_graph, position)
  }

  public _state_paste_spec = (
    graph: GraphSpec,
    position: Position,
    map_unit_id: Dict<string>,
    map_merge_id: Dict<string>,
    map_input_id: Dict<string>,
    map_output_id: Dict<string>,
    map_datum_id: Dict<string>
  ): void => {
    // console.log('Graph', '_paste_spec', graph)
    const _graph = this._remap_graph(
      graph,
      map_unit_id,
      map_merge_id,
      map_input_id,
      map_output_id,
      map_datum_id
    )

    this.__state_paste_spec(_graph, position)
  }

  public _paste_spec0 = (
    graph: GraphSpec,
    position: Position,
    map_unit_id: Dict<string>,
    map_merge_id: Dict<string>,
    map_input_id: Dict<string>,
    map_output_id: Dict<string>,
    map_datum_id: Dict<string>
  ): void => {
    // console.log('Graph', '_paste_spec', graph)
    const {
      units = {},
      merges = {},
      inputs = {},
      outputs = {},
      component = {},
      data = {},
    } = graph

    for (const unit_id in units) {
      const unit = units[unit_id]

      const new_unit_id = map_unit_id[unit_id] ?? unit_id

      const cm_p = (unit.metadata && unit.metadata.position) || NULL_VECTOR
      const p = addVector(position, cm_p)

      this._spec_add_unit(new_unit_id, unit)

      this._sim_add_core(new_unit_id, unit, p)
    }

    let new_merges: GraphMergesSpec = {}

    for (const merge_id in merges) {
      const merge = merges[merge_id]

      const new_merge_id = map_merge_id[merge_id] ?? merge_id

      const new_merge: GraphMergeSpec = {}

      for (const unit_id in merge) {
        const unit = merge[unit_id]
        const new_unit_id = map_unit_id[unit_id]
        new_merge[new_unit_id] = unit
      }

      new_merges[new_merge_id] = new_merge

      this._state_add_merge(new_merge_id, new_merge, position)
    }

    for (const unit_id in units) {
      const unit = units[unit_id]
      const new_unit_id = map_unit_id[unit_id] ?? unit_id
      const unit_pin_position = this._get_spec_init_unit_pin_position(
        graph,
        unit_id
      )
      this._sim_add_unit_pins(new_unit_id, unit, unit_pin_position)
    }

    for (const merge_id in merges) {
      const new_merge_id = map_merge_id[merge_id]
      this._sim_collapse_merge(new_merge_id)
    }

    for (const unit_id in units) {
      const unit = units[unit_id]
      const new_unit_id = map_unit_id[unit_id]
      this._pod_add_unit(new_unit_id, unit)
    }

    for (const merge_id in new_merges) {
      const merge = new_merges[merge_id]
      this._pod_add_merge(merge_id, merge)
    }

    const type_pins = { input: inputs, output: outputs }
    const type_map_pin_id = { input: map_input_id, output: map_output_id }

    for (const _type of ['input', 'output']) {
      const type = _type as 'input' | 'output'
      const pins = type_pins[type]
      const map_pin_id = type_map_pin_id[type]
      for (const pin_id in pins) {
        const type_pin = pins[pin_id]
        const { pin = {} } = type_pin

        const new_pin_id = map_pin_id[pin_id] || pin_id

        const new_pin: GraphExposedPinSpec = {
          ...type_pin,
          pin: {},
        }

        for (const sub_pin_id in pin) {
          const sub_pin = pin[sub_pin_id]
          const { unitId, pinId, mergeId } = sub_pin
          if (unitId && pinId) {
            const new_unit_id = map_unit_id[unitId]
            new_pin.pin[sub_pin_id] = { unitId: new_unit_id, pinId }
          } else if (mergeId) {
            const new_merge_id = map_merge_id[mergeId]
            new_pin.pin[sub_pin_id] = { mergeId: new_merge_id }
          }
        }

        this._state_add_exposed_pin_set(type, new_pin_id, new_pin, {})
        this._pod_add_exposed_pin_set(type, new_pin_id, new_pin)
      }
    }

    const { subComponents = {} } = component

    const parent_id: string | null = this._get_sub_component_target_parent_id()

    for (const unit_id in subComponents) {
      const new_unit_id = map_unit_id[unit_id]
      this._spec_append_component(parent_id, new_unit_id)
      const layout_position = NULL_VECTOR
      this._sim_add_core_component(new_unit_id, parent_id, layout_position)
      this._sim_add_unit_component(new_unit_id)
      this._pod_add_unit_component(unit_id)
    }

    for (const unit_id in subComponents) {
      const sub_component = subComponents[unit_id]
      const { children = [] } = sub_component
      for (const child_id of children) {
        this._mem_move_sub_component_child(unit_id, child_id)
        this._spec_append_sub_component_child(unit_id, child_id)
      }
    }

    for (const datum_id in data) {
      const value = data[datum_id]
      const new_datum_id = map_datum_id[datum_id] || datum_id
      this._sim_add_datum_node(new_datum_id, value, position)
    }
  }

  public __paste_spec = (graph: GraphSpec, position: Position): void => {
    // console.log('Graph', '_paste_spec', graph)
    this.__state_paste_spec(graph, position)
    this.__pod_paste_spec(graph)
  }

  public __state_paste_spec = (graph: GraphSpec, position: Position): void => {
    // console.log('Graph', '_paste_spec', graph)
    const {
      units = {},
      merges = {},
      inputs = {},
      outputs = {},
      component = {},
      data = {},
    } = graph

    for (const unit_id in units) {
      const unit = units[unit_id]
      const cm_p = (unit.metadata && unit.metadata.position) || NULL_VECTOR
      const p = addVector(position, cm_p)
      this._spec_add_unit(unit_id, unit)
      this._sim_add_core(unit_id, unit, p)
    }

    for (const merge_id in merges) {
      const merge = merges[merge_id]
      this._state_add_merge(merge_id, merge, position)
    }

    for (const unit_id in units) {
      const unit = units[unit_id]
      const unit_pin_position = this._get_spec_init_unit_pin_position(
        graph,
        unit_id
      )
      this._sim_add_unit_pins(unit_id, unit, unit_pin_position)
    }

    for (const merge_id in merges) {
      this._sim_collapse_merge(merge_id)
    }

    const type_pins = { input: inputs, output: outputs }

    for (const _type of ['input', 'output']) {
      const type = _type as 'input' | 'output'
      const pins = type_pins[type]
      for (const pin_id in pins) {
        const pin = pins[pin_id]
        this._state_add_exposed_pin_set(type, pin_id, pin, {})
      }
    }

    const { subComponents = {} } = component

    const parent_id: string | null = this._get_sub_component_target_parent_id()

    for (const unit_id in subComponents) {
      this._spec_append_component(parent_id, unit_id)
      const layout_position = NULL_VECTOR
      this._sim_add_core_component(unit_id, parent_id, layout_position)
      this._sim_add_unit_component(unit_id)
    }

    for (const unit_id in subComponents) {
      const sub_component = subComponents[unit_id]
      const { children = [] } = sub_component
      for (const child_id of children) {
        this._mem_move_sub_component_child(unit_id, child_id)
        this._spec_append_sub_component_child(unit_id, child_id)
      }
    }

    for (const datum_id in data) {
      const value = data[datum_id]
      this._sim_add_datum_node(datum_id, value, position)
    }
  }

  public __pod_paste_spec = (graph: GraphSpec): void => {
    // console.log('Graph', '_paste_spec', graph)
    const {
      units = {},
      merges = {},
      inputs = {},
      outputs = {},
      component = {},
      data = {},
    } = graph

    for (const unit_id in units) {
      const unit = units[unit_id]
      this._pod_add_unit(unit_id, unit)
    }

    for (const merge_id in merges) {
      const merge = merges[merge_id]
      this._pod_add_merge(merge_id, merge)
    }

    const type_pins = { input: inputs, output: outputs }

    for (const _type of ['input', 'output']) {
      const type = _type as 'input' | 'output'
      const pins = type_pins[type]
      for (const pin_id in pins) {
        const pin = pins[pin_id]
        this._pod_add_exposed_pin_set(type, pin_id, pin)
      }
    }

    const { subComponents = {} } = component

    for (const unit_id in subComponents) {
      this._pod_add_unit_component(unit_id)
    }
  }

  private _on_ctrl_a_keydown = (): void => {
    this._toggle_select_all()
  }

  private _on_ctrl_c_keydown = (): void => {
    this.copy_selected_nodes()
  }

  private _on_ctrl_x_keydown = (): void => {
    this.cut_selected_nodes()
  }

  private _on_ctrl_v_keydown = (): void => {
    const position = this._jiggle_screen_center()
    this._paste_clipboard(position)
  }

  private _on_l_keydown = (key: string): void => {
    if (this._search) {
      if (this._search_hidden) {
        this._search.call('toggleShape')
      }
    }
  }

  private _on_t_keydown = (key: string): void => {
    if (this._is_fullwindow) {
      this._leave_all_fullwindow(true)
    } else {
      this._enter_default_fullwindow()
    }
  }

  private _undo = (): void => {
    // TODO
  }

  private _redo = (): void => {
    // TODO
  }

  private _on_ctrl_z_keydown = (): void => {
    this._undo()
  }

  private _on_ctrl_shift_z_keydown = (): void => {
    this._redo()
  }

  private _hide_search = () => {
    // console.log('Graph', '_hide_search')
    if (this._search) {
      this._search.blur()
    }
  }

  private _show_search = () => {
    // log('Graph', '_show_search')
    if (this._search) {
      this._search.focus({ preventScroll: true })
    }
  }

  private _get_sub_component_slot_name = (sub_component_id: string): string => {
    const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)
    if (parent_id) {
      const parent_component_spec = this._get_sub_component_spec(parent_id)
      const { childSlot = {} } = parent_component_spec
      return childSlot[sub_component_id] || 'default'
    } else {
      return 'default'
    }
  }

  private _component_insert_child = (
    parent_id: string,
    sub_component_id: string
  ): void => {
    // console.log('Graph', '_component_insert_child', parent_id, sub_component_id)
    this._hide_layout_core(sub_component_id)

    const parent_component = this._get_sub_component(parent_id)
    const sub_component = this._get_sub_component(sub_component_id)

    if (!this._is_fullwindow) {
      this._leave_sub_component_frame(sub_component_id)

      const slot = this._get_sub_component_slot_name(sub_component_id)
      const i = this._get_sub_component_parent_root_index(sub_component_id)
      if (parent_component.$mountParentRoot.length > i) {
        parent_component.insertParentRootAt(sub_component, i, slot)
      } else {
        parent_component.appendParentRoot(sub_component, slot)
      }
    }

    this._layout_parent_root_placed[sub_component_id] = true
  }

  private _on_escape_keydown = () => {
    console.log('Graph', '_on_escape_keydown')
    if (this._edit_datum_node_id) {
      const datum = this._datum[this._edit_datum_node_id]
      datum.blur()
    } else {
      if (this._selected_node_count > 0) {
        this._deselect_all()
      } else {
        this.dispatchEvent('escape', {}, false)
      }
    }
  }

  private _on_enter_keydown = () => {
    // console.log('Graph', '_on_enter_keydown')
    if (this._edit_datum_id) {
      const tree = this._datum_tree[this._edit_datum_id]
      this._commit_data_value(this._edit_datum_id, tree)
    }
  }

  private _map_zoom_translate = (offsetX: number, offsetY: number) => {
    // console.log('Graph', '_map_zoom_translate', offsetX, offsetY)
    const { $width, $height } = this.$context

    const { _min_x, _min_y, _width, _height } = this._minimap

    const ratio = _width / _height
    const map_ratio = MINIMAP_WIDTH / MINIMAP_HEIGHT
    const r = ratio / map_ratio

    let aspectX = offsetX
    let aspectY = offsetY

    if (r > 1) {
      aspectY += (offsetY - MINIMAP_HEIGHT / 2) * (r - 1)
    } else {
      aspectX += (offsetX - MINIMAP_WIDTH / 2) * (1 / r - 1)
    }

    let x = _min_x + (aspectX * _width) / MINIMAP_WIDTH
    let y = _min_y + (aspectY * _height) / MINIMAP_HEIGHT
    const { x: zx, y: zy, k } = this._zoom

    this._translate_x = (zx - x) * k + $width / 2
    this._translate_y = (zy - y) * k + $height / 2

    const zoom = translate(this._zoom, this._translate_x, this._translate_y)

    this.set_zoom(zoom)

    this._translate_pressed_node()

    this._translate_search_node()
  }

  private _on_minimap_wheel = ({
    deltaY,
    ctrlKey,
    clientX,
    clientY,
    offsetX,
    offsetY,
  }: IOWheelEvent): void => {
    if (!ctrlKey) {
      if (this._unit_count > 0) {
        // TODO turn into a single expression
        this._zoom_in(deltaY, this._zoom.x, this._zoom.y)
        this._map_zoom_translate(offsetX, offsetY)
      }
    }
  }

  private _on_minimap_pointer_down = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_minimap_pointer_down', clientX, clientY)
    const { pointerId } = event
    const { clientX, clientY } = event
    if (this._unit_count > 0) {
      this._minimap.setPointerCapture(pointerId)

      this._minimap_pointer_down = true

      if (this._tree_layout) {
        const { $width, $height } = this.$context

        this._minimap_screen.setProp('x', -$width / 2)
        this._minimap_screen.setProp('y', clientY - 4.5 - $height / 2)
        this._minimap_screen.setProp('width', $width)
        this._minimap_screen.setProp('height', $height)
      } else {
        this._map_zoom_translate(clientX, clientY)
      }
    }
  }

  private _on_minimap_pointer_move = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_minimap_pointer_move', clientX, clientY)
    if (this._minimap_pointer_down) {
      const { clientX, clientY } = event

      if (this._tree_layout) {
        const { $width, $height } = this.$context

        this._minimap_screen.setProp('x', -$width / 2)
        this._minimap_screen.setProp('y', clientY - 4.5 - $height / 2)
        this._minimap_screen.setProp('width', $width)
        this._minimap_screen.setProp('height', $height)
      } else {
        this._map_zoom_translate(clientX, clientY)
        this._start_graph_simulation(LAYER_NORMAL)
      }
    }
  }

  private _on_minimap_pointer_up = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_minimap_pointer_up')
    const { pointerId } = event
    this._minimap_pointer_down = false
    this._minimap!.releasePointerCapture(pointerId)
    if (this._search_unit_id) {
      const search_unit_node = this._node[this._search_unit_id]
      search_unit_node.fx = undefined
      search_unit_node.fy = undefined
      this._for_each_unit_pin(this._search_unit_id, (pin_node_id) => {
        const search_unit_pin_node = this._node[pin_node_id]
        search_unit_pin_node.fx = undefined
        search_unit_pin_node.fy = undefined
      })
    }
  }

  private _zoom_in = (deltaY: number, clientX: number, clientY: number) => {
    // console.log('Graph', '_zoom_in', deltaY)
    const { $height, $width } = this.$context
    const { minZoom, maxZoom, zoomTranslate } = this.$props as _Props &
      DefaultProps

    // const set_zoom_timeout = () => {
    //   this._zoom_timeout = setTimeout(() => {
    //     this._on_zoom_end()
    //     this._zoom_timeout = null
    //   }, 30)
    // }
    // if (this._zoom_timeout === null) {
    //   this._on_zoom_start()
    // } else {
    //   clearTimeout(this._zoom_timeout)
    // }
    // set_zoom_timeout()

    const wheel = deltaY < 0 ? 1 : -1

    const k = Math.exp(wheel * ZOOM_INTENSITY)

    const _k = this._zoom.k * k

    let x = zoomTranslate && _k >= 1 ? clientX : $width / 2
    let y = zoomTranslate && _k >= 1 ? clientY : $height / 2

    if (_k > minZoom && _k < maxZoom) {
      const zoom: Zoom = {
        k: _k,
        x: this._zoom.x - (x / _k - x / this._zoom.k),
        y: this._zoom.y - (y / _k - y / this._zoom.k),
      }
      this.set_zoom(zoom)

      if (this._exposed_pin_unplugged_count > 0) {
        this._start_graph_simulation(LAYER_EXPOSED)
      }
    }
  }

  private _sim_relative_layer_m = (
    la: number,
    lb: number,
    r: number[][] = NODE_MASS_RELATIVE
  ) => {
    // const la_sign = Math.sign(la)
    // const lb_sign = Math.sign(lb)
    if (la * lb > 0) {
      // if (la <= lb) {
      //   return 1
      // } else {
      //   return 0
      // }
      const la_abs = Math.abs(la)
      const lb_abs = Math.abs(lb)
      const rab = r[la_abs][lb_abs]
      return rab
    }
    return 0
  }

  private _sim_relative_m = (
    a: string,
    b: string,
    r: number[][] = NODE_MASS_RELATIVE
  ) => {
    const la = this._node_layer[a]
    const lb = this._node_layer[b]

    const la_sign = Math.sign(la)
    const lb_sign = Math.sign(lb)
    if (la_sign * lb_sign > 0) {
      const la_abs = Math.abs(la)
      const lb_abs = Math.abs(lb)
      const rab = r[la_abs][lb_abs]
      return rab
    }

    return 0
  }

  private _sim_max_d = (a: string, b: string): number => {
    const al = this._node_layer[a]
    const bl = this._node_layer[b]

    const a_sg = this._node_to_subgraph[a]
    const b_sg = this._node_to_subgraph[b]

    return this.__sim_max_d(al, bl, a_sg, b_sg)
  }

  private __sim_max_d = (
    al: number,
    bl: number,
    a_sg: string,
    b_sg: string
  ): number => {
    const same_subgraph = a_sg === b_sg

    const al_abs = Math.abs(al)
    const bl_abs = Math.abs(bl)

    if (same_subgraph) {
      const r = SUBGRAPH_RELATIVE_MAX_D[al_abs][bl_abs]
      return SUBGRAPH_MAX_D * r
    } else {
      const r = NOT_SUBGRAPH_RELATIVE_MAX_D[al_abs][bl_abs]
      return NOT_SUBGRAPH_MAX_D * r
    }
  }

  private _force_custom_layer_none = (alpha: number) => {}

  private _force_custom_layer_normal = (alpha: number) => {
    if (this._static) {
      for (const a_id in this._static_position) {
        if (this._static_count[a_id] === 0) {
          const a = this._node[a_id]
          const ax = a._x
          const ay = a._y
          const { x: cx, y: cy } = this._static_position[a_id]
          const dx = ax - cx
          const dy = ay - cy
          const r = Math.sqrt(dx * dx + dy * dy)
          if (r > 0) {
            const s = 0.1
            const k = s * alpha
            a.ax -= dx * k
            a.ay -= dy * k
          }
        }
      }
    }

    this._force_link_y(alpha, this._pin_link)
  }

  private _force_link_y = (alpha: number, links: GraphSimLinks): void => {
    for (const link_id in links) {
      const link = links[link_id]

      const { source_id: a_id, target_id: b_id } = link

      const a = this._node[a_id]
      const b = this._node[b_id]

      const { _y: sy, layer: a_layer } = a
      const { _y: ty, layer: b_layer } = b

      const mab: number = this._sim_relative_layer_m(
        a_layer,
        b_layer,
        LINK_MASS_RELATIVE
      )
      const mba: number = this._sim_relative_layer_m(
        b_layer,
        a_layer,
        LINK_MASS_RELATIVE
      )

      const my = (sy + ty) / 2

      const k = alpha / 3

      b.ay += (my - ty) * k * mab
      a.ay += (my - sy) * k * mba
    }
  }

  private _force_custom_layer_collapse = (alpha: number) => {
    if (this._long_press_collapsing) {
      const { x: cx, y: cy } = this._long_press_collapse_world_position
      for (const a_id in this._selected_node_id) {
        const a = this._node[a_id]
        const { _x, _y } = a
        const dx = _x - cx
        const dy = _y - cy
        const r = Math.sqrt(dx * dx + dy * dy)
        const s = 100
        const k = (s * alpha) / r
        a.ax -= dx * k
        a.ay -= dy * k
        // if (r > 1) {
        //   const s = 200
        //   const k = (s * alpha) / r
        //   a.ax -= dx * k
        //   a.ay -= dy * k
        // } else {
        //   a.ax = 0
        //   a.ay = 0
        //   a._x = cx
        //   a._y = cy
        // }
      }
    }
  }

  private _force_custom_layer_search = (alpha: number) => {
    const search_node_id =
      this._search_unit_id || this._search_unit_datum_node_id
    if (search_node_id) {
      const { x: cx, y: cy } = this._world_screen_center()
      const a = this._node[search_node_id]
      const { _x, _y } = a
      const dx = _x - cx
      const dy = _y - cy
      const r = Math.sqrt(dx * dx + dy * dy)
      if (r > 0.1) {
        const k = alpha / 6
        a.ax -= dx * k
        a.ay -= dy * k
        if (this._pointer_down_count === 0) {
          const ux = -dx / 6
          const uy = -dy / 6
          const zoom = translate(this._zoom, ux, uy)
          this.set_zoom(zoom)
        }
      }
    }

    this._force_link_y(alpha, this._search_link)
  }

  private _force_custom_layer_ignored = (alpha: number): void => {}

  private _force_custom_layer_exposed = (alpha: number): void => {
    const { x: cx, y: cy } = this._world_screen_center()
    const { $width, $height } = this.$context
    const z = this._zoom.k
    const RE = Math.min($width, $height) / 24 / z
    for (const pin_node_id in this._exposed_int_unplugged) {
      const a = this._node[pin_node_id]
      const { _x, _y } = a
      const dx = _x - cx
      const dy = _y - cy
      const r = Math.sqrt(dx * dx + dy * dy)
      let k = (0.1 * z * ((RE - r) * alpha)) / r
      a.ax += dx * k
      a.ay += dy * k
    }

    for (const pin_node_id in this._exposed_ext_unplugged) {
      const a = this._node[pin_node_id]
      const { _x, _y } = a
      const u = unitVector(cx, cy, _x, _y)
      const k = 10 * alpha
      a.ax += k * u.x
      a.ay += k * u.y
    }
  }

  private _force_custom_layer_data_linked = (alpha: number): void => {
    for (const link_id in this._visible_data_link) {
      const link = this._visible_data_link[link_id]
      const { source_id: a_id, target_id: b_id } = link
      const a = this._node[a_id]
      const u = this._pin_line_vector(b_id)
      const k = 9 * alpha
      a.ax += k * u.x
      a.ay += k * u.y
    }

    // const RD = Math.min($width, $height) / 3 / this._zoom.k
    // for (const datum_node_id in this._datum) {
    //   if (!this._datum_to_pin[datum_node_id]) {
    //     const a = this._nodes[datum_node_id]
    //     const dx = a._x - cx
    //     const dy = a._y - cy
    //     const r = Math.sqrt(dx * dx + dy * dy)
    //     let k = ((RD - r) * alpha) / r
    //     a.ax += dx * k
    //     a.ay += dy * k
    //   }
    // }
  }

  private _force_custom_layer_data = (alpha: number): void => {}

  private _force_custom_layer_err = (alpha: number): void => {
    for (const err_node_id in this._err_node) {
      const a = this._node[err_node_id]
      a.ay -= 3 * alpha
    }
  }

  private _force_custom_layer_type = (alpha: number): void => {
    for (const link_id in this._type_link) {
      const link = this._type_link[link_id]
      const { source_id: a_id } = link
      const a = this._node[a_id]
      a.ay -= 9 * alpha
    }
  }

  private _force_custom: ((alpha: number) => void)[] = [
    this._force_custom_layer_none, // 0
    this._force_custom_layer_normal, // 1
    this._force_custom_layer_collapse, // 2
    // NOOP, // 2
    this._force_custom_layer_search, // 3
    this._force_custom_layer_ignored, // 4
    this._force_custom_layer_exposed, // 5
    this._force_custom_layer_data_linked, // 6
    this._force_custom_layer_data, // 7
    this._force_custom_layer_err, // 8
    this._force_custom_layer_type, // 9
  ]

  private _force = (alpha: number): void => {
    for (let i = this._simulation_layer; i < this._layer_node.length; i++) {
      const layer_node = this._layer_node[i]
      const layer_node_entry = Object.entries(layer_node)
      const layer_node_entry_n = layer_node_entry.length
      for (let ii = 0; ii < layer_node_entry_n; ii++) {
        const [a_id, a] = layer_node_entry[ii]

        const { layer: a_layer } = a

        const a_sg = this._node_to_subgraph[a_id]

        for (let jj = ii + 1; jj < layer_node_entry_n; jj++) {
          const [b_id, b] = layer_node_entry[jj]

          const { layer: b_layer } = b

          const b_sg = this._node_to_subgraph[b_id]

          let { l, u } = _surfaceDistance(
            a.shape,
            a._x,
            a._y,
            a.r,
            a.width,
            a.height,
            b.shape,
            b._x,
            b._y,
            b.r,
            b.width,
            b.height
          )

          l = Math.max(l, 1)

          const D = this.__sim_max_d(a_layer, b_layer, a_sg, b_sg)

          if (l < D) {
            const mab: number = this._sim_relative_layer_m(
              a_layer,
              b_layer,
              NODE_MASS_RELATIVE
            )
            const mba: number = this._sim_relative_layer_m(
              b_layer,
              a_layer,
              NODE_MASS_RELATIVE
            )

            const k = (-90 * alpha) / l
            const kb = mab * k
            const ka = mba * k
            b.ax -= u.x * kb
            b.ay -= u.y * kb
            a.ax += u.x * ka
            a.ay += u.y * ka
          }
        }

        for (let l = i - 1; l >= 0; l--) {
          const prev_layer_node = this._layer_node[l]
          const prev_layer_node_entry = Object.entries(prev_layer_node)
          const prev_layer_node_entry_n = prev_layer_node_entry.length
          for (let j = 0; j < prev_layer_node_entry_n; j++) {
            const [b_id, b] = prev_layer_node_entry[j]

            const { layer: b_layer } = b

            const b_sg = this._node_to_subgraph[b_id]

            let { l, u } = _surfaceDistance(
              a.shape,
              a._x,
              a._y,
              a.r,
              a.width,
              a.height,
              b.shape,
              b._x,
              b._y,
              b.r,
              b.width,
              b.height
            )

            l = Math.max(l, 1)

            const D = this.__sim_max_d(a_layer, b_layer, a_sg, b_sg)

            if (l < D) {
              const m: number = this._sim_relative_layer_m(
                b_layer,
                a_layer,
                NODE_MASS_RELATIVE
              )

              const k = (-90 * alpha * m) / l

              a.ax += u.x * k
              a.ay += u.y * k
            }
          }
        }
      }

      const layer_link = this._layer_link[i]

      for (const link_id in layer_link) {
        const link = layer_link[link_id]

        const { source_id: a_id, target_id: b_id } = link

        const a = this._node[a_id]
        const b = this._node[b_id]

        const { layer: a_layer } = a
        const { layer: b_layer } = b

        const mab: number = this._sim_relative_layer_m(
          a_layer,
          b_layer,
          LINK_MASS_RELATIVE
        )
        const mba: number = this._sim_relative_layer_m(
          b_layer,
          a_layer,
          LINK_MASS_RELATIVE
        )

        let { l, d } = _surfaceDistance(
          a.shape,
          a._x,
          a._y,
          a.r,
          a.width,
          a.height,
          b.shape,
          b._x,
          b._y,
          b.r,
          b.width,
          b.height
        )

        l = Math.max(l, 1)
        d = Math.max(d, 1)

        const tl = link.d

        const ax = a._x
        const bx = b._x
        const ay = a._y
        const by = b._y

        const k = ((l - tl) * alpha) / d

        const dvx = (bx - ax) * k
        const dvy = (by - ay) * k

        b.ax -= dvx * mab
        b.ay -= dvy * mab
        a.ax += dvx * mba
        a.ay += dvy * mba
      }

      this._force_custom[i](alpha)
    }
  }

  private _on_simulation_tick = (): void => {
    for (let node_id in this._node) {
      this._tick_node(node_id)
    }

    for (let link_id in this._link) {
      this._tick_link(link_id)
    }

    if (this._minimap) {
      this._tick_minimap()
    }
  }

  private _on_simulation_end = (): void => {
    // console.log('Graph', '_on_simulation_end')
    this._simulation_end = true

    const { units = {} } = this._spec

    this._set_units_position(units)
  }

  private _get_layout_node_anchor_id = (node_id: string): string => {
    let anchor_id = node_id
    let parent_id = this._sub_component_parent[anchor_id]
    while (parent_id && !this._layout_path.includes(parent_id)) {
      anchor_id = parent_id
      parent_id = this._sub_component_parent[anchor_id]
    }
    return anchor_id
  }

  private _layout_core_content_placed: Dict<boolean> = {}

  private _set_layout_core_position = (
    sub_component_id: string,
    x: number,
    y: number
  ): void => {
    // console.log('Graph', '_set_layout_core_position', unit_id, x, y)
    const layout_core = this._layout_core[sub_component_id]

    // mergeStyle(layout_core, {
    //   left: `calc(50% + ${x}px)`,
    //   top: `calc(50% + ${y}px)`,
    // })
    layout_core.$element.style.left = `calc(50% + ${x}px)`
    layout_core.$element.style.top = `calc(50% + ${y}px)`

    const layout_node = this._layout_node[sub_component_id]

    layout_node.x = x
    layout_node.y = y

    if (this._control_lock) {
      if (this._minimap) {
        this._tick_minimap()
      }
    }

    if (!this._search_hidden) {
      if (this._search_unit_id === sub_component_id) {
        if (sub_component_id === this._search_unit_id) {
          const parent_layout_layer =
            this._get_parent_layout_layer(sub_component_id)
          const { scrollHeight } = parent_layout_layer.layer.$element
          this._refresh_layout_component_scroll(
            sub_component_id,
            scrollHeight,
            'up',
            1,
            NOOP
          )
        }
      }
    }
  }

  private _spec_set_nodes_position = (): void => {
    this._spec = this.__spec_set_nodes_position(this._spec)
  }

  private __spec_set_nodes_position = (spec: GraphSpec): GraphSpec => {
    const position_map = this._nodes_cm_position_map(this._node)
    for (const node_id in position_map) {
      const position = position_map[node_id]
      if (this._is_unit_node_id(node_id)) {
        const unit_id = node_id
        spec = assocPath(
          spec,
          ['units', unit_id, 'metadata', 'position'],
          position
        )
      } else if (this._is_link_pin_node_id(node_id)) {
        const pin_node_id = node_id
        const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
        spec = assocPath(
          spec,
          ['units', unitId, type, pinId, 'metadata', 'position'],
          position
        )
      } else if (this._is_merge_node_id(node_id)) {
        const merge_node_id = node_id
        const { id: merge_id } = segmentMergeNodeId(merge_node_id)
        spec = assocPath(
          spec,
          ['metadata', 'position', 'merge', merge_id],
          position
        )
      } else if (this._is_external_pin_node_id(node_id)) {
        const exposed_node_id = node_id
        const { type, id, subPinId } = segmentExposedNodeId(exposed_node_id)
        spec = assocPath(
          spec,
          [`${type}s`, id, 'metadata', 'position', subPinId],
          position
        )
      } else {
      }
    }
    return spec
  }

  private _pod_unlisten: Unlisten

  private _set_units_position = (units: UnitsSpec): void => {
    const position_map = this._nodes_cm_position_map(units)
    for (const unit_id in units) {
      const unit = units[unit_id]
      const position = position_map[unit_id]
      unit.metadata = unit.metadata || {}
      unit.metadata.position = position
    }
  }

  private _pod_started = false

  private _setup_pod = (pod: $Graph) => {
    if (!this._init) {
      return
    }
    if (this._pod_started) {
      return
    }
    // console.log('Graph', '_setup_pod')
    this._pod_started = true

    pod.$getPinData({}, (pinData) => {
      // console.log('pinData', pinData)
      const { input, output } = pinData
      for (let input_id in input) {
        const data = input[input_id]
        if (data === undefined) {
          if (this._unit_datum['input'][input_id] !== undefined) {
            this._unit_debug_remove_pin_data('input', input_id)
          }
        } else {
          // const value = stringify(data)
          this._unit_debug_set_pin_data('input', input_id, data)
        }
      }
      for (let output_id in output) {
        const data = output[output_id]
        if (output_id !== SELF) {
          if (data === undefined) {
            if (this._unit_datum['output'][output_id] !== undefined) {
              this._unit_debug_remove_pin_data('output', output_id)
            }
          } else {
            // const value = stringify(data)
            this._unit_debug_set_pin_data('output', output_id, data)
          }
        }
      }
    })

    pod.$getGraphPinData({}, (state) => {
      this._process_graph_pin_data(state)
    })

    pod.$getGraphErr({}, (unit_err: Dict<string | null>) => {
      this._process_graph_err(unit_err)
    })

    pod.$getGraphState({}, (state: Dict<any>) => {
      this._process_graph_state(state)
    })

    pod.$getGraphChildren({}, (children: Dict<any>) => {
      this._process_graph_children(children)
    })

    pod.$getGraphMergeInputData({}, (state: Dict<any>) => {
      this._process_graph_merge_data(state)
    })

    this._pod_unlisten = callAll([
      pod.$watch(
        {
          events: [
            // 'leaf_set',
            // 'listen',
            // 'unlisten',
            // 'call',
            'input',
            'output',
            'ref_input',
            'ref_output',
            // 'err',
            // 'take_err',
            // 'catch_err',
            'set_input',
            'set_output',
            'remove_input',
            'remove_output',
            'add_unit',
            'remove_unit',
            'move_unit',
            'expose_pin_set',
            'cover_pin_set',
            'expose_pin',
            'cover_pin',
            'plug_pin',
            'unplug_pin',
            'add_pin_to_merge',
            'remove_pin_from_merge',
            'add_merge',
            'remove_merge',
          ],
        },
        this._on_moment
      ),
      pod.$watchGraph({ events: DEFAULT_EVENTS }, this._on_graph_moment),
    ])

    this._start_debugger()
  }

  private _process_graph_pin_data = (
    state: Dict<{ input: Dict<any>; output: Dict<any> }>
  ): void => {
    // console.log('Graph', '_process_graph_pin_data', state)
    for (const unit_id in state) {
      const unit_state = state[unit_id]
      const { input, output } = unit_state
      for (const input_id in input) {
        const data = input[input_id]
        const pin_node_id = getInputNodeId(unit_id, input_id)
        this._graph_debug_refresh_pin_data(pin_node_id, data)
      }
      for (const output_id in output) {
        const data = output[output_id]
        const pin_node_id = getOutputNodeId(unit_id, output_id)
        this._graph_debug_refresh_pin_data(pin_node_id, data)
      }
    }
  }

  private _process_graph_merge_data = (state: Dict<any>): void => {
    for (const merge_id in state) {
      const merge_node_id = getMergeNodeId(merge_id)
      const data = state[merge_id]
      this._graph_debug_refresh_pin_data(merge_node_id, data)
    }
  }

  private _process_graph_err = (unit_err: Dict<string>): void => {
    for (const unit_id in unit_err) {
      const err = unit_err[unit_id]
      if (err) {
        this._graph_debug_set_unit_err(unit_id, err)
      } else {
        if (this._err[unit_id]) {
          this._graph_debug_take_err(unit_id)
        }
      }
    }
  }

  private _process_graph_state = (state: Dict<any>): void => {
    for (const unit_id in state) {
      const unit_state = state[unit_id]
      this._graph_state[unit_id] = unit_state
    }
  }

  private _process_graph_children = (children: Dict<any>): void => {
    for (const unit_id in children) {
      const unit_children = children[unit_id]
      this._graph_children[unit_id] = unit_children
    }
  }

  public moment(
    path: string[],
    data: { type: 'unit' | 'graph'; moment: Moment }
  ): void {
    if (path.length > 0) {
      const [first, ..._path] = path
      if (first === this._subgraph_unit_id) {
        const subgraph = this._subgraph_cache[first]
        subgraph.moment(_path, data)
      } else {
        // swallow (async) debug moment if subgraph not visible
        return
      }
    } else {
      const { type, moment } = data
      if (type === 'unit') {
        this._on_moment(moment)
      } else {
        this._on_graph_moment(moment)
      }
    }
  }

  private _graph_state: GraphState = {}
  private _graph_children: GraphState = {}

  private _graph_debug_refresh_pin_data = (
    pin_node_id: string,
    data: string | undefined
  ): void => {
    // console.log('Graph', '_graph_debug_refresh_pin_data', pin_node_id, data)
    if (data === undefined) {
      this._graph_debug_drop_pin_data(pin_node_id)
    } else {
      this._graph_debug_set_pin_data(pin_node_id, data)
    }
  }

  private _plunk_pod = (graph: $G): void => {
    if (!this._pod_started) {
      return
    }
    // console.log('Graph', '_plunk_pod')
    this._pod_started = false

    this._pod_unlisten()
    this._pod_unlisten = undefined

    this._clear_debugger()

    this._stop_debugger()
  }

  private _start_debugger = (): void => {
    // console.log('Graph', '_start_debugger')
    this._debug_interval = setInterval(() => {
      if (this._debug_cursor < this._debug_buffer.length - 1) {
        this._step_debugger()
      } else {
        this._stop_debugger()
      }
    }, 0)
  }

  private _step_debugger = (direction: 1 | -1 = 1): void => {
    // console.log('Graph', '_step_debugger')
    if (direction === 1 && this._debug_cursor < this._debug_buffer.length - 1) {
      this._debug_cursor++
      const moment = this._debug_buffer[this._debug_cursor]
      this._debug_moment(moment)
    } else if (direction === -1 && this._debug_cursor >= 0) {
      const moment = this._debug_buffer[this._debug_cursor]
      this._debug_moment(getOppositeMoment(moment))
      this._debug_cursor--
    } else {
      console.warn('_step_debugger was called unecessarily')
    }
  }

  private _stop_debugger = (): void => {
    if (this._debug_interval !== null) {
      clearInterval(this._debug_interval)
      this._debug_interval = null
    }
  }

  private _get_unit_pin_random_position = (unit_id: string): Position => {
    const unit_node = this._node[unit_id]
    const { x, y, shape, r } = unit_node
    if (shape === 'circle') {
    } else {
    }
    const position = randomInRadius(x, y, r + LINK_DISTANCE + PIN_RADIUS)
    return position
  }

  private _on_graph_unit_set_input_moment = (
    data: GraphUnitSpecMomentData
  ): void => {
    console.log('Graph', '_on_graph_unit_set_input_moment', data)
    const { unitId, pinId } = data
    this._graph_set_unit_pin(unitId, 'input', pinId)
  }

  private _on_graph_unit_set_output_moment = (
    data: GraphUnitSpecMomentData
  ): void => {
    console.log('Graph', '_on_graph_unit_set_output_moment', data)
    const { unitId, pinId } = data
    this._graph_set_unit_pin(unitId, 'output', pinId)
  }

  private _on_graph_unit_remove_input_moment = (
    data: GraphUnitSpecMomentData
  ): void => {
    console.log('Graph', '_on_graph_unit_remove_input_moment', data)
    const { unitId, pinId } = data
    this._graph_remove_unit_pin(unitId, 'input', pinId)
  }

  private _on_graph_unit_remove_output_moment = (
    data: GraphUnitSpecMomentData
  ): void => {
    console.log('Graph', '_on_graph_unit_remove_output_moment', data)
    const { unitId, pinId } = data
    this._graph_remove_unit_pin(unitId, 'output', pinId)
  }

  private _graph_component_children: Dict<{ id: string; state: Dict<any> }[]> =
    {}

  private _on_graph_leaf_append_child = (moment: GraphMoment): void => {
    console.log('Graph', '_on_graph_leaf_append_child', moment)
    // this._graph_component_children[]
  }

  private _on_graph_leaf_remove_child_at = (moment: GraphMoment): void => {
    console.log('Graph', '_on_graph_leaf_remove_child_at', moment)
  }

  private _componentify_core = (unit_id: string): void => {
    const core = this._core[unit_id]
    // mergeStyle(core, {
    //   borderRadius: '0',
    // })
    core.$element.style.borderRadius = '0'

    const size = this._get_unit_component_graph_size(unit_id)
    const width = size.width + 2
    const height = size.height + 2

    const selection = this._node_selection[unit_id]
    selection.setProp('shape', 'rect')

    this._selection_opt[unit_id] = {
      width,
      height,
      shape: 'rect',
    }

    this.temp_fixate_node(unit_id, 200)

    this._resize_node(unit_id, width / 2, width, height)
    this._resize_core(unit_id, width, height)

    const layout_position = NULL_VECTOR
    this._sim_add_core_component(unit_id, null, layout_position)

    this._hide_core_icon(unit_id)

    this._sim_add_unit_component(unit_id)
    this._pod_add_unit_component(unit_id)

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _decomponentify_core = (unit_id: string): void => {
    // const core = this._core[id]
    // mergeStyle(core, {
    //   borderRadius: '50%',
    // })
    // const selection = this._node_selection[id]
    // selection.setProp('shape', 'circle')
    // const r = this._get_unit_radius(id)
    // const width = 2 * r
    // const height = width
    // this._resize_node(id, width / 2, width, height)
    // this._resize_core(id, width, height)
    // const sub_leave_fullwindow_handler = this._sub_leave_fullwindow_handler[id]
    // if (sub_leave_fullwindow_handler) {
    //   sub_leave_fullwindow_handler()
    // }
    // this._sim_remove_component(id)
  }

  private _on_add_unit_moment = (data: GraphSpecUnitMomentData): void => {
    // console.log('Graph', '_on_add_unit_moment')
    const { unitId, specId } = data

    const position = this._jiggle_screen_center()

    const unit = { path: specId }

    this._spec_add_unit(unitId, unit)

    if (this._is_unit_component(unitId)) {
      this._spec_append_component(null, unitId)
    }

    this._sim_add_unit(unitId, unit, position, { input: {}, output: {} }, null)

    // TODO this should happen independently of `graph`
    if (this._is_unit_component(unitId)) {
      this._sim_add_unit_component(unitId)
      this._pod_add_unit_component(unitId)
    }
  }

  // TODO
  private _on_graph_unit_add_unit_moment = (
    data: UnitGraphSpecMomentData
  ): void => {
    console.log('Graph', '_on_leaf_add_unit_moment', data)
    return
    const { specId, path } = data

    const unitId = path[path.length - 1]

    const unit_spec_id = this._get_unit_spec_id(unitId)
    let spec = getSpec(unit_spec_id) as GraphSpec

    spec = specReducer.addUnit({ id: unitId, unit: { path: specId } }, spec)
    spec.metadata = spec.metadata || {}
    delete spec.metadata.complexity

    // BUG infinite loop
    // TODO fork
    setSpec(unit_spec_id, spec)

    // TODO wrong
    if (this._is_unit_component(unitId)) {
      if (isComponent(specId)) {
        spec.component = componentReducer.setSubComponent(
          { id: unitId, spec: {} },
          spec.component || {}
        )
        spec.component = componentReducer.appendChild(
          { id: unitId },
          spec.component || {}
        )
        setSpec(unit_spec_id, spec)

        let sub_component = this._get_sub_component(unitId)!
        let pod = this._pod.$refUnit({
          unitId,
          _: ['$U', '$C', '$G'],
        }) as $Graph

        for (let i = path.length - 2; i >= 0; i--) {
          const unit_id = path[i]
          sub_component = sub_component.getSubComponent(unit_id)
          pod = pod.$refUnit({ unitId, _: ['$U', '$C', '$G'] }) as $Graph
        }

        if (!sub_component.$subComponent[unitId]) {
          const sub_sub_component = componentFromSpecId(specId, {})
          sub_component.setSubComponent(unitId, sub_sub_component)
          sub_component.pushRoot(sub_sub_component)
          pod = pod.$refUnit({ unitId, _: ['$U', '$C', '$G'] }) as $Graph
          sub_sub_component.connect(pod)
        }
      }
    } else {
      this._refresh_core_circle(unitId)

      const { count: unit_count } = keyCount({ obj: spec.units || {} })
      if (unit_count === 1 && !isComponent(unit_spec_id)) {
        this._set_core_icon(unitId, 'question')
        this._show_core_icon(unitId)
      }
    }
  }

  private _set_core_shape = (unit_id: string, shape: Shape): void => {
    const node = this._node[unit_id]
    const core = this._core[unit_id]
    const core_selection = this._node_selection[unit_id]
    const core_area = this._core_area[unit_id]

    if (shape === 'circle') {
      node.shape = 'circle'
      core.$element.style.borderRadius = '50%'
      core_area.$element.style.borderRadius = '50%'
      core_selection.setProp('shape', 'circle')
    } else {
      node.shape = 'rect'
      core.$element.style.borderRadius = '0'
      core_area.$element.style.borderRadius = '0'
      core_selection.setProp('shape', 'rect')
    }
  }

  private _refresh_core_size = (unit_id: string): void => {
    if (this._is_unit_component(unit_id)) {
      this._refresh_core_rect(unit_id)
    } else {
      this._refresh_core_circle(unit_id)
    }
  }

  private _refresh_core_rect = (unit_id: string): void => {
    const { width, height } = this._get_unit_component_graph_size(unit_id)
    const { x, y } = this._get_node_position(unit_id)
    const r = width / 2
    this._resize_node(unit_id, r, width, height)
    this._resize_core(unit_id, width, height)
    this._set_node_position(unit_id, { x, y })
  }

  private _refresh_core_circle = (unit_id: string): void => {
    const _r = this._get_unit_radius(unit_id, true)
    const r = this._get_unit_radius(unit_id, false)
    const { x, y } = this._get_node_position(unit_id)
    const dr = r - _r
    const width = 2 * r
    const height = width
    this._resize_node(unit_id, r, width, height)
    this._resize_core(unit_id, width, height)
    this._set_node_position(unit_id, { x: x - dr, y: y - dr })
  }

  private _on_remove_unit_moment = (data: GraphSpecUnitMomentData): void => {
    // console.log('Graph', '_on_remove_unit_moment')
    const { unitId } = data
    this._state_remove_unit(unitId)
  }

  private _on_move_unit_moment = (data: GraphSpecUnitMoveMomentData): void => {
    console.log('Graph', '_on_move_unit_moment', data)
    const { id } = data
    this._state_remove_unit(id)
  }

  // TODO
  private _on_graph_unit_remove_unit_moment = (
    data: UnitGraphSpecMomentData
  ): void => {
    // console.log('Graph', '_on_graph_unit_remove_unit_moment')
    return
    const { path, specId } = data

    const id = path[path.length - 1]

    const unit_spec_id = this._get_unit_spec_id(id)
    let spec = getSpec(unit_spec_id) as GraphSpec
    spec = specReducer.removeUnit({ id }, spec)
    spec.metadata = spec.metadata || {}
    delete spec.metadata.complexity
    setSpec(unit_spec_id, spec)

    if (this._is_unit_component(id)) {
      if (isComponent(specId)) {
        spec.component = componentReducer.removeSubComponent(
          { id },
          spec.component || {}
        )
        spec.component = componentReducer.removeChild(
          { id },
          spec.component || {}
        )
        setSpec(unit_spec_id, spec)

        let sub_component = this._get_sub_component(id)!

        for (let i = path.length - 2; i >= 0; i--) {
          const unit_id = path[i]
          sub_component = sub_component.getSubComponent(unit_id)
        }

        const sub_sub_component = sub_component.$subComponent[id]
        if (sub_sub_component) {
          sub_component.removeSubComponent(id)
          sub_component.pullRoot(sub_sub_component)
          sub_sub_component.disconnect()
        }
      }
    } else {
      this._refresh_core_circle(id)

      const { count: unit_count } = keyCount({ obj: spec.units || {} })
      if (unit_count === 0) {
        this._hide_core_icon(id)
      } else {
        this._show_core_icon(id)
      }
    }
  }

  private _is_node_visible = (node_id: string): boolean => {
    if (this._is_unit_node_id(node_id)) {
      return true
    } else if (this._is_link_pin_node_id(node_id)) {
      return !this._is_link_pin_merged(node_id)
    } else if (this._is_merge_node_id(node_id)) {
      return true
    } else if (this._is_datum_node_id(node_id)) {
      return !!this._visible_data_node[node_id]
    } else if (this._is_internal_pin_node_id(node_id)) {
      return !this._exposed_int_plugged[node_id]
    } else if (this._is_external_pin_node_id(node_id)) {
      return true
    } else {
      return false
    }
  }

  // center of mass
  private _nodes_cm = (node_ids: Dict<any>): Position => {
    let sum_x: number = 0
    let sum_y: number = 0
    let count = 0
    for (const node_id in node_ids) {
      if (this._is_node_visible(node_id)) {
        const { x, y } = this._get_node_position(node_id)
        sum_x += x
        sum_y += y
        count++
      }
    }
    const x = sum_x / count
    const y = sum_y / count
    return { x, y }
  }

  private _nodes_cm_position_map = (node_ids: Dict<any>): Dict<Position> => {
    const position: Dict<Position> = {}
    if (!isEmptyObject(node_ids)) {
      const cm = this._nodes_cm(node_ids)
      const { x: cx, y: cy } = cm
      for (const node_id in node_ids) {
        const p = this._get_node_position(node_id)
        const { x, y } = p
        const rp = { x: Math.floor(x - cx), y: Math.floor(y - cy) }
        position[node_id] = rp
      }
    }
    return position
  }

  private _init_merge_spec_position = (
    merge_spec: GraphMergeSpec
  ): Position => {
    const center_of_mass = this._nodes_cm(merge_spec)
    return center_of_mass
  }

  private _sim_collapse_merge = (merge_id: string): void => {
    const merge_spec = this.__get_merge(merge_id)
    const merge_node_id = getMergeNodeId(merge_id)
    const merge_ref_unit_id = this._merge_to_ref_unit[merge_node_id]
    const merge_ref_output_id = this._merge_to_ref_output[merge_node_id]
    forEachPinOnMerge(merge_spec, (unitId, type, pinId) => {
      const pin_node_id = getPinNodeId(unitId, type, pinId)
      this._sim_merge_link_pin_merge_pin(pin_node_id, merge_node_id)
    })
  }

  private _on_add_merge_moment = (moment: GraphMergeMomentData): void => {
    // console.log('Graph', '_on_add_merge_moment', moment)
    const { mergeId, mergeSpec } = moment
    this._spec_add_merge(mergeId, mergeSpec)
    const position = this._init_merge_spec_position(mergeSpec)
    this._sim_add_merge(mergeId, mergeSpec, position)
    this._sim_collapse_merge(mergeId)
  }

  private _on_remove_merge_moment = (data: GraphMergeMomentData): void => {
    // console.log('Graph', '_on_remove_merge_moment', moment)
    const { mergeId } = data
    this.__state_remove_merge(mergeId)
  }

  private _on_add_pin_to_merge_moment = (
    data: GraphMergePinMomentData
  ): void => {
    // console.log('Graph', '_on_add_pin_to_merge_moment', data)
    const { mergeId, unitId, type, pinId } = data
    const merge_node_id = getMergeNodeId(mergeId)
    const pin_node_id = getPinNodeId(unitId, type, pinId)
    this.__spec_merge_link_pin_merge_pin(mergeId, unitId, type, pinId)
    this._sim_merge_link_pin_merge_pin(pin_node_id, merge_node_id)
  }

  private _on_remove_pin_from_merge_moment = (
    data: GraphMergePinMomentData
  ): void => {
    // console.log('Graph', '_on_remove_pin_from_merge_moment', data)
    const { mergeId, unitId, type, pinId } = data
    const merge_node_id = getMergeNodeId(mergeId)
    const pin_node_id = getPinNodeId(unitId, type, pinId)
    this._sim_remove_pin_from_merge(merge_node_id, pin_node_id)
    this.__spec_remove_pin_from_merge(mergeId, unitId, type, pinId)
  }

  private _on_expose_pin_set = (data: GraphExposedPinSetMomentData): void => {
    console.log('Graph', '_on_expose_pin_set', data)
    const { type, pinId, pinSpec } = data
    this._spec_add_exposed_pin_set(type, pinId, pinSpec)
    this._sim_add_exposed_pin_set(type, pinId, pinSpec)
  }

  private _on_cover_pin_set = (data: GraphExposedPinSetMomentData): void => {
    console.log('Graph', '_on_cover_pin_set', data)
    const { type, pinId } = data
    this._sim_remove_exposed_pin_set(type, pinId)
    this._spec_remove_exposed_pin_set(type, pinId)
  }

  private _on_expose_pin = (data: GraphExposedPinEventData): void => {
    console.log('Graph', '_on_expose_pin', data)
    const { type, pinId, subPinId, subPinSpec } = data
    this._state_add_exposed_pin(type, pinId, subPinId, subPinSpec, {})
  }

  private _on_cover_pin = (data: GraphExposedPinEventData): void => {
    console.log('Graph', '_on_cover_pin', data)
    const { type, pinId, subPinId } = data
    this.__sim_remove_exposed_sub_pin(type, pinId, subPinId)
    this.__spec_remove_exposed_sub_pin(type, pinId, subPinId)
  }

  private _on_plug_pin = (data: GraphPlugMomentData): void => {
    console.log('Graph', '_on_plug_pin', data)
    const { type, pinId, subPinId, subPinSpec } = data
    this._sim_plug_exposed_pin(type, pinId, subPinId, subPinSpec)
    this._spec_plug_exposed_pin(type, pinId, subPinId, subPinSpec)
  }

  private _on_unplug_pin = (data: GraphPlugMomentData): void => {
    console.log('Graph', '_on_unplug_pin', data)
    const { type, pinId, subPinId } = data
    this._sim_unplug_exposed_pin(type, pinId, subPinId)
    this._spec_unplug_exposed_pin(type, pinId, subPinId)
  }

  private _graph_set_unit_pin = (
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ) => {
    const pin_node_id = getPinNodeId(unitId, type, pinId)
    if (!this._pin_node[pin_node_id]) {
      const unit_spec_id = this._get_unit_spec_id(unitId)
      let unit_spec = this._get_unit_spec(unitId) as GraphSpec
      unit_spec = specReducer.exposePinSet(
        {
          id: pinId,
          type,
          pin: {
            pin: {},
          },
        },
        unit_spec
      )
      setSpec(unit_spec_id, unit_spec)
      const position = this._get_unit_pin_random_position(unitId)
      this._sim_add_link_pin_node(unitId, type, pinId, position)
      this._sim_add_link_pin_link(unitId, type, pinId)
    }
  }

  private _graph_remove_unit_pin = (
    unitId: string,
    type: 'input' | 'output',
    pinId: string
  ) => {
    // console.log('Graph', '_graph_remove_unit_pin')
    const pin_node_id = getPinNodeId(unitId, type, pinId)
    const merge_node_id = this._pin_to_merge[pin_node_id]
    if (merge_node_id) {
      this._state_remove_pin_or_merge(pin_node_id)
    }
    if (this._pin_node[pin_node_id]) {
      const unit_spec_id = this._get_unit_spec_id(unitId)
      let unit_spec = this._get_unit_spec(unitId) as GraphSpec
      unit_spec = specReducer.coverPinSet(
        {
          id: pinId,
          type,
        },
        unit_spec
      )
      setSpec(unit_spec_id, unit_spec)
      this._sim_remove_link_pin(pin_node_id)
    }
  }

  private _on_graph_unit_link_pin_data_moment = (
    _data: GraphUnitPinDataMomentData
  ): void => {
    // console.log('Graph', '_on_graph_unit_link_pin_data_moment', _data)
    const { unitId, pinId, type, data } = _data

    // @ts-ignore
    const pin_node_id = getPinNodeId(unitId, type, pinId)
    this._graph_debug_set_pin_data(pin_node_id, data)
  }

  private _on_graph_unit_ref_link_pin_data_moment = (
    _data: GraphUnitPinDataMomentData
  ) => {
    const __data = clone(_data)
    __data.data = 'null'
    this._on_graph_unit_link_pin_data_moment(__data)
  }

  private _on_graph_unit_ref_link_pin_drop_moment = (
    _data: GraphUnitPinDropMomentData
  ) => {
    this._on_graph_unit_link_pin_drop_moment(_data)
  }

  private _on_graph_unit_err_moment = (data: GraphUnitErrMomentData) => {
    const { unitId, err } = data
    this._graph_debug_set_unit_err(unitId, err)
  }

  private _graph_debug_set_unit_err(unit_id: string, err: string) {
    // AD HOC
    if (!this._has_node(unit_id)) {
      console.warn('_on_graph_debug_unit_err_moment was called on removed unit')
      return
    }
    this._set_core_border_color(unit_id, OPAQUE_RED)
    if (!this._err[unit_id]) {
      this._err[unit_id] = err
      this._sim_add_unit_err(unit_id, err)
    } else {
      this._sim_set_unit_err(unit_id, err)
    }
  }

  private _on_graph_unit_take_err_moment = (data: GraphUnitErrMomentData) => {
    // console.log('Graph', '_on_graph_unit_take_err_moment')
    const { unitId } = data
    this._graph_debug_take_err(unitId)
  }

  private _graph_debug_take_err = (unitId: string): void => {
    // console.log('Graph', '_graph_debug_take_err', unitId)
    // AD HOC
    if (this._has_node(unitId)) {
      delete this._err[unitId]
      this._reset_core_border_color(unitId)
      this._sim_remove_unit_err(unitId)
    }
  }

  private _on_graph_unit_set_moment = (data: GraphUnitPropMomentData): void => {
    // console.log('Graph', '_on_graph_unit_set_moment', data)
    const { unitId, name, data: _data, path } = data

    this._graph_state[unitId] = assocPath(
      this._graph_state[unitId],
      [...path, name],
      _data
    )
  }

  private _on_graph_unit_append_child_moment = (moment: GraphMoment): void => {
    console.log('Graph', '_on_graph_unit_append_child_moment', moment)
  }

  private _on_graph_unit_remove_child_at_moment = (
    moment: GraphMoment
  ): void => {
    console.log('Graph', '_on_graph_unit_remove_child_at_moment', moment)
  }

  private _unit_debug_set_pin_data = (
    type: 'input' | 'output',
    pinId: string,
    data: string
  ): void => {
    // console.log('Graph', '_unit_debug_set_pin_data', type, pinId, data)
    this._unit_datum[type][pinId] = data
    this._set_exposed_pin_set_color(type, pinId, this._theme.data)
  }

  private _unit_debug_remove_pin_data = (
    type: 'input' | 'output',
    pinId: string
  ) => {
    // console.log('Graph', '_unit_debug_remove_pin_data', type, pinId)
    delete this._unit_datum[type][pinId]
    this._reset_exposed_pin_set_color(type, pinId)
  }

  private _invalid_datum_node_id: Dict<boolean> = {}
  private _invalid_datum_data: Dict<any> = {}

  private __graph_debug_set_pin_data = (
    pin_node_id: string,
    pin_datum_node_id: string,
    data: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '__graph_debug_set_pin_data',
    //   pin_node_id,
    //   pin_datum_node_id,
    //   data
    // )
    const { id: datum_id } = segmentDatumNodeId(pin_datum_node_id)

    const tree = this._datum_tree[datum_id]

    const next_tree = _getValueTree(data)

    const datum = this._datum[pin_datum_node_id]

    const position = this._get_node_position(pin_datum_node_id)

    const class_literal = tree.type === TreeNodeType.Unit
    const next_class_literal = next_tree.type === TreeNodeType.Unit

    if (
      (next_class_literal && !class_literal) ||
      (!next_class_literal && class_literal)
    ) {
      this._sim_remove_datum(pin_datum_node_id)
      this._sim_add_datum_node(datum_id, data, position)
      this._sim_add_datum_link(pin_datum_node_id, pin_node_id)
    } else if (next_class_literal) {
      // @ts-ignore
      const { value: id } = next_tree
      datum.setProp('id', id)
      this._datum_tree[datum_id] = next_tree
      this._refresh_class_literal_datum_node_selection(pin_datum_node_id)
    } else {
      // AD HOC
      // this data event should not have come back
      // for the edit datum, so do not update its tree
      if (datum_id !== this._edit_datum_id) {
        datum.setProp('data', next_tree)
        this._datum_tree[datum_id] = next_tree
      }
    }

    if (this._hover_node_id[pin_datum_node_id]) {
      this._set_node_mode_color(pin_datum_node_id)
    }

    this._refresh_datum_visible(pin_datum_node_id)

    this._refresh_node_color(pin_node_id)
  }

  private _graph_debug_set_pin_data = (
    pin_node_id: string,
    data: string
  ): void => {
    // console.log('Graph', '_graph_debug_set_pin_data', pin_node_id, data)
    let datum_id: string
    const pin_datum_node_id = this._pin_to_datum[pin_node_id]
    if (pin_datum_node_id) {
      const { id: _datum_id } = segmentDatumNodeId(pin_datum_node_id)
      datum_id = _datum_id
      if (!this._visible_data_node[pin_datum_node_id]) {
        this._invalid_datum_node_id[pin_datum_node_id] = true
        this._invalid_datum_data[pin_datum_node_id] = data
      } else {
        this.__graph_debug_set_pin_data(pin_node_id, pin_datum_node_id, data)
      }
    } else {
      datum_id = this._new_datum_id()
      const datum_node_id = getDatumNodeId(datum_id)
      const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)
      const position = this._pin_datum_initial_position(anchor_node_id)
      const tree = _getValueTree(data)
      this._datum_tree[datum_id] = tree
      if (!this._is_pin_ref(anchor_node_id)) {
        this._sim_add_datum_node(datum_id, data, position)
        this._sim_add_datum_link(datum_node_id, pin_node_id)
      } else {
        this._mem_set_pin_datum(pin_node_id, datum_id)
      }
    }
  }

  private _on_graph_unit_link_pin_drop_moment = (
    data: GraphUnitPinDropMomentData
  ): void => {
    // console.log('Graph', '_graph_debug_link_pin_drop_moment', moment)
    const { unitId, type, pinId } = data
    const pin_node_id = getPinNodeId(unitId, type, pinId)
    this._graph_debug_drop_pin_data(pin_node_id)
  }

  private _graph_debug_drop_pin_data = (pin_node_id: string): void => {
    // console.log('Graph', '_graph_debug_drop_pin_data', pin_node_id)
    const datum_node_id = this._pin_to_datum[pin_node_id]
    if (datum_node_id) {
      this._sim_remove_datum(datum_node_id)
    }
  }

  private _on_graph_unit_merge_data_moment = (
    data: GraphMergePinDataMomentData
  ): void => {
    // console.log('Graph', '_on_graph_unit_merge_data_moment', data)
    const { mergeId, data: _data } = data
    const merge_node_id = getMergeNodeId(mergeId)
    this._graph_debug_set_pin_data(merge_node_id, _data)
  }

  private _on_graph_unit_merge_drop_moment = (
    data: GraphMergePinDataMomentData
  ): void => {
    // console.log('Graph', '_on_graph_unit_merge_drop_moment', data)
    const { mergeId } = data
    const merge_node_id = getMergeNodeId(mergeId)
    this._graph_debug_drop_pin_data(merge_node_id)
  }

  private _on_graph_moment = (moment: Moment<any>): void => {
    // console.log('Graph', '_on_graph_moment', moment)
    this._debug_buffer.push(moment)

    if (this._debug_buffer.length > MAX_DEBUG_BUFFER_SIZE) {
      this._flush_debugger()
    }

    if (this._debug_interval === null) {
      this._start_debugger()
    }
  }

  private _graph_moment_handler: Dict<Dict<Function>> = {
    input: {
      data: this._on_graph_unit_link_pin_data_moment,
      drop: this._on_graph_unit_link_pin_drop_moment,
    },
    output: {
      data: this._on_graph_unit_link_pin_data_moment,
      drop: this._on_graph_unit_link_pin_drop_moment,
    },
    ref_input: {
      data: this._on_graph_unit_ref_link_pin_data_moment,
      drop: this._on_graph_unit_ref_link_pin_drop_moment,
    },
    ref_output: {
      data: this._on_graph_unit_ref_link_pin_data_moment,
      drop: this._on_graph_unit_ref_link_pin_drop_moment,
    },
    merge: {
      data: this._on_graph_unit_merge_data_moment,
      drop: this._on_graph_unit_merge_drop_moment,
    },
    unit: {
      append_child: this._on_graph_unit_append_child_moment,
      remove_child_at: this._on_graph_unit_remove_child_at_moment,
      err: this._on_graph_unit_err_moment,
      take_err: this._on_graph_unit_take_err_moment,
      catch_err: this._on_graph_unit_take_err_moment,
      set_input: this._on_graph_unit_set_input_moment,
      set_output: this._on_graph_unit_set_output_moment,
      remove_input: this._on_graph_unit_remove_input_moment,
      remove_output: this._on_graph_unit_remove_output_moment,
      leaf_set: this._on_graph_unit_set_moment,
      leaf_add_unit: this._on_graph_unit_add_unit_moment,
      leaf_remove_unit: this._on_graph_unit_remove_unit_moment,
      leaf_append_child: this._on_graph_leaf_append_child,
      leaf_remove_child_at: this._on_graph_leaf_remove_child_at,
    },
  }

  private _debug_moment = (moment: Moment<any>): void => {
    // console.log('Graph', '_debug_moment', moment)
    const { event, type, data } = moment
    this._graph_moment_handler[type][event](data)
  }

  private _on_data_moment = (moment: PinDataMomentData): void => {
    // console.log('Graph', '_on_data_moment', moment)
    const { type, pinId, data } = moment
    this._unit_debug_set_pin_data(type as 'input' | 'output', pinId, data)
  }

  private _on_drop_moment = (moment: PinDropMomentData): void => {
    // console.log('Graph', '_on_drop_moment', moment)
    const { type, pinId } = moment
    this._unit_debug_remove_pin_data(type as 'input' | 'output', pinId)
  }

  private _unit_moment_handler: Dict<Dict<Function>> = {
    input: {
      data: this._on_data_moment,
      drop: this._on_drop_moment,
    },
    output: {
      data: this._on_data_moment,
      drop: this._on_drop_moment,
    },
    ref_input: {
      data: this._on_data_moment,
      drop: this._on_drop_moment,
    },
    ref_output: {
      data: this._on_data_moment,
      drop: this._on_drop_moment,
    },
    merge: {
      data: NOOP,
      drop: NOOP,
    },
    unit: {
      set_input: NOOP, // TODO
      set_output: NOOP, // TODO
      remove_input: NOOP, // TODO
      remove_output: NOOP, // TODO
      // err: NOOP,
      // take_err: NOOP,
      // catch_err: NOOP,
    },
    graph: {
      add_unit: this._on_add_unit_moment,
      remove_unit: this._on_remove_unit_moment,
      move_unit: this._on_move_unit_moment,
      add_merge: this._on_add_merge_moment,
      remove_merge: this._on_remove_merge_moment,
      add_pin_to_merge: this._on_add_pin_to_merge_moment,
      remove_pin_from_merge: this._on_remove_pin_from_merge_moment,
      expose_pin_set: this._on_expose_pin_set,
      cover_pin_set: this._on_cover_pin_set,
      expose_pin: this._on_expose_pin,
      cover_pin: this._on_cover_pin,
      plug_pin: this._on_plug_pin,
      unplug_pin: this._on_unplug_pin,
    },
  }

  private _on_moment = (moment: Moment): void => {
    // console.log('_on_moment', moment)
    const { event, type, data } = moment
    this._unit_moment_handler[type][event](data)
  }

  private _get_color = (): string => {
    const { $color } = this.$context

    const { style = {} } = this.$props
    const { color = $color } = style

    return color
  }

  private _refresh_minimap_color = () => {
    if (this._minimap) {
      const color = this._get_color()

      // mergeStyle(this._minimap, {
      //   color,
      // })
      this._minimap.$element.style.color = color

      if (this._minimap_screen) {
        // mergeStyle(this._minimap_screen, {
        //   stroke: this._theme.link,
        // })
        this._minimap.$element.style.stroke = this._theme.link
      }
    }
  }

  private _background_color = (): string => {
    const { $theme } = this.$context
    const backgroundColor = setAlpha(themeBackgroundColor($theme), 0.75)
    return backgroundColor
  }

  private _refresh_color = (): void => {
    // console.log('Graph', '_refresh_color')
    const { parent } = this.$props

    const color = this._get_color()

    this._refresh_theme()

    for (let node_id in this._node) {
      this._refresh_node_color(node_id)
    }

    for (let node_id in this._node_selection) {
      this._refresh_selection_color(node_id)
    }

    for (const unit_id in this._subgraph_cache) {
      const graph = this._subgraph_cache[unit_id]
      mergeStyle(graph, { color })
      // graph.$element.style.color = color
    }

    if (this._enabled()) {
      this._refresh_minimap_color()
    }

    // mergeStyle(this._multiselect_area_svg_rect, {
    //   stroke: this._theme.selected,
    // })
    this._multiselect_area_svg_rect.$element.style.stroke = this._theme.selected

    if (!parent) {
      if (this._transcend) {
        const backgroundColor = this._background_color()
        mergeStyle(this._transcend, {
          backgroundColor,
        })
        // this._transcend._container.$element.style.backgroundColor = backgroundColor
      }
    }
  }

  private _enabled = (): boolean => {
    const { disabled } = this.$props
    if (disabled === undefined) {
      const { $disabled } = this.$context
      return !$disabled
    } else {
      return !disabled
    }
  }

  private _refresh_enabled = (): void => {
    if (this._enabled()) {
      this._enable()
    } else {
      this._disable()
    }
  }

  onPropChanged(prop: string, current: any) {
    // console.log('Graph', 'onPropChanged', prop, current)
    if (prop === 'style') {
      const { style = {} } = this.$props
      this._graph.setProp('style', {
        ..._DEFAULT_STYLE,
        ...style,
      })
      this._refresh_color()
    } else if (prop === 'disabled') {
      this._refresh_enabled()
    } else if (prop === 'zoom') {
      this._set_zoom(current)
    } else if (prop === 'pod') {
      const { pod } = this.$props
      this._disable()
      this._disconnect_all_sub_component()
      this._plunk_pod(this._pod)

      this._pod = pod

      this._reset_spec()
      this._setup_pod(this._pod)
      this._refresh_enabled()
    } else if (prop === 'fullwindow') {
      if (current === true && !this._is_fullwindow) {
        // this._enter_all_fullwindow(true)
        this._enter_all_fullwindow(false)
      } else if (current === false && this._is_fullwindow) {
        this._leave_all_fullwindow(true)
      }
    } else if (prop === 'frame') {
      const { frame } = this.$props

      if (this._in_component_control) {
        if (this._is_fullwindow) {
          this._leave_component_frame()

          if (!this._frame_out) {
            this._disable_frame_pointer()
          }
        }
      }

      this._frame = frame

      if (this._in_component_control) {
        if (this._is_fullwindow) {
          this._enter_component_frame()

          if (!this._frame_out) {
            this._enable_frame_pointer()
          }
        }
      }

      for (const unit_id in this._subgraph_cache) {
        const graph = this._subgraph_cache[unit_id]
        graph.setProp('frame', this._frame)
      }
    } else if (prop === 'component') {
      if (this._is_fullwindow) {
        this._leave_component_frame()
      }
      // TODO
      this._component = current

      if (this._is_fullwindow) {
        this._enter_component_frame()
      }
    } else if (prop === 'frameOut') {
      const frame_out = current

      if (this._in_component_control) {
        if (this._is_fullwindow) {
          if (!this._frame_out && frame_out) {
            this._set_fullwindow_frame_off(false)
          } else if (this._frame_out && !frame_out) {
            this._set_fullwindow_frame_on(false)

            this._disable_input()
          }
        }
      }

      this._frame_out = frame_out

      for (const unit_id in this._subgraph_cache) {
        const graph = this._subgraph_cache[unit_id]
        graph.setProp('frameOut', this._frame_out)
      }
    }
  }
}
