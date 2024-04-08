(() => {
    const convertPriceToNumber = (price) => price == "無料" ? 0 : parseInt(price.match(/\d/g).join(""))
    const strip = (s) => s.replace(/^\s+/, "").replace(/\s$/, "")
    const dateTextElementGetter = (node) => node
	      .querySelector("[data-auto-test-id='RAP2.PurchaseList.PurchaseHeader.Display.Date']")
    const getDailyPurchases = () => Array.from(document.querySelectorAll(".purchase.loaded.collapsed"))
	  .filter(dateTextElementGetter)
    const getDailyPurchaseDate = (node) => {
        const dateText = dateTextElementGetter(node).innerText
        const dateArray = dateText.match(/\d+/g).map((v, i) => parseInt(v) - i%2)
        return new Date(
            new Date(...dateArray).valueOf() - new Date().getTimezoneOffset() * 60 * 1000
        ).toISOString().substring(0, 10)
    }
    const getDailyPurchaseTotalAmount = (node) => convertPriceToNumber(
        node.querySelector("[data-auto-test-id='RAP2.PurchaseList.Display.Invoice.Amount']").innerText
    )

    const getIndividualPurchases = (node) => Array.from(node.querySelectorAll(".pli")).map(constructPurchaseData)

    const getPurchaseLabel = (node) => {
        let title = node.querySelector(".pli-title").innerText
        title = strip(title)
        let publisher = node.querySelector(".pli-publisher").innerText
        publisher = strip(publisher)
        return `${title}/${publisher}`
    }

    const getPurchaseAmount = (node) => convertPriceToNumber(node.querySelector(".pli-price").innerText)

    const constructDailyPurchaseData = (node) => ({
        "date": getDailyPurchaseDate(node),
        "total": getDailyPurchaseTotalAmount(node),
        "purchases": getIndividualPurchases(node),
    })

    const constructPurchaseData = (node) => ({
        "label": getPurchaseLabel(node),
        "amount": getPurchaseAmount(node),
    }) 

    const displayModal = (modifier) => {
        const modal = document.createElement("div")
        const wrapper = document.createElement("div")
        const content = document.createElement("div")
        const footer = document.createElement("div")
        const closeButton = document.createElement("button")

        modal.style = `
display: flex;
position: fixed;
height: 80%;
width: 80%;
max-height: 500px;
max-width: 480px;
inset: 0;
margin: auto;
padding: 20px;
background: white;
box-shadow: 0px 10px 30px rgba(0,0,0,0.3);
border-radius: 20px;
z-index: 9999;
opacity: 0;
transition: opacity 0.3s
`
        wrapper.style = `
display: flex;
flex-direction: column;
gap: 20px;
width: 100%;
`
        content.style = `
flex-grow: 1;
`
        footer.style = `
display: flex;
justify-content: flex-end;
`
        closeButton.innerText = "閉じる"
        closeButton.onclick = () => {
            modal.style.opacity = 0
            setTimeout(() => {document.body.removeChild(modal)}, 300)
        }
        if (modifier) modifier(content)
        wrapper.appendChild(content)
        footer.appendChild(closeButton)
        wrapper.appendChild(footer)
        modal.appendChild(wrapper)
        document.body.appendChild(modal)
        setTimeout(() => {modal.style.opacity = 1},100)
    }

    const displayPurchases = () => {
	const purchaseData = getDailyPurchases().map(constructDailyPurchaseData)
	displayModal(contentDiv => {
	    contentDiv.style.display = "flex"
	    contentDiv.style.flexDirection = "column"

	    const copyText = document.createElement("div")
	    copyText.innerText = "テキストボックスをクリックするとデータがコピーされます"

	    const dataTextArea = document.createElement("textarea")
	    dataTextArea.value = JSON.stringify(purchaseData)
	    dataTextArea.style.width = "100%"
	    dataTextArea.style.flexGrow = "1"
	    dataTextArea.readOnly = true
	    dataTextArea.onclick = () => {
            copyTextAreaText(dataTextArea)
            copyText.innerText = "データがコピーされました"
	    }

	    contentDiv.appendChild(copyText)
	    contentDiv.appendChild(dataTextArea)
	})
    }

    const copyTextAreaText = textArea => {
        textArea.select()
        if (navigator.clipboard) navigator.clipboard.writeText(textArea.value)
        else document.execCommand("copy")
    }

    displayPurchases()
})()
