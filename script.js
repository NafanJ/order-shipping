const cardsContainer = document.getElementById('order-cards-container');
const tableContainer = document.getElementById('order-table-container');
const toggleSwitch = document.getElementById('toggle');

function getShippedData() {
    var request = new XMLHttpRequest();
    request.open("GET", "./shippedData.json", false);
    request.send(null)
    var shippingData = JSON.parse(request.responseText);
    return shippingData;
}

function getOrders() {
    var request = new XMLHttpRequest();
    request.open("GET", "./sampleData.json", false);
    request.send(null);
    var orders = JSON.parse(request.responseText);
    return orders
}

// Groups order by SORS number
function groupOrders() {
    const orders = getOrders();
    const groupedOrders = new Map();

    for (const order of orders) {
        const sors = order.SORS;

        if (!groupedOrders.has(sors)) {
            groupedOrders.set(sors, []);
        }

        groupedOrders.get(sors).push(order);
    }

    return groupedOrders;
}

// Iterate through orders and generate cards, inserts them into 'order-cards'
function getCards() {
    const orders = groupOrders();
    const cards = [];

    for (const [sors, sorsOrders] of orders) {
        const addressDetails = sorsOrders[0];
        const cardContent = `
            <div class='card'>
                <div class='card-header'>
                    <h2 id='sors-number'>${sors}</h2>
                </div>
                <div class='content-container'>
                    <div class='content'>
                        <div class='items'>
                            <h4>Item No</h4>
                            ${sorsOrders.map(order => `
                                <p>${order.Item}</p>`
        ).join('')}
                        </div>
                        <div class='descriptions'>
                            <h4>Description</h4>
                            ${sorsOrders.map(order => `
                                <p>${order.Description}</p>`
        ).join('')}
                        </div>
                        <div class='colours'>
                            ${sorsOrders[0].Colour ? '<h4>Colour</h4>' : ''}
                            ${sorsOrders.map(order => `
                                <p>${order.Colour}</p>`
        ).join('')}
                        </div>
                        <div class='quantities'>
                            <h4>Quantity</h4>
                            ${sorsOrders.map(order => `
                                <p>${order.Quantity}</p>`
        ).join('')}
                        </div>
                        <div class='address'>
                        <h4>Address</h4>
                        <p>${addressDetails['Name']}</p>
                        <p>${addressDetails['Ship-to Address']}</p>
                        <p>${addressDetails['Ship-to Address 2']}</p>
                        <p>${addressDetails['Ship-to City']}</p>
                        <p>${addressDetails['Ship-to County']}</p>
                        <p>${addressDetails['Ship-to Post Code']}</p>
                    </div>
                    </div>
                </div>
            </div>`;
        cards.push(cardContent);
    }
    return "<div class='order-cards'>" + cards.join('') + "</div>"
}

// Iterate through orders and generate table, inserts them into 'table-container'
function getTable() {
    const orders = groupOrders();
    const tableRows = [];

    for (const [sors, sorsOrders] of orders) {
        const addressDetails = sorsOrders[0];
        const rowContent = `
            <tr>
                <td id='sorsNumber'>${sors}</td>
                <td>${sorsOrders.map(order => order.Item).join('<br>')}</td>
                <td>${sorsOrders.map(order => order.Description).join('<br>')}</td>
                <td>${sorsOrders.map(order => order.Colour).join('<br>')}</td>
                <td>${sorsOrders.map(order => order.Quantity).join('<br>')}</td>
                <td>
                    ${addressDetails['Name']}<br>
                    ${addressDetails['Ship-to Address']}<br>
                    ${addressDetails['Ship-to Address 2'] ? addressDetails['Ship-to Address 2'] + '<br>' : ''}
                    ${addressDetails['Ship-to City']}<br>
                    ${addressDetails['Ship-to County']}<br>
                    ${addressDetails['Ship-to Post Code']}
                </td>
                <td>
                    <button id='tableActionButton' onclick="buttonClick()">Action</button>
                </td>
            </tr>
        `;
        tableRows.push(rowContent);
    }
    return "<div class='table-container'><table><tr><th>SORS Number</th><th>Item Number</th><th>Description</th><th>Colour</th><th>Quantity</th><th>Address</th><th>Action</th></tr>" + tableRows.join('') + "</table></div>";
}

function setButton(viewType) {
    if (viewType) {
        // Add button to Card
        const div = document.createElement('div');
        div.className = 'action-button';
        const button = document.createElement('button')
        button.id = 'button'
        button.className = 'buttonClass'
        button.textContent = 'Action' // determine value
        button.onclick = buttonClick(viewType)
        div.appendChild(button)
        cardSelector = document.querySelectorAll('.content-container')
        cardSelector.forEach(cardSelector => {
            const newNode = div.cloneNode(true);
            cardSelector.appendChild(newNode);
        })
        setCardButtonStyle()
    } else {
        setTableButtonStyle();
    }
}

function setCardButtonStyle() {
    const sorsNumbers = document.querySelectorAll('#sors-number')
    const buttons = document.querySelectorAll('#button')

    shippedData = getShippedData()
    shippedData.forEach(shippedData => {
        for (let i = 0; i < sorsNumbers.length; i++) {
            const sorsNumber = sorsNumbers[i].innerText
            if (shippedData['processed'] == 1){
                if (shippedData['document_No'] == sorsNumber) {
                    buttons[i].innerText = "Cancel"
                    currentCard = buttons[i].parentElement.parentElement.parentElement
                    /* Remove card and move to end */
                    currentCard.remove()
                    cardList = document.querySelector(".order-cards")
                    cardList.appendChild(currentCard)
                    /* Dim Card */
                    buttons[i].parentElement.parentElement.parentElement.style.backgroundColor = "rgba(8, 77, 61, .5)";
                } 
            } else {
                buttons[i].innerText = "Ship"
            }
        }
    })
}

function setTableButtonStyle() {
    const sorsNumbersTable = document.querySelectorAll("#sorsNumber")
    const tableButtons = document.querySelectorAll("#tableActionButton")

    shippedData = getShippedData()
    shippedData.forEach(shippedData => {
        for (let i = 0; i < sorsNumbersTable.length; i++) {
            const sorsNumbers = sorsNumbersTable[i].innerText
            if (shippedData['processed'] == 1){
                if (shippedData['document_No'] == sorsNumbers) {
                tableButtons[i].innerText = "Cancel"
                tableRow = tableButtons[i].parentElement.parentElement
                tableRow.style.backgroundColor = "rgba(8, 77, 61, .5)";
                } 
            } else {
                tableButtons[i].innerText = "Ship"
            }
        }
    })
}

// Adds to HTML container "order-cards-container"
function displayCards() {
    // Set table view styling to none
    tableContainer.style.display = 'none';

    cardsContainer.style.display = '';
    cardsContainer.innerHTML = getCards()

    // True for Card View
    setButton(true);
}

function displayTable() {
    // Set card view styling to none
    cardsContainer.style.display = 'none';

    tableContainer.style.display = '';
    tableContainer.innerHTML = getTable()

    // False for Table View
    setButton(false);
}

// Event listener for View Type Toggle
toggleSwitch.addEventListener("change", function () {
    if (this.checked) {
        displayTable();
    } else {
        displayCards();
    }
});

// DO WHAT YA WANT HERE
function buttonClick(bool) {
    if (bool) {
        //Shipped
    } else {
        //Cancel
    }
}

displayCards();