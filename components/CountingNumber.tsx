'use client'

import { useEffect, useRef, useState } from 'react'

// 解析 "98.5%"  → { prefix:'', num:98.5, suffix:'%', dec:1 }
// 解析 "5x"     → { prefix:'', num:5,    suffix:'x', dec:0 }
// 解析 "<300ms" → { prefix:'<', num:300,  suffix:'ms',dec:0 }
function parse(str: string) {
  const m = str.match(/^([<>~]?)(\d+(?:\.\d+)?)(.*)$/)
  if (!m) return { prefix: '', num: 0, suffix: '', dec: 0 }
  const dec = m[2].includes('.') ? m[2].split('.')[1].length : 0
  return { prefix: m[1], num: parseFloat(m[2]), suffix: m[3], dec }
}

interface Props {
  value: string
  duration?: number
  className?: string
}

export function CountingNumber({ value, duration = 2000, className }: Props) {
  const { prefix, num, suffix, dec } = parse(value)
  const [cur, setCur] = useState(dec > 0 ? (0).toFixed(dec) : '0')
  const spanRef = useRef<HTMLSpanElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return

    const ob = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return
        fired.current = true

        const t0 = performance.now()
        const frame = (now: number) => {
          const progress = Math.min((now - t0) / duration, 1)
          // easeOutCubic
          const eased = 1 - Math.pow(1 - progress, 3)
          const v = eased * num
          setCur(dec > 0 ? v.toFixed(dec) : Math.round(v).toString())
          if (progress < 1) requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
      },
      { threshold: 0.5 }
    )

    ob.observe(el)
    return () => ob.disconnect()
  }, [num, dec, duration])

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {cur}
      {suffix}
    </span>
  )
}
