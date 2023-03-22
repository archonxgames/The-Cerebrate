const LogiDashboardRefreshHandler = require('../handlers/dashboards/LogiDashboardRefreshHandler')

module.exports = {
	type: 'ready',
	once: true,
	execute(client) {
		console.log(`INFO - ${client.user.tag} is now online.`);

		setInterval(() => {
			console.log(`INFO - Running interval commands`)
			LogiDashboardRefreshHandler.executeInterval(client)
		}, 900000)
	}
};