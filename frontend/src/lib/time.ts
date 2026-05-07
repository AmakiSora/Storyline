export function dateStringToUtcMs(date: string) {
  return Date.parse(`${date}T00:00:00Z`)
}

