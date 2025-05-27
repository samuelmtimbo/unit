import { Size } from 'electron'
import { snakeToCamel } from '../../client/id'
import { cssTextToObj } from '../../client/rawExtractStyle'
import { fromUnitBundle } from '../../spec/fromUnitBundle'
import {
  appendRoot,
  appendSubComponentChild,
  setSubComponent,
} from '../../spec/reducers/component'
import { addUnit } from '../../spec/reducers/spec'
import { emptySpec, newUnitId } from '../../spec/util'
import { System } from '../../system'
import { ID_DIV, ID_SVG } from '../../system/_ids'
import { UnitBundle } from '../../types/UnitBundle'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { clone } from '../clone'
import { elementToJson, Tag } from '../element'
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

  const parser = new DOMParser()

  const isSvg = type === 'image/svg+xml'

  const dom = parser.parseFromString(text, type)

  const element = dom.documentElement

  const tree = elementToJson(element)

  const { width, height } = size

  let name = 'untitled'

  const template_spec = {
    name,
    render: true,
    units: {},
    component: { defaultWidth: width, defaultHeight: height },
  }

  const addChild = (node: Tag, parent_id: string | null) => {
    const fallbackSpecId = isSvg ? ID_SVG : ID_DIV

    const node_spec_id = TAG_TO_SPEC_ID[node.tag] ?? fallbackSpecId
    const node_unit_id = newUnitId(specs, template_spec, node_spec_id)
    const node_spec = getSpec(node_spec_id)

    const attr = clone(node.attr)

    const parseProp = (prop: string, value: string): any => {
      if (prop === 'style') {
        return cssTextToObj(value)
      }

      return value
    }

    const SURFACE_PROPS = [
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
    ]

    const input = {
      attr: {
        constant: true,
        ignored: false,
        data: { ref: [], data: attr },
      },
    }

    for (const name of SURFACE_PROPS) {
      const pinId = snakeToCamel(name)

      if (attr[name] && node_spec.inputs?.[pinId]) {
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

    addUnit(
      {
        unitId: node_unit_id,
        unit: {
          id: node_spec_id,
          input,
        },
      },
      template_spec
    )

    setSubComponent(
      { unitId: node_unit_id, subComponent: {} },
      template_spec.component
    )

    if (parent_id) {
      appendSubComponentChild(
        {
          parentId: parent_id,
          childId: node_unit_id,
          slotName: 'default',
        },
        template_spec.component
      )
    } else {
      appendRoot({ childId: node_unit_id }, template_spec.component)
    }

    for (const child of node.children) {
      addChild(child, node_unit_id)
    }
  }

  addChild(tree, null)

  const new_spec = newSpec(emptySpec(template_spec))

  const bundle: UnitBundleSpec = {
    unit: {
      id: new_spec.id,
      metadata: {
        component: {
          width,
          height,
        },
      },
    },
    specs: {
      [new_spec.id]: new_spec,
    },
  }

  return bundle
}
