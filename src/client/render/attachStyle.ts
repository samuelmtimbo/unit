import { System } from '../../system'

export const ROOT_STYLE = `
  @font-face {
    font-family: 'Inconsolata';
    src: local('Arial');
    unicode-range: U+60;
  }

  *::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 6px;
    height: 6px;
  }
  *::-webkit-scrollbar-track {
    background-color: #00000000;
  }
  *::-webkit-scrollbar-thumb {
    background-color: currentcolor;
    border-radius: 3px;
  }
  *::-webkit-scrollbar-corner {
    display: none;
  }
  
  * {
    scrollbar-width: thin;
    scrollbar-color: currentcolor #00000000;
  }

  input,
  textarea,
  button,
  select,
  a,
  div {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }

  input::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input::-webkit-color-swatch,
  input::-moz-color-swatch {
    border: none;
  }
  input::-ms-reveal {
    display: none !important;
  }
  input::-webkit-caps-lock-indicator {
    display: none !important;
  }
  input::-webkit-credentials-auto-fill-button {
    display: none !important;
    visibility: hidden;
    pointer-events: none;
    position: absolute;
    right: 0;
  }

  input[type='color'] {
    -webkit-appearance: none;
    border: none;
    width: 32px;
    height: 32px;
  }
  input[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type='color']::-webkit-color-swatch {
    border: none;
  }

  input[type='color']::-webkit-color-swatch {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  audio {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  audio::-webkit-media-controls-enclosure {
    border-radius: 0;
    max-height: none;
  }

  audio::-webkit-media-controls-panel {
    padding: 0;
  }

  audio::-webkit-media-controls-timeline {
    padding-left: 8px;
    padding-right: 0px;
  }

  audio::-webkit-media-controls-current-time-display {
    margin-left: 0;
    font-size: 12px;
  }

  audio::-webkit-media-controls-time-remaining-display,
  audio::-webkit-media-controls-current-time-display {
    font-size: 12px;
  }

  a {
    color: currentcolor;
  }

  * {
    font-family: inherit;
    caret-color: currentcolor;
    outline-color: #00000000;
    outline-style: none;
  }
`

export function attachStyle(system: System): void {
  appendRootStyle(system, ROOT_STYLE)
}

export function appendRootStyle(system: System, css: string): void {
  const {
    root,
    api: {
      document: { createElement },
    },
  } = system

  const style = createElement('style')

  style.innerHTML = css

  root.shadowRoot.appendChild(style)
}

export function removeRootStyle(system: System, css: string): void {
  const { root } = system

  const style = Array.from(root.children).find(
    (child) => child.tagName === 'STYLE' && style.innerHTML === css
  )

  if (!style) {
    throw new Error('style not found')
  }

  root.shadowRoot.removeChild(style)
}
