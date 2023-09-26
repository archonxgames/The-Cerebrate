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
					code: (data[3][index] != null) ? data[3][index] : '--'
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
	let stockpileString = `${stockpiles[0].name}: ${(stockpiles[0].code == '--') ? 'Not Found' : `||${stockpiles[0].code}||`}\n\n`
	for(i = 1; i < stockpiles.length; i++) {
		stockpileString += `${stockpiles[i].name}: ${(stockpiles[i].code == '--') ? 'Not Found' : `||${stockpiles[i].code}||`}\n\n`
	}

	return stockpileString
}

function generateEmbeds(data, color, lastUpdated) {
	let regions = processData(data)
	let embeds = Array.from(regions, ([region, towns]) => (
    {
			title: `${region}\n_ _`,
			color: color,
			fields: Array.from(towns, ([town, stockpiles]) => ({
		    name: `${town}\n_ _`,
		    value: `${stringifyStockpiles(stockpiles)}_ _`
		})),
			"timestamp": lastUpdated
		}
	))

	return embeds
}

module.exports = {
	write(tag, iconId, warNo, color, lastUpdated, data) { 
		const button = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('stockpileCodeDashboardRefresh')
					.setLabel('Refresh')
					.setStyle(ButtonStyle.Success)
			)
		let message = {
			"content": `# ${iconId} **${tag} War ${warNo} Stockpile Codes** ${iconId}\n\nPlease **DO NOT SHARE** stockpile codes outside of the Regiment unless approved by an Officer.\n_ _`,
			"embeds": generateEmbeds(data, color, lastUpdated),
			"components": [button],
			"attachments": []
		}
		return message
	}
}