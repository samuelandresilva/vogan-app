export function onlyDigits(value: string): string {
    return value.replace(/\D/g, "")
}

export function createPhoneHref(phone: string): string {
    const digits = onlyDigits(phone)

    // Para ligação nativa do celular, remove o 55 se existir.
    if (digits.length === 13 && digits.startsWith("55")) {
        return `tel:+${digits}`
    }

    return `tel:${digits}`
}

export function createWhatsAppHref(phone: string): string {
    const digits = onlyDigits(phone)
    return `https://wa.me/${digits}`
}

export function createGoogleMapsHref(address: string): string {
    const encodedAddress = encodeURIComponent(address.trim())
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
}

export function createInstagramHref(instagram: string): string {
    const normalizedInstagram = instagram.trim()

    if (normalizedInstagram.startsWith("http://") || normalizedInstagram.startsWith("https://")) {
        return normalizedInstagram
    }

    const username = normalizedInstagram.replace("@", "")
    return `https://www.instagram.com/${username}`
}