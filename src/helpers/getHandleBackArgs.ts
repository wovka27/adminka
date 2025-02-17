export default (name: string, back = history.state.back) => ({
  name,
  ...(back && { query: Object.fromEntries(new URL(window.location.origin + back).searchParams.entries()) })
})
