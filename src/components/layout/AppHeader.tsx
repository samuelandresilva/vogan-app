export function AppHeader() {
  return (
    <header className="border-b border-[#f3d4dc] bg-[#faf9f9ff]/95 shadow-lg shadow-[#3f3437]/10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:py-6">
        <a href="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/logo.png"
            alt="vogan.app"
            className="size-12 shrink-0"
          />

          <div className="min-w-0">
            <p className="font-bold text-[#3f3437]">
              <span className="text-xl font-light text-[#0F172A]">vogan</span>
              <span className="text-xl text-[#B78BB7]">.</span>
              <span className="text-xs font-light text-[#0F172A]">app</span>
            </p>

            <p className="mt-1 text-xs leading-5 text-[#B78BB7]">
              Agende com estilo.
            </p>
          </div>
        </a>

        <div className="hidden flex-col items-center justify-center gap-1 sm:flex">
          <span className="block text-[11px] leading-none text-[#8f6f7f]">
            Divulgue seu espaço
          </span>

          <a
            href="/contrate"
            className="inline-flex h-8 items-center justify-center rounded-full border border-[#B78BB7]/60 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B78BB7] transition hover:border-[#B78BB7] hover:bg-[#B78BB7] hover:text-white"
          >
            Usar Vogan
          </a>
        </div>
      </div>
    </header>
  )
}