'use client'

import { usePathname } from 'next/navigation'

export function DemoBanner() {
  const pathname = usePathname()
  if (pathname !== '/') return null
  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-amber-400 text-amber-900 text-xs font-medium text-center py-1.5 px-4">
      当前为 Demo 演示模式，所有数据均为模拟数据，不代表真实业务
    </div>
  )
}
