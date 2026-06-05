import type { Servico } from '../../types'

interface ServiceCardProps {
  isSelected: boolean
  onSelect: (servico: Servico) => void
  servico: Servico
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
})

export function ServiceCard({
  isSelected,
  onSelect,
  servico,
}: ServiceCardProps) {
  return (
    <button
      type="button"
      className={[
        'w-full rounded-md border p-4 text-left shadow-sm transition',
        isSelected
          ? 'border-[#d88ca4] bg-[#d88ca4] text-white shadow-[#3f3437]/15'
          : 'border-[#f3d4dc] bg-white text-[#3f3437] shadow-[#3f3437]/10 hover:border-[#d8a5b5] hover:bg-[#fff7f8]',
      ].join(' ')}
      onClick={() => onSelect(servico)}
      aria-pressed={isSelected}
    >
      <span className="block text-lg font-semibold">{servico.nome}</span>
      <span
        className={[
          'mt-2 block text-sm leading-6',
          isSelected ? 'text-[#fff7f8]' : 'text-[#7b666d]',
        ].join(' ')}
      >
        {servico.descricao}
      </span>
      <span className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
        <span className="rounded border border-current/20 px-2 py-1">
          {currencyFormatter.format(servico.preco)}
        </span>
        <span className="rounded border border-current/20 px-2 py-1">
          {servico.duracaoMinutos} minutos
        </span>
      </span>
    </button>
  )
}
