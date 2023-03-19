const foxhole = require('../../utils/FoxholeAPIUtils')
const dashboard = require('../../components/messages/LogiDashboard')
const GuildSetting = require('../../data/models/GuildSetting').data
const DashboardSetting = require('../../data/models/DashboardSetting').data
const StockpileUtils = require('../../utils/StockpileUtils')
const StockpileSheet = require('../../data/models/StockpileSheet').data

module.exports = {
	async execute(interaction) {
		//Defer the interaction
		if (interaction.isButton()) {
			interaction.deferUpdate()
		} else {
			interaction.deferReply({ephemeral: true})
		}

		//Get the interaction data
		let guildId = interaction.guildId

		//Obtain current war data
		try {
			let warData = await foxhole.getWarData()
			war = warData.warNumber
		} catch (error) {
			console.error('ERROR - RefreshHandler.js - Error obtaining current war data\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Get the latest stockpile sheet
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
			//Get dashboard settings
			dashboardSettings = await DashboardSetting.findOne({
				where: { guildId }
			})
			
			//Create settings if none exists
			if(dashboardSettings == null) {
				dashboardSettings = await DashboardSetting.create({guildId})
			}

			//Get guild settings
			guildSettings = await GuildSetting.findOne({
				where: { guildId }
			})
			
			//Create settings if none exists
			if(guildSettings == null) {
				guildSettings = await GuildSetting.create({guildId})
			}

			//TODO: Replace with guild settings instead of dashboard settings
			let tag = (guildSettings.tag != null) ? guildSettings.tag : "SAF"
			let iconId = (guildSettings.iconId != null) ? guildSettings.iconId : "<:SAF1:1024375368712466482>"
			let color = (dashboardSettings.color != null) ? dashboardSettings.color : 0xa7ba6c
			let timestamp = new Date(Date.now()).toISOString()
			let message = dashboard.write(tag, iconId, war, color, timestamp, data)

			if(interaction.isButton()) {
				return await interaction.editReply(message)
			} else {
				let channel = await interaction.guild.channels.fetch(dashboardSettings.dashboardChannelId)
				await channel.messages.edit(dashboardSettings.dashboardMessageId, message)
				return await interaction.editReply({content: 'Logistics dashboard has been refreshed successfully.', ephemeral: true})
			}
		} catch (error) {
			console.error('ERROR - RefreshHandler.js - Error sending reply to logi dashboard channel\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}