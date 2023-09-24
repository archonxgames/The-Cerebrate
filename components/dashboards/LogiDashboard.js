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
	return (progress >= 100) ? "<a:greentick:1015609031617949728>" : ""
}

function renderPriority(priority) {
	switch(priority.toUpperCase()) {
		case "HIGH":
			return '<:PRIOHIGH:1061897931558486076>'
		case "MED":
			return '<:PRIOMED:1061897963191943229>'
		case "LOW":
			return '<:PRIOLOW:1061897988429066322>'
	}
}

function renderProgressbar(progress) {
	if (progress == 0) return ""
	else if (progress < 13) return "<:redno:1056155122952048640>"
	else if (progress <= 25) return "<:redno:1056155122952048640><:redno:1056155122952048640>"
	else if (progress < 38) return "<:orangeno:1056154082890485770><:orangeno:1056154082890485770><:orangeno:1056154082890485770>"
	else if (progress <= 50) return "<:orangeno:1056154082890485770><:orangeno:1056154082890485770><:orangeno:1056154082890485770><:orangeno:1056154082890485770>"
	else if (progress < 63) return "<:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966>"
	else if (progress <= 75) return "<:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966>"
	else if (progress < 88) return "<:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287>"
	else return "<:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287>"
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
					.setStyle(ButtonStyle.Primary)
			)
		let message = {
			"content": null,
			"embeds": [
				{
					"title": `${iconId} **${tag} War ${warNo} Logistics Dashboard** ${iconId}`,
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