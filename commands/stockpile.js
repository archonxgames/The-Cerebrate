const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stockpile')
		.setDescription('Stockpile related commands.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('init')
				.setDescription('Initialize a new stockpile sheet based on the current war.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('sheet')
				.setDescription('Get the stockpile google sheet link.')
				.addIntegerOption(option => 
					option
						.setName('war')
						.setDescription('The war iteration. Defaults to the current iteration of the war.')
						.setRequired(false)
				)),

	async execute(interaction) {
		switch(interaction.options.getSubcommand()) {
			case 'init':
				return await require('./stockpile/init').execute(interaction)
			case 'sheet':
				return await require('./stockpile/sheet').execute(interaction)
		}
	},
};