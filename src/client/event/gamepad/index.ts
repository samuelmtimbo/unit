import { EventEmitter2 } from 'eventemitter2'

const DEFAULT_TRESHOLD = 0.2

const keysReverse = {
  buttons: {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    LT: 6,
    RT: 7,
    Back: 8,
    Start: 9,
    LS: 10,
    RS: 11,
    DPadUp: 12,
    DPadDown: 13,
    DPadLeft: 14,
    DPadRight: 15,
  },
}

const keys = {
  buttons: [
    'A',
    'B',
    'X',
    'Y',
    'LB',
    'RB',
    'LT',
    'RT',
    'Back',
    'Start',
    'LS',
    'RS',
    'DPadUp',
    'DPadDown',
    'DPadLeft',
    'DPadRight',
  ],
  axes: ['LeftStickX', '-LeftStickY', 'RightStickX', '-RightStickY'],
  buttonAxis: [
    null,
    null,
    null,
    null,
    null,
    null,
    'LeftTrigger',
    'RightTrigger',
  ],
}

export class Gamepads extends EventEmitter2 {
  // there can only be four gamepads connected at a time
  private _gamepads: GamepadInput[] = [
    new GamepadInput(0),
    new GamepadInput(1),
    new GamepadInput(2),
    new GamepadInput(3),
  ]

  constructor() {
    super()

    window.addEventListener('gamepadconnected', this._onGamepadConnected)
    window.addEventListener('gamepaddisconnected', this._onGamepadDisconnected)
  }

  private _onGamepadConnected = (event: GamepadEvent) => {
    console.log('device connected', event.gamepad)
    const index = event.gamepad.index
    this._gamepads[index].connect()
  }

  public getGamepads(): GamepadInput[] {
    return this._gamepads
  }

  public getGamepad(index: number): GamepadInput {
    return this._gamepads[index]
  }

  private _onGamepadDisconnected = (event: GamepadEvent) => {
    const index = event.gamepad.index
    this._gamepads[index].disconnect()
  }
}

// every connected gamepad has it's own animation frame

export class GamepadInput extends EventEmitter2 {
  private _frame: number | null = null
  private _currentButtonsPressed: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]
  private _currentAxes: number[] = [0, 0, 0, 0]

  constructor(public index: number) {
    super()
  }

  public getGamepad = (): Gamepad | null => {
    return window.navigator.getGamepads()[this.index]
  }

  private _step = (): void => {
    const gamepad = this.getGamepad()
    if (gamepad) {
      const prevButtonsPressed = this._currentButtonsPressed
      const buttonsPressed = gamepad.buttons.map((b) => b.pressed)
      this._currentButtonsPressed = buttonsPressed
      for (let index in buttonsPressed) {
        const key = keys.buttons[index]
        if (buttonsPressed[index] && !prevButtonsPressed[index]) {
          this.emit('buttondown', key)
        } else if (!buttonsPressed[index] && prevButtonsPressed[index]) {
          this.emit('buttonup', key)
        }
      }

      const prevAxes = this._currentAxes
      const axes = gamepad.axes
      // @ts-ignore
      this._currentAxes = axes
      for (let index in axes) {
        const key = keys.axes[index]
        if (Math.abs(axes[index] - prevAxes[index]) >= DEFAULT_TRESHOLD) {
          this.emit('axischange', key, axes[index])
        }
      }

      window.requestAnimationFrame(this._step)
    }
  }

  public connect(): void {
    this._frame = window.requestAnimationFrame(this._step)
  }

  public disconnect(): void {
    this._frame && window.cancelAnimationFrame(this._frame)
  }

  public getPressed(): boolean[] {
    return this._currentButtonsPressed
  }

  public getAxes(): number[] {
    return this._currentAxes
  }

  public isButtonPressed = (key: string) => {
    const index = keysReverse.buttons[key]
    return this._currentButtonsPressed[index]
  }
}
