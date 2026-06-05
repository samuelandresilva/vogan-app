import type { Profissional } from '../../types'
import { getInitials } from '../../utils/getInitials'
import { hasValidImageUrl } from '../../utils/hasValidImageUrl'

interface ProfessionalCardProps {
  profissional: Profissional
  isSelected: boolean
  onSelect: (profissional: Profissional) => void
}

export function ProfessionalCard({
  profissional,
  isSelected,
  onSelect,
}: ProfessionalCardProps) {
  return (
    <button
      type="button"
      className={[
        'flex w-full items-center gap-4 rounded-md border p-4 text-left shadow-sm transition',
        isSelected
          ? 'border-[#d88ca4] bg-[#d88ca4] text-white shadow-[#3f3437]/15'
          : 'border-[#f3d4dc] bg-white text-[#3f3437] shadow-[#3f3437]/10 hover:border-[#d8a5b5] hover:bg-[#fff7f8]',
      ].join(' ')}
      onClick={() => onSelect(profissional)}
      aria-pressed={isSelected}
    >
      {hasValidImageUrl(profissional.fotoUrl) ? (
        <img
          src={profissional.fotoUrl}
          alt={`Foto de ${profissional.nome}`}
          className="size-16 shrink-0 rounded-md border border-[#f3d4dc] object-cover"
        />
      ) : (
        <span
          className={[
            'grid size-16 shrink-0 place-items-center rounded-md border text-lg font-bold',
            isSelected
              ? 'border-[#f8e7ed] bg-white text-[#c97891]'
              : 'border-[#f3d4dc] bg-[#fff7f8] text-[#c97891]',
          ].join(' ')}
          aria-hidden="true"
        >
          {getInitials(profissional.nome)}
        </span>
      )}

      <span>
        <span className="block text-lg font-semibold">{profissional.nome}</span>
        <span
          className={[
            'mt-1 block text-sm leading-6',
            isSelected ? 'text-[#fff7f8]' : 'text-[#7b666d]',
          ].join(' ')}
        >
          {profissional.descricao}
        </span>
      </span>
    </button>
  )
}
