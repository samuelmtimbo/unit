export default function classnames(...args: any[]): string {
  const classes: string[] = []

  for (const arg of args) {
    if (!arg) {
      continue
    }

    const argType = typeof arg

    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classnames(arg)

        if (inner) {
          classes.push(inner)
        }
      }
    } else if (argType === 'object') {
      for (const key in arg) {
        if (arg.hasOwnProperty(key) && arg[key]) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}
