const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('regiment')
		.setDescription('Regiment related commands.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('name')
				.setDescription("Return or change the regiment name for this server.")
				.addStringOption(option => 
					option
						.setName('name')
						.setDescription('The name of the regiment.')
						.setRequired(false)
		))
		.addSubcommand(subcommand =>
			subcommand
				.setName('tag')
				.setDescription("Return or change the regiment tag for this server.")
				.addStringOption(option => 
					option
						.setName('tag')
						.setDescription('The regiment tag.')
						.setRequired(false)
		))
		.addSubcommand(subcommand =>
			subcommand
				.setName('icon')
				.setDescription("Return or change the icon of the regiment.")
				.addStringOption(option => 
					option
						.setName('icon-id')
						.setDescription('The Discord Id of the icon.')
						.setRequired(false)
		)),

	async execute(interaction) {
		switch(interaction.options.getSubcommand()) {
			case 'name':
				return await require('./regiment/name').execute(interaction)
			case 'tag':
				return await require('./regiment/tag').execute(interaction)
			case 'icon':
				return await require('./regiment/icon').execute(interaction)
		}
	},
};