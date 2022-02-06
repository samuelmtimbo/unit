import { bundleSpec } from '../../../../../bundle'
import { Graph } from '../../../../../Class/Graph'
import { addListeners } from '../../../../../client/addListener'
import {
  ANIMATION_T_MS,
  ifLinearTransition,
} from '../../../../../client/animation/animation'
import { ANIMATION_C } from '../../../../../client/animation/ANIMATION_C'
import { ANIMATION_T_S } from '../../../../../client/animation/ANIMATION_T_S'
import classnames from '../../../../../client/classnames'
import { HEXToHSV, isHEX, nameToColor } from '../../../../../client/color'
import {
  getSpecRadius as getSpecRadiusById,
  UNIT_MIN_RADIUS,
} from '../../../../../client/complexity'
import { Component } from '../../../../../client/component'
import {
  getDatumSize,
  MAX_HEIGHT as DATUM_MAX_HEIGHT,
  MAX_WIDTH as DATUM_MAX_WIDTH,
} from '../../../../../client/component/getDatumSize'
import mergeProps from '../../../../../client/component/mergeProps'
import mergePropStyle from '../../../../../client/component/mergeStyle'
import { componentFromSpecId } from '../../../../../client/componentFromSpecId'
import { component_ } from '../../../../../client/component_'
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
import { extractStyle } from '../../../../../client/extractStyle'
import { extractTrait } from '../../../../../client/extractTrait'
import {
  add_link_to_graph,
  add_node_to_graph,
  build_subgraph,
  change_link_source_on_graph,
  change_link_target_on_graph,
  getSubPinSpecNodeId,
  GraphNodeMap as GraphNodeMap,
  remove_link_from_graph,
  remove_node_from_graph,
} from '../../../../../client/graph'
import {
  getDatumNodeId,
  getErrNodeId,
  getExtNodeId,
  getExtNodeIdFromIntNodeId,
  getIdFromMergeNodeId,
  getIntNodeId,
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
  segmentLinkId,
  segmentLinkPinNodeId,
  segmentMergeNodeId,
  segmentPinLinkId,
} from '../../../../../client/id'
import { idFromUnitValue } from '../../../../../client/idFromUnitValue'
import { MAX_Z_INDEX } from '../../../../../client/MAX_Z_INDEX'
import { Mode } from '../../../../../client/mode'
import { _pinTypeMatch } from '../../../../../client/parser'
import parentElement from '../../../../../client/platform/web/parentElement'
import { reflectChildrenTrait } from '../../../../../client/reflectChildrenTrait'
import { reflectComponentBaseTrait } from '../../../../../client/reflectComponentBaseTrait'
import { showNotification } from '../../../../../client/showNotification'
import { SimLink, SimNode, Simulation } from '../../../../../client/simulation'
import {
  emptySpec,
  getComponentSpec,
  getGraphSpec,
  getSpec,
  getSpecInputs,
  getSpecOutputs,
  getSpecRender,
  getSubComponentParentId,
  injectSpecs,
  isComponent,
  isComponentSpec,
  newMergeIdInSpec,
  newSpecId,
  newUnitIdInSpec,
  newUnitIdInSpecId,
  setSpec,
} from '../../../../../client/spec'
import {
  applyTheme,
  COLOR_DARK_LINK_YELLOW,
  COLOR_DARK_YELLOW,
  COLOR_GREEN,
  COLOR_LINK_YELLOW,
  COLOR_NONE,
  COLOR_OPAQUE_RED,
  COLOR_RED,
  COLOR_YELLOW,
  DARK_LINK_MODE_COLOR,
  DARK_MODE_COLOR,
  getThemeLinkModeColor,
  getThemeModeColor,
  LIGHT_LINK_MODE_COLOR,
  LIGHT_MODE_COLOR,
  setAlpha,
  themeBackgroundColor,
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
  mediumPoint,
  normalize,
  NULL_VECTOR,
  Point,
  pointDistance,
  pointInNode,
  Position,
  radBetween,
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
import { userSelect } from '../../../../../client/util/style/userSelect'
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
import { Moment } from '../../../../../debug/Moment'
import { PinDataMomentData } from '../../../../../debug/PinDataMoment'
import { PinDropMomentData } from '../../../../../debug/PinDropMoment'
import { GraphExposedPinEventData } from '../../../../../debug/watchGraphExposedPinEvent'
import { GraphExposedPinSetMomentData } from '../../../../../debug/watchGraphExposedPinSetEvent'
import { GraphMergeMomentData } from '../../../../../debug/watchGraphMergeEvent'
import { GraphMergePinMomentData } from '../../../../../debug/watchGraphPinMergeEvent'
import { GraphPlugMomentData } from '../../../../../debug/watchGraphPlugEvent'
import { GraphSpecUnitMomentData } from '../../../../../debug/watchGraphUnitEvent'
import { GraphSpecUnitMoveMomentData } from '../../../../../debug/watchGraphUnitMoveEvent'
import { UnitGraphSpecMomentData } from '../../../../../debug/watchUnitLeafEvent'
import { ShouldNeverHappenError } from '../../../../../exception/ShouldNeverHappenError'
import {
  addHeapNode,
  Heap,
  removeHeapNode,
  setHeapNode,
} from '../../../../../Heap'
import { $Component } from '../../../../../interface/async/$Component'
import { $G } from '../../../../../interface/async/$G'
import { $Graph } from '../../../../../interface/async/$Graph'
import { AsyncGraph } from '../../../../../interface/async/AsyncGraph'
import { NOOP } from '../../../../../NOOP'
import { Pod } from '../../../../../pod'
import { removeDatum, setDatum } from '../../../../../spec/actions/data'
import {
  addMerge,
  addPinToMerge,
  addUnit,
  ADD_MERGE,
  ADD_PIN_TO_MERGE,
  ADD_UNIT,
  coverPin,
  coverPinSet,
  exposePin,
  exposePinSet,
  mergeMerges,
  plugPin,
  removeMerge,
  removePinFromMerge,
  removeUnit,
  REMOVE_MERGE,
  REMOVE_PIN_FROM_MERGE,
  REMOVE_UNIT,
  reverseAction,
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
  _updateNodeAt,
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
  getMergeUnitPinCount,
  oppositePinKind,
} from '../../../../../spec/util'
import { State } from '../../../../../State'
import { System } from '../../../../../system'
import {
  Action,
  BaseComponentSpec,
  Classes,
  ComponentSpec,
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
  GraphUnitsSpec,
  PinSpec,
  PinsSpecBase,
  Spec,
  Specs,
} from '../../../../../types'
import { Callback } from '../../../../../types/Callback'
import { Dict } from '../../../../../types/Dict'
import { GraphState } from '../../../../../types/GraphState'
import { IO } from '../../../../../types/IO'
import { randomValueOfType } from '../../../../../types/parser/randomValue'
import { Unlisten } from '../../../../../types/Unlisten'
import { forEach, last, pull, push } from '../../../../../util/array'
import callAll from '../../../../../util/call/callAll'
import { randomId, randomIdNotIn } from '../../../../../util/id'
import {
  clone,
  filterObj,
  getObjSingleKey,
  invertObj,
  isEmptyObject,
  mapObjKey,
  mapObjKeyKV,
  mapObjKV,
  _keyCount,
} from '../../../../../util/object'
import { getDivTextSize } from '../../../../../util/text/getDivTextSize'
import { getTextWidth } from '../../../../../util/text/getPlainTextWidth'
import { getTextAreaSize } from '../../../../../util/text/getTextAreaSize'
import swap from '../../../../core/array/Swap/f'
import assocPath from '../../../../core/object/AssocPath/f'
import forEachKeyValue from '../../../../core/object/ForEachKeyValue/f'
import keyCount from '../../../../core/object/KeyCount/f'
import { clamp } from '../../../../core/relation/Clamp/f'
import _dissoc from '../../../../f/object/Dissoc/f'
import keys, { _keys } from '../../../../f/object/Keys/f'
import { getGlobalComponent } from '../../../../globalComponent'
import { BundleSpec } from '../../../method/process/BundleSpec'
import { Style } from '../../../Props'
import Div from '../../Div/Component'
import Editable from '../../Editable/Component'
import Frame from '../../Frame/Component'
import Icon from '../../Icon/Component'
import SVGCircle from '../../svg/Circle/Component'
import SVGDefs from '../../svg/Defs/Component'
import SVGG from '../../svg/G/Component'
import SVGLine from '../../svg/Line/Component'
import SVGMarker from '../../svg/Marker/Component'
import SVGPath from '../../svg/Path/Component'
import SVGRect from '../../svg/Rect/Component'
import SVGSVG from '../../svg/SVG/Component'
import SVGText from '../../svg/SVGText/Component'
import SVGTextPath from '../../svg/TextPath/Component'
import TextInput from '../../value/TextInput/Component'
import Wrap from '../../Wrap/Component'
import ZoomComponent from '../../Zoom/Component'
import Cabinet from '../Cabinet/Component'
import ClassDatum from '../Class/Component'
import DataTree from '../DataTree/Component'
import Datum from '../Datum/Component'
import GUI from '../GUI/Component'
import { MINIMAP_HEIGHT, MINIMAP_WIDTH } from '../History/Component'
import Minimap from '../Minimap/Component'
import Modes from '../Modes/Component'
import { default as Resize, IOResizeEvent } from '../Resize/Component'
import Search from '../Search/Component'
import Selection from '../Selection/Component'
import Transcend from '../Transcend/Component'

function specIdToUnitValue(spec_id): string {
  const value = `\${unit:{id:'${spec_id}'}}`
  return value
}

const UNIT_NAME_MAX_CHAR_LINE: number = 12
const UNIT_NAME_MAX_LINE_COUNT: number = 3
const UNIT_CORE_NAME_FONT_SIZE: number = 12

const PLUG_NAME_FONT_SIZE: number = 10
const PLUG_NAME_MAX_CHAR_LINE: number = 12

const UNIT_NAME_MAX_SIZE: number =
  UNIT_NAME_MAX_LINE_COUNT * UNIT_NAME_MAX_CHAR_LINE

const LINK_TEXT_FONT_SIZE: number = 10

const PIN_NAME_MAX_SIZE: number = 12
const PIN_NAME_FONT_SIZE: number = 10

const MIN_WIDTH: number = 42
const MIN_HEIGHT: number = 42

const MAX_WIDTH: number = Infinity
const MAX_HEIGHT: number = Infinity

const SURFACE_UNPLUG_DISTANCE = 1.5 * EXPOSED_LINK_DISTANCE

export const NEAR = 24

export const getLeafId = (leafPath: string[]): string => {
  const leaf_id = leafPath.join('/')
  return leaf_id
}

export const OPPOSITE_MOMENT_EVENT = {
  data: 'drop',
  drop: 'data',
}

export const getOppositeMoment = (moment: any): any => {
  const { type, event, data } = moment

  return {
    type,
    event: OPPOSITE_MOMENT_EVENT[event],
    data,
  }
}

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

export const ANIMATION_DELTA_TRESHOLD = 0.1

export interface LinkProps {
  style?: Dict<string>

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
  strokeDasharray?: string
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

  frame?: Component<HTMLElement>
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
  type: IO,
  start: string,
  blacklist: Set<string> = new Set()
): string => {
  let i = 0
  let newPinId = start
  while ((spec[`${type}s`] || {})[newPinId] || blacklist.has(newPinId)) {
    newPinId = `${start}${i}`
    i++
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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // none           // 0
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1], // normal         // 1
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1], // collapse       // 2
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1], // search         // 3
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1], // ignored        // 4
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1], // exposed        // 5
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // data (linked)  // 6
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1], // data           // 7
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1], // err            // 8
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // type           // 9
]

const SCMD = LINK_DISTANCE / SUBGRAPH_MAX_D / 3 // SUBGRAPH_CLOSE_MAX_D

export const SUBGRAPH_RELATIVE_MAX_L: number[][] = [
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
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, SCMD],
]

export type GraphSimLink = SimLink<{ type: string; head: number }>
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

export const _evaluate = (
  value: string,
  specs: Specs,
  classes: Classes
): any => {
  if (_evaluate_cache[value]) {
    return _evaluate_cache[value]
  }
  const data = evaluate(value, specs, classes)
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
  fallback?: Component<HTMLElement>
  background?: Div
  transcend?: Transcend
  root?: Frame
  zoom?: Zoom
  animate?: boolean
}

export const GRAPH_SPEC_ID = 'e80c912e-7508-11ea-966b-436805345ff0'

export default class GraphComponent extends Element<HTMLDivElement, Props> {
  private _root: Frame
  private _graph: _GraphComponent
  private _component: Component
  private _fallback_frame: Component<HTMLElement>
  private _transcend: Transcend
  private _fallback_pod: $Graph
  private _pod: $Graph
  private _frame: Component<HTMLElement>
  private _frame_out: boolean = false
  private _background: Div

  private _unlisten_graph: Unlisten
  private _unlisten_transcend: Unlisten

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

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

    const fallback_graph = new Graph(spec, {}, $system, $pod)
    this._fallback_pod = AsyncGraph(fallback_graph)
    this._pod = pod || this._fallback_pod

    this._fallback_frame = fallback || this._create_fallback_frame()
    this._frame = this._fallback_frame

    transcend =
      transcend ||
      new Transcend(
        {
          down: fullwindow,
        },
        this.$system,
        this.$pod
      )
    this._unlisten_transcend = transcend.addEventListener(
      makeClickListener({
        onLongPress: this._on_transcend_long_press,
        onLongClickCancel: this._on_transcend_long_click_cancel,
        onLongClick: this._on_transcend_long_click,
      })
    )
    this._transcend = transcend
    this.$ref['transcend'] = transcend

    component = component || parentComponent({}, this.$system, this.$pod)
    this._component = component

    graph =
      graph ||
      new _GraphComponent(
        {
          className,
          style,
          pod: this._pod,
          frame: this._frame,
          component: this._component,
          animate,
          zoom,
          fullwindow,
        },
        this.$system,
        this.$pod
      )
    graph.enter(false)
    this._graph = graph

    this._listen_graph()

    this._reset_frame()

    background =
      background ||
      new Div(
        {
          style: {
            className: 'graph-background',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
          },
        },
        this.$system,
        this.$pod
      )
    this._background = background

    root =
      root ||
      new Frame(
        {
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
        },
        this.$system,
        this.$pod
      )
    root.registerParentRoot(this._background)
    root.registerParentRoot(this._graph)
    root.registerParentRoot(this._fallback_frame)
    root.registerParentRoot(this._transcend)
    // RETURN
    root.$element.oncontextmenu = function () {
      return false
    }
    this._root = root

    if (pod === undefined || pod === null) {
      this._pod.$play({})
    }

    const $element = parentElement($system)

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
    const fallback_frame = new Div(
      {
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
      },
      this.$system,
      this.$pod
    )

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
      frame.$getGlobalId({}, (globalId) => {
        const _frame = getGlobalComponent(
          this.$system,
          globalId
        ) as Component<HTMLElement>

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
      method: { showLongPress },
    } = this.$system

    const { screenX, screenY } = event

    showLongPress(screenX, screenY, { direction: 'in' })
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

  private _on_compose = (all_sub_component_trait: {
    sub_component_position: Dict<Position>
    sub_component_size: Dict<Size>
    sub_component_base: Dict<LayoutBase>
    sub_component_base_node: Dict<LayoutNode[]>
    sub_base: LayoutBase
    sub_base_node: LayoutNode[]
  }) => {
    const { specs } = this.$system
    const { animate } = this.$props

    const id = newSpecId(specs)

    const spec = this._graph.getSpec()

    spec.name = 'new'
    spec.id = id

    const { component: component_spec = {} } = spec

    const is_component_spec = isComponentSpec(specs, component_spec)

    spec.type = `\`U\`&\`G\`&\`C\``

    // AD HOC
    // force update complexity
    delete spec.metadata?.complexity

    setSpec(specs, id, spec)

    const parent_unit_id = newUnitIdInSpec(specs, {}, id)

    this._pod = this._pod.$transcend({
      id,
      unitId: parent_unit_id,
      _: ['$U', '$C', '$G'],
    })

    const parent_unit: GraphUnitSpec = {
      id,
      metadata: {},
    }

    if (is_component_spec) {
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

    const component = parentComponent({}, this.$system, this.$pod)
    component.$subComponent = {
      [parent_unit_id]: this._component,
    }
    component.pushRoot(this._component)
    this._component = component

    this._unlisten_graph()

    this._root.unregisterParentRoot(this._background)
    this._root.unregisterParentRoot(this._graph)

    const graph = new _GraphComponent(
      {
        pod: this._pod,
        frame: this._frame,
        frameOut: this._frame_out,
        component,
      },
      this.$system,
      this.$pod
    )
    // graph.enter(false)

    this._graph.setProp('parent', graph)

    graph.cache_subgraph(parent_unit_id, this._graph)
    graph.mem_enter_subgraph(parent_unit_id, this._graph)
    graph.dom_enter_subgraph(parent_unit_id, this._graph, false)

    this._root.unshiftParentRoot(this._graph, 'default')
    this._root.unshiftParentRoot(this._background, 'default')

    this._graph = graph

    this._listen_graph()

    this.$subComponent.graph = graph

    this._root.prependParentRoot(this._graph, 'default')
    this._root.prependParentRoot(this._background, 'default')

    this._graph.enter(false)

    // this._graph.enter_subgraph(parent_unit_id, false)

    this._graph.leave(all_sub_component_trait)

    this._refresh_pod()

    graph.focus()
  }

  // TODO
  private _on_transcend = (): void => {
    // console.log('Graph', '_on_transcend')

    const { specs } = this.$system

    const { $width, $height } = this.$context

    const id = newSpecId(specs)

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
        id: 'e80c912e-7508-11ea-966b-436805345ff0',
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
      id: GRAPH_SPEC_ID,
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
    let graph_slot_element = graph_slot.$element
    // const graph_slot_children = []

    let background_slot = this._background.$slot['default']
    let background_slot_element = background_slot.$element
    const background_slot_children = []
    while (background_slot_element.firstChild) {
      background_slot_children.unshift(background_slot_element.lastChild)
      background_slot_element.removeChild(background_slot_element.lastChild)
    }

    this._graph._prevent_next_reset = true

    const unit_graph = new GraphComponent(
      {
        graph: this._graph,
        fallback: this._fallback_frame,
        transcend: this._transcend,
        background: this._background,
        root: this._root,
        component: this._component,
        // pod: this._pod,
      },
      this.$system,
      this.$pod
    )

    // AD HOC

    const transcend = new Transcend({}, this.$system, this.$pod)
    this._transcend = transcend
    this._listen_transcend()
    this.$ref['transcend'] = transcend

    const fallback_frame = this._create_fallback_frame()
    this._fallback_frame = fallback_frame

    const Parent = parentClass()
    const component = new Parent({}, this.$system, this.$pod)
    component.$subComponent = {
      [unit_graph_id]: unit_graph,
    }
    component.pushRoot(unit_graph)
    this._component = component

    this._pod = next_pod

    const graph = new _GraphComponent(
      {
        pod: this._pod,
        component: this._component,
        frame: this._fallback_frame,
        // fullwindow: true,
      },
      this.$system,
      this.$pod
    )

    graph.enter(false)

    this._graph = graph

    this._listen_graph()

    this._reset_frame()

    const background = new Div(
      {
        style: {
          className: 'graph-background',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        },
      },
      this.$system,
      this.$pod
    )
    this._background = background

    const root = new Frame(
      {
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
      },
      this.$system,
      this.$pod
    )
    this._root = root

    graph_slot = this._graph.$slot['default']
    graph_slot_element = graph_slot.$element

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

    this._graph.leaveFullwindow(true, () => {
      this._graph.select_node('graph')

      this._graph.unlock_sub_component('graph')
    })

    this._graph.temp_fixate_node(unit_graph_id, 100)
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
  foreground: Div
}

export type LayoutNode = {
  x: number
  y: number
  width: number
  height: number
  k: number
  opacity: number
  fontSize: number
}

export type LayoutLeaf = [string[], Component]

export type LayoutBase = LayoutLeaf[]

export class _GraphComponent extends Element<HTMLDivElement, _Props> {
  private _spec: GraphSpec = emptyGraphSpec

  private _disabled: boolean = true

  private _focused: boolean = false

  private _main: Div
  private _foreground: Div
  private _between: Div
  private _subgraph: Div

  private _graph: Div

  private _unlisten_minimap: Unlisten | undefined = undefined
  private _minimap_screen: SVGRect
  private _minimap_pointer_down: boolean = false

  private _subgraph_cache: Dict<_GraphComponent> = {}
  private _subgraph_pod_cache: Dict<$Graph> = {}
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

  private _between_container: Dict<Frame> = {}

  private _leaf_frame: Dict<Frame> = {}
  private _leaf_frame_active: Dict<boolean> = {}
  private _leaf_frame_layer: Dict<Component> = {}
  private _leaf_frame_node: Dict<LayoutNode> = {}

  private _layout_animation_frame: Dict<number> = {}

  private _layout_transfer_parent_animating: Dict<boolean> = {}

  private _layout_transfer_parent_leaf: Dict<Dict<[string[], Component][]>> = {}
  private _layout_transfer_parent_leaf_sub_component_id: Dict<Dict<string[]>> =
    {}
  private _layout_transfer_parent_leaf_path: Dict<Dict<string[][]>> = {}
  private _layout_transfer_parent_leaf_comp: Dict<Dict<Component[]>> = {}
  private _layout_transfer_parent_leaf_count: Dict<Dict<number>> = {}
  private _layout_transfer_parent_leaf_end_count: Dict<Dict<number>> = {}
  private _layout_transfer_parent_leaf_end_set: Dict<Dict<Set<string>>> = {}
  private _layout_transfer_parent_leaf_slot_style: Dict<Dict<Style>> = {}
  private _layout_transfer_parent_leaf_style: Dict<Dict<Style[]>> = {}
  private _layout_transfer_parent_remaining_child: Dict<Dict<Set<string>>> = {}

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
  private _core_name: Dict<Editable> = {}
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

  private _core_layout_core_unlisten: Dict<Unlisten> = {}

  private _core_component_frame_context: Dict<Context> = {}

  private _core_component_unlocked: Dict<boolean> = {}
  private _core_component_unlocked_count: number = 0

  private _pin: Dict<Div> = {}
  private _pin_name: Dict<TextInput> = {}

  private _link_pin_ref_set: Set<string> = new Set()
  private _link_pin_input_set: Set<string> = new Set()
  private _link_pin_output_set: Set<string> = new Set()

  private _pin_link_start_marker: Dict<SVGPath> = {}
  private _pin_link_end_marker: Dict<SVGPath> = {}

  private _link_pin_constant_count: number = 0
  private _link_pin_memory_count: number = 0

  private _exposed_pin_set_count: number = 0

  private _exposed_pin_plugged_count = 0
  private _exposed_pin_unplugged_count = 0

  private _ext_pin_name: Dict<TextInput> = {}
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
  private _datum: Dict<Datum | ClassDatum> = {}
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

  private _node_link_count: Dict<number> = {}
  private _node_link_heap_root: Heap<{ count: number; id: string }> = null
  private _node_link_heap: Dict<Heap<{ count: number; id: string }>> = {}

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

  private _drag_ext_node_id: Set<string> = new Set()
  private _drag_ext_node_count: number = 0

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
  private _compatible_node_count: number = 0

  private _resize_pointer_count: number = 0
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
  private _merge_to_ref_output: Dict<string> = {}

  private _ref_unit_to_merge: Dict<string> = {}

  private _ref_output_to_merge: Dict<string> = {}
  private _ref_output_pin_icon: Dict<Icon> = {}

  private _node_graph: GraphNodeMap = {}

  private _node_to_subgraph: Dict<string> = {}
  private _subgraph_to_node: Dict<Set<string>> = {}

  private _node_layer: Dict<number> = {}
  private _link_layer: Dict<number> = {}

  private _layout_node: Dict<LayoutNode> = {}
  private _layout_target_node: Dict<LayoutNode> = {}
  private _layout_core_abort_animation: Dict<() => void> = {}
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
  private _long_press_collapse_unit_id: string | null = null
  private _long_press_collapse_next_unit_id: string | null = null
  private _long_press_collapse_next_spec_id: string | null = null
  private _long_press_collapse_next_spec: GraphSpec | null = null
  private _long_press_collapse_unit_next_pin_map: Dict<{
    input: Dict<{ pinId: string; subPinId: string }>
    output: Dict<{ pinId: string; subPinId: string }>
  }> = {}
  private _long_press_collapse_next_merge_pin_map: Dict<{
    nextInputMergePinId: string
    nextOutputMergePinId: string
  }> = {}
  private _long_press_collapse_datum_id: string | null = null
  private _long_press_collapse_datum_node_id: string | null = null
  private _long_press_collapse_remaining: number = 0
  private _long_press_collapse_end_set: Set<string> = new Set()
  private _long_press_collapse_sub_component_parent_id: Dict<string | null> = {}
  private _long_press_collapse_sub_component_children: Dict<Set<string>> = {}
  private _long_press_collapse_sub_component_next_parent_id: Dict<
    string | null
  > = {}
  private _long_press_collapse_sub_component_next_children: Dict<string[]> = {}
  private _long_press_collapse_opposite_pin_id: Dict<string> = {}
  private _long_press_collapse_opposite_merge_id: Dict<string> = {}
  private _long_press_collapse_node_id: Set<string> = new Set()
  private _long_press_collapse_units: string[]
  private _long_press_collapse_link_pins: {
    unitId: string
    type: IO
    pinId: string
  }[]
  private _long_press_collapse_merges: string[]
  private _long_press_collapse_next_id_map: {
    unit: Dict<string>
    link: Dict<{
      input: Dict<{ mergeId: string; oppositePinId: string }>
      output: Dict<{ mergeId: string; oppositePinId: string }>
    }>
    merge: Dict<string>
  }

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
  private _debug_disabled: boolean = false

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
  private _search_unit_merged_pin_ids: {
    input: { data: string[]; ref: string[] }
    output: { data: string[]; ref: string[] }
  } = {
    input: {
      data: [],
      ref: [],
    },
    output: {
      data: [],
      ref: [],
    },
  }
  private _search_option_valid_pin_matches: Dict<{
    input: {
      ref: number[][][]
      data: number[][][]
    }
    output: {
      ref: number[][][]
      data: number[][][]
    }
  }> = {}
  private _search_unit_exposed_pin_ids: {
    input: {
      data: Dict<[string, string]>
      ref: Dict<[string, string]>
    }
    output: {
      data: Dict<[string, string]>
      ref: Dict<[string, string]>
    }
  }
  private _search_unit_exposed_pin_count: {
    input: { data: number; ref: number }
    output: { data: number; ref: number }
  }
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
  private _cancel_long_press: boolean = false
  private _cancel_double_click: boolean = false
  private _cancel_click_hold: boolean = false
  private _cancel_node_long_click: boolean = false

  private _swap_next_click_hold_long_press: boolean = false

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

  public _prevent_next_reset: boolean = false

  private _refresh_theme = (): void => {
    const { $theme, $color } = this.$context

    const { style = {} } = this.$props

    let { color = $color } = style

    color = nameToColor(color) || color

    const data = $theme === 'dark' ? COLOR_YELLOW : COLOR_DARK_YELLOW
    const data_link =
      $theme === 'dark' ? COLOR_LINK_YELLOW : COLOR_DARK_LINK_YELLOW

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

  constructor($props: _Props, $system: System, $pod: Pod) {
    super({ ...defaultProps, ...$props }, $system, $pod)

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

    const zoom_comp = new ZoomComponent(
      {
        className: 'graph-zoom',
        style: {
          transition: ifLinearTransition(animate, 'opacity'),
        },
        width: 0,
        height: 0,
        zoom: this._zoom,
      },
      this.$system,
      this.$pod
    )
    this._zoom_comp = zoom_comp

    const zoom_comp_alt = new ZoomComponent(
      {
        className: 'graph-zoom-alt',
        style: {
          pointerEvents: 'none',
        },
        width: 0,
        height: 0,
        zoom: this._zoom,
      },
      this.$system,
      this.$pod
    )
    this._zoom_comp_alt = zoom_comp_alt

    const area_select_rect = new SVGRect(
      {
        className: 'graph-area-select-rect',
        style: {
          pointerEvents: 'none',
          fill: 'none',
          strokeDasharray: '6',
          strokeWidth: '1',
          stroke: this._theme.selected,
        },
      },
      this.$system,
      this.$pod
    )
    this._multiselect_area_svg_rect = area_select_rect

    const area_select_svg = new SVGSVG(
      {
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
      },
      this.$system,
      this.$pod
    )
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

    const subgraph = new Div(
      {
        className: 'graph-subgraph',
        style: {
          pointerEvents: 'none',
          opacity: '0',
          transition: ifLinearTransition(animate, 'opacity'),
        },
      },
      this.$system,
      this.$pod
    )
    this._subgraph = subgraph

    const layout_root = this._create_layout_layer({
      className: 'graph-layout-root',
      style: {},
    })
    this._layout_root = layout_root

    const layout_comp = new Div(
      {
        className: 'graph-layout',
        style: {
          pointerEvents: 'none',
        },
      },
      this.$system,
      this.$pod
    )
    this._layout_comp = layout_comp
    layout_comp.registerParentRoot(layout_root.layer)

    const main = new Div(
      {
        className: 'graph-main',
        style: {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          transition: ifLinearTransition(animate, 'opacity'),
        },
      },
      this.$system,
      this.$pod
    )
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
      if (
        // @ts-ignore
        target === this._zoom_comp._svg.$element ||
        (target instanceof Node && this._layout_comp.$element.contains(target))
      ) {
        event.preventDefault()
        return false
      }
    }
    main.$element.addEventListener('mousedown', preventFocusListener)
    main.$element.addEventListener('touchdown', preventFocusListener)
    main.$element.addEventListener('_dragdrop', (event: CustomEvent) => {
      const {
        detail: { pointerId, clientX, clientY },
      } = event

      event.stopPropagation()

      const { $x, $y } = this.$context

      const spec = this.$system.cache.dragAndDrop[pointerId]

      const position = this._screen_to_world(clientX, clientY)

      this.paste_spec(spec, { x: position.x - $x, y: position.y - $y })
    })
    main.$element.setAttribute('dropTarget', 'true')
    main.registerParentRoot(zoom_comp)
    main.registerParentRoot(zoom_comp_alt)
    main.registerParentRoot(layout_comp)
    main.registerParentRoot(area_select_svg)

    main.$element.ondragover = (event: DragEvent) => {
      event.preventDefault()
    }
    main.$element.ondrop = (event: DragEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const { dataTransfer } = event

      if (dataTransfer) {
        let { items, files } = dataTransfer

        if (items) {
          for (var i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
              const file = items[i].getAsFile()

              this._paste_file(file)
            }
          }
        } else {
          for (var i = 0; i < files.length; i++) {
            const file = items[i].getAsFile()

            this._paste_file(file)
          }
        }
      }
    }

    main.$element.addEventListener('_dragenter', (event) => {
      // event.preventDefault()
    })
    main.$element.addEventListener('_dragover', (event) => {
      // event.preventDefault()
    })
    this._main = main

    const between = new Div(
      {
        className: 'graph-between',
        style: {
          pointerEvents: 'none',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        },
      },
      this.$system,
      this.$pod
    )
    this._between = between

    const sub_between = new Div(
      {
        className: 'graph-sub-between',
        style: {
          pointerEvents: 'none',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        },
      },
      this.$system,
      this.$pod
    )
    this._foreground = sub_between

    const graph = new Div(
      {
        className: 'graph',
        style: {
          ..._DEFAULT_STYLE,
          ...style,
        },
        tabIndex: 0,
      },
      this.$system,
      this.$pod
    )

    graph.addEventListener(makeWheelListener(this._on_wheel))
    graph.addEventListener(makeFocusListener(this._on_focus))
    graph.addEventListener(makeBlurListener(this._on_blur))

    graph.registerParentRoot(main)
    graph.registerParentRoot(sub_between)
    graph.registerParentRoot(between)
    graph.registerParentRoot(subgraph)

    this._graph = graph

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = graph.$slot
    this.$subComponent = {
      graph,
      subgraph,
      sub_between,
      between,
      main,
    }
    this.$unbundled = false

    this.registerRoot(graph)

    if (fullwindow) {
      this._enter_all_fullwindow(false)
    }
  }

  private _paste_file = async (file: File): Promise<void> => {
    if (file.name.endsWith('.unit')) {
      const json = await file.text()

      let bundle: BundleSpec

      try {
        bundle = JSON.parse(json)
      } catch (err) {
        // TODO
        throw new Error('Invalid Unit File')
      }

      const position = this._jiggle_world_screen_center()

      this.paste_spec(bundle, position)
    } else {
      throw new Error('Expected .unit file')
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
        }

        if (!this._subgraph_unit_id) {
          this._enable_transcend()
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

      const minimap_screen = new SVGRect(
        {
          x: this._zoom.x,
          y: this._zoom.y,
          width: $width / this._zoom.k,
          height: $height / this._zoom.k,
          style: {
            display: this._unit_count > 0 ? 'block' : 'none',
            fill: 'none',
            stroke: this._theme.link,
          },
        },
        this.$system,
        this.$pod
      )
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

    this._search = findRef(this, 'search') as Search | null
    this._cabinet = findRef(this, 'cabinet') as Cabinet | null
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
      makeCustomListener(
        'beforeenterfullwindow',
        this._on_context_before_enter_fullwindow
      ),
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

    if (this._control) {
      if (!this._disabled) {
        if (!this._is_fullwindow && this._control_lock) {
          this._show_control(false)
        } else {
          this._hide_control(false)
        }
      } else {
        // if (this._core_component_unlocked_count === 0) {
        //   this._hide_control()
        // }
      }
    }

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
    const { specs } = this.$system

    return specs
  }

  public get_subraph_depth = (): number => {
    return this._subgraph_depth
  }

  private _get_subgraph_pod = (unit_id: string): $Graph => {
    let pod = this._subgraph_pod_cache[unit_id]

    if (!pod) {
      pod = this._pod.$refUnit({
        unitId: unit_id,
        _: ['$U', '$C', '$G'],
      }) as $Graph

      this._subgraph_pod_cache[unit_id] = pod
    }

    return pod
  }

  public get_units = (): GraphUnitsSpec => {
    const { units } = this._spec
    return units || {}
  }

  private _get_unit = (id: string): GraphUnitSpec => {
    const units = this.get_units()
    return units[id]
  }

  public get_sub_component_frame_context = (
    sub_component_id: string
  ): Context => {
    const frame = this._core_component_frame[sub_component_id]
    const { $$context } = frame
    return $$context
  }

  private _get_unit_spec_id = (unit_id: string): string => {
    const unit = this._get_unit(unit_id)
    const { id } = unit
    return id
  }

  private _get_unit_spec_name = (unit_id: string): string => {
    const { specs } = this.$system

    const id = this._get_unit_spec_id(unit_id)

    const spec = getSpec(specs, id)

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

  private _has_merge = (merge_node_id: string): boolean => {
    const { id } = segmentMergeNodeId(merge_node_id)
    return !!this.__get_merge(id)
  }

  private __has_merge = (merge_id: string): boolean => {
    return !!this.__get_merge(merge_id)
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
    type: IO,
    pin_id: string
  ): GraphUnitPinSpec => {
    const unit = this._get_unit(unit_id)

    const unit_pin_spec = (!!unit[type] && unit[type]![pin_id]) || {}

    return unit_pin_spec
  }

  private _get_subgraph_unit_sub_component_parent_id = (
    unit_id: string,
    sub_component_id: string
  ): string | null => {
    console.log('Graph', '_get_graph_unit_sub_component_parent_id')

    const subgraph = this._subgraph_cache[unit_id]

    const unit_graph_spec = subgraph.getSpec()

    // const unit_graph_spec = this._get_unit_spec(unit_id) as GraphSpec

    const graph_unit_sub_component_parent_id = getSubComponentParentId(
      unit_graph_spec,
      sub_component_id
    )

    return graph_unit_sub_component_parent_id
  }

  private _get_unit_pin_spec = (pin_node_id: string): PinSpec => {
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)
    const pin_spec = this.__get_unit_pin_spec(unitId, type, pinId)
    return pin_spec
  }

  private __get_unit_pin_spec = (
    unit_id: string,
    type: IO,
    pin_id: string
  ): PinSpec => {
    const { specs } = this.$system

    let spec: Spec
    if (unit_id === this._search_unit_id) {
      spec = getSpec(specs, this._search_unit_spec_id!)
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
    const { id } = unit
    return id
  }

  private _get_unit_spec = (unit_id: string): Spec => {
    const { specs } = this.$system

    const path = this._get_unit_path(unit_id)
    const spec = getSpec(specs, path)
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
    const { specs } = this.$system

    const path = this._get_unit_path(unit_id)

    const component = getComponentSpec(specs, path)

    return component
  }

  private _get_exposed_pin_spec = (
    type: IO,
    pin_id: string
  ): GraphExposedPinSpec => {
    return (this._spec[`${type}s`] || {})[pin_id]
  }

  private _has_exposed_pin_named = (type: IO, pin_id: string): boolean => {
    return !!(this._spec[`${type}s`] || {})[pin_id]
  }

  private _has_exposed_input_named = (pin_id: string): boolean => {
    return this._has_exposed_pin_named('input', pin_id)
  }

  private _has_exposed_output_named = (pin_id: string): boolean => {
    return this._has_exposed_pin_named('output', pin_id)
  }

  private _get_exposed_sub_pin_spec = (
    type: IO,
    pin_id: string,
    sub_pin_id: string
  ): GraphExposedSubPinSpec => {
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    const sub_pin = pin[sub_pin_id]
    return sub_pin
  }

  private _get_pin_exposed_id = (
    type: IO,
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
    } else if (this._is_int_pin_node_id(node_id)) {
      return this._get_internal_pin_anchor_node_id(node_id)
    } else {
      return node_id
    }
  }

  private _get_internal_pin_anchor_node_id(node_id: string): string | null {
    const { type, pinId, subPinId } = segmentInternalNodeId(node_id)

    return this._get_exposed_pin_internal_node_id(type, pinId, subPinId)
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

  private _spec_is_link_pin_ignored = (pin_node_id: string): boolean => {
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

  private _is_link_pin_not_ref = (pin_node_id: string): boolean => {
    return !this._is_link_pin_ref(pin_node_id)
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
    if (this._prevent_next_reset) {
      this._prevent_next_reset = false
      return
    }

    const spec = this._spec

    // console.log('Graph', 'reset', spec)

    this._unit_datum = {
      input: {},
      output: {},
    }

    // this._cached_graph = {} // TODO

    this._layout_core = {}

    this._layout_layer = {}

    this._cancel_node_long_click = false

    this._layout_scroll_animation = undefined

    this._zoom_comp.removeChildren()
    this._zoom_comp_alt.removeChildren()

    this._layout_root.children.removeChildren()
    this._layout_root.layers.removeChildren()

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

    this._link_pin_ref_set = new Set()
    this._link_pin_input_set = new Set()
    this._link_pin_output_set = new Set()

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
    this._compatible_node_count = 0

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
    this._merge_to_ref_output = {}

    this._ref_unit_to_merge = {}

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

    this._core_layout_core_unlisten = {}

    this._core_component_frame_context = {}

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
    this._ext_pin_name = {}

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
      const p = this._jiggle_world_screen_center()
      if (position) {
        p.x += position.x
        p.y += position.y
      }
      this._sim_add_unit_core(unit_id, unit, p)
      if (this._is_unit_component(unit_id)) {
        const layout_position = NULL_VECTOR

        const parent_id = this._get_sub_component_spec_parent_id(unit_id)

        this._sim_add_core_component(unit_id, parent_id, layout_position)

        this._mem_add_unit_component(unit_id)
        this._pod_connect_sub_component(unit_id)

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
      const p = this._jiggle_world_screen_center()
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
    const { id } = unit
    const pin_position: UnitPinPosition = { input: {}, output: {} }
    this._for_each_spec_id_pin(id, (type: IO, pin_id: string) => {
      const pin = (unit[type] || {})[pin_id] || {}
      const { metadata = {} } = pin
      const { position } = metadata
      if (position) {
        const p = this._jiggle_world_screen_center()
        p.x += position.x
        p.y += position.y
        pin_position[type][pin_id] = p
      }
    })
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

    this._state_add_unit(
      unit_id,
      unit,
      position,
      pin_position,
      layout_position,
      parent_id
    )
    this._pod_add_unit(unit_id, unit)
  }

  private _state_add_unit(
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

    const is_component = this._is_unit_component(unit_id)

    if (is_component) {
      this._spec_append_component(parent_id, unit_id)
    }

    if (is_component) {
      if (parent_id) {
        this._mem_move_sub_component_child(parent_id, unit_id, 'default')
      }
    }

    this._sim_add_unit(
      unit_id,
      unit,
      position,
      pin_position,
      parent_id,
      layout_position
    )

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

    this._dispatch_action(
      addUnit(unit_id, unit, position, pin_position, layout_position, parent_id)
    )
  }

  private _dispatch_add_unit_action = (
    unit_id: string,
    unit: GraphUnitSpec
  ) => {
    const position = this._get_node_position(unit_id)
    const pin_position = this._get_unit_pin_position(unit_id)
    const is_component = this._is_unit_component(unit_id)
    const layout_position = is_component
      ? this._get_layout_node_screen_position(unit_id)
      : this._screen_center()
    const layout_parent_id = is_component
      ? this._get_sub_component_spec_parent_id(unit_id)
      : null

    this._dispatch_action(
      addUnit(
        unit_id,
        unit,
        position,
        pin_position,
        layout_position,
        layout_parent_id
      )
    )
  }

  private _dispatch_action_add_merge = (
    merge_id: string,
    merge: GraphMergeSpec
  ): void => {
    const merge_node_id = getMergeNodeId(merge_id)

    const position = this._get_merge_position(merge_node_id)

    this._dispatch_action(addMerge(merge_id, merge, position))
  }

  private _dispatch_action_remove_unit = (unit_id: string) => {
    const unit = this._get_unit(unit_id)
    const position = this._get_node_position(unit_id)
    const pin_position = this._get_unit_pin_position(unit_id)
    const is_component = this._is_unit_component(unit_id)
    const layout_position = is_component
      ? this._get_layout_node_screen_position(unit_id)
      : this._screen_center()
    const layout_parent_id = is_component
      ? this._get_sub_component_spec_parent_id(unit_id)
      : null

    this._dispatch_action(
      removeUnit(
        unit_id,
        unit,
        position,
        pin_position,
        layout_position,
        layout_parent_id
      )
    )
  }

  private _dispatch_action_remove_merge = (merge_node_id: string): void => {
    const { id: merge_id } = segmentMergeNodeId(merge_node_id)

    const merge = this._get_merge(merge_node_id)

    const position = this._get_merge_position(merge_node_id)

    this._dispatch_action(removeMerge(merge_id, merge, position))
  }

  private _enter_all_sub_component_frame(): void {
    for (const sub_component_id in this._component.$subComponent) {
      this._enter_sub_component_frame(sub_component_id)
    }
  }

  public _leave_all_sub_component_frame(): void {
    for (const unit_id in this._component_nodes) {
      this._leave_sub_component_frame(unit_id)
    }
  }

  private _get_sub_component = (unit_id: string): Component | undefined => {
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
    sub_component_id: string
  ): GraphSubComponentSpec => {
    const component_spec = this._get_component_spec()
    const { subComponents = {} } = component_spec
    const subComponent = subComponents[sub_component_id]
    return subComponent
  }

  private _get_sub_component_spec_children = (
    sub_component_id: string
  ): string[] => {
    const sub_component_spec = this._get_sub_component_spec(sub_component_id)
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

    const sub_component = this._get_sub_component(unit_id)

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

    for (const sub_component_id of layer_children) {
      if (this._layout_drag_node[sub_component_id]) {
        continue
      }

      const layout_node = this._layout_node[sub_component_id]

      this._animate_layout_core(
        sub_component_id,
        layout_node,
        () => {
          return this._layout_target_node[sub_component_id]
        },
        () => {}
      )
    }
  }

  private _spec_update_metadata_complexity = debounce(() => {
    const { specs } = this.$system

    const c = graphComplexity(specs, this._spec)
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

    const input_data_handler = (_data: GraphUnitPinDataMomentData) => {
      const { unitId, pinId, data } = _data
      input[unitId] = input[unitId] || {}
      input[unitId][pinId] = data
    }

    const input_drop_handler = (_data: GraphUnitPinDataMomentData) => {
      const { unitId, pinId } = _data
      input[unitId] = input[unitId] || {}
      input[unitId][pinId] = undefined
    }

    const output_data_handler = (_data: GraphUnitPinDataMomentData) => {
      const { unitId, pinId, data } = _data
      output[unitId] = output[unitId] || {}
      output[unitId][pinId] = data
    }

    const output_drop_handler = (_data: GraphUnitPinDataMomentData) => {
      const { unitId, pinId } = _data
      output[unitId] = output[unitId] || {}
      output[unitId][pinId] = undefined
    }

    const handler: Dict<Dict<Function>> = {
      ref_input: {
        data: input_data_handler,
        drop: input_drop_handler,
      },
      ref_output: {
        data: output_data_handler,
        drop: output_drop_handler,
      },
      input: {
        data: input_data_handler,
        drop: input_drop_handler,
      },
      output: {
        data: output_data_handler,
        drop: output_drop_handler,
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

  private _pod_connect_sub_component = (unit_id: string): void => {
    // console.log('Graph', '_pod_connect_sub_component', unit_id)

    const sub_component = this._get_sub_component(unit_id)!
    const _ = component_(sub_component)
    const sub_unit = this._pod.$refUnit({ unitId: unit_id, _ }) as $Component
    sub_component.connect(sub_unit)
  }

  private _pod_disconnect_sub_component = (unit_id: string): void => {
    // console.log('Graph', '_pod_disconnect_sub_component', unit_id)

    const sub_component = this._get_sub_component(unit_id)

    if (sub_component) {
      sub_component.disconnect()
    }
  }

  private _disconnect_all_sub_component = (): void => {
    // console.log('Graph', '_disconnect_all_sub_component')
    for (const component_id in this._component.$subComponent) {
      this._pod_disconnect_sub_component(component_id)
    }
  }

  private _get_unit_radius = (
    unit_id: string,
    use_cache: boolean = true
  ): number => {
    const { specs } = this.$system

    const path = this._get_unit_path(unit_id)
    const r = getSpecRadiusById(specs, path, use_cache)
    return r
  }

  private _sim_add_pin_datum = (
    unit_id: string,
    type: IO,
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

    const core_node = this._node[unit_id]

    const { x: core_x, y: core_y, r: core_r } = core_node

    const _pin_position = (
      type: IO,
      pin_id: string,
      i: number,
      total: number
    ): Position | undefined => {
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
      type: IO,
      pin_id: string,
      position: Position | undefined
    ): void => {
      const pin_node_id = getPinNodeId(unit_id, type, pin_id)
      const merged = this._is_link_pin_merged(pin_node_id)

      if (!merged) {
        this._sim_add_link_pin_node(unit_id, type, pin_id, position)
        this._sim_add_link_pin_link(unit_id, type, pin_id)
      } else {
        this._sim_add_link_pin_link(unit_id, type, pin_id)
      }
    }

    const _sim_add_pins = (type: IO, pins: PinsSpecBase): void => {
      let i = 0

      const total: number = Object.keys(pins).length

      for (let pin_id in pins) {
        const pin_node_id = getPinNodeId(unit_id, type, pin_id)

        const ignored = this._spec_is_link_pin_ignored(pin_node_id)

        const position: Position = _pin_position(type, pin_id, i, total)

        _sim_add_pin(type, pin_id, position)

        if (!ignored) {
          i++
        }
      }
    }

    _sim_add_pins('input', inputs)
    _sim_add_pins('output', outputs)
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
    this._sim_add_unit_core(unit_id, unit, position)

    if (this._is_unit_component(unit_id)) {
      layout_position = layout_position || NULL_VECTOR
      this._sim_add_core_component(unit_id, parent_id, layout_position)
    }

    this._sim_add_unit_pins(unit_id, unit, pin_position)
  }

  private _sim_add_unit_core = (
    unit_id: string,
    unit: GraphUnitSpec,
    position: Position
  ): void => {
    // console.log('Graph', '_sim_add_core', unit_id, unit, position)

    const { specs } = this.$system

    const { id } = unit

    const spec = getSpec(specs, id)

    const is_base = isBaseSpec(spec)

    const is_component: boolean = isComponent(specs, id)

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
      r = getSpecRadiusById(specs, id, true)
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
      stroke: COLOR_NONE,
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

    const core_icon = new Icon(
      {
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
      },
      this.$system,
      this.$pod
    )
    this._core_icon[unit_id] = core_icon

    const spec_name = spec.name || ''

    this._node_name[unit_id] = spec_name

    const { width: name_width, height: name_height } =
      this._get_node_name_size(unit_id)

    const core_name = new Editable(
      {
        className: 'core-name',
        style: {
          position: 'absolute',
          display: 'flex',
          fontSize: '12px',
          borderColor: COLOR_NONE,
          borderWidth: '0px',
          borderStyle: 'solid',
          paddingTop: '1px',
          textDecoration: 'none',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
          touchAction: 'none',
          color: this._theme.text,
          width: `${name_width + 2}px`,
          height: `${name_height + 2}px`,
          overflow: 'hidden',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          left: `50%`,
          top: 'calc(100% + 3px)',
          transform: `translateX(-50%)`,
          ...userSelect('none'),
        },
        tabIndex: -1,
        innerText: spec_name,
      },
      this.$system,
      this.$pod
    )
    core_name.$element.addEventListener('dragstart', (event) => {
      event.preventDefault()
    })
    this._sim_setup_node_name(unit_id, core_name)
    this._core_name[unit_id] = core_name

    const spec_description: string =
      (spec.metadata && spec.metadata.description) || '...'

    const { width: description_width, height: description_height } =
      getDivTextSize(spec_description, 10, 30)

    const core_description = new Div(
      {
        className: 'core-description',
        style: {
          position: 'absolute',
          display: 'none',
          fontSize: '10px',
          borderColor: COLOR_NONE,
          borderWidth: '0px',
          borderStyle: 'solid',
          textDecoration: 'none',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
          touchAction: 'none',
          color: this._theme.pin_text,
          width: `${description_width}px`,
          height: `${description_height}px`,
          overflowWrap: 'break-word',
          // whiteSpace: 'break-spaces',
          left: `50%`,
          top: `calc(100% + ${name_height + 6}px)`,
          transform: `translateX(-50%)`,
          ...userSelect('none'),
        },
        innerText: spec_description,
      },
      this.$system,
      this.$pod
    )
    this._core_description[unit_id] = core_description

    const core_content = new Div(
      {
        style: {
          position: 'relative',
        },
      },
      this.$system,
      this.$pod
    )
    core_content.appendChild(core_selection)
    core_content.appendChild(core_area)
    core_content.appendChild(core_icon)
    core_content.appendChild(core_name)
    core_content.appendChild(core_description)
    this._core_content[unit_id] = core_content

    const core = new Div(
      {
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
      },
      this.$system,
      this.$pod
    )
    core.appendChild(core_content)
    this._core[unit_id] = core

    core_node_content.appendChild(core)

    this._zoom_comp.appendChild(core_node)

    this._unit_count++

    if (this._minimap) {
      this._minimap.tick()
    }

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

  private _on_core_name_focus = (unit_id: string): void => {
    // console.log('Graph', '_on_core_name_focus', unit_id)

    this._set_core_selection_to_name(unit_id)
  }

  private _on_ext_name_focus = (ext_node_id: string): void => {
    console.log('Graph', '_on_ext_name_focus', ext_node_id)

    this._set_plug_selection_to_name(ext_node_id)
  }

  private _on_ext_name_blur = (ext_node_id: string): void => {
    console.log('Graph', '_on_ext_name_blur', ext_node_id)

    this._set_node_selection_to_node(ext_node_id)

    const value = this._get_node_temp_name(ext_node_id)
    const valid = this._is_valid_plug_name(ext_node_id, value)

    if (valid) {
      this._set_exposed_pin_name(ext_node_id, value)
    } else {
      // TODO
    }
  }

  private _set_plug_selection_to_name = (ext_node_id: string): void => {
    this._set_node_selection_to_name(ext_node_id, 6, 0)
  }

  private _set_node_selection_to_node = (unit_id: string): void => {
    const {
      width: node_width,
      height: node_height,
      shape: node_shape,
    } = this._node[unit_id]

    const selection = this._node_selection[unit_id]

    selection.setProp('y', 0)
    selection.setProp('shape', node_shape)

    this._resize_selection(unit_id, node_width, node_height)
  }

  private _set_node_selection_to_name = (
    node_id: string,
    dy: number = 0,
    dx: number = 0,
    dw: number = 0,
    dh: number = 0
  ): void => {
    const { height: node_height } = this._node[node_id]

    const { width, height } = this._get_node_name_size(node_id)

    const x = dx
    const y = node_height + dy - height / 2
    const shape = 'rect'

    this._set_selection_y(node_id, y)
    this._set_selection_x(node_id, x)
    this._set_selection_shape(node_id, shape)

    this._resize_selection(node_id, width, height)
  }

  private _set_selection_x = (node_id: string, x: number) => {
    const selection = this._node_selection[node_id]

    selection.setProp('x', x)
  }

  private _set_selection_y = (node_id: string, y: number) => {
    const selection = this._node_selection[node_id]

    selection.setProp('y', y)
  }

  private _set_selection_shape = (node_id: string, shape: Shape) => {
    const selection = this._node_selection[node_id]

    selection.setProp('shape', shape)
  }

  private _sim_add_core_component_frame = (unit_id: string): void => {
    const { $theme, $color } = this.$context

    const core_content = this._core_content[unit_id]

    const core_component_frame = new Frame(
      {
        className: 'core-component-frame',
        disabled: true,
        // color: $color,
        // theme: $theme,
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
        },
      },
      this.$system,
      this.$pod
    )
    const { $$context } = core_component_frame
    this._core_component_frame[unit_id] = core_component_frame
    this._core_component_frame_context[unit_id] = $$context
    core_content.appendChild(core_component_frame)
  }

  private _sim_add_core_resize = (unit_id: string): void => {
    const core_content = this._core_content[unit_id]

    const core_resize = new Resize(
      { disabled: true, l: 21 },
      this.$system,
      this.$pod
    )
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
    const component_children_counter = new Div(
      {
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
      },
      this.$system,
      this.$pod
    )
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

    this._sub_component_parent[unit_id] = parent_id

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
    console.log('Graph', '_refresh_layout_node_size', layer)

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

  private _force_all_layout_node_traits = () => {
    this._force_layout_node_traits(null)
    for (const layer of this._layout_path) {
      this._force_layout_node_traits(layer)
    }
  }

  private _force_layout_node_traits = (parent_id: string | null): void => {
    // console.log('Graph', '_force_layout_node_traits')

    const children =
      parent_id === null
        ? this._get_component_spec_children()
        : this._get_sub_component_spec_children(parent_id)

    for (const child of children) {
      const { x, y, width, height } = this._layout_target_node[child]

      this._set_layout_core_position(child, x, y)
      this.__resize_layout_core(child, width, height)
    }
  }

  private _refresh_layout_node_target_size = () => {}

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

    const layout_core = new Div(
      {
        style: {
          // display: 'none',
          opacity: '1',
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
      },
      this.$system,
      this.$pod
    )
    this._layout_core[unit_id] = layout_core

    const fontSize = this.getFontSize()

    const layout_node: LayoutNode = {
      x,
      y,
      width,
      height,
      k: 1,
      opacity: 1,
      fontSize,
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
    // console.log('Graph', '_sim_add_unit_component', unit_id)

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
    this._search_adding_unit = true

    let sub_component = this._component.$subComponent[unit_id]

    if (sub_component) {
      // TODO
    } else {
      const spec_id = this._get_unit_spec_id(unit_id)

      sub_component = componentFromSpecId(this.$system, this.$pod, spec_id, {})

      this._component.setSubComponent(unit_id, sub_component)
      this._component.pushRoot(sub_component)
    }

    const sub_component_count = _keyCount(this._component.$subComponent)

    this._set_sub_component_index(unit_id, sub_component_count - 1)

    this._search_adding_unit = false
  }

  private _node_name: Dict<string> = {}

  private _is_valid_unit_name = (value: string): boolean => {
    if (value.length === 0) {
      return false
    }

    if (value.match(/\n/g)) {
      return false
    }

    if (value.length > UNIT_NAME_MAX_SIZE) {
      return false
    }

    return true
  }

  private _get_node_temp_name = (node_id: string): string => {
    return this._node_name[node_id] ?? ''
  }

  private _mem_set_node_temp_name = (node_id: string, value: string) => {
    this._node_name[node_id] = value
  }

  private _set_unit_temp_name = (unit_id: string, value: string): void => {
    // console.log('Graph', '_set_unit_temp_name', unit_id, value)

    if (value.length > UNIT_NAME_MAX_SIZE) {
      value = value.substring(0, UNIT_NAME_MAX_SIZE)

      this._mem_set_node_temp_name(unit_id, value)
      this._dom_set_core_temp_name(unit_id, value)
    }

    this._set_core_selection_to_name(unit_id)

    this._refresh_core_name_color(unit_id)
    this._refresh_core_name_size(unit_id)
  }

  private _set_core_selection_to_name(unit_id): void {
    this._set_node_selection_to_name(unit_id, 1, 0)
  }

  private _dom_set_core_temp_name = (unit_id: string, value: string) => {
    const core_name = this._core_name[unit_id]

    core_name.$element.textContent = value
  }

  private _refresh_core_name_color = (unit_id: string) => {
    const value = this._get_node_temp_name(unit_id)

    const valid = this._is_valid_unit_name(value)

    if (valid) {
      this._set_core_name_caret_color(unit_id, 'currentColor')
    } else {
      const err_color = this._get_err_color()

      this._set_core_name_caret_color(unit_id, err_color)
    }
  }

  private _get_err_color = (): string => {
    return COLOR_OPAQUE_RED
  }

  private _get_mode_color = (mode: Mode): string => {
    const { $theme } = this.$context

    const color = getThemeModeColor($theme, mode, 'currentColor')

    return color
  }

  private _set_core_name_caret_color = (
    unit_id: string,
    caretColor: string
  ): void => {
    const core_name = this._core_name[unit_id]

    this._set_name_comp_caret_color(core_name, caretColor)
  }

  private _set_name_comp_caret_color = (
    name_comp: Editable,
    caretColor: string
  ): void => {
    name_comp.$element.style.caretColor = caretColor
  }

  private _get_core_name_size = (node_id: string): Size => {
    // console.log('Graph', '_get_core_name_size', unit_id, value)

    const value = this._node_name[node_id]

    const size = getDivTextSize(
      value,
      UNIT_CORE_NAME_FONT_SIZE,
      UNIT_NAME_MAX_CHAR_LINE
    )

    return size
  }

  private _get_node_name_size = (node_id: string): Size => {
    // console.log('Graph', '_get_node_name_size', unit_id, value)

    if (this._is_unit_node_id(node_id)) {
      return this._get_core_name_size(node_id)
    } else if (this._is_ext_node_id(node_id)) {
      return this._get_plug_name_size(node_id)
    } else {
      throw new ShouldNeverHappenError()
    }
  }

  private _refresh_core_name_size = (unit_id: string) => {
    // console.log('Graph', '_refresh_core_name_size', unit_id)

    const { width, height } = this._get_node_name_size(unit_id)

    // console.log('Graph', '_refresh_core_name_size', unit_id, width, height)

    const core_name = this._core_name[unit_id]

    core_name.$element.style.width = `${width + 2}px`
    core_name.$element.style.height = `${height + 2}px`
  }

  private _get_plug_name_size = (ext_node_id: string): Size => {
    // console.log('Graph', '_get_plug_name_size', unit_id, value)

    const value = this._node_name[ext_node_id]

    const size = getDivTextSize(
      value,
      PLUG_NAME_FONT_SIZE,
      PLUG_NAME_MAX_CHAR_LINE
    )

    return size
  }

  private _refresh_plug_name_size = (ext_node_id: string) => {
    // console.log('Graph', '_refresh_plug_name_size', ext_node_id)

    const { width, height } = this._get_plug_name_size(ext_node_id)

    const _width = Math.max(width, 6)
    const _height = Math.max(height, 6)

    this._set_plug_name_style_attr(ext_node_id, 'width', `${_width}px`)
    this._set_plug_name_style_attr(ext_node_id, 'height', `${_height}px`)

    this._set_plug_selection_to_name(ext_node_id)
  }

  private _set_unit_name = (unit_id: string, value: string): void => {
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
      UNIT_NAME_MAX_CHAR_LINE
    )
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

  private _set_unit_pin_temp_name = (
    pin_node_id: string,
    value: string
  ): void => {
    // TODO
  }

  private _set_unit_pin_name = (pin_node_id: string, value: string): void => {
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
    const { type, pinId } = segmentExposedNodeId(exposed_pin_node_id)
    this._sim_set_exposed_pin_name(type, pinId, name)
    this._spec_set_exposed_pin_name(type, pinId, name)
    this._pod_set_exposed_pin_name(type, pinId, name)
  }

  private _spec_set_exposed_pin_name = (
    type: IO,
    id: string,
    newId: string
  ): void => {
    // console.log('Graph', '_spec_set_exposed_pin_name', type, pinId, name)
    // this._spec = specReducer.setPinSetName({ type, pinId, name }, this._spec)
    this._spec = specReducer.setPinSetId({ type, id, newId }, this._spec)
  }

  private _sim_set_exposed_pin_name = (
    type: IO,
    pinId: string,
    new_id: string
  ): void => {
    const pin_spec = this._get_exposed_pin_spec(type, pinId)

    const { pin } = pin_spec

    for (const sub_pin_id in pin) {
      const sub_pin = pin[sub_pin_id]

      const ext_sub_pin_id = getExtNodeId(type, pinId, sub_pin_id)
      const int_sub_pin_id = getIntNodeId(type, pinId, sub_pin_id)

      const new_ext_sub_pin_id = getExtNodeId(type, new_id, sub_pin_id)
      const new_int_sub_pin_id = getIntNodeId(type, new_id, sub_pin_id)

      // TODO
    }
  }

  private _pod_set_exposed_pin_name = (
    type: IO,
    id: string,
    value: string
  ): void => {
    // TODO
  }

  private _get_err_size = (err: string): Size => {
    // let { width, height } = getTextSize(err, 12, 18)
    let { width, height } = getDivTextSize(err, 12, 18)
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
      stroke: COLOR_NONE,
    })

    const err_area = this._create_touch_area({
      className: 'err-area',
      width,
      height,
    })
    this._err_area[err_node_id] = err_area

    const err_comp = new Div(
      {
        className: 'err',
        style: {
          width: `${width}px`,
          height: `${height}px`,
          fontSize: '12px',
          textAlign: 'center',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          overflow: 'auto',
          color: COLOR_OPAQUE_RED,
          ...userSelect('auto'),
        },
        innerText: escaped_err,
      },
      this.$system,
      this.$pod
    )
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
          head: 0,
        },
      },
      {
        stroke: COLOR_OPAQUE_RED,
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
    err_component.$element.style.width = `${width}px`
    err_component.$element.style.height = `${height}px`
    const escaped_err = escape(err)
    err_component.setProp('innerText', escaped_err)
  }

  public add_exposed_pin_set = (
    type: IO,
    pin_id: string,
    pin_spec: GraphExposedPinSpec,
    position: Dict<{ int?: Position; ext?: Position }> = {}
  ) => {
    this._add_exposed_pin_set(type, pin_id, pin_spec, position)
    this._dispatch_action(exposePinSet(type, pin_id, pin_spec))
  }

  private _add_exposed_pin_set = (
    type: IO,
    pin_id: string,
    pin_spec: GraphExposedPinSpec,
    position: Dict<{ int?: Position; ext?: Position }> = {}
  ) => {
    // console.log('Graph', '_add_exposed_pin_set', type, pin_id, pin_spec)

    this._state_add_exposed_pin_set(type, pin_id, pin_spec, position)
    this._pod_add_exposed_pin_set(type, pin_id, pin_spec)
  }

  private _state_add_exposed_pin_set = (
    type: IO,
    pin_id: string,
    pin_spec: GraphExposedPinSpec,
    position: Dict<{ int?: Position; ext?: Position }> = {}
  ) => {
    this._spec_add_exposed_pin_set(type, pin_id, pin_spec)
    this._sim_add_exposed_pin_set(type, pin_id, pin_spec, position)
  }

  private _spec_add_exposed_pin_set = (
    type: IO,
    id: string,
    pin: GraphExposedPinSpec
  ) => {
    // console.log('_spec_add_exposed_pin_set', type, pinId, pin)
    this._spec = specReducer.exposePinSet({ id, type, pin }, this._spec)
  }

  private _pod_add_exposed_pin_set = (
    type: IO,
    id: string,
    pin: GraphExposedPinSpec
  ): void => {
    // console.log('Graph', '_pod_add_exposed_pin_set', id, type, pin)
    this._pod.$exposePinSet({
      type,
      id,
      pin,
    })
  }

  private _pod_add_unit_exposed_pin_set = (
    unitId: string,
    type: IO,
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
    type: IO,
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
          p = { ext: this._jiggle_world_screen_center() }
          p.ext.x += pin_metadata_position.x
          p.ext.y += pin_metadata_position.y
        }
      }
      const sub_pin_spec = pin[sub_pin_id]
      this._sim_add_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec, p)
    }
  }

  public add_exposed_pin = (
    type: IO,
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
    this._dispatch_action(exposePin(type, pin_id, sub_pin_id, sub_pin_spec))
  }

  private _add_exposed_pin = (
    type: IO,
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
    type: IO,
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
    type: IO,
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec,
    position: { int?: Point; ext?: Point }
  ): void => {
    this._spec_add_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
    this._sim_add_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec, position)
  }

  private _sim_setup_node_name = (
    node_id: string,
    name_component: Component
  ) => {
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
    if (this._is_unit_node_id(node_id)) {
      this._on_core_name_focus(node_id)
    } else if (this._is_ext_node_id(node_id)) {
      this._on_ext_name_focus(node_id)
    }

    this._edit_node_name_id = node_id
    this._disable_crud()
    this._disable_keyboard()
  }

  private _on_node_name_blur = (node_id: string): void => {
    if (this._is_unit_node_id(node_id)) {
      this._on_core_name_blur(node_id)
    } else if (this._is_ext_node_id(node_id)) {
      this._on_ext_name_blur(node_id)
    }

    this._enable_crud()
    this._enable_keyboard()
    this._edit_node_name_id = null
  }

  private _on_core_name_blur = (unit_id: string): void => {
    const temp_name = this._node_name[unit_id]

    const valid = this._is_valid_unit_name(temp_name)

    const core_name = this._core_name[unit_id]

    let name: string

    if (valid) {
      name = temp_name.trim()

      this._set_unit_name(unit_id, temp_name)
    } else {
      name = this._get_unit_name(unit_id)
    }

    core_name.deselect()

    core_name.setProp('value', name)

    this._node_name[unit_id] = name

    core_name.$element.style.caretColor = 'currentColor'

    this._set_node_temp_name(unit_id, name)
    this._set_node_selection_to_node(unit_id)

    this._refresh_core_name_size(unit_id)
  }

  private _on_node_name_input = (node_id: string, value: string): void => {
    console.log('Graph', '_on_node_name_input', node_id, value)

    this._set_node_temp_name(node_id, value)
  }

  private _set_node_temp_name = (node_id: string, value: string): void => {
    this._node_name[node_id] = value

    if (this._is_unit_node_id(node_id)) {
      this._set_unit_temp_name(node_id, value)
    } else if (this._is_link_pin_node_id(node_id)) {
      this._set_unit_pin_temp_name(node_id, value)
    } else if (this._is_ext_node_id(node_id)) {
      this._set_plug_temp_name(node_id, value)
    }
  }

  private __is_valid_plug_name = (
    type: IO,
    pinId: string,
    subPinId: string,
    value: string
  ) => {
    if (value.length === 0) {
      return false
    }

    if (value.length > 12) {
      return false
    }

    return true
  }

  private _is_valid_plug_name = (plug_node_id: string, value: string) => {
    const { type, pinId, subPinId } = segmentExposedNodeId(plug_node_id)

    const valid = this.__is_valid_plug_name(type, pinId, subPinId, value)

    return valid
  }

  private _set_plug_name_caret_color = (
    plug_node_id: string,
    caretColor: string
  ): void => {
    this._set_plug_name_style_attr(plug_node_id, 'caretColor', caretColor)
  }

  private _set_plug_temp_name = (ext_node_id: string, value: string): void => {
    const valid = this._is_valid_plug_name(ext_node_id, value)

    if (valid) {
      this._set_plug_name_caret_color(ext_node_id, 'currentColor')
    } else {
      this._set_plug_name_caret_color(ext_node_id, this._get_err_color())
    }

    this._refresh_plug_name_size(ext_node_id)
  }

  private _sim_add_exposed_pin = (
    type: IO,
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec,
    position: { int?: Position; ext?: Position } = {}
  ): void => {
    const ext_node_id = getExtNodeId(type, pin_id, sub_pin_id)
    const int_node_id = getIntNodeId(type, pin_id, sub_pin_id)

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

    this._sim_add_node(ext_node_id, {
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
    // this._pin_nodes[ext_node_id] = this._nodes[ext_node_id]
    this._node_type[ext_node_id] = 'e'
    this._node_layer[ext_node_id] = LAYER_EXPOSED

    const node = this._node[ext_node_id]

    this._exposed_node[ext_node_id] = node
    this._exposed_ext_node[ext_node_id] = node

    const pin_node = this._node_comp[ext_node_id]
    const pin_node_content = this._node_content[ext_node_id]

    const pin = this._create_pin({
      className: classnames('pin', type),
      r,
      style: {
        borderColor: active ? this._theme.data : color,
        backgroundColor: input ? 'none' : active ? this._theme.data : color,
      },
      shape,
    })
    this._pin[ext_node_id] = pin
    pin_node_content.appendChild(pin)

    const pin_selection = this._create_selection(ext_node_id, {
      width,
      height,
      shape,
      stroke: COLOR_NONE,
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
      className: 'exposed-pin-name',
      r,
      dx: 0,
      dy: -1,
      style: {
        color,
        ...userSelect('inherit'),
        pointerEvents: 'none',
      },
      name: pin_id,
    })
    this._sim_setup_node_name(ext_node_id, pin_name)
    this._ext_pin_name[ext_node_id] = pin_name

    this._node_name[ext_node_id] = pin_id

    pin_node_content.appendChild(pin_name)

    this._zoom_comp.appendChild(pin_node)

    let anchor_node_id: string

    const { unitId, pinId, mergeId } = sub_pin_spec

    let plugged = false

    if (unitId && pinId) {
      plugged = true

      if (pinId === SELF) {
        anchor_node_id = unitId
      } else {
        anchor_node_id = getPinNodeId(unitId, type, pinId)

        this._pin_to_internal[anchor_node_id] = int_node_id
      }

      this._exposed_ext_plugged[ext_node_id] = anchor_node_id
      this._exposed_int_plugged[int_node_id] = anchor_node_id
    } else if (mergeId) {
      plugged = true

      anchor_node_id = getMergeNodeId(mergeId)

      this._exposed_ext_plugged[ext_node_id] = anchor_node_id
      this._exposed_int_plugged[int_node_id] = anchor_node_id

      this._pin_to_internal[anchor_node_id] = int_node_id
    } else {
      const int_pin_position =
        position.int || randomInRadius(x, y, LINK_DISTANCE)
      this._sim_add_internal_pin(type, pin_id, sub_pin_id, int_pin_position)
      anchor_node_id = int_node_id
      this._exposed_ext_unplugged[ext_node_id] = true
      this._exposed_int_unplugged[int_node_id] = true
    }

    const link_id_source_id = input ? ext_node_id : int_node_id
    const link_id_target_id = input ? int_node_id : ext_node_id
    const link_id = getLinkId(link_id_source_id, link_id_target_id)

    const source_id = input ? ext_node_id : anchor_node_id
    const target_id = input ? anchor_node_id : ext_node_id

    const anchor_shape = this._get_node_shape(anchor_node_id)
    const anchor_r = this._get_node_r(anchor_node_id)

    const ARROW_SHAPE = describeArrowShape(anchor_shape, anchor_r)

    let start_marker: SVGPath | null = null
    let end_marker: SVGPath | null = null

    const marker_style = {
      fill: 'none',
      strokeWidth: '1',
      stroke: color,
    }

    if (input) {
      const end_d = `${functional ? ARROW_MEMORY : ''}${ARROW_SHAPE}`
      end_marker = new SVGPath(
        { d: end_d, style: marker_style },
        this.$system,
        this.$pod
      )
    } else {
      const start_d = ARROW_SHAPE
      start_marker = new SVGPath(
        { d: start_d, style: marker_style },
        this.$system,
        this.$pod
      )
    }

    this._exposed_link_start_marker[ext_node_id] = start_marker
    this._exposed_link_end_marker[ext_node_id] = end_marker

    const padding = {
      target: input ? -1.5 : output ? 0 : 0,
      source: input ? 0 : output ? -1.5 : 0,
    }

    const d = plugged ? EXPOSED_LINK_DISTANCE / 3 : EXPOSED_LINK_DISTANCE
    const s = 0.1

    const pin_link = this._sim_add_link(
      link_id,
      {
        source_id,
        target_id,
        d,
        s,
        padding,
        detail: {
          type: 'e',
          head: 1.5,
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
    type: IO,
    pin_id: string,
    sub_pin_id: string,
    { x, y }: Position
  ): void => {
    const int_node_id = getIntNodeId(type, pin_id, sub_pin_id)

    const r = PIN_RADIUS

    const width = 2 * r
    const height = 2 * r

    const shape = 'circle'

    this._sim_add_node(int_node_id, {
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
    // this._pin_nodes[int_node_id] = this._nodes[int_node_id]
    this._node_type[int_node_id] = 'i'
    this._node_layer[int_node_id] = LAYER_EXPOSED

    const node = this._node[int_node_id]

    this._exposed_node[int_node_id] = node
    this._exposed_int_node[int_node_id] = node

    const internal_pin_node = this._node_comp[int_node_id]
    const internal_pin_node_content = this._node_content[int_node_id]

    const internal_pin_el = this._create_pin({
      className: classnames('pin', type),
      r,
      style: {},
      shape,
    })
    this._pin[int_node_id] = internal_pin_el
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

    const internal_pin_selection = this._create_selection(int_node_id, {
      width,
      height,
      shape,
      stroke: COLOR_NONE,
    })
    internal_pin_el.appendChild(internal_pin_selection)

    this._zoom_comp.appendChild(internal_pin_node)
  }

  private _pod_add_exposed_pin = (
    type: IO,
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

  private _pin_type_of_kind = (pin_node_id: string, kind: IO): TreeNode => {
    if (this._is_merge_node_id(pin_node_id)) {
      return this._get_merge_pin_type(pin_node_id, kind)
    } else {
      return this._link_pin_type(pin_node_id)
    }
  }

  private _get_merge_pin_type = (merge_node_id: string, kind: IO): TreeNode => {
    const merge_ref_unit = this._merge_to_ref_unit[merge_node_id]
    const { id } = segmentMergeNodeId(merge_node_id)
    const merge = this.__get_merge(id)
    return this._get_merge_spec_type(merge, kind)
  }

  private _get_merge_spec_type = (
    merge: GraphMergeSpec,
    kind: IO
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
    kind: IO,
    pin_id: string
  ): TreeNode => {
    const specs = this._get_specs()

    if (kind === 'output' && pin_id === SELF) {
      return this._get_unit_type(unit_id)
    }

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

  private _get_ext_pin_type = (ext_node_id: string): TreeNode => {
    const { type, pinId } = segmentExposedNodeId(ext_node_id)
    return this.__get_ext_pin_type(type, pinId)
  }

  private __get_ext_pin_type = (type: IO, id: string): TreeNode => {
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
    position: Position
  ): void => {
    const tree: TreeNode = this._get_pin_type(pin_node_id)

    this._sim_add_node_type(pin_node_id, tree, position)
  }

  private _sim_add_node_type = (
    node_id: string,
    tree: TreeNode,
    { x, y }: Position
  ): void => {
    const type_node_id = getTypeNodeId(node_id)

    const shape = 'rect'

    let { width, height } = this._get_datum_tree_size(tree)
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

    const type_datum = new DataTree(
      {
        style: {},
        data: tree,
      },
      this.$system,
      this.$pod
    )
    this._type[type_node_id] = type_datum

    const type_container = new Div(
      {
        className: 'graph-type',
        style: {
          width: `${width}px`,
          height: `${height}px`,
          overflow: 'overlay',
          color: this._theme.type,
          pointerEvents: 'none',
        },
      },
      this.$system,
      this.$pod
    )
    type_container.appendChild(type_datum)
    this._type_container[type_node_id] = type_container

    const node_content = this._node_content[type_node_id]

    const type_selection = this._create_selection(type_node_id, {
      width,
      height,
      shape,
      stroke: COLOR_NONE,
    })

    node_content.appendChild(type_selection)
    node_content.appendChild(type_container)

    this._zoom_comp.appendChild(type_node_el)

    const link_id = getLinkId(type_node_id, node_id)

    const anchor_node_id = this._get_pin_anchor_node_id(node_id)

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
          head: 0,
        },
      },
      {
        stroke: this._theme.sub_text,
        strokeWidth: 1,
        hidden,
        style: {
          pointerEvents: 'none',
        },
      }
    )

    const link_comp = this._link_comp[link_id]
    link_comp.$element.style.pointerEvents = 'none'

    this._type_link[link_id] = this._link[link_id]
    this._link_layer[link_id] = LAYER_TYPE

    this._zoom_comp.appendChild(type_link, 'svg')

    this._start_graph_simulation(LAYER_TYPE)
  }

  private _create_layout_layer = ({
    className,
    style = {},
  }: {
    className: string
    style: Dict<any>
  }): LayoutLayer => {
    const layer = new Div(
      {
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
          // touchAction: 'none',
          ...style,
        },
      },
      this.$system,
      this.$pod
    )

    const height = new Div(
      {
        className: `${className}-height`,
        style: {
          position: 'absolute',
          pointerEvents: 'none',
        },
      },
      this.$system,
      this.$pod
    )
    layer.appendChild(height)

    const children = new Div(
      {
        className: `${className}-children`,
        style: {
          zIndex: '0',
          opacity: '0',
          position: 'absolute',
          overflowY: 'hidden',
          overflowX: 'hidden',
          transition: `opacity ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system,
      this.$pod
    )
    layer.appendChild(children)

    const layers = new Div(
      {
        className: `${className}-layers`,
        style: {
          position: 'absolute',
          pointerEvents: 'none',
        },
      },
      this.$system,
      this.$pod
    )
    layer.appendChild(layers)

    const foreground = new Div(
      {
        className: `${className}-foreground`,
        style: {
          position: 'absolute',
          top: '0',
          left: '0',
          overflowY: 'hidden',
          overflowX: 'hidden',
          pointerEvents: 'none',
        },
      },
      this.$system,
      this.$pod
    )
    layer.appendChild(foreground)

    return { layer, foreground, height, children, layers }
  }

  private _create_touch_area = ({
    className,
    width,
    height,
    style,
  }: AreaOpt): Div => {
    const area = new Div(
      {
        className,
        style: {
          width: `${width + NODE_PADDING}px`,
          height: `${height + NODE_PADDING}px`,
          zIndex: '-1',
          backgroundColor: COLOR_NONE,
          // backgroundColor: setAlpha(randomColorString(), 0.5),
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    return area
  }

  private _sim_add_link_pin_node = (
    unit_id: string,
    type: IO,
    pin_id: string,
    { x, y }: Position
  ): void => {
    const { specs } = this.$system

    const pin_node_id = getPinNodeId(unit_id, type, pin_id)

    const input = type === 'input'
    const output = !input
    const ignored = this._spec_is_link_pin_ignored(pin_node_id)
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

      // r = 0.8 * UNIT_MIN_RADIUS
      r = UNIT_MIN_RADIUS

      if (pin) {
        const sub_pin_id = getObjSingleKey(pin)
        const sub_pin = pin[sub_pin_id]
        const { unitId, pinId, mergeId } = sub_pin
        const { units = {}, merges = {} } = spec as GraphSpec

        let ref_unit_id: string
        if (unitId && pinId) {
          ref_unit_id = unitId
        } else {
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

        const { id } = unit
        const unit_spec = getSpec(specs, id)
        const unit_component = isComponent(specs, id)

        pin_icon_name = unit_spec.metadata?.icon || 'circle'

        if (unit_component) {
          shape = 'rect'
        }
      } else {
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

    this._node_type[pin_node_id] = 'p'

    const node = this._node[pin_node_id]

    this._pin_node[pin_node_id] = node

    if (input) {
      this._link_pin_input_set.add(pin_node_id)
    } else {
      this._link_pin_output_set.add(pin_node_id)
    }

    if (ref) {
      this._link_pin_ref_set.add(pin_node_id)
    }

    if (ignored) {
      this._ignored_node[pin_node_id] = node
    } else {
      this._normal_node[pin_node_id] = node
    }

    const pin_node = this._node_comp[pin_node_id]
    const pin_node_content = this._node_content[pin_node_id]

    const opacity = ignored ? (this._mode === 'add' ? '0.5' : `0`) : `1`

    const pin_border_color =
      ref && input ? COLOR_NONE : active ? this._theme.data : this._theme.node

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
      const ref_output_pin_icon = new Icon(
        {
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
        },
        this.$system,
        this.$pod
      )
      this._ref_output_pin_icon[pin_node_id] = ref_output_pin_icon
      pin.appendChild(ref_output_pin_icon)
    }

    const pin_selection = this._create_selection(pin_node_id, {
      width,
      height,
      shape,
      stroke: COLOR_NONE,
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
    datum_node_content.$element.style.display = 'none'

    const pin_node_id = this._datum_to_pin[datum_node_id]
    if (pin_node_id) {
      const datum_link_id = getLinkId(datum_node_id, pin_node_id)

      delete this._visible_data_link[datum_link_id]
      delete this._visible_linked_data_node[datum_node_id]
      delete this._visible_unlinked_data_node[datum_node_id]

      const datum_link_comp = this._link_comp[datum_link_id]

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
      datum_link_comp.$element.style.display = 'block'
    }

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _sim_add_link_pin_link = (
    unit_id: string,
    type: IO,
    pin_id: string
  ): void => {
    // console.log('Graph', '_sim_add_link_pin_link', unit_id, type, pin_id)

    const pin_node_id = getPinNodeId(unit_id, type, pin_id)

    const ignored = this._spec_is_link_pin_ignored(pin_node_id)
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
    const pin_link_start_marker = new SVGPath(
      {
        d: pin_link_start_marker_d,
        style: {
          display: pin_link_start_marker_hidden ? 'none' : 'block',
          fill: 'none',
          strokeWidth: '1',
          stroke,
        },
      },
      this.$system,
      this.$pod
    )
    this._pin_link_start_marker[pin_node_id] = pin_link_start_marker

    const pin_link_end_marker_d = init
      ? ARROW_NONE
      : ref || memory
      ? ARROW_MEMORY
      : ARROW_NORMAL

    const pin_link_end_marker_fill = ref || memory ? 'none' : pin_link_stroke
    const pin_link_end_marker_stroke = ref || memory ? pin_link_stroke : 'none'
    const pin_link_end_marker_stroke_width = ref || memory ? '1px' : '0'
    const pin_link_end_marker = new SVGPath(
      {
        d: pin_link_end_marker_d,
        style: {
          fill: pin_link_end_marker_fill,
          stroke: pin_link_end_marker_stroke,
          strokeWidth: pin_link_end_marker_stroke_width,
        },
      },
      this.$system,
      this.$pod
    )
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
          head: 5.25,
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

    this._link_force_count_k[pin_node_id] =
      this._link_force_count_k[pin_node_id] || 0
    this._link_force_count_k[pin_node_id]++

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

    const node_comp = new Div(
      {
        id: node_id,
        className: 'node',
        style: {
          position: 'absolute',
          transform: `translate(${x}px, ${y}px)`,
          width: '0',
          height: '0',
        },
      },
      this.$system,
      this.$pod
    )

    this._node_unlisten[node_id] = this._listen_node(node_id, node_comp)

    this._node_comp[node_id] = node_comp

    const node_content = new Div(
      {
        className: 'node-content',
        style: {
          position: 'absolute',
          width: 'fit-content',
          height: 'fit-content',
          transform: `translate(-${width / 2}px, -${height / 2}px)`,
        },
      },
      this.$system,
      this.$pod
    )
    this._node_content[node_id] = node_content

    node_comp.appendChild(node_content)

    this._node[node_id] = node

    this._node_link_count[node_id] = 0

    this._add_node_link_heap_node(node_id)

    add_node_to_graph(this._node_graph, node_id)

    this._rebuild_subgraph()

    return node_comp
  }

  private _node_link_heap_predicative = (
    a: { count: number; id: string },
    b: { count: number; id: string }
  ): boolean => {
    return a.count >= b.count
  }

  private _add_node_link_heap_node = (node_id: string): void => {
    // console.log('Graph', '_add_node_link_heap_node', node_id)
    const heap_node = {
      value: { count: 0, id: node_id },
      parent: null,
      children: [],
    }
    this._node_link_heap[node_id] = heap_node
    this._node_link_heap_root = addHeapNode(
      this._node_link_heap_root,
      heap_node,
      this._node_link_heap_predicative
    )
  }

  private _remove_node_link_heap = (node_id: string) => {
    // console.log('Graph', '_remove_node_link_heap', node_id)
    const heap_node = this._node_link_heap[node_id]
    this._node_link_heap_root = removeHeapNode(
      heap_node,
      this._node_link_heap_predicative
    )
    delete this._node_link_heap[node_id]
  }

  private _set_node_link_heap_count = (
    node_id: string,
    count: number
  ): void => {
    const heap_node = this._node_link_heap[node_id]
    this._node_link_heap_root = setHeapNode(
      heap_node,
      { count, id: node_id },
      this._node_link_heap_predicative
    )
  }

  public add_merge = (
    merge_id: string,
    merge: GraphMergeSpec,
    position: Position
  ): void => {
    this._add_merge(merge_id, merge, position)

    this._dispatch_action(addMerge(merge_id, merge, position))
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
    // console.log('Graph', '_spec_add_merge', merge_id, merge)

    this._spec = specReducer.addMerge({ id: merge_id, merge }, this._spec)
  }

  private _state_add_merge = (
    merge_id: string,
    merge: GraphMergeSpec,
    position: Position
  ): void => {
    // console.log('Graph', '_state_add_merge')

    this._spec_add_merge(merge_id, merge)
    this._sim_add_merge(merge_id, merge, position)
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

    const merge_exposed_set = new Set<{ type; pinId; subPinId }>()

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
      }
    }

    this._merge_ref[merge_node_id] = merge_ref

    this._node_type[merge_node_id] = 'm'

    if (!merge_unit_id && !merge_ref_output_id) {
      this._sim_add_merge_pin_node(merge_id, position)
    }

    for (const { type, pinId, subPinId } of merge_exposed_set) {
      this._sim_plug_exposed_pin(type, pinId, subPinId, { mergeId: merge_id })
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

    const merge = new Div(
      {
        className: 'pin',
        style: {
          position: 'relative',
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: shape === 'circle' ? '50%' : '0',
          boxSizing: 'border-box',
        },
      },
      this.$system,
      this.$pod
    )
    this._merge[merge_node_id] = merge
    merge_node_content.appendChild(merge)

    const merge_selection = this._create_selection(merge_node_id, {
      width,
      height,
      shape,
      stroke: COLOR_NONE,
    })
    merge.appendChild(merge_selection)

    const merge_input_visibility = output_merge ? 'hidden' : 'visible'
    const merge_input_color = merge_ref ? COLOR_NONE : this._theme.node
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
    this._dispatch_action(setDatum(datum_id, value))
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

    const datum_container = new Div(
      {
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
      },
      this.$system,
      this.$pod
    )
    // datum_container.addEventListener(makeFocusInListener(() => {
    //   console.log('focusin')
    // }))
    // datum_container.addEventListener(makeFocusOutListener(() => {
    //   console.log('focusout')
    // }))
    this._datum_container[datum_node_id] = datum_container

    const node_content = this._node_content[datum_node_id]

    const datum_selection = this._create_selection(datum_node_id, {
      width,
      height,
      shape,
      stroke: COLOR_NONE,
    })

    const datum_area = this._create_touch_area({
      className: 'datum-area',
      width,
      height,
    })
    this._datum_area[datum_node_id] = datum_area

    let datum: Datum | any
    if (datum_class_literal) {
      const specs = { ...this.$system.specs, ...this.$pod.specs }
      const classes = this.$system.classes
      const id = idFromUnitValue(value)

      datum = new ClassDatum(
        {
          id: id,
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
        },
        this.$system,
        this.$pod
      )
      const unlisten = NOOP
      this._datum_unlisten[datum_id] = unlisten
    } else {
      datum = new Datum(
        {
          style: {},
          data: tree,
        },
        this.$system,
        this.$pod
      )
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

    if (this._mode === 'none') {
      //
    } else {
      this._enable_datum_overlay(datum_node_id)
    }

    this._start_graph_simulation(LAYER_DATA_LINKED)
  }

  private _inc_merge_input_active = (merge_node_id: string): void => {
    this._merge_active_input_count[merge_node_id] =
      this._merge_active_input_count[merge_node_id] || 0
    this._merge_active_input_count[merge_node_id]++
    // console.log('Graph', '_inc_merge_input_active', merge_node_id, this._merge_active_input_count[merge_node_id])

    if (!this._is_merge_ref(merge_node_id)) {
      this._refresh_merge_pin_pin_color(merge_node_id, 'input')
    }
  }

  private _dec_merge_input_active = (merge_node_id: string): void => {
    this._merge_active_input_count[merge_node_id]--
    // console.log('Graph', '_dec_merge_input_active', merge_node_id, this._merge_active_input_count[merge_node_id])

    if (!this._is_merge_ref(merge_node_id)) {
      this._refresh_merge_pin_pin_color(merge_node_id, 'input')
    }
  }

  private _inc_merge_output_active = (merge_node_id: string): void => {
    // console.log('Graph', '_inc_merge_output_active', merge_node_id)
    this._merge_active_output_count[merge_node_id] =
      this._merge_active_output_count[merge_node_id] || 0
    this._merge_active_output_count[merge_node_id]++

    if (!this._is_merge_ref(merge_node_id)) {
      this._refresh_merge_pin_pin_color(merge_node_id, 'output')
    }
  }

  private _dec_merge_output_active = (merge_node_id: string): void => {
    // console.log('Graph', '_dec_merge_output_active', merge_node_id)
    this._merge_active_output_count[merge_node_id]--

    if (!this._is_merge_ref(merge_node_id)) {
      this._refresh_merge_pin_pin_color(merge_node_id, 'output')
    }
  }

  private _inc_unit_pin_active = (unit_id: string): void => {
    // console.log('Graph', '_inc_unit_pin_active', unit_id)
    this._unit_active_pin_count[unit_id] =
      this._unit_active_pin_count[unit_id] || 0
    this._unit_active_pin_count[unit_id]++
    // console.log(
    //   'Graph',
    //   '_inc_unit_pin_active',
    //   unit_id,
    //   this._unit_active_pin_count[unit_id]
    // )

    this._refresh_core_border_color(unit_id)
  }

  private _dec_unit_pin_active = (unit_id: string): void => {
    // console.log('Graph', '_dec_unit_pin_active', unit_id)
    this._unit_active_pin_count[unit_id]--
    // console.log(
    //   'Graph',
    //   '_dec_unit_pin_active',
    //   unit_id,
    //   this._unit_active_pin_count[unit_id]
    // )
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
    type: IO,
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

    pin.$element.style.width = `${d}px`
    pin.$element.style.height = `${d}px`
    pin.$element.style.transform = `translate(${t}px, ${t}px)`
  }

  private _set_merge_output_r = (merge_node_id: string, r: number): void => {
    // console.log('Graph', '_set_merge_output_r', merge_node_id, r)
    const d = 2 * r
    const t = PIN_RADIUS - r
    const merge_output = this._merge_output[merge_node_id]

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

    merge_input.$element.style.borderColor = borderColor
  }

  private _set_merge_input_visibility = (
    merge_node_id: string,
    visibility: string
  ): void => {
    const merge_input = this._merge_input[merge_node_id]

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

    merge_output.$element.style.visibility = visibility
  }

  private _set_merge_output_color = (
    merge_node_id: string,
    color: string
  ): void => {
    // console.log('Graph', '_set_merge_output_color', merge_node_id, color)
    const merge_output = this._merge_output[merge_node_id]

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
          head: 0,
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

    this._refresh_datum_visible(datum_node_id)

    this._start_graph_simulation(LAYER_DATA_LINKED)
  }

  private _mem_set_pin_datum = (
    pin_node_id: string,
    datum_id: string
  ): void => {
    // console.log('Graph', '_mem_set_pin_datum', pin_node_id, datum_id)

    const pin_datum_tree = this._datum_tree[datum_id]

    const prev_pin_datum_tree = this._pin_datum_tree[pin_node_id]

    this._pin_datum_tree[pin_node_id] = pin_datum_tree

    if (!prev_pin_datum_tree) {
      if (this._is_link_pin_node_id(pin_node_id)) {
        if (!this._spec_is_link_pin_ignored(pin_node_id)) {
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

  private _int_node_locked: Dict<string> = {}

  private _tick_node = (node_id: string): void => {
    const node = this._node[node_id]

    const { x, y } = node

    const node_comp = this._node_comp[node_id]

    node_comp.$element.style.transform = `translate(${x}px, ${y}px)`

    if (this._long_press_collapsing) {
      if (this._long_press_collapse_node_id.has(node_id)) {
        const { x: cx, y: cy } = this._long_press_collapse_world_position
        const dx = x - cx
        const dy = y - cy
        const r = Math.sqrt(dx * dx + dy * dy)
        if (r < 3) {
          this._long_press_collapse_node(node_id)
        }
      }
    }

    if (this._node_target_count > 0) {
      for (const node_id in this._node_target) {
        const c_id = this._node_target[node_id]

        const d = this._node_node_center_distance(node_id, c_id)

        if (this._is_int_pin_node_id(node_id)) {
          const { type } = segmentInternalNodeId(node_id)

          const a_id = node_id
          const b_id = getExtNodeIdFromIntNodeId(node_id)

          const c = this._node[c_id]
          const a = this._node[a_id]

          const { r: a_r } = a
          const { r: c_r } = c

          const d = this._node_node_center_distance(node_id, c_id)

          if (d < c_r + a_r) {
            if (c_r > a_r) {
              this._set_exposed_pin_marker_to_node(
                type,
                b_id,
                a_id,
                a_id,
                c_r + a_r - d
              )
            } else {
              this._set_exposed_pin_marker_to_default(type, b_id, a_id)
            }
          } else {
            this._set_exposed_pin_marker_to_default(type, b_id, a_id)
          }
        }

        if (d < 1) {
          this._on_node_target_end(node_id, c_id)
        }
      }
    }

    if (this._drag_ext_node_count > 0) {
      for (const ext_node_id of this._drag_ext_node_id) {
        const { type, pinId, subPinId } = segmentExposedNodeId(ext_node_id)

        const a_id = getIntNodeId(type, pinId, subPinId)

        const a = this._node[a_id]

        if (!a) {
          continue
        }

        const b_id = ext_node_id

        const b = this._node[b_id]

        const { x: b_x, y: b_y, r: b_r } = b

        if (this._compatible_node_count > 0) {
          let closest_comp_node_id = null
          let closest_d = Number.MAX_SAFE_INTEGER
          let closest_d_a = Number.MAX_SAFE_INTEGER
          let closest_d_b = Number.MAX_SAFE_INTEGER

          for (const comp_node_id in this._compatible_node_id) {
            const comp_node = this._node[comp_node_id]

            const d_a = pointDistance(a, comp_node)
            const d_b = pointDistance(b, comp_node)

            const comp_closest_l = Math.min(d_a, d_b)

            if (comp_closest_l < 3 * LINK_DISTANCE) {
              if (comp_closest_l < closest_d) {
                closest_d = comp_closest_l
                closest_d_a = d_a
                closest_d_b = d_b
                closest_comp_node_id = comp_node_id
              }
            }
          }

          if (closest_comp_node_id) {
            const l = this._node_node_surface_distance(
              a_id,
              closest_comp_node_id
            )

            const { x: a_x, y: a_y, r: a_r } = a

            const comp_node = this._node[closest_comp_node_id]

            const { x: c_x, y: c_y, r: c_r } = comp_node

            if (closest_d_a < c_r + a_r) {
              if (c_r > a_r) {
                this._set_exposed_pin_marker_to_node(
                  type,
                  b_id,
                  a_id,
                  a_id,
                  c_r + a_r - closest_d_a
                )
              } else {
                this._set_exposed_pin_marker_to_default(type, b_id, a_id)
              }
            } else {
              this._set_exposed_pin_marker_to_default(type, b_id, a_id)
            }

            const dr = c_r - a_r

            if (closest_d_b < c_r) {
              this._set_exposed_pin_marker_to_node(
                type,
                b_id,
                a_id,
                closest_comp_node_id,
                0
              )

              this._int_node_locked[a_id] = closest_comp_node_id

              if (closest_d_a < c_r) {
                if (closest_d_a > c_r - a_r - 3) {
                  a.r = c_r
                  a.x = c_x
                  a.y = c_y
                  a.fx = c_x
                  a.fy = c_y
                }
              } else {
                if (closest_d_a < c_r + a_r + 3) {
                  a.r = c_r
                  a.x = c_x
                  a.y = c_y
                  a.fx = c_x
                  a.fy = c_y
                }
              }
            } else {
              if (
                closest_d_a < c_r - PIN_RADIUS + 1 &&
                closest_d_b < SURFACE_UNPLUG_DISTANCE + c_r + PIN_RADIUS
              ) {
                this._set_exposed_pin_marker_to_node(
                  type,
                  b_id,
                  a_id,
                  closest_comp_node_id,
                  0
                )

                this._int_node_locked[a_id] = closest_comp_node_id

                if (closest_d_a < 1 + dr) {
                  a.r = c_r
                  a.x = c_x
                  a.y = c_y
                  a.fx = c_x
                  a.fy = c_y
                }
              } else {
                if (this._int_node_locked[a_id]) {
                  delete this._int_node_locked[a_id]

                  const u = unitVector(c_x, c_y, b_x, b_y)

                  const x = c_x + (c_r + 2) * u.x
                  const y = c_y + (c_r + 2) * u.y

                  a.r = PIN_RADIUS
                  a.x = x
                  a.y = y
                  a.fx = undefined
                  a.fy = undefined
                }
              }
            }
          }
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
      detail: { head },
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

    const link_marker_start = this._link_marker_start[link_id]
    const link_marker_end = this._link_marker_end[link_id]

    const nu = { x: -u.x, y: -u.y }

    const sl = Math.sign(l)

    let padding_source = sl * padding.source
    let padding_target = sl * padding.target

    if (link_marker_start) {
      link_marker_start.$element.style.opacity = '1'

      if (l < head) {
        link_marker_start.$element.style.transform = `scaleX(-1)`

        if (l < 0) {
          padding_source += sl * 3
        }
      } else {
        link_marker_start.$element.style.transform = 'scaleX(1)'
      }
    }

    if (link_marker_end) {
      link_marker_end.$element.style.opacity = '1'

      if (l < head) {
        link_marker_end.$element.style.transform = `scaleX(-1)`

        if (l < 0) {
          padding_target += sl * 3
        }
      } else {
        link_marker_end.$element.style.transform = 'scaleX(1)'
      }
    }

    // if (Math.abs(l) <= Math.abs(padding_source - padding_target)) {
    //   link_marker_start && (link_marker_start.$element.style.opacity = '0')
    //   link_marker_end && (link_marker_end.$element.style.opacity = '0')
    //   padding_source = 0
    //   padding_target = 0
    // } else {
    //   link_marker_start && (link_marker_start.$element.style.opacity = '1')
    //   link_marker_end && (link_marker_end.$element.style.opacity = '1')
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
    }
  }

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

    this._node_link_count[source_id]++
    this._node_link_count[target_id]++

    this._set_node_link_heap_count(source_id, this._node_link_count[source_id])
    this._set_node_link_heap_count(target_id, this._node_link_count[target_id])

    this._refresh_simulation_stability()

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
              // if (this._core_component_unlocked_count > 0) {
              //   const unlocked_component_id = getObjSingleKey(
              //     this._core_component_unlocked
              //   )
              //   if (node_id !== unlocked_component_id) {
              //     this._lock_sub_component(unlocked_component_id, true)
              //     this.deselect_node(unlocked_component_id)
              //     this._unlock_sub_component(node_id)
              //     this.select_node(node_id)
              //   }
              // }
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
          const { type, pinId, subPinId } = segmentExposedNodeId(node_id)
          if (mode === 'change') {
            this._set_exposed_pin_set_color(type, pinId, mode_color)
          } else {
            this._set_exposed_sub_pin_color(type, pinId, subPinId, mode_color)
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
      const { type, pinId, subPinId } = segmentExposedNodeId(node_id)
      // this._reset_exposed_pin_set_color(type, id)
      this._reset_exposed_sub_pin_color(type, pinId, subPinId)
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

  private _is_node_moded = (node_id: string): boolean => {
    if (
      this._is_node_hovered(node_id) ||
      this._is_node_dragged(node_id) ||
      this._is_node_selected(node_id) ||
      this._is_node_ascend(node_id)
    ) {
      return true
    } else {
      if (this._is_link_pin_node_id(node_id)) {
        const { unitId } = segmentLinkPinNodeId(node_id)

        if (this._is_node_moded(unitId)) {
          return true
        }
      } else if (this._is_datum_node_id(node_id)) {
        const datum_pin_node_id = this._datum_to_pin[node_id]

        if (datum_pin_node_id) {
          if (
            this._is_node_moded(datum_pin_node_id) &&
            this._mode === 'remove'
          ) {
            return true
          }
        }
      }

      return false
    }
  }

  private _refresh_node_color = (node_id: string): void => {
    // console.log('Graph', '_refresh_node_color', node_id)

    if (this._is_mode_colored()) {
      if (this._is_node_moded(node_id)) {
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
      this._for_each_unit_pin(unit_id, (pin_node_id: string, type: IO) => {
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
      })
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

  private _refresh_merge_pin_pin_color = (merge_node_id: string, type: IO) => {
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

  private _reset_merge_pin_pin_color = (merge_node_id: string, type: IO) => {
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
        if (!this._spec_is_link_pin_ignored(pin_node_id)) {
          this.__show_pin_info(pin_node_id)
        }
      })
    } else if (this._is_link_pin_node_id(node_id)) {
      if (!this._spec_is_link_pin_ignored(node_id)) {
        this._show_pin_info(node_id)
      }
    } else if (this._is_merge_node_id(node_id)) {
      this.__show_pin_info(node_id)

      const merge_to_pin = this._merge_to_pin[node_id]
      for (const pin_node_id in merge_to_pin) {
        this._show_pin_info(pin_node_id)
      }
    } else if (this._is_ext_node_id(node_id)) {
      this._show_ext_info(node_id)
    } else if (this._is_int_pin_node_id(node_id)) {
      const ext_node_id = getExtNodeIdFromIntNodeId(node_id)
      this._show_ext_info(ext_node_id)
    }
  }

  private _show_pin_info = (pin_node_id: string): void => {
    this.__show_pin_info(pin_node_id)

    const { unitId } = segmentLinkPinNodeId(pin_node_id)
    this._set_node_opacity(unitId, 1)
    this._for_each_unit_pin(unitId, (pin_node_id: string) => {
      if (!this._spec_is_link_pin_ignored(pin_node_id)) {
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

    node_comp.$element.style.opacity = `${opacity}`
  }

  private _set_link_opacity = (link_id: string, opacity: number): void => {
    const link_comp = this._link_comp[link_id]

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

  private _show_ext_info = (ext_node_id: string): void => {
    const { pinId, type, subPinId } = segmentExposedNodeId(ext_node_id)

    const int_node_id = getIntNodeId(type, pinId, subPinId)

    if (this._has_node(ext_node_id)) {
      this._set_node_opacity(ext_node_id, 1)
    }
    if (this._has_node(int_node_id)) {
      this._set_node_opacity(int_node_id, 1)
    }

    const source_id = type === 'output' ? int_node_id : ext_node_id
    const target_id = type === 'output' ? ext_node_id : int_node_id

    const link_id = getLinkId(source_id, target_id)

    this._set_link_opacity(link_id, 1)

    this._show_ext_pin_type(ext_node_id, int_node_id)
  }

  private _show_ext_pin_type = (ext_node_id: string, int_node_id: string) => {
    const type_tree = this._get_ext_pin_type(ext_node_id)

    const ext_node = this._get_node(ext_node_id)

    const position = addVector(ext_node, {
      x: 0,
      y: -1 * LINK_DISTANCE,
    })

    this._sim_add_node_type(ext_node_id, type_tree, position)
  }

  private _show_link_pin_name = (pin_node_id: string): void => {
    // console.log('Graph', '_show_link_pin_name', pin_node_id)

    const pin_name = this._pin_name[pin_node_id]

    pin_name.$element.style.display = 'block'
  }

  private _hide_link_pin_name = (pin_node_id: string): void => {
    // console.log('Graph', '_hide_link_pin_name', pin_node_id)

    const pin_name = this._pin_name[pin_node_id]

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
        if (!this._spec_is_link_pin_ignored(pin_node_id)) {
          this._refresh_node_info(pin_node_id)
        }
      })
    } else if (this._is_link_pin_node_id(node_id)) {
      this._hide_pin_info(node_id)
    } else if (this._is_merge_node_id(node_id)) {
      this._hide_pin_info(node_id)
    } else if (this._is_ext_node_id(node_id)) {
      this._hide_ext_info(node_id)
    } else if (this._is_int_pin_node_id(node_id)) {
      this._hide_int_info(node_id)
    }
  }

  private _hide_ext_info(ext_node_id: string): void {
    this._sim_remove_node_type(ext_node_id)
  }

  private _hide_int_info(int_node_id: string): void {
    const ext_node_id = getExtNodeIdFromIntNodeId(int_node_id)

    this._hide_ext_info(ext_node_id)
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

    link_base.$element.style.display = 'none'
    link_base_area.$element.style.display = 'none'
  }

  private _show_link = (link_id: string): void => {
    const link_base = this._link_base[link_id]
    const link_base_area = this._link_base_area[link_id]

    link_base.$element.style.display = 'block'
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
        // this._reset_datum_color(pin_datum_node_id)
        this._refresh_node_color(pin_datum_node_id)
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
    const { $theme } = this.$context

    if (this._search_unit_id === unit_id) {
      const color = getThemeModeColor($theme, this._mode, 'currentColor')
      this._set_core_and_layout_core_border_color(unit_id, color)
    } else if (this._err[unit_id]) {
      this._set_core_and_layout_core_border_color(unit_id, COLOR_OPAQUE_RED)
    } else if (this._unit_active_pin_count[unit_id] > 0) {
      this._set_core_border_color(unit_id, this._theme.data)
      this._set_layout_core_border_color(unit_id, this._theme.node)
    } else if (this._ref_unit_to_merge[unit_id]) {
      this._set_core_border_color(unit_id, this._theme.data)
      this._set_layout_core_border_color(unit_id, this._theme.node)
    } else {
      const spec = this._get_unit_spec(unit_id)

      const { inputs = {} } = spec

      let has_merged_ref_input: boolean = false

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
    this._set_err_color(err_node_id, COLOR_OPAQUE_RED)
  }

  private _set_drag_node = (node_id: string, dragged: boolean) => {
    // console.log('Graph', '_set_drag_node', node_id, dragged)

    const was_dragged = this._drag_node_id[node_id]
    if (was_dragged && !dragged) {
      this._drag_count--
      delete this._drag_node_id[node_id]

      if (this._is_ext_node_id(node_id)) {
        // if (this._drag_ext_node_id.has(node_id)) {
        this._drag_ext_node_id.delete(node_id)
        this._drag_ext_node_count--
        // }
      }
    } else if (!was_dragged && dragged) {
      this._drag_count++
      this._drag_node_id[node_id] = true

      if (this._is_ext_node_id(node_id)) {
        // if (!this._drag_ext_node_id.has(node_id)) {
        this._drag_ext_node_id.add(node_id)
        this._drag_ext_node_count++
        // }
      }
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

  private _scale_layout_core = (unit_id: string, k: number): void => {
    // console.log('Graph', '_resize_layout_core', width, height)

    const layout_node = this._layout_node[unit_id]

    layout_node.k = k

    const layout_core = this._layout_core[unit_id]

    layout_core.$element.style.transform = `translate(-50%, -50%) scale(${k})`
  }

  private _set_layout_core_opacity = (
    sub_component_id: string,
    opacity: number
  ): void => {
    // TODO
  }

  private _set_layout_core_font_size = (
    sub_component_id: string,
    font_size: number
  ) => {
    // TOOD
  }

  private __resize_layout_core = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    // console.log('Graph', '__resize_layout_core', width, height)

    this._set_layout_core_size(unit_id, width, height)

    this._resize_core_area(unit_id, width, height)

    this._resize_core_selection(unit_id, width, height)
  }

  private __resize_layout_core_width = (
    unit_id: string,
    width: number
  ): void => {
    // console.log('Graph', '__resize_layout_core_width', width, height)

    this._set_layout_core_size_width(unit_id, width)
    this._resize_core_area_width(unit_id, width)
    this._resize_core_selection_width(unit_id, width)
  }

  private __resize_layout_core_height = (unit_id: string, height: number) => {
    this._set_layout_core_size_height(unit_id, height)
    this._resize_core_area_height(unit_id, height)
    this._resize_core_selection_height(unit_id, height)
  }

  private _set_layout_core_size = (
    sub_component_id: string,
    width: number,
    height: number
  ): void => {
    const layout_core = this._layout_core[sub_component_id]

    this._set_layout_core_size_width(sub_component_id, width)
    this._set_layout_core_size_height(sub_component_id, height)

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

  private _set_layout_core_size_width = (
    sub_component_id: string,
    width: number
  ): void => {
    const layout_core = this._layout_core[sub_component_id]

    layout_core.$element.style.width = `${width}px`

    const layout_node = this._layout_node[sub_component_id]

    layout_node.width = width
  }

  private _set_layout_core_size_height = (
    sub_component_id: string,
    height: number
  ): void => {
    const layout_core = this._layout_core[sub_component_id]

    layout_core.$element.style.height = `${height}px`

    const layout_node = this._layout_node[sub_component_id]

    layout_node.height = height
  }

  private _resize_core = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    // console.log('Graph', '_resize_core', width, height)
    const core = this._core[unit_id]

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

  private _resize_core_selection_width = (
    unit_id: string,
    width: number
  ): void => {
    const selection_opt = this._selection_opt[unit_id]
    const selection = this._node_selection[unit_id]

    const { shape, strokeWidth = 1, paddingX = 6, paddingY = 6 } = selection_opt

    let _width = width + paddingX

    selection.setProp('width', _width)

    selection_opt.width = width
  }

  private _resize_core_selection_height = (
    unit_id: string,
    height: number
  ): void => {
    const selection_opt = this._selection_opt[unit_id]
    const selection = this._node_selection[unit_id]

    const { shape, strokeWidth = 1, paddingX = 6, paddingY = 6 } = selection_opt

    let _height = height + paddingY

    selection.setProp('height', _height)

    selection_opt.height = height
  }

  private _resize_core_area = (
    unit_id: string,
    width: number,
    height: number
  ) => {
    const core_area = this._core_area[unit_id]

    this._resize_core_area_width(unit_id, width)
    this._resize_core_area_height(unit_id, height)
  }

  private _resize_core_area_width = (unit_id: string, width: number) => {
    const core_area = this._core_area[unit_id]

    core_area.$element.style.width = `${width + NODE_PADDING + 2}px`
  }

  private _resize_core_area_height = (unit_id: string, height: number) => {
    const core_area = this._core_area[unit_id]

    core_area.$element.style.height = `${height + NODE_PADDING + 2}px`
  }

  private _layout_resize_sub_component = (
    unit_id: string,
    width: number,
    height: number
  ): void => {
    // console.log('Graph', '_layout_resize_component', unit_id, width, height)

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

    datum_container.$element.style.width = `${width}px`
    datum_container.$element.style.height = `${height}px`

    const datum_area = this._datum_area[datum_node_id]

    datum_area.$element.style.width = `${width + NODE_PADDING}px`
    datum_area.$element.style.height = `${height + NODE_PADDING}px`

    this._resize_selection(datum_node_id, width, height)
    this._start_graph_simulation(LAYER_DATA_LINKED)
  }

  private _get_node_selection_length = (
    node_id: string,
    paddingX: number,
    paddingY: number
  ): number => {
    const node = this._node[node_id]
    const { shape } = node
    const padding = paddingX + paddingY
    if (shape === 'circle') {
      const { r } = node
      return 2 * Math.PI * (r + padding / 4)
    } else {
      const { width, height } = node
      return 2 * (width + height + padding)
    }
  }

  private _get_node_selection_dashoffset = (
    node_id: string,
    paddingX: number,
    paddingY: number
  ): number => {
    const l = this._get_node_selection_length(node_id, paddingX, paddingY)
    const node = this._node[node_id]
    const { shape } = node
    if (shape === 'circle') {
      return -l / 16
    } else {
      const { width, height } = node
      // const k = (height + 2 * paddingX) / (width + 2 * paddingY)
      const k = width / height
      // return (l / 16) + (height - width) / 2
      // return (l / 16)
      return 0
    }
  }

  private _create_selection = (
    node_id: string,
    selection_opt: SelectionOpt
  ): Selection => {
    let {
      width,
      height,
      shape,
      stroke = '#00000000',
      strokeWidth = 1,
      strokeDasharray,
      paddingX = 6,
      paddingY = 6,
    } = selection_opt

    const strokeDashOffset = this._get_node_selection_dashoffset(
      node_id,
      paddingX,
      paddingY
    )
    strokeDasharray =
      strokeDasharray ||
      this._get_node_selection_dasharray(node_id, paddingX, paddingY)

    const selection = new Selection(
      {
        width: width + paddingX,
        height: height + paddingY,
        shape,
        stroke,
        strokeWidth,
        strokeDasharray,
        strokeDashOffset,
      },
      this.$system,
      this.$pod
    )

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
    const selection = this._node_selection[node_id]

    const { paddingX = 6, paddingY = 6 } = selection_opt

    let _width = width + paddingX
    let _height = height + paddingY

    selection.setProp('width', _width)
    selection.setProp('height', _height)

    selection_opt.width = width
    selection_opt.height = height

    this._refresh_selection_dasharray(node_id)
    this._refresh_selection_dashoffset(node_id)
  }

  private _resize_selection_width = (node_id: string, width: number): void => {
    const selection_opt = this._selection_opt[node_id]
    const selection = this._node_selection[node_id]

    const { shape, strokeWidth = 1, paddingX = 6, paddingY = 6 } = selection_opt

    let _width = width + paddingX

    selection.setProp('width', _width)

    selection_opt.width = width

    this._refresh_selection_dasharray(node_id)
    this._refresh_selection_dashoffset(node_id)
  }

  private _resize_selection_height = (
    node_id: string,
    height: number
  ): void => {
    const selection_opt = this._selection_opt[node_id]
    const selection = this._node_selection[node_id]

    const { paddingY = 6 } = selection_opt

    let _height = height + paddingY

    selection.setProp('height', _height)

    selection_opt.height = height

    this._refresh_selection_dasharray(node_id)
    this._refresh_selection_dashoffset(node_id)
  }

  private _create_overlay = ({
    className,
  }: { className?: string } = {}): Div => {
    const overlay_el = new Div(
      {
        className,
        style: {
          position: 'absolute',
          top: '0',
          width: 'calc(100% + 2px)',
          height: 'calc(100% + 2px)',
          zIndex: `${MAX_Z_INDEX - 1}`,
          transform: 'translate(-1px, -1px)',
        },
      },
      this.$system,
      this.$pod
    )
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

    const pin = new Div(
      {
        className,
        style: {
          position: 'absolute',
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: shape === 'circle' ? '50%' : '0',
          borderWidth: '1px',
          borderColor: COLOR_NONE,
          borderStyle: 'solid',
          backgroundColor: COLOR_NONE,
          boxSizing: 'border-box',
          ...style,
        },
      },
      this.$system,
      this.$pod
    )

    pin.preventDefault('mousedown')
    pin.preventDefault('touchdown')

    return pin
  }

  private _create_pin_name = ({
    className,
    name,
    r,
    dx = 0,
    dy = 0,
    style,
  }: {
    className: string
    r: number
    dx?: number
    dy?: number
    style: Dict<string>
    name: string
  }): TextInput => {
    const pin_name = new TextInput(
      {
        className,
        value: name,
        style: {
          position: 'absolute',
          borderWidth: '0px',
          borderStyle: 'solid',
          borderColor: COLOR_NONE,
          // backgroundColor: setAlpha(randomColorString(), 0.5),
          fontSize: `${PIN_NAME_FONT_SIZE}px`,
          textAlign: 'center',
          justifyContent: 'center',
          width: `${name.length * 6}px`,
          height: 'auto',
          left: `${r + dx}px`,
          top: `${2 * r + 2 + dy}px`,
          transform: 'translateX(-50%)',
          overflowY: 'hidden',
          overflowX: 'hidden',
          pointerEvents: 'none',
          touchAction: 'none',
          ...userSelect('none'),
          ...style,
        },
        tabIndex: -1,
        maxLength: PIN_NAME_MAX_SIZE,
      },
      this.$system,
      this.$pod
    )

    return pin_name
  }

  private _create_link = (link_id: string, link_opt: LinkProps) => {
    let {
      style,
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
    const link_defs = new SVGDefs({}, this.$system, this.$pod)
    link_defs.appendChild(link_start)
    link_defs.appendChild(link_end)

    const link_base_id = `${this._id}-link-base-${link_id}`
    const link_base = new SVGPath(
      {
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
      },
      this.$system,
      this.$pod
    )
    this._link_base[link_id] = link_base

    const link_base_area = new SVGPath(
      {
        id: link_base_id,
        className: 'link-base-area',
        style: {
          display: hidden ? 'none' : 'block',
          strokeWidth: `${6 + strokeWidth}`,
          stroke: COLOR_NONE,
        },
      },
      this.$system,
      this.$pod
    )
    this._link_base_area[link_id] = link_base_area

    this._link_text_value[link_id] = text

    const link_text_path = new SVGTextPath(
      {
        href: `#${link_base_id}`,
        startOffset: '50%',
        spacing: 'auto',
        lenghtAdjust: 'spacingAndGlyphs',
        textContent: text,
        style: {
          strokeWidth: '0px',
        },
      },
      this.$system,
      this.$pod
    )
    this._link_text_path[link_id] = link_text_path

    const link_text = new SVGText(
      {
        dy: 12,
        dx: 0,
        textAnchor: 'start',
        style: {
          display: textHidden ? 'none' : 'block',
          opacity: `${textOpacity}`,
          fill: this._theme.pin_text,
          fontSize: `${LINK_TEXT_FONT_SIZE}px`,
          ...userSelect('none'),
        },
      },
      this.$system,
      this.$pod
    )
    link_text.appendChild(link_text_path)
    this._link_text[link_id] = link_text

    const link = new SVGG(
      {
        className: 'link',
        style,
      },
      this.$system,
      this.$pod
    )

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
    const marker = new SVGMarker(
      {
        id,
        markerHeight: 30,
        markerWidth: 30,
        refX: 0 + x,
        refY: 1,
        orient: 'auto-start-reverse',
        style: {
          overflow: 'visible',
          transformOrigin: '0px 0px',
        },
      },
      this.$system,
      this.$pod
    )
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
    //   this._main.$element.opacity = `${(6 - k) / 3}`
    // } else if (k < 1) {
    //   this._main.$element.opacity = `${k - 0.5}`
    // } else {
    //   this._main.$element.opacity = '1'
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
    // }
    // for (const unit_id in this._core_name) {
    //   const core_name = this._core_name[unit_id]
    // }
  }

  private _on_low_zoom = (): void => {
    this._high_zoom = false
    // console.log('_on_low_zoom')
    // for (const pin_node_id in this._pin_name) {
    //   const pin_name = this._pin_name[pin_node_id]
    // }
    // for (const unit_id in this._core_name) {
    //   const core_name = this._core_name[unit_id]
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

  private _jiggle_world_screen_center = (): Position => {
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
    // console.log('Graph', '_set_node_position', node_id, position)
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

  private _negate_link_layer = (link_id: string) => {
    const link_layer = this._link_layer[link_id]

    this._set_link_layer(link_id, -link_layer)
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

  private __get_merge_node_position = (merge_id: string): Position => {
    const merge_node_id = getMergeNodeId(merge_id)
    return this._get_node_position(merge_node_id)
  }

  private _get_node_screen_position = (node_id: string): Position => {
    const node = this._get_node(node_id)

    const { x: _x, y: _y, width, height } = node

    const { x, y } = this._world_to_screen(_x - width / 2, _y - height / 2)

    return { x, y }
  }

  private _get_node_size = (node_id: string): Size => {
    const node = this._get_node(node_id)

    const { width, height } = node

    return { width, height }
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
    const { specs } = this.$system

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

    const is_component = isComponent(specs, id)

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

    const { specs } = this.$system

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
          input: search_option_valid_input_matches = { ref: [], data: [] },
          output: search_option_valid_output_matches = { ref: [], data: [] },
        } = this._search_option_valid_pin_matches[id]

        const search_option_valid_input_data_match =
          search_option_valid_input_matches.data[0] || []
        const search_option_valid_output_data_match =
          search_option_valid_output_matches.data[0] || []

        const search_option_valid_input_ref_match =
          search_option_valid_input_matches.ref[0] || []
        const search_option_valid_output_ref_match =
          search_option_valid_output_matches.ref[0] || []

        const search_option_valid_pin_match = {
          input: {
            data: search_option_valid_input_data_match,
            ref: search_option_valid_input_ref_match,
          },
          output: {
            data: search_option_valid_output_data_match,
            ref: search_option_valid_output_ref_match,
          },
        }

        const search_spec = this._get_unit_spec(search_unit_id)

        const { inputs: search_inputs = {}, outputs: search_outputs = {} } =
          search_spec

        const search_pin_bag = {
          input: clone(search_inputs),
          output: clone(search_outputs),
        }

        const search_exposed_input_ids =
          this._search_unit_exposed_pin_ids['input']
        const search_exposed_output_ids =
          this._search_unit_exposed_pin_ids['output']

        const search_exposed_input_data_ids = search_exposed_input_ids.data
        const search_exposed_input_ref_ids = search_exposed_input_ids.ref
        const search_exposed_output_data_ids = search_exposed_output_ids.data
        const search_exposed_output_ref_ids = search_exposed_output_ids.ref

        const exposed_pin_bag = {
          input: {
            data: search_exposed_input_data_ids,
            ref: search_exposed_input_ref_ids,
          },
          output: {
            data: search_exposed_output_data_ids,
            ref: search_exposed_output_ref_ids,
          },
        }

        const position = this._get_node_position(search_unit_id)

        let layout_position = position

        if (this._is_unit_component(search_unit_id)) {
          layout_position = this._layout_node[search_unit_id]
        }

        const search_pin_position = this._get_unit_pin_position(search_unit_id)

        const swap_spec = getSpec(specs, id)
        const { inputs: swap_inputs = {}, outputs: swap_outputs = {} } =
          swap_spec

        const filterObjRef = (obj: Dict<{ ref?: boolean }>, _ref: boolean) => {
          return filterObj(obj, ({ ref }) => !!ref === _ref)
        }

        const swap_data_inputs = filterObjRef(swap_inputs, false)
        const swap_ref_inputs = filterObjRef(swap_inputs, true)

        const swap_data_outputs = filterObjRef(swap_outputs, false)
        const swap_ref_outputs = filterObjRef(swap_outputs, true)

        const swap_input_data_ids = Object.keys(swap_data_inputs)
        const swap_input_ref_ids = Object.keys(swap_ref_inputs)

        const swap_output_data_ids = Object.keys(swap_data_outputs)
        const swap_output_ref_ids = Object.keys(swap_ref_outputs)

        const swap_pin_ids = {
          input: {
            data: swap_input_data_ids,
            ref: swap_input_ref_ids,
          },
          output: {
            data: swap_output_data_ids,
            ref: swap_output_ref_ids,
          },
        }

        const swap_pin_bag = {
          input: {
            data: clone(swap_data_inputs),
            ref: clone(swap_ref_inputs),
          },
          output: {
            data: clone(swap_data_outputs),
            ref: clone(swap_ref_outputs),
          },
        }

        console.log('swap_pin_bag', swap_pin_bag)

        const pin_position: UnitPinPosition = {
          input: {},
          output: {},
        }

        const swap_merges: GraphMergesSpec = {}

        this._search_unit_merges = swap_merges

        const set_merge_swap = (type: IO, ref: boolean): void => {
          const tag = ref ? 'ref' : 'data'

          const search_option_valid_type_match =
            search_option_valid_pin_match[type][tag]

          for (let i = 0; i < search_option_valid_type_match.length; i++) {
            const valid_pin_match = search_option_valid_type_match[i]

            const [a, b] = valid_pin_match

            const pin_id = this._search_unit_merged_pin_ids[type][tag][a]

            const swap_pin_id = swap_pin_ids[type][tag][b]

            pin_id_merge_swap[type][pin_id] = swap_pin_id
            pin_position[type][swap_pin_id] = search_pin_position[type][pin_id]

            this._search_unit_merged_pin_ids[type][tag][a] = swap_pin_id

            delete search_pin_bag[type][pin_id]
            delete swap_pin_bag[type][tag][swap_pin_id]
          }
        }

        set_merge_swap('input', false)
        set_merge_swap('input', true)
        set_merge_swap('output', false)
        set_merge_swap('output', true)

        const exposed_swap_pin_bag = clone(swap_pin_bag)

        function set_bag_swap(
          search_type: IO,
          swap_type: IO,
          tag: 'ref' | 'data'
        ) {
          for (const pin_id in search_pin_bag[search_type]) {
            const swap_pin_id = getObjSingleKey(swap_pin_bag[swap_type][tag])
            if (swap_pin_id) {
              pin_position[swap_type][swap_pin_id] =
                search_pin_position[search_type][pin_id]
              delete swap_pin_bag[swap_type][tag][swap_pin_id]
            } else {
              break
            }
          }
        }

        set_bag_swap('input', 'input', 'data')
        set_bag_swap('input', 'input', 'ref')
        set_bag_swap('output', 'output', 'data')
        set_bag_swap('output', 'output', 'ref')
        set_bag_swap('input', 'output', 'data')
        set_bag_swap('input', 'output', 'ref')
        set_bag_swap('output', 'input', 'data')
        set_bag_swap('output', 'input', 'ref')

        const replace_merges = (type: IO): void => {
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

        const replace_exposed = (type: IO, tag: 'ref' | 'data'): void => {
          const exposed_pins = this._search_unit_exposed_pin_ids[type][tag]

          for (const pin_id in exposed_pins) {
            const exposed_pin = exposed_pins[pin_id]

            const [pinId, subPinId] = exposed_pin

            const swap_pin_id = getObjSingleKey(exposed_swap_pin_bag[type][tag])

            delete exposed_swap_pin_bag[type][tag][swap_pin_id]

            const sub_pin_spec = {
              unitId: search_unit_id,
              pinId: swap_pin_id,
            }

            this._state_plug_exposed_pin(type, pinId, subPinId, sub_pin_spec)
          }
        }

        replace_exposed('input', 'data')
        replace_exposed('input', 'ref')
        replace_exposed('output', 'data')
        replace_exposed('output', 'ref')

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

              this.__spec_add_link_pin_to_merge(merge_id, unit_id, type, pin_id)
              this._sim_add_pin_to_merge(pin_node_id, merge_node_id)

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
    const { datum_id, datum_node_id } = this._add_data_unit(spec_id, position)

    this._search_unit_datum_id = datum_id
    this._search_unit_datum_node_id = datum_node_id
    this._search_unit_datum_spec_id = spec_id
  }

  private _add_data_unit = (
    spec_id: string,
    position: Position
  ): { datum_id; datum_node_id } => {
    const datum_id = this._new_datum_id()
    const datum_node_id = getDatumNodeId(datum_id)
    const value = `\${unit:{id:'${spec_id}'}}`

    this._add_datum(datum_id, value, position)

    return { datum_id, datum_node_id }
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
    const position = this._jiggle_world_screen_center()
    this._add_data_search_unit(id, position)
  }

  private _new_unit_id = (
    spec_id: string,
    blacklist: Set<string> = new Set()
  ): string => {
    const { specs } = this.$system

    return newUnitIdInSpec(specs, this._spec, spec_id, blacklist)
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

  private _new_sub_pin_id = (type: IO, pin_id: string): string => {
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
    id: string,
    position: Position,
    pin_position: UnitPinPosition = {
      input: {},
      output: {},
    },
    layout_position: Position
  ): void => {
    // console.log('Graph', '_add_search_unit')
    const { specs } = this.$system
    const { $theme } = this.$context

    this._search_unit_id = unit_id
    this._search_unit_spec_id = id

    // set ignored true if defaultIgnored is true

    const spec = getSpec(specs, id)
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
      id,
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

    const node_mode_colors =
      $theme === 'dark' ? DARK_MODE_COLOR : LIGHT_MODE_COLOR
    const link_mode_colors =
      $theme === 'dark' ? DARK_LINK_MODE_COLOR : LIGHT_LINK_MODE_COLOR
    const node_add = node_mode_colors['add']
    const link_add = link_mode_colors['add']
    const node_change = node_mode_colors['change']
    const link_change = link_mode_colors['change']

    const link_color = this._mode === 'add' ? link_add : link_change
    const node_color = this._mode === 'add' ? node_add : node_change

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

    this._for_each_unit_pin(unit_id, (pin_node_id: string, type: IO) => {
      if (!this._spec_is_link_pin_ignored(pin_node_id)) {
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
        const ext_node_id = getExtNodeId(type, pinId, subPinId)
        this._set_node_layer(ext_node_id, layer)
      }
    })
  }

  private _set_core_icon = (unit_id: string, icon: string): void => {
    const core_icon = this._core_icon[unit_id]
    core_icon.setProp('icon', icon)
  }

  private _show_core_icon = (unit_id: string): void => {
    const core_icon = this._core_icon[unit_id]

    core_icon.$element.style.display = 'block'
  }

  private _hide_core_icon = (unit_id: string): void => {
    const core_icon = this._core_icon[unit_id]

    core_icon.$element.style.display = 'none'
  }

  private _set_core_icon_color = (unit_id: string, fill: string): void => {
    const core_icon = this._core_icon[unit_id]

    core_icon.$element.style.stroke = fill
  }

  private _set_core_name_color = (unit_id: string, color: string): void => {
    const core_name = this._core_name[unit_id]

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
    if (!this._spec_is_link_pin_ignored(pin_node_id)) {
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

  private _set_datum_node_style = (
    datum_node_id: string,
    name: string,
    value: string
  ) => {
    const datum_container = this._datum_container[datum_node_id]

    datum_container.$element.style[name] = value
  }

  private _set_datum_link_style = (
    datum_link_id: string,
    name: string,
    value: string
  ) => {
    // console.log('_set_datum_link_style', link_id, color)

    const link_base = this._link_base[datum_link_id]

    link_base.$element.style[name] = value
  }

  private _set_datum_color = (
    datum_node_id: string,
    color: string,
    link_color: string
  ) => {
    // console.log('Graph', '_set_datum_color', color)

    this._set_datum_node_style(datum_node_id, 'color', color)

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

  private _set_datum_opacity = (datum_node_id: string, opacity: number) => {
    this._set_datum_node_opacity(datum_node_id, opacity)
    this._set_datum_link_opacity(datum_node_id, opacity)
  }

  private _set_datum_node_opacity = (
    datum_node_id: string,
    opacity: number
  ) => {
    this._set_datum_node_style(datum_node_id, 'opacity', `${opacity}`)
  }

  private _set_datum_link_opacity = (
    datum_node_id: string,
    opacity: number
  ) => {
    const datum_pin_node_id = this._datum_to_pin[datum_node_id]

    if (datum_pin_node_id) {
      const datum_link_id = getLinkId(datum_node_id, datum_pin_node_id)

      this._set_datum_link_style(datum_link_id, 'opacity', `${opacity}`)
    }
  }

  private _set_err_color = (err_node_id: string, color: string): void => {
    const { unitId } = segmentErrNodeId(err_node_id)

    const err_component = this._err_comp[unitId]

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

    core_name.$element.style.display = 'flex'
  }

  private _hide_core_name = (unit_id: string): void => {
    const core_name = this._core_name[unit_id]

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

          this._dispatch_add_unit_action(unit_id, unit)
        } else if (this._mode === 'change') {
          this._pod_remove_unit(unit_id)
          this._pod_add_unit(unit_id, unit)

          this._dispatch_add_unit_action(unit_id, unit)
        }

        for (const merge_id in this._search_unit_merges) {
          const merge_node_id = getMergeNodeId(merge_id)
          const merge = this._search_unit_merges[merge_id]
          const merge_pin_count = this._merge_pin_count[merge_id]
          if (merge_pin_count > 2) {
            // the merge alreary exists on the pod, but the
            // search unit's pin hasn't yet been added
            let type: IO
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
            this.__pod_add_pin_to_merge(merge_id, unit_id, type, pin_id)
          } else {
            this._pod_add_merge(merge_id, merge)
          }

          if (!this._is_merge_ref(merge_node_id)) {
            this._refresh_merge_pin_pin_color(merge_node_id, 'input')
            this._refresh_merge_pin_pin_color(merge_node_id, 'output')
          }
        }

        if (this._search_unit_ref_merge_id) {
          this._pod_add_merge(
            this._search_unit_ref_merge_id,
            this._search_unit_ref_merge!
          )
        }

        if (this._is_unit_component(unit_id)) {
          this._sim_add_unit_component(unit_id)
          this._pod_connect_sub_component(unit_id)

          const parent_id = this._get_sub_component_target_parent_id()
          if (parent_id) {
            this._mem_push_parent_root(parent_id, unit_id, 'default')
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
      const position = this._jiggle_world_screen_center()
      const layout_position = this._jiggle_world_screen_center()
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

  private _set_node_compatible = (node_id: string): void => {
    this._compatible_node_id[node_id] = true
    this._compatible_node_count++
  }

  private _set_node_not_compatible = (node_id: string): void => {
    if (this._compatible_node_id[node_id]) {
      delete this._compatible_node_id[node_id]
      this._compatible_node_count--
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
            this._set_node_compatible(unit_id)
            this._refresh_node_fixed(unit_id)
            this._refresh_node_selection(unit_id)
          }
        } else {
          this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
            if (this._is_pin_all_pin_match(pin_node_id, display_node_id)) {
              this._set_node_compatible(pin_node_id)
              this._refresh_node_fixed(pin_node_id)
              this._refresh_node_selection(pin_node_id)
            }
          })
        }
      } else if (all_data) {
        this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
          if (this._is_pin_all_datum_match(pin_node_id, display_node_id)) {
            this._set_node_compatible(pin_node_id)
            this._refresh_node_fixed(pin_node_id)
            this._refresh_node_selection(pin_node_id)
          }
        })
      }
    }
  }

  private _set_all_visible_output_pin_opacity = (opacity: number): void => {
    for (const pin_node_id of this._link_pin_output_set) {
      if (!this._spec_is_link_pin_ignored(pin_node_id)) {
        this._set_link_pin_opacity(pin_node_id, opacity)
      }
    }
  }

  private _set_all_ref_pin_opacity = (opacity: number): void => {
    for (const pin_node_id of this._link_pin_ref_set) {
      this._set_link_pin_opacity(pin_node_id, opacity)
    }
  }

  private _set_all_literal_datum_opacity = (opacity: number): void => {
    for (const datum_node_id in this._visible_data_node) {
      if (!this._is_datum_class_literal(datum_node_id)) {
        this._set_datum_opacity(datum_node_id, opacity)
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

  private _search_filter_true = () => true

  private _search_filter: (id: string) => boolean = this._search_filter_true

  private _on_search_list_hidden = (): void => {
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

    if (this._search_filter !== this._search_filter_true) {
      this._set_search_filter(this._search_filter_true)
    }

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

      if (prev_mode !== 'data' && this._mode === 'data') {
        this._set_all_visible_output_pin_opacity(0.5)
        this._set_all_ref_pin_opacity(0.5)
        this._set_all_literal_datum_opacity(0.5)
      } else if (prev_mode === 'data' && this._mode !== 'data') {
        this._set_all_visible_output_pin_opacity(1)
        this._set_all_ref_pin_opacity(1)
        this._set_all_literal_datum_opacity(1)
      }

      if (prev_mode !== 'add' && this._mode === 'add') {
        const units = this.get_units()

        for (const unit_id in units) {
          this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
            if (this._spec_is_link_pin_ignored(pin_node_id)) {
              this._set_link_pin_opacity(pin_node_id, 0.5)
              this._set_link_pin_pointer_events(pin_node_id, 'inherit')
            }
          })
        }

        this._start_graph_simulation(LAYER_NORMAL)
      } else if (prev_mode === 'add' && this._mode !== 'add') {
        const units = this.get_units()

        for (let unit_id in units) {
          this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
            if (this._spec_is_link_pin_ignored(pin_node_id)) {
              this._set_link_pin_opacity(pin_node_id, 0)
              this._set_link_pin_pointer_events(pin_node_id, 'none')
            }
          })
        }
      }

      if (prev_mode !== 'info' && this._mode === 'info') {
        // for (const unit_id in this._core_name) {
        //   this._enable_core_name(unit_id)
        // }

        // for (const unit_id in this._exposed_ext_node) {
        //   this._enable_plug_name(unit_id)
        // }

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
        for (const unit_id in this._core_name) {
          this._disable_core_name(unit_id)
        }

        for (const unit_id in this._exposed_ext_node) {
          this._disable_plug_name(unit_id)
        }

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

          const spec = this.$system.cache.dragAndDrop[pointerId]

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
                if (this._is_node_selected(pointer_node_id)) {
                  this._explode_unit(pointer_node_id)

                  this._cancel_long_click = true
                } else {
                  this._start_long_press_collapse(
                    pointer_id,
                    pointer_node_id,
                    this._long_press_screen_position
                  )
                }
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

        this._refresh_compatible()
      } else if (prev_mode === 'multiselect' && this._mode !== 'multiselect') {
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
            this._on_unit_blue_click(search_unit_id)
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

            const new_unit_id = this._new_unit_id(spec_id)

            this._remove_data_search_unit()

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
        this._leave_all_fullwindow(true, NOOP)
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
    // console.log('Graph', '_enter_default_fullwindow')

    if (this._selected_component_count > 0 && !this._tree_layout) {
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
    console.log('Graph', '_enter_all_selected_fullwindow')

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

  private _get_sub_component_frame_context = (
    sub_component_id: string
  ): Context => {
    const core_context = this._core_component_frame_context[sub_component_id]
    return core_context
  }

  private _get_sub_component_frame = (sub_component_id: string): Frame => {
    const core_frame = this._core_component_frame[sub_component_id]
    return core_frame
  }

  private _get_component_sub_component_root_base = (
    sub_component_id: string
  ): LayoutBase => {
    const base = this._get_sub_component_root_base(sub_component_id)

    const _base = base.map(([path, comp]) => [
      [sub_component_id, ...path],
      comp,
    ]) as LayoutBase

    return _base
  }

  private _get_sub_component_base = (sub_component_id: string): LayoutBase => {
    const sub_component = this._get_sub_component(sub_component_id)
    const sub_component_base = sub_component.getBase()
    return sub_component_base
  }

  private _get_sub_component_root_base = (
    sub_component_id: string
  ): LayoutBase => {
    const sub_component = this._get_sub_component(sub_component_id)
    const sub_component_root_base = sub_component.getRootBase()
    return sub_component_root_base
  }

  private _get_foreground = (): Div => {
    return this._foreground
  }

  private _leave_all_fullwindow = (animate: boolean, callback: () => void) => {
    // console.log('Graph', '_leave_all_fullwindow')
    this._leave_fullwindow(animate, callback)

    this._fullwindow_component_set = new Set()
    this._fullwindow_component_ids = []

    this._is_all_fullwindow = false
  }

  private _abort_fullwindow_animation: Unlisten

  private _cancel_fullwindow_animation = () => {
    if (this._abort_fullwindow_animation) {
      this._abort_fullwindow_animation()
      this._abort_fullwindow_animation = undefined
    }
  }

  private _leave_fullwindow = (_animate: boolean, callback: () => void) => {
    // console.log('Graph', '_leave_fullwindow')

    const { animate } = this.$props

    _animate = _animate ?? animate

    this._is_fullwindow = false

    if (!this._frame_out) {
      this._set_fullwindow_frame_off(_animate)
    }

    this._cancel_fullwindow_animation()

    if (this._in_component_control) {
      const sub_component_ids = this._fullwindow_component_ids

      if (_animate) {
        this._abort_fullwindow_animation = this._animate_leave_fullwindow(
          sub_component_ids,
          (sub_component_id) => {
            this._unplug_sub_component_root_base_frame(sub_component_id)

            this._commit_sub_component_base(sub_component_id)

            if (this._tree_layout) {
              const parent_id =
                this._get_sub_component_spec_parent_id(sub_component_id)
              if (parent_id) {
                this._append_sub_component_parent_root(
                  parent_id,
                  sub_component_id
                )
              } else {
                this._enter_sub_component_frame(sub_component_id)
              }
            } else {
              this._enter_sub_component_frame(sub_component_id)
            }
          },
          () => {
            if (this._is_component_framed) {
              this._leave_component_frame()
            }

            callback()
          }
        )
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

  private _unlisten_cabinet: Unlisten | undefined

  private _enable_cabinet = (): void => {
    if (this._cabinet) {
      if (!this._unlisten_cabinet) {
        // console.log('Graph', '_enable_cabinet')
        this._unlisten_cabinet = this._cabinet.addEventListeners([
          makeCustomListener(
            'draweractive',
            ({ drawerId }: { drawerId: string }) => {
              this._on_cabinet_drawer_active(drawerId)
            }
          ),
          makeCustomListener(
            'drawerinactive',
            ({ drawerId }: { drawerId: string }) => {
              this._on_cabinet_drawer_inactive(drawerId)
            }
          ),
        ])

        if (this._minimap_hidden === undefined) {
          this._minimap_hidden = !this._cabinet.isActive('minimap')
        } else {
          this._cabinet.setActive('minimap', !this._minimap_hidden)
        }

        if (this._pallete_hidden === undefined) {
          this._pallete_hidden = !this._cabinet.isActive('color')
        } else {
          this._cabinet.setActive('color', !this._pallete_hidden)
        }
      }
    }
  }

  private _on_cabinet_drawer_active = (drawer_id: string): void => {
    // console.log('Graph', '_on_cabinet_drawer_active', drawer_id)
    if (drawer_id === 'minimap') {
      this._minimap_hidden = false
    } else if (drawer_id === 'color') {
      this._pallete_hidden = false
    }
  }

  private _on_cabinet_drawer_inactive = (drawer_id: string): void => {
    // console.log('Graph', '_on_cabinet_drawer_inactive', drawer_id)
    if (drawer_id === 'minimap') {
      this._minimap_hidden = true
    } else if (drawer_id === 'color') {
      this._pallete_hidden = true
    }
  }

  private _disable_cabinet = (): void => {
    if (this._cabinet) {
      if (this._unlisten_cabinet) {
        // console.log('Graph', '_disable_cabinet')
        this._unlisten_cabinet()
        this._unlisten_cabinet = undefined
      }
    }
  }

  private _keyboard_unlisten: Unlisten | undefined

  private _is_shift_pressed = (): boolean => {
    const { $system } = this

    const { input: $input } = $system

    const { keyboard: $keyboard } = $input

    const shift_pressed = $keyboard.pressed.indexOf(16) > -1

    return shift_pressed
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
          // combo: ['Ctrl + /'],
          keydown: this._on_ctrl_semicolon_keydown,
          strict: false,
          // keyup: this._on_ctrl_p_keydown,
        },
        {
          // combo: 'p',
          combo: ';',
          // combo: '/',
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
          combo: ['Ctrl + o'],
          keydown: (key, { ctrlKey }) => {
            this._on_ctrl_o_keydown()
          },
        },
        {
          combo: ['Ctrl + l', 'l'],
          strict: true,
          keydown: this._on_ctrl_l_keydown,
        },
        {
          combo: ['Ctrl + m', 'm'],
          strict: true,
          keydown: this._on_ctrl_m_keydown,
        },
        {
          combo: ['p'],
          strict: true,
          keydown: this._on_ctrl_p_keydown,
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
          multiple: true,
          keydown: this._on_ctrl_z_keydown,
        },
        {
          combo: 'Ctrl + Shift + z',
          multiple: true,
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
  private _cabinet: Cabinet | null = null
  private _search: Search | null = null
  private _minimap: Minimap | null = null
  private _modes: Modes | null = null

  private _transcend: Transcend | null = null

  // private _frame: Frame | null = null
  private _frame: Component<HTMLElement> | null = null

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

      this._search.setProp('selectedColor', COLOR_GREEN)

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
      }

      if (this._is_fullwindow) {
        this._transcend.down(false)
      } else {
        this._transcend.up(false)
      }

      this._transcend.show(true)
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
    n0: LayoutNode,
    n1: () => LayoutNode,
    callback: () => void
  ) => {
    // console.log('Graph', '_animate_layout_core', sub_component_id)

    if (this._layout_core_abort_animation[sub_component_id]) {
      this._layout_core_abort_animation[sub_component_id]()
      delete this._layout_core_abort_animation[sub_component_id]
      this._layout_core_animation_count--
    }

    this._layout_core_animation_count++

    this._layout_core_abort_animation[sub_component_id] =
      this._animate_simulate_trait(
        n0,
        n1,
        (x0: number) => {
          this._set_layout_core_position_x(sub_component_id, x0)
        },
        (y0: number) => {
          this._set_layout_core_position_y(sub_component_id, y0)
        },
        (w0: number) => {
          this.__resize_layout_core_width(sub_component_id, w0)
        },
        (h0: number) => {
          this.__resize_layout_core_height(sub_component_id, h0)
        },
        (k0: number) => {
          this._scale_layout_core(sub_component_id, k0)
        },
        (opacity: number) => {
          this._set_layout_core_opacity(sub_component_id, opacity)
        },
        (font_size: number) => {
          this._set_layout_core_font_size(sub_component_id, font_size)
        },
        () => {
          delete this._layout_core_abort_animation[sub_component_id]

          this._layout_core_animation_count--

          if (this._layout_core_animation_count === 0) {
            this._on_all_layout_core_animation_end()
          }

          callback()

          return true
        }
      )
  }

  private _animate_leaf_frame = (
    leaf_id: string,
    n0: LayoutNode,
    n1: () => LayoutNode,
    callback: () => void
  ): Callback => {
    // console.log('Graph', '_animate_leaf_frame', leaf_id)

    const leaf_frame = this._leaf_frame[leaf_id]
    const leaf_node = this._leaf_frame_node[leaf_id]

    return this._animate_simulate_trait(
      n0,
      n1,
      (x) => {
        leaf_frame.$element.style.left = `${x}px`

        leaf_node.x = x
      },
      (y) => {
        leaf_frame.$element.style.top = `${y}px`

        leaf_node.y = y
      },
      (w) => {
        const { k } = leaf_node

        leaf_frame.$element.style.width = `${w + 2 * (k - 1)}px`

        leaf_node.width = w
      },
      (h) => {
        const { k } = leaf_node

        leaf_frame.$element.style.height = `${h + 2 * (k - 1)}px`

        leaf_node.height = h
      },
      (k) => {
        leaf_frame.$element.style.transform = `scale(${k})`

        leaf_node.k = k
      },
      (o) => {
        leaf_frame.$element.style.opacity = `${o}`

        leaf_node.opacity = o
      },
      (font_size) => {
        leaf_frame.$element.style.fontSize = `${font_size}px`

        leaf_node.fontSize = font_size
      },
      callback
    )
  }

  private _animate_simulate_tick = (
    n: Dict<number>,
    _n: Dict<number>,
    ff: [string, (value: number) => void][]
  ): boolean => {
    let ended = true

    for (const [prop, f] of ff) {
      const dp = _n[prop] - n[prop]

      if (Math.abs(dp) > ANIMATION_DELTA_TRESHOLD) {
        ended = false

        n[prop] += dp * ANIMATION_C
      }

      f(n[prop])
    }

    return ended
  }

  private _animate_simulate = (
    n0: Dict<number>,
    n1: () => Dict<number>,
    ff: [string, (v: number) => void][],
    callback: () => void
  ): Callback => {
    // console.log('Graph', '_animate_simulate')

    let n = n0

    let frame

    for (const [prop, f] of ff) {
      f(n[prop])
    }

    const tick = () => {
      const _n = n1()

      const ended = this._animate_simulate_tick(n, _n, ff)

      if (ended) {
        callback()
      } else {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame)
        frame = undefined
      }
    }
  }

  private _animate_simulate_trait = (
    n0: LayoutNode,
    n1: () => LayoutNode,
    set_x: (x: number) => void,
    set_y: (y: number) => void,
    set_width: (width: number) => void,
    set_height: (height: number) => void,
    set_k: (k: number) => void,
    set_opacity: (opacity: number) => void,
    set_font_size: (fontSize: number) => void,
    callback: () => void
  ): Callback => {
    // console.log('Graph', '_animate_simulate')

    return this._animate_simulate(
      n0,
      n1,
      [
        ['x', set_x],
        ['y', set_y],
        ['width', set_width],
        ['height', set_height],
        ['k', set_k],
        ['opacity', set_opacity],
        ['fontSize', set_font_size],
      ],
      callback
    )
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
      { x, y, width: w0, height: h0, k: k0, opacity: 1, fontSize: 1 },
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

  private _animate_layout_core_target = (
    sub_component_id: string,
    target_id: string,
    n0: LayoutNode,
    callback: () => void
  ): void => {
    this._animate_layout_core(
      sub_component_id,
      n0,
      () => {
        if (target_id === sub_component_id) {
          const anchor_node = this._layout_target_node[target_id]
          return anchor_node
        } else {
          const anchor_node = this._layout_node[target_id]
          return anchor_node
        }
      },
      callback
    )
  }

  private _animate_layout_core_anchor = (
    sub_component_id: string,
    n0: LayoutNode,
    callback: () => void
  ): void => {
    const anchor_id = this._get_layout_node_anchor_id(sub_component_id)

    return this._animate_layout_core_target(
      sub_component_id,
      anchor_id,
      n0,
      callback
    )
  }

  private _enter_tree_layout = (): void => {
    // console.log('Graph', '_enter_tree_layout')

    const { animate } = this.$props

    this._pointer_up_all_pressed_pointer_id()

    this._tree_layout = true

    this._zoom_comp._root.$element.style.opacity = '0.25'

    this._layout_comp.$element.style.pointerEvents = 'inherit'

    this._layout_root.children.$element.style.opacity = '1'

    this._refresh_all_layout_layer_opacity()

    const current_layout_layer = this._get_current_layout_layer()

    current_layout_layer.children.$element.style.opacity = '1'

    current_layout_layer.layer.$element.style.overflowX = 'auto'
    current_layout_layer.layer.$element.style.overflowY = 'auto'

    current_layout_layer.children.$element.style.overflowX = 'initial'
    current_layout_layer.children.$element.style.overflowY = 'initial'

    for (const layer_id of this._layout_path) {
      const layer_layer = this._layout_layer[layer_id]

      layer_layer.children.$element.style.overflowX = 'hidden'
      layer_layer.children.$element.style.overflowY = 'hidden'

      layer_layer.layer.$element.style.overflowX = 'hidden'
      layer_layer.layer.$element.style.overflowY = 'hidden'
    }

    this._refresh_all_layout_node_target_position()

    this._force_all_layout_node_traits()

    for (const sub_component_id in this._component.$subComponent) {
      const { width, height } =
        this._get_unit_component_layout_size(sub_component_id)

      // PERF
      this._layout_resize_sub_component(sub_component_id, width, height)
    }

    if (animate) {
      this._animate_enter_tree_layout()
    } else {
      // TODO
    }

    for (const sub_component_id in this._component.$subComponent) {
      const layout_core = this._layout_core[sub_component_id]

      this._listen_layout_core(sub_component_id, layout_core)
      this._move_core_content_graph_to_layout(sub_component_id)
      this._refresh_component_children_counter(sub_component_id)
    }

    this._set_minimap_to_layout()
  }

  private _refresh_all_layout_node_target_position = () => {
    this._refresh_layout_node_target_position(null)
    for (const layer of this._layout_path) {
      this._refresh_layout_node_target_position(layer)
    }
  }

  private _plug_leaf_frame = (
    leaf_id: string,
    leaf_comp: Component,
    leaf_node: LayoutNode,
    layer: Component
  ): Frame => {
    // console.log('Graph', '_plug_leaf_frame', leaf_id)

    const { x, y, width, height, k, fontSize } = leaf_node

    const style = {
      display: 'block',
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
      transform: `scale(${k})`,
      // border: `1px solid ${randomColorString()}`,
      // border: `1px solid ${COLOR_NONE}`,
      // boxSizing: 'border-box',
      // zIndex: '1001',
      fontSize: `${fontSize}px`,
    }

    let sub_between_frame: Frame = this._leaf_frame[leaf_id]

    if (sub_between_frame) {
      mergePropStyle(sub_between_frame, style)
    } else {
      sub_between_frame = new Frame(
        {
          style,
        },
        this.$system,
        this.$pod
      )

      this._leaf_frame[leaf_id] = sub_between_frame
    }

    if (!this._leaf_frame_active[leaf_id]) {
      sub_between_frame.appendChild(leaf_comp)

      layer.appendChild(sub_between_frame)

      this._leaf_frame_active[leaf_id] = true
      this._leaf_frame_layer[leaf_id] = layer
    }

    return sub_between_frame
  }

  private _unplug_leaf_frame = (leaf_id: string, leaf_comp: Component) => {
    // console.log('Graph', '_unplug_leaf_frame', leaf_id)

    if (this._leaf_frame_active[leaf_id]) {
      const leaf_layer = this._leaf_frame_layer[leaf_id]

      const sub_between_container = this._leaf_frame[leaf_id]

      sub_between_container.removeChild(leaf_comp)

      leaf_layer.removeChild(sub_between_container)

      delete this._leaf_frame_active[leaf_id]
      delete this._leaf_frame_layer[leaf_id]
    }
  }

  private _get_sub_component_leaf_layer = (sub_component_id: string): Div => {
    const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)

    return this._get_sub_component_parent_leaf_layer(parent_id)
  }

  private _get_sub_component_parent_leaf_layer = (parent_id: string): Div => {
    const is_parent_uncollapsed =
      !parent_id || this._layout_path.includes(parent_id)

    const parent_layer = this._get_layout_layer(parent_id)
    const parent_parent_layer = this._get_spec_parent_layout_layer(parent_id)

    const { foreground: parent_foreground } = parent_layer
    const { foreground: parent_parent_foreground } = parent_parent_layer

    const leaf_layer = is_parent_uncollapsed
      ? parent_foreground
      : parent_parent_foreground

    return leaf_layer
  }

  private _measure_sub_component_base = (sub_component_id: string): void => {
    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    const base = this._get_sub_component_base(sub_component_id)

    for (const leaf of base) {
      const [leaf_path, leaf_comp] = leaf

      const leaf_id = getLeafId([sub_component_id, ...leaf_path])

      const leaf_node = extractTrait(leaf_comp, measureText)

      this._leaf_frame_node[leaf_id] = leaf_node
    }
  }

  private _remove_sub_component_root_base = (
    sub_component_id: string
  ): void => {
    // console.log('Graph', '_remove_sub_component_root_base', sub_component_id)

    const sub_component = this._get_sub_component(sub_component_id)
    const base = this._get_sub_component_root_base(sub_component_id)

    this._remove_base(sub_component, base)
  }

  private _remove_sub_component_base = (sub_component_id: string): void => {
    // console.log('Graph', '_remove_sub_component_base', sub_component_id)

    const sub_component = this._get_sub_component(sub_component_id)
    const base = this._get_sub_component_base(sub_component_id)

    this._remove_base(sub_component, base)
  }

  private _remove_base = (sub_component: Component, base: LayoutBase) => {
    for (const leaf of base) {
      const [leaf_path, leaf_comp] = leaf

      const leaf_parent_last = leaf_path[leaf_path.length - 1]
      const leaf_parent_path = leaf_path.slice(0, -1)
      const leaf_parent = sub_component.pathGetSubComponent(leaf_parent_path)

      if (leaf_parent === leaf_comp) {
        //
      } else {
        const parent_id = leaf_parent.getSubComponentParentId(leaf_parent_last)
        if (parent_id) {
          const parent = leaf_parent.getSubComponent(parent_id)
          if (parent.$mountParentRoot.includes(leaf_comp)) {
            parent.removeParentRoot(leaf_comp)
          }
        } else {
          if (leaf_parent.$mountRoot.includes(leaf_comp)) {
            leaf_parent.removeRoot(leaf_comp)
          }
        }
      }
    }
  }

  private _animate_sub_component_base = (
    sub_component_id: string,
    leaf_base: LayoutBase,
    leaf_traits: LayoutNode[],
    leaf_layer: Div,
    n1: (
      leaf_id: string,
      leaf_path: string[],
      leaf_comp: Component
    ) => LayoutNode,
    callback: () => void
  ): Unlisten => {
    const base_length = leaf_base.length

    let leaf_end_count = 0

    let i = 0

    const all_unlisten = []

    this._animating_sub_component_base_id.add(sub_component_id)

    for (const leaf of leaf_base) {
      const [leaf_path, leaf_comp] = leaf

      const leaf_id = getLeafId([sub_component_id, ...leaf_path])

      const leaf_node = leaf_traits[i] || this._leaf_frame_node[leaf_id]

      this._plug_leaf_frame(leaf_id, leaf_comp, leaf_node, leaf_layer)

      all_unlisten.push(
        this._animate_leaf_frame(
          leaf_id,
          leaf_node,
          () => {
            return n1(leaf_id, leaf_path, leaf_comp)
          },
          () => {
            leaf_end_count++

            if (leaf_end_count === base_length) {
              this._animating_sub_component_base_id.delete(sub_component_id)

              callback()
            }
          }
        )
      )

      i++
    }

    return callAll(all_unlisten)
  }

  private _abort_tree_layout_sub_component_base_animation: Dict<Callback> = {}

  private _cancel_tree_layout_animation = (): void => {
    // console.log('Graph', '_cancel_tree_layout_animation')

    for (const sub_component_id in this
      ._abort_tree_layout_sub_component_base_animation) {
      this._abort_tree_layout_animation(sub_component_id)
    }
  }

  private _abort_tree_layout_animation = (sub_component_id: string): void => {
    const abort =
      this._abort_tree_layout_sub_component_base_animation[sub_component_id]

    if (!abort) {
      return
    }

    // console.log('Graph', '_abort_tree_layout_animation', sub_component_id)

    abort()

    delete this._abort_tree_layout_sub_component_base_animation[
      sub_component_id
    ]
  }

  private _get_sub_compononent_layout_layer_opacity = (
    sub_component_id: string
  ): number => {
    const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)

    const l = this._layout_path.length

    if (l === 0) {
      if (parent_id) {
        return 0
      } else {
        return 1
      }
    } else {
      if (parent_id) {
        const i = this._layout_path.indexOf(sub_component_id)
        if (i > -1) {
          if (i === this._layout_path.length - 1) {
            return 1
          } else {
            return 0.25 / (l - i)
          }
        } else {
          const pi = this._layout_path.indexOf(parent_id)

          if (pi > -1) {
            if (pi === this._layout_path.length - 1) {
              return 1
            } else {
              return 0.25 / (l - pi)
            }
          } else {
            return 0
          }
        }
      } else {
        return 0.25 / l
      }
    }

    return 1
  }

  private _reflect_sub_component_base_trait = (
    sub_component_id: string,
    base: LayoutBase,
    style: Style,
    trait: LayoutNode
  ): Dict<LayoutNode> => {
    const sub_component = this._get_sub_component(sub_component_id)

    return this.__reflect_sub_component_base_trait(
      sub_component_id,
      sub_component,
      base,
      style,
      trait
    )
  }

  private __reflect_sub_component_base_trait = (
    sub_component_id: string,
    component: Component,
    base: LayoutBase,
    style: Style,
    trait: LayoutNode
  ): Dict<LayoutNode> => {
    const {
      api: {
        text: { measureText },
      },
    } = this.$system
    const base_trait = reflectComponentBaseTrait(
      component,
      base,
      style,
      trait,
      measureText
    )

    const _base_trait = mapObjKeyKV(
      base_trait,
      (key) => `${sub_component_id}${key ? `/${key}` : ''}`
    )

    return _base_trait
  }

  private _animate_enter_tree_layout = (): void => {
    // console.log('Graph', '_animate_enter_tree_layout')
    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    this._cancel_tree_layout_animation()

    for (const sub_component_id in this._component.$subComponent) {
      const sub_component = this._get_sub_component(sub_component_id)
      const visible = this._is_layout_component_layer_visible(sub_component_id)

      const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)
      const parent_visible = !parent_id || this._layout_path.includes(parent_id)

      const children = this._get_sub_component_spec_children(sub_component_id)

      const leaf_layer = this._get_sub_component_leaf_layer(sub_component_id)
      const leaf_trait = []
      const leaf_layer_opacity =
        this._get_sub_compononent_layout_layer_opacity(sub_component_id)

      if (!visible && children.length > 0) {
        if (!this._animating_sub_component_base_id.has(sub_component_id)) {
          for (const child_id of children) {
            this._measure_sub_component_base(child_id)
          }
        }

        for (const child_id of children) {
          if (!this._animating_sub_component_base_id.has(child_id)) {
            this._leave_sub_component_frame(child_id)
            this._remove_sub_component_root_base(child_id)
          }
        }

        this._animate_layout_append_children(
          sub_component_id,
          children,
          'default',
          () => {
            for (const child_id of children) {
              this._insert_sub_component_child(sub_component_id, child_id)
            }

            this._layout_sub_components_commit_base(children)
          }
        )
      }

      if (parent_visible) {
        this._measure_sub_component_base(sub_component_id)

        const frame = this._get_sub_component_frame(sub_component_id)
        const base = this._get_sub_component_root_base(sub_component_id)

        const layout_node = this._layout_node[sub_component_id]

        const style = extractStyle(frame, measureText)
        const trait: LayoutNode = {
          x: 0,
          y: 0,
          width: layout_node.width,
          height: layout_node.height,
          fontSize: 14,
          k: 1,
          opacity: 1,
        }

        const all_leaf_trait = this._reflect_sub_component_base_trait(
          sub_component_id,
          base,
          style,
          trait
        )

        if (!this._animating_sub_component_base_id.has(sub_component_id)) {
          this._leave_sub_component_frame(sub_component_id)
          this._decompose_sub_component(sub_component_id)
          this._remove_sub_component_root_base(sub_component_id)
        }

        this._abort_tree_layout_sub_component_base_animation[sub_component_id] =
          this._animate_sub_component_base(
            sub_component_id,
            base,
            leaf_trait,
            leaf_layer,
            (leaf_id: string) => {
              const { $width, $height } = this.$context

              const { x, y, width, height } =
                this._layout_node[sub_component_id]

              const leaf_trait = all_leaf_trait[leaf_id]

              const parent_layout_layer =
                this._get_spec_parent_layout_layer(sub_component_id)

              const { scrollTop = 0 } = parent_layout_layer.layer.$element

              return {
                x: x + $width / 2 - width / 2 + leaf_trait.x,
                y: y + $height / 2 - height / 2 - scrollTop + leaf_trait.y,
                width: leaf_trait.width,
                height: leaf_trait.height,
                k: 1,
                opacity: leaf_layer_opacity,
                fontSize: leaf_trait.fontSize,
              }
            },
            () => {
              this._unplug_sub_component_root_base_frame(sub_component_id)

              this._enter_sub_component_frame(sub_component_id)
              this._compose_sub_component(sub_component_id)
              this._commit_sub_component_base(sub_component_id)
            }
          )
      }
    }
  }

  private _animate_leave_tree_layout = (): void => {
    // console.log('Graph', '_animate_leave_tree_layout')

    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    this._cancel_tree_layout_animation()

    for (const sub_component_id in this._component.$subComponent) {
      const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)
      const children = this._get_sub_component_spec_children(sub_component_id)
      const leaf_layer = this._get_sub_component_leaf_layer(sub_component_id)
      const leaf_traits = []

      if (
        !this._layout_path.includes(sub_component_id) &&
        children.length > 0
      ) {
        if (!this._animating_sub_component_base_id.has(sub_component_id)) {
          for (const child_id of children) {
            this._measure_sub_component_base(child_id)
          }
        }

        for (const child_id of children) {
          if (!this._animating_sub_component_base_id.has(child_id)) {
            this._remove_sub_component_parent_root(sub_component_id, child_id)
            this._remove_sub_component_root_base(child_id)
          }
        }

        this._animate_layout_sub_component_remove_children(
          sub_component_id,
          'default', // RETURN
          children,
          () => {
            for (const child_id of children) {
              this._enter_sub_component_frame(child_id)
              this._commit_sub_component_base(child_id)
            }
          }
        )
      }

      if (!parent_id || this._layout_path.includes(parent_id)) {
        this._measure_sub_component_base(sub_component_id)

        const leaf_base = this._get_sub_component_base(sub_component_id)
        const frame = this._get_sub_component_frame(sub_component_id)

        const graph_node = this._node[sub_component_id]

        const { k } = this._zoom

        const trait: LayoutNode = {
          x: 0,
          y: 0,
          width: graph_node.width,
          height: graph_node.height,
          k,
          opacity: 1,
          fontSize: 14,
        }

        const frame_style = extractStyle(frame, measureText)

        const all_leaf_trait = this._reflect_sub_component_base_trait(
          sub_component_id,
          leaf_base,
          frame_style,
          trait
        )

        if (!this._animating_sub_component_base_id.has(sub_component_id)) {
          this._leave_sub_component_frame(sub_component_id)
          this._decompose_sub_component(sub_component_id)
          this._remove_sub_component_root_base(sub_component_id)
        }

        this._abort_tree_layout_sub_component_base_animation[sub_component_id] =
          this._animate_sub_component_base(
            sub_component_id,
            leaf_base,
            leaf_traits,
            leaf_layer,
            (leaf_id: string) => {
              const { x, y } = this._get_node_screen_position(sub_component_id)
              const { width, height } = this._get_node_size(sub_component_id)
              const { k } = this._zoom

              const leaf_trait = all_leaf_trait[leaf_id]

              const _x = x + ((k - 1) * width) / 2
              const _y = y + ((k - 1) * height) / 2

              return {
                x: _x + leaf_trait.x,
                y: _y + leaf_trait.y,
                width: leaf_trait.width,
                height: leaf_trait.height,
                k,
                opacity: 1,
                fontSize: leaf_trait.fontSize,
              }
            },
            () => {
              this._unplug_sub_component_root_base_frame(sub_component_id)

              this._enter_sub_component_frame(sub_component_id)
              this._compose_sub_component(sub_component_id)
              this._commit_sub_component_base(sub_component_id)
            }
          )
      }
    }
  }

  private _listen_layout_core = (
    unit_id: string,
    component: Component
  ): void => {
    const unlisten = this._listen_node(unit_id, component)
    this._core_layout_core_unlisten[unit_id] = unlisten
  }

  private _unlisten_component = (unit_id: string): void => {
    const unlisten = this._core_layout_core_unlisten[unit_id]
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
        onLongClick: (event: IOPointerEvent) => {
          this._on_link_long_click(link_id, event)
        },
        onLongPress: (event: IOPointerEvent) => {
          this._on_link_long_press(link_id, event)
        },
      }),
    ])
  }

  private _animate_layout_core_down = (
    sub_component_id: string,
    callback: () => void
  ): void => {
    const layout_node = this._layout_node[sub_component_id]

    this._animate_layout_core(
      sub_component_id,
      layout_node,
      () => {
        const { x, y } = this._get_layout_node_screen_position(sub_component_id)

        const { width, height } = this._get_node_size(sub_component_id)

        const { k } = this._zoom

        return { x, y, width, height, k, opacity: 1, fontSize: 1 }
      },
      callback
    )
  }

  private _get_layout_node_screen_position = (
    sub_component_id: string
  ): Position => {
    const { $width, $height } = this.$context

    const graph_node = this._node[sub_component_id]

    const { x: _x, y: _y, width: _width, height: _height } = graph_node

    const position = this._world_to_screen(_x, _y)

    const { x: __x, y: __y } = position

    const parent_layout_layer =
      this._get_spec_parent_layout_layer(sub_component_id)

    const { scrollTop = 0 } = parent_layout_layer.layer.$element

    const x = __x - $width / 2
    const y = __y - $height / 2 + scrollTop

    return { x, y }
  }

  private _leave_tree_layout = (): void => {
    // console.log('Graph', '_leave_tree_layout')

    const { animate } = this.$props

    this._pointer_up_all_pressed_pointer_id()

    this._tree_layout = false

    this._zoom_comp._root.$element.style.opacity = '1'

    this._layout_comp.$element.style.pointerEvents = 'none'

    this._layout_root.children.$element.style.opacity = '0'

    this._layout_root.layer.$element.style.overflowX = 'hidden'
    this._layout_root.layer.$element.style.overflowY = 'hidden'

    for (const layer_id of this._layout_path) {
      const layer_layer = this._layout_layer[layer_id]

      layer_layer.children.$element.style.opacity = '0'

      layer_layer.layer.$element.style.overflowX = 'hidden'
      layer_layer.layer.$element.style.overflowY = 'hidden'

      layer_layer.children.$element.style.overflowX = 'hidden'
      layer_layer.children.$element.style.overflowY = 'hidden'
    }

    if (animate) {
      this._animate_leave_tree_layout()
    } else {
      // TODO
      // const children = this._get_component_spec_children()
      // for (const sub_component_id of children) {
      //   this._layout_uncollapse_sub_component(sub_component_id)
      // }
    }

    for (const sub_component_id in this._component.$subComponent) {
      this._refresh_component_children_counter(sub_component_id)

      this._unlisten_component(sub_component_id)

      this._move_core_content_layout_to_graph(sub_component_id)

      const { width, height } =
        this._get_unit_component_graph_size(sub_component_id)

      this._resize_core_area(sub_component_id, width, height)
      this._resize_core_selection(sub_component_id, width, height)
    }

    this._set_minimap_to_graph()
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
      // RETURN
      // this._minimap.setProp('nodes', this._layout_node)
      // this._minimap.setProp('links', {})
      // this._minimap.tick()
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
    // const { $theme } = this.$context

    this._refresh_color()

    // for (let component_id in this._core_component_frame) {
    //   const frame = this._core_component_frame[component_id]
    //   frame.setProp('theme', $theme)
    // }
  }

  private _on_context_color_changed = (): void => {
    // const { $color } = this.$context

    this._refresh_color()

    // const color = this._get_color()

    // for (let component_id in this._core_component_context) {
    //   const frame = this._core_component_frame[component_id]
    //   frame.setProp('color', color)
    // }
  }

  private _on_context_before_enter_fullwindow = (): void => {
    console.log('Graph', '_on_context_before_enter_fullwindow')
  }

  private _on_focus = () => {
    // console.log('Graph', '_on_focus')

    if (this._subgraph_graph) {
      this._subgraph_graph.focus()
    } else if (this._core_component_unlocked_count > 0) {
      const unlocked_component_id = getObjSingleKey(
        this._core_component_unlocked
      )
      const unlocked_sub_component = this._get_sub_component(
        unlocked_component_id
      )
      unlocked_sub_component.focus({ preventScroll: true })
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
      this._input_disabled = true

      this._disable_keyboard()
      this._disable_enter()
      this._disable_escape()

      this._disable_crud()
      this._disable_cabinet()
      this._disable_search()
      this._disable_minimap()

      this._hide_control(true)
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
      this._enable_cabinet()
      this._enable_search()
      this._enable_minimap()

      this._show_control(true)
    }
  }

  private _on_node_pointer_enter = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_pointer_enter', node_id)
    const { pointerId } = event

    this.__on_node_pointer_enter(node_id, pointerId)
  }

  private __on_node_pointer_enter = (node_id: string, pointerId: number) => {
    // console.log('Graph', '__on_node_pointer_enter', node_id, pointerId)
    if (!this._pointer_id_hover_node_id[pointerId]) {
      if (
        !this._pointer_id_pressed_node_id[pointerId] ||
        this._pointer_id_pressed_node_id[pointerId] === node_id
      ) {
        this._set_node_hovered(node_id, pointerId, true)
      }
    }
  }

  private _on_node_pointer_leave = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_node_pointer_leave', node_id)
    const { pointerId } = event

    this.__on_node_pointer_leave(node_id, pointerId)
  }

  private __on_node_pointer_leave = (
    node_id: string,
    pointer_id: number
  ): void => {
    // console.log('Graph', '__on_node_pointer_leave', node_id, pointer_id)
    if (this._pointer_id_hover_node_id[pointer_id]) {
      this._set_node_hovered(node_id, pointer_id, false)
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

    const { pointerId, clientX, clientY } = event

    this.__on_node_pointer_down(node_id, pointerId, clientX, clientY)
  }

  private __on_node_pointer_down = (
    node_id: string,
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    // console.log('Graph', '_on_node_pointer_down', node_id)

    if (this._resize_node_id_pointer_id[node_id] !== undefined) {
      return
    }

    if (this._edit_node_name_id === node_id) {
      return
    }

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

    this.__on_node_pointer_up(node_id, pointerId)
  }

  private __on_node_pointer_up = (node_id: string, pointerId: number): void => {
    // console.log('Graph', '_on_node_pointer_up', node_id, pointerId)
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

    this._start_drag_node_static(node_id)
  }

  private _start_static = (): void => {
    if (this._static) {
      return
    }

    // console.log('Graph', '_start_static')

    this._static = true

    for (const node_id in this._unit_node) {
      if (this._drag_node_id[node_id]) {
        continue
      }

      if (
        this._long_press_collapsing &&
        (this._is_node_selected(node_id) ||
          this._long_press_collapse_unit_id === node_id)
      ) {
        continue
      }

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

  private _stop_node_static = (node_id: string): void => {
    // console.log('Graph', '_stop_node_static', node_id)

    delete this._static_position[node_id]
    delete this._static_count[node_id]
  }

  private _stop_static = (): void => {
    if (!this._static) {
      return
    }

    // console.log('Graph', '_stop_static')

    this._static = false

    for (const node_id in this._unit_node) {
      if (this._drag_node_id[node_id]) {
        continue
      }

      // if (
      //   this._long_press_collapsing &&
      //   (this._is_node_selected(node_id) ||
      //     this._long_press_collapse_unit_id === node_id)
      // ) {
      //   continue
      // }

      this._stop_node_static(node_id)
    }
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

    this._stop_drag_node_static(node_id)

    if (this._is_draggable_mode()) {
      this._drop_node(node_id)
    }
  }

  private _start_drag_node_static = (node_id: string): void => {
    // console.log('Graph', '_start_drag_node_static', node_id)

    const subgraph_id = this._node_to_subgraph[node_id]
    this._static_subgraph_anchor[subgraph_id] =
      this._static_subgraph_anchor[subgraph_id] || {}
    this._static_subgraph_anchor_count[subgraph_id] =
      this._static_subgraph_anchor_count[subgraph_id] || 0

    if (!this._static_subgraph_anchor[subgraph_id][node_id]) {
      const subgraph = this._subgraph_to_node[subgraph_id]

      this._static_subgraph_anchor[subgraph_id][node_id]
      this._static_subgraph_anchor_count[subgraph_id]++

      for (const n_id of subgraph) {
        if (this._is_unit_node_id(n_id)) {
          this._static_count[n_id] = this._static_count[n_id] || 0
          this._static_count[n_id]++
        }
      }
    }
  }

  private _stop_drag_node_static = (node_id: string): void => {
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

  private _node_node_center_distance = (a_id: string, b_id: string): number => {
    const a_node = this._node[a_id]
    const b_node = this._node[b_id]
    const d = pointDistance(a_node, b_node)
    return d
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

  private _find_nearest_pin_node_id_from = (
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
      if (!this._spec_is_link_pin_ignored(node_id)) {
        if (this._is_pin_pin_match(pin_node_id, node_id)) {
          return true
        }
      }
    } else if (this._is_merge_node_id(node_id)) {
      if (this._is_pin_pin_match(pin_node_id, node_id)) {
        return true
      }
    } else if (this._is_int_pin_node_id(node_id)) {
      if (this._is_ext_pin_match(pin_node_id, node_id)) {
        return true
      }
    }
    return false
  }

  private _drop_pin = (pin_node_id: string): void => {
    const is_link_pin = this._is_link_pin_node_id(pin_node_id)
    const is_link_pin_ignored =
      is_link_pin && this._spec_is_link_pin_ignored(pin_node_id)

    if (is_link_pin_ignored) {
      return
    }

    const nearest_compatible_node_id: string = this._find_nearest_node_id(
      pin_node_id,
      NEAR,
      this._is_pin_node_match,
      { ...this._node, ...this._exposed_int_node }
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
      } else if (this._is_int_pin_node_id(nearest_compatible_node_id)) {
        if (this._is_ext_pin_match(pin_node_id, nearest_compatible_node_id)) {
          const { pinId, type, subPinId } = segmentExposedNodeId(
            nearest_compatible_node_id
          )
          if (is_link_pin) {
            const { unitId, pinId } = segmentLinkPinNodeId(pin_node_id)
            this.plug_exposed_pin(type, pinId, subPinId, { unitId, pinId })
          } else {
            const { id: mergeId } = segmentMergeNodeId(pin_node_id)
            this.plug_exposed_pin(type, pinId, subPinId, { mergeId })
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
    const { type, pinId } = segmentExposedNodeId(exposed_pin_node_id)
    if (
      (this._is_pin_node_id(node_id) &&
        this._is_exp_pin_pin_match(type, pinId, node_id)) ||
      (this._is_unit_node_id(node_id) &&
        this._is_exp_pin_unit_match(type, pinId, node_id))
    ) {
      return true
    } else {
      return false
    }
  }

  private _drop_exposed_pin = (exposed_pin_node_id: string): void => {
    const { type, pinId, subPinId } = segmentExposedNodeId(exposed_pin_node_id)

    const ext_node_id = getExtNodeId(type, pinId, subPinId)
    const int_node_id = getIntNodeId(type, pinId, subPinId)

    if (!this._exposed_ext_plugged[ext_node_id]) {
      const nearest_compatible_node_id: string = this._find_nearest_node_id(
        int_node_id,
        // NEAR,
        (4 * LINK_DISTANCE + 2 * PIN_RADIUS) * this._zoom.k,
        this._is_exp_pin_node_match
      )
      if (nearest_compatible_node_id) {
        this._set_node_target(int_node_id, nearest_compatible_node_id)
      } else {
        this._refresh_node_layer(ext_node_id)
        this._refresh_node_layer(int_node_id)

        const type_node_id = getTypeNodeId(ext_node_id)
        if (this._has_node(type_node_id)) {
          const type_link_id = getLinkId(type_node_id, ext_node_id)
          this._refresh_node_layer(type_node_id)
          this._refresh_link_layer(type_link_id)
        }
      }
    } else {
      this._refresh_node_layer(ext_node_id)
    }
  }

  private _refresh_ext_layer = (ext_node_id) => {}

  private _node_target: Dict<string> = {}
  private _node_target_count: number = 0

  private _turn_unit_into_data(unit_id: string) {
    const spec_id = this._get_unit_spec_id(unit_id)
    const position = this._get_node_position(unit_id)

    this._remove_unit(unit_id)

    this._add_data_unit(spec_id, position)
  }

  private _set_node_target(node_id: string, target_id: string): void {
    if (this._node_target[node_id]) {
      return
    }
    // console.log('Graph', '_set_node_target', node_id, target_id)
    this._node_target[node_id] = target_id
    this._node_target_count++
  }

  private _remove_node_target(node_id: string): void {
    if (!this._node_target[node_id]) {
      return
    }
    // console.log('Graph', '_remove_node_target', node_id)
    delete this._node_target[node_id]
    this._node_target_count--
  }

  private _on_node_target_end(node_id: string, target_node_id: string): void {
    // console.log('Graph', '_on_node_target_end', node_id, target_node_id)
    if (this._is_exposed_pin_node_id(node_id)) {
      this._drop_commit_exposed_pin(node_id, target_node_id)
    }

    this._remove_node_target(node_id)
  }

  private _drop_commit_exposed_pin(
    node_id: string,
    target_node_id: string
  ): void {
    const { type, pinId, subPinId } = segmentExposedNodeId(node_id)

    const ext_node_id = getExtNodeId(type, pinId, subPinId)
    const int_node_id = getIntNodeId(type, pinId, subPinId)

    this._refresh_node_layer(ext_node_id)
    this._refresh_node_layer(int_node_id)

    if (this._is_pin_node_id(target_node_id)) {
      this.__plug_exposed_pin_to(type, pinId, subPinId, target_node_id)
    } else if (this._is_unit_node_id(target_node_id)) {
      const pin_node_id = getSelfPinNodeId(target_node_id)
      this.__plug_exposed_pin_to(type, pinId, subPinId, pin_node_id)
    } else {
      throw new Error('Invalid Exposed Pin Drop Target')
    }
  }

  private _drop_node = (node_id: string): void => {
    // console.log('_drop_node', node_id)

    this._cancel_long_click = true

    setTimeout(() => {
      this._cancel_long_click = false
    }, 0)

    if (this._selected_node_count > 1) {
      return
    }

    if (this._tree_layout) {
      //
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

  public leaveFullwindow(animate: boolean, callback: () => void): void {
    this._leave_all_fullwindow(animate, callback)
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

    if (this._core_component_unlocked_count > 0) {
      const unlocked_component_id = getObjSingleKey(
        this._core_component_unlocked
      )
      const unlocked_sub_component = this._get_sub_component(
        unlocked_component_id
      )
      unlocked_sub_component.focus(options)
    } else {
      this._graph.focus(options)
    }
  }

  public temp_fixate_node = (node_id: string, t: number = 100): void => {
    this._set_node_fixed(node_id, true)
    setTimeout(() => {
      this._set_node_fixed(node_id!, false)
    }, t)
  }

  public _set_node_fixed = (node_id: string, fixed: boolean): void => {
    // console.log('Graph', 'set_node_fixed', node_id, fixed)
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
      core_overlay.$element.style.display = 'none'
    }
  }

  private _show_core_overlay = (unit_id: string): void => {
    const core_overlay = this._core_component_overlay[unit_id]

    if (core_overlay) {
      core_overlay.$element.style.display = 'block'
    }
  }

  private _hide_err_overlay = (err_node_id: string): void => {
    const err_overlay = this._err_overlay[err_node_id]

    if (err_overlay) {
      err_overlay.$element.style.display = 'none'
    }
  }

  private _show_err_overlay = (err_node_id: string): void => {
    const err_overlay = this._err_overlay[err_node_id]

    if (err_overlay) {
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
        this._refresh_selection_dashoffset(unit_id)

        this._enable_core_frame(unit_id)

        this._hide_core_overlay(unit_id)

        this._focus_sub_component(unit_id)

        const core_area = this._core_area[unit_id]

        core_area.$element.style.display = 'none'
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
    // console.log('Graph', '_lock_sub_component', unit_id, unlocking)
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

    core_area.$element.style.display = 'block'

    this._show_core_overlay(unit_id)

    this._refresh_selection_dasharray(unit_id)
    this._refresh_selection_dashoffset(unit_id)
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

  private _is_ext_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 'e'
  }

  private _is_int_pin_node_id = (node_id: string): boolean => {
    return this._node_type[node_id] === 'i'
  }

  private _is_exposed_pin_node_id = (node_id: string): boolean => {
    return this._is_ext_node_id(node_id) || this._is_int_pin_node_id(node_id)
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

      if (this._mode === 'info') {
        this._enable_core_name(node_id)
      }
    } else if (this._is_datum_node_id(node_id)) {
      if (this._mode === 'multiselect') {
        //
      } else if (this._mode === 'none') {
        const datum_anchor_node_id = this._get_datum_pin_anchor_node_id(node_id)
        if (
          !datum_anchor_node_id ||
          !this._is_output_node_id(datum_anchor_node_id)
        ) {
          this._disable_datum_overlay(node_id)
        }
      } else {
        //
      }
    } else if (this._is_merge_node_id(node_id)) {
      if (this._mode === 'multiselect') {
        //
      } else {
        const merge_datum_node_id = this._get_merge_datum_node_id(node_id)
        if (merge_datum_node_id) {
          this._show_datum(merge_datum_node_id)
        }
      }
    } else if (this._is_ext_node_id(node_id)) {
      this._enable_plug_name(node_id)
    } else if (this._is_int_pin_node_id(node_id)) {
      const ext_node_id = getExtNodeIdFromIntNodeId(node_id)
      this._enable_plug_name(ext_node_id)
    } else if (this._is_err_node_id(node_id)) {
      this._hide_err_overlay(node_id)
    }

    if (this._has_node(node_id)) {
      this._refresh_node_selection(node_id)
      this._refresh_node_color(node_id)
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

    if (this._long_press_collapsing) {
      if (this._long_press_collapse_unit_id === node_id) {
        //
      } else if (this._long_press_collapse_datum_node_id === node_id) {
        //
      } else {
        // if (this._static_position[node_id]) {
        //   this._stop_node_static(node_id)
        // }
        // this._start_node_long_press_collapse(node_id)
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

  private _enable_core_name = (unit_id: string): void => {
    // console.log('Graph', '_enable_core_name', unit_id)

    const core_name = this._core_name[unit_id]

    core_name.$element.style.pointerEvents = 'inherit'
  }

  private _disable_core_name = (unit_id: string): void => {
    // console.log('Graph', '_disable_core_name', unit_id)

    const core_name = this._core_name[unit_id]

    core_name.$element.style.pointerEvents = 'none'
  }

  private _set_plug_name_style_attr = (
    ext_node_id: string,
    attr: string,
    value: string
  ): void => {
    const plug_name = this._ext_pin_name[ext_node_id]

    plug_name.$element.style[attr] = value
  }

  private _add_datum_plug_link = (): void => {
    // TODO
  }

  private _remove_datum_plug_link = (): void => {
    // TODO
  }

  private _enable_plug_name = (ext_node_id: string): void => {
    console.log('Graph', '_enable_plug_name', ext_node_id)

    this._set_plug_name_style_attr(ext_node_id, 'pointerEvents', 'inherit')
  }

  private _disable_plug_name = (ext_node_id: string): void => {
    console.log('Graph', '_disable_plug_name', ext_node_id)

    const plug_name = this._ext_pin_name[ext_node_id]

    this._set_plug_name_style_attr(ext_node_id, 'pointerEvents', 'none')
  }

  private _enable_core_touch_area = (unit_id: string): void => {
    // console.log('Graph', '_enable_core_touch_area')

    const core_area = this._core_area[unit_id]

    core_area.$element.style.pointerEvents = 'inherit'
  }

  private _disable_core_touch_area = (unit_id: string): void => {
    // console.log('Graph', '_disable_core_touch_area')

    const core_area = this._core_area[unit_id]

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

    this._deselect_node(node_id)
  }

  public _deselect_node = (node_id: string): void => {
    // console.log('Graph', '_deselect_node', node_id)

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
    // console.log('Graph', '_select_all')
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

    datum_overlay.$element.style.display = 'block'
  }

  private _disable_node_overlay = (node_id: string): void => {
    // TODO
  }

  private _disable_datum_overlay = (datum_node_id: string): void => {
    // console.log('Graph', '_disable_datum_overlay', datum_node_id)

    const datum_overlay = this._datum_overlay[datum_node_id]

    datum_overlay.$element.style.display = 'none'
  }

  private _hide_control = (animate: boolean): void => {
    // console.log('Graph', '_hide_control', animate)

    if (this._force_control_animation_false) {
      this._force_control_animation_false = false
      animate = false
    }

    if (this._control) {
      this._control.hide(animate)
    }
  }

  private _show_control = (animate: boolean): void => {
    // console.log('Graph', '_show_control', animate)

    if (this._control) {
      if (this._force_control_animation_false) {
        this._force_control_animation_false = false
        animate = false
      }

      this._control.show(animate)
    }
  }

  private _disable_frame_pointer = (): void => {
    // console.log('Graph', '_disable_frame_pointer')
    this._frame.$element.style.pointerEvents = 'none'
  }

  private _enable_frame_pointer = (): void => {
    // console.log('Graph', '_enable_frame_pointer')
    this._frame.$element.style.pointerEvents = 'inherit'
  }

  private _force_control_animation_false: boolean = false

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
        { duration: ANIMATION_T_MS }
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
        { duration: ANIMATION_T_MS }
      )
      animation.onfinish = () => {
        this._main.$element.style.opacity = '0.25'
      }
    } else {
      this._main.$element.style.opacity = '0.25'
    }
  }

  private _enter_fullwindow = (
    _animate: boolean,
    sub_component_ids: string[]
  ) => {
    // console.log('Graph', '_enter_fullwindow', animate, sub_component_ids)

    const { animate } = this.$props

    _animate = _animate ?? animate

    this._is_fullwindow = true

    if (!this._frame_out) {
      this._set_fullwindow_frame_on(_animate)

      if (!this._frame_out) {
        if (!this._disabled) {
          this._disable_input()
        }
      }
    }

    this._cancel_fullwindow_animation()

    this._fullwindow_component_set = new Set(sub_component_ids)
    this._fullwindow_component_ids = sub_component_ids

    if (this._in_component_control) {
      if (_animate) {
        if (!this._is_component_framed) {
          this._enter_component_frame()
        }

        const last_sub_component_id = last(sub_component_ids)

        this._abort_fullwindow_animation = this._animate_enter_fullwindow(
          this._fullwindow_component_ids,
          () => {
            for (const sub_component_id of this._fullwindow_component_ids) {
              this._unplug_sub_component_root_base_frame(sub_component_id)

              this._commit_sub_component_base(sub_component_id)
              this._couple_sub_component(sub_component_id)

              if (last_sub_component_id === sub_component_id) {
                const is_last_sub_component =
                  sub_component_id === last_sub_component_id

                if (is_last_sub_component) {
                  const last_sub_component = this._get_sub_component(
                    last_sub_component_id
                  )

                  last_sub_component.focus()
                }
              }
            }
          }
        )
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
          }
        } else {
          for (const sub_component_id of sub_component_ids) {
            this._leave_sub_component_frame(sub_component_id)
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
        this._transcend.down(_animate)
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
      return COLOR_GREEN
    } else if (selected) {
      return this._theme.selected
    } else if (hovered || pressed) {
      return this._theme.hovered
    }
    return COLOR_NONE
  }

  private _get_node_selection_target_dasharray = (
    node_id: string,
    paddingX: number,
    paddingY: number
  ): string => {
    const node = this._node[node_id]
    const { shape } = node
    if (shape === 'circle') {
      const { r } = node
      const p = (paddingX + paddingY) / 2
      const l = 2 * Math.PI * (r + p / 2)
      return `${l / 8}`
    } else {
      const { width, height } = node
      const _width = width + paddingX
      const _height = height + paddingY
      return `${_width / 4} ${_width / 2} ${_width / 4} 0 ${_height / 4} ${
        _height / 2
      } ${_height / 4} 0`
    }
  }

  private _get_node_selection_dasharray = (
    node_id: string,
    paddingX: number,
    paddingY: number
  ): string => {
    if (this._core_component_unlocked[node_id]) {
      return this._get_node_selection_target_dasharray(
        node_id,
        paddingX,
        paddingY
      )
    } else {
      if (this._edit_datum_node_id === node_id) {
        return this._get_node_selection_target_dasharray(
          node_id,
          paddingX,
          paddingY
        )
      }
      return '6'
    }
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
        if (this._spec_is_link_pin_ignored(pin_node_id)) {
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
    type: IO,
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
      if (this._spec_is_link_pin_ignored(pin_node_id)) {
        return false
      }

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
    type: IO,
    pin_id: string,
    unit_id: string
  ): boolean => {
    // return false
    if (type === 'input') {
      return false
    } else {
      const exp_pin_type_tree = this.__get_ext_pin_type(type, pin_id)
      const unit_type_tree = this._get_unit_type(unit_id)
      const is_type_match = _isTypeMatch(unit_type_tree, exp_pin_type_tree)
      return is_type_match
    }
  }

  private _runtime_pin_type = (pin_node_id: string, kind: IO) => {
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
    a_type: IO,
    b: string,
    b_type: IO
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
      this._spec_is_link_pin_ignored(pin_node_id)
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

    const specs = { ...this.$system.specs, ...this.$pod.specs }
    const datum_type = _getValueType(specs, data)

    return _isTypeMatch(datum_type, pin_type)
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

  private _is_ext_pin_match = (pin_node_id: string, ext_node_id: string) => {
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
        (this._is_ext_node_id(node_id) || this._is_int_pin_node_id(node_id))
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
    this._compatible_node_count = 0

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
                this._set_node_compatible(unit_id)
              }
            }
          }
          for (const pin_node_id in this._pin_node) {
            if (this._is_pin_all_pin_match(pin_node_id, display_node_id)) {
              this._set_node_compatible(pin_node_id)
            }
          }
        } else {
          for (let pin_node_id in this._pin_node) {
            if (this._is_pin_all_pin_match(pin_node_id, display_node_id)) {
              this._set_node_compatible(pin_node_id)
            }
          }
          for (const datum_node_id in this._data_node) {
            if (this._is_datum_all_pin_match(datum_node_id, display_node_id)) {
              this._set_node_compatible(datum_node_id)
            }
          }
          if (display_node_id.length === 1) {
            const pin_node_id = display_node_id[0]
            for (const internal_node_id in this._exposed_int_unplugged) {
              const { type, pinId } = segmentInternalNodeId(internal_node_id)
              if (this._is_exp_pin_pin_match(type, pinId, pin_node_id)) {
                this._set_node_compatible(internal_node_id)
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
                  this._set_node_compatible(pin_node_id)
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
              if (compatible) {
                this._set_node_compatible(pin_node_id)
              }
            }
          }
        }
      } else if (all_data) {
        for (let pin_node_id in this._pin_node) {
          if (this._is_pin_all_datum_match(pin_node_id, display_node_id)) {
            this._set_node_compatible(pin_node_id)
          }
        }
      } else if (all_ext_pin) {
        // AD HOC there should be only a single exposed pin
        if (display_node_id.length <= 2) {
          const ext_node_id = display_node_id[0]
          const { type, pinId } = segmentExposedNodeId(ext_node_id)
          for (let unit_id in this._unit_node) {
            if (this._is_exp_pin_unit_match(type, pinId, unit_id)) {
              this._set_node_compatible(unit_id)
            }
          }
          for (let pin_node_id in this._pin_node) {
            if (this._is_exp_pin_pin_match(type, pinId, pin_node_id)) {
              this._set_node_compatible(pin_node_id)
            }
          }
        }
      }
    }

    for (let node_id in prev_compatible_node_id) {
      this._refresh_node_fixed(node_id)
      this._refresh_node_selection(node_id)
    }

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
    // console.log('_refresh_node_fixed', node_id)
    let fixed = false
    if (
      this._drag_node_id[node_id] ||
      (!this._all_data &&
        this._compatible_node_id[node_id] &&
        (this._is_node_id(node_id) || this._is_int_pin_node_id(node_id)))
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
    this._refresh_selection_dashoffset(node_id)
  }

  private _get_node_default_layer = (node_id: string): number => {
    if (this._is_unit_node_id(node_id)) {
      return LAYER_NORMAL
    } else if (this._is_merge_node_id(node_id)) {
      return LAYER_NORMAL
    } else if (this._is_link_pin_node_id(node_id)) {
      if (this._spec_is_link_pin_ignored(node_id)) {
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

  private _get_link_default_layer = (link_id: string): number => {
    const { source, target } = segmentLinkId(link_id)

    return this._get_node_default_layer(source)
  }

  private _refresh_link_layer = (link_id: string): void => {
    const default_layer = this._get_link_default_layer(link_id)
    this._set_link_layer(link_id, default_layer)
  }

  private _refresh_selection_color = (node_id: string): void => {
    // console.log('Graph', '_refresh_selection_color')
    const selection = this._node_selection[node_id]
    const stroke = this._node_selection_color(node_id)
    selection.setProp('stroke', stroke)
  }

  private _refresh_selection_dasharray = (node_id: string): void => {
    // console.log('Graph', '_refresh_selection_dasharray')
    const { paddingX = 6, paddingY = 6 } = this._selection_opt[node_id]
    const selection_stroke_dasharray = this._get_node_selection_dasharray(
      node_id,
      paddingX,
      paddingY
    )
    this._set_selection_dasharray(node_id, selection_stroke_dasharray)
  }

  private _refresh_selection_dashoffset = (node_id: string): void => {
    const { paddingX = 6, paddingY = 6 } = this._selection_opt[node_id]
    const selection_stroke_dashoffset = this._get_node_selection_dashoffset(
      node_id,
      paddingX,
      paddingY
    )
    this._set_selection_dashoffset(node_id, selection_stroke_dashoffset)
  }

  private _set_selection_dashoffset = (node_id: string, dashoffset: number) => {
    // console.log('Graph', '_set_selection_dashoffset', node_id, dashoffset)
    const selection = this._node_selection[node_id]
    selection.setProp('strokeDashOffset', dashoffset)
  }

  private _set_selection_dasharray = (
    node_id: string,
    dasharray: string
  ): void => {
    // console.log('Graph', '_set_selection_dasharray', node_id, dasharray)
    const selection = this._node_selection[node_id]
    selection.setProp('strokeDasharray', dasharray)
  }

  private _on_node_none_click = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_none_mode_click')

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
              // TODO bulk
              this.merge_link_pin_merge_pin(display_node_id[i], merge_node_id)
            }
            const merge_anchor_node_id =
              this._get_merge_anchor_node_id(merge_node_id)
            this.select_node(merge_anchor_node_id)
            this._cancel_click = true
          } else if (this._is_datum_node_id(node_id)) {
            for (let i = 1; i < display_node_count; i++) {
              const clone_datum_node_id = this._sim_duplicate_datum(node_id)
              this._move_datum_to_pin(clone_datum_node_id, display_node_id[i])
            }
            this._move_datum_to_pin(node_id, display_node_id[0])
          } else if (this._is_unit_node_id(node_id)) {
            for (let i = 0; i < display_node_count; i++) {
              this._merge_pin_unit(display_node_id[i], node_id)
            }
            this.select_node(node_id)
          } else if (this._is_int_pin_node_id(node_id)) {
            const { type, pinId, subPinId } = segmentInternalNodeId(node_id)
            const pin_node_id = display_node_id[0]
            this.__plug_exposed_pin_to(type, pinId, subPinId, pin_node_id)
          }
        } else if (all_data) {
          for (let i = 0; i < display_node_count; i++) {
            const _display_node_id = display_node_id[i]
            this._move_datum_to_pin(_display_node_id, node_id)
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
            const { type, pinId, subPinId } =
              segmentInternalNodeId(internal_node_id)
            this.__plug_exposed_pin_to(type, pinId, subPinId, node_id)
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
  }

  private _on_node_multiselect_click = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_node_multiselect_click', node_id)
    if (this._is_node_selectable(node_id)) {
      if (this._selected_node_id[node_id]) {
        this.deselect_node(node_id)
      } else {
        this.select_node(node_id)
      }
    }
  }

  private _on_node_info_click = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_node_info_click', node_id)
    this._info_node(node_id)
    this._deselect_all()
    this.select_node(node_id)
  }

  private _on_node_green_click = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_node_green_click', node_id)
    if (this._is_node_duplicatable(node_id)) {
      this._green_click_node(node_id)
    }
  }

  private _on_node_blue_click = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_node_blue_click', node_id)
    if (this._is_node_changeable(node_id)) {
      if (this._is_unit_node_id(node_id)) {
        this._on_unit_blue_click(node_id)
      } else if (this._is_link_pin_node_id(node_id)) {
        this._on_link_pin_blue_click(node_id)
      } else if (this._is_datum_node_id(node_id)) {
        this._on_datum_blue_click(node_id)
      } else if (this._is_exposed_pin_node_id(node_id)) {
        this._on_exposed_blue_click(node_id)
      }
    }
  }

  private _on_link_pin_blue_click = (pin_node_id: string): void => {
    this._toggle_link_pin_constant(pin_node_id)
  }

  private _on_datum_blue_click = (datum_node_id: string): void => {
    this._change_datum(datum_node_id)
  }

  private _on_exposed_blue_click = (exp_node_id: string): void => {
    this._toggle_exposed_pin_functional(exp_node_id)
  }

  private _on_node_click = (node_id: string, event: IOPointerEvent): void => {
    // log('Graph', '_on_node_click')
    if (this._resize_node_id_pointer_id[node_id]) {
      return
    }

    if (this._mode === 'none') {
      this._on_node_none_click(node_id, event)
    } else if (this._mode === 'multiselect') {
      this._on_node_multiselect_click(node_id, event)
    } else if (this._mode === 'info') {
      this._on_node_info_click(node_id, event)
    } else if (this._mode === 'add') {
      this._on_node_green_click(node_id, event)
    } else if (this._mode === 'remove') {
      this._on_node_red_click(node_id, event)
    } else if (this._mode === 'change') {
      this._on_node_blue_click(node_id, event)
    } else if (this._mode === 'data') {
      this._on_node_yellow_click(node_id)
    }
  }

  private _on_node_red_click = (node_id: string, event: IOPointerEvent) => {
    // console.log('Graph', '_on_node_red_click', node_id)
    if (this._is_node_removable(node_id)) {
      this._cancel_click = true
      // AD HOC
      // let system finish pointer event cycle (Bot on Mobile)
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

  private _animate_sub_component_graph_leave = (
    sub_component_id: string,
    sub_component_position: Dict<Position>,
    sub_component_trait: Dict<LayoutNode>,
    sub_component_base: Dict<LayoutBase>,
    sub_component_base_node: Dict<LayoutNode[]>,
    base: LayoutBase,
    base_node: LayoutNode[],
    sub_scale: number
  ): void => {
    // console.log(
    //   'Graph',
    //   '_animate_sub_component_graph_leave',
    //   sub_component_id,
    //   sub_component_position,
    //   sub_component_trait,
    //   sub_component_base,
    //   sub_component_base_node,
    //   base,
    //   base_node,
    //   sub_scale
    // )

    // console.log(
    //   'Graph',
    //   '_animate_sub_component_graph_leave',
    //   base,
    //   base_node,
    //   sub_scale
    // )
    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    const base_layer = this._foreground

    let i = 0
    for (const leaf of base) {
      const [leaf_path] = leaf
      const leaf_id = getLeafId([sub_component_id, ...leaf_path])
      const leaf_node = base_node[i]
      this._leaf_frame_node[leaf_id] = leaf_node
      i++
    }

    this._remove_sub_component_root_base(sub_component_id)

    const frame = this._get_sub_component_frame(sub_component_id)
    const context = this._get_sub_component_frame_context(sub_component_id)

    const fontSize = this.getFontSize()
    const k = this._zoom.k
    const opacity = 1

    const trait = {
      x: context.$x,
      y: context.$y,
      width: context.$width,
      height: context.$height,
      fontSize,
      k,
      opacity,
    }

    const style = extractStyle(frame, measureText)

    let base_trait = this._reflect_sub_component_base_trait(
      sub_component_id,
      base,
      style,
      trait
    )

    const base_length = base.length

    i = 0
    this._abort_tree_layout_sub_component_base_animation[sub_component_id] =
      this._animate_sub_component_base(
        sub_component_id,
        base,
        base_node,
        base_layer,
        (leaf_id: string) => {
          if (i === 0) {
            base_trait = this._reflect_sub_component_base_trait(
              sub_component_id,
              base,
              style,
              trait
            )
          }

          const leaf_trait = base_trait[leaf_id]

          i = (i + 1) % base_length

          const context =
            this._get_sub_component_frame_context(sub_component_id)

          return {
            x: context.$x + leaf_trait.x * k + (leaf_trait.width * (k - 1)) / 2,
            y:
              context.$y + leaf_trait.y * k + (leaf_trait.height * (k - 1)) / 2,
            width: leaf_trait.width,
            height: leaf_trait.height,
            k: this._zoom.k * leaf_trait.k,
            opacity: leaf_trait.opacity,
            fontSize: leaf_trait.fontSize,
          }
        },
        () => {
          this._unplug_sub_component_base_frame(sub_component_id)

          this._enter_sub_component_frame(sub_component_id)
          this._compose_sub_component(sub_component_id)
          this._commit_sub_component_base(sub_component_id)
        }
      )
  }

  private _is_node_dataable = (node_id: string): boolean => {
    if (this._is_unit_node_id(node_id)) {
      return true
    }

    if (this._is_link_input_node_id(node_id)) {
      if (!this._is_link_pin_ref(node_id)) {
        return true
      }
    }

    if (this._is_merge_node_id(node_id)) {
      if (!this._is_output_merge(node_id)) {
        return true
      }
    }

    if (this._is_datum_node_id(node_id)) {
      if (this._is_datum_class_literal(node_id)) {
        return true
      }
    }

    return false
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

  private _action_buffer: Action[] = []
  private _action_buffer_cursor: number = -1

  private _dispatch_action = (action: Action): void => {
    // console.log('Graph', '_dispatchAction', action)

    this.dispatchEvent('_graph_action', action)
    this.dispatchEvent('_graph_spec', { spec: this._spec })

    if (this._action_buffer_cursor < this._action_buffer.length - 1) {
      const start = this._action_buffer_cursor + 1
      const delete_count =
        this._action_buffer.length - this._action_buffer_cursor + 1
      this._action_buffer.splice(start, delete_count)
    }

    this._action_buffer.push(action)
    this._action_buffer_cursor++
  }

  public remove_exposed_sub_pin = (exposed_pin_node_id: string): void => {
    const { pinId, type, subPinId } = segmentExposedNodeId(exposed_pin_node_id)
    this._remove_exposed_sub_pin(exposed_pin_node_id)
    this._dispatch_action(coverPin(pinId, type, subPinId))
  }

  private _remove_exposed_sub_pin = (exposed_pin_node_id: string): void => {
    // console.log('Graph', '_remove_exposed_sub_pin', exposed_pin_node_id)
    const { pinId, type, subPinId } = segmentExposedNodeId(exposed_pin_node_id)

    const pin_count = this._get_exposed_pin_set_count(exposed_pin_node_id)
    if (pin_count === 1 || pin_count === 0) {
      this.__remove_exposed_pin_set(type, pinId)
    } else {
      this.__sim_remove_exposed_sub_pin(type, pinId, subPinId)
      this.__spec_remove_exposed_sub_pin(type, pinId, subPinId)
      this.__pod_remove_exposed_sub_pin(type, pinId, subPinId)
    }
  }

  private _get_exposed_pin_set_count = (
    exposed_pin_node_id: string
  ): number => {
    const { pinId, type } = segmentExposedNodeId(exposed_pin_node_id)
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pinId)
    const { pin } = exposed_pin_spec
    const { count } = keyCount({ obj: pin || {} })
    return count
  }

  private _spec_remove_exposed_sub_pin = (exposed_node_id: string): void => {
    const { pinId, type, subPinId } = segmentExposedNodeId(exposed_node_id)
    this.__spec_remove_exposed_sub_pin(type, pinId, subPinId)
  }

  private __spec_remove_exposed_sub_pin = (
    type: IO,
    id: string,
    subPinId: string
  ): void => {
    // console.log('Graph', '_spec_remove_exposed_sub_pin', type, pinId, subPinId)
    this._spec = specReducer.coverPin({ id, type, subPinId }, this._spec)
  }

  private _sim_remove_exposed_sub_pin = (exposed_pin_node_id: string) => {
    const { type, pinId, subPinId } = segmentExposedNodeId(exposed_pin_node_id)
    this.__sim_remove_exposed_sub_pin(type, pinId, subPinId)
  }

  private __sim_remove_exposed_sub_pin = (
    type: IO,
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

    const ext_node_id = getExtNodeId(type, pin_id, sub_pin_id)
    const int_node_id = getIntNodeId(type, pin_id, sub_pin_id)

    const source_id = input ? ext_node_id : int_node_id
    const target_id = input ? int_node_id : ext_node_id
    const link_id = getLinkId(source_id, target_id)
    this._sim_remove_link(link_id)

    delete this._exposed_link[link_id]

    this._sim_remove_exposed_ext_node(ext_node_id)

    const pin_node_id = this._exposed_int_plugged[int_node_id]
    if (pin_node_id) {
      delete this._pin_to_internal[pin_node_id]
      delete this._exposed_int_plugged[int_node_id]
    } else {
      this._sim_remove_exposed_int_node(int_node_id)
    }
  }

  private _sim_remove_exposed_ext_node = (ext_node_id: string) => {
    delete this._exposed_node[ext_node_id]
    delete this._exposed_ext_node[ext_node_id]
    delete this._exposed_ext_plugged[ext_node_id]
    delete this._exposed_ext_unplugged[ext_node_id]
    delete this._ext_pin_name[ext_node_id]

    delete this._node_type[ext_node_id]

    this._sim_remove_node(ext_node_id)
  }

  private _sim_remove_exposed_int_node = (int_node_id: string) => {
    delete this._exposed_node[int_node_id]
    delete this._exposed_int_node[int_node_id]
    delete this._exposed_int_unplugged[int_node_id]

    delete this._node_type[int_node_id]

    this._sim_remove_node(int_node_id)
  }

  private _pod_remove_exposed_sub_pin = (exposed_node_id: string): void => {
    const { type, pinId, subPinId } = segmentExposedNodeId(exposed_node_id)
    this.__pod_remove_exposed_sub_pin(type, pinId, subPinId)
  }

  private __pod_remove_exposed_sub_pin = (
    type: IO,
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

    pin.$element.style.width = `${width}px`
    pin.$element.style.height = `${height}px`

    this._resize_node(pin_node_id, r, width, height)
    this._resize_selection(pin_node_id, width, height)
  }

  private _set_link_pin_d = (pin_node_id: string, d: number): void => {
    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    this._set_link_d(link_id, d)
  }

  private _set_link_d = (link_id: string, d: number): void => {
    // console.log('Graph', '_set_link_d', d)

    const link = this._link[link_id]
    link.d = d
  }

  private _set_link_pin_padding_source = (
    pin_node_id: string,
    padding: number
  ): void => {
    // console.log('Graph', '_set_link_pin_padding_source', pin_node_id, padding)

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

    start_marker.$element.style.display = hidden ? 'none' : 'block'
  }

  private _set_link_pin_end_marker_hidden = (
    pin_node_id: string,
    hidden: boolean
  ): void => {
    const end_marker = this._pin_link_end_marker[pin_node_id]

    end_marker.$element.style.display = hidden ? 'none' : 'block'
  }

  public set_link_pin_ignored = (
    pin_node_id: string,
    ignored: boolean
  ): void => {
    // console.log('Graph', 'set_link_pin_ignored')

    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    this._set_link_pin_ignored(pin_node_id, ignored)

    this._dispatch_action(setUnitPinIgnored(unitId, type, pinId, ignored))
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
  }

  private _sim_set_unit_pin_ignored = (
    pin_node_id: string,
    ignored: boolean
  ) => {
    // console.log('Graph', '_sim_set_unit_pin_ignored', pin_node_id, ignored)

    const { unitId } = segmentLinkPinNodeId(pin_node_id)

    const internal_node_id = this._pin_to_internal[pin_node_id]

    if (internal_node_id) {
      const { type, pinId, subPinId } = segmentInternalNodeId(internal_node_id)

      this._sim_unplug_exposed_pin(type, pinId, subPinId)
    }

    const datum_node_id = this._pin_to_datum[pin_node_id]

    const pin_datum_tree = this._pin_datum_tree[pin_node_id]

    this._link_pin_ignored[pin_node_id] = ignored

    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)

    if (ignored) {
      this._set_node_layer(pin_node_id, LAYER_IGNORED)
      this._set_link_layer(link_id, LAYER_IGNORED)
      this._set_link_pin_d(pin_node_id, LINK_DISTANCE_IGNORED)
      this._set_link_pin_opacity(pin_node_id, 0)
      this._set_link_pin_pointer_events(pin_node_id, 'none')

      if (pin_datum_tree) {
        this._dec_unit_pin_active(unitId)
      }
    } else {
      this._set_node_layer(pin_node_id, LAYER_NORMAL)
      this._set_link_layer(link_id, LAYER_NORMAL)
      this._set_link_pin_d(pin_node_id, LINK_DISTANCE)
      this._set_link_pin_opacity(pin_node_id, 1)
      this._set_link_pin_pointer_events(pin_node_id, 'inherit')

      if (pin_datum_tree) {
        this._inc_unit_pin_active(unitId)
      }

      if (pin_node_id) {
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
    type: IO,
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
    type: IO,
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
    type: IO,
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
    type: IO,
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
      //   return this._sim_duplicate_exposed_pin(node_id)
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

    const { id } = unit

    const new_unit_id = this._new_unit_id(id)
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
      if (this._spec_is_link_pin_ignored(pin_node_id)) {
        this.set_link_pin_ignored(pin_node_id, false)
      }
    }
    return null
  }

  private _sim_duplicate_datum = (datum_node_id: string): string => {
    // console.log('Graph', '_sim_duplicated_datum', datum_node_id)
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    const datum_tree = this._datum_tree[datum_id]
    const { x, y } = this._get_node_position(datum_node_id)
    const new_datum_id = this._new_datum_id()
    const new_datum_node_id = getDatumNodeId(new_datum_id)
    this.add_datum(new_datum_id, datum_tree.value, { x, y })
    return new_datum_node_id
  }

  private _sim_duplicate_exposed_pin = (exposed_node_id: string): string => {
    // console.log('Graph', '_sim_duplicate_exposed_pin', exposed_node_id)
    const { type, pinId, subPinId } = segmentExposedNodeId(exposed_node_id)
    const ext_node_id = getExtNodeId(type, pinId, subPinId)
    const int_node_id = getExtNodeId(type, pinId, subPinId)
    const new_sub_pin_id = this._new_sub_pin_id(type, pinId)
    this.add_exposed_pin(type, pinId, {}, new_sub_pin_id, {}, {})
    const new_exposed_ext_node_id = getExtNodeId(type, pinId, new_sub_pin_id)
    const new_exposed_int_node_id = getIntNodeId(type, pinId, new_sub_pin_id)
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
      this._search_filter = filter

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
    } else if (this._is_ext_node_id(node_id)) {
      this._info_ext_pin(node_id)
    }
  }

  private _temp_cancel_double_click = () => {
    this._cancel_double_click = true
    setTimeout(() => {
      this._cancel_double_click = false
    }, CLICK_TIMEOUT)
  }

  private _on_node_yellow_click = (node_id: string): void => {
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
    this._turn_unit_into_data(unit_id)
  }

  private _yellow_click_class_literal = (datum_node_id: string): void => {
    this._temp_cancel_double_click()
    this._turn_class_literal_into_unit(datum_node_id)
  }

  private _turn_class_literal_into_unit = (datum_node_id: string): void => {
    const position = this._get_node_position(datum_node_id)
    const pin_position = { input: {}, output: {} }
    const layout_position = NULL_VECTOR

    const { id: datum_id } = segmentDatumNodeId(datum_node_id)

    const tree = this._datum_tree[datum_id]

    const { value } = tree

    const specs = { ...this.$system.specs, ...this.$pod.specs }
    const classes = this.$system.classes
    const spec_id = idFromUnitValue(value)

    this._remove_datum(datum_node_id)

    const new_unit_id = this._new_unit_id(spec_id)

    this._add_unit(
      new_unit_id,
      { id: spec_id },
      position,
      pin_position,
      layout_position,
      null
    )

    if (this._mode === 'data') {
      this._for_each_visible_unit_output(new_unit_id, (pin_node_id) =>
        this._set_link_pin_opacity(pin_node_id, 0.5)
      )
      this._for_each_unit_ref_input(new_unit_id, (pin_node_id) =>
        this._set_link_pin_opacity(pin_node_id, 0.5)
      )
    }

    this.temp_fixate_node(new_unit_id)

    if (this._is_unit_component(new_unit_id)) {
      this._sim_add_unit_component(new_unit_id)
      this._pod_connect_sub_component(new_unit_id)
    }
  }

  private _info_unit = (unit_id: string): void => {
    // TODO
  }

  private _show_core_description = (unit_id: string): void => {
    const core_description = this._core_description[unit_id]

    core_description.$element.style.display = 'flex'
  }

  private _hide_core_description = (unit_id: string): void => {
    const core_description = this._core_description[unit_id]

    core_description.$element.style.display = 'none'
  }

  private _info_pin = (pin_node_id: string): void => {
    // TODO
  }

  private _info_ext_pin = (ext_node_id: string) => {
    // TODO
  }

  private _yellow_click_pin = (pin_node_id: string): void => {
    // console.log('Graph', '_yellow_click_pin', pin_node_id)

    const { specs } = this.$system

    if (this._is_input_node_id(pin_node_id) && !this._is_pin_ref(pin_node_id)) {
      let value: string

      const pin_datum_tree = this._pin_datum_tree[pin_node_id]

      const current_value = pin_datum_tree && pin_datum_tree.value

      const pin_type = this._get_pin_type(pin_node_id)

      if (this._is_link_pin_node_id(pin_node_id)) {
        const pin_spec = this._get_unit_pin_spec(pin_node_id)

        const { metadata = {} } = pin_spec
        const { examples = [] } = metadata

        if (examples.length > 0) {
          if (examples.length === 1) {
            value = examples[0]
          } else {
            value = randomInArray(examples)
          }
        } else {
          do {
            value = randomValueOfType(specs, pin_type)
          } while (value === current_value)
        }
      } else {
        do {
          value = randomValueOfType(specs, pin_type)
        } while (value === current_value)
      }

      this._set_pin_data(pin_node_id, value)
    }
  }

  private _spec_type_interface_cache: Dict<any> = {}

  private _on_unit_blue_click = (unit_id: string): void => {
    const { specs } = this.$system

    const spec_id = this._get_unit_spec_id(unit_id)

    this._search_unit_id = unit_id
    this._search_unit_spec_id = spec_id
    this._search_change_unit_spec_id = spec_id

    this._search_unit_merged_pin_ids = {
      input: {
        ref: [],
        data: [],
      },
      output: {
        ref: [],
        data: [],
      },
    }

    this._search_unit_exposed_pin_ids = {
      input: {
        data: {},
        ref: {},
      },
      output: {
        data: {},
        ref: {},
      },
    }
    this._search_unit_exposed_pin_count = {
      input: {
        data: 0,
        ref: 0,
      },
      output: {
        data: 0,
        ref: 0,
      },
    }

    const search_unit_merged_pin_types: {
      input: {
        ref: TreeNode[]
        data: TreeNode[]
      }
      output: {
        ref: TreeNode[]
        data: TreeNode[]
      }
    } = {
      input: { ref: [], data: [] },
      output: { ref: [], data: [] },
    }

    this._for_each_unit_pin(unit_id, (pin_node_id, kind, pin_id) => {
      const merge_node_id = this._pin_to_merge[pin_node_id]

      const ref = this._is_link_pin_ref(pin_node_id)

      const tag = ref ? 'ref' : 'data'

      if (merge_node_id) {
        this._search_unit_merged_pin_ids[kind][tag].push(pin_id)

        const opposite_kind = oppositePinKind(kind)
        const merge = this._get_merge(merge_node_id)
        // this unit should not be considered on merge type
        const _merge = _dissoc(merge, unit_id)

        const merge_type = this._get_merge_spec_type(_merge, opposite_kind)

        search_unit_merged_pin_types[kind][tag].push(merge_type)
      }

      const int_node_id = this._pin_to_internal[pin_node_id]
      if (int_node_id) {
        const { pinId, subPinId } = segmentExposedNodeId(int_node_id)
        this._search_unit_exposed_pin_ids[kind][tag][pin_id] = [pinId, subPinId]
        this._search_unit_exposed_pin_count[kind][tag]++
      }
    })

    const search_unit_merge_input_data =
      this._search_unit_merged_pin_ids.input.data
    const search_unit_merge_input_ref =
      this._search_unit_merged_pin_ids.input.ref

    const search_unit_merge_input_data_count =
      search_unit_merge_input_data.length
    const search_unit_merge_input_ref_count = search_unit_merge_input_ref.length

    const search_unit_merge_output_data =
      this._search_unit_merged_pin_ids.output.data
    const search_unit_merge_output_ref =
      this._search_unit_merged_pin_ids.output.ref

    const search_unit_merge_output_data_count =
      search_unit_merge_output_data.length
    const search_unit_merge_output_ref_count =
      search_unit_merge_output_ref.length

    const search_unit_merge_input_count =
      search_unit_merge_input_data_count + search_unit_merge_input_ref_count
    const search_unit_merge_output_count =
      search_unit_merge_output_data_count + search_unit_merge_output_ref_count

    const search_unit_exposed_input_count =
      this._search_unit_exposed_pin_count['input']
    const search_unit_exposed_output_count =
      this._search_unit_exposed_pin_count['output']

    const search_unit_exposed_input_data_count =
      search_unit_exposed_input_count.data
    const search_unit_exposed_input_ref_count =
      search_unit_exposed_input_count.ref
    const search_unit_exposed_output_data_count =
      search_unit_exposed_output_count.data
    const search_unit_exposed_output_ref_count =
      search_unit_exposed_output_count.ref

    this._set_search_filter((id: string) => {
      const inputs = getSpecInputs(specs, id)
      const outputs = getSpecOutputs(specs, id)

      const pins = {
        input: inputs,
        output: outputs,
      }

      const input_ids = Object.keys(inputs)
      const output_ids = Object.keys(outputs)

      const pin_ids = {
        input: input_ids,
        output: output_ids,
      }

      const filter_pin_ids = (type: IO, _ref: boolean): string[] => {
        return pin_ids[type].filter((input_id) => {
          const i = pins[type][input_id]
          const { ref } = i
          return !!ref === _ref
        })
      }

      const input_data_ids = filter_pin_ids('input', false)
      const input_ref_ids = filter_pin_ids('input', true)
      const output_data_ids = filter_pin_ids('output', false)
      const output_ref_ids = filter_pin_ids('output', true)

      const input_data_count = input_data_ids.length
      const input_ref_count = input_ref_ids.length
      const output_data_count = output_data_ids.length
      const output_ref_count = output_ref_ids.length

      const input_count = input_ids.length
      const output_count = output_ids.length

      const { input: input_type, output: output_type } =
        _getSpecTypeInterfaceByPath(
          id,
          specs,
          this._spec_type_interface_cache,
          {}
        )

      const data_input_types = input_data_ids.map(
        (input_id) => input_type[input_id]
      )
      const ref_input_types = input_ref_ids.map(
        (input_id) => input_type[input_id]
      )
      const data_output_types = output_data_ids.map(
        (output_id) => output_type[output_id]
      )
      const ref_output_types = output_ref_ids.map(
        (output_id) => output_type[output_id]
      )

      if (
        input_data_count >=
          search_unit_merge_input_data_count +
            search_unit_exposed_input_data_count &&
        input_ref_count >=
          search_unit_merge_input_ref_count +
            search_unit_exposed_input_ref_count &&
        output_data_count >=
          search_unit_merge_output_data_count +
            search_unit_exposed_output_data_count &&
        output_ref_count >=
          search_unit_merge_output_ref_count +
            search_unit_exposed_output_ref_count
      ) {
        if (this._search_option_valid_pin_matches[id]) {
          return true
        } else {
          const data_input_matches = _matchAllExcTypes(
            search_unit_merged_pin_types.input.data,
            data_input_types
          )
          const ref_input_matches = _matchAllExcTypes(
            search_unit_merged_pin_types.input.ref,
            ref_input_types
          )

          const valid_data_input_matches = data_input_matches.filter(
            (input_match) => {
              return input_match.length === search_unit_merge_input_data_count
            }
          )

          const valid_ref_input_matches = ref_input_matches.filter(
            (input_match) => {
              return input_match.length === search_unit_merge_input_ref_count
            }
          )

          if (
            (search_unit_merge_input_data_count > 0 &&
              valid_data_input_matches.length === 0) ||
            (search_unit_merge_input_ref_count > 0 &&
              valid_ref_input_matches.length === 0)
          ) {
            return false
          }

          const data_output_matches = _matchAllExcTypes(
            search_unit_merged_pin_types.output.data,
            data_output_types
          )
          const ref_output_matches = _matchAllExcTypes(
            search_unit_merged_pin_types.output.ref,
            ref_output_types
          )

          const valid_data_output_matches = data_output_matches.filter(
            (output_match) => {
              return output_match.length === search_unit_merge_output_data_count
            }
          )

          const valid_ref_output_matches = ref_output_matches.filter(
            (output_match) => {
              return output_match.length === search_unit_merge_output_ref_count
            }
          )

          if (
            (search_unit_merge_output_data_count > 0 &&
              valid_data_output_matches.length === 0) ||
            (search_unit_merge_output_ref_count > 0 &&
              valid_ref_output_matches.length === 0)
          ) {
            return false
          }

          this._search_option_valid_pin_matches[id] = {
            input: {
              ref: valid_ref_input_matches,
              data: valid_data_input_matches,
            },
            output: {
              data: valid_data_output_matches,
              ref: valid_ref_output_matches,
            },
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
    setTimeout(() => {
      // AD HOC
      this._set_search_text('')
      this._set_search_selected(spec_id)
      this._show_search()
      this._set_search_selected(spec_id)
    }, 0)
  }

  private _change_datum = (datum_node_id: string): void => {
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    const tree = this._datum_tree[datum_id]
    const value = tree.value

    const specs = { ...this.$system.specs, ...this.$pod.specs }
    const classes = this.$system.classes
    const type = _getValueType(specs, tree)

    const pin_node_id = this._datum_to_pin[datum_node_id]

    if (pin_node_id) {
      this._yellow_click_pin(pin_node_id)
    } else {
      let next_value: string
      do {
        next_value = randomValueOfType(specs, type)
      } while (value === next_value && value !== 'null')
      const next_tree = _getValueTree(next_value)
      let datum = this._datum[datum_node_id]
      if (next_tree.type === TreeNodeType.Unit) {
        datum = datum as ClassDatum
        const { value } = next_tree
        const id = idFromUnitValue(value)
        datum.setProp('id', id)
        this._datum_tree[datum_id] = next_tree
        this._refresh_class_literal_datum_node_selection(datum_node_id)
      } else {
        datum = datum as Datum
        datum.setProp('data', next_tree)
      }
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
    const { type, pinId } = segmentExposedNodeId(exposed_node_id)
    return this.__is_exposed_pin_functional(type, pinId)
  }

  private __is_exposed_pin_functional = (type: IO, id: string): boolean => {
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
    const { type, pinId } = segmentExposedNodeId(exposed_node_id)
    this._set_exposed_pin_functional(exposed_node_id, functional)
    this._dispatch_action(setPinSetFunctional(type, pinId, functional))
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
    const { type, pinId } = segmentExposedNodeId(exposed_node_id)
    this._spec = specReducer.setPinSetFunctional(
      { type, pinId, functional },
      this._spec
    )
  }

  private _sim_set_exposed_pin_functional = (
    exposed_node_id: string,
    functional: boolean
  ): void => {
    const { type, pinId } = segmentExposedNodeId(exposed_node_id)
    const pin_spec = this._get_exposed_pin_spec(type, pinId)
    const { pin = {} } = pin_spec
    for (let subPinId in pin) {
      const ext_node_id = getExtNodeId(type, pinId, subPinId)
      const end_marker = this._exposed_link_end_marker[ext_node_id]
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
    const { type, pinId } = segmentExposedNodeId(exposed_node_id)
    this._pod.$setPinSetFunctional({
      type,
      pinId,
      functional,
    })
  }

  public _spec_set_exposed_pin_ref = (
    type: IO,
    pinId: string,
    ref: boolean
  ): void => {
    this._spec = specReducer.setPinSetRef({ type, pinId, ref }, this._spec)
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

      link_base.$element.style.strokeDasharray = '3'
    } else {
      this._link_pin_constant_count--

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

      link_base.$element.style.strokeWidth = '1px'
    } else {
      this._link_pin_memory_count--

      link_base.$element.style.strokeWidth = '3px'
    }
    let pin_link_current_color = this._theme.link
    if (
      this._hover_node_id[pin_node_id] &&
      ['add', 'remove', 'change'].indexOf(this._mode) > -1
    ) {
      pin_link_current_color = getThemeLinkModeColor($theme, this._mode)
    }
    const pin_link_end_marker_d = memory ? ARROW_MEMORY : ARROW_NORMAL
    const pin_link_end_marker_fill = memory ? 'none' : pin_link_current_color
    const pin_link_end_marker_stroke = memory ? pin_link_current_color : 'none'
    const pin_link_end_marker_stroke_width = memory ? '1px' : '0'
    link_arrow.setProp('d', pin_link_end_marker_d)
    link_arrow.$element.style.fill = pin_link_end_marker_fill
    link_arrow.$element.style.stroke = pin_link_end_marker_stroke
    link_arrow.$element.style.strokeWidth = pin_link_end_marker_stroke_width
    link.padding = link.padding || { source: 0, target: 0 }
    if (memory) {
      link.padding.target = -1
    } else {
      link.padding.target = -5.75
    }
    this._tick_link(link_id)

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
    console.log('Graph', '_on_datum_double_click', node_id)

    if (this._mode === 'none') {
      const datum_overlay = this._datum_overlay[node_id]

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
    } else if (this._mode === 'data') {
      this._on_data_background_double_click(event)
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

  public enter_subgraph = (unit_id: string, animate: boolean): void => {
    this._enter_subgraph(unit_id, animate)
  }

  private _unplug_sub_component_root_base_frame = (
    sub_component_id: string
  ) => {
    const base = this._get_sub_component_root_base(sub_component_id)

    return this._unplug_base_frame(sub_component_id, base)
  }

  private _unplug_sub_component_base_frame = (sub_component_id: string) => {
    const base = this._get_sub_component_base(sub_component_id)

    return this._unplug_base_frame(sub_component_id, base)
  }

  private _unplug_base_frame = (sub_component_id: string, base: LayoutBase) => {
    for (const leaf of base) {
      const [leaf_path, leaf_comp] = leaf
      const leaf_id = getLeafId([sub_component_id, ...leaf_path])
      this._unplug_leaf_frame(leaf_id, leaf_comp)
    }
  }

  public mem_enter_subgraph = (unit_id: string, graph: _GraphComponent) => {
    this._mem_enter_subgraph(unit_id, graph)
  }

  private _mem_enter_subgraph = (unit_id: string, graph: _GraphComponent) => {
    this._subgraph_unlisten = graph.addEventListeners([
      makeCustomListener('leave', this._on_subgraph_leave),
      makeCustomListener('enterunit', this._on_subgraph_enter_unit),
      makeCustomListener('leaveunit', this._on_subgraph_leave_unit),
    ])

    this._subgraph_graph = graph
    this._subgraph_unit_id = unit_id
    this._subgraph_depth = 1 + graph.get_subraph_depth()
  }

  public dom_enter_subgraph = (
    unit_id: string,
    graph: _GraphComponent,
    animate: boolean
  ) => {
    this._dom_enter_subgraph(unit_id, graph, animate)
  }

  private _dom_enter_subgraph = (
    unit_id: string,
    graph: _GraphComponent,
    animate: boolean
  ) => {
    this._subgraph_graph._graph.$element.style.opacity = '1'
    this._subgraph_graph._graph.$element.style.pointerEvents = 'inherit'

    this._subgraph.$element.style.pointerEvents = 'inherit'
    this._subgraph.$element.style.opacity = '1'

    this._main.$element.style.pointerEvents = 'none'
    this._main.$element.style.transform = ifLinearTransition(animate, 'opacity')
    this._main.$element.style.opacity = '0.25'
  }

  private _enter_subgraph = (
    unit_id: string,
    _animate?: boolean,
    opt?: Dict<{ base: LayoutBase; base_node: LayoutNode[] }>
  ): void => {
    const {
      specs,
      api: {
        text: { measureText },
      },
    } = this.$system

    let { animate } = this.$props

    if (_animate !== undefined) {
      animate = _animate
    }

    this._force_control_animation_false = true

    const unit: GraphUnitSpec = this._get_unit(unit_id)

    const { id } = unit

    if (isBaseSpecId(specs, id)) {
      return
    }

    const color = this._get_color()

    for (const component_id in this._selected_component) {
      this._disable_core_resize(component_id)
    }

    const is_component = this._is_unit_component(unit_id)

    let fullwindow = false

    let sub_component = this._get_sub_component(unit_id)

    if (is_component) {
      if (this._is_sub_component_fullwindow(unit_id)) {
        fullwindow = true
      }

      const { k } = this._zoom

      if (!opt) {
        opt = {}

        for (const sub_sub_component_id in sub_component.$subComponent) {
          const sub_sub_component =
            sub_component.$subComponent[sub_sub_component_id]

          const base = sub_sub_component.getRootBase()

          const base_node = []

          for (const sub_sub_component_leaf of base) {
            const [leaf_path, leaf_comp] = sub_sub_component_leaf

            const leaf_trait = extractTrait(leaf_comp, measureText)

            base_node.push(leaf_trait)
          }

          opt[sub_sub_component_id] = { base, base_node }
        }
      }
    }

    if (this._is_fullwindow) {
      this._subgraph_return_fullwindow = true
      this._subgraph_return_fullwindow_component_ids =
        this._fullwindow_component_ids

      this._leave_all_fullwindow(true, NOOP)
    }

    if (is_component) {
      if (!this._animating_sub_component_base_id.has(unit_id)) {
        this._leave_sub_component_frame(unit_id)
        this._decompose_sub_component(unit_id)
      } else {
        this._unplug_sub_component_root_base_frame(unit_id)
        this._abort_tree_layout_animation(unit_id)
      }
    }

    let graph = this._subgraph_cache[unit_id]

    if (graph) {
      //
    } else {
      if (!sub_component) {
        sub_component = parentComponent({}, this.$system, this.$pod)
      }

      const pod = this._get_subgraph_pod(unit_id)

      graph = new _GraphComponent(
        {
          pod,
          style: { color },
          disabled: true,
          parent: this,
          frame: this._frame,
          frameOut: this._frame_out,
          fullwindow,
          component: sub_component,
        },
        this.$system,
        this.$pod
      )

      this.cache_subgraph(unit_id, graph)
    }

    this._mem_enter_subgraph(unit_id, graph)
    this._dom_enter_subgraph(unit_id, graph, animate)

    this._disable_transcend()

    graph.enter(animate, opt)
    graph.setProp('disabled', false)
    graph.focus()

    this.dispatchEvent('enterunit', {}, false)
  }

  private _animate_sub_sub_component_leaf(
    sub_sub_component_base: [string[], Component<any, {}, $Component>][],
    i: number,
    sub_sub_component_id: string,
    sub_sub_component_base_position: Point[],
    sub_sub_component_base_size: Size[],
    sub_sub_component: Component<any, {}, $Component>,
    between_container: Frame,
    sub_sub_component_parent_id: string,
    sub_component: Component<any, {}, $Component>,
    sub_context: Context,
    draw_rect: (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string
    ) => SVGRectElement,
    _sub_sub_component_position: Dict<Point>,
    _sub_sub_component_size: Dict<Size>,
    sub_sub_component_base_leaf_end_count: number,
    sub_sub_component_base_length: number,
    sub_sub_component_end_count: number,
    sub_sub_components_length: number,
    unit_id: string
  ) {
    return {
      sub_sub_component_base_leaf_end_count,
      sub_sub_component_end_count,
    }
  }

  public cache_subgraph(unit_id: string, graph: _GraphComponent) {
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
      // for (const sub_component_id in this._component.$subComponent) {
      //   if (this._animating_sub_component_base_id.has(sub_component_id)) {
      //     this._enter_sub_component_frame(sub_component_id)
      //   }
      // }
    }
  }

  public _lose_component_control = (): void => {
    // console.log('Graph', '_lose_component_control')

    if (!this._in_component_control) {
      return
    }

    this._in_component_control = false

    if (this._is_fullwindow) {
      this._decouple_all_fullwindow_component()
      this._leave_component_frame()
    } else {
      // this._leave_all_sub_component_frame()
      for (const sub_component_id in this._component.$subComponent) {
        if (!this._animating_sub_component_base_id.has(sub_component_id)) {
          this._leave_sub_component_frame(sub_component_id)
        }
      }
    }
  }

  private _animating_sub_component_base_id: Set<string> = new Set()

  public enter = (
    animate: boolean,
    animate_config: Dict<{ base: LayoutBase; base_node: LayoutNode[] }> = {}
  ): void => {
    // console.log('Graph', 'enter', animate, animate_config)

    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    this._force_control_animation_false = true

    if (animate) {
      const leaf_layer = this._foreground

      for (const sub_component_id in this._component.$subComponent) {
        const frame = this._get_sub_component_frame(sub_component_id)

        const { base, base_node } = animate_config[sub_component_id]

        let i = 0
        for (const leaf of base) {
          const [leaf_path] = leaf
          const leaf_id = getLeafId([sub_component_id, ...leaf_path])
          const leaf_node = base_node[i]
          this._leaf_frame_node[leaf_id] = leaf_node
          i++
        }

        this._remove_sub_component_root_base(sub_component_id)

        const style = extractStyle(frame, measureText)
        const trait = extractTrait(frame, measureText)

        let base_trait = this._reflect_sub_component_base_trait(
          sub_component_id,
          base,
          style,
          trait
        )

        const base_length = base.length

        i = 0
        this._abort_tree_layout_sub_component_base_animation[sub_component_id] =
          this._animate_sub_component_base(
            sub_component_id,
            base,
            base_node,
            leaf_layer,
            (leaf_id) => {
              if (i === 0) {
                base_trait = this._reflect_sub_component_base_trait(
                  sub_component_id,
                  base,
                  style,
                  trait
                )
              }

              const { x, y } = this._get_node_screen_position(sub_component_id)
              const { width, height } = this._get_node_size(sub_component_id)
              const { k } = this._zoom

              // const _x = x + ((k - 1) * width) / 2
              // const _y = y + ((k - 1) * height) / 2
              const _x = x
              const _y = y

              let _trait = base_trait[leaf_id]

              i = (i + 1) % base_length

              return {
                x: _x + _trait.x,
                y: _y + _trait.y,
                width: _trait.width,
                height: _trait.height,
                // k: _trait.k * k,
                k: _trait.k,
                opacity: _trait.opacity,
                fontSize: _trait.fontSize,
              }
            },
            () => {
              this._unplug_sub_component_base_frame(sub_component_id)

              this._enter_sub_component_frame(sub_component_id)
              this._commit_sub_component_base(sub_component_id)
            }
          )
      }
    }

    this._take_component_control()

    this._setup_pod(this._pod)
  }

  public _get_base_trait = (base: LayoutBase) => {
    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    const { k } = this._zoom

    const sub_base_node = []

    const sub_component_position = {}
    const sub_component_size = {}

    const sub_component_base: Dict<LayoutBase> = {}
    const sub_component_base_node: Dict<LayoutNode[]> = {}

    for (const leaf of base) {
      const [leaf_path, leaf_comp] = leaf

      const leaf_trait = extractTrait(leaf_comp, measureText)

      sub_base_node.push(leaf_trait)
    }

    for (const sub_component_id in this._component.$subComponent) {
      const position = this._get_node_screen_position(sub_component_id)
      const size = this._get_node_size(sub_component_id)
      const { base, base_node } =
        this._get_sub_component_base_trait(sub_component_id)

      sub_component_position[sub_component_id] = position
      sub_component_size[sub_component_id] = size
      sub_component_base[sub_component_id] = base
      sub_component_base_node[sub_component_id] = base_node
    }

    const all_sub_component_trait = {
      sub_component_position,
      sub_component_size,
      sub_component_base,
      sub_component_base_node,
      sub_base: base,
      sub_base_node,
    }

    return all_sub_component_trait
  }

  public _get_all_sub_component_root_base_trait = () => {
    const base = this._component.getRootBase()

    return this._get_base_trait(base)
  }

  public _get_all_sub_component_base_trait = () => {
    const base = this._component.getBase()

    return this._get_base_trait(base)
  }

  public leave = (all_sub_component_base_trait?): void => {
    // console.log('Graph', 'leave', all_sub_component_base_trait)

    if (this._subgraph_unit_id) {
      this._subgraph_graph.leave(all_sub_component_base_trait)
    } else {
      const { parent } = this.$props

      this._force_control_animation_false = true

      if (parent) {
        const { units, links, merges, data, inputs, outputs } =
          this._segregate_node_id(this._pressed_node_id_pointer_id)

        all_sub_component_base_trait =
          all_sub_component_base_trait ||
          this._get_all_sub_component_base_trait()

        for (const sub_component_id in this._component.$subComponent) {
          if (this._animating_sub_component_base_id.has(sub_component_id)) {
            this._unplug_sub_component_root_base_frame(sub_component_id)

            this._abort_tree_layout_animation(sub_component_id)
          }

          this._remove_sub_component_root_base(sub_component_id)
        }

        const scale = this._zoom.k

        this._plunk_pod(this._pod)

        this._lose_component_control()

        this._disable_transcend()

        this.dispatchEvent(
          'leave',
          {
            clipboard: { units, links, merges, data, inputs, outputs },
            component: all_sub_component_base_trait,
            scale,
          },
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

            if (this._multiselect_area_ing) {
              this._on_multiselect_area_end()
            }

            this._compose()
          }
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

  private _get_sub_component_base_trait(sub_component_id: string): {
    base: LayoutBase
    base_node: LayoutNode[]
  } {
    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    const base_node = []

    const context = this._get_sub_component_frame_context(sub_component_id)
    const base = this._get_sub_component_base(sub_component_id)

    for (const sub_component_base_leaf of base) {
      const [_, leaf_comp] = sub_component_base_leaf

      const leaf_element = leaf_comp.$element

      const leaf_node = extractTrait(leaf_comp, measureText)

      base_node.push(leaf_node)
    }

    const _base = base.map(([path, comp]) => [
      [sub_component_id, ...path],
      comp,
    ]) as LayoutBase

    return { base: _base, base_node }
  }

  private _compose(): void {
    const all_sub_component_trait = this._get_all_sub_component_base_trait()

    this._lose_component_control()

    if (this._is_shift_pressed()) {
      this._set_crud_mode('none')
    }

    this.dispatchEvent('compose', all_sub_component_trait, false)
  }

  private _on_subgraph_leave = ({
    clipboard: { units, data },
    component: {
      sub_component_position,
      sub_component_trait: sub_component_trait,
      sub_component_base,
      sub_component_base_node,
      sub_base,
      sub_base_node,
    },
    scale,
  }: {
    clipboard: {
      units: string[]
      data: string[]
    }
    component: {
      sub_component_position: Dict<Position>
      sub_component_trait: Dict<LayoutNode>
      sub_component_base: Dict<LayoutBase>
      sub_component_base_node: Dict<LayoutNode[]>
      sub_base: LayoutBase
      sub_base_node: LayoutNode[]
    }
    scale: number
  }) => {
    // log(data)
    this._leave_subgraph(
      sub_component_position,
      sub_component_trait,
      sub_component_base,
      sub_component_base_node,
      sub_base,
      sub_base_node,
      scale
    )
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
    this._main.$element.style.opacity = `${opacity}`
  }

  public leave_subgraph = (): void => {
    this._leave_subgraph()
  }

  private _leave_subgraph = (
    sub_component_position: Dict<Position> = {},
    sub_component_trait: Dict<LayoutNode> = {},
    sub_component_base: Dict<LayoutBase> = {},
    sub_component_base_node: Dict<LayoutNode[]> = {},
    sub_base: LayoutBase = [],
    sub_base_node: LayoutNode[] = [],
    sub_scale: number = 1
  ): void => {
    const { animate } = this.$props

    // console.log('Graph', '_leave_subgraph', child_component_position)

    if (this._subgraph_graph && this._subgraph_unit_id) {
      this._force_control_animation_false = true

      // recursively leave unit
      this._subgraph_graph._leave_subgraph()

      const unit_id = this._subgraph_unit_id

      this._subgraph_unlisten()

      this._subgraph_depth = 0

      this._subgraph_graph.setProp('disabled', true)

      this._subgraph.$element.style.pointerEvents = 'none'
      this._subgraph.$element.style.opacity = '0'

      this._subgraph_graph._graph.$element.style.pointerEvents = 'none'
      this._subgraph_graph._graph.$element.style.opacity = '0'

      this._main.$element.style.opacity = '1'
      this._main.$element.style.pointerEvents = 'inherit'

      this._refresh_main_opacity()

      this._subgraph_graph = null
      this._subgraph_unit_id = null

      for (const component_id in this._selected_component) {
        this._enable_core_resize(component_id)
      }

      if (this._is_unit_component(unit_id)) {
        if (animate) {
          this._animate_sub_component_graph_leave(
            unit_id,
            sub_component_position,
            sub_component_trait,
            sub_component_base,
            sub_component_base_node,
            sub_base,
            sub_base_node,
            sub_scale
          )
        } else {
          this._compose_sub_component(unit_id)
          this._enter_sub_component_frame(unit_id)
        }
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

  private _is_component_framed: boolean = false

  private _enter_component_frame = (): void => {
    // console.log('Graph', '_enter_component_frame')

    this._frame.appendChild(this._component)

    this._is_component_framed = true
  }

  private _leave_component_frame = (): void => {
    // console.log('Graph', '_leave_component_frame')

    this._frame.removeChild(this._component)

    this._is_component_framed = false
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

  private _commit_sub_component_root_base = (
    sub_component_id: string
  ): void => {
    // console.log('Graph', '_commit_sub_component_root_base', sub_component_id)

    const root_base = this._get_sub_component_root_base(sub_component_id)

    return this.___commit_sub_component_base(
      sub_component_id,
      root_base,
      (parent, leaf_comp) => {
        parent.appendParentRoot(leaf_comp)
      },
      (leaf_parent, leaf_comp) => {
        leaf_parent.appendRoot(leaf_comp)
      }
    )
  }

  private _commit_sub_component_base = (sub_component_id: string): void => {
    // console.log('Graph', '_layout_sub_component_commit_base', sub_component_id)

    return this.__commit_sub_component_base(
      sub_component_id,
      (parent, leaf_comp) => {
        parent.appendParentRoot(leaf_comp)
      },
      (leaf_parent, leaf_comp) => {
        leaf_parent.appendRoot(leaf_comp)
      }
    )
  }

  private _mem_commit_sub_component_base = (sub_component_id: string): void => {
    // console.log('Graph', '_mem_commit_sub_component_base', sub_component_id)

    return this.__commit_sub_component_base(
      sub_component_id,
      (parent, leaf_comp) => {
        const at = this.$mountParentRoot.length
        parent.memAppendParentRoot(leaf_comp, 'default', at)
      },
      (leaf_parent, leaf_comp) => {
        leaf_parent.memAppendRoot(leaf_comp)
      }
    )
  }

  private _dom_commit_sub_component_base = (sub_component_id: string): void => {
    // console.log('Graph', '_dom_commit_sub_component_base', sub_component_id)

    return this.__commit_sub_component_base(
      sub_component_id,
      (parent, leaf_comp) => {
        const at = this.$mountParentRoot.length - 1
        parent.domAppendParentRoot(leaf_comp, 'default', at)
      },
      (leaf_parent, leaf_comp) => {
        leaf_parent.domAppendRoot(leaf_comp)
      }
    )
  }

  private _post_commit_sub_component_base = (
    sub_component_id: string
  ): void => {
    // console.log('Graph', '_post_commit_sub_component_base', sub_component_id)

    return this.__commit_sub_component_base(
      sub_component_id,
      (parent, leaf_comp) => {
        const at = this.$mountParentRoot.length - 1
        parent.postAppendParentRoot(leaf_comp, 'default', at)
      },
      (leaf_parent, leaf_comp) => {
        leaf_parent.postAppendRoot(leaf_comp)
      }
    )
  }

  private __commit_sub_component_base = (
    sub_component_id: string,
    callback: (parent: Component, leaf_comp: Component) => void,
    _callback: (leaf_parent: Component, leaf_comp: Component) => void
  ): void => {
    // console.log('Graph', '_layout_sub_component_commit_base', sub_component_id)

    const base = this._get_sub_component_base(sub_component_id)

    return this.___commit_sub_component_base(
      sub_component_id,
      base,
      callback,
      _callback
    )
  }

  private ___commit_sub_component_base = (
    sub_component_id: string,
    base: LayoutBase,
    callback: (parent: Component, leaf_comp: Component) => void,
    _callback: (leaf_parent: Component, leaf_comp: Component) => void
  ): void => {
    // console.log('Graph', '_layout_sub_component_commit_base', sub_component_id)

    const sub_component = this._get_sub_component(sub_component_id)

    for (const leaf of base) {
      const [leaf_path, leaf_comp] = leaf

      const leaf_parent_last = leaf_path[leaf_path.length - 1]
      const leaf_parent_path = leaf_path.slice(0, -1)

      const leaf_parent = sub_component.pathGetSubComponent(leaf_parent_path)

      if (leaf_parent === leaf_comp) {
        //
      } else {
        const parent_id = leaf_parent.getSubComponentParentId(leaf_parent_last)
        if (parent_id) {
          const parent = leaf_parent.getSubComponent(parent_id)
          if (!parent.$mountParentRoot.includes(leaf_comp)) {
            callback(parent, leaf_comp)
          }
        } else {
          if (!leaf_parent.$mountRoot.includes(leaf_comp)) {
            _callback(leaf_parent, leaf_comp)
          }
        }
      }
    }
  }

  private _layout_sub_components_commit_base = (
    sub_component_ids: string[]
  ): void => {
    for (const sub_component_id of sub_component_ids) {
      this._commit_sub_component_base(sub_component_id)
    }
  }

  private _dom_layout_sub_components_commit_base = (
    sub_component_ids: string[]
  ): void => {
    for (const sub_component_id of sub_component_ids) {
      this._dom_commit_sub_component_base(sub_component_id)
    }
  }

  private _post_layout_sub_components_commit_base = (
    sub_component_ids: string[]
  ): void => {
    for (const sub_component_id of sub_component_ids) {
      this._dom_commit_sub_component_base(sub_component_id)
    }
  }

  private _layout_enter_sub_component = (sub_component_id: string): void => {
    // console.log('Graph', '_layout_enter_sub_component', sub_component_id)

    const { animate } = this.$props

    const prev_layout_layer =
      this._get_spec_parent_layout_layer(sub_component_id)

    this._layout_path.push(sub_component_id)

    const layout_layer = this._ensure_layout_layer(sub_component_id)

    const children = this._get_sub_component_spec_children(sub_component_id)

    this._refresh_layout_node_target_position(sub_component_id)

    const layout_parent_node = this._layout_node[sub_component_id]

    const { x, y, width, height } = layout_parent_node

    if (animate) {
      this._animate_all_current_layout_layer_node()

      for (const child_id of children) {
        this._measure_sub_component_base(child_id)

        this._set_layout_core_position(child_id, x, y)
        this._set_layout_core_size(child_id, width, height)
      }

      for (const child_id of children) {
        if (!this._animating_sub_component_base_id.has(child_id)) {
          this._remove_sub_component_parent_root(sub_component_id, child_id)
          this._remove_sub_component_root_base(child_id)
        }
      }

      this._animate_layout_sub_component_remove_children(
        sub_component_id,
        'default',
        children,
        () => {
          for (const child_id of children) {
            this._enter_sub_component_frame(child_id)
            this._commit_sub_component_base(child_id)
          }
        }
      )

      for (const child_id of children) {
        this._animate_layout_core_target(
          child_id,
          child_id,
          this._layout_node[child_id],
          () => {}
        )
      }
    } else {
      // TODO
    }

    prev_layout_layer.layer.$element.style.overflowY = 'hidden'
    prev_layout_layer.children.$element.style.overflowY = 'hidden'

    this._refresh_all_layout_layer_opacity()

    prev_layout_layer.children.$element.style.pointerEvents = 'none'

    prev_layout_layer.layers.$element.style.pointerEvents = 'inherit'

    layout_layer.layer.$element.style.overflowY = 'auto'
    layout_layer.layer.$element.style.overflowX = 'auto'

    layout_layer.children.$element.style.overflowX = 'initial'
    layout_layer.children.$element.style.overflowY = 'initial'

    layout_layer.children.$element.style.opacity = '1'
  }

  private _layout_leave_sub_component = () => {
    // console.log('Graph', '_layout_leave_sub_component')

    const { animate } = this.$props

    const sub_component_id = this._get_current_layout_layer_id()

    const children = this._get_sub_component_spec_children(sub_component_id)

    this._layout_path.pop()

    const next_unit_id = this._get_current_layout_layer_id()

    const next_layout_layer = next_unit_id
      ? this._layout_layer[next_unit_id]
      : this._layout_root

    const layout_layer = this._layout_layer[sub_component_id]

    layout_layer.layer.$element.style.overflowX = 'hidden'
    layout_layer.layer.$element.style.overflowY = 'hidden'

    layout_layer.children.$element.style.opacity = '0'

    layout_layer.children.$element.style.overflowY = 'initial'
    layout_layer.children.$element.style.overflowX = 'initial'

    next_layout_layer.children.$element.style.opacity = '1'

    next_layout_layer.layer.$element.style.overflowY = 'auto'
    next_layout_layer.layer.$element.style.overflowX = 'auto'

    next_layout_layer.children.$element.style.overflowX = 'initial'
    next_layout_layer.children.$element.style.overflowY = 'initial'

    this._refresh_all_layout_layer_opacity()

    next_layout_layer.children.$element.style.pointerEvents = 'inherit'

    next_layout_layer.layers.$element.style.pointerEvents = 'none'

    if (animate) {
      for (const child_id of children) {
        this._measure_sub_component_base(child_id)
      }

      for (const child_id of children) {
        if (!this._animating_sub_component_base_id.has(child_id)) {
          this._leave_sub_component_frame(child_id)
          this._remove_sub_component_root_base(child_id)
        }
      }

      this._animate_layout_append_children(
        sub_component_id,
        children,
        'default',
        () => {
          for (const child_id of children) {
            this._insert_sub_component_child(sub_component_id, child_id)
          }

          this._layout_sub_components_commit_base(children)
        }
      )

      for (const child_id of children) {
        this._animate_layout_core_target(
          child_id,
          sub_component_id,
          this._layout_node[child_id],
          () => {}
        )
      }
    }
  }

  private _ensure_layout_layer = (parent_id: string | null): LayoutLayer => {
    if (parent_id === null) {
      return this._layout_root
    }

    let layout_layer = this._layout_layer[parent_id]

    if (!layout_layer) {
      layout_layer = this._create_layout_layer({
        className: 'graph-layout-layer',
        style: {},
      })

      const parent_layer = this._get_spec_parent_layout_layer(parent_id)

      parent_layer.layers.appendChild(layout_layer.layer)

      this._layout_layer[parent_id] = layout_layer
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
      this._layout_enter_sub_component(node_id)
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

  private _long_press_append_sub_component_children = (
    parent_id: string,
    children: string[],
    slot_name: string = 'default'
  ): void => {
    // console.log(
    //   'Graph',
    //   '_long_press_append_sub_component_children',
    //   parent_id,
    //   children,
    //   slot_name
    // )

    const { animate } = this.$props

    // this._cancel_tree_layout_animation()

    this._ensure_layout_layer(parent_id)

    const current_layer_id = this._get_current_layout_layer_id()

    for (const child_id of children) {
      this._abort_tree_layout_animation(child_id)

      this._pre_append_sub_component_child(parent_id, child_id, slot_name)
    }

    if (animate) {
      const spec_children = this._get_sub_component_spec_children(parent_id)

      const parent_component = this._get_sub_component(parent_id)

      const slot_children = spec_children.filter((sub_component_id) => {
        const child_sub_component = this._get_sub_component(sub_component_id)

        if (parent_component.$mountParentRoot.includes(child_sub_component)) {
          return true
        } else {
          return false
        }
      })

      const all_children = [...slot_children, ...children]

      for (const child_id of all_children) {
        this._measure_sub_component_base(child_id)
      }

      for (const child_id of all_children) {
        if (!this._animating_sub_component_base_id.has(child_id)) {
          this._remove_sub_component_root_base(child_id)
        }
      }

      for (const child_id of slot_children) {
        if (!this._animating_sub_component_base_id.has(child_id)) {
          this._remove_sub_component_parent_root(parent_id, child_id)
        }
      }

      for (const child_id of children) {
        if (!this._animating_sub_component_base_id.has(child_id)) {
          this._leave_sub_component_frame(child_id)
        }
      }

      this._animate_layout_append_children(
        parent_id,
        all_children,
        slot_name,
        () => {
          for (const child_id of slot_children) {
            this._insert_sub_component_child(parent_id, child_id)
          }

          for (const child_id of children) {
            this._insert_sub_component_child(parent_id, child_id)
          }

          this._layout_sub_components_commit_base(all_children)

          this._animate_all_current_layout_layer_node()
        }
      )

      for (const child_id of children) {
        this._animate_layout_core_anchor(
          child_id,
          this._layout_node[child_id],
          () => {
            this._layout_layer_move_sub_component_child(
              current_layer_id,
              parent_id,
              child_id
            )
          }
        )
      }
    } else {
      for (const child_id of children) {
        this._layout_layer_move_sub_component_child(
          current_layer_id,
          parent_id,
          child_id
        )
        this._insert_sub_component_child(parent_id, child_id)

        const { x, y } = this._layout_target_node[child_id]

        this._set_layout_core_position(child_id, x, y)
      }
    }
  }

  private _mem_append_sub_component_child = (
    parent_id: string,
    child_id: string,
    slot_name: string
  ): void => {}

  private _pre_append_sub_component_child = (
    parent_id: string,
    child_id: string,
    slot_name: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_pre_append_sub_component_child',
    //   parent_id,
    //   child_id
    // )

    const is_child_fullwindow = this._is_sub_component_fullwindow(child_id)

    if (is_child_fullwindow) {
      this._decouple_sub_component(child_id)
    }

    this._mem_push_parent_root(parent_id, child_id, slot_name)
    this._spec_append_sub_component_child(parent_id, child_id, slot_name)
    this._pod_append_sub_component_child(parent_id, child_id, slot_name)

    if (is_child_fullwindow) {
      this._couple_sub_component(child_id)
    }

    this._refresh_current_layout_node_target_position()
  }

  private _animate_enter_fullwindow = (
    sub_component_ids: string[],
    callback: Callback
  ): Unlisten => {
    // console.log('Graph', '_animate_enter_fullwindow', sub_component_ids)

    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    let all_base = []

    for (const sub_component_id of sub_component_ids) {
      this._measure_sub_component_base(sub_component_id)

      const { base } = this._get_sub_component_base_trait(sub_component_id)

      all_base = [...all_base, ...base]
    }

    const fontSize = this._component.getFontSize()
    const k = 1
    const opacity = 1

    const style = {}
    const trait = {
      x: this.$context.$x,
      y: this.$context.$y,
      width: this.$context.$width,
      height: this.$context.$height,
      k,
      opacity,
      fontSize,
    }

    let all_trait = reflectComponentBaseTrait(
      this._component,
      all_base,
      style,
      trait,
      measureText
    )

    const leaf_total = all_base.length

    const sub_component_total = sub_component_ids.length

    let sub_component_end_count = 0

    let i = 0

    const all_abort: Unlisten[] = []

    for (const sub_component_id of sub_component_ids) {
      const base = this._get_sub_component_root_base(sub_component_id)
      const layer = this._get_foreground()

      const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)

      if (!this._animating_sub_component_base_id.has(sub_component_id)) {
        if (this._tree_layout) {
          if (parent_id) {
            this._remove_sub_component_parent_root(parent_id, sub_component_id)
          } else {
            this._leave_sub_component_frame(sub_component_id)
          }
        } else {
          this._leave_sub_component_frame(sub_component_id)
        }

        this._remove_sub_component_root_base(sub_component_id)
      }

      const abort = this._animate_sub_component_base(
        sub_component_id,
        base,
        [],
        layer,
        (leaf_id: string) => {
          if (i === 0) {
            all_trait = reflectComponentBaseTrait(
              this._component,
              all_base,
              style,
              trait,
              measureText
            )
          }

          const _trait = all_trait[leaf_id]

          i = (i + 1) % leaf_total

          return {
            x: _trait.x,
            y: _trait.y,
            width: _trait.width,
            height: _trait.height,
            k: _trait.k,
            opacity: _trait.opacity,
            fontSize: _trait.fontSize,
          }
        },
        () => {
          sub_component_end_count++

          if (sub_component_end_count === sub_component_total) {
            callback()
          }
        }
      )

      all_abort.push(abort)
    }

    return callAll(all_abort)
  }

  private _measure_all_sub_component_base = (
    sub_component_ids: string[]
  ): void => {
    for (const sub_component_id of sub_component_ids) {
      this._measure_sub_component_base(sub_component_id)

      const { base } = this._get_sub_component_base_trait(sub_component_id)
    }
  }

  private _animate_leave_fullwindow = (
    sub_component_ids: string[],
    callback: Callback<string>,
    end: Callback
  ): Unlisten => {
    // console.log('Graph', '_animate_leave_fullwindow', sub_component_ids)

    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    const all_unlisten = []

    this._measure_all_sub_component_base(sub_component_ids)

    const sub_component_total = sub_component_ids.length

    let sub_component_end_leaf_count = 0

    const all_parent_id: Dict<string> = {}
    const all_parent_children: Dict<string[]> = {}

    const all_parent_base: Dict<Dict<LayoutBase>> = {}
    const all_root_base: Dict<LayoutBase> = {}

    for (const sub_component_id of sub_component_ids) {
      const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)
      const base = this._get_component_sub_component_root_base(sub_component_id)

      if (this._tree_layout) {
        const parent_visible =
          this._is_layout_component_layer_visible(parent_id)

        if (parent_id && !parent_visible) {
          if (parent_visible) {
            all_root_base[sub_component_id] =
              all_root_base[sub_component_id] || []
            all_root_base[sub_component_id] = [
              ...all_root_base[sub_component_id],
              ...base,
            ]
          } else {
            const slot_name =
              this._get_sub_component_slot_name(sub_component_id)

            all_parent_base[parent_id] = all_parent_base[parent_id] || {}
            all_parent_base[parent_id][slot_name] =
              all_parent_base[parent_id][slot_name] || []
            all_parent_base[parent_id][slot_name] = [
              ...all_parent_base[parent_id][slot_name],
              ...base,
            ]
            all_parent_id[sub_component_id] = parent_id

            all_parent_children[parent_id] =
              all_parent_children[parent_id] || []
            all_parent_children[parent_id].push(sub_component_id)
          }
        } else {
          all_root_base[sub_component_id] =
            all_root_base[sub_component_id] || []
          all_root_base[sub_component_id] = [
            ...all_root_base[sub_component_id],
            ...base,
          ]
        }
      } else {
        all_root_base[sub_component_id] = all_root_base[sub_component_id] || []
        all_root_base[sub_component_id] = [
          ...all_root_base[sub_component_id],
          ...base,
        ]
      }
    }

    const all_trait: Dict<LayoutNode> = {}

    const reset_all_trait = () => {
      for (const sub_component_id in all_root_base) {
        const base = all_root_base[sub_component_id]

        const frame = this._get_sub_component_frame(sub_component_id)

        const context = this._get_sub_component_frame_context(sub_component_id)

        const parent_style = extractStyle(frame, measureText)
        const parent_trait = extractTrait(frame, measureText)

        const children = base.map(([_, leaf_comp]) => leaf_comp)

        const children_style = children.map((c) => extractStyle(c, measureText))

        const parent_base_trait = reflectChildrenTrait(
          parent_trait,
          parent_style,
          children_style
        )

        let i = 0

        for (const [leaf_path] of base) {
          const leaf_trait = parent_base_trait[i]

          const _leaf_trait: LayoutNode = {
            x: context.$x + leaf_trait.x,
            y: context.$y + leaf_trait.y,
            width: leaf_trait.width,
            height: leaf_trait.height,
            k: leaf_trait.k,
            opacity: leaf_trait.opacity,
            fontSize: leaf_trait.fontSize,
          }

          const leaf_id = getLeafId(leaf_path)

          all_trait[leaf_id] = _leaf_trait

          i++
        }
      }

      for (const parent_id in all_parent_base) {
        const sub_component = this._get_sub_component(parent_id)

        const parent_base = all_parent_base[parent_id] || {}

        for (const slot_name in parent_base) {
          const parent_slot_base = parent_base[slot_name]

          const slot_id = sub_component.getSlotSubComponentId(slot_name)

          const slot_leaf_id = `${parent_id}/${slot_id}`

          const slot = sub_component.getSlot(slot_name)

          const slot_style = extractStyle(slot, measureText)

          const slot_trait = all_trait[slot_leaf_id]

          const children = parent_slot_base.map(([_, leaf_comp]) => leaf_comp)

          const slot_base_style = children.map((c) =>
            extractStyle(c, measureText)
          )

          const parent_base_trait = reflectChildrenTrait(
            slot_trait,
            slot_style,
            slot_base_style
          )

          let i = 0

          for (const [leaf_path] of parent_slot_base) {
            const parent_leaf_trait = parent_base_trait[i]

            const leaf_trait: LayoutNode = {
              x: slot_trait.x + parent_leaf_trait.x,
              y: slot_trait.y + parent_leaf_trait.y,
              width: parent_leaf_trait.width,
              height: parent_leaf_trait.height,
              k: parent_leaf_trait.k,
              opacity: parent_leaf_trait.opacity,
              fontSize: parent_leaf_trait.fontSize,
            }

            const leaf_id = getLeafId(leaf_path)

            all_trait[leaf_id] = leaf_trait

            i++
          }
        }
      }
    }

    for (const sub_component_id of sub_component_ids) {
      const base = this._get_sub_component_root_base(sub_component_id)

      const layer = this._get_foreground()

      if (!this._animating_sub_component_base_id.has(sub_component_id)) {
        this._remove_sub_component_root_base(sub_component_id)
        this._decouple_sub_component(sub_component_id)
      }

      let i = 0

      const leaf_total = base.length

      const unlisten = this._animate_sub_component_base(
        sub_component_id,
        base,
        [],
        layer,
        (leaf_id: string) => {
          if (i === 0) {
            reset_all_trait()
          }

          const _trait = all_trait[leaf_id]

          i = (i + 1) % leaf_total

          return _trait
        },
        () => {
          callback(sub_component_id)

          sub_component_end_leaf_count++

          if (sub_component_end_leaf_count === sub_component_total) {
            end()
          }
        }
      )

      all_unlisten.push(unlisten)
    }

    return callAll(all_unlisten)
  }

  private _setup_layout_sub_component_append_children_animation = (
    parent_id: string,
    children: string[],
    slot_name: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_setup_layout_sub_component_append_children_animation',
    //   parent_id,
    //   children,
    //   slot_name
    // )

    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    this._cancel_layout_parent_children_animation(parent_id, slot_name)

    this._reset_layout_transfer_parent(parent_id, slot_name)
    this._reset_layout_transfer_parent_children(parent_id, slot_name, children)

    this._layout_transfer_parent_animating[parent_id] = true

    const parent_context = this._get_sub_component_frame_context(parent_id)
    const parent_component = this._get_sub_component(parent_id)

    const slot = parent_component.$slot[slot_name]

    const slot_offset: Component = slot.getOffset()

    const _slot_style = extractStyle(slot_offset, measureText)
    const _leaf_style = []

    type Leaf = [string[], Component]

    const extractLeafComp = (slot_children_base: Leaf[]): Component[] => {
      return slot_children_base.map(([_, comp]) => comp)
    }

    const all_children_base_comp = []

    for (const child_id of children) {
      this._animating_sub_component_base_id.add(child_id)

      const base = this._get_sub_component_base(child_id)

      for (const leaf of base) {
        this._layout_transfer_parent_leaf[parent_id][slot_name].push(leaf)
        this._layout_transfer_parent_leaf_sub_component_id[parent_id][
          slot_name
        ].push(child_id)

        const [leaf_path, leaf_comp] = leaf

        this._layout_transfer_parent_leaf_path[parent_id][slot_name].push(
          leaf_path
        )
        this._layout_transfer_parent_leaf_comp[parent_id][slot_name].push(
          leaf_comp
        )
      }

      const sub_component_leaves = extractLeafComp(base)

      all_children_base_comp.splice(
        all_children_base_comp.length,
        0,
        ...sub_component_leaves
      )
    }

    for (const leaf_comp of all_children_base_comp) {
      const leaf_style = extractStyle(leaf_comp, measureText)

      _leaf_style.push(leaf_style)
    }

    this._layout_transfer_parent_leaf_slot_style[parent_id][slot_name] =
      _slot_style
    this._layout_transfer_parent_leaf_style[parent_id][slot_name] = _leaf_style

    let leaf_i = 0

    this._layout_transfer_parent_remaining_child[parent_id][slot_name] =
      new Set(children)

    const leaf_layer = this._get_sub_component_parent_leaf_layer(parent_id)

    for (const child_id of children) {
      const base = this._get_sub_component_base(child_id)

      for (const leaf of base) {
        const [leaf_path, leaf_comp] = leaf

        const leaf_id = getLeafId([child_id, ...leaf_path])

        const leaf_node = this._leaf_frame_node[leaf_id]

        this._plug_leaf_frame(leaf_id, leaf_comp, leaf_node, leaf_layer)

        leaf_i++
      }
    }

    this._layout_transfer_parent_leaf_count[parent_id][slot_name] = leaf_i
  }

  private _setup_layout_sub_component_remove_parent_children_animation = (
    parent_id: string,
    slot_name: string,
    children: string[]
  ): void => {
    // console.log(
    //   'Graph',
    //   '_setup_layout_sub_component_remove_parent_children_animation',
    //   parent_id,
    //   children
    // )
    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    this._cancel_layout_parent_children_animation(parent_id, slot_name)

    this._reset_layout_transfer_parent(parent_id, slot_name)
    this._reset_layout_transfer_parent_children(parent_id, slot_name, children)

    const parent_child_leaf_style = []

    const sub_component = this._get_sub_component(parent_id)

    const slot = sub_component.$slot[slot_name]

    const slot_offset: Component = slot.getOffset()

    const slot_style = extractStyle(slot_offset, measureText)

    for (const child_id of children) {
      this._animating_sub_component_base_id.add(child_id)

      this._layout_transfer_parent_leaf_slot_style[parent_id][slot_name] =
        slot_style

      const child_base = this._get_sub_component_base(child_id)

      const child_base_style = []

      for (const leaf of child_base) {
        const [leaf_path, leaf_comp] = leaf

        this._layout_transfer_parent_leaf[parent_id][slot_name].push(leaf)
        this._layout_transfer_parent_leaf_path[parent_id][slot_name].push(
          leaf_path
        )
        this._layout_transfer_parent_leaf_comp[parent_id][slot_name].push(
          leaf_comp
        )
        this._layout_transfer_parent_leaf_sub_component_id[parent_id][
          slot_name
        ].push(child_id)

        const leaf_style = extractStyle(leaf_comp, measureText)

        child_base_style.push(leaf_style)
        parent_child_leaf_style.push(leaf_style)
      }

      this._layout_transfer_parent_leaf_style[child_id] =
        this._layout_transfer_parent_leaf_style[child_id] || {}
      this._layout_transfer_parent_leaf_style[child_id][slot_name] =
        child_base_style
    }

    this._layout_transfer_parent_leaf_style[parent_id][slot_name] =
      parent_child_leaf_style

    let leaf_i = 0

    for (const leaf of this._layout_transfer_parent_leaf[parent_id][
      slot_name
    ]) {
      const sub_component_id =
        this._layout_transfer_parent_leaf_sub_component_id[parent_id][
          slot_name
        ][leaf_i]

      const [leaf_path, leaf_comp] = leaf

      const leaf_id = getLeafId([sub_component_id, ...leaf_path])

      const leaf_node = this._leaf_frame_node[leaf_id]

      const leaf_layer = this._get_sub_component_leaf_layer(sub_component_id)

      this._plug_leaf_frame(leaf_id, leaf_comp, leaf_node, leaf_layer)

      leaf_i++
    }

    this._layout_transfer_parent_leaf_count[parent_id][slot_name] = leaf_i
  }

  private _cancel_layout_parent_children_animation = (
    parent_id: string,
    slot_name: string
  ): void => {
    // console.log('Graph', '_cancel_layout_children_animation', parent_id)

    if (this._layout_animation_frame[parent_id] !== undefined) {
      cancelAnimationFrame(this._layout_animation_frame[parent_id])

      delete this._layout_animation_frame[parent_id]
    }
  }

  private _start_layout_children_animation = (
    parent_id: string,
    slot_name: string,
    frame: () => void
  ): void => {
    // console.log('Graph', '_start_layout_children_animation', parent_id)

    // this._cancel_layout_current_children_transfer_animation()
    this._cancel_layout_parent_children_animation(parent_id, slot_name)

    // if (this._layout_animation_frame[parent_id] === undefined) {
    this._layout_animation_frame[parent_id] = requestAnimationFrame(frame)
    // }
  }

  private _animate_layout_append_children = (
    parent_id: string,
    children: string[],
    slot_name: string,
    callback: Callback
  ): void => {
    // console.log(
    //   'Graph',
    //   '_animate_layout_append_children',
    //   parent_id,
    //   children,
    //   slot_name
    // )

    // this._cancel_layout_current_children_transfer_animation()
    this._cancel_layout_parent_children_animation(parent_id, slot_name)

    // TODO
    // for (const child_id of children) {
    //   this._abort_tree_layout_animation(child_id)
    // }

    this._setup_layout_sub_component_append_children_animation(
      parent_id,
      children,
      slot_name
    )

    const frame = () => {
      this._tick_animate_layout_append_children(parent_id, children, slot_name)

      if (
        this._layout_transfer_parent_leaf_end_count[parent_id][slot_name] <
        this._layout_transfer_parent_leaf_count[parent_id][slot_name]
      ) {
        this._start_layout_children_animation(parent_id, slot_name, frame)
      } else {
        delete this._layout_transfer_parent_animating[parent_id]

        for (const child_id of children) {
          this._animating_sub_component_base_id.delete(child_id)
        }

        for (
          let i = 0;
          i < this._layout_transfer_parent_leaf[parent_id][slot_name].length;
          i++
        ) {
          const child_id =
            this._layout_transfer_parent_leaf_sub_component_id[parent_id][
              slot_name
            ][i]
          const leaf_path =
            this._layout_transfer_parent_leaf_path[parent_id][slot_name][i]
          const leaf_comp =
            this._layout_transfer_parent_leaf_comp[parent_id][slot_name][i]

          const leaf_id = getLeafId([child_id, ...leaf_path])

          this._unplug_leaf_frame(leaf_id, leaf_comp)
        }

        callback()
      }
    }

    frame()
  }

  private _play_layout_sub_component_remove_children_animation = (
    parent_id: string,
    slot_name: string,
    children: string[],
    callback: Callback
  ): Callback => {
    // console.log('Graph', '_play_layout_sub_component_remove_children_animation')

    const frame = () => {
      this._tick_animate_layout_parent_remove_children(
        parent_id,
        slot_name,
        children
      )

      if (
        this._layout_transfer_parent_leaf_end_count[parent_id][slot_name] <
        this._layout_transfer_parent_leaf_count[parent_id][slot_name]
      ) {
        this._start_layout_children_animation(parent_id, slot_name, frame)
      } else {
        delete this._layout_transfer_parent_animating[parent_id]

        for (const child_id of children) {
          this._animating_sub_component_base_id.delete(child_id)
        }

        for (
          let i = 0;
          i < this._layout_transfer_parent_leaf[parent_id][slot_name].length;
          i++
        ) {
          const child_id =
            this._layout_transfer_parent_leaf_sub_component_id[parent_id][
              slot_name
            ][i]
          const leaf_path =
            this._layout_transfer_parent_leaf_path[parent_id][slot_name][i]
          const leaf_comp =
            this._layout_transfer_parent_leaf_comp[parent_id][slot_name][i]

          const leaf_id = getLeafId([child_id, ...leaf_path])

          this._unplug_leaf_frame(leaf_id, leaf_comp)
        }

        callback()
      }
    }

    frame()

    return () => {
      this._cancel_tree_layout_animation()
    }
  }

  private _animate_layout_sub_component_remove_children = (
    parent_id: string,
    slot_name: string,
    children: string[],
    callback: Callback
  ): Callback => {
    // console.log(
    //   'Graph',
    //   '_animate_layout_sub_component_remove_children',
    //   parent_id,
    //   children
    // )

    this._cancel_layout_parent_children_animation(parent_id, slot_name)

    this._setup_layout_sub_component_remove_parent_children_animation(
      parent_id,
      slot_name,
      children
    )

    return this._play_layout_sub_component_remove_children_animation(
      parent_id,
      slot_name,
      children,
      callback
    )
  }

  private _animate_tick_leaf_trait = (leaf_id: string, trait: LayoutNode) => {
    const leaf_node = this._leaf_frame_node[leaf_id]
    const leaf_frame = this._leaf_frame[leaf_id]

    return this._animate_simulate_tick(leaf_node, trait, [
      [
        'x',
        (x: number) => {
          leaf_frame.$element.style.left = `${x}px`

          leaf_node.x = x
        },
      ],
      [
        'y',
        (y: number) => {
          leaf_frame.$element.style.top = `${y}px`

          leaf_node.y = y
        },
      ],
      [
        'width',
        (width: number) => {
          leaf_frame.$element.style.width = `${width}px`

          leaf_node.width = width
        },
      ],
      [
        'height',
        (height: number) => {
          leaf_frame.$element.style.height = `${height}px`

          leaf_node.height = height
        },
      ],
      [
        'fontSize',
        (fontSize: number) => {
          leaf_frame.$element.style.fontSize = `${fontSize}px`

          leaf_node.fontSize = fontSize
        },
      ],
      [
        'opacity',
        (opacity: number) => {
          leaf_frame.$element.style.opacity = `${opacity}`

          leaf_node.opacity = opacity
        },
      ],
      [
        'k',
        (k: number) => {
          leaf_frame.$element.style.transform = `scale(${k})`

          leaf_node.k = k
        },
      ],
    ])
  }

  private _tick_animate_layout_move_children = (
    children: [string, string, string, string][],
    target: Dict<Component>,
    setup: (leaf_id: string, parent_id: string, slot_name: string) => void,
    callback: (leaf_id: string, ended: boolean) => void
  ) => {
    const {
      api: {
        text: { measureText },
      },
    } = this.$system

    const root_base: Dict<Dict<string[]>> = {}
    const root_style: Dict<Dict<Style[]>> = {}

    const parent_slot_base: Dict<string[]> = {}
    const parent_slot_style: Dict<Style[]> = {}

    const tick_leaf = (leaf_id: string, target: LayoutNode): void => {
      const ended = this._animate_tick_leaf_trait(leaf_id, target)

      callback(leaf_id, ended)
    }

    for (const [child_id, parent_id, target_id, slot_name] of children) {
      const base = this._get_sub_component_root_base(child_id)

      for (const leaf of base) {
        const [leaf_path, leaf_comp] = leaf

        const _leaf_path = [child_id, ...leaf_path]

        const leaf_id = getLeafId(_leaf_path)

        const leaf_sub_id = _leaf_path[_leaf_path.length - 1]

        const leaf_parent_path = _leaf_path.slice(0, _leaf_path.length - 1)

        const leaf_style = extractStyle(leaf_comp, measureText)

        const leaf_parent_component =
          this._component.pathGetSubComponent(leaf_parent_path)

        const leaf_slot_sub_id: string | null =
          leaf_parent_component.getSubComponentParentId(leaf_sub_id)

        const leaf_slot_id = getLeafId([
          ...leaf_parent_path,
          ...((leaf_slot_sub_id && [leaf_slot_sub_id]) || []),
        ])

        // const is_root = leaf_slot_sub_id === null
        const is_root =
          leaf_slot_sub_id === parent_id || leaf_slot_sub_id === null

        if (is_root) {
          root_base[target_id] = root_base[target_id] || {}
          root_style[target_id] = root_style[target_id] || {}

          root_base[target_id][slot_name] =
            root_base[target_id][slot_name] || []
          root_style[target_id][slot_name] =
            root_style[target_id][slot_name] || []

          root_base[target_id][slot_name].push(leaf_id)
          root_style[target_id][slot_name].push(leaf_style)
        } else {
          parent_slot_base[leaf_slot_id] = parent_slot_base[leaf_slot_id] || []
          parent_slot_base[leaf_slot_id].push(leaf_id)

          parent_slot_style[leaf_slot_id] =
            parent_slot_style[leaf_slot_id] || []
          parent_slot_style[leaf_slot_id].push(leaf_style)
        }

        setup(leaf_id, parent_id, slot_name)
      }
    }

    const all_leaf_trait: Dict<LayoutNode> = {}
    const all_leaf_style: Dict<Style> = {}

    for (const target_id in root_base) {
      const base = root_base[target_id]
      const base_style = root_style[target_id]

      const parent_component = target[target_id]

      for (const slot_name in base) {
        const slot_base = base[slot_name]
        const slot_base_style = base_style[slot_name]

        const root = parent_component.$slot[slot_name]

        const root_offset = root.getOffset()

        const root_style = extractStyle(root_offset, measureText)
        const root_trait = extractTrait(root_offset, measureText)

        let _slot_base_style = slot_base_style

        if (root instanceof Wrap) {
          const container = root.getParentChildContainer(0)
          const container_slot = container.getSlot('default')
          const container_slot_style = extractStyle(container_slot, measureText)
          _slot_base_style = slot_base_style.map(() => container_slot_style)
          console.log(_slot_base_style)
        }

        const root_base_trait = reflectChildrenTrait(
          root_trait,
          root_style,
          _slot_base_style
        )

        let leaf_i = 0

        for (const leaf_id of slot_base) {
          const relative_leaf_trait = root_base_trait[leaf_i]
          const leaf_style = slot_base_style[leaf_i]

          const leaf_trait: LayoutNode = {
            x: root_trait.x + relative_leaf_trait.x,
            y: root_trait.y + relative_leaf_trait.y,
            width: relative_leaf_trait.width,
            height: relative_leaf_trait.height,
            fontSize: relative_leaf_trait.fontSize,
            opacity: relative_leaf_trait.opacity,
            k: relative_leaf_trait.k,
          }

          all_leaf_trait[leaf_id] = leaf_trait
          all_leaf_style[leaf_id] = leaf_style

          tick_leaf(leaf_id, leaf_trait)

          leaf_i++
        }
      }
    }

    for (const slot_id in parent_slot_base) {
      const slot_base = parent_slot_base[slot_id]
      const slot_base_style = parent_slot_style[slot_id]

      const slot_trait: LayoutNode = all_leaf_trait[slot_id]
      const slot_style: Style = all_leaf_style[slot_id]

      const slot_base_trait = reflectChildrenTrait(
        slot_trait,
        slot_style,
        slot_base_style
      )

      let leaf_i = 0
      for (const leaf_id of slot_base) {
        const relative_leaf_trait = slot_base_trait[leaf_i]

        const leaf_trait: LayoutNode = {
          x: slot_trait.x + relative_leaf_trait.x,
          y: slot_trait.y + relative_leaf_trait.y,
          width: relative_leaf_trait.width,
          height: relative_leaf_trait.height,
          fontSize: relative_leaf_trait.fontSize,
          opacity: relative_leaf_trait.opacity,
          k: relative_leaf_trait.k,
        }

        all_leaf_trait[leaf_id] = leaf_trait

        tick_leaf(leaf_id, leaf_trait)

        leaf_i++
      }
    }
  }

  private _tick_animate_layout_append_children = (
    parent_id: string,
    children: string[],
    slot_name: string = 'default'
  ): void => {
    const pack: [string, string, string, string][] = []
    const target: Dict<Component> = {}

    for (const child_id of children) {
      pack.push([child_id, parent_id, parent_id, slot_name])
    }

    const parent_component = this._get_sub_component(parent_id)

    target[parent_id] = parent_component

    this._tick_animate_layout_move_children(
      pack,
      target,
      (leaf_id, parent_id, slot_name) => {
        if (
          this._layout_transfer_parent_leaf_end_set[parent_id][slot_name].has(
            leaf_id
          )
        ) {
          this._layout_transfer_parent_leaf_end_count[parent_id][slot_name]--
          this._layout_transfer_parent_leaf_end_set[parent_id][
            slot_name
          ].delete(leaf_id)
        }
      },
      (leaf_id, ended) => {
        if (ended) {
          this._layout_transfer_parent_leaf_end_count[parent_id][slot_name]++
          this._layout_transfer_parent_leaf_end_set[parent_id][slot_name].add(
            leaf_id
          )
        }
      }
    )
  }

  private _tick_animate_layout_parent_remove_children = (
    parent_id: string,
    slot_name: string,
    children: string[]
  ): void => {
    // const _children =
    //   this._layout_transfer_parent_remaining_child[parent_id][slot_name]

    const pack: [string, string, string, string][] = []
    const target: Dict<Component> = {}

    for (const child_id of children) {
      pack.push([child_id, parent_id, child_id, 'default'])

      const frame = this._get_sub_component_frame(child_id)

      target[child_id] = frame
    }

    const parent_component = this._get_sub_component(parent_id)

    target[parent_id] = parent_component

    this._tick_animate_layout_move_children(
      pack,
      target,
      (leaf_id, parent_id, slot_name) => {
        if (
          this._layout_transfer_parent_leaf_end_set[parent_id][slot_name].has(
            leaf_id
          )
        ) {
          this._layout_transfer_parent_leaf_end_count[parent_id][slot_name]--
          this._layout_transfer_parent_leaf_end_set[parent_id][
            slot_name
          ].delete(leaf_id)
        }
      },
      (leaf_id, ended) => {
        if (ended) {
          this._layout_transfer_parent_leaf_end_count[parent_id][slot_name]++
          this._layout_transfer_parent_leaf_end_set[parent_id][slot_name].add(
            leaf_id
          )
        }
      }
    )
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
    child_id: string,
    slot_name: string
  ): void => {
    // console.log('Graph', '_pull_sub_component_child', parent_id, child_id, slot_name)

    this._mem_pull_sub_component_child(parent_id, child_id)
    this._mem_push_parent_root(parent_id, child_id, slot_name)
  }

  private _mem_pull_sub_component_child = (
    parent_id: string | null,
    child_id: string
  ): void => {
    // console.log('Graph', '_pull_sub_component_child', parent_id, child_id)

    const { component } = this.$props

    const child_component = this._get_sub_component(child_id)

    if (parent_id) {
      const current_parent_component = this._get_sub_component(parent_id)

      current_parent_component.pullParentRoot(child_component)
    } else {
      component.pullRoot(child_component)
    }
  }

  private _mem_push_parent_root = (
    parent_id: string,
    child_id: string,
    slot_name: string
  ): void => {
    // console.log('Graph', '_mem_append_sub_component_child', parent_id, child_id, slot_name)

    const parent_component = this._get_sub_component(parent_id)

    const child_component = this._get_sub_component(child_id)
    const slot = this._get_sub_component_slot_name(child_id)

    parent_component.pushParentRoot(child_component, slot)

    this._refresh_component_children_counter_up(
      parent_id,
      1 + (this._layout_component_count[child_id] || 0)
    )

    this._sub_component_parent[child_id] = parent_id
  }

  private _mem_push_root = (child_id: string) => {
    const child_component = this._get_sub_component(child_id)

    this._component.pushRoot(child_component)
  }

  private _layout_layer_move_sub_component_child = (
    parent_id: string,
    next_parent_id: string | null,
    child_id: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_layout_layer_move_sub_component_child',
    //   parent_id,
    //   next_parent_id,
    //   child_id
    // )

    const layout_core = this._layout_core[child_id]

    const parent_layout_layer = this._get_layout_layer(parent_id)

    const next_parent_layout_layer = this._ensure_layout_layer(next_parent_id)

    parent_layout_layer.children.removeChild(layout_core)
    next_parent_layout_layer.children.appendChild(layout_core)

    const layout_layer = this._get_layout_layer(child_id)

    if (layout_layer) {
      parent_layout_layer.layers.removeChild(layout_layer.layer)

      next_parent_layout_layer.layers.appendChild(layout_layer.layer)
    }
  }

  private _get_spec_parent_layout_layer = (
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

  private _append_sub_component_root = (sub_component_id: string): void => {
    // console.log('Graph', '_append_sub_component_root', sub_component_id)

    const sub_component = this._get_sub_component(sub_component_id)
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
    console.log('Graph', '_layout_collapse_sub_component')

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

    const is_visible = this._layout_path.includes(sub_component_id)

    const sub_component_children =
      this._get_sub_component_spec_children(sub_component_id)

    if (!this._is_fullwindow) {
      for (const sub_child_id of sub_component_children) {
        if (!is_visible) {
          const sub_child_component = this._get_sub_component(sub_child_id)

          if (sub_component.$mountParentRoot.includes(sub_child_component)) {
            sub_component.removeParentRoot(sub_child_component)

            // this._enter_sub_component_frame(sub_child_id)
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

  public move_all_core_content_layout_to_graph = (): void => {
    for (const sub_component_id in this._component.$subComponent) {
      this._move_core_content_layout_to_graph(sub_component_id)
    }
  }

  private _move_core_content_layout_to_graph = (
    sub_component_id: string
  ): void => {
    // console.log('Graph', '_move_core_content_layout_to_graph', sub_component_id)

    const core = this._core[sub_component_id]
    const layout_core = this._layout_core[sub_component_id]
    const core_content = this._core_content[sub_component_id]

    layout_core.removeChild(core_content)

    core.appendChild(core_content)
  }

  public move_all_core_content_graph_to_layout = (): void => {
    for (const sub_component_id in this._component.$subComponent) {
      this._move_core_content_graph_to_layout(sub_component_id)
    }
  }

  private _move_core_content_graph_to_layout = (
    sub_component_id: string
  ): void => {
    // console.log('Graph', '_move_core_content_graph_to_layout', sub_component_id)

    const core = this._core[sub_component_id]
    const layout_core = this._layout_core[sub_component_id]
    const core_content = this._core_content[sub_component_id]

    core.removeChild(core_content)

    layout_core.appendChild(core_content)
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
    child_id: string,
    slot_name: string
  ): void => {
    // console.log('Graph', '_spec_append_component_child', parent_id, child_id, slot_name)
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

  private _pod_append_sub_component_child = (
    subComponentId: string,
    childId: string,
    slotName: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_pod_append_sub_component_child',
    //   subComponentId,
    //   childId,
    //   slotName
    // )

    this._pod.$appendSubComponentChild({
      subComponentId,
      childId,
      slotName,
    })
  }

  private _get_component_spec_children = (): string[] => {
    const { component: { children = [] } = {} } = this._spec

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

  private _reset_layout_transfer_parent_children = (
    parent_id: string,
    slot_name: string,
    children: string[]
  ): void => {
    this._layout_transfer_parent_remaining_child[parent_id] =
      this._layout_transfer_parent_remaining_child[parent_id] || {}
    this._layout_transfer_parent_remaining_child[parent_id][slot_name] =
      new Set(children)
  }

  private _reset_layout_transfer_parent = (
    parent_id: string,
    slot_name: string
  ): void => {
    this._layout_transfer_parent_leaf[parent_id] =
      this._layout_transfer_parent_leaf[parent_id] || {}
    this._layout_transfer_parent_leaf_path[parent_id] =
      this._layout_transfer_parent_leaf_path[parent_id] || {}
    this._layout_transfer_parent_leaf_comp[parent_id] =
      this._layout_transfer_parent_leaf_comp[parent_id] || {}
    this._layout_transfer_parent_leaf_sub_component_id[parent_id] =
      this._layout_transfer_parent_leaf_sub_component_id[parent_id] || {}
    this._layout_transfer_parent_leaf_end_count[parent_id] =
      this._layout_transfer_parent_leaf_end_count[parent_id] || {}
    this._layout_transfer_parent_leaf_end_set[parent_id] =
      this._layout_transfer_parent_leaf_end_set[parent_id] || {}
    this._layout_transfer_parent_leaf_slot_style[parent_id] =
      this._layout_transfer_parent_leaf_slot_style[parent_id] || {}
    this._layout_transfer_parent_leaf_style[parent_id] =
      this._layout_transfer_parent_leaf_style[parent_id] || {}
    this._layout_transfer_parent_leaf_count[parent_id] =
      this._layout_transfer_parent_leaf_count[parent_id] || {}

    this._layout_transfer_parent_leaf[parent_id][slot_name] = []
    this._layout_transfer_parent_leaf_path[parent_id][slot_name] = []
    this._layout_transfer_parent_leaf_comp[parent_id][slot_name] = []
    this._layout_transfer_parent_leaf_sub_component_id[parent_id][slot_name] =
      []
    this._layout_transfer_parent_leaf_end_count[parent_id][slot_name] = 0
    this._layout_transfer_parent_leaf_end_set[parent_id][slot_name] = new Set()
    this._layout_transfer_parent_leaf_count[parent_id][slot_name] = 0
  }

  private _long_press_remove_sub_component_children = (
    parent_id: string,
    slot_name: string,
    next_parent_id: string | null,
    next_slot_name: string
  ): void => {
    const { animate } = this.$props

    // this._cancel_tree_layout_animation()

    const children = this._get_sub_component_spec_children(parent_id)

    if (animate) {
      const layout_parent_node = this._layout_node[parent_id]

      const { x, y, width, height } = layout_parent_node

      for (const child_id of children) {
        this._abort_tree_layout_animation(child_id)

        this._layout_layer_move_sub_component_child(
          parent_id,
          next_parent_id,
          child_id
        )

        this._set_layout_core_position(child_id, x, y)
        this._set_layout_core_size(child_id, width, height)

        this._measure_sub_component_base(child_id)
      }

      for (const child_id of children) {
        if (!this._animating_sub_component_base_id.has(child_id)) {
          this._remove_sub_component_parent_root(parent_id, child_id)
          this._remove_sub_component_root_base(child_id)
        }
      }

      this._cancel_layout_parent_children_animation(parent_id, slot_name)

      this._setup_layout_sub_component_remove_parent_children_animation(
        parent_id,
        slot_name,
        children
      )
    }

    for (const child_id of children) {
      this._pre_remove_sub_component_child(parent_id, child_id, next_parent_id)
    }

    if (animate) {
      this._refresh_current_layout_node_target_position()

      this._animate_all_layout_layer_node(next_parent_id)

      this._play_layout_sub_component_remove_children_animation(
        parent_id,
        slot_name,
        children,
        () => {
          for (const child_id of children) {
            this._enter_sub_component_frame(child_id)

            this._commit_sub_component_base(child_id)
          }
        }
      )
    } else {
      this._refresh_current_layout_node_target_position()

      this._set_all_layout_layer_core_position(next_parent_id)
    }
  }

  private _pod_move_sub_component_child = (
    parent_id: string,
    child_id: string,
    next_parent_id: string | null
  ): void => {
    // TODO
  }

  private _pre_remove_sub_component_child = (
    parent_id: string,
    child_id: string,
    next_parent_id: string | null
  ): void => {
    const is_child_fullwindow = this._is_sub_component_fullwindow(child_id)

    if (is_child_fullwindow) {
      this._decouple_sub_component(child_id)
    }

    this._mem_move_out_sub_component_child(parent_id, child_id, next_parent_id)
    this._layout_move_sub_component_child(parent_id, child_id, next_parent_id)
    this._spec_move_sub_component_child(parent_id, child_id, next_parent_id)
    this._pod_move_sub_component_child(parent_id, child_id, next_parent_id)

    if (is_child_fullwindow) {
      this._couple_sub_component(child_id)
    }
  }

  private _sim_move_out_sub_component_children = (
    parent_id: string,
    next_parent_id: string | null
  ): void => {
    const children = this._get_sub_component_spec_children(parent_id)

    const parent_component = this._get_sub_component(parent_id)

    for (const child_id of children) {
      if (this._tree_layout) {
        const child_component = this._get_sub_component(child_id)

        parent_component.removeParentRoot(child_component)

        this._enter_sub_component_frame(child_id)
      }

      this._layout_move_sub_component_child(parent_id, child_id, next_parent_id)

      this._layout_layer_move_sub_component_child(
        parent_id,
        next_parent_id,
        child_id
      )
    }
  }

  private _remove_sub_component_child = (
    parent_id: string,
    child_id: string
  ) => {
    const parent_component = this._get_sub_component(parent_id)
    const child_component = this._get_sub_component(child_id)

    parent_component.removeParentRoot(child_component)
  }

  private _mem_move_out_sub_component_child = (
    parent_id: string,
    child_id: string,
    next_parent_id: string | null
  ) => {
    if (this._tree_layout) {
      this._mem_pull_sub_component_child(parent_id, child_id)

      if (next_parent_id) {
        this._mem_push_parent_root(next_parent_id, child_id, 'default')
      } else {
        this._mem_push_root(child_id)
      }
    }
  }

  private _layout_move_sub_component_child = (
    parent_id: string,
    child_id: string,
    next_parent_id: string | null
  ): void => {
    // console.log(
    //   'Graph',
    //   '_layout_move_sub_component_child',
    //   parent_id,
    //   child_id,
    //   next_parent_id
    // )

    this._refresh_component_children_counter_up(
      parent_id,
      -(1 + (this._layout_component_count[child_id] || 0))
    )

    if (next_parent_id) {
      this._sub_component_parent[child_id] = next_parent_id
    } else {
      delete this._sub_component_parent[child_id]
    }
  }

  private _show_layout_core = (unit_id: string): void => {
    // console.log('Graph', '_show_layout_core', unit_id)

    const layout_core = this._layout_core[unit_id]

    layout_core.$element.style.pointerEvents = 'inherit'
    layout_core.$element.style.opacity = '1'

    if (this._tree_layout) {
      if (this._is_node_selected(unit_id)) {
        this._enable_core_resize(unit_id)
      }
    }
  }

  private _hide_layout_core = (unit_id: string): void => {
    // console.log('Graph', '_hide_layout_core', unit_id)

    const layout_core = this._layout_core[unit_id]

    layout_core.$element.style.pointerEvents = 'none'
    layout_core.$element.style.opacity = '0'

    if (this._tree_layout) {
      if (this._is_node_selected(unit_id)) {
        this._disable_core_resize(unit_id)
      }
    }
  }

  private _spec_remove_component_children = (
    parent_id: string,
    next_parent_id: string | null
  ): void => {
    const children = this._get_sub_component_spec_children(parent_id)

    for (const child_id of children) {
      this._spec_move_sub_component_child(parent_id, child_id, next_parent_id)
    }

    this._refresh_component_children_counter(parent_id)
  }

  private _spec_move_sub_component_child = (
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

  private _is_node_mode_long_press_able = (node_id: string): boolean => {
    if (this._mode === 'none') {
      return this._is_node_none_long_press_able(node_id)
    } else if (this._mode === 'change') {
      return this._is_node_blue_long_press_able(node_id)
    } else {
      // TODO
      return false
    }
  }

  private _is_node_none_long_press_able = (node_id: string): boolean => {
    if (this._is_unit_node_id(node_id)) {
      if (!this._is_unit_base(node_id)) {
        return true
      }
    }

    return false
  }

  private _is_node_blue_long_press_able = (node_id: string): boolean => {
    if (this._is_link_pin_node_id(node_id)) {
      if (this._is_input_node_id(node_id)) {
        return true
      }
    }

    return false
  }

  private _on_node_long_press = (
    node_id: string,
    event: IOPointerEvent
  ): void => {
    // console.log('Graph', '_on_node_long_press', node_id)
    const { pointerId, clientX, clientY, screenX, screenY } = event

    this._set_long_press_pointer(pointerId, clientX, clientY)

    if (this._resize_node_id_pointer_id[node_id]) {
      return
    }

    if (this._is_node_mode_long_press_able(node_id)) {
      this._animate_long_press(screenX, screenY, 'out')
    }

    if (this._tree_layout) {
      this.__on_layout_node_long_press(node_id, pointerId, clientX, clientY)
    } else {
      this._on_graph_node_long_press(node_id, pointerId, clientX, clientY)
    }
  }

  private __on_layout_node_long_press = (
    node_id: string,
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    if (this._is_unit_node_id(node_id)) {
      if (this._mode === 'none') {
        //
      } else if (this._mode === 'multiselect') {
        if (!this._layout_drag_node[node_id]) {
          this.__on_layout_component_drag_start(node_id, clientX, clientY)
        }

        if (this._is_node_selected(node_id)) {
          if (this._layout_drag_node[node_id]) {
            this._on_layout_component_drag_end(node_id)
          }

          this._cancel_node_long_click = true

          const next_parent_id = this._get_current_layout_layer_id()

          this._long_press_remove_sub_component_children(
            node_id,
            'default',
            next_parent_id,
            'default'
          )

          this.deselect_node(node_id)
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

              this._long_press_append_sub_component_children(
                node_id,
                children_id
              )
            }
          }
        }
      }
    }
  }

  private _on_graph_node_long_press = (
    node_id: string,
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    if (this._mode === 'multiselect') {
      this._on_graph_group_node_long_press(node_id, pointerId, clientX, clientY)
    }
  }

  private _on_graph_group_node_long_press = (
    node_id: string,
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    if (this._is_unit_node_id(node_id)) {
      this._on_graph_group_unit_long_press(node_id, pointerId, clientX, clientY)
    } else if (this._is_datum_node_id(node_id)) {
      this._on_graph_group_datum_node_long_press(
        node_id,
        pointerId,
        clientX,
        clientY
      )
    }
  }

  private _on_graph_group_unit_long_press = (
    unit_id: string,
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    if (this._is_node_selected(unit_id)) {
      if (this._long_press_collapse_unit_id === unit_id) {
        //
      } else {
        if (this._is_unit_base(unit_id)) {
          //
        } else {
          this._animate_long_press(clientX, clientY, 'out')

          this._cancel_long_click = true
          this._cancel_long_press = true

          if (this._multiselect_area_ing) {
            this._on_multiselect_area_end()
          }

          this._swap_next_click_hold_long_press = true
          this._cancel_click = true
          setTimeout(() => {
            this._swap_next_click_hold_long_press = false
            this._cancel_click = false
          }, 3 * CLICK_TIMEOUT)

          this._explode_unit(unit_id)
        }
      }
    } else {
      if (this._is_unit_base(unit_id)) {
        //
      } else {
        const screen_position = this._get_node_screen_position(unit_id)

        this._start_long_press_collapse(pointerId, unit_id, screen_position)

        this._set_node_layer(unit_id, LAYER_COLLAPSE)

        if (!this._drag_node_id[unit_id]) {
          this.__drag_start(unit_id, pointerId, clientX, clientY)
        }

        this._cancel_long_click = true
        this._cancel_long_press = true
      }
    }
  }

  private _on_graph_group_datum_node_long_press = (
    datum_node_id: string,
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)

    const array_tree = this._datum_tree[datum_id]

    const { type: array_type } = array_tree

    const is_array = array_type === TreeNodeType.ArrayLiteral

    if (is_array) {
      const screen_position = this._get_node_screen_position(datum_node_id)

      const datum_node = this._node[datum_node_id]

      screen_position.x += datum_node.width * this._zoom.k
      screen_position.y += (datum_node.height * this._zoom.k) / 2

      this._start_long_press_collapse(pointerId, datum_node_id, screen_position)

      this._set_node_layer(datum_node_id, LAYER_COLLAPSE)

      if (!this._drag_node_id[datum_node_id]) {
        this.__drag_start(datum_node_id, pointerId, clientX, clientY)
      }

      this._cancel_long_click = true
      this._cancel_long_press = true
    }
  }

  private _explode_unit = (unit_id: string): void => {
    // console.log('Graph', '_explode_unit', unit_id)

    const map_unit_id = {}
    const map_merge_id = {}

    const _spec = this._get_unit_spec(unit_id) as GraphSpec

    const { units: _units = {}, merges: _merges = {} } = _spec

    const set_unit_id = new Set<string>()
    const set_merge_id = new Set<string>()

    const new_selected_node_ids: string[] = []

    for (const _unitId in _units) {
      const _unit = _units[_unitId]
      const { id: _unit_spec_id } = _unit
      // if (hasUnitId(this._spec, _unitId)) {
      const _next_unit_id = this._new_unit_id(_unit_spec_id, set_unit_id)
      set_unit_id.add(_next_unit_id)
      map_unit_id[_unitId] = _next_unit_id
      new_selected_node_ids.push(_next_unit_id)
      // }
    }

    for (const _mergeId in _merges) {
      // if (hasMergeId(this._spec, _mergeId)) {
      const _next_merge_id = this._new_merge_id(set_merge_id)
      set_merge_id.add(_next_merge_id)
      map_merge_id[_mergeId] = _next_merge_id
      new_selected_node_ids.push(_next_merge_id)
      // }
    }

    if (this._is_unit_component(unit_id)) {
      this._pod_disconnect_sub_component(unit_id)
    }

    this._state_explode_unit(unit_id, map_unit_id, map_merge_id)
    this._pod_explode_unit(unit_id, map_unit_id, map_merge_id)
  }

  private _state_explode_unit = (
    unit_id: string,
    map_unit_id: Dict<string>,
    map_merge_id: Dict<string>
  ): void => {
    // console.log('Graph', '_state_explode_unit', unit_id)

    const spec = this._get_unit_spec(unit_id) as GraphSpec

    const {
      units = {},
      merges = {},
      component = { subComponents: {}, children: [] },
    } = spec

    const position = this._get_node_position(unit_id)

    const unit_merges = this._get_unit_merges(unit_id)
    const unit_merge_position = mapObjKV(
      unit_merges,
      this.__get_merge_node_position
    )

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

    for (const merge_id in unit_merges) {
      const merge = unit_merges[merge_id]

      const merge_position = unit_merge_position[merge_id]

      const has_merge = this.__has_merge(merge_id)

      if (has_merge) {
        for (const _unit_id in merge) {
          if (_unit_id === unit_id) {
            const _merge_unit = merge[_unit_id]

            const { input: _input = {}, output: _output = {} } = _merge_unit

            const merge_node_id = getMergeNodeId(merge_id)

            const replacePin = (_type: IO, _pin_id: string) => {
              const _pin = spec[`${_type}s`][_pin_id]

              const { pin: sub_pin_map } = _pin

              for (const sub_pin_id in sub_pin_map) {
                const sub_pin = sub_pin_map[sub_pin_id]

                const { unitId, pinId, mergeId } = sub_pin

                if (mergeId) {
                  const _merge_node_id = getMergeNodeId(mergeId)

                  this._state_merge_merge_pin_merge_pin(
                    merge_node_id,
                    _merge_node_id
                  )
                } else {
                  const _pin_node_id = getPinNodeId(unitId, _type, pinId)

                  this._state_merge_link_pin_merge_pin(
                    _pin_node_id,
                    merge_node_id
                  )
                }
              }
            }

            for (const _input_id in _input) {
              replacePin('input', _input_id)
            }

            for (const _output_id in _output) {
              replacePin('output', _output_id)
            }
          }
        }
      } else {
        const next_merge_id = this._new_merge_id()

        const next_merge = {}

        let next_merge_pin_count = 0

        for (const _unit_id in merge) {
          const _merge_unit = merge[_unit_id]

          if (_unit_id === unit_id) {
            const { input: _input = {}, output: _output = {} } = _merge_unit

            const replacePin = (_type: IO, _pin_id: string) => {
              const _pin = spec[`${_type}s`][_pin_id]

              const { pin } = _pin

              for (const sub_pin_id in pin) {
                const sub_pin = pin[sub_pin_id]

                const { unitId, pinId, mergeId } = sub_pin

                if (mergeId) {
                  const sub_next_merge_id = map_merge_id[mergeId]

                  const sub_merge_node_id = getMergeNodeId(sub_next_merge_id)

                  const sub_merge_spec = this._get_merge(sub_next_merge_id)

                  forEachPinOnMerge(
                    sub_merge_spec,
                    (__unitId, __type, __pinId) => {
                      const ___unitId = map_unit_id[__unitId]

                      next_merge[___unitId] = next_merge[___unitId] || {
                        input: {},
                        output: {},
                      }
                      next_merge[___unitId][__type][__pinId] = true

                      next_merge_pin_count++
                    }
                  )

                  this._state_remove_merge(sub_merge_node_id)
                } else if (unitId && pinId) {
                  const sub_next_unit_id = map_unit_id[unitId]

                  next_merge[sub_next_unit_id] = {
                    input: {},
                    output: {},
                  }

                  next_merge[sub_next_unit_id][_type][pinId] = true

                  next_merge_pin_count++
                }
              }
            }

            for (const _input_id in _input) {
              replacePin('input', _input_id)
            }

            for (const _output_id in _output) {
              replacePin('output', _output_id)
            }
          } else {
            next_merge[_unit_id] = _merge_unit

            next_merge_pin_count += getMergeUnitPinCount(_merge_unit)
          }
        }

        if (next_merge_pin_count > 1) {
          this._state_add_merge(next_merge_id, next_merge, merge_position)
          this._sim_collapse_merge(next_merge_id)
        } else {
          forEachPinOnMerge(next_merge, (unit_id, type, pin_id) => {
            const pin_node_id = getPinNodeId(unit_id, type, pin_id)

            this.select_node(pin_node_id)
          })
        }
      }
    }
  }

  private _pod_explode_unit = (
    unit_id: string,
    map_unit_id: Dict<string>,
    map_merge_id: Dict<string>
  ): void => {
    // console.log('Graph', '_pod_explode_unit', unit_id)

    const graph_pod = this._pod.$refUnit({
      unitId: unit_id,
      _: ['$U', '$C', '$G'],
    }) as $Graph

    graph_pod.$getGraphData(({ state, err, pinData, children, mergeData }) => {
      const _pinData = mapObjKey(pinData, (value, key) => {
        return map_unit_id[key]
      })
      this._process_graph_pin_data(_pinData)

      const _err = mapObjKey(err, (value, key) => {
        return map_unit_id[key]
      })
      this._process_graph_err(_err)

      const _state = mapObjKey(state, (value, key) => {
        return map_unit_id[key]
      })
      this._process_graph_state(_state)

      const _children = mapObjKey(children, (value, key) => {
        return map_unit_id[key]
      })
      this._process_graph_children(_children)

      const _mergeData = mapObjKey(mergeData, (value, key) => {
        return map_merge_id[key]
      })
      this._process_graph_merge_data(_mergeData)
    })

    this._pod.$explodeUnit({
      unitId: unit_id,
      mapUnitId: map_unit_id,
      mapMergeId: map_merge_id,
    })

    for (const _unit_id in map_unit_id) {
      const _next_unit_id = map_unit_id[_unit_id]
      if (this._is_unit_component(_next_unit_id)) {
        this._pod_connect_sub_component(_next_unit_id)
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

    const { screenX, screenY } = event

    this._animate_long_press(screenX, screenY, 'out')

    if (this._is_unit_node_id(node_id)) {
      // AD HOC
      // TRELO #2064
      const node_comp = this._get_node_comp(node_id)
      node_comp.$element.dispatchEvent(new PointerEvent('pointerleave', event))

      this._start_gesture(event)
    } else if (this._is_pin_node_id(node_id)) {
      // AD HOC
      // TRELO #2064
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
      return this.merge_link_pin_merge_pin(pin_0_node_id, pin_1_node_id)
    } else if (
      this._is_merge_node_id(pin_0_node_id) &&
      this._is_link_pin_node_id(pin_1_node_id)
    ) {
      return this.merge_link_pin_merge_pin(pin_1_node_id, pin_0_node_id)
    } else {
      return this.merge_merge_pin_merge_pin(pin_1_node_id, pin_0_node_id)
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
      this._sim_add_pin_to_merge(pin_node_id, ref_merge_pin_node_id)
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
  ): string => {
    const { id: merge_0_id } = segmentMergeNodeId(merge_0_node_id)
    const { id: merge_1_id } = segmentMergeNodeId(merge_1_node_id)

    const merge_node_id = this._merge_merge_pin_merge_pin(
      merge_0_node_id,
      merge_1_node_id
    )

    this._dispatch_action(mergeMerges(merge_0_id, merge_1_id))

    return merge_node_id
  }

  private _merge_merge_pin_merge_pin = (
    merge_0_node_id: string,
    merge_1_node_id: string
  ): string => {
    const { id: merge_0_id } = segmentMergeNodeId(merge_0_node_id)
    const { id: merge_1_id } = segmentMergeNodeId(merge_1_node_id)

    this._state_merge_merge_pin_merge_pin(merge_0_node_id, merge_1_node_id)
    this._pod_merge_merge_pin_merge_pin(merge_0_id, merge_1_id)

    return merge_0_node_id
  }

  private _state_merge_merge_pin_merge_pin = (
    merge_0_node_id: string,
    merge_1_node_id: string
  ): string => {
    const { id: merge_0_id } = segmentMergeNodeId(merge_0_node_id)
    const { id: merge_1_id } = segmentMergeNodeId(merge_1_node_id)

    this._sim_merge_merge_pin_merge_pin(merge_0_node_id, merge_1_node_id)
    this._spec_merge_merge_pin_merge_pin(merge_0_id, merge_1_id)

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
      this._sim_add_pin_to_merge(pin_node_id, merge_0_node_id)
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

    this._spec_add_merge(merge_id, merge)

    const merge_node_id = this.__sim_merge_link_pin_link_pin(
      merge_id,
      pin_0_node_id,
      pin_1_node_id
    )

    this._pod_add_merge(merge_id, merge)

    this._dispatch_action_add_merge(merge_id, merge)

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

    this._sim_add_pin_to_merge(pin_0_node_id, merge_node_id)
    this._sim_add_pin_to_merge(pin_1_node_id, merge_node_id)

    return merge_node_id
  }

  public merge_link_pin_merge_pin = (
    pin_node_id: string,
    merge_node_id: string
  ): string => {
    // console.log(
    //   'Graph',
    //   'merge_link_pin_merge_pin',
    //   pin_node_id,
    //   merge_node_id
    // )

    const { id: merge_id } = segmentMergeNodeId(merge_node_id)

    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    this._dispatch_action(addPinToMerge(merge_id, type, unitId, pinId))

    return this._merge_link_pin_merge_pin(pin_node_id, merge_node_id)
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

    this.__state_merge_link_pin_merge_pin(
      pin_node_id,
      merge_node_id,
      unit_id,
      type,
      pin_id,
      merge_id
    )
    this.__pod_add_pin_to_merge(merge_id, unit_id, type, pin_id)

    return merge_node_id
  }

  private _state_merge_link_pin_merge_pin = (
    pin_node_id: string,
    merge_node_id: string
  ): string => {
    // console.log(
    //   'Graph',
    //   '_state_merge_link_pin_merge_pin',
    //   pin_node_id,
    //   merge_node_id
    // )

    const { id: merge_id } = segmentMergeNodeId(merge_node_id)

    const {
      unitId: unit_id,
      type,
      pinId: pin_id,
    } = segmentLinkPinNodeId(pin_node_id)

    this.__state_merge_link_pin_merge_pin(
      pin_node_id,
      merge_node_id,
      unit_id,
      type,
      pin_id,
      merge_id
    )

    return merge_node_id
  }

  private __state_merge_link_pin_merge_pin = (
    pin_node_id: string,
    merge_node_id: string,
    unit_id: string,
    type: IO,
    pin_id: string,
    merge_id: string
  ): string => {
    // console.log(
    //   'Graph',
    //   '_state_merge_link_pin_merge_pin',
    //   pin_node_id,
    //   merge_node_id
    // )

    this.__spec_add_link_pin_to_merge(merge_id, unit_id, type, pin_id)
    this._sim_add_pin_to_merge(pin_node_id, merge_node_id)

    return merge_node_id
  }

  private __pod_add_pin_to_merge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ) {
    this._pod.$addPinToMerge({
      mergeId,
      unitId,
      type,
      pinId,
    })
  }

  private __spec_add_link_pin_to_merge(
    mergeId: string,
    unitId: string,
    type: IO,
    pinId: string
  ) {
    // console.log('Graph', '_spec_merge_link_pin_merge_pin')

    this._spec = specReducer.addPinToMerge(
      { id: mergeId, unitId, type, pinId },
      this._spec
    )
  }

  private _sim_add_pin_to_merge(pin_node_id: string, merge_node_id: string) {
    // console.log(
    //   'Graph',
    //   '_sim_merge_link_pin_merge_pin',
    //   pin_node_id,
    //   merge_node_id
    // )

    const { id: merge_id } = segmentMergeNodeId(merge_node_id)

    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    const is_input = type === 'input'
    const is_output = !is_input
    const is_pin_link_ref = this._is_link_pin_ref(pin_node_id)
    const is_pin_output_ref = is_output && is_pin_link_ref
    const is_pin_output_self = pinId === SELF

    const int_node_id = this._pin_to_internal[pin_node_id]
    if (int_node_id) {
      const { pinId, type, subPinId } = segmentExposedNodeId(int_node_id)
      this._sim_unplug_exposed_pin(type, pinId, subPinId)
      this._sim_plug_exposed_pin(type, pinId, subPinId, { mergeId: merge_id })
    }

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

      const pin_link_id = getPinLinkIdFromPinNodeId(pin_node_id)
      this._show_link_text(pin_link_id)
      this._hide_link_pin_name(pin_node_id)
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
        merge_input.$element.style.visibility = 'visible'

        const merge_output_width = 2 * PIN_RADIUS - 4

        merge_output.$element.style.width = `${merge_output_width}px`
        merge_output.$element.style.height = `${merge_output_width}px`
        merge_output.$element.style.transform = `translate(${2}px, ${2}px)`
      }
    } else {
      if (!merge_ref) {
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

    // if (this._drag_count > 0) {
    //   const merge_sub_graph_id = this._node_to_subgraph[merge_node_id]

    //   const merge_sub_graph_static_anchor_id = this._static_subgraph_anchor[merge_sub_graph_id]

    //   console.log('merge_sub_graph_id', merge_sub_graph_id)
    //   console.log('merge_sub_graph_static_anchor_id', merge_sub_graph_static_anchor_id)

    //   const pin_sub_graph_id = this._node_to_subgraph[pin_node_id]

    //   const pin_sub_graph_static_anchor_id = this._static_subgraph_anchor[pin_sub_graph_id]

    //   console.log('pin_sub_graph_id', pin_sub_graph_id)
    //   console.log('pin_sub_graph_static_anchor_id', pin_sub_graph_static_anchor_id)
    // }

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

    pin_link_text_path.$element.style.display = 'block'
  }

  private _hide_link_text = (link_id: string): void => {
    const pin_link_text_path = this._link_text[link_id]

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

    this._node_link_count[prev_source_id]--
    this._node_link_count[source_id]++

    this._set_node_link_heap_count(
      prev_source_id,
      this._node_link_count[prev_source_id]
    )
    this._set_node_link_heap_count(source_id, this._node_link_count[source_id])

    this._refresh_simulation_stability()

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

    this._node_link_count[prev_target_id]--
    this._node_link_count[target_id]++

    this._set_node_link_heap_count(
      prev_target_id,
      this._node_link_count[prev_target_id]
    )
    this._set_node_link_heap_count(target_id, this._node_link_count[target_id])

    this._refresh_simulation_stability()

    change_link_target_on_graph(
      this._node_graph,
      source_id,
      prev_target_id,
      target_id
    )

    this._rebuild_subgraph()
  }

  private _refresh_simulation_stability = (): void => {
    let s: number = 1
    if (this._node_link_heap_root) {
      const {
        value: { count },
      } = this._node_link_heap_root
      s = clamp(Math.ceil(count / 6), 1, 4)
    }
    this._simulation.stability(s)
  }

  private _move_datum_to_pin = (
    datum_node_id: string,
    pin_node_id: string
  ): void => {
    // console.log('Graph', '_move_datum_to_pin', datum_node_id, pin_node_id)

    const datum_pin_node_id = this._datum_to_pin[datum_node_id]

    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    const tree = this._datum_tree[datum_id]
    const { value } = tree

    this._spec_move_datum_to_pin(datum_node_id, pin_node_id, value)
    this._sim_move_datum_to_pin(datum_node_id, pin_node_id)
    this._pod_move_datum_to_pin(datum_pin_node_id, pin_node_id, value)
  }

  private _pod_move_datum_to_pin = (
    datum_pin_node_id: string | null,
    pin_node_id: string,
    value: string
  ) => {
    if (datum_pin_node_id && datum_pin_node_id !== pin_node_id) {
      this._pod_remove_pin_datum(datum_pin_node_id)
    }

    this._pod_set_pin_data(pin_node_id, value)
  }

  private _sim_move_datum_to_pin = (
    datum_node_id: string,
    pin_node_id: string
  ): void => {
    // console.log('Graph', '_sim_move_datum_to_pin', datum_node_id, pin_node_id)

    const datum_pin_node_id = this._datum_to_pin[datum_node_id]
    if (datum_pin_node_id && datum_pin_node_id !== pin_node_id) {
      this._sim_remove_datum_link(datum_node_id)
    }

    const pin_datum_node_id = this._pin_to_datum[pin_node_id]
    if (pin_datum_node_id) {
      this._sim_remove_datum_link(pin_datum_node_id)
    }

    this._sim_add_datum_link(datum_node_id, pin_node_id)

    if (this._edit_datum_node_id === datum_node_id) {
      this._edit_datum_commited = true
    }
  }

  private _spec_move_datum_to_pin = (
    datum_node_id: string,
    pin_node_id: string,
    value: string
  ): void => {
    // console.log('Graph', '_spec_move_datum_to_pin', datum_node_id, pin_node_id)

    const is_link_pin = this._is_link_pin_node_id(pin_node_id)
    if (is_link_pin) {
      const is_link_pin_constant = this._is_link_pin_constant(pin_node_id)
      if (is_link_pin_constant) {
        this._spec_set_pin_data(pin_node_id, value)
      }
    }
  }

  private _pod_push_data = (type: IO, id: string, data: string): void => {
    this._pod.$push({ id, data })
  }

  private _pod_take_input = (id: string): void => {
    this._pod.$takeInput({ id })
  }

  private _set_pin_data = (pin_node_id: string, data: string): void => {
    // console.log('Graph', '_set_pin_data', pin_node_id, data)
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
    type: IO,
    pinId: string,
    data: string
  ) => {
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
      layout_core.$element.style.borderColor = borderColor
    }
  }

  private _set_link_pin_opacity = (
    pin_node_id: string,
    opacity: number
  ): void => {
    this._set_link_pin_opacity_str(pin_node_id, `${opacity}`)
  }

  private _set_link_pin_opacity_str = (
    pin_node_id: string,
    opacity: string
  ): void => {
    const pin = this._pin[pin_node_id]
    if (pin) {
      pin.$element.style.opacity = opacity
    }

    const pin_name = this._pin_name[pin_node_id]
    if (pin_name) {
      pin_name.$element.style.opacity = opacity
    }

    const pin_link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const pin_link = this._link_base[pin_link_id]

    pin_link.$element.style.opacity = opacity
  }

  private _set_link_pin_pointer_events = (
    pin_node_id: string,
    pointerEvents: string
  ) => {
    const pin = this._pin[pin_node_id]
    if (pin) {
      pin.$element.style.pointerEvents = pointerEvents
    }

    const pin_link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const pin_link = this._link_comp[pin_link_id]

    pin_link.$element.style.pointerEvents = pointerEvents
  }

  private _set_exposed_pin_set_opacity = (
    type: IO,
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
    type: IO,
    pin_id: string,
    sub_pin_id: string,
    opacity: number
  ): void => {
    const _opacity = `${opacity}`

    const input = type === 'input'
    const ext_node_id = getExtNodeId(type, pin_id, sub_pin_id)
    const external_pin = this._pin[ext_node_id]

    external_pin.$element.style.opacity = _opacity

    const int_node_id = getIntNodeId(type, pin_id, sub_pin_id)
    const internal_pin = this._pin[int_node_id]

    internal_pin.$element.style.opacity = _opacity

    const source_id = input ? ext_node_id : int_node_id
    const target_id = input ? int_node_id : ext_node_id
    const link_id = getLinkId(source_id, target_id)
    const link_base = this._link_base[link_id]

    link_base.$element.style.opacity = _opacity
  }

  private _get_exposed_pin_internal_node_id = (
    type: IO,
    pin_id: string,
    sub_pin_id: string
  ): string | null => {
    const sub_pin_spec = this._get_exposed_sub_pin_spec(
      type,
      pin_id,
      sub_pin_id
    )

    return (
      this._get_exposed_pin_spec_internal_node_id(type, sub_pin_spec) ||
      getIntNodeId(type, pin_id, sub_pin_id)
    )
  }

  private _get_exposed_pin_spec_internal_node_id = (
    type: IO,
    sub_pin_spec: GraphExposedSubPinSpec
  ): string | null => {
    const { mergeId, unitId, pinId } = sub_pin_spec
    if (mergeId) {
      const merge_node_id = getMergeNodeId(mergeId)
      const merge_anchor_node_id = this._get_merge_anchor_node_id(merge_node_id)
      return merge_anchor_node_id
    } else if (unitId && pinId) {
      if (pinId === SELF) {
        return unitId
      } else {
        return getPinNodeId(unitId!, type, pinId!)
      }
    } else {
      return null
    }
  }

  private _set_exposed_sub_pin_color = (
    type: IO,
    pin_id: string,
    sub_pin_id: string,
    stroke: string
  ): void => {
    const int_node_id = getIntNodeId(type, pin_id, sub_pin_id)
    const ext_node_id = getExtNodeId(type, pin_id, sub_pin_id)

    const input = type === 'input'

    const external_pin = this._pin[ext_node_id]

    // AD HOC
    // whoever called this method did so using spec data not sim data
    if (!external_pin) {
      return
    }

    external_pin.$element.style.borderColor = stroke

    if (!input) {
      external_pin.$element.style.backgroundColor = stroke
    }

    const name_comp = this._ext_pin_name[ext_node_id]

    name_comp.$element.style.color = stroke

    const end_marker = this._exposed_link_end_marker[ext_node_id]
    const start_marker = this._exposed_link_start_marker[ext_node_id]

    if (end_marker) {
      end_marker.$element.style.stroke = stroke
    }
    if (start_marker) {
      start_marker.$element.style.stroke = stroke
    }

    const source_id = input ? ext_node_id : int_node_id
    const target_id = input ? int_node_id : ext_node_id

    const link_id = getLinkId(source_id, target_id)

    const link_base = this._link_base[link_id]

    link_base.$element.style.stroke = stroke
  }

  private _refresh_exposed_pin_set_color = (type: IO, pin_id: string): void => {
    // console.log('Graph', '_refresh_exposed_pin_set_color', type, pin_id)
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this._refresh_exposed_sub_pin_color(type, pin_id, sub_pin_id)
    }
  }

  private _reset_exposed_pin_set_color = (type: IO, pin_id: string): void => {
    // console.log('Graph', '_reset_exposed_pin_set_color', type, pin_id)
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this._reset_exposed_sub_pin_color(type, pin_id, sub_pin_id)
    }
  }

  private _get_exposed_sub_pin_color = (type: IO): string => {
    // const color = type === 'input' ? CYAN : type === 'output' ? MAGENTA : WHITE
    const color = this._theme.node
    return color
  }

  private _refresh_exposed_sub_pin_color = (
    type: IO,
    pin_id: string,
    sub_pin_id: string
  ) => {
    // TODO
    const ext_node_id = getExtNodeId(type, pin_id, sub_pin_id)
    const int_node_id = getIntNodeId(type, pin_id, sub_pin_id)
    if (
      this._is_node_hovered(ext_node_id) ||
      this._is_node_selected(ext_node_id) ||
      this._is_node_ascend(ext_node_id) ||
      this._is_node_hovered(int_node_id) ||
      this._is_node_selected(int_node_id) ||
      this._is_node_ascend(int_node_id)
    ) {
      this._set_node_mode_color(ext_node_id)
    } else {
      this._reset_exposed_sub_pin_color(type, pin_id, sub_pin_id)
    }
  }

  private _reset_exposed_sub_pin_color = (
    type: IO,
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
    type: IO,
    pin_id: string,
    color: string
  ): void => {
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this._set_exposed_sub_pin_color(type, pin_id, sub_pin_id, color)
    }
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
        end_marker.$element.style.stroke = color
      } else {
        end_marker.$element.style.fill = color
      }
    }
    if (start_marker) {
      if (pin_memory || pin_ref) {
        start_marker.$element.style.stroke = color
      } else {
        start_marker.$element.style.fill = color
      }
    }
  }

  private _set_link_color = (link_id: string, color: string): void => {
    // console.log('_set_link_color', link_id, color)

    const link_base = this._link_base[link_id]

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
    const borderColor = ref && !output ? COLOR_NONE : color
    pin.$element.style.borderColor = borderColor
    if (type === 'output' && !ref) {
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
    pin_name.$element.style.color = color
  }

  private _set_link_pin_link_text_color = (
    pin_node_id: string,
    fill: string
  ): void => {
    const link_id = getPinLinkIdFromPinNodeId(pin_node_id)
    const link_text = this._link_text[link_id]
    link_text.$element.style.fill = fill
  }

  public remove_datum = (datum_node_id: string) => {
    // console.log('Graph', 'remove_datum', datum_node_id)
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)
    this._remove_datum(datum_node_id)
    this._dispatch_action(removeDatum(datum_id))
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

    this._mem_remove_pin_datum_tree(pin_node_id)

    this._start_graph_simulation(LAYER_DATA_LINKED)
  }

  private _mem_remove_pin_datum_tree = (pin_node_id: string): void => {
    // console.log('Graph', '_mem_remove_pin_datum_tree', pin_node_id)
    delete this._pin_datum_tree[pin_node_id]

    if (this._is_link_pin_node_id(pin_node_id)) {
      const { unitId, type } = segmentLinkPinNodeId(pin_node_id)

      if (!this._spec_is_link_pin_ignored(pin_node_id)) {
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

  public remove_pin_from_merge = (
    merge_node_id: string,
    pin_node_id: string
  ): void => {
    this._remove_pin_from_merge(merge_node_id, pin_node_id)

    const { id: merge_id } = segmentMergeNodeId(merge_node_id)
    const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

    this._dispatch_action(removePinFromMerge(merge_id, type, unitId, pinId))
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
    type: IO,
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

      const pin_link_id = getPinLinkIdFromPinNodeId(pin_node_id)

      if (pinId === SELF) {
        //
      } else {
        this._hide_link_text(pin_link_id)
        this._show_link_pin_name(pin_node_id)
      }
    }

    const merge_input = this._merge_input[merge_node_id]
    const merge_output = this._merge_output[merge_node_id]

    if (is_input) {
      if (this._merge_input_count[merge_id] === 0) {
        if (!merge_ref) {
          const merge_output_width = 2 * PIN_RADIUS

          merge_input.$element.style.visibility = 'hidden'

          merge_output.$element.style.width = `${merge_output_width}px`
          merge_output.$element.style.height = `${merge_output_width}px`
          merge_output.$element.style.transform = ''
        }
      }
    } else {
      if (this._merge_output_count[merge_id] === 0) {
        if (!merge_ref) {
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
    type: IO,
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
        this.remove_pin_from_merge(merge_node_id, pin_node_id)
      },
      (merge_node_id, other_pin_node_id: string) => {
        if (this._is_blue_drag_init_anchor(merge_node_id)) {
          this._update_blue_drag_init_anchor(merge_node_id, other_pin_node_id)
        }
        const internal_node_id = this._pin_to_internal[merge_node_id]
        if (internal_node_id) {
          const { pinId, type, subPinId } =
            segmentExposedNodeId(internal_node_id)
          this._unplug_exposed_pin(type, pinId, subPinId)
        }

        this.remove_merge(merge_node_id)

        if (internal_node_id) {
          const { pinId, type, subPinId } =
            segmentExposedNodeId(internal_node_id)
          const {
            unitId,
            type: _type,
            pinId: _pinId,
          } = segmentLinkPinNodeId(other_pin_node_id)
          if (type === _type) {
            this._plug_exposed_pin(_type, pinId, subPinId, {
              unitId,
              pinId: _pinId,
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
    // console.log('Graph', '_sim_remove_pin_or_merge', pin_node_id)
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
    return this._sim_remove_node_type(pin_node_id)
  }

  private _sim_remove_node_type = (node_id: string): void => {
    const type_node_id = getTypeNodeId(node_id)

    if (!this._has_node(type_node_id)) {
      return
    }

    const type_link_id = getLinkId(type_node_id, node_id)

    delete this._type_link[type_link_id]

    delete this._type_container[type_node_id]
    delete this._type_node[type_node_id]
    delete this._type[type_node_id]

    delete this._node_type[type_node_id]

    this._sim_remove_link(type_link_id)
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

    this._link_pin_input_set.delete(pin_node_id)
    this._link_pin_output_set.delete(pin_node_id)
    this._link_pin_ref_set.delete(pin_node_id)

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

  public remove_merge = (merge_node_id: string): void => {
    // console.log('Graph', 'remove_merge', merge_node_id)
    this._dispatch_action_remove_merge(merge_node_id)

    this._remove_merge(merge_node_id)
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
    // console.log('Graph', '__spec_remove_merge', merge_id)

    this._spec = specReducer.removeMerge({ id: merge_id }, this._spec)
  }

  private _is_link_pin_output_ref = (type: IO, pinId: string): boolean => {
    return type === 'output' && pinId === SELF
  }

  private _sim_remove_merge = (merge_node_id: string): void => {
    // console.log('Graph', '_sim_remove_merge', merge_node_id)

    const { id: merge_id } = segmentMergeNodeId(merge_node_id)

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

    const int_node_id = this._pin_to_internal[merge_node_id]
    if (int_node_id) {
      const { type, pinId, subPinId } = segmentExposedNodeId(int_node_id)
      this._sim_unplug_exposed_pin(type, pinId, subPinId)
    }

    const merge_datum_node_id = this._pin_to_datum[merge_node_id]
    if (merge_datum_node_id) {
      this._sim_remove_datum(merge_datum_node_id)
    }

    const merge_ref = this._is_merge_ref(merge_node_id)
    const merge_unit_id = this._merge_to_ref_unit[merge_node_id]

    const merge_ref_output_id = this._merge_to_ref_output[merge_node_id]

    delete this._merge_pin_count[merge_id]
    delete this._merge_input_count[merge_id]
    delete this._merge_output_count[merge_id]

    delete this._merge_to_pin[merge_node_id]
    delete this._merge_to_input[merge_node_id]
    delete this._merge_to_output[merge_node_id]
    delete this._merge_active_output_count[merge_node_id]
    delete this._merge_active_input_count[merge_node_id]
    delete this._merge_ref[merge_node_id]
    delete this._merge_to_ref_output[merge_node_id]

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
        delete this._merge_to_ref_output[merge_node_id]
        delete this._ref_output_to_merge[merge_ref_output_id]
      }
    }

    if (this._node[merge_node_id]) {
      this._sim_remove_pin_type(merge_node_id)
      this._sim_remove_merge_node(merge_node_id)
    }

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _sim_remove_merge_node = (merge_node_id: string): void => {
    delete this._pin_node[merge_node_id]
    delete this._normal_node[merge_node_id]

    delete this._node_type[merge_node_id]

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

    this._zoom_comp.removeChild(link_el)

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

    this._node_link_count[source_id]--
    this._node_link_count[target_id]--

    this._set_node_link_heap_count(source_id, this._node_link_count[source_id])
    this._set_node_link_heap_count(target_id, this._node_link_count[target_id])

    this._refresh_simulation_stability()

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

    if (this._long_press_collapse_node_id.has(node_id)) {
      this._stop_node_long_press_collapse(node_id)
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

    this._unlisten_node(node_id)

    const node_el = this._node_comp[node_id]

    this._zoom_comp.removeChild(node_el)

    delete this._node[node_id]
    delete this._node_fixed[node_id]
    delete this._node_draggable[node_id]
    // delete this._node_type[node_id] // TODO
    delete this._node_selection[node_id]
    delete this._node_comp[node_id]
    delete this._node_content[node_id]
    delete this._node_link_count[node_id]

    this._remove_node_link_heap(node_id)

    const compatible_node_id = this._compatible_node_id[node_id]
    if (compatible_node_id) {
      delete this._compatible_node_id[node_id]
      this._compatible_node_count--
    }

    const layer = this._node_layer[node_id]
    delete this._node_layer[node_id]
    delete this._layer_node[layer][node_id]

    remove_node_from_graph(this._node_graph, node_id)

    this._rebuild_subgraph()
  }

  private _rebuild_subgraph = () => {
    if (this._drag_count > 0) {
      for (const drag_node_id in this._drag_node_id) {
        this._stop_drag_node_static(drag_node_id)
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
      for (const drag_node_id in this._drag_node_id) {
        this._start_drag_node_static(drag_node_id)
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

  private _on_link_long_click = (
    link_id: string,
    event: IOPointerEvent
  ): void => {
    if (isPinLinkId(link_id)) {
      const { pinNodeId } = segmentPinLinkId(link_id)
      if (
        this._mode === 'remove' ||
        this._mode === 'change' ||
        this._mode === 'add' ||
        this._mode === 'data'
      ) {
        this._on_node_long_click(pinNodeId, event)
      }
    }
  }

  private _on_link_long_press = (
    link_id: string,
    event: IOPointerEvent
  ): void => {
    if (isPinLinkId(link_id)) {
      const { pinNodeId } = segmentPinLinkId(link_id)

      if (
        this._mode === 'remove' ||
        this._mode === 'change' ||
        this._mode === 'add' ||
        this._mode === 'data'
      ) {
        this._on_node_long_press(pinNodeId, event)
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
    this._resize_pointer_count++

    const cursor = `${direction}-resize`

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

  private _is_layout_component_layer_visible = (
    sub_component_id: string
  ): boolean => {
    const visible = this._layout_path.includes(sub_component_id)

    return visible
  }

  private _is_layout_component_layer_current = (
    sub_component_id: string
  ): boolean => {
    const parent_id = this._get_sub_component_spec_parent_id(sub_component_id)

    const current_layout_layer_id = this._get_current_layout_layer_id()

    const visible = parent_id === current_layout_layer_id

    return visible
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
        let should_resize = false

        const is_unit = isUnitNodeId(selected_node_id)

        if (is_unit) {
          const is_unit_component = this._is_unit_component(selected_node_id)

          if (is_unit_component) {
            if (this._tree_layout) {
              if (this._is_layout_component_layer_current(selected_node_id)) {
                should_resize = true
              }
            } else {
              should_resize = true
            }
          }
        }

        if (should_resize) {
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
    this._graph.$element.style.cursor = cursor

    const pointer_id = this._resize_node_id_pointer_id[unit_id]

    delete this._resize_node_id_pointer_id[unit_id]
    delete this._resize_pointer_id_node_id[pointer_id]

    this._resize_pointer_count--

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
      const spec_id = idFromUnitValue(tree.value)

      const specs = { ...this.$system.specs, ...this.$pod.specs }

      if (isComponent(specs, spec_id)) {
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
      const spec_id = idFromUnitValue(tree.value)

      const specs = { ...this.$system.specs, ...this.$pod.specs }

      const r = getSpecRadiusById(specs, spec_id, true) - 1.5
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
    // console.log('Graph', '_on_datum_change', datum_id, data)

    if (datum_id === this._edit_datum_id) {
      this._edit_datum_commited = false
      this._edit_datum_never_changed = false
    }

    this._sim_set_datum(datum_id, data)
  }

  private _focus_datum = (datum_id: string, path: number[]): void => {
    // console.log('Graph', '_focus_datum')

    const datum_node_id = getDatumNodeId(datum_id)
    const datum = this._datum[datum_node_id]

    if (datum && datum instanceof Datum) {
      datum.focusChild(path, { preventScroll: true })
    }
  }

  private _for_each_unit_pin = (
    unit_id: string,
    callback: (pin_node_id: string, type: IO, pin_id: string) => void
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

  private _for_each_unit_ref_input = (
    unit_id: string,
    callback: (input_node_id: string, input_id: string) => void
  ) => {
    this._for_each_unit_input(unit_id, (input_node_id, input_id) => {
      if (this._is_link_pin_ref(input_node_id)) {
        callback(input_node_id, input_id)
      }
    })
  }

  private _for_each_unit_merged_pin = (
    unit_id: string,
    callback: (input_node_id: string, input_id: string) => void
  ) => {}

  private _for_each_merge_pin = (
    merge_id: string,
    callback: (unit_id: string, type: IO, pin_id: string) => void
  ) => {
    const merge = this.__get_merge(merge_id)

    forEachPinOnMerge(merge, callback)
  }

  private _for_each_spec_id_pin = (
    id: string,
    callback: (type: IO, pin_id: string) => void
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
    const { specs } = this.$system

    const spec = getSpec(specs, id)

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
    const { specs } = this.$system

    const spec = getSpec(specs, id)

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

  private _for_each_visible_unit_output = (
    unit_id: string,
    callback: (pin_node_id: string, output_id: string) => void
  ) => {
    this._for_each_unit_output(unit_id, (output_node_id, input_id) => {
      if (!this._spec_is_link_pin_ignored(output_node_id)) {
        callback(output_node_id, input_id)
      }
    })
  }

  public set_datum = (datum_id: string, tree: TreeNode) => {
    this._sim_set_datum(datum_id, tree)
    this._dispatch_action(setDatum(datum_id, tree.value))
  }

  private _sim_set_datum = (datum_id: string, tree: TreeNode) => {
    this._datum_tree[datum_id] = tree
    const datum_node_id = getDatumNodeId(datum_id)

    if (tree.type === TreeNodeType.Unit) {
      const datum = this._datum[datum_node_id] as ClassDatum
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
      this._refresh_selection_dashoffset(edit_datum_node_id)

      const prevent =
        this._edit_datum_commited || this._edit_datum_never_changed
      this._commit_data_value(edit_datum_id, data, prevent)

      this._edit_datum_just_blurred = true
      setTimeout(() => {
        this._edit_datum_just_blurred = false
      }, 0)
    }

    if (!this._disabled && this._control_lock) {
      this.focus()

      this._enable_crud()
      this._enable_keyboard()
    }
  }

  private _commit_data_value = (
    datum_id: string,
    tree: TreeNode,
    prevent: boolean = false
  ) => {
    // console.log('Graph', '_commit_data_value')

    this._edit_datum_commited = true

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
    // console.log('Graph', '_on_datum_focus', datum_id)

    const datum_node_id = getDatumNodeId(datum_id)

    if (!this._is_node_selected(datum_node_id)) {
      this._deselect_all()

      this.select_node(datum_node_id)
    }

    this._edit_datum_id = datum_id
    this._edit_datum_node_id = datum_node_id
    this._edit_datum_path = path
    this._edit_datum_never_changed = true

    this._refresh_node_selection(datum_node_id)

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

    delete this._node_type[datum_node_id]

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

    this._dispatch_action_remove_unit(unit_id)
  }

  private _remove_unit = (unit_id: string) => {
    // console.log('Graph', '_remove_unit', unit_id)

    this._pod_remove_unit(unit_id)
    this._state_remove_unit(unit_id)
  }

  public state_remove_unit = (unit_id: string) => {
    this._state_remove_unit(unit_id)
  }

  private _state_remove_unit = (unit_id: string) => {
    // console.log('Graph', '_state_remove_unit', unit_id)

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

    if (
      !this._spec.component.children ||
      this._spec.component.children.length === 0
    ) {
      delete this._spec.component
    }

    delete this._layout_node[unit_id]
    delete this._layout_target_node[unit_id]
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
      this._pod_disconnect_sub_component(unit_id)
    }
  }

  private _sim_remove_link_pin = (pin_node_id: string): void => {
    // console.log('Graph', '_sim_remove_link_pin', pin_node_id)
    const { unitId } = segmentLinkPinNodeId(pin_node_id)

    const int_node_id = this._pin_to_internal[pin_node_id]
    if (int_node_id) {
      const { type, pinId, subPinId } = segmentExposedNodeId(int_node_id)
      this._sim_unplug_exposed_pin(type, pinId, subPinId)
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

    const parent_id = this._get_sub_component_spec_parent_id(unit_id)

    this._sim_move_out_sub_component_children(unit_id, parent_id)

    if (this._is_sub_component_fullwindow(unit_id)) {
      this._decouple_sub_component(unit_id)

      this._fullwindow_component_set.delete(unit_id)

      pull(this._fullwindow_component_ids, unit_id)
    }

    this._unit_component_count--

    const sub_component = this._get_sub_component(unit_id)

    if (sub_component) {
      const sub_component_parent_id =
        this._get_sub_component_spec_parent_id(unit_id)

      const parent_sub_component = this._get_sub_component(
        sub_component_parent_id
      )

      // for (const sub_component_child_id of sub_component_spec_children) {
      //   const sub_component_child = this._get_sub_component(
      //     sub_component_child_id
      //   )
      //   if (sub_component_parent_id) {
      //     parent_sub_component.appendParentRoot(sub_component_child)
      //   } else {
      //     this._component.pushRoot(sub_component_child)
      //   }
      // }

      if (sub_component_parent_id) {
        if (parent_sub_component.hasParentRoot(sub_component)) {
          parent_sub_component.pullParentRoot(sub_component)
        }
      } else {
        if (this._component.hasRoot(sub_component)) {
          this._component.pullRoot(sub_component)
        }
      }

      this._component.removeSubComponent(unit_id)

      sub_component.destroy()
    }

    const layout_core = this._layout_core[unit_id]

    const parent_layout_layer = this._get_spec_parent_layout_layer(unit_id)

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
    }
    delete this._layout_component_count[unit_id]
    delete this._sub_component_parent[unit_id]

    if (this._layout_core_abort_animation[unit_id]) {
      this._layout_core_abort_animation[unit_id]()
      delete this._layout_core_abort_animation[unit_id]
      this._layout_core_animation_count--
    }

    delete this._component_nodes[unit_id]
    delete this._core_component_frame_context[unit_id]
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

    delete this._node_type[unit_id]

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
    }

    delete this._subgraph_cache[unit_id]
    delete this._subgraph_pod_cache[unit_id]

    delete this._unit_node[unit_id]

    delete this._err[unit_id]

    delete this._graph_state[unit_id]

    this._unit_count--

    if (this._minimap) {
      this._minimap.tick()
    }

    if (this._unit_count === 0) {
      if (this._minimap_screen) {
        this._minimap_screen.$element.style.display = 'none'
      }
    }
  }

  private _sim_remove_unit_pins = (unit_id: string): void => {
    this._for_each_unit_pin(unit_id, (pin_node_id: string) => {
      this._sim_remove_link_pin(pin_node_id)

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
      const { type, pinId, subPinId } =
        segmentExposedNodeId(exposed_pin_node_id)
      if (!removed_exposed_pin_id[type].has(pinId)) {
        const pin_count = this._get_exposed_pin_set_count(exposed_pin_node_id)
        if (pin_count === 1 || pin_count === 0) {
          removed_exposed_pin_id[type].add(pinId)
          this._pod_remove_exposed_pin_set(type, pinId)
        } else {
          if (
            !removed_exposed_sub_pin_id[type][pinId] ||
            !removed_exposed_sub_pin_id[type][pinId].has(subPinId)
          ) {
            removed_exposed_sub_pin_id[type][pinId] =
              removed_exposed_sub_pin_id[type][pinId] || new Set()
            removed_exposed_sub_pin_id[type][pinId].add(subPinId)
            this.__pod_remove_exposed_sub_pin(type, pinId, subPinId)
          }
        }
      }
    }

    const removed_unit = new Set<string>()

    const removed_merge = new Set<string>()

    for (const merge_node_id of merge_ids) {
      removed_merge.add(merge_node_id)
      this._pod_remove_merge(merge_node_id)

      this._dispatch_action_remove_merge(merge_node_id)
    }

    for (const unit_id of unit_ids) {
      removed_unit.add(unit_id)
      this._pod_remove_unit(unit_id)

      this._dispatch_action_remove_unit(unit_id)
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
      const { type, pinId, subPinId } =
        segmentExposedNodeId(exposed_pin_node_id)
      if (!removed_exposed_pin_id[type].has(pinId)) {
        const pin_count = this._get_exposed_pin_set_count(exposed_pin_node_id)
        if (pin_count === 1 || pin_count === 0) {
          removed_exposed_pin_id[type].add(pinId)
          this._sim_remove_exposed_pin_set(type, pinId)
        } else {
          if (
            !removed_exposed_sub_pin_id[type][pinId] ||
            !removed_exposed_sub_pin_id[type][pinId].has(subPinId)
          ) {
            removed_exposed_sub_pin_id[type][pinId] =
              removed_exposed_sub_pin_id[type][pinId] || new Set()
            removed_exposed_sub_pin_id[type][pinId].add(subPinId)
            this.__sim_remove_exposed_sub_pin(type, pinId, subPinId)
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
      const { type, pinId, subPinId } =
        segmentExposedNodeId(exposed_pin_node_id)
      if (!removed_exposed_pin_id[type].has(pinId)) {
        const pin_count = this._get_exposed_pin_set_count(exposed_pin_node_id)
        if (pin_count === 1 || pin_count === 0) {
          removed_exposed_pin_id[type].add(pinId)
          this._spec_remove_exposed_pin_set(type, pinId)
        } else {
          if (
            !removed_exposed_sub_pin_id[type][pinId] ||
            !removed_exposed_sub_pin_id[type][pinId].has(subPinId)
          ) {
            removed_exposed_sub_pin_id[type][pinId] =
              removed_exposed_sub_pin_id[type][pinId] || new Set()
            removed_exposed_sub_pin_id[type][pinId].add(subPinId)
            this.__spec_remove_exposed_sub_pin(type, pinId, subPinId)
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

  private _sim_remove_exposed_pin_set = (type: IO, pin_id: string): void => {
    // console.log('Graph', '_sim_remove_exposed_pin_set')
    this._exposed_pin_set_count--
    const exposed_pin_spec = this._get_exposed_pin_spec(type, pin_id)
    const { pin = {} } = exposed_pin_spec
    for (const sub_pin_id in pin) {
      this.__sim_remove_exposed_sub_pin(type, pin_id, sub_pin_id)
    }
  }

  public remove_exposed_pin_set = (type: IO, pin_id: string): void => {
    this.__remove_exposed_pin_set(type, pin_id)
    this._dispatch_action(coverPinSet(type, pin_id))
  }

  private __remove_exposed_pin_set = (type: IO, id: string): void => {
    console.log('Graph', '_remove_exposed_pin_set', type, id)
    this._sim_remove_exposed_pin_set(type, id)
    this._spec_remove_exposed_pin_set(type, id)
    this._pod_remove_exposed_pin_set(type, id)
  }

  private _spec_remove_exposed_pin_set = (type: IO, id: string): void => {
    // console.log('Graph', '_spec_remove_exposed_pin_set', type, id)
    this._spec = specReducer.coverPinSet({ id, type }, this._spec)
  }

  private _pod_remove_exposed_pin_set = (type: IO, id: string): void => {
    // console.log('Graph', '_pod_remove_exposed_pin_set')
    this._pod.$coverPinSet({
      type,
      id,
    })
  }

  private __plug_exposed_pin_to = (
    type: IO,
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
      const { pinId, subPinId } = segmentExposedNodeId(pin_internal_pin_id)
      this._unplug_exposed_pin(type, pinId, subPinId)
    }

    this.plug_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
  }

  public plug_exposed_pin = (
    type: IO,
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec
  ): void => {
    this._plug_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)

    this._dispatch_action(plugPin(type, pin_id, sub_pin_id, sub_pin_spec))
  }

  private _plug_exposed_pin = (
    type: IO,
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
    type: IO,
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

  private _get_exposed_pin_marker_path = (
    type: IO,
    ext_node_id: string,
    int_node_id: string
  ): SVGPath => {
    const input = type === 'input'

    const link_id_source_id = input ? ext_node_id : int_node_id
    const link_id_target_id = input ? int_node_id : ext_node_id

    const link_id = getLinkId(link_id_source_id, link_id_target_id)

    const start_marker = this._link_marker_start[link_id]
    const end_marker = this._link_marker_end[link_id]

    const marker = input ? end_marker : start_marker

    return marker
  }

  private _set_exposed_pin_marker_to_node = (
    type: IO,
    ext_node_id: string,
    int_node_id: string,
    anchor_node_id: string,
    padding: number = 0
  ): void => {
    const path = this._get_exposed_pin_marker_path(
      type,
      ext_node_id,
      int_node_id
    )

    const anchor_shape = this._get_node_shape(anchor_node_id)
    const anchor_r = this._get_node_r(anchor_node_id)

    const r = anchor_r + padding

    const start_marker_d = describeArrowShape(anchor_shape, r)

    path.setProp('d', start_marker_d)
  }

  private _set_exposed_pin_marker_to_default = (
    type: IO,
    ext_node_id: string,
    int_node_id: string
  ): void => {
    const path = this._get_exposed_pin_marker_path(
      type,
      ext_node_id,
      int_node_id
    )
    const start_marker_d = describeArrowSemicircle(PIN_RADIUS)

    path.setProp('d', start_marker_d)
  }

  private _sim_refresh_exposed_pin_marker = (
    type: IO,
    ext_node_id: string,
    int_node_id: string,
    anchor_node_id: string | null
  ): void => {
    if (anchor_node_id) {
      this._set_exposed_pin_marker_to_node(
        type,
        ext_node_id,
        int_node_id,
        anchor_node_id
      )
    } else {
      this._set_exposed_pin_marker_to_default(type, ext_node_id, int_node_id)
    }
  }

  private _state_plug_exposed_pin = (
    type: IO,
    pin_id: string,
    sub_pin_id: string,
    sub_pin_spec: GraphExposedSubPinSpec
  ): void => {
    this._spec_plug_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
    this._sim_plug_exposed_pin(type, pin_id, sub_pin_id, sub_pin_spec)
  }

  private _sim_plug_exposed_pin = (
    type: IO,
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
    const ext_node_id = getExtNodeId(type, pin_id, sub_pin_id)
    const int_node_id = getIntNodeId(type, pin_id, sub_pin_id)

    const input = type === 'input'

    this._exposed_pin_plugged_count++
    this._exposed_pin_unplugged_count--

    const anchor_node_id: string = this._get_exposed_pin_spec_internal_node_id(
      type,
      sub_pin_spec
    )

    this._sim_refresh_exposed_pin_marker(
      type,
      ext_node_id,
      int_node_id,
      anchor_node_id
    )

    this._exposed_ext_plugged[ext_node_id] = anchor_node_id
    this._exposed_int_plugged[int_node_id] = anchor_node_id
    this._pin_to_internal[anchor_node_id] = int_node_id

    delete this._exposed_ext_unplugged[ext_node_id]
    delete this._exposed_int_unplugged[int_node_id]

    const source_id = input ? ext_node_id : int_node_id
    const target_id = input ? int_node_id : ext_node_id
    const link_id = getLinkId(source_id, target_id)
    this._sim_change_link_node(link_id, anchor_node_id, !input)

    this._set_link_d(link_id, EXPOSED_LINK_DISTANCE / 3)

    this._sim_remove_exposed_int_node(int_node_id)

    this._start_graph_simulation(LAYER_EXPOSED)
  }

  private _pod_plug_exposed_pin = (
    type: IO,
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
    type: IO,
    pin_id: string,
    sub_pin_id: string
  ): void => {
    this._unplug_exposed_pin(type, pin_id, sub_pin_id)
    this._dispatch_action(unplugPin(type, pin_id, sub_pin_id))
  }

  private _unplug_exposed_pin = (
    type: IO,
    pin_id: string,
    sub_pin_id: string
  ): void => {
    // console.log('Graph', '_unplug_exposed_pin')
    this._sim_unplug_exposed_pin(type, pin_id, sub_pin_id)
    this._spec_unplug_exposed_pin(type, pin_id, sub_pin_id)
    this._pod_unplug_exposed_pin(type, pin_id, sub_pin_id)
  }

  private _spec_unplug_exposed_pin = (
    type: IO,
    pinId: string,
    subPinId: string
  ): void => {
    // console.log('Graph', '_spec_unplug_exposed_pin', type, pinId, subPinId)
    this._spec = specReducer.unplugPin({ type, pinId, subPinId }, this._spec)
  }

  private _sim_unplug_exposed_pin = (
    type: IO,
    pin_id: string,
    sub_pin_id: string
  ): void => {
    // console.log('Graph', '_sim_unplug_exposed_pin', type, pin_id, sub_pin_id)
    const sub_pin_spec = this._get_exposed_sub_pin_spec(
      type,
      pin_id,
      sub_pin_id
    )

    const ext_node_id = getExtNodeId(type, pin_id, sub_pin_id)
    const int_node_id = getIntNodeId(type, pin_id, sub_pin_id)

    const input = type === 'input'

    const anchor_node_id: string = this._get_exposed_pin_spec_internal_node_id(
      type,
      sub_pin_spec
    )

    this._sim_refresh_exposed_pin_marker(type, ext_node_id, int_node_id, null)

    delete this._exposed_ext_plugged[ext_node_id]
    delete this._exposed_int_plugged[int_node_id]

    delete this._pin_to_internal[anchor_node_id]

    this._exposed_ext_unplugged[ext_node_id] = true
    this._exposed_int_unplugged[int_node_id] = true

    this._exposed_pin_plugged_count--
    this._exposed_pin_unplugged_count++

    const pin_position = this._get_node_position(anchor_node_id)

    this._sim_add_internal_pin(type, pin_id, sub_pin_id, pin_position)

    const source_id = input ? ext_node_id : int_node_id
    const target_id = input ? int_node_id : ext_node_id
    const link_id = getLinkId(source_id, target_id)
    this._sim_change_link_node(link_id, int_node_id, !input)

    this._set_link_d(link_id, EXPOSED_LINK_DISTANCE)

    this._refresh_exposed_sub_pin_color(type, pin_id, sub_pin_id)
  }

  private _pod_unplug_exposed_pin = (
    type: IO,
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

  private _get_unit_spec_render = (unit_id: string): boolean => {
    const { specs } = this.$system

    const spec_id = this._get_unit_spec_id(unit_id)

    return getSpecRender(specs, spec_id)
  }

  private _is_unit_component = (unit_id: string): boolean => {
    const { specs } = this.$system

    const unit_spec_render = this._get_unit_spec_render(unit_id)

    if (unit_spec_render === undefined) {
      const spec_id = this._get_unit_spec_id(unit_id)

      const is_component_defined = isComponent(specs, spec_id)

      return is_component_defined
    } else {
      return unit_spec_render
    }
  }

  private _is_unit_base = (unit_id: string): boolean => {
    const { specs } = this.$system

    const spec_id = this._get_unit_spec_id(unit_id)

    return isBaseSpecId(specs, spec_id)
  }

  private _is_datum_class_literal = (datum_node_id: string): boolean => {
    const datum_tree = this._get_datum_tree(datum_node_id)
    const is_class_literal = datum_tree.type === TreeNodeType.Unit
    return is_class_literal
  }

  private _get_units_position = (unit_id: string): Dict<Position> => {
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
    type: IO,
    pinId: string
  ): Dict<{ int?: Position; ext?: Position }> => {
    const position = {}
    const pin_spec = this._get_exposed_pin_spec(type, pinId)
    const { pin = {} } = pin_spec
    for (const sub_pin_id in pin) {
      const ext_node_id = getExtNodeId(type, pinId, sub_pin_id)
      const int_node_id = getIntNodeId(type, pinId, sub_pin_id)
      const internal_pin_anchor_node_id =
        this._get_internal_pin_anchor_node_id(int_node_id) || int_node_id
      const int = this._get_node_position(internal_pin_anchor_node_id)
      const ext = this._get_node_position(ext_node_id)
      position[sub_pin_id] = { int, ext }
    }
    return position
  }

  private _on_pointer_down = (event: IOPointerEvent, _event: PointerEvent) => {
    // console.log('Graph', '_on_pointer_down')
    const { pointerId, clientX, clientY } = event

    if (this._restart_gesture) {
      this._start_gesture(event)
      return
    }

    if (!this._search_hidden) {
      _event.preventDefault()
    }

    this.__on_pointer_down(pointerId, clientX, clientY)
  }

  private __on_pointer_down = (
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    // console.log('Graph', '__on_pointer_down')

    // if (event.button === 2) {
    //   return
    // }

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

    const is_background_pointer = this._is_background_pointer(pointerId)

    if (is_background_pointer) {
      this._main.setPointerCapture(pointerId)

      if (this._mode === 'multiselect') {
        this._on_multiselect_area_start(pointerId, clientX, clientY)
      }
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
      parent_sub_component.insertParentRoot(sub_component, i, slot)
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

    this.__on_layout_component_drag_start(unit_id, clientX, clientY)
  }

  private __on_layout_component_drag_start = (
    unit_id: string,
    clientX: number,
    clientY: number
  ): void => {
    // console.log(
    //   'Graph',
    //   '_on_layout_component_drag_start',
    //   unit_id,
    //   clientX,
    //   clientY
    // )

    this._layout_drag_node_count++
    if (this._layout_drag_node_count === 1) {
      this._layout_dragging = true
    }
    this._layout_drag_node[unit_id] = true
    this._layout_drag_index[unit_id] =
      this._get_sub_component_tree_index(unit_id)
    this._layout_drag_direction[unit_id] = undefined

    const parent_layout_layer = this._get_spec_parent_layout_layer(unit_id)

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

    const parent_layout_layer = this._get_spec_parent_layout_layer(unit_id)

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

    const parent_layout_layer = this._get_spec_parent_layout_layer(unit_id)

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

    this.__drag_start(node_id, pointerId, clientX, clientY)
  }

  private __drag_start = (
    node_id: string,
    pointerId: number,
    clientX: number,
    clientY: number
  ) => {
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
    if (this._is_ext_node_id(node_id)) {
      this._negate_ext_node_id(node_id)
    } else if (this._is_int_pin_node_id(node_id)) {
      const ext_node_id = getExtNodeIdFromIntNodeId(node_id)
      this._negate_ext_node_id(ext_node_id)
    }
  }

  private _negate_ext_node_id = (ext_node_id: string): void => {
    this._negate_node_layer(ext_node_id)
    const { type, pinId, subPinId } = segmentExposedNodeId(ext_node_id)
    const int_node_id = getIntNodeId(type, pinId, subPinId)

    if (this._has_node(int_node_id)) {
      this._negate_node_layer(int_node_id)
    }

    const type_node_id = getTypeNodeId(ext_node_id)

    if (this._has_node(type_node_id)) {
      const type_link_id = getLinkId(type_node_id, ext_node_id)

      this._negate_node_layer(type_node_id)
      this._negate_link_layer(type_link_id)
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
    } else if (this._is_int_pin_node_id(node_id)) {
      //
    } else if (this._is_ext_node_id(node_id)) {
      const { type, pinId, subPinId } = segmentExposedNodeId(node_id)
      const int_node_id = getIntNodeId(type, pinId, subPinId)
      if (this._has_node(int_node_id)) {
        //
      } else {
        let anchor_node_id: string | undefined =
          this._get_exposed_pin_internal_node_id(type, pinId, subPinId)
        if (anchor_node_id) {
          const exposed_pin_node = this._node[node_id]
          const pin_node = this._node[anchor_node_id]
          const { l } = surfaceDistance(exposed_pin_node, pin_node)
          if (l > SURFACE_UNPLUG_DISTANCE) {
            this.unplug_exposed_pin(type, pinId, subPinId)
            this._negate_node_layer(int_node_id)
            this._refresh_compatible()
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
    const { pointerId, clientX, clientY } = event

    let new_node_id: string | null
    if (this._is_unit_node_id(node_id)) {
      new_node_id = this._sim_duplicate_unit(node_id)
    } else if (this._is_datum_node_id(node_id)) {
      new_node_id = this._sim_duplicate_datum(node_id)
    } else if (this._is_exposed_pin_node_id(node_id)) {
      new_node_id = this._sim_duplicate_exposed_pin(node_id)
    }

    if (new_node_id) {
      this._green_drag = true
      this._green_drag_node_id = node_id
      this._green_drag_clone_id = new_node_id

      this._force_pointer_drop_node(node_id, pointerId, clientX, clientY)
      this._force_pointer_drag_node(new_node_id, pointerId, clientX, clientY)

      this._ascend_node(new_node_id, pointerId)
    }

    return new_node_id
  }

  private _on_node_green_drag_end = (node_id: string) => {
    if (this._is_unit_node_id(node_id)) {
      const unit_id = node_id

      const _unit = this._get_unit(unit_id)

      const unit = clone(_unit)

      if (this._mode === 'data') {
        const green_drag_node_id = this._green_drag_node_id

        const state = this._get_unit_state(green_drag_node_id)

        const _state = clone(state)

        unit.state = _state

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

          unit.children = children
        }
      }

      this._pod_add_unit(unit_id, unit)

      if (this._is_unit_component(unit_id)) {
        this._sim_add_unit_component(unit_id)
        this._pod_connect_sub_component(unit_id)
      }

      this._dispatch_add_unit_action(unit_id, unit)
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
    this._blue_drag_init_start_position = this._get_units_position(unit_id)
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
          this._get_units_position(nearest_unit_id)

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

  private _on_multiselect_area_start = (
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    // console.log('Graph', '_on_multiselect_area_start')

    this._multiselect_area_ing = true
    this._multiselect_area_start_position = {
      x: clientX,
      y: clientY,
    }
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
        const _$context = this._core_component_frame_context[child_id]
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
      this._zoom_comp_alt.$element.style.pointerEvents = 'inherit'
    }

    const node_comp = this._get_node_comp(node_id)
    this._zoom_comp.removeChild(node_comp)
    this._zoom_comp_alt.appendChild(node_comp, 'default')

    if (this._is_link_pin_node_id(node_id)) {
      const link_id = getPinLinkIdFromPinNodeId(node_id)
      const link_comp = this._link_comp[link_id]
      this._zoom_comp.removeChild(link_comp)
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
    this._zoom_comp_alt.removeChild(node_comp)
    this._zoom_comp.appendChild(node_comp, 'default')

    if (this._is_link_pin_node_id(node_id)) {
      const link_id = getPinLinkIdFromPinNodeId(node_id)
      const link_comp = this._link_comp[link_id]
      this._zoom_comp_alt.removeChild(link_comp)
      this._zoom_comp.appendChild(link_comp, 'svg')
    }

    if (this._ascend_z_count === 0) {
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

  private _set_node_pointer_events = (
    node_id: string,
    pointerEvents: string
  ): void => {
    const node_comp = this._get_node_comp(node_id)
    node_comp.$element.style.pointerEvents = pointerEvents
  }

  private _release_node_pointer_capture = (
    node_id: string,
    pointer_id: number
  ): void => {
    const node_comp = this._get_node_comp(node_id)
    node_comp.releasePointerCapture(pointer_id)
  }

  private _ascend_node = (node_id: string, pointer_id: number): void => {
    console.log('Graph', '_ascend_node', node_id)

    // TODO set node negative layer
    this._negate_node_layer(node_id)
    this._ascend_node_z(node_id)

    // reset pointer capture (probably because node was moved in the DOM)
    this._set_node_pointer_capture(node_id, pointer_id)

    if (this._is_unit_node_id(node_id)) {
      this._for_each_unit_pin(node_id, (pin_node_id: string, type: IO) => {
        if (!this._is_link_pin_merged(pin_node_id)) {
          this._negate_node_layer(pin_node_id)
          this._ascend_node_z(pin_node_id)

          const datum_node_id = this._pin_to_datum[pin_node_id]
          if (datum_node_id) {
            this._negate_node_layer(datum_node_id)
          }
        }

        const { pinId, subPinId } = this._get_pin_exposed_id(type, pin_node_id)
        if (pinId !== null && subPinId !== null) {
          const ext_node_id = getExtNodeId(type, pinId, subPinId)
          this._negate_node_layer(ext_node_id)
        }
      })

      if (this._err[node_id]) {
        const err_node_id = getErrNodeId(node_id)

        this._negate_node_layer(err_node_id)
        this._ascend_node_z(err_node_id)
      }
    } else if (this._is_ext_node_id(node_id)) {
      const { pinId, type, subPinId } = segmentExposedNodeId(node_id)
      const int_node_id = getIntNodeId(type, pinId, subPinId)
      this._negate_node_layer(int_node_id)
      this._ascend_node_z(int_node_id)
    } else if (this._is_int_pin_node_id(node_id)) {
      const { pinId, type, subPinId } = segmentExposedNodeId(node_id)
      const ext_node_id = getExtNodeId(type, pinId, subPinId)
      this._negate_node_layer(ext_node_id)
      this._ascend_node_z(ext_node_id)
    }
  }

  private _descend_node = (node_id: string): void => {
    // console.log('Graph', '_descend_node', node_id)
    this._refresh_node_layer(node_id)
    this._descend_node_z(node_id)

    if (this._is_unit_node_id(node_id)) {
      this._for_each_unit_pin(node_id, (pin_node_id: string, type: IO) => {
        if (!this._is_link_pin_merged(pin_node_id)) {
          this._descend_node_z(pin_node_id)
          this._refresh_node_layer(pin_node_id)

          const datum_node_id = this._pin_to_datum[pin_node_id]
          if (datum_node_id) {
            this._refresh_node_layer(datum_node_id)
          }
        }

        const { pinId, subPinId } = this._get_pin_exposed_id(type, pin_node_id)
        if (pinId !== null && subPinId !== null) {
          const ext_node_id = getExtNodeId(type, pinId, subPinId)
          this._refresh_node_layer(ext_node_id)
        }
      })

      if (this._err[node_id]) {
        const err_node_id = getErrNodeId(node_id)

        this._descend_node_z(err_node_id)
        this._refresh_node_layer(err_node_id)
      }
    } else if (this._is_ext_node_id(node_id)) {
      const { pinId, type, subPinId } = segmentExposedNodeId(node_id)
      const int_node_id = getIntNodeId(type, pinId, subPinId)
      this._descend_node_z(int_node_id)
      this._refresh_node_layer(int_node_id)
    } else if (this._is_int_pin_node_id(node_id)) {
      const { pinId, type, subPinId } = segmentExposedNodeId(node_id)
      const ext_node_id = getExtNodeId(type, pinId, subPinId)
      this._descend_node_z(ext_node_id)
      this._refresh_node_layer(ext_node_id)
    }
  }

  private _on_pointer_move = (event: IOPointerEvent, _event: PointerEvent) => {
    // console.log('Graph', '_on_pointer_move')
    const { specs } = this.$system

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
      !this._edit_node_name_id &&
      !this._long_press_collapsing &&
      !this._capturing_gesture &&
      !this._tree_layout &&
      !this._multiselect_area_ing &&
      !this._removing_err &&
      !this._drag_and_drop
    ) {
      if (
        (this._pointer_down_count === this._pressed_node_pointer_count + 1 ||
          this._pointer_down_count === this._resize_pointer_count + 1) &&
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
                this._is_datum_node_id(pressed_node_id) ||
                this._is_exposed_pin_node_id(pressed_node_id)
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
                    const specs = { ...this.$system.specs, ...this.$pod.specs }
                    const tree_type = _getValueType(specs, tree)

                    const new_datum_node_id =
                      this._sim_duplicate_datum(drag_node_id)

                    let value: string
                    do {
                      value = randomValueOfType(specs, tree_type)
                    } while (value === tree.value && value !== 'null')
                    const new_tree = _getValueTree(value)
                    const new_datum = this._datum[new_datum_node_id] as Datum
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

        if (this._is_ext_node_id(node_id)) {
          const { type, pinId, subPinId } = segmentExposedNodeId(node_id)
          const int_node_id = getIntNodeId(type, pinId, subPinId)
          if (this._has_node(int_node_id)) {
            this._translate_node(
              int_node_id,
              p_x,
              p_y,
              this._translate_x,
              this._translate_y
            )
          }
        } else if (this._is_int_pin_node_id(node_id)) {
          const { type, pinId, subPinId } = segmentExposedNodeId(node_id)
          const ext_node_id = getExtNodeId(type, pinId, subPinId)
          this._translate_node(
            ext_node_id,
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
    type: IO,
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
    // console.log('Graph', '_on_capture_gesture_end'
    const { specs } = this.$system

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

            let type: IO
            if (d0 > d1) {
              type = 'input'
            } else {
              type = 'output'
            }

            if (this._is_unit_node_id(node_id)) {
              const unit = this._get_unit(node_id)
              const { id } = unit
              if (!isBaseSpecId(specs, id)) {
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

                setSpec(specs, id, spec)

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
              let _type: IO

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

              let type: IO
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
              const newUUID = newSpecId(specs)

              const newSpec = this._add_empty_spec(newUUID)
              newSpec.component = {
                defaultWidth: width,
                defaultHeight: height,
              }

              const unit = {
                id: newUUID,
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
              this._pod_connect_sub_component(new_unit_id)
            } else if (this._mode === 'add') {
              this._search_unit_graph_position = position
              this._search_unit_component_size = {
                width,
                height,
              }
              this._set_search_filter((id: string) => {
                if (isComponent(specs, id)) {
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
              const new_spec_id = newSpecId(specs)

              this._add_empty_spec(new_spec_id)

              const newUnitId = this._new_unit_id(new_spec_id)

              const unit: GraphUnitSpec = {
                id: new_spec_id,
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
                if (!isComponent(specs, id)) {
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
            if (this._layout_drag_node[pressed_node_id]) {
              this._on_layout_component_drag_end(pressed_node_id)
            }
          }
        }
      } else {
        if (this._drag_node_id[pressed_node_id]) {
          if (this._is_draggable_mode()) {
            if (this._is_freeze_mode()) {
              if (
                this._is_unit_node_id(pressed_node_id) ||
                this._is_datum_node_id(pressed_node_id) ||
                this._is_exposed_pin_node_id(pressed_node_id)
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
                if (selected_node_id !== pressed_node_id) {
                  if ((this._node_pressed_count[selected_node_id] || 0) === 0) {
                    if (
                      !this._long_press_collapse_node_id.has(selected_node_id)
                    ) {
                      this._on_node_drag_end(selected_node_id)
                    }
                  }
                }
              }
            } else {
            }
          }
          if (this._is_ext_node_id(pressed_node_id)) {
            const { type, pinId, subPinId } =
              segmentExposedNodeId(pressed_node_id)
            const int_node_id = getIntNodeId(type, pinId, subPinId)
            if (this._has_node(int_node_id)) {
              this._drag_node_pointer_id[int_node_id] = pointerId
              if (this._is_draggable_mode()) {
                this._on_node_drag_end(int_node_id)
              }
            }
          } else if (this._is_int_pin_node_id(pressed_node_id)) {
            const { type, pinId, subPinId } =
              segmentExposedNodeId(pressed_node_id)
            const ext_node_id = getExtNodeId(type, pinId, subPinId)
            if (this._is_draggable_mode()) {
              this._on_node_drag_end(ext_node_id)
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

    // if (pointerId === this._long_press_collapse_pointer_id) {
    //   this._stop_long_press_collapse()
    // }

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

  private _is_background_pointer = (pointerId: number): boolean => {
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

    if (this._is_background_pointer(pointerId)) {
      if (this._core_component_unlocked_count === 0) {
        if (this._edit_datum_id) {
          //
        } else if (this._edit_datum_just_blurred) {
          //
        } else {
          this._deselect_all_visible()
        }
      } else {
        this._lock_all_component()
      }

      // blur any focused input (search, edit datum, etc.)
      if (!this._focused) {
        this.focus()
      }
    }
  }

  private _deselect_all_visible = () => {
    if (this._tree_layout) {
      const current_layer = this._get_current_layout_layer_id()
      for (const selected_node_id in this._selected_node_id) {
        if (this._is_unit_component(selected_node_id)) {
          const parent_id =
            this._get_sub_component_spec_parent_id(selected_node_id)
          if (parent_id === current_layer) {
            this._deselect_node(selected_node_id)
          }
        }
      }
    } else {
      this._deselect_all()
    }
  }

  private _hide_minimap = (): void => {
    if (this._cabinet) {
      this._cabinet.setActive('minimap', false)
    }
  }

  private _show_minimap = (): void => {
    if (this._cabinet) {
      this._cabinet.setActive('minimap', true)
    }
  }

  private _minimap_hidden: boolean

  private _toggle_minimap = (): void => {
    console.log('Graph', '_toggle_minimap')
    if (this._minimap) {
      if (this._minimap_hidden) {
        this._show_minimap()
      } else {
        this._hide_minimap()
      }
    }
  }

  private _pallete_hidden: boolean

  private _toggle_pallete = (): void => {
    // TODO
  }

  private _set_crud_mode = (mode: Mode): void => {
    // console.log('Graph', '_set_crud_mode', mode)
    if (this._modes) {
      this._modes.setProp('mode', mode)
    }
  }

  private _on_double_click = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_double_click')

    const { pointerId } = event

    if (this._cancel_double_click) {
      return
    }

    if (this._mode === 'multiselect') {
      this._restart_gesture = false
      return
    }

    if (this._is_background_pointer(pointerId)) {
      this._on_background_double_click(event)
    }
  }

  private _on_background_double_click = (event: IOPointerEvent): void => {
    const { pointerId, clientX, clientY } = event

    this.__on_background_double_click(pointerId, clientX, clientY)
  }

  private __on_background_double_click = (
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    if (this._tree_layout) {
      //
    } else {
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
        this.__on_data_background_double_click(pointerId, clientX, clientY)
      }
    }
  }

  private _on_data_background_double_click = (event: IOPointerEvent): void => {
    const { pointerId, clientX, clientY } = event

    this.__on_data_background_double_click(pointerId, clientX, clientY)
  }

  private __on_data_background_double_click = (
    pointerId: number,
    clientX: number,
    clientY: number
  ): void => {
    const position = this._screen_to_world(clientX, clientY)

    const datum_id = this._new_datum_id()

    this._add_random_datum(datum_id, position)
  }

  private _add_empty_spec = (id: string): GraphSpec => {
    const { specs } = this.$system

    const newSpec = emptySpec()

    setSpec(specs, id, newSpec)

    return newSpec
  }

  private _add_empty_datum = (datum_id: string, { x, y }: Position): void => {
    // log('Graph', '_add_empty_datum')
    this.add_datum(datum_id, '', { x, y })

    const datum_node_id = getDatumNodeId(datum_id)

    if (this._selected_node_count > 0) {
      this._deselect_all()
    }

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

    const { pointerId } = event

    if (this._is_background_pointer(pointerId)) {
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

  private _long_press_data_collapsing: boolean = false
  private _long_press_unit_collapsing: boolean = false

  private _start_long_press_collapse = (
    pointer_id: number,
    node_id: string | null,
    { x: _x, y: _y }: Position
  ) => {
    console.log('Graph', '_start_long_press_collapse', pointer_id, _x, _y)

    const { specs } = this.$system

    this._debug_disabled = true

    this._stop_debugger()

    const selected_node_ids = Object.keys(this._selected_node_id)

    const { unit_ids, merge_ids, link_pin_ids, datum_ids } =
      this._decant_node_ids(selected_node_ids)

    const link_pin_count = link_pin_ids.length
    const merge_count = merge_ids.length
    const unit_count = unit_ids.length

    const node_total = unit_count + merge_count + link_pin_count
    const datum_total = datum_ids.length

    const { x, y } = this._screen_to_world(_x, _y)

    this._long_press_collapsing = true
    this._long_press_collapse_pointer_id = pointer_id
    this._long_press_collapse_unit_id = null
    this._long_press_collapse_screen_position = { x: _x, y: _y }
    this._long_press_collapse_world_position = { x, y }
    this._long_press_collapse_sub_component_parent_id = {}
    this._long_press_collapse_sub_component_children = {}

    if (node_id) {
      if (this._is_unit_node_id(node_id)) {
        this._long_press_collapse_unit_id = node_id

        this._long_press_collapse_next_unit_id = node_id
        this._long_press_collapse_next_spec_id = this._get_unit_spec_id(node_id)
        this._long_press_collapse_next_spec = this._get_unit_spec(
          node_id
        ) as GraphSpec
      } else if (this._is_datum_node_id(node_id)) {
        const { id: datum_id } = segmentDatumNodeId(node_id)
        this._long_press_collapse_datum_node_id = node_id
        this._long_press_collapse_datum_id = datum_id
      } else {
        //
      }
    } else {
      //
    }

    this._long_press_collapse_remaining = 0
    this._long_press_collapse_node_id = new Set()
    this._long_press_collapse_end_set = new Set()

    this._long_press_collapse_unit_next_pin_map = {}
    this._long_press_collapse_next_merge_pin_map = {}
    this._long_press_collapse_opposite_pin_id = {}
    this._long_press_collapse_opposite_merge_id = {}

    this._long_press_unit_collapsing = node_total > 0
    this._long_press_data_collapsing = node_total === 0 && datum_total > 0

    this._long_press_collapse_next_id_map = { unit: {}, merge: {}, link: {} }

    let is_graph_component = false

    for (const unit_id of unit_ids) {
      if (this._is_unit_component(unit_id)) {
        is_graph_component = true
        break
      }
    }

    for (const selected_node_id in this._selected_node_id) {
      if (this._static_position[selected_node_id]) {
        this._stop_node_static(selected_node_id)
      }

      this._start_drag_node_static(selected_node_id)

      this._start_node_long_press_collapse(selected_node_id)
    }

    if (this._long_press_unit_collapsing) {
      let graph_unit_id: string = this._long_press_collapse_next_unit_id
      let graph_unit_spec_id: string = this._long_press_collapse_next_spec_id
      let graph_unit_spec: GraphSpec = this._long_press_collapse_next_spec

      if (node_id === null) {
        graph_unit_spec = clone(emptyGraphSpec)

        const new_name = 'untitled'

        graph_unit_spec.name = new_name
        graph_unit_spec.metadata = graph_unit_spec.metadata || {}
        graph_unit_spec.metadata.icon = null

        if (is_graph_component) {
          graph_unit_spec.component = graph_unit_spec.component || {
            subComponents: {},
            children: [],
          }
          graph_unit_spec.component.subComponents =
            graph_unit_spec.component.subComponents || {}
          graph_unit_spec.component.children =
            graph_unit_spec.component.children || []
        }

        const new_spec_id = newSpecId(specs)

        setSpec(specs, new_spec_id, graph_unit_spec)

        const new_unit_id = this._new_unit_id(new_spec_id)

        this._pod.$addUnit({
          id: new_unit_id,
          unit: {
            id: new_spec_id,
          },
        })

        graph_unit_id = new_unit_id
        graph_unit_spec_id = new_spec_id

        this._long_press_collapse_next_unit_id = graph_unit_id
        this._long_press_collapse_next_spec_id = graph_unit_spec_id
        this._long_press_collapse_next_spec = graph_unit_spec
      }

      const graph_spec_pin_id_set = {
        input: new Set(_keys(graph_unit_spec.inputs || {})),
        output: new Set(_keys(graph_unit_spec.outputs || {})),
      }

      const merge_to_exposed_pin_id: Dict<string> = {}
      const exposed_pin_id_count: {
        input: Dict<number>
        output: Dict<number>
      } = { input: {}, output: {} }

      const next_unit_id_blacklist = new Set<string>()
      const next_merge_id_blacklist = new Set<string>()

      const new_pin_id = (type: IO, pin_id: string): string => {
        let next_pin_id = pin_id
        let i = 0

        while (graph_spec_pin_id_set[type].has(next_pin_id)) {
          next_pin_id = `${pin_id}${i}`
          i++
        }

        return next_pin_id
      }

      const expose_link_pin = (
        unit_id: string,
        type: string,
        pin_id: string,
        next_pin_id: string
      ) => {
        exposed_pin_id_count[type][next_pin_id] =
          exposed_pin_id_count[type][next_pin_id] ?? -1
        exposed_pin_id_count[type][next_pin_id]++

        const next_sub_pin_id = exposed_pin_id_count[type][next_pin_id]

        graph_spec_pin_id_set[type].add(next_pin_id)

        this._long_press_collapse_unit_next_pin_map[unit_id] = this
          ._long_press_collapse_unit_next_pin_map[unit_id] || {
          input: {},
          output: {},
        }

        this._long_press_collapse_unit_next_pin_map[unit_id][type][pin_id] = {
          pinId: next_pin_id,
          subPinId: `${next_sub_pin_id}`,
        }

        exposed_pin_id_count[type][next_pin_id]
      }

      for (const unit_id of unit_ids) {
        const unit_spec_id = this._get_unit_spec_id(unit_id)

        this._for_each_unit_pin(
          unit_id,
          (pin_node_id: string, type, pin_id) => {
            if (!this._long_press_collapse_node_id.has(pin_node_id)) {
              const merge_node_id = this._pin_to_merge[pin_node_id]

              let next_pin_id

              if (merge_node_id) {
                if (this._long_press_collapse_node_id.has(merge_node_id)) {
                  return
                } else {
                  next_pin_id = merge_to_exposed_pin_id[merge_node_id]

                  if (!next_pin_id) {
                    next_pin_id = new_pin_id(type, pin_id)

                    merge_to_exposed_pin_id[merge_node_id] = next_pin_id
                  }
                }
              } else {
                next_pin_id = new_pin_id(type, pin_id)
              }

              if (next_pin_id) {
                expose_link_pin(unit_id, type, pin_id, next_pin_id)
              }
            }
          }
        )

        let next_unit_id = unit_id
        if (graph_unit_spec.units[unit_id]) {
          next_unit_id = newUnitIdInSpecId(
            specs,
            graph_unit_spec_id,
            unit_spec_id,
            next_unit_id_blacklist
          )
        }
        next_unit_id_blacklist.add(next_unit_id)

        this._long_press_collapse_next_id_map.unit[unit_id] = next_unit_id

        if (this._is_unit_component(unit_id)) {
          const sub_component_parent_id =
            this._get_sub_component_spec_parent_id(unit_id)

          if (sub_component_parent_id) {
            if (this._selected_node_id[sub_component_parent_id]) {
              const sub_component_parent_next_id =
                this._long_press_collapse_next_id_map.unit[
                  sub_component_parent_id
                ]

              this._long_press_collapse_sub_component_parent_id[unit_id] =
                sub_component_parent_id
              this._long_press_collapse_sub_component_children[
                sub_component_parent_id
              ] =
                this._long_press_collapse_sub_component_children[
                  sub_component_parent_id
                ] || new Set()
              this._long_press_collapse_sub_component_children[
                sub_component_parent_id
              ].add(unit_id)

              if (sub_component_parent_next_id) {
                this._long_press_collapse_sub_component_next_parent_id[
                  next_unit_id
                ] = sub_component_parent_next_id

                this._long_press_collapse_sub_component_next_children[
                  sub_component_parent_next_id
                ] =
                  this._long_press_collapse_sub_component_next_children[
                    sub_component_parent_next_id
                  ] || []
                this._long_press_collapse_sub_component_next_children[
                  sub_component_parent_next_id
                ].push(next_unit_id)
              }
            }
          }

          const sub_component_children =
            this._get_sub_component_spec_children(unit_id)

          for (const sub_component_child_id of sub_component_children) {
            if (this._selected_node_id[sub_component_child_id]) {
              this._long_press_collapse_sub_component_next_parent_id[
                sub_component_child_id
              ] = next_unit_id

              const sub_component_child_next_id =
                this._long_press_collapse_next_id_map.unit[
                  sub_component_child_id
                ]

              if (sub_component_child_next_id) {
                this._long_press_collapse_sub_component_next_children[
                  next_unit_id
                ] =
                  this._long_press_collapse_sub_component_next_children[
                    next_unit_id
                  ] || []
                this._long_press_collapse_sub_component_next_children[
                  next_unit_id
                ].push(sub_component_child_next_id)
              }
            }
          }
        }
      }

      for (const merge_node_id of merge_ids) {
        const { id: merge_id } = segmentMergeNodeId(merge_node_id)
        this._long_press_collapse_next_merge_pin_map[merge_id] = {
          nextInputMergePinId: null,
          nextOutputMergePinId: null,
        }
        let merge_total_pin_count: number = 0
        let merge_pin_count = { input: 0, output: 0 }
        let merge_selected_pin_count = { input: 0, output: 0 }
        let merge_anchor_pin_id = { input: undefined, output: undefined }
        this._for_each_merge_pin(merge_id, (unit_id, type, pin_id) => {
          merge_total_pin_count++
          merge_pin_count[type]++
          if (merge_anchor_pin_id === undefined) {
            merge_anchor_pin_id[type] = pin_id
          }
          if (this._is_node_selected(unit_id)) {
            merge_selected_pin_count[type]++
          }

          if (!this._long_press_collapse_node_id.has(unit_id)) {
            const next_pin_id = new_pin_id(type, pin_id)

            expose_link_pin(unit_id, type, pin_id, next_pin_id)
          }
        })

        if (merge_pin_count.input > merge_selected_pin_count.input) {
          const nextOutputMergePinId = newSpecPinId(
            graph_unit_spec,
            'output',
            merge_anchor_pin_id['input'],
            new Set()
          )
          this._long_press_collapse_next_merge_pin_map[
            merge_id
          ].nextOutputMergePinId = nextOutputMergePinId
        }

        if (merge_pin_count.output > merge_selected_pin_count.output) {
          const nextInputMergePinId = newSpecPinId(
            graph_unit_spec,
            'input',
            merge_anchor_pin_id['output'],
            new Set()
          )
          this._long_press_collapse_next_merge_pin_map[
            merge_id
          ].nextInputMergePinId = nextInputMergePinId
        }

        let next_merge_id = merge_node_id
        if (graph_unit_spec.merges[merge_node_id]) {
          next_merge_id = newMergeIdInSpec(
            graph_unit_spec,
            next_merge_id_blacklist
          )
        }
        next_merge_id_blacklist.add(next_merge_id)

        this._long_press_collapse_next_id_map.merge[merge_node_id] =
          next_merge_id
      }

      const opposite_merge_id_black_list = new Set<string>()

      for (const pin_node_id of link_pin_ids) {
        const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

        if (this._is_node_selected(unitId)) {
          //
        } else {
          const opposite_type = oppositePinKind(type)

          const opposite_pin_id = newSpecPinId(
            graph_unit_spec,
            opposite_type,
            pinId,
            graph_spec_pin_id_set[opposite_type]
          )

          graph_spec_pin_id_set[opposite_type].add(opposite_pin_id)

          this._long_press_collapse_opposite_pin_id[pin_node_id] =
            opposite_pin_id

          const opposite_merge_id = this._new_merge_id(
            opposite_merge_id_black_list
          )

          opposite_merge_id_black_list.add(opposite_merge_id)

          this._long_press_collapse_opposite_merge_id[pin_node_id] =
            opposite_merge_id
        }
      }

      for (const merge_node_id of merge_ids) {
        const { id: merge_id } = segmentMergeNodeId(merge_node_id)

        const merge = this.__get_merge(merge_id)

        for (const unit_id in merge) {
          const merge_unit = merge[unit_id]
          const { input = {}, output = {} } = merge_unit

          const move_pin_into_graph = (type: IO, pin_id: string) => {
            const pin_node_id = getPinNodeId(unit_id, type, pin_id)

            const opposite_type = oppositePinKind(type)

            const opposite_pin_id = newSpecPinId(
              graph_unit_spec,
              opposite_type,
              pin_id,
              graph_spec_pin_id_set[opposite_type]
            )

            graph_spec_pin_id_set[opposite_type].add(opposite_pin_id)

            this._long_press_collapse_opposite_pin_id[pin_node_id] =
              opposite_pin_id

            const opposite_merge_id = this._new_merge_id(
              opposite_merge_id_black_list
            )

            opposite_merge_id_black_list.add(opposite_merge_id)

            this._long_press_collapse_opposite_merge_id[pin_node_id] =
              opposite_merge_id
          }

          for (const input_id in input) {
            move_pin_into_graph('input', input_id)
          }
          for (const output_id in output) {
            move_pin_into_graph('output', output_id)
          }
        }
      }

      const long_press_units = unit_ids

      const long_press_link_pins = []

      for (const pin_node_id of link_pin_ids) {
        const { unitId, type, pinId } = segmentLinkPinNodeId(pin_node_id)

        let mergeId: string | null
        let oppositePinId: string | null

        if (this._selected_node_id[unitId]) {
          mergeId = null
          oppositePinId = null
        } else {
          mergeId = this._long_press_collapse_opposite_merge_id[pin_node_id]
          oppositePinId = this._long_press_collapse_opposite_pin_id[pin_node_id]
        }

        this._long_press_collapse_next_id_map.link[unitId] = this
          ._long_press_collapse_next_id_map.link[unitId] || {
          input: {},
          output: {},
        }
        this._long_press_collapse_next_id_map.link[unitId][type][pinId] = {
          mergeId,
          oppositePinId,
        }

        long_press_link_pins.push({ unitId, type, pinId })
      }

      const long_press_merges = merge_ids.map(getIdFromMergeNodeId)

      this._long_press_collapse_units = long_press_units
      this._long_press_collapse_link_pins = long_press_link_pins
      this._long_press_collapse_merges = long_press_merges
    }

    this._simulation.alphaDecay(0)

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _start_node_long_press_collapse = (node_id: string): void => {
    // console.log('Graph', '_start_node_long_press_collapse', node_id)

    this._long_press_collapse_node_id.add(node_id)

    this._long_press_collapse_remaining++

    this._set_node_layer(node_id, LAYER_COLLAPSE)

    if (this._is_pin_node_id(node_id)) {
      const datum_node_id = this._pin_to_datum[node_id]

      if (datum_node_id) {
        this._hide_datum(datum_node_id)
      }
    }
  }

  private _stop_node_long_press_collapse = (node_id: string): void => {
    // console.log('Graph', '_stop_node_long_press_collapse', node_id)

    this._long_press_collapse_remaining--
    this._long_press_collapse_node_id.delete(node_id)
    this._long_press_collapse_end_set.add(node_id)
  }

  private _stop_long_press_collapse = () => {
    // console.log('Graph', '_stop_long_press_collapse')

    if (this._long_press_unit_collapsing) {
      this._pod.$moveSubgraphInto({
        graphId: this._long_press_collapse_next_unit_id,
        nodeIds: {
          unit: this._long_press_collapse_units,
          link: this._long_press_collapse_link_pins,
          merge: this._long_press_collapse_merges,
        },
        nextIdMap: this._long_press_collapse_next_id_map,
        nextPinIdMap: this._long_press_collapse_unit_next_pin_map,
        nextMergePinId: this._long_press_collapse_next_merge_pin_map,
        nextSubComponentParentMap:
          this._long_press_collapse_sub_component_next_parent_id,
        nextSubComponentChildrenMap:
          this._long_press_collapse_sub_component_next_children,
      })
    }

    this._long_press_collapsing = false
    this._long_press_collapse_pointer_id = null
    this._long_press_collapse_screen_position = NULL_VECTOR
    this._long_press_collapse_world_position = NULL_VECTOR
    this._long_press_collapse_unit_id = null
    this._long_press_collapse_datum_id = null
    this._long_press_collapse_datum_node_id = null
    this._long_press_collapse_end_set = new Set()
    this._long_press_collapse_sub_component_children = {}
    this._long_press_collapse_sub_component_parent_id = {}

    this._long_press_collapse_next_unit_id = null
    this._long_press_collapse_next_spec = null
    this._long_press_collapse_next_spec_id = null

    for (const selected_node_id in this._selected_node_id) {
      this._stop_drag_node_static(selected_node_id)

      this._refresh_node_layer(selected_node_id)

      if (this._is_pin_node_id(selected_node_id)) {
        const datum_node_id = this._pin_to_datum[selected_node_id]

        if (datum_node_id) {
          this._refresh_datum_visible(datum_node_id)
        }
      }
    }

    this._simulation.alphaDecay(0.01)

    // AD HOC
    setTimeout(() => {
      this._debug_disabled = false
      this._start_debugger()
    })

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _force_pointer_drop_node = (
    node_id: string,
    pointer_id: number,
    clientX: number,
    clientY: number
  ): void => {
    this.__on_pointer_up(pointer_id)
    this._set_drag_node(node_id, false)
    this.__on_node_pointer_up(node_id, pointer_id)
    this.__on_node_pointer_leave(node_id, pointer_id)
  }

  private _force_pointer_drag_node = (
    node_id: string,
    pointer_id: number,
    clientX: number,
    clientY: number
  ): void => {
    this.__on_node_pointer_enter(node_id, pointer_id)
    this.__on_node_pointer_down(node_id, pointer_id, clientX, clientY)
    this._set_drag_node(node_id, true)
    this.__on_pointer_down(pointer_id, clientX, clientY)
  }

  private _long_press_collapse_node = (node_id: string): void => {
    // console.log('Graph', '_long_press_collapse_node', node_id)

    let new_node_id: string = null

    if (this._long_press_unit_collapsing) {
      if (!this._long_press_collapse_unit_id) {
        const new_unit_id = this._long_press_collapse_next_unit_id

        const new_unit: GraphUnitSpec = {
          id: this._long_press_collapse_next_spec_id,
        }

        this._long_press_collapse_unit_id = new_unit_id

        this._state_add_unit(
          new_unit_id,
          new_unit,
          this._long_press_collapse_world_position,
          { input: {}, output: {} },
          { x: 0, y: 0 },
          null
        )

        if (this._is_unit_component(new_unit_id)) {
          this._sim_add_unit_component(new_unit_id)
        }

        new_node_id = new_unit_id
      }
    } else if (this._long_press_data_collapsing) {
      if (!this._long_press_collapse_datum_node_id) {
        const datum_id = this._new_datum_id()

        const datum_node_id = getDatumNodeId(datum_id)

        this._long_press_collapse_datum_id = datum_id
        this._long_press_collapse_datum_node_id = datum_node_id

        this._add_datum(
          datum_id,
          '[]',
          this._long_press_collapse_world_position
        )

        new_node_id = datum_node_id
      }
    }

    if (new_node_id) {
      this._set_node_layer(new_node_id, LAYER_COLLAPSE)

      const pointer_id = this._long_press_collapse_pointer_id

      const { x: clientX, y: clientY } =
        this._long_press_collapse_screen_position

      this._force_pointer_drag_node(new_node_id, pointer_id, clientX, clientY)

      const [x, y] = zoomInvert(this._zoom, clientX, clientY)

      this._node_drag_start(new_node_id, x, y)

      this.select_node(new_node_id)
    }

    this._move_node_into_graph(this._long_press_collapse_unit_id, node_id)

    if (this._long_press_collapse_remaining === 0) {
      if (this._long_press_collapse_unit_id) {
        this._refresh_node_fixed(this._long_press_collapse_unit_id)
        this._refresh_unit_layer(this._long_press_collapse_unit_id)
      }

      this._stop_long_press_collapse()
    }
  }

  private _move_node_into_graph = (graph_id: string, node_id: string): void => {
    // console.log('Graph', '_move_node_into_graph', graph_id, node_id)
    if (this._is_unit_node_id(node_id)) {
      this._move_unit_into_graph(graph_id, node_id)
    } else if (this._is_link_pin_node_id(node_id)) {
      const { unitId, type, pinId } = segmentLinkPinNodeId(node_id)
      this._move_link_pin_into_graph(graph_id, unitId, type, pinId)
    } else if (this._is_merge_node_id(node_id)) {
      const { id: merge_id } = segmentMergeNodeId(node_id)
      const graph_spec = this._get_unit_spec(graph_id) as GraphSpec
      const next_merge_id = newMergeIdInSpec(graph_spec)
      this._move_merge_into_graph(graph_id, merge_id, next_merge_id)
    } else if (this._is_datum_node_id(node_id)) {
      if (this._long_press_unit_collapsing) {
        this._move_datum_into_graph(graph_id, node_id)
      } else if (this._long_press_data_collapsing) {
        this._move_datum_into_array(node_id)
      }
    }
  }

  private _move_datum_into_graph = (
    graph_id: string,
    node_id: string
  ): void => {
    this._stop_node_long_press_collapse(node_id)
  }

  private _move_datum_into_array = (datum_node_id: string): void => {
    const { id: datum_id } = segmentDatumNodeId(datum_node_id)

    const element_tree = this._datum_tree[datum_id]
    const array_tree = this._datum_tree[this._long_press_collapse_datum_id]

    const { type: array_type } = array_tree

    if (array_type === TreeNodeType.ArrayLiteral) {
      const next_array_tree = _updateNodeAt(
        array_tree,
        [array_tree.children.length],
        element_tree
      )

      const datum = this._datum[
        this._long_press_collapse_datum_node_id
      ] as Datum

      datum.setProp('data', next_array_tree)

      this._remove_datum(datum_node_id)

      this._stop_node_long_press_collapse(datum_node_id)
    } else {
      throw new Error('not an array')
    }
  }

  private _move_unit_into_graph = (graph_id: string, unit_id: string): void => {
    // console.log('Graph', '_move_unit_into_graph', graph_id, unit_id)

    const next_unit_id = this._long_press_collapse_next_id_map.unit[unit_id]

    this._state_move_unit_into_graph(graph_id, unit_id, next_unit_id)
  }

  private _spec_component_remove_sub_component = (
    sub_component_id: string
  ): void => {
    const sub_component_parent_id =
      this._get_sub_component_spec_parent_id(sub_component_id)

    if (sub_component_parent_id) {
      this._spec.component = componentReducer.removeSubComponentChild(
        { id: sub_component_parent_id, childId: sub_component_id },
        this._spec.component
      )
    }

    this._spec.component = componentReducer.removeChild(
      { id: sub_component_id },
      this._spec.component
    )

    this._spec.component = componentReducer.removeSubComponent(
      { id: sub_component_id },
      this._spec.component
    )
  }

  private _sim_add_unit_link_pin = (
    graph_id: string,
    type: IO,
    next_pin_id: string,
    next_pin_node_id: string,
    position: Position
  ): void => {
    this._sim_add_link_pin_node(graph_id, type, next_pin_id, position)
    this._sim_add_link_pin_link(graph_id, type, next_pin_id)
  }

  private _state_move_unit_into_graph = (
    graph_id: string,
    unit_id: string,
    next_unit_id: string
  ): void => {
    console.log('Graph', '_state_move_unit_into_graph', graph_id, unit_id)

    // this._sim_move_unit_into_graph(graph_id, unit_id, next_unit_id)
    // this._spec_move_unit_into_graph(graph_id, unit_id, next_unit_id)

    const { specs } = this.$system

    const next_pin_id_map: {
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    } = this._long_press_collapse_unit_next_pin_map[unit_id] || {
      input: {},
      output: {},
    }

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

      const long_press_sub_component_parent_id =
        this._long_press_collapse_sub_component_parent_id[unit_id]
      const long_press_sub_component_children =
        this._long_press_collapse_sub_component_children[unit_id]

      console.log(
        'long_press_sub_component_parent_id',
        long_press_sub_component_parent_id
      )
      console.log(
        'long_press_sub_component_children',
        long_press_sub_component_children
      )

      if (is_graph_component) {
        const graph_sub_component = this._get_sub_component(graph_id)
        const unit_sub_component = this._get_sub_component(unit_id)

        const unit_sub_component_parent_id =
          this._get_sub_component_spec_parent_id(unit_id)

        this._leave_sub_component_frame(unit_id)

        if (unit_sub_component_parent_id) {
          const parent_component = this._get_sub_component(
            unit_sub_component_parent_id
          )
          parent_component.pullParentRoot(unit_sub_component)
        } else {
          this._component.pullRoot(unit_sub_component)
        }

        graph_sub_component.setSubComponent(next_unit_id, unit_sub_component)

        if (long_press_sub_component_parent_id) {
          if (
            this._long_press_collapse_end_set.has(
              long_press_sub_component_parent_id
            )
          ) {
            const parent_sub_component = graph_sub_component.getSubComponent(
              long_press_sub_component_parent_id
            )

            // TODO
            // should use insert since sub component might come out of order
            // parent_sub_component.pushParentRoot(unit_sub_component, 'default')
            parent_sub_component.appendParentRoot(unit_sub_component)
          } else {
            // graph_sub_component.pushRoot(unit_sub_component)
            // graph_sub_component.appendRoot(unit_sub_component)
          }
        } else {
          graph_sub_component.pushRoot(unit_sub_component)
          graph_sub_component.appendRoot(unit_sub_component)

          if (long_press_sub_component_children) {
            for (const sub_component_child_id of long_press_sub_component_children) {
              if (
                this._long_press_collapse_end_set.has(sub_component_child_id)
              ) {
                const sub_component_child = graph_sub_component.getSubComponent(
                  sub_component_child_id
                )

                // graph_sub_component.removeRoot(sub_component_child)
                // graph_sub_component.pullRoot(sub_component_child)

                unit_sub_component.pushParentRoot(
                  sub_component_child,
                  'default'
                )
                unit_sub_component.appendParentRoot(sub_component_child)
              }
            }
          }
        }
      } else {
        this._set_core_shape(graph_id, 'rect')

        this._spec_append_component(null, graph_id)

        this._sim_add_core_component(graph_id, null, { x: 0, y: 0 })
        this._sim_add_unit_component(graph_id)
      }

      if (long_press_sub_component_parent_id) {
        if (
          this._long_press_collapse_end_set.has(
            long_press_sub_component_parent_id
          )
        ) {
          updated_graph_spec.component = componentReducer.removeChild(
            { id: next_unit_id },
            updated_graph_spec.component
          )

          updated_graph_spec.component =
            componentReducer.appendSubComponentChild(
              { id: long_press_sub_component_parent_id, childId: next_unit_id },
              updated_graph_spec.component
            )
        }
      } else if (long_press_sub_component_children) {
        for (const sub_component_child_id of long_press_sub_component_children) {
          if (this._long_press_collapse_end_set.has(sub_component_child_id)) {
            updated_graph_spec.component = componentReducer.removeChild(
              { id: sub_component_child_id },
              updated_graph_spec.component
            )

            updated_graph_spec.component =
              componentReducer.appendSubComponentChild(
                { id: next_unit_id, childId: sub_component_child_id },
                updated_graph_spec.component
              )
          }
        }
      }

      delete updated_graph_spec.metadata.complexity

      setSpec(specs, graph_spec_id, updated_graph_spec)
    }

    this._refresh_core_size(graph_id)

    if (!updated_graph_spec.metadata || !updated_graph_spec.metadata.icon) {
      updated_graph_spec.metadata.icon = 'question'

      if (!isComponent(specs, graph_spec_id)) {
        this._set_core_icon(graph_id, 'question')
        this._show_core_icon(graph_id)
      }
    }

    setSpec(specs, graph_spec_id, updated_graph_spec)

    this._for_each_unit_pin(unit_id, (pin_node_id, type, pin_id) => {
      if (!this._long_press_collapse_node_id.has(pin_node_id)) {
        const { pinId: next_pin_id, subPinId: next_sub_pin_id } =
          (next_pin_id_map[type] && next_pin_id_map[type][pin_id]) || {
            pinId: pin_id,
            subPinId: '0',
          }

        const is_pin_ref = this._is_pin_ref(pin_node_id)

        const has_pin_id = updated_graph_spec[`${type}s`][next_pin_id]

        if (has_pin_id) {
          updated_graph_spec = specReducer.exposePin(
            {
              id: next_pin_id,
              type,
              subPinId: next_sub_pin_id,
              subPin: {
                unitId: next_unit_id,
                pinId: pin_id,
              },
            },
            updated_graph_spec
          )

          setSpec(specs, graph_spec_id, updated_graph_spec)
        } else {
          updated_graph_spec = specReducer.exposePinSet(
            {
              id: next_pin_id,
              type,
              pin: {
                pin: { '0': { unitId: next_unit_id, pinId: pin_id } },
                ref: is_pin_ref,
              },
            },
            updated_graph_spec
          )

          setSpec(specs, graph_spec_id, updated_graph_spec)

          const next_pin_node_id = getPinNodeId(graph_id, type, next_pin_id)

          const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)
          const pin_position = this._get_node_position(anchor_node_id)
          const position = pin_position

          const datum_node_id = this._pin_to_datum[pin_node_id]

          let datum_tree: TreeNode | null = null
          if (datum_node_id) {
            datum_tree = this._get_datum_tree(datum_node_id)
          }

          this._sim_add_unit_link_pin(
            graph_id,
            type,
            next_pin_id,
            next_pin_node_id,
            position
          )

          if (datum_tree) {
            const next_datum_id = this._new_datum_id()
            const next_datum_node_id = getDatumNodeId(next_datum_id)
            const position = this._pin_datum_initial_position(next_pin_node_id)
            this._add_datum(next_datum_id, datum_tree.value, position)
            this._sim_add_datum_link(next_datum_node_id, next_pin_node_id)

            this._mem_set_pin_datum(next_pin_node_id, next_datum_id)

            this._refresh_node_color(graph_id)
          }

          const merge_node_id = this._pin_to_merge[pin_node_id]

          if (merge_node_id) {
            const { id: merge_id } = segmentMergeNodeId(merge_node_id)

            this._sim_remove_pin_from_merge(merge_node_id, pin_node_id)
            this.__spec_remove_pin_from_merge(merge_id, unit_id, type, pin_id)

            this.__spec_add_link_pin_to_merge(
              merge_id,
              graph_id,
              type,
              next_pin_id
            )
            this._sim_add_pin_to_merge(next_pin_node_id, merge_node_id)
          }
        }
      } else {
        this._stop_node_long_press_collapse(pin_node_id)
      }
    })

    this._stop_node_long_press_collapse(unit_id)

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
        this._sim_add_pin_to_merge(pin_node_id, merge_node_id)
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

    const { specs } = this.$system

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

        this.__spec_add_link_pin_to_merge(
          merge_id,
          graph_id,
          'input',
          next_input_id
        )
      }
    }

    setSpec(specs, graph_spec_id, updated_graph_spec)

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
    type: IO,
    pin_id: string
  ): void => {
    // console.log('Graph', '_move_link_pin_into_graph', graph_id, unit_id)
    this._state_move_link_pin_into_graph(graph_id, unit_id, type, pin_id)
  }

  private _state_move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type: IO,
    pin_id: string
  ): void => {
    console.log(
      'Graph',
      '_state_move_link_pin_into_graph',
      graph_id,
      unit_id,
      type,
      pin_id
    )

    const { opposite_pin_id, merge_id } =
      this._graph_spec_move_link_pin_into_graph(graph_id, unit_id, type, pin_id)

    this._spec_move_link_pin_into_graph(
      graph_id,
      unit_id,
      type,
      pin_id,
      opposite_pin_id,
      merge_id
    )

    this._sim_move_link_pin_into_graph(
      graph_id,
      unit_id,
      type,
      pin_id,
      opposite_pin_id,
      merge_id
    )
  }

  private _sim_move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type: IO,
    pin_id: string,
    opposite_pin_id: string | null,
    merge_id: string | null
  ): void => {
    // console.log('Graph', '_sim_move_link_pin_into_graph')

    const pin_node_id = getPinNodeId(unit_id, type, pin_id)

    if (graph_id === unit_id) {
      this._stop_node_long_press_collapse(pin_node_id)

      this._sim_remove_link_pin(pin_node_id)
    } else {
      if (this._long_press_collapse_node_id.has(unit_id)) {
        return
      }

      this._stop_node_long_press_collapse(pin_node_id)

      const opposite_type = oppositePinKind(type)

      const opposite_pin_node_id = getPinNodeId(
        graph_id,
        opposite_type,
        opposite_pin_id
      )

      const pin_node = this._node[pin_node_id]
      const graph_node = this._node[graph_id]

      const { x: pin_x, y: pin_y, r: pin_r } = pin_node
      const { x: graph_x, y: graph_y, r: graph_r } = graph_node

      const u = unitVector(graph_x, graph_y, pin_x, pin_y)

      const position = pointInNode(graph_node, u, PIN_RADIUS)

      const medium_point = mediumPoint(position, pin_node)

      this._sim_add_unit_link_pin(
        graph_id,
        opposite_type,
        opposite_pin_id,
        opposite_pin_node_id,
        position
      )

      const merge = {
        [unit_id]: {
          [type]: {
            [pin_id]: true,
          },
        },
        [graph_id]: {
          [opposite_type]: {
            [opposite_pin_id]: true,
          },
        },
      }

      this._sim_add_merge(merge_id, merge, medium_point)
      this._sim_collapse_merge(merge_id)

      // ABC

      // TODO
      // try
      // clip-mask
      // immediately adding a new unit
      // reducing/increasing size of components
      // animating the radius of graph unit
    }
  }

  private _spec_move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type: IO,
    pin_id: string,
    opposite_pin_id: string,
    merge_id: string
  ): void => {
    // console.log('Graph', '_spec_move_link_pin_into_graph', graph_id, unit_id, type, pin_id)

    if (graph_id === unit_id) {
      //
    } else {
      if (this._selected_node_id[unit_id]) {
        return
      }

      const opposite_type = oppositePinKind(type)

      const merge = {
        [unit_id]: {
          [type]: {
            [pin_id]: true,
          },
        },
        [graph_id]: {
          [opposite_type]: {
            [opposite_pin_id]: true,
          },
        },
      }

      this._spec_add_merge(merge_id, merge)
    }
  }

  private _graph_spec_move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type: IO,
    pin_id: string
  ): { opposite_pin_id: string | null; merge_id: string | null } => {
    // console.log('Graph', '_graph_spec_move_link_pin_into_graph', graph_id, unit_id, type, pin_id, next_pin_id)

    const { specs } = this.$system

    const pin_node_id = getPinNodeId(unit_id, type, pin_id)

    const graph_spec_id = this._get_unit_spec_id(graph_id)
    const graph_spec = this._get_unit_spec(graph_id) as GraphSpec

    if (graph_id === unit_id) {
      const updated_graph_spec = specReducer.coverPinSet(
        {
          id: pin_id,
          type,
        },
        graph_spec
      )

      setSpec(specs, graph_spec_id, updated_graph_spec)

      return { opposite_pin_id: null, merge_id: null }
    } else {
      if (this._selected_node_id[unit_id]) {
        return { opposite_pin_id: null, merge_id: null }
      }

      const opposite_type = oppositePinKind(type)
      const opposite_pin_id =
        this._long_press_collapse_opposite_pin_id[pin_node_id]

      const updated_graph_spec = specReducer.exposePinSet(
        { id: opposite_pin_id, type: opposite_type, pin: { pin: { '0': {} } } },
        graph_spec
      )

      setSpec(specs, graph_spec_id, updated_graph_spec)

      const merge_id = this._long_press_collapse_opposite_merge_id[pin_node_id]

      return { opposite_pin_id, merge_id }
    }
  }

  private _pod_move_link_pin_into_graph = (
    graph_id: string,
    unit_id: string,
    type,
    pin_id: string
  ): void => {
    // console.log('Graph', '_pod_move_link_pin_into_graph', graph_id, unit_id, type, pin_id, next_pin_id)
    this._pod.$moveLinkPinInto({
      graphId: graph_id,
      unitId: unit_id,
      type,
      pinId: pin_id,
    })
  }

  private _move_merge_into_graph = (
    graph_id: string,
    merge_id: string,
    next_merge_id: string
  ): void => {
    // console.log('Graph', '_move_merge_into_graph', graph_id, merge_id)
    this._state_move_merge_into_graph(graph_id, merge_id, next_merge_id)
    // this._pod_move_merge_into_graph(graph_id, merge_id, next_merge_id)
  }

  private _state_move_merge_into_graph = (
    graph_id: string,
    merge_id: string,
    next_merge_id: string
  ): void => {
    console.log('Graph', '_state_move_merge_into_graph', graph_id, merge_id)

    // this._sim_move_merge_into_graph(graph_id, merge_id, pin_id)
    // this._spec_move_merge_into_graph(graph_id, merge_id, pin_id)

    const { specs } = this.$system

    const merge_node_id = getMergeNodeId(merge_id)

    const merge = this.__get_merge(merge_id)

    const merge_unit_count = _keyCount(merge)

    const merge_pin_count = this._merge_pin_count[merge_id]

    if (merge_unit_count === 1) {
      const merge_single_unit_id = getObjSingleKey(merge)

      if (merge_single_unit_id === graph_id) {
        const merge_single_unit = merge[merge_single_unit_id]

        const merge_single_unit_pin_count =
          getMergeUnitPinCount(merge_single_unit)

        if (merge_single_unit_pin_count === merge_pin_count) {
          this.__sim_remove_merge(merge_id)
          this.__spec_remove_merge(merge_id)

          // this._stop_node_long_press_collapse(merge_node_id)

          const graph_spec_id = this._get_unit_spec_id(graph_id)
          const graph_spec = this._get_unit_spec(graph_id) as GraphSpec

          const next_merge: GraphMergeSpec = {}

          let updated_graph_spec = specReducer.addMerge(
            {
              id: next_merge_id,
              merge: next_merge,
            },
            graph_spec
          )

          const { input = {}, output = {} } = merge_single_unit

          const move_link_pin_into = (type: IO, pin_id: string): void => {
            const graph_pin_spec = graph_spec[`${type}s`][pin_id]

            this._sim_move_link_pin_into_graph(
              graph_id,
              merge_single_unit_id,
              type,
              pin_id,
              null,
              null
            )

            this._long_press_collapse_remaining++

            this._graph_spec_move_link_pin_into_graph(
              graph_id,
              merge_single_unit_id,
              type,
              pin_id
            )

            const { pin = {} } = graph_pin_spec

            for (const sub_pin_id in pin) {
              const sub_pin = pin[sub_pin_id]

              const { unitId, pinId, mergeId } = sub_pin

              const graph_spec = this._get_unit_spec(graph_id) as GraphSpec

              if (mergeId) {
                updated_graph_spec = specReducer.mergeMerges(
                  {
                    a: next_merge_id,
                    b: mergeId,
                  },
                  graph_spec
                )
              } else {
                updated_graph_spec = specReducer.addPinToMerge(
                  {
                    id: next_merge_id,
                    unitId,
                    type,
                    pinId,
                  },
                  graph_spec
                )
              }

              setSpec(specs, graph_spec_id, updated_graph_spec)
            }
          }

          for (const input_id in input) {
            move_link_pin_into('input', input_id)
          }

          for (const output_id in output) {
            move_link_pin_into('output', output_id)
          }

          setSpec(specs, graph_spec_id, updated_graph_spec)
        }
      } else {
        this._stop_node_long_press_collapse(merge_node_id)
        // TODO
      }
    } else {
      this._sim_remove_merge(merge_node_id)

      this.__spec_remove_merge(merge_id)

      for (const unit_id in merge) {
        const merge_unit = merge[unit_id]
        const { input = {}, output = {} } = merge_unit

        const move_pin_into_graph = (type: IO, pin_id: string) => {
          const pin_node_id = getPinNodeId(unit_id, type, pin_id)

          // AD HOC
          if (!this._has_node(unit_id)) {
            return
          }

          this._start_node_long_press_collapse(pin_node_id)

          this._move_link_pin_into_graph(graph_id, unit_id, type, pin_id)
        }

        for (const input_id in input) {
          move_pin_into_graph('input', input_id)
        }
        for (const output_id in output) {
          move_pin_into_graph('output', output_id)
        }
      }
    }
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
    next_merge_input_id: string | null,
    next_merge_output_id: string | null,
    next_pin_id_map: Dict<{
      input: Dict<{ pinId: string; subPinId: string }>
      output: Dict<{ pinId: string; subPinId: string }>
    }>
  ): void => {
    // console.log('Graph', '_pod_move_merge_into_graph', graph_id, merge_id, next_merge_id)

    this._pod.$moveMergePinInto({
      graphId: graph_id,
      mergeId: merge_id,
      nextInputMergeId: next_merge_input_id,
      nextOutputMergeId: next_merge_output_id,
      nextPinIdMap: next_pin_id_map,
    })
  }

  private _set_long_press_pointer = (
    pointerId: number,
    x: number,
    y: number
  ): void => {
    this._long_press_screen_position = { x, y } // TODO should be a dict
    this._long_press_pointer.add(pointerId)
    this._long_press_count++
  }

  private _on_long_press = (event: IOPointerEvent): void => {
    // console.log('Graph', '_on_long_press')

    const { specs } = this.$system

    const { pointerId, clientX, clientY, screenX, screenY } = event

    if (this._cancel_long_press) {
      this._cancel_long_press = false
      return
    }

    if (this._multiselect_area_ing) {
      this._on_multiselect_area_end()
    }

    this._set_long_press_pointer(pointerId, clientX, clientY)

    if (this._is_background_pointer(pointerId)) {
      this._long_press_background_pointer.add(pointerId)
      this._long_press_background_count++

      this._animate_long_press(screenX, screenY, 'in')

      if (this._tree_layout) {
        //
      } else {
        if (this._mode === 'multiselect') {
          if (this._pointer_down_count === 1) {
            if (this._selected_node_count > 0) {
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

            const svg = this._minimap._map_el.$element.cloneNode(
              true
            ) as SVGSVGElement
            svg.removeChild(svg.childNodes[1])

            const { $theme, $width, $height } = this.$context

            const fallback_color = this._get_color()

            const color = getThemeModeColor($theme, this._mode, fallback_color)

            const width = MINIMAP_WIDTH
            const height = MINIMAP_HEIGHT

            const spec = clone(this._spec)

            const bundle = bundleSpec(spec, specs)

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

            if (this._mode === 'change' || this._mode === 'remove') {
              this._stop_debugger()

              const all_node_ids = Object.keys(this._node)

              this._remove_nodes(all_node_ids)
            }

            if (false) {
              const svg = new SVGSVG(
                {
                  width: $width,
                  height: $height,
                  style: {
                    position: 'fixed',
                    color,
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    background: '#dddd22aa',
                  },
                },
                this.$system,
                this.$pod
              )
              const node_shape: Dict<SVGCircle | SVGRect> = {}
              const dx = screenX - $width / 2
              const dy = screenY - $height / 2
              for (const unit_id in this._unit_node) {
                const node = this._node[unit_id]
                const { x, y, r, width, height, shape } = node
                const { x: sx, y: sy } = this._world_to_screen(x, y)
                const kr = r * this._zoom.k
                const kw = width * this._zoom.k
                const kh = height * this._zoom.k
                let shape_element: SVGCircle | SVGRect
                if (shape === 'circle') {
                  shape_element = new SVGCircle(
                    {
                      x: sx - dx,
                      y: sy - dy,
                      r: kr,
                      style: {
                        stroke: 'currentColor',
                        strokeWidth: '2px',
                        fill: 'none',
                      },
                    },
                    this.$system,
                    this.$pod
                  )
                } else {
                  shape_element = new SVGRect(
                    {
                      x: sx - dx - kw / 2,
                      y: sy - dy - kh / 2,
                      width: kw,
                      height: kh,
                      style: {
                        stroke: 'currentColor',
                        strokeWidth: '2px',
                        fill: 'none',
                      },
                    },
                    this.$system,
                    this.$pod
                  )
                }

                svg.appendChild(shape_element)

                node_shape[unit_id] = shape_element
              }

              const _link_element: Dict<SVGLine> = {}

              for (const link_id in this._unit_to_unit) {
                const { source, target } = segmentLinkId(link_id)

                const source_node = this._node[source]
                const target_node = this._node[target]

                const { x: lsx, y: lsy } = source_node
                const { x: ltx, y: lty } = target_node

                const { x: slsx, y: slsy } = this._world_to_screen(lsx, lsy)
                const { x: sltx, y: slty } = this._world_to_screen(ltx, lty)

                const link_element = new SVGLine(
                  {
                    x1: slsx - dx,
                    y1: slsy - dy,
                    x2: sltx - dx,
                    y2: slty - dy,
                    style: {
                      stroke: 'currentColor',
                      strokeWidth: '2px',
                    },
                  },
                  this.$system,
                  this.$pod
                )

                _link_element[link_id] = link_element

                svg.appendChild(link_element)
              }

              svg.mount(this.$context)

              this._drag_and_drop_cancel = dragAndDrop(
                this.$system,
                svg.$element,
                pointerId,
                screenX,
                screenY,
                $width,
                $height,
                bundle,
                (foundTarget: boolean) => {
                  this._drag_and_drop = false
                  this._drag_and_drop_pointer = null
                  if (this._enabled()) {
                    this._start_debugger()
                  }
                  if (!foundTarget) {
                    const position = this._screen_to_world(clientX, clientY)
                    this.paste_spec(bundle, position)
                    this.focus()
                  }
                }
              )
            } else {
              svg.setAttribute('stroke', color)
              svg.style.color = color
              svg.style.position = 'fixed'
              svg.style.zIndex = `${MAX_Z_INDEX}`
              svg.style.width = `${width}px`
              svg.style.height = `${height}px`
              svg.style.pointerEvents = 'none'

              this._drag_and_drop_cancel = dragAndDrop(
                this.$system,
                svg,
                pointerId,
                screenX,
                screenY,
                width,
                height,
                bundle,
                (foundTarget: boolean) => {
                  this._drag_and_drop = false
                  this._drag_and_drop_pointer = null

                  if (this._enabled()) {
                    this._start_debugger()
                  }

                  if (!foundTarget) {
                    const position = this._screen_to_world(clientX, clientY)

                    this.paste_spec(bundle, position)

                    this.focus()
                  }
                }
              )
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

    const { pointerId, screenX, screenY } = event

    if (this._swap_next_click_hold_long_press) {
      this._on_long_press(event)
      return
    }

    if (this._cancel_click_hold) {
      this._cancel_click_hold = false
      return
    }

    if (this._is_background_pointer(pointerId)) {
      let should_start_gesture = false

      if (this._mode === 'multiselect') {
        if (this._selected_node_count === 0) {
          should_start_gesture = true
        }
      } else if (this._mode === 'info') {
        //
      } else {
        should_start_gesture = true
      }

      if (should_start_gesture) {
        this._animate_long_press(screenX, screenY, 'in')

        if (!this._capturing_gesture) {
          this._start_gesture(event)
        }
      }
    } else {
    }
  }

  private _animate_long_press = (
    screenX: number,
    screenY: number,
    direction: 'in' | 'out'
  ): void => {
    // console.log('Graph', '_animate_long_press', screenX, screenY, direction)

    const {
      method: { showLongPress },
    } = this.$system

    const { $theme } = this.$context

    const color = this._get_color()

    const stroke = getThemeModeColor($theme, this._mode, color)

    showLongPress(screenX, screenY, { stroke, direction })
  }

  private _start_gesture = (event: IOPointerEvent): void => {
    // console.log('Graph', '_start_gesture')
    if (!this._capturing_gesture) {
      const {
        method: { captureGesture },
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
      const node_ids = Object.keys(this._selected_node_id)
      this._remove_nodes(node_ids)
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
    // console.log('Graph', '_on_ctrl_semicolon_keydown')

    if (this._focused) {
      if (this._search_hidden) {
        this._show_search()
      } else {
        this._hide_search()
      }
    }
  }

  private _on_ctrl_s_keydown = async () => {
    // console.log('Graph', '_on_ctrl_s_keydown')

    const {
      specs,
      api: {
        file: { showSaveFilePicker, downloadData },
      },
    } = this.$system

    const { name = 'untitled' } = this._spec

    const bundle = bundleSpec(this._spec, specs)

    if (showSaveFilePicker) {
      const options = {
        suggestedName: `${name}.unit`,
        startIn: 'desktop',
        excludeAcceptAllOption: false,
        id: 'unit',
        types: [
          {
            description: 'unit',
            accept: {
              'application/unit': ['.unit'],
            },
          },
        ],
      }

      let handle

      try {
        handle = await showSaveFilePicker(options)
      } catch (err) {
        console.log('err', err)
        return
      }

      const writableStream = await handle.createWritable()

      const json = JSON.stringify(bundle)

      await writableStream.write(json)

      await writableStream.close()
    } else {
      downloadData({
        name: `${name}.json`,
        data: JSON.stringify(this._spec, null, 2),
        mimeType: 'text/json',
        charSet: 'utf-8',
      })
    }
  }

  private _on_ctrl_o_keydown = async () => {
    // console.log('Graph', '_on_ctrl_o_keydown')
    const {
      api: {
        file: { showOpenFilePicker },
      },
    } = this.$system

    if (showOpenFilePicker) {
      try {
        const [fileHandle] = await showOpenFilePicker({
          startIn: 'desktop',
          id: 'unit',
          types: [
            {
              description: 'unit',
              accept: {
                'data/*': ['.unit'],
              },
            },
          ],
          excludeAcceptAllOption: false,
          multiple: false,
        })

        const file = await fileHandle.getFile()

        this._paste_file(file)
      } catch (err) {
        return
      }
    }
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

  public _copy_nodes = async (node_ids: string[]) => {
    // console.log('Graph', '_copy_nodes', node_ids)

    const { specs } = this.$system

    const graph: GraphSpec = {}

    const units: GraphUnitsSpec = {}
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

      let merge_pin_count = 0

      const partial_merge: GraphMergeSpec = {}
      for (const unit_id in merge) {
        if (units[unit_id]) {
          const merge_unit = merge[unit_id]
          const {
            input: merge_unit_input = {},
            output: merge_unit_output = {},
          } = merge_unit
          const merge_unit_pin_count =
            _keyCount(merge_unit_input) + _keyCount(merge_unit_output)
          merge_pin_count += merge_unit_pin_count
          partial_merge[unit_id] = merge_unit
        }
      }

      if (merge_pin_count > 1) {
        merges[merge_id] = partial_merge
      }
    }

    for (const datum_node_id of datum_ids) {
      const { id: datum_id } = segmentDatumNodeId(datum_node_id)
      const tree = this._datum_tree[datum_id]
      const { value } = tree
      data[datum_id] = value
    }

    for (const exposed_node_id of exposed_ids) {
      const { pinId, type, subPinId } = segmentExposedNodeId(exposed_node_id)

      const sub_pin_spec = clone(
        this._get_exposed_sub_pin_spec(type, pinId, subPinId)
      )

      const { unitId, pinId: _pinId, mergeId } = sub_pin_spec

      if (unitId && pinId) {
        if (!units[unitId]) {
          delete sub_pin_spec.unitId
          delete sub_pin_spec.pinId
        }
      } else if (mergeId) {
        if (!merges[mergeId]) {
          delete sub_pin_spec.mergeId
        }
      }

      if (type === 'input') {
        inputs[_pinId] = inputs[_pinId] || { pin: {} }

        inputs[_pinId].pin[subPinId] = sub_pin_spec
      } else {
        outputs[_pinId] = outputs[_pinId] || { pin: {} }

        outputs[_pinId].pin[subPinId] = sub_pin_spec
      }
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

    const bundle = bundleSpec(graph, specs)

    const json = JSON.stringify(bundle)

    const {
      api: {
        clipboard: { writeText },
      },
    } = this.$system

    try {
      await writeText(json)
    } catch (err) {
      this._show_err(err)
    }
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
    const {
      api: {
        clipboard: { readText },
      },
    } = this.$system

    try {
      const text = await readText()

      this._paste_text(text, position)
    } catch (err) {
      showNotification(
        'Clipboard API not supported',
        {
          color: COLOR_RED,
          borderColor: COLOR_RED,
        },
        3000
      )
    }
  }

  private _paste_text = (text: string, position: Position): void => {
    let json: BundleSpec | undefined = undefined
    try {
      json = JSON.parse(text) as BundleSpec
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
    } else {
      if (text) {
        const datum_id = this._new_datum_id()
        this.add_datum(datum_id, text, position)
      }
    }
  }

  public paste_spec = (bundle: BundleSpec, position: Position) => {
    console.log('Graph', 'paste_spec', bundle)
    const { specs } = this.$system

    const { spec, specs: _specs } = bundle

    const map_spec_id: Dict<string> = injectSpecs(specs, _specs)

    const {
      units = {},
      merges = {},
      inputs = {},
      outputs = {},
      data = {},
    } = spec

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

    const new_selected_node_id = []

    for (const unit_id in units) {
      const unit = units[unit_id]
      const { id } = unit
      const new_unit_id = this._new_unit_id(id, set_unit_id)
      set_unit_id.add(new_unit_id)
      map_unit_id[unit_id] = new_unit_id

      new_selected_node_id.push(new_unit_id)
    }

    for (const merge_id in merges) {
      const new_merge_id = this._new_merge_id(set_merge_id)
      set_merge_id.add(new_merge_id)
      map_merge_id[merge_id] = new_merge_id

      const new_merge_node_id = getMergeNodeId(new_merge_id)
      new_selected_node_id.push(new_merge_node_id)
    }

    for (const input_id in inputs) {
      const new_input_id = this._new_input_id(input_id, set_input_id)
      set_input_id.add(new_input_id)
      map_input_id[input_id] = new_input_id

      const input = inputs[input_id]

      const { pin = {} } = input

      for (const sub_pin_id in pin) {
        const new_sub_ext_pin_id = getExtNodeId(
          'input',
          new_input_id,
          sub_pin_id
        )
        new_selected_node_id.push(new_sub_ext_pin_id)
      }
    }

    for (const output_id in outputs) {
      const new_output_id: string = this._new_output_id(
        output_id,
        set_output_id
      )
      set_output_id.add(new_output_id)
      map_output_id[output_id] = new_output_id

      const output = outputs[output_id]

      const { pin = {} } = output

      for (const sub_pin_id in pin) {
        const new_sub_ext_pin_id = getExtNodeId(
          'output',
          new_output_id,
          sub_pin_id
        )
        new_selected_node_id.push(new_sub_ext_pin_id)
      }
    }

    for (const datum_id in data) {
      const new_datum_id = this._new_datum_id(set_datum_id)
      set_datum_id.add(new_datum_id)
      map_datum_id[datum_id] = new_datum_id

      const new_datum_node_id = getDatumNodeId(new_datum_id)
      new_selected_node_id.push(new_datum_node_id)
    }

    this._paste_spec(
      spec,
      position,
      map_spec_id,
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
      const type = _type as IO
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
            if (new_unit_id) {
              new_pin.pin[sub_pin_id] = { unitId: new_unit_id, pinId }
            }
          } else if (mergeId) {
            const new_merge_id = map_merge_id[mergeId]
            if (new_merge_id) {
              new_pin.pin[sub_pin_id] = { mergeId: new_merge_id }
            }
          } else {
            new_pin.pin[sub_pin_id] = {}
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
    map_spec_id: Dict<string>,
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

    console.log(_graph)

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

      this._sim_add_unit_core(new_unit_id, unit, p)
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

      this._dispatch_add_unit_action(unit_id, unit)
    }

    for (const merge_id in new_merges) {
      const merge = new_merges[merge_id]
      this._pod_add_merge(merge_id, merge)
    }

    const type_pins = { input: inputs, output: outputs }
    const type_map_pin_id = { input: map_input_id, output: map_output_id }

    for (const _type of ['input', 'output']) {
      const type = _type as IO
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

      const layout_position = NULL_VECTOR

      this._spec_append_component(parent_id, new_unit_id)
      this._sim_add_core_component(new_unit_id, parent_id, layout_position)
      this._sim_add_unit_component(new_unit_id)
      this._pod_connect_sub_component(new_unit_id)
    }

    for (const unit_id in subComponents) {
      const sub_component = subComponents[unit_id]

      const { children = [] } = sub_component

      const slot_name = 'default' // TODO

      for (const child_id of children) {
        this._mem_move_sub_component_child(unit_id, child_id, slot_name)
        this._spec_append_sub_component_child(unit_id, child_id, slot_name)
        this._pod_append_sub_component_child(unit_id, child_id, slot_name) // TODO slotName
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

    const next_selected_node: string[] = []

    for (const unit_id in units) {
      const unit = units[unit_id]
      const cm_p = (unit.metadata && unit.metadata.position) || NULL_VECTOR
      const p = addVector(position, cm_p)
      this._spec_add_unit(unit_id, unit)
      this._sim_add_unit_core(unit_id, unit, p)

      next_selected_node.push(unit_id)
    }

    for (const merge_id in merges) {
      const merge = merges[merge_id]
      this._state_add_merge(merge_id, merge, position)

      const merge_node_id = getMergeNodeId(merge_id)

      next_selected_node.push(merge_node_id)
    }

    for (const unit_id in units) {
      const unit = units[unit_id]
      const unit_pin_position = this._get_spec_init_unit_pin_position(
        graph,
        unit_id
      )
      this._sim_add_unit_pins(unit_id, unit, unit_pin_position)

      this._for_each_unit_pin(unit_id, (pin_node_id) => {
        next_selected_node.push(pin_node_id)
      })
    }

    const type_pins = { input: inputs, output: outputs }

    for (const _type of ['input', 'output']) {
      const type = _type as IO
      const pins = type_pins[type]

      for (const pin_id in pins) {
        const pin = pins[pin_id]
        this._state_add_exposed_pin_set(type, pin_id, pin, {})
      }
    }

    for (const merge_id in merges) {
      this._sim_collapse_merge(merge_id)
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

      const slot_name = 'default'

      for (const child_id of children) {
        this._mem_move_sub_component_child(unit_id, child_id, slot_name)
        this._spec_append_sub_component_child(unit_id, child_id, slot_name)
      }
    }

    for (const datum_id in data) {
      const value = data[datum_id]
      this._sim_add_datum_node(datum_id, value, position)

      const datum_node_id = getDatumNodeId(datum_id)

      next_selected_node.push(datum_node_id)
    }

    for (const new_node_id of next_selected_node) {
      if (this._has_node(new_node_id)) {
        this.select_node(new_node_id)
      }
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
      const type = _type as IO
      const pins = type_pins[type]
      for (const pin_id in pins) {
        const pin = pins[pin_id]
        this._pod_add_exposed_pin_set(type, pin_id, pin)
      }
    }

    const { subComponents = {} } = component

    for (const unit_id in subComponents) {
      this._pod_connect_sub_component(unit_id)
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
    const position = this._jiggle_world_screen_center()
    this._paste_clipboard(position)
  }

  private _on_ctrl_l_keydown = (key: string): void => {
    if (this._search) {
      if (this._search_hidden) {
        this._search.toggleShape()
      }
    }
  }

  private _on_ctrl_m_keydown = (key: string): void => {
    this._toggle_minimap()
  }

  private _on_ctrl_p_keydown = (key: string): void => {
    this._toggle_pallete()
  }

  private _undo = (): void => {
    if (this._action_buffer_cursor > -1) {
      const last_action = this._action_buffer[this._action_buffer_cursor]

      this._action_buffer_cursor--

      console.log(this._action_buffer_cursor)

      const opposite_action = reverseAction(last_action)

      this._action(opposite_action)
    }
  }

  private _action = (action: Action): void => {
    const { type, data } = action

    switch (type) {
      case ADD_UNIT:
        {
          this._add_unit(
            data.id,
            data.unit,
            data.position,
            data.pinPosition,
            data.layoutPosition,
            data.parentId
          )
        }
        break
      case REMOVE_UNIT:
        {
          this._remove_unit(data.id)
        }
        break
      case ADD_MERGE:
        {
          this._add_merge(data.id, data.merge, data.position)
          this._sim_collapse_merge(data.id)
        }
        break
      case REMOVE_MERGE:
        {
          const merge_node_id = getMergeNodeId(data.id)
          this._remove_merge(merge_node_id)
        }
        break
      case ADD_PIN_TO_MERGE:
        {
          const merge_node_id = getMergeNodeId(data.id)
          const pin_node_id = getPinNodeId(data.unitId, data.type, data.pinId)
          this._merge_link_pin_merge_pin(pin_node_id, merge_node_id)
        }
        break
      case REMOVE_PIN_FROM_MERGE:
        {
          const merge_node_id = getMergeNodeId(data.id)
          const pin_node_id = getPinNodeId(data.unitId, data.type, data.pinId)
          this._remove_pin_from_merge(merge_node_id, pin_node_id)
        }
        break
      default:
        throw new Error('TODO')
    }
  }

  private _redo = (): void => {
    if (this._action_buffer_cursor < this._action_buffer.length - 1) {
      this._action_buffer_cursor++

      const action = this._action_buffer[this._action_buffer_cursor]

      this._action(action)
    }
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

  private _insert_sub_component_child = (
    parent_id: string,
    sub_component_id: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_insert_sub_component_child',
    //   parent_id,
    //   sub_component_id
    // )

    const parent_component = this._get_sub_component(parent_id)
    const sub_component = this._get_sub_component(sub_component_id)

    if (!this._is_fullwindow) {
      const slot = this._get_sub_component_slot_name(sub_component_id)
      const i = this._get_sub_component_parent_root_index(sub_component_id)

      if (parent_component.$mountParentRoot.length > i) {
        parent_component.insertParentRootAt(sub_component, i, slot)
      } else {
        parent_component.appendParentRoot(sub_component, slot)
      }
    }
  }

  private _mem_insert_sub_component_child = (
    parent_id: string,
    sub_component_id: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_mem_insert_sub_component_child',
    //   parent_id,
    //   sub_component_id
    // )

    const parent_component = this._get_sub_component(parent_id)
    const sub_component = this._get_sub_component(sub_component_id)

    if (!this._is_fullwindow) {
      const slot = this._get_sub_component_slot_name(sub_component_id)
      const i = this._get_sub_component_parent_root_index(sub_component_id)

      if (parent_component.$mountParentRoot.length > i) {
        parent_component.memInsertParentRootAt(sub_component, i, slot)
      } else {
        parent_component.memAppendParentRoot(sub_component, slot, i)
      }
    }
  }

  private _dom_insert_sub_component_child = (
    parent_id: string,
    sub_component_id: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_dom_insert_sub_component_child',
    //   parent_id,
    //   sub_component_id
    // )

    const parent_component = this._get_sub_component(parent_id)
    const sub_component = this._get_sub_component(sub_component_id)

    if (!this._is_fullwindow) {
      const slot = this._get_sub_component_slot_name(sub_component_id)
      const i = this._get_sub_component_parent_root_index(sub_component_id)

      if (parent_component.$mountParentRoot.length > i) {
        parent_component.domInsertParentRootAt(sub_component, i, slot)
      } else {
        parent_component.domAppendParentRoot(sub_component, slot, i)
      }
    }
  }

  private _post_insert_sub_component_child = (
    parent_id: string,
    sub_component_id: string
  ): void => {
    // console.log(
    //   'Graph',
    //   '_insert_sub_component_child',
    //   parent_id,
    //   sub_component_id
    // )

    const parent_component = this._get_sub_component(parent_id)
    const sub_component = this._get_sub_component(sub_component_id)

    if (!this._is_fullwindow) {
      const slot = this._get_sub_component_slot_name(sub_component_id)
      const i = this._get_sub_component_parent_root_index(sub_component_id)

      if (parent_component.$mountParentRoot.length > i) {
        parent_component.postInsertParentRootAt(sub_component, i, slot)
      } else {
        parent_component.postAppendParentRoot(sub_component, slot, i)
      }
    }
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
    if (la * lb > 0) {
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

    return this.__sim_max_l(al, bl, a_sg, b_sg)
  }

  private __sim_max_l = (
    al: number,
    bl: number,
    a_sg: string,
    b_sg: string
  ): number => {
    const same_subgraph = a_sg === b_sg

    const al_abs = Math.abs(al)
    const bl_abs = Math.abs(bl)

    if (same_subgraph) {
      const r = SUBGRAPH_RELATIVE_MAX_L[al_abs][bl_abs]
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

      for (const a_id of this._long_press_collapse_node_id) {
        const a = this._node[a_id]

        const { _x, _y } = a

        const dx = _x - cx
        const dy = _y - cy

        const s = 0.25
        const k = s * alpha

        a.ax -= dx * k
        a.ay -= dy * k
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

  private _force_custom_layer_ignored = (alpha: number): void => {
    this._force_link_y(alpha, this._ignored_link)
  }

  private _force_custom_layer_exposed = (alpha: number): void => {
    const { $width, $height } = this.$context

    const { x: cx, y: cy } = this._world_screen_center()

    const z = this._zoom.k

    const RE = Math.min($width, $height) / 24 / z

    for (const a_id in this._exposed_int_unplugged) {
      const a = this._node[a_id]

      const { _x: a_x, _y: a_y } = a

      const { pinId, type, subPinId } = segmentExposedNodeId(a_id)

      const b_id = getExtNodeId(type, pinId, subPinId)

      const b = this._node[b_id]

      const { _x: b_x, _y: b_y } = b

      if (this._node_target[a_id] || this._int_node_locked[a_id]) {
        const c_id = this._node_target[a_id] || this._int_node_locked[a_id]

        const c = this._node[c_id]

        const { _x: pin_x, _y: pin_y } = c

        const a_u = unitVector(a_x, a_y, pin_x, pin_y)

        const k = 9 * alpha

        a.ax += a_u.x * k
        a.ay += a_u.y * k
      } else {
        let closest_comp_node_id = null
        let closest_d = Number.MAX_SAFE_INTEGER

        if (this._compatible_node_count > 0) {
          for (const pin_node_id in this._compatible_node_id) {
            const comp_node = this._node[pin_node_id]

            const d_a = pointDistance(a, comp_node)
            const d_b = pointDistance(b, comp_node)

            const comp_closest_l = Math.min(d_a, d_b)

            if (comp_closest_l < 4 * LINK_DISTANCE) {
              if (comp_closest_l < closest_d) {
                closest_d = comp_closest_l
                closest_comp_node_id = pin_node_id
              }
            }
          }
        }

        if (this._drag_node_id[a_id]) {
          const u = unitVector(a_x, a_y, b_x, b_y)

          let a_u: Point

          if (closest_comp_node_id) {
            const comp_node = this._node[closest_comp_node_id]

            const { _x: comp_x, _y: comp_y } = comp_node

            a_u = unitVector(comp_x, comp_y, a_x, a_y)
          } else {
            a_u = unitVector(cx, cy, a_x, a_y)
          }

          const angle = radBetween(u.x, u.y, a_u.x, a_u.y)

          if (angle < 2 * Math.PI - 0.01) {
            const p = normalize({ x: a_u.x - u.x, y: a_u.y - u.y })

            const k = 3 * alpha

            b.ax += p.x * k
            b.ay += p.y * k
          }
        } else if (this._drag_node_id[b_id]) {
          const u = unitVector(b_x, b_y, a_x, a_y)

          if (closest_comp_node_id) {
            const comp_node = this._node[closest_comp_node_id]

            const { _x: c_x, _y: c_y, r: c_r } = comp_node

            const a_u = unitVector(a_x, a_y, c_x, c_y)

            const angle = radBetween(u.x, u.y, a_u.x, a_u.y)

            if (angle > 0.01) {
              const p = normalize({ x: a_u.x - u.x, y: a_u.y - u.y })

              const k = 3 * alpha

              a.ax += p.x * k
              a.ay += p.y * k
            }
          } else {
            const b_u = unitVector(b_x, b_y, cx, cy)

            const angle = radBetween(u.x, u.y, b_u.x, b_u.y)

            if (angle > 0.01) {
              const p = normalize({ x: b_u.x - u.x, y: b_u.y - u.y })

              const k = 2 * alpha

              a.ax += p.x * k
              a.ay += p.y * k
            }
          }
        } else {
          const dx = a_x - cx
          const dy = a_y - cy

          const r = Math.sqrt(dx * dx + dy * dy)

          const k = (0.1 * z * ((RE - r) * alpha)) / r

          a.ax += dx * k
          a.ay += dy * k
        }
      }
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

          const L = this.__sim_max_l(a_layer, b_layer, a_sg, b_sg)

          if (l < L) {
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

            const D = this.__sim_max_l(a_layer, b_layer, a_sg, b_sg)

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

  private _set_layout_core_position = (
    sub_component_id: string,
    x: number,
    y: number
  ): void => {
    // console.log('Graph', '_set_layout_core_position', sub_component_id, x, y)

    const layout_core = this._layout_core[sub_component_id]

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
            this._get_spec_parent_layout_layer(sub_component_id)
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

  private _set_layout_core_position_x = (
    sub_component_id: string,
    x: number
  ): void => {
    // console.log('Graph', '_set_layout_core_position_x', sub_component_id, x)

    const layout_core = this._layout_core[sub_component_id]

    layout_core.$element.style.left = `calc(50% + ${x}px)`

    const layout_node = this._layout_node[sub_component_id]

    layout_node.x = x
  }

  private _set_layout_core_position_y = (
    sub_component_id: string,
    y: number
  ): void => {
    // console.log('Graph', '_set_layout_core_position_y', sub_component_id, y)

    const layout_core = this._layout_core[sub_component_id]

    layout_core.$element.style.top = `calc(50% + ${y}px)`

    const layout_node = this._layout_node[sub_component_id]

    layout_node.y = y
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
      } else if (this._is_ext_node_id(node_id)) {
        const exposed_node_id = node_id
        const { type, pinId, subPinId } = segmentExposedNodeId(exposed_node_id)
        spec = assocPath(
          spec,
          [`${type}s`, pinId, 'metadata', 'position', subPinId],
          position
        )
      } else {
      }
    }
    return spec
  }

  private _pod_unlisten: Unlisten

  private _set_units_position = (units: GraphUnitsSpec): void => {
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
            // 'set_input',
            // 'set_output',
            // 'remove_input',
            // 'remove_output',
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

    if (this._debug_interval !== null) {
      return
    }

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
    // console.log('Graph', '_stop_debugger')

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

  private _on_graph_unit_expose_pin_set = (
    data: GraphExposedPinSetMomentData & { unitId: string }
  ): void => {
    console.log('Graph', '_on_graph_unit_expose_pin_set', data)
    const { unitId, type, pinId } = data
    this._graph_set_unit_pin(unitId, type, pinId)
  }

  private _on_graph_unit_cover_pin_set = (
    data: GraphExposedPinSetMomentData & { unitId: string }
  ): void => {
    console.log('Graph', '_on_graph_unit_cover_pin_set', data)
    const { unitId, type, pinId } = data
    this._graph_remove_unit_pin(unitId, type, pinId)
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
    this._pod_connect_sub_component(unit_id)

    this._start_graph_simulation(LAYER_NORMAL)
  }

  private _on_add_unit_moment = (data: GraphSpecUnitMomentData): void => {
    // console.log('Graph', '_on_add_unit_moment')

    const { unitId, specId } = data

    const position = this._jiggle_world_screen_center()

    const unit = { id: specId }

    this._spec_add_unit(unitId, unit)

    if (this._is_unit_component(unitId)) {
      this._spec_append_component(null, unitId)
    }

    this._sim_add_unit(unitId, unit, position, { input: {}, output: {} }, null)

    // TODO this should happen independently of `graph`
    if (this._is_unit_component(unitId)) {
      this._sim_add_unit_component(unitId)
      this._pod_connect_sub_component(unitId)
    }
  }

  private _on_graph_unit_add_unit_moment = (
    data: UnitGraphSpecMomentData & { unitId: string }
  ): void => {
    console.log('Graph', '_on_graph_unit_add_unit_moment', data)

    const { specs } = this.$system

    const { unitId, specId, path } = data

    const unit_spec_id = this._get_unit_spec_id(unitId)

    let { spec_id, spec, forked } = this._ensure_fork_spec(unit_spec_id)

    const is_unit_component = isComponent(specs, unit_spec_id)
    const unit_spec_render = this._get_unit_spec_render(unitId)

    const is_added_unit_component = isComponent(specs, specId)
    const added_unit_spec = getSpec(specs, specId)

    const added_unit_id = path[path.length - 1]

    let next_spec = clone(spec)

    next_spec = specReducer.addUnit(
      { id: added_unit_id, unit: { id: specId } },
      next_spec
    )

    next_spec.metadata = next_spec.metadata || {}

    delete next_spec.metadata.complexity

    if (is_added_unit_component) {
      next_spec.component = componentReducer.setSubComponent(
        { id: added_unit_id, spec: {} },
        next_spec.component || {}
      )
      next_spec.component = componentReducer.appendChild(
        { id: added_unit_id },
        next_spec.component || {}
      )

      if (is_unit_component) {
        //
      } else {
        const { component: added_component_spec } = added_unit_spec

        const { defaultWidth = 120, defaultHeight = 120 } = added_component_spec

        next_spec.component.defaultWidth =
          next_spec.component.defaultWidth || defaultWidth
        next_spec.component.defaultHeight =
          next_spec.component.defaultHeight || defaultHeight
      }

      const sub_component = this._get_sub_component(unitId)

      const pod = this._pod.$refUnit({
        unitId,
        _: ['$U', '$C', '$G'],
      }) as $Graph

      let sub_pod = pod
      let sub_sub_component = sub_component

      for (let i = path.length - 1; i >= 0; i--) {
        const unit_id = path[i]

        if (!sub_component) {
          break
        }

        const sub_sub_component_parent = sub_sub_component

        sub_sub_component = sub_sub_component.$subComponent[unit_id]

        if (!sub_sub_component) {
          sub_pod = sub_pod.$refUnit({
            unitId: unit_id,
            _: ['$U', '$C', '$G', '$EE'],
          }) as $Graph

          const sub_sub_component = componentFromSpecId(
            this.$system,
            this.$pod,
            specId,
            {}
          )
          sub_sub_component.connect(sub_pod)

          sub_sub_component_parent.setSubComponent(unit_id, sub_sub_component)
          sub_sub_component_parent.pushRoot(sub_sub_component)
        }
      }
    }

    setSpec(specs, spec_id, next_spec)

    if (forked) {
      this._spec_set_unit_spec_id(unitId, spec_id)
    }

    if (unit_spec_render === undefined) {
      if (is_added_unit_component) {
        if (is_unit_component) {
          //
        } else {
          this._set_core_shape(unitId, 'rect')

          this._spec_append_component(null, unitId)

          this._sim_add_core_component(unitId, null, { x: 0, y: 0 })

          if (this._subgraph_unit_id === unitId) {
            this._mem_add_unit_component(unitId)
          } else {
            this._sim_add_unit_component(unitId)
          }

          this._refresh_core_rect(unitId)

          this._hide_core_icon(unitId)
        }
      } else {
        if (is_unit_component) {
          //
        } else {
          this._refresh_core_circle(unitId)

          const unit_count = _keyCount(next_spec.units || {})

          if (unit_count === 1 && !is_unit_component) {
            this._set_core_icon(unitId, 'question')
            this._show_core_icon(unitId)
          }
        }
      }
    } else {
      //
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
    // console.log('Graph', '_on_move_unit_moment', data)
    const { id } = data
    this._state_remove_unit(id)
  }

  private _ensure_fork_spec(init_spec_id: string): {
    spec_id: string
    spec: GraphSpec
    forked: boolean
  } {
    const { specs } = this.$system

    const init_spec = getGraphSpec(specs, init_spec_id)

    if (init_spec.fork) {
      return { spec_id: init_spec_id, spec: init_spec, forked: false }
    } else {
      const forked_spec_id = newSpecId(specs)
      const forked_spec = clone(init_spec)

      forked_spec.id = forked_spec_id
      forked_spec.fork = true

      return {
        spec_id: forked_spec_id,
        spec: forked_spec,
        forked: true,
      }
    }
  }

  private _on_graph_unit_remove_unit_moment = (
    data: UnitGraphSpecMomentData & { unitId: string }
  ): void => {
    // console.log('Graph', '_on_graph_unit_remove_unit_moment', data)
    const { specs } = this.$system

    const { unitId, path, specId } = data

    const unit_spec_id = this._get_unit_spec_id(unitId)

    const unit_is_component = this._is_unit_component(unitId)

    let { spec_id, spec, forked } = this._ensure_fork_spec(unit_spec_id)

    let next_spec = clone(spec)

    const removed_unit_id = path[path.length - 1]

    next_spec = specReducer.removeUnit({ id: removed_unit_id }, next_spec)

    next_spec.metadata = next_spec.metadata || {}

    delete next_spec.metadata.complexity

    if (unit_is_component) {
      if (isComponent(specs, specId)) {
        next_spec.component = componentReducer.removeSubComponent(
          { id: removed_unit_id },
          next_spec.component || {}
        )
        next_spec.component = componentReducer.removeChild(
          { id: removed_unit_id },
          next_spec.component || {}
        )

        let sub_component = this._get_sub_component(unitId)

        for (let i = path.length - 2; i >= 0; i--) {
          const unit_id = path[i]
          sub_component = sub_component.getSubComponent(unit_id)
        }

        const sub_sub_component = sub_component.$subComponent[removed_unit_id]
        if (sub_sub_component) {
          sub_component.removeSubComponent(removed_unit_id)
          sub_component.pullRoot(sub_sub_component)
          sub_sub_component.disconnect()
        }
      }
    }

    if (forked) {
      this._spec_set_unit_spec_id(unitId, spec_id)
    }

    setSpec(specs, spec_id, next_spec)

    if (unit_is_component) {
      //
    } else {
      this._refresh_core_circle(unitId)

      const { count: unit_count } = keyCount({ obj: next_spec.units || {} })
      if (unit_count === 0) {
        this._hide_core_icon(unitId)
      } else {
        this._show_core_icon(unitId)
      }
    }

    this._refresh_core_size(unitId)
  }

  private _spec_set_unit_spec_id = (unit_id: string, spec_id: string): void => {
    this._spec.units[unit_id].id = spec_id
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
    } else if (this._is_int_pin_node_id(node_id)) {
      return !this._exposed_int_plugged[node_id]
    } else if (this._is_ext_node_id(node_id)) {
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
    // console.log('Graph', '_sim_collapse_merge', merge_id)

    const merge_spec = this.__get_merge(merge_id)
    const merge_node_id = getMergeNodeId(merge_id)
    const merge_ref_unit_id = this._merge_to_ref_unit[merge_node_id]
    const merge_ref_output_id = this._merge_to_ref_output[merge_node_id]
    forEachPinOnMerge(merge_spec, (unitId, type, pinId) => {
      const pin_node_id = getPinNodeId(unitId, type, pinId)
      this._sim_add_pin_to_merge(pin_node_id, merge_node_id)
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
    this.__spec_add_link_pin_to_merge(mergeId, unitId, type, pinId)
    this._sim_add_pin_to_merge(pin_node_id, merge_node_id)
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

  private _graph_set_unit_pin = (unitId: string, type: IO, pinId: string) => {
    const { specs } = this.$system

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

      setSpec(specs, unit_spec_id, unit_spec)

      const position = this._get_unit_pin_random_position(unitId)

      this._sim_add_link_pin_node(unitId, type, pinId, position)
      this._sim_add_link_pin_link(unitId, type, pinId)
    }
  }

  private _graph_remove_unit_pin = (
    unitId: string,
    type: IO,
    pinId: string
  ) => {
    // console.log('Graph', '_graph_remove_unit_pin')

    const { specs } = this.$system

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

      setSpec(specs, unit_spec_id, unit_spec)

      this._sim_remove_link_pin(pin_node_id)
    }
  }

  private _on_graph_unit_link_pin_data_moment = (
    _data: GraphUnitPinDataMomentData
  ): void => {
    // console.log('Graph', '_on_graph_unit_link_pin_data_moment', _data)
    const { unitId, pinId, type, data } = _data

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
    this._set_core_border_color(unit_id, COLOR_OPAQUE_RED)
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
    // TODO
  }

  private _on_graph_unit_remove_child_at_moment = (
    moment: GraphMoment
  ): void => {
    console.log('Graph', '_on_graph_unit_remove_child_at_moment', moment)
    // TODO
  }

  private _unit_debug_set_pin_data = (
    type: IO,
    pinId: string,
    data: string
  ): void => {
    // console.log('Graph', '_unit_debug_set_pin_data', type, pinId, data)
    this._unit_datum[type][pinId] = data
    this._set_exposed_pin_set_color(type, pinId, this._theme.data)
  }

  private _unit_debug_remove_pin_data = (type: IO, pinId: string) => {
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
      const { value } = next_tree
      const id = idFromUnitValue(value)
      const _datum = datum as ClassDatum
      _datum.setProp('id', id)
      this._datum_tree[datum_id] = next_tree
      this._refresh_class_literal_datum_node_selection(pin_datum_node_id)
    } else {
      // AD HOC
      // this data event should not have come back
      // for the edit datum, so do not update its tree
      if (datum_id !== this._edit_datum_id) {
        const _datum = datum as Datum
        _datum.setProp('data', next_tree)
        this._datum_tree[datum_id] = next_tree
      }
    }

    // if (!this._is_link_pin_ignored(pin_node_id)) {
    this._mem_set_pin_datum(pin_node_id, datum_id)
    // }

    this._refresh_pin_color(pin_node_id)

    this._refresh_datum_visible(pin_datum_node_id)
  }

  private _graph_debug_set_pin_data = (
    pin_node_id: string,
    data: string
  ): void => {
    // console.log('Graph', '_graph_debug_set_pin_data', pin_node_id, data)

    const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)
    if (!this._has_node(anchor_node_id)) {
      return
    }

    const pin_datum_node_id = this._pin_to_datum[pin_node_id]

    let datum_id: string

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

      const tree = _getValueTree(data)

      this._datum_tree[datum_id] = tree

      if (
        this._is_pin_node_id(anchor_node_id) &&
        !this._is_pin_ref(anchor_node_id)
      ) {
        const position = this._pin_datum_initial_position(anchor_node_id)

        this._sim_add_datum_node(datum_id, data, position)
        this._sim_add_datum_link(datum_node_id, pin_node_id)
      }

      this._mem_set_pin_datum(pin_node_id, datum_id)
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

    const anchor_node_id = this._get_pin_anchor_node_id(pin_node_id)
    if (!this._has_node(anchor_node_id)) {
      return
    }

    const datum_node_id = this._pin_to_datum[pin_node_id]
    if (datum_node_id) {
      this._sim_remove_datum(datum_node_id)
    }

    const pin_datum_tree = this._pin_datum_tree[pin_node_id]
    if (pin_datum_tree) {
      this._mem_remove_pin_datum_tree(pin_node_id)
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

    if (this._debug_interval === null && !this._debug_disabled) {
      this._start_debugger()
    }
  }

  private _on_graph_unit_link_pin_invalid_moment = () => {
    // TODO
  }

  private _on_graph_unit_merge_invalid_moment = () => {
    // TODO
  }

  private _graph_moment_handler: Dict<Dict<Function>> = {
    input: {
      data: this._on_graph_unit_link_pin_data_moment,
      drop: this._on_graph_unit_link_pin_drop_moment,
      invalid: this._on_graph_unit_link_pin_invalid_moment,
    },
    output: {
      data: this._on_graph_unit_link_pin_data_moment,
      drop: this._on_graph_unit_link_pin_drop_moment,
      invalid: this._on_graph_unit_link_pin_invalid_moment,
    },
    ref_input: {
      data: this._on_graph_unit_ref_link_pin_data_moment,
      drop: this._on_graph_unit_ref_link_pin_drop_moment,
      invalid: this._on_graph_unit_link_pin_invalid_moment,
    },
    ref_output: {
      data: this._on_graph_unit_ref_link_pin_data_moment,
      drop: this._on_graph_unit_ref_link_pin_drop_moment,
      invalid: this._on_graph_unit_link_pin_invalid_moment,
    },
    merge: {
      data: this._on_graph_unit_merge_data_moment,
      drop: this._on_graph_unit_merge_drop_moment,
      invalid: this._on_graph_unit_merge_invalid_moment,
    },
    unit: {
      append_child: this._on_graph_unit_append_child_moment,
      remove_child_at: this._on_graph_unit_remove_child_at_moment,
      err: this._on_graph_unit_err_moment,
      take_err: this._on_graph_unit_take_err_moment,
      catch_err: this._on_graph_unit_take_err_moment,
      leaf_set: this._on_graph_unit_set_moment,
      leaf_add_unit: this._on_graph_unit_add_unit_moment,
      leaf_remove_unit: this._on_graph_unit_remove_unit_moment,
      leaf_append_child: this._on_graph_leaf_append_child,
      leaf_remove_child_at: this._on_graph_leaf_remove_child_at,
      leaf_expose_pin_set: this._on_graph_unit_expose_pin_set,
      leaf_cover_pin_set: this._on_graph_unit_cover_pin_set,
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
    this._unit_debug_set_pin_data(type as IO, pinId, data)
  }

  private _on_drop_moment = (moment: PinDropMomentData): void => {
    // console.log('Graph', '_on_drop_moment', moment)
    const { type, pinId } = moment
    this._unit_debug_remove_pin_data(type as IO, pinId)
  }

  private _pin_invalid_set: Set<string> = new Set()

  private _set_link_pin_invalid = (pin_node_id: string) => {
    const {} = segmentPinLinkId(pin_node_id)

    this._pin_invalid_set.add(pin_node_id)
  }

  private _on_invalid_moment = (moment: PinDataMomentData) => {
    // console.log('Graph', '_on_data_moment', moment)
    const { type, pinId, data } = moment
    this._unit_debug_set_pin_data(type as IO, pinId, data)
  }

  private _unit_moment_handler: Dict<Dict<Function>> = {
    input: {
      data: this._on_data_moment,
      drop: this._on_drop_moment,
      invalid: this._on_invalid_moment,
    },
    output: {
      data: this._on_data_moment,
      drop: this._on_drop_moment,
      invalid: this._on_invalid_moment,
    },
    ref_input: {
      data: this._on_data_moment,
      drop: this._on_drop_moment,
      invalid: this._on_invalid_moment,
    },
    ref_output: {
      data: this._on_data_moment,
      drop: this._on_drop_moment,
      invalid: this._on_invalid_moment,
    },
    merge: {
      data: NOOP,
      drop: NOOP,
      invalid: NOOP,
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

      this._minimap.$element.style.color = color

      if (this._minimap_screen) {
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
      mergePropStyle(graph, { color })
      // graph.$element.style.color = color
    }

    if (this._enabled()) {
      this._refresh_minimap_color()
    }

    this._multiselect_area_svg_rect.$element.style.stroke = this._theme.selected

    if (!parent) {
      if (this._transcend) {
        const backgroundColor = this._background_color()
        mergePropStyle(this._transcend, {
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
      // RETURN
      // this._disconnect_all_sub_component()
      this._plunk_pod(this._pod)

      this._pod = pod

      this._reset_spec()
      this._setup_pod(this._pod)
      this._refresh_enabled()
    } else if (prop === 'fullwindow') {
      if (current === true && !this._is_fullwindow) {
        this._enter_all_fullwindow(false)
      } else if (current === false && this._is_fullwindow) {
        this._leave_all_fullwindow(true, NOOP)
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
