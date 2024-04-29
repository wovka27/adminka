export default (): string[] =>
  Array.from({ length: 25 }, (_, index) => (index > 12 ? `+${index - 12}` : `${index - 12}`))
