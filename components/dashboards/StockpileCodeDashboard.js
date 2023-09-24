const { ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { ButtonStyle } = require('discord.js')

function processData(data) {
	let stockpiles = new Map()
	//Iterate over the stockpile names
	data[2].forEach((stockpile, index) => {
		//skip over unused or empty cells
		if (stockpile != "--" && stockpile != "") {
			let region = data[0][index]
			let town = data[1][index]
			let value = stockpiles.get(region)
			let append = {
					name: stockpile,
					code: data[3][index]
			}
			if (value === undefined) {
					let towns = new Map()
					towns.set(town,[append])
					stockpiles.set(region,towns)
			} else {
					stockpiles.set(region, (value.get(town) === undefined)
							? value.set(town,[append])
							: value.set(town, value.get(town).concat(append)))
			}
		}
	})

	return stockpiles
}

function stringifyStockpiles(stockpiles) {
	let stockpileString = `${stockpiles[0].name}: ||${stockpiles[0].code}||`
	for(i = 1; i < stockpiles.length(); i++) {
		stockpileString += `${stockpiles[i].name}: ||${stockpiles[i].code}||`
	}

	return stockpileString
}

function generateEmbeds(data, lastUpdated) {
	let regions = processData(data)
	let embeds = Array.from(regions, ([region, towns]) => (
    {
			title: region,
			color: "6585891",
			fields: Array.from(towns, ([town, stockpiles]) => ({
		    name: town,
		    value: stringifyStockpiles(stockpiles)
		})),
			"timestamp": lastUpdated
		}
	))

	return embeds
}

module.exports = {
	write(tag, iconId, warNo, lastUpdated, data) { 
		const button = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('stockpileCodeDashboardRefresh')
					.setLabel('Refresh')
					.setStyle(ButtonStyle.Primary)
			)
		let message = {
			"content": `${iconId} **${tag} War ${warNo} Stockpile Codes** ${iconId}`,
			"embeds": generateEmbeds(data, lastUpdated),
			"components": [button],
			"attachments": []
		}
		return message
	}
}