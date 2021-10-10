export function addGlobalBlurListener($element, listener) {
  $element.addEventListener(
    'blur',
    function (event: FocusEvent) {
      const { relatedTarget } = event

      if (!relatedTarget) {
        listener()
      }
    },
    true
  )
}
