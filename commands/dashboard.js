const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dashboard')
		.setDescription('Commands for the logistics dashboard.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('deploy')
				.setDescription('Deploy a dashboard.')
				.addStringOption(option =>
					option.setName('type')
						.setDescription('The type of dashboard to deploy.')
						.setRequired(true)
						.addChoices(
							{ name: 'logi-order', value: 'logiOrder' },
							{ name: 'stockpile-code', value: 'stockpileCode' }
				))
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('The channel to deploy the logistics dashboard to.')
						.setRequired(false)
		))
		.addSubcommand(subcommand =>
			subcommand
				.setName('refresh')
				.setDescription('Manually refreshes a dashboard.')
				.addChannelOption(option =>
					option.setName('message-id')
						.setDescription('The message ID of the dashboard to refresh.')
						.setRequired(false)
		)),
	async execute(interaction) {
		switch(interaction.options.getSubcommand()) {
			case 'deploy':
				return await require(`./dashboard/deploy`).execute(interaction)
			case 'refresh':
				return await require('./dashboard/refresh').execute(interaction)
		}
	},
};