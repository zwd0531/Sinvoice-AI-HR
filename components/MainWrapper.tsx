'use client'

import { usePathname } from 'next/navigation'

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  return (
    <main className={`flex-1 ${isHome ? 'pt-[calc(3.5rem+30px)]' : 'pt-14'}`}>
      <div className="max-w-[1440px] mx-auto px-6 py-6">{children}</div>
    </main>
  )
}
