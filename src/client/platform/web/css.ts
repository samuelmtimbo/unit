export const GLOBAL_CSS = `
*::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 1px;
  height: 1px;
}
*::-webkit-scrollbar-track {
  background-color: #00000000;
}
*::-webkit-scrollbar-thumb {
  opacity: 0.5;
  background-color: currentColor;
}
*::-webkit-scrollbar-corner {
  display: none;
}
* {
  scrollbar-width: thin;
  scrollbar-color: currentColor #00000000;
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
  font-family: 'Inconsolata', monospace;
  caret-color: currentcolor;
  outline-color: #00000000;
  outline-style: none;
  /* outline: 1px solid #ffcc00; */
}

body {
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-size: 14px;
  box-sizing: border-box;
  background: transparent;
  /* touch-action: none; */
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  overscroll-behavior: none;
  -webkit-touch-callout: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-overflow-scrolling: touch;
}`