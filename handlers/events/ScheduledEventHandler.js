const WarStateWatcher = require('../../watchers/foxhole/WarStateListener')
const dashboards = require('../dashboards/DashboardRefreshHandler')

module.exports = {
	type: 'ready',
	once: true,
	execute(client) {
		setInterval(() => {
			console.log(`INFO - Running interval commands`)
			//Dashboard refresh
			dashboards.refreshAll(client)
			
		}, 900000)
	}
}