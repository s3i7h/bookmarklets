Promise.resolve(navigator.clipboard.readText()).then(csv => {
    const csvFile = new File([csv], "clipboard.csv", {type: "text/csv"})
    const container = new DataTransfer()
    container.items.add(csvFile)
    document.querySelector("#ofx").files = container.files
})
