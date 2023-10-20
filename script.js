const container = document.getElementById('order-cards-container');
const button = document.getElementById('button');

function getShippedData(){
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

container.innerHTML = returnCards(getOrders())
getShippedData();