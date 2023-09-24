const foxhole = require('../../utils/FoxholeAPIUtils')
const dashboard = require('../../components/dashboards/StockpileCodeDashboard')
const GuildSetting = require('../../data/models/GuildSetting').data
const StockpileUtils = require('../../utils/StockpileUtils')
const StockpileSheet = require('../../data/models/StockpileSheet').data

module.exports = {
	async refresh(dashboardSettings) {
		//Obtain current war data
		try {
			let warData = await foxhole.getWarData()
			var war = warData.warNumber
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error obtaining current war data\n', error)
			throw(error)
		}

		//Get the latest stockpile sheet
		try {
			const result = await StockpileSheet.findOne({
				where: { guildId, war }
			})

			if (result != null) {
				var sheetId = result.sheetId
			} else {
				return await interaction.reply({content: 'Cannot find a stockpile sheet for the current war. Please use the `/stockpile init` command to create a stockpile sheet.', ephemeral: true})
			}
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error retrieving google sheet id from database\n', error)
			throw(error)
		}

		//Get the logi dashboard data
		try {
			var data = await StockpileUtils.getLogiDashboardData(sheetId)
			console.log('INFO - LogiDashboardRefreshHandler.js - Retrieved data from stockpile sheet\n', data)
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error retrieving logi dashboard data from stockpile sheet\n', error)
			throw(error)
		}

		//Update Logi Dashboard message to channel
		try {
			//Get guild settings
			var guildSettings = await GuildSetting.findOne({
				where: { guildId }
			})
			
			//Create settings if none exists
			if(guildSettings == null) {
				guildSettings = await GuildSetting.create({guildId})
			}

			let tag = (guildSettings.tag != null) ? guildSettings.tag : "SAF"
			let iconId = (guildSettings.iconId != null) ? guildSettings.iconId : "<:SAF1:1024375368712466482>"
			let timestamp = new Date(Date.now()).toISOString()
			let message = dashboard.write(tag, iconId, war, timestamp, data)

			return {
				message: message,
				content: 'Stockpile code dashboard has been refreshed successfully.'
			}
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error sending reply to logi dashboard channel\n', error)
			throw(error)
		}
	}
}