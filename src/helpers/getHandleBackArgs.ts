export default (name: string) => {
  if (!history.state.back) return { name }

  const urlQuery = new URL(window.location.origin + history.state.back).search
  const query = Object.fromEntries(new URLSearchParams(urlQuery).entries())

  return { name, query }
}
