const LogiDashboardRefreshHandler = require('../../handlers/dashboards/LogiDashboardRefreshHandler')

module.exports = {
	async execute(interaction) {
		//Defer the reply
		await interaction.deferReply({ ephemeral: true })

		try {
			//Refresh the dashboard
			await LogiDashboardRefreshHandler.execute(interaction)
		} catch (error) {
			console.error('ERROR - refresh.js - Error executing command\n', error)
		}
	}
}
