const { PermissionFlagsBits } = require('discord.js')

module.exports = {
	async execute(interaction) {
		//Do a permission check
		if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
			return await interaction.reply({ content: 'Sorry, you do not have the required permissions to use this feature. If you think this is a mistake, please contact your server administrator.', ephemeral: true})
		}
		
		//Defer the reply
		await interaction.deferReply({ ephemeral: true })

		//Get the interaction data
		let type = interaction.options.getString('type')

		//Execute the deployment based on the dashboard type
		return require(`./deploy/${type}`).execute(interaction)
	}
}
