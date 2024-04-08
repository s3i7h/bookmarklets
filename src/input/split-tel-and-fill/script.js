Promise.resolve(navigator.clipboard.readText()).then(text => {
    let fragments = text.split("-")
    let foundActive = false
    for (node of document.querySelectorAll("input")) {
        if (fragments.length === 0) break
        if (node.type !== "text" && node.type !== "number") continue
        if (!foundActive && node !== document.activeElement) continue
        foundActive = true
        node.focus()
        node.value = fragments.shift()
    }
})
