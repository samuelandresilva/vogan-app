export function AppHeader() {
  return (
    <header className="border-b border-[#f3d4dc] bg-[#faf9f9ff]/95 shadow-lg shadow-[#3f3437]/10">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-5 py-5 sm:py-6">
        <a href="/">
          <img
            src="/logo.png"
            alt="vogann.app"
            className="size-16"
          />
        </a>
        <div className="min-w-0">
          <p className="font-bold text-[#3f3437]">
            <span className="text-[#0F172A] text-4xl font-light">vogan</span>
            <span className="text-[#B78BB7] text-4xl">.</span>
            <span className="text-[#0F172A] font-light">app</span>
          </p>
          <p className="mt-1 text-sm leading-5 text-[#B78BB7]">
            Agende com estilo.
          </p>
        </div>
      </div>
    </header>
  )
}
