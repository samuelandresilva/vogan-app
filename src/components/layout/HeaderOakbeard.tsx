export function HeaderOakbeard() {
  return (
    <header className="border-b border-[#f3d4dc] bg-[#fff7f8]/95 shadow-lg shadow-[#3f3437]/10">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-5 py-5 sm:py-6">
        <a href="/">
          <img
            src="/logo-oak.png"
            alt="Oakbeard.app"
            className="size-16 shrink-0 rounded-md bg-white object-contain shadow-sm shadow-[#3f3437]/10"
          />
        </a>
        <div className="min-w-0">
          <p className="text-xl font-bold text-[#3f3437]">Oakbeard.app</p>
          <p className="mt-1 text-sm leading-5 text-[#7b666d]">
            Seu horário de beleza, sem complicação.
          </p>
        </div>
      </div>
    </header>
  )
}
