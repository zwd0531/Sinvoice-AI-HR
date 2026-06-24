'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: '首页', href: '/' },
  { label: 'HR助手', href: '/hr' },
  { label: '候选人复盘', href: '/candidate' },
  { label: '简历筛选', href: '/resume' },
  { label: 'AI面试官', href: '/ai-interview' },
  { label: '政策咨询', href: '/chatbot' },
] as const

export function NavBar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-full max-w-[1440px] mx-auto px-6">
        <Link href="/" className="group flex items-center gap-2.5 text-base font-semibold tracking-wide text-primary">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full rounded-full bg-primary/60 opacity-75 animate-ping" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          思必驰 · 智慧招聘
        </Link>

        <nav className="flex items-center gap-0.5">
          {navLinks.map(({ label, href }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-3 py-1.5 text-sm font-medium transition-all rounded-md',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
