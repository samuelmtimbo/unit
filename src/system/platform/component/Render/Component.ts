import { Component } from '../../../../client/component'
import { componentFromUnitSpec } from '../../../../client/componentFromUnitSpec'
import { Element } from '../../../../client/element'
import { parentElement } from '../../../../client/platform/web/parentElement'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { $Component } from '../../../../types/interface/async/$Component'
import { UCGEE } from '../../../../types/interface/UCGEE'
import { UnitBundleSpec } from '../../../../types/UnitBundleSpec'
import { Unlisten } from '../../../../types/Unlisten'
import { weakMerge } from '../../../../weakMerge'

export interface Props {
  component?: $Component
  style?: Dict<string>
  attr?: Dict<string>
}

export default class Render extends Element<HTMLDivElement, Props> {
  private _unlisten: Unlisten
  private _component: Component

  public $input = {
    component: UCGEE,
  }

  constructor($props: Props, $system: System) {
    const $element = parentElement($system)

    super($props, $system, $element)

    this.$unbundled = false
    this.$primitive = true
  }

  public focus() {
    if (this._component) {
      this._component.focus()

      return
    }

    const child = this.$element.childNodes.item(0) as HTMLElement

    if (child) {
      child.focus()
    }
  }

  onPropChanged(prop: any, current: any, prev: any) {
    void {
      component: ($component: $Component) => {
        if (this._unlisten) {
          this._unlisten()

          this._unlisten = undefined
        }

        if ($component) {
          $component.$getUnitBundleSpec({}, (bundle: UnitBundleSpec) => {
            const { unit } = bundle

            const specs = weakMerge(this.$system.specs, bundle.specs ?? {})

            const component = componentFromUnitSpec(this.$system, specs, unit)

            component.connect($component as $Component)

            this.setSubComponents({
              component,
            })

            this.registerRoot(component)

            this._component = component

            this.$slot['default'] = component
          })

          this._unlisten = () => {
            if (this._component) {
              this.unregisterRoot(this._component)

              this.setSubComponents({})

              this._component = undefined

              this.$slot['default'] = this
            }
          }
        }
      },
    }[prop](current, prev)
  }
}
