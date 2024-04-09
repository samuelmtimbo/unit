export function draw(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  step: any[]
): void {
  const method = step[0]

  const args = step.slice(1, step.length)

  if (method === 'fillStyle') {
    ctx.fillStyle = args[0]
  } else if (method === 'strokeStyle') {
    ctx.strokeStyle = args[0]
  } else if (method === 'fillPath') {
    const [d, fillRule] = args
    ctx.fill(new Path2D(d), fillRule)
  } else if (method === 'strokePath') {
    const [d] = args
    ctx.stroke(new Path2D(d))
  } else {
    ctx[method](...args)
  }
}
