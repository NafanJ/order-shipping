<!DOCTYPE html>
<html>
<head>
    <title>KML Sample Manager for AEL</title>
	<link rel="icon" type="image/x-icon" href="favicon.ico">
	<link rel="stylesheet" type="text/css" href="style.css">
</head>

<?php
	if(isset($_GET['ship']))
	{
		//Shipment logic [removed]
		header('Location: ?');
	}
	else if(isset($_GET['cancel']))
	{
		//Cancel shipment logic [removed]
		header('Location: ?');
	}
	
	// Main page
	else
	{
		echo '<div id ="container"><h1>Customer Orders</h1>';
		echo '<table id="mainTable">';
		echo '<thead>
		<th>KML Ref</th>
		<th>Item No</th>
		<th>Description</th>
		<th>Colour</th>
		<th>Quantity</th>
		<th>Address</th>
		<th>Action</th>
		</thead>';
		echo '
		<tbody 
		id="sample_list">
		</tbody>';
		echo '</table>';
		echo '</div>';
	}
?>

<script>
	// Main data update function
	async function update()
	{
		// Grab the fresh NAV data
		const samData = await fetch('testSamples.php').then(response => response.json());
		
		// Grab the existing shipment data
		const shipData = await fetch('testShipped.php').then(response => response.json());

		// Get a reference to the table, clear it out
		let samTable = document.getElementById('sample_list');
		samTable.innerHTML = ''
		
		// For each sample we receive...
		for (let i = 0; i < samData.length; i++)
		{
			// Parse data
			const samNo = samData[i]['SORS'];
			const samItem = samData[i]['Item'];
			const samDesc = samData[i]['Description'];
			const samColour = samData[i]['Colour'];
			const samQty = parseFloat(samData[i]['Quantity']);
			let samAddress = samData[i]['Name'] + ', ' + samData[i]['Ship-to Address'];
			if (samData[i]['Ship-to Address 2'] != '') samAddress += ', ' + samData[i]['Ship-to Address 2'];
			if (samData[i]['Ship-to City'] != '') samAddress += ', ' + samData[i]['Ship-to City'];
			if (samData[i]['Ship-to County'] != '') samAddress += ', ' + samData[i]['Ship-to County'];
			if (samData[i]['Ship-to Post Code'] != '') samAddress += ', ' + samData[i]['Ship-to Post Code'];

			// Add rows to the DOM table
			let row = samTable.insertRow(-1);
			row.insertCell(0).innerText = samNo;
			row.insertCell(1).innerText = samItem;
			row.insertCell(2).innerText = samDesc;
			row.insertCell(3).innerText = samColour;
			let qtyCell = row.insertCell(4);
			qtyCell.innerText = samQty;
			qtyCell.style.textAlign = "center";
			row.insertCell(5).innerText = samAddress;
			
			//Figure out the correct action based on the existiance of a ship line
			let actions = row.insertCell(6);
			let result = shipData.find(x => x.document_No == samNo);
			if(result)
			{
				if(result.processed) actions.innerText = '-';
				else
				{
					let aTag = document.createElement('a');
					aTag.setAttribute('href',"?cancel=" + samNo);
					aTag.innerHTML = 'Cancel';
					actions.appendChild(aTag);
				}
			}
			else
			{
				let aTag = document.createElement('a');
				aTag.setAttribute('href',"?ship=" + samNo);
				aTag.innerHTML = 'Ship';
				actions.appendChild(aTag);
			}
		}
	}
	
	
	//Finally, run the update
	update();
</script>

</html>
