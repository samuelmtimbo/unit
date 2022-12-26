export function isFrameRelativeValue(value: string) {
  return value.endsWith('vw') || value.endsWith('vh')
}
