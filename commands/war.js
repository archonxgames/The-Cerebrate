const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('war')
		.setDescription('War-related commands.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('new')
				.setDescription('Sends a message to initiate a new war.')
				.addStringOption(option =>
					option.setName('banner')
						.setDescription('Link to the latest war banner.')
						.setRequired(true)
		)),

	async execute(interaction) {
		switch(interaction.options.getSubcommand()) {
			case 'new':
				return await require('./war/new').execute(interaction)
		}
	},
};