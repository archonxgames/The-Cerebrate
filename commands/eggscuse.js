const { SlashCommandBuilder } = require('@discordjs/builders');
const Tag = require('../data/models/Tag').data

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eggscuse')
		.setDescription('Tracks the number of times <@220441746201378816> made an excuse to not join ingame.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('count')
				.setDescription('Shows the number of excuses Egg McNoggins has made.')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Increase the count by 1.')
		),
	async execute(interaction) {		
		const tag = await Tag.findOne({
			where: {
				tag: 'eggscuse'
			}
		})

		if (!tag) {
			console.log(`INFO - Tag 'eggscuse' does not exist. Creating new tag.`)
			await Tag.create({tag: "eggscuse", count: 0})
			console.log(`INFO - Tag 'eggscuse' created successfully.`)
		}

		var count = (tag) ? tag.count : 0

		switch(interaction.options.getSubcommand()) {
			case 'count':
				console.log('EGGSCUSE COUNT: ' + count)
				await interaction.reply({content: `<@220441746201378816> has made an excuse not to join the game ${count} times since this command was made available.`})
				break
			case 'add':
				++count
				tag.increment('count')
				console.log('EGGSCUSE COUNT: ' + count)
				await interaction.reply({content: `<@220441746201378816> has made an excuse not to join the game ${count} times since this command was made available.`})
				break
		}
	},
}
