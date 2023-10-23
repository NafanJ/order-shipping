const container = document.getElementById('order-cards-container');
const tableContainer = document.getElementById('order-table-container');
const toggleSwitch = document.getElementById("toggle");

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

function returnCards() {
    const orders = groupOrders(); // Assuming groupOrders() retrieves and groups your orders data
    const cards = [];

    for (const [sors, sorsOrders] of orders) {
        const addressDetails = sorsOrders[0]; // Assuming address is the same for all orders with the same SORS
        const cardContent = `
            <div class='card'>
                <div class='card-header'>
                    <h2>${sors}</h2>
                </div>
                <div class='content'>
                    ${sorsOrders.map(order =>
                        `<div class='content-row'>
                            <h4>Item No</h4>
                            <p>${order.Item}</p>
                            <h4>Description</h4>
                            <p>${order.Description}</p>
                            <h4>Colour</h4>
                            <p>${order.Colour}</p>
                            <h4>Quantity</h4>
                            <p>${order.Quantity}</p>
                        </div>`
                    ).join('')}
                    <div class='content-row'>
                        <h4>Address</h4>
                        <p>${addressDetails['Name']}</p>
                        <p>${addressDetails['Ship-to Address']}</p>
                        <p>${addressDetails['Ship-to Address 2']}</p>
                        <p>${addressDetails['Ship-to City']}</p>
                        <p>${addressDetails['Ship-to County']}</p>
                        <p>${addressDetails['Ship-to Post Code']}</p>
                    </div>
                </div>
                <div class='action-button'>
                    <button>Action</button>
                </div>
            </div>`;

        cards.push(cardContent);
    }

    return "<div class='order-cards'>" + cards.join('') + "</div>";
}

function returnTable() {
    const orders = groupOrders(); // Assuming groupOrders() retrieves and groups your orders data
    const tableRows = [];

    for (const [sors, sorsOrders] of orders) {
        const addressDetails = sorsOrders[0]; // Assuming address is the same for all orders with the same SORS
        const rowContent = `
            <tr>
                <td>${sors}</td>
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
                    <button>Action</button>
                </td>
            </tr>
        `;

        tableRows.push(rowContent);
    }

    return "<div class='table-container'><table><tr><th>SORS Number</th><th>Item Number</th><th>Description</th><th>Colour</th><th>Quantity</th><th>Address</th><th>Action</th></tr>" + tableRows.join('') + "</table></div>";
}

function displayCards() {
    tableContainer.style.display = 'none';
    container.style.display = '';
    container.innerHTML = returnCards(getOrders())

}

function displayTable() {
    container.style.display = 'none';
    tableContainer.style.display = '';
    tableContainer.innerHTML = returnTable(getOrders())
}

toggleSwitch.addEventListener("change", function () {
    if (this.checked) {
        // Execute when the switch is turned on
        displayTable();
    } else {
        // Execute when the switch is turned off
        displayCards();
    }
});

displayCards();