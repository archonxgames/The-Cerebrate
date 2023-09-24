const dashboard = require('../../handlers/dashboards/DashboardRefreshHandler')

module.exports = {
	async execute(interaction) {
		try {
			await dashboard.refresh(interaction, 'logiOrder')
		} catch (error) {
			console.error('ERROR - refresh.js - Error executing command\n', error)
		}
	}
}
