import { snakeToCamel } from '../../client/id'
import { cssTextToObj } from '../../client/rawExtractStyle'
import { Size } from '../../client/util/geometry/types'
import { fromUnitBundle } from '../../spec/fromUnitBundle'
import {
  appendRoot,
  appendSubComponentChild,
  setSubComponent,
} from '../../spec/reducers/component'
import { addUnit } from '../../spec/reducers/spec'
import { emptySpec, newUnitId } from '../../spec/util'
import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { GraphUnitPinSpec } from '../../types/GraphUnitPinSpec'
import { GraphUnitSpec } from '../../types/GraphUnitSpec'
import { UnitBundle } from '../../types/UnitBundle'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { clone } from '../clone'
import { elementToJson, Tag } from '../element'
import { getObjSingleKey, isEmptyObject } from '../object'
import { TAG_TO_SPEC_ID } from '../tagToId'

export function domToUnit(
  system: System,
  type: DOMParserSupportedType,
  text: string,
  size: Size
): UnitBundle {
  const { specs, classes } = system

  const bundle = domToBundle(system, type, text, size)

  const Class = fromUnitBundle(bundle, specs, classes)

  return Class
}

export function domToBundle(
  system: System,
  type: DOMParserSupportedType,
  text: string,
  size: Size
): UnitBundleSpec {
  const {
    specs,
    api: {
      window: { DOMParser },
    },
    getSpec,
    newSpec,
  } = system

  const VALID_TYPES: DOMParserSupportedType[] = [
    'application/xhtml+xml',
    'application/xml',
    'image/svg+xml',
    'text/html',
    'text/xml',
  ]

  const SUPPORTED_TYPES: DOMParserSupportedType[] = [
    'image/svg+xml',
    'text/html',
  ]

  if (!VALID_TYPES.includes(type)) {
    throw new Error(`invalid DOM type`)
  }

  if (!SUPPORTED_TYPES.includes(type)) {
    throw new Error(`DOM type not supported`)
  }

  const parser = new DOMParser()

  const isSvg = type === 'image/svg+xml'

  const dom = parser.parseFromString(text, type)

  const htmlOrSvg = dom.documentElement

  let main = (isSvg ? htmlOrSvg : htmlOrSvg.firstChild) as
    | HTMLElement
    | SVGElement

  if (isSvg) {
    main = htmlOrSvg
  } else {
    const html = dom.documentElement

    let body: HTMLBodyElement

    for (const child of html.childNodes) {
      if (child.nodeName === 'BODY') {
        body = child as HTMLBodyElement

        break
      }
    }

    main = body
  }

  const tree = elementToJson(main)

  const { width, height } = size

  let name = 'untitled'

  const templateSpec = {
    name,
    render: true,
    units: {},
    component: { defaultWidth: width, defaultHeight: height },
  }

  let childCount = 0

  const addChild = (node: Tag, parentId: string | null) => {
    if (node.name === 'script') {
      return
    }

    childCount++

    const nodeSpecId = TAG_TO_SPEC_ID[node.name]

    if (!nodeSpecId) {
      throw new Error(`invalid tag name`)
    }

    const nodeUnitId = newUnitId(specs, templateSpec, nodeSpecId)
    const nodeSpec = getSpec(nodeSpecId)

    const attr = clone(node.attr)

    const parseProp = (prop: string, value: string): any => {
      if (prop === 'style') {
        return cssTextToObj(value)
      }

      return value
    }

    const SURFACE_PROPS = [
      'src',
      'style',
      'd',
      'x',
      'y',
      'width',
      'height',
      'x0',
      'y0',
      'x1',
      'y1',
      'rx',
      'ry',
      'viewBox',
      'href',
      'fill',
      'stop-color',
      'value',
    ]

    const input: Dict<GraphUnitPinSpec> = {}

    for (const name of SURFACE_PROPS) {
      const pinId = snakeToCamel(name)

      if (attr[name] && nodeSpec.inputs?.[pinId]) {
        input[pinId] = {
          constant: true,
          ignored: false,
          data: {
            ref: [],
            data: parseProp(name, attr[name]),
          },
        }
      }

      delete attr[name]
    }

    if (nodeSpec.inputs?.['attr'] && !isEmptyObject(attr)) {
      input.attr = {
        constant: true,
        ignored: false,
        data: { ref: [], data: attr },
      }
    }

    addUnit(
      {
        unitId: nodeUnitId,
        unit: {
          id: nodeSpecId,
          input,
        },
      },
      templateSpec
    )

    setSubComponent(
      { unitId: nodeUnitId, subComponent: {} },
      templateSpec.component
    )

    if (parentId) {
      appendSubComponentChild(
        {
          parentId: parentId,
          childId: nodeUnitId,
          slotName: 'default',
        },
        templateSpec.component
      )
    } else {
      appendRoot({ childId: nodeUnitId }, templateSpec.component)
    }

    for (const child of node.children) {
      addChild(child, nodeUnitId)
    }
  }

  let bundle: UnitBundleSpec

  addChild(tree, null)

  const spec = newSpec(emptySpec(templateSpec))

  if (childCount === 0) {
    const id = TAG_TO_SPEC_ID[tree.name]

    if (!id) {
      throw new Error(`Unrecognized ${type} tag`)
    }

    const unit: GraphUnitSpec = {
      id,
    }

    unit.metadata = {
      component: {
        width,
        height,
      },
    }

    bundle = {
      unit,
    }
  } else if (childCount === 1) {
    const unit = spec.units[getObjSingleKey(spec.units)]

    unit.metadata = {
      component: {
        width,
        height,
      },
    }

    bundle = {
      unit,
    }
  } else {
    bundle = {
      unit: {
        id: spec.id,
        metadata: {
          component: {
            width,
            height,
          },
        },
      },
      specs: {
        [spec.id]: spec,
      },
    }
  }

  return bundle
}
