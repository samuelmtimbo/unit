import { Element } from '../../../../../client/element'
import { SPEC_ID_EMPTY } from '../../../../../client/empty'
import { getSpec } from '../../../../../client/spec'
import { applyTheme, COLOR_NONE } from '../../../../../client/theme'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import Div from '../../Div/Component'
import ClassDatum, {
  CLASS_DEFAULT_HEIGHT,
  CLASS_DEFAULT_WIDTH,
} from '../Class/Component'
import Selection from '../Selection/Component'

export interface Props {
  id?: string
  style?: Dict<string>
}

const CASE_WIDTH = 180
const CASE_HEIGHT = (CASE_WIDTH * 3) / 4

export default class Case extends Element<HTMLDivElement, Props> {
  private _showcase: Div

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { specs } = this.$system

    const { id = SPEC_ID_EMPTY, style } = $props

    const { $theme, $color } = this.$context

    const spec_name_path_color = applyTheme($theme, $color, 60)

    const spec = getSpec(specs, id)
    const { name } = spec
    const spec_class = new ClassDatum(
      {
        className: 'explorer-spec-class',
        style: {
          width: `${1.25 * CLASS_DEFAULT_WIDTH}px`,
          height: `${1.25 * CLASS_DEFAULT_HEIGHT}px`,
        },
        id,
      },
      this.$system,
      this.$pod
    )

    const spec_name_comp = new Div(
      {
        style: {
          maxWidth: '105px',
          fontSize: '14px',
          height: '30px',
          textAlign: 'center',
        },
        innerText: name,
      },
      this.$system,
      this.$pod
    )

    const spec_path_comp = new Div(
      {
        style: {
          fontSize: '10px',
          marginTop: '6px',
          height: '6px',
          textAlign: 'center',
          color: spec_name_path_color,
        },
        innerText: '',
      },
      this.$system,
      this.$pod
    )
    const spec_selection = new Selection(
      {
        width: CASE_WIDTH,
        height: CASE_HEIGHT,
        stroke: COLOR_NONE,
      },
      this.$system,
      this.$pod
    )
    const spec_overlay = new Div(
      {
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
        },
      },
      this.$system,
      this.$pod
    )
    const showcase = new Div(
      {
        className: 'explorer-spec',
        style: {
          width: `${CASE_WIDTH}px`,
          height: `${CASE_HEIGHT}px`,
          color: 'white',
          position: 'relative',
          border: '1px solid',
          borderColor: COLOR_NONE,
          // borderColor: WHITE,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '9px',
          cursor: 'pointer',
          flexDirection: 'column',
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    showcase.setChildren([
      spec_selection,
      spec_class,
      spec_name_comp,
      spec_path_comp,
      spec_overlay,
    ])

    this._showcase = showcase

    this.$element = showcase.$element
    this.$slot['default'] = showcase.$slot['default']

    this.registerRoot(showcase)
  }

  onPropChanged(prop: string, current: any): void {}
}
