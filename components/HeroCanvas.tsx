'use client'

import { useEffect, useRef } from 'react'

interface GridNode {
  baseX: number
  baseY: number
  x: number
  y: number
  vx: number
  vy: number
}

const SPACING = 70
const INFLUENCE = 130
const MAX_PUSH = 22
const SPRING = 0.08
const DAMP = 0.72

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let mx = -9999
    let my = -9999
    let nodes: GridNode[] = []
    let cols = 0

    const init = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      cols = Math.ceil(canvas.width / SPACING) + 2
      const rows = Math.ceil(canvas.height / SPACING) + 2
      nodes = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * SPACING - SPACING * 0.5
          const by = r * SPACING - SPACING * 0.5
          nodes.push({ baseX: bx, baseY: by, x: bx, y: by, vx: 0, vy: 0 })
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const n of nodes) {
        const dx = mx - n.baseX
        const dy = my - n.baseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        let tx = n.baseX
        let ty = n.baseY
        if (dist > 0 && dist < INFLUENCE) {
          const s = (1 - dist / INFLUENCE) * MAX_PUSH
          tx = n.baseX + (dx / dist) * s
          ty = n.baseY + (dy / dist) * s
        }
        n.vx += (tx - n.x) * SPRING
        n.vy += (ty - n.y) * SPRING
        n.vx *= DAMP
        n.vy *= DAMP
        n.x += n.vx
        n.y += n.vy
      }

      // 网格连线
      ctx.strokeStyle = 'rgba(34,211,238,0.1)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const right = nodes[i + 1]
        const bottom = nodes[i + cols]
        if (right && (i + 1) % cols !== 0) {
          ctx.beginPath()
          ctx.moveTo(n.x, n.y)
          ctx.lineTo(right.x, right.y)
          ctx.stroke()
        }
        if (bottom) {
          ctx.beginPath()
          ctx.moveTo(n.x, n.y)
          ctx.lineTo(bottom.x, bottom.y)
          ctx.stroke()
        }
      }

      // 节点圆点
      ctx.fillStyle = 'rgba(34,211,238,0.32)'
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    window.addEventListener('mousemove', onMouseMove)
    init()
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
