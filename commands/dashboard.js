const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dashboard')
		.setDescription('Commands for the logistics dashboard.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('deploy')
				.setDescription('Deploy a logistics dashboard.')
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The channel to deploy the logistics dashboard to.')
						.setRequired(false)
					))
		.addSubcommand(subcommand =>
			subcommand
				.setName('refresh')
				.setDescription('Manually refreshes the logistics dashboard.')
				),
	async execute(interaction) {
		switch(interaction.options.getSubcommand()) {
			case 'deploy':
				return await require('./dashboard/deploy').execute(interaction)
			case 'refresh':
				return await require('./dashboard/refresh').execute(interaction)
		}
	},
};