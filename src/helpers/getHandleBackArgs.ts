export default (name: string) => ({
  name,
  ...(history.state.back && {
    query: Object.fromEntries(
      new URLSearchParams(new URL(window.location.origin + history.state.back).search).entries()
    )
  })
})
