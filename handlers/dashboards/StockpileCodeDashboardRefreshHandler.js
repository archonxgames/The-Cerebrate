const foxhole = require('../../utils/FoxholeAPIUtils')
const dashboard = require('../../components/dashboards/StockpileCodeDashboard')
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
			Logger.error('StockpileCodeDashboardRefreshHandler.js','refresh','Error obtaining current war data', error)
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
			} else if (interaction != undefined) {
				return await interaction.reply({content: 'Cannot find a stockpile sheet for the current war. Please use the `/stockpile init` command to create a stockpile sheet.', ephemeral: true})
			} else {
				Logger.INFO('StockpileCodeDashboardRefreshHandler.js','refresh','Cannot find a stockpile sheet for the current war. Skipping.', error)
			}
		} catch (error) {
			Logger.error('StockpileCodeDashboardRefreshHandler.js','refresh','Error retrieving google sheet id from database', error)
			throw(error)
		}

		//Get the logi dashboard data
		try {
			var data = await StockpileUtils.getStockpileCodes(sheetId)
			console.log('INFO - StockpileCodeDashboardRefreshHandler.js - Retrieved data from stockpile sheet\n', data)
		} catch (error) {
			Logger.error('StockpileCodeDashboardRefreshHandler.js','refresh','Error retrieving logi dashboard data from stockpile sheet', error)
			throw(error)
		}

		//Update Stockpile Code Dashboard message to channel
		try {
			//Get guild settings
			var guildSettings = await GuildSetting.findOne({
				where: { guildId }
			})
			
			//Create settings if none exists
			if(guildSettings == null) {
				guildSettings = await GuildSetting.create({guildId})
			}

			let tag = (guildSettings.tag != null) ? guildSettings.tag : 'SAF'
			let iconId = (guildSettings.iconId != null) ? guildSettings.iconId : '<:SAF1:1024375368712466482>'
			let color = 0xa7ba6c
			let timestamp = new Date(Date.now()).toISOString()
			let message = dashboard.write(tag, iconId, war, color, timestamp, data)

			return {
				message: message,
				content: 'Stockpile code dashboard has been refreshed successfully.'
			}
		} catch (error) {
			Logger.error('StockpileCodeDashboardRefreshHandler.js','refresh','Error sending reply to logi dashboard channel', error)
			throw(error)
		}
	}
}