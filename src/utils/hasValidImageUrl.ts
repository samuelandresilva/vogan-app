export function hasValidImageUrl(value: string | null | undefined): boolean {
    if (!value) return false

    const normalizedValue = value.trim()
    if (!normalizedValue) return false

    const invalidValues = ["null", "undefined", "-"]
    if (invalidValues.includes(normalizedValue.toLowerCase())) return false

    return (
        normalizedValue.startsWith("http://") ||
        normalizedValue.startsWith("https://") ||
        normalizedValue.startsWith("data:image/")
    )
}