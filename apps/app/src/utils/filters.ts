export const formatCurrency = (value: number, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value)
}

export const formatDate = (iso: string | null, fallback = 'Unknown') => {
  if (!iso) {
    return fallback
  }

  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const filters = {
  formatCurrency,
  formatDate
}
