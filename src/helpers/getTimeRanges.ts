export default (interval: number = 5, language: Intl.LocalesArgument = window.navigator.language): string[] => {
  const ranges: string[] = []
  const format: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric'
  }

  const date: Date = new Date()
  date.setHours(0)

  for (let minutes = 0; minutes <= 23 * 60; minutes += interval) {
    date.setMinutes(minutes)
    ranges.push(date.toLocaleTimeString(language, format))
  }

  return ranges
}
