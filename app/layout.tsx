import type { Metadata } from 'next'
import './globals.css'
import { NavBar } from '@/components/NavBar'
import { DemoBanner } from '@/components/DemoBanner'
import { MainWrapper } from '@/components/MainWrapper'

export const metadata: Metadata = {
  title: '思必驰智慧招聘系统',
  description: '思必驰 AI 驱动的智慧招聘 Demo 系统',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NavBar />
        <DemoBanner />

        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  )
}
