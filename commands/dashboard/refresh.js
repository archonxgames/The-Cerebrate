const LogiDashboardRefreshHandler = require('../../handlers/dashboards/LogiDashboardRefreshHandler')

module.exports = {
	async execute(interaction) {
		try {
			await LogiDashboardRefreshHandler.execute(interaction)
		} catch (error) {
			console.error('ERROR - refresh.js - Error executing command\n', error)
		}
	}
}
