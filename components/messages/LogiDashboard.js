function calculateProgress(target, predicted, actual) {
	return Math.round(((actual > predicted) ? actual : predicted) / target)
}

function processData(data) {
	let processed = data[0].map((item, i) => {
		return {
				name: item,
				priority: data[1][i],
				target: data[2][i],
				predicted: data[3][i],
				actual: data[4][i],
				procure: data[5][i]
		}
	})

	processed.map((item) => {
		let progress = calculateProgress(item.target, item.predicted, item.actual)
		return {
			"name": `${item.name} ${renderTick(item.progress)}`,
			"value": `> Target: **${item.target}**\n
			> Predicted Stock: **${item.predicted}**\n
			> Actual Stock:** ${item.actual}**\n
			> For Procurement: **${item.procure}**\n
			_ _\n
			**Progress:**\n
			${renderProgressbar(progress)} **${progress}%**\n
			_ _\n
			_ _`,
			"inline": true
		}
	})
}

function renderTick(progress) {
	return (progress >= 100) ? " <a:greentick:1015609031617949728>" : ""
}

function renderProgressbar(progress) {
	if (progress < 13) return "<:redno:1056155122952048640>"
	else if (progress <= 25) return "<:redno:1056155122952048640><:redno:1056155122952048640>"
	else if (progress < 38) return "<:orangeno:1056154082890485770><:orangeno:1056154082890485770><:orangeno:1056154082890485770>"
	else if (progress <= 50) return "<:orangeno:1056154082890485770><:orangeno:1056154082890485770><:orangeno:1056154082890485770><:orangeno:1056154082890485770>"
	else if (progress < 63) return "<:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966>"
	else if (progress <= 75) return "<:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966><:yellowno:1056154087911079966>"
	else if (progress < 88) return "<:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287>"
	else return "<:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287><:limeno:1056154079337906287>"
}

module.exports = {
	write(tag = "SAF", iconId = "<:SAF1:1024375368712466482>", warNo, color = "5814783", lastUpdated, data) { return {
		"content": null,
		"embeds": [
			{
				"title": `${iconId} **${tag} War ${warNo} Logistics Dashboard** ${iconId}`,
				"color": `${color}`,
				"fields": processData(data),
				"footer": {
					"text": "Last Updated"
				},
				"timestamp": `${lastUpdated}`
			}
		],
		"attachments": []
	}}
}