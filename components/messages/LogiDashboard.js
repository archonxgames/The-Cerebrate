const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders')
const { ButtonStyle } = require('discord.js')

function calculateProgress(target, predicted, actual) {
	var _target = (typeof target == "string") ? parseInt(target) : target
	var _predicted = (typeof predicted == "string") ? parseInt(predicted) : predicted
	var _actual = (typeof actual == "string") ? parseInt(actual) : actual
	if (_target > 0) {
		var progress = Math.round((((_actual > _predicted) ? _actual : _predicted) / _target) * 100)
		return (progress > 100) ? 100 : progress
	}
	if (_actual > 0 || _predicted > 0) {
		return 100
	}
	return 0
}

function processData(data) {
	let organized = data[0].map((item, i) => {
		return {
				name: item,
				priority: data[1][i],
				target: data[2][i],
				predicted: data[3][i],
				actual: data[4][i],
				procure: data[5][i]
		}
	})

	//prune empty items
	organized = organized.filter((item) => {
		return item.name != ""
	})

	const processed = organized.map((item) => {
		let progress = calculateProgress(item.target, item.predicted, item.actual)
		return {
			"name": `${item.name} | ${(progress >= 100) ? renderTick(progress) : `${item.priority}`}`,
			"value": `> Target: **${item.target}**
			> Predicted Stock: **${item.predicted}**
			> Actual Stock:** ${item.actual}**
			> For Procurement: **${item.procure}**
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

function renderTick(progress) {
	return (progress >= 100) ? "<a:greentick:1015609031617949728>" : ""
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