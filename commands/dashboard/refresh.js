const RefreshHandler = require('../../handlers/dashboard/LogiDashboardRefreshHandler')

module.exports = {
	async execute(interaction) {
		//Defer the reply
		await interaction.deferReply({ ephemeral: true })

		try {
			//Get the interaction data
			let guildId = interaction.guildId

			//Refresh the dashboard
			await RefreshHandler.execute(interaction)
		} catch (error) {
			console.error('ERROR - refresh.js - Error executing command\n', error)
		}
	}
}
