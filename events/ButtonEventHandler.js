const LogiDashboardRefreshHandler = require('../handlers/dashboards/LogiDashboardRefreshHandler')

module.exports = {
	type: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return

		console.log(interaction)

		try {
			switch (interaction.customId) {
				case "logiDashboardRefresh":
					return await LogiDashboardRefreshHandler.execute(interaction)
				default:
					return
			}
		} catch(error) {
			console.log('ERROR - ButtonEventHandler.js - There was an error during modal submission',error)
		}
	}
}