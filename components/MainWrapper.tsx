export function MainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 pt-14">
      <div className="max-w-[1440px] mx-auto px-6 py-6">{children}</div>
    </main>
  )
}
