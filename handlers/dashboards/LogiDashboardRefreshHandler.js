const foxhole = require('../../utils/FoxholeAPIUtils')
const dashboard = require('../../components/dashboards/LogiDashboard')
const GuildSetting = require('../../data/models/GuildSetting').data
const StockpileUtils = require('../../utils/StockpileUtils')
const Logger = require('../../utils/Logger')
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
			var guildId = dashboardSettings.guildId
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
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Get the logi dashboard data
		try {
			var data = await StockpileUtils.getLogiDashboardData(sheetId)
			console.log('INFO - LogiDashboardRefreshHandler.js - Retrieved data from stockpile sheet\n', data)
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error retrieving logi dashboard data from stockpile sheet\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
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
			// let color = (dashboardSettings.color != null) ? dashboardSettings.color : 0xa7ba6c
			let color = 0xa7ba6c
			let timestamp = new Date(Date.now()).toISOString()
			let message = dashboard.write(tag, iconId, war, color, timestamp, data)

			Logger.info('LogiDashboardRefreshHandler.js','refresh','Forwarding updated dashboard to interaction')
			return {
				message: message,
				content: 'Logi dashboard has been refreshed successfully.'
			}
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error sending reply to logi dashboard channel\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}