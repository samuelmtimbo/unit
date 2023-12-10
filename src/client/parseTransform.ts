export function parseTransform(
  transform: string,
  width: number,
  height: number
): [number, number, number, number, number, number, number] {
  let _transform_x = 0
  let _transform_y = 0

  let _scale_x = 1
  let _scale_y = 1

  let _rotate_x = 0
  let _rotate_y = 0
  let _rotate_z = 0

  if (transform !== 'none') {
    const regex = /(\w+)\(([^)]*)\)/g
    let match
    while ((match = regex.exec(transform)) !== null) {
      const f_str = match[1] as string
      const f_args_str = match[2] as string

      const _f_args_str = f_args_str.replace(' ', '')
      const f_args_str_list = _f_args_str.split(',')

      const f_args_list = f_args_str_list.map((s) => {
        // TODO account for font-size units (em, ch, etc.)
        const _match = /([+-]?[0-9]+([.][0-9]+)?)(px|deg|%)?/.exec(s)

        const num_str = _match[1]
        const unit_str = _match[3]

        let num: number = Number.parseFloat(num_str)

        return [num, unit_str]
      }) as [number, string][]

      switch (f_str) {
        case 'translate':
          {
            const [xt, yt = xt] = f_args_list
            let [x, xu] = xt
            if (xu === '%') {
              x = (x * width) / 100
            }
            let [y, yu] = yt
            if (yu === '%') {
              y = (y * height) / 100
            }
            _transform_x += x
            _transform_y += y
          }
          break
        case 'translateX':
          {
            const [xt] = f_args_list
            let [x, xu] = xt
            if (xu === '%') {
              x = (x * width) / 100
            }
            _transform_x += x
          }
          break
        case 'translateY':
          {
            const [yt] = f_args_list
            let [y, yu] = yt
            if (yu === '%') {
              y = (y * height) / 100
            }
            _transform_y += y
          }
          break
        case 'scale':
          {
            const [xt, yt = xt] = f_args_list
            const [x] = xt
            const [y] = yt
            _scale_x *= x
            _scale_y *= y
          }
          break
        case 'scaleX':
          {
            const [xt] = f_args_list
            const [x] = xt
            _scale_x *= x
          }
          break
        case 'scaleY':
          {
            const [yt] = f_args_list
            const [y] = yt
            _scale_y *= y
          }
          break
        case 'rotate':
          {
            const [degt] = f_args_list
            const [deg] = degt
            _rotate_z += deg
          }
          break
        case 'rotateX':
          {
            const [degt] = f_args_list
            const [deg] = degt
            _rotate_x += deg
          }
          break
        case 'rotateY':
          {
            const [degt] = f_args_list
            const [deg] = degt
            _rotate_y += deg
          }
          break
        case 'rotateZ':
          {
            const [degt] = f_args_list
            const [deg] = degt
            _rotate_z += deg
          }
          break
        default:
          break
      }
    }
  }

  return [
    _transform_x,
    _transform_y,
    _scale_x,
    _scale_y,
    _rotate_x,
    _rotate_y,
    _rotate_z,
  ]
}
