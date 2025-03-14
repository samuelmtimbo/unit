import { System } from '../../system'
import { FONT_DATA_URI } from '../static/font/dataURI'

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
  input::-webkit-credentials-auto-fill-button {
    position: absolute;
    top: 6px;
    right: 4px;
  }
  input[autocomplete="off"]::-webkit-credentials-auto-fill-button {
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
    interpolate-size: allow-keywords;
  }
`

export const HTML_STYLE = `
  @font-face {
    font-family: 'Inconsolata';
    /* 
    src: local('Inconsolata Regular'),
      url('fonts/Inconsolata-Regular.woff2') format('woff2'),
      url('fonts/Inconsolata-Regular.woff') format('woff');
    */
    src: url('${FONT_DATA_URI}');
    font-style: normal;
    font-weight: 400;
    font-stretch: 100%;
    font-display: fallback;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
      U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
      U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Inconsolata';
    src: local('Arial');
    unicode-range: U+60;
  }
  
  * {
    font-family: Inconsolata;
  }

  body {
    font-family: Inconsolata;
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    box-sizing: border-box;
    background: transparent;
    // touch-action: none;
    overflow: hidden;
    -ms-text-size-adjust: none;
    -webkit-text-size-adjust: none;
    overscroll-behavior: none;
    -webkit-touch-callout: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-overflow-scrolling: touch;
  }
`

export function attachStyle(system: System): void {
  const {
    root,
    color,
    api: {
      document: { createElement },
    },
  } = system

  const style = createElement('style')

  style.innerHTML = ROOT_STYLE

  style.innerHTML += `

  __SYSTEM__APP__ {
    color: ${color};
  }`

  root.shadowRoot.appendChild(style)
}
