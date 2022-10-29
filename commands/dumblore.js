const { SlashCommandBuilder } = require('@discordjs/builders');
const Tag = require('../data/models/Tag').data

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dumblore')
		.setDescription('Tracks the number of times Dumblore got called Dumbledore.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('count')
				.setDescription('Shows the number of times Dumblore got called Dumbledore.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Increase the count by 1.')),
	async execute(interaction) {		
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

		var count = (tag) ? tag.count : 0

		switch(interaction.options.getSubcommand()) {
			case 'count':
				console.log('DUMBLEDORE COUNT: ' + count)
				await interaction.reply(`Dumblore has been called Dumbledore ${count} times since this command was made available.`)
				break
			case 'add':
				++count
				tag.increment('count')
				console.log('DUMBLEDORE COUNT: ' + count)
				await interaction.reply(`Dumblore has now been called Dumbledore ${count} times since this command was made available.`)
				break
		}
	},
}
