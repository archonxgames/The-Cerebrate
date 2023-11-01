const { ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { ButtonStyle } = require('discord.js')

function calculateProgress(target, actual) {
	var _target = (typeof target == "string") ? parseInt(target) : target
	var _actual = (typeof actual == "string") ? parseInt(actual) : actual
	if (_target > 0) {
		var progress = Math.round((_actual / _target) * 100)
		return (progress > 100) ? 100 : progress
	}
	if (_actual > 0) {
		return 100
	}
	return 0
}

function renderTick(progress) {
	return (progress >= 100) ? "<:done:1169121523538350130>" : ""
}

function renderPriority(priority) {
	switch(priority.toUpperCase()) {
		case "HIGH":
			return '<:high:1169119691881578546>'
		case "MED":
			return '<:medium:1169119697195765860>'
		case "LOW":
			return '<:low:1169119687859241022>'
		default:
			return ''
	}
}

function renderProgressbar(progress) {
	if (progress == 0) return ""
	else if (progress < 13) return "<:redno:1167824383532867625>"
	else if (progress <= 25) return "<:redno:1167824383532867625><:redno:1167824383532867625>"
	else if (progress < 38) return "<:orangeno:1167824972081799320><:orangeno:1167824972081799320><:orangeno:1167824972081799320>"
	else if (progress <= 50) return "<:orangeno:1167824972081799320><:orangeno:1167824972081799320><:orangeno:1167824972081799320><:orangeno:1167824972081799320>"
	else if (progress < 63) return "<:yellowno:1167824377249804319><:yellowno:1167824377249804319><:yellowno:1167824377249804319><:yellowno:1167824377249804319><:yellowno:1167824377249804319>"
	else if (progress <= 75) return "<:yellowno:1167824377249804319><:yellowno:1167824377249804319><:yellowno:1167824377249804319><:yellowno:1167824377249804319><:yellowno:1167824377249804319><:yellowno:1167824377249804319>"
	else if (progress < 88) return "<:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307>"
	else return "<:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307><:greenno:1167824380588466307>"
}

function processData(data) {
	let organized = data[0].map((item, i) => {
		return {
			name: item,
			priority: data[1][i],
			target: data[2][i],
			actual: data[3][i],
			procure: data[4][i],
			mpf: data[5][i]
		}
	})

	//prune empty items
	organized = organized.filter((item) => {
		return item.name != ""
	})

	const processed = organized.map((item) => {
		console.log(item)
		let progress = calculateProgress(item.target, item.actual)
		return {
			"name": `${(progress >= 100) ? renderTick(progress) : renderPriority(item.priority)} ${item.name}`,
			"value": `
			> Target: **${item.target}**
			> Current Stock:** ${item.actual}**
			> For Procurement: **${item.procure}**
			> MPF Orders Left: **${item.mpf}**
			_ _
			**Progress:**
			${renderProgressbar(progress)} **${progress}%**
			_ _
			_ _`,
			"inline": true
		}
	})

	return processed
}


module.exports = {
	write(tag, iconId, warNo, color, lastUpdated, data) { 
		const button = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('logiDashboardRefresh')
					.setLabel('Refresh')
					.setStyle(ButtonStyle.Success)
			)
		let message = {
			"content": `# <[${iconId}]> **${tag} War ${warNo} Logistics Dashboard** <[${iconId}]>`,
			"embeds": [
				{
					"title": null,
					"color": color,
					"fields": processData(data),
					"footer": {
						"text": "Last Updated"
					},
					"timestamp": lastUpdated
				}
			],
			"components": [button],
			"attachments": []
		}
		return message
	}
}