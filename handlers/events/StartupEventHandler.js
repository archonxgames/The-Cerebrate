const dashboards = require('../dashboards/DashboardRefreshHandler')

module.exports = {
	type: 'ready',
	once: true,
	execute(client) {
		console.log(`INFO - ${client.user.tag} is now online.`)
	}
}