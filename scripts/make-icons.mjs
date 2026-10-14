import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execSync } from 'node:child_process'

const svg = readFileSync('src/assets/Where.svg', 'utf8')
const yellowPath = svg.match(/<path[^>]*fill="#F1C40F"[^>]*\/>/s)[0]
const d = yellowPath.match(/d="([^"]+)"/)[1]

const DARK = '#121212'
const YELLOW = '#F1C40F'

function icon({ size, scale, padding }) {
  const detailH = 52
  const cx = 180.0
  const cy = 26.0
  const s = (size - padding * 2) / detailH * (scale / 1)
  const tx = size / 2 - cx * s
  const ty = size / 2 - cy * s
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${DARK}"/>
  <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})">
    <path d="${d}" fill="${YELLOW}"/>
  </g>
</svg>`
}

// 192/512 "any" icon: detail centered with padding
mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.svg', icon({ size: 192, scale: 1, padding: 28 }))
writeFileSync('public/icons/icon-512.svg', icon({ size: 512, scale: 1, padding: 74 }))
// maskable: keep art within inner 80% safe zone (extra padding)
writeFileSync('public/icons/maskable-512.svg', icon({ size: 512, scale: 1, padding: 150 }))

for (const [svgFile, pngFile, size] of [
  ['public/icons/icon-192.svg', 'public/icons/icon-192.png', 192],
  ['public/icons/icon-512.svg', 'public/icons/icon-512.png', 512],
  ['public/icons/maskable-512.svg', 'public/icons/maskable-512.png', 512],
]) {
  execSync(`convert -background none -resize ${size}x${size} ${svgFile} ${pngFile}`, { stdio: 'inherit' })
}
console.log('icons generated')
