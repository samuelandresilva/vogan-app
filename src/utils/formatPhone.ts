export function formatBrazilianPhone(value: string): string {
    const digits = value.replace(/\D/g, "")

    if (digits.length === 13 && digits.startsWith("55")) {
        const ddd = digits.slice(2, 4)
        const firstPart = digits.slice(4, 9)
        const secondPart = digits.slice(9, 13)

        return `(${ddd}) ${firstPart}-${secondPart}`
    }

    if (digits.length === 12 && digits.startsWith("55")) {
        const ddd = digits.slice(2, 4)
        const firstPart = digits.slice(4, 8)
        const secondPart = digits.slice(8, 12)

        return `(${ddd}) ${firstPart}-${secondPart}`
    }

    if (digits.length === 11) {
        const ddd = digits.slice(0, 2)
        const firstPart = digits.slice(2, 7)
        const secondPart = digits.slice(7, 11)

        return `(${ddd}) ${firstPart}-${secondPart}`
    }

    if (digits.length === 10) {
        const ddd = digits.slice(0, 2)
        const firstPart = digits.slice(2, 6)
        const secondPart = digits.slice(6, 10)

        return `(${ddd}) ${firstPart}-${secondPart}`
    }

    return value
}