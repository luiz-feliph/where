import type { CategoryAggregate } from '../../../domain/aggregation'

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

function computeSlices(data: CategoryAggregate[], cx: number, cy: number, r: number) {
  const total = data.reduce((sum, d) => sum + d.amount, 0)
  let angle = 0
  return data.map((datum) => {
    const sweep = total === 0 ? 0 : (datum.amount / total) * 360
    const path = arcPath(cx, cy, r, angle, angle + sweep)
    angle += sweep
    return { datum, path }
  })
}

export function PieChart({ data }: { data: CategoryAggregate[] }) {
  const total = data.reduce((sum, d) => sum + d.amount, 0)
  if (total === 0) return null

  const size = 240
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 4
  const slices = computeSlices(data, cx, cy, r)

  return (
    <figure className="pie">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Expenses by category">
        {slices.map(({ datum, path }) => (
          <path key={datum.categoryId} d={path} fill={datum.categoryColor}>
            <title>{`${datum.categoryName}: ${datum.percentage.toFixed(1)}%`}</title>
          </path>
        ))}
      </svg>
      <figcaption className="legend">
        {data.map((d) => (
          <span key={d.categoryId} className="legend-item">
            <span className="swatch" style={{ background: d.categoryColor }} aria-hidden="true" />
            {d.categoryName} — {d.percentage.toFixed(1)}%
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
