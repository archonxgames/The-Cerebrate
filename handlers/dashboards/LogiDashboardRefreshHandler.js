const foxhole = require('../../utils/FoxholeAPIUtils')
const dashboard = require('../../components/messages/LogiDashboard')
const DashboardSetting = require('../../data/models/DashboardSetting').data
const StockpileUtils = require('../../utils/StockpileUtils')
const StockpileSheet = require('../../data/models/StockpileSheet').data

module.exports = {
	async execute(interaction, war, sheetId, dashboardSettings) {
		//Defer the interaction
		if (interaction.isButton()) {
			interaction.deferUpdate()
		}

		//Get the interaction data
		let guildId = interaction.guildId

		//Obtain current war data if war parameter is null
		if(war == null) {
			try {
				let warData = await foxhole.getWarData()
				war = warData.warNumber
			} catch (error) {
				console.error('ERROR - RefreshHandler.js - Error obtaining current war data\n', error)
				return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
			}
		}

		//Get the latest stockpile sheet if sheetId is null
		if(sheetId == null) {
			try {
				const result = await StockpileSheet.findOne({
					where: { guildId, war }
				})
	
				if (result != null) {
					sheetId = result.sheetId
				} else {
					return await interaction.reply({content: 'Cannot find a stockpile sheet for the current war. Please use the `/stockpile init` command to create a stockpile sheet.', ephemeral: true})
				}
			} catch (error) {
				console.error('ERROR - RefreshHandler.js - Error retrieving google sheet id from database\n', error)
				return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
			}
		}

		//Get the logi dashboard data
		try {
			var data = await StockpileUtils.getLogiDashboardData(sheetId)
			console.log('INFO - RefreshHandler.js - Retrieved data from stockpile sheet\n', data)
		} catch (error) {
			console.error('ERROR - RefreshHandler.js - Error retrieving logi dashboard data from stockpile sheet\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Update Logi Dashboard message to channel
		try {
			//Get dashboard settings if no parameter is passed
			if(dashboardSettings == null) {
				dashboardSettings = await DashboardSetting.findOne({
					where: { guildId }
				})
				
				//Create settings if none exists
				if(dashboardSettings == null) {
					dashboardSettings = await DashboardSetting.create({guildId})
				}
			}
			
			//TODO: Replace with guild settings instead of dashboard settings
			let tag = (dashboardSettings.tag != null) ? dashboardSettings.tag : "SAF"
			let iconId = (dashboardSettings.iconId != null) ? dashboardSettings.iconId : "<:SAF1:1024375368712466482>"
			let color = (dashboardSettings.color != null) ? dashboardSettings.color : "5814783"
			let timestamp = new Date(Date.now()).toISOString()
			let message = dashboard.write(tag, iconId, war, color, timestamp, data)

			if(interaction.isButton()) {
				return await interaction.editReply(message)
			} else {
				let channel = await interaction.guild.channels.fetch(dashboardSettings.dashboardChannelId)
				await channel.messages.edit(dashboardSettings.dashboardMessageId, message)
				return await interaction.reply({content: 'Logistics dashboard has been refreshed successfully.', ephemeral: true})
			}
		} catch (error) {
			console.error('ERROR - RefreshHandler.js - Error sending reply to logi dashboard channel\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}