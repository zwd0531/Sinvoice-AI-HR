'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Tone = 'cyan' | 'emerald' | 'amber' | 'red' | 'violet' | 'blue'

const toneClasses: Record<Tone, string> = {
  cyan: 'border-cyan-400/25 bg-cyan-400/[0.06] text-cyan-200',
  emerald: 'border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-200',
  amber: 'border-amber-400/25 bg-amber-400/[0.06] text-amber-200',
  red: 'border-red-400/25 bg-red-400/[0.06] text-red-200',
  violet: 'border-violet-400/25 bg-violet-400/[0.06] text-violet-200',
  blue: 'border-blue-400/25 bg-blue-400/[0.06] text-blue-200',
}

export function DemoBackdrop({ density = 'normal' }: { density?: 'normal' | 'dense' }) {
  const lines = density === 'dense' ? 16 : 10

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: density === 'dense' ? '36px 36px' : '52px 52px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 12% 18%, rgba(34,211,238,0.18), transparent 28%),' +
            'radial-gradient(circle at 82% 16%, rgba(139,92,246,0.14), transparent 25%),' +
            'radial-gradient(circle at 78% 76%, rgba(52,211,153,0.10), transparent 24%),' +
            'linear-gradient(180deg, rgba(10,15,30,0.28), rgba(10,15,30,0.92))',
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-28"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(34,211,238,0.07), transparent)',
        }}
        animate={{ y: ['-20%', '850%'] }}
        transition={{ repeat: Infinity, duration: 7.5, ease: 'linear' }}
      />
      {Array.from({ length: lines }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-px bg-cyan-300/20"
          style={{
            left: `${(i * 19) % 92}%`,
            top: `${8 + ((i * 23) % 84)}%`,
            width: `${72 + ((i * 31) % 150)}px`,
          }}
          animate={{ opacity: [0.08, 0.55, 0.08], x: [0, 28, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3.2 + i * 0.16,
            delay: i * 0.12,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export function DemoPanel({
  children,
  className,
  tone = 'cyan',
}: {
  children: React.ReactNode
  className?: string
  tone?: Tone
}) {
  return (
    <div
      className={cn(
        'group/panel relative overflow-hidden rounded-xl border bg-white/[0.035] backdrop-blur-md transition-all duration-300 hover:bg-white/[0.06] hover:shadow-[0_8px_28px_rgba(34,211,238,0.08)]',
        toneClasses[tone],
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/panel:opacity-100" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(34,211,238,0.08), transparent 60%)' }} />
      {children}
    </div>
  )
}

export function MetricTile({
  label,
  value,
  sub,
  tone = 'cyan',
}: {
  label: string
  value: string
  sub?: string
  tone?: Tone
}) {
  return (
    <DemoPanel tone={tone} className="px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-white">{value}</p>
      {sub && <p className="mt-0.5 truncate text-[10px] text-white/45">{sub}</p>}
    </DemoPanel>
  )
}

export function StatusPill({
  label,
  value,
  tone = 'cyan',
}: {
  label: string
  value: string
  tone?: Tone
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px]', toneClasses[tone])}>
      <span className="size-1.5 rounded-full bg-current" />
      <span className="text-white/45">{label}</span>
      <span className="font-medium text-white/85">{value}</span>
    </span>
  )
}
