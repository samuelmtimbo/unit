// import * as assert from 'assert'
import { Style } from '../system/platform/Props'
import * as assert from '../util/assert'

export type Trait = {
  x: number
  y: number
  width: number
  height: number
  // fontSize: number
}

const REGEX_PERCENT = /^([0-9]+)\%$/
const REGEX_PX = /^([0-9]+)px$/
const REGEX_CALC = /^calc\(([0-9]+)\%[+-]([0-9]+)px\)$/ // TODO

export function reflectChildrenTrait(
  parentWidth: number,
  parentHeight: number,
  parentStyle: Style,
  childrenStyle: Style[]
): Trait[] {
  const {
    display: parentDisplay = 'block',
    flexDirection: parentFlexDirection = 'row',
    justifyContent: parentJustifyContent = 'start',
    alignItems: parentAlignItems = 'start',
  } = parentStyle

  const childrenTrait: Trait[] = []

  let total_relative_percent_width = 0
  let total_relative_percent_height = 0

  let total_relative_px_width = 0
  let total_relative_px_height = 0

  const children_percent_width: number[] = []
  const children_percent_height: number[] = []

  const children_px_width: number[] = []
  const children_px_height: number[] = []

  let i = 0

  let postChildrenStyle: [number, Style][] = []

  for (const childStyle of childrenStyle) {
    let x = 0
    let y = 0

    let width = 0
    let height = 0

    const {
      position: childPosition = 'relative',
      width: childWidth = '100%',
      height: childHeight = '100%',
    } = childStyle

    let percentWidth = 0
    let percentHeight = 0
    let pxWidth = 0
    let pxHeight = 0

    const percentWidthTest = REGEX_PERCENT.exec(childWidth)
    if (percentWidthTest) {
      percentWidth = parseFloat(percentWidthTest[1])
    } else {
      const pxWidthTest = REGEX_PX.exec(childWidth)
      if (pxWidthTest) {
        pxWidth = parseFloat(pxWidthTest[1])
      }
    }

    const percentHeightTest = REGEX_PERCENT.exec(childHeight)
    if (percentHeightTest) {
      percentHeight = parseFloat(percentHeightTest[1])
    } else {
      const pxHeightTest = REGEX_PX.exec(childHeight)
      if (pxHeightTest) {
        pxHeight = parseFloat(pxHeightTest[1])
      }
    }

    children_percent_width.push(percentWidth)
    children_percent_height.push(percentHeight)

    children_px_width.push(pxWidth)
    children_px_height.push(pxHeight)

    if (parentDisplay === 'block') {
      if (childPosition === 'relative') {
        y = (total_relative_percent_height * parentHeight) / 100

        width = (percentWidth * parentWidth) / 100 + pxWidth
        height = (percentHeight * parentHeight) / 100 + pxHeight
      } else if (childPosition === 'absolute') {
        //
      } else {
        //
      }
    } else if (parentDisplay === 'flex') {
      postChildrenStyle.push([i, childStyle])
    }

    total_relative_percent_width += percentWidth
    total_relative_px_width += pxWidth
    total_relative_percent_height += percentHeight
    total_relative_px_height += pxHeight

    const childTrait = {
      x,
      y,
      width,
      height,
    }

    childrenTrait.push(childTrait)

    i++
  }

  let acc_relative_width = 0
  let acc_relative_height = 0

  for (const [i, childStyle] of postChildrenStyle) {
    let x = 0
    let y = 0

    let width = 0
    let height = 0

    const percentWidth = children_percent_width[i]
    const percentHeight = children_percent_height[i]

    const pxWidth = children_px_width[i]
    const pxHeight = children_px_height[i]

    const { position: childPosition = 'relative' } = childStyle

    if (parentDisplay === 'block') {
      //
    } else if (parentDisplay === 'flex') {
      if (parentFlexDirection === 'row') {
        if (childPosition === 'relative') {
          if (total_relative_px_width > width) {
          }

          const pcWidth =
            total_relative_percent_width > 0
              ? (percentWidth / total_relative_percent_width) *
                (parentWidth - total_relative_px_width)
              : 0

          width = pcWidth + pxWidth
          height = parentHeight

          x = acc_relative_width
          y = 0

          acc_relative_width += width
        } else if (childPosition === 'absolute') {
          //
        } else {
          //
        }
      } else if (parentFlexDirection === 'column') {
        if (childPosition === 'relative') {
          width = parentWidth

          const pcHeight =
            total_relative_percent_height > 0
              ? (percentHeight / total_relative_percent_height) *
                (parentHeight - total_relative_px_height)
              : 0

          if (total_relative_px_height > parentHeight) {
            const pxpcHeight =
              (pxHeight / total_relative_px_height) * (parentHeight - 0)

            height = pxpcHeight
          } else {
            height = pcHeight + pxHeight
          }

          x = 0
          y = acc_relative_height

          acc_relative_height += height
        } else if (childPosition === 'absolute') {
          //
        } else {
          //
        }
      }
    }

    const childTrait = {
      x,
      y,
      width,
      height,
    }

    childrenTrait[i] = childTrait
  }

  return childrenTrait
}

assert.deepEqual(reflectChildrenTrait(100, 100, {}, [{}, {}]), [
  { x: 0, y: 0, width: 100, height: 100 },
  { x: 0, y: 100, width: 100, height: 100 },
])

assert.deepEqual(reflectChildrenTrait(100, 100, {}, [{}, {}, {}, {}]), [
  { x: 0, y: 0, width: 100, height: 100 },
  { x: 0, y: 100, width: 100, height: 100 },
  { x: 0, y: 200, width: 100, height: 100 },
  { x: 0, y: 300, width: 100, height: 100 },
])

assert.deepEqual(
  reflectChildrenTrait(100, 100, { display: 'flex' }, [{}, {}]),
  [
    { x: 0, y: 0, width: 50, height: 100 },
    { x: 50, y: 0, width: 50, height: 100 },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(100, 100, { display: 'flex', flexDirection: 'column' }, [
    {},
    {},
  ]),
  [
    { x: 0, y: 0, width: 100, height: 50 },
    { x: 0, y: 50, width: 100, height: 50 },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(100, 100, { display: 'flex', flexDirection: 'column' }, [
    {},
    {},
  ]),
  [
    { x: 0, y: 0, width: 100, height: 50 },
    { x: 0, y: 50, width: 100, height: 50 },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(100, 100, { display: 'flex', flexDirection: 'row' }, [
    {},
    {},
    {},
    {},
  ]),
  [
    { x: 0, y: 0, width: 25, height: 100 },
    { x: 25, y: 0, width: 25, height: 100 },
    { x: 50, y: 0, width: 25, height: 100 },
    { x: 75, y: 0, width: 25, height: 100 },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(100, 100, { display: 'flex', flexDirection: 'column' }, [
    { height: '30px' },
    { height: '30px' },
    {},
    {},
  ]),
  [
    { x: 0, y: 0, width: 100, height: 30 },
    { x: 0, y: 30, width: 100, height: 30 },
    { x: 0, y: 60, width: 100, height: 20 },
    { x: 0, y: 80, width: 100, height: 20 },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(100, 100, { display: 'flex', flexDirection: 'column' }, [
    { height: '30px' },
    { height: '30px' },
  ]),
  [
    { x: 0, y: 0, width: 100, height: 30 },
    { x: 0, y: 30, width: 100, height: 30 },
  ]
)

assert.deepEqual(
  reflectChildrenTrait(100, 100, { display: 'flex', flexDirection: 'column' }, [
    { height: '30px' },
    { height: '30px' },
    { height: '30px' },
    { height: '30px' },
  ]),
  [
    { x: 0, y: 0, width: 100, height: 25 },
    { x: 0, y: 25, width: 100, height: 25 },
    { x: 0, y: 50, width: 100, height: 25 },
    { x: 0, y: 75, width: 100, height: 25 },
  ]
)
