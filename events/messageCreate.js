module.exports = {
	name: 'messageCreate',
	async execute(message) {
		console.log(message)
		//increase dumbledore count if a non-bot user says dumbledore
		if (!message.author.bot && message.content.toLowerCase().includes('dumbledore')) {
			const Tag = require('../data/models/tag').data
			const tag = await Tag.findOne({
				where: {
					tag: 'dumbledore'
				}
			})
	
			if (!tag) {
				console.log(`INFO - Tag 'dumbledore' does not exist. Creating new tag.`)
				await Tag.create({tag: "dumbledore", count: 0})
				console.log(`INFO - Tag 'dumbledore' created successfully.`)
			}
	
			var count = (tag) ? tag.count + 1 : 1
	
			await tag.increment('count')
			console.log('DUMBLEDORE COUNT: ' + count)
			message.channel.send({content: `Dumblore has now been called Dumbledore ${count} times since this command was made available.`, reply: { messageReference: message.id }})
		}
	}
}