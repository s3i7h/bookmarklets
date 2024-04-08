Promise.resolve(navigator.clipboard.readText()).then(json => {
    const data = JSON.parse(json)
    const text = data.flatMap(daily => [
        `${daily.date}\tチャージ\t${daily.total}\t`,
        ...daily.purchases.map(purchase => `${daily.date}\t${purchase.label}\t\t${purchase.amount}`)
    ]).join("\n")
    navigator.clipboard.writeText(text)
})
