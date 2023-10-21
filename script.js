const container = document.getElementById('order-cards-container');
const tableContainer = document.getElementById('order-table-container');
const button = document.getElementById('button');

function getShippedData() {
    var request = new XMLHttpRequest();
    request.open("GET", "./shippedData.json", false);
    request.send(null)
    var shippingData = JSON.parse(request.responseText);
    console.log(shippingData);
    return shippingData;
}

function getOrders() {
    var request = new XMLHttpRequest();
    request.open("GET", "./sampleData.json", false);
    request.send(null);
    var orders = JSON.parse(request.responseText);
    console.log(orders);
    return orders
}

function returnCards(orders) {
    return "<div class='order-cards'>" + orders.map(orders =>
        `<div class='card'>
        <div class='card-header'>
            <h2>${orders.SORS}</h2>
        </div>
        <div class='content'>
            <div class='content-left'>
                <h4>Item No</h4>
                <p>${orders.Item}</p>
                <h4>Description</h4>
                <p>${orders.Description}</p>
                <h4>Colour</h4>
                <p>${orders.Colour}</p>
                <h4>Quantity</h4>
                <p>${orders.Quantity}</p>
            </div>
            <div class='content-right'>
                <h4>Address</h4>
                <p>${orders['Name']}</p>
                <p>${orders['Ship-to Address']}</p>
                <p>${orders['Ship-to Address 2']}</p>
                <p>${orders['Ship-to City']}</p>
                <p>${orders['Ship-to County']}</p>
                <p>${orders['Ship-to Post Code']}</p>
            </div>
        </div>
        <div class='button'>
        <button>Action</button>
        </div>
    </div>`).join('') + "</div>";
}

function returnTable(orders) {
    return "<div class='table-container'><table><tr><th>SORS Number</th><th>Item Number</th><th>Description</th><th>Colour</th><th>Quantity</th><th>Address</th><th>Action</th></tr>" + orders.map(orders =>
        `<tr>
            <td>${orders.SORS}</td>
            <td>${orders.Item}</td>
            <td>${orders.Description}</td>
            <td>${orders.Colour}</td>
            <td>${orders.Quantity}</td>
            <td>
                ${orders['Name']}
                ${orders['Ship-to Address']}
                ${orders['Ship-to Address 2']}
                ${orders['Ship-to City']}
                ${orders['Ship-to County']}
                ${orders['Ship-to Post Code']}
            </td>
            <td>
                <button>Action</button>
            </td>
        </tr>
        `).join('') + "</table></div>"
}


function displayTable(){
    container.style.display = 'none';
    tableContainer.style.display = '';
    tableContainer.innerHTML = returnTable(getOrders())
}

function displayCards(){
    tableContainer.style.display = 'none';
    container.style.display = '';
    container.innerHTML = returnCards(getOrders())

}
getShippedData();