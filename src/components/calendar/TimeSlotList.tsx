import type { HorarioDisponivel } from '../../types'

interface TimeSlotListProps {
  horarios: HorarioDisponivel[]
  selectedTime: string
  onSelectTime: (horario: string) => void
}

export function TimeSlotList({
  horarios,
  selectedTime,
  onSelectTime,
}: TimeSlotListProps) {
  if (horarios.length === 0) {
    return (
      <p className="rounded-md border border-[#f3d4dc] bg-[#fff7f8] p-4 text-sm text-[#7b666d]">
        Nenhum horário disponível para esta data.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {horarios.map((slot) => {
        const isSelected = slot.horario === selectedTime

        return (
          <button
            key={`${slot.data}-${slot.horario}`}
            type="button"
            className={[
              'min-h-12 rounded-md border px-4 text-sm font-semibold shadow-sm transition',
              isSelected
                ? 'border-[#d88ca4] bg-[#d88ca4] text-white shadow-[#3f3437]/15'
                : 'border-[#f3d4dc] bg-white text-[#3f3437] shadow-[#3f3437]/10 hover:border-[#d8a5b5] hover:bg-[#fff7f8]',
            ].join(' ')}
            aria-pressed={isSelected}
            onClick={() => onSelectTime(slot.horario)}
          >
            {slot.horario}
          </button>
        )
      })}
    </div>
  )
}
