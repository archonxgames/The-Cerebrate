const DashboardRefreshHandler = require('../dashboards/DashboardRefreshHandler')
const Logger = require('../../utils/Logger')

module.exports = {
	type: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) return

		console.log(interaction)

		try {
			switch (interaction.customId) {
				case "logiDashboardRefresh":
				case "stockpileCodeDashboardRefresh":
					return await DashboardRefreshHandler.refresh(interaction)
				default:
					return
			}
		} catch(error) {
			Logger.error(`ButtonEventHandler.js`, 'execute', 'Error during button interaction handling', error)
		}
	}
}