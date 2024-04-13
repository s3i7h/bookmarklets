Promise.resolve(navigator.clipboard.readText()).then((text) => {
  const fragments = text.split("-")
  let foundActive = false
  // eslint-disable-next-line no-restricted-syntax
  for (const node of document.querySelectorAll("input")) {
    if (fragments.length === 0) break
    if (node.type !== "text" && node.type !== "number") continue // eslint-disable-line no-continue
    if (!foundActive && node !== document.activeElement) continue // eslint-disable-line no-continue
    foundActive = true
    node.focus()
    node.value = fragments.shift()
  }
})
