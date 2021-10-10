export function renderCross(): HTMLDivElement {
  const cross = document.createElement('div')
  cross.style.position = 'absolute'
  cross.style.left = '0'
  cross.style.top = '0'

  const vertical = document.createElement('div')
  vertical.style.position = 'absolute'
  vertical.style.top = '0'
  vertical.style.left = '50%'
  vertical.style.transform = 'translateX(-50%)'
  vertical.style.width = '1px'
  vertical.style.height = '100%'
  vertical.style.backgroundColor = 'currentColor'
  vertical.style.pointerEvents = 'none'

  cross.appendChild(vertical)

  const horizontal = document.createElement('div')
  horizontal.style.position = 'absolute'
  horizontal.style.top = '50%'
  horizontal.style.left = '0'
  horizontal.style.transform = 'translateY(-50%)'
  horizontal.style.backgroundColor = 'currentColor'
  horizontal.style.width = '100%'
  horizontal.style.height = '1px'
  horizontal.style.pointerEvents = 'none'

  cross.appendChild(horizontal)

  return cross
}
